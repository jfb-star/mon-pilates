import type { Metadata } from "next";
import Image from "next/image";
import { Gift, Mail, Heart, ChevronRight, Star } from "lucide-react";
import { GiftCardForm } from "@/components/ui/GiftCardForm";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { SITE_URL } from "@/lib/env";

export const metadata: Metadata = {
  title: "Carte Cadeau",
  description:
    "Offrez une carte cadeau Pilates. Choisissez un nombre de cours ou un montant libre et personnalisez votre message. Livraison par email.",
  openGraph: {
    title: "Carte Cadeau | Mon Pilates",
    description:
      "Offrez du bien-être : une carte cadeau Pilates personnalisée, livrée par email.",
    images: [{ url: "/images/illustration-carte-cadeau.webp", width: 480, height: 480, alt: "Carte cadeau Mon Pilates" }],
  },
  alternates: {
    canonical: `${SITE_URL}/carte-cadeau`,
  },
};

const giftCardFaqItems = [
  { q: "Comment le destinataire reçoit-il la carte ?", a: "La carte cadeau est envoyée par email avec un joli visuel, votre message personnalisé et un code unique à présenter lors de la réservation." },
  { q: "Peut-on choisir la date d'envoi ?", a: "Oui, vous pouvez programmer l'envoi pour une date précise (anniversaire, Noël, fête des mères…)." },
  { q: "La carte est-elle utilisable sur tous les cours ?", a: "Absolument ! Tapis (doux, classique, avancé), cours privés sur appareil, pré & post-natal… le bénéficiaire choisit le cours qui lui convient." },
  { q: "Que se passe-t-il si la carte n'est pas utilisée ?", a: "La carte est valable 1 an à partir de la date d'achat. Passé ce délai, elle expire. Contactez-nous si besoin d'une extension exceptionnelle." },
];

const giftCardFaqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: giftCardFaqItems.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
};

const giftCardJsonLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Carte Cadeau Pilates — Mon Pilates",
  description:
    "Offrez une carte cadeau Pilates personnalisée. Choisissez un nombre de cours (1, 5 ou 10) ou un montant libre de 10€ à 500€. Livraison par email, valable 1 an.",
  brand: { "@type": "Brand", name: "Mon Pilates" },
  offers: {
    "@type": "AggregateOffer",
    lowPrice: "10",
    highPrice: "500",
    priceCurrency: "EUR",
    availability: "https://schema.org/InStock",
    url: `${SITE_URL}/carte-cadeau`,
  },
  image: `${SITE_URL}/images/illustration-carte-cadeau.webp`,
};

