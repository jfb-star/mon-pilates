import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { requireAdmin } from "@/lib/admin"
import { prisma } from "@/lib/prisma"
import type { Prisma } from "@prisma/client"

type Ctx = { params: Promise<{ key: string }> }

// GET: one template
export async function GET(_request: NextRequest, ctx: Ctx) {
  const session = await requireAdmin()
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
  }

  const { key } = await ctx.params
  const t = await prisma.emailTemplate.findUnique({ where: { key } })
  if (!t) {
    return NextResponse.json({ error: "Template introuvable." }, { status: 404 })
  }

  return NextResponse.json({
    template: {
      id: t.id,
      key: t.key,
      name: t.name,
      subject: t.subject,
      mjmlSource: t.mjmlSource,
      htmlCompiled: t.htmlCompiled,
      variables: (() => {
        try {
          return JSON.parse(t.variables) as string[]
        } catch {
          return [] as string[]
        }
      })(),
      updatedAt: t.updatedAt.toISOString(),
      createdAt: t.createdAt.toISOString(),
    },
  })
}

// PATCH: update template
export async function PATCH(request: NextRequest, ctx: Ctx) {
  const session = await requireAdmin()
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
  }

  try {
    const { key } = await ctx.params
    const body = await request.json()
    const {
      name,
      subject,
      mjmlSource,
      variables,
    }: {
      name?: string
      subject?: string
      mjmlSource?: string
      variables?: string[] | string
    } = body

    const existing = await prisma.emailTemplate.findUnique({ where: { key } })
    if (!existing) {
      return NextResponse.json({ error: "Template introuvable." }, { status: 404 })
    }

    const data: Prisma.EmailTemplateUpdateInput = {}
    if (name !== undefined) data.name = name
    if (subject !== undefined) data.subject = subject
    if (mjmlSource !== undefined) {
      data.mjmlSource = mjmlSource
      data.htmlCompiled = mjmlSource // no MJML compile yet
    }
    if (variables !== undefined) {
      const arr = Array.isArray(variables)
        ? variables
        : typeof variables === "string"
          ? variables.split(",").map((s) => s.trim()).filter(Boolean)
          : []
      data.variables = JSON.stringify(arr)
    }
    const userId = session.user?.id
    if (userId) data.updatedBy = userId

    await prisma.emailTemplate.update({ where: { key }, data })

    return NextResponse.json({ message: "Template mis à jour." })
  } catch {
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour." },
      { status: 500 }
    )
  }
}

// DELETE: delete template
export async function DELETE(_request: NextRequest, ctx: Ctx) {
  const session = await requireAdmin()
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
  }

  try {
    const { key } = await ctx.params
    const existing = await prisma.emailTemplate.findUnique({ where: { key } })
    if (!existing) {
      return NextResponse.json({ error: "Template introuvable." }, { status: 404 })
    }

    await prisma.emailTemplate.delete({ where: { key } })
    return NextResponse.json({ message: "Template supprimé." })
  } catch {
    return NextResponse.json(
      { error: "Erreur lors de la suppression." },
      { status: 500 }
    )
  }
}
