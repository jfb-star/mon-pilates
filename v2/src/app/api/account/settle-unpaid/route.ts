import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { stripe, SESSION_PRICE_CENTS } from "@/lib/stripe"
import { isAllowedOrigin } from "@/lib/utils"

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin")
  if (!isAllowedOrigin(origin)) {
    return NextResponse.json({ error: "Origine non autorisée." }, { status: 403 })
  }

  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  const userId = session.user.id

  let body: { method?: "card" | "online"; bookingIds?: string[] }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Corps invalide" }, { status: 400 })
  }

  const { method, bookingIds } = body
  if (method !== "card" && method !== "online") {
    return NextResponse.json({ error: "Méthode invalide" }, { status: 400 })
  }

  // Load the user's unpaid bookings (optionally filtered by bookingIds)
  const unpaid = await prisma.booking.findMany({
    where: {
      userId,
      paymentStatus: "PENDING",
      status: { not: "CANCELLED" },
      ...(bookingIds && bookingIds.length > 0 ? { id: { in: bookingIds } } : {}),
    },
    orderBy: { createdAt: "asc" },
    select: { id: true },
  })

  if (unpaid.length === 0) {
    return NextResponse.json({ error: "Aucune séance à régler" }, { status: 400 })
  }

  // --- Pay with course card ---
  if (method === "card") {
    const cards = await prisma.courseCard.findMany({
      where: {
        userId,
        remainingSessions: { gt: 0 },
        expiresAt: { gte: new Date() },
      },
      orderBy: { expiresAt: "asc" },
    })

    const totalAvailable = cards.reduce((s, c) => s + c.remainingSessions, 0)
    if (totalAvailable === 0) {
      return NextResponse.json(
        { error: "Aucune carte active" },
        { status: 400 }
      )
    }

    const toSettleCount = Math.min(totalAvailable, unpaid.length)
    const toSettleIds = unpaid.slice(0, toSettleCount).map((b) => b.id)

    await prisma.$transaction(async (tx) => {
      let remaining = toSettleCount
      for (const card of cards) {
        if (remaining <= 0) break
        const take = Math.min(card.remainingSessions, remaining)
        await tx.courseCard.update({
          where: { id: card.id },
          data: { remainingSessions: { decrement: take } },
        })
        remaining -= take
      }
      await tx.booking.updateMany({
        where: { id: { in: toSettleIds } },
        data: {
          paymentMethod: "CARD",
          paymentStatus: "PAID",
          paidAt: new Date(),
        },
      })
    })

    return NextResponse.json({
      ok: true,
      settled: toSettleCount,
      remainingUnpaid: unpaid.length - toSettleCount,
    })
  }

  // --- Pay online via Stripe ---
  const amountCents = unpaid.length * SESSION_PRICE_CENTS

  // Pre-fill email so logged-in users skip a mobile keyboard step.
  // payment_method_types: ["card","link"] enables Apple Pay / Google Pay
  // automatically on supported devices (they're served via the "card" PMT).
  const userEmail = session.user.email ?? undefined
  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card", "link"],
    locale: "fr",
    ...(userEmail ? { customer_email: userEmail } : {}),
    line_items: [
      {
        price_data: {
          currency: "eur",
          product_data: {
            name: `Régularisation ${unpaid.length} séance${unpaid.length > 1 ? "s" : ""}`,
          },
          unit_amount: SESSION_PRICE_CENTS,
        },
        quantity: unpaid.length,
      },
    ],
    metadata: {
      type: "settle-unpaid",
      userId,
      bookingIds: unpaid.map((b) => b.id).join(","),
    },
    success_url: `${origin}/compte?settled=1`,
    cancel_url: `${origin}/compte`,
  })

  return NextResponse.json({
    url: checkoutSession.url,
    amount: amountCents,
    count: unpaid.length,
  })
}
