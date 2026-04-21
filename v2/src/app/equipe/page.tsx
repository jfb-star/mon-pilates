import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Award, Heart, Users, Star, CalendarDays, Quote } from "lucide-react";
import { clsx } from "clsx";
import { instructors, courseTypeLabels, courseTypeColors } from "@/lib/mock-data";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { FaqAccordion } from "@/components/ui/FaqAccordion";
import { SITE_URL } from "@/lib/env";

const instructorPhotos: Record<string, string> = {
  violette: "/images/violette-portrait.jpg",
};

const instructorExtras: Record<string, { quote: string; experience: string; funFact?: string }> = {
  violette: {
    quote:
      "Aujourd'hui, j'accompagne chaque personne avec attention, en adaptant chaque séance à son corps, son histoire et ses besoins, dans un cadre bienveillant, lumineux et apaisé, face à l'océan.",
    experience: "Certifiée FPMP — Fédération des Professionnels de la Méthode Pilates",
    // TODO owner: ajouter un \"fun fact\" personnel si Violette souhaite en partager un
  },
};

const studioPhotos = [
  { src: "/images/studio-reformer-ocean.jpg", alt: "Studio Reformer avec vue sur l'océan" },
  { src: "/images/studio-materiel.jpg", alt: "Équipement du studio : ballons, tapis et accessoires" },
  { src: "/images/studio-cours-particulier.jpg", alt: "Studio avec Reformer et vue sur l'océan" },
  { src: "/images/cours-exterieur-toulhars.jpg", alt: "Cours de Pilates en extérieur près de la piscine" },
];

export const metadata: Metadata = {
  title: "Notre équipe",
  description:
    "Rencontrez Violette, instructrice certifiée FPMP au studio Mon Pilates à Larmor-Plage. Bienveillance, écoute et séances adaptées à chaque corps.",
  openGraph: {
    title: "Notre équipe | Mon Pilates",
    description:
      "Violette, instructrice certifiée FPMP, vous accompagne dans votre pratique du Pilates à Larmor-Plage.",
    images: [{ url: "/images/cours-reformer-instructrice.jpg", width: 1200, height: 630, alt: "Studio Mon Pilates à Larmor-Plage — séance Reformer face à l'océan" }],
  },
  alternates: {
    canonical: `${SITE_URL}/equipe`,
  },
};

const values = [
  {
    icon: Heart,
    title: "Bienveillance",
    description:
      "Chaque personne est unique. Nous adaptons notre enseignement à votre corps, votre rythme et vos objectifs, sans jugement.",
  },
  {
    icon: Award,
    title: "Excellence",
    description:
      "Formée auprès de la FPMP et en formation continue, Violette s'engage à vous offrir un enseignement rigoureux et à jour.",
  },
  {
    icon: Users,
    title: "Proximité",
    description:
      "Des petits groupes de 5 personnes maximum pour un suivi personnalisé et des corrections individuelles.",
  },
  {
    icon: Star,
    title: "Passion",
    description:
      "Le Pilates a transformé sa vie. Violette met toute son énergie à partager cette pratique avec vous.",
  },
];

