import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { sendBookingConfirmation, sendCardExpiringSoon } from "@/lib/email"

/**
 * POST /api/bookings/use-card
 * Book a session using an active course card (no payment needed).
 */
export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Connectez-vous pour réserver." }, { status: 401 })
  }

  const userId = session.user.id

  try {
    const { sessionId } = (await req.json()) as { sessionId: string }
    if (!sessionId) {
      return NextResponse.json({ error: "Session requise" }, { status: 400 })
    }

    // Find active course card
    const card = await prisma.courseCard.findFirst({
      where: {
        userId,
        remainingSessions: { gt: 0 },
        expiresAt: { gte: new Date() },
      },
      orderBy: { expiresAt: "asc" }, // Use the one expiring soonest
    })

    if (!card) {
      return NextResponse.json({ error: "Aucune carte active" }, { status: 400 })
    }

    // Check session exists and has spots
    const courseSession = await prisma.session.findUnique({
      where: { id: sessionId },
      include: {
        courseType: { select: { name: true } },
        instructor: { include: { user: { select: { name: true } } } },
      },
    })

    if (!courseSession) {
      return NextResponse.json({ error: "Séance introuvable" }, { status: 404 })
    }

    // Check not already booked
    const existing = await prisma.booking.findFirst({
      where: {
        userId,
        sessionId,
        status: { not: "CANCELLED" },
      },
    })

    if (existing) {
      return NextResponse.json({ error: "Vous êtes déjà inscrit à cette séance." }, { status: 409 })
    }

    const isFull = courseSession.currentParticipants >= courseSession.maxParticipants

    // Create booking + decrement card in transaction
    await prisma.$transaction([
      prisma.booking.create({
        data: {
          userId,
          sessionId,
          status: isFull ? "WAITLIST" : "CONFIRMED",
          paymentMethod: "CARD",
          paymentStatus: "PAID",
        },
      }),
      prisma.courseCard.update({
        where: { id: card.id },
        data: { remainingSessions: { decrement: 1 } },
      }),
      ...(isFull
        ? []
        : [
            prisma.session.update({
              where: { id: sessionId },
              data: { currentParticipants: { increment: 1 } },
            }),
          ]),
    ])

    // Send confirmation email (non-blocking)
    if (!isFull && session.user.email) {
      sendBookingConfirmation({
        to: session.user.email,
        courseName: courseSession.courseType.name,
        date: courseSession.date.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" }),
        time: courseSession.startTime,
        instructor: courseSession.instructor?.user?.name || "L'équipe",
      }).catch(() => {})
    }

    // Warn if card is running low (2 or fewer sessions remaining after decrement)
    const newRemaining = card.remainingSessions - 1
    if (newRemaining <= 2 && newRemaining >= 0 && session.user.email) {
      sendCardExpiringSoon({
        to: session.user.email,
        name: session.user.name || "Cher(e) client(e)",
        remaining: newRemaining,
        expiresAt: card.expiresAt.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }),
      }).catch(() => {})
    }

    // If waitlisted, compute position in the queue
    let waitlistPosition: number | undefined
    if (isFull) {
      waitlistPosition = await prisma.booking.count({
        where: { sessionId, status: "WAITLIST" },
      })
    }

    return NextResponse.json({
      ok: true,
      status: isFull ? "WAITLIST" : "CONFIRMED",
      cardRemaining: card.remainingSessions - 1,
      ...(waitlistPosition !== undefined && { waitlistPosition }),
    })
  } catch (err) {
    console.error("[bookings/use-card]", err)
    return NextResponse.json({ error: "Erreur lors de la réservation" }, { status: 500 })
  }
}
