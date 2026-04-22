import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { requireAdmin } from "@/lib/admin"
import { prisma } from "@/lib/prisma"
import type { Prisma } from "@prisma/client"

type Ctx = { params: Promise<{ id: string }> }

// PATCH: update schedule
export async function PATCH(request: NextRequest, ctx: Ctx) {
  const session = await requireAdmin(request)
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
  }

  try {
    const { id } = await ctx.params
    const body = await request.json()

    const existing = await prisma.schedule.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json(
        { error: "Planning introuvable." },
        { status: 404 }
      )
    }

    const data: Prisma.ScheduleUpdateInput = {}
    if (body.courseTypeId !== undefined)
      data.courseType = { connect: { id: body.courseTypeId } }
    if (body.instructorId !== undefined)
      data.instructor = { connect: { id: body.instructorId } }
    if (body.dayOfWeek !== undefined) {
      const day = parseInt(String(body.dayOfWeek), 10)
      if (day < 0 || day > 6) {
        return NextResponse.json(
          { error: "dayOfWeek doit être entre 0 et 6." },
          { status: 400 }
        )
      }
      data.dayOfWeek = day
    }
    if (body.startTime !== undefined) data.startTime = body.startTime
    if (body.endTime !== undefined) data.endTime = body.endTime
    if (body.isRecurring !== undefined) data.isRecurring = !!body.isRecurring
    if (body.startDate !== undefined) data.startDate = new Date(body.startDate)
    if (body.endDate !== undefined)
      data.endDate = body.endDate ? new Date(body.endDate) : null
    if (body.maxParticipants !== undefined)
      data.maxParticipants =
        body.maxParticipants === null || body.maxParticipants === ""
          ? null
          : parseInt(String(body.maxParticipants), 10)

    const updated = await prisma.schedule.update({ where: { id }, data })
    return NextResponse.json({ schedule: updated })
  } catch {
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour." },
      { status: 500 }
    )
  }
}

// DELETE: delete schedule
export async function DELETE(request: NextRequest, ctx: Ctx) {
  const session = await requireAdmin(request)
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
  }

  try {
    const { id } = await ctx.params

    const existing = await prisma.schedule.findUnique({
      where: { id },
      select: { _count: { select: { sessions: true } } },
    })
    if (!existing) {
      return NextResponse.json(
        { error: "Planning introuvable." },
        { status: 404 }
      )
    }

    if (existing._count.sessions > 0) {
      return NextResponse.json(
        {
          error:
            "Impossible de supprimer : des séances sont rattachées à ce planning.",
        },
        { status: 400 }
      )
    }

    await prisma.schedule.delete({ where: { id } })
    return NextResponse.json({ message: "Planning supprimé." })
  } catch {
    return NextResponse.json(
      { error: "Erreur lors de la suppression." },
      { status: 500 }
    )
  }
}
