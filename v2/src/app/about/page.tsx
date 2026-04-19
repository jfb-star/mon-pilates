import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import {
  ArrowRight,
  Calendar,
  Heart,
  Leaf,
  Sparkles,
  Users,
  Waves,
} from "lucide-react"
import { Breadcrumb } from "@/components/ui/Breadcrumb"
import { ScrollReveal } from "@/components/ui/ScrollReveal"
import { SITE_URL } from "@/lib/env"

export const metadata: Metadata = {
  title: "Notre studio — Histoire et valeurs",
  description:
    "Découvrez l'histoire du studio Mon Pilates à Larmor-Plage : notre mission, nos valeurs et l'équipe qui vous accueille face à l'océan.",
  openGraph: {
    title: "Notre studio | Mon Pilates",
    description:
      "Un studio de Pilates né face à l'océan, pensé pour votre bien-être et votre progression.",
    images: [
      {
        url: "/images/studio-reformer-ocean.jpg",
        width: 1920,
        height: 1080,
        alt: "Studio Mon Pilates — Reformers face à l'océan à Larmor-Plage",
      },
    ],
  },
  alternates: {
    canonical: `${SITE_URL}/about`,
  },
}

const breadcrumbItems = [
  { name: "Accueil", href: "/" },
  { name: "Notre studio", href: "/about" },
]

