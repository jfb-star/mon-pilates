import type { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const weekStart = searchParams.get("weekStart") // ISO date string e.g. "2026-04-13"

  // Default to current week's Monday
  let startDate: Date
  if (weekStart) {
    startDate = new Date(weekStart)
  } else {
    const now = new Date()
    startDate = new Date(now)
    startDate.setDate(now.getDate() - ((now.getDay() + 6) % 7)) // Monday
  }
  startDate.setHours(0, 0, 0, 0)

  const endDate = new Date(startDate)
  endDate.setDate(startDate.getDate() + 7) // Monday to Sunday (7 days)

  const sessions = await prisma.session.findMany({
    where: {
      date: {
        gte: startDate,
        lt: endDate,
      },
      status: "SCHEDULED",
    },
    include: {
      courseType: {
        select: { name: true, slug: true, icon: true, color: true, duration: true, level: true },
      },
      instructor: {
        include: { user: { select: { name: true } } },
      },
    },
    orderBy: [{ date: "asc" }, { startTime: "asc" }],
  })

  // Transform to frontend-friendly format
  const mondayTime = startDate.getTime()
  const result = sessions.map((s) => {
    const sessionDate = new Date(s.date)
    const dayOffset = Math.floor((sessionDate.getTime() - mondayTime) / (24 * 60 * 60 * 1000))

    return {
      id: s.id,
      scheduleId: s.scheduleId,
      courseType: s.courseType.slug,
      courseName: s.courseType.name,
      instructor: s.instructor.user.name,
      time: s.startTime,
      endTime: s.endTime,
      duration: `${s.courseType.duration} min`,
      durationMinutes: s.courseType.duration,
      level: formatLevel(s.courseType.level),
      spotsTotal: s.maxParticipants,
      spotsRemaining: Math.max(0, s.maxParticipants - s.currentParticipants),
      dayOffset,
      description: "",
      icon: s.courseType.icon,
      color: s.courseType.color,
      date: sessionDate.toISOString().split("T")[0],
    }
  })

  return Response.json({
    sessions: result,
    weekStart: startDate.toISOString().split("T")[0],
  })
}

function formatLevel(level: string): string {
  const map: Record<string, string> = {
    ALL_LEVELS: "Tous niveaux",
    BEGINNER: "Débutant",
    INTERMEDIATE: "Intermédiaire",
    ADVANCED: "Avancé",
  }
  return map[level] ?? level
}
