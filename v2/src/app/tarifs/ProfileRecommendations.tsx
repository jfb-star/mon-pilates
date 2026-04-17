"use client"

import { ScrollReveal } from "@/components/ui/ScrollReveal"
import { useIsFirstTimer } from "@/hooks/useIsFirstTimer"

type Item = {
  profile: string
  recommendation: string
  detail: string
  color: string
  isTrial?: boolean
}

export function ProfileRecommendations({ items }: { items: Item[] }) {
  const isFirstTimer = useIsFirstTimer()
  const visible = isFirstTimer === false ? items.filter((i) => !i.isTrial) : items

  return (
    <div className="space-y-4">
      {visible.map((item, i) => (
        <ScrollReveal key={item.profile} delay={Math.min(i, 3) as 0 | 1 | 2 | 3}>
          <div className={`rounded-xl border-l-4 p-5 ${item.color}`}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <p className="font-heading text-sm font-semibold text-mp-charcoal">
                  {item.profile}
                </p>
                <p className="font-body text-xs text-mp-text-light mt-1">
                  {item.detail}
                </p>
              </div>
              <span className="font-heading text-sm font-bold text-mp-ocean whitespace-nowrap">
                &rarr; {item.recommendation}
              </span>
            </div>
          </div>
        </ScrollReveal>
      ))}
    </div>
  )
}
