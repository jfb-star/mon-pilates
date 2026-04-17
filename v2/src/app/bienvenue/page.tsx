"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import {
  Heart,
  Flame,
  Sparkles,
  Baby,
  Activity,
  ArrowRight,
  Trophy,
  Clock,
  BarChart3,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

/* ============================================================
   COURSE DATA (same as CourseQuiz)
   ============================================================ */
type CourseKey = "mat" | "reformer" | "prenatal" | "senior" | "doux" | "intensif";

interface CourseInfo {
  name: string;
  slug: string;
  description: string;
  level: string;
  duration: string;
  color: string;
}

const courseData: Record<CourseKey, CourseInfo> = {
  mat: { name: "Pilates Mat", slug: "mat", description: "Renforcement postural au sol, accessible a tous", level: "Tous niveaux", duration: "60 min", color: "mp-ocean" },
  reformer: { name: "Pilates Reformer", slug: "reformer", description: "Travail en profondeur sur machine Reformer", level: "Tous niveaux", duration: "55 min", color: "mp-sage" },
  prenatal: { name: "Pilates Prenatal", slug: "prenatal", description: "Adapte a chaque trimestre de grossesse", level: "Tous niveaux", duration: "50 min", color: "mp-rose" },
  senior: { name: "Pilates Senior", slug: "pilates-senior", description: "Mobilite et equilibre en douceur", level: "Debutant", duration: "55 min", color: "mp-gold" },
  doux: { name: "Pilates Doux", slug: "doux", description: "Etirements et bien-etre tout en douceur", level: "Tous niveaux", duration: "60 min", color: "mp-ocean" },
  intensif: { name: "Pilates Intensif", slug: "intensif", description: "Cardio et renforcement pour les sportifs", level: "Intermediaire", duration: "60 min", color: "mp-sage" },
};

/* ============================================================
   EXPERIENCE WEIGHTS
   ============================================================ */
const experienceWeights: Record<string, Partial<Record<CourseKey, number>>> = {
  never: { mat: 1, doux: 1 },
  some: { mat: 1, reformer: 1 },
  regular: { reformer: 1, intensif: 1 },
};

/* ============================================================
   GOAL OPTIONS
   ============================================================ */
interface GoalOption {
  id: string;
  label: string;
  icon: LucideIcon;
  weights: Partial<Record<CourseKey, number>>;
}

const goalOptions: GoalOption[] = [
  { id: "pain", label: "Soulager des douleurs", icon: Heart, weights: { mat: 2, doux: 2, senior: 1 } },
  { id: "tone", label: "Me tonifier", icon: Flame, weights: { reformer: 2, intensif: 2, mat: 1 } },
  { id: "relax", label: "Me d\u00e9tendre", icon: Sparkles, weights: { doux: 2, mat: 1 } },
  { id: "pregnancy", label: "Accompagner ma grossesse", icon: Baby, weights: { prenatal: 3 } },
  { id: "fitness", label: "Rester en forme", icon: Activity, weights: { senior: 2, doux: 1, mat: 1 } },
];

/* ============================================================
   SCORING
   ============================================================ */
function computeResult(
  expWeights: Partial<Record<CourseKey, number>>,
  goalWeights: Partial<Record<CourseKey, number>>
) {
  const scores: Record<CourseKey, number> = { mat: 0, reformer: 0, prenatal: 0, senior: 0, doux: 0, intensif: 0 };

  for (const w of [expWeights, goalWeights]) {
    for (const [key, val] of Object.entries(w)) {
      scores[key as CourseKey] += val as number;
    }
  }

  const maxScore = Object.values(scores).reduce((a, b) => a + b, 0);
  const sorted = (Object.entries(scores) as [CourseKey, number][]).sort((a, b) => b[1] - a[1]);
  const top = sorted[0];

  return {
    key: top[0],
    percentage: maxScore > 0 ? Math.round((top[1] / maxScore) * 100) : 0,
    ...courseData[top[0]],
  };
}

/* ============================================================
   COLOR UTILS
   ============================================================ */
