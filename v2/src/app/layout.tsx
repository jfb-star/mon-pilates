import type { Metadata } from "next";
import { Outfit, Lora } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Mon Pilates — Studio à Larmor-Plage, Bretagne",
    template: "%s | Mon Pilates",
  },
  description:
    "Studio de Pilates à Larmor-Plage. Cours Mat, Reformer, Prénatal, Senior. Réservez en ligne et découvrez nos formules.",
  metadataBase: new URL("https://mon-pilates.bzh"),
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "Mon Pilates",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SportsActivityLocation",
  name: "Mon Pilates",
  description:
    "Studio de Pilates à Larmor-Plage, Bretagne. Cours Mat, Reformer, Prénatal et Senior face à l'océan.",
  url: "https://mon-pilates.bzh",
  telephone: "+33783671563",
  email: "contact@mon-pilates.bzh",
  address: {
    "@type": "PostalAddress",
    streetAddress: "14 Boulevard des Dunes",
    addressLocality: "Larmor-Plage",
    postalCode: "56260",
    addressCountry: "FR",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 47.7086,
    longitude: -3.3839,
  },
  openingHoursSpecification: [
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "09:00", closes: "20:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Saturday", opens: "09:00", closes: "14:00" },
  ],
  sameAs: [
    "https://www.instagram.com/monpilates_larmorplage/",
    "https://www.facebook.com/profile.php?id=61559937498498",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${outfit.variable} ${lora.variable}`}>
      <body className="min-h-screen flex flex-col bg-mp-white text-mp-text font-body antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
