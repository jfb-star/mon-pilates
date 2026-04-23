/* ============================================================
   MOCK DATA — Mon Pilates
   Shared across planning, cours, and equipe pages.
   ============================================================ */

export type CourseType = "mat" | "reformer" | "prenatal" | "doux" | "intensif";
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
export const courseTypeColors: Record<CourseType, { dot: string; bg: string; text: string; border: string }> = {
  mat: { dot: "bg-mp-ocean", bg: "bg-mp-ocean/10", text: "text-mp-ocean", border: "border-mp-ocean" },
  reformer: { dot: "bg-mp-sage", bg: "bg-mp-sage/10", text: "text-mp-sage", border: "border-mp-sage" },
  prenatal: { dot: "bg-mp-rose", bg: "bg-mp-rose/10", text: "text-mp-rose", border: "border-mp-rose" },
  doux: { dot: "bg-mp-ocean-light", bg: "bg-mp-ocean-light/10", text: "text-mp-ocean-light", border: "border-mp-ocean-light" },
  intensif: { dot: "bg-mp-charcoal", bg: "bg-mp-charcoal/10", text: "text-mp-charcoal", border: "border-mp-charcoal" },
};

export const courseTypeLabels: Record<CourseType, string> = {
  mat: "Tapis — classique",
  reformer: "Cours privé sur appareil",
  prenatal: "Pré & post-natal",
  doux: "Tapis — doux",
  intensif: "Tapis — avancé",
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
      // TODO owner: ajouter les éventuelles autres certifications / formations de Violette
    ],
    specialties: ["mat", "reformer", "prenatal", "doux", "intensif"],
    color: "bg-mp-ocean",
  },
];

/* ----------------------------------------------------------
   COURSE CATALOGUE
   ---------------------------------------------------------- */