function colorClasses(color: string) {
  switch (color) {
    case "mp-ocean": return { bg: "bg-mp-ocean", bgLight: "bg-mp-ocean/10", text: "text-mp-ocean", border: "border-mp-ocean" };
    case "mp-sage": return { bg: "bg-mp-sage", bgLight: "bg-mp-sage/10", text: "text-mp-sage", border: "border-mp-sage" };
    case "mp-rose": return { bg: "bg-mp-rose", bgLight: "bg-mp-rose/10", text: "text-mp-rose", border: "border-mp-rose" };
    case "mp-gold": return { bg: "bg-mp-gold", bgLight: "bg-mp-gold/10", text: "text-mp-gold", border: "border-mp-gold" };
    default: return { bg: "bg-mp-ocean", bgLight: "bg-mp-ocean/10", text: "text-mp-ocean", border: "border-mp-ocean" };
  }
}

/* ============================================================
   EXPERIENCE OPTIONS
   ============================================================ */
interface ExperienceOption {
  id: string;
  label: string;
  emoji: string;
}

const experienceOptions: ExperienceOption[] = [
  { id: "never", label: "Jamais", emoji: "🌱" },
  { id: "some", label: "Un peu", emoji: "🌿" },
  { id: "regular", label: "R\u00e9guli\u00e8rement", emoji: "🌳" },
];

/* ============================================================
   MAIN COMPONENT
   ============================================================ */
