"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Check, Loader2 } from "lucide-react"

type PricingPlan = {
  name: string
  price: number
  priceLabel: string
  perSession: string | null
  validity: string | null
  badge: string | null
  badgeColor: string
  highlighted: boolean
  cta: string
  savings: string | null
  features: string[]
  priceUnit?: string
  checkoutMode?: "course-card" | "subscription"
  cardType?: "5" | "10" | "20"
  href?: string
}

export function PricingCard({ plan }: { plan: PricingPlan }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const isCheckout = !!plan.checkoutMode

  async function handlePurchase() {
    setError("")
    setLoading(true)

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: plan.checkoutMode,
          ...(plan.cardType ? { cardType: plan.cardType } : {}),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        if (res.status === 401 || data.error?.includes("non autorisée")) {
          router.push("/connexion")
          return
        }
        throw new Error(data.error || "Une erreur est survenue")
      }

      if (data.url) {
        window.location.href = data.url
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue")
      setLoading(false)
    }
  }

  return (
    <div
      className={`mp-card p-8 flex flex-col relative border-2 h-full !overflow-visible ${
        plan.highlighted
          ? "border-mp-ocean shadow-[0_8px_40px_rgba(107,159,173,0.18)] lg:scale-[1.03] ring-1 ring-mp-ocean/20"
          : "border-mp-sand-dark/20 hover:border-mp-ocean/30 hover:-translate-y-1 transition-all duration-200"
      }`}
    >
      {plan.badge && (
        <span
          className={`absolute -top-3.5 left-6 px-4 py-1.5 rounded-full text-xs font-heading font-semibold shadow-sm ${plan.badgeColor} ${plan.highlighted ? "mp-shimmer" : ""}`}
        >
          {plan.badge}
        </span>
      )}

      <h3 className="font-heading text-lg font-semibold text-mp-charcoal mb-4 mt-2">
        {plan.name}
      </h3>

      <div className="mb-1">
        <span className="font-heading text-4xl font-bold text-mp-charcoal">
          {plan.priceLabel}
        </span>
        {plan.priceUnit && (
          <span className="font-body text-mp-text-light text-base">
            {plan.priceUnit}
          </span>
        )}
      </div>

      {plan.perSession && (
        <p className="text-sm text-mp-ocean font-heading font-medium">
          soit {plan.perSession}
        </p>
      )}
      {plan.savings && (
        <p className="inline-flex items-center gap-1 text-xs font-heading font-semibold text-mp-sage bg-mp-sage/10 px-2.5 py-1 rounded-full mt-1.5 w-fit">
          <Check className="w-3 h-3" aria-hidden="true" />
          {plan.savings}
        </p>
      )}
      {!plan.perSession && !plan.savings && <div className="mb-1" />}
      <div className="mb-3" />

      <ul className="space-y-3 mb-8 flex-1">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5">
            <Check className="w-4 h-4 text-mp-sage mt-0.5 flex-shrink-0" aria-hidden="true" />
            <span className="font-body text-sm text-mp-text-light">
              {feature}
            </span>
          </li>
        ))}
      </ul>

      {isCheckout ? (
        <>
          <button
            type="button"
            onClick={handlePurchase}
            disabled={loading}
            className={`mp-btn w-full text-center inline-flex items-center justify-center gap-2 ${
              plan.highlighted ? "mp-btn-primary" : "mp-btn-secondary"
            } disabled:opacity-60 disabled:cursor-not-allowed`}
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />}
            {loading ? "Redirection…" : plan.cta}
          </button>
          {error && (
            <p className="text-xs text-red-600 mt-2 text-center">{error}</p>
          )}
        </>
      ) : (
        <a
          href={plan.href ?? "/planning"}
          className={`mp-btn w-full text-center ${
            plan.highlighted ? "mp-btn-primary" : "mp-btn-secondary"
          }`}
        >
          {plan.cta}
        </a>
      )}
      {plan.highlighted && (
        <p className="text-xs text-mp-ocean/70 mt-2 text-center">Notre formule la plus choisie</p>
      )}
    </div>
  )
}
