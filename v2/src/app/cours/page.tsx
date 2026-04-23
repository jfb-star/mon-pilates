import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Heart,
  Sparkles,
  Baby,
  Leaf,
  Flame,
  ArrowRight,
  Users,
  Sparkle,
} from "lucide-react";
import { clsx } from "clsx";
import { courses, courseTypeColors, type CourseInfo, type CourseType } from "@/lib/mock-data";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { BodyMap } from "@/components/ui/BodyMap";
import { SITE_URL } from "@/lib/env";

const courseImages: Partial<Record<CourseType, string>> = {
  mat: "/images/illustration-cours-collectif.webp",
  reformer: "/images/illustration-cours-machine.webp",
  prenatal: "/images/illustration-cours-prenatal.webp",
  doux: "/images/illustration-cours-doux.webp",
  intensif: "/images/illustration-cours-intensif.webp",
};

export const metadata: Metadata = {
  title: "Nos cours de Pilates",
  description:
    "Découvrez nos 5 types de cours : tapis doux, classique et avancé, cours privés sur appareil et Pilates pré & post-natal. Trouvez le Pilates qui vous correspond.",
  openGraph: {
    title: "Nos cours | Mon Pilates",
    description:
      "Pilates au tapis (doux, classique, avancé), cours privés sur appareil, pré & post-natal — pour tous les niveaux à Larmor-Plage.",
    images: [
      {
        url: "/images/studio-reformer-ocean.webp",
        width: 1920,
        height: 1080,
        alt: "Studio de Pilates Mon Pilates avec Reformer Cadillac et vue sur l'océan à Larmor-Plage",
      },
    ],
  },
  alternates: {
    canonical: `${SITE_URL}/cours`,
  },
};

const courseIcons: Record<string, React.ElementType> = {
  mat: Heart,
  reformer: Sparkles,
  prenatal: Baby,
  doux: Leaf,
  intensif: Flame,
  "reformer-collectif": Sparkle,
};

const coursesItemListJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Cours de Pilates — Mon Pilates",
  numberOfItems: courses.length,
  itemListElement: courses.map((course, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: course.name,
    url: `${SITE_URL}/cours/${course.slug}`,
  })),
};

const sportsActivityLocationJsonLd = {
  "@context": "https://schema.org",
  "@type": "SportsActivityLocation",
  name: "Mon Pilates",
  url: SITE_URL,
  description:
    "Studio de Pilates à Larmor-Plage proposant des cours au tapis (doux, classique, avancé), des cours privés sur appareil et du Pilates pré & post-natal.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Larmor-Plage",
    addressCountry: "FR",
  },
  makesOffer: courses.map((course) => ({
    "@type": "Offer",
    itemOffered: {
      "@type": "Course",
      name: course.name,
      description: course.shortDescription,
      url: `${SITE_URL}/cours/${course.slug}`,
      provider: {
        "@type": "SportsActivityLocation",
        name: "Mon Pilates",
      },
    },
  })),
};

export default function CoursPage() {
  return (
    <div className="pt-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(coursesItemListJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(sportsActivityLocationJsonLd) }}
      />
      <BreadcrumbJsonLd items={[
        { name: "Accueil", href: "/" },
        { name: "Nos cours", href: "/cours" },
      ]} />
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-mp-sand via-mp-cream to-mp-sage-light/20 py-16 sm:py-24 overflow-hidden">
        <div className="mp-container relative z-10 mb-4">
          <Breadcrumb items={[
            { name: "Accueil", href: "/" },
            { name: "Nos cours", href: "/cours" },
          ]} />
        </div>
        {/* Decorative background — opacity-10, not the LCP element. Lazy-loaded so the hero H1 paints first. */}
        <div className="absolute inset-0 opacity-10">
          <Image
            src="/images/studio-reformer-ocean.webp"
            alt=""
            aria-hidden="true"
            fill
            className="object-cover"
            loading="lazy"
            sizes="100vw"
          />
        </div>
        <div className="mp-container text-center relative z-10">
          <p className="font-heading text-sm font-semibold text-mp-ocean uppercase tracking-[0.2em] mb-4">
            Notre offre
          </p>
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-mp-charcoal mb-6">
            Nos cours de Pilates
          </h1>
          <p className="font-body text-lg text-mp-text-light max-w-2xl mx-auto leading-relaxed">
            Que vous soyez débutant ou pratiquant confirmé, enceinte, en reprise
            post-partum ou à la recherche d'un accompagnement sur-mesure, nous
            avons le cours qui vous correspond.
          </p>
        </div>
      </section>

      {/* Quick filter chips */}
      <section className="py-6 bg-mp-white border-b border-mp-sand-dark/10">
        <div className="mp-container">
          <div className="flex flex-wrap justify-center gap-2">
            {courses.map((course) => {
              const colors = courseTypeColors[course.slug]
              const Icon = courseIcons[course.slug] || Heart
              return (
                <a
                  key={course.slug}
                  href={`#${course.slug}`}
                  className={clsx(
                    "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-heading font-medium transition-all hover:shadow-md",
                    colors.bg, colors.text
                  )}
                >
                  <Icon className="w-4 h-4" aria-hidden="true" />
                  {course.name}
                </a>
              )
            })}
          </div>
        </div>
      </section>

      {/* Body map */}
      <section className="mp-section bg-mp-cream/50">
        <div className="mp-container">
          <ScrollReveal>
            <div className="text-center mb-10">
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-mp-charcoal mb-3">
                Trouvez le cours adapt&eacute; &agrave; vos besoins
              </h2>
              <p className="font-body text-mp-text-light text-lg max-w-xl mx-auto">
                Cliquez sur une zone du corps pour d&eacute;couvrir les exercices et cours qui la ciblent.
              </p>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={1}>
            <BodyMap />
          </ScrollReveal>
        </div>
      </section>

      {/* Course grid */}
      <section className="mp-section bg-mp-white">
        <div className="mp-container">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course, i) => (
              <ScrollReveal key={course.slug} delay={((i % 3) + 1) as 1 | 2 | 3}>
                <CourseCard course={course} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Coming soon — Reformer collectif */}
      <section className="mp-section bg-mp-white">
        <div className="mp-container">
          <div className="relative overflow-hidden rounded-3xl border-2 border-dashed border-mp-sage/40 bg-gradient-to-br from-mp-sage/5 via-mp-cream to-mp-sage/10 p-8 sm:p-12">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-mp-sage/15 text-mp-sage font-heading text-xs font-bold uppercase tracking-[0.18em] mb-4">
                <Sparkle className="w-3.5 h-3.5" aria-hidden="true" />
                Bientôt
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-mp-charcoal mb-3">
                Cours collectif sur Reformer
              </h2>
              <p className="font-body text-mp-text-light leading-relaxed mb-4">
                En petits groupes sur deux Reformer supplémentaires — un format collectif
                pour partager l'expérience du travail sur appareil, avec tout le bénéfice
                de la résistance variable. Arrivée prochaine au studio.
              </p>
              <p className="font-body text-sm text-mp-text-muted italic">
                Envie d'être informé·e du lancement ? Inscrivez-vous à la newsletter
                ou contactez-nous.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mp-section bg-mp-cream">
        <div className="mp-container text-center">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-mp-charcoal mb-4">
            Prêt(e) à essayer ?
          </h2>
          <p className="font-body text-mp-text-light text-lg max-w-md mx-auto mb-3">
            Consultez notre planning et réservez votre première séance dès
            maintenant.
          </p>
          <p className="font-heading text-sm text-mp-ocean font-semibold mb-8">
            1er cours d&apos;essai à 10&nbsp;€ · sans engagement · réservation en 2 clics
          </p>
          <Link href="/planning" className="mp-btn mp-btn-primary text-base">
            Réserver mon cours d&apos;essai
            <ArrowRight className="w-5 h-5" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </div>
  );
}

