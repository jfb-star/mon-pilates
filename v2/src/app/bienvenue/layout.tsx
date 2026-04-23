import type { Metadata } from "next"
import { SITE_URL } from "@/lib/env"

export const metadata: Metadata = {
  title: "Bienvenue — Quel cours de Pilates vous correspond ?",
  description:
    "Quiz personnalisé pour trouver le cours de Pilates idéal au studio Mon Pilates à Larmor-Plage : tapis doux, classique, avancé, cours privé sur appareil ou pré & post-natal.",
  openGraph: {
    title: "Bienvenue — Trouvez votre cours | Mon Pilates",
    description:
      "Répondez à quelques questions et découvrez le cours de Pilates fait pour vous au studio Mon Pilates de Larmor-Plage.",
    type: "website",
    locale: "fr_FR",
    url: `${SITE_URL}/bienvenue`,
    siteName: "Mon Pilates",
    images: [
      {
        url: "/images/studio-reformer-ocean.webp",
        width: 1920,
        height: 1080,
        alt: "Studio de Pilates Mon Pilates face à l'océan à Larmor-Plage",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bienvenue — Trouvez votre cours | Mon Pilates",
    description:
      "Quiz pour choisir votre cours de Pilates à Larmor-Plage.",
    images: ["/images/studio-reformer-ocean.webp"],
  },
  alternates: {
    canonical: `${SITE_URL}/bienvenue`,
  },
}

export default function BienvenueLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
