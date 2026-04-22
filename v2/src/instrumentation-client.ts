/**
 * Sentry — browser initialization.
 * Executes after HTML load, before React hydration (Next 15.3+ convention).
 *
 * Perf: Sentry is dynamically imported only when a DSN is configured, so apps
 * deployed without Sentry don't ship ~50KB of gzipped SDK to every visitor.
 *
 * NOTE: `onRouterTransitionStart` MUST remain a synchronous named export —
 * Next.js App Router reads it eagerly to instrument navigation transitions.
 * If Sentry isn't loaded yet (or no DSN), we export a no-op to preserve the
 * contract; once `Sentry.init()` has resolved, we swap in the real handler.
 */

type RouterTransitionHandler = (
  ...args: unknown[]
) => void

let sentryRouterHandler: RouterTransitionHandler = () => {}

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN

if (dsn) {
  import("@sentry/nextjs").then((Sentry) => {
    Sentry.init({
      dsn,
      environment: process.env.NEXT_PUBLIC_VERCEL_ENV || "local",
      tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
      // Replay disabled by default — costs bandwidth and needs user consent (RGPD).
      replaysSessionSampleRate: 0,
      replaysOnErrorSampleRate: 0,
      sendDefaultPii: false,
    })
    sentryRouterHandler = Sentry.captureRouterTransitionStart as RouterTransitionHandler
  })
}

export const onRouterTransitionStart: RouterTransitionHandler = (...args) =>
  sentryRouterHandler(...args)
