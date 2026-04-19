import type { Metadata } from "next";
import { SITE_URL } from "@/lib/env";

export const metadata: Metadata = {
  title: "Connexion",
  description:
    "Connectez-vous ou cr\u00e9ez votre compte Mon Pilates pour g\u00e9rer vos r\u00e9servations et votre profil.",
  robots: { index: false, follow: false },
  alternates: {
    canonical: `${SITE_URL}/connexion`,
  },
};

export default function ConnexionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
