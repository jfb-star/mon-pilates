/**
 * Environment variable validation.
 * Throws at startup if required variables are missing.
 */

function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }
  return value
}

function optionalEnv(name: string): string | undefined {
  return process.env[name] || undefined
}

/**
 * Canonical site URL — drives metadataBase, sitemap, robots, OG tags, email
 * links, and structured-data. Reads NEXT_PUBLIC_SITE_URL (inlined at build).
 * Falls back to the current prod URL to avoid a hard failure if unset.
 */
export const SITE_URL: string = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://v2.mon-pilates.bzh"
).replace(/\/$/, "")

// Getters defer validation to access time. This keeps `env.ts` safe to import
// from client components that only need `SITE_URL` — otherwise the top-level
// `requireEnv("DATABASE_URL")` would throw in the browser where DATABASE_URL
// is (correctly) not inlined.
export const env = {
  // Database
  get DATABASE_URL() { return requireEnv("DATABASE_URL") },
  get DIRECT_URL() { return optionalEnv("DIRECT_URL") },

  // Auth
  get AUTH_SECRET() { return requireEnv("AUTH_SECRET") },
  get NEXTAUTH_URL() { return optionalEnv("NEXTAUTH_URL") },

  // Stripe — optional at boot so first deploy doesn't crash before webhook is configured.
  // Runtime code that actually needs these must check and fail gracefully.
  get STRIPE_SECRET_KEY() { return optionalEnv("STRIPE_SECRET_KEY") },
  get STRIPE_WEBHOOK_SECRET() { return optionalEnv("STRIPE_WEBHOOK_SECRET") },
  get NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY() { return optionalEnv("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY") },

  // OAuth providers (optional)
  get GOOGLE_CLIENT_ID() { return optionalEnv("GOOGLE_CLIENT_ID") },
  get GOOGLE_CLIENT_SECRET() { return optionalEnv("GOOGLE_CLIENT_SECRET") },
  get APPLE_CLIENT_ID() { return optionalEnv("APPLE_CLIENT_ID") },
  get APPLE_CLIENT_SECRET() { return optionalEnv("APPLE_CLIENT_SECRET") },

  // Cron
  get CRON_SECRET() { return optionalEnv("CRON_SECRET") },

  // Optional services
  get GA4_ID() { return optionalEnv("NEXT_PUBLIC_GA4_ID") },
  get BREVO_API_KEY() { return optionalEnv("BREVO_API_KEY") },
  get RESEND_API_KEY() { return optionalEnv("RESEND_API_KEY") },
  get CONTACT_EMAIL() { return optionalEnv("CONTACT_EMAIL") || "contact@mon-pilates.bzh" },
}

/**
 * Sentry DSN (server/edge runtimes).
 *
 * Lazy getter — reads `SENTRY_DSN` at access time. Returns `null` when unset
 * so callers can skip `Sentry.init` without throwing (Sentry is optional).
 *
 * Valeur prod attendue:
 *   https://fe851ac1067a062079c9035b1b739cdf@o4511053436157952.ingest.de.sentry.io/4511256558764112
 */
export function getSentryDsn(): string | null {
  return process.env.SENTRY_DSN || null
}
