"use client"

import { useEffect, useRef } from "react"

/**
 * Client component that calls /api/checkout/confirm on mount.
 * Ensures the booking is saved to DB even if the Stripe webhook
 * hasn't fired yet (e.g. localhost where webhooks can't reach).
 */
export function ConfirmBooking({ sessionId }: { sessionId: string }) {
  const called = useRef(false)

  useEffect(() => {
    if (called.current) return
    called.current = true

    fetch("/api/checkout/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId }),
    }).catch(() => {
      // Silent fail — webhook will handle it in production
    })
  }, [sessionId])

  return null
}
