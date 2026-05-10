"use client"

import { useState } from "react"
import { ScrollReveal } from "@/components/ui/ScrollReveal"
import { useIsFirstTimer } from "@/hooks/useIsFirstTimer"
import { PricingCard } from "./PricingCard"
import type { PricingPlan } from "@/lib/pricing-plans"

type Category = "tapis" | "machine" | "prive"

const TABS: { value: Category; label: string; sub: string }[] = [
  { value: "tapis", label: "Tapis", sub: "Petit groupe (5 max)" },
  { value: "machine", label: "Machine", sub: "Reformer (4 max)" },
  { value: "prive", label: "Privés", sub: "Sur appareils 1-à-1" },
]

export function PricingGrid({ plans }: { plans: PricingPlan[] }) {
  const isFirstTimer = useIsFirstTimer()
  const [activeTab, setActiveTab] = useState<Category>("tapis")

  const visiblePlans =
    isFirstTimer === false ? plans.filter((p) => !p.isTrial) : plans

  // Mobile: filter by tab. Desktop: show all (grid handles layout).
  const mobilePlans = visiblePlans.filter((p) => p.category === activeTab)

  return (
    <>
      {/* Mobile-only tab bar — sticky just under the page header so users
          stay anchored on their chosen category while scrolling cards. */}
      <div
        role="tablist"
        aria-label="Catégorie de cours"
        className="md:hidden sticky top-16 z-20 -mx-6 px-6 mb-6 bg-mp-white/95 backdrop-blur-sm border-b border-mp-sand-dark/30"
      >
        <div className="flex gap-2 py-3">
          {TABS.map((tab) => {
            const isActive = tab.value === activeTab
            return (
              <button
                key={tab.value}
                role="tab"
                aria-selected={isActive}
                aria-controls={`pricing-panel-${tab.value}`}
                onClick={() => setActiveTab(tab.value)}
                className={`flex-1 px-3 py-2.5 rounded-xl font-heading text-sm font-semibold transition-all border-2 ${
                  isActive
                    ? "bg-mp-ocean text-white border-mp-ocean shadow-md shadow-mp-ocean/20"
                    : "bg-white text-mp-charcoal border-mp-sand-dark/40 hover:border-mp-ocean/50"
                }`}
              >
                <span className="block leading-tight">{tab.label}</span>
                <span className={`block text-[11px] font-body font-normal mt-0.5 ${isActive ? "text-white/85" : "text-mp-text-muted"}`}>
                  {tab.sub}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Mobile: only the active category */}
      <div
        id={`pricing-panel-${activeTab}`}
        role="tabpanel"
        className="md:hidden grid grid-cols-1 gap-6"
      >
        {mobilePlans.map((plan, index) => (
          <ScrollReveal key={plan.name} delay={(index % 3) as 0 | 1 | 2}>
            <PricingCard plan={plan} />
          </ScrollReveal>
        ))}
      </div>

      {/* Desktop / tablet: full grid with category headers for clarity */}
      <div className="hidden md:block space-y-12">
        {(["tapis", "machine", "prive"] as const).map((cat) => {
          const items = visiblePlans.filter((p) => p.category === cat)
          if (items.length === 0) return null
          const tab = TABS.find((t) => t.value === cat)!
          return (
            <section key={cat} aria-labelledby={`pricing-cat-${cat}`}>
              <header className="mb-6">
                <h3
                  id={`pricing-cat-${cat}`}
                  className="font-heading text-xl font-bold text-mp-charcoal"
                >
                  {tab.label}
                </h3>
                <p className="text-sm text-mp-text-light mt-1">{tab.sub}</p>
              </header>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-8 pt-2">
                {items.map((plan, index) => (
                  <ScrollReveal key={plan.name} delay={(index % 3) as 0 | 1 | 2}>
                    <PricingCard plan={plan} />
                  </ScrollReveal>
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </>
  )
}
