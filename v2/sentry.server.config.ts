/**
 * Sentry — server runtime (Node.js) initialization.
 * Loaded by src/instrumentation.ts when NEXT_RUNTIME === "nodejs".
 * DSN is read from NEXT_PUBLIC_SENTRY_DSN so prod & preview deploys share the config.
 */
import * as Sentry from "@sentry/nextjs"

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN

if (dsn) {
  Sentry.init({
    dsn,
    environment: process.env.VERCEL_ENV || process.env.NODE_ENV,
    tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
    // Avoid leaking PII — we already strip email/userId from manual captures.
    sendDefaultPii: false,
    // Breadcrumbs default on; trim to keep payloads small.
    maxBreadcrumbs: 50,
  })
}
