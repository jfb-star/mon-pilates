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
    "Découvrez nos formules de Pilates : cours d'essai au tapis à 10€, cartes de 5, 10 ou 20 cours, séances privées sur appareil. Tarifs Mon Pilates à Larmor-Plage.",
  openGraph: {
    title: "Tarifs | Mon Pilates",
    description:
      "Découverte tapis 10€, cartes de 5 à 20 cours dès 17€/séance, séances privées sur appareil. Trouvez la formule qui vous convient.",
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
    name: "Découverte — Tapis",
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
      "1 cours au tapis au choix",
      "Réservé aux nouveaux élèves",
      "Matériel fourni",
      "Petit groupe (5 max)",
    ],
  },
  {
    name: "Séance tapis à l'unité",
    price: 20,
    priceLabel: "20\u20ac",
    perSession: null,
    validity: null,
    badge: null,
    badgeColor: "",
    highlighted: false,
    cta: "Réserver une séance",
    savings: null,
    href: "/planning",
    features: [
      "1 cours au tapis au choix",
      "Sans engagement",
      "Matériel fourni",
      "Petit groupe (5 max)",
    ],
  },
  {
    name: "Carte 5 cours tapis",
    price: 95,
    priceLabel: "95\u20ac",
    perSession: "19\u20ac/séance",
    validity: "Valable 3 mois",
    badge: null,
    badgeColor: "",
    highlighted: false,
    cta: "Acheter 5 cours",
    savings: "Économisez 5\u20ac",
    checkoutMode: "course-card" as const,
    cardType: "5" as const,
    features: [
      "5 séances au tapis (doux, classique ou avancé)",
      "Valable 3 mois",
      "Matériel fourni",
      "Petit groupe (5 max)",
    ],
  },
  {
    name: "Carte 10 cours tapis",
    price: 180,
    priceLabel: "180\u20ac",
    perSession: "18\u20ac/séance",
    validity: "Valable 6 mois",
    badge: "Populaire",
    badgeColor: "bg-mp-ocean text-white",
    highlighted: true,
    cta: "Choisir la populaire",
    savings: "Économisez 20\u20ac",
    checkoutMode: "course-card" as const,
    cardType: "10" as const,
    features: [
      "10 séances au tapis (doux, classique ou avancé)",
      "Valable 6 mois",
      "Matériel fourni",
      "Petit groupe (5 max)",
      "Le meilleur rapport qualité-prix",
    ],
  },
  {
    name: "Carte 20 cours tapis",
    price: 340,
    priceLabel: "340\u20ac",
    perSession: "17\u20ac/séance",
    validity: "Valable 12 mois",
    badge: "Meilleure offre",
    badgeColor: "bg-mp-gold text-white",
    highlighted: false,
    cta: "Meilleure offre — acheter",
    savings: "Économisez 60\u20ac",
    checkoutMode: "course-card" as const,
    cardType: "20" as const,
    features: [
      "20 séances au tapis (doux, classique ou avancé)",
      "Valable 12 mois",
      "Matériel fourni",
      "Petit groupe (5 max)",
      "Le tarif le plus avantageux",
    ],
  },
  {
    name: "Découverte Privé sur équipement",
    price: 50,
    priceLabel: "50\u20ac",
    perSession: null,
    validity: null,
    badge: "Première fois",
    badgeColor: "bg-mp-sage text-white",
    highlighted: false,
    cta: "Réserver une découverte",
    savings: null,
    href: "/contact",
    features: [
      "1 séance privée sur équipement",
      "Reformer, Cadillac ou Chair",
      "Accompagnement individuel",
      "Réservé aux nouveaux élèves",
    ],
  },
  {
    name: "Privé sur équipement",
    price: 65,
    priceLabel: "65\u20ac",
    perSession: null,
    validity: null,
    badge: null,
    badgeColor: "",
    highlighted: false,
    cta: "Prendre rendez-vous",
    savings: null,
    href: "/contact",
    features: [
      "1 séance privée sur équipement",
      "Coaching individuel sur-mesure",
      "Reformer, Cadillac ou Chair",
      "Matériel professionnel",
    ],
  },
  {
    name: "Carte 10 privés équipement",
    price: 550,
    priceLabel: "550\u20ac",
    perSession: "55\u20ac/séance",
    validity: "Valable 8 mois", // TODO owner: confirmer la durée de validité exacte
    badge: "Suivi sur-mesure",
    badgeColor: "bg-mp-rose text-white",
    highlighted: false,
    cta: "Acheter 10 privés",
    savings: "Économisez 100\u20ac",
    href: "/contact",
    features: [
      "10 séances privées sur équipement",
      "Coaching individuel régulier",
      "Reformer, Cadillac ou Chair",
      "Matériel professionnel",
    ],
  },
];

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
      "Les cours au tapis se pratiquent au sol en petit groupe (5 personnes max). Les séances privées se déroulent en individuel sur des équipements professionnels (Reformer, Cadillac, Chair) pour un suivi entièrement sur-mesure.",
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
                detail: "S\u00e9ances individuelles sur Reformer, Cadillac ou Chair : 65\u20ac la s\u00e9ance.",
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
