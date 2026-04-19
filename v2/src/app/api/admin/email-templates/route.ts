import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { requireAdmin } from "@/lib/admin"
import { prisma } from "@/lib/prisma"

// GET: list templates
export async function GET() {
  const session = await requireAdmin()
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
  }

  const templates = await prisma.emailTemplate.findMany({
    orderBy: { updatedAt: "desc" },
  })

  return NextResponse.json({
    templates: templates.map((t) => ({
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
    })),
  })
}

// POST: create template
export async function POST(request: NextRequest) {
  const session = await requireAdmin()
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
  }

  try {
    const body = await request.json()
    const {
      key,
      name,
      subject,
      mjmlSource,
      variables,
    }: {
      key?: string
      name?: string
      subject?: string
      mjmlSource?: string
      variables?: string[] | string
    } = body

    if (!key || !name || !subject || !mjmlSource) {
      return NextResponse.json(
        { error: "key, name, subject et mjmlSource sont requis." },
        { status: 400 }
      )
    }

    const slug = key.trim().toLowerCase()
    if (!/^[a-z0-9_-]+$/.test(slug)) {
      return NextResponse.json(
        { error: "Le key doit être un slug (minuscules, chiffres, - ou _)." },
        { status: 400 }
      )
    }

    const existing = await prisma.emailTemplate.findUnique({ where: { key: slug } })
    if (existing) {
      return NextResponse.json(
        { error: "Ce key est déjà utilisé." },
        { status: 400 }
      )
    }

    const variablesArray = Array.isArray(variables)
      ? variables
      : typeof variables === "string"
        ? variables.split(",").map((s) => s.trim()).filter(Boolean)
        : []

    const userId = session.user?.id ?? null

    const created = await prisma.emailTemplate.create({
      data: {
        key: slug,
        name,
        subject,
        mjmlSource,
        htmlCompiled: mjmlSource, // no MJML compile yet — user will add later
        variables: JSON.stringify(variablesArray),
        updatedBy: userId,
      },
    })

    return NextResponse.json({ template: { id: created.id, key: created.key } }, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: "Erreur lors de la création du template." },
      { status: 500 }
    )
  }
}
