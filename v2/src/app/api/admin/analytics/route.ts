import { NextResponse } from "next/server"
import { requireStaff } from "@/lib/admin"
import { prisma } from "@/lib/prisma"

/**
 * Helper: ISO week string "YYYY-Www" from a Date.
 */
function isoWeek(d: Date): string {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
  date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7))
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1))
  const weekNo = Math.ceil(((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
  return `${date.getUTCFullYear()}-W${String(weekNo).padStart(2, "0")}`
}

const dayNames = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"]

export async function GET() {
  const session = await requireStaff()
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
  }

  const now = new Date()

  // --- 12 weeks ago ---
  const twelveWeeksAgo = new Date(now)
  twelveWeeksAgo.setDate(twelveWeeksAgo.getDate() - 84)
  twelveWeeksAgo.setHours(0, 0, 0, 0)

  // --- 4 weeks ago (for occupancy) ---
  const fourWeeksAgo = new Date(now)
  fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28)
  fourWeeksAgo.setHours(0, 0, 0, 0)

  // --- 6 months ago ---
  const sixMonthsAgo = new Date(now)
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
  sixMonthsAgo.setDate(1)
  sixMonthsAgo.setHours(0, 0, 0, 0)

  try {
    // 1. Weekly bookings (last 12 weeks)
    const bookings12w = await prisma.booking.findMany({
      where: { createdAt: { gte: twelveWeeksAgo }, status: { not: "CANCELLED" } },
      select: { createdAt: true },
    })

    const weeklyBookingsMap: Record<string, number> = {}
    for (const b of bookings12w) {
      const w = isoWeek(new Date(b.createdAt))
      weeklyBookingsMap[w] = (weeklyBookingsMap[w] || 0) + 1
    }

    // Build ordered 12-week array
    const weeklyBookings: { week: string; count: number }[] = []
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now)
      d.setDate(d.getDate() - i * 7)
      const w = isoWeek(d)
      if (!weeklyBookings.find((e) => e.week === w)) {
        weeklyBookings.push({ week: w, count: weeklyBookingsMap[w] || 0 })
      }
    }

    // 2. Weekly revenue (last 12 weeks)
    const payments12w = await prisma.payment.findMany({
      where: { createdAt: { gte: twelveWeeksAgo }, status: "SUCCEEDED" },
      select: { createdAt: true, amount: true },
    })

    const weeklyRevenueMap: Record<string, number> = {}
    for (const p of payments12w) {
      const w = isoWeek(new Date(p.createdAt))
      weeklyRevenueMap[w] = (weeklyRevenueMap[w] || 0) + p.amount
    }

    const weeklyRevenue: { week: string; amount: number }[] = []
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now)
      d.setDate(d.getDate() - i * 7)
      const w = isoWeek(d)
      if (!weeklyRevenue.find((e) => e.week === w)) {
        weeklyRevenue.push({ week: w, amount: weeklyRevenueMap[w] || 0 })
      }
    }

    // 3. Course type distribution
    const bookingsWithCourse = await prisma.booking.findMany({
      where: { createdAt: { gte: twelveWeeksAgo }, status: { not: "CANCELLED" } },
      select: { session: { select: { courseType: { select: { name: true } } } } },
    })

    const courseDistMap: Record<string, number> = {}
    for (const b of bookingsWithCourse) {
      const name = b.session.courseType.name
      courseDistMap[name] = (courseDistMap[name] || 0) + 1
    }
    const courseTypeDistribution = Object.entries(courseDistMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)

    // 4. Occupancy by day of week (last 4 weeks)
    const recentSessions = await prisma.session.findMany({
      where: { date: { gte: fourWeeksAgo } },
      select: { date: true, currentParticipants: true, maxParticipants: true },
    })

    const dayOccMap: Record<number, { total: number; count: number }> = {}
    for (const s of recentSessions) {
      const day = new Date(s.date).getDay()
      if (!dayOccMap[day]) dayOccMap[day] = { total: 0, count: 0 }
      dayOccMap[day].total += s.maxParticipants > 0 ? s.currentParticipants / s.maxParticipants : 0
      dayOccMap[day].count += 1
    }

    // Order Mon-Sun (1,2,3,4,5,6,0)
    const dayOrder = [1, 2, 3, 4, 5, 6, 0]
    const occupancyByDay = dayOrder
      .filter((d) => dayOccMap[d])
      .map((d) => {
        const entry = dayOccMap[d]!
        return {
          day: dayNames[d] ?? "",
          rate: Math.round((entry.total / entry.count) * 100) / 100,
        }
      })

    // 5. Peak hours
    const bookingsWithTime = await prisma.booking.findMany({
      where: { createdAt: { gte: twelveWeeksAgo }, status: { not: "CANCELLED" } },
      select: { session: { select: { startTime: true } } },
    })

    const hourMap: Record<string, number> = {}
    for (const b of bookingsWithTime) {
      const hour = b.session.startTime.split(":")[0] + "h"
      hourMap[hour] = (hourMap[hour] || 0) + 1
    }
    const peakHours = Object.entries(hourMap)
      .map(([hour, count]) => ({ hour, count }))
      .sort((a, b) => {
        const ha = parseInt(a.hour)
        const hb = parseInt(b.hour)
        return ha - hb
      })

    // 6. Member growth (last 6 months)
    const newUsers = await prisma.user.findMany({
      where: { createdAt: { gte: sixMonthsAgo } },
      select: { createdAt: true },
    })

    const monthMap: Record<string, number> = {}
    for (const u of newUsers) {
      const d = new Date(u.createdAt)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
      monthMap[key] = (monthMap[key] || 0) + 1
    }

    const memberGrowth: { month: string; count: number }[] = []
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now)
      d.setMonth(d.getMonth() - i)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
      if (!memberGrowth.find((e) => e.month === key)) {
        memberGrowth.push({ month: key, count: monthMap[key] || 0 })
      }
    }

    // 7. Retention rate
    const usersWithBookings = await prisma.user.findMany({
      where: { bookings: { some: {} } },
      select: {
        id: true,
        bookings: {
          where: { status: { not: "CANCELLED" } },
          select: { createdAt: true },
          orderBy: { createdAt: "asc" },
        },
      },
    })

    let usersWithOneBooking = 0
    let usersRetained = 0
    for (const u of usersWithBookings) {
      if (u.bookings.length === 0) continue
      usersWithOneBooking++
      if (u.bookings.length >= 2 && u.bookings[0] && u.bookings[1]) {
        const first = new Date(u.bookings[0].createdAt).getTime()
        const second = new Date(u.bookings[1].createdAt).getTime()
        if (second - first <= 30 * 24 * 60 * 60 * 1000) {
          usersRetained++
        }
      }
    }

    const retentionRate = usersWithOneBooking > 0
      ? Math.round((usersRetained / usersWithOneBooking) * 100)
      : 0

    return NextResponse.json({
      weeklyBookings,
      weeklyRevenue,
      courseTypeDistribution,
      occupancyByDay,
      peakHours,
      memberGrowth,
      retentionRate,
    })
  } catch (err) {
    console.error("[analytics]", err)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