const faq = [
  {
    question: "Comment est formée votre instructrice ?",
    answer:
      "Violette est certifiée par la FPMP (Fédération des Professionnels de la Méthode Pilates). Elle suit régulièrement des formations continues pour enrichir sa pratique et vous proposer un enseignement à jour.",
  },
  {
    question: "Qui anime les cours au studio ?",
    answer:
      "Tous les cours du studio sont animés par Violette. Vous retrouvez ainsi la même instructrice, le même suivi et la même exigence à chaque séance.",
  },
  {
    question: "Quel est le parcours de Violette ?",
    answer:
      "Ancienne éducatrice en gymnastique et en sport, Violette s'est reconvertie au Pilates après un parcours personnel marqué par des blessures. Le Pilates lui a permis de retrouver un corps sans douleur et un mouvement plus juste — une expérience qu'elle met aujourd'hui au service de ses élèves.",
  },
  {
    question: "Violette peut-elle adapter les exercices ?",
    answer:
      "Absolument. Chaque séance est adaptée à votre corps, votre histoire et vos besoins : niveau, douleurs, grossesse, seniors… N'hésitez pas à la prévenir avant le cours de toute particularité.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
};

const personsJsonLd = instructors.map((instructor) => ({
  "@context": "https://schema.org",
  "@type": "Person",
  name: instructor.name,
  jobTitle: instructor.role,
  description: instructor.bio,
  ...(instructorPhotos[instructor.id] && {
    image: `${SITE_URL}${instructorPhotos[instructor.id]}`,
  }),
  worksFor: {
    "@type": "SportsActivityLocation",
    name: "Mon Pilates",
    url: SITE_URL,
  },
}));

export default function EquipePage() {
  return (
    <>
      {personsJsonLd.map((person, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }}
        />
      ))}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <BreadcrumbJsonLd items={[
        { name: "Accueil", href: "/" },
        { name: "L'équipe", href: "/equipe" },
      ]} />
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-mp-sand via-mp-cream to-mp-ocean-light/20 pt-32 pb-16 sm:pb-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <Image
            src="/images/studio-reformer-ocean.jpg"
            alt="Studio de Pilates avec vue sur l'océan"
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
            { name: "L'\u00e9quipe", href: "/equipe" },
          ]} />
        </div>
        <div className="mp-container text-center relative z-10">
          <p className="font-heading text-sm font-semibold text-mp-ocean uppercase tracking-[0.2em] mb-3">
            Le studio
          </p>
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-mp-charcoal mb-6">
            Notre équipe
          </h1>
          <p className="font-body text-lg sm:text-xl text-mp-text-light leading-relaxed max-w-2xl mx-auto">
            Une instructrice passionnée et certifiée, dédiée à votre bien-être
            et à votre progression. Découvrez le visage derrière Mon Pilates.
          </p>
        </div>
      </section>

      {/* Instructor Cards */}
      <section className="mp-section bg-mp-white" aria-label="Notre instructrice">
        <div className="mp-container space-y-16">
          {instructors.map((instructor, idx) => (
            <div
              key={instructor.id}
              className={clsx(
                "mp-card border-2 border-mp-sand-dark/30 p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-start",
              )}
            >
              {/* Photo */}
              <figure
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
                        alt={`Portrait de ${instructor.name}, ${instructor.role} au studio Mon Pilates`}
                        fill
                        loading="lazy"
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 40vw"
                      />
                      {/* Subtle gradient overlay at bottom */}
                      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/20 to-transparent" />
                    </>
                  ) : (
                    <>
                    <div className="absolute inset-0 bg-gradient-to-br from-mp-sand via-mp-cream to-mp-ocean-light/30" />
                    {/* Decorative circles */}
                    <div
                      className={clsx(
                        "absolute top-10 right-10 w-24 h-24 rounded-full opacity-[0.08]",
                        instructor.color
                      )}
                    />
                    <div
                      className={clsx(
                        "absolute bottom-16 left-10 w-16 h-16 rounded-full opacity-[0.08]",
                        instructor.color
                      )}
                    />
                    <div
                      className={clsx(
                        "absolute top-1/3 left-1/4 w-10 h-10 rounded-full opacity-[0.06]",
                        instructor.color
                      )}
                    />

                    {/* Initials circle */}
                    <div
                      className={clsx(
                        "relative w-32 h-32 sm:w-40 sm:h-40 rounded-full flex items-center justify-center text-white shadow-xl ring-4 ring-white/50",
                        instructor.color
                      )}
                    >
                      <span className="font-heading text-4xl sm:text-5xl font-bold">
                        {instructor.initials}
                      </span>
                    </div>
                    </>
                  )}
                </div>
              </figure>

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

                {/* Personal quote */}
                {instructorExtras[instructor.id] && (
                  <div className="bg-mp-cream rounded-xl p-5 mb-6 relative">
                    <Quote className="w-6 h-6 text-mp-ocean/15 absolute top-3 left-4" aria-hidden="true" />
                    <blockquote className="font-body text-mp-text italic leading-relaxed pl-6">
                      <p>&laquo; {instructorExtras[instructor.id].quote} &raquo;</p>
                      <footer className="mt-3 not-italic">
                        <cite className="font-heading text-xs font-medium text-mp-ocean bg-mp-ocean/10 px-2.5 py-1 rounded-full not-italic inline-block">
                          {instructor.name} — {instructorExtras[instructor.id].experience}
                        </cite>
                      </footer>
                    </blockquote>
                  </div>
                )}

                {/* Fun fact */}
                {instructorExtras[instructor.id]?.funFact && (
                  <p className="text-sm font-body text-mp-text-muted italic mb-6 flex items-start gap-2">
                    <span className="text-mp-gold text-base leading-none mt-0.5" aria-hidden="true">&#9733;</span>
                    {instructorExtras[instructor.id].funFact}
                  </p>
                )}

                {/* Certifications */}
                <div className="mb-6">
                  <h3 className="font-heading text-sm font-semibold text-mp-charcoal uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Award className="w-4 h-4 text-mp-gold" aria-hidden="true" />
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
                    Spécialités
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
                  <CalendarDays className="w-4 h-4" aria-hidden="true" />
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
              Un lieu lumineux face à l&apos;océan, conçu pour votre bien-être et votre pratique.
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {studioPhotos.map((photo) => (
              <div key={photo.src} className="relative aspect-[4/3] rounded-2xl overflow-hidden group cursor-pointer">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  loading="lazy"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-mp-charcoal/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <p className="font-heading text-xs font-medium text-white/90">{photo.alt}</p>
                </div>
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
              bienveillance envers soi-même. Notre approche repose sur quatre
              piliers fondamentaux.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, i) => (
              <ScrollReveal
                key={value.title}
                delay={(i % 4) as 0 | 1 | 2 | 3}
                className="mp-card p-8 text-center border-2 border-mp-sand-dark/30"
              >
                <div className="w-14 h-14 rounded-2xl bg-mp-ocean/10 flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-7 h-7 text-mp-ocean" aria-hidden="true" />
                </div>
                <h3 className="font-heading text-lg font-semibold text-mp-charcoal mb-2">
                  {value.title}
                </h3>
                <p className="font-body text-sm text-mp-text-light leading-relaxed">
                  {value.description}
                </p>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mp-section bg-mp-white">
        <div className="mp-container max-w-3xl">
          <div className="text-center mb-10">
            <p className="font-heading text-sm font-semibold text-mp-ocean uppercase tracking-[0.2em] mb-3">
              Questions fréquentes
            </p>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-mp-charcoal mb-4">
              À propos de votre instructrice
            </h2>
          </div>
          <FaqAccordion items={faq} />
        </div>
      </section>

      {/* CTA */}
      <section className="mp-section bg-gradient-to-br from-mp-ocean to-mp-ocean-dark text-white">
        <div className="mp-container text-center">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-4">
            Envie de nous rencontrer ?
          </h2>
          <p className="font-body text-lg text-white/80 max-w-md mx-auto mb-8">
            Réservez votre cours d&apos;essai à 10&euro; et découvrez notre
            approche chaleureuse et personnalisée.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/planning"
              className="mp-btn bg-white text-mp-ocean hover:bg-mp-cream font-semibold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"
            >
              <CalendarDays className="w-5 h-5" aria-hidden="true" />
              Réserver un cours d&apos;essai
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
