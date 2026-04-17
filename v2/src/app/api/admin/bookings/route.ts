import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { requireAdmin } from "@/lib/admin"
import { prisma } from "@/lib/prisma"

// GET: List all bookings with filters
export async function GET(request: NextRequest) {
  const session = await requireAdmin()
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
  }

  const { searchParams } = new URL(request.url)
  const sessionId = searchParams.get("sessionId")
  const userId = searchParams.get("userId")
  const status = searchParams.get("status")
  const date = searchParams.get("date")
  const search = searchParams.get("search")
  const limit = parseInt(searchParams.get("limit") ?? "50", 10)
  const offset = parseInt(searchParams.get("offset") ?? "0", 10)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {}
  if (sessionId) where.sessionId = sessionId
  if (userId) where.userId = userId
  if (status) where.status = status
  if (date) {
    const d = new Date(date)
    const nextDay = new Date(d)
    nextDay.setDate(d.getDate() + 1)
    where.session = { date: { gte: d, lt: nextDay } }
  }
  if (search) {
    where.user = {
      OR: [
        { name: { contains: search } },
        { email: { contains: search } },
      ],
    }
  }

  const [bookings, total] = await Promise.all([
    prisma.booking.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true } },
        session: {
          include: {
            courseType: { select: { name: true, slug: true } },
            instructor: { include: { user: { select: { name: true } } } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
    }),
    prisma.booking.count({ where }),
  ])

  return NextResponse.json({
    bookings: bookings.map((b) => ({
      id: b.id,
      status: b.status,
      paymentMethod: b.paymentMethod,
      createdAt: b.createdAt,
      cancelledAt: b.cancelledAt,
      user: b.user,
      sessionDate: b.session.date,
      startTime: b.session.startTime,
      courseName: b.session.courseType.name,
      courseSlug: b.session.courseType.slug,
      instructor: b.session.instructor.user.name,
    })),
    total,
    limit,
    offset,
  })
}

// PATCH: Update booking status
export async function PATCH(request: NextRequest) {
  const session = await requireAdmin()
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
  }

  try {
    const body = await request.json()
    const { id, status } = body

    if (!id || !status) {
      return NextResponse.json({ error: "ID et statut requis." }, { status: 400 })
    }

    const validStatuses = ["CONFIRMED", "CANCELLED", "WAITLIST", "ATTENDED"]
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Statut invalide." }, { status: 400 })
    }

    const booking = await prisma.booking.findUnique({ where: { id } })
    if (!booking) {
      return NextResponse.json({ error: "Réservation introuvable." }, { status: 404 })
    }

    const oldStatus = booking.status

    await prisma.$transaction(async (tx) => {
      // Update booking status
      await tx.booking.update({
        where: { id },
        data: {
          status,
          cancelledAt: status === "CANCELLED" ? new Date() : undefined,
        },
      })

      // Adjust session participant count
      if (oldStatus === "CONFIRMED" && status !== "CONFIRMED" && status !== "ATTENDED") {
        await tx.session.update({
          where: { id: booking.sessionId },
          data: { currentParticipants: { decrement: 1 } },
        })
      } else if (oldStatus !== "CONFIRMED" && oldStatus !== "ATTENDED" && status === "CONFIRMED") {
        await tx.session.update({
          where: { id: booking.sessionId },
          data: { currentParticipants: { increment: 1 } },
        })
      }
    })

    return NextResponse.json({ message: "Statut mis à jour." })
  } catch {
    return NextResponse.json({ error: "Erreur lors de la mise à jour." }, { status: 500 })
  }
}
