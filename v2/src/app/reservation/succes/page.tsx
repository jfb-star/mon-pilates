import Link from "next/link"
import { CheckCircle, Calendar, CreditCard, Heart } from "lucide-react"
import type { Metadata } from "next"
import { ConfirmBooking } from "./ConfirmBooking"

export const metadata: Metadata = {
  title: "Paiement confirmé",
  robots: { index: false },
}

function getSuccessContent(type?: string) {
  switch (type) {
    case "card":
      return {
        title: "Votre carte de cours a été activée !",
        description:
          "Votre carte est prête à l'emploi. Rendez-vous sur le planning pour réserver vos prochains cours.",
        tip: "Consultez votre espace personnel pour suivre vos séances restantes et la date d'expiration de votre carte.",
        primaryLabel: "Mon espace",
        primaryHref: "/compte",
        primaryIcon: CreditCard,
        secondaryLabel: "Réserver un cours",
        secondaryHref: "/planning",
      }
    case "subscription":
      return {
        title: "Votre abonnement est actif !",
        description:
          "Vous avez désormais un accès illimité à tous nos cours. Réservez autant de séances que vous le souhaitez.",
        tip: "Votre abonnement est sans engagement. Vous pouvez le gérer ou le résilier à tout moment depuis votre espace personnel.",
        primaryLabel: "Mon espace",
        primaryHref: "/compte",
        primaryIcon: CreditCard,
        secondaryLabel: "Réserver un cours",
        secondaryHref: "/planning",
      }
    default:
      return {
        title: "Paiement confirmé\u00a0!",
        description:
          "Merci pour votre réservation. Vous recevrez un email de confirmation dans quelques instants.",
        tip: "Arrivez 10 min avant le cours en tenue confortable. Tout le matériel est fourni.",
        primaryLabel: "Voir mes réservations",
        primaryHref: "/compte",
        primaryIcon: Calendar,
        secondaryLabel: "Retour au planning",
        secondaryHref: "/planning",
      }
  }
}

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string; type?: string }>
}) {
  const { session_id, type } = await searchParams
  const content = getSuccessContent(type)
  const PrimaryIcon = content.primaryIcon

  return (
    <section className="mp-section bg-mp-cream min-h-[70vh] flex items-center">
      <div className="mp-container max-w-lg text-center" role="status" aria-live="polite">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-mp-sage/10 mb-6 animate-[fadeUp_0.6s_ease_forwards]">
          <CheckCircle className="w-10 h-10 text-mp-sage" aria-hidden="true" />
        </div>
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-mp-charcoal mb-4">
          {content.title}
        </h1>
        <p className="font-body text-mp-text-light leading-relaxed mb-4">
          {content.description}
        </p>
        <div className="bg-mp-white/70 rounded-xl p-4 mb-8 text-sm text-mp-text-light font-body">
          <p className="font-heading font-semibold text-mp-charcoal mb-1">Rappel pratique</p>
          <p>{content.tip}</p>
        </div>
        {session_id && (
          <>
            <ConfirmBooking sessionId={session_id} />
            <p className="text-xs text-mp-text-muted mb-8 font-mono">
              R&eacute;f&eacute;rence&nbsp;: {session_id.slice(0, 20)}&hellip;
            </p>
          </>
        )}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={content.primaryHref}
            className="mp-btn mp-btn-primary inline-flex items-center gap-2"
          >
            <PrimaryIcon className="w-4 h-4" aria-hidden="true" />
            {content.primaryLabel}
          </Link>
          <Link
            href={content.secondaryHref}
            className="mp-btn mp-btn-secondary inline-flex items-center gap-2"
          >
            {content.secondaryLabel}
          </Link>
        </div>
        <p className="mt-8 font-body text-xs text-mp-text-muted flex items-center justify-center gap-1">
          <Heart className="w-3 h-3 text-mp-rose" aria-hidden="true" />
          Partagez votre d&eacute;couverte avec vos proches !
        </p>
      </div>
    </section>
  )
}
