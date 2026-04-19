import type { Metadata, Viewport } from "next"
import { Outfit } from "next/font/google"
import { Lora } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/components/providers/AuthProvider"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { MobileFloatingCta } from "@/components/ui/MobileFloatingCta"
import { WhatsAppButton } from "@/components/ui/WhatsAppButton"
import { BackToTop } from "@/components/ui/BackToTop"
import { CookieConsent } from "@/components/ui/CookieConsent"
import { ScrollProgress } from "@/components/ui/ScrollProgress"
import { GoogleAnalytics } from "@/components/seo/GoogleAnalytics"
import { WebVitals } from "@/components/ui/WebVitals"
import { ToastProvider } from "@/components/ui/Toast"
import { SITE_URL } from "@/lib/env"

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-outfit",
  display: "swap",
})

const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-lora",
  display: "swap",
})

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#6b9fad",
}

export const metadata: Metadata = {
  title: {
    default: "Mon Pilates — Studio à Larmor-Plage, Bretagne",
    template: "%s | Mon Pilates",
  },
  description:
    "Studio de Pilates face à l'océan à Larmor-Plage (Lorient). Cours Mat, Reformer, Prénatal & Senior en petits groupes (10 max). Cours d'essai à 10\u20ac. Réservez en ligne.",
  metadataBase: new URL(SITE_URL),
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
  },
  manifest: "/manifest.json",
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "format-detection": "telephone=no",
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "Mon Pilates",
    url: SITE_URL,
    images: [
      {
        url: "/images/studio-reformer-ocean.jpg",
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
    images: ["/images/studio-reformer-ocean.jpg"],
  },
  keywords: [
    "pilates larmor-plage", "pilates lorient", "studio pilates bretagne",
    "cours pilates reformer", "pilates prénatal", "pilates senior",
    "cours pilates morbihan", "mon pilates",
  ],
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: SITE_URL,
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": ["SportsActivityLocation", "LocalBusiness", "HealthClub"],
  name: "Mon Pilates",
  description:
    "Studio de Pilates \u00e0 Larmor-Plage, Bretagne. Cours Mat, Reformer, Pr\u00e9natal et Senior face \u00e0 l'oc\u00e9an.",
  url: SITE_URL,
  telephone: "+33699183216",
  email: "contact@mon-pilates.bzh",
  image: `${SITE_URL}/images/studio-reformer-ocean.jpg`,
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
  hasMap: "https://www.google.com/maps?cid=0",
  potentialAction: {
    "@type": "ReserveAction",
    target: `${SITE_URL}/planning`,
    name: "Réserver un cours de Pilates",
  },
  sameAs: [
    "https://www.instagram.com/monpilates.bzh",
    "https://www.facebook.com/MonPilatesBZH",
  ],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    reviewCount: 47,
    bestRating: "5",
  },
  review: [
    {
      "@type": "Review",
      author: { "@type": "Person", name: "Isabelle M." },
      datePublished: "2025-06-01",
      reviewBody:
        "Après 6 mois de cours, mon dos ne me fait plus souffrir. Marie est exceptionnelle, bienveillante et exigeante à la fois. Le studio est un vrai havre de paix.",
      reviewRating: {
        "@type": "Rating",
        ratingValue: "5",
        bestRating: "5",
      },
    },
    {
      "@type": "Review",
      author: { "@type": "Person", name: "Claire D." },
      datePublished: "2025-05-15",
      reviewBody:
        "Le studio est magnifique, lumineux, face à l'océan. L'ambiance est chaleureuse, on se sent chez soi. Le Reformer avec Sophie est devenu mon rendez-vous préféré de la semaine.",
      reviewRating: {
        "@type": "Rating",
        ratingValue: "5",
        bestRating: "5",
      },
    },
    {
      "@type": "Review",
      author: { "@type": "Person", name: "Jean-Pierre L." },
      datePublished: "2025-04-20",
      reviewBody:
        "À 68 ans, j'ai retrouvé une souplesse que je pensais perdue. Les cours seniors sont parfaitement adaptés, Marie connaît chacun de nous par son prénom. Je recommande les yeux fermés.",
      reviewRating: {
        "@type": "Rating",
        ratingValue: "5",
        bestRating: "5",
      },
    },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className={`${outfit.variable} ${lora.variable}`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("mp-theme");if(t==="dark")document.documentElement.classList.add("dark");else if(t==="light")document.documentElement.classList.add("light")}catch(e){}})()`,
          }}
        />
        <GoogleAnalytics />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://js.stripe.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google.com" />
        <link rel="dns-prefetch" href="https://maps.googleapis.com" />
      </head>
      <body className="min-h-screen flex flex-col bg-mp-white text-mp-text font-body antialiased">
        <noscript>
          <div style={{ background: "#6b9fad", color: "white", padding: "12px 24px", textAlign: "center", fontSize: "14px", fontFamily: "sans-serif" }}>
            Ce site fonctionne mieux avec JavaScript activé. Veuillez l&apos;activer pour profiter de toutes les fonctionnalités (réservation, navigation, formulaires).
          </div>
        </noscript>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-6 focus:py-3 focus:rounded-xl focus:bg-mp-ocean focus:text-white focus:font-heading focus:font-semibold focus:text-sm focus:shadow-xl focus:outline-none"
        >
          Aller au contenu principal
        </a>
        <ScrollProgress />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Mon Pilates",
            url: SITE_URL,
            inLanguage: "fr-FR",
            description: "Studio de Pilates face à l'océan à Larmor-Plage. Cours Mat, Reformer, Prénatal et Senior.",
            publisher: {
              "@type": "Organization",
              name: "Mon Pilates",
              url: SITE_URL,
              logo: { "@type": "ImageObject", url: `${SITE_URL}/images/logo.png` },
            },
          }) }}
        />
        <AuthProvider>
          <ToastProvider>
            <Header />
            <main id="main-content" role="main" className="flex-1">
              {children}
            </main>
            <Footer />
            <MobileFloatingCta />
            <WhatsAppButton />
            <BackToTop />
          </ToastProvider>
        </AuthProvider>
        <CookieConsent />
        <WebVitals />
      </body>
    </html>
  )
}
