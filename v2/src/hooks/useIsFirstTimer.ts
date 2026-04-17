"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"

/**
 * Returns whether the visitor is eligible for the trial-class offer.
 * - Unauthenticated visitors: always true (show trial).
 * - Authenticated users: true only if they have zero non-cancelled bookings.
 * - Returns null while loading so callers can avoid flicker.
 */
export function useIsFirstTimer(): boolean | null {
  const { data: session, status } = useSession()
  const [isFirstTimer, setIsFirstTimer] = useState<boolean | null>(null)

  useEffect(() => {
    if (status === "loading") return

    if (status === "unauthenticated" || !session?.user) {
      setIsFirstTimer(true)
      return
    }

    let cancelled = false
    fetch("/api/me/is-first-timer")
      .then((r) => (r.ok ? r.json() : { isFirstTimer: true }))
      .then((data) => {
        if (!cancelled) setIsFirstTimer(Boolean(data.isFirstTimer))
      })
      .catch(() => {
        if (!cancelled) setIsFirstTimer(true)
      })

    return () => {
      cancelled = true
    }
  }, [session, status])

  return isFirstTimer
}
