"use client"

import { useState, useCallback } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  ArrowRight,
  Heart,
  Flame,
  Sparkles,
  Baby,
  Activity,
  RotateCcw,
  Trophy,
  Clock,
  BarChart3,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { clsx } from "clsx"

/* ============================================================
   COURSE DATA
   ============================================================ */
type CourseKey = "mat" | "reformer" | "prenatal" | "senior" | "doux" | "intensif"

interface CourseInfo {
  name: string
  slug: string
  description: string
  level: string
  duration: string
  color: string
}

const courseData: Record<CourseKey, CourseInfo> = {
  mat: { name: "Pilates Mat", slug: "mat", description: "Renforcement postural au sol, accessible à tous", level: "Tous niveaux", duration: "60 min", color: "mp-ocean" },
  reformer: { name: "Pilates Reformer", slug: "reformer", description: "Travail en profondeur sur machine Reformer", level: "Tous niveaux", duration: "55 min", color: "mp-sage" },
  prenatal: { name: "Pilates Prénatal", slug: "prenatal", description: "Adapté à chaque trimestre de grossesse", level: "Tous niveaux", duration: "50 min", color: "mp-rose" },
  senior: { name: "Pilates Senior", slug: "pilates-senior", description: "Mobilité et équilibre en douceur", level: "Débutant", duration: "55 min", color: "mp-gold" },
  doux: { name: "Pilates Doux", slug: "doux", description: "Étirements et bien-être tout en douceur", level: "Tous niveaux", duration: "60 min", color: "mp-ocean" },
  intensif: { name: "Pilates Intensif", slug: "intensif", description: "Cardio et renforcement pour les sportifs", level: "Intermédiaire", duration: "60 min", color: "mp-sage" },
}

/* ============================================================
   QUIZ QUESTIONS & WEIGHTS
   ============================================================ */
interface QuizOption {
  label: string
  icon?: LucideIcon
  weights: Partial<Record<CourseKey, number>>
}

interface QuizStep {
  id: string
  question: string
  options: QuizOption[]
}

const steps: QuizStep[] = [
  {
    id: "goal",
    question: "Quel est votre objectif principal ?",
    options: [
      { label: "Soulager mes douleurs", icon: Heart, weights: { mat: 2, doux: 2, senior: 1 } },
      { label: "Me tonifier", icon: Flame, weights: { reformer: 2, intensif: 2, mat: 1 } },
      { label: "Me détendre", icon: Sparkles, weights: { doux: 2, mat: 1 } },
      { label: "Accompagner ma grossesse", icon: Baby, weights: { prenatal: 3 } },
      { label: "Rester actif/active", icon: Activity, weights: { senior: 2, doux: 1, mat: 1 } },
    ],
  },
  {
    id: "level",
    question: "Quel est votre niveau en Pilates ?",
    options: [
      { label: "Jamais essayé", weights: { mat: 1, doux: 1 } },
      { label: "Quelques cours", weights: { mat: 1, reformer: 1 } },
      { label: "Pratiquant régulier", weights: { reformer: 1, intensif: 1 } },
    ],
  },
  {
    id: "intensity",
    question: "Quelle intensité préférez-vous ?",
    options: [
      { label: "Douce et progressive", weights: { doux: 2, prenatal: 1, senior: 1 } },
      { label: "Modérée et équilibrée", weights: { mat: 2, reformer: 1 } },
      { label: "Intense et challengeante", weights: { intensif: 2, reformer: 1 } },
    ],
  },
]

/* ============================================================
   SCORING
   ============================================================ */
type Scores = Record<CourseKey, number>

function computeResults(answers: Partial<Record<string, number>>[]) {
  const scores: Scores = { mat: 0, reformer: 0, prenatal: 0, senior: 0, doux: 0, intensif: 0 }

  for (const weights of answers) {
    for (const [key, val] of Object.entries(weights)) {
      scores[key as CourseKey] += val as number
    }
  }

  const maxScore = Object.values(scores).reduce((a, b) => a + b, 0)
  const sorted = (Object.entries(scores) as [CourseKey, number][]).sort((a, b) => b[1] - a[1])
  const top = sorted[0]
  const runners = sorted.slice(1, 3)

  return {
    top: { key: top[0], score: top[1], percentage: maxScore > 0 ? Math.round((top[1] / maxScore) * 100) : 0, ...courseData[top[0]] },
    runners: runners.map((r) => ({
      key: r[0],
      score: r[1],
      percentage: maxScore > 0 ? Math.round((r[1] / maxScore) * 100) : 0,
      ...courseData[r[0]],
    })),
  }
}

