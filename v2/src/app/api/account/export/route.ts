import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

/**
 * RGPD data export — Article 15 (right of access).
 *
 * Returns a JSON document with the user's personal data, their bookings,
 * payments, course cards, subscriptions and reviews. Explicit `select`
 * clauses guarantee we never leak `passwordHash` or any token.
 */
export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
  }

  const userId = session.user.id

  const data = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      role: true,
      referralCode: true,
      createdAt: true,
      updatedAt: true,
      bookings: {
        select: {
          id: true,
          status: true,
          paymentMethod: true,
          paymentStatus: true,
          createdAt: true,
          cancelledAt: true,
          paidAt: true,
          session: {
            select: {
              date: true,
              startTime: true,
              endTime: true,
              courseType: { select: { name: true } },
            },
          },
        },
      },
      payments: {
        select: {
          id: true,
          amount: true,
          currency: true,
          status: true,
          type: true,
          stripePaymentIntentId: true,
          stripeCheckoutSessionId: true,
          createdAt: true,
        },
      },
      courseCards: {
        select: {
          id: true,
          type: true,
          totalSessions: true,
          remainingSessions: true,
          purchasedAt: true,
          expiresAt: true,
        },
      },
      subscriptions: {
        select: {
          id: true,
          status: true,
          stripeSubscriptionId: true,
          stripePriceId: true,
          currentPeriodStart: true,
          currentPeriodEnd: true,
          cancelAtPeriodEnd: true,
          maxSessionsPerMonth: true,
        },
      },
      reviews: {
        select: {
          id: true,
          rating: true,
          comment: true,
          createdAt: true,
          courseType: { select: { name: true } },
        },
      },
      notifications: {
        select: {
          id: true,
          type: true,
          title: true,
          message: true,
          read: true,
          createdAt: true,
        },
      },
    },
  })

  if (!data) {
    return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 })
  }

  const payload = {
    exportedAt: new Date().toISOString(),
    notice:
      "Export RGPD (art. 15) — données personnelles associées à votre compte Mon Pilates.",
    user: data,
  }

  return new NextResponse(JSON.stringify(payload, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="mon-pilates-donnees-${userId}.json"`,
      "Cache-Control": "no-store",
    },
  })
}
