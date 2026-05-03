import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Heart,
  Sparkles,
  Baby,
  Leaf,
  Flame,
  CheckCircle,
  Users,
  ArrowRight,
  CalendarDays,
} from "lucide-react";
import { clsx } from "clsx";
import { ChevronRight } from "lucide-react";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ReviewSection } from "@/components/ui/ReviewSection";
import { SITE_URL } from "@/lib/env";
import {
  courses,
  courseTypeColors,
  courseTypeLabels,
  getSessionsByCourseType,
  dayNames,
  type CourseInfo,
  type CourseType,
} from "@/lib/mock-data";

const courseFaqs: Record<string, { q: string; a: string }[]> = {
  tapis: [
    { q: "Faut-il être souple pour faire du Pilates classique au tapis ?", a: "Non, la souplesse n'est pas un prérequis. Le Pilates classique au tapis s'adapte à tous les niveaux et la souplesse s'améliore naturellement avec la pratique." },
    { q: "Quelle est la différence avec le yoga ?", a: "Le Pilates se concentre sur le renforcement du centre (abdominaux profonds, dos, plancher pelvien) avec des mouvements précis et contrôlés, tandis que le yoga met davantage l'accent sur la méditation et les postures statiques." },
    { q: "À quelle fréquence pratiquer ?", a: "Idéalement 2 à 3 fois par semaine pour des résultats optimaux. Une fois par semaine suffit pour maintenir les bienfaits." },
  ],
  appareils: [
    { q: "Quelle est la différence avec le cours tapis ?", a: "Le cours sur appareils utilise le Reformer Cadillac et d'autres équipements à ressorts. La résistance variable permet un travail musculaire plus profond et progressif que le tapis, tout en restant accessible grâce aux charges ajustables." },
    { q: "Combien de personnes par cours ?", a: "Maximum 4 participants — un format intermédiaire entre le tapis (5 max) et le privé (1-à-1) qui garantit un suivi rapproché par Violette tout en gardant l'émulation du collectif." },
    { q: "Faut-il avoir déjà fait du Pilates ?", a: "Non, ce cours est ouvert à tous niveaux. Violette adapte les charges et les variantes selon chaque participant. Les vrais débutants peuvent préférer commencer par le tapis ou un cours privé pour les fondamentaux." },
  ],
  prenatal: [
    { q: "À partir de quel mois de grossesse puis-je commencer ?", a: "Le Pilates prénatal est accessible dès le 2e trimestre (à partir de 14 semaines), avec un avis médical favorable." },
    { q: "Y a-t-il des contre-indications ?", a: "Le Pilates prénatal est contre-indiqué en cas de grossesse à risque, de menace d'accouchement prématuré ou sur avis médical contraire. Consultez votre sage-femme ou gynécologue." },
    { q: "Et après l'accouchement ?", a: "Oui, le volet post-natal accompagne la reprise en douceur : rééducation du périnée et du transverse, retour progressif à la forme. Avec accord de votre sage-femme ou médecin, généralement après la visite post-partum." },
  ],
  doux: [
    { q: "Quelle est la différence avec le Pilates classique au tapis ?", a: "Le Pilates doux propose un rythme plus lent, des mouvements plus accessibles et un accent sur la respiration et le relâchement. Idéal en récupération, pour les seniors ou pour les débutants." },
    { q: "Ce cours est-il adapté aux seniors ?", a: "Oui, le Pilates doux convient très bien aux personnes souhaitant entretenir mobilité, équilibre et force en douceur, sans limite d'âge." },
    { q: "Ce cours est-il adapté après une blessure ?", a: "Oui, le Pilates doux est particulièrement indiqué en phase de récupération. Informez Violette de votre situation pour des adaptations personnalisées." },
  ],
  intensif: [
    { q: "Quel niveau faut-il pour le cours avancé ?", a: "Ce cours s'adresse aux pratiquants ayant au moins 3 mois d'expérience en Pilates. Il est déconseillé aux grands débutants." },
    { q: "Va-t-on transpirer ?", a: "Oui ! Le Pilates avancé combine enchaînements dynamiques, séries longues et temps de repos courts. C'est un vrai challenge physique." },
  ],
}

const courseHeroImages: Partial<Record<CourseType, string>> = {
  tapis: "/images/illustration-cours-collectif.webp",
  appareils: "/images/cours-reformer-instructrice.webp",
  prenatal: "/images/illustration-pilates-artistique.webp",
  doux: "/images/illustration-pilates-artistique.webp",
  intensif: "/images/illustration-pilates-artistique.webp",
};

/* ----------------------------------------------------------
   Static params for the 6 slugs
   ---------------------------------------------------------- */
export function generateStaticParams() {
  return courses.map((c) => ({ slug: c.slug }));
}

