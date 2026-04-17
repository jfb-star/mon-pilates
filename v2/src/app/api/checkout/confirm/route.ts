import { NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { sendBookingConfirmation } from "@/lib/email"

/**
 * POST /api/checkout/confirm
 * Called after Stripe redirect to ensure booking is created.
 * This is a fallback for when the webhook hasn't fired yet
 * (e.g. local dev where Stripe can't reach localhost).
 */
export async function POST(req: NextRequest) {
  try {
    const { sessionId } = (await req.json()) as { sessionId: string }
    if (!sessionId || typeof sessionId !== "string") {
      return NextResponse.json({ error: "Session ID requis" }, { status: 400 })
    }

    // Retrieve the Stripe checkout session
    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId)

    if (checkoutSession.payment_status !== "paid") {
      return NextResponse.json({ error: "Paiement non confirmé" }, { status: 400 })
    }

    const type = checkoutSession.metadata?.type

    // Get user from auth or from Stripe metadata
    const authSession = await auth()
    let userId = authSession?.user?.id ?? checkoutSession.metadata?.userId

    if (!userId && checkoutSession.customer_details?.email) {
      const user = await prisma.user.findUnique({
        where: { email: checkoutSession.customer_details.email.toLowerCase() },
      })
      if (user) userId = user.id
    }

    // --- Course card confirmation ---
    if (type === "course-card") {
      const cardType = checkoutSession.metadata?.cardType
      if (!userId || !cardType) {
        return NextResponse.json({ ok: true, message: "Missing data, skipped" })
      }

      // Check if already created by webhook
      const existingPayment = await prisma.payment.findFirst({
        where: { stripeCheckoutSessionId: checkoutSession.id },
      })
      if (existingPayment) {
        return NextResponse.json({ ok: true, message: "Already processed" })
      }

      const sessionsCount = parseInt(cardType)
      const cardTypeLabel =
        cardType === "5" ? "CARD_5" : cardType === "10" ? "CARD_10" : "CARD_20"
      const expiryMonths = cardType === "5" ? 2 : cardType === "10" ? 4 : 6

      const expiresAt = new Date()
      expiresAt.setMonth(expiresAt.getMonth() + expiryMonths)

      const payment = await prisma.payment.create({
        data: {
          userId,
          stripeCheckoutSessionId: checkoutSession.id,
          amount: checkoutSession.amount_total ?? 0,
          currency: checkoutSession.currency ?? "eur",
          status: "COMPLETED",
          type: "COURSE_CARD",
        },
      })

      await prisma.courseCard.create({
        data: {
          userId,
          paymentId: payment.id,
          type: cardTypeLabel,
          totalSessions: sessionsCount,
          remainingSessions: sessionsCount,
          expiresAt,
        },
      })

      return NextResponse.json({ ok: true, message: "Course card created" })
    }

    // --- Subscription confirmation ---
    if (type === "subscription") {
      // Subscriptions are fully handled by webhook (needs Stripe subscription object)
      return NextResponse.json({ ok: true, message: "Subscription handled by webhook" })
    }

    // --- Booking confirmation (existing logic) ---
    if (type !== "booking") {
      return NextResponse.json({ ok: true, message: "Not a booking" })
    }

    const courseSessionId = checkoutSession.metadata?.sessionId
    const isTrial = checkoutSession.metadata?.isTrial === "true"

    if (!courseSessionId || !userId) {
      return NextResponse.json({ ok: true, message: "Missing data, skipped" })
    }

    // Check if booking already exists (webhook might have already created it)
    const existing = await prisma.booking.findFirst({
      where: {
        userId,
        sessionId: courseSessionId,
        status: { not: "CANCELLED" },
      },
    })

    if (existing) {
      return NextResponse.json({ ok: true, message: "Already booked", bookingId: existing.id })
    }

    // Check session exists
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

    // Create booking + payment in transaction
    const [booking] = await prisma.$transaction([
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
    ])

    // Send booking confirmation email (non-blocking)
    if (!isFull) {
      const userEmail = checkoutSession.customer_details?.email || authSession?.user?.email
      if (userEmail) {
        sendBookingConfirmation({
          to: userEmail,
          courseName: courseSession.courseType?.name || "Pilates",
          date: courseSession.date.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" }),
          time: courseSession.startTime,
          instructor: courseSession.instructor?.user?.name || "L'équipe",
        }).catch(() => {})
      }
    }

    return NextResponse.json({ ok: true, bookingId: booking.id })
  } catch (err) {
    console.error("[checkout/confirm]", err)
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 })
  }
}