const values = [
  {
    icon: Users,
    title: "Bienveillance",
    description:
      "Chaque corps est unique. On ne compare pas, on ne juge pas — on accompagne, on adapte, on encourage.",
  },
  {
    icon: Sparkles,
    title: "Exigence",
    description:
      "Une technique précise, des instructrices en formation continue, du matériel professionnel Balanced Body.",
  },
  {
    icon: Heart,
    title: "Proximité",
    description:
      "Des groupes de 10 personnes maximum pour que chaque élève soit vu, corrigé et guidé individuellement.",
  },
  {
    icon: Leaf,
    title: "Durabilité",
    description:
      "Un studio éco-conçu, une pratique respectueuse du corps et un ancrage local en Bretagne.",
  },
]

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative h-[55vh] min-h-[380px] flex items-center overflow-hidden">
        <Image
          src="/images/studio-reformer-ocean.jpg"
          alt="Studio Mon Pilates face à l'océan à Larmor-Plage"
          fill
          className="object-cover"
          priority
          fetchPriority="high"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-mp-charcoal/85 via-mp-charcoal/60 to-mp-charcoal/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-mp-charcoal/60 via-transparent to-transparent" />

        <div className="mp-container relative z-10 pt-20">
          <p className="font-heading text-sm font-semibold text-mp-ocean-light uppercase tracking-[0.25em] mb-4">
            Notre studio
          </p>
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-5 max-w-2xl">
            Une pratique née
            <br />
            <span className="text-mp-ocean-light">face à l&apos;océan</span>
          </h1>
          <p className="font-body text-lg text-white/85 max-w-xl leading-relaxed">
            Mon Pilates, c&apos;est un lieu, une équipe et une vision du bien-être
            ancrée dans la lumière bretonne.
          </p>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="mp-container pt-6">
        <Breadcrumb items={breadcrumbItems} />
      </div>

      {/* Founder story */}
      <section className="mp-section bg-mp-white" aria-label="Notre histoire">
        <div className="mp-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <ScrollReveal>
              <p className="font-heading text-sm font-semibold text-mp-ocean uppercase tracking-[0.2em] mb-3">
                Notre histoire
              </p>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-mp-charcoal mb-6 leading-tight">
                De la passion à un studio
                <br />
                <span className="text-mp-ocean">pas comme les autres</span>
              </h2>

              {/* TODO owner: remplacer par le vrai récit de création du studio (date, déclic, parcours) */}
              <div className="space-y-4 font-body text-mp-text leading-relaxed">
                <p>
                  Tout a commencé par une évidence&nbsp;: faire du Pilates
                  autrement, dans un cadre qui respire. Après des années
                  d&apos;enseignement dans des salles classiques, la fondatrice
                  a voulu créer un studio à l&apos;image de sa pratique —
                  exigeant, humain et résolument tourné vers la mer.
                </p>
                <p>
                  Installé au 14 Boulevard des Dunes, à Larmor-Plage, Mon
                  Pilates a ouvert ses portes avec une idée simple&nbsp;:
                  offrir à chaque élève l&apos;attention qu&apos;il mérite, dans
                  un espace baigné de lumière naturelle et rythmé par le va-et-vient
                  de l&apos;océan.
                </p>
                <p>
                  Aujourd&apos;hui, plus de 200 élèves franchissent régulièrement
                  nos portes. Débutants, sportifs, femmes enceintes, seniors —
                  chacun y trouve un cours adapté, une écoute sincère et une
                  progression mesurable.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={1}>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="relative rounded-2xl overflow-hidden aspect-[3/4]">
                    <Image
                      src="/images/reformer-closeup.jpg"
                      alt="Gros plan sur un Reformer Balanced Body au studio"
                      fill
                      loading="lazy"
                      className="object-cover"
                      sizes="(max-width: 1024px) 50vw, 25vw"
                    />
                  </div>
                  <div className="relative rounded-2xl overflow-hidden aspect-square">
                    <Image
                      src="/images/mat-piscine-ocean.jpg"
                      alt="Tapis de Pilates avec vue sur l'océan"
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
                      src="/images/cours-exterieur-toulhars.jpg"
                      alt="Cours de Pilates en extérieur sur la plage de Toulhars"
                      fill
                      loading="lazy"
                      className="object-cover"
                      sizes="(max-width: 1024px) 50vw, 25vw"
                    />
                  </div>
                  <div className="relative rounded-2xl overflow-hidden aspect-[3/4]">
                    <Image
                      src="/images/studio-cours-particulier.jpg"
                      alt="Vue intérieure du studio Mon Pilates"
                      fill
                      loading="lazy"
                      className="object-cover"
                      sizes="(max-width: 1024px) 50vw, 25vw"
                    />
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="mp-section bg-mp-cream" aria-label="Notre mission">
        <div className="mp-container max-w-3xl text-center">
          <ScrollReveal>
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-mp-ocean/10 text-mp-ocean mb-6">
              <Waves className="w-7 h-7" aria-hidden="true" />
            </div>
            <p className="font-heading text-sm font-semibold text-mp-ocean uppercase tracking-[0.2em] mb-3">
              Notre mission
            </p>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-mp-charcoal mb-6 leading-tight">
              Rendre le Pilates accessible, exigeant et durable
            </h2>
            {/* TODO owner: remplacer par la formulation exacte de la mission/positionnement */}
            <p className="font-body text-mp-text-light leading-relaxed text-lg">
              Nous croyons qu&apos;une pratique régulière, bien encadrée, peut
              transformer un corps et une posture. Notre mission, c&apos;est de
              créer les conditions pour que cette transformation soit possible
              pour tous&nbsp;: par la qualité de l&apos;enseignement, la taille
              réduite des groupes et un cadre qui donne envie de revenir.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Values */}
      <section className="mp-section bg-mp-white" aria-label="Nos valeurs">
        <div className="mp-container">
          <ScrollReveal className="text-center max-w-2xl mx-auto mb-14">
            <p className="font-heading text-sm font-semibold text-mp-ocean uppercase tracking-[0.2em] mb-3">
              Nos valeurs
            </p>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-mp-charcoal mb-4">
              Ce qui guide nos cours
            </h2>
            {/* TODO owner: valider la formulation des 4 valeurs (ci-dessous) */}
            <p className="font-body text-mp-text-light leading-relaxed">
              Quatre principes simples que nous appliquons à chaque séance, à
              chaque élève, à chaque correction.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <ScrollReveal key={v.title} delay={(i % 4) as 0 | 1 | 2 | 3}>
                <div className="text-center p-6 rounded-2xl bg-mp-cream/60 border border-mp-sand-dark/20 hover:border-mp-ocean/20 hover:shadow-lg transition-all duration-300 h-full">
                  <div className="w-14 h-14 rounded-2xl bg-mp-ocean/10 flex items-center justify-center mx-auto mb-4">
                    <v.icon
                      className="w-7 h-7 text-mp-ocean"
                      aria-hidden="true"
                    />
                  </div>
                  <h3 className="font-heading text-base font-semibold text-mp-charcoal mb-2">
                    {v.title}
                  </h3>
                  <p className="font-body text-sm text-mp-text-light leading-relaxed">
                    {v.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Team intro */}
      <section className="mp-section bg-mp-cream" aria-label="Notre équipe">
        <div className="mp-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <ScrollReveal>
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] shadow-lg">
                <Image
                  src="/images/studio-cours-particulier.jpg"
                  alt="L'équipe Mon Pilates lors d'un cours particulier"
                  fill
                  loading="lazy"
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </ScrollReveal>

            <ScrollReveal delay={1}>
              <p className="font-heading text-sm font-semibold text-mp-ocean uppercase tracking-[0.2em] mb-3">
                Notre équipe
              </p>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-mp-charcoal mb-6 leading-tight">
                Des instructrices formées,
                <br />
                <span className="text-mp-ocean">passionnées et à l&apos;écoute</span>
              </h2>
              {/* TODO owner: remplacer par la vraie présentation de Marie et Sophie (diplômes, expérience, spécialités) */}
              <p className="font-body text-mp-text-light leading-relaxed mb-4">
                Marie et Sophie forment le cœur du studio. Toutes deux
                certifiées auprès d&apos;écoles internationales reconnues, elles
                cumulent plus de dix années d&apos;expérience et se forment en
                continu pour faire évoluer leur pratique&nbsp;: Pilates
                prénatal, Reformer avancé, adaptation aux pathologies du dos…
              </p>
              <p className="font-body text-mp-text-light leading-relaxed mb-8">
                Elles vous connaissent par votre prénom, adaptent chaque
                exercice à votre corps du jour, et célèbrent vos progrès —
                parce qu&apos;un cours, ça se vit à deux.
              </p>
              <Link
                href="/equipe"
                className="mp-btn mp-btn-secondary text-sm"
              >
                Rencontrer l&apos;équipe
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative mp-section overflow-hidden" aria-label="Cours d'essai">
        <Image
          src="/images/illustration-pilates-artistique.png"
          alt=""
          fill
          loading="lazy"
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-mp-charcoal/85 via-mp-ocean-dark/65 to-mp-charcoal/75" />
        <div className="mp-container relative z-10 text-center">
          <ScrollReveal>
            <p className="font-heading text-sm font-semibold text-mp-ocean-light uppercase tracking-[0.2em] mb-4">
              Envie d&apos;essayer ?
            </p>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-5 leading-tight">
              Commencez par un cours d&apos;essai
            </h2>
            <p className="font-body text-lg text-white/85 max-w-lg mx-auto mb-10">
              Votre première séance à <strong>10&euro;</strong>, satisfait(e)
              ou remboursé(e). La meilleure façon de découvrir si Mon Pilates
              est fait pour vous.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/planning"
                className="mp-btn bg-white text-mp-charcoal hover:bg-mp-cream font-semibold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all !py-4 !px-8 !text-base"
              >
                <Calendar className="w-5 h-5" aria-hidden="true" />
                Réserver mon essai
              </Link>
              <Link
                href="/premiere-visite"
                className="mp-btn !border-white/30 !text-white hover:!bg-white hover:!text-mp-charcoal !py-4 !px-8 !text-base backdrop-blur-sm !bg-white/10"
              >
                En savoir plus
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  )
}
