import Link from "next/link";
import type { Metadata } from "next";
import {
  Compass,
  Home,
  Calendar,
  BookOpen,
  HelpCircle,
  Gift,
  Users,
  Phone,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Page introuvable",
  description: "La page que vous cherchez n'existe plus ou a été déplacée.",
  robots: { index: false, follow: false },
};

const suggestions = [
  {
    name: "Planning des cours",
    href: "/planning",
    icon: Calendar,
    description: "Réservez votre prochaine séance",
  },
  {
    name: "Nos cours",
    href: "/cours",
    icon: BookOpen,
    description: "Découvrez nos 6 pratiques",
  },
  {
    name: "Première visite",
    href: "/premiere-visite",
    icon: HelpCircle,
    description: "Tout pour bien commencer",
  },
  {
    name: "Tarifs",
    href: "/tarifs",
    icon: Gift,
    description: "Formules et cartes de cours",
  },
  {
    name: "L'équipe",
    href: "/equipe",
    icon: Users,
    description: "Rencontrez Violette",
  },
  {
    name: "Nous contacter",
    href: "/contact",
    icon: Phone,
    description: "Une question ? On répond",
  },
];

export default function NotFound() {
  return (
    <section className="min-h-[80vh] flex items-center justify-center py-20 bg-gradient-to-b from-mp-cream to-mp-white">
      <div className="mp-container text-center">
        <div className="relative inline-block mb-8" aria-hidden="true">
          <p className="font-heading text-[7rem] sm:text-[9rem] font-bold text-mp-ocean/10 leading-none select-none">
            404
          </p>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="w-24 h-24 rounded-full bg-mp-ocean/10 flex items-center justify-center ring-8 ring-mp-white">
              <Compass className="w-11 h-11 text-mp-ocean animate-[spin_8s_linear_infinite]" />
            </div>
          </div>
        </div>

        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-mp-charcoal mb-4">
          Cette page a pris une pause
        </h1>
        <p className="font-body text-mp-text-light text-lg max-w-xl mx-auto mb-10">
          Comme en Pilates, tout est question d&apos;alignement — et celui-ci
          s&apos;est un peu perdu. Respirez, on vous remet sur le bon chemin.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-3xl mx-auto mb-10">
          {suggestions.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="mp-card p-5 border border-mp-sand-dark/30 text-left group hover:border-mp-ocean/30 flex items-start gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-mp-ocean/10 flex items-center justify-center flex-shrink-0 group-hover:bg-mp-ocean/20 transition-colors">
                <item.icon
                  className="w-5 h-5 text-mp-ocean"
                  aria-hidden="true"
                />
              </div>
              <div>
                <p className="font-heading text-sm font-semibold text-mp-charcoal group-hover:text-mp-ocean transition-colors">
                  {item.name}
                </p>
                <p className="font-body text-xs text-mp-text-light mt-0.5">
                  {item.description}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/" className="mp-btn mp-btn-primary">
            <Home className="w-4 h-4" aria-hidden="true" />
            Retour à l&apos;accueil
          </Link>
          <Link href="/cours" className="mp-btn mp-btn-secondary">
            <BookOpen className="w-4 h-4" aria-hidden="true" />
            Voir les cours
          </Link>
        </div>
      </div>
    </section>
  );
}
