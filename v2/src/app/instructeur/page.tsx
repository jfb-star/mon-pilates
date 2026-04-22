"use client"

import { useState, useEffect, useCallback } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import {
  Calendar,
  Users,
  Star,
  TrendingUp,
  ChevronDown,
  ChevronRight,
  Clock,
  FileText,
  Loader2,
  AlertCircle,
  CheckCircle2,
  UserCheck,
  BookOpen,
  CircleDollarSign,
  BadgeCheck,
  Banknote,
} from "lucide-react"
import { clsx } from "clsx"

interface Student {
  bookingId: string
  name: string
  email: string
  status: string
  paymentMethod: string
  paymentStatus: string
}

interface SessionData {
  id: string
  date: string
  startTime: string
  endTime: string
  notes: string | null
  courseType: { name: string; slug: string; color: string | null }
  currentParticipants: number
  maxParticipants: number
  students: Student[]
  attendanceStats?: { attended: number; total: number }
}

interface Stats {
  totalClassesThisMonth: number
  totalStudentsThisMonth: number
  averageAttendanceRate: number
  upcomingClassesToday: number
  averageRating: number
}

const STATUS_LABELS: Record<string, { label: string; class: string }> = {
  CONFIRMED: { label: "Confirmé", class: "bg-emerald-100 text-emerald-700" },
  WAITLIST: { label: "Liste d'attente", class: "bg-amber-100 text-amber-700" },
  ATTENDED: { label: "Présent", class: "bg-blue-100 text-blue-700" },
}

const PAYMENT_LABELS: Record<string, { label: string; short: string }> = {
  UNIT: { label: "Payé en ligne", short: "En ligne" },
  TRIAL: { label: "Cours d'essai", short: "Essai" },
  CARD: { label: "Carte de cours", short: "Carte" },
  ON_SITE: { label: "Paiement sur place", short: "Sur place" },
  RECURRING: { label: "Récurrent", short: "Récurrent" },
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  })
}

function formatShortDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString("fr-FR", {
    weekday: "short",
    day: "numeric",
    month: "short",
  })
}

function getCourseColor(color: string | null): string {
  if (!color) return "bg-mp-ocean/10 text-mp-ocean border-mp-ocean/20"
  // Map color names to Tailwind classes
  const colorMap: Record<string, string> = {
    ocean: "bg-mp-ocean/10 text-mp-ocean border-mp-ocean/20",
    sage: "bg-mp-sage/10 text-mp-sage border-mp-sage/20",
    coral: "bg-rose-50 text-rose-600 border-rose-200",
    lavender: "bg-purple-50 text-purple-600 border-purple-200",
    gold: "bg-amber-50 text-amber-600 border-amber-200",
  }
  return colorMap[color] ?? "bg-mp-ocean/10 text-mp-ocean border-mp-ocean/20"
}

