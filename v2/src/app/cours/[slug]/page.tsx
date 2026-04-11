import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Heart,
  Sparkles,
  Baby,
  Clock,
  Leaf,
  Flame,
  CheckCircle,
  Users,
  ArrowLeft,
  ArrowRight,
  CalendarDays,
} from "lucide-react";
import { clsx } from "clsx";
import {
  courses,
  courseTypeColors,
  courseTypeLabels,
  getSessionsByCourseType,
  dayNames,
  type CourseInfo,
  type CourseType,
} from "@/lib/mock-data";

const courseHeroImages: Partial<Record<CourseType, string>> = {
  mat: "/images/illustration-cours-collectif.png",
  reformer: "/images/cours-reformer-instructrice.jpg",
  prenatal: "/images/illustration-pilates-artistique.png",
  senior: "/images/illustration-pilates-artistique.png",
  doux: "/images/illustration-pilates-artistique.png",
  intensif: "/images/illustration-pilates-artistique.png",
};

/* ----------------------------------------------------------
   Static params for the 6 slugs
   ---------------------------------------------------------- */
export function generateStaticParams() {
  return courses.map((c) => ({ slug: c.slug }));
}

/* ----------------------------------------------------------
   Dynamic metadata
   ---------------------------------------------------------- */
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
  return {
    title: course.name,
    description: course.shortDescription,
  };
}

const courseIcons: Record<string, React.ElementType> = {
  mat: Heart,
  reformer: Sparkles,
  prenatal: Baby,
  senior: Clock,
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

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-mp-sand via-mp-cream to-mp-ocean-light/10 py-16 sm:py-20 overflow-hidden">
        <div className="mp-container">
          {/* Breadcrumb */}
          <Link
            href="/cours"
            className="inline-flex items-center gap-1 text-sm font-heading text-mp-text-light hover:text-mp-ocean transition-colors mb-6 relative z-10"
          >
            <ArrowLeft className="w-4 h-4" />
            Tous les cours
          </Link>

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
                  <Icon className="w-7 h-7" />
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

            {/* Hero image */}
            {heroImage && (
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg hidden lg:block">
                <Image
                  src={heroImage}
                  alt={`Illustration du cours ${course.name}`}
                  fill
                  className="object-cover"
                  sizes="50vw"
                  priority
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
            <div className="space-y-6">
              {/* Upcoming sessions */}
              <div className="bg-mp-cream rounded-2xl p-6">
                <h3 className="font-heading text-lg font-bold text-mp-charcoal mb-4 flex items-center gap-2">
                  <CalendarDays className="w-5 h-5 text-mp-ocean" />
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
                  <ArrowRight className="w-4 h-4" />
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
                <p className="text-white/80 text-sm font-body mb-4">
                  Votre première séance d&apos;essai est à tarif réduit.
                  Réservez dès maintenant !
                </p>
                <Link
                  href="/planning"
                  className="mp-btn bg-white text-mp-charcoal hover:bg-mp-cream font-semibold w-full text-sm"
                >
                  Réserver
                </Link>
              </div>
            </div>
          </div>
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
                            <OtherIcon className="w-5 h-5" />
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
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
