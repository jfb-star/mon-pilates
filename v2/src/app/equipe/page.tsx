import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Award, Heart, Users, Star, CalendarDays } from "lucide-react";
import { clsx } from "clsx";
import { instructors, courseTypeLabels, courseTypeColors } from "@/lib/mock-data";

const instructorPhotos: Record<string, string> = {
  marie: "/images/cours-reformer-instructrice.jpg",
};

const studioPhotos = [
  { src: "/images/studio-reformer-ocean.jpg", alt: "Studio Reformer avec vue sur l'ocean" },
  { src: "/images/studio-materiel.jpg", alt: "Equipement du studio : ballons, tapis et accessoires" },
  { src: "/images/studio-cours-particulier.jpg", alt: "Studio avec Reformer et vue sur l'ocean" },
  { src: "/images/cours-exterieur-toulhars.jpg", alt: "Cours de Pilates en exterieur pres de la piscine" },
];

export const metadata: Metadata = {
  title: "Notre equipe",
  description:
    "Rencontrez Marie et Sophie, nos instructrices certifiees. Passion, bienveillance et expertise au service de votre pratique.",
  openGraph: {
    title: "Notre equipe | Mon Pilates",
    description:
      "Marie et Sophie, instructrices certifiees, vous accompagnent dans votre pratique du Pilates.",
  },
};

const values = [
  {
    icon: Heart,
    title: "Bienveillance",
    description:
      "Chaque personne est unique. Nous adaptons notre enseignement a votre corps, votre rythme et vos objectifs, sans jugement.",
  },
  {
    icon: Award,
    title: "Excellence",
    description:
      "Formees aux meilleures ecoles internationales, nous nous formons en continu pour vous offrir un enseignement de qualite.",
  },
  {
    icon: Users,
    title: "Proximite",
    description:
      "Des petits groupes de 6 a 12 personnes maximum pour un suivi personnalise et des corrections individuelles.",
  },
  {
    icon: Star,
    title: "Passion",
    description:
      "Le Pilates a transforme nos vies. Nous mettons toute notre energie a partager cette passion avec vous.",
  },
];

