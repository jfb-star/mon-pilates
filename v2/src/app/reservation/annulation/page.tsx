import Link from "next/link"
import { XCircle, ArrowLeft } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Paiement annul\u00e9",
  robots: { index: false },
}

export default function AnnulationPage() {
  return (
    <section className="mp-section bg-mp-cream min-h-[70vh] flex items-center">
      <div className="mp-container max-w-lg text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-mp-rose/10 mb-6">
          <XCircle className="w-10 h-10 text-mp-rose" />
        </div>
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-mp-charcoal mb-4">
          Paiement annul&eacute;
        </h1>
        <p className="font-body text-mp-text-light leading-relaxed mb-8">
          Votre paiement n&apos;a pas abouti. Aucun montant n&apos;a
          &eacute;t&eacute; d&eacute;bit&eacute;. Vous pouvez r&eacute;essayer
          &agrave; tout moment.
        </p>
        <Link
          href="/planning"
          className="mp-btn mp-btn-primary inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour au planning
        </Link>
      </div>
    </section>
  )
}
