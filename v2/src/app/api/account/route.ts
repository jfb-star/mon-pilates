import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  const userId = session.user.id

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      birthday: true,
      addressLine: true,
      postalCode: true,
      city: true,
      country: true,
      createdAt: true,
      bookings: {
        orderBy: { createdAt: "desc" },
        take: 20,
        include: {
          session: {
            include: {
              courseType: { select: { name: true, slug: true, icon: true } },
              instructor: {
                include: { user: { select: { name: true } } },
              },
            },
          },
        },
      },
      courseCards: {
        where: { expiresAt: { gte: new Date() } },
        orderBy: { purchasedAt: "desc" },
        take: 5,
      },
    },
  })

  if (!user) {
    return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 })
  }

  // Split bookings into upcoming and past
  const now = new Date()
  const upcomingBookings = user.bookings
    .filter((b) => new Date(b.session.date) >= now && b.status !== "CANCELLED")
    .map((b) => ({
      id: b.id,
      status: b.status,
      courseName: b.session.courseType.name,
      courseSlug: b.session.courseType.slug,
      instructor: b.session.instructor.user.name,
      date: b.session.date,
      startTime: b.session.startTime,
      endTime: b.session.endTime,
      paymentMethod: b.paymentMethod,
      paymentStatus: b.paymentStatus,
    }))

  const pastBookings = user.bookings
    .filter((b) => new Date(b.session.date) < now || b.status === "CANCELLED")
    .map((b) => ({
      id: b.id,
      status: b.status === "CANCELLED" ? "CANCELLED" : "ATTENDED",
      courseName: b.session.courseType.name,
      instructor: b.session.instructor.user.name,
      date: b.session.date,
      startTime: b.session.startTime,
    }))

  const activeCard = user.courseCards.find((c) => c.remainingSessions > 0) ?? null

  // Check for redeemed gift cards with remaining balance
  const giftCards = await prisma.giftCard.findMany({
    where: {
      redeemedByUserId: userId,
      expiresAt: { gte: now },
      status: { in: ["ACTIVE", "REDEEMED"] },
    },
  })

  let giftCardBalance: { amount: number; sessions: number } | null = null
  if (giftCards.length > 0) {
    const totalAmount = giftCards.reduce((sum, gc) => sum + (gc.remainingAmount ?? 0), 0)
    const totalSessions = giftCards.reduce((sum, gc) => sum + (gc.remainingSessions ?? 0), 0)

    if (totalAmount > 0 || totalSessions > 0) {
      giftCardBalance = { amount: totalAmount, sessions: totalSessions }
    }
  }

  // Calculate unpaid balance (query separately to avoid the take:20 limit)
  const unpaidCount = await prisma.booking.count({
    where: {
      userId,
      paymentStatus: "PENDING",
      status: { not: "CANCELLED" },
    },
  })
  // 18€ per session (standard rate)
  const unpaidAmount = unpaidCount * 18_00

  return NextResponse.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      birthday: user.birthday,
      addressLine: user.addressLine,
      postalCode: user.postalCode,
      city: user.city,
      country: user.country,
      memberSince: user.createdAt,
    },
    upcomingBookings,
    pastBookings,
    balance: {
      unpaidCount,
      unpaidAmount,
    },
    activeCard: activeCard
      ? {
          type: activeCard.type,
          remaining: activeCard.remainingSessions,
          total: activeCard.totalSessions,
          purchasedAt: activeCard.purchasedAt,
          expiresAt: activeCard.expiresAt,
        }
      : null,
    giftCardBalance,
  })
}

export async function PATCH(request: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  const userId = session.user.id

  try {
    const body = await request.json()
    const { name, phone, birthday, addressLine, postalCode, city, country } = body

    // Allow updating any subset of: identity (name/phone) + optional profile
    // (birthday + 4-line address). Empty string from a cleared input is
    // treated as "remove the value" (write null) for optional fields, but
    // for `name` we keep the previous value (a user shouldn't end up nameless).
    const data: Record<string, string | Date | null> = {}
    if (name && typeof name === "string") data.name = name.trim().slice(0, 100)
    if (phone !== undefined) data.phone = phone ? String(phone).trim().slice(0, 20) : ""
    if (birthday !== undefined) {
      // Accept ISO date string ("YYYY-MM-DD") from <input type="date">; null/empty clears.
      if (typeof birthday === "string" && /^\d{4}-\d{2}-\d{2}/.test(birthday)) {
        data.birthday = new Date(birthday)
      } else if (birthday === null || birthday === "") {
        data.birthday = null
      }
    }
    if (addressLine !== undefined) data.addressLine = addressLine ? String(addressLine).trim().slice(0, 200) : null
    if (postalCode !== undefined) data.postalCode = postalCode ? String(postalCode).trim().slice(0, 20) : null
    if (city !== undefined) data.city = city ? String(city).trim().slice(0, 100) : null
    if (country !== undefined) data.country = country ? String(country).trim().slice(0, 100) : null

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: "Aucune donnée à modifier" }, { status: 400 })
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true, name: true, email: true, phone: true,
        birthday: true, addressLine: true, postalCode: true, city: true, country: true,
      },
    })

    return NextResponse.json({ user })
  } catch {
    return NextResponse.json({ error: "Erreur lors de la mise à jour" }, { status: 500 })
  }
}