export default function BienvenuePage() {
  const [step, setStep] = useState(1);
  const [experience, setExperience] = useState<string | null>(null);
  const [goal, setGoal] = useState<string | null>(null);
  const [animating, setAnimating] = useState(false);

  const goToStep = useCallback(
    (nextStep: number) => {
      if (animating) return;
      setAnimating(true);
      setTimeout(() => {
        setStep(nextStep);
        setAnimating(false);
      }, 300);
    },
    [animating]
  );

  const handleExperience = useCallback(
    (id: string) => {
      setExperience(id);
      goToStep(2);
    },
    [goToStep]
  );

  const handleGoal = useCallback(
    (id: string) => {
      setGoal(id);
      goToStep(3);
    },
    [goToStep]
  );

  // Compute recommendation for step 3
  const recommendation =
    experience && goal
      ? computeResult(
          experienceWeights[experience] || {},
          goalOptions.find((g) => g.id === goal)?.weights || {}
        )
      : null;

  const tc = recommendation ? colorClasses(recommendation.color) : null;

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-mp-cream py-20">
      <div className="mp-container max-w-lg">
        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-10">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${
                s === step
                  ? "bg-mp-ocean scale-125"
                  : s < step
                    ? "bg-mp-ocean/40"
                    : "bg-mp-sand-dark/30"
              }`}
            />
          ))}
        </div>

        <div
          className={`transition-all duration-300 ease-out ${
            animating ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
          }`}
        >
          {/* -------- STEP 1 -------- */}
          {step === 1 && (
            <div className="mp-card p-8 sm:p-10 border border-mp-sand-dark/30 text-center">
              <div className="w-16 h-16 rounded-full bg-mp-ocean/10 flex items-center justify-center mx-auto mb-6">
                <span className="font-heading text-2xl" aria-hidden="true">
                  ✨
                </span>
              </div>
              <h1 className="font-heading text-2xl sm:text-3xl font-bold text-mp-charcoal mb-3">
                Bienvenue chez Mon Pilates&nbsp;!
              </h1>
              <p className="font-body text-mp-text-light leading-relaxed mb-8">
                Parlons un peu de vous pour personnaliser votre exp&eacute;rience.
              </p>

              <p className="font-heading text-sm font-semibold text-mp-charcoal mb-5">
                Avez-vous d&eacute;j&agrave; pratiqu&eacute; le Pilates&nbsp;?
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {experienceOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => handleExperience(opt.id)}
                    className="p-5 rounded-xl border-2 border-mp-sand-dark/30 text-center font-heading text-sm font-medium text-mp-charcoal transition-all cursor-pointer hover:border-mp-ocean/40 hover:bg-mp-white hover:shadow-sm"
                  >
                    <span className="block text-2xl mb-2" aria-hidden="true">
                      {opt.emoji}
                    </span>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* -------- STEP 2 -------- */}
          {step === 2 && (
            <div className="mp-card p-8 sm:p-10 border border-mp-sand-dark/30 text-center">
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-mp-charcoal mb-3">
                Quel est votre objectif&nbsp;?
              </h2>
              <p className="font-body text-mp-text-light leading-relaxed mb-8">
                Choisissez ce qui vous correspond le mieux.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {goalOptions.map((opt) => {
                  const Icon = opt.icon;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleGoal(opt.id)}
                      className="p-4 rounded-xl border-2 border-mp-sand-dark/30 text-left font-heading text-sm font-medium text-mp-charcoal transition-all cursor-pointer hover:border-mp-ocean/40 hover:bg-mp-white hover:shadow-sm flex items-center gap-3"
                    >
                      <span className="flex-shrink-0 w-10 h-10 rounded-xl bg-mp-ocean/10 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-mp-ocean" aria-hidden="true" />
                      </span>
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* -------- STEP 3 -------- */}
          {step === 3 && recommendation && tc && (
            <div className="mp-card p-8 sm:p-10 border border-mp-sand-dark/30 text-center relative overflow-hidden">
              {/* CSS-only confetti / sparkle decoration */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
                {[...Array(12)].map((_, i) => (
                  <span
                    key={i}
                    className="absolute w-2 h-2 rounded-full opacity-0"
                    style={{
                      left: `${8 + (i * 7) % 84}%`,
                      top: `${5 + (i * 11) % 60}%`,
                      backgroundColor: ["#6b9fad", "#a3c9d3", "#b5a48b", "#d4a0a0", "#e8c875"][i % 5],
                      animation: `confetti-fall 2.5s ease-out ${i * 0.15}s forwards`,
                    }}
                  />
                ))}
              </div>

              <style jsx>{`
                @keyframes confetti-fall {
                  0% {
                    opacity: 0;
                    transform: translateY(-30px) rotate(0deg) scale(0);
                  }
                  20% {
                    opacity: 1;
                    transform: translateY(0) rotate(90deg) scale(1);
                  }
                  100% {
                    opacity: 0;
                    transform: translateY(40px) rotate(360deg) scale(0.5);
                  }
                }
              `}</style>

              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${tc.bgLight}`}>
                <Trophy className={`w-8 h-8 ${tc.text}`} aria-hidden="true" />
              </div>

              <p className="font-heading text-sm font-semibold text-mp-ocean uppercase tracking-[0.2em] mb-2">
                R&eacute;servez votre premier cours
              </p>

              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-mp-charcoal mb-2">
                Votre cours id&eacute;al
              </h2>

              <div className={`inline-flex items-center gap-2 rounded-2xl border-2 p-6 sm:p-8 mt-4 mb-6 ${tc.border} ${tc.bgLight}`}>
                <div className="text-center">
                  <h3 className={`font-heading text-xl sm:text-2xl font-bold mb-1 ${tc.text}`}>
                    {recommendation.name}
                  </h3>
                  <span className={`inline-flex items-center gap-1 font-heading text-xs font-bold px-3 py-1 rounded-full ${tc.bg} text-white`}>
                    {recommendation.percentage}% match
                  </span>
                  <p className="font-body text-sm text-mp-text-light leading-relaxed mt-3">
                    {recommendation.description}
                  </p>
                  <div className="flex justify-center gap-4 text-xs text-mp-text-light mt-3">
                    <span className="inline-flex items-center gap-1">
                      <BarChart3 className="w-3.5 h-3.5" aria-hidden="true" />
                      {recommendation.level}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                      {recommendation.duration}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Link
                  href={`/planning?filter=${recommendation.slug}`}
                  className="mp-btn mp-btn-primary w-full justify-center"
                >
                  R&eacute;server mon cours d&apos;essai &mdash; 10&euro;
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>

                <Link
                  href="/cours"
                  className="mp-btn mp-btn-secondary w-full justify-center"
                >
                  Explorer tous les cours
                </Link>

                <Link
                  href="/compte"
                  className="block text-center font-body text-sm text-mp-text-light hover:text-mp-ocean transition-colors underline underline-offset-2"
                >
                  Je verrai plus tard
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
