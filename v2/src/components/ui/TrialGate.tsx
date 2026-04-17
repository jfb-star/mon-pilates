"use client"

import Link from "next/link"
import type { ReactNode } from "react"
import { useIsFirstTimer } from "@/hooks/useIsFirstTimer"

/**
 * Renders children only when the visitor is eligible for the trial offer
 * (unauthenticated or has zero bookings). Null for returning customers.
 */
export function FirstTimerOnly({ children }: { children: ReactNode }) {
  const isFirstTimer = useIsFirstTimer()
  if (isFirstTimer === false) return null
  return <>{children}</>
}

/**
 * Link-style CTA that swaps between a trial offer and a generic reservation label
 * based on first-timer eligibility.
 */
export function TrialCtaLink({
  href = "/planning",
  className,
  icon,
  trialLabel,
  returningLabel,
}: {
  href?: string
  className?: string
  icon?: ReactNode
  trialLabel: string
  returningLabel: string
}) {
  const isFirstTimer = useIsFirstTimer()
  const showTrial = isFirstTimer !== false
  return (
    <Link href={href} className={className}>
      {icon}
      {showTrial ? trialLabel : returningLabel}
    </Link>
  )
}
