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
  Quote,
  Baby,
  Leaf,
} from "lucide-react";

/* ============================================================
   HERO SECTION
   ============================================================ */
function Hero() {
  return (
    <section className="relative min-h-[100svh] flex items-center overflow-hidden">
      {/* Full-bleed background image */}
      <Image
        src="/images/studio-reformer-ocean.jpg"
        alt="Studio Mon Pilates face à l'océan — Reformer avec vue sur la mer à Larmor-Plage"
        fill
        className="object-cover"
        priority
        quality={85}
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-mp-charcoal/75 via-mp-charcoal/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-mp-charcoal/40 to-transparent" />

      <div className="mp-container relative z-10 pt-32 pb-20">
        <div className="max-w-2xl">
          <p className="font-heading text-sm font-semibold text-mp-ocean-light uppercase tracking-[0.25em] mb-5 animate-[fadeUp_0.6s_ease_forwards] opacity-0 [animation-delay:0.2s]">
            Studio Pilates — Larmor-Plage
          </p>
          <h1 className="font-heading text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.08] mb-6 animate-[fadeUp_0.6s_ease_forwards] opacity-0 [animation-delay:0.35s]">
            Bougez avec
            <br />
            <span className="text-mp-ocean-light">intention</span>
          </h1>
          <p className="font-body text-lg sm:text-xl text-white/85 leading-relaxed mb-10 max-w-lg animate-[fadeUp_0.6s_ease_forwards] opacity-0 [animation-delay:0.5s]">
            Un studio lumineux face à l&apos;océan, des cours adaptés à chaque
            corps, une pratique qui vous transforme en profondeur.
          </p>
          <div className="flex flex-wrap gap-4 animate-[fadeUp_0.6s_ease_forwards] opacity-0 [animation-delay:0.65s]">
            <Link href="/planning" className="mp-btn mp-btn-primary text-base !shadow-lg !shadow-mp-ocean/40">
              <Calendar className="w-5 h-5" />
              Réserver un cours
            </Link>
            <Link href="/cours" className="mp-btn !border-white/40 !text-white hover:!bg-white hover:!text-mp-charcoal text-base">
              Découvrir nos cours
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Social proof */}
          <div className="flex items-center gap-5 mt-14 pt-8 border-t border-white/15 animate-[fadeUp_0.6s_ease_forwards] opacity-0 [animation-delay:0.8s]">
            <div className="flex gap-0.5 text-mp-gold">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="w-5 h-5 fill-current" />
              ))}
            </div>
            <p className="text-sm text-white/70 font-body">
              <span className="text-white font-heading font-semibold">4.9/5</span> — Plus de 200 élèves satisfaits
            </p>
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center pt-2">
          <div className="w-1 h-2.5 rounded-full bg-white/60" />
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   TYPES DE COURS
   ============================================================ */
const courseTypes = [
  {
    icon: Heart,
    name: "Pilates Mat",
    slug: "mat",
    description: "Le Pilates au sol, accessible à tous. Renforcez votre centre et améliorez votre posture.",
    color: "text-mp-ocean",
    bg: "bg-mp-ocean/8",
    border: "group-hover:border-mp-ocean/30",
    image: "/images/illustration-cours-collectif.png",
  },
  {
    icon: Sparkles,
    name: "Pilates Reformer",
    slug: "reformer",
    description: "Sur machine Reformer, un travail en profondeur avec résistance pour sculpter votre silhouette.",
    color: "text-mp-sage",
    bg: "bg-mp-sage/8",
    border: "group-hover:border-mp-sage/30",
    image: "/images/illustration-cours-machine.png",
  },
  {
    icon: Baby,
    name: "Pilates Prénatal",
    slug: "prenatal",
    description: "Adapté à chaque trimestre. Maintenez votre forme et préparez votre corps en toute sécurité.",
    color: "text-mp-rose",
    bg: "bg-mp-rose/8",
    border: "group-hover:border-mp-rose/30",
    image: null,
  },
  {
    icon: Clock,
    name: "Pilates Senior",
    slug: "senior",
    description: "Des séances douces pour maintenir mobilité, équilibre et force. À votre rythme.",
    color: "text-mp-gold",
    bg: "bg-mp-gold/8",
    border: "group-hover:border-mp-gold/30",
    image: null,
  },
  {
    icon: Leaf,
    name: "Pilates Doux",
    slug: "doux",
    description: "Une pratique lente et méditative, idéale pour la récupération et la relaxation profonde.",
    color: "text-mp-ocean-light",
    bg: "bg-mp-ocean-light/10",
    border: "group-hover:border-mp-ocean-light/30",
    image: null,
  },
];

