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

export const env = {
  // Database
  DATABASE_URL: requireEnv("DATABASE_URL"),
  DIRECT_URL: optionalEnv("DIRECT_URL"),

  // Auth
  AUTH_SECRET: requireEnv("AUTH_SECRET"),
  NEXTAUTH_URL: optionalEnv("NEXTAUTH_URL"),

  // Stripe — optional at boot so first deploy doesn't crash before webhook is configured.
  // Runtime code that actually needs these must check and fail gracefully.
  STRIPE_SECRET_KEY: optionalEnv("STRIPE_SECRET_KEY"),
  STRIPE_WEBHOOK_SECRET: optionalEnv("STRIPE_WEBHOOK_SECRET"),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: optionalEnv("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"),

  // OAuth providers (optional)
  GOOGLE_CLIENT_ID: optionalEnv("GOOGLE_CLIENT_ID"),
  GOOGLE_CLIENT_SECRET: optionalEnv("GOOGLE_CLIENT_SECRET"),
  APPLE_CLIENT_ID: optionalEnv("APPLE_CLIENT_ID"),
  APPLE_CLIENT_SECRET: optionalEnv("APPLE_CLIENT_SECRET"),

  // Cron
  CRON_SECRET: optionalEnv("CRON_SECRET"),

  // Optional services
  GA4_ID: optionalEnv("NEXT_PUBLIC_GA4_ID"),
  BREVO_API_KEY: optionalEnv("BREVO_API_KEY"),
  RESEND_API_KEY: optionalEnv("RESEND_API_KEY"),
  CONTACT_EMAIL: optionalEnv("CONTACT_EMAIL") || "contact@mon-pilates.bzh",
} as const
