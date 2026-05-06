import { NextResponse } from "next/server"
import { requireStaff } from "@/lib/admin"
import { prisma } from "@/lib/prisma"

/**
 * GET /api/admin/stats — powers the admin dashboard.
 *
 * Beyond the headline KPIs we also return:
 *   - `previousMonth` for delta arrows on stat cards
 *   - `today` snapshot (sessions, bookings, revenue created today)
 *   - `recentActivity` — last 8 mixed events (signup / booking / payment)
 *     so the dashboard can show a single live-feed panel rather than three
 *     separate "last 5" lists.
 */
export async function GET() {
  const session = await requireStaff()
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
  }

  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1)
  const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const prevMonthEnd = monthStart

  const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const dayEnd = new Date(dayStart)
  dayEnd.setDate(dayEnd.getDate() + 1)

  // Week boundaries (Monday–Sunday)
  const weekStart = new Date(now)
  weekStart.setDate(now.getDate() - ((now.getDay() + 6) % 7))
  weekStart.setHours(0, 0, 0, 0)
  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekStart.getDate() + 7)

  const [
    totalUsers,
    totalUsersAtPrevMonthEnd,
    bookingsThisMonth,
    bookingsPrevMonth,
    revenueResult,
    revenuePrev,
    activeCards,
    activeSubscriptions,
    popularCourse,
    weekSessions,
    revenueByType,
    todaySessionCount,
    todayBookingCount,
    todayRevenue,
    recentSignups,
    recentBookings,
    recentPayments,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { createdAt: { lt: monthStart } } }),

    prisma.booking.count({
      where: { createdAt: { gte: monthStart, lt: monthEnd }, status: { not: "CANCELLED" } },
    }),
    prisma.booking.count({
      where: { createdAt: { gte: prevMonthStart, lt: prevMonthEnd }, status: { not: "CANCELLED" } },
    }),

    prisma.payment.aggregate({
      _sum: { amount: true },
      where: { createdAt: { gte: monthStart, lt: monthEnd }, status: "COMPLETED" },
    }),
    prisma.payment.aggregate({
      _sum: { amount: true },
      where: { createdAt: { gte: prevMonthStart, lt: prevMonthEnd }, status: "COMPLETED" },
    }),

    prisma.courseCard.count({
      where: { remainingSessions: { gt: 0 }, expiresAt: { gt: now } },
    }),
    prisma.subscription.count({ where: { status: "ACTIVE" } }),

    prisma.booking.groupBy({
      by: ["sessionId"],
      where: { createdAt: { gte: monthStart, lt: monthEnd }, status: { not: "CANCELLED" } },
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 10,
    }),

    prisma.session.findMany({
      where: { date: { gte: weekStart, lt: weekEnd }, status: "SCHEDULED" },
      select: { currentParticipants: true, maxParticipants: true },
    }),

    prisma.payment.groupBy({
      by: ["type"],
      where: { createdAt: { gte: monthStart, lt: monthEnd }, status: "COMPLETED" },
      _sum: { amount: true },
    }),

    // Today snapshot
    prisma.session.count({
      where: { date: { gte: dayStart, lt: dayEnd }, status: "SCHEDULED" },
    }),
    prisma.booking.count({
      where: { createdAt: { gte: dayStart, lt: dayEnd }, status: { not: "CANCELLED" } },
    }),
    prisma.payment.aggregate({
      _sum: { amount: true },
      where: { createdAt: { gte: dayStart, lt: dayEnd }, status: "COMPLETED" },
    }),

    // Recent activity (last 8 of each, merged & truncated client-side here)
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      select: { id: true, name: true, email: true, createdAt: true },
    }),
    prisma.booking.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      select: {
        id: true, createdAt: true,
        user: { select: { id: true, name: true } },
        session: { select: { date: true, courseType: { select: { name: true } } } },
      },
    }),
    prisma.payment.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      where: { status: "COMPLETED" },
      select: {
        id: true, amount: true, type: true, createdAt: true,
        user: { select: { id: true, name: true } },
      },
    }),
  ])

  // Average occupancy this week
  let occupancyRate = 0
  if (weekSessions.length > 0) {
    const totalOccupancy = weekSessions.reduce(
      (sum, s) => sum + (s.maxParticipants > 0 ? s.currentParticipants / s.maxParticipants : 0),
      0
    )
    occupancyRate = Math.round((totalOccupancy / weekSessions.length) * 100)
  }

  let popularCourseName = "—"
  if (popularCourse.length > 0 && popularCourse[0]) {
    const topSession = await prisma.session.findUnique({
      where: { id: popularCourse[0].sessionId },
      include: { courseType: { select: { name: true } } },
    })
    popularCourseName = topSession?.courseType?.name ?? "—"
  }

  const revenueBreakdown = revenueByType.map((r) => ({ type: r.type, amount: r._sum.amount ?? 0 }))

  // Merge & sort the three activity streams to produce a single feed
  type ActivityEvent =
    | { kind: "signup"; id: string; date: string; userId: string; userName: string; meta: { email: string } }
    | { kind: "booking"; id: string; date: string; userId: string; userName: string; meta: { courseName: string; sessionDate: string } }
    | { kind: "payment"; id: string; date: string; userId: string; userName: string; meta: { amount: number; type: string } }

  const activity: ActivityEvent[] = [
    ...recentSignups.map((u): ActivityEvent => ({
      kind: "signup", id: u.id, date: u.createdAt.toISOString(),
      userId: u.id, userName: u.name, meta: { email: u.email },
    })),
    ...recentBookings.map((b): ActivityEvent => ({
      kind: "booking", id: b.id, date: b.createdAt.toISOString(),
      userId: b.user.id, userName: b.user.name,
      meta: { courseName: b.session.courseType.name, sessionDate: b.session.date.toISOString() },
    })),
    ...recentPayments.map((p): ActivityEvent => ({
      kind: "payment", id: p.id, date: p.createdAt.toISOString(),
      userId: p.user.id, userName: p.user.name,
      meta: { amount: p.amount, type: p.type },
    })),
  ]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 12)

  return NextResponse.json({
    totalUsers,
    bookingsThisMonth,
    revenueThisMonth: revenueResult._sum.amount ?? 0,
    activeCards,
    activeSubscriptions,
    popularCourseName,
    occupancyRate,
    revenueBreakdown,

    // Comparison anchors for delta arrows
    previousMonth: {
      totalUsers: totalUsersAtPrevMonthEnd,
      bookings: bookingsPrevMonth,
      revenue: revenuePrev._sum.amount ?? 0,
    },

    today: {
      sessions: todaySessionCount,
      bookings: todayBookingCount,
      revenue: todayRevenue._sum.amount ?? 0,
    },

    recentActivity: activity,
  })
}
