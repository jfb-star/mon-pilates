"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Trophy, Star, Lock, ChevronRight, Loader2, Sparkles } from "lucide-react"
import { clsx } from "clsx"

/* ============================================================
   TYPES
   ============================================================ */

interface LoyaltyData {
  totalPoints: number
  level: { name: string; minPoints: number; maxPoints: number; current: number }
  badges: {
    id: string
    name: string
    description: string
    icon: string
    unlocked: boolean
    progress: number
  }[]
  nextReward: { name: string; pointsNeeded: number } | null
}

/* ============================================================
   ANIMATED COUNTER
   ============================================================ */

function AnimatedPoints({ target }: { target: number }) {
  const [display, setDisplay] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const animated = useRef(false)

  useEffect(() => {
    if (animated.current) return
    animated.current = true

    const duration = 1200
    const start = performance.now()

    function tick(now: number) {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.round(eased * target))
      if (progress < 1) {
        requestAnimationFrame(tick)
      }
    }

    requestAnimationFrame(tick)
  }, [target])

  return (
    <span ref={ref} className="tabular-nums">
      {display}
    </span>
  )
}

/* ============================================================
   CONFETTI (lightweight, CSS-based)
   ============================================================ */

function Confetti({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onDone, 2500)
    return () => clearTimeout(timer)
  }, [onDone])

  const particles = Array.from({ length: 30 }, (_, i) => {
    const left = Math.random() * 100
    const delay = Math.random() * 0.5
    const hue = Math.random() * 360
    const size = 6 + Math.random() * 6
    return (
      <span
        key={i}
        className="absolute rounded-sm animate-confetti-fall pointer-events-none"
        style={{
          left: `${left}%`,
          top: "-10px",
          width: `${size}px`,
          height: `${size}px`,
          backgroundColor: `hsl(${hue}, 80%, 60%)`,
          animationDelay: `${delay}s`,
        }}
      />
    )
  })

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
      {particles}
    </div>
  )
}

/* ============================================================
   BADGE TOOLTIP
   ============================================================ */

function BadgeItem({
  badge,
}: {
  badge: LoyaltyData["badges"][number]
}) {
  const [showTooltip, setShowTooltip] = useState(false)

  return (
    <div
      className="relative"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onFocus={() => setShowTooltip(true)}
      onBlur={() => setShowTooltip(false)}
    >
      <button
        type="button"
        tabIndex={0}
        className={clsx(
          "flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all duration-200 w-full",
          badge.unlocked
            ? "bg-mp-cream hover:bg-mp-sand/60 cursor-default"
            : "bg-mp-sand/30 opacity-60 cursor-default"
        )}
        aria-label={`${badge.name}: ${badge.description}${badge.unlocked ? " (d\u00e9bloqu\u00e9)" : ` (${Math.round(badge.progress * 100)}%)`}`}
      >
        <span className={clsx("text-2xl", !badge.unlocked && "grayscale")}>
          {badge.icon}
        </span>
        <span
          className={clsx(
            "text-[10px] font-heading font-medium leading-tight text-center",
            badge.unlocked ? "text-mp-charcoal" : "text-mp-text-light"
          )}
        >
          {badge.name}
        </span>
        {!badge.unlocked && (
          <div className="w-full bg-mp-sand rounded-full h-1 mt-0.5">
            <div
              className="bg-mp-ocean/40 rounded-full h-1 transition-all"
              style={{ width: `${badge.progress * 100}%` }}
            />
          </div>
        )}
        {badge.unlocked && (
          <Star className="w-3 h-3 text-mp-gold absolute top-1.5 right-1.5" aria-hidden="true" />
        )}
      </button>

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-20 pointer-events-none">
          <div className="bg-mp-charcoal text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap font-body shadow-lg">
            <p className="font-heading font-semibold">{badge.name}</p>
            <p className="text-white/70 mt-0.5">{badge.description}</p>
            {!badge.unlocked && (
              <p className="text-mp-gold mt-0.5">
                {Math.round(badge.progress * 100)}% compl\u00e9t\u00e9
              </p>
            )}
          </div>
          <div className="w-2 h-2 bg-mp-charcoal rotate-45 mx-auto -mt-1" />
        </div>
      )}
    </div>
  )
}

/* ============================================================
   MAIN COMPONENT
   ============================================================ */

