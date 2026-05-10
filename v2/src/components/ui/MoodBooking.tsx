"use client"

import { useState, useCallback } from "react"
import Link from "next/link"
import { ArrowRight, RotateCcw, Clock } from "lucide-react"
import { clsx } from "clsx"

/* ============================================================
   MOOD DATA
   ============================================================ */
interface MoodOption {
  id: string
  emoji: string
  label: string
  color: string
  colorBg: string
  colorBorder: string
  colorText: string
  courses: { slug: string; name: string; description: string }[]
  reason: string
}

const moods: MoodOption[] = [
  {
    id: "stressed",
    emoji: "\u{1F624}",
    label: "Stress\u00e9(e)",
    color: "mp-rose",
    colorBg: "bg-mp-rose/10",
    colorBorder: "border-mp-rose",
    colorText: "text-mp-rose",
    courses: [
      { slug: "doux-seniors", name: "Pilates Doux – Seniors", description: "\u00c9tirements et relaxation profonde" },
      { slug: "tous-niveaux", name: "Pilates Tous Niveaux", description: "Renforcement postural apaisant" },
    ],
    reason: "Un cours doux pour rel\u00e2cher les tensions et retrouver le calme",
  },
  {
    id: "tired",
    emoji: "\u{1F634}",
    label: "Fatigu\u00e9(e)",
    color: "mp-sage",
    colorBg: "bg-mp-sage/10",
    colorBorder: "border-mp-sage",
    colorText: "text-mp-sage",
    courses: [
      { slug: "doux-seniors", name: "Pilates Doux – Seniors", description: "Mouvements lents et r\u00e9g\u00e9n\u00e9rants" },
      { slug: "machine", name: "Pilates Machine", description: "Petit groupe sur machine, charges adapt\u00e9es" },
    ],
    reason: "Des mouvements doux pour retrouver l'\u00e9nergie sans forcer",
  },
  {
    id: "energetic",
    emoji: "\u26a1",
    label: "\u00c9nergique",
    color: "mp-gold",
    colorBg: "bg-mp-gold/10",
    colorBorder: "border-mp-gold",
    colorText: "text-mp-gold",
    courses: [
      { slug: "avance", name: "Pilates Avancé", description: "Rythme soutenu pour pratiquants confirmés" },
      { slug: "machine", name: "Pilates Machine", description: "Travail en profondeur sur machine" },
    ],
    reason: "Canalisez votre \u00e9nergie dans un workout intense et structur\u00e9",
  },
  {
    id: "sore",
    emoji: "\u{1F915}",
    label: "Courbatur\u00e9(e)",
    color: "mp-ocean",
    colorBg: "bg-mp-ocean/10",
    colorBorder: "border-mp-ocean",
    colorText: "text-mp-ocean",
    courses: [
      { slug: "doux-seniors", name: "Pilates Doux – Seniors", description: "\u00c9tirements cibl\u00e9s et mobilit\u00e9" },
      { slug: "tous-niveaux", name: "Pilates Tous Niveaux", description: "Travail postural tout en douceur" },
    ],
    reason: "\u00c9tirements et mobilit\u00e9 pour soulager les douleurs musculaires",
  },
  {
    id: "happy",
    emoji: "\u{1F60A}",
    label: "En forme",
    color: "mp-sage",
    colorBg: "bg-mp-sage/10",
    colorBorder: "border-mp-sage",
    colorText: "text-mp-sage",
    courses: [
      { slug: "machine", name: "Pilates Machine", description: "Sculptez votre silhouette" },
      { slug: "avance", name: "Pilates Avancé", description: "Repoussez vos limites" },
    ],
    reason: "Profitez de votre bonne forme pour progresser et vous d\u00e9passer !",
  },
]

/* ============================================================
   COMPONENT
   ============================================================ */
export function MoodBooking() {
  const [selected, setSelected] = useState<MoodOption | null>(null)
  const [animating, setAnimating] = useState(false)

  const selectMood = useCallback((mood: MoodOption) => {
    if (animating) return
    setAnimating(true)
    setTimeout(() => {
      setSelected(mood)
      setAnimating(false)
    }, 300)
  }, [animating])

  const reset = useCallback(() => {
    setAnimating(true)
    setTimeout(() => {
      setSelected(null)
      setAnimating(false)
    }, 300)
  }, [])

  /* ---------- RESULT ---------- */
  if (selected) {
    return (
      <div
        className={clsx(
          "transition-all duration-500",
          animating ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
        )}
        role="status"
        aria-live="polite"
      >
        {/* Selected mood header */}
        <div className="text-center mb-6">
          <span className="text-5xl mb-3 block" aria-hidden="true">
            {selected.emoji}
          </span>
          <p className={clsx("font-heading text-lg font-bold", selected.colorText)}>
            {selected.label}
          </p>
        </div>

        {/* Recommendation reason */}
        <div className={clsx("rounded-2xl p-5 mb-6 text-center", selected.colorBg)}>
          <p className="font-body text-mp-text leading-relaxed">
            {selected.reason}
          </p>
        </div>

        {/* Course cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {selected.courses.map((course) => (
            <div
              key={course.slug}
              className={clsx(
                "rounded-xl border-2 p-5 transition-all hover:shadow-md hover:-translate-y-0.5",
                "border-mp-sand-dark/30 bg-mp-white"
              )}
            >
              <h4 className="font-heading text-base font-semibold text-mp-charcoal mb-1">
                {course.name}
              </h4>
              <p className="font-body text-sm text-mp-text-light mb-3">
                {course.description}
              </p>
              <div className="flex items-center gap-1.5 text-xs text-mp-text-muted mb-4">
                <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Prochain cr\u00e9neau sur le planning</span>
              </div>
              <Link
                href={`/planning?filter=${course.slug}`}
                className="mp-btn mp-btn-primary text-sm w-full justify-center !py-2.5"
              >
                R\u00e9server
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
            </div>
          ))}
        </div>

        {/* Reset */}
        <div className="text-center">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 text-sm font-heading text-mp-text-light hover:text-mp-ocean transition-colors underline underline-offset-2 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            Autre humeur ?
          </button>
        </div>
      </div>
    )
  }

  /* ---------- MOOD SELECTION ---------- */
  return (
    <div
      className={clsx(
        "transition-all duration-300",
        animating ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
      )}
    >
      <div
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4"
        role="group"
        aria-label="Choisissez votre humeur"
      >
        {moods.map((mood) => (
          <button
            key={mood.id}
            onClick={() => selectMood(mood)}
            className={clsx(
              "group flex flex-col items-center gap-3 p-5 sm:p-6 rounded-2xl border-2 transition-all cursor-pointer",
              "border-mp-sand-dark/20 bg-mp-white",
              "hover:shadow-lg hover:-translate-y-1",
              `hover:${mood.colorBorder}`
            )}
            aria-label={`Je suis ${mood.label}`}
          >
            <span
              className="text-4xl sm:text-5xl transition-transform duration-300 group-hover:scale-110"
              aria-hidden="true"
            >
              {mood.emoji}
            </span>
            <span className="font-heading text-sm font-semibold text-mp-charcoal group-hover:text-mp-ocean transition-colors">
              {mood.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
