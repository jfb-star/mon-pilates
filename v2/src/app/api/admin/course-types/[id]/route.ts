import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { requireAdmin } from "@/lib/admin"
import { prisma } from "@/lib/prisma"
import type { Prisma } from "@prisma/client"

type Ctx = { params: Promise<{ id: string }> }

function toStringArray(input: unknown): string[] {
  if (Array.isArray(input)) return input.map(String).map((s) => s.trim()).filter(Boolean)
  if (typeof input === "string") {
    return input
      .split(/[,\n]/)
      .map((s) => s.trim())
      .filter(Boolean)
  }
  return []
}

// PATCH: update course type
export async function PATCH(request: NextRequest, ctx: Ctx) {
  const session = await requireAdmin()
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
  }

  try {
    const { id } = await ctx.params
    const body = await request.json()

    const existing = await prisma.courseType.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json(
        { error: "Type de cours introuvable." },
        { status: 404 }
      )
    }

    if (body.slug && body.slug !== existing.slug) {
      const slugTaken = await prisma.courseType.findUnique({
        where: { slug: body.slug },
      })
      if (slugTaken) {
        return NextResponse.json(
          { error: "Ce slug est déjà utilisé." },
          { status: 400 }
        )
      }
    }

    const data: Prisma.CourseTypeUpdateInput = {}
    if (body.name !== undefined) data.name = body.name
    if (body.slug !== undefined) data.slug = body.slug
    if (body.description !== undefined) data.description = body.description
    if (body.shortDescription !== undefined) data.shortDescription = body.shortDescription
    if (body.duration !== undefined) data.duration = parseInt(String(body.duration), 10)
    if (body.level !== undefined) data.level = body.level
    if (body.intensity !== undefined) data.intensity = parseInt(String(body.intensity), 10)
    if (body.maxParticipants !== undefined)
      data.maxParticipants = parseInt(String(body.maxParticipants), 10)
    if (body.image !== undefined) data.image = body.image
    if (body.color !== undefined) data.color = body.color
    if (body.icon !== undefined) data.icon = body.icon
    if (body.benefits !== undefined)
      data.benefits = JSON.stringify(toStringArray(body.benefits))
    if (body.equipment !== undefined)
      data.equipment = JSON.stringify(toStringArray(body.equipment))

    const updated = await prisma.courseType.update({ where: { id }, data })
    return NextResponse.json({ courseType: updated })
  } catch {
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour." },
      { status: 500 }
    )
  }
}

// DELETE: delete course type
export async function DELETE(_request: NextRequest, ctx: Ctx) {
  const session = await requireAdmin()
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
  }

  try {
    const { id } = await ctx.params

    const existing = await prisma.courseType.findUnique({
      where: { id },
      select: { _count: { select: { sessions: true, schedules: true } } },
    })
    if (!existing) {
      return NextResponse.json(
        { error: "Type de cours introuvable." },
        { status: 404 }
      )
    }

    if (existing._count.sessions > 0 || existing._count.schedules > 0) {
      return NextResponse.json(
        {
          error:
            "Impossible de supprimer : ce type de cours a des séances ou plannings associés.",
        },
        { status: 400 }
      )
    }

    await prisma.courseType.delete({ where: { id } })
    return NextResponse.json({ message: "Type de cours supprimé." })
  } catch {
    return NextResponse.json(
      { error: "Erreur lors de la suppression." },
      { status: 500 }
    )
  }
}
