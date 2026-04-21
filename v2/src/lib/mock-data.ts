/* ============================================================
   MOCK DATA — Mon Pilates
   Shared across planning, cours, and equipe pages.
   ============================================================ */

export type CourseType = "mat" | "reformer" | "prenatal" | "senior" | "doux" | "intensif";
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
  senior: { dot: "bg-mp-gold", bg: "bg-mp-gold/10", text: "text-mp-gold", border: "border-mp-gold" },
  doux: { dot: "bg-mp-ocean-light", bg: "bg-mp-ocean-light/10", text: "text-mp-ocean-light", border: "border-mp-ocean-light" },
  intensif: { dot: "bg-mp-charcoal", bg: "bg-mp-charcoal/10", text: "text-mp-charcoal", border: "border-mp-charcoal" },
};

export const courseTypeLabels: Record<CourseType, string> = {
  mat: "Mat",
  reformer: "Reformer",
  prenatal: "Prénatal",
  senior: "Senior",
  doux: "Doux",
  intensif: "Intensif",
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
    specialties: ["mat", "reformer", "prenatal", "senior", "doux", "intensif"],
    color: "bg-mp-ocean",
  },
];

/* ----------------------------------------------------------
   COURSE CATALOGUE
   ---------------------------------------------------------- */
export const courses: CourseInfo[] = [
  {
    slug: "mat",
    name: "Pilates Mat",
    shortDescription: "Le Pilates au sol, accessible à tous. Renforcez votre centre et améliorez votre posture.",
    longDescription:
      "Le Pilates Mat est la forme originelle du Pilates, pratiquée sur un simple tapis. Ce cours vous guide à travers les exercices fondamentaux de la méthode Joseph Pilates, en mettant l'accent sur le contrôle, la respiration et la fluidité du mouvement. Accessible aux débutants comme aux pratiquants confirmés, chaque séance renforce en profondeur les muscles stabilisateurs, améliore la souplesse et développe une conscience corporelle fine. Le travail au sol permet de se concentrer pleinement sur la qualité du geste, sans distraction.",
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
    name: "Pilates Reformer",
    shortDescription: "Sur machine Reformer, un travail en profondeur avec résistance pour sculpter votre silhouette.",
    longDescription:
      "Le Pilates Reformer utilise une machine à ressorts qui offre une résistance variable, permettant un travail musculaire profond et ciblé. Allongé, assis ou debout sur le chariot mobile, vous effectuez des mouvements contrôlés qui sollicitent l'ensemble du corps. Le Reformer permet d'adapter l'intensité à chaque niveau et offre un feedback tactile unique. Nos Reformer Balanced Body de dernière génération garantissent un confort optimal et une fluidité de mouvement exceptionnelle.",
    benefits: [
      "Sculptage musculaire en profondeur",
      "Amélioration de l'alignement corporel",
      "Travail excentrique doux pour les articulations",
      "Développement de la force fonctionnelle",
      "Rééducation post-blessure en toute sécurité",
    ],
    targetAudience: [
      "Pratiquants ayant une base en Pilates Mat",
      "Personnes en rééducation (avis médical)",
      "Sportifs recherchant un travail complémentaire",
      "Toute personne curieuse d'approfondir sa pratique",
    ],
    equipment: ["Machine Reformer (fournie)", "Tenue ajustée recommandée", "Chaussettes antidérapantes obligatoires"],
    duration: "50 min",
    level: "Intermédiaire",
    intensity: 4,
    color: "text-mp-sage",
    colorBg: "bg-mp-sage",
  },
  {
    slug: "prenatal",
    name: "Pilates Prénatal",
    shortDescription: "Adapté à chaque trimestre de grossesse. Maintenez votre forme en toute sécurité.",
    longDescription:
      "Le Pilates Prénatal est spécialement conçu pour accompagner les futures mamans tout au long de leur grossesse. Chaque séance est adaptée au trimestre et aux besoins spécifiques de chaque participante. On y travaille le renforcement du plancher pelvien, le soulagement des douleurs lombaires, et la préparation du corps à l'accouchement. Violette crée un environnement chaleureux et rassurant où les futures mamans peuvent pratiquer en toute confiance.",
    benefits: [
      "Renforcement du plancher pelvien",
      "Soulagement des douleurs de dos liées à la grossesse",
      "Préparation physique à l'accouchement",
      "Maintien de la forme et de l'énergie",
      "Moment de connexion avec bébé par la respiration",
    ],
    targetAudience: [
      "Femmes enceintes (à partir du 2e trimestre)",
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
    slug: "senior",
    name: "Pilates Senior",
    shortDescription: "Des séances douces pour maintenir mobilité, équilibre et force en toute sécurité.",
    longDescription:
      "Le Pilates Senior est une pratique adaptée aux personnes de plus de 60 ans, axée sur le maintien de la mobilité, de l'équilibre et de la force musculaire. Les exercices sont réalisés à un rythme doux, avec des options assises ou debout selon les besoins. Violette porte une attention particulière à chaque participant, ajustant les mouvements pour respecter les éventuelles limitations. Ce cours est aussi un moment de convivialité et de partage dans un petit groupe bienveillant.",
    benefits: [
      "Maintien de l'équilibre et prévention des chutes",
      "Préservation de la mobilité articulaire",
      "Renforcement musculaire en douceur",
      "Amélioration de la coordination",
      "Bien-être mental et lien social",
    ],
    targetAudience: [
      "Personnes de plus de 60 ans",
      "Personnes à mobilité réduite (sous avis médical)",
      "Aucune expérience en Pilates requise",
    ],
    equipment: ["Tapis et chaise (fournis)", "Tenue confortable", "Chaussures souples ou chaussettes antidérapantes"],
    duration: "45 min",
    level: "Débutant",
    intensity: 1,
    color: "text-mp-gold",
    colorBg: "bg-mp-gold",
  },
  {
    slug: "doux",
    name: "Pilates Doux",
    shortDescription: "Une pratique lente et méditative, idéale pour la récupération et la relaxation.",
    longDescription:
      "Le Pilates Doux est une version ralentie et méditative du Pilates, parfaite pour les personnes en convalescence, stressées ou simplement en quête de douceur. Chaque mouvement est réalisé avec une attention particulière à la respiration et au relâchement des tensions. Ce cours intègre des éléments de stretching et de relaxation pour une expérience holistique. Idéal en complément d'une pratique plus intensive, ou comme porte d'entrée vers le Pilates.",
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
    name: "Pilates Intensif",
    shortDescription: "Un cours dynamique et exigeant pour les pratiquants confirmés en quête de dépassement.",
    longDescription:
      "Le Pilates Intensif est conçu pour les pratiquants expérimentés qui cherchent à repousser leurs limites. Violette guide ce cours exigeant qui combine les exercices avancés du répertoire classique avec des enchaînements dynamiques. Le rythme soutenu, les transitions fluides et les séries complexes demandent concentration et engagement total. Un cours qui fait transpirer tout en respectant les principes fondamentaux du Pilates : contrôle, précision et fluidité.",
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
   WEEKLY SESSIONS (mock data)
   dayOffset: 0=Lun, 1=Mar, 2=Mer, 3=Jeu, 4=Ven, 5=Sam
   ---------------------------------------------------------- */
export const weeklySessions: Session[] = [
  // LUNDI
  { id: "l1", courseType: "mat", courseName: "Pilates Mat", instructor: "Violette", time: "09:00", duration: "55 min", durationMinutes: 55, level: "Tous niveaux", spotsTotal: 10, spotsRemaining: 4, dayOffset: 0, description: "Séance complète de Pilates au sol pour tous niveaux." },
  { id: "l2", courseType: "reformer", courseName: "Pilates Reformer", instructor: "Violette", time: "10:15", duration: "50 min", durationMinutes: 50, level: "Intermédiaire", spotsTotal: 6, spotsRemaining: 2, dayOffset: 0, description: "Travail sur Reformer avec résistance progressive." },
  { id: "l3", courseType: "senior", courseName: "Pilates Senior", instructor: "Violette", time: "11:30", duration: "45 min", durationMinutes: 45, level: "Débutant", spotsTotal: 8, spotsRemaining: 5, dayOffset: 0, description: "Séance douce adaptée aux seniors." },
  { id: "l4", courseType: "mat", courseName: "Pilates Mat", instructor: "Violette", time: "18:00", duration: "55 min", durationMinutes: 55, level: "Avancé", spotsTotal: 10, spotsRemaining: 1, dayOffset: 0, description: "Séance avancée pour pratiquants confirmés." },
  { id: "l5", courseType: "prenatal", courseName: "Pilates Prénatal", instructor: "Violette", time: "19:15", duration: "50 min", durationMinutes: 50, level: "Tous niveaux", spotsTotal: 6, spotsRemaining: 3, dayOffset: 0, description: "Cours adapté aux futures mamans." },

  // MARDI
  { id: "m1", courseType: "reformer", courseName: "Pilates Reformer", instructor: "Violette", time: "09:00", duration: "50 min", durationMinutes: 50, level: "Tous niveaux", spotsTotal: 6, spotsRemaining: 3, dayOffset: 1, description: "Initiation au Reformer, tous niveaux bienvenus." },
  { id: "m2", courseType: "doux", courseName: "Pilates Doux", instructor: "Violette", time: "10:15", duration: "50 min", durationMinutes: 50, level: "Tous niveaux", spotsTotal: 10, spotsRemaining: 7, dayOffset: 1, description: "Séance douce et méditative, idéale pour la récupération." },
  { id: "m3", courseType: "mat", courseName: "Pilates Mat", instructor: "Violette", time: "12:15", duration: "55 min", durationMinutes: 55, level: "Intermédiaire", spotsTotal: 10, spotsRemaining: 5, dayOffset: 1, description: "Séance intermédiaire avec focus sur le centre." },
  { id: "m4", courseType: "intensif", courseName: "Pilates Intensif", instructor: "Violette", time: "18:00", duration: "55 min", durationMinutes: 55, level: "Avancé", spotsTotal: 8, spotsRemaining: 2, dayOffset: 1, description: "Cours dynamique et exigeant." },
  { id: "m5", courseType: "mat", courseName: "Pilates Mat", instructor: "Violette", time: "19:15", duration: "55 min", durationMinutes: 55, level: "Tous niveaux", spotsTotal: 10, spotsRemaining: 6, dayOffset: 1, description: "Séance du soir, tous niveaux." },

  // MERCREDI
  { id: "w1", courseType: "mat", courseName: "Pilates Mat", instructor: "Violette", time: "09:00", duration: "55 min", durationMinutes: 55, level: "Débutant", spotsTotal: 10, spotsRemaining: 8, dayOffset: 2, description: "Séance débutants, idéale pour découvrir le Pilates." },
  { id: "w2", courseType: "reformer", courseName: "Pilates Reformer", instructor: "Violette", time: "10:15", duration: "50 min", durationMinutes: 50, level: "Avancé", spotsTotal: 6, spotsRemaining: 1, dayOffset: 2, description: "Reformer avancé, exercices complexes." },
  { id: "w3", courseType: "prenatal", courseName: "Pilates Prénatal", instructor: "Violette", time: "11:30", duration: "50 min", durationMinutes: 50, level: "Tous niveaux", spotsTotal: 6, spotsRemaining: 4, dayOffset: 2, description: "Cours spécial futures mamans." },
  { id: "w4", courseType: "mat", courseName: "Pilates Mat", instructor: "Violette", time: "14:00", duration: "55 min", durationMinutes: 55, level: "Intermédiaire", spotsTotal: 10, spotsRemaining: 3, dayOffset: 2, description: "Séance de l'après-midi, niveau intermédiaire." },
  { id: "w5", courseType: "doux", courseName: "Pilates Doux", instructor: "Violette", time: "18:00", duration: "50 min", durationMinutes: 50, level: "Tous niveaux", spotsTotal: 10, spotsRemaining: 6, dayOffset: 2, description: "Pilates doux en fin de journée." },
  { id: "w6", courseType: "reformer", courseName: "Pilates Reformer", instructor: "Violette", time: "19:15", duration: "50 min", durationMinutes: 50, level: "Intermédiaire", spotsTotal: 6, spotsRemaining: 4, dayOffset: 2, description: "Reformer intermédiaire en soirée." },

  // JEUDI
  { id: "j1", courseType: "senior", courseName: "Pilates Senior", instructor: "Violette", time: "09:00", duration: "45 min", durationMinutes: 45, level: "Débutant", spotsTotal: 8, spotsRemaining: 6, dayOffset: 3, description: "Séance douce pour les seniors." },
  { id: "j2", courseType: "reformer", courseName: "Pilates Reformer", instructor: "Violette", time: "10:15", duration: "50 min", durationMinutes: 50, level: "Intermédiaire", spotsTotal: 6, spotsRemaining: 2, dayOffset: 3, description: "Reformer avec focus bras et épaules." },
  { id: "j3", courseType: "mat", courseName: "Pilates Mat", instructor: "Violette", time: "12:15", duration: "55 min", durationMinutes: 55, level: "Tous niveaux", spotsTotal: 10, spotsRemaining: 5, dayOffset: 3, description: "Séance du midi, tous niveaux." },
  { id: "j4", courseType: "mat", courseName: "Pilates Mat", instructor: "Violette", time: "18:00", duration: "55 min", durationMinutes: 55, level: "Intermédiaire", spotsTotal: 10, spotsRemaining: 0, dayOffset: 3, description: "Séance complète — liste d'attente possible." },
  { id: "j5", courseType: "intensif", courseName: "Pilates Intensif", instructor: "Violette", time: "19:15", duration: "55 min", durationMinutes: 55, level: "Avancé", spotsTotal: 8, spotsRemaining: 3, dayOffset: 3, description: "Cours intensif en soirée." },

  // VENDREDI
  { id: "v1", courseType: "mat", courseName: "Pilates Mat", instructor: "Violette", time: "09:00", duration: "55 min", durationMinutes: 55, level: "Tous niveaux", spotsTotal: 10, spotsRemaining: 7, dayOffset: 4, description: "Séance du vendredi matin, bonne énergie." },
  { id: "v2", courseType: "doux", courseName: "Pilates Doux", instructor: "Violette", time: "10:15", duration: "50 min", durationMinutes: 50, level: "Tous niveaux", spotsTotal: 10, spotsRemaining: 8, dayOffset: 4, description: "Séance douce pour bien finir la semaine." },
  { id: "v3", courseType: "reformer", courseName: "Pilates Reformer", instructor: "Violette", time: "11:30", duration: "50 min", durationMinutes: 50, level: "Tous niveaux", spotsTotal: 6, spotsRemaining: 4, dayOffset: 4, description: "Reformer tous niveaux, vendredi." },
  { id: "v4", courseType: "prenatal", courseName: "Pilates Prénatal", instructor: "Violette", time: "14:00", duration: "50 min", durationMinutes: 50, level: "Tous niveaux", spotsTotal: 6, spotsRemaining: 5, dayOffset: 4, description: "Prénatal de l'après-midi." },
  { id: "v5", courseType: "mat", courseName: "Pilates Mat", instructor: "Violette", time: "18:00", duration: "55 min", durationMinutes: 55, level: "Avancé", spotsTotal: 10, spotsRemaining: 2, dayOffset: 4, description: "Mat avancé, fin de semaine." },

  // SAMEDI
  { id: "s1", courseType: "mat", courseName: "Pilates Mat", instructor: "Violette", time: "09:00", duration: "55 min", durationMinutes: 55, level: "Tous niveaux", spotsTotal: 12, spotsRemaining: 5, dayOffset: 5, description: "Grande séance du samedi matin." },
  { id: "s2", courseType: "reformer", courseName: "Pilates Reformer", instructor: "Violette", time: "10:15", duration: "50 min", durationMinutes: 50, level: "Intermédiaire", spotsTotal: 6, spotsRemaining: 1, dayOffset: 5, description: "Reformer du week-end, places limitées." },
  { id: "s3", courseType: "intensif", courseName: "Pilates Intensif", instructor: "Violette", time: "11:30", duration: "55 min", durationMinutes: 55, level: "Avancé", spotsTotal: 8, spotsRemaining: 4, dayOffset: 5, description: "Intensif du samedi, terminez la semaine en force." },
  { id: "s4", courseType: "doux", courseName: "Pilates Doux", instructor: "Violette", time: "12:45", duration: "50 min", durationMinutes: 50, level: "Tous niveaux", spotsTotal: 10, spotsRemaining: 9, dayOffset: 5, description: "Séance douce pour clôturer la semaine." },
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
