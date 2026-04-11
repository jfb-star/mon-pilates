import type { Metadata } from "next";
import Link from "next/link";
import { Check, Gift, Sparkles } from "lucide-react";
import { FaqAccordion } from "@/components/ui/FaqAccordion";

export const metadata: Metadata = {
  title: "Tarifs",
  description:
    "Découvrez nos formules de Pilates : cours d'essai, cartes de cours, abonnement illimité. Des tarifs adaptés à votre pratique, à Larmor-Plage.",
  openGraph: {
    title: "Tarifs | Mon Pilates",
    description:
      "Cours d'essai à 10€, cartes de 5 à 20 cours, abonnement illimité. Trouvez la formule qui vous convient.",
  },
};

const pricingPlans = [
  {
    name: "Cours d'essai",
    price: 10,
    priceLabel: "10€",
    perSession: null,
    validity: null,
    badge: "Premiere fois",
    badgeColor: "bg-mp-sage text-white",
    highlighted: false,
    features: [
      "1 cours au choix",
      "Tous types de cours",
      "Matériel fourni",
      "Sans engagement",
    ],
  },
  {
    name: "Séance à l'unité",
    price: 18,
    priceLabel: "18€",
    perSession: null,
    validity: null,
    badge: null,
    badgeColor: "",
    highlighted: false,
    features: [
      "1 cours au choix",
      "Tous types de cours",
      "Matériel fourni",
      "Valable sans limite",
    ],
  },
  {
    name: "Carte 5 cours",
    price: 80,
    priceLabel: "80€",
    perSession: "16€/cours",
    validity: "Valable 2 mois",
    badge: null,
    badgeColor: "",
    highlighted: false,
    features: [
      "5 cours au choix",
      "Tous types de cours",
      "Matériel fourni",
      "Valable 2 mois",
    ],
  },
  {
    name: "Carte 10 cours",
    price: 150,
    priceLabel: "150€",
    perSession: "15€/cours",
    validity: "Valable 4 mois",
    badge: "Populaire",
    badgeColor: "bg-mp-ocean text-white",
    highlighted: true,
    features: [
      "10 cours au choix",
      "Tous types de cours",
      "Matériel fourni",
      "Valable 4 mois",
      "Le meilleur rapport qualité-prix",
    ],
  },
  {
    name: "Carte 20 cours",
    price: 260,
    priceLabel: "260€",
    perSession: "13€/cours",
    validity: "Valable 6 mois",
    badge: "Meilleure offre",
    badgeColor: "bg-mp-gold text-white",
    highlighted: false,
    features: [
      "20 cours au choix",
      "Tous types de cours",
      "Matériel fourni",
      "Valable 6 mois",
      "Le tarif le plus avantageux",
    ],
  },
  {
    name: "Abonnement mensuel illimité",
    price: 89,
    priceLabel: "89€",
    perSession: null,
    validity: null,
    badge: "Sans engagement",
    badgeColor: "bg-mp-rose text-white",
    highlighted: false,
    priceUnit: "/mois",
    features: [
      "Cours illimités",
      "Tous types de cours",
      "Matériel fourni",
      "Résiliable à tout moment",
      "Prélèvement mensuel",
    ],
  },
];

const faqItems = [
  {
    question: "Les cartes de cours expirent-elles ?",
    answer:
      "Oui, validité de 2 à 6 mois selon la carte.",
  },
  {
    question: "Puis-je annuler une réservation ?",
    answer:
      "Oui, jusqu'à 12h avant le cours. Au-delà, la séance est décomptée.",
  },
  {
    question: "Le cours d'essai est-il sans engagement ?",
    answer: "Oui, aucun engagement. Venez découvrir !",
  },
  {
    question: "Comment fonctionne l'abonnement ?",
    answer:
      "Prélèvement mensuel, résiliable à tout moment. Accès illimité aux cours.",
  },
  {
    question: "Les cartes cadeaux sont-elles remboursables ?",
    answer:
      "Non, mais elles sont transférables à un autre bénéficiaire.",
  },
  {
    question: "Faut-il apporter son tapis ?",
    answer: "Non, tout le matériel est fourni au studio.",
  },
];

