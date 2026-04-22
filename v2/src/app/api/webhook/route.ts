import { NextRequest, NextResponse } from "next/server"
import { randomInt } from "crypto"
import { stripe } from "@/lib/stripe"
import { prisma } from "@/lib/prisma"
import Stripe from "stripe"
import { sendBookingConfirmation, sendGiftCard } from "@/lib/email"

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get("stripe-signature")

  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 })
  }

  let event: Stripe.Event

  const secret = process.env.STRIPE_WEBHOOK_SECRET
  if (!secret) {
    console.error("[webhook] STRIPE_WEBHOOK_SECRET not configured")
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 })
  }

  try {
    event = stripe.webhooks.constructEvent(body, sig, secret)
  } catch (err) {
    console.error("[webhook] Signature verification failed:", err)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  // Idempotency: record event.id before processing. Stripe retries at-least-once,
  // so a duplicate event would otherwise double-create bookings/gift cards.
  try {
    await prisma.stripeWebhookEvent.create({
      data: { eventId: event.id, type: event.type },
    })
  } catch {
    // Unique constraint = already processed. Ack so Stripe stops retrying.
    return NextResponse.json({ received: true, duplicate: true })
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session
      const type = session.metadata?.type

      if (type === "booking") {
        const sessionId = session.metadata?.sessionId
        const userId = session.metadata?.userId
        const email = session.customer_details?.email
        const isTrial = session.metadata?.isTrial === "true"

        console.log("[webhook] Booking confirmed:", {
          sessionId,
          userId,
          email,
          isTrial,
        })

        // Find or create user from email
        let bookingUserId = userId
        if (!bookingUserId && email) {
          const user = await prisma.user.findUnique({
            where: { email: email.toLowerCase() },
          })
          if (user) bookingUserId = user.id
        }

        // Create booking in DB if we have a session and user
        if (sessionId && bookingUserId) {
          try {
            // Check session exists
            const courseSession = await prisma.session.findUnique({
              where: { id: sessionId },
              include: {
                courseType: { select: { name: true } },
                instructor: { include: { user: { select: { name: true } } } },
              },
            })

            if (courseSession) {
              // Check not already booked
              const existing = await prisma.booking.findFirst({
                where: {
                  userId: bookingUserId,
                  sessionId,
                  status: { not: "CANCELLED" },
                },
              })

              if (!existing) {
                const isFull = courseSession.currentParticipants >= courseSession.maxParticipants

                await prisma.$transaction([
                  prisma.booking.create({
                    data: {
                      userId: bookingUserId,
                      sessionId,
                      status: isFull ? "WAITLIST" : "CONFIRMED",
                      paymentMethod: isTrial ? "TRIAL" : "UNIT",
                      paymentStatus: "PAID",
                    },
                  }),
                  ...(isFull
                    ? []
                    : [
                        prisma.session.update({
                          where: { id: sessionId },
                          data: { currentParticipants: { increment: 1 } },
                        }),
                      ]),
                ])

                // Save payment record
                await prisma.payment.create({
                  data: {
                    userId: bookingUserId,
                    stripeCheckoutSessionId: session.id,
                    amount: session.amount_total ?? 0,
                    currency: session.currency ?? "eur",
                    status: "COMPLETED",
                    type: isTrial ? "TRIAL" : "BOOKING",
                  },
                })

                console.log("[webhook] Booking created in DB for user", bookingUserId)

                // Send booking confirmation email (non-blocking)
                if (!isFull) {
                  const userEmail = email || (await prisma.user.findUnique({ where: { id: bookingUserId! }, select: { email: true } }))?.email
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
              }
            }
          } catch (err) {
            console.error("[webhook] Failed to create booking:", err)
          }
        }
      } else if (type === "course-card") {
        const cardType = session.metadata?.cardType
        const userId = session.metadata?.userId

        console.log("[webhook] Course card purchased:", { cardType, userId })

        if (userId && cardType) {
          try {
            const sessionsCount = parseInt(cardType)
            const cardTypeLabel =
              cardType === "5" ? "CARD_5" : cardType === "10" ? "CARD_10" : "CARD_20"
            const expiryMonths = cardType === "5" ? 2 : cardType === "10" ? 4 : 6

            const expiresAt = new Date()
            expiresAt.setMonth(expiresAt.getMonth() + expiryMonths)

            const payment = await prisma.payment.create({
              data: {
                userId,
                stripeCheckoutSessionId: session.id,
                amount: session.amount_total ?? 0,
                currency: session.currency ?? "eur",
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

            console.log("[webhook] Course card created for user", userId)
          } catch (err) {
            console.error("[webhook] Failed to create course card:", err)
          }
        }
      } else if (type === "subscription") {
        const userId = session.metadata?.userId
        const subscriptionId = session.subscription as string | null

        console.log("[webhook] Subscription created:", { userId, subscriptionId })

        if (userId && subscriptionId) {
          try {
            // Create payment record
            await prisma.payment.create({
              data: {
                userId,
                stripeCheckoutSessionId: session.id,
                amount: session.amount_total ?? 0,
                currency: session.currency ?? "eur",
                status: "COMPLETED",
                type: "SUBSCRIPTION",
              },
            })

            // Retrieve subscription details from Stripe
            const stripeSubscription = await stripe.subscriptions.retrieve(subscriptionId)
            const firstItem = stripeSubscription.items.data[0]

            await prisma.subscription.create({
              data: {
                userId,
                stripeSubscriptionId: subscriptionId,
                stripePriceId: firstItem?.price?.id ?? null,
                status: "ACTIVE",
                currentPeriodStart: new Date((firstItem?.current_period_start ?? Math.floor(Date.now() / 1000)) * 1000),
                currentPeriodEnd: new Date((firstItem?.current_period_end ?? Math.floor(Date.now() / 1000) + 30 * 86400) * 1000),
              },
            })

            console.log("[webhook] Subscription created for user", userId)
          } catch (err) {
            console.error("[webhook] Failed to create subscription:", err)
          }
        }
      } else if (type === "settle-unpaid") {
        const userId = session.metadata?.userId
        const bookingIdsRaw = session.metadata?.bookingIds
        const bookingIds = bookingIdsRaw ? bookingIdsRaw.split(",").filter(Boolean) : []

        console.log("[webhook] Settling unpaid bookings:", { userId, count: bookingIds.length })

        if (userId && bookingIds.length > 0) {
          try {
            await prisma.booking.updateMany({
              where: {
                id: { in: bookingIds },
                userId,
                paymentStatus: "PENDING",
              },
              data: {
                paymentStatus: "PAID",
                paymentMethod: "UNIT",
                paidAt: new Date(),
              },
            })
            await prisma.payment.create({
              data: {
                userId,
                stripeCheckoutSessionId: session.id,
                amount: session.amount_total ?? 0,
                currency: session.currency ?? "eur",
                status: "COMPLETED",
                type: "BOOKING",
              },
            })
            console.log("[webhook] Unpaid bookings settled for user", userId)
          } catch (err) {
            console.error("[webhook] Failed to settle unpaid bookings:", err)
          }
        }
      } else if (type === "gift-card") {
        const code = generateGiftCardCode()
        const recipientEmail = session.metadata?.recipientEmail
        const recipientName = session.metadata?.recipientName
        const senderName = session.metadata?.senderName
        const senderEmail = session.metadata?.senderEmail
        const personalMessage = session.metadata?.personalMessage
        const giftType = session.metadata?.giftType
        const amountCents = session.amount_total ?? 0

        console.log("[webhook] Gift card purchased:", { code, recipientEmail, senderName, amountCents })

        try {
          // Parse sessions count from label if applicable
          const label = session.metadata?.label ?? ""
          const sessionsMatch = label.match(/^(\d+) cours/)
          const sessionsCount = sessionsMatch ? parseInt(sessionsMatch[1]) : null

          await prisma.giftCard.create({
            data: {
              code,
              purchaserEmail: senderEmail ?? session.customer_details?.email ?? "",
              recipientEmail: recipientEmail ?? "",
              recipientName: recipientName ?? null,
              message: personalMessage ?? null,
              amount: giftType === "amount" ? amountCents : null,
              sessions: sessionsCount,
              remainingAmount: giftType === "amount" ? amountCents : null,
              remainingSessions: sessionsCount,
              status: "ACTIVE",
              expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
            },
          })

          console.log("[webhook] Gift card saved to DB:", code)

          // Send gift card email to recipient (non-blocking)
          if (recipientEmail) {
            sendGiftCard({
              to: recipientEmail,
              recipientName: recipientName || "Cher(e) ami(e)",
              senderName: senderName || "Un(e) ami(e)",
              message: personalMessage || undefined,
              code,
              sessions: sessionsCount ?? undefined,
              amount: giftType === "amount" ? amountCents : undefined,
            }).catch(() => {})
          }
        } catch (err) {
          console.error("[webhook] Failed to save gift card:", err)
        }
      }
      break
    }
    default:
      console.log(`[webhook] Unhandled event type: ${event.type}`)
  }

  return NextResponse.json({ received: true })
}

function generateGiftCardCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
  let code = "MP-"
  for (let i = 0; i < 8; i++) {
    code += chars[randomInt(chars.length)]
    if (i === 3) code += "-"
  }
  return code
}
