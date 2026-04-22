import type { Metadata } from "next";
import { SITE_URL } from "@/lib/env";

export const metadata: Metadata = {
  title: "Planning des cours — Réservation en ligne",
  description:
    "Consultez le planning hebdomadaire de Mon Pilates. Filtrez par type de cours, instructrice ou niveau et réservez en ligne. Cours d'essai à 10€.",
  openGraph: {
    title: "Planning des cours | Mon Pilates",
    description:
      "Réservez votre cours de Pilates en ligne. Planning hebdomadaire avec filtres par type, instructrice et niveau.",
    images: [
      {
        url: "/images/studio-reformer-ocean.webp",
        width: 1920,
        height: 1080,
        alt: "Studio de Pilates Mon Pilates avec Reformers et vue sur l'océan à Larmor-Plage",
      },
    ],
  },
  alternates: {
    canonical: `${SITE_URL}/planning`,
  },
};

export default function PlanningLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
