import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { sendWaitlistPromotion } from "@/lib/email"

// Cancel a booking
export async function DELETE(request: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  const userId = session.user.id

  try {
    const { searchParams } = new URL(request.url)
    const bookingId = searchParams.get("id")

    // Parse optional cancellation reason from body
    let reason: string | undefined
    try {
      const body = await request.json()
      if (body?.reason && typeof body.reason === "string") {
        reason = body.reason
      }
    } catch {
      // No body or invalid JSON — reason is optional
    }

    if (!bookingId) {
      return NextResponse.json({ error: "ID de réservation requis" }, { status: 400 })
    }

    // Verify ownership
    const booking = await prisma.booking.findFirst({
      where: { id: bookingId, userId },
      include: { session: true },
    })

    if (!booking) {
      return NextResponse.json({ error: "Réservation introuvable" }, { status: 404 })
    }

    // Check if the session hasn't started yet (allow cancellation up to 2 hours before)
    const sessionDate = new Date(booking.session.date)
    const [hours, minutes] = booking.session.startTime.split(":").map(Number)
    sessionDate.setHours(hours ?? 0, minutes ?? 0, 0, 0)
    const twoHoursBefore = new Date(sessionDate.getTime() - 2 * 60 * 60 * 1000)

    if (new Date() > twoHoursBefore) {
      return NextResponse.json(
        { error: "Annulation impossible moins de 2h avant le cours." },
        { status: 400 }
      )
    }

    // Log cancellation reason for analytics
    if (reason) {
      console.log(
        `[CANCEL] Booking ${bookingId} by user ${userId} — reason: "${reason}"`
      )
    }

    // Cancel booking and decrement participant count
    await prisma.$transaction([
      prisma.booking.update({
        where: { id: bookingId },
        data: { status: "CANCELLED", cancelledAt: new Date() },
      }),
      prisma.session.update({
        where: { id: booking.sessionId },
        data: { currentParticipants: { decrement: 1 } },
      }),
    ])

    // After cancellation, check for waitlisted bookings on this session
    const waitlisted = await prisma.booking.findFirst({
      where: { sessionId: booking.sessionId, status: "WAITLIST" },
      orderBy: { createdAt: "asc" }, // FIFO
      include: {
        user: true,
        session: {
          include: {
            courseType: true,
            instructor: { include: { user: true } },
          },
        },
      },
    })

    if (waitlisted) {
      await prisma.$transaction([
        prisma.booking.update({
          where: { id: waitlisted.id },
          data: { status: "CONFIRMED" },
        }),
        prisma.session.update({
          where: { id: booking.sessionId },
          data: { currentParticipants: { increment: 1 } },
        }),
      ])

      // Send waitlist promotion email (non-blocking)
      if (waitlisted.user.email) {
        sendWaitlistPromotion({
          to: waitlisted.user.email,
          courseName: waitlisted.session.courseType.name,
          date: waitlisted.session.date.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" }),
          time: waitlisted.session.startTime,
        }).catch(() => {})
      }
    }

    return NextResponse.json({ message: "Réservation annulée avec succès." })
  } catch {
    return NextResponse.json({ error: "Erreur lors de l'annulation" }, { status: 500 })
  }
}
