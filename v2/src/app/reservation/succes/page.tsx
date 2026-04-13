import Link from "next/link"
import { CheckCircle, Calendar, Gift } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Paiement confirm\u00e9",
  robots: { index: false },
}

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>
}) {
  const { session_id } = await searchParams

  // Optionally fetch session details from Stripe for a richer confirmation
  // For now we show a generic success message
  return (
    <section className="mp-section bg-mp-cream min-h-[70vh] flex items-center">
      <div className="mp-container max-w-lg text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-mp-sage/10 mb-6">
          <CheckCircle className="w-10 h-10 text-mp-sage" />
        </div>
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-mp-charcoal mb-4">
          Paiement confirm&eacute;&nbsp;!
        </h1>
        <p className="font-body text-mp-text-light leading-relaxed mb-8">
          Merci pour votre r&eacute;servation. Vous recevrez un email de
          confirmation dans quelques instants.
        </p>
        {session_id && (
          <p className="text-xs text-mp-text-muted mb-8 font-mono">
            R&eacute;f&eacute;rence&nbsp;: {session_id.slice(0, 20)}&hellip;
          </p>
        )}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/planning"
            className="mp-btn mp-btn-primary inline-flex items-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            Retour au planning
          </Link>
          <Link
            href="/carte-cadeau"
            className="mp-btn mp-btn-secondary inline-flex items-center gap-2"
          >
            <Gift className="w-4 h-4" />
            Offrir une carte cadeau
          </Link>
        </div>
      </div>
    </section>
  )
}