/* ============================================================
   COURSE CARD
   ============================================================ */
function CourseCard({ course }: { course: CourseInfo }) {
  const colors = courseTypeColors[course.slug];
  const Icon = courseIcons[course.slug] || Heart;
  const image = courseImages[course.slug as CourseType];

  return (
    <Link id={course.slug} href={`/cours/${course.slug}`} className="group block scroll-mt-32">
      <div className="mp-card flex flex-col h-full border border-mp-sand-dark/30 hover:border-mp-ocean/20">
        {/* Visual header */}
        {image ? (
          <div className="relative w-full aspect-[16/10] overflow-hidden rounded-t-2xl">
            <Image
              src={image}
              alt={`Illustration du cours ${course.name} — séance en petit groupe au studio`}
              fill
              loading="lazy"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            <div className={clsx("absolute bottom-0 left-0 right-0 h-1", colors.dot)} />
          </div>
        ) : (
          <div className={clsx(
            "relative w-full aspect-[16/10] overflow-hidden rounded-t-2xl flex items-center justify-center",
            "bg-gradient-to-br",
            colors.bg
          )}>
            <Icon className={clsx("w-16 h-16 opacity-40", colors.text)} aria-hidden="true" />
            <div className={clsx("absolute bottom-0 left-0 right-0 h-1", colors.dot)} />
          </div>
        )}

        <div className="p-6 flex flex-col flex-1">
          {/* Icon + name */}
          <div className="flex items-center gap-3 mb-4">
            <div
              className={clsx(
                "w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110",
                colors.bg,
                colors.text
              )}
            >
              <Icon className="w-6 h-6" aria-hidden="true" />
            </div>
            <div>
              <h3 className="font-heading text-lg font-semibold text-mp-charcoal">
                {course.name}
              </h3>
            </div>
          </div>

          {/* Description */}
          <p className="font-body text-sm text-mp-text-light leading-relaxed mb-4 flex-1">
            {course.shortDescription}
          </p>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="text-xs font-heading font-medium bg-mp-sand px-2.5 py-1 rounded-full text-mp-charcoal">
              {course.duration}
            </span>
            <span
              className={clsx(
                "text-xs font-heading font-medium px-2.5 py-1 rounded-full",
                colors.bg,
                colors.text
              )}
            >
              {course.level}
            </span>
          </div>

          {/* Intensity dots + group size */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-heading text-mp-text-light mr-1">
                Intensité
              </span>
              {[1, 2, 3, 4, 5].map((dot) => (
                <span
                  key={dot}
                  className={clsx(
                    "w-2.5 h-2.5 rounded-full transition-colors",
                    dot <= course.intensity ? colors.dot : "bg-mp-sand-dark/40"
                  )}
                />
              ))}
            </div>
            <span className="flex items-center gap-1 text-xs text-mp-text-muted font-heading">
              <Users className="w-3 h-3" aria-hidden="true" />
              {course.slug === "reformer" ? "Séance privée 1-à-1" : "5 max · suivi premium"}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
