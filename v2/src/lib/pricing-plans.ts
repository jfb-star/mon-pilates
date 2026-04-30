/**
 * Canonical pricing plans for Mon Pilates.
 *
 * Single source of truth — imported by:
 *   - src/app/tarifs/page.tsx     → marketing grid + JSON-LD Offers
 *   - src/app/cgv/page.tsx        → article 2 price list
 *
 * Adding a plan? Update this file only — both pages render automatically.
 */

export type PricingPlan = {
  name: string
  price: number
  priceLabel: string
  perSession: string | null
  validity: string | null
  badge: string | null
  badgeColor: string
  highlighted: boolean
  cta: string
  savings: string | null
  features: string[]
  priceUnit?: string
  checkoutMode?: "course-card" | "subscription"
  cardType?: "5" | "10" | "20"
  href?: string
  isTrial?: boolean
}

export const pricingPlans: PricingPlan[] = [
  {
    name: "Découverte — Tapis",
    price: 10,
    priceLabel: "10€",
    perSession: null,
    validity: null,
    badge: "Première fois",
    badgeColor: "bg-mp-sage text-white",
    highlighted: false,
    cta: "Essayer pour 10€",
    savings: null,
    href: "/planning",
    isTrial: true,
    features: [
      "1 cours au tapis au choix",
      "Réservé aux nouveaux élèves",
      "Matériel fourni",
      "Petit groupe (5 max)",
    ],
  },
  {
    name: "Séance tapis à l'unité",
    price: 20,
    priceLabel: "20€",
    perSession: null,
    validity: null,
    badge: null,
    badgeColor: "",
    highlighted: false,
    cta: "Réserver une séance",
    savings: null,
    href: "/planning",
    features: [
      "1 cours au tapis au choix",
      "Sans engagement",
      "Matériel fourni",
      "Petit groupe (5 max)",
    ],
  },
  {
    name: "Carte 5 cours tapis",
    price: 95,
    priceLabel: "95€",
    perSession: "19€/séance",
    validity: "Valable 3 mois",
    badge: null,
    badgeColor: "",
    highlighted: false,
    cta: "Acheter 5 cours",
    savings: "Économisez 5€",
    checkoutMode: "course-card",
    cardType: "5",
    features: [
      "5 séances au tapis (doux, classique ou avancé)",
      "Valable 3 mois",
      "Matériel fourni",
      "Petit groupe (5 max)",
    ],
  },
  {
    name: "Carte 10 cours tapis",
    price: 180,
    priceLabel: "180€",
    perSession: "18€/séance",
    validity: "Valable 6 mois",
    badge: "Populaire",
    badgeColor: "bg-mp-ocean text-white",
    highlighted: true,
    cta: "Choisir la populaire",
    savings: "Économisez 20€",
    checkoutMode: "course-card",
    cardType: "10",
    features: [
      "10 séances au tapis (doux, classique ou avancé)",
      "Valable 6 mois",
      "Matériel fourni",
      "Petit groupe (5 max)",
      "Le meilleur rapport qualité-prix",
    ],
  },
  {
    name: "Carte 20 cours tapis",
    price: 340,
    priceLabel: "340€",
    perSession: "17€/séance",
    validity: "Valable 12 mois",
    badge: "Meilleure offre",
    badgeColor: "bg-mp-gold text-white",
    highlighted: false,
    cta: "Meilleure offre — acheter",
    savings: "Économisez 60€",
    checkoutMode: "course-card",
    cardType: "20",
    features: [
      "20 séances au tapis (doux, classique ou avancé)",
      "Valable 12 mois",
      "Matériel fourni",
      "Petit groupe (5 max)",
      "Le tarif le plus avantageux",
    ],
  },
  {
    name: "Découverte Privé sur équipement",
    price: 50,
    priceLabel: "50€",
    perSession: null,
    validity: null,
    badge: "Première fois",
    badgeColor: "bg-mp-sage text-white",
    highlighted: false,
    cta: "Réserver une découverte",
    savings: null,
    href: "/contact",
    features: [
      "1 séance privée sur équipement",
      "Reformer Cadillac premium",
      "Accompagnement individuel",
      "Réservé aux nouveaux élèves",
    ],
  },
  {
    name: "Privé sur équipement",
    price: 65,
    priceLabel: "65€",
    perSession: null,
    validity: null,
    badge: null,
    badgeColor: "",
    highlighted: false,
    cta: "Prendre rendez-vous",
    savings: null,
    href: "/contact",
    features: [
      "1 séance privée sur équipement",
      "Coaching individuel sur-mesure",
      "Reformer Cadillac premium",
      "Matériel professionnel",
    ],
  },
  {
    name: "Carte 10 privés équipement",
    price: 550,
    priceLabel: "550€",
    perSession: "55€/séance",
    validity: "Valable 8 mois",
    badge: "Suivi sur-mesure",
    badgeColor: "bg-mp-rose text-white",
    highlighted: false,
    cta: "Acheter 10 privés",
    savings: "Économisez 100€",
    href: "/contact",
    features: [
      "10 séances privées sur équipement",
      "Coaching individuel régulier",
      "Reformer Cadillac premium",
      "Matériel professionnel",
    ],
  },
]

/** Compact label used on the CGV page price list (article 2). */
export function cgvLineFor(plan: PricingPlan): string {
  const parts: string[] = [`${plan.name} : ${plan.priceLabel}`]
  if (plan.validity) parts.push(`(${plan.validity.toLowerCase()})`)
  if (plan.isTrial) parts.push("(réservé aux nouveaux élèves)")
  return parts.join(" ")
}
