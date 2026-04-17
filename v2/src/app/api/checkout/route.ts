import { NextRequest, NextResponse } from "next/server"
import { stripe, SESSION_PRICE_CENTS } from "@/lib/stripe"
import { rateLimit } from "@/lib/rate-limit"
import { sanitizeString, isAllowedOrigin } from "@/lib/utils"
import { auth } from "@/lib/auth"

const VALID_MODES = ["booking", "gift-card", "course-card", "subscription"] as const
type CheckoutMode = (typeof VALID_MODES)[number]

const GIFT_CARD_OPTIONS: Record<number, number> = {
  1: 18_00,
  5: 80_00,
  10: 150_00,
}

const COURSE_CARD_PRICES: Record<string, { cents: number; label: string }> = {
  "5": { cents: 80_00, label: "Carte 5 cours" },
  "10": { cents: 150_00, label: "Carte 10 cours" },
  "20": { cents: 260_00, label: "Carte 20 cours" },
}

/** Max lengths for user-provided strings */
const MAX_ITEM_NAME = 100
const MAX_METADATA_KEY = 40
const MAX_METADATA_VALUE = 500

export async function POST(req: NextRequest) {
  // Origin check — reject cross-origin requests
  const origin = req.headers.get("origin")
  if (!isAllowedOrigin(origin)) {
    return NextResponse.json(
      { error: "Origine non autorisée." },
      { status: 403 }
    )
  }

  // Rate limit: 10 checkout attempts per minute per IP
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown"
  const { allowed } = rateLimit(`checkout:${ip}`, { maxRequests: 10, windowMs: 60_000 })
  if (!allowed) {
    return NextResponse.json(
      { error: "Trop de tentatives. Veuillez patienter." },
      { status: 429 }
    )
  }

  try {
    const body = await req.json()
    const { mode, items, metadata, cardType } = body as {
      mode: string
      items?: { name: string; price: number; quantity: number }[]
      metadata?: Record<string, string>
      cardType?: string
    }

    if (!mode || !VALID_MODES.includes(mode as CheckoutMode)) {
      return NextResponse.json({ error: "Mode invalide" }, { status: 400 })
    }

    // Get current user if logged in
    const authSession = await auth()
    const userId = authSession?.user?.id ?? ""

    // --- Course card checkout ---
    if (mode === "course-card") {
      if (!cardType || !COURSE_CARD_PRICES[cardType]) {
        return NextResponse.json({ error: "Type de carte invalide" }, { status: 400 })
      }

      const card = COURSE_CARD_PRICES[cardType]

      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card", "link"],
        allow_promotion_codes: true,
        locale: "fr",
        line_items: [
          {
            price_data: {
              currency: "eur",
              product_data: { name: card.label },
              unit_amount: card.cents,
            },
            quantity: 1,
          },
        ],
        metadata: {
          type: "course-card",
          cardType,
          userId,
        },
        success_url: `${origin}/reservation/succes?session_id={CHECKOUT_SESSION_ID}&type=card`,
        cancel_url: `${origin}/tarifs`,
      })

      return NextResponse.json({ url: session.url })
    }

    // --- Subscription checkout ---
    if (mode === "subscription") {
      const priceId = process.env.STRIPE_PRICE_MONTHLY_ID
      if (!priceId) {
        console.error("[checkout] STRIPE_PRICE_MONTHLY_ID not set")
        return NextResponse.json({ error: "Configuration manquante" }, { status: 500 })
      }

      const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        payment_method_types: ["card", "link"],
        allow_promotion_codes: true,
        locale: "fr",
        line_items: [{ price: priceId, quantity: 1 }],
        metadata: {
          type: "subscription",
          userId,
        },
        success_url: `${origin}/reservation/succes?session_id={CHECKOUT_SESSION_ID}&type=subscription`,
        cancel_url: `${origin}/tarifs`,
      })

      return NextResponse.json({ url: session.url })
    }

    // --- Booking & Gift-card checkout (existing logic) ---
    if (!items?.length || items.length > 10) {
      return NextResponse.json({ error: "Articles invalides" }, { status: 400 })
    }

    // Sanitize metadata values
    const sanitizedMetadata: Record<string, string> = {}
    if (metadata && typeof metadata === "object") {
      for (const [key, value] of Object.entries(metadata)) {
        if (typeof key === "string" && typeof value === "string") {
          const safeKey = sanitizeString(key, MAX_METADATA_KEY)
          const safeValue = sanitizeString(value, MAX_METADATA_VALUE)
          if (safeKey) {
            sanitizedMetadata[safeKey] = safeValue
          }
        }
      }
    }

    const line_items = items.map((item) => {
      // Sanitize item name
      const safeName = sanitizeString(
        typeof item.name === "string" ? item.name : "Article",
        MAX_ITEM_NAME
      )
      if (!safeName) {
        throw new Error("Nom d'article manquant")
      }

      let unitAmount: number

      if (mode === "booking") {
        unitAmount = SESSION_PRICE_CENTS
      } else {
        const giftPrice = GIFT_CARD_OPTIONS[item.quantity]
        if (giftPrice) {
          unitAmount = giftPrice
        } else {
          const cents = Math.round(item.price * 100)
          if (cents < 10_00 || cents > 500_00) {
            throw new Error("Montant carte cadeau invalide")
          }
          unitAmount = cents
        }
      }

      return {
        price_data: {
          currency: "eur" as const,
          product_data: { name: safeName },
          unit_amount: unitAmount,
        },
        quantity: mode === "booking" ? 1 : item.quantity,
      }
    })

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      locale: "fr",
      line_items,
      metadata: {
        type: mode,
        userId,
        ...sanitizedMetadata,
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
