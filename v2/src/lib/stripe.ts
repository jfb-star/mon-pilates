import Stripe from "stripe"

const key = process.env.STRIPE_SECRET_KEY
// Use a placeholder key at module load so the app can boot before Stripe is configured.
// Any actual Stripe call will fail with a clear Stripe error until the real key is set.
export const stripe = new Stripe(key || "sk_test_placeholder_unconfigured", {
  apiVersion: "2026-03-25.dahlia",
  typescript: true,
})

export const stripeConfigured = Boolean(key)

/** Unit price for a single Pilates session (in cents). */
export const SESSION_PRICE_CENTS = 18_00
