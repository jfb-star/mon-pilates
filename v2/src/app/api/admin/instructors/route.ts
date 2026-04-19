import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { hash } from "bcryptjs"
import { randomBytes } from "crypto"
import { requireAdmin } from "@/lib/admin"
import { prisma } from "@/lib/prisma"

// GET: list instructors
export async function GET() {
  const session = await requireAdmin()
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
  }

  const instructors = await prisma.instructor.findMany({
    include: {
      user: { select: { id: true, name: true, email: true, role: true } },
      _count: { select: { sessions: true, schedules: true } },
    },
    orderBy: { user: { name: "asc" } },
  })

  return NextResponse.json({
    instructors: instructors.map((i) => ({
      id: i.id,
      userId: i.userId,
      slug: i.slug,
      bio: i.bio,
      photo: i.photo,
      certifications: i.certifications,
      specialties: (() => {
        try {
          return JSON.parse(i.specialties) as string[]
        } catch {
          return [] as string[]
        }
      })(),
      name: i.user.name,
      email: i.user.email,
      role: i.user.role,
      sessionCount: i._count.sessions,
      scheduleCount: i._count.schedules,
    })),
  })
}

// POST: create instructor (User + Instructor atomically)
export async function POST(request: NextRequest) {
  const session = await requireAdmin()
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
  }

  try {
    const body = await request.json()
    const {
      name,
      email,
      bio,
      photo,
      certifications,
      specialties,
      slug,
    }: {
      name?: string
      email?: string
      bio?: string
      photo?: string
      certifications?: string
      specialties?: string[] | string
      slug?: string
    } = body

    if (!name || !email || !slug) {
      return NextResponse.json(
        { error: "Nom, email et slug sont requis." },
        { status: 400 }
      )
    }

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return NextResponse.json(
        { error: "Un utilisateur avec cet email existe déjà." },
        { status: 400 }
      )
    }

    const existingSlug = await prisma.instructor.findUnique({ where: { slug } })
    if (existingSlug) {
      return NextResponse.json(
        { error: "Ce slug est déjà utilisé." },
        { status: 400 }
      )
    }

    const tempPassword = randomBytes(12).toString("base64url")
    const passwordHash = await hash(tempPassword, 10)

    const specialtiesArray = Array.isArray(specialties)
      ? specialties
      : typeof specialties === "string"
        ? specialties.split(",").map((s) => s.trim()).filter(Boolean)
        : []

    const created = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name,
          email,
          passwordHash,
          role: "INSTRUCTOR",
        },
      })
      const instructor = await tx.instructor.create({
        data: {
          userId: user.id,
          slug,
          bio: bio ?? null,
          photo: photo ?? null,
          certifications: certifications ?? null,
          specialties: JSON.stringify(specialtiesArray),
        },
      })
      return { user, instructor }
    })

    return NextResponse.json(
      {
        instructor: {
          id: created.instructor.id,
          userId: created.user.id,
          slug: created.instructor.slug,
          name: created.user.name,
          email: created.user.email,
        },
        tempPassword,
      },
      { status: 201 }
    )
  } catch {
    return NextResponse.json(
      { error: "Erreur lors de la création du coach." },
      { status: 500 }
    )
  }
}
