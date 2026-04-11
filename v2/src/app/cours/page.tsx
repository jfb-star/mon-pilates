import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Heart,
  Sparkles,
  Baby,
  Clock,
  Leaf,
  Flame,
  ArrowRight,
} from "lucide-react";
import { clsx } from "clsx";
import { courses, courseTypeColors, type CourseInfo, type CourseType } from "@/lib/mock-data";

const courseImages: Partial<Record<CourseType, string>> = {
  mat: "/images/illustration-cours-collectif.png",
  reformer: "/images/illustration-cours-machine.png",
};

export const metadata: Metadata = {
  title: "Nos cours de Pilates",
  description:
    "Découvrez nos 6 types de cours : Mat, Reformer, Prénatal, Senior, Doux et Intensif. Trouvez le Pilates qui vous correspond.",
};

const courseIcons: Record<string, React.ElementType> = {
  mat: Heart,
  reformer: Sparkles,
  prenatal: Baby,
  senior: Clock,
  doux: Leaf,
  intensif: Flame,
};

export default function CoursPage() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-mp-sand via-mp-cream to-mp-sage-light/20 py-16 sm:py-24 overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0 opacity-10">
          <Image
            src="/images/studio-reformer-ocean.jpg"
            alt="Studio de Pilates avec vue sur l'ocean"
            fill
            className="object-cover"
            priority
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
            Que vous soyez débutant ou pratiquant confirmé, enceinte ou senior,
            nous avons le cours qui vous correspond. Découvrez notre offre
            complète.
          </p>
        </div>
      </section>

      {/* Course grid */}
      <section className="mp-section bg-mp-white">
        <div className="mp-container">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard key={course.slug} course={course} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mp-section bg-mp-cream">
        <div className="mp-container text-center">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-mp-charcoal mb-4">
            Prêt(e) à essayer ?
          </h2>
          <p className="font-body text-mp-text-light text-lg max-w-md mx-auto mb-8">
            Consultez notre planning et réservez votre première séance dès
            maintenant.
          </p>
          <Link href="/planning" className="mp-btn mp-btn-primary text-base">
            Voir le planning
            <ArrowRight className="w-5 h-5" />
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
    <Link href={`/cours/${course.slug}`} className="group block">
      <div className="mp-card flex flex-col h-full border border-mp-sand-dark/30 hover:border-mp-ocean/20">
        {/* Visual header */}
        {image ? (
          <div className="relative w-full aspect-[16/10] overflow-hidden rounded-t-2xl">
            <Image
              src={image}
              alt={`Illustration du cours ${course.name}`}
              fill
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
            <Icon className={clsx("w-16 h-16 opacity-40", colors.text)} />
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
              <Icon className="w-6 h-6" />
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

          {/* Intensity dots */}
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
        </div>
      </div>
    </Link>
  );
}
