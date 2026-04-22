"use client"

import { useEffect } from "react"

/**
 * Registers `/sw.js` at the origin root. Production-only so the dev loop
 * (HMR, Turbopack) isn't interfered with — a stale SW in dev causes the kind
 * of "why isn't my change showing up" pain we don't want.
 *
 * Paired with the `Service-Worker-Allowed: /` header set in next.config.ts
 * for `/sw.js`, which lets the SW control the entire origin from its file
 * location.
 */
export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (
      "serviceWorker" in navigator &&
      process.env.NODE_ENV === "production"
    ) {
      navigator.serviceWorker.register("/sw.js").catch(() => {})
    }
  }, [])
  return null
}
