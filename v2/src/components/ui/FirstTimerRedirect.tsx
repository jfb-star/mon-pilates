"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useIsFirstTimer } from "@/hooks/useIsFirstTimer"

/**
 * Redirects non-first-timers to `to` (default /planning) so the trial-focused
 * page is only visible to eligible visitors.
 */
export function FirstTimerRedirect({ to = "/planning" }: { to?: string }) {
  const router = useRouter()
  const isFirstTimer = useIsFirstTimer()

  useEffect(() => {
    if (isFirstTimer === false) {
      router.replace(to)
    }
  }, [isFirstTimer, router, to])

  return null
}