export const courses: CourseInfo[] = [
  {
    slug: "mat",
    name: "Pilates classique — Tapis",
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
    slug: "reformer",
    name: "Cours privé sur appareil",
    shortDescription: "Séance individuelle sur notre Reformer Cadillac — un accompagnement sur-mesure.",
    longDescription:
      "Le cours privé sur appareil est une séance individuelle sur notre Reformer Cadillac premium. Cet appareil à ressorts offre une résistance variable, permettant un travail musculaire profond et ciblé. Allongé, assis ou debout, vous effectuez des mouvements contrôlés qui sollicitent l'ensemble du corps. Violette adapte chaque mouvement à votre morphologie, vos objectifs et vos éventuelles contraintes — une approche sur-mesure impossible en cours collectif. Idéal pour les débutants intimidés, les rééducations post-blessure, ou pour progresser rapidement.",
    benefits: [
      "Sculptage musculaire en profondeur",
      "Amélioration de l'alignement corporel",
      "Travail excentrique doux pour les articulations",
      "Développement de la force fonctionnelle",
      "Rééducation post-blessure en toute sécurité",
    ],
    targetAudience: [
      "Débutants qui préfèrent un accompagnement individuel",
      "Personnes en rééducation (avis médical)",
      "Sportifs recherchant un travail complémentaire ciblé",
      "Toute personne curieuse d'approfondir sa pratique",
    ],
    equipment: ["Reformer Cadillac premium", "Tenue ajustée recommandée", "Chaussettes antidérapantes obligatoires"],
    duration: "55 min",
    level: "Tous niveaux",
    intensity: 4,
    color: "text-mp-sage",
    colorBg: "bg-mp-sage",
  },
  {
    slug: "prenatal",
    name: "Pilates pré & post-natal",
    shortDescription: "Adapté à chaque trimestre de grossesse et au retour de couches. Maintenez votre forme en toute sécurité.",
    longDescription:
      "Le Pilates pré & post-natal est spécialement conçu pour accompagner les futures et jeunes mamans. En prénatal, chaque séance est adaptée au trimestre et aux besoins spécifiques de chaque participante : renforcement du plancher pelvien, soulagement des douleurs lombaires, préparation du corps à l'accouchement. En post-natal, on accompagne la reprise en douceur, la rééducation du périnée et du transverse. Violette crée un environnement chaleureux et rassurant où vous pouvez pratiquer en toute confiance.",
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
    slug: "doux",
    name: "Pilates doux — Tapis",
    shortDescription: "Une pratique lente et méditative, idéale pour la récupération et la relaxation.",
    longDescription:
      "Le Pilates doux — Tapis est une version ralentie et accessible du Pilates, parfaite pour les personnes en convalescence, stressées, les seniors ou simplement en quête de douceur. Chaque mouvement est réalisé avec une attention particulière à la respiration et au relâchement des tensions. Ce cours intègre des éléments de stretching et de relaxation pour une expérience holistique. Idéal en complément d'une pratique plus intensive, ou comme porte d'entrée vers le Pilates.",
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
    slug: "intensif",
    name: "Pilates avancé — Tapis",
    shortDescription: "Un cours dynamique et exigeant pour les pratiquants confirmés en quête de dépassement.",
    longDescription:
      "Le Pilates avancé — Tapis est conçu pour les pratiquants expérimentés qui cherchent à repousser leurs limites. Violette guide ce cours exigeant qui combine les exercices avancés du répertoire classique avec des enchaînements dynamiques. Le rythme soutenu, les transitions fluides et les séries complexes demandent concentration et engagement total. Un cours qui fait transpirer tout en respectant les principes fondamentaux du Pilates : contrôle, précision et fluidité.",
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
   WEEKLY SESSIONS (fallback data)
   Source: Bsport live calendar (mars-mai 2026) + Mer/Sam additions.
   dayOffset: 0=Lun, 1=Mar, 2=Mer, 3=Jeu, 4=Ven, 5=Sam, 6=Dim
   Jeudi + Dimanche fermés.
   Groupes Tapis : 5 max. Privé sur appareils : 1 max.
   ---------------------------------------------------------- */
export const weeklySessions: Session[] = [
  // LUNDI
  { id: "l1", courseType: "reformer", courseName: "Cours privé sur appareils", instructor: "Violette", time: "17:00", duration: "55 min", durationMinutes: 55, level: "Tous niveaux", spotsTotal: 1, spotsRemaining: 1, dayOffset: 0, description: "Séance individuelle sur Reformer Cadillac." },
  { id: "l2", courseType: "intensif", courseName: "Pilates avancé — Tapis", instructor: "Violette", time: "18:15", duration: "55 min", durationMinutes: 55, level: "Intermédiaire", spotsTotal: 5, spotsRemaining: 3, dayOffset: 0, description: "Enchaînements soutenus pour pratiquants confirmés." },
  { id: "l3", courseType: "mat", courseName: "Pilates classique — Tapis", instructor: "Violette", time: "19:30", duration: "55 min", durationMinutes: 55, level: "Tous niveaux", spotsTotal: 5, spotsRemaining: 2, dayOffset: 0, description: "Séance complète au tapis, tous niveaux." },

  // MARDI
  { id: "m1", courseType: "reformer", courseName: "Cours privé sur appareils", instructor: "Violette", time: "08:00", duration: "55 min", durationMinutes: 55, level: "Tous niveaux", spotsTotal: 1, spotsRemaining: 1, dayOffset: 1, description: "Séance individuelle sur Reformer Cadillac." },
  { id: "m2", courseType: "mat", courseName: "Pilates classique — Tapis", instructor: "Violette", time: "09:15", duration: "55 min", durationMinutes: 55, level: "Tous niveaux", spotsTotal: 5, spotsRemaining: 4, dayOffset: 1, description: "Séance complète au tapis, tous niveaux." },
  { id: "m3", courseType: "doux", courseName: "Pilates doux — Tapis", instructor: "Violette", time: "10:30", duration: "55 min", durationMinutes: 55, level: "Débutant", spotsTotal: 5, spotsRemaining: 5, dayOffset: 1, description: "Séance douce et accessible, idéale pour débuter." },
  { id: "m4", courseType: "doux", courseName: "Pilates doux — Tapis", instructor: "Violette", time: "12:30", duration: "55 min", durationMinutes: 55, level: "Débutant", spotsTotal: 5, spotsRemaining: 5, dayOffset: 1, description: "Séance douce du midi, idéale pour débuter." },
  { id: "m5", courseType: "doux", courseName: "Pilates doux — Tapis", instructor: "Violette", time: "17:00", duration: "55 min", durationMinutes: 55, level: "Débutant", spotsTotal: 5, spotsRemaining: 5, dayOffset: 1, description: "Séance douce de fin de journée." },
  { id: "m6", courseType: "mat", courseName: "Pilates classique — Tapis", instructor: "Violette", time: "18:15", duration: "55 min", durationMinutes: 55, level: "Tous niveaux", spotsTotal: 5, spotsRemaining: 3, dayOffset: 1, description: "Séance du soir, tous niveaux." },
  { id: "m7", courseType: "mat", courseName: "Pilates classique — Tapis", instructor: "Violette", time: "19:30", duration: "55 min", durationMinutes: 55, level: "Tous niveaux", spotsTotal: 5, spotsRemaining: 4, dayOffset: 1, description: "Séance du soir, tous niveaux." },

  // MERCREDI
  { id: "w1", courseType: "mat", courseName: "Pilates classique — Tapis", instructor: "Violette", time: "09:15", duration: "55 min", durationMinutes: 55, level: "Tous niveaux", spotsTotal: 5, spotsRemaining: 5, dayOffset: 2, description: "Séance complète au tapis, tous niveaux." },
  { id: "w2", courseType: "doux", courseName: "Pilates doux — Tapis", instructor: "Violette", time: "10:30", duration: "55 min", durationMinutes: 55, level: "Débutant", spotsTotal: 5, spotsRemaining: 5, dayOffset: 2, description: "Séance douce et accessible, idéale pour débuter." },
  { id: "w3", courseType: "mat", courseName: "Pilates classique — Tapis", instructor: "Violette", time: "12:30", duration: "55 min", durationMinutes: 55, level: "Tous niveaux", spotsTotal: 5, spotsRemaining: 5, dayOffset: 2, description: "Séance du midi, tous niveaux." },
  { id: "w4", courseType: "mat", courseName: "Pilates classique — Tapis", instructor: "Violette", time: "18:15", duration: "55 min", durationMinutes: 55, level: "Tous niveaux", spotsTotal: 5, spotsRemaining: 5, dayOffset: 2, description: "Séance du soir, tous niveaux." },
  { id: "w5", courseType: "intensif", courseName: "Pilates avancé — Tapis", instructor: "Violette", time: "19:30", duration: "55 min", durationMinutes: 55, level: "Intermédiaire", spotsTotal: 5, spotsRemaining: 5, dayOffset: 2, description: "Enchaînements soutenus pour pratiquants confirmés." },

  // JEUDI — fermé

  // VENDREDI
  { id: "v1", courseType: "reformer", courseName: "Cours privé sur appareils", instructor: "Violette", time: "08:00", duration: "55 min", durationMinutes: 55, level: "Tous niveaux", spotsTotal: 1, spotsRemaining: 1, dayOffset: 4, description: "Séance individuelle sur Reformer Cadillac." },
  { id: "v2", courseType: "doux", courseName: "Pilates doux — Tapis", instructor: "Violette", time: "09:15", duration: "55 min", durationMinutes: 55, level: "Débutant", spotsTotal: 5, spotsRemaining: 5, dayOffset: 4, description: "Séance douce et accessible, idéale pour débuter." },
  { id: "v3", courseType: "intensif", courseName: "Pilates avancé — Tapis", instructor: "Violette", time: "10:30", duration: "55 min", durationMinutes: 55, level: "Intermédiaire", spotsTotal: 5, spotsRemaining: 4, dayOffset: 4, description: "Enchaînements soutenus pour pratiquants confirmés." },
  { id: "v4", courseType: "mat", courseName: "Pilates classique — Tapis", instructor: "Violette", time: "12:30", duration: "55 min", durationMinutes: 55, level: "Tous niveaux", spotsTotal: 5, spotsRemaining: 5, dayOffset: 4, description: "Séance du midi, tous niveaux." },
  { id: "v5", courseType: "reformer", courseName: "Cours privé sur appareils", instructor: "Violette", time: "14:00", duration: "55 min", durationMinutes: 55, level: "Tous niveaux", spotsTotal: 1, spotsRemaining: 1, dayOffset: 4, description: "Séance individuelle sur Reformer Cadillac." },
  { id: "v6", courseType: "reformer", courseName: "Cours privé sur appareils", instructor: "Violette", time: "15:15", duration: "55 min", durationMinutes: 55, level: "Tous niveaux", spotsTotal: 1, spotsRemaining: 1, dayOffset: 4, description: "Séance individuelle sur Reformer Cadillac." },
  { id: "v7", courseType: "prenatal", courseName: "Pilates pré & post-natal", instructor: "Violette", time: "17:00", duration: "55 min", durationMinutes: 55, level: "Tous niveaux", spotsTotal: 5, spotsRemaining: 5, dayOffset: 4, description: "Cours adapté à chaque trimestre de la grossesse." },
  { id: "v8", courseType: "mat", courseName: "Pilates classique — Tapis", instructor: "Violette", time: "18:15", duration: "55 min", durationMinutes: 55, level: "Tous niveaux", spotsTotal: 5, spotsRemaining: 3, dayOffset: 4, description: "Séance du soir, tous niveaux." },
  { id: "v9", courseType: "mat", courseName: "Pilates classique — Tapis", instructor: "Violette", time: "19:30", duration: "55 min", durationMinutes: 55, level: "Tous niveaux", spotsTotal: 5, spotsRemaining: 4, dayOffset: 4, description: "Séance du soir, tous niveaux." },

  // SAMEDI (matin uniquement)
  { id: "s1", courseType: "mat", courseName: "Pilates classique — Tapis", instructor: "Violette", time: "09:00", duration: "55 min", durationMinutes: 55, level: "Tous niveaux", spotsTotal: 5, spotsRemaining: 5, dayOffset: 5, description: "Séance du samedi matin, tous niveaux." },
  { id: "s2", courseType: "doux", courseName: "Pilates doux — Tapis", instructor: "Violette", time: "10:15", duration: "55 min", durationMinutes: 55, level: "Débutant", spotsTotal: 5, spotsRemaining: 5, dayOffset: 5, description: "Séance douce et accessible, idéale pour débuter." },
  { id: "s3", courseType: "reformer", courseName: "Cours privé sur appareils", instructor: "Violette", time: "11:30", duration: "55 min", durationMinutes: 55, level: "Tous niveaux", spotsTotal: 1, spotsRemaining: 1, dayOffset: 5, description: "Séance individuelle sur Reformer Cadillac." },

  // DIMANCHE — fermé
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
