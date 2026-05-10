/* ============================================================
   MOCK DATA — Mon Pilates
   Shared across planning, cours, and equipe pages.
   ============================================================ */

export type CourseType = "tous-niveaux" | "doux-seniors" | "avance" | "maternite" | "machine";
export type Level = "Tous niveaux" | "Débutant" | "Intermédiaire" | "Avancé";

export interface Instructor {
  id: string;
  name: string;
  initials: string;
  role: string;
  bio: string;
  certifications: string[];
  specialties: CourseType[];
  color: string;
}

export interface CourseInfo {
  slug: CourseType;
  name: string;
  shortDescription: string;
  longDescription: string;
  benefits: string[];
  targetAudience: string[];
  equipment: string[];
  duration: string;
  level: Level;
  intensity: number; // 1-5
  color: string;
  colorBg: string;
}

export interface Session {
  id: string;
  courseType: CourseType;
  courseName: string;
  instructor: string;
  time: string;
  duration: string;
  durationMinutes: number;
  level: Level;
  spotsTotal: number;
  spotsRemaining: number;
  dayOffset: number; // 0 = Monday of the week
  description: string;
}

/* ----------------------------------------------------------
   COURSE TYPE COLORS
   ---------------------------------------------------------- */
// `text` keys must clear WCAG AA (4.5:1) on a /10-tinted bg. Decorative
// shades (`-light`) drop below ~3:1 even on white, so prenatal + doux use
// `-dark` variants for any text rendered on these tints.
export const courseTypeColors: Record<CourseType, { dot: string; bg: string; text: string; border: string }> = {
  "tous-niveaux": { dot: "bg-mp-ocean", bg: "bg-mp-ocean/10", text: "text-mp-ocean-dark", border: "border-mp-ocean" },
  "maternite": { dot: "bg-mp-rose", bg: "bg-mp-rose/10", text: "text-mp-rose-dark", border: "border-mp-rose" },
  "doux-seniors": { dot: "bg-mp-ocean-light", bg: "bg-mp-ocean-light/10", text: "text-mp-ocean-dark", border: "border-mp-ocean-light" },
  "avance": { dot: "bg-mp-charcoal", bg: "bg-mp-charcoal/10", text: "text-mp-charcoal", border: "border-mp-charcoal" },
  "machine": { dot: "bg-mp-gold", bg: "bg-mp-gold/10", text: "text-mp-gold", border: "border-mp-gold" },
};

export const courseTypeLabels: Record<CourseType, string> = {
  "tous-niveaux": "Tapis — classique",
  "doux-seniors": "Tapis — doux",
  "avance": "Tapis — avancé",
  "machine": "Appareils",
  "maternite": "Pré & post-natal",
};

/* ----------------------------------------------------------
   INSTRUCTORS
   ---------------------------------------------------------- */
export const instructors: Instructor[] = [
  {
    id: "violette",
    name: "Violette",
    initials: "V",
    role: "Instructrice Pilates — FPMP",
    bio: "Ancienne éducatrice en gymnastique et en sport, Violette s'est reconvertie au Pilates après un parcours personnel marqué par des blessures. « Le Pilates a été une vraie révélation : retrouver un corps sans douleur et un mouvement plus juste. » Aujourd'hui, elle accompagne chaque personne avec attention, en adaptant chaque séance à son corps, son histoire et ses besoins, dans un cadre bienveillant, lumineux et apaisé, face à l'océan.",
    certifications: [
      "Certifiée FPMP — Fédération des Professionnels de la Méthode Pilates",
      "BP AGFF — Brevet Professionnel Activités Gymniques Forme et Force (CRIFO Paris, 2010)",
      "Brevet d'État d'Éducateur Sportif — option Gymnastique Artistique Féminine (DDRJS Paris, 2001)",
      "PSC1 — Premiers Secours (Croix-Rouge française, 2012)",
    ],
    specialties: ["tous-niveaux", "doux-seniors", "avance", "machine", "maternite"],
    color: "bg-mp-ocean",
  },
];

/* ----------------------------------------------------------
   COURSE CATALOGUE
   ---------------------------------------------------------- */