export default function CartesCadeauPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(giftCardJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(giftCardFaqJsonLd) }}
      />
      <BreadcrumbJsonLd items={[
        { name: "Accueil", href: "/" },
        { name: "Carte Cadeau", href: "/carte-cadeau" },
      ]} />
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-mp-gold-light/40 via-mp-cream to-mp-sand pt-32 pb-16 sm:pb-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--mp-gold-light)_0%,_transparent_50%)] opacity-30" />
        <div className="mp-container relative z-10 mb-4">
          <Breadcrumb items={[
            { name: "Accueil", href: "/" },
            { name: "Carte Cadeau", href: "/carte-cadeau" },
          ]} />
        </div>
        <div className="mp-container relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="text-center lg:text-left">
            <p className="font-heading text-sm font-semibold text-mp-gold uppercase tracking-[0.2em] mb-3">
              Carte cadeau
            </p>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-mp-charcoal mb-6">
              Offrir du{" "}
              <span className="text-mp-gold">bien-être</span>
            </h1>
            <p className="font-body text-lg sm:text-xl text-mp-text-light leading-relaxed max-w-2xl">
              Offrez une expérience Pilates unique. Choisissez votre formule,
              personnalisez votre message et faites plaisir à ceux que vous aimez.
            </p>
          </div>
          <div className="flex justify-center lg:justify-end">
            <Image
              src="/images/illustration-carte-cadeau.webp"
              alt="Illustration d'une carte cadeau avec feuilles et noeud vert sauge"
              width={480}
              height={480}
              className="w-full max-w-sm lg:max-w-md h-auto drop-shadow-lg"
              priority
              fetchPriority="high"
              sizes="(max-width: 1024px) 384px, 448px"
            />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-12 sm:py-16 bg-mp-white">
        <div className="mp-container max-w-3xl">
          <ScrollReveal className="text-center mb-10">
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-mp-charcoal mb-3">
              Comment &ccedil;a marche&nbsp;?
            </h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            <ScrollReveal delay={0} className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-mp-gold/10 flex items-center justify-center font-heading font-bold text-mp-gold text-lg" aria-hidden="true">1</div>
              <h3 className="font-heading text-sm font-semibold text-mp-charcoal">Choisissez</h3>
              <p className="font-body text-xs text-mp-text-light">Séances de cours ou montant libre, à vous de décider.</p>
            </ScrollReveal>
            <ScrollReveal delay={1} className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-mp-ocean/10 flex items-center justify-center font-heading font-bold text-mp-ocean text-lg" aria-hidden="true">2</div>
              <h3 className="font-heading text-sm font-semibold text-mp-charcoal">Personnalisez</h3>
              <p className="font-body text-xs text-mp-text-light">Ajoutez un message personnel pour rendre le cadeau unique.</p>
            </ScrollReveal>
            <ScrollReveal delay={2} className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-mp-rose/15 flex items-center justify-center font-heading font-bold text-mp-rose-dark text-lg" aria-hidden="true">3</div>
              <h3 className="font-heading text-sm font-semibold text-mp-charcoal">Envoyez</h3>
              <p className="font-body text-xs text-mp-text-light">La carte est envoyée instantanément par email au destinataire.</p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Gift Card Form & Preview */}
      <section className="mp-section bg-mp-cream" aria-label="Formulaire de carte cadeau">
        <div className="mp-container">
          <p className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-mp-text-muted mb-8 text-center">
            <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-mp-gold" aria-hidden="true" />Livraison instantan&eacute;e par email</span>
            <span className="text-mp-text-muted/40" aria-hidden="true">&middot;</span>
            <span className="flex items-center gap-1"><Gift className="w-3.5 h-3.5 text-mp-gold" aria-hidden="true" />Montant personnalisable de 10&euro; &agrave; 500&euro;</span>
          </p>
          <GiftCardForm />
        </div>
      </section>

      {/* Trust signals */}
      <section className="py-12 bg-mp-cream">
        <div className="mp-container">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <ScrollReveal delay={0} className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-mp-gold/10 flex items-center justify-center">
                <Mail className="w-6 h-6 text-mp-gold" aria-hidden="true" />
              </div>
              <h3 className="font-heading text-sm font-semibold text-mp-charcoal">Livraison par email</h3>
              <p className="font-body text-xs text-mp-text-light max-w-xs">
                La carte est envoyée instantanément par email au destinataire avec votre message personnalisé.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={1} className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-mp-ocean/10 flex items-center justify-center">
                <Gift className="w-6 h-6 text-mp-ocean" aria-hidden="true" />
              </div>
              <h3 className="font-heading text-sm font-semibold text-mp-charcoal">Valable 1 an</h3>
              <p className="font-body text-xs text-mp-text-light max-w-xs">
                Le bénéficiaire a un an pour utiliser sa carte cadeau sur tous les types de cours.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={2} className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-mp-rose/10 flex items-center justify-center">
                <Heart className="w-6 h-6 text-mp-rose" aria-hidden="true" />
              </div>
              <h3 className="font-heading text-sm font-semibold text-mp-charcoal">Un cadeau unique</h3>
              <p className="font-body text-xs text-mp-text-light max-w-xs">
                Offrez du bien-être et de la sérénité. Un cadeau qui fait vraiment plaisir.
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-12 bg-mp-white">
        <div className="mp-container max-w-2xl text-center">
          <ScrollReveal>
            <div className="flex justify-center gap-0.5 text-mp-gold mb-4" aria-hidden="true">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <blockquote className="font-body text-lg text-mp-text leading-relaxed italic mb-4">
              &laquo; Ma fille m&apos;a offert une carte cadeau pour mon anniversaire. J&apos;ai d&eacute;couvert le Pilates &agrave; 62 ans et c&apos;est devenu mon moment pr&eacute;f&eacute;r&eacute; de la semaine. Merci pour cette id&eacute;e g&eacute;niale ! &raquo;
              <footer className="mt-4 not-italic">
                <cite className="font-heading text-sm font-semibold text-mp-charcoal not-italic">Fran&ccedil;oise P.</cite>
                <p className="text-xs text-mp-text-muted">B&eacute;n&eacute;ficiaire d&apos;une carte cadeau</p>
              </footer>
            </blockquote>
          </ScrollReveal>
        </div>
      </section>

      {/* Gift card FAQ */}
      <section className="mp-section bg-mp-cream">
        <div className="mp-container max-w-3xl">
          <ScrollReveal className="text-center mb-10">
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-mp-charcoal mb-3">
              Questions fr&eacute;quentes
            </h2>
          </ScrollReveal>
          <div className="space-y-3">
            {giftCardFaqItems.map((faq) => (
              <details key={faq.q} className="group scroll-mt-28 bg-mp-white rounded-xl border border-mp-sand-dark/20 overflow-hidden">
                <summary className="flex items-center justify-between gap-4 p-5 cursor-pointer font-heading font-semibold text-sm text-mp-charcoal hover:text-mp-ocean transition-colors list-none [&::-webkit-details-marker]:hidden">
                  {faq.q}
                  <ChevronRight className="w-4 h-4 text-mp-text-light group-open:rotate-90 transition-transform flex-shrink-0" aria-hidden="true" />
                </summary>
                <div className="px-5 pb-5 pt-0">
                  <p className="font-body text-sm text-mp-text-light leading-relaxed">{faq.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
