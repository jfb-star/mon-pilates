"use client"

import { useState, useMemo, useEffect, useCallback, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { useSession } from "next-auth/react"
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  User,
  Users,
  X,
  Filter,
  ShieldCheck,
  Flame,
  Check,
  CalendarPlus,
  Repeat,
  CalendarX,
  AlertCircle,
  Loader2,
  Sparkles,
  Phone,
  Mail,
} from "lucide-react"
import { BookingStepper } from "@/components/BookingStepper"
import { clsx } from "clsx"
import { useFocusTrap } from "@/hooks/useFocusTrap"
import { useIsFirstTimer } from "@/hooks/useIsFirstTimer"
import { startOfWeek, addWeeks, addDays, format, isToday, isSameWeek } from "date-fns"
import { fr } from "date-fns/locale"
import {
  courseTypeColors,
  courseTypeLabels,
  dayNames,
} from "@/lib/mock-data"
import { SmartRecommendations } from "@/components/ui/SmartRecommendations"
import Skeleton from "@/components/ui/Skeleton"
import { SITE_URL } from "@/lib/env"

const courseTypes = ["tous-niveaux", "doux-seniors", "avance", "maternite", "machine"] as const
const instructorNames = ["Violette"]
const levels = ["Tous niveaux", "Débutant", "Intermédiaire", "Avancé"]

/** One-line descriptions per course type — alignés Bsport */
const courseTypeDescriptions: Record<string, string> = {
  "tous-niveaux": "Pilates Tous Niveaux — séance complète au tapis, ouverte à tous",
  "doux-seniors": "Pilates Doux – Seniors — mouvements en douceur, idéal reprise",
  "avance": "Pilates Avancé — rythme soutenu, pratiquants confirmés",
  "maternite": "Pilates Maternité — adapté pré et post-natal",
  "machine": "Pilates Machine — petit groupe sur Reformer (4 max)",
}

/** Instructor avatar colors based on name */
const instructorAvatarColors: Record<string, string> = {
  "Violette": "bg-mp-ocean",
}

/** Get initials from a full name */
function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

/** Instructor avatar component */
function InstructorAvatar({ name, size = "sm" }: { name: string; size?: "sm" | "md" }) {
  const initials = getInitials(name)
  const bgColor = instructorAvatarColors[name] ?? "bg-mp-ocean-light"
  return (
    <span
      className={clsx(
        "inline-flex items-center justify-center rounded-full text-white font-heading font-bold flex-shrink-0",
        bgColor,
        size === "sm" ? "w-6 h-6 text-[10px]" : "w-9 h-9 text-xs"
      )}
      aria-hidden="true"
    >
      {initials}
    </span>
  )
}

/** Generate an .ics calendar file blob URL for a session */
function generateIcsBlob(session: SessionData, dateStr: string): string {
  const [hours, minutes] = session.time.split(":").map(Number)
  const date = new Date(dateStr)
  date.setHours(hours ?? 0, minutes ?? 0, 0, 0)
  const end = new Date(date.getTime() + session.durationMinutes * 60_000)
  const pad = (n: number) => String(n).padStart(2, "0")
  const fmt = (d: Date) =>
    `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Mon Pilates//FR",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VTIMEZONE",
    "TZID:Europe/Paris",
    "BEGIN:DAYLIGHT",
    "TZOFFSETFROM:+0100",
    "TZOFFSETTO:+0200",
    "TZNAME:CEST",
    "DTSTART:19700329T020000",
    "RRULE:FREQ=YEARLY;BYDAY=-1SU;BYMONTH=3",
    "END:DAYLIGHT",
    "BEGIN:STANDARD",
    "TZOFFSETFROM:+0200",
    "TZOFFSETTO:+0100",
    "TZNAME:CET",
    "DTSTART:19701025T030000",
    "RRULE:FREQ=YEARLY;BYDAY=-1SU;BYMONTH=10",
    "END:STANDARD",
    "END:VTIMEZONE",
    "BEGIN:VEVENT",
    `DTSTART;TZID=Europe/Paris:${fmt(date)}`,
    `DTEND;TZID=Europe/Paris:${fmt(end)}`,
    `SUMMARY:${session.courseName} — Mon Pilates`,
    `DESCRIPTION:Cours avec ${session.instructor}\\n${courseTypeDescriptions[session.courseType] ?? ""}\\nMon Pilates - Larmor-Plage`,
    "LOCATION:Mon Pilates\\, 14 Boulevard des Dunes\\, 56260 Larmor-Plage",
    "ORGANIZER;CN=Mon Pilates:mailto:contact@mon-pilates.bzh",
    `UID:${session.id}@mon-pilates.bzh`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n")
  return URL.createObjectURL(new Blob([ics], { type: "text/calendar" }))
}

/** Generate a Google Calendar "add event" URL for a session */
function generateGoogleCalendarUrl(session: SessionData, dateStr: string): string {
  const [hours, minutes] = session.time.split(":").map(Number)
  const date = new Date(dateStr)
  date.setHours(hours ?? 0, minutes ?? 0, 0, 0)
  const end = new Date(date.getTime() + session.durationMinutes * 60_000)
  const pad = (n: number) => String(n).padStart(2, "0")
  const fmt = (d: Date) =>
    `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `${session.courseName} — Mon Pilates`,
    dates: `${fmt(date)}/${fmt(end)}`,
    details: `Cours avec ${session.instructor}\n${courseTypeDescriptions[session.courseType] ?? ""}\nMon Pilates - Larmor-Plage`,
    location: "Mon Pilates, 14 Boulevard des Dunes, 56260 Larmor-Plage",
  })
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

/* ----------------------------------------------------------
   JSON-LD: map day offsets (0=Mon..5=Sat) to Schema.org days
   ---------------------------------------------------------- */
const schemaDays: Record<number, string> = {
  0: "https://schema.org/Monday",
  1: "https://schema.org/Tuesday",
  2: "https://schema.org/Wednesday",
  3: "https://schema.org/Thursday",
  4: "https://schema.org/Friday",
  5: "https://schema.org/Saturday",
}

/**
 * Build structured-data events grouped by unique session.
 * Each recurring weekly class gets its own SportsEvent with an eventSchedule.
 */
function buildPlanningJsonLd(weeklySessions: SessionData[]) {
  const locationJsonLd = {
    "@type": "Place",
    name: "Mon Pilates",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Larmor-Plage",
      addressLocality: "Larmor-Plage",
      postalCode: "56260",
      addressCountry: "FR",
    },
  }

  const organizerJsonLd = {
    "@type": "Organization",
    name: "Mon Pilates",
    url: SITE_URL,
  }

  const events = weeklySessions.map((session) => ({
    "@type": "SportsEvent",
    name: session.courseName,
    description: session.description,
    sport: "Pilates",
    location: locationJsonLd,
    organizer: organizerJsonLd,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    maximumAttendeeCapacity: session.spotsTotal,
    performer: {
      "@type": "Person",
      name: session.instructor,
    },
    eventSchedule: {
      "@type": "Schedule",
      repeatFrequency: "P1W",
      byDay: schemaDays[session.dayOffset],
      startTime: session.time,
      duration: `PT${session.durationMinutes}M`,
    },
    offers: {
      "@type": "Offer",
      price: "20",
      priceCurrency: "EUR",
      url: `${SITE_URL}/planning`,
      availability:
        session.spotsRemaining > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/SoldOut",
    },
  }))

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Planning des cours — Mon Pilates",
    description:
      "Planning hebdomadaire des cours de Pilates à Larmor-Plage : tapis (doux, classique, avancé), cours privés sur appareil, pré & post-natal.",
    numberOfItems: events.length,
    itemListElement: events.map((event, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: event,
    })),
  }
}

