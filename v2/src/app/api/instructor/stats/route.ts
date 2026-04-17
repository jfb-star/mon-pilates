import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  })

  if (user?.role !== "INSTRUCTOR" && user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
  }

  const instructor = await prisma.instructor.findUnique({
    where: { userId: session.user.id },
  })

  if (!instructor) {
    return NextResponse.json({ error: "Profil instructeur introuvable" }, { status: 404 })
  }

  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1)

  // Today boundaries
  const todayStart = new Date(now)
  todayStart.setHours(0, 0, 0, 0)
  const todayEnd = new Date(now)
  todayEnd.setHours(23, 59, 59, 999)

  const [
    classesThisMonth,
    upcomingToday,
    bookingsThisMonth,
    courseTypeIds,
  ] = await Promise.all([
    // Total classes this month
    prisma.session.count({
      where: {
        instructorId: instructor.id,
        date: { gte: monthStart, lt: monthEnd },
        status: { not: "CANCELLED" },
      },
    }),

    // Upcoming classes today
    prisma.session.count({
      where: {
        instructorId: instructor.id,
        date: { gte: todayStart, lte: todayEnd },
        status: "SCHEDULED",
      },
    }),

    // All bookings this month for instructor's sessions (not cancelled)
    prisma.booking.findMany({
      where: {
        session: {
          instructorId: instructor.id,
          date: { gte: monthStart, lt: monthEnd },
        },
        status: { not: "CANCELLED" },
      },
      select: { userId: true, status: true },
    }),

    // Course types taught by this instructor (for reviews)
    prisma.session.findMany({
      where: { instructorId: instructor.id },
      select: { courseTypeId: true },
      distinct: ["courseTypeId"],
    }),
  ])

  // Unique students this month
  const uniqueStudentIds = new Set(bookingsThisMonth.map((b) => b.userId))
  const totalStudentsThisMonth = uniqueStudentIds.size

  // Average attendance rate
  const totalBookings = bookingsThisMonth.length
  const attendedCount = bookingsThisMonth.filter((b) => b.status === "ATTENDED").length
  const averageAttendanceRate =
    totalBookings > 0 ? Math.round((attendedCount / totalBookings) * 100) : 0

  // Average rating from reviews on their course types
  let averageRating = 0
  const ctIds = courseTypeIds.map((c) => c.courseTypeId)
  if (ctIds.length > 0) {
    const reviewAgg = await prisma.review.aggregate({
      _avg: { rating: true },
      where: { courseTypeId: { in: ctIds } },
    })
    averageRating = reviewAgg._avg.rating
      ? Math.round(reviewAgg._avg.rating * 10) / 10
      : 0
  }

  return NextResponse.json({
    totalClassesThisMonth: classesThisMonth,
    totalStudentsThisMonth,
    averageAttendanceRate,
    upcomingClassesToday: upcomingToday,
    averageRating,
  })
}
