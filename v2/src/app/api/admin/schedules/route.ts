import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { requireAdmin } from "@/lib/admin"
import { prisma } from "@/lib/prisma"
import type { Prisma } from "@prisma/client"

// GET: list schedules with optional instructor filter
export async function GET(request: NextRequest) {
  const session = await requireAdmin()
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
  }

  const { searchParams } = new URL(request.url)
  const instructorId = searchParams.get("instructorId")
  const courseTypeId = searchParams.get("courseTypeId")

  const where: Prisma.ScheduleWhereInput = {}
  if (instructorId) where.instructorId = instructorId
  if (courseTypeId) where.courseTypeId = courseTypeId

  const schedules = await prisma.schedule.findMany({
    where,
    include: {
      courseType: { select: { id: true, name: true, slug: true, color: true } },
      instructor: {
        select: {
          id: true,
          slug: true,
          user: { select: { name: true } },
        },
      },
    },
    orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
  })

  return NextResponse.json({
    schedules: schedules.map((s) => ({
      id: s.id,
      courseTypeId: s.courseTypeId,
      instructorId: s.instructorId,
      dayOfWeek: s.dayOfWeek,
      startTime: s.startTime,
      endTime: s.endTime,
      isRecurring: s.isRecurring,
      startDate: s.startDate,
      endDate: s.endDate,
      maxParticipants: s.maxParticipants,
      courseType: s.courseType,
      instructor: {
        id: s.instructor.id,
        slug: s.instructor.slug,
        name: s.instructor.user.name,
      },
    })),
  })
}

// POST: create schedule
export async function POST(request: NextRequest) {
  const session = await requireAdmin()
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
  }

  try {
    const body = await request.json()
    const {
      courseTypeId,
      instructorId,
      dayOfWeek,
      startTime,
      endTime,
      startDate,
      endDate,
      maxParticipants,
      isRecurring,
    } = body

    if (
      !courseTypeId ||
      !instructorId ||
      dayOfWeek === undefined ||
      !startTime ||
      !endTime ||
      !startDate
    ) {
      return NextResponse.json(
        {
          error:
            "courseTypeId, instructorId, dayOfWeek, startTime, endTime, startDate sont requis.",
        },
        { status: 400 }
      )
    }

    const day = parseInt(String(dayOfWeek), 10)
    if (day < 0 || day > 6) {
      return NextResponse.json(
        { error: "dayOfWeek doit être entre 0 (dimanche) et 6 (samedi)." },
        { status: 400 }
      )
    }

    const created = await prisma.schedule.create({
      data: {
        courseTypeId,
        instructorId,
        dayOfWeek: day,
        startTime,
        endTime,
        isRecurring: isRecurring ?? true,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        maxParticipants:
          maxParticipants !== undefined && maxParticipants !== null && maxParticipants !== ""
            ? parseInt(String(maxParticipants), 10)
            : null,
      },
    })

    return NextResponse.json({ schedule: created }, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: "Erreur lors de la création du planning." },
      { status: 500 }
    )
  }
}
