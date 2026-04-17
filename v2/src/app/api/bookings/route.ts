import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { rateLimit } from "@/lib/rate-limit"
import { sendBookingConfirmation } from "@/lib/email"

// GET: List current user's bookings
export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  const bookings = await prisma.booking.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 30,
    include: {
      session: {
        include: {
          courseType: { select: { name: true, slug: true } },
          instructor: {
            include: { user: { select: { name: true } } },
          },
        },
      },
    },
  })

  return NextResponse.json({
    bookings: bookings.map((b) => ({
      id: b.id,
      status: b.status,
      createdAt: b.createdAt,
      cancelledAt: b.cancelledAt,
      courseName: b.session.courseType.name,
      courseSlug: b.session.courseType.slug,
      instructor: b.session.instructor.user.name,
      date: b.session.date,
      startTime: b.session.startTime,
      endTime: b.session.endTime,
    })),
  })
}

// POST: Create a booking for a session
export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Connectez-vous pour réserver." }, { status: 401 })
  }

  const userId = session.user.id!

  // Rate limit: 10 bookings per minute per user
  const { allowed } = rateLimit(`booking:${userId}`, {
    maxRequests: 10,
    windowMs: 60_000,
  })
  if (!allowed) {
    return NextResponse.json(
      { error: "Trop de réservations. Réessayez dans une minute." },
      { status: 429 }
    )
  }

  try {
    const body = await request.json()
    const { sessionId } = body

    if (!sessionId || typeof sessionId !== "string") {
      return NextResponse.json({ error: "Session de cours requise." }, { status: 400 })
    }

    // Find the session and check availability
    const courseSession = await prisma.session.findUnique({
      where: { id: sessionId },
      include: {
        courseType: true,
        instructor: { include: { user: { select: { name: true } } } },
      },
    })

    if (!courseSession) {
      return NextResponse.json({ error: "Séance introuvable." }, { status: 404 })
    }

    if (courseSession.status !== "SCHEDULED") {
      return NextResponse.json({ error: "Cette séance n'est plus disponible." }, { status: 400 })
    }

    // Check if session date is in the future
    const sessionDate = new Date(courseSession.date)
    const [hours, minutes] = courseSession.startTime.split(":").map(Number)
    sessionDate.setHours(hours, minutes, 0, 0)
    if (sessionDate <= new Date()) {
      return NextResponse.json({ error: "Cette séance est déjà passée." }, { status: 400 })
    }

    // Check if already booked
    const existingBooking = await prisma.booking.findFirst({
      where: {
        userId,
        sessionId,
        status: { not: "CANCELLED" },
      },
    })
    if (existingBooking) {
      return NextResponse.json(
        { error: "Vous êtes déjà inscrit(e) à cette séance." },
        { status: 409 }
      )
    }

    // Check capacity
    const isFull = courseSession.currentParticipants >= courseSession.maxParticipants
    const bookingStatus = isFull ? "WAITLIST" : "CONFIRMED"

    // Create booking and increment participants (only if confirmed)
    const booking = await prisma.$transaction(async (tx) => {
      const newBooking = await tx.booking.create({
        data: {
          userId,
          sessionId,
          status: bookingStatus,
        },
      })

      if (bookingStatus === "CONFIRMED") {
        await tx.session.update({
          where: { id: sessionId },
          data: { currentParticipants: { increment: 1 } },
        })
      }

      return newBooking
    })

    // Send confirmation email (non-blocking)
    if (bookingStatus === "CONFIRMED" && session.user.email) {
      sendBookingConfirmation({
        to: session.user.email,
        courseName: courseSession.courseType.name,
        date: courseSession.date.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" }),
        time: courseSession.startTime,
        instructor: courseSession.instructor?.user?.name || "L'équipe",
      }).catch(() => {})
    }

    // If waitlisted, compute position in the queue
    let waitlistPosition: number | undefined
    if (bookingStatus === "WAITLIST") {
      waitlistPosition = await prisma.booking.count({
        where: { sessionId, status: "WAITLIST" },
      })
    }

    return NextResponse.json(
      {
        message:
          bookingStatus === "CONFIRMED"
            ? "Réservation confirmée !"
            : "Vous êtes sur la liste d'attente.",
        booking: {
          id: booking.id,
          status: booking.status,
          courseName: courseSession.courseType.name,
          ...(waitlistPosition !== undefined && { waitlistPosition }),
        },
      },
      { status: 201 }
    )
  } catch {
    return NextResponse.json({ error: "Erreur lors de la réservation." }, { status: 500 })
  }
}
