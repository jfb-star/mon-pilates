import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { requireStaff } from "@/lib/admin"
import { prisma } from "@/lib/prisma"

const UNIT_PRICE_CENTS = 18_00

// GET: List unpaid bookings grouped by user
export async function GET() {
  const session = await requireStaff()
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
  }

  const unpaidBookings = await prisma.booking.findMany({
    where: {
      paymentStatus: "PENDING",
      status: { not: "CANCELLED" },
    },
    include: {
      user: { select: { id: true, name: true, email: true, phone: true } },
      session: {
        include: {
          courseType: { select: { name: true } },
          instructor: { include: { user: { select: { name: true } } } },
        },
      },
    },
    orderBy: [
      { userId: "asc" },
      { session: { date: "asc" } },
    ],
  })

  // Group by user
  const groupedMap = new Map<
    string,
    {
      user: { id: string; name: string; email: string; phone: string | null }
      bookings: {
        id: string
        status: string
        paymentMethod: string
        sessionDate: string
        startTime: string
        courseName: string
        instructor: string
        amount: number
      }[]
      totalAmount: number
      totalCount: number
    }
  >()

  for (const b of unpaidBookings) {
    const existing = groupedMap.get(b.userId) ?? {
      user: b.user,
      bookings: [],
      totalAmount: 0,
      totalCount: 0,
    }
    existing.bookings.push({
      id: b.id,
      status: b.status,
      paymentMethod: b.paymentMethod,
      sessionDate: b.session.date.toISOString(),
      startTime: b.session.startTime,
      courseName: b.session.courseType.name,
      instructor: b.session.instructor.user.name,
      amount: UNIT_PRICE_CENTS,
    })
    existing.totalAmount += UNIT_PRICE_CENTS
    existing.totalCount += 1
    groupedMap.set(b.userId, existing)
  }

  const grouped = Array.from(groupedMap.values()).sort(
    (a, b) => b.totalAmount - a.totalAmount
  )

  const grandTotal = grouped.reduce((sum, g) => sum + g.totalAmount, 0)
  const grandCount = grouped.reduce((sum, g) => sum + g.totalCount, 0)

  return NextResponse.json({
    grouped,
    grandTotal,
    grandCount,
    unitPrice: UNIT_PRICE_CENTS,
  })
}

// POST: Mark booking as paid (or multiple bookings for a user)
export async function POST(request: NextRequest) {
  const session = await requireStaff(request)
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
  }

  let body: { bookingIds?: string[]; userId?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Corps invalide" }, { status: 400 })
  }

  const { bookingIds, userId } = body

  if (bookingIds && bookingIds.length > 0) {
    await prisma.booking.updateMany({
      where: {
        id: { in: bookingIds },
        paymentStatus: "PENDING",
      },
      data: {
        paymentStatus: "PAID",
        paidAt: new Date(),
      },
    })
    return NextResponse.json({ ok: true, count: bookingIds.length })
  }

  if (userId) {
    const result = await prisma.booking.updateMany({
      where: {
        userId,
        paymentStatus: "PENDING",
        status: { not: "CANCELLED" },
      },
      data: {
        paymentStatus: "PAID",
        paidAt: new Date(),
      },
    })
    return NextResponse.json({ ok: true, count: result.count })
  }

  return NextResponse.json({ error: "bookingIds ou userId requis" }, { status: 400 })
}