export const courses: CourseInfo[] = [
  {
    slug: "tous-niveaux",
    name: "Pilates Tous Niveaux",
    shortDescription: "Le Pilates au sol, accessible à tous. Renforcez votre centre et améliorez votre posture.",
    longDescription:
      "Le Pilates classique sur tapis est la forme originelle de la méthode, pratiquée sur un simple tapis. Ce cours vous guide à travers les exercices fondamentaux de la méthode Joseph Pilates, en mettant l'accent sur le contrôle, la respiration et la fluidité du mouvement. Accessible aux débutants comme aux pratiquants confirmés, chaque séance renforce en profondeur les muscles stabilisateurs, améliore la souplesse et développe une conscience corporelle fine. Le travail au sol permet de se concentrer pleinement sur la qualité du geste, sans distraction.",
    benefits: [
      "Renforcement du centre (core) et de la posture",
      "Amélioration de la souplesse et de la mobilité",
      "Réduction des douleurs dorsales",
      "Meilleure conscience corporelle",
      "Gestion du stress par la respiration",
    ],
    targetAudience: [
      "Débutants souhaitant découvrir le Pilates",
      "Pratiquants réguliers voulant approfondir les fondamentaux",
      "Personnes souffrant de douleurs de dos",
      "Sportifs cherchant un complément d'entraînement",
      "Seniors souhaitant entretenir mobilité et équilibre (variante douce)",
    ],
    equipment: ["Tapis de sol (fourni)", "Tenue confortable", "Chaussettes antidérapantes recommandées"],
    duration: "55 min",
    level: "Tous niveaux",
    intensity: 3,
    color: "text-mp-ocean",
    colorBg: "bg-mp-ocean",
  },
  {
    slug: "maternite",
    name: "Pilates Maternité",
    shortDescription: "Adapté à chaque trimestre de grossesse et au retour de couches. Maintenez votre forme en toute sécurité.",
    longDescription:
      "Le Pilates Maternité est spécialement conçu pour accompagner les futures et jeunes mamans. En prénatal, chaque séance est adaptée au trimestre et aux besoins spécifiques de chaque participante : renforcement du plancher pelvien, soulagement des douleurs lombaires, préparation du corps à l'accouchement. En post-natal, on accompagne la reprise en douceur, la rééducation du périnée et du transverse. Violette crée un environnement chaleureux et rassurant où vous pouvez pratiquer en toute confiance.",
    benefits: [
      "Renforcement du plancher pelvien",
      "Soulagement des douleurs de dos liées à la grossesse",
      "Préparation physique à l'accouchement",
      "Récupération post-partum en douceur",
      "Maintien de la forme et de l'énergie",
      "Moment de connexion avec bébé par la respiration",
    ],
    targetAudience: [
      "Femmes enceintes (à partir du 2e trimestre)",
      "Jeunes mamans en période post-natale (avec accord médical)",
      "Avec accord du médecin ou de la sage-femme",
      "Aucune expérience en Pilates requise",
    ],
    equipment: ["Tapis et coussins (fournis)", "Tenue confortable et extensible", "Bouteille d'eau"],
    duration: "50 min",
    level: "Tous niveaux",
    intensity: 2,
    color: "text-mp-rose",
    colorBg: "bg-mp-rose",
  },
  {
    slug: "doux-seniors",
    name: "Pilates Doux – Seniors",
    shortDescription: "Une pratique lente et méditative, idéale pour la récupération et la relaxation.",
    longDescription:
      "Le Pilates Doux – Seniors est une version ralentie et accessible du Pilates, parfaite pour les personnes en convalescence, stressées, les seniors ou simplement en quête de douceur. Chaque mouvement est réalisé avec une attention particulière à la respiration et au relâchement des tensions. Ce cours intègre des éléments de stretching et de relaxation pour une expérience holistique. Idéal en complément d'une pratique plus intensive, ou comme porte d'entrée vers le Pilates.",
    benefits: [
      "Relâchement profond des tensions musculaires",
      "Amélioration de la qualité du sommeil",
      "Réduction du stress et de l'anxiété",
      "Récupération douce après une blessure",
      "Amélioration de la souplesse",
    ],
    targetAudience: [
      "Personnes stressées ou fatiguées",
      "Personnes en convalescence (avis médical)",
      "Seniors souhaitant entretenir mobilité et équilibre",
      "Débutants souhaitant une approche en douceur",
      "Complément à une pratique sportive intense",
    ],
    equipment: ["Tapis et couverture (fournis)", "Tenue très confortable", "Chaussettes chaudes"],
    duration: "50 min",
    level: "Tous niveaux",
    intensity: 1,
    color: "text-mp-ocean-light",
    colorBg: "bg-mp-ocean-light",
  },
  {
    slug: "machine",
    name: "Pilates Machine",
    shortDescription: "Pilates en petit groupe sur Reformer et appareils — l'efficacité du privé, la convivialité du collectif.",
    longDescription:
      "Le cours collectif sur appareils est notre nouveau format : 3 à 4 personnes maximum sur Reformer Cadillac, Chair et autres équipements Pilates. Vous bénéficiez de la résistance variable des ressorts pour un travail musculaire profond, tout en partageant l'énergie d'un groupe. Violette ajuste les charges et les variantes selon chaque participant — un excellent compromis entre l'accompagnement personnalisé du privé et l'émulation du collectif. Idéal pour progresser plus vite que sur tapis et découvrir l'univers des machines à un tarif accessible.",
    benefits: [
      "Travail musculaire ciblé et progressif",
      "Charge ajustable à chaque participant",
      "Progression plus rapide que sur tapis",
      "Découverte des appareils Pilates",
      "Ambiance conviviale en petit groupe",
    ],
    targetAudience: [
      "Pratiquants curieux de découvrir les appareils",
      "Personnes cherchant un travail plus poussé qu'en tapis",
      "Tarif intermédiaire entre tapis et privé",
      "Niveau intermédiaire bienvenu (débutants accompagnés)",
    ],
    equipment: ["Reformer Cadillac, Chair, accessoires", "Tenue ajustée", "Chaussettes antidérapantes obligatoires"],
    duration: "55 min",
    level: "Tous niveaux",
    intensity: 3,
    color: "text-mp-gold",
    colorBg: "bg-mp-gold",
  },
  {
    slug: "avance",
    name: "Pilates Avancé",
    shortDescription: "Un cours dynamique et exigeant pour les pratiquants confirmés en quête de dépassement.",
    longDescription:
      "Le Pilates Avancé est conçu pour les pratiquants expérimentés qui cherchent à repousser leurs limites. Violette guide ce cours exigeant qui combine les exercices avancés du répertoire classique avec des enchaînements dynamiques. Le rythme soutenu, les transitions fluides et les séries complexes demandent concentration et engagement total. Un cours qui fait transpirer tout en respectant les principes fondamentaux du Pilates : contrôle, précision et fluidité.",
    benefits: [
      "Développement de la force et de l'endurance",
      "Maîtrise des exercices avancés du répertoire",
      "Amélioration des performances sportives",
      "Challenge physique et mental",
      "Progression technique continue",
    ],
    targetAudience: [
      "Pratiquants confirmés (min. 1 an de Pilates)",
      "Sportifs de haut niveau",
      "Danseurs et performers",
    ],
    equipment: ["Tapis, cercle et petit matériel (fournis)", "Tenue ajustée", "Serviette"],
    duration: "55 min",
    level: "Avancé",
    intensity: 5,
    color: "text-mp-charcoal",
    colorBg: "bg-mp-charcoal",
  },
];

