import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { requireAdmin } from "@/lib/admin"
import { prisma } from "@/lib/prisma"

function parseJsonArray(raw: string): string[] {
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.map(String) : []
  } catch {
    return []
  }
}

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

// GET: list course types
export async function GET() {
  const session = await requireAdmin()
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
  }

  const courseTypes = await prisma.courseType.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { sessions: true, schedules: true } } },
  })

  return NextResponse.json({
    courseTypes: courseTypes.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description,
      shortDescription: c.shortDescription,
      duration: c.duration,
      level: c.level,
      intensity: c.intensity,
      maxParticipants: c.maxParticipants,
      image: c.image,
      color: c.color,
      icon: c.icon,
      benefits: parseJsonArray(c.benefits),
      equipment: parseJsonArray(c.equipment),
      sessionCount: c._count.sessions,
      scheduleCount: c._count.schedules,
    })),
  })
}

// POST: create course type
export async function POST(request: NextRequest) {
  const session = await requireAdmin()
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
  }

  try {
    const body = await request.json()
    const {
      name,
      slug,
      description,
      shortDescription,
      duration,
      level,
      intensity,
      maxParticipants,
      image,
      color,
      icon,
      benefits,
      equipment,
    } = body

    if (!name || !slug || !duration || !maxParticipants) {
      return NextResponse.json(
        { error: "Nom, slug, durée et capacité sont requis." },
        { status: 400 }
      )
    }

    const existing = await prisma.courseType.findUnique({ where: { slug } })
    if (existing) {
      return NextResponse.json(
        { error: "Ce slug est déjà utilisé." },
        { status: 400 }
      )
    }

    const created = await prisma.courseType.create({
      data: {
        name,
        slug,
        description: description ?? null,
        shortDescription: shortDescription ?? null,
        duration: parseInt(String(duration), 10),
        level: level ?? "ALL_LEVELS",
        intensity: intensity !== undefined ? parseInt(String(intensity), 10) : 3,
        maxParticipants: parseInt(String(maxParticipants), 10),
        image: image ?? null,
        color: color ?? null,
        icon: icon ?? null,
        benefits: JSON.stringify(toStringArray(benefits)),
        equipment: JSON.stringify(toStringArray(equipment)),
      },
    })

    return NextResponse.json({ courseType: created }, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: "Erreur lors de la création." },
      { status: 500 }
    )
  }
}
