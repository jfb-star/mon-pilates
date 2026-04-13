import type { Metadata } from "next"
import { Outfit } from "next/font/google"
import { Lora } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/components/providers/AuthProvider"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
})

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    default: "Mon Pilates — Studio à Larmor-Plage, Bretagne",
    template: "%s | Mon Pilates",
  },
  description:
    "Studio de Pilates à Larmor-Plage. Cours Mat, Reformer, Prénatal, Senior. Réservez en ligne et découvrez nos formules.",
  metadataBase: new URL("https://mon-pilates.bzh"),
  icons: {
    icon: "/images/favicon.png",
    apple: "/images/logo-192.png",
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "Mon Pilates",
    url: "https://mon-pilates.bzh",
    images: [
      {
        url: "/images/hero-reformer-ocean.jpg",
        width: 1920,
        height: 1080,
        alt: "Studio Pilates Mon Pilates face \u00e0 l'oc\u00e9an \u00e0 Larmor-Plage",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mon Pilates \u2014 Studio \u00e0 Larmor-Plage, Bretagne",
    description:
      "Studio de Pilates \u00e0 Larmor-Plage. Cours Mat, Reformer, Pr\u00e9natal, Senior. R\u00e9servez en ligne.",
    images: ["/images/hero-reformer-ocean.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://mon-pilates.bzh",
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": ["SportsActivityLocation", "LocalBusiness"],
  name: "Mon Pilates",
  description:
    "Studio de Pilates \u00e0 Larmor-Plage, Bretagne. Cours Mat, Reformer, Pr\u00e9natal et Senior face \u00e0 l'oc\u00e9an.",
  url: "https://mon-pilates.bzh",
  telephone: "+33783671563",
  email: "contact@mon-pilates.bzh",
  image: "https://mon-pilates.bzh/images/hero-reformer-ocean.jpg",
  priceRange: "\u20ac\u20ac",
  currenciesAccepted: "EUR",
  paymentAccepted: "Cash, Credit Card",
  areaServed: [
    { "@type": "City", name: "Larmor-Plage" },
    { "@type": "City", name: "Lorient" },
    { "@type": "AdministrativeArea", name: "Morbihan" },
  ],
  address: {
    "@type": "PostalAddress",
    streetAddress: "14 Boulevard des Dunes",
    addressLocality: "Larmor-Plage",
    postalCode: "56260",
    addressRegion: "Bretagne",
    addressCountry: "FR",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 47.7086,
    longitude: -3.3839,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "20:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Saturday",
      opens: "09:00",
      closes: "14:00",
    },
  ],
  sameAs: [
    "https://www.instagram.com/monpilates_larmorplage/",
    "https://www.facebook.com/profile.php?id=61559937498498",
  ],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    reviewCount: 47,
    bestRating: "5",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className={`${outfit.variable} ${lora.variable}`}>
      <body className="min-h-screen flex flex-col bg-mp-white text-mp-text font-body antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Header />
        <main id="main-content" className="flex-1">
          <AuthProvider>
            {children}
          </AuthProvider>
        </main>
        <Footer />
      </body>
    </html>
  )
}
