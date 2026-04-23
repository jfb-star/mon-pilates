import { SITE_URL } from "@/lib/env"

/**
 * Reusable LocalBusiness / SportsActivityLocation JSON-LD.
 *
 * Emits a single <script type="application/ld+json"> with the verified
 * studio facts: address, geo, opening hours, owner/founder (Violette,
 * FPMP certified), the unique Reformer Cadillac, 5-max group capacity,
 * and 50 m² indoor + outdoor terrace. Keep this component in sync with
 * the real studio — never invent ratings or offers that don't exist.
 *
 * Usage: drop on the home page (`/`) and on `/contact`. The Organization
 * is the same entity on both pages, so browsers and crawlers will
 * correctly de-duplicate via the shared `@id`.
 */
export function LocalBusinessJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": ["SportsActivityLocation", "LocalBusiness", "HealthClub"],
    "@id": `${SITE_URL}#studio`,
    name: "Mon Pilates",
    legalName: "Mon Pilates — Studio de Pilates",
    description:
      "Studio de Pilates à Larmor-Plage, Bretagne. 50 m² en intérieur avec terrasse extérieure pour les cours d'été, Reformer Cadillac premium, groupes de 5 participants maximum. Instructrice certifiée FPMP.",
    url: SITE_URL,
    telephone: "+33699183216",
    email: "contact@mon-pilates.bzh",
    image: [`${SITE_URL}/images/studio-reformer-ocean.webp`],
    logo: `${SITE_URL}/logo.webp`,
    priceRange: "€€",
    currenciesAccepted: "EUR",
    paymentAccepted: "Cash, Credit Card",
    maximumAttendeeCapacity: 5,
    slogan: "Le Pilates face à l'océan, à Larmor-Plage.",
    availableLanguage: ["fr", "fr-FR"],
    areaServed: [
      { "@type": "City", name: "Larmor-Plage" },
      { "@type": "City", name: "Lorient" },
      { "@type": "City", name: "Ploemeur" },
      { "@type": "AdministrativeArea", name: "Morbihan" },
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: "Boulevard des Dunes",
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
    hasMap:
      "https://www.google.com/maps/search/?api=1&query=Mon+Pilates+Larmor-Plage",
    potentialAction: {
      "@type": "ReserveAction",
      target: `${SITE_URL}/planning`,
      name: "Réserver un cours de Pilates",
    },
    sameAs: [
      "https://www.instagram.com/monpilates.bzh",
      "https://www.facebook.com/MonPilatesBZH",
    ],
    founder: {
      "@type": "Person",
      name: "Violette",
      jobTitle: "Instructrice certifiée Pilates",
      hasCredential: {
        "@type": "EducationalOccupationalCredential",
        credentialCategory: "certification",
        name: "FPMP — Fédération des Professionnels de la Méthode Pilates",
      },
    },
    employee: [
      {
        "@type": "Person",
        name: "Violette",
        jobTitle: "Instructrice de Pilates",
      },
    ],
    amenityFeature: [
      {
        "@type": "LocationFeatureSpecification",
        name: "Reformer Cadillac premium",
        value: true,
      },
      {
        "@type": "LocationFeatureSpecification",
        name: "Terrasse extérieure (cours d'été)",
        value: true,
      },
      {
        "@type": "LocationFeatureSpecification",
        name: "Groupes limités à 5 participants",
        value: true,
      },
      {
        "@type": "LocationFeatureSpecification",
        name: "Surface du studio",
        value: "50 m²",
      },
    ],
    knowsAbout: [
      "Pilates classique — Tapis",
      "Pilates doux — Tapis",
      "Pilates avancé — Tapis",
      "Cours privé sur appareil",
      "Pilates pré & post-natal",
      "Posture",
      "Rééducation posturale",
    ],
  }

  return (
    <script
      type="application/ld+json"
      // JSON.stringify with no extra whitespace — smaller payload, same semantics.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