/* ============================================================
   COLOR UTILS
   ============================================================ */
function colorClasses(color: string) {
  switch (color) {
    case "mp-ocean": return { bg: "bg-mp-ocean", bgLight: "bg-mp-ocean/10", text: "text-mp-ocean", border: "border-mp-ocean" }
    case "mp-sage": return { bg: "bg-mp-sage", bgLight: "bg-mp-sage/10", text: "text-mp-sage", border: "border-mp-sage" }
    case "mp-rose": return { bg: "bg-mp-rose", bgLight: "bg-mp-rose/10", text: "text-mp-rose", border: "border-mp-rose" }
    case "mp-gold": return { bg: "bg-mp-gold", bgLight: "bg-mp-gold/10", text: "text-mp-gold", border: "border-mp-gold" }
    default: return { bg: "bg-mp-ocean", bgLight: "bg-mp-ocean/10", text: "text-mp-ocean", border: "border-mp-ocean" }
  }
}

/* ============================================================
   COURSE QUIZ COMPONENT
   ============================================================ */
export function CourseQuiz() {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Partial<Record<CourseKey, number>>[]>([])
  const [direction, setDirection] = useState<"left" | "right">("right")
  const [animating, setAnimating] = useState(false)
  const [showResult, setShowResult] = useState(false)

  const totalSteps = steps.length
  const progress = ((currentStep + 1) / totalSteps) * 100

  const selectOption = useCallback(
    (weights: Partial<Record<CourseKey, number>>) => {
      if (animating) return
      setAnimating(true)
      setDirection("right")

      const newAnswers = [...answers]
      newAnswers[currentStep] = weights
      setAnswers(newAnswers)

      setTimeout(() => {
        if (currentStep < totalSteps - 1) {
          setCurrentStep((s) => s + 1)
        } else {
          setShowResult(true)
        }
        setAnimating(false)
      }, 300)
    },
    [animating, answers, currentStep, totalSteps]
  )

  const goBack = useCallback(() => {
    if (animating) return
    setAnimating(true)
    setDirection("left")
    setTimeout(() => {
      if (showResult) {
        setShowResult(false)
      } else {
        setCurrentStep((s) => Math.max(0, s - 1))
      }
      setAnimating(false)
    }, 250)
  }, [animating, showResult])

  const reset = useCallback(() => {
    setDirection("left")
    setAnimating(true)
    setTimeout(() => {
      setCurrentStep(0)
      setAnswers([])
      setShowResult(false)
      setAnimating(false)
    }, 250)
  }, [])

  /* ---------- RESULT SCREEN ---------- */
  if (showResult && answers.length === totalSteps) {
    const { top, runners } = computeResults(answers)
    const tc = colorClasses(top.color)

    return (
      <div
        className={clsx(
          "transition-all duration-500",
          animating ? "opacity-0 translate-x-8" : "opacity-100 translate-x-0"
        )}
        role="status"
        aria-live="polite"
      >
        {/* Top recommendation */}
        <div className="text-center mb-8">
          <div className={clsx("w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4", tc.bgLight)}>
            <Trophy className={clsx("w-8 h-8", tc.text)} aria-hidden="true" />
          </div>
          <p className="font-heading text-sm font-semibold text-mp-ocean uppercase tracking-[0.2em] mb-2">
            Votre cours idéal
          </p>
        </div>

        {/* Main card */}
        <div className={clsx("rounded-2xl border-2 p-6 sm:p-8 mb-6 transition-all", tc.border, tc.bgLight)}>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
            <h3 className={clsx("font-heading text-2xl sm:text-3xl font-bold", tc.text)}>
              {top.name}
            </h3>
            <span className={clsx("inline-flex items-center gap-1 font-heading text-sm font-bold px-3 py-1 rounded-full w-fit", tc.bg, "text-white")}>
              {top.percentage}% match
            </span>
          </div>
          <p className="font-body text-mp-text-light leading-relaxed mb-5">
            {top.description}
          </p>
          <div className="flex flex-wrap gap-4 text-sm text-mp-text-light mb-6">
            <span className="inline-flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4" aria-hidden="true" />
              {top.level}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-4 h-4" aria-hidden="true" />
              {top.duration}
            </span>
          </div>
          <Link
            href={`/planning?filter=${top.slug}`}
            className="mp-btn mp-btn-primary w-full sm:w-auto justify-center"
          >
            Réserver ce cours
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>

        {/* Runners-up */}
        {runners.length > 0 && (
          <>
            <p className="font-heading text-sm font-semibold text-mp-text-light uppercase tracking-[0.15em] mb-3">
              Aussi recommandés
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              {runners.map((r) => {
                const rc = colorClasses(r.color)
                return (
                  <Link
                    key={r.key}
                    href={`/planning?filter=${r.slug}`}
                    className={clsx(
                      "group rounded-xl border p-4 transition-all hover:-translate-y-0.5 hover:shadow-md",
                      "border-mp-sand-dark/30 bg-mp-white"
                    )}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className={clsx("w-2 h-8 rounded-full", rc.bg)} />
                      <div>
                        <h4 className="font-heading text-sm font-semibold text-mp-charcoal group-hover:text-mp-ocean transition-colors">
                          {r.name}
                        </h4>
                        <span className="text-xs text-mp-text-light">{r.percentage}% match</span>
                      </div>
                    </div>
                    <p className="text-xs text-mp-text-light leading-relaxed">
                      {r.description}
                    </p>
                  </Link>
                )
              })}
            </div>
          </>
        )}

        {/* Reset */}
        <div className="text-center">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 text-sm font-heading text-mp-text-light hover:text-mp-ocean transition-colors underline underline-offset-2"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            Refaire le quiz
          </button>
        </div>
      </div>
    )
  }

  /* ---------- QUIZ STEPS ---------- */
  const current = steps[currentStep]

  return (
    <div>
      {/* Progress bar */}
      <div className="flex items-center gap-3 mb-8">
        {currentStep > 0 && (
          <button
            onClick={goBack}
            className="p-2 rounded-full hover:bg-mp-sand transition-colors"
            aria-label="Question précédente"
          >
            <ArrowLeft className="w-4 h-4 text-mp-text-light" />
          </button>
        )}
        <div
          className="flex-1 h-2 bg-mp-sand rounded-full overflow-hidden"
          role="progressbar"
          aria-valuenow={currentStep + 1}
          aria-valuemin={1}
          aria-valuemax={totalSteps}
          aria-label={`Question ${currentStep + 1} sur ${totalSteps}`}
        >
          <div
            className="h-full bg-mp-ocean rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-xs font-heading text-mp-text-light min-w-[3rem] text-right">
          {currentStep + 1}/{totalSteps}
        </span>
      </div>

      {/* Question with animation */}
      <div
        className={clsx(
          "transition-all duration-300 ease-out",
          animating
            ? direction === "right"
              ? "opacity-0 -translate-x-6"
              : "opacity-0 translate-x-6"
            : "opacity-100 translate-x-0"
        )}
      >
        <h3 className="font-heading text-xl sm:text-2xl font-bold text-mp-charcoal mb-6 text-center">
          {current.question}
        </h3>

        {/* Options */}
        <div
          className={clsx(
            "grid gap-3 max-w-lg mx-auto",
            current.options.length > 3 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"
          )}
          role="group"
          aria-label={current.question}
        >
          {current.options.map((option) => {
            const Icon = option.icon
            return (
              <button
                key={option.label}
                onClick={() => selectOption(option.weights)}
                className={clsx(
                  "p-4 rounded-xl border-2 text-left font-heading text-sm font-medium transition-all cursor-pointer",
                  "border-mp-sand-dark/30 text-mp-charcoal hover:border-mp-ocean/40 hover:bg-mp-cream hover:shadow-sm",
                  "flex items-center gap-3"
                )}
              >
                {Icon && (
                  <span className="flex-shrink-0 w-10 h-10 rounded-xl bg-mp-ocean/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-mp-ocean" aria-hidden="true" />
                  </span>
                )}
                {option.label}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
