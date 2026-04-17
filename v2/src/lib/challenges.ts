export interface Challenge {
  id: string;
  title: string;
  description: string;
  icon: string;
  type: "weekly" | "monthly" | "lifetime";
  target: number;
  rewardPoints: number;
}

export const CHALLENGES: Challenge[] = [
  // Weekly
  { id: "w1", title: "Régulier", description: "Assistez à 3 cours cette semaine", icon: "🎯", type: "weekly", target: 3, rewardPoints: 30 },
  { id: "w2", title: "Lève-tôt", description: "Réservez un cours avant 10h", icon: "🌅", type: "weekly", target: 1, rewardPoints: 10 },
  { id: "w3", title: "Explorateur", description: "Essayez un nouveau type de cours", icon: "🧭", type: "weekly", target: 1, rewardPoints: 20 },
  { id: "w4", title: "Duo", description: "Parrainez un ami cette semaine", icon: "👯", type: "weekly", target: 1, rewardPoints: 50 },

  // Monthly
  { id: "m1", title: "Dévoué", description: "Assistez à 10 cours ce mois-ci", icon: "💪", type: "monthly", target: 10, rewardPoints: 100 },
  { id: "m2", title: "Critique", description: "Laissez 3 avis sur vos cours", icon: "⭐", type: "monthly", target: 3, rewardPoints: 30 },
  { id: "m3", title: "Polyvalent", description: "Essayez 3 types de cours différents", icon: "🎨", type: "monthly", target: 3, rewardPoints: 50 },

  // Lifetime
  { id: "l1", title: "Première fois", description: "Complétez votre premier cours", icon: "🌟", type: "lifetime", target: 1, rewardPoints: 50 },
  { id: "l2", title: "Fidèle", description: "Complétez 50 cours", icon: "🏆", type: "lifetime", target: 50, rewardPoints: 200 },
  { id: "l3", title: "Centurion", description: "Complétez 100 cours", icon: "👑", type: "lifetime", target: 100, rewardPoints: 500 },
  { id: "l4", title: "Streak Master", description: "Maintenez un streak de 4 semaines", icon: "🔥", type: "lifetime", target: 4, rewardPoints: 100 },
  { id: "l5", title: "Touche-à-tout", description: "Essayez tous les types de cours", icon: "🌈", type: "lifetime", target: 6, rewardPoints: 150 },
];
