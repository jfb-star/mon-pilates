import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// Helper: day-of-week names in French
const dayNamesFr = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"]

// POST: Subscribe to a recurring slot — books next 4 weeks
export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Connectez-vous pour réserver." }, { status: 401 })
  }

  const userId = session.user.id

  try {
    const body = await request.json()
    const { scheduleId } = body

    if (!scheduleId || typeof scheduleId !== "string") {
      return NextResponse.json({ error: "Créneau requis." }, { status: 400 })
    }

    // Find the schedule with course type and instructor info
    const schedule = await prisma.schedule.findUnique({
      where: { id: scheduleId },
      include: {
        courseType: { select: { name: true, slug: true } },
        instructor: { include: { user: { select: { name: true } } } },
      },
    })

    if (!schedule) {
      return NextResponse.json({ error: "Créneau introuvable." }, { status: 404 })
    }

    // Find all future sessions linked to this schedule (next 4 weeks)
    const now = new Date()
    const fourWeeksLater = new Date(now)
    fourWeeksLater.setDate(fourWeeksLater.getDate() + 28)

    const futureSessions = await prisma.session.findMany({
      where: {
        scheduleId,
        status: "SCHEDULED",
        date: {
          gt: now,
          lte: fourWeeksLater,
        },
      },
      orderBy: { date: "asc" },
    })

    if (futureSessions.length === 0) {
      return NextResponse.json(
        { error: "Aucune séance à venir pour ce créneau." },
        { status: 404 }
      )
    }

    // Check existing bookings for this user on these sessions
    const sessionIds = futureSessions.map((s) => s.id)
    const existingBookings = await prisma.booking.findMany({
      where: {
        userId,
        sessionId: { in: sessionIds },
        status: { not: "CANCELLED" },
      },
      select: { sessionId: true },
    })
    const alreadyBookedIds = new Set(existingBookings.map((b) => b.sessionId))

    let sessionsBooked = 0
    let sessionsWaitlisted = 0
    let sessionsSkipped = 0

    // Create bookings for sessions where user doesn't have one yet
    for (const s of futureSessions) {
      if (alreadyBookedIds.has(s.id)) {
        sessionsSkipped++
        continue
      }

      const isFull = s.currentParticipants >= s.maxParticipants
      const bookingStatus = isFull ? "WAITLIST" : "CONFIRMED"

      await prisma.$transaction(async (tx) => {
        await tx.booking.create({
          data: {
            userId,
            sessionId: s.id,
            status: bookingStatus,
            paymentMethod: "RECURRING",
            paymentStatus: "PENDING",
          },
        })

        if (bookingStatus === "CONFIRMED") {
          await tx.session.update({
            where: { id: s.id },
            data: { currentParticipants: { increment: 1 } },
          })
        }
      })

      if (isFull) {
        sessionsWaitlisted++
      } else {
        sessionsBooked++
      }
    }

    return NextResponse.json(
      {
        subscribed: true,
        sessionsBooked,
        sessionsWaitlisted,
        sessionsSkipped,
        schedule: {
          id: schedule.id,
          dayOfWeek: schedule.dayOfWeek,
          startTime: schedule.startTime,
          courseName: schedule.courseType.name,
          instructor: schedule.instructor.user.name,
        },
      },
      { status: 201 }
    )
  } catch {
    return NextResponse.json(
      { error: "Erreur lors de l'inscription récurrente." },
      { status: 500 }
    )
  }
}

// GET: List user's recurring subscriptions
export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  const userId = session.user.id
  const now = new Date()

  // Find all future bookings for this user, grouped by scheduleId
  const futureBookings = await prisma.booking.findMany({
    where: {
      userId,
      status: { in: ["CONFIRMED", "WAITLIST"] },
      session: {
        date: { gt: now },
        status: "SCHEDULED",
      },
    },
    include: {
      session: {
        include: {
          schedule: {
            include: {
              courseType: { select: { name: true, slug: true } },
              instructor: { include: { user: { select: { name: true } } } },
            },
          },
        },
      },
    },
    orderBy: { session: { date: "asc" } },
  })

  // Group by scheduleId: only consider schedules with 2+ future bookings as "recurring"
  const bySchedule = new Map<string, typeof futureBookings>()
  for (const b of futureBookings) {
    const sid = b.session.scheduleId
    if (!bySchedule.has(sid)) bySchedule.set(sid, [])
    bySchedule.get(sid)!.push(b)
  }

  const recurring = []
  for (const [scheduleId, bookings] of bySchedule) {
    if (bookings.length < 2) continue

    const schedule = bookings[0].session.schedule
    const nextSession = bookings[0].session

    recurring.push({
      scheduleId,
      dayOfWeek: schedule.dayOfWeek,
      dayName: dayNamesFr[schedule.dayOfWeek] ?? "",
      startTime: schedule.startTime,
      courseName: schedule.courseType.name,
      courseSlug: schedule.courseType.slug,
      instructor: schedule.instructor.user.name,
      nextSessionDate: nextSession.date,
      futureBookingsCount: bookings.length,
    })
  }

  return NextResponse.json({ recurring })
}

// DELETE: Unsubscribe from a recurring slot
export async function DELETE(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  const userId = session.user.id

  try {
    const body = await request.json()
    const { scheduleId } = body

    if (!scheduleId || typeof scheduleId !== "string") {
      return NextResponse.json({ error: "Créneau requis." }, { status: 400 })
    }

    const now = new Date()

    // Find all future CONFIRMED/WAITLIST bookings for this scheduleId
    const bookingsToCancel = await prisma.booking.findMany({
      where: {
        userId,
        status: { in: ["CONFIRMED", "WAITLIST"] },
        session: {
          scheduleId,
          date: { gt: now },
        },
      },
      include: {
        session: { select: { id: true } },
      },
    })

    if (bookingsToCancel.length === 0) {
      return NextResponse.json(
        { error: "Aucune réservation récurrente à annuler." },
        { status: 404 }
      )
    }

    let cancelledCount = 0

    for (const booking of bookingsToCancel) {
      await prisma.$transaction(async (tx) => {
        await tx.booking.update({
          where: { id: booking.id },
          data: {
            status: "CANCELLED",
            cancelledAt: new Date(),
          },
        })

        // Decrement participants only for CONFIRMED bookings
        if (booking.status === "CONFIRMED") {
          await tx.session.update({
            where: { id: booking.session.id },
            data: { currentParticipants: { decrement: 1 } },
          })
        }
      })

      cancelledCount++
    }

    return NextResponse.json({
      cancelled: true,
      cancelledCount,
    })
  } catch {
    return NextResponse.json(
      { error: "Erreur lors de la désinscription." },
      { status: 500 }
    )
  }
}
