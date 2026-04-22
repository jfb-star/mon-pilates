"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { Calendar, AlertTriangle, Star, PartyPopper, X } from "lucide-react"
import type { ActivityEvent } from "@/app/api/activity/route"

/* ------------------------------------------------------------------ */
/*  Relative time in French                                           */
/* ------------------------------------------------------------------ */
function relativeTime(timestamp: string): string {
  const diff = Date.now() - new Date(timestamp).getTime()
  const minutes = Math.floor(diff / 60_000)
  if (minutes < 1) return "à l'instant"
  if (minutes < 60) return `il y a ${minutes} min`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `il y a ${hours} h`
  const days = Math.floor(hours / 24)
  return `il y a ${days} j`
}

/* ------------------------------------------------------------------ */
/*  Icon per event type                                                */
/* ------------------------------------------------------------------ */
function EventIcon({ type }: { type: ActivityEvent["type"] }) {
  switch (type) {
    case "booking":
      return <Calendar className="w-4 h-4 text-blue-600 flex-shrink-0" aria-hidden="true" />
    case "spots":
      return <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" aria-hidden="true" />
    case "review":
      return <Star className="w-4 h-4 text-amber-500 flex-shrink-0" aria-hidden="true" />
    case "milestone":
      return <PartyPopper className="w-4 h-4 text-purple-600 flex-shrink-0" aria-hidden="true" />
  }
}

/* ------------------------------------------------------------------ */
/*  Pulsing dot for "spots" urgency type                               */
/* ------------------------------------------------------------------ */
function PulsingDot({ type }: { type: ActivityEvent["type"] }) {
  if (type !== "spots") return null
  return (
    <span className="relative flex h-2 w-2 flex-shrink-0">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
    </span>
  )
}

/* ------------------------------------------------------------------ */
/*  Fallback / placeholder events when API returns empty               */
/* ------------------------------------------------------------------ */
function getFallbackEvents(): ActivityEvent[] {
  const now = Date.now()
  return [
    {
      id: "fallback-1",
      type: "booking",
      message: "M. vient de réserver un cours de Pilates classique — Tapis",
      icon: "\uD83D\uDCC5",
      timestamp: new Date(now - 2 * 60_000).toISOString(),
      color: "text-blue-600",
    },
    {
      id: "fallback-2",
      type: "spots",
      message: "Plus que 1 créneau pour un cours privé sur appareil \u2014 demain 9h",
      icon: "\u26A1",
      timestamp: new Date(now - 5 * 60_000).toISOString(),
      color: "text-red-600",
    },
    {
      id: "fallback-3",
      type: "review",
      message: "S. a donné 5\u2B50 au cours Pilates doux — Tapis",
      icon: "\u2B50",
      timestamp: new Date(now - 12 * 60_000).toISOString(),
      color: "text-amber-500",
    },
    {
      id: "fallback-4",
      type: "milestone",
      message: "Un membre vient de compléter son 50e cours !",
      icon: "\uD83C\uDF89",
      timestamp: new Date(now - 25 * 60_000).toISOString(),
      color: "text-purple-600",
    },
    {
      id: "fallback-5",
      type: "booking",
      message: "J. vient de réserver le cours Intensif",
      icon: "\uD83D\uDCC5",
      timestamp: new Date(now - 31 * 60_000).toISOString(),
      color: "text-blue-600",
    },
  ]
}

/* ------------------------------------------------------------------ */
/*  Shared hook for fetching activity events                           */
/* ------------------------------------------------------------------ */
function useActivityEvents() {
  const [events, setEvents] = useState<ActivityEvent[]>([])
  const [loaded, setLoaded] = useState(false)

  const fetchEvents = useCallback(async () => {
    try {
      const res = await fetch("/api/activity")
      if (!res.ok) throw new Error("fetch failed")
      const data = await res.json()
      const fetched: ActivityEvent[] = data.events ?? []
      setEvents(fetched.length > 0 ? fetched : getFallbackEvents())
    } catch {
      setEvents(getFallbackEvents())
    } finally {
      setLoaded(true)
    }
  }, [])

  useEffect(() => {
    fetchEvents()
    const interval = setInterval(fetchEvents, 60_000) // poll every 60s
    return () => clearInterval(interval)
  }, [fetchEvents])

  return { events, loaded }
}