export function LoyaltySection() {
  const [data, setData] = useState<LoyaltyData | null>(null)
  const [loading, setLoading] = useState(true)
  const [showConfetti, setShowConfetti] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleConfettiDone = useCallback(() => setShowConfetti(false), [])

  useEffect(() => {
    async function fetchLoyalty() {
      try {
        const res = await fetch("/api/account/loyalty")
        if (res.ok) {
          const loyaltyData: LoyaltyData = await res.json()
          setData(loyaltyData)

          // Check for new badges via localStorage
          const storageKey = "mp-loyalty-badges"
          const storedRaw = localStorage.getItem(storageKey)
          const storedBadges: string[] = storedRaw ? JSON.parse(storedRaw) : []
          const currentUnlocked = loyaltyData.badges
            .filter((b) => b.unlocked)
            .map((b) => b.id)

          // If there are new badges that weren't stored before, show confetti
          const newBadges = currentUnlocked.filter(
            (id) => !storedBadges.includes(id)
          )
          if (newBadges.length > 0 && storedBadges.length > 0) {
            setShowConfetti(true)
          }

          // Update stored badges
          localStorage.setItem(storageKey, JSON.stringify(currentUnlocked))
        }
      } catch {
        // Silently fail — loyalty is non-critical
      } finally {
        setLoading(false)
      }
    }
    fetchLoyalty()
  }, [])

  if (loading) {
    return (
      <div className="mp-card !rounded-2xl p-6 hover:!transform-none">
        <div className="flex items-center justify-center py-6">
          <Loader2
            className="w-5 h-5 text-mp-ocean animate-spin"
            aria-hidden="true"
          />
        </div>
      </div>
    )
  }

  if (!data) return null

  const { totalPoints, level, badges, nextReward } = data
  const progressPct =
    level.maxPoints > level.minPoints
      ? Math.min(
          100,
          Math.round(
            ((totalPoints - level.minPoints) /
              (level.maxPoints - level.minPoints)) *
              100
          )
        )
      : 100

  const unlockedBadges = badges.filter((b) => b.unlocked)
  const lockedBadges = badges.filter((b) => !b.unlocked)

  // Find next badge to unlock (closest to completion)
  const nextBadge = lockedBadges.length > 0
    ? lockedBadges.reduce((best, b) =>
        b.progress > best.progress ? b : best
      )
    : null

  return (
    <div
      ref={containerRef}
      className="mp-card !rounded-2xl p-6 hover:!transform-none relative overflow-hidden"
    >
      {showConfetti && <Confetti onDone={handleConfettiDone} />}

      {/* Header */}
      <div className="flex items-center gap-2 mb-5">
        <Trophy className="w-5 h-5 text-mp-gold" aria-hidden="true" />
        <h2 className="font-heading text-lg font-bold text-mp-charcoal">
          Mon parcours
        </h2>
      </div>

      {/* Level + Points */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-mp-ocean/10 text-mp-ocean text-xs font-heading font-semibold">
            <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
            {level.name}
          </span>
        </div>
        <p className="font-heading text-2xl font-bold text-mp-charcoal">
          <AnimatedPoints target={totalPoints} />{" "}
          <span className="text-sm font-normal text-mp-text-light">points</span>
        </p>
      </div>

      {/* Progress bar */}
      <div className="mb-6">
        <div
          className="bg-mp-sand rounded-full h-3"
          role="progressbar"
          aria-valuenow={totalPoints}
          aria-valuemin={level.minPoints}
          aria-valuemax={level.maxPoints}
          aria-label={`Niveau ${level.name}: ${totalPoints} points sur ${level.maxPoints}`}
        >
          <div
            className="h-3 rounded-full transition-all duration-1000 ease-out"
            style={{
              width: `${progressPct}%`,
              background: "linear-gradient(90deg, var(--color-mp-ocean) 0%, var(--color-mp-sage) 100%)",
            }}
          />
        </div>
        <div className="flex justify-between mt-1.5">
          <span className="text-[10px] text-mp-text-light font-body">
            {level.minPoints} pts
          </span>
          <span className="text-[10px] text-mp-text-light font-body">
            {level.maxPoints < 10000 ? `${level.maxPoints} pts` : ""}
          </span>
        </div>
      </div>

      {/* Badges */}
      <div className="mb-5">
        <p className="text-xs font-heading font-semibold text-mp-text-light uppercase tracking-wider mb-3">
          Badges
        </p>
        <div className="grid grid-cols-5 sm:grid-cols-5 gap-2">
          {badges.map((badge) => (
            <BadgeItem key={badge.id} badge={badge} />
          ))}
        </div>
      </div>

      {/* Next milestone */}
      {nextBadge && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-mp-cream border border-mp-sand-dark/10 mb-3">
          <span className="text-lg grayscale opacity-60">{nextBadge.icon}</span>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-heading font-medium text-mp-charcoal">
              Prochain badge : {nextBadge.name}
            </p>
            <p className="text-[10px] text-mp-text-light font-body">
              {nextBadge.description} ({Math.round(nextBadge.progress * 100)}%)
            </p>
          </div>
          <ChevronRight
            className="w-4 h-4 text-mp-text-light flex-shrink-0"
            aria-hidden="true"
          />
        </div>
      )}

      {/* Next reward */}
      {nextReward && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-mp-gold/5 border border-mp-gold/15">
          <span className="text-lg">{"\u{1F381}"}</span>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-heading font-medium text-mp-charcoal">
              Prochaine r\u00e9compense : {nextReward.name}
            </p>
            <p className="text-[10px] text-mp-text-light font-body">
              Plus que {nextReward.pointsNeeded} points
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
