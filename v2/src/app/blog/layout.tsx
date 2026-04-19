import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { SITE_URL } from "@/lib/env";

export const metadata: Metadata = {
  title: "Blog — Conseils & Actualités Pilates",
  description:
    "Conseils Pilates, bien-être, actualités du studio Mon Pilates à Larmor-Plage. Exercices, bienfaits et guides pour tous niveaux.",
  openGraph: {
    title: "Blog | Mon Pilates",
    description:
      "Conseils Pilates, exercices, témoignages. Le blog du studio Mon Pilates à Larmor-Plage.",
    images: [
      {
        url: "/images/studio-reformer-ocean.jpg",
        width: 1920,
        height: 1080,
        alt: "Studio de Pilates Mon Pilates avec Reformers et vue sur l'océan à Larmor-Plage",
      },
    ],
  },
  alternates: {
    canonical: `${SITE_URL}/blog`,
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: "Accueil", href: "/" },
        { name: "Blog", href: "/blog" },
      ]} />
      {children}
    </>
  );
}
