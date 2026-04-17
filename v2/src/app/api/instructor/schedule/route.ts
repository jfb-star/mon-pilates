import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

/**
 * Helper: get the authenticated instructor or return an error response.
 */
async function getInstructor() {
  const session = await auth()
  if (!session?.user?.id) {
    return { error: NextResponse.json({ error: "Non autorisé" }, { status: 401 }) }
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  })

  if (user?.role !== "INSTRUCTOR" && user?.role !== "ADMIN") {
    return { error: NextResponse.json({ error: "Non autorisé" }, { status: 403 }) }
  }

  const instructor = await prisma.instructor.findUnique({
    where: { userId: session.user.id },
  })

  if (!instructor) {
    return { error: NextResponse.json({ error: "Profil instructeur introuvable" }, { status: 404 }) }
  }

  return { instructor }
}

export async function GET() {
  const result = await getInstructor()
  if ("error" in result && result.error) return result.error
  const { instructor } = result as { instructor: { id: string } }

  const now = new Date()

  // Upcoming sessions: next 4 weeks
  const fourWeeksLater = new Date(now)
  fourWeeksLater.setDate(fourWeeksLater.getDate() + 28)

  // Past sessions: last 2 weeks
  const twoWeeksAgo = new Date(now)
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14)

  const [upcomingSessions, pastSessions] = await Promise.all([
    prisma.session.findMany({
      where: {
        instructorId: instructor.id,
        date: { gte: now, lte: fourWeeksLater },
        status: { not: "CANCELLED" },
      },
      include: {
        courseType: { select: { name: true, slug: true, color: true } },
        bookings: {
          where: { status: { not: "CANCELLED" } },
          select: {
            id: true,
            status: true,
            paymentMethod: true,
            paymentStatus: true,
            user: { select: { name: true, email: true } },
          },
        },
      },
      orderBy: { date: "asc" },
    }),
    prisma.session.findMany({
      where: {
        instructorId: instructor.id,
        date: { gte: twoWeeksAgo, lt: now },
      },
      include: {
        courseType: { select: { name: true, slug: true, color: true } },
        bookings: {
          where: { status: { not: "CANCELLED" } },
          select: {
            id: true,
            status: true,
            paymentMethod: true,
            paymentStatus: true,
            user: { select: { name: true, email: true } },
          },
        },
      },
      orderBy: { date: "desc" },
    }),
  ])

  const formatSession = (s: typeof upcomingSessions[number]) => ({
    id: s.id,
    date: s.date.toISOString(),
    startTime: s.startTime,
    endTime: s.endTime,
    notes: s.notes,
    courseType: s.courseType,
    currentParticipants: s.currentParticipants,
    maxParticipants: s.maxParticipants,
    students: s.bookings.map((b) => ({
      bookingId: b.id,
      name: b.user.name,
      email: b.user.email,
      status: b.status,
      paymentMethod: b.paymentMethod,
      paymentStatus: b.paymentStatus,
    })),
  })

  const formattedPast = pastSessions.map((s) => {
    const attended = s.bookings.filter((b) => b.status === "ATTENDED").length
    const total = s.bookings.length
    return {
      ...formatSession(s),
      attendanceStats: { attended, total },
    }
  })

  return NextResponse.json({
    upcoming: upcomingSessions.map(formatSession),
    past: formattedPast,
  })
}

export async function PATCH(request: Request) {
  const result = await getInstructor()
  if ("error" in result && result.error) return result.error
  const { instructor } = result as { instructor: { id: string } }

  let body: { sessionId?: string; notes?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Corps de requête invalide" }, { status: 400 })
  }

  const { sessionId, notes } = body
  if (!sessionId) {
    return NextResponse.json({ error: "sessionId requis" }, { status: 400 })
  }

  // Verify session belongs to this instructor
  const session = await prisma.session.findFirst({
    where: { id: sessionId, instructorId: instructor.id },
  })

  if (!session) {
    return NextResponse.json({ error: "Session introuvable" }, { status: 404 })
  }

  const updated = await prisma.session.update({
    where: { id: sessionId },
    data: { notes: notes ?? null },
  })

  return NextResponse.json({ id: updated.id, notes: updated.notes })
}
