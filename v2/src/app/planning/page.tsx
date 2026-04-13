"use client"

import { useState, useMemo, useEffect, useCallback } from "react"
import Image from "next/image"
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  User,
  Users,
  X,
  Filter,
} from "lucide-react"
import { clsx } from "clsx"
import { startOfWeek, addWeeks, addDays, format, isToday, isSameWeek } from "date-fns"
import { fr } from "date-fns/locale"
import {
  weeklySessions,
  courseTypeColors,
  courseTypeLabels,
  dayNames,
} from "@/lib/mock-data"

const courseTypes = ["mat", "reformer", "prenatal", "senior", "doux"] as const
const instructorNames = ["Marie Lefevre", "Sophie Martin"]
const levels = ["Tous niveaux", "Debutant", "Intermediaire", "Avance"]

export default function PlanningPage() {
  const [weekOffset, setWeekOffset] = useState(0)
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [selectedInstructor, setSelectedInstructor] = useState("")
  const [selectedLevel, setSelectedLevel] = useState("")
  const [selectedSession, setSelectedSession] = useState<(typeof weeklySessions)[0] | null>(null)
  const [filtersOpen, setFiltersOpen] = useState(false)

  useEffect(() => {
    if (window.innerWidth >= 1024) setFiltersOpen(true)
  }, [])

  const weekStart = startOfWeek(addWeeks(new Date(), weekOffset), {
    weekStartsOn: 1,
  })
  const isCurrentWeek = isSameWeek(weekStart, new Date(), {
    weekStartsOn: 1,
  })

  const filteredSessions = useMemo(() => {
    return weeklySessions.filter((s) => {
      if (selectedTypes.length > 0 && !selectedTypes.includes(s.courseType))
        return false
      if (selectedInstructor && s.instructor !== selectedInstructor)
        return false
      if (selectedLevel && s.level !== selectedLevel) return false
      return true
    })
  }, [selectedTypes, selectedInstructor, selectedLevel])

  function getSessionsForDay(dayOffset: number) {
    return filteredSessions
      .filter((s) => s.dayOffset === dayOffset)
      .sort((a, b) => a.time.localeCompare(b.time))
  }

  function toggleType(type: string) {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    )
  }

  function clearFilters() {
    setSelectedTypes([])
    setSelectedInstructor("")
    setSelectedLevel("")
  }

  const hasFilters =
    selectedTypes.length > 0 ||
    selectedInstructor !== "" ||
    selectedLevel !== ""

  const [bookingLoading, setBookingLoading] = useState(false)

  const closeModal = useCallback(() => setSelectedSession(null), [])

  useEffect(() => {
    if (!selectedSession) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal()
    }
    document.addEventListener("keydown", handleKey)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", handleKey)
      document.body.style.overflow = ""
    }
  }, [selectedSession, closeModal])

  return (
    <>
      {/* Hero */}
      <section className="relative h-[40vh] min-h-[320px] flex items-center overflow-hidden">
        <Image
          src="/images/reformer-soleil.jpg"
          alt="Reformer Pilates au soleil"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-mp-charcoal/80 via-mp-charcoal/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-mp-charcoal/30 to-transparent" />
        <div className="mp-container relative z-10">
          <p className="mp-label !text-mp-ocean-light mb-4">R&eacute;servation</p>
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
            Planning des cours
          </h1>
          <p className="font-body text-lg text-white/80 max-w-lg italic">
            Consultez les disponibilit&eacute;s et r&eacute;servez votre place en un clic.
          </p>
        </div>
      </section>

      {/* Week nav + filters + grid */}
      <div className="mp-section bg-mp-cream">
        <div className="mp-container">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            {/* Week navigation */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setWeekOffset((w) => w - 1)}
                className="p-2.5 rounded-full border border-mp-sand hover:bg-mp-sand transition-colors"
                aria-label="Semaine pr\u00e9c\u00e9dente"
              >
                <ChevronLeft className="w-5 h-5 text-mp-charcoal" />
              </button>
              <span className="font-heading font-bold text-mp-charcoal min-w-[220px] text-center text-lg">
                {format(weekStart, "d MMM", { locale: fr })} &ndash;{" "}
                {format(addDays(weekStart, 5), "d MMM yyyy", { locale: fr })}
              </span>
              <button
                onClick={() => setWeekOffset((w) => w + 1)}
                className="p-2.5 rounded-full border border-mp-sand hover:bg-mp-sand transition-colors"
                aria-label="Semaine suivante"
              >
                <ChevronRight className="w-5 h-5 text-mp-charcoal" />
              </button>
              {!isCurrentWeek && (
                <button
                  onClick={() => setWeekOffset(0)}
                  className="text-sm font-heading font-semibold text-mp-ocean hover:underline ml-3"
                >
                  Aujourd&apos;hui
                </button>
              )}
            </div>

            {/* Filter toggle */}
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className={clsx(
                "mp-btn text-sm",
                hasFilters ? "mp-btn-primary" : "mp-btn-secondary"
              )}
            >
              <Filter className="w-4 h-4" />
              Filtrer
              {hasFilters && (
                <span className="ml-1 bg-white/30 px-1.5 rounded-full text-xs">
                  {selectedTypes.length +
                    (selectedInstructor ? 1 : 0) +
                    (selectedLevel ? 1 : 0)}
                </span>
              )}
            </button>
          </div>

          {/* Filters panel */}
          {filtersOpen && (
            <div className="mp-card p-6 mb-8 border border-mp-sand">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-heading text-lg font-bold text-mp-charcoal">
                  Filtres
                </h3>
                {hasFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-sm font-heading text-mp-ocean hover:underline"
                  >
                    Tout effacer
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {/* Course types */}
                <div>
                  <p className="text-sm font-heading font-semibold text-mp-charcoal mb-3">
                    Type de cours
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {courseTypes.map((type) => {
                      const colors = courseTypeColors[type]
                      const active = selectedTypes.includes(type)
                      return (
                        <button
                          key={type}
                          onClick={() => toggleType(type)}
                          className={clsx(
                            "px-3 py-1.5 rounded-full text-xs font-heading font-semibold transition-all",
                            active
                              ? `${colors?.bg} ${colors?.text} ring-2 ${colors?.border}`
                              : "bg-mp-sand text-mp-text-light hover:bg-mp-sand-dark/30"
                          )}
                        >
                          {courseTypeLabels[type]}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Instructor */}
                <div>
                  <p className="text-sm font-heading font-semibold text-mp-charcoal mb-3">
                    Instructrice
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {instructorNames.map((name) => (
                      <button
                        key={name}
                        onClick={() =>
                          setSelectedInstructor(
                            selectedInstructor === name ? "" : name
                          )
                        }
                        className={clsx(
                          "px-3 py-1.5 rounded-full text-xs font-heading font-semibold transition-all",
                          selectedInstructor === name
                            ? "bg-mp-ocean/10 text-mp-ocean ring-2 ring-mp-ocean"
                            : "bg-mp-sand text-mp-text-light hover:bg-mp-sand-dark/30"
                        )}
                      >
                        {name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Level */}
                <div>
                  <p className="text-sm font-heading font-semibold text-mp-charcoal mb-3">
                    Niveau
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {levels.map((level) => (
                      <button
                        key={level}
                        onClick={() =>
                          setSelectedLevel(selectedLevel === level ? "" : level)
                        }
                        className={clsx(
                          "px-3 py-1.5 rounded-full text-xs font-heading font-semibold transition-all",
                          selectedLevel === level
                            ? "bg-mp-ocean/10 text-mp-ocean ring-2 ring-mp-ocean"
                            : "bg-mp-sand text-mp-text-light hover:bg-mp-sand-dark/30"
                        )}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Week grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
            {[0, 1, 2, 3, 4, 5].map((dayOffset) => {
              const date = addDays(weekStart, dayOffset)
              const sessions = getSessionsForDay(dayOffset)
              const today = isToday(date)

              return (
                <div key={dayOffset}>
                  <div
                    className={clsx(
                      "text-center py-3 rounded-xl font-heading font-semibold text-sm mb-3",
                      today
                        ? "bg-mp-ocean text-white shadow-lg shadow-mp-ocean/20"
                        : "bg-white text-mp-charcoal border border-mp-sand"
                    )}
                  >
                    <p>{dayNames[dayOffset]}</p>
                    <p className={clsx("text-xs mt-0.5", today ? "text-white/70" : "text-mp-text-muted")}>
                      {format(date, "d MMM", { locale: fr })}
                    </p>
                  </div>

                  <div className="space-y-2">
                    {sessions.length === 0 && (
                      <p className="text-xs text-mp-text-muted text-center py-8 italic">
                        Aucun cours
                      </p>
                    )}
                    {sessions.map((session) => {
                      const colors = courseTypeColors[session.courseType]
                      const full = session.spotsRemaining === 0

                      return (
                        <button
                          key={session.id}
                          onClick={() => setSelectedSession(session)}
                          className={clsx(
                            "w-full text-left p-3 rounded-xl bg-white border transition-all duration-300",
                            `border-l-4 ${colors?.border}`,
                            full
                              ? "opacity-50 cursor-not-allowed"
                              : "hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
                          )}
                        >
                          <p className="font-heading text-sm font-bold text-mp-charcoal">
                            {session.time}
                          </p>
                          <p className={`text-xs font-heading font-semibold ${colors?.text} mt-0.5`}>
                            {session.courseName}
                          </p>
                          <p className="text-xs text-mp-text-muted mt-1">
                            {session.instructor}
                          </p>
                          <div className="flex items-center justify-between mt-2 pt-2 border-t border-mp-sand/60">
                            <span className="text-xs text-mp-text-muted flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {session.duration}
                            </span>
                            <span
                              className={clsx(
                                "text-xs font-heading font-bold",
                                full ? "text-mp-rose" : "text-mp-sage"
                              )}
                            >
                              {full
                                ? "Complet"
                                : `${session.spotsRemaining} places`}
                            </span>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Session modal */}
      {selectedSession && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-mp-charcoal/50 backdrop-blur-sm p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="session-modal-title"
          onClick={closeModal}
        >
          <div
            className="mp-card p-8 max-w-md w-full relative shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedSession(null)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-mp-sand transition-colors"
              aria-label="Fermer"
            >
              <X className="w-5 h-5 text-mp-charcoal" />
            </button>

            <div className={`inline-block px-3 py-1 rounded-full text-xs font-heading font-semibold mb-4 ${courseTypeColors[selectedSession.courseType]?.bg} ${courseTypeColors[selectedSession.courseType]?.text}`}>
              {courseTypeLabels[selectedSession.courseType]}
            </div>

            <h2 id="session-modal-title" className="font-heading text-2xl font-bold text-mp-charcoal mb-2">
              {selectedSession.courseName}
            </h2>
            <p className="font-body text-sm text-mp-text-light leading-relaxed mb-6">
              {selectedSession.description}
            </p>

            <div className="space-y-3 text-sm font-body text-mp-text-light mb-8 p-4 bg-mp-cream rounded-xl">
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-mp-ocean" />
                <span>{selectedSession.time} &mdash; {selectedSession.duration}</span>
              </div>
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-mp-ocean" />
                <span>{selectedSession.instructor}</span>
              </div>
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4 text-mp-ocean" />
                <span>
                  {selectedSession.spotsRemaining}/{selectedSession.spotsTotal}{" "}
                  places disponibles
                </span>
              </div>
            </div>

            {selectedSession.spotsRemaining > 0 ? (
              <button
                disabled={bookingLoading}
                onClick={async () => {
                  setBookingLoading(true)
                  try {
                    const res = await fetch("/api/checkout", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        mode: "booking",
                        items: [
                          {
                            name: `${selectedSession.courseName} — ${selectedSession.time} (${selectedSession.duration})`,
                            price: 18,
                            quantity: 1,
                          },
                        ],
                        metadata: {
                          sessionId: selectedSession.id,
                          courseName: selectedSession.courseName,
                          instructor: selectedSession.instructor,
                          time: selectedSession.time,
                        },
                      }),
                    })
                    const data = await res.json()
                    if (data.url) {
                      window.location.href = data.url
                    }
                  } catch (err) {
                    console.error("Checkout error:", err)
                  } finally {
                    setBookingLoading(false)
                  }
                }}
                className="mp-btn mp-btn-primary w-full justify-center"
              >
                {bookingLoading ? "Redirection\u2026" : <>R&eacute;server cette s&eacute;ance &mdash; 18&euro;</>}
              </button>
            ) : (
              <div className="text-center py-3 rounded-xl bg-mp-rose/10 border border-mp-rose/30">
                <p className="text-mp-rose font-heading font-semibold">
                  Cette s&eacute;ance est compl&egrave;te
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