/* ----------------------------------------------------------
   Dynamic metadata — per-course SEO tuned for local + service queries
   ---------------------------------------------------------- */
const courseSeoMeta: Record<string, { title: string; description: string }> = {
  tapis: {
    title: "Pilates tapis à Larmor-Plage — cours Lorient Morbihan",
    description:
      "Cours de Pilates classique au tapis à Larmor-Plage, près de Lorient. Groupes de 5 max face à l'océan. Essai à 10€, réservez votre première séance en ligne.",
  },
  appareils: {
    title: "Pilates collectif sur appareils — Larmor-Plage Lorient",
    description:
      "Cours collectif sur Reformer Cadillac à Larmor-Plage (Lorient, Morbihan). Petit groupe de 4, charges adaptées. Essai à 10€, réservez votre séance en ligne.",
  },
  prenatal: {
    title: "Pilates prénatal à Larmor-Plage — Lorient Morbihan",
    description:
      "Cours de Pilates prénatal et post-natal à Larmor-Plage, près de Lorient. Séances adaptées à chaque trimestre par une instructrice FPMP. Réservez votre essai.",
  },
  doux: {
    title: "Pilates doux à Larmor-Plage — seniors Lorient Morbihan",
    description:
      "Pilates doux à Larmor-Plage : idéal seniors, récupération et débutants en Morbihan. Petits groupes face à l'océan, à 10 min de Lorient. Essai 10€, réservez.",
  },
  intensif: {
    title: "Pilates avancé à Larmor-Plage — cours Lorient Bretagne",
    description:
      "Cours de Pilates avancé au tapis à Larmor-Plage, près de Lorient. Enchaînements dynamiques en petit groupe pour pratiquants confirmés. Essai à 10€ en ligne.",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const course = courses.find((c) => c.slug === slug);
  if (!course) {
    return { title: "Cours introuvable" };
  }
  const seo = courseSeoMeta[course.slug];
  const fallbackTitle = `${course.name} — Cours à Larmor-Plage (Lorient)`;
  const fallbackDescription = `${course.shortDescription} Cours à Larmor-Plage, près de Lorient. Réservez votre essai à 10\u20ac au studio Mon Pilates.`;
  const title = seo?.title ?? fallbackTitle;
  const description = seo?.description ?? fallbackDescription;
  return {
    title,
    description,
    openGraph: {
      title: `${title} | Mon Pilates`,
      description,
    },
    alternates: {
      canonical: `${SITE_URL}/cours/${slug}`,
    },
  };
}

const courseIcons: Record<string, React.ElementType> = {
  tapis: Heart,
  appareils: Sparkles,
  prenatal: Baby,
  doux: Leaf,
  intensif: Flame,
};

/* ============================================================
   PAGE COMPONENT
   ============================================================ */
export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = courses.find((c) => c.slug === slug);

  if (!course) {
    notFound();
  }

  const colors = courseTypeColors[course.slug as CourseType];
  const Icon = courseIcons[course.slug] || Heart;
  const sessions = getSessionsByCourseType(course.slug as CourseType);

  const heroImage = courseHeroImages[course.slug as CourseType];

  const courseJsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.name,
    description: course.shortDescription,
    courseMode: "onsite",
    inLanguage: "fr",
    provider: {
      "@type": "Organization",
      name: "Mon Pilates",
      url: SITE_URL,
      sameAs: [
        "https://www.instagram.com/monpilates.bzh",
        "https://www.facebook.com/MonPilatesBZH",
      ],
    },
    locationCreated: {
      "@type": "PostalAddress",
      streetAddress: "14 Boulevard des Dunes",
      addressLocality: "Larmor-Plage",
      postalCode: "56260",
      addressRegion: "Morbihan",
      addressCountry: "FR",
    },
    hasCourseInstance: sessions.map((s) => ({
      "@type": "CourseInstance",
      courseMode: "onsite",
      instructor: {
        "@type": "Person",
        name: s.instructor,
      },
      location: {
        "@type": "Place",
        name: "Studio Mon Pilates",
        address: {
          "@type": "PostalAddress",
          streetAddress: "14 Boulevard des Dunes",
          addressLocality: "Larmor-Plage",
          postalCode: "56260",
          addressCountry: "FR",
        },
      },
    })),
    offers: {
      "@type": "Offer",
      price: "10",
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
      url: `${SITE_URL}/cours/${course.slug}`,
      description: "Cours d'essai",
    },
  };

  return (
    <div className="pt-20">
      <BreadcrumbJsonLd items={[
        { name: "Accueil", href: "/" },
        { name: "Cours", href: "/cours" },
        { name: course.name, href: `/cours/${course.slug}` },
      ]} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseJsonLd) }}
      />
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-mp-sand via-mp-cream to-mp-ocean-light/10 py-16 sm:py-20 overflow-hidden">
        <div className="mp-container">
          <div className="relative z-10">
            <Breadcrumb items={[
              { name: "Accueil", href: "/" },
              { name: "Cours", href: "/cours" },
              { name: course.name, href: `/cours/${course.slug}` },
            ]} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div
                  className={clsx(
                    "w-14 h-14 rounded-2xl flex items-center justify-center",
                    colors.bg,
                    colors.text
                  )}
                >
                  <Icon className="w-7 h-7" aria-hidden="true" />
                </div>
                <div>
                  <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-mp-charcoal">
                    {course.name}
                  </h1>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span
                      className={clsx(
                        "text-sm font-heading font-medium px-3 py-1 rounded-full",
                        colors.bg,
                        colors.text
                      )}
                    >
                      {course.level}
                    </span>
                    <span className="text-sm font-heading font-medium bg-mp-sand px-3 py-1 rounded-full text-mp-charcoal">
                      {course.duration}
                    </span>
                    <div className="flex items-center gap-1 ml-1">
                      {[1, 2, 3, 4, 5].map((dot) => (
                        <span
                          key={dot}
                          className={clsx(
                            "w-2 h-2 rounded-full",
                            dot <= course.intensity ? colors.dot : "bg-mp-sand-dark/40"
                          )}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <p className="font-body text-mp-text-light leading-relaxed mt-4 max-w-lg">
                {course.shortDescription}
              </p>
            </div>

            {/* Hero image — only rendered on lg+ screens. Drop `priority` so mobile users don't
                fetch a DOM-hidden asset; keep a sensible `sizes` for the desktop layout. */}
            {heroImage && (
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg hidden lg:block">
                <Image
                  src={heroImage}
                  alt={`Illustration du cours ${course.name}`}
                  title={course.name}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 50vw, 100vw"
                />
              </div>
            )}
          </div>
        </div>
        {/* Color accent line */}
        <div className={clsx("absolute bottom-0 left-0 right-0 h-1", colors.dot)} />
      </section>

      {/* Content */}
      <section className="mp-section bg-mp-white">
        <div className="mp-container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-10">
              {/* Description */}
              <div>
                <h2 className="font-heading text-2xl font-bold text-mp-charcoal mb-4">
                  Description
                </h2>
                <p className="font-body text-mp-text leading-relaxed text-base">
                  {course.longDescription}
                </p>
              </div>

              {/* Bienfaits */}
              <div>
                <h2 className="font-heading text-2xl font-bold text-mp-charcoal mb-4">
                  Bienfaits
                </h2>
                <ul className="space-y-3">
                  {course.benefits.map((b, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle
                        className={clsx("w-5 h-5 mt-0.5 shrink-0", colors.text)}
                        aria-hidden="true"
                      />
                      <span className="font-body text-mp-text">{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Pour qui */}
              <div>
                <h2 className="font-heading text-2xl font-bold text-mp-charcoal mb-4">
                  Pour qui ?
                </h2>
                <ul className="space-y-3">
                  {course.targetAudience.map((t, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Users
                        className="w-5 h-5 mt-0.5 text-mp-ocean shrink-0"
                        aria-hidden="true"
                      />
                      <span className="font-body text-mp-text">{t}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Matériel */}
              <div>
                <h2 className="font-heading text-2xl font-bold text-mp-charcoal mb-4">
                  Matériel nécessaire
                </h2>
                <ul className="space-y-2">
                  {course.equipment.map((e, i) => (
                    <li
                      key={i}
                      className="font-body text-mp-text flex items-center gap-2"
                    >
                      <span
                        className={clsx(
                          "w-1.5 h-1.5 rounded-full shrink-0",
                          colors.dot
                        )}
                      />
                      {e}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6 lg:sticky lg:top-28 lg:self-start">
              {/* Upcoming sessions */}
              <div className="bg-mp-cream rounded-2xl p-6">
                <h3 className="font-heading text-lg font-bold text-mp-charcoal mb-4 flex items-center gap-2">
                  <CalendarDays className="w-5 h-5 text-mp-ocean" aria-hidden="true" />
                  Prochaines séances
                </h3>

                {sessions.length === 0 ? (
                  <p className="font-body text-sm text-mp-text-light italic">
                    Aucune séance programmée cette semaine.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {sessions.slice(0, 5).map((s) => (
                      <div
                        key={s.id}
                        className="bg-white rounded-xl p-3 border border-mp-sand-dark/30"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-heading text-sm font-semibold text-mp-charcoal">
                            {dayNames[s.dayOffset]}
                          </span>
                          <span
                            className={clsx(
                              "text-xs font-heading font-medium",
                              s.spotsRemaining <= 2
                                ? "text-red-600"
                                : "text-mp-sage"
                            )}
                          >
                            {s.spotsRemaining === 0
                              ? "Complet"
                              : `${s.spotsRemaining} place${s.spotsRemaining > 1 ? "s" : ""}`}
                          </span>
                        </div>
                        <p className="text-xs text-mp-text-light">
                          {s.time} · {s.duration} · {s.instructor}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                <Link
                  href="/planning"
                  className="mp-btn mp-btn-primary w-full mt-4 text-sm"
                >
                  Voir le planning complet
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </div>

              {/* CTA card */}
              <div
                className={clsx(
                  "rounded-2xl p-6 text-white",
                  colors.dot
                )}
              >
                <h3 className="font-heading text-xl font-bold mb-2">
                  Envie d&apos;essayer ?
                </h3>
                <p className="text-white/80 text-sm font-body mb-2">
                  Votre première séance d&apos;essai à seulement
                </p>
                <p className="font-heading text-3xl font-bold mb-3">
                  10&euro;
                </p>
                <Link
                  href="/planning"
                  className="mp-btn bg-white text-mp-charcoal hover:bg-mp-cream font-semibold w-full text-sm"
                >
                  Réserver ce cours
                </Link>
                <p className="text-white/80 text-xs font-body mt-3 text-center">
                  Sans engagement · satisfait(e) ou remboursé(e)
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ du cours */}
      {(() => {
        const faqs = courseFaqs[course.slug]
        if (!faqs || faqs.length === 0) return null
        return (
        <>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: faqs.map((faq) => ({
                "@type": "Question",
                name: faq.q,
                acceptedAnswer: { "@type": "Answer", text: faq.a },
              })),
            }) }}
          />
          <section className="mp-section bg-mp-sand/30">
            <div className="mp-container max-w-3xl">
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-mp-charcoal mb-8 text-center">
                Questions fréquentes — {course.name}
              </h2>
              <div className="space-y-3">
                {faqs.map((faq, i) => (
                  <details key={i} className="group scroll-mt-28 bg-mp-white rounded-xl border border-mp-sand-dark/20 overflow-hidden">
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
        )
      })()}

      {/* Avis des participants */}
      <section className="mp-section bg-mp-white">
        <div className="mp-container max-w-3xl">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-mp-charcoal mb-8 text-center">
            Avis des participants
          </h2>
          <ReviewSection courseTypeSlug={slug} />
        </div>
      </section>

      {/* Autres cours */}
      <section className="mp-section bg-mp-cream">
        <div className="mp-container">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-mp-charcoal mb-8">
            Autres cours
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses
              .filter((c) => c.slug !== course.slug)
              .slice(0, 3)
              .map((other) => {
                const otherColors = courseTypeColors[other.slug as CourseType];
                const OtherIcon = courseIcons[other.slug] || Heart;
                return (
                  <Link
                    key={other.slug}
                    href={`/cours/${other.slug}`}
                    className="group block"
                  >
                    <div className="mp-card flex flex-col h-full border border-mp-sand-dark/30 hover:border-mp-ocean/20">
                      <div
                        className={clsx("h-1.5 w-full", otherColors.dot)}
                      />
                      <div className="p-6 flex flex-col flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div
                            className={clsx(
                              "w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110",
                              otherColors.bg,
                              otherColors.text
                            )}
                          >
                            <OtherIcon className="w-5 h-5" aria-hidden="true" />
                          </div>
                          <h3 className="font-heading text-lg font-semibold text-mp-charcoal group-hover:text-mp-ocean transition-colors">
                            {other.name}
                          </h3>
                        </div>
                        <p className="font-body text-sm text-mp-text-light leading-relaxed mb-4 flex-1">
                          {other.shortDescription}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-heading font-medium bg-mp-sand px-2.5 py-1 rounded-full text-mp-charcoal">
                            {other.duration}
                          </span>
                          <span
                            className={clsx(
                              "text-xs font-heading font-medium px-2.5 py-1 rounded-full",
                              otherColors.bg,
                              otherColors.text
                            )}
                          >
                            {other.level}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
          </div>
          <div className="text-center mt-8">
            <Link href="/cours" className="mp-btn mp-btn-secondary text-sm">
              Voir tous les cours
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* Final reservation CTA */}
      <section className="mp-section bg-gradient-to-br from-mp-ocean to-mp-ocean-dark text-white">
        <div className="mp-container text-center">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-3 text-white">
            Réserver {course.name}
          </h2>
          <p className="font-body text-white/80 max-w-md mx-auto mb-6">
            1<sup>er</sup> cours d&apos;essai à 10&nbsp;€ — sans engagement, satisfait(e) ou remboursé(e).
          </p>
          <Link
            href="/planning"
            className="mp-btn bg-white text-mp-ocean hover:bg-mp-cream font-semibold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"
          >
            <CalendarDays className="w-5 h-5" aria-hidden="true" />
            Voir les prochains créneaux
          </Link>
        </div>
      </section>
    </div>
  );
}
