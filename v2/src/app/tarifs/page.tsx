import type { Metadata } from "next";
import Link from "next/link";
import { Gift, Sparkles, ShieldCheck, CreditCard, CalendarX } from "lucide-react";
import { FaqAccordion } from "@/components/ui/FaqAccordion";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { StickyCta } from "@/components/ui/StickyCta";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { PricingGrid } from "./PricingGrid";
import { ProfileRecommendations } from "./ProfileRecommendations";
import { SITE_URL } from "@/lib/env";

export const metadata: Metadata = {
  title: "Tarifs",
  description:
    "Découvrez nos formules de Pilates : cours d'essai, cartes de cours, abonnement illimité. Des tarifs adaptés à votre pratique, à Larmor-Plage.",
  openGraph: {
    title: "Tarifs | Mon Pilates",
    description:
      "Cours d'essai à 10€, cartes de 5 à 20 cours, abonnement illimité. Trouvez la formule qui vous convient.",
    images: [
      {
        url: "/images/studio-reformer-ocean.jpg",
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

const pricingPlans = [
  {
    name: "Cours d'essai",
    price: 10,
    priceLabel: "10\u20ac",
    perSession: null,
    validity: null,
    badge: "Première fois",
    badgeColor: "bg-mp-sage text-white",
    highlighted: false,
    cta: "Essayer pour 10\u20ac",
    savings: null,
    href: "/planning",
    isTrial: true,
    features: [
      "1 cours au choix",
      "Tous types de cours",
      "Matériel fourni",
      "Satisfait(e) ou remboursé(e)",
    ],
  },
  {
    name: "Séance à l'unité",
    price: 18,
    priceLabel: "18\u20ac",
    perSession: null,
    validity: null,
    badge: null,
    badgeColor: "",
    highlighted: false,
    cta: "Réserver une séance",
    savings: null,
    href: "/planning",
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
    priceLabel: "80\u20ac",
    perSession: "16\u20ac/cours",
    validity: "Valable 2 mois",
    badge: null,
    badgeColor: "",
    highlighted: false,
    cta: "Acheter 5 cours",
    savings: "Économisez 10\u20ac",
    checkoutMode: "course-card" as const,
    cardType: "5" as const,
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
    priceLabel: "150\u20ac",
    perSession: "15\u20ac/cours",
    validity: "Valable 4 mois",
    badge: "Populaire",
    badgeColor: "bg-mp-ocean text-white",
    highlighted: true,
    cta: "Choisir la populaire",
    savings: "Économisez 30\u20ac",
    checkoutMode: "course-card" as const,
    cardType: "10" as const,
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
    priceLabel: "260\u20ac",
    perSession: "13\u20ac/cours",
    validity: "Valable 6 mois",
    badge: "Meilleure offre",
    badgeColor: "bg-mp-gold text-white",
    highlighted: false,
    cta: "Meilleure offre — acheter",
    savings: "Économisez 100\u20ac",
    checkoutMode: "course-card" as const,
    cardType: "20" as const,
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
    priceLabel: "89\u20ac",
    perSession: null,
    validity: null,
    badge: "Sans engagement",
    badgeColor: "bg-mp-rose text-white",
    highlighted: false,
    priceUnit: "/mois",
    cta: "Démarrer l'illimité",
    savings: null,
    checkoutMode: "subscription" as const,
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
      "Oui, chaque carte a une durée de validité : 2 mois pour la carte 5 cours, 4 mois pour la carte 10 cours et 6 mois pour la carte 20 cours. La validité démarre à la date d'achat.",
  },
  {
    question: "Puis-je annuler une réservation ?",
    answer:
      "Oui, vous pouvez annuler jusqu'à 12h avant le début du cours via votre espace en ligne. Au-delà de ce délai, la séance est décomptée de votre carte.",
  },
  {
    question: "Le cours d'essai est-il sans engagement ?",
    answer:
      "Absolument ! Le cours d'essai à 10€ est sans aucun engagement. Si vous n'êtes pas satisfait(e), vous êtes remboursé(e).",
  },
  {
    question: "Comment fonctionne l'abonnement mensuel ?",
    answer:
      "L'abonnement à 89€/mois vous donne un accès illimité à tous les cours. Le prélèvement est mensuel et vous pouvez résilier à tout moment, sans frais ni justificatif.",
  },
  {
    question: "Les cartes cadeaux sont-elles remboursables ?",
    answer:
      "Les cartes cadeaux ne sont pas remboursables, mais elles sont transférables : vous pouvez changer le bénéficiaire en nous contactant.",
  },
  {
    question: "Faut-il apporter son tapis ?",
    answer:
      "Non, tout le matériel est fourni au studio (tapis, petits équipements, accessoires Reformer). Venez simplement en tenue confortable.",
  },
  {
    question: "Combien de personnes par cours ?",
    answer:
      "Nos cours accueillent 10 personnes maximum. Ce petit effectif permet à l'instructrice de corriger chaque posture et d'adapter les exercices individuellement.",
  },
  {
    question: "Quel cours choisir pour débuter ?",
    answer:
      "Le cours Pilates Mat Fondamental ou le Pilates Doux sont idéaux pour commencer. L'instructrice adapte les exercices à votre niveau. N'hésitez pas à réserver un cours d'essai pour découvrir.",
  },
  {
    question: "Puis-je venir si je suis enceinte ?",
    answer:
      "Oui ! Nous proposons des cours de Pilates Prénatal spécialement conçus pour les femmes enceintes, à partir du 2e trimestre et avec accord médical. Les exercices sont adaptés à chaque stade de la grossesse.",
  },
  {
    question: "Où se trouve le studio ?",
    answer:
      "Le studio Mon Pilates est situé à Larmor-Plage, face à l'océan. Nous sommes à 10 minutes de Lorient, 15 minutes de Ploemeur et Guidel. Un parking gratuit est disponible à proximité.",
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
    "Cours de Pilates Mat, Reformer, Prénatal, Senior à Larmor-Plage. Formules flexibles.",
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
            envies. Cours d&apos;essai, cartes multi-séances ou abonnement
            illimité : trouvez ce qui vous convient.
          </p>
        </div>
      </section>

      {/* Pricing Grid */}
      <section className="mp-section bg-mp-white">
        <div className="mp-container">
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
              <h3 className="font-heading text-sm font-semibold text-mp-charcoal">Satisfait(e) ou remboursé(e)</h3>
              <p className="font-body text-xs text-mp-text-light max-w-xs">Votre cours d&apos;essai ne vous a pas plu ? On vous rembourse, sans condition.</p>
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
                recommendation: "Cours d\u2019essai \u00e0 10\u20ac",
                detail: "Testez un cours sans engagement. Satisfait(e) ou rembours\u00e9(e).",
                color: "border-mp-sage bg-mp-sage/5",
                isTrial: true,
              },
              {
                profile: "Je veux pratiquer 1\u00e0 2\u00d7/semaine",
                recommendation: "Carte 10 cours",
                detail: "Le meilleur rapport qualit\u00e9-prix. Id\u00e9al pour une pratique r\u00e9guli\u00e8re sur 4 mois.",
                color: "border-mp-ocean bg-mp-ocean/5",
              },
              {
                profile: "Je suis mordu(e) de Pilates",
                recommendation: "Abonnement illimit\u00e9",
                detail: "D\u00e8s 3 cours/semaine, l\u2019abonnement devient plus avantageux que les cartes.",
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
