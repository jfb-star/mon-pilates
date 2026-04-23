import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { z } from "zod"
import type { Prisma } from "@prisma/client"
import { requireAdmin } from "@/lib/admin"
import { prisma } from "@/lib/prisma"

const paginationSchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(50),
  offset: z.coerce.number().int().min(0).default(0),
})

// GET: List users with search
export async function GET(request: NextRequest) {
  const session = await requireAdmin(request)
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
  }

  const { searchParams } = new URL(request.url)
  const parsed = paginationSchema.safeParse({
    limit: searchParams.get("limit") ?? undefined,
    offset: searchParams.get("offset") ?? undefined,
  })
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Paramètres de pagination invalides." },
      { status: 400 }
    )
  }
  const { limit, offset } = parsed.data
  const search = searchParams.get("search")
  const role = searchParams.get("role")

  const where: Prisma.UserWhereInput = {}
  if (role) where.role = role
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { email: { contains: search } },
    ]
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        _count: { select: { bookings: true } },
        courseCards: {
          where: { remainingSessions: { gt: 0 }, expiresAt: { gt: new Date() } },
          select: { type: true, remainingSessions: true },
          take: 1,
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
    }),
    prisma.user.count({ where }),
  ])

  return NextResponse.json({
    users: users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      createdAt: u.createdAt,
      totalBookings: u._count.bookings,
      activeCard: u.courseCards[0] ?? null,
    })),
    total,
    limit,
    offset,
  })
}

// PATCH: Update user role
export async function PATCH(request: NextRequest) {
  const session = await requireAdmin(request)
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
  }

  try {
    const body = await request.json()
    const { id, role } = body

    if (!id || !role) {
      return NextResponse.json({ error: "ID et rôle requis." }, { status: 400 })
    }

    const validRoles = ["USER", "ADMIN", "INSTRUCTOR"]
    if (!validRoles.includes(role)) {
      return NextResponse.json({ error: "Rôle invalide." }, { status: 400 })
    }

    // Prevent removing last admin
    if (role !== "ADMIN") {
      const adminCount = await prisma.user.count({ where: { role: "ADMIN" } })
      const currentUser = await prisma.user.findUnique({ where: { id }, select: { role: true } })
      if (currentUser?.role === "ADMIN" && adminCount <= 1) {
        return NextResponse.json(
          { error: "Impossible de retirer le dernier administrateur." },
          { status: 400 }
        )
      }
    }

    await prisma.user.update({
      where: { id },
      data: { role },
    })

    return NextResponse.json({ message: "Rôle mis à jour." })
  } catch {
    return NextResponse.json({ error: "Erreur lors de la mise à jour." }, { status: 500 })
  }
}
