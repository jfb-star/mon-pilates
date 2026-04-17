import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/admin"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await requireAdmin()
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
  }

  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1)

  // Week boundaries (Monday–Sunday)
  const weekStart = new Date(now)
  weekStart.setDate(now.getDate() - ((now.getDay() + 6) % 7))
  weekStart.setHours(0, 0, 0, 0)
  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekStart.getDate() + 7)

  const [
    totalUsers,
    bookingsThisMonth,
    revenueResult,
    activeCards,
    activeSubscriptions,
    popularCourse,
    weekSessions,
    revenueByType,
  ] = await Promise.all([
    // Total users
    prisma.user.count(),

    // Bookings this month
    prisma.booking.count({
      where: {
        createdAt: { gte: monthStart, lt: monthEnd },
        status: { not: "CANCELLED" },
      },
    }),

    // Revenue this month (completed payments)
    prisma.payment.aggregate({
      _sum: { amount: true },
      where: {
        createdAt: { gte: monthStart, lt: monthEnd },
        status: "COMPLETED",
      },
    }),

    // Active course cards
    prisma.courseCard.count({
      where: {
        remainingSessions: { gt: 0 },
        expiresAt: { gt: now },
      },
    }),

    // Active subscriptions
    prisma.subscription.count({
      where: { status: "ACTIVE" },
    }),

    // Most popular course type (by booking count this month)
    prisma.booking.groupBy({
      by: ["sessionId"],
      where: {
        createdAt: { gte: monthStart, lt: monthEnd },
        status: { not: "CANCELLED" },
      },
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 10,
    }),

    // Sessions this week for occupancy rate
    prisma.session.findMany({
      where: {
        date: { gte: weekStart, lt: weekEnd },
        status: "SCHEDULED",
      },
      select: { currentParticipants: true, maxParticipants: true },
    }),

    // Revenue by type
    prisma.payment.groupBy({
      by: ["type"],
      where: {
        createdAt: { gte: monthStart, lt: monthEnd },
        status: "COMPLETED",
      },
      _sum: { amount: true },
    }),
  ])

  // Compute average occupancy rate
  let occupancyRate = 0
  if (weekSessions.length > 0) {
    const totalOccupancy = weekSessions.reduce(
      (sum, s) => sum + (s.maxParticipants > 0 ? s.currentParticipants / s.maxParticipants : 0),
      0
    )
    occupancyRate = Math.round((totalOccupancy / weekSessions.length) * 100)
  }

  // Resolve most popular course type name
  let popularCourseName = "—"
  if (popularCourse.length > 0) {
    const topSessionId = popularCourse[0].sessionId
    const topSession = await prisma.session.findUnique({
      where: { id: topSessionId },
      include: { courseType: { select: { name: true } } },
    })
    popularCourseName = topSession?.courseType?.name ?? "—"
  }

  // Format revenue breakdown
  const revenueBreakdown = revenueByType.map((r) => ({
    type: r.type,
    amount: r._sum.amount ?? 0,
  }))

  return NextResponse.json({
    totalUsers,
    bookingsThisMonth,
    revenueThisMonth: revenueResult._sum.amount ?? 0,
    activeCards,
    activeSubscriptions,
    popularCourseName,
    occupancyRate,
    revenueBreakdown,
  })
}
