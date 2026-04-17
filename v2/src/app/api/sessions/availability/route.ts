import type { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"

/**
 * Lightweight availability endpoint — returns only session IDs and spot counts.
 * Polled every 30s by the planning page for real-time updates.
 * Response is intentionally minimal (< 1KB for a typical week).
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const weekStart = searchParams.get("weekStart")

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

  const sessions = await prisma.session.findMany({
    where: {
      date: { gte: startDate, lt: endDate },
      status: "SCHEDULED",
    },
    select: {
      id: true,
      currentParticipants: true,
      maxParticipants: true,
    },
  })

  const availability: Record<string, { current: number; max: number }> = {}
  for (const s of sessions) {
    availability[s.id] = { current: s.currentParticipants, max: s.maxParticipants }
  }

  return Response.json(
    { availability, timestamp: Date.now() },
    {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    }
  )
}
