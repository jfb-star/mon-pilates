import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { requireAdmin } from "@/lib/admin"
import { prisma } from "@/lib/prisma"

/**
 * POST: Auto-generate Session records from active Schedule entries.
 *
 * Auth: admin session OR Vercel cron (Bearer CRON_SECRET).
 * Body (optional): { weeksAhead?: number } — default 4, max 12.
 */
export async function POST(request: NextRequest) {
  // Auth: Vercel cron secret OR admin session
  const authHeader = request.headers.get("authorization")
  const cronSecret = process.env.CRON_SECRET

  if (cronSecret && authHeader === `Bearer ${cronSecret}`) {
    // Authorized via cron — OK
  } else {
    const session = await requireAdmin()
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
    }
  }

  try {
    let weeksAhead = 4
    try {
      const body = await request.json()
      if (body.weeksAhead && typeof body.weeksAhead === "number") {
        weeksAhead = Math.max(1, Math.min(12, body.weeksAhead))
      }
    } catch {
      // No body or invalid JSON — use default
    }

    // Fetch all active schedules
    const now = new Date()
    const schedules = await prisma.schedule.findMany({
      where: {
        isRecurring: true,
        OR: [{ endDate: null }, { endDate: { gte: now } }],
      },
      include: {
        courseType: { select: { maxParticipants: true } },
      },
    })

    let created = 0
    let skipped = 0

    // Get Monday of current week
    const monday = new Date(now)
    monday.setDate(now.getDate() - ((now.getDay() + 6) % 7))
    monday.setHours(0, 0, 0, 0)

    for (const schedule of schedules) {
      for (let weekOffset = 0; weekOffset < weeksAhead; weekOffset++) {
        // Calculate the date for this schedule's dayOfWeek
        // dayOfWeek: 1=Mon (offset 0), 2=Tue (offset 1), ..., 6=Sat (offset 5), 0=Sun (offset 6)
        const dayOffset = schedule.dayOfWeek === 0 ? 6 : schedule.dayOfWeek - 1
        const sessionDate = new Date(monday)
        sessionDate.setDate(monday.getDate() + weekOffset * 7 + dayOffset)
        sessionDate.setHours(0, 0, 0, 0)

        // Skip dates in the past (before today)
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        if (sessionDate < today) {
          skipped++
          continue
        }

        // Skip if endDate is set and sessionDate is past it
        if (schedule.endDate && sessionDate > schedule.endDate) {
          skipped++
          continue
        }

        // Check if a Session already exists for this schedule + date
        const startOfDay = new Date(sessionDate)
        const endOfDay = new Date(sessionDate)
        endOfDay.setDate(endOfDay.getDate() + 1)

        const existing = await prisma.session.findFirst({
          where: {
            scheduleId: schedule.id,
            date: { gte: startOfDay, lt: endOfDay },
          },
        })

        if (existing) {
          skipped++
          continue
        }

        // Create the session
        const maxParticipants =
          schedule.maxParticipants ?? schedule.courseType.maxParticipants

        await prisma.session.create({
          data: {
            scheduleId: schedule.id,
            courseTypeId: schedule.courseTypeId,
            instructorId: schedule.instructorId,
            date: sessionDate,
            startTime: schedule.startTime,
            endTime: schedule.endTime,
            maxParticipants,
            currentParticipants: 0,
            status: "SCHEDULED",
          },
        })

        created++
      }
    }

    return NextResponse.json({
      created,
      skipped,
      total: created + skipped,
    })
  } catch (error) {
    console.error("Erreur génération des séances:", error)
    return NextResponse.json(
      { error: "Erreur lors de la génération des séances." },
      { status: 500 }
    )
  }
}
