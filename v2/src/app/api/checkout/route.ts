import { NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { mode, items, metadata } = body as {
      mode: "booking" | "gift-card"
      items: { name: string; price: number; quantity: number }[]
      metadata?: Record<string, string>
    }

    if (!items?.length) {
      return NextResponse.json({ error: "Aucun article" }, { status: 400 })
    }

    const origin = req.headers.get("origin") || "http://localhost:3456"

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      locale: "fr",
      line_items: items.map((item) => ({
        price_data: {
          currency: "eur",
          product_data: { name: item.name },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })),
      metadata: {
        type: mode,
        ...metadata,
      },
      success_url: `${origin}/reservation/succes?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/reservation/annulation`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error("[checkout]", err)
    const message = err instanceof Error ? err.message : "Erreur interne"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
