/**
 * Next.js root instrumentation — loads Sentry runtime configs.
 *
 * register() is called once per runtime when the server boots.
 * onRequestError wires App Router server errors (Server Components,
 * Route Handlers, Server Actions) into Sentry without per-route try/catch.
 */
import * as Sentry from "@sentry/nextjs"

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("../sentry.server.config")
  }
  if (process.env.NEXT_RUNTIME === "edge") {
    await import("../sentry.edge.config")
  }
}

export const onRequestError = Sentry.captureRequestError
