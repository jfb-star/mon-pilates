import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { Prisma } from "@prisma/client"
import { stripe } from "@/lib/stripe"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

// Harmonised with the webhook's schema. Stripe metadata is caller-controlled —
// validate before trusting any field. Unknown keys are allowed.
const confirmMetadataSchema = z
  .object({
    type: z.enum(["booking", "course-card", "subscription", "settle-unpaid", "gift-card"]),
    userId: z.string().min(1).max(64).optional(),
    sessionId: z.string().min(1).max(64).optional(),
    isTrial: z.enum(["true", "false"]).optional(),
    cardType: z.enum(["5", "10", "20"]).optional(),
  })
  .passthrough()

function isPaymentSessionDuplicate(err: unknown): boolean {
  if (!(err instanceof Prisma.PrismaClientKnownRequestError) || err.code !== "P2002") {
    return false
  }
  const target = err.meta?.target
  if (Array.isArray(target)) return target.includes("stripeCheckoutSessionId")
  if (typeof target === "string") return target.includes("stripeCheckoutSessionId")
  return false
}

/**
 * POST /api/checkout/confirm
 * Called after Stripe redirect to ensure booking is created.
 * Fallback for when the webhook hasn't fired yet (e.g. local dev where Stripe
 * can't reach localhost). Idempotent with the webhook via the
 * `Payment_stripeCheckoutSessionId_key` unique index.
 */
export async function POST(req: NextRequest) {
  try {
    const { sessionId } = (await req.json()) as { sessionId: string }
    if (!sessionId || typeof sessionId !== "string") {
      return NextResponse.json({ error: "Session ID requis" }, { status: 400 })
    }

    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId)

    if (checkoutSession.payment_status !== "paid") {
      return NextResponse.json({ error: "Paiement non confirmé" }, { status: 400 })
    }

    const parsedMeta = confirmMetadataSchema.safeParse(checkoutSession.metadata ?? {})
    if (!parsedMeta.success) {
      console.error("[checkout/confirm] Invalid metadata", parsedMeta.error.issues)
      return NextResponse.json({ error: "Metadata invalides" }, { status: 400 })
    }
    const type = parsedMeta.data.type

    const authSession = await auth()
    let userId = authSession?.user?.id ?? parsedMeta.data.userId

    if (!userId && checkoutSession.customer_details?.email) {
      const user = await prisma.user.findUnique({
        where: { email: checkoutSession.customer_details.email.toLowerCase() },
      })
      if (user) userId = user.id
    }

    // --- Course card confirmation ---
    if (type === "course-card") {
      const cardType = parsedMeta.data.cardType
      if (!userId || !cardType) {
        return NextResponse.json({ ok: true, message: "Missing data, skipped" })
      }

      const sessionsCount = parseInt(cardType)
      const cardTypeLabel =
        cardType === "5" ? "CARD_5" : cardType === "10" ? "CARD_10" : "CARD_20"
      const expiryMonths = cardType === "5" ? 2 : cardType === "10" ? 4 : 6

      const expiresAt = new Date()
      expiresAt.setMonth(expiresAt.getMonth() + expiryMonths)

      try {
        await prisma.$transaction(async (tx) => {
          const payment = await tx.payment.create({
            data: {
              userId,
              stripeCheckoutSessionId: checkoutSession.id,
              amount: checkoutSession.amount_total ?? 0,
              currency: checkoutSession.currency ?? "eur",
              status: "COMPLETED",
              type: "COURSE_CARD",
            },
          })
          await tx.courseCard.create({
            data: {
              userId,
              paymentId: payment.id,
              type: cardTypeLabel,
              totalSessions: sessionsCount,
              remainingSessions: sessionsCount,
              expiresAt,
            },
          })
        })
        return NextResponse.json({ ok: true, message: "Course card created" })
      } catch (err) {
        if (isPaymentSessionDuplicate(err)) {
          return NextResponse.json({ ok: true, message: "Already processed" })
        }
        throw err
      }
    }

    // --- Subscription confirmation ---
    if (type === "subscription") {
      return NextResponse.json({ ok: true, message: "Subscription handled by webhook" })
    }

    // --- Booking confirmation ---
    if (type !== "booking") {
      return NextResponse.json({ ok: true, message: "Not a booking" })
    }

    const courseSessionId = parsedMeta.data.sessionId
    const isTrial = parsedMeta.data.isTrial === "true"

    if (!courseSessionId || !userId) {
      return NextResponse.json({ ok: true, message: "Missing data, skipped" })
    }

    const courseSession = await prisma.session.findUnique({
      where: { id: courseSessionId },
      include: {
        courseType: { select: { name: true } },
        instructor: { include: { user: { select: { name: true } } } },
      },
    })

    if (!courseSession) {
      return NextResponse.json({ error: "Session introuvable" }, { status: 404 })
    }

    const isFull = courseSession.currentParticipants >= courseSession.maxParticipants

    // Atomic transaction guarded by the Payment unique index. If the webhook
    // already created records for this Stripe session, P2002 fires and the
    // whole tx rolls back — no duplicate booking, no double increment.
    try {
      const [, booking] = await prisma.$transaction([
        prisma.payment.create({
          data: {
            userId,
            stripeCheckoutSessionId: checkoutSession.id,
            amount: checkoutSession.amount_total ?? 0,
            currency: checkoutSession.currency ?? "eur",
            status: "COMPLETED",
            type: isTrial ? "TRIAL" : "BOOKING",
          },
        }),
        prisma.booking.create({
          data: {
            userId,
            sessionId: courseSessionId,
            status: isFull ? "WAITLIST" : "CONFIRMED",
            paymentMethod: isTrial ? "TRIAL" : "UNIT",
            paymentStatus: "PAID",
          },
        }),
        ...(isFull
          ? []
          : [
              prisma.session.update({
                where: { id: courseSessionId },
                data: { currentParticipants: { increment: 1 } },
              }),
            ]),
      ])

      // Booking confirmation email is sent exclusively by the webhook handler
      // (src/app/api/webhook/route.ts) to avoid double-emails on race wins.
      return NextResponse.json({ ok: true, bookingId: booking.id })
    } catch (err) {
      if (isPaymentSessionDuplicate(err)) {
        const existing = await prisma.booking.findFirst({
          where: { userId, sessionId: courseSessionId, status: { not: "CANCELLED" } },
        })
        return NextResponse.json({
          ok: true,
          message: "Already processed",
          bookingId: existing?.id,
        })
      }
      throw err
    }
  } catch (err) {
    console.error("[checkout/confirm]", err)
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 })
  }
}
