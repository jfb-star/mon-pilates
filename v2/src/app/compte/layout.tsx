import type { Metadata } from "next";
import { SITE_URL } from "@/lib/env";

export const metadata: Metadata = {
  title: "Mon compte",
  description:
    "Gerez vos reservations, votre carte de cours et votre profil sur Mon Pilates.",
  robots: { index: false, follow: false },
  alternates: {
    canonical: `${SITE_URL}/compte`,
  },
};

export default function CompteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
