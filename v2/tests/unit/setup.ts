/**
 * Vitest global setup — runs once per worker before any test file.
 *
 * Sets placeholder env vars that the lib modules read at import time so
 * tests don't blow up on missing configuration. Tests that need specific
 * values may still override process.env locally.
 */

if (!process.env.NODE_ENV) {
  Object.defineProperty(process.env, "NODE_ENV", { value: "test", configurable: true })
}

// Database
process.env.DATABASE_URL =
  process.env.DATABASE_URL ?? "postgresql://test:test@localhost:5432/test"
process.env.DIRECT_URL =
  process.env.DIRECT_URL ?? process.env.DATABASE_URL

// Auth
process.env.NEXTAUTH_SECRET =
  process.env.NEXTAUTH_SECRET ?? "test-nextauth-secret"
process.env.AUTH_SECRET = process.env.AUTH_SECRET ?? "test-auth-secret"
process.env.NEXTAUTH_URL = process.env.NEXTAUTH_URL ?? "http://localhost:3456"

// Site
process.env.NEXT_PUBLIC_SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://v2.mon-pilates.bzh"

// Email
process.env.RESEND_API_KEY = process.env.RESEND_API_KEY ?? "re_test_key"
process.env.RESEND_FROM =
  process.env.RESEND_FROM ?? "Mon Pilates <test@resend.dev>"
process.env.UNSUBSCRIBE_SECRET =
  process.env.UNSUBSCRIBE_SECRET ?? "test-unsubscribe-secret"
process.env.CONTACT_EMAIL =
  process.env.CONTACT_EMAIL ?? "contact@mon-pilates.bzh"

// Stripe
process.env.STRIPE_SECRET_KEY =
  process.env.STRIPE_SECRET_KEY ?? "sk_test_dummy"
process.env.STRIPE_WEBHOOK_SECRET =
  process.env.STRIPE_WEBHOOK_SECRET ?? "whsec_test_dummy"
process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "pk_test_dummy"

// Cron
process.env.CRON_SECRET = process.env.CRON_SECRET ?? "test-cron-secret"

// Explicitly clear Vercel prod marker so origin checks behave like dev.
delete process.env.VERCEL_ENV