/* ----------------------------------------------------------
   WEEKLY SESSIONS — planning optimal (rentrée septembre 2026)
   Source: rebuilt from Bsport effectif moyen 2025-2026.
   dayOffset: 0=Lun, 1=Mar, 2=Mer, 3=Jeu, 4=Ven, 5=Sam, 6=Dim
   Jeudi + Dimanche fermés. Lundi matin fermé.
   Groupes Tapis : 5 max. Collectif "machine" : 4 max.
   Cours privés sur "machine" : géré séparément (privateAvailabilityWindows).
   ---------------------------------------------------------- */
export const weeklySessions: Session[] = [
  // LUNDI (après-midi/soir uniquement)
  { id: "l1", courseType: "machine", courseName: "Pilates Machine", instructor: "Violette", time: "17:00", duration: "55 min", durationMinutes: 55, level: "Tous niveaux", spotsTotal: 4, spotsRemaining: 4, dayOffset: 0, description: "Petit groupe sur Reformer et appareils, charges adaptées." },
  { id: "l2", courseType: "tous-niveaux", courseName: "Pilates Tous Niveaux", instructor: "Violette", time: "18:15", duration: "55 min", durationMinutes: 55, level: "Tous niveaux", spotsTotal: 5, spotsRemaining: 5, dayOffset: 0, description: "Séance du soir, tous niveaux." },
  { id: "l3", courseType: "tous-niveaux", courseName: "Pilates Tous Niveaux", instructor: "Violette", time: "19:30", duration: "55 min", durationMinutes: 55, level: "Tous niveaux", spotsTotal: 5, spotsRemaining: 5, dayOffset: 0, description: "Séance du soir, tous niveaux." },

  // MARDI
  { id: "m1", courseType: "doux-seniors", courseName: "Pilates Doux – Seniors", instructor: "Violette", time: "09:15", duration: "55 min", durationMinutes: 55, level: "Débutant", spotsTotal: 5, spotsRemaining: 5, dayOffset: 1, description: "Séance douce du matin, idéale pour débuter." },
  { id: "m2", courseType: "doux-seniors", courseName: "Pilates Doux – Seniors", instructor: "Violette", time: "10:30", duration: "55 min", durationMinutes: 55, level: "Débutant", spotsTotal: 5, spotsRemaining: 5, dayOffset: 1, description: "Séance douce de fin de matinée." },
  { id: "m3", courseType: "tous-niveaux", courseName: "Pilates Tous Niveaux", instructor: "Violette", time: "12:30", duration: "55 min", durationMinutes: 55, level: "Tous niveaux", spotsTotal: 5, spotsRemaining: 5, dayOffset: 1, description: "Séance complète du midi, tous niveaux." },
  { id: "m4", courseType: "avance", courseName: "Pilates Avancé", instructor: "Violette", time: "18:15", duration: "55 min", durationMinutes: 55, level: "Avancé", spotsTotal: 5, spotsRemaining: 5, dayOffset: 1, description: "Enchaînements soutenus pour pratiquants confirmés." },
  { id: "m5", courseType: "tous-niveaux", courseName: "Pilates Tous Niveaux", instructor: "Violette", time: "19:30", duration: "55 min", durationMinutes: 55, level: "Tous niveaux", spotsTotal: 5, spotsRemaining: 5, dayOffset: 1, description: "Séance du soir, tous niveaux." },

  // MERCREDI
  { id: "w1", courseType: "doux-seniors", courseName: "Pilates Doux – Seniors", instructor: "Violette", time: "10:30", duration: "55 min", durationMinutes: 55, level: "Débutant", spotsTotal: 5, spotsRemaining: 5, dayOffset: 2, description: "Séance douce du matin, idéale pour débuter." },
  { id: "w2", courseType: "tous-niveaux", courseName: "Pilates Tous Niveaux", instructor: "Violette", time: "12:30", duration: "55 min", durationMinutes: 55, level: "Tous niveaux", spotsTotal: 5, spotsRemaining: 5, dayOffset: 2, description: "Séance complète du midi, tous niveaux." },
  { id: "w3", courseType: "tous-niveaux", courseName: "Pilates Tous Niveaux", instructor: "Violette", time: "18:15", duration: "55 min", durationMinutes: 55, level: "Tous niveaux", spotsTotal: 5, spotsRemaining: 5, dayOffset: 2, description: "Séance du soir, tous niveaux." },
  { id: "w4", courseType: "machine", courseName: "Pilates Machine", instructor: "Violette", time: "19:30", duration: "55 min", durationMinutes: 55, level: "Tous niveaux", spotsTotal: 4, spotsRemaining: 4, dayOffset: 2, description: "Petit groupe sur Reformer et appareils, charges adaptées." },

  // JEUDI — fermé (indisponibilité instructrice)

  // VENDREDI
  { id: "v1", courseType: "doux-seniors", courseName: "Pilates Doux – Seniors", instructor: "Violette", time: "09:15", duration: "55 min", durationMinutes: 55, level: "Débutant", spotsTotal: 5, spotsRemaining: 5, dayOffset: 4, description: "Séance douce du matin, idéale pour débuter." },
  { id: "v2", courseType: "doux-seniors", courseName: "Pilates Doux – Seniors", instructor: "Violette", time: "10:30", duration: "55 min", durationMinutes: 55, level: "Débutant", spotsTotal: 5, spotsRemaining: 5, dayOffset: 4, description: "Séance douce de fin de matinée." },
  { id: "v3", courseType: "tous-niveaux", courseName: "Pilates Tous Niveaux", instructor: "Violette", time: "12:30", duration: "55 min", durationMinutes: 55, level: "Tous niveaux", spotsTotal: 5, spotsRemaining: 5, dayOffset: 4, description: "Séance complète du midi, tous niveaux." },
  { id: "v4", courseType: "maternite", courseName: "Pilates Maternité", instructor: "Violette", time: "17:00", duration: "55 min", durationMinutes: 55, level: "Tous niveaux", spotsTotal: 5, spotsRemaining: 5, dayOffset: 4, description: "Cours adapté à chaque trimestre de grossesse et au post-partum." },
  { id: "v5", courseType: "tous-niveaux", courseName: "Pilates Tous Niveaux", instructor: "Violette", time: "18:15", duration: "55 min", durationMinutes: 55, level: "Tous niveaux", spotsTotal: 5, spotsRemaining: 5, dayOffset: 4, description: "Séance du soir, tous niveaux." },
  { id: "v6", courseType: "avance", courseName: "Pilates Avancé", instructor: "Violette", time: "19:30", duration: "55 min", durationMinutes: 55, level: "Avancé", spotsTotal: 5, spotsRemaining: 5, dayOffset: 4, description: "Enchaînements soutenus pour pratiquants confirmés." },

  // SAMEDI (matin uniquement)
  { id: "s1", courseType: "tous-niveaux", courseName: "Pilates Tous Niveaux", instructor: "Violette", time: "09:30", duration: "55 min", durationMinutes: 55, level: "Tous niveaux", spotsTotal: 5, spotsRemaining: 5, dayOffset: 5, description: "Séance du samedi matin, tous niveaux." },
  { id: "s2", courseType: "machine", courseName: "Pilates Machine", instructor: "Violette", time: "10:45", duration: "55 min", durationMinutes: 55, level: "Tous niveaux", spotsTotal: 4, spotsRemaining: 4, dayOffset: 5, description: "Petit groupe sur Reformer et appareils, charges adaptées." },

  // DIMANCHE — fermé
];

