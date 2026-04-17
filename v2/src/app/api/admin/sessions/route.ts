import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { requireAdmin } from "@/lib/admin"
import { prisma } from "@/lib/prisma"

// GET: List sessions with filters
export async function GET(request: NextRequest) {
  const session = await requireAdmin()
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
  }

  const { searchParams } = new URL(request.url)
  const weekStart = searchParams.get("weekStart")
  const courseType = searchParams.get("courseType")
  const instructor = searchParams.get("instructor")

  // Default to current week
  let startDate: Date
  if (weekStart) {
    startDate = new Date(weekStart)
  } else {
    const now = new Date()
    startDate = new Date(now)
    startDate.setDate(now.getDate() - ((now.getDay() + 6) % 7))
  }
  startDate.setHours(0, 0, 0, 0)

  const endDate = new Date(startDate)
  endDate.setDate(startDate.getDate() + 7)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {
    date: { gte: startDate, lt: endDate },
  }
  if (courseType) where.courseTypeId = courseType
  if (instructor) where.instructorId = instructor

  const sessions = await prisma.session.findMany({
    where,
    include: {
      courseType: { select: { id: true, name: true, slug: true, color: true } },
      instructor: {
        include: { user: { select: { name: true } } },
      },
      _count: { select: { bookings: true } },
    },
    orderBy: [{ date: "asc" }, { startTime: "asc" }],
  })

  return NextResponse.json({
    sessions: sessions.map((s) => ({
      id: s.id,
      date: s.date,
      startTime: s.startTime,
      endTime: s.endTime,
      status: s.status,
      maxParticipants: s.maxParticipants,
      currentParticipants: s.currentParticipants,
      bookingCount: s._count.bookings,
      notes: s.notes,
      courseType: {
        id: s.courseType.id,
        name: s.courseType.name,
        slug: s.courseType.slug,
        color: s.courseType.color,
      },
      instructor: {
        id: s.instructorId,
        name: s.instructor.user.name,
      },
    })),
    weekStart: startDate.toISOString().split("T")[0],
  })
}

// POST: Create a new session
export async function POST(request: NextRequest) {
  const session = await requireAdmin()
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
  }

  try {
    const body = await request.json()
    const { courseTypeId, instructorId, date, startTime, endTime, maxParticipants, scheduleId } = body

    if (!courseTypeId || !instructorId || !date || !startTime || !endTime || !maxParticipants) {
      return NextResponse.json({ error: "Tous les champs sont requis." }, { status: 400 })
    }

    // If no scheduleId provided, find a matching schedule or create a minimal one
    let finalScheduleId = scheduleId
    if (!finalScheduleId) {
      // Try to find an existing schedule
      const existingSchedule = await prisma.schedule.findFirst({
        where: { courseTypeId, instructorId },
      })
      if (existingSchedule) {
        finalScheduleId = existingSchedule.id
      } else {
        // Create a non-recurring schedule
        const newSchedule = await prisma.schedule.create({
          data: {
            courseTypeId,
            instructorId,
            dayOfWeek: new Date(date).getDay(),
            startTime,
            endTime,
            isRecurring: false,
            startDate: new Date(date),
          },
        })
        finalScheduleId = newSchedule.id
      }
    }

    const newSession = await prisma.session.create({
      data: {
        scheduleId: finalScheduleId,
        courseTypeId,
        instructorId,
        date: new Date(date),
        startTime,
        endTime,
        maxParticipants: parseInt(maxParticipants, 10),
        status: "SCHEDULED",
      },
      include: {
        courseType: { select: { name: true } },
        instructor: { include: { user: { select: { name: true } } } },
      },
    })

    return NextResponse.json({ session: newSession }, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Erreur lors de la création de la séance." }, { status: 500 })
  }
}

// PATCH: Update a session
export async function PATCH(request: NextRequest) {
  const session = await requireAdmin()
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
  }

  try {
    const body = await request.json()
    const { id, ...fields } = body

    if (!id) {
      return NextResponse.json({ error: "ID de séance requis." }, { status: 400 })
    }

    // Only allow updating specific fields
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: any = {}
    if (fields.startTime) data.startTime = fields.startTime
    if (fields.endTime) data.endTime = fields.endTime
    if (fields.instructorId) data.instructorId = fields.instructorId
    if (fields.maxParticipants) data.maxParticipants = parseInt(fields.maxParticipants, 10)
    if (fields.notes !== undefined) data.notes = fields.notes
    if (fields.status) data.status = fields.status

    const updated = await prisma.session.update({
      where: { id },
      data,
      include: {
        courseType: { select: { name: true } },
        instructor: { include: { user: { select: { name: true } } } },
      },
    })

    return NextResponse.json({ session: updated })
  } catch {
    return NextResponse.json({ error: "Erreur lors de la mise à jour." }, { status: 500 })
  }
}

// DELETE: Cancel a session and all its bookings
export async function DELETE(request: NextRequest) {
  const session = await requireAdmin()
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "ID de séance requis." }, { status: 400 })
    }

    await prisma.$transaction(async (tx) => {
      // Cancel all bookings for this session
      await tx.booking.updateMany({
        where: { sessionId: id, status: { not: "CANCELLED" } },
        data: { status: "CANCELLED", cancelledAt: new Date() },
      })

      // Cancel the session
      await tx.session.update({
        where: { id },
        data: { status: "CANCELLED" },
      })
    })

    // TODO: send notification emails to affected users

    return NextResponse.json({ message: "Séance annulée avec succès." })
  } catch {
    return NextResponse.json({ error: "Erreur lors de l'annulation." }, { status: 500 })
  }
}
