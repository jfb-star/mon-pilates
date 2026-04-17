import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import {
  CheckCircle,
  Calendar,
  MapPin,
  Clock,
  Shirt,
  Droplets,
  ArrowRight,
  Star,
  Heart,
} from "lucide-react"
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd"
import { Breadcrumb } from "@/components/ui/Breadcrumb"
import { StickyCta } from "@/components/ui/StickyCta"
import { CourseQuiz } from "@/components/ui/CourseQuiz"
import { ScrollReveal } from "@/components/ui/ScrollReveal"
import { FirstTimerRedirect } from "@/components/ui/FirstTimerRedirect"

export const metadata: Metadata = {
  title: "Première visite — Ce qu'il faut savoir",
  description:
    "Tout savoir avant votre premier cours de Pilates chez Mon Pilates à Larmor-Plage. Quoi apporter, comment s'inscrire, déroulement de la séance.",
  openGraph: {
    title: "Première visite | Mon Pilates",
    description:
      "Votre premier cours d'essai à 10€. Tout ce qu'il faut savoir avant de venir au studio.",
    images: [
      {
        url: "/images/studio-reformer-ocean.jpg",
        width: 1920,
        height: 1080,
        alt: "Studio de Pilates Mon Pilates avec Reformers et vue sur l'océan à Larmor-Plage",
      },
    ],
  },
  alternates: {
    canonical: "https://mon-pilates.bzh/premiere-visite",
  },
}

const steps = [
  {
    number: "1",
    title: "Réservez en ligne",
    description:
      "Choisissez votre créneau sur notre planning et réservez en quelques clics. Votre cours d'essai est à seulement 10€, satisfait(e) ou remboursé(e).",
    icon: Calendar,
  },
  {
    number: "2",
    title: "Préparez-vous",
    description:
      "Venez en tenue confortable et près du corps. Pas besoin de chaussures — nous pratiquons pieds nus ou en chaussettes antidérapantes. Pensez à apporter une bouteille d'eau.",
    icon: Shirt,
  },
  {
    number: "3",
    title: "Arrivez 10 minutes avant",
    description:
      "Cela nous laisse le temps de vous accueillir, de faire un bilan rapide de votre forme physique et de répondre à vos questions. Le studio est au 14 Boulevard des Dunes.",
    icon: Clock,
  },
  {
    number: "4",
    title: "Profitez de votre séance",
    description:
      "L'instructrice adapte les exercices à votre niveau. Pas de pression, pas de jugement — juste du mouvement, de la respiration et du bien-être. Vous allez adorer.",
    icon: Heart,
  },
]

const faq = [
  {
    q: "Faut-il avoir déjà fait du Pilates ?",
    a: "Pas du tout ! Nos cours accueillent tous les niveaux. L'instructrice adapte chaque exercice à votre capacité. Le cours Pilates Mat Fondamental ou Pilates Doux sont idéaux pour commencer.",
  },
  {
    q: "Que dois-je apporter ?",
    a: "Juste vous-même et une tenue confortable. Tout le matériel est fourni (tapis, accessoires, Reformer). Apportez une bouteille d'eau si vous le souhaitez.",
  },
  {
    q: "Les cours sont-ils adaptés en cas de mal de dos ?",
    a: "Oui, le Pilates est reconnu pour soulager les douleurs dorsales. Prévenez l'instructrice de vos soucis avant le cours pour qu'elle adapte les exercices.",
  },
  {
    q: "Combien de temps dure un cours ?",
    a: "Entre 45 et 55 minutes selon le type de cours. Les cours Senior durent 45 min, les cours Mat et Intensif 55 min, et les cours Reformer, Prénatal et Doux 50 min.",
  },
  {
    q: "Et si le cours ne me plaît pas ?",
    a: "Votre cours d'essai est satisfait(e) ou remboursé(e). Si le Pilates ne vous convient pas, nous vous remboursons intégralement.",
  },
  {
    q: "Où se garer ?",
    a: "Un parking gratuit est disponible devant le studio, sur le Boulevard des Dunes. Le studio est également accessible en bus (arrêt Les Dunes).",
  },
]

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
}

const howToJsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "Comment se préparer à son premier cours de Pilates",
  description: "4 étapes simples pour vivre votre première expérience Pilates chez Mon Pilates à Larmor-Plage.",
  totalTime: "PT15M",
  step: steps.map((step, i) => ({
    "@type": "HowToStep",
    position: i + 1,
    name: step.title,
    text: step.description,
  })),
}

export default function PremiereVisitePage() {
  return (
    <>
      <FirstTimerRedirect to="/planning" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Accueil", href: "/" },
          { name: "Première visite", href: "/premiere-visite" },
        ]}
      />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-mp-ocean/10 via-mp-cream to-mp-sage-light/20 pt-32 pb-16 sm:pb-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <Image
            src="/images/studio-reformer-ocean.jpg"
            alt="Studio Mon Pilates avec Reformers et vue sur l'océan à Larmor-Plage"
            fill
            className="object-cover"
            priority
            fetchPriority="high"
            sizes="100vw"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAoHBwgHBgoICAgLCgoLDhgQDg0NDh0VFhEYIx8lJCIfIiEmKzcvJik0KSEiMEExNDk7Pj4+JS5ESUM8SDc9Pjv/2wBDAQoLCw4NDhwQEBw7KCIoOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozv/wAARCAAIABADASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABgUH/8QAIhAAAgIBAwQDAAAAAAAAAAAAAQIDBAAFBhESITFBE2Fx/8QAFQEBAQAAAAAAAAAAAAAAAAAAAwT/xAAaEQACAwEBAAAAAAAAAAAAAAABAgADESEx/9oADAMBAAIRAxEAPwCbq26tLpbMtKzVkuKjdBFLTmSYj1xrr2t7a6lJJDT0iy8bFVZ5nVSR9ADIe67U0WrSiWOhDVcKFLRscZplXMiGhYVSZ//9k="
          />
        </div>
        <div className="mp-container relative z-10">
          <Breadcrumb items={[
            { name: "Accueil", href: "/" },
            { name: "Première visite", href: "/premiere-visite" },
          ]} />
        </div>
        <div className="mp-container relative z-10 text-center">
          <p className="font-heading text-sm font-semibold text-mp-ocean uppercase tracking-[0.2em] mb-3">
            Bienvenue
          </p>
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-mp-charcoal mb-6">
            Votre première visite
          </h1>
          <p className="font-body text-lg sm:text-xl text-mp-text-light leading-relaxed max-w-2xl mx-auto mb-8">
            Tout ce qu&apos;il faut savoir avant votre premier cours de Pilates
            chez Mon Pilates. Spoiler : c&apos;est simple et on s&apos;occupe
            de tout.
          </p>
          <Link href="/planning" className="mp-btn mp-btn-primary text-base">
            <Calendar className="w-5 h-5" aria-hidden="true" />
            Réserver mon cours d&apos;essai — 10&euro;
          </Link>
        </div>
      </section>

      {/* Quick trust strip */}
      <div className="bg-mp-white border-b border-mp-sand-dark/10">
        <div className="mp-container py-5 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-center">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-mp-gold fill-current" aria-hidden="true" />
            <span className="font-heading text-sm font-semibold text-mp-charcoal">4.9/5</span>
            <span className="text-sm text-mp-text-light font-body">sur Google</span>
          </div>
          <span className="hidden sm:inline text-mp-sand-dark" aria-hidden="true">|</span>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-mp-sage" aria-hidden="true" />
            <span className="text-sm text-mp-text-light font-body">Satisfait(e) ou rembours&eacute;(e)</span>
          </div>
          <span className="hidden sm:inline text-mp-sand-dark" aria-hidden="true">|</span>
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-mp-rose" aria-hidden="true" />
            <span className="text-sm text-mp-text-light font-body">+200 &eacute;l&egrave;ves satisfaits</span>
          </div>
        </div>
      </div>

      {/* Steps */}
      <section className="mp-section bg-mp-white">
        <div className="mp-container">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-mp-charcoal mb-4">
              Comment ça se passe ?
            </h2>
            <p className="font-body text-mp-text-light max-w-xl mx-auto">
              4 étapes simples pour vivre votre première expérience Pilates.
            </p>
          </div>
          {/* Mobile: vertical timeline / Desktop: horizontal */}
          <div className="hidden lg:grid lg:grid-cols-4 gap-8 relative">
            {/* Connector line */}
            <div className="absolute top-8 left-[calc(12.5%+1rem)] right-[calc(12.5%+1rem)] h-0.5 bg-gradient-to-r from-mp-ocean/20 via-mp-ocean/40 to-mp-ocean/20" aria-hidden="true" />
            {steps.map((step, i) => (
              <ScrollReveal key={step.number} delay={i as 0 | 1 | 2 | 3} className="text-center relative">
                <div className="w-16 h-16 rounded-2xl bg-mp-ocean/10 flex items-center justify-center mx-auto mb-4 relative z-10">
                  <step.icon className="w-8 h-8 text-mp-ocean" aria-hidden="true" />
                </div>
                <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-mp-ocean text-white font-heading font-bold text-sm mb-3">
                  {step.number}
                </div>
                <h3 className="font-heading text-lg font-semibold text-mp-charcoal mb-2">
                  {step.title}
                </h3>
                <p className="font-body text-sm text-mp-text-light leading-relaxed">
                  {step.description}
                </p>
              </ScrollReveal>
            ))}
          </div>

          {/* Mobile: vertical timeline */}
          <div className="lg:hidden space-y-0 relative">
            {/* Vertical connector line */}
            <div className="absolute left-7 top-8 bottom-8 w-0.5 bg-gradient-to-b from-mp-ocean/30 via-mp-ocean/20 to-mp-ocean/10" aria-hidden="true" />
            {steps.map((step, i) => (
              <ScrollReveal key={step.number} delay={Math.min(i, 3) as 0 | 1 | 2 | 3}>
                <div className="flex gap-5 py-6">
                  <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-mp-ocean/10 flex items-center justify-center relative z-10">
                    <step.icon className="w-7 h-7 text-mp-ocean" aria-hidden="true" />
                  </div>
                  <div className="flex-1 pt-1">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-mp-ocean text-white font-heading font-bold text-xs mb-2">
                      {step.number}
                    </span>
                    <h3 className="font-heading text-lg font-semibold text-mp-charcoal mb-1.5">
                      {step.title}
                    </h3>
                    <p className="font-body text-sm text-mp-text-light leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* What to bring */}
      <section className="mp-section bg-mp-cream">
        <div className="mp-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="font-heading text-sm font-semibold text-mp-ocean uppercase tracking-[0.2em] mb-3">
                Checklist
              </p>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-mp-charcoal mb-6">
                Quoi apporter ?
              </h2>
              <ul className="space-y-4">
                {[
                  { icon: Shirt, text: "Tenue confortable et près du corps (legging, brassière, t-shirt ajusté)" },
                  { icon: Droplets, text: "Une bouteille d'eau (optionnel — fontaine disponible au studio)" },
                  { icon: CheckCircle, text: "Chaussettes antidérapantes (recommandé pour le Reformer, optionnel pour le Mat)" },
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-mp-sage/10 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5 text-mp-sage" aria-hidden="true" />
                    </div>
                    <p className="font-body text-mp-text leading-relaxed pt-2">
                      {item.text}
                    </p>
                  </li>
                ))}
              </ul>
              <div className="mt-6 p-4 bg-mp-ocean/5 rounded-xl border border-mp-ocean/10">
                <p className="font-body text-sm text-mp-text-light">
                  <strong className="text-mp-charcoal">Pas besoin d&apos;acheter quoi que ce soit !</strong>{" "}
                  Tout le matériel (tapis, accessoires, Reformer) est fourni au studio.
                </p>
              </div>
            </div>
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
              <Image
                src="/images/studio-materiel.jpg"
                alt="Équipement du studio Mon Pilates : tapis, ballons, élastiques et accessoires de Pilates"
                fill
                loading="lazy"
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="mp-section bg-mp-white">
        <div className="mp-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="lg:order-2">
              <p className="font-heading text-sm font-semibold text-mp-ocean uppercase tracking-[0.2em] mb-3">
                Accès
              </p>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-mp-charcoal mb-6">
                Nous trouver
              </h2>
              <address className="not-italic space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-mp-ocean/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-mp-ocean" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-heading font-semibold text-mp-charcoal">
                      14 Boulevard des Dunes
                    </p>
                    <p className="font-body text-sm text-mp-text-light">
                      56260 Larmor-Plage — à 10 <abbr title="minutes">min</abbr> de Lorient
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-mp-ocean/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-mp-ocean" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-heading font-semibold text-mp-charcoal">
                      Horaires
                    </p>
                    <p className="font-body text-sm text-mp-text-light">
                      Lundi - Vendredi : 9h - 20h
                      <br />
                      Samedi : 9h - 14h
                    </p>
                  </div>
                </div>
              </address>
              <p className="font-body text-sm text-mp-text-light mt-6">
                Parking gratuit devant le studio. Bus : arrêt &laquo; Les Dunes &raquo;.
              </p>
            </div>
            <div className="lg:order-1 rounded-2xl overflow-hidden shadow-lg border border-mp-sand-dark/30">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2661.5!2d-3.3864!3d47.7083!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDfCsDQyJzI5LjkiTiAzwrAyMycxMS4wIlc!5e0!3m2!1sfr!2sfr!4v1700000000000"
                width="100%"
                height="350"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Localisation Mon Pilates - Larmor-Plage"
                className="w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Quiz */}
      <section className="mp-section bg-mp-white">
        <div className="mp-container max-w-xl">
          <div className="text-center mb-8">
            <p className="font-heading text-sm font-semibold text-mp-ocean uppercase tracking-[0.2em] mb-3">
              Quiz rapide
            </p>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-mp-charcoal mb-4">
              Quel cours est fait pour vous ?
            </h2>
            <p className="font-body text-mp-text-light max-w-md mx-auto">
              Répondez à 3 questions pour trouver votre cours idéal.
            </p>
          </div>
          <div className="mp-card p-6 sm:p-8 border border-mp-sand-dark/30">
            <CourseQuiz />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mp-section bg-mp-cream">
        <div className="mp-container max-w-3xl">
          <div className="text-center mb-12">
            <p className="font-heading text-sm font-semibold text-mp-ocean uppercase tracking-[0.2em] mb-3">
              <abbr title="Foire aux questions" className="no-underline">FAQ</abbr>
            </p>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-mp-charcoal mb-4">
              Questions fréquentes
            </h2>
            <p className="font-body text-mp-text-light max-w-lg mx-auto">
              Tout ce que vous devez savoir avant votre première séance.
            </p>
          </div>
          <div className="space-y-4">
            {faq.map((item, i) => (
              <details
                key={i}
                className="mp-card p-6 border border-mp-sand-dark/30 group scroll-mt-28"
              >
                <summary className="font-heading font-semibold text-mp-charcoal cursor-pointer list-none flex items-center justify-between gap-4">
                  {item.q}
                  <ArrowRight className="w-4 h-4 text-mp-ocean transition-transform group-open:rotate-90 flex-shrink-0" aria-hidden="true" />
                </summary>
                <p className="font-body text-sm text-mp-text-light leading-relaxed mt-4 pt-4 border-t border-mp-sand-dark/20">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="mp-section bg-mp-white">
        <div className="mp-container max-w-2xl text-center">
          <Star className="w-8 h-8 text-mp-gold mx-auto mb-4" aria-hidden="true" />
          <blockquote className="font-body text-lg sm:text-xl text-mp-text italic leading-relaxed mb-6">
            &laquo; J&apos;avais peur de ne pas être au niveau, mais Marie m&apos;a
            mise à l&apos;aise dès les premières minutes. Le cadre est magnifique
            et les exercices parfaitement adaptés. J&apos;y retourne chaque
            semaine depuis ! &raquo;
            <footer className="mt-6 not-italic">
              <cite className="font-heading font-semibold text-mp-charcoal not-italic">
                Isabelle D.
              </cite>
              <p className="text-sm text-mp-text-light">
                Élève depuis 6 mois
              </p>
            </footer>
          </blockquote>
        </div>
      </section>

      {/* Related blog */}
      <section className="mp-section bg-mp-sand/30">
        <div className="mp-container">
          <ScrollReveal className="text-center mb-10">
            <p className="font-heading text-sm font-semibold text-mp-ocean uppercase tracking-[0.2em] mb-3">
              Pour aller plus loin
            </p>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-mp-charcoal">
              Articles utiles pour d&eacute;buter
            </h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { title: "5 exercices pour le mal de dos", slug: "5-exercices-pilates-mal-de-dos", readTime: "6 min" },
              { title: "Reformer vs Mat Pilates", slug: "reformer-vs-mat-pilates", readTime: "4 min" },
              { title: "La respiration en Pilates", slug: "respiration-pilates-guide-debutant", readTime: "4 min" },
            ].map((article) => (
              <ScrollReveal key={article.slug}>
                <Link href={`/blog/${article.slug}`} className="block group">
                  <div className="mp-card p-5 border border-mp-sand-dark/20 hover:border-mp-ocean/20 h-full">
                    <h3 className="font-heading text-sm font-semibold text-mp-charcoal group-hover:text-mp-ocean transition-colors mb-2">
                      {article.title}
                    </h3>
                    <span className="text-xs text-mp-text-muted font-body">{article.readTime} de lecture</span>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Prochaines étapes */}
      <section className="mp-section bg-mp-white">
        <div className="mp-container max-w-3xl">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-mp-charcoal mb-8 text-center">
            Prochaines étapes
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Link href="/planning" className="group block">
              <div className="mp-card p-6 border border-mp-sand-dark/20 hover:border-mp-ocean/20 h-full flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-mp-ocean/10 flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-5 h-5 text-mp-ocean" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-heading text-base font-semibold text-mp-charcoal group-hover:text-mp-ocean transition-colors mb-1">
                    Réserver un cours
                  </h3>
                  <p className="font-body text-sm text-mp-text-light leading-relaxed">
                    Consultez le planning et réservez votre créneau en quelques clics.
                  </p>
                </div>
              </div>
            </Link>
            <Link href="/cours" className="group block">
              <div className="mp-card p-6 border border-mp-sand-dark/20 hover:border-mp-ocean/20 h-full flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-mp-sage/10 flex items-center justify-center flex-shrink-0">
                  <Heart className="w-5 h-5 text-mp-sage" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-heading text-base font-semibold text-mp-charcoal group-hover:text-mp-ocean transition-colors mb-1">
                    Découvrir nos cours
                  </h3>
                  <p className="font-body text-sm text-mp-text-light leading-relaxed">
                    Mat, Reformer, Prénatal, Senior... trouvez le cours qui vous correspond.
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="mp-section bg-gradient-to-br from-mp-ocean to-mp-ocean-dark text-white">
        <div className="mp-container text-center">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-4">
            Prêt(e) à essayer ?
          </h2>
          <p className="font-body text-lg text-white/80 max-w-md mx-auto mb-8">
            Votre première séance à seulement 10&euro;, satisfait(e) ou
            remboursé(e). Aucun engagement.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/planning"
              className="mp-btn bg-white text-mp-ocean hover:bg-mp-cream font-semibold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"
            >
              <Calendar className="w-5 h-5" aria-hidden="true" />
              Réserver mon cours d&apos;essai
            </Link>
            <Link
              href="/contact"
              className="mp-btn border-2 border-white text-white hover:bg-white/10 font-semibold transition-all"
            >
              Une question ? Contactez-nous
            </Link>
          </div>
        </div>
      </section>

      <StickyCta text="Réserver mon essai" price="10€" />
    </>
  )
}