export default function TarifsPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-mp-sand via-mp-cream to-mp-ocean-light/20 pt-32 pb-16 sm:pb-20">
        <div className="mp-container text-center">
          <p className="font-heading text-sm font-semibold text-mp-ocean uppercase tracking-[0.2em] mb-3">
            Formules & tarifs
          </p>
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-mp-charcoal mb-6">
            Nos tarifs
          </h1>
          <p className="font-body text-lg sm:text-xl text-mp-text-light leading-relaxed max-w-2xl mx-auto">
            Des formules flexibles pour s&apos;adapter a votre rythme et a vos
            envies. Cours d&apos;essai, cartes multi-seances ou abonnement
            illimite : trouvez ce qui vous convient.
          </p>
        </div>
      </section>

      {/* Pricing Grid */}
      <section className="mp-section bg-mp-white">
        <div className="mp-container">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pricingPlans.map((plan) => (
              <div
                key={plan.name}
                className={`mp-card p-8 flex flex-col relative border-2 ${
                  plan.highlighted
                    ? "border-mp-ocean shadow-[0_8px_40px_rgba(107,159,173,0.2)] scale-[1.02]"
                    : "border-mp-sand-dark/30"
                }`}
              >
                {plan.badge && (
                  <span
                    className={`absolute -top-3.5 left-6 px-4 py-1 rounded-full text-xs font-heading font-semibold ${plan.badgeColor}`}
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
                  {"priceUnit" in plan && plan.priceUnit && (
                    <span className="font-body text-mp-text-light text-base">
                      {plan.priceUnit}
                    </span>
                  )}
                </div>

                {plan.perSession && (
                  <p className="text-sm text-mp-ocean font-heading font-medium mb-4">
                    soit {plan.perSession}
                  </p>
                )}
                {!plan.perSession && <div className="mb-4" />}

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-mp-sage mt-0.5 flex-shrink-0" />
                      <span className="font-body text-sm text-mp-text-light">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/planning"
                  className={`mp-btn w-full text-center ${
                    plan.highlighted ? "mp-btn-primary" : "mp-btn-secondary"
                  }`}
                >
                  Choisir cette formule
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Carte Cadeau */}
      <section className="mp-section bg-mp-cream">
        <div className="mp-container">
          <div className="mp-card border-2 border-mp-gold/40 bg-gradient-to-br from-white to-mp-gold-light/20 p-8 sm:p-12 flex flex-col md:flex-row items-center gap-8">
            <div className="flex-shrink-0">
              <div className="w-20 h-20 rounded-2xl bg-mp-gold/10 flex items-center justify-center">
                <Gift className="w-10 h-10 text-mp-gold" />
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-mp-charcoal mb-3">
                Carte Cadeau
              </h2>
              <p className="font-body text-mp-text-light leading-relaxed max-w-xl">
                Offrez du bien-etre a vos proches. Choisissez un nombre de cours
                ou un montant libre, personnalisez votre message et faites
                plaisir en quelques clics.
              </p>
            </div>
            <Link href="/carte-cadeau" className="mp-btn mp-btn-gold flex-shrink-0">
              <Sparkles className="w-5 h-5" />
              Offrir une carte
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mp-section bg-mp-white">
        <div className="mp-container max-w-3xl">
          <div className="text-center mb-12">
            <p className="font-heading text-sm font-semibold text-mp-ocean uppercase tracking-[0.2em] mb-3">
              Questions frequentes
            </p>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-mp-charcoal">
              FAQ
            </h2>
          </div>
          <FaqAccordion items={faqItems} />
        </div>
      </section>
    </>
  );
}