function CourseTypes() {
  return (
    <section className="mp-section bg-mp-white">
      <div className="mp-container">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="font-heading text-sm font-semibold text-mp-ocean uppercase tracking-[0.2em] mb-3">
            Nos cours
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-mp-charcoal mb-4">
            Un Pilates pour chaque besoin
          </h2>
          <p className="font-body text-mp-text-light leading-relaxed">
            Que vous soyez débutant ou confirmé, enceinte ou senior, découvrez le cours qui vous correspond.
          </p>
        </div>

        {/* Top 2 cards with images — larger */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {courseTypes.slice(0, 2).map((course) => (
            <Link key={course.slug} href={`/cours/${course.slug}`} className="block group">
              <div className={`mp-card border border-mp-sand-dark/20 ${course.border} transition-all overflow-hidden`}>
                {course.image && (
                  <div className="relative h-52 overflow-hidden">
                    <Image
                      src={course.image}
                      alt={course.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </div>
                )}
                <div className="p-7">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-xl ${course.bg} ${course.color} flex items-center justify-center`}>
                      <course.icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-heading text-lg font-semibold text-mp-charcoal group-hover:text-mp-ocean transition-colors">
                      {course.name}
                    </h3>
                  </div>
                  <p className="font-body text-sm text-mp-text-light leading-relaxed">
                    {course.description}
                  </p>
                  <span className="inline-flex items-center gap-1 mt-4 text-sm font-heading font-medium text-mp-ocean group-hover:gap-2 transition-all">
                    Découvrir <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom 3 cards — smaller */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {courseTypes.slice(2).map((course) => (
            <Link key={course.slug} href={`/cours/${course.slug}`} className="block group">
              <div className={`mp-card p-7 border border-mp-sand-dark/20 ${course.border} transition-all h-full`}>
                <div className={`w-12 h-12 rounded-xl ${course.bg} ${course.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <course.icon className="w-6 h-6" />
                </div>
                <h3 className="font-heading text-base font-semibold text-mp-charcoal mb-2 group-hover:text-mp-ocean transition-colors">
                  {course.name}
                </h3>
                <p className="font-body text-sm text-mp-text-light leading-relaxed">
                  {course.description}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link href="/cours" className="mp-btn mp-btn-secondary inline-flex items-center">
            Voir tous nos cours
            <ChevronRight className="w-4 h-4" />
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
    <section className="mp-section bg-mp-cream">
      <div className="mp-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Images grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="relative rounded-2xl overflow-hidden aspect-[3/4]">
                <Image
                  src="/images/reformer-closeup.jpg"
                  alt="Reformer Balanced Body — équipement professionnel du studio"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative rounded-2xl overflow-hidden aspect-square">
                <Image
                  src="/images/mat-piscine-ocean.jpg"
                  alt="Tapis de Pilates au bord de la piscine face à l'océan"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="pt-8 space-y-4">
              <div className="relative rounded-2xl overflow-hidden aspect-square">
                <Image
                  src="/images/cours-exterieur-toulhars.jpg"
                  alt="Cours de Pilates en plein air à Toulhars, Larmor-Plage"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative rounded-2xl overflow-hidden aspect-[3/4]">
                <Image
                  src="/images/studio-cours-particulier.jpg"
                  alt="Studio Mon Pilates — vue intérieure avec Reformer et vue océan"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          {/* Text */}
          <div>
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
              équipement Balanced Body de dernière génération et vue sur la mer
              créent un cocon idéal pour votre pratique.
            </p>
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div>
                <p className="font-heading text-3xl font-bold text-mp-ocean">6</p>
                <p className="font-body text-sm text-mp-text-light">Reformer professionnels</p>
              </div>
              <div>
                <p className="font-heading text-3xl font-bold text-mp-ocean">120m²</p>
                <p className="font-body text-sm text-mp-text-light">d&apos;espace lumineux</p>
              </div>
              <div>
                <p className="font-heading text-3xl font-bold text-mp-ocean">10</p>
                <p className="font-body text-sm text-mp-text-light">places max par cours</p>
              </div>
              <div>
                <p className="font-heading text-3xl font-bold text-mp-ocean">2</p>
                <p className="font-body text-sm text-mp-text-light">instructrices certifiées</p>
              </div>
            </div>
            <Link href="/equipe" className="mp-btn mp-btn-secondary text-sm">
              Rencontrer l&apos;équipe
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   PROCHAINES SEANCES
   ============================================================ */
const upcomingSessions = [
  { time: "09:00", name: "Pilates Mat", level: "Tous niveaux", prof: "Marie", spots: 4, duration: "55 min", color: "bg-mp-ocean" },
  { time: "10:15", name: "Pilates Reformer", level: "Intermédiaire", prof: "Sophie", spots: 2, duration: "50 min", color: "bg-mp-sage" },
  { time: "11:30", name: "Pilates Senior", level: "Débutant", prof: "Marie", spots: 6, duration: "45 min", color: "bg-mp-gold" },
  { time: "18:00", name: "Pilates Mat", level: "Avancé", prof: "Sophie", spots: 1, duration: "55 min", color: "bg-mp-ocean" },
  { time: "19:15", name: "Pilates Prénatal", level: "Tous niveaux", prof: "Marie", spots: 5, duration: "50 min", color: "bg-mp-rose" },
];

function UpcomingSessions() {
  return (
    <section className="mp-section bg-mp-white">
      <div className="mp-container">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-10">
          <div>
            <p className="font-heading text-sm font-semibold text-mp-ocean uppercase tracking-[0.2em] mb-3">
              Prochaines séances
            </p>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-mp-charcoal">
              Aujourd&apos;hui au studio
            </h2>
          </div>
          <Link href="/planning" className="mp-btn mp-btn-secondary text-sm">
            Planning complet
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="space-y-3">
          {upcomingSessions.map((session, i) => (
            <div
              key={i}
              className="group flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 rounded-xl bg-mp-cream/60 hover:bg-mp-cream border border-transparent hover:border-mp-sand-dark/30 transition-all gap-4"
            >
              <div className="flex items-center gap-5">
                <div className="text-center min-w-[56px]">
                  <span className="font-heading text-xl font-bold text-mp-charcoal">
                    {session.time}
                  </span>
                </div>
                <div className={`w-1.5 h-10 rounded-full ${session.color} opacity-60`} />
                <div>
                  <h3 className="font-heading text-base font-semibold text-mp-charcoal">
                    {session.name}
                    <span className="text-mp-text-light font-normal text-sm ml-2">{session.level}</span>
                  </h3>
                  <p className="text-sm text-mp-text-light">
                    avec {session.prof} · {session.duration}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <span
                  className={`text-sm font-heading font-medium ${
                    session.spots <= 2 ? "text-mp-rose" : "text-mp-sage"
                  }`}
                >
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
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   TEMOIGNAGES
   ============================================================ */
const testimonials = [
  {
    name: "Isabelle M.",
    text: "Après 6 mois de cours, mon dos ne me fait plus souffrir. Marie est exceptionnelle, bienveillante et exigeante à la fois. Le studio est un vrai havre de paix.",
    role: "Membre depuis 2025",
    rating: 5,
  },
  {
    name: "Claire D.",
    text: "Le studio est magnifique, lumineux, face à l'océan. L'ambiance est chaleureuse, on se sent chez soi. Le Reformer avec Sophie est devenu mon rendez-vous préféré de la semaine.",
    role: "Cours Reformer",
    rating: 5,
  },
  {
    name: "Jean-Pierre L.",
    text: "À 68 ans, j'ai retrouvé une souplesse que je pensais perdue. Les cours seniors sont parfaitement adaptés, Marie connaît chacun de nous par son prénom. Je recommande les yeux fermés.",
    role: "Cours Senior",
    rating: 5,
  },
];

function Testimonials() {
  return (
    <section className="mp-section bg-mp-cream">
      <div className="mp-container">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="font-heading text-sm font-semibold text-mp-ocean uppercase tracking-[0.2em] mb-3">
            Témoignages
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-mp-charcoal mb-4">
            Ce qu&apos;en disent nos élèves
          </h2>
          <div className="flex justify-center gap-0.5 text-mp-gold mt-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} className="w-5 h-5 fill-current" />
            ))}
            <span className="ml-2 text-sm text-mp-text-light font-body">4.9/5 sur Google</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div key={i} className="relative bg-mp-white rounded-2xl p-8 shadow-[0_2px_20px_rgba(0,0,0,0.04)]">
              <Quote className="w-8 h-8 text-mp-ocean/15 mb-4" />
              <blockquote className="font-body text-mp-text leading-[1.8] mb-6">
                {t.text}
              </blockquote>
              <div className="flex items-center gap-3 pt-4 border-t border-mp-sand">
                <div className="w-10 h-10 rounded-full bg-mp-ocean/10 flex items-center justify-center">
                  <span className="font-heading text-sm font-bold text-mp-ocean">
                    {t.name.split(" ").map(n => n[0]).join("")}
                  </span>
                </div>
                <div>
                  <p className="font-heading text-sm font-semibold text-mp-charcoal">{t.name}</p>
                  <p className="text-xs text-mp-text-light">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   CTA WITH IMAGE
   ============================================================ */
function CtaSection() {
  return (
    <section className="relative mp-section overflow-hidden">
      <Image
        src="/images/illustration-pilates-artistique.png"
        alt="Illustration Pilates artistique"
        fill
        className="object-cover"
      />
      <div className="absolute inset-0 bg-mp-charcoal/70" />
      <div className="mp-container relative z-10 text-center">
        <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
          Prêt(e) à commencer ?
        </h2>
        <p className="font-body text-lg text-white/80 max-w-md mx-auto mb-10">
          Votre premier cours d&apos;essai à seulement 10€.
          Découvrez le Pilates dans un cadre exceptionnel face à l&apos;océan.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/planning"
            className="mp-btn bg-white text-mp-charcoal hover:bg-mp-cream font-semibold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"
          >
            <Calendar className="w-5 h-5" />
            Réserver mon essai — 10€
          </Link>
          <Link href="/carte-cadeau" className="mp-btn mp-btn-gold">
            <Sparkles className="w-5 h-5" />
            Offrir une carte cadeau
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   LOCALISATION
   ============================================================ */
function Location() {
  return (
    <section className="mp-section bg-mp-white">
      <div className="mp-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="font-heading text-sm font-semibold text-mp-ocean uppercase tracking-[0.2em] mb-3">
              Nous trouver
            </p>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-mp-charcoal mb-6 leading-tight">
              Un studio face à l&apos;océan
            </h2>
            <p className="font-body text-mp-text-light leading-relaxed mb-8">
              Niché sur le boulevard des Dunes à Larmor-Plage, notre studio vous
              accueille dans un espace lumineux et apaisant. Parking gratuit à
              proximité, accessible en bus (ligne P5).
            </p>
            <div className="space-y-5 mb-8">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-mp-ocean/8 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-mp-ocean" />
                </div>
                <div>
                  <p className="font-heading font-semibold text-mp-charcoal">14 Boulevard des Dunes</p>
                  <p className="text-sm text-mp-text-light">56260 Larmor-Plage</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-mp-ocean/8 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-mp-ocean" />
                </div>
                <div>
                  <p className="font-heading font-semibold text-mp-charcoal">Horaires</p>
                  <p className="text-sm text-mp-text-light">Lun-Ven : 9h — 20h · Sam : 9h — 14h</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-mp-ocean/8 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-mp-ocean" />
                </div>
                <div>
                  <p className="font-heading font-semibold text-mp-charcoal">Contact</p>
                  <p className="text-sm text-mp-text-light">07 83 67 15 63 · contact@mon-pilates.bzh</p>
                </div>
              </div>
            </div>
            <Link href="/contact" className="mp-btn mp-btn-primary text-sm">
              Nous contacter
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

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
   PAGE D'ACCUEIL
   ============================================================ */
export default function HomePage() {
  return (
    <>
      <Hero />
      <CourseTypes />
      <StudioAmbiance />
      <UpcomingSessions />
      <Testimonials />
      <CtaSection />
      <Location />
    </>
  );
}
