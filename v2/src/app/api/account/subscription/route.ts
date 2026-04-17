import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { stripe } from "@/lib/stripe"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  const subscription = await prisma.subscription.findFirst({
    where: { userId: session.user.id, status: "ACTIVE" },
    orderBy: { currentPeriodEnd: "desc" },
  })

  if (!subscription) {
    return NextResponse.json({ subscription: null })
  }

  let stripeData: {
    cancelAtPeriodEnd?: boolean
    currentPeriodEnd?: number
    status?: string
  } | null = null

  if (subscription.stripeSubscriptionId) {
    try {
      const stripeSub = await stripe.subscriptions.retrieve(
        subscription.stripeSubscriptionId
      )
      stripeData = {
        cancelAtPeriodEnd: stripeSub.cancel_at_period_end,
        currentPeriodEnd: (stripeSub as unknown as { current_period_end?: number }).current_period_end,
        status: stripeSub.status,
      }
    } catch {
      // Stripe fetch failed — use DB data
    }
  }

  return NextResponse.json({
    subscription: {
      id: subscription.id,
      status: stripeData?.status ?? subscription.status,
      plan: subscription.maxSessionsPerMonth
        ? `${subscription.maxSessionsPerMonth} cours/mois`
        : "Illimité",
      currentPeriodEnd: stripeData?.currentPeriodEnd
        ? new Date(stripeData.currentPeriodEnd * 1000).toISOString()
        : subscription.currentPeriodEnd.toISOString(),
      cancelAtPeriodEnd:
        stripeData?.cancelAtPeriodEnd ?? subscription.cancelAtPeriodEnd,
      stripePriceId: subscription.stripePriceId,
    },
  })
}

export async function PATCH(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  const body = await request.json()
  const { action } = body as { action: "cancel" | "resume" }

  if (action !== "cancel" && action !== "resume") {
    return NextResponse.json(
      { error: "Action invalide. Utilisez 'cancel' ou 'resume'." },
      { status: 400 }
    )
  }

  const subscription = await prisma.subscription.findFirst({
    where: { userId: session.user.id, status: "ACTIVE" },
    orderBy: { currentPeriodEnd: "desc" },
  })

  if (!subscription) {
    return NextResponse.json(
      { error: "Aucun abonnement actif trouvé." },
      { status: 404 }
    )
  }

  if (!subscription.stripeSubscriptionId) {
    return NextResponse.json(
      { error: "Abonnement non lié à Stripe." },
      { status: 400 }
    )
  }

  const cancelAtPeriodEnd = action === "cancel"

  try {
    await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
      cancel_at_period_end: cancelAtPeriodEnd,
    })

    const updated = await prisma.subscription.update({
      where: { id: subscription.id },
      data: { cancelAtPeriodEnd },
    })

    return NextResponse.json({
      subscription: {
        id: updated.id,
        status: updated.status,
        cancelAtPeriodEnd: updated.cancelAtPeriodEnd,
        currentPeriodEnd: updated.currentPeriodEnd.toISOString(),
      },
    })
  } catch {
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour de l'abonnement." },
      { status: 500 }
    )
  }
}
