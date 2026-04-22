import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { requireAdmin } from "@/lib/admin"
import { prisma } from "@/lib/prisma"
import type { Prisma } from "@prisma/client"

type Ctx = { params: Promise<{ id: string }> }

// PATCH: update instructor + optional user.name/email
export async function PATCH(request: NextRequest, ctx: Ctx) {
  const session = await requireAdmin(request)
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
  }

  try {
    const { id } = await ctx.params
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
      bio?: string | null
      photo?: string | null
      certifications?: string | null
      specialties?: string[] | string
      slug?: string
    } = body

    const existing = await prisma.instructor.findUnique({
      where: { id },
      include: { user: true },
    })
    if (!existing) {
      return NextResponse.json({ error: "Coach introuvable." }, { status: 404 })
    }

    if (slug && slug !== existing.slug) {
      const slugTaken = await prisma.instructor.findUnique({ where: { slug } })
      if (slugTaken) {
        return NextResponse.json(
          { error: "Ce slug est déjà utilisé." },
          { status: 400 }
        )
      }
    }

    if (email && email !== existing.user.email) {
      const emailTaken = await prisma.user.findUnique({ where: { email } })
      if (emailTaken) {
        return NextResponse.json(
          { error: "Cet email est déjà utilisé." },
          { status: 400 }
        )
      }
    }

    const instructorData: Prisma.InstructorUpdateInput = {}
    if (slug !== undefined) instructorData.slug = slug
    if (bio !== undefined) instructorData.bio = bio
    if (photo !== undefined) instructorData.photo = photo
    if (certifications !== undefined) instructorData.certifications = certifications
    if (specialties !== undefined) {
      const arr = Array.isArray(specialties)
        ? specialties
        : typeof specialties === "string"
          ? specialties.split(",").map((s) => s.trim()).filter(Boolean)
          : []
      instructorData.specialties = JSON.stringify(arr)
    }

    const userData: Prisma.UserUpdateInput = {}
    if (name !== undefined) userData.name = name
    if (email !== undefined) userData.email = email

    await prisma.$transaction(async (tx) => {
      if (Object.keys(userData).length > 0) {
        await tx.user.update({
          where: { id: existing.userId },
          data: userData,
        })
      }
      if (Object.keys(instructorData).length > 0) {
        await tx.instructor.update({
          where: { id },
          data: instructorData,
        })
      }
    })

    return NextResponse.json({ message: "Coach mis à jour." })
  } catch {
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour." },
      { status: 500 }
    )
  }
}

// DELETE: delete instructor and linked User
export async function DELETE(request: NextRequest, ctx: Ctx) {
  const session = await requireAdmin(request)
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
  }

  try {
    const { id } = await ctx.params

    const existing = await prisma.instructor.findUnique({
      where: { id },
      select: { userId: true, _count: { select: { sessions: true, schedules: true } } },
    })
    if (!existing) {
      return NextResponse.json({ error: "Coach introuvable." }, { status: 404 })
    }

    if (existing._count.sessions > 0 || existing._count.schedules > 0) {
      return NextResponse.json(
        {
          error:
            "Impossible de supprimer : ce coach a des séances ou plannings associés.",
        },
        { status: 400 }
      )
    }

    // Deleting User cascades to Instructor (schema: onDelete: Cascade on userId)
    await prisma.$transaction(async (tx) => {
      await tx.instructor.delete({ where: { id } })
      await tx.user.delete({ where: { id: existing.userId } })
    })

    return NextResponse.json({ message: "Coach supprimé." })
  } catch {
    return NextResponse.json(
      { error: "Erreur lors de la suppression." },
      { status: 500 }
    )
  }
}
