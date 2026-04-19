import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { requireAdmin } from "@/lib/admin"
import { prisma } from "@/lib/prisma"

type Ctx = { params: Promise<{ id: string }> }

const VALID_STATUSES = ["NEW", "READ", "HANDLED"] as const

// PATCH: update contact message status
export async function PATCH(request: NextRequest, ctx: Ctx) {
  const session = await requireAdmin()
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
  }

  try {
    const { id } = await ctx.params
    const body = await request.json()
    const { status } = body as { status?: string }

    if (!status || !VALID_STATUSES.includes(status as typeof VALID_STATUSES[number])) {
      return NextResponse.json(
        { error: "Statut invalide. Attendu : NEW, READ ou HANDLED." },
        { status: 400 }
      )
    }

    const existing = await prisma.contactMessage.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json(
        { error: "Message introuvable." },
        { status: 404 }
      )
    }

    const updated = await prisma.contactMessage.update({
      where: { id },
      data: { status },
    })

    return NextResponse.json({ message: updated })
  } catch {
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour." },
      { status: 500 }
    )
  }
}

// DELETE: remove a contact message
export async function DELETE(_request: NextRequest, ctx: Ctx) {
  const session = await requireAdmin()
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
  }

  try {
    const { id } = await ctx.params

    const existing = await prisma.contactMessage.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json(
        { error: "Message introuvable." },
        { status: 404 }
      )
    }

    await prisma.contactMessage.delete({ where: { id } })
    return NextResponse.json({ message: "Message supprimé." })
  } catch {
    return NextResponse.json(
      { error: "Erreur lors de la suppression." },
      { status: 500 }
    )
  }
}
