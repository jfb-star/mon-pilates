import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export type ActivityEvent = {
  id: string
  type: "booking" | "spots" | "review" | "milestone"
  message: string
  icon: string
  timestamp: string
  color: string
}

/**
 * GET /api/activity
 * Returns the latest 10 anonymized activity events (public, no auth).
 */
export async function GET() {
  try {
    const now = new Date()
    const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000)
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)

    const events: ActivityEvent[] = []

    // 1. Recent bookings (last 2 hours)
    const recentBookings = await prisma.booking.findMany({
      where: {
        createdAt: { gte: twoHoursAgo },
        status: { in: ["CONFIRMED", "ATTENDED"] },
      },
      orderBy: { createdAt: "desc" },
      take: 10,
      include: {
        user: { select: { name: true } },
        session: {
          include: {
            courseType: { select: { name: true } },
          },
        },
      },
    })

    for (const booking of recentBookings) {
      const initial = booking.user.name.charAt(0).toUpperCase()
      events.push({
        id: `booking-${booking.id}`,
        type: "booking",
        message: `${initial}. vient de réserver le cours de ${booking.session.courseType.name}`,
        icon: "\uD83D\uDCC5",
        timestamp: booking.createdAt.toISOString(),
        color: "text-blue-600",
      })
    }

    // 2. Sessions almost full (<=2 spots remaining, future sessions only)
    const almostFullSessions = await prisma.session.findMany({
      where: {
        status: "SCHEDULED",
        date: { gte: now },
      },
      include: {
        courseType: { select: { name: true } },
      },
      orderBy: { date: "asc" },
    })

    for (const session of almostFullSessions) {
      const spotsLeft = session.maxParticipants - session.currentParticipants
      if (spotsLeft > 0 && spotsLeft <= 2) {
        const sessionDate = new Date(session.date)
        const dayName = sessionDate.toLocaleDateString("fr-FR", { weekday: "long" })
        const time = session.startTime.replace(":", "h")

        events.push({
          id: `spots-${session.id}`,
          type: "spots",
          message: `Plus que ${spotsLeft} place${spotsLeft > 1 ? "s" : ""} pour ${session.courseType.name} \u2014 ${dayName} ${time}`,
          icon: "\u26A1",
          timestamp: now.toISOString(),
          color: "text-red-600",
        })
      }
    }

    // 3. Recent reviews (last 24 hours)
    const recentReviews = await prisma.review.findMany({
      where: {
        createdAt: { gte: twentyFourHoursAgo },
      },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        user: { select: { name: true } },
        courseType: { select: { name: true } },
      },
    })

    for (const review of recentReviews) {
      const initial = review.user.name.charAt(0).toUpperCase()
      events.push({
        id: `review-${review.id}`,
        type: "review",
        message: `${initial}. a donné ${review.rating}\u2B50 au cours ${review.courseType.name}`,
        icon: "\u2B50",
        timestamp: review.createdAt.toISOString(),
        color: "text-amber-500",
      })
    }

    // 4. Milestone bookings (users who recently hit 10, 25, or 50 total bookings)
    const milestones = [10, 25, 50]
    const recentUsers = await prisma.booking.findMany({
      where: {
        createdAt: { gte: twoHoursAgo },
        status: { in: ["CONFIRMED", "ATTENDED"] },
      },
      select: { userId: true, createdAt: true },
      distinct: ["userId"],
    })

    for (const { userId, createdAt } of recentUsers) {
      const totalBookings = await prisma.booking.count({
        where: {
          userId,
          status: { in: ["CONFIRMED", "ATTENDED"] },
        },
      })

      for (const milestone of milestones) {
        if (totalBookings === milestone) {
          events.push({
            id: `milestone-${userId}-${milestone}`,
            type: "milestone",
            message: `Un membre vient de compléter son ${milestone}e cours !`,
            icon: "\uD83C\uDF89",
            timestamp: createdAt.toISOString(),
            color: "text-purple-600",
          })
        }
      }
    }

    // Sort by timestamp desc and take the latest 10
    events.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )
    const latestEvents = events.slice(0, 10)

    return NextResponse.json({ events: latestEvents })
  } catch (error) {
    console.error("GET /api/activity error:", error)
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    )
  }
}
