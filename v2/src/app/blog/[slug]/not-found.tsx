import Link from "next/link";
import type { Metadata } from "next";
import { BookOpen, ArrowLeft, Home } from "lucide-react";

export const metadata: Metadata = {
  title: "Article introuvable",
  description: "Cet article n'existe plus ou a été déplacé.",
  robots: { index: false, follow: false },
};

export default function BlogArticleNotFound() {
  return (
    <section className="min-h-[70vh] flex items-center justify-center py-20 bg-gradient-to-b from-mp-cream to-mp-white">
      <div className="mp-container text-center">
        <div className="w-20 h-20 rounded-full bg-mp-ocean/10 flex items-center justify-center mx-auto mb-6">
          <BookOpen className="w-10 h-10 text-mp-ocean" aria-hidden="true" />
        </div>
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-mp-charcoal mb-4">
          Cet article est introuvable
        </h1>
        <p className="font-body text-mp-text-light text-lg max-w-xl mx-auto mb-10">
          Il a peut-être été déplacé ou dépublié. Découvrez nos autres conseils,
          guides et actualités Pilates — on a de quoi vous occuper.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/blog" className="mp-btn mp-btn-primary">
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            Retour au blog
          </Link>
          <Link href="/" className="mp-btn mp-btn-secondary">
            <Home className="w-4 h-4" aria-hidden="true" />
            Accueil
          </Link>
        </div>
      </div>
    </section>
  );
}
