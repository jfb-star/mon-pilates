import type { Metadata } from "next"
import { SITE_URL } from "@/lib/env"

// /defis is a personal dashboard (streaks, challenges) tied to the logged-in
// user. Not useful for search indexing — we expose a minimal title/description
// and keep the page out of the index.
export const metadata: Metadata = {
  title: "Mes défis Pilates",
  description:
    "Suivez vos défis, votre streak de séances et vos progrès au studio Mon Pilates à Larmor-Plage.",
  robots: { index: false, follow: false },
  alternates: {
    canonical: `${SITE_URL}/defis`,
  },
}

export default function DefisLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
