import Link from "next/link";
import { Home, Calendar, BookOpen, HelpCircle, Gift, Users, Search } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page introuvable",
  robots: { index: false, follow: false },
};

const suggestions = [
  { name: "Planning des cours", href: "/planning", icon: Calendar, description: "Réservez votre séance" },
  { name: "Nos cours", href: "/cours", icon: BookOpen, description: "Découvrez nos 6 types de cours" },
  { name: "Première visite", href: "/premiere-visite", icon: HelpCircle, description: "Tout savoir pour votre 1er cours" },
  { name: "Tarifs", href: "/tarifs", icon: Gift, description: "Formules et cartes de cours" },
  { name: "L'équipe", href: "/equipe", icon: Users, description: "Rencontrez nos instructrices" },
];

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-20 bg-gradient-to-b from-mp-cream to-mp-white" role="status">
      <div className="mp-container text-center">
        {/* Decorative illustration */}
        <div className="relative inline-block mb-6" aria-hidden="true">
          <p className="font-heading text-[8rem] sm:text-[10rem] font-bold text-mp-ocean/10 leading-none select-none">
            404
          </p>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="w-20 h-20 rounded-full bg-mp-ocean/10 flex items-center justify-center">
              <Search className="w-9 h-9 text-mp-ocean/50" />
            </div>
          </div>
        </div>
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-mp-charcoal mb-4">
          Cette page a fait une pause
        </h1>
        <p className="font-body text-mp-text-light text-lg max-w-md mx-auto mb-10">
          Comme en Pilates, tout est question d&apos;alignement.
          Cette page n&apos;a pas trouvé le sien. Voici où aller :
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-3xl mx-auto mb-10">
          {suggestions.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="mp-card p-5 border border-mp-sand-dark/30 text-left group hover:border-mp-ocean/30 flex items-start gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-mp-ocean/10 flex items-center justify-center flex-shrink-0 group-hover:bg-mp-ocean/20 transition-colors">
                <item.icon className="w-5 h-5 text-mp-ocean" aria-hidden="true" />
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

        <Link href="/" className="mp-btn mp-btn-primary">
          <Home className="w-4 h-4" aria-hidden="true" />
          Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  );
}