function SessionCard({
  session,
  isPast,
  onPaymentConfirmed,
}: {
  session: SessionData
  isPast?: boolean
  onPaymentConfirmed?: (bookingId: string) => void
}) {
  const [expanded, setExpanded] = useState(false)
  const [notes, setNotes] = useState(session.notes ?? "")
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [confirmingPayment, setConfirmingPayment] = useState<string | null>(null)

  const pendingPayments = session.students.filter(
    (s) => s.paymentStatus === "PENDING" && s.status !== "CANCELLED"
  )

  async function handleConfirmPayment(bookingId: string) {
    setConfirmingPayment(bookingId)
    try {
      const res = await fetch("/api/instructor/confirm-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId }),
      })
      if (res.ok) {
        onPaymentConfirmed?.(bookingId)
      }
    } catch {
      // silently fail
    } finally {
      setConfirmingPayment(null)
    }
  }

  const fillPercent = session.maxParticipants > 0
    ? Math.round((session.currentParticipants / session.maxParticipants) * 100)
    : 0

  const saveNotes = useCallback(async () => {
    if (notes === (session.notes ?? "")) return
    setSaving(true)
    try {
      await fetch("/api/instructor/schedule", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: session.id, notes }),
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch {
      // silently fail
    } finally {
      setSaving(false)
    }
  }, [notes, session.id, session.notes])

  return (
    <div
      className={clsx(
        "bg-mp-cream rounded-xl border transition-shadow",
        expanded ? "shadow-md" : "shadow-sm hover:shadow-md",
        isPast && "opacity-80"
      )}
    >
      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        className="w-full flex items-center gap-4 p-4 text-left"
      >
        {/* Color dot */}
        <div
          className={clsx(
            "flex-shrink-0 w-3 h-3 rounded-full",
            session.courseType.color === "sage"
              ? "bg-mp-sage"
              : session.courseType.color === "coral"
              ? "bg-rose-400"
              : session.courseType.color === "lavender"
              ? "bg-purple-400"
              : session.courseType.color === "gold"
              ? "bg-amber-400"
              : "bg-mp-ocean"
          )}
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={clsx(
                "inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium border",
                getCourseColor(session.courseType.color)
              )}
            >
              {session.courseType.name}
            </span>
            {session.notes && (
              <FileText className="w-3.5 h-3.5 text-mp-charcoal-light/50" aria-label="Notes ajoutées" />
            )}
          </div>
          <div className="flex items-center gap-3 mt-1 text-sm text-mp-charcoal-light">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
              {isPast ? formatShortDate(session.date) : formatDate(session.date)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" aria-hidden="true" />
              {session.startTime} – {session.endTime}
            </span>
          </div>
        </div>

        {/* Participants count + payment alerts */}
        <div className="flex-shrink-0 flex items-center gap-3">
          {!isPast && pendingPayments.length > 0 && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-xs font-medium">
              <Banknote className="w-3 h-3" aria-hidden="true" />
              {pendingPayments.length} impayé{pendingPayments.length > 1 ? "s" : ""}
            </span>
          )}
          {isPast && session.attendanceStats ? (
            <span className="flex items-center gap-1.5 text-sm font-medium text-mp-charcoal">
              <UserCheck className="w-4 h-4 text-mp-sage" aria-hidden="true" />
              {session.attendanceStats.attended}/{session.attendanceStats.total} présents
            </span>
          ) : (
            <div className="flex items-center gap-2">
              <div className="w-20 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={clsx(
                    "h-full rounded-full transition-all",
                    fillPercent >= 90 ? "bg-rose-400" : fillPercent >= 70 ? "bg-amber-400" : "bg-mp-ocean"
                  )}
                  style={{ width: `${fillPercent}%` }}
                />
              </div>
              <span className="text-sm font-medium text-mp-charcoal whitespace-nowrap">
                {session.currentParticipants}/{session.maxParticipants}
              </span>
            </div>
          )}

          {expanded ? (
            <ChevronDown className="w-4 h-4 text-mp-charcoal-light" aria-hidden="true" />
          ) : (
            <ChevronRight className="w-4 h-4 text-mp-charcoal-light" aria-hidden="true" />
          )}
        </div>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="px-4 pb-4 border-t border-gray-100">
          {/* Students list with payment status */}
          {session.students.length > 0 ? (
            <div className="mt-3">
              <h4 className="text-xs font-semibold text-mp-charcoal-light uppercase tracking-wider mb-2">
                Élèves ({session.students.length})
              </h4>
              <div className="space-y-1.5">
                {session.students.map((student) => (
                  <div
                    key={student.bookingId}
                    className={clsx(
                      "flex items-center justify-between py-2 px-3 rounded-lg text-sm",
                      student.paymentStatus === "PENDING"
                        ? "bg-amber-50 border border-amber-200"
                        : "bg-gray-50"
                    )}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-medium text-mp-charcoal">{student.name}</span>
                      <span className="text-mp-charcoal-light text-xs hidden sm:inline">{student.email}</span>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {/* Payment badge */}
                      {student.paymentStatus === "PAID" ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-medium">
                          <BadgeCheck className="w-3 h-3" aria-hidden="true" />
                          {PAYMENT_LABELS[student.paymentMethod]?.short ?? "Payé"}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-xs font-medium">
                          <CircleDollarSign className="w-3 h-3" aria-hidden="true" />
                          À encaisser
                        </span>
                      )}
                      {/* Booking status */}
                      <span
                        className={clsx(
                          "inline-flex px-2 py-0.5 rounded-full text-xs font-medium",
                          STATUS_LABELS[student.status]?.class ?? "bg-gray-100 text-gray-600"
                        )}
                      >
                        {STATUS_LABELS[student.status]?.label ?? student.status}
                      </span>
                      {/* Confirm payment button */}
                      {!isPast && student.paymentStatus === "PENDING" && (
                        <button
                          onClick={() => handleConfirmPayment(student.bookingId)}
                          disabled={confirmingPayment === student.bookingId}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-mp-ocean text-white text-xs font-medium hover:bg-mp-ocean-dark transition-colors disabled:opacity-50"
                        >
                          {confirmingPayment === student.bookingId ? (
                            <Loader2 className="w-3 h-3 animate-spin" aria-hidden="true" />
                          ) : (
                            <>
                              <CheckCircle2 className="w-3 h-3" aria-hidden="true" />
                              Encaisser
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="mt-3 text-sm text-mp-charcoal-light italic">
              Aucun élève inscrit pour le moment.
            </p>
          )}

          {/* Notes field */}
          {!isPast && (
            <div className="mt-4">
              <label
                htmlFor={`notes-${session.id}`}
                className="text-xs font-semibold text-mp-charcoal-light uppercase tracking-wider"
              >
                Notes
              </label>
              <div className="relative mt-1">
                <textarea
                  id={`notes-${session.id}`}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  onBlur={saveNotes}
                  placeholder="Ajoutez des notes pour cette séance..."
                  rows={2}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-mp-charcoal placeholder:text-mp-charcoal-light/50 focus:outline-none focus:ring-2 focus:ring-mp-ocean/30 focus:border-mp-ocean resize-none"
                />
                {saving && (
                  <span className="absolute top-2 right-2 text-xs text-mp-charcoal-light flex items-center gap-1">
                    <Loader2 className="w-3 h-3 animate-spin" aria-hidden="true" />
                    Enregistrement...
                  </span>
                )}
                {saved && (
                  <span className="absolute top-2 right-2 text-xs text-mp-sage flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" aria-hidden="true" />
                    Enregistré
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function InstructeurPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState<Stats | null>(null)
  const [schedule, setSchedule] = useState<{
    upcoming: SessionData[]
    past: SessionData[]
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showPast, setShowPast] = useState(false)

  const userRole = (session?.user as { role?: string } | undefined)?.role

  useEffect(() => {
    if (status === "loading") return
    if (!session?.user) {
      router.push("/connexion")
      return
    }
    if (userRole !== "INSTRUCTOR" && userRole !== "ADMIN") {
      router.push("/")
      return
    }

    async function fetchData() {
      try {
        const [statsRes, scheduleRes] = await Promise.all([
          fetch("/api/instructor/stats"),
          fetch("/api/instructor/schedule"),
        ])

        if (!statsRes.ok || !scheduleRes.ok) {
          setError("Impossible de charger les données.")
          return
        }

        const [statsData, scheduleData] = await Promise.all([
          statsRes.json(),
          scheduleRes.json(),
        ])

        setStats(statsData)
        setSchedule(scheduleData)
      } catch {
        setError("Erreur de connexion au serveur.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [session, status, router, userRole])

  if (status === "loading" || loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-mp-cream">
        <Loader2 className="w-8 h-8 text-mp-ocean animate-spin" aria-hidden="true" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-mp-cream">
        <div className="text-center">
          <AlertCircle className="w-10 h-10 text-rose-400 mx-auto mb-3" aria-hidden="true" />
          <p className="text-mp-charcoal font-medium">{error}</p>
        </div>
      </div>
    )
  }

  function handlePaymentConfirmed(bookingId: string) {
    setSchedule((prev) => {
      if (!prev) return prev
      const updateStudents = (sessions: SessionData[]) =>
        sessions.map((s) => ({
          ...s,
          students: s.students.map((st) =>
            st.bookingId === bookingId
              ? { ...st, paymentStatus: "PAID" }
              : st
          ),
        }))
      return {
        upcoming: updateStudents(prev.upcoming),
        past: updateStudents(prev.past),
      }
    })
  }

  const firstName = session?.user?.name?.split(" ")[0] ?? "Instructeur"

  // Group upcoming sessions by date
  const groupedUpcoming = new Map<string, SessionData[]>()
  if (schedule?.upcoming) {
    for (const s of schedule.upcoming) {
      const dateKey = new Date(s.date).toISOString().slice(0, 10)
      if (!groupedUpcoming.has(dateKey)) {
        groupedUpcoming.set(dateKey, [])
      }
      groupedUpcoming.get(dateKey)!.push(s)
    }
  }

  return (
    <main className="min-h-screen bg-mp-cream pt-28 pb-16">
      <div className="mp-container">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-mp-charcoal">
            Bonjour {firstName} <span aria-hidden="true">&#x1F44B;</span>
          </h1>
          <p className="text-mp-charcoal-light mt-1">
            Votre tableau de bord instructeur
          </p>
        </div>

        {/* Stats cards */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            <div className="bg-mp-cream rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-mp-ocean/10 flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-mp-ocean" aria-hidden="true" />
                </div>
                <span className="text-xs font-medium text-mp-charcoal-light uppercase tracking-wider">
                  Aujourd&apos;hui
                </span>
              </div>
              <p className="text-2xl font-bold text-mp-charcoal">
                {stats.upcomingClassesToday}
                <span className="text-sm font-normal text-mp-charcoal-light ml-1">
                  cours
                </span>
              </p>
            </div>

            <div className="bg-mp-cream rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-mp-sage/10 flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-mp-sage" aria-hidden="true" />
                </div>
                <span className="text-xs font-medium text-mp-charcoal-light uppercase tracking-wider">
                  Ce mois
                </span>
              </div>
              <p className="text-2xl font-bold text-mp-charcoal">
                {stats.totalClassesThisMonth}
                <span className="text-sm font-normal text-mp-charcoal-light ml-1">
                  cours
                </span>
              </p>
            </div>

            <div className="bg-mp-cream rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                  <Star className="w-4 h-4 text-amber-500" aria-hidden="true" />
                </div>
                <span className="text-xs font-medium text-mp-charcoal-light uppercase tracking-wider">
                  Note moyenne
                </span>
              </div>
              <p className="text-2xl font-bold text-mp-charcoal">
                {stats.averageRating > 0 ? stats.averageRating : "—"}
                {stats.averageRating > 0 && (
                  <span className="text-sm font-normal text-mp-charcoal-light ml-1">
                    /5
                  </span>
                )}
              </p>
            </div>

            <div className="bg-mp-cream rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-purple-500" aria-hidden="true" />
                </div>
                <span className="text-xs font-medium text-mp-charcoal-light uppercase tracking-wider">
                  Taux présence
                </span>
              </div>
              <p className="text-2xl font-bold text-mp-charcoal">
                {stats.averageAttendanceRate}
                <span className="text-sm font-normal text-mp-charcoal-light ml-0.5">
                  %
                </span>
              </p>
            </div>
          </div>
        )}

        {/* Upcoming schedule */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-5">
            <Calendar className="w-5 h-5 text-mp-ocean" aria-hidden="true" />
            <h2 className="font-heading text-xl font-semibold text-mp-charcoal">
              Prochains cours
            </h2>
            {schedule?.upcoming && (
              <span className="text-sm text-mp-charcoal-light">
                ({schedule.upcoming.length} séances)
              </span>
            )}
          </div>

          {groupedUpcoming.size === 0 ? (
            <div className="bg-mp-cream rounded-xl p-8 shadow-sm border border-gray-100 text-center">
              <Calendar className="w-10 h-10 text-mp-charcoal-light/30 mx-auto mb-3" aria-hidden="true" />
              <p className="text-mp-charcoal-light">
                Aucun cours prévu dans les 4 prochaines semaines.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {Array.from(groupedUpcoming.entries()).map(([dateKey, sessions]) => (
                <div key={dateKey}>
                  <h3 className="text-sm font-semibold text-mp-charcoal-light uppercase tracking-wider mb-2 pl-1">
                    {formatDate(dateKey + "T00:00:00")}
                  </h3>
                  <div className="space-y-2">
                    {sessions.map((s) => (
                      <SessionCard key={s.id} session={s} onPaymentConfirmed={handlePaymentConfirmed} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Past classes (collapsible) */}
        {schedule?.past && schedule.past.length > 0 && (
          <section>
            <button
              type="button"
              onClick={() => setShowPast((prev) => !prev)}
              className="flex items-center gap-2 mb-4 group"
            >
              {showPast ? (
                <ChevronDown className="w-5 h-5 text-mp-charcoal-light" aria-hidden="true" />
              ) : (
                <ChevronRight className="w-5 h-5 text-mp-charcoal-light" aria-hidden="true" />
              )}
              <Users className="w-5 h-5 text-mp-charcoal-light" aria-hidden="true" />
              <h2 className="font-heading text-xl font-semibold text-mp-charcoal group-hover:text-mp-ocean transition-colors">
                Cours passés
              </h2>
              <span className="text-sm text-mp-charcoal-light">
                ({schedule.past.length} séances)
              </span>
            </button>

            {showPast && (
              <div className="space-y-2">
                {schedule.past.map((s) => (
                  <SessionCard key={s.id} session={s} isPast />
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  )
}
