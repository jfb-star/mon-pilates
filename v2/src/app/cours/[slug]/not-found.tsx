import Link from "next/link";
import type { Metadata } from "next";
import { BookOpen, ArrowLeft, Calendar } from "lucide-react";

export const metadata: Metadata = {
  title: "Cours introuvable",
  description: "Ce type de cours n'existe plus ou a été déplacé.",
  robots: { index: false, follow: false },
};

export default function CourseNotFound() {
  return (
    <section className="min-h-[70vh] flex items-center justify-center py-20 bg-gradient-to-b from-mp-cream to-mp-white">
      <div className="mp-container text-center">
        <div className="w-20 h-20 rounded-full bg-mp-ocean/10 flex items-center justify-center mx-auto mb-6">
          <BookOpen className="w-10 h-10 text-mp-ocean" aria-hidden="true" />
        </div>
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-mp-charcoal mb-4">
          Ce cours est introuvable
        </h1>
        <p className="font-body text-mp-text-light text-lg max-w-xl mx-auto mb-10">
          Découvrez nos six pratiques Pilates — tapis, cours privés sur appareil,
          pré & post-natal — et trouvez celle qui vous correspond.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/cours" className="mp-btn mp-btn-primary">
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            Tous nos cours
          </Link>
          <Link href="/planning" className="mp-btn mp-btn-secondary">
            <Calendar className="w-4 h-4" aria-hidden="true" />
            Voir le planning
          </Link>
        </div>
      </div>
    </section>
  );
}
