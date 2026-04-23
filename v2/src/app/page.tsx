import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  ArrowRight,
  Star,
  Users,
  Clock,
  Heart,
  Sparkles,
  ChevronRight,
  MapPin,
  Phone,
  Baby,
  Leaf,
  Flame,
  Award,
} from "lucide-react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { TrustBar } from "@/components/ui/TrustBar";
import { StudioStats } from "@/components/ui/StudioStats";
import { OpenStatus } from "@/components/ui/OpenStatus";
import { CourseQuiz } from "@/components/ui/CourseQuizLazy";
import { MoodBooking } from "@/components/ui/MoodBookingLazy";
import { OceanParticles } from "@/components/ui/OceanParticlesLazy";
import { OrganicBlob } from "@/components/ui/OrganicBlob";
import { ActivityFeed } from "@/components/ui/ActivityFeedLazy";
import { FirstTimerOnly, TrialCtaLink } from "@/components/ui/TrialGate";

/* ============================================================
   HERO SECTION
   ============================================================ */
function Hero() {
  return (
    <section className="relative min-h-[100svh] flex items-center overflow-hidden">
      {/* Full-bleed background image */}
      <Image
        src="/images/studio-reformer-ocean.webp"
        alt="Studio Mon Pilates face à l'océan — Reformer avec vue sur la mer à Larmor-Plage"
        fill
        className="object-cover"
        priority
        fetchPriority="high"
        quality={75}
        sizes="(max-width: 1024px) 100vw, 1920px"
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAoHBwgHBgoICAgLCgoLDhgQDg0NDh0VFhEYIx8lJCIfIiEmKzcvJik0KSEiMEExNDk7Pj4+JS5ESUM8SDc9Pjv/2wBDAQoLCw4NDhwQEBw7KCIoOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozv/wAARCAAIABADASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABgUH/8QAIhAAAgIBAwQDAAAAAAAAAAAAAQIDBAAFBhESITFBE2Fx/8QAFQEBAQAAAAAAAAAAAAAAAAAAAwT/xAAaEQACAwEBAAAAAAAAAAAAAAABAgADESEx/9oADAMBAAIRAxEAPwCbq26tLpbMtKzVkuKjdBFLTmSYj1xrr2t7a6lJJDT0iy8bFVZ5nVSR9ADIe67U0WrSiWOhDVcKFLRscZplXMiGhYVSZ//9k="
      />
      {/* Overlay — stronger for text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-mp-charcoal/95 via-mp-charcoal/80 to-mp-charcoal/40" />
      <div className="absolute inset-0 bg-gradient-to-b from-mp-charcoal/70 via-mp-charcoal/20 to-mp-charcoal/50" />
      {/* Radial scrim specifically behind the H1 block (top-left) to guarantee contrast over any background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 900px 620px at 18% 40%, rgba(32,40,45,0.85) 0%, rgba(32,40,45,0.5) 45%, rgba(32,40,45,0) 75%)",
        }}
      />

      {/* Floating ocean particles */}
      <OceanParticles />

      <div className="mp-container relative z-10 pt-32 pb-20">
        <div className="max-w-2xl">
          <p className="font-heading text-sm font-semibold text-mp-ocean-light uppercase tracking-[0.25em] mb-5 animate-[fadeUp_0.6s_ease_forwards] opacity-0 [animation-delay:0.2s]">
            Studio Pilates — Larmor-Plage
          </p>
          <h1
            className="font-heading text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.08] mb-6 animate-[fadeUp_0.6s_ease_forwards] opacity-0 [animation-delay:0.35s]"
            style={{
              textShadow: "0 2px 24px rgba(0,0,0,0.75)",
            }}
          >
            Le Pilates,
            <br />
            <span className="text-mp-ocean-light">face à l&apos;océan</span>
          </h1>
          <p className="font-body text-lg sm:text-xl text-white/85 leading-relaxed mb-10 max-w-lg animate-[fadeUp_0.6s_ease_forwards] opacity-0 [animation-delay:0.5s]">
            Un studio lumineux face à l&apos;océan, des cours adaptés à chaque
            corps, une pratique qui vous transforme en profondeur.
          </p>
          <div className="flex flex-wrap gap-4 animate-[fadeUp_0.6s_ease_forwards] opacity-0 [animation-delay:0.65s]">
            <TrialCtaLink
              href="/planning"
              className="mp-btn mp-btn-primary mp-pulse-glow !text-sm sm:!text-base !py-4 !px-6 sm:!px-8 whitespace-nowrap"
              icon={<Calendar className="w-5 h-5" aria-hidden="true" />}
              trialLabel={"Cours d'essai — 10€"}
              returningLabel="Réserver un cours"
            />
            <Link href="/cours" className="mp-btn !border-white/30 !text-white hover:!bg-white hover:!text-mp-charcoal !text-base !py-4 !px-8 backdrop-blur-sm !bg-white/10">
              Découvrir nos cours
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>

          {/* Trust signal — facts only, no fake ratings until real reviews exist */}
          <div className="flex flex-wrap items-center gap-5 mt-14 pt-8 border-t border-white/15 animate-[fadeUp_0.6s_ease_forwards] opacity-0 [animation-delay:0.8s]">
            <p className="text-sm text-white/75 font-body">
              Studio à Larmor-Plage · Instructrice certifiée FPMP · 5 participants max par cours · Terrasse face à l&apos;océan en été
            </p>
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce" aria-hidden="true">
        <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center pt-2">
          <div className="w-1 h-2.5 rounded-full bg-white/60" />
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   TRUST BAR — Social proof
   ============================================================ */
/* TrustBar moved to @/components/ui/TrustBar (client component for animated counters) */

/* ============================================================
   TYPES DE COURS
   ============================================================ */
const courseTypes = [
  {
    icon: Heart,
    name: "Pilates classique — Tapis",
    slug: "mat",
    description: "Séance complète au tapis, en petit groupe de 5. Renforcez votre centre et améliorez votre posture.",
    color: "text-mp-ocean",
    bg: "bg-mp-ocean/8",
    border: "group-hover:border-mp-ocean/30",
    image: "/images/illustration-cours-collectif.webp",
  },
  {
    icon: Sparkles,
    name: "Cours privé sur appareils",
    slug: "reformer",
    description: "Séance individuelle sur notre Reformer Cadillac. Accompagnement sur mesure, sans jamais partager la machine.",
    color: "text-mp-sage",
    bg: "bg-mp-sage/8",
    border: "group-hover:border-mp-sage/30",
    image: "/images/illustration-cours-machine.webp",
  },
  {
    icon: Leaf,
    name: "Pilates doux — Tapis",
    slug: "doux",
    description: "Une pratique lente et accessible, idéale pour débuter, récupérer ou se réconcilier avec son corps.",
    color: "text-mp-ocean-light",
    bg: "bg-mp-ocean-light/10",
    border: "group-hover:border-mp-ocean-light/30",
    image: null,
  },
  {
    icon: Flame,
    name: "Pilates avancé",
    slug: "intensif",
    description: "Enchaînements soutenus et exercices complexes pour pratiquants confirmés. Contrôle, précision, fluidité.",
    color: "text-mp-charcoal",
    bg: "bg-mp-charcoal/8",
    border: "group-hover:border-mp-charcoal/30",
    image: null,
  },
  {
    icon: Baby,
    name: "Pilates femmes enceintes",
    slug: "prenatal",
    description: "Adapté à chaque trimestre. Maintenez votre forme, soulagez votre dos et préparez votre corps en toute sécurité.",
    color: "text-mp-rose",
    bg: "bg-mp-rose/8",
    border: "group-hover:border-mp-rose/30",
    image: null,
  },
];

/* ============================================================
   WHY MON PILATES
   ============================================================ */
const differentiators = [
  {
    icon: Users,
    stat: "5 max",
    title: "Petits groupes",
    description: "Cours Tapis limités à 5 personnes pour un suivi individuel et des corrections personnalisées.",
  },
  {
    icon: Star,
    stat: "Face à l'océan",
    title: "Cadre unique",
    description: "Un studio lumineux avec vue sur la mer. Pratiquez dans un environnement inspirant et apaisant.",
  },
  {
    icon: Award,
    stat: "FPMP",
    title: "Instructrice certifiée",
    description: "Violette est certifiée par la Fédération des Professionnels de la Méthode Pilates et en formation continue.",
  },
  {
    icon: Clock,
    stat: "5 formats",
    title: "Cours variés",
    description: "Classique, Doux, Avancé, Femmes enceintes et Privé sur appareils — un format adapté à chaque objectif.",
  },
];

function WhyMonPilates() {
  return (
    <section className="mp-section bg-mp-cream relative overflow-hidden" aria-label="Pourquoi nous choisir">
      <OrganicBlob className="top-[-100px] right-[-100px] opacity-60" color="mp-ocean" size={500} />
      <div className="mp-container relative z-10">
        <ScrollReveal className="text-center max-w-2xl mx-auto mb-14">
          <p className="font-heading text-sm font-semibold text-mp-ocean uppercase tracking-[0.2em] mb-3">
            Pourquoi nous choisir
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-mp-charcoal mb-4">
            Ce qui nous différencie
          </h2>
          <p className="font-body text-mp-text-light leading-relaxed">
            Un studio pas comme les autres, pensé pour votre bien-être et votre progression.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {differentiators.map((item, i) => (
            <ScrollReveal key={item.title} delay={(i % 4) as 0 | 1 | 2 | 3}>
              <div className="text-center p-6 rounded-2xl bg-mp-white border border-mp-sand-dark/20 hover:border-mp-ocean/20 hover:shadow-lg transition-all duration-300 h-full">
                <div className="w-14 h-14 rounded-2xl bg-mp-ocean/10 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-7 h-7 text-mp-ocean" aria-hidden="true" />
                </div>
                <p className="font-heading text-lg font-bold text-mp-ocean mb-1">{item.stat}</p>
                <h3 className="font-heading text-base font-semibold text-mp-charcoal mb-2">
                  {item.title}
                </h3>
                <p className="font-body text-sm text-mp-text-light leading-relaxed">
                  {item.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function CourseTypes() {
  return (
    <section className="mp-section bg-mp-white" aria-label="Nos cours populaires">
      <div className="mp-container">
        <ScrollReveal className="text-center max-w-2xl mx-auto mb-16">
          <p className="font-heading text-sm font-semibold text-mp-ocean uppercase tracking-[0.2em] mb-3">
            Nos cours
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-mp-charcoal mb-4">
            Un Pilates pour chaque besoin
          </h2>
          <p className="font-body text-mp-text-light leading-relaxed">
            Que vous soyez débutant, confirmé·e ou en attente d&apos;un enfant, découvrez le format qui vous correspond — en groupe au tapis ou en privé sur appareils.
          </p>
        </ScrollReveal>

        {/* Top 2 cards with images — larger */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {courseTypes.slice(0, 2).map((course) => (
            <Link key={course.slug} href={`/cours/${course.slug}`} className="block group">
              <div className={`mp-card border border-mp-sand-dark/20 ${course.border} transition-all overflow-hidden`}>
                {course.image && (
                  <div className="relative h-52 overflow-hidden">
                    <Image
                      src={course.image}
                      alt={`Illustration du cours ${course.name} au studio Mon Pilates`}
                      fill
                      loading="lazy"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </div>
                )}
                <div className="p-7">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-xl ${course.bg} ${course.color} flex items-center justify-center`}>
                      <course.icon className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <h3 className="font-heading text-lg font-semibold text-mp-charcoal group-hover:text-mp-ocean transition-colors">
                      {course.name}
                    </h3>
                  </div>
                  <p className="font-body text-sm text-mp-text-light leading-relaxed">
                    {course.description}
                  </p>
                  <span className="inline-flex items-center gap-1 mt-4 text-sm font-heading font-medium text-mp-ocean group-hover:gap-2 transition-all">
                    Découvrir <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom 3 cards — with gradient accent */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {courseTypes.slice(2).map((course) => (
            <Link key={course.slug} href={`/cours/${course.slug}`} className="block group">
              <div className={`mp-card border border-mp-sand-dark/20 ${course.border} transition-all h-full overflow-hidden`}>
                <div className={`h-2 w-full ${course.bg}`} />
                <div className="p-7">
                  <div className={`w-12 h-12 rounded-xl ${course.bg} ${course.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <course.icon className="w-6 h-6" aria-hidden="true" />
                  </div>
                  <h3 className="font-heading text-base font-semibold text-mp-charcoal mb-2 group-hover:text-mp-ocean transition-colors">
                    {course.name}
                  </h3>
                  <p className="font-body text-sm text-mp-text-light leading-relaxed mb-3">
                    {course.description}
                  </p>
                  <span className="inline-flex items-center gap-1 text-sm font-heading font-medium text-mp-ocean group-hover:gap-2 transition-all">
                    Découvrir <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link href="/cours" className="mp-btn mp-btn-secondary inline-flex items-center">
            Voir tous nos cours
            <ChevronRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   STUDIO / AMBIANCE
   ============================================================ */
function StudioAmbiance() {
  return (
    <section className="mp-section bg-mp-cream" aria-label="Le studio">
      <div className="mp-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Images grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="relative rounded-2xl overflow-hidden aspect-[3/4]">
                <Image
                  src="/images/reformer-closeup.webp"
                  alt="Gros plan sur le Reformer Cadillac, équipement professionnel du studio Mon Pilates"
                  fill
                  loading="lazy"
                  className="object-cover"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
              </div>
              <div className="relative rounded-2xl overflow-hidden aspect-square">
                <Image
                  src="/images/mat-piscine-ocean.webp"
                  alt="Tapis de Pilates disposé au bord de la piscine avec vue sur l'océan à Larmor-Plage"
                  fill
                  loading="lazy"
                  className="object-cover"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
              </div>
            </div>
            <div className="pt-8 space-y-4">
              <div className="relative rounded-2xl overflow-hidden aspect-square">
                <Image
                  src="/images/cours-exterieur-toulhars.webp"
                  alt="Cours de Pilates en plein air sur la plage de Toulhars à Larmor-Plage"
                  fill
                  loading="lazy"
                  className="object-cover"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
              </div>
              <div className="relative rounded-2xl overflow-hidden aspect-[3/4]">
                <Image
                  src="/images/studio-cours-particulier.webp"
                  alt="Vue intérieure du studio Mon Pilates avec Reformer Cadillac et panorama sur l'océan"
                  fill
                  loading="lazy"
                  className="object-cover"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
              </div>
            </div>
          </div>

          {/* Text */}
          <ScrollReveal>
            <p className="font-heading text-sm font-semibold text-mp-ocean uppercase tracking-[0.2em] mb-3">
              Le studio
            </p>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-mp-charcoal mb-6 leading-tight">
              Un espace pensé pour
              <br />
              <span className="text-mp-ocean">votre bien-être</span>
            </h2>
            <p className="font-body text-mp-text-light leading-relaxed mb-6">
              Niché face à l&apos;océan sur le boulevard des Dunes à Larmor-Plage,
              notre studio baigne dans la lumière naturelle. Parquet clair,
              Reformer Cadillac premium pour les cours privés et vue sur la mer
              créent un cocon idéal pour votre pratique.
            </p>
            <StudioStats />
            <Link href="/equipe" className="mp-btn mp-btn-secondary text-sm">
              Rencontrer l&apos;équipe
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   PROCHAINES SEANCES
   ============================================================ */
const upcomingSessions = [
  { time: "09:15", name: "Pilates classique — Tapis", level: "Tous niveaux", prof: "Violette", spots: 4, duration: 55, color: "bg-mp-ocean" },
  { time: "10:30", name: "Pilates doux — Tapis", level: "Débutant", prof: "Violette", spots: 3, duration: 55, color: "bg-mp-ocean-light" },
  { time: "18:15", name: "Pilates classique — Tapis", level: "Tous niveaux", prof: "Violette", spots: 2, duration: 55, color: "bg-mp-ocean" },
  { time: "19:30", name: "Pilates avancé", level: "Intermédiaire", prof: "Violette", spots: 3, duration: 55, color: "bg-mp-charcoal" },
];

function UpcomingSessions() {
  return (
    <section className="mp-section bg-mp-white" aria-label="Planning type">
      <div className="mp-container">
        <ScrollReveal className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-10">
          <div>
            <p className="font-heading text-sm font-semibold text-mp-ocean uppercase tracking-[0.2em] mb-3">
              Planning type
            </p>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-mp-charcoal">
              Une journée type au studio
            </h2>
          </div>
          <Link href="/planning" className="mp-btn mp-btn-secondary text-sm">
            Planning complet
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </ScrollReveal>

        <div className="space-y-3">
          {upcomingSessions.map((session, i) => (
            <ScrollReveal key={i} delay={Math.min(i, 4) as 0 | 1 | 2 | 3 | 4}>
            <div
              className="group flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 rounded-xl bg-mp-cream/60 hover:bg-mp-cream border border-transparent hover:border-mp-sand-dark/30 transition-all gap-4"
            >
              <div className="flex items-center gap-5">
                <div className="text-center min-w-[56px]">
                  <time className="font-heading text-xl font-bold text-mp-charcoal">
                    {session.time}
                  </time>
                </div>
                <div className={`w-1.5 h-10 rounded-full ${session.color} opacity-60`} />
                <div>
                  <h3 className="font-heading text-base font-semibold text-mp-charcoal">
                    {session.name}
                    <span className="text-mp-text-light font-normal text-sm ml-2">{session.level}</span>
                  </h3>
                  <p className="text-sm text-mp-text-light">
                    avec {session.prof} · {session.duration}&nbsp;<abbr title="minutes">min</abbr>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <span
                  className={`inline-flex items-center gap-1.5 text-sm font-heading font-medium ${
                    session.spots <= 2 ? "text-mp-rose" : "text-mp-sage"
                  }`}
                >
                  {session.spots <= 2 && (
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-mp-rose opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-mp-rose" />
                    </span>
                  )}
                  {session.spots} place{session.spots > 1 ? "s" : ""}
                </span>
                <Link
                  href="/planning"
                  className="mp-btn mp-btn-primary text-sm !py-2.5 !px-5 ml-auto"
                >
                  Réserver
                </Link>
              </div>
            </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   TEMOIGNAGES
   ============================================================ */
// Verbatim Google Reviews + illustrative placeholders (GDPR-compliant disclosure).
// Do NOT add illustrative reviews to structured data (no aggregateRating).
type Testimonial = {
  name: string;
  stars: number;
  text: string;
  source: "google" | "illustrative";
  meta?: string;
  avatarColor?: string;
};

const googleReviews: Testimonial[] = [
  {
    name: "Agathe",
    stars: 5,
    text: "Un pur moment de bonheur ! La séance était parfaitement guidée par une prof au top, très attentive à notre posture. Le cadre est incroyable, c'est magique.",
    source: "google",
    avatarColor: "bg-mp-ocean",
  },
  {
    name: "Marine",
    stars: 5,
    text: "Une séance exceptionnelle ! La professeure est à la fois bienveillante, professionnelle et très à l'écoute. Dans une ambiance détendue.",
    source: "google",
    avatarColor: "bg-mp-ocean",
  },
  {
    name: "Flavie",
    stars: 5,
    text: "Excellent professeur, très motivante et à l'écoute ! Mon corps et moi sommes en harmonie. Merci Violette !",
    source: "google",
    avatarColor: "bg-mp-ocean",
  },
];

// Illustrative placeholders pending GDPR-compliant collection from real students.
// Clearly labeled in the UI so users are not misled (see disclaimer below the grid).
const illustrativeReviews: Testimonial[] = [
  {
    name: "Laurent C.",
    stars: 5,
    text: "Retraité actif, j'ai repris le Pilates doux il y a six mois pour soulager mon dos. Les corrections précises de Violette et l'ambiance bienveillante font toute la différence. Je ressens une vraie stabilité retrouvée au quotidien.",
    source: "illustrative",
    meta: "Ploemeur · abonné 6 mois · Pilates doux",
    avatarColor: "bg-mp-sage",
  },
  {
    name: "Morgane L.",
    stars: 5,
    text: "Après la naissance de ma fille, je cherchais une pratique douce pour me reconnecter à mon corps. Le cours post-natal m'a permis de retrouver mon centre progressivement, sans jamais me brusquer. Violette connaît vraiment le corps des jeunes mamans.",
    source: "illustrative",
    meta: "Larmor-Plage · abonnée 4 mois · Post-natal",
    avatarColor: "bg-mp-rose",
  },
  {
    name: "Julien M.",
    stars: 5,
    text: "Étudiant en STAPS, je complète mes entraînements avec du Pilates avancé ici depuis la rentrée. Les petits groupes de 5 permettent un vrai travail technique. Les séances Reformer en privé sont exigeantes et vraiment formatrices.",
    source: "illustrative",
    meta: "Lorient · abonné 8 mois · Avancé & Reformer",
    avatarColor: "bg-mp-charcoal",
  },
];

function getInitials(name: string): string {
  const parts = name.split(/\s+/).filter(Boolean);
  const first = parts[0] ?? "";
  if (parts.length === 1) return first.slice(0, 2).toUpperCase();
  const second = parts[1] ?? "";
  return ((first[0] ?? "") + (second[0] ?? "")).toUpperCase();
}

function Testimonials() {
  const allTestimonials: Testimonial[] = [...googleReviews, ...illustrativeReviews];
  return (
    <section className="mp-section bg-mp-cream cv-auto relative overflow-hidden" aria-label="Avis clients">
      <OrganicBlob className="bottom-[-80px] left-[-120px] opacity-50" color="mp-sage" size={400} />
      <div className="mp-container relative z-10">
        <ScrollReveal className="text-center max-w-2xl mx-auto mb-12">
          <p className="font-heading text-sm font-semibold text-mp-ocean uppercase tracking-[0.2em] mb-3">
            Ils en parlent
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-mp-charcoal mb-4">
            Ce qu&apos;en disent nos élèves
          </h2>
          <p className="font-body text-mp-text leading-[1.8]">
            Des profils variés, un même retour&nbsp;: une pratique qui transforme,
            dans un cadre unique face à l&apos;océan.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {allTestimonials.map((review, i) => (
            <ScrollReveal key={review.name} delay={Math.min(i, 3) as 0 | 1 | 2 | 3}>
              <figure className="mp-card h-full p-6 border border-mp-sand-dark/20 bg-mp-white flex flex-col">
                <div className="mb-3">
                  {review.source === "google" ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 text-green-800 text-xs font-medium">
                      Avis Google vérifié
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-medium">
                      Exemple illustratif
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className={`w-10 h-10 rounded-full ${review.avatarColor ?? "bg-mp-ocean"} text-white flex items-center justify-center font-heading text-sm font-semibold`}
                    aria-hidden="true"
                  >
                    {getInitials(review.name)}
                  </div>
                  <div className="flex items-center gap-1" aria-label={`Note ${review.stars} sur 5`}>
                    {Array.from({ length: review.stars }).map((_, idx) => (
                      <Star key={idx} className="w-4 h-4 text-mp-gold fill-mp-gold" aria-hidden="true" />
                    ))}
                  </div>
                </div>
                <blockquote className="font-body text-sm text-mp-text leading-relaxed italic flex-1">
                  &laquo;&nbsp;{review.text}&nbsp;&raquo;
                </blockquote>
                <figcaption className="mt-4 pt-4 border-t border-mp-sand-dark/20 flex items-start justify-between gap-3">
                  <div>
                    <cite className="not-italic font-heading text-sm font-semibold text-mp-charcoal block">
                      {review.name}
                    </cite>
                    {review.meta && (
                      <p className="font-body text-xs text-mp-text-light mt-0.5">{review.meta}</p>
                    )}
                  </div>
                </figcaption>
              </figure>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal className="text-center">
          <a
            href="https://g.page/r/monpilates/review"
            target="_blank"
            rel="noopener noreferrer"
            className="mp-btn mp-btn-primary text-sm"
          >
            <Star className="w-4 h-4" aria-hidden="true" />
            Laisser un avis sur Google
          </a>
        </ScrollReveal>
      </div>
    </section>
  );
}

/* ============================================================
   INSTAGRAM FEED TEASER
   ============================================================ */
const instagramPosts = [
  { src: "/images/studio-reformer-ocean.webp", alt: "Reformer avec vue océan" },
  { src: "/images/illustration-cours-collectif.webp", alt: "Cours collectif au studio" },
  { src: "/images/illustration-studio-ocean.webp", alt: "Notre studio face à la mer" },
  { src: "/images/studio-cours-particulier.webp", alt: "Cours particulier Pilates" },
  { src: "/images/illustration-pilates-artistique.webp", alt: "Pilates artistique" },
  { src: "/images/illustration-cours-collectif.webp", alt: "Ambiance cours collectif" },
];

function InstagramFeed() {
  return (
    <section className="mp-section bg-mp-sand/40 cv-auto" aria-label="Instagram">
      <div className="mp-container">
        <ScrollReveal className="text-center mb-10">
          <p className="font-heading text-sm font-semibold text-mp-ocean uppercase tracking-[0.2em] mb-3">
            @monpilates.bzh
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-mp-charcoal mb-4">
            Suivez-nous sur Instagram
          </h2>
          <p className="font-body text-mp-text-light max-w-md mx-auto">
            Coulisses du studio, exercices inspirants et moments de bien-être au quotidien.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3">
          {instagramPosts.map((post, i) => (
            <ScrollReveal key={i} delay={i < 4 ? (i as 0 | 1 | 2 | 3) : undefined}>
              <a
                href="https://www.instagram.com/monpilates.bzh"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block aspect-square rounded-xl overflow-hidden"
                aria-label={`Voir sur Instagram : ${post.alt}`}
              >
                <Image
                  src={post.src}
                  alt={post.alt}
                  fill
                  loading="lazy"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 640px) 33vw, 16vw"
                />
                <div className="absolute inset-0 bg-mp-charcoal/0 group-hover:bg-mp-charcoal/40 transition-colors duration-300 flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" aria-hidden="true" />
                </div>
              </a>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal className="text-center mt-8">
          <a
            href="https://www.instagram.com/monpilates.bzh"
            target="_blank"
            rel="noopener noreferrer"
            className="mp-btn mp-btn-secondary text-sm"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            Voir plus sur Instagram
          </a>
        </ScrollReveal>
      </div>
    </section>
  );
}

/* ============================================================
   CTA WITH IMAGE
   ============================================================ */
function CtaSection() {
  return (
    <section className="relative mp-section overflow-hidden cv-auto">
      <Image
        src="/images/illustration-pilates-artistique.webp"
        alt="Illustration artistique d'une silhouette pratiquant le Pilates face à l'océan"
        fill
        loading="lazy"
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-mp-charcoal/80 via-mp-ocean-dark/60 to-mp-charcoal/70" />
      <div className="mp-container relative z-10 text-center">
        <ScrollReveal>
          <p className="font-heading text-sm font-semibold text-mp-ocean-light uppercase tracking-[0.2em] mb-4">
            Première séance
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-5 leading-tight">
            Prêt(e) à commencer ?
          </h2>
          <p className="font-body text-lg text-white/85 max-w-lg mx-auto mb-3">
            Votre premier cours d&apos;essai à seulement 10&euro;.
            Découvrez le Pilates dans un cadre exceptionnel face à l&apos;océan.
          </p>
          <p className="font-body text-sm text-white/60 mb-10">
            Satisfait(e) ou remboursé(e), sans condition.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/planning"
              className="mp-btn bg-white text-mp-charcoal hover:bg-mp-cream font-semibold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all !py-4 !px-8 !text-base"
            >
              <Calendar className="w-5 h-5" aria-hidden="true" />
              Réserver mon essai — 10€
            </Link>
            <Link href="/carte-cadeau" className="mp-btn mp-btn-gold !py-4 !px-8 !text-base">
              <Sparkles className="w-5 h-5" aria-hidden="true" />
              Offrir une carte cadeau
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

/* ============================================================
   LOCALISATION
   ============================================================ */
function Location() {
  return (
    <section className="mp-section bg-mp-white cv-auto" aria-label="Localisation">
      <div className="mp-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <ScrollReveal>
            <p className="font-heading text-sm font-semibold text-mp-ocean uppercase tracking-[0.2em] mb-3">
              Nous trouver
            </p>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-mp-charcoal mb-6 leading-tight">
              Un studio face à l&apos;océan
            </h2>
            <p className="font-body text-mp-text-light leading-relaxed mb-8">
              Niché sur le boulevard des Dunes à Larmor-Plage, notre studio vous
              accueille dans un espace lumineux et apaisant. À 10 minutes de
              Lorient, 15 minutes de Ploemeur et Guidel. Parking gratuit à
              proximité, accessible en bus (ligne P5).
            </p>
            <address className="not-italic space-y-5 mb-8">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-mp-ocean/8 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-mp-ocean" aria-hidden="true" />
                </div>
                <div>
                  <p className="font-heading font-semibold text-mp-charcoal">14 Boulevard des Dunes</p>
                  <p className="text-sm text-mp-text-light">56260 Larmor-Plage</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-mp-ocean/8 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-mp-ocean" aria-hidden="true" />
                </div>
                <div>
                  <p className="font-heading font-semibold text-mp-charcoal">Horaires</p>
                  <p className="text-sm text-mp-text-light">Lun-Ven : 9h — 20h · Sam : 9h — 14h</p>
                  <OpenStatus />
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-mp-ocean/8 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-mp-ocean" aria-hidden="true" />
                </div>
                <div>
                  <p className="font-heading font-semibold text-mp-charcoal">Contact</p>
                  <p className="text-sm text-mp-text-light">06 99 18 32 16 · contact@mon-pilates.bzh</p>
                </div>
              </div>
            </address>
            <Link href="/contact" className="mp-btn mp-btn-primary text-sm">
              Nous contacter
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </ScrollReveal>

          {/* Google Maps embed */}
          <div className="rounded-2xl overflow-hidden shadow-lg h-80 lg:h-[460px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2667.8!2d-3.384!3d47.709!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2s14+Boulevard+des+Dunes%2C+56260+Larmor-Plage!5e0!3m2!1sfr!2sfr!4v1"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Localisation du studio Mon Pilates à Larmor-Plage"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   FAQ — SEO Rich Results
   ============================================================ */
const faqs = [
  {
    q: "Faut-il avoir fait du Pilates avant ?",
    a: "Non ! Nos cours sont adaptés à tous les niveaux. Les débutants sont les bienvenus et Violette vous guide pas à pas.",
  },
  {
    q: "Comment se passe le premier cours ?",
    a: "Arrivez 10 minutes avant en tenue confortable. L'instructrice vous accueille, évalue votre condition physique et adapte les exercices. Consultez notre page Première visite pour tous les détails.",
  },
  {
    q: "Quelle est la taille des groupes ?",
    a: "5 personnes maximum par cours. C'est notre engagement pour un suivi personnalisé et des corrections individuelles.",
  },
  {
    q: "Puis-je annuler une réservation ?",
    a: "Oui, jusqu'à 12h avant le cours. Au-delà, la séance est décomptée de votre carte ou abonnement.",
  },
  {
    q: "Y a-t-il un parking ?",
    a: "Oui, parking gratuit à 50m du studio sur le boulevard des Dunes. Le studio est aussi accessible en bus (ligne P5).",
  },
]

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.q,
    acceptedAnswer: { "@type": "Answer", text: faq.a },
  })),
}

function HomeFaq() {
  return (
    <section className="mp-section bg-mp-cream cv-auto" aria-label="Questions fréquentes">
      <div className="mp-container">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
        <ScrollReveal className="text-center max-w-2xl mx-auto mb-12">
          <p className="font-heading text-sm font-semibold text-mp-ocean uppercase tracking-[0.2em] mb-3">
            Questions fréquentes
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-mp-charcoal">
            Tout savoir avant votre premier cours
          </h2>
        </ScrollReveal>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, i) => (
            <ScrollReveal key={i} delay={i < 3 ? ((i + 1) as 1 | 2 | 3) : undefined}>
              <details className="group bg-mp-white rounded-xl border border-mp-sand-dark/20 overflow-hidden scroll-mt-28">
                <summary className="flex items-center justify-between gap-4 p-6 cursor-pointer font-heading font-semibold text-mp-charcoal hover:text-mp-ocean transition-colors list-none [&::-webkit-details-marker]:hidden">
                  {faq.q}
                  <ChevronRight className="w-5 h-5 text-mp-text-light group-open:rotate-90 transition-transform flex-shrink-0" aria-hidden="true" />
                </summary>
                <div className="px-6 pb-6 pt-0">
                  <p className="font-body text-mp-text-light leading-relaxed">{faq.a}</p>
                </div>
              </details>
            </ScrollReveal>
          ))}
        </div>

        <FirstTimerOnly>
          <ScrollReveal className="text-center mt-10">
            <Link href="/premiere-visite" className="mp-btn mp-btn-secondary text-sm">
              En savoir plus sur la première visite
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </ScrollReveal>
        </FirstTimerOnly>
      </div>
    </section>
  )
}

/* ============================================================
   PAGE D'ACCUEIL
   ============================================================ */
export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustBar />

      <WhyMonPilates />
      <CourseTypes />
      <StudioAmbiance />
      <UpcomingSessions />

      {/* Studio pulse — live activity feed */}
      <section className="mp-section bg-mp-cream cv-auto" aria-label="Le studio en direct">
        <div className="mp-container">
          <ScrollReveal className="text-center max-w-2xl mx-auto mb-14">
            <p className="font-heading text-sm font-semibold text-mp-ocean uppercase tracking-[0.2em] mb-3">
              En direct
            </p>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-mp-charcoal mb-4">
              Le studio en direct
            </h2>
            <p className="font-body text-mp-text-light leading-relaxed">
              Rejoignez une communauté active de passionnés de Pilates
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Activity feed sidebar */}
            <ScrollReveal>
              <div className="mp-card p-6 border border-mp-sand-dark/20 bg-mp-white">
                <ActivityFeed mode="sidebar" />
              </div>
            </ScrollReveal>

            {/* CTA card */}
            <ScrollReveal delay={1}>
              <div className="mp-card p-8 border border-mp-sand-dark/20 bg-mp-white text-center flex flex-col items-center justify-center h-full">
                <div className="w-16 h-16 rounded-full bg-mp-ocean/10 flex items-center justify-center mx-auto mb-5">
                  <Users className="w-8 h-8 text-mp-ocean" aria-hidden="true" />
                </div>
                <h3 className="font-heading text-2xl font-bold text-mp-charcoal mb-2">
                  Rejoignez-nous
                </h3>
                <p className="font-body text-mp-text-light leading-relaxed mb-6 max-w-sm">
                  Rejoignez notre communauté d&apos;élèves et découvrez le Pilates dans un cadre exceptionnel face à l&apos;océan.
                </p>
                <TrialCtaLink
                  href="/planning"
                  className="mp-btn mp-btn-primary !py-3.5 !px-7"
                  icon={<Calendar className="w-5 h-5" aria-hidden="true" />}
                  trialLabel="Réserver mon cours d'essai"
                  returningLabel="Réserver mon prochain cours"
                />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <Testimonials />

      {/* Quiz recommendation */}
      <section className="mp-section bg-mp-cream cv-auto" aria-label="Quiz de recommandation">
        <div className="mp-container max-w-xl">
          <ScrollReveal className="text-center mb-8">
            <p className="font-heading text-sm font-semibold text-mp-ocean uppercase tracking-[0.2em] mb-3">
              Quiz rapide
            </p>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-mp-charcoal mb-4">
              Quel cours est fait pour vous ?
            </h2>
            <p className="font-body text-mp-text-light max-w-md mx-auto">
              Répondez à 3 questions pour trouver votre cours idéal.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={1}>
            <div className="mp-card p-6 sm:p-8 border border-mp-sand-dark/30 bg-mp-white">
              <CourseQuiz />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Mood-based booking */}
      <section className="mp-section bg-mp-white cv-auto" aria-label="Recommandation selon votre humeur">
        <div className="mp-container max-w-4xl">
          <ScrollReveal className="text-center mb-10">
            <p className="font-heading text-sm font-semibold text-mp-ocean uppercase tracking-[0.2em] mb-3">
              Votre humeur, votre cours
            </p>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-mp-charcoal mb-4">
              Comment vous sentez-vous aujourd&apos;hui ?
            </h2>
            <p className="font-body text-mp-text-light max-w-md mx-auto">
              Trouvez le cours parfait pour votre humeur du moment
            </p>
          </ScrollReveal>
          <ScrollReveal delay={1}>
            <div className="mp-card p-6 sm:p-8 border border-mp-sand-dark/30 bg-mp-white">
              <MoodBooking />
            </div>
          </ScrollReveal>
        </div>
      </section>

      <InstagramFeed />
      <FirstTimerOnly>
        <CtaSection />
      </FirstTimerOnly>
      <HomeFaq />
      <Location />

      {/* Floating activity toast */}
      <ActivityFeed mode="toast" />
    </>
  );
}