interface SessionData {
  id: string
  scheduleId: string
  courseType: string
  courseName: string
  instructor: string
  time: string
  endTime?: string
  duration: string
  durationMinutes: number
  level: string
  spotsTotal: number
  spotsRemaining: number
  dayOffset: number
  description: string
  date?: string
}

/**
 * Build a safe `/connexion?returnTo=...` URL for the current page
 * (including an optional #sessionId hash). The returnTo value is a
 * *relative* same-origin URL, validated on the /connexion side too.
 */
function buildLoginReturnUrl(sessionId?: string): string {
  if (typeof window === "undefined") return "/connexion?returnTo=%2Fplanning"
  const { pathname, search } = window.location
  const hash = sessionId ? `#${sessionId}` : ""
  const target = `${pathname}${search}${hash}`
  const safe = target.length > 512 || !target.startsWith("/") ? "/planning" : target
  return `/connexion?returnTo=${encodeURIComponent(safe)}`
}

export default function PlanningPage() {
  const { data: session } = useSession()
  const [weekOffset, setWeekOffset] = useState(0)
  const [sessions, setSessions] = useState<SessionData[]>([])
  const [sessionsLoading, setSessionsLoading] = useState(true)
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [selectedInstructor, setSelectedInstructor] = useState("")
  const [selectedLevel, setSelectedLevel] = useState("")
  const [selectedSession, setSelectedSession] = useState<SessionData | null>(null)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [mobileDay, setMobileDay] = useState(() => {
    const day = new Date().getDay()
    const offset = day === 0 ? 5 : day - 1
    return Math.min(offset, 5)
  })
  const [changedSessionIds, setChangedSessionIds] = useState<Set<string>>(new Set())

  const weekStart = startOfWeek(addWeeks(new Date(), weekOffset), {
    weekStartsOn: 1,
  })
  const isCurrentWeek = isSameWeek(weekStart, new Date(), {
    weekStartsOn: 1,
  })

  // Fetch sessions from API when week changes
  useEffect(() => {
    setSessionsLoading(true)
    const weekStartStr = format(weekStart, "yyyy-MM-dd")
    fetch(`/api/sessions?weekStart=${weekStartStr}`)
      .then((res) => res.json())
      .then((data) => {
        setSessions(data.sessions ?? [])
      })
      .catch(() => {
        setSessions([])
      })
      .finally(() => setSessionsLoading(false))
  }, [weekOffset]) // eslint-disable-line react-hooks/exhaustive-deps

  // Lightweight availability polling — updates spot counts every 30s
  const weekStartStr = format(weekStart, "yyyy-MM-dd")
  useEffect(() => {
    if (!sessions.length) return

    const poll = async () => {
      // Skip polling when tab is hidden
      if (document.visibilityState !== "visible") return
      try {
        const res = await fetch(`/api/sessions/availability?weekStart=${weekStartStr}`)
        const data = await res.json()
        const changed = new Set<string>()

        setSessions(prev => prev.map(s => {
          const avail = data.availability?.[s.id]
          if (avail) {
            const newRemaining = avail.max - avail.current
            if (newRemaining !== s.spotsRemaining) {
              changed.add(s.id)
              return { ...s, spotsTotal: avail.max, spotsRemaining: newRemaining }
            }
          }
          return s
        }))

        if (changed.size > 0) {
          setChangedSessionIds(changed)
          // Clear animation class after 500ms
          setTimeout(() => setChangedSessionIds(new Set()), 500)
        }
      } catch { /* silent — polling is best-effort */ }
    }

    const interval = setInterval(poll, 30_000)
    return () => clearInterval(interval)
  }, [sessions.length, weekStartStr]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (window.innerWidth >= 1024) setFiltersOpen(true)
  }, [])

  // Keyboard navigation for week switching
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      if (e.key === "ArrowLeft") setWeekOffset((w) => w - 1)
      if (e.key === "ArrowRight") setWeekOffset((w) => w + 1)
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [])

  // Auto-set mobile day to today when returning to current week
  useEffect(() => {
    if (isCurrentWeek) {
      const day = new Date().getDay()
      const offset = day === 0 ? 5 : day - 1
      setMobileDay(Math.min(offset, 5))
    } else {
      setMobileDay(0)
    }
  }, [isCurrentWeek])

  const filteredSessions = useMemo(() => {
    return sessions.filter((s) => {
      if (selectedTypes.length > 0 && !selectedTypes.includes(s.courseType))
        return false
      if (selectedInstructor && s.instructor !== selectedInstructor)
        return false
      if (selectedLevel && s.level !== selectedLevel) return false
      return true
    })
  }, [sessions, selectedTypes, selectedInstructor, selectedLevel])

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
  const [bookingError, setBookingError] = useState("")
  // When a booking API returns 401, we surface a contextual auth prompt
  // (instead of just an inline "Connectez-vous pour réserver." message).
  // "anon" = no session cookie; "stale" = had a session but it expired.
  const [authPrompt, setAuthPrompt] = useState<null | "anon" | "stale">(null)
  const [isTrial, setIsTrial] = useState(false)
  const isFirstTimer = useIsFirstTimer()
  const showTrialOptions = isFirstTimer !== false
  useEffect(() => {
    if (isFirstTimer === false && isTrial) setIsTrial(false)
  }, [isFirstTimer, isTrial])
  const [isRecurring, setIsRecurring] = useState(false)
  const [recurringResult, setRecurringResult] = useState<{ sessionsBooked: number; sessionsWaitlisted: number } | null>(null)
  const [activeCard, setActiveCard] = useState<{ remaining: number; total: number } | null>(null)
  const [bookingSuccess, setBookingSuccess] = useState<{ message: string; waitlist: boolean } | null>(null)

  // Check if user has an active course card. Skip when not signed in to
  // avoid an authenticated-only 401 in the console for visitors.
  const isLoggedIn = Boolean(session?.user)
  useEffect(() => {
    if (!isLoggedIn) return
    fetch("/api/account")
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (data?.activeCard) setActiveCard(data.activeCard)
      })
      .catch(() => {})
  }, [isLoggedIn])

  // Remember the trigger so we can return focus to it after closing the modal.
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null)
  // Visible countdown state for the success modal auto-close.
  const [countdownSec, setCountdownSec] = useState<number | null>(null)
  // Brief order-recap overlay between fetch and Stripe redirect.
  const [stripeRedirecting, setStripeRedirecting] = useState(false)

  const handleSelectSession = useCallback(
    (session: SessionData, e?: React.MouseEvent<HTMLButtonElement>) => {
      if (e) lastTriggerRef.current = e.currentTarget
      setSelectedSession(session)
    },
    []
  )

  const closeModal = useCallback(() => {
    setSelectedSession(null)
    setBookingSuccess(null)
    setBookingError("")
    setAuthPrompt(null)
    setIsTrial(false)
    setIsRecurring(false)
    setRecurringResult(null)
    setCountdownSec(null)
    setStripeRedirecting(false)
    requestAnimationFrame(() => {
      lastTriggerRef.current?.focus()
    })
  }, [])

  /**
   * When a booking endpoint returns 401, flag the appropriate prompt.
   * Returns true if the response was unauthorised and the caller should
   * stop further processing.
   */
  const handleAuthError = useCallback(
    (status: number): boolean => {
      if (status !== 401) return false
      setAuthPrompt(session?.user ? "stale" : "anon")
      setBookingError("")
      return true
    },
    [session]
  )

  // Explicit wait-list join for full sessions (uses /bookings/on-site — it
  // already returns status "WAITLIST" when the class is full).
  const handleWaitlistJoin = useCallback(async () => {
    if (!selectedSession) return
    setBookingLoading(true)
    setBookingError("")
    try {
      const res = await fetch("/api/bookings/on-site", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: selectedSession.id }),
      })
      if (handleAuthError(res.status)) return
      const data = await res.json()
      if (res.ok) {
        setBookingSuccess({
          message:
            "Vous \u00eates sur la liste d'attente ! Nous vous notifierons par email si une place se lib\u00e8re.",
          waitlist: true,
        })
      } else {
        setBookingError(data.error || "Erreur lors de l'inscription \u00e0 la liste d'attente.")
      }
    } catch {
      setBookingError("Erreur de connexion.")
    } finally {
      setBookingLoading(false)
    }
  }, [selectedSession, handleAuthError])

  // After a single booking succeeds, optionally subscribe to recurring
  const handleRecurringAfterBooking = useCallback(async (scheduleId: string) => {
    if (!isRecurring || !scheduleId) return
    try {
      const res = await fetch("/api/bookings/recurring", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scheduleId }),
      })
      if (res.ok) {
        const data = await res.json()
        setRecurringResult({ sessionsBooked: data.sessionsBooked, sessionsWaitlisted: data.sessionsWaitlisted })
      }
    } catch {
      // Silently fail — the single booking already succeeded
    }
  }, [isRecurring])

  // Visible 10s countdown after booking success (user can cancel to stay).
  useEffect(() => {
    if (!bookingSuccess) return
    setCountdownSec(10)
  }, [bookingSuccess])

  useEffect(() => {
    if (countdownSec === null) return
    if (countdownSec <= 0) {
      closeModal()
      return
    }
    const id = setInterval(() => {
      setCountdownSec((s) => (s === null ? null : s - 1))
    }, 1000)
    return () => clearInterval(id)
  }, [countdownSec, closeModal])
  const modalRef = useFocusTrap(!!selectedSession)
  const closeBtnRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!selectedSession) return
    // Auto-focus close button when modal opens
    requestAnimationFrame(() => closeBtnRef.current?.focus())
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

  const planningJsonLd = buildPlanningJsonLd(sessions)

  // a11y: announce selection/booking state to screen readers
  const liveRegionMessage = (() => {
    if (bookingSuccess) {
      return bookingSuccess.waitlist
        ? "Ajouté à la liste d'attente."
        : "Réservation confirmée."
    }
    if (selectedSession) {
      const dayName = dayNames[selectedSession.dayOffset] ?? ""
      return `${selectedSession.courseName} — ${dayName} ${selectedSession.time} sélectionnée`
    }
    return ""
  })()

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(planningJsonLd) }}
      />

      {/* a11y live region for selection + booking feedback */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {liveRegionMessage}
      </div>

      {/* Hero */}
      <section className="relative h-[40vh] min-h-[320px] flex items-center overflow-hidden">
        <Image
          src="/images/studio-reformer-ocean.webp"
          alt="Reformer Pilates au soleil"
          fill
          className="object-cover"
          priority
          fetchPriority="high"
          sizes="100vw"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAoHBwgHBgoICAgLCgoLDhgQDg0NDh0VFhEYIx8lJCIfIiEmKzcvJik0KSEiMEExNDk7Pj4+JS5ESUM8SDc9Pjv/2wBDAQoLCw4NDhwQEBw7KCIoOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozv/wAARCAAIABADASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABgUH/8QAIhAAAgIBAwQDAAAAAAAAAAAAAQIDBAAFBhESITFBE2Fx/8QAFQEBAQAAAAAAAAAAAAAAAAAAAwT/xAAaEQACAwEBAAAAAAAAAAAAAAABAgADESEx/9oADAMBAAIRAxEAPwCbq26tLpbMtKzVkuKjdBFLTmSYj1xrr2t7a6lJJDT0iy8bFVZ5nVSR9ADIe67U0WrSiWOhDVcKFLRscZplXMiGhYVSZ//9k="
        />
        <div className="absolute inset-0 bg-gradient-to-r from-mp-charcoal/80 via-mp-charcoal/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-mp-charcoal/30 to-transparent" />
        <div className="mp-container relative z-10">
          <p className="font-heading text-sm font-semibold text-mp-ocean-light uppercase tracking-[0.2em] mb-4">Réservation</p>
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
            Planning des cours
          </h1>
          <p className="font-body text-lg text-white/80 max-w-lg italic">
            Consultez les disponibilit&eacute;s et r&eacute;servez votre place en un clic.
          </p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-5 text-xs text-white/60">
            <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" aria-hidden="true" />5 max par cours</span>
            <span className="hidden sm:inline text-white/30">&middot;</span>
            <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />Annulation jusqu&apos;&agrave; 12h avant</span>
          </div>
        </div>
      </section>

      {/* First visit banner */}
      {showTrialOptions && (
        <div className="bg-mp-ocean/5 border-b border-mp-ocean/10">
          <div className="mp-container py-3 flex items-center justify-center gap-3 text-sm">
            <span className="font-body text-mp-text-light">Première visite ?</span>
            <a href="/premiere-visite" className="font-heading font-semibold text-mp-ocean hover:text-mp-ocean-dark transition-colors underline underline-offset-2">
              Consultez notre guide
            </a>
            <span className="text-mp-text-light">·</span>
            <span className="font-body text-mp-text-light">Cours d&apos;essai à <strong className="text-mp-ocean">10&euro;</strong></span>
          </div>
        </div>
      )}

      {/* Week nav + filters + grid */}
      <div className="mp-section bg-mp-cream">
        <div className="mp-container">
          {/* Smart Recommendations */}
          <SmartRecommendations />
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            {/* Week navigation */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setWeekOffset((w) => w - 1)}
                className="p-2.5 rounded-full border border-mp-sand hover:bg-mp-sand transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Semaine pr\u00e9c\u00e9dente"
              >
                <ChevronLeft className="w-5 h-5 text-mp-charcoal" aria-hidden="true" />
              </button>
              <span className="font-heading font-bold text-mp-charcoal min-w-[160px] sm:min-w-[220px] text-center text-base sm:text-lg">
                {format(weekStart, "d MMM", { locale: fr })} &ndash;{" "}
                {format(addDays(weekStart, 5), "d MMM yyyy", { locale: fr })}
              </span>
              <button
                onClick={() => setWeekOffset((w) => w + 1)}
                className="p-2.5 rounded-full border border-mp-sand hover:bg-mp-sand transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Semaine suivante"
              >
                <ChevronRight className="w-5 h-5 text-mp-charcoal" aria-hidden="true" />
              </button>
              {!isCurrentWeek && (
                <button
                  onClick={() => setWeekOffset(0)}
                  className="text-sm font-heading font-semibold text-mp-ocean hover:underline ml-3"
                  aria-label="Revenir à aujourd'hui"
                >
                  Aujourd&apos;hui
                </button>
              )}
              {/* Live indicator */}
              <span className="flex items-center gap-1.5 text-xs text-mp-sage ml-3" aria-label="Disponibilit\u00e9s mises \u00e0 jour en direct">
                <span className="w-2 h-2 rounded-full bg-mp-sage animate-pulse" />
                En direct
              </span>
            </div>

            {/* Filter toggle */}
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className={clsx(
                "mp-btn text-sm",
                hasFilters ? "mp-btn-primary" : "mp-btn-secondary"
              )}
            >
              <Filter className="w-4 h-4" aria-hidden="true" />
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
                <h2 className="font-heading text-lg font-bold text-mp-charcoal">
                  Filtres
                </h2>
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
                          aria-pressed={active}
                          onClick={() => toggleType(type)}
                          className={clsx(
                            "px-4 py-2.5 sm:px-3 sm:py-1.5 rounded-full text-sm sm:text-xs font-heading font-semibold transition-all min-h-[40px] sm:min-h-0",
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
                        aria-pressed={selectedInstructor === name}
                        onClick={() =>
                          setSelectedInstructor(
                            selectedInstructor === name ? "" : name
                          )
                        }
                        className={clsx(
                          "px-4 py-2.5 sm:px-3 sm:py-1.5 rounded-full text-sm sm:text-xs font-heading font-semibold transition-all min-h-[40px] sm:min-h-0",
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
                        aria-pressed={selectedLevel === level}
                        onClick={() =>
                          setSelectedLevel(selectedLevel === level ? "" : level)
                        }
                        className={clsx(
                          "px-4 py-2.5 sm:px-3 sm:py-1.5 rounded-full text-sm sm:text-xs font-heading font-semibold transition-all min-h-[40px] sm:min-h-0",
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

          {/* Results count when filtering */}
          {hasFilters && filteredSessions.length > 0 && (
            <p className="text-sm font-body text-mp-text-light mb-4" aria-live="polite" role="status">
              {filteredSessions.length} séance{filteredSessions.length > 1 ? "s" : ""} trouvée{filteredSessions.length > 1 ? "s" : ""}
            </p>
          )}

          {/* Friendly global empty state when filters return nothing */}
          {hasFilters && filteredSessions.length === 0 && !sessionsLoading && (
            <div
              className="mp-card p-10 sm:p-12 text-center border border-mp-sand-dark/20 mb-6"
              role="status"
              aria-live="polite"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-mp-ocean/10 mb-5">
                <CalendarX className="w-8 h-8 text-mp-ocean" aria-hidden="true" />
              </div>
              <h2 className="font-heading text-xl sm:text-2xl font-bold text-mp-charcoal mb-2">
                Aucune séance ne correspond
              </h2>
              <p className="font-body text-sm text-mp-text-light leading-relaxed max-w-md mx-auto mb-6">
                Essayez d&apos;effacer vos filtres ou de consulter la semaine suivante —
                de nouveaux cours sont ajoutés régulièrement.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={clearFilters}
                  className="mp-btn mp-btn-primary text-sm"
                >
                  Effacer les filtres
                </button>
                <button
                  onClick={() => setWeekOffset((w) => w + 1)}
                  className="mp-btn mp-btn-secondary text-sm"
                >
                  Semaine suivante
                  <ChevronRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          )}

          {/* Initial loading skeletons — remplace "Aucun cours" pendant le 1er fetch */}
          {sessionsLoading && sessions.length === 0 && (
            <div
              role="status"
              aria-label="Chargement des séances"
              className="mb-4"
            >
              {/* Mobile : 6 skeletons empilés */}
              <div className="sm:hidden grid grid-cols-1 gap-3">
                {Array.from({ length: 6 }, (_, i) => (
                  <Skeleton key={i} className="h-24 w-full rounded-xl" />
                ))}
              </div>
              {/* Desktop : 6 colonnes, 3 skeletons chacune */}
              <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-6 gap-4">
                {Array.from({ length: 6 }, (_, day) => (
                  <div key={day} className="space-y-2">
                    <Skeleton className="h-16 w-full rounded-xl" />
                    <Skeleton className="h-24 w-full rounded-xl" />
                    <Skeleton className="h-24 w-full rounded-xl" />
                    <Skeleton className="h-24 w-full rounded-xl" />
                  </div>
                ))}
              </div>
              <span className="sr-only">Chargement du planning en cours…</span>
            </div>
          )}

          {/* Mobile day selector — wrapped in a relative container with a
              right-edge gradient that fades to background colour when there's
              more content to scroll. The gradient is purely visual; the day
              tabs themselves remain accessible. */}
          <div className={clsx("sm:hidden relative mb-4", sessionsLoading && sessions.length === 0 ? "hidden" : "block")}>
            <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-mp-cream to-transparent z-10" />
          <div className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-1 pr-2" role="tablist" aria-label="Jours de la semaine">
            {[0, 1, 2, 3, 4, 5].map((dayOffset) => {
              const date = addDays(weekStart, dayOffset)
              const today = isToday(date)
              const active = mobileDay === dayOffset
              const dayCount = getSessionsForDay(dayOffset).length
              return (
                <button
                  key={dayOffset}
                  role="tab"
                  aria-selected={active}
                  aria-controls="mobile-day-tabpanel"
                  onClick={() => setMobileDay(dayOffset)}
                  className={clsx(
                    "flex-shrink-0 flex flex-col items-center px-4 py-2.5 rounded-xl font-heading text-xs font-semibold transition-all",
                    active
                      ? today
                        ? "bg-mp-ocean text-white shadow-md shadow-mp-ocean/20"
                        : "bg-mp-ocean/10 text-mp-ocean ring-2 ring-mp-ocean"
                      : today
                        ? "bg-mp-ocean/10 text-mp-ocean"
                        : "bg-white text-mp-charcoal border border-mp-sand"
                  )}
                >
                  <span>{(dayNames[dayOffset] ?? "").slice(0, 3)}</span>
                  <span className={clsx("text-[11px] mt-0.5", active ? (today ? "text-white/95" : "text-mp-ocean") : "text-mp-text-muted")}>
                    {format(date, "d MMM", { locale: fr })}
                  </span>
                  {dayCount > 0 && (
                    <span className={clsx("w-1.5 h-1.5 rounded-full mt-1", active ? (today ? "bg-white/60" : "bg-mp-ocean/40") : "bg-mp-sage/50")} />
                  )}
                </button>
              )
            })}
          </div>
          </div>

          {/* Mobile single-day view */}
          <div className={clsx("sm:hidden space-y-2", sessionsLoading && sessions.length === 0 && "hidden")} role="tabpanel" id="mobile-day-tabpanel" aria-label={dayNames[mobileDay]}>
            {(() => {
              const sessions = getSessionsForDay(mobileDay)
              if (sessions.length === 0) {
                return (
                  <div className="text-center py-12">
                    <p className="text-sm text-mp-text-muted italic font-body">
                      Aucun cours ce jour
                    </p>
                    {hasFilters && (
                      <button
                        onClick={clearFilters}
                        className="mt-3 text-sm font-heading font-medium text-mp-ocean hover:underline"
                      >
                        Effacer les filtres
                      </button>
                    )}
                  </div>
                )
              }
              return sessions.map((session) => {
                const colors = courseTypeColors[session.courseType as keyof typeof courseTypeColors]
                const full = session.spotsRemaining === 0
                const fillRate = (session.spotsTotal - session.spotsRemaining) / session.spotsTotal
                const isPopular = fillRate >= 0.7 && session.spotsRemaining > 2
                const isUrgent = session.spotsRemaining >= 1 && session.spotsRemaining <= 2
                return (
                  <button
                    key={session.id}
                    onClick={(e) => handleSelectSession(session, e)}
                    aria-label={full ? `${session.time} ${session.courseName} — complet` : undefined}
                    className={clsx(
                      "w-full text-left p-4 rounded-xl bg-white border transition-all duration-300",
                      `border-l-4 ${colors?.border}`,
                      full
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:shadow-md active:scale-[0.98] cursor-pointer"
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-heading text-base font-bold text-mp-charcoal">
                          {session.time}
                        </p>
                        <p className={`text-sm font-heading font-semibold ${colors?.text} mt-0.5`}>
                          {session.courseName}
                        </p>
                        <p className="text-[11px] text-mp-text-muted italic mt-0.5">
                          {courseTypeDescriptions[session.courseType] ?? ""}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        {isPopular && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 text-[10px] font-heading font-bold">
                            <Flame className="w-3 h-3" aria-hidden="true" />
                            Populaire
                          </span>
                        )}
                        {full ? (
                          <span className={clsx("text-xs font-heading font-bold px-2 py-1 rounded-full bg-mp-rose/10 text-mp-rose", changedSessionIds.has(session.id) && "animate-availability-change")}>
                            Complet
                          </span>
                        ) : isUrgent ? (
                          <span className={clsx("inline-flex items-center gap-1.5 text-xs font-heading font-bold px-2 py-1 rounded-full bg-red-50 text-red-600", changedSessionIds.has(session.id) && "animate-availability-change")}>
                            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                            Plus que {session.spotsRemaining} place{session.spotsRemaining > 1 ? "s" : ""} !
                          </span>
                        ) : (
                          <span className={clsx("text-xs font-heading font-bold px-2 py-1 rounded-full bg-mp-sage/10 text-mp-sage", changedSessionIds.has(session.id) && "animate-availability-change")}>
                            {session.spotsRemaining} places
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 mt-2 text-xs text-mp-text-muted">
                      <span className="flex items-center gap-1.5">
                        <InstructorAvatar name={session.instructor} />
                        {session.instructor}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" aria-hidden="true" />
                        {session.duration}
                      </span>
                    </div>
                  </button>
                )
              })
            })()}
          </div>

          {/* Desktop/tablet week grid */}
          <div className={clsx("sm:grid sm:grid-cols-2 lg:grid-cols-6 gap-4", sessionsLoading && sessions.length === 0 ? "hidden" : "hidden sm:grid")}>
            {[0, 1, 2, 3, 4, 5].map((dayOffset) => {
              const date = addDays(weekStart, dayOffset)
              const sessions = getSessionsForDay(dayOffset)
              const today = isToday(date)

              return (
                <div key={dayOffset}>
                  <div
                    className={clsx(
                      "text-center py-3 rounded-xl font-heading font-semibold text-sm mb-3 relative",
                      today
                        ? "bg-mp-ocean text-white shadow-lg shadow-mp-ocean/20"
                        : "bg-white text-mp-charcoal border border-mp-sand"
                    )}
                  >
                    {today && (
                      <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-mp-sage text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                        Aujourd&apos;hui
                      </span>
                    )}
                    <p>{dayNames[dayOffset]}</p>
                    <p className={clsx("text-xs mt-0.5", today ? "text-white/95" : "text-mp-text-muted")}>
                      {format(date, "d MMM", { locale: fr })}
                    </p>
                  </div>

                  <div className="space-y-2">
                    {sessions.length === 0 && (
                      <div className="text-center py-8">
                        <p className="text-xs text-mp-text-muted italic">
                          Aucun cours
                        </p>
                        {hasFilters && (
                          <button
                            onClick={clearFilters}
                            className="mt-2 text-xs font-heading font-medium text-mp-ocean hover:underline"
                          >
                            Effacer les filtres
                          </button>
                        )}
                      </div>
                    )}
                    {sessions.map((session) => {
                      const colors = courseTypeColors[session.courseType as keyof typeof courseTypeColors]
                      const full = session.spotsRemaining === 0
                      const fillRate = (session.spotsTotal - session.spotsRemaining) / session.spotsTotal
                      const isPopular = fillRate >= 0.7 && session.spotsRemaining > 2
                      const isUrgent = session.spotsRemaining >= 1 && session.spotsRemaining <= 2

                      return (
                        <button
                          key={session.id}
                          onClick={(e) => handleSelectSession(session, e)}
                          aria-label={full ? `${session.time} ${session.courseName} — complet` : undefined}
                          title={courseTypeDescriptions[session.courseType] ?? ""}
                          className={clsx(
                            "group w-full text-left p-3 rounded-xl bg-white border transition-all duration-300 relative",
                            `border-l-4 ${colors?.border}`,
                            full
                              ? "opacity-50 cursor-not-allowed"
                              : "hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
                          )}
                        >
                          {/* Popular badge */}
                          {isPopular && (
                            <span className="absolute -top-2 right-2 inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-600 text-[9px] font-heading font-bold shadow-sm border border-amber-200/50">
                              <Flame className="w-2.5 h-2.5" aria-hidden="true" />
                              Populaire
                            </span>
                          )}
                          <p className="font-heading text-sm font-bold text-mp-charcoal">
                            {session.time}
                          </p>
                          <p className={`text-xs font-heading font-semibold ${colors?.text} mt-0.5`}>
                            {session.courseName}
                          </p>
                          {/* Hover micro-description */}
                          <p className="text-[10px] text-mp-text-muted italic mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 leading-tight">
                            {courseTypeDescriptions[session.courseType] ?? ""}
                          </p>
                          <div className="flex items-center gap-1.5 text-xs text-mp-text-muted mt-1">
                            <InstructorAvatar name={session.instructor} />
                            <span className="truncate">{session.instructor}</span>
                          </div>
                          <div className="flex items-center justify-between mt-2 pt-2 border-t border-mp-sand/60">
                            <span className="text-xs text-mp-text-muted flex items-center gap-1">
                              <Clock className="w-3 h-3" aria-hidden="true" />
                              {session.duration}
                            </span>
                            {full ? (
                              <span className={clsx("text-xs font-heading font-bold text-mp-rose", changedSessionIds.has(session.id) && "animate-availability-change")}>
                                Complet
                              </span>
                            ) : isUrgent ? (
                              <span className={clsx("inline-flex items-center gap-1 text-[11px] font-heading font-bold text-red-600", changedSessionIds.has(session.id) && "animate-availability-change")}>
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                Plus que {session.spotsRemaining} !
                              </span>
                            ) : (
                              <span className={clsx("text-xs font-heading font-bold text-mp-sage", changedSessionIds.has(session.id) && "animate-availability-change")}>
                                {session.spotsRemaining} places
                              </span>
                            )}
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

      {/* Cours privés sur appareils — hors planning collectif */}
      <section
        aria-labelledby="planning-private-title"
        className="bg-mp-sand/40 border-t border-mp-sand-dark/40"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="flex items-start gap-4 mb-6">
            <span
              className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-mp-sage/10 shrink-0"
              aria-hidden="true"
            >
              <Sparkles className="w-6 h-6 text-mp-sage" />
            </span>
            <div>
              <h2
                id="planning-private-title"
                className="font-heading text-2xl sm:text-3xl text-mp-charcoal mb-2"
              >
                Cours privés sur appareils
              </h2>
              <p className="font-body text-mp-text-light text-sm sm:text-base max-w-2xl">
                Séance individuelle (55 min) sur Reformer Cadillac, en tête-à-tête avec
                Violette. Idéal pour débuter, pour une rééducation ou pour progresser plus
                rapidement avec un accompagnement 100&nbsp;% personnalisé.
              </p>
              <p className="font-body text-mp-text-light text-sm sm:text-base mt-3 max-w-2xl">
                <strong className="text-mp-charcoal">Sur réservation</strong> les après-midis
                en semaine et le samedi midi. Le créneau exact est confirmé après échange,
                pour s'adapter à vos contraintes et aux vôtres.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            <a
              href="tel:+33699183216"
              className="mp-btn mp-btn-primary inline-flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4" aria-hidden="true" />
              06 99 18 32 16
            </a>
            <a
              href="mailto:contact@mon-pilates.bzh?subject=Demande%20de%20cours%20priv%C3%A9%20sur%20appareils"
              className="mp-btn mp-btn-outline inline-flex items-center justify-center gap-2"
            >
              <Mail className="w-4 h-4" aria-hidden="true" />
              Demander un créneau par email
            </a>
          </div>

          <p className="mt-6 text-xs text-mp-text-muted font-body">
            Tarif privé&nbsp;: voir la page{" "}
            <Link href="/tarifs" className="underline hover:text-mp-ocean">
              tarifs
            </Link>
            .
          </p>
        </div>
      </section>

      {/* Session modal — mobile-first scroll strategy:
          - On mobile (<sm), the OUTER overlay scrolls (page-style scroll).
            The card has min-h-screen and no max-height, so its content
            grows freely and you can scroll all the way to the payment CTAs.
          - On desktop (≥sm), the INNER card scrolls within a centered modal
            (max-h-[90vh]) — classic dialog pattern.
          We deliberately avoid the `mp-card` utility here because its global
          `overflow: hidden` rule defeats the Tailwind `overflow-y-auto`
          utility on iOS — that's the source of the "frozen modal" bug. */}
      {selectedSession && (
        <div
          // block on mobile so the inner card can grow taller than the
          // viewport and the dialog itself scrolls naturally; flex+centered
          // on ≥sm for the classic centered modal pattern.
          className="fixed inset-0 z-50 block sm:flex sm:items-center sm:justify-center bg-mp-charcoal/50 backdrop-blur-sm p-0 sm:p-4 overflow-y-auto sm:overflow-hidden overscroll-contain"
          role="dialog"
          aria-modal="true"
          aria-labelledby="session-modal-title"
          onClick={closeModal}
        >
          <div
            ref={modalRef}
            // No min-height on mobile — let the card size to its content so
            // the outer dialog can compute a proper scrollHeight and scroll.
            className="bg-white relative w-full sm:max-w-md sm:max-h-[90vh] sm:overflow-y-auto rounded-none sm:rounded-2xl shadow-2xl sm:mx-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sticky header with the close button. We avoid `position:fixed`
                here because the parent dialog uses `backdrop-filter`, which
                creates a containing block for fixed descendants — meaning a
                `position: fixed` close button would scroll WITH the content
                instead of staying at the viewport. `sticky` inside the
                scrolling card is the reliable cross-browser pattern. */}
            <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm flex items-center justify-end px-2 py-2 border-b border-mp-sand/40">
              <button
                ref={closeBtnRef}
                onClick={(e) => { e.stopPropagation(); closeModal() }}
                className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-mp-sand transition-colors"
                aria-label="Fermer"
              >
                <X className="w-5 h-5 text-mp-charcoal" aria-hidden="true" />
              </button>
            </div>

          <div className="p-6 sm:p-8 pt-4 sm:pt-4">
            {/* Stripe redirect overlay: brief order recap before leaving the site */}
            {stripeRedirecting && (
              <div
                role="status"
                aria-live="polite"
                className="fixed sm:absolute inset-0 z-30 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center rounded-none sm:rounded-2xl"
              >
                <Loader2 className="w-8 h-8 text-mp-ocean animate-spin mb-4" aria-hidden="true" />
                <p className="font-body text-sm text-mp-charcoal leading-relaxed max-w-xs">
                  Paiement s&eacute;curis&eacute; de{" "}
                  <strong>{isTrial ? "10" : "20"}&nbsp;&euro;</strong> pour{" "}
                  <strong>{selectedSession.courseName}</strong> le{" "}
                  <strong>
                    {format(
                      addDays(weekStart, selectedSession.dayOffset),
                      "EEEE d MMMM",
                      { locale: fr }
                    )}
                  </strong>{" "}
                  &agrave; <strong>{selectedSession.time}</strong>
                </p>
                <p className="mt-3 text-xs text-mp-text-muted">
                  Redirection vers Stripe&hellip;
                </p>
              </div>
            )}

            {/* Booking journey step indicator */}
            <div className="mb-6 pr-12">
              <BookingStepper currentStep={bookingLoading ? 3 : bookingSuccess ? 4 : 2} />
            </div>

            {/* Auth prompt — surfaced when a booking API returns 401. */}
            {authPrompt && (
              <div
                role="alert"
                className="flex items-start gap-3 p-4 rounded-xl bg-mp-ocean/5 border border-mp-ocean/30 mb-4"
              >
                <AlertCircle
                  className="w-5 h-5 text-mp-ocean shrink-0 mt-0.5"
                  aria-hidden
                />
                <div className="flex-1 text-sm text-mp-charcoal">
                  <p className="font-heading font-semibold mb-1">
                    {authPrompt === "stale"
                      ? "Votre session a expiré"
                      : "Connectez-vous pour réserver"}
                  </p>
                  <p className="text-mp-text-muted text-xs mb-3">
                    {authPrompt === "stale"
                      ? "Reconnectez-vous pour finaliser votre réservation — nous vous ramènerons ici."
                      : "Vous retrouverez cette séance après connexion."}
                  </p>
                  <a
                    href={buildLoginReturnUrl(selectedSession?.id)}
                    className="mp-btn mp-btn-primary text-sm"
                  >
                    {authPrompt === "stale" ? "Se reconnecter" : "Se connecter pour réserver"}
                  </a>
                </div>
              </div>
            )}

            {/* Booking error — surfaced at the top of the modal */}
            {bookingError && (
              <div
                role="alert"
                className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-200 mb-4"
              >
                <AlertCircle
                  className="w-5 h-5 text-red-600 shrink-0 mt-0.5"
                  aria-hidden
                />
                <div className="text-sm text-red-800">{bookingError}</div>
              </div>
            )}

            {/* Session summary header */}
            <div className="flex items-start gap-3 mb-4">
              <InstructorAvatar name={selectedSession.instructor} size="md" />
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className={`px-3 py-1 rounded-full text-xs font-heading font-semibold ${courseTypeColors[selectedSession.courseType as keyof typeof courseTypeColors]?.bg} ${courseTypeColors[selectedSession.courseType as keyof typeof courseTypeColors]?.text}`}>
                    {courseTypeLabels[selectedSession.courseType as keyof typeof courseTypeLabels]}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-heading font-medium bg-mp-sand text-mp-charcoal">
                    {selectedSession.level}
                  </span>
                </div>
                <p className="text-xs text-mp-text-muted italic">
                  {courseTypeDescriptions[selectedSession.courseType] ?? ""}
                </p>
              </div>
            </div>

            <h2 id="session-modal-title" className="font-heading text-2xl font-bold text-mp-charcoal mb-1">
              {selectedSession.courseName}
            </h2>
            <p className="font-heading text-sm text-mp-ocean font-medium mb-4">
              {dayNames[selectedSession.dayOffset]}
            </p>
            <p className="font-body text-sm text-mp-text-light leading-relaxed mb-6">
              {selectedSession.description}
            </p>

            <div className="space-y-3 text-sm font-body text-mp-text-light mb-4 p-4 bg-mp-cream rounded-xl">
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-mp-ocean" aria-hidden="true" />
                <span>{selectedSession.time} &mdash; {selectedSession.duration}</span>
              </div>
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-mp-ocean" aria-hidden="true" />
                <span>{selectedSession.instructor}</span>
              </div>
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4 text-mp-ocean" aria-hidden="true" />
                <span>
                  {selectedSession.spotsRemaining}/{selectedSession.spotsTotal}{" "}
                  places disponibles
                </span>
              </div>
            </div>

            {/* Visual spots progress bar */}
            <div className="mb-8">
              <div className="flex items-center justify-between text-xs text-mp-text-muted mb-1.5">
                <span>{selectedSession.spotsTotal - selectedSession.spotsRemaining} inscrit{(selectedSession.spotsTotal - selectedSession.spotsRemaining) > 1 ? "s" : ""}</span>
                <span>{selectedSession.spotsRemaining} place{selectedSession.spotsRemaining > 1 ? "s" : ""} restante{selectedSession.spotsRemaining > 1 ? "s" : ""}</span>
              </div>
              <div className="w-full h-2.5 bg-mp-sand rounded-full overflow-hidden">
                <div
                  className={clsx(
                    "h-full rounded-full transition-all duration-500",
                    selectedSession.spotsRemaining === 0
                      ? "bg-mp-rose"
                      : selectedSession.spotsRemaining <= 2
                        ? "bg-red-400"
                        : (selectedSession.spotsTotal - selectedSession.spotsRemaining) / selectedSession.spotsTotal >= 0.7
                          ? "bg-amber-400"
                          : "bg-mp-sage"
                  )}
                  style={{ width: `${((selectedSession.spotsTotal - selectedSession.spotsRemaining) / selectedSession.spotsTotal) * 100}%` }}
                />
              </div>
            </div>

            {bookingSuccess ? (
              <div className="text-center py-4 space-y-4">
                {/* Green checkmark animation */}
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-mp-sage/10 mx-auto animate-[scale-in_0.3s_ease-out]">
                  <Check className="w-8 h-8 text-mp-sage" aria-hidden="true" />
                </div>
                <h3 className="font-heading text-xl font-bold text-mp-charcoal">
                  {bookingSuccess.message}
                </h3>
                <div className="text-sm text-mp-text-light space-y-1">
                  <p className="font-heading font-semibold">{selectedSession.courseName}</p>
                  <p>{dayNames[selectedSession.dayOffset]} &mdash; {selectedSession.time} ({selectedSession.duration})</p>
                  <p>Avec {selectedSession.instructor}</p>
                </div>
                {recurringResult && (
                  <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-mp-ocean/10 text-sm">
                    <Repeat className="w-4 h-4 text-mp-ocean flex-shrink-0" aria-hidden="true" />
                    <p className="text-mp-ocean font-heading font-medium">
                      Inscrit(e) pour les 4 prochaines semaines
                      {recurringResult.sessionsBooked > 0 && (
                        <span className="text-mp-text-light font-normal"> &mdash; {recurringResult.sessionsBooked} s&eacute;ance{recurringResult.sessionsBooked > 1 ? "s" : ""} confirm&eacute;e{recurringResult.sessionsBooked > 1 ? "s" : ""}</span>
                      )}
                    </p>
                  </div>
                )}
                <div className="flex flex-col gap-2 pt-2">
                  <a
                    href={generateIcsBlob(selectedSession, selectedSession.date ?? format(addDays(weekStart, selectedSession.dayOffset), "yyyy-MM-dd"))}
                    download={`pilates-${selectedSession.id}.ics`}
                    className="mp-btn mp-btn-secondary w-full justify-center text-sm"
                  >
                    <CalendarPlus className="w-4 h-4" aria-hidden="true" />
                    Calendrier (.ics)
                  </a>
                  <a
                    href={generateGoogleCalendarUrl(selectedSession, selectedSession.date ?? format(addDays(weekStart, selectedSession.dayOffset), "yyyy-MM-dd"))}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mp-btn mp-btn-secondary w-full justify-center text-sm"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /><path d="M10 14l2 2 4-4" /></svg>
                    Google Calendar
                  </a>
                  <a href="/compte" className="mp-btn mp-btn-primary w-full justify-center text-sm">
                    Voir mes réservations
                  </a>
                </div>
                {bookingSuccess.waitlist && (
                  <div className="rounded-xl bg-mp-sand/60 border border-mp-sand p-4 mt-4 text-left">
                    <h4 className="font-heading text-sm font-semibold text-mp-charcoal mb-1">
                      Prochaine étape
                    </h4>
                    <p className="text-sm text-mp-text-light">
                      D&egrave;s qu&apos;une place se lib&egrave;re, vous serez automatiquement
                      notifi&eacute;(e) par email. Vous pouvez consulter vos listes
                      d&apos;attente depuis{" "}
                      <Link href="/compte" className="underline text-mp-ocean">
                        votre compte
                      </Link>
                      .
                    </p>
                  </div>
                )}
                {countdownSec !== null && (
                  <p className="text-xs text-mp-text-muted text-center mt-4">
                    Fermeture automatique dans {countdownSec}s —{" "}
                    <button
                      onClick={() => setCountdownSec(null)}
                      className="underline text-mp-ocean"
                    >
                      rester
                    </button>
                  </p>
                )}
              </div>
            ) : selectedSession.spotsRemaining > 0 ? (
              <div className="space-y-4">
                {/* 1. CONFIG — toggles set the price/recurrence before any action */}
                <div className="space-y-2.5">
                  {showTrialOptions && (
                    <label className="flex items-center gap-3 cursor-pointer group p-3 rounded-xl border border-mp-sand hover:border-mp-ocean/30 transition-colors">
                      <span className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${isTrial ? "bg-mp-ocean" : "bg-mp-sand-dark"}`}>
                        <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${isTrial ? "translate-x-5" : "translate-x-0"}`} />
                        <input
                          type="checkbox"
                          checked={isTrial}
                          onChange={(e) => setIsTrial(e.target.checked)}
                          className="sr-only"
                        />
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className="font-heading text-sm font-medium text-mp-charcoal group-hover:text-mp-ocean transition-colors block">
                          C&apos;est ma premi&egrave;re s&eacute;ance
                        </span>
                        <span className="text-xs text-mp-sage block mt-0.5">
                          Cours d&eacute;couverte &agrave; <strong>10&nbsp;&euro;</strong> au lieu de 20&nbsp;&euro;
                        </span>
                      </span>
                    </label>
                  )}
                  <label className="flex items-center gap-3 cursor-pointer group p-3 rounded-xl border border-mp-sand hover:border-mp-ocean/30 transition-colors">
                    <span className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${isRecurring ? "bg-mp-ocean" : "bg-mp-sand-dark"}`}>
                      <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${isRecurring ? "translate-x-5" : "translate-x-0"}`} />
                      <input
                        type="checkbox"
                        checked={isRecurring}
                        onChange={(e) => setIsRecurring(e.target.checked)}
                        className="sr-only"
                      />
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="font-heading text-sm font-medium text-mp-charcoal group-hover:text-mp-ocean transition-colors flex items-center gap-1.5">
                        <Repeat className="w-3.5 h-3.5" aria-hidden="true" />
                        Chaque semaine
                      </span>
                      <span className="text-xs text-mp-text-muted block mt-0.5">
                        Inscription auto. aux 4 prochaines s&eacute;ances
                      </span>
                    </span>
                  </label>
                </div>

                {/* 2. RÉCAP — single source of truth for what gets booked */}
                <section
                  aria-labelledby="order-summary-heading"
                  className="border border-mp-sand rounded-xl p-4 bg-mp-cream/40"
                >
                  <h3
                    id="order-summary-heading"
                    className="font-heading text-sm font-bold text-mp-charcoal mb-3"
                  >
                    Récapitulatif
                  </h3>
                  <dl className="space-y-2 text-sm font-body text-mp-text-light">
                    <div className="flex justify-between gap-3">
                      <dt className="text-mp-text-muted shrink-0">Séance</dt>
                      <dd className="text-right text-mp-charcoal font-heading font-medium min-w-0 break-words">
                        {courseTypeLabels[selectedSession.courseType as keyof typeof courseTypeLabels] ?? selectedSession.courseName}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-3">
                      <dt className="text-mp-text-muted shrink-0">Quand</dt>
                      <dd className="text-right text-mp-charcoal font-heading font-medium">
                        {dayNames[selectedSession.dayOffset]} {selectedSession.time}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-3">
                      <dt className="text-mp-text-muted shrink-0">Avec</dt>
                      <dd className="text-right text-mp-charcoal font-heading font-medium">
                        {selectedSession.instructor}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-3 pt-2 mt-2 border-t border-mp-sand">
                      <dt className="text-mp-charcoal font-heading font-semibold">
                        À payer
                      </dt>
                      <dd className="text-right text-mp-charcoal font-heading font-bold text-base">
                        {activeCard && activeCard.remaining > 0 ? (
                          <span className="text-mp-sage">
                            <span className="line-through text-mp-text-muted text-xs font-normal mr-2">{isTrial ? "10" : "20"}&nbsp;&euro;</span>
                            1 séance carte
                          </span>
                        ) : (
                          <>{isTrial ? "10" : "20"}&nbsp;&euro;</>
                        )}
                      </dd>
                    </div>
                  </dl>
                </section>

                {/* 3. PRIMARY ACTION — one button. Carte si dispo, sinon paiement. */}
                {activeCard && activeCard.remaining > 0 ? (
                  <button
                    disabled={bookingLoading}
                    onClick={async () => {
                      setBookingLoading(true)
                      setBookingError("")
                      try {
                        const res = await fetch("/api/bookings/use-card", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ sessionId: selectedSession.id }),
                        })
                        if (handleAuthError(res.status)) return
                        const data = await res.json()
                        if (res.ok) {
                          setActiveCard({ ...activeCard, remaining: data.cardRemaining })
                          await handleRecurringAfterBooking(selectedSession.scheduleId)
                          setBookingSuccess({
                            message: data.status === "WAITLIST"
                              ? "Vous \u00eates sur la liste d'attente ! Nous vous notifierons par email si une place se lib\u00e8re."
                              : "Réservation confirmée !",
                            waitlist: data.status === "WAITLIST",
                          })
                        } else {
                          setBookingError(data.error || "Erreur lors de la réservation.")
                        }
                      } catch {
                        setBookingError("Erreur de connexion.")
                      } finally {
                        setBookingLoading(false)
                      }
                    }}
                    className="mp-btn mp-btn-primary w-full justify-center"
                  >
                    {bookingLoading ? "R\u00e9servation\u2026" : (
                      <span className="flex flex-col items-center gap-0.5 leading-tight">
                        <span className="inline-flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4" aria-hidden="true" />
                          Réserver avec ma carte
                        </span>
                        <span className="text-[11px] font-body font-normal opacity-90">
                          {activeCard.remaining} séance{activeCard.remaining > 1 ? "s" : ""} restante{activeCard.remaining > 1 ? "s" : ""} sur {activeCard.total}
                        </span>
                      </span>
                    )}
                  </button>
                ) : (
                  <button
                    disabled={bookingLoading}
                    onClick={async () => {
                      setBookingLoading(true)
                      setBookingError("")
                      const price = isTrial ? 10 : 20
                      try {
                        const res = await fetch("/api/checkout", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            mode: "booking",
                            items: [{
                              name: isTrial
                                ? `Cours d'essai — ${selectedSession.courseName} — ${selectedSession.time}`
                                : `${selectedSession.courseName} — ${selectedSession.time} (${selectedSession.duration})`,
                              price,
                              quantity: 1,
                            }],
                            metadata: {
                              sessionId: selectedSession.id,
                              scheduleId: selectedSession.scheduleId,
                              courseName: selectedSession.courseName,
                              instructor: selectedSession.instructor,
                              time: selectedSession.time,
                              isTrial: String(isTrial),
                              isRecurring: String(isRecurring),
                            },
                          }),
                        })
                        if (handleAuthError(res.status)) return
                        const data = await res.json()
                        if (data.url) {
                          setStripeRedirecting(true)
                          await new Promise((r) => setTimeout(r, 800))
                          window.location.href = data.url
                        } else {
                          setBookingError("Impossible de lancer le paiement.")
                        }
                      } catch {
                        setBookingError("Impossible de lancer le paiement.")
                      } finally {
                        setBookingLoading(false)
                      }
                    }}
                    className="mp-btn mp-btn-primary w-full justify-center"
                  >
                    {bookingLoading ? "Redirection\u2026" : <>Payer {isTrial ? "10" : "20"}&nbsp;&euro; par carte bancaire</>}
                  </button>
                )}

                {/* 4. SECONDARY ACTIONS — text links, no visual weight */}
                <div className="space-y-1 pt-1 border-t border-mp-sand/60">
                  {activeCard && activeCard.remaining > 0 && (
                    <button
                      disabled={bookingLoading}
                      onClick={async () => {
                        setBookingLoading(true)
                        setBookingError("")
                        const price = isTrial ? 10 : 20
                        try {
                          const res = await fetch("/api/checkout", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              mode: "booking",
                              items: [{
                                name: isTrial
                                  ? `Cours d'essai — ${selectedSession.courseName} — ${selectedSession.time}`
                                  : `${selectedSession.courseName} — ${selectedSession.time} (${selectedSession.duration})`,
                                price,
                                quantity: 1,
                              }],
                              metadata: {
                                sessionId: selectedSession.id,
                                scheduleId: selectedSession.scheduleId,
                                courseName: selectedSession.courseName,
                                instructor: selectedSession.instructor,
                                time: selectedSession.time,
                                isTrial: String(isTrial),
                                isRecurring: String(isRecurring),
                              },
                            }),
                          })
                          if (handleAuthError(res.status)) return
                          const data = await res.json()
                          if (data.url) {
                            setStripeRedirecting(true)
                            await new Promise((r) => setTimeout(r, 800))
                            window.location.href = data.url
                          } else {
                            setBookingError("Impossible de lancer le paiement.")
                          }
                        } catch {
                          setBookingError("Impossible de lancer le paiement.")
                        } finally {
                          setBookingLoading(false)
                        }
                      }}
                      className="block w-full text-center text-sm font-heading font-medium text-mp-ocean hover:text-mp-ocean-dark hover:underline py-2.5"
                    >
                      Payer {isTrial ? "10" : "20"}&nbsp;&euro; sans toucher à ma carte
                    </button>
                  )}
                  <button
                    disabled={bookingLoading}
                    onClick={async () => {
                      setBookingLoading(true)
                      setBookingError("")
                      try {
                        const res = await fetch("/api/bookings/on-site", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ sessionId: selectedSession.id }),
                        })
                        if (handleAuthError(res.status)) return
                        const data = await res.json()
                        if (res.ok) {
                          await handleRecurringAfterBooking(selectedSession.scheduleId)
                          setBookingSuccess({
                            message: data.status === "WAITLIST"
                              ? "Vous \u00eates sur la liste d'attente ! Nous vous notifierons par email si une place se lib\u00e8re."
                              : "Réservation confirmée ! Règlement sur place au studio.",
                            waitlist: data.status === "WAITLIST",
                          })
                        } else {
                          setBookingError(data.error || "Erreur lors de la réservation.")
                        }
                      } catch {
                        setBookingError("Erreur de connexion.")
                      } finally {
                        setBookingLoading(false)
                      }
                    }}
                    className="block w-full text-center text-sm font-heading font-medium text-mp-text-light hover:text-mp-charcoal hover:underline py-2.5"
                  >
                    Régler sur place au studio
                  </button>
                </div>

                {/* 5. UPSELL — only when no card and not a trial */}
                {!activeCard && !isTrial && (
                  <a
                    href="/tarifs"
                    className="flex items-start gap-2 px-3 py-2.5 rounded-xl bg-amber-50/80 border border-amber-200/60 text-xs hover:bg-amber-100/80 transition-colors"
                  >
                    <span className="text-base leading-none mt-0.5" aria-hidden="true">💡</span>
                    <span className="text-mp-charcoal flex-1">
                      Avec la <strong>carte 10 cours</strong>, ce cours coûterait <strong className="text-mp-ocean">18&nbsp;&euro;</strong> au lieu de 20&nbsp;&euro;
                      {" "}<span className="text-mp-ocean font-heading font-semibold whitespace-nowrap">— Voir les cartes →</span>
                    </span>
                  </a>
                )}

              </div>
            ) : (
              <div className="text-center py-4 px-3 rounded-xl bg-mp-rose/10 border border-mp-rose/30">
                <p className="text-mp-rose font-heading font-semibold">
                  Cette s&eacute;ance est compl&egrave;te
                </p>
                <p className="text-xs text-mp-text-light mt-1">
                  Inscrivez-vous sur la liste d&apos;attente — vous serez
                  notifi&eacute;(e) d&egrave;s qu&apos;une place se lib&egrave;re.
                </p>
                <button
                  onClick={handleWaitlistJoin}
                  disabled={bookingLoading}
                  className="mp-btn mp-btn-secondary mt-3 w-full sm:w-auto justify-center"
                >
                  {bookingLoading ? "Inscription\u2026" : "Me mettre sur liste d'attente"}
                </button>
              </div>
            )}
          </div>
          </div>
        </div>
      )}
    </>
  )
}