/* ----------------------------------------------------------
   COURS PRIVÉS SUR APPAREILS — disponibilités sur réservation
   Hors planning collectif : créneaux ouverts à la demande,
   1 personne / 55 min sur Reformer Cadillac.
   ---------------------------------------------------------- */
export interface PrivateWindow {
  dayOffset: number; // 0=Lun ... 6=Dim
  label: string;     // ex. "13h - 17h"
  startTime: string; // "13:00"
  endTime: string;   // "17:00"
}

export const privateAvailabilityWindows: PrivateWindow[] = [
  // Buffers volontaires avant le prochain collectif (installation, accueil, paiement).
  { dayOffset: 0, label: "13h - 16h45", startTime: "13:00", endTime: "16:45" },
  { dayOffset: 1, label: "13h45 - 16h30", startTime: "13:45", endTime: "16:30" },
  { dayOffset: 2, label: "9h - 10h15", startTime: "09:00", endTime: "10:15" },
  { dayOffset: 2, label: "13h45 - 17h45", startTime: "13:45", endTime: "17:45" },
  { dayOffset: 4, label: "13h45 - 16h30", startTime: "13:45", endTime: "16:30" },
  { dayOffset: 5, label: "12h - 13h", startTime: "12:00", endTime: "13:00" },
];

/* ----------------------------------------------------------
   HELPERS
   ---------------------------------------------------------- */
export const dayNames = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
export const dayNamesShort = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

export function getSessionsByDay(dayOffset: number): Session[] {
  return weeklySessions.filter((s) => s.dayOffset === dayOffset).sort((a, b) => a.time.localeCompare(b.time));
}

export function getCourseBySlug(slug: string): CourseInfo | undefined {
  return courses.find((c) => c.slug === slug);
}

export function getSessionsByCourseType(type: CourseType): Session[] {
  return weeklySessions.filter((s) => s.courseType === type);
}
