import type { Metadata } from "next";
import Link from "next/link";
import { Gift, Sparkles, ShieldCheck, CreditCard, CalendarX, ShoppingBag, CalendarCheck } from "lucide-react";
import { FaqAccordion } from "@/components/ui/FaqAccordion";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { StickyCta } from "@/components/ui/StickyCta";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { PricingGrid } from "./PricingGrid";
import { ProfileRecommendations } from "./ProfileRecommendations";
import { SITE_URL } from "@/lib/env";
import { pricingPlans } from "@/lib/pricing-plans";

export const metadata: Metadata = {
  title: "Tarifs Pilates Larmor-Plage — cartes & Reformer Lorient",
  description:
    "Tarifs Pilates à Larmor-Plage : essai tapis 10€, cartes 5 à 20 cours dès 17€/séance, cours privés Reformer. Studio près de Lorient — choisissez votre formule.",
  openGraph: {
    title: "Tarifs Pilates Larmor-Plage — cartes & Reformer Lorient | Mon Pilates",
    description:
      "Essai tapis 10€, cartes de 5 à 20 cours dès 17€/séance, cours privés Reformer à Larmor-Plage (Lorient). Trouvez la formule qui vous convient.",
    images: [
      {
        url: "/images/studio-reformer-ocean.webp",
        width: 1920,
        height: 1080,
        alt: "Studio de Pilates Mon Pilates face à l'océan à Larmor-Plage",
      },
    ],
  },
  alternates: {
    canonical: `${SITE_URL}/tarifs`,
  },
};


const faqItems = [
  {
    question: "Les cartes de cours expirent-elles ?",
    answer:
      "Oui, chaque carte tapis a une durée de validité : 3 mois pour la carte 5 séances, 6 mois pour la carte 10 séances et 12 mois pour la carte 20 séances. La validité démarre à la date d'achat.",
  },
  {
    question: "Puis-je annuler une réservation ?",
    answer:
      "Oui, vous pouvez annuler jusqu'à 12h avant le début du cours via votre espace en ligne. Au-delà de ce délai, la séance est décomptée de votre carte.",
  },
  {
    question: "Le cours Découverte est-il sans engagement ?",
    answer:
      "Absolument ! Le cours Découverte Tapis à 10€ est réservé aux nouveaux élèves et sans aucun engagement. C'est la meilleure façon de faire connaissance avec le studio et la méthode.",
  },
  {
    question: "Proposez-vous un abonnement mensuel illimité ?",
    answer:
      "Non. Nous proposons uniquement des séances à l'unité et des cartes de 5, 10 ou 20 cours. Ce format vous laisse totalement libre de votre rythme, sans prélèvement récurrent.",
  },
  {
    question: "Quelle est la différence entre les cours au tapis et les séances privées sur appareil ?",
    answer:
      "Les cours au tapis se pratiquent au sol en petit groupe (5 personnes max). Les séances privées se déroulent en individuel sur notre Reformer Cadillac premium pour un suivi entièrement sur-mesure.",
  },
  {
    question: "Les cartes cadeaux sont-elles remboursables ?",
    answer:
      "Les cartes cadeaux ne sont pas remboursables, mais elles sont transférables : vous pouvez changer le bénéficiaire en nous contactant.",
  },
  {
    question: "Faut-il apporter son tapis ?",
    answer:
      "Non, tout le matériel est fourni au studio (tapis, petits équipements, accessoires). Venez simplement en tenue confortable.",
  },
  {
    question: "Combien de personnes par cours ?",
    answer:
      "Les cours au tapis accueillent 5 personnes maximum. Ce petit effectif permet à Violette de corriger chaque posture et d'adapter les exercices individuellement. Les séances sur équipement se déroulent en privé (1 personne).",
  },
  {
    question: "Quel cours choisir pour débuter ?",
    answer:
      "Le cours Découverte Tapis à 10€ est idéal pour commencer : Violette adapte les exercices à votre niveau et prend le temps de présenter la méthode. Vous pouvez ensuite choisir la carte qui correspond à votre rythme.",
  },
  {
    question: "Puis-je venir si je suis enceinte ?",
    answer:
      "Oui, Violette propose des adaptations spécifiques pour les femmes enceintes à partir du 2e trimestre et avec accord médical. Contactez-nous en amont pour choisir le format le plus adapté à votre grossesse.",
  },
  {
    question: "Où se trouve le studio ?",
    answer:
      "Le studio Mon Pilates est situé au 14 Boulevard des Dunes à Larmor-Plage (quartier Toulhars), dans la Villa « les mouettes », face à l'océan. Nous sommes à quelques minutes de Lorient, Ploemeur et Guidel.",
  },
  {
    question: "Puis-je partager ma carte de cours ?",
    answer:
      "Les cartes de cours sont nominatives et ne peuvent pas être partagées. En revanche, vous pouvez offrir une carte cadeau à un proche.",
  },
  {
    question: "Quels sont les moyens de paiement acceptés ?",
    answer:
      "Nous acceptons les paiements par carte bancaire (Visa, Mastercard) en ligne lors de la réservation. Le paiement est sécurisé via Stripe.",
  },
];

const offersJsonLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Cours de Pilates — Mon Pilates",
  description:
    "Cours de Pilates au tapis (doux, classique, avancé), cours privés sur appareil et pré & post-natal à Larmor-Plage. Formules flexibles.",
  brand: { "@type": "Brand", name: "Mon Pilates" },
  offers: pricingPlans.map((plan) => ({
    "@type": "Offer",
    name: plan.name,
    price: plan.price,
    priceCurrency: "EUR",
    availability: "https://schema.org/InStock",
    url: `${SITE_URL}/tarifs`,
  })),
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

export default function TarifsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(offersJsonLd) }}
      />
      <BreadcrumbJsonLd items={[
        { name: "Accueil", href: "/" },
        { name: "Tarifs", href: "/tarifs" },
      ]} />
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-mp-sand via-mp-cream to-mp-ocean-light/20 pt-32 pb-16 sm:pb-20">
        <div className="mp-container">
          <Breadcrumb items={[
            { name: "Accueil", href: "/" },
            { name: "Tarifs", href: "/tarifs" },
          ]} />
        </div>
        <div className="mp-container text-center">
          <p className="font-heading text-sm font-semibold text-mp-ocean uppercase tracking-[0.2em] mb-3">
            Formules & tarifs
          </p>
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-mp-charcoal mb-6">
            Nos tarifs
          </h1>
          <p className="font-body text-lg sm:text-xl text-mp-text-light leading-relaxed max-w-2xl mx-auto">
            Des formules flexibles pour s&apos;adapter à votre rythme et à vos
            envies. Cours au tapis en petit groupe, cartes multi-séances ou séances
            privées sur appareil : trouvez ce qui vous convient.
          </p>
        </div>
      </section>

      {/* How it works — answers "when/how do I use a card?" upfront */}
      <section
        aria-labelledby="how-cards-work-heading"
        className="bg-mp-cream/60 border-y border-mp-sand-dark/30 py-10 sm:py-12"
      >
        <div className="mp-container max-w-4xl">
          <h2
            id="how-cards-work-heading"
            className="font-heading text-xl sm:text-2xl font-bold text-mp-charcoal text-center mb-2"
          >
            Comment fonctionnent nos cartes&nbsp;?
          </h2>
          <p className="text-center text-sm text-mp-text-light mb-8 max-w-xl mx-auto">
            Une carte = un crédit de séances utilisable quand vous voulez,
            dans la limite de la validité.
          </p>
          <ol className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <li className="flex sm:flex-col items-start sm:items-center gap-4 sm:gap-3 p-4 sm:p-5 rounded-2xl bg-white border border-mp-sand-dark/30 sm:text-center">
              <span className="flex-shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-full bg-mp-ocean text-white font-heading font-bold text-sm" aria-hidden="true">1</span>
              <div className="flex-1 sm:flex-none">
                <div className="flex items-center gap-2 sm:justify-center mb-1">
                  <ShoppingBag className="w-4 h-4 text-mp-ocean" aria-hidden="true" />
                  <h3 className="font-heading text-sm sm:text-base font-semibold text-mp-charcoal">Choisissez une carte</h3>
                </div>
                <p className="text-xs sm:text-sm text-mp-text-light leading-relaxed">
                  5, 10 ou 20 séances. Plus la carte est grande, moins la séance coûte cher.
                </p>
              </div>
            </li>
            <li className="flex sm:flex-col items-start sm:items-center gap-4 sm:gap-3 p-4 sm:p-5 rounded-2xl bg-white border border-mp-sand-dark/30 sm:text-center">
              <span className="flex-shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-full bg-mp-ocean text-white font-heading font-bold text-sm" aria-hidden="true">2</span>
              <div className="flex-1 sm:flex-none">
                <div className="flex items-center gap-2 sm:justify-center mb-1">
                  <CreditCard className="w-4 h-4 text-mp-ocean" aria-hidden="true" />
                  <h3 className="font-heading text-sm sm:text-base font-semibold text-mp-charcoal">Payez en une fois</h3>
                </div>
                <p className="text-xs sm:text-sm text-mp-text-light leading-relaxed">
                  Paiement sécurisé Stripe. La carte est créditée immédiatement sur votre compte.
                </p>
              </div>
            </li>
            <li className="flex sm:flex-col items-start sm:items-center gap-4 sm:gap-3 p-4 sm:p-5 rounded-2xl bg-white border border-mp-sand-dark/30 sm:text-center">
              <span className="flex-shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-full bg-mp-ocean text-white font-heading font-bold text-sm" aria-hidden="true">3</span>
              <div className="flex-1 sm:flex-none">
                <div className="flex items-center gap-2 sm:justify-center mb-1">
                  <CalendarCheck className="w-4 h-4 text-mp-ocean" aria-hidden="true" />
                  <h3 className="font-heading text-sm sm:text-base font-semibold text-mp-charcoal">Réservez sans repayer</h3>
                </div>
                <p className="text-xs sm:text-sm text-mp-text-light leading-relaxed">
                  Sur le planning, choisissez «&nbsp;Réserver avec ma carte&nbsp;»&nbsp;: 1 séance déduite, c&apos;est tout.
                </p>
              </div>
            </li>
          </ol>
          <p className="text-center text-xs text-mp-text-muted mt-6">
            Pas envie d&apos;une carte&nbsp;?{" "}
            <Link href="/planning" className="text-mp-ocean underline hover:text-mp-ocean-dark">
              Réservez et payez à l&apos;unité
            </Link>{" "}
            (20&nbsp;€/séance).
          </p>
        </div>
      </section>

      {/* Pricing Grid */}
      <section className="mp-section bg-mp-white" aria-labelledby="pricing-grid-heading">
        <div className="mp-container">
          <h2 id="pricing-grid-heading" className="sr-only">
            Formules et cartes
          </h2>
          <PricingGrid plans={pricingPlans} />
        </div>
      </section>

      {/* Guarantees */}
      <section className="mp-section bg-mp-sand/40">
        <div className="mp-container">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <ScrollReveal delay={0} className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-mp-sage/10 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-mp-sage" aria-hidden="true" />
              </div>
              <h3 className="font-heading text-sm font-semibold text-mp-charcoal">Certifiée FPMP</h3>
              <p className="font-body text-xs text-mp-text-light max-w-xs">Violette est diplômée de la Fédération Professionnelle des Métiers du Pilates.</p>
            </ScrollReveal>
            <ScrollReveal delay={1} className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-mp-ocean/10 flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-mp-ocean" aria-hidden="true" />
              </div>
              <h3 className="font-heading text-sm font-semibold text-mp-charcoal">Paiement 100% sécurisé</h3>
              <p className="font-body text-xs text-mp-text-light max-w-xs">Vos paiements sont protégés par Stripe, leader mondial de la sécurité bancaire.</p>
            </ScrollReveal>
            <ScrollReveal delay={2} className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-mp-rose/10 flex items-center justify-center">
                <CalendarX className="w-6 h-6 text-mp-rose" aria-hidden="true" />
              </div>
              <h3 className="font-heading text-sm font-semibold text-mp-charcoal">Sans engagement</h3>
              <p className="font-body text-xs text-mp-text-light max-w-xs">Pas d&apos;abonnement forcé. Achetez à la séance ou à la carte, à votre rythme.</p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* How to choose guide */}
      <section className="mp-section bg-mp-white">
        <div className="mp-container max-w-3xl">
          <ScrollReveal className="text-center mb-10">
            <p className="font-heading text-sm font-semibold text-mp-ocean uppercase tracking-[0.2em] mb-3">
              Aide au choix
            </p>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-mp-charcoal">
              Quelle formule choisir ?
            </h2>
          </ScrollReveal>
          <ProfileRecommendations
            items={[
              {
                profile: "Je d\u00e9couvre le Pilates",
                recommendation: "D\u00e9couverte Tapis \u00e0 10\u20ac",
                detail: "Testez un cours en petit groupe (5 max), r\u00e9serv\u00e9 aux nouveaux \u00e9l\u00e8ves.",
                color: "border-mp-sage bg-mp-sage/5",
                isTrial: true,
              },
              {
                profile: "Je veux pratiquer 1\u00e0 2\u00d7/semaine",
                recommendation: "Carte 10 cours tapis",
                detail: "Le meilleur rapport qualit\u00e9-prix : 18\u20ac/s\u00e9ance. Valable 6 mois.",
                color: "border-mp-ocean bg-mp-ocean/5",
              },
              {
                profile: "Je veux un suivi sur-mesure",
                recommendation: "Priv\u00e9 sur appareil",
                detail: "S\u00e9ances individuelles sur Reformer Cadillac : 65\u20ac la s\u00e9ance.",
                color: "border-mp-rose bg-mp-rose/5",
              },
              {
                profile: "Je veux offrir un cadeau",
                recommendation: "Carte cadeau",
                detail: "Choisissez un nombre de cours ou un montant libre. Livr\u00e9e par email.",
                color: "border-mp-gold bg-mp-gold/5",
              },
            ]}
          />
        </div>
      </section>

      {/* Carte Cadeau */}
      <section className="mp-section bg-mp-cream">
        <div className="mp-container">
          <div className="mp-card border-2 border-mp-gold/40 bg-gradient-to-br from-white to-mp-gold-light/20 p-8 sm:p-12 flex flex-col md:flex-row items-center gap-8">
            <div className="flex-shrink-0">
              <div className="w-20 h-20 rounded-2xl bg-mp-gold/10 flex items-center justify-center">
                <Gift className="w-10 h-10 text-mp-gold" aria-hidden="true" />
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-mp-charcoal mb-3">
                Carte Cadeau
              </h2>
              <p className="font-body text-mp-text-light leading-relaxed max-w-xl">
                Offrez du bien-être à vos proches. Choisissez un nombre de cours
                ou un montant libre, personnalisez votre message et faites
                plaisir en quelques clics.
              </p>
            </div>
            <Link href="/carte-cadeau" className="mp-btn mp-btn-gold flex-shrink-0">
              <Sparkles className="w-5 h-5" aria-hidden="true" />
              Offrir une carte
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mp-section bg-mp-white scroll-mt-20">
        <div className="mp-container max-w-3xl">
          <div className="text-center mb-12">
            <p className="font-heading text-sm font-semibold text-mp-ocean uppercase tracking-[0.2em] mb-3">
              Questions fréquentes
            </p>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-mp-charcoal">
              <abbr title="Foire aux questions" className="no-underline">FAQ</abbr>
            </h2>
          </div>
          <FaqAccordion items={faqItems} />
        </div>
      </section>

      {/* Découvrir aussi */}
      <section className="mp-section bg-mp-cream">
        <div className="mp-container max-w-3xl">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-mp-charcoal mb-8 text-center">
            Découvrir aussi
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Link href="/carte-cadeau" className="group block">
              <div className="mp-card p-6 border border-mp-sand-dark/20 hover:border-mp-ocean/20 h-full flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-mp-gold/10 flex items-center justify-center flex-shrink-0">
                  <Gift className="w-5 h-5 text-mp-gold" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-heading text-base font-semibold text-mp-charcoal group-hover:text-mp-ocean transition-colors mb-1">
                    Carte cadeau
                  </h3>
                  <p className="font-body text-sm text-mp-text-light leading-relaxed">
                    Offrez du bien-être à vos proches avec une carte cadeau personnalisable.
                  </p>
                </div>
              </div>
            </Link>
            <Link href="/premiere-visite" className="group block">
              <div className="mp-card p-6 border border-mp-sand-dark/20 hover:border-mp-ocean/20 h-full flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-mp-ocean/10 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-mp-ocean" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-heading text-base font-semibold text-mp-charcoal group-hover:text-mp-ocean transition-colors mb-1">
                    Première visite
                  </h3>
                  <p className="font-body text-sm text-mp-text-light leading-relaxed">
                    Tout ce qu&apos;il faut savoir avant votre premier cours de Pilates.
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <StickyCta text="Réserver un essai" price="10€" />
    </>
  );
}