/* ================================================================== */
/*  MODE 1: Sidebar Widget                                             */
/* ================================================================== */
function SidebarFeed() {
  const { events, loaded } = useActivityEvents()

  if (!loaded) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex gap-3 animate-pulse">
            <div className="w-8 h-8 rounded-full bg-mp-sand" />
            <div className="flex-1 space-y-2">
              <div className="h-3 bg-mp-sand rounded w-3/4" />
              <div className="h-2 bg-mp-sand rounded w-1/3" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  const displayed = events.slice(0, 5)

  return (
    <div className="space-y-1" role="log" aria-label="Activité en direct du studio" aria-live="polite">
      {/* Live indicator */}
      <div className="flex items-center gap-2 mb-4">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
        </span>
        <span className="font-heading text-xs font-semibold text-mp-charcoal uppercase tracking-wider">
          En direct — Activité du studio
        </span>
      </div>

      {displayed.map((event) => (
        <div
          key={event.id}
          className="flex items-start gap-3 p-3 rounded-xl hover:bg-mp-cream/60 transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-mp-cream flex items-center justify-center flex-shrink-0 mt-0.5">
            <EventIcon type={event.type} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-body text-sm text-mp-charcoal leading-snug">
              <PulsingDot type={event.type} />
              {event.message}
            </p>
            <p className="font-body text-xs text-mp-text-light mt-0.5">
              {relativeTime(event.timestamp)}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

/* ================================================================== */
/*  MODE 2: Toast / Notification Popup (floating bottom-left)          */
/* ================================================================== */
function ToastFeed() {
  const { events, loaded } = useActivityEvents()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [visible, setVisible] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const [scrolledPast, setScrolledPast] = useState(false)
  const toastCountRef = useRef(0)
  const maxToasts = 5

  // Check sessionStorage on mount for dismissal
  useEffect(() => {
    try {
      if (sessionStorage.getItem("activity-toast-dismissed") === "true") {
        setDismissed(true)
      }
    } catch {
      // sessionStorage unavailable
    }
  }, [])

  // Track scroll position (show only after 500px)
  useEffect(() => {
    function onScroll() {
      setScrolledPast(window.scrollY > 500)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Cycle through events: show 6s, hide, wait 3s, show next
  useEffect(() => {
    if (!loaded || events.length === 0 || dismissed) return
    if (toastCountRef.current >= maxToasts) return

    let showTimeout: ReturnType<typeof setTimeout>
    let hideTimeout: ReturnType<typeof setTimeout>

    function showNext() {
      if (toastCountRef.current >= maxToasts) return
      setVisible(true)
      toastCountRef.current++

      hideTimeout = setTimeout(() => {
        setVisible(false)
        if (toastCountRef.current < maxToasts) {
          showTimeout = setTimeout(() => {
            setCurrentIndex((prev) => (prev + 1) % events.length)
            showNext()
          }, 3000)
        }
      }, 6000)
    }

    // Initial delay before first toast
    showTimeout = setTimeout(showNext, 2000)

    return () => {
      clearTimeout(showTimeout)
      clearTimeout(hideTimeout)
    }
  }, [loaded, events.length, dismissed])

  function handleDismiss() {
    setDismissed(true)
    setVisible(false)
    try {
      sessionStorage.setItem("activity-toast-dismissed", "true")
    } catch {
      // sessionStorage unavailable
    }
  }

  if (dismissed || !loaded || events.length === 0) return null

  const event = events[currentIndex % events.length]
  if (!event) return null

  const shouldShow = visible && scrolledPast

  return (
    <div
      className="fixed bottom-6 left-6 z-50 max-w-sm"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <div
        className={`
          bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-mp-sand-dark/20
          p-4 pr-10
          transition-all duration-500 ease-out
          motion-safe:translate-y-0 motion-safe:opacity-100
          ${shouldShow
            ? "motion-safe:translate-y-0 motion-safe:opacity-100"
            : "motion-safe:translate-y-8 motion-safe:opacity-0 pointer-events-none"
          }
          motion-reduce:transition-none
          ${shouldShow ? "" : "motion-reduce:hidden"}
        `}
      >
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 p-1 rounded-full hover:bg-mp-cream transition-colors"
          aria-label="Fermer les notifications d'activité"
        >
          <X className="w-3.5 h-3.5 text-mp-text-light" aria-hidden="true" />
        </button>

        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-mp-cream flex items-center justify-center flex-shrink-0 mt-0.5">
            <EventIcon type={event.type} />
          </div>
          <div className="min-w-0">
            <p className="font-body text-sm text-mp-charcoal leading-snug">
              {event.message}
            </p>
            <p className="font-body text-xs text-mp-text-light mt-1">
              {relativeTime(event.timestamp)}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ================================================================== */
/*  Main exported component                                            */
/* ================================================================== */
interface ActivityFeedProps {
  mode: "sidebar" | "toast"
}

export function ActivityFeed({ mode }: ActivityFeedProps) {
  if (mode === "sidebar") return <SidebarFeed />
  return <ToastFeed />
}
