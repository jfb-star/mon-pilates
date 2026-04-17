"use client"

import { ScrollReveal } from "@/components/ui/ScrollReveal"
import { useIsFirstTimer } from "@/hooks/useIsFirstTimer"
import { PricingCard } from "./PricingCard"

type PricingPlan = Parameters<typeof PricingCard>[0]["plan"] & {
  isTrial?: boolean
}

export function PricingGrid({ plans }: { plans: PricingPlan[] }) {
  const isFirstTimer = useIsFirstTimer()
  const visiblePlans =
    isFirstTimer === false ? plans.filter((p) => !p.isTrial) : plans

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pt-2">
      {visiblePlans.map((plan, index) => (
        <ScrollReveal key={plan.name} delay={(index % 3) as 0 | 1 | 2}>
          <PricingCard plan={plan} />
        </ScrollReveal>
      ))}
    </div>
  )
}
