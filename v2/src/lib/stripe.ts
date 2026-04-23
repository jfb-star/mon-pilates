import Stripe from "stripe"

const key = process.env.STRIPE_SECRET_KEY

// Fail fast in production: a missing secret key means every paid flow would
// silently 500 against a placeholder — cheaper to refuse to boot. In dev/test
// we fall back to a placeholder so the app boots without Stripe configured.
if (!key && process.env.NODE_ENV === "production") {
  throw new Error(
    "STRIPE_SECRET_KEY is required in production. Set it in the Vercel env or the deploy will crash on first checkout."
  )
}

export const stripe = new Stripe(key || "sk_test_placeholder_unconfigured", {
  apiVersion: "2026-03-25.dahlia",
  typescript: true,
})

export const stripeConfigured = Boolean(key)

/** Unit price for a single Pilates session (in cents). */
export const SESSION_PRICE_CENTS = 18_00