export default function EquipePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-mp-sand via-mp-cream to-mp-ocean-light/20 pt-32 pb-16 sm:pb-20 overflow-hidden">
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
          <p className="font-heading text-sm font-semibold text-mp-ocean uppercase tracking-[0.2em] mb-3">
            Le studio
          </p>
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-mp-charcoal mb-6">
            Notre equipe
          </h1>
          <p className="font-body text-lg sm:text-xl text-mp-text-light leading-relaxed max-w-2xl mx-auto">
            Des instructrices passionnees et certifiees, dediees a votre
            bien-etre et votre progression. Decouvrez les visages derriere Mon
            Pilates.
          </p>
        </div>
      </section>

      {/* Instructor Cards */}
      <section className="mp-section bg-mp-white">
        <div className="mp-container space-y-16">
          {instructors.map((instructor, idx) => (
            <div
              key={instructor.id}
              className={clsx(
                "mp-card border-2 border-mp-sand-dark/30 p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-start",
              )}
            >
              {/* Photo */}
              <div
                className={clsx(
                  "lg:col-span-2",
                  idx % 2 === 1 && "lg:order-2"
                )}
              >
                <div
                  className={clsx(
                    "aspect-[3/4] rounded-2xl flex flex-col items-center justify-center relative overflow-hidden",
                    instructor.color + "/10"
                  )}
                >
                  {instructorPhotos[instructor.id] ? (
                    <>
                      <Image
                        src={instructorPhotos[instructor.id]}
                        alt={`${instructor.name} — ${instructor.role}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 40vw"
                      />
                      {/* Subtle gradient overlay at bottom */}
                      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/20 to-transparent" />
                    </>
                  ) : (
                    <>
                      {/* Decorative circles */}
                      <div
                        className={clsx(
                          "absolute top-8 right-8 w-20 h-20 rounded-full opacity-10",
                          instructor.color
                        )}
                      />
                      <div
                        className={clsx(
                          "absolute bottom-12 left-8 w-14 h-14 rounded-full opacity-10",
                          instructor.color
                        )}
                      />

                      {/* Initials circle */}
                      <div
                        className={clsx(
                          "w-32 h-32 sm:w-40 sm:h-40 rounded-full flex items-center justify-center text-white shadow-lg",
                          instructor.color
                        )}
                      >
                        <span className="font-heading text-4xl sm:text-5xl font-bold">
                          {instructor.initials}
                        </span>
                      </div>
                      <p className="font-heading text-sm text-mp-text-light mt-4">
                        Photo a venir
                      </p>
                    </>
                  )}
                </div>
              </div>

              {/* Info */}
              <div
                className={clsx(
                  "lg:col-span-3",
                  idx % 2 === 1 && "lg:order-1"
                )}
              >
                <h2 className="font-heading text-2xl sm:text-3xl font-bold text-mp-charcoal mb-1">
                  {instructor.name}
                </h2>
                <p
                  className={clsx(
                    "font-heading text-base font-medium mb-4",
                    instructor.color === "bg-mp-ocean"
                      ? "text-mp-ocean"
                      : "text-mp-sage"
                  )}
                >
                  {instructor.role}
                </p>

                <p className="font-body text-mp-text leading-relaxed mb-6">
                  {instructor.bio}
                </p>

                {/* Certifications */}
                <div className="mb-6">
                  <h3 className="font-heading text-sm font-semibold text-mp-charcoal uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Award className="w-4 h-4 text-mp-gold" />
                    Certifications
                  </h3>
                  <ul className="space-y-2">
                    {instructor.certifications.map((cert, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm font-body text-mp-text"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-mp-gold mt-2 shrink-0" />
                        {cert}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Specialties tags */}
                <div className="mb-6">
                  <h3 className="font-heading text-sm font-semibold text-mp-charcoal uppercase tracking-widest mb-3">
                    Specialites
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {instructor.specialties.map((spec) => {
                      const colors = courseTypeColors[spec];
                      return (
                        <Link
                          key={spec}
                          href={`/cours/${spec}`}
                          className={clsx(
                            "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-heading font-medium transition-all hover:shadow-md",
                            colors.bg,
                            colors.text
                          )}
                        >
                          <span
                            className={clsx(
                              "w-2 h-2 rounded-full",
                              colors.dot
                            )}
                          />
                          {courseTypeLabels[spec]}
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {/* Link to planning */}
                <Link
                  href="/planning"
                  className="mp-btn mp-btn-secondary text-sm inline-flex"
                >
                  <CalendarDays className="w-4 h-4" />
                  Voir ses cours au planning
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Studio Gallery */}
      <section className="mp-section bg-mp-sand/30">
        <div className="mp-container">
          <div className="text-center mb-10">
            <p className="font-heading text-sm font-semibold text-mp-ocean uppercase tracking-[0.2em] mb-3">
              Notre espace
            </p>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-mp-charcoal mb-4">
              Le studio
            </h2>
            <p className="font-body text-mp-text-light leading-relaxed max-w-2xl mx-auto">
              Un lieu lumineux face a l&apos;ocean, concu pour votre bien-etre et votre pratique.
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {studioPhotos.map((photo) => (
              <div key={photo.src} className="relative aspect-[4/3] rounded-2xl overflow-hidden group">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values / Philosophy */}
      <section className="mp-section bg-mp-cream">
        <div className="mp-container">
          <div className="text-center mb-12">
            <p className="font-heading text-sm font-semibold text-mp-ocean uppercase tracking-[0.2em] mb-3">
              Notre philosophie
            </p>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-mp-charcoal mb-4">
              Nos valeurs
            </h2>
            <p className="font-body text-mp-text-light leading-relaxed max-w-2xl mx-auto">
              Chez Mon Pilates, nous croyons que le mouvement est un acte de
              bienveillance envers soi-meme. Notre approche repose sur quatre
              piliers fondamentaux.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => (
              <div
                key={value.title}
                className="mp-card p-8 text-center border-2 border-mp-sand-dark/30"
              >
                <div className="w-14 h-14 rounded-2xl bg-mp-ocean/10 flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-7 h-7 text-mp-ocean" />
                </div>
                <h3 className="font-heading text-lg font-semibold text-mp-charcoal mb-2">
                  {value.title}
                </h3>
                <p className="font-body text-sm text-mp-text-light leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mp-section bg-gradient-to-br from-mp-ocean to-mp-ocean-dark text-white">
        <div className="mp-container text-center">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-4">
            Envie de nous rencontrer ?
          </h2>
          <p className="font-body text-lg text-white/80 max-w-md mx-auto mb-8">
            Reservez votre cours d&apos;essai a 10&euro; et decouvrez notre
            approche chaleureuse et personnalisee.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/planning"
              className="mp-btn bg-white text-mp-ocean hover:bg-mp-cream font-semibold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"
            >
              <CalendarDays className="w-5 h-5" />
              Reserver un cours d&apos;essai
            </Link>
            <Link
              href="/contact"
              className="mp-btn border-2 border-white text-white hover:bg-white/10 font-semibold transition-all"
            >
              Nous contacter
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
