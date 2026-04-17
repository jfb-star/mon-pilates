import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Connexion",
  description:
    "Connectez-vous ou cr\u00e9ez votre compte Mon Pilates pour g\u00e9rer vos r\u00e9servations et votre profil.",
  robots: { index: false, follow: false },
  alternates: {
    canonical: "https://mon-pilates.bzh/connexion",
  },
};

export default function ConnexionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
