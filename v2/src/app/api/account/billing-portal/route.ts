import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { stripe } from "@/lib/stripe"

export async function POST() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  // Find a payment with a Stripe checkout session to derive the customer ID
  const payment = await prisma.payment.findFirst({
    where: {
      userId: session.user.id,
      stripeCheckoutSessionId: { not: null },
      status: "COMPLETED",
    },
    orderBy: { createdAt: "desc" },
    select: { stripeCheckoutSessionId: true },
  })

  if (!payment?.stripeCheckoutSessionId) {
    return NextResponse.json(
      { error: "Aucun paiement Stripe trouvé. Impossible d'accéder au portail." },
      { status: 404 }
    )
  }

  try {
    // Retrieve the Stripe checkout session to get the customer ID
    const checkoutSession = await stripe.checkout.sessions.retrieve(
      payment.stripeCheckoutSessionId
    )

    const stripeCustomerId = checkoutSession.customer as string | null
    if (!stripeCustomerId) {
      return NextResponse.json(
        { error: "Aucun client Stripe associé." },
        { status: 404 }
      )
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: `${process.env.NEXTAUTH_URL}/compte`,
    })

    return NextResponse.json({ url: portalSession.url })
  } catch {
    return NextResponse.json(
      { error: "Erreur lors de la création du portail de facturation." },
      { status: 500 }
    )
  }
}
