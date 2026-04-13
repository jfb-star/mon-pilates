import Stripe from "stripe"

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-03-25.dahlia",
  typescript: true,
})

/** Unit price for a single Pilates session (in cents). */
export const SESSION_PRICE_CENTS = 18_00
