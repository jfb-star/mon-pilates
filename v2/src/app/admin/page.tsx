"use client"

import React, { useState, useEffect, useCallback } from "react"

// Recharts value type for formatters (values may be undefined in tooltips).
type RechartsValue = number | string | ReadonlyArray<number | string> | undefined
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  Users,
  CalendarCheck,
  Euro,
  TrendingUp,
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  X,
  Check,
  Clock,
  UserCheck,
  Ban,
  Eye,
  Edit3,
  Shield,
  Loader2,
  FileText,
  Trash2,
  QrCode,
  CheckCircle2,
  XCircle,
  CalendarPlus,
  Download,
  Mail,
  Megaphone,
  Send,
  Banknote,
  BadgeCheck,
  Phone,
} from "lucide-react"
import { clsx } from "clsx"
import { useToast } from "@/components/ui/Toast"
import { EmptyState } from "@/components/admin/EmptyState"
import { TableSkeleton } from "@/components/admin/TableSkeleton"
import { ConfirmDialog } from "@/components/admin/ConfirmDialog"

/* ============================================================
   TYPES
   ============================================================ */

interface Stats {
  totalUsers: number
  bookingsThisMonth: number
  revenueThisMonth: number
  activeCards: number
  activeSubscriptions: number
  popularCourseName: string
  occupancyRate: number
  revenueBreakdown: { type: string; amount: number }[]
}

interface AdminSession {
  id: string
  date: string
  startTime: string
  endTime: string
  status: string
  maxParticipants: number
  currentParticipants: number
  bookingCount: number
  notes: string | null
  courseType: { id: string; name: string; slug: string; color: string | null }
  instructor: { id: string; name: string }
}

interface AdminBooking {
  id: string
  status: string
  paymentMethod: string
  createdAt: string
  cancelledAt: string | null
  user: { id: string; name: string; email: string }
  sessionDate: string
  startTime: string
  courseName: string
  courseSlug: string
  instructor: string
}

interface UnpaidGroup {
  user: { id: string; name: string; email: string; phone: string | null }
  bookings: {
    id: string
    status: string
    paymentMethod: string
    sessionDate: string
    startTime: string
    courseName: string
    instructor: string
    amount: number
  }[]
  totalAmount: number
  totalCount: number
}

interface AdminUser {
  id: string
  name: string
  email: string
  role: string
  createdAt: string
  totalBookings: number
  activeCard: { type: string; remainingSessions: number } | null
}

interface AdminBlogPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  coverImage: string | null
  published: boolean
  publishedAt: string | null
  authorName: string
  tags: string[]
}

/* ============================================================
   HELPERS
   ============================================================ */


function downloadCSV(filename: string, headers: string[], rows: string[][]) {
  const BOM = "\uFEFF"
  const esc = (v: string) =>
    v.includes(";") || v.includes('"') || v.includes("\n")
      ? `"${v.replace(/"/g, '""')}"`
      : v
  const csv =
    BOM +
    [headers.join(";"), ...rows.map((r) => r.map(esc).join(";"))].join("\n")
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
function formatPrice(cents: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100)
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

function formatTime(time: string): string {
  const [h, m] = time.split(":")
  return m === "00" ? `${h}h` : `${h}h${m}`
}

function getMonday(d: Date): Date {
  const date = new Date(d)
  const day = date.getDay()
  date.setDate(date.getDate() - ((day + 6) % 7))
  date.setHours(0, 0, 0, 0)
  return date
}

function formatWeekRange(monday: Date): string {
  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)
  const mStr = monday.toLocaleDateString("fr-FR", { day: "numeric", month: "short" })
  const sStr = sunday.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })
  return `${mStr} — ${sStr}`
}

const statusLabels: Record<string, string> = {
  CONFIRMED: "Confirmé",
  WAITLIST: "Liste d'attente",
  CANCELLED: "Annulé",
  ATTENDED: "Présent",
}

const statusColors: Record<string, string> = {
  CONFIRMED: "bg-emerald-100 text-emerald-700",
  WAITLIST: "bg-amber-100 text-amber-700",
  CANCELLED: "bg-red-100 text-red-700",
  ATTENDED: "bg-blue-100 text-blue-700",
}

const roleLabels: Record<string, string> = {
  USER: "Utilisateur",
  ADMIN: "Administrateur",
  INSTRUCTOR: "Instructeur",
}

const roleColors: Record<string, string> = {
  USER: "bg-gray-100 text-gray-700",
  ADMIN: "bg-purple-100 text-purple-700",
  INSTRUCTOR: "bg-mp-ocean/10 text-mp-ocean-dark",
}

const revenueTypeLabels: Record<string, string> = {
  BOOKING: "Réservations",
  CARD: "Cartes de cours",
  SUBSCRIPTION: "Abonnements",
  GIFT_CARD: "Cartes cadeaux",
}

/* ============================================================
   STATUS BADGE
   ============================================================ */

function StatusBadge({ status, map, colors }: { status: string; map: Record<string, string>; colors: Record<string, string> }) {
  return (
    <span className={clsx("inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium", colors[status] ?? "bg-gray-100 text-gray-600")}>
      {map[status] ?? status}
    </span>
  )
}

/* ============================================================
   MODAL
   ============================================================ */

function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  const dialogRef = React.useRef<HTMLDivElement>(null)
  const previouslyFocused = React.useRef<HTMLElement | null>(null)

  React.useEffect(() => {
    if (!open) return
    previouslyFocused.current = document.activeElement as HTMLElement | null
    // Focus first focusable element inside the dialog
    const focusTimer = window.setTimeout(() => {
      const focusables = dialogRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
      focusables?.[0]?.focus()
    }, 0)

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault()
        onClose()
        return
      }
      if (e.key === "Tab" && dialogRef.current) {
        const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
        if (focusables.length === 0) return
        const first = focusables[0]!
        const last = focusables[focusables.length - 1]!
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener("keydown", onKey)
    return () => {
      window.clearTimeout(focusTimer)
      document.removeEventListener("keydown", onKey)
      previouslyFocused.current?.focus?.()
    }
  }, [open, onClose])

  if (!open) return null
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-modal-title"
    >
      <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden="true" />
      <div ref={dialogRef} className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h3 id="admin-modal-title" className="font-heading text-lg font-semibold text-mp-charcoal">{title}</h3>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-100 transition-colors" aria-label="Fermer">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}

/* ============================================================
   MAIN COMPONENT
   ============================================================ */

const tabs = [
  { id: "sessions", label: "Séances" },
  { id: "bookings", label: "Réservations" },
  { id: "unpaid", label: "Impayés" },
  { id: "users", label: "Membres" },
  { id: "revenue", label: "Revenus" },
  { id: "analytics", label: "Analytics" },
  { id: "blog", label: "Blog" },
  { id: "messages", label: "Messages" },
] as const

type TabId = (typeof tabs)[number]["id"]

export default function AdminPage() {
  const { data: authSession, status: authStatus } = useSession()
  const router = useRouter()
  const toast = useToast()
  const userRole = (authSession?.user as { role?: string } | undefined)?.role
  const isAdmin = userRole === "ADMIN" || userRole === "INSTRUCTOR"

  const [activeTab, setActiveTab] = useState<TabId>("sessions")
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<
    | { kind: "auth"; message: string }
    | { kind: "forbidden"; message: string }
    | { kind: "server"; message: string }
    | null
  >(null)
  const [statsReloadToken, setStatsReloadToken] = useState(0)

  // Redirect non-admin users
  useEffect(() => {
    if (authStatus === "unauthenticated") {
      router.push("/connexion")
    } else if (authStatus === "authenticated" && !isAdmin) {
      router.push("/compte")
    }
  }, [authStatus, isAdmin, router])

  // Sessions state
  const [weekDate, setWeekDate] = useState(() => getMonday(new Date()))
  const [sessions, setSessions] = useState<AdminSession[]>([])
  const [sessionsLoading, setSessionsLoading] = useState(false)
  const [showCreateSession, setShowCreateSession] = useState(false)
  const [showSessionBookings, setShowSessionBookings] = useState<string | null>(null)

  // Bookings state
  const [bookings, setBookings] = useState<AdminBooking[]>([])
  const [bookingsTotal, setBookingsTotal] = useState(0)
  const [bookingsLoading, setBookingsLoading] = useState(false)
  const [bookingSearch, setBookingSearch] = useState("")
  const [bookingPage, setBookingPage] = useState(0)

  // Users state
  const [users, setUsers] = useState<AdminUser[]>([])
  const [usersTotal, setUsersTotal] = useState(0)
  const [usersLoading, setUsersLoading] = useState(false)
  const [userSearch, setUserSearch] = useState("")
  const [userPage, setUserPage] = useState(0)

  // Blog state
  const [blogPosts, setBlogPosts] = useState<AdminBlogPost[]>([])
  const [blogLoading, setBlogLoading] = useState(false)
  const [showBlogForm, setShowBlogForm] = useState(false)
  const [editingBlogPost, setEditingBlogPost] = useState<AdminBlogPost | null>(null)

  // Unpaid state
  const [unpaidGroups, setUnpaidGroups] = useState<UnpaidGroup[]>([])
  const [unpaidTotal, setUnpaidTotal] = useState({ amount: 0, count: 0 })
  const [unpaidLoading, setUnpaidLoading] = useState(false)

  // Confirm dialog for destructive actions (replaces raw confirm())
  const [confirm, setConfirm] = useState<{
    title: string
    description: React.ReactNode
    confirmLabel: string
    variant?: "danger" | "default"
    onConfirm: () => void | Promise<void>
  } | null>(null)
  const [confirmBusy, setConfirmBusy] = useState(false)

  // Generate sessions state
  const [showGenerateModal, setShowGenerateModal] = useState(false)
  const [generateWeeks, setGenerateWeeks] = useState(4)
  const [generateLoading, setGenerateLoading] = useState(false)
  const [generateResult, setGenerateResult] = useState<{ created: number; skipped: number } | null>(null)

  // Create session form
  const [newSession, setNewSession] = useState({
    courseTypeId: "",
    instructorId: "",
    date: "",
    startTime: "09:00",
    endTime: "10:00",
    maxParticipants: "8",
  })

  // Lookup lists populated on-demand to feed the Nouvelle séance selects
  const [sessionCourseTypes, setSessionCourseTypes] = useState<
    { id: string; name: string; maxParticipants: number }[]
  >([])
  const [sessionInstructors, setSessionInstructors] = useState<
    { id: string; name: string }[]
  >([])

  // Fetch stats (only when authenticated as admin)
  useEffect(() => {
    if (authStatus !== "authenticated" || !isAdmin) return
    setLoading(true)
    setError(null)
    fetch("/api/admin/stats")
      .then(async (r) => {
        if (r.status === 401) throw new Error("auth")
        if (r.status === 403) throw new Error("forbidden")
        if (!r.ok) throw new Error("server")
        return r.json()
      })
      .then((data) => {
        setStats(data)
      })
      .catch((err: Error) => {
        if (err.message === "auth") {
          setError({
            kind: "auth",
            message: "Votre session a expiré. Reconnectez-vous pour continuer.",
          })
        } else if (err.message === "forbidden") {
          setError({
            kind: "forbidden",
            message: "Accès réservé aux administrateurs.",
          })
        } else {
          setError({
            kind: "server",
            message: "Impossible de charger les statistiques. Vérifiez votre connexion puis réessayez.",
          })
        }
      })
      .finally(() => setLoading(false))
  }, [authStatus, isAdmin, statsReloadToken])

  // Fetch sessions
  const fetchSessions = useCallback(() => {
    setSessionsLoading(true)
    const ws = weekDate.toISOString().split("T")[0]
    fetch(`/api/admin/sessions?weekStart=${ws}`)
      .then((r) => r.json())
      .then((data) => setSessions(data.sessions ?? []))
      .catch(() => {})
      .finally(() => setSessionsLoading(false))
  }, [weekDate])

  useEffect(() => {
    if (activeTab === "sessions" && authStatus === "authenticated" && isAdmin) fetchSessions()
  }, [activeTab, fetchSessions, authStatus, isAdmin])

  // Lazy-load course types + instructors for the "Nouvelle séance" modal.
  // We only want to hit the network once the modal actually opens.
  useEffect(() => {
    if (!showCreateSession) return
    if (sessionCourseTypes.length === 0) {
      fetch("/api/admin/course-types")
        .then((r) => r.json())
        .then((data) => setSessionCourseTypes(data.courseTypes ?? []))
        .catch(() => {})
    }
    if (sessionInstructors.length === 0) {
      fetch("/api/admin/instructors")
        .then((r) => r.json())
        .then((data) => setSessionInstructors(data.instructors ?? []))
        .catch(() => {})
    }
  }, [showCreateSession, sessionCourseTypes.length, sessionInstructors.length])

  // Fetch bookings
  const fetchBookings = useCallback(() => {
    setBookingsLoading(true)
    const params = new URLSearchParams({ limit: "20", offset: String(bookingPage * 20) })
    if (bookingSearch) params.set("search", bookingSearch)
    fetch(`/api/admin/bookings?${params}`)
      .then((r) => r.json())
      .then((data) => {
        setBookings(data.bookings ?? [])
        setBookingsTotal(data.total ?? 0)
      })
      .catch(() => {})
      .finally(() => setBookingsLoading(false))
  }, [bookingSearch, bookingPage])

  useEffect(() => {
    if (activeTab === "bookings") fetchBookings()
  }, [activeTab, fetchBookings])

  // Fetch users
  const fetchUsers = useCallback(() => {
    setUsersLoading(true)
    const params = new URLSearchParams({ limit: "20", offset: String(userPage * 20) })
    if (userSearch) params.set("search", userSearch)
    fetch(`/api/admin/users?${params}`)
      .then((r) => r.json())
      .then((data) => {
        setUsers(data.users ?? [])
        setUsersTotal(data.total ?? 0)
      })
      .catch(() => {})
      .finally(() => setUsersLoading(false))
  }, [userSearch, userPage])

  useEffect(() => {
    if (activeTab === "users") fetchUsers()
  }, [activeTab, fetchUsers])

  // Fetch blog posts
  const fetchBlogPosts = useCallback(() => {
    setBlogLoading(true)
    fetch("/api/admin/blog")
      .then((r) => r.json())
      .then((data) => setBlogPosts(data.posts ?? []))
      .catch(() => {})
      .finally(() => setBlogLoading(false))
  }, [])

  useEffect(() => {
    if (activeTab === "blog") fetchBlogPosts()
  }, [activeTab, fetchBlogPosts])

  // Fetch unpaid
  const fetchUnpaid = useCallback(() => {
    setUnpaidLoading(true)
    fetch("/api/admin/unpaid")
      .then((r) => r.json())
      .then((data) => {
        setUnpaidGroups(data.grouped ?? [])
        setUnpaidTotal({ amount: data.grandTotal ?? 0, count: data.grandCount ?? 0 })
      })
      .catch(() => {})
      .finally(() => setUnpaidLoading(false))
  }, [])

  useEffect(() => {
    if (activeTab === "unpaid" && authStatus === "authenticated" && isAdmin) fetchUnpaid()
  }, [activeTab, fetchUnpaid, authStatus, isAdmin])

  const markUserPaid = (userId: string) => {
    const group = unpaidGroups.find((g) => g.user.id === userId)
    const name = group?.user.name ?? "ce membre"
    const amount = group ? ` (${formatPrice(group.totalAmount)})` : ""
    setConfirm({
      title: "Marquer toutes les séances comme payées ?",
      description: (
        <>
          Toutes les séances impayées de <strong>{name}</strong>{amount} seront
          marquées comme réglées. Cette action est réversible depuis la fiche
          membre.
        </>
      ),
      confirmLabel: "Marquer payé",
      variant: "default",
      onConfirm: async () => {
        setConfirmBusy(true)
        try {
          const res = await fetch("/api/admin/unpaid", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId }),
          })
          if (res.ok) {
            toast.success("Séances marquées comme payées.")
            // Optimistic: remove the group from the local list immediately
            setUnpaidGroups((prev) => prev.filter((g) => g.user.id !== userId))
            setUnpaidTotal((prev) => ({
              amount: Math.max(0, prev.amount - (group?.totalAmount ?? 0)),
              count: Math.max(0, prev.count - (group?.totalCount ?? 0)),
            }))
          } else {
            toast.error("Erreur lors du marquage.")
            fetchUnpaid()
          }
        } finally {
          setConfirmBusy(false)
          setConfirm(null)
        }
      },
    })
  }

  const markBookingPaid = async (bookingId: string) => {
    const res = await fetch("/api/admin/unpaid", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookingIds: [bookingId] }),
    })
    if (res.ok) toast.success("Séance encaissée.")
    else toast.error("Erreur lors de l'encaissement.")
    fetchUnpaid()
  }

  // Blog actions
  const deleteBlogPost = (id: string) => {
    const post = blogPosts.find((p) => p.id === id)
    const title = post?.title ?? "cet article"
    setConfirm({
      title: "Supprimer l'article ?",
      description: (
        <>
          L&apos;article <strong>“{title}”</strong> sera supprimé
          définitivement. Cette action est irréversible.
        </>
      ),
      confirmLabel: "Supprimer",
      variant: "danger",
      onConfirm: async () => {
        setConfirmBusy(true)
        try {
          // Optimistic removal
          const previous = blogPosts
          setBlogPosts((prev) => prev.filter((p) => p.id !== id))
          const res = await fetch(`/api/admin/blog?id=${id}`, { method: "DELETE" })
          if (res.ok) {
            toast.success("Article supprimé.")
          } else {
            // Rollback on failure
            setBlogPosts(previous)
            toast.error("Suppression impossible.")
          }
        } finally {
          setConfirmBusy(false)
          setConfirm(null)
        }
      },
    })
  }

  const saveBlogPost = async (data: {
    id?: string
    title: string
    slug: string
    excerpt: string
    content: string
    coverImage: string
    tags: string[]
    published: boolean
  }) => {
    const res = data.id
      ? await fetch("/api/admin/blog", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        })
      : await fetch("/api/admin/blog", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        })
    if (res.ok) toast.success(data.id ? "Article mis à jour." : "Article publié.")
    else toast.error("Enregistrement impossible.")
    setShowBlogForm(false)
    setEditingBlogPost(null)
    fetchBlogPosts()
  }

  // Actions
  const updateBookingStatus = async (id: string, status: string) => {
    const res = await fetch("/api/admin/bookings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    })
    if (res.ok) toast.success("Statut de la réservation mis à jour.")
    else toast.error("Mise à jour impossible.")
    fetchBookings()
  }

  const updateUserRole = async (id: string, role: string) => {
    const res = await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, role }),
    })
    if (res.ok) toast.success("Rôle mis à jour.")
    else toast.error("Mise à jour impossible.")
    fetchUsers()
  }

  const generateSessions = async () => {
    setGenerateLoading(true)
    setGenerateResult(null)
    try {
      const res = await fetch("/api/admin/generate-sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ weeksAhead: generateWeeks }),
      })
      if (res.ok) {
        const data = await res.json()
        setGenerateResult({ created: data.created, skipped: data.skipped })
        toast.success(`${data.created} séance${data.created !== 1 ? "s" : ""} générée${data.created !== 1 ? "s" : ""}.`)
        fetchSessions()
      } else {
        const data = await res.json().catch(() => ({}))
        toast.error(data.error || "Erreur lors de la génération.")
      }
    } catch {
      toast.error("Erreur de connexion.")
    } finally {
      setGenerateLoading(false)
    }
  }

  const cancelSession = (id: string) => {
    const target = sessions.find((s) => s.id === id)
    const label = target
      ? `${target.courseType.name} du ${formatDate(target.date)} à ${formatTime(target.startTime)}`
      : "cette séance"
    const bookingInfo =
      target && target.bookingCount > 0
        ? ` ${target.bookingCount} réservation${target.bookingCount > 1 ? "s" : ""} sera${target.bookingCount > 1 ? "ont" : ""} également annulée${target.bookingCount > 1 ? "s" : ""}.`
        : ""
    setConfirm({
      title: "Annuler la séance ?",
      description: (
        <>
          <strong>{label}</strong> sera annulée.{bookingInfo} Les élèves
          concernés seront notifiés.
        </>
      ),
      confirmLabel: "Annuler la séance",
      variant: "danger",
      onConfirm: async () => {
        setConfirmBusy(true)
        try {
          // Optimistic update: mark status locally
          const previous = sessions
          setSessions((prev) =>
            prev.map((s) => (s.id === id ? { ...s, status: "CANCELLED" } : s))
          )
          const res = await fetch(`/api/admin/sessions?id=${id}`, { method: "DELETE" })
          if (res.ok) {
            toast.success("Séance annulée.")
          } else {
            setSessions(previous)
            toast.error("Annulation impossible.")
          }
        } finally {
          setConfirmBusy(false)
          setConfirm(null)
        }
      },
    })
  }

  const createSession = async () => {
    const res = await fetch("/api/admin/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newSession),
    })
    if (res.ok) {
      toast.success("Séance créée.")
      setShowCreateSession(false)
      setNewSession({ courseTypeId: "", instructorId: "", date: "", startTime: "09:00", endTime: "10:00", maxParticipants: "8" })
      fetchSessions()
    } else {
      const data = await res.json().catch(() => ({}))
      toast.error(data.error || "Création impossible.")
    }
  }

  // Error / loading states
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-mp-cream">
        <Loader2 className="w-8 h-8 animate-spin text-mp-ocean" />
        <span className="sr-only">Chargement de l&apos;administration…</span>
      </div>
    )
  }

  if (error) {
    const isAuth = error.kind === "auth"
    const isForbidden = error.kind === "forbidden"
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-mp-cream gap-4 px-6 text-center">
        <Shield className={clsx("w-12 h-12", isForbidden ? "text-red-400" : "text-amber-400")} />
        <p className="font-heading text-lg text-mp-charcoal max-w-md">{error.message}</p>
        <div className="flex items-center gap-3">
          {isAuth ? (
            <Link
              href="/connexion"
              className="mp-btn mp-btn-primary !text-sm !py-2 !px-4"
            >
              Se reconnecter
            </Link>
          ) : isForbidden ? (
            <Link href="/" className="text-mp-ocean hover:underline text-sm">
              Retour au site
            </Link>
          ) : (
            <>
              <button
                onClick={() => setStatsReloadToken((n) => n + 1)}
                className="mp-btn mp-btn-primary !text-sm !py-2 !px-4"
              >
                Réessayer
              </button>
              <Link href="/" className="text-mp-ocean hover:underline text-sm">
                Retour au site
              </Link>
            </>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-sm text-mp-text-light hover:text-mp-ocean transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour au site
            </Link>
            <div className="h-5 w-px bg-gray-200" />
            <h1 className="font-heading text-xl font-bold text-mp-charcoal">Administration</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats cards */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              icon={<Users className="w-5 h-5" />}
              label="Total membres"
              value={String(stats.totalUsers)}
              color="bg-purple-50 text-purple-600"
            />
            <StatCard
              icon={<CalendarCheck className="w-5 h-5" />}
              label="Réservations ce mois"
              value={String(stats.bookingsThisMonth)}
              color="bg-emerald-50 text-emerald-600"
            />
            <StatCard
              icon={<Euro className="w-5 h-5" />}
              label="Revenus ce mois"
              value={formatPrice(stats.revenueThisMonth)}
              color="bg-blue-50 text-blue-600"
            />
            <StatCard
              icon={<TrendingUp className="w-5 h-5" />}
              label="Taux d'occupation"
              value={`${stats.occupancyRate}%`}
              color="bg-amber-50 text-amber-600"
            />
          </div>
        )}

        {/* Admin CRUD shortcuts */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Link
            href="/admin/instructors"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-mp-charcoal hover:border-mp-ocean hover:text-mp-ocean transition-colors"
          >
            <UserCheck className="w-4 h-4" />
            Coachs
          </Link>
          <Link
            href="/admin/course-types"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-mp-charcoal hover:border-mp-ocean hover:text-mp-ocean transition-colors"
          >
            <BadgeCheck className="w-4 h-4" />
            Types de cours
          </Link>
          <Link
            href="/admin/schedules"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-mp-charcoal hover:border-mp-ocean hover:text-mp-ocean transition-colors"
          >
            <Clock className="w-4 h-4" />
            Plannings
          </Link>
          <Link
            href="/admin/contact"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-mp-charcoal hover:border-mp-ocean hover:text-mp-ocean transition-colors"
          >
            <Phone className="w-4 h-4" />
            Contact
          </Link>
          <Link
            href="/admin/emails/templates"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-mp-charcoal hover:border-mp-ocean hover:text-mp-ocean transition-colors"
          >
            <Mail className="w-4 h-4" />
            Templates
          </Link>
          <Link
            href="/admin/emails/campaigns"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-mp-charcoal hover:border-mp-ocean hover:text-mp-ocean transition-colors"
          >
            <Megaphone className="w-4 h-4" />
            Campagnes
          </Link>
          <Link
            href="/admin/emails/logs"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-mp-charcoal hover:border-mp-ocean hover:text-mp-ocean transition-colors"
          >
            <FileText className="w-4 h-4" />
            Logs emails
          </Link>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex gap-0 -mb-px overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={clsx(
                  "px-5 py-3 font-heading text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
                  activeTab === tab.id
                    ? "border-mp-ocean text-mp-ocean"
                    : "border-transparent text-gray-500 hover:text-mp-charcoal hover:border-gray-300"
                )}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab content */}
        {activeTab === "sessions" && (
          <SessionsTab
            sessions={sessions}
            loading={sessionsLoading}
            weekDate={weekDate}
            onWeekChange={setWeekDate}
            onCancel={cancelSession}
            onShowBookings={setShowSessionBookings}
            onShowCreate={() => setShowCreateSession(true)}
            onShowGenerate={() => { setGenerateResult(null); setShowGenerateModal(true) }}
          />
        )}

        {activeTab === "bookings" && (
          <BookingsTab
            bookings={bookings}
            total={bookingsTotal}
            loading={bookingsLoading}
            page={bookingPage}
            search={bookingSearch}
            onSearchChange={(s) => { setBookingSearch(s); setBookingPage(0) }}
            onPageChange={setBookingPage}
            onUpdateStatus={updateBookingStatus}
          />
        )}

        {activeTab === "unpaid" && (
          <UnpaidTab
            groups={unpaidGroups}
            totalAmount={unpaidTotal.amount}
            totalCount={unpaidTotal.count}
            loading={unpaidLoading}
            onMarkUserPaid={markUserPaid}
            onMarkBookingPaid={markBookingPaid}
          />
        )}

        {activeTab === "users" && (
          <UsersTab
            users={users}
            total={usersTotal}
            loading={usersLoading}
            page={userPage}
            search={userSearch}
            onSearchChange={(s) => { setUserSearch(s); setUserPage(0) }}
            onPageChange={setUserPage}
            onUpdateRole={updateUserRole}
          />
        )}

        {activeTab === "revenue" && stats && <RevenueTab stats={stats} />}

        {activeTab === "analytics" && <AnalyticsTab />}

        {activeTab === "blog" && (
          <BlogTab
            posts={blogPosts}
            loading={blogLoading}
            onEdit={(p) => { setEditingBlogPost(p); setShowBlogForm(true) }}
            onDelete={deleteBlogPost}
            onCreate={() => { setEditingBlogPost(null); setShowBlogForm(true) }}
          />
        )}

        {activeTab === "messages" && <MessagesTab stats={stats} />}
      </main>

      {/* Blog form modal */}
      <Modal
        open={showBlogForm}
        onClose={() => { setShowBlogForm(false); setEditingBlogPost(null) }}
        title={editingBlogPost ? "Modifier l'article" : "Nouvel article"}
      >
        <BlogForm
          post={editingBlogPost}
          onSave={saveBlogPost}
          onCancel={() => { setShowBlogForm(false); setEditingBlogPost(null) }}
        />
      </Modal>

      {/* Create session modal */}
      <Modal open={showCreateSession} onClose={() => setShowCreateSession(false)} title="Nouvelle séance">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type de cours</label>
            <select
              value={newSession.courseTypeId}
              onChange={(e) => {
                const id = e.target.value
                const match = sessionCourseTypes.find((c) => c.id === id)
                setNewSession({
                  ...newSession,
                  courseTypeId: id,
                  maxParticipants: match ? String(match.maxParticipants) : newSession.maxParticipants,
                })
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-mp-ocean focus:border-mp-ocean bg-white"
            >
              <option value="">— Choisir un type de cours —</option>
              {sessionCourseTypes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Instructeur</label>
            <select
              value={newSession.instructorId}
              onChange={(e) => setNewSession({ ...newSession, instructorId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-mp-ocean focus:border-mp-ocean bg-white"
            >
              <option value="">— Choisir un instructeur —</option>
              {sessionInstructors.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              value={newSession.date}
              onChange={(e) => setNewSession({ ...newSession, date: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-mp-ocean focus:border-mp-ocean"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Début</label>
              <input
                type="time"
                value={newSession.startTime}
                onChange={(e) => setNewSession({ ...newSession, startTime: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-mp-ocean focus:border-mp-ocean"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fin</label>
              <input
                type="time"
                value={newSession.endTime}
                onChange={(e) => setNewSession({ ...newSession, endTime: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-mp-ocean focus:border-mp-ocean"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Places max</label>
            <input
              type="number"
              value={newSession.maxParticipants}
              onChange={(e) => setNewSession({ ...newSession, maxParticipants: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-mp-ocean focus:border-mp-ocean"
              min="1"
            />
          </div>
          <button
            onClick={createSession}
            className="w-full mp-btn mp-btn-primary !text-sm"
          >
            Créer la séance
          </button>
        </div>
      </Modal>

      {/* Session bookings modal */}
      <Modal
        open={!!showSessionBookings}
        onClose={() => setShowSessionBookings(null)}
        title="Inscrits à la séance"
      >
        <SessionBookingsList sessionId={showSessionBookings} />
      </Modal>

      {/* Generate sessions modal */}
      <Modal open={showGenerateModal} onClose={() => setShowGenerateModal(false)} title="Générer les séances">
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Génère automatiquement les séances à partir des plannings récurrents.
          </p>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de semaines</label>
            <input
              type="number"
              value={generateWeeks}
              onChange={(e) => setGenerateWeeks(Math.max(1, Math.min(12, parseInt(e.target.value) || 1)))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-mp-ocean focus:border-mp-ocean"
              min={1}
              max={12}
            />
          </div>
          {generateResult && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-sm text-emerald-800">
              {generateResult.created} séance{generateResult.created !== 1 ? "s" : ""} créée{generateResult.created !== 1 ? "s" : ""}, {generateResult.skipped} déjà existante{generateResult.skipped !== 1 ? "s" : ""}
            </div>
          )}
          <button
            onClick={generateSessions}
            disabled={generateLoading}
            className="w-full mp-btn mp-btn-primary !text-sm flex items-center justify-center gap-2"
          >
            {generateLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CalendarPlus className="w-4 h-4" />}
            {generateLoading ? "Génération en cours…" : "Générer"}
          </button>
        </div>
      </Modal>

      {/* Destructive-action confirm dialog (shared) */}
      <ConfirmDialog
        open={confirm !== null}
        title={confirm?.title ?? ""}
        description={confirm?.description ?? ""}
        confirmLabel={confirm?.confirmLabel ?? "Confirmer"}
        variant={confirm?.variant ?? "danger"}
        loading={confirmBusy}
        onConfirm={() => confirm?.onConfirm()}
        onCancel={() => {
          if (!confirmBusy) setConfirm(null)
        }}
      />
    </div>
  )
}

/* ============================================================
   STAT CARD
   ============================================================ */

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 flex items-center gap-4 shadow-sm">
      <div className={clsx("w-11 h-11 rounded-xl flex items-center justify-center", color)}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-xl font-heading font-bold text-mp-charcoal">{value}</p>
      </div>
    </div>
  )
}

/* ============================================================
   SESSIONS TAB
   ============================================================ */

function SessionsTab({
  sessions,
  loading,
  weekDate,
  onWeekChange,
  onCancel,
  onShowBookings,
  onShowCreate,
  onShowGenerate,
}: {
  sessions: AdminSession[]
  loading: boolean
  weekDate: Date
  onWeekChange: (d: Date) => void
  onCancel: (id: string) => void
  onShowBookings: (id: string) => void
  onShowCreate: () => void
  onShowGenerate: () => void
}) {
  const prevWeek = () => {
    const d = new Date(weekDate)
    d.setDate(d.getDate() - 7)
    onWeekChange(d)
  }
  const nextWeek = () => {
    const d = new Date(weekDate)
    d.setDate(d.getDate() + 7)
    onWeekChange(d)
  }

  return (
    <div>
      {/* Check-in panel (today's sessions + QR code) */}
      <CheckinPanel sessions={sessions} />

      {/* Week navigation */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button onClick={prevWeek} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="font-heading text-sm font-medium text-mp-charcoal min-w-[200px] text-center">
            {formatWeekRange(weekDate)}
          </span>
          <button onClick={nextWeek} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const hdrs = ["Date", "Heure", "Cours", "Instructeur", "Inscrits", "Max", "Taux"]
              const rws = sessions.map((s) => [
                formatDate(s.date),
                formatTime(s.startTime) + " - " + formatTime(s.endTime),
                s.courseType.name,
                s.instructor.name,
                String(s.currentParticipants),
                String(s.maxParticipants),
                Math.round((s.currentParticipants / s.maxParticipants) * 100) + "%",
              ])
              downloadCSV("seances-" + weekDate.toISOString().split("T")[0] + ".csv", hdrs, rws)
            }}
            className="mp-btn mp-btn-secondary !text-sm !py-2.5 !px-4"
            title="Exporter CSV"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Exporter CSV</span>
          </button>
          <button onClick={onShowGenerate} className="mp-btn mp-btn-secondary !text-sm !py-2.5 !px-4">
            <CalendarPlus className="w-4 h-4" />
            <span className="hidden sm:inline">Générer les séances</span>
          </button>
          <button onClick={onShowCreate} className="mp-btn mp-btn-primary !text-sm !py-2.5 !px-5">
            <Plus className="w-4 h-4" />
            Nouvelle séance
          </button>
        </div>
      </div>

      {loading ? (
        <TableSkeleton rows={5} columns={7} label="Chargement des séances…" />
      ) : sessions.length === 0 ? (
        <EmptyState
          icon={CalendarPlus}
          title="Aucune séance cette semaine"
          description="Générez automatiquement les séances à partir des plannings, ou créez-en une nouvelle manuellement."
          action={{
            label: "Nouvelle séance",
            onClick: onShowCreate,
            icon: Plus,
          }}
        />
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Heure</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Cours</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Prof</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Inscrits/Max</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {sessions.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3 text-sm">{formatDate(s.date)}</td>
                    <td className="px-4 py-3 text-sm">{formatTime(s.startTime)} — {formatTime(s.endTime)}</td>
                    <td className="px-4 py-3 text-sm font-medium">{s.courseType.name}</td>
                    <td className="px-4 py-3 text-sm">{s.instructor.name}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={clsx(
                        "font-medium",
                        s.currentParticipants >= s.maxParticipants ? "text-red-600" : "text-mp-charcoal"
                      )}>
                        {s.currentParticipants}
                      </span>
                      /{s.maxParticipants}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={s.status === "SCHEDULED" ? "CONFIRMED" : s.status} map={{ ...statusLabels, CONFIRMED: "Planifiée" }} colors={{ ...statusColors, CONFIRMED: "bg-emerald-100 text-emerald-700" }} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onShowBookings(s.id)}
                          className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-mp-ocean"
                          title="Voir les inscrits"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {s.status === "SCHEDULED" && (
                          <button
                            onClick={() => onCancel(s.id)}
                            className="p-1.5 rounded-lg hover:bg-red-50 transition-colors text-gray-400 hover:text-red-600"
                            title="Annuler"
                          >
                            <Ban className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {sessions.map((s) => (
              <div key={s.id} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-heading font-semibold text-sm">{s.courseType.name}</span>
                  <StatusBadge status={s.status === "SCHEDULED" ? "CONFIRMED" : s.status} map={{ ...statusLabels, CONFIRMED: "Planifiée" }} colors={{ ...statusColors, CONFIRMED: "bg-emerald-100 text-emerald-700" }} />
                </div>
                <div className="text-sm text-gray-500 space-y-1">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5" />
                    {formatDate(s.date)} · {formatTime(s.startTime)}—{formatTime(s.endTime)}
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5" />
                    {s.instructor.name} · {s.currentParticipants}/{s.maxParticipants} inscrits
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                  <button
                    onClick={() => onShowBookings(s.id)}
                    className="text-xs text-mp-ocean hover:underline flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" /> Inscrits
                  </button>
                  {s.status === "SCHEDULED" && (
                    <button
                      onClick={() => onCancel(s.id)}
                      className="text-xs text-red-500 hover:underline flex items-center gap-1 ml-auto"
                    >
                      <Ban className="w-3.5 h-3.5" /> Annuler
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

/* ============================================================
   SESSION BOOKINGS LIST (inside modal)
   ============================================================ */

function SessionBookingsList({ sessionId }: { sessionId: string | null }) {
  const [bookings, setBookings] = useState<AdminBooking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!sessionId) return
    setLoading(true)
    fetch(`/api/admin/bookings?sessionId=${sessionId}`)
      .then((r) => r.json())
      .then((data) => setBookings(data.bookings ?? []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [sessionId])

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="w-5 h-5 animate-spin text-mp-ocean" />
      </div>
    )
  }

  if (bookings.length === 0) {
    return <p className="text-center text-gray-400 py-8">Aucun inscrit.</p>
  }

  return (
    <div className="space-y-2">
      {bookings.map((b) => (
        <div key={b.id} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50">
          <div>
            <p className="text-sm font-medium">{b.user.name}</p>
            <p className="text-xs text-gray-400">{b.user.email}</p>
          </div>
          <StatusBadge status={b.status} map={statusLabels} colors={statusColors} />
        </div>
      ))}
    </div>
  )
}

/* ============================================================
   BOOKINGS TAB
   ============================================================ */

function BookingsTab({
  bookings,
  total,
  loading,
  page,
  search,
  onSearchChange,
  onPageChange,
  onUpdateStatus,
}: {
  bookings: AdminBooking[]
  total: number
  loading: boolean
  page: number
  search: string
  onSearchChange: (s: string) => void
  onPageChange: (p: number) => void
  onUpdateStatus: (id: string, status: string) => void
}) {
  const totalPages = Math.ceil(total / 20)

  return (
    <div>
      {/* Search + Export */}
      <div className="mb-4 flex items-center gap-3">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Rechercher un élève..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-mp-ocean focus:border-mp-ocean"
          />
        </div>
        <button
          onClick={() => {
            const hdrs = ["Date", "Heure", "Cours", "Élève", "Email", "Statut", "Mode paiement"]
            const rws = bookings.map((b) => [
              formatDate(b.sessionDate),
              formatTime(b.startTime),
              b.courseName,
              b.user.name,
              b.user.email,
              statusLabels[b.status] ?? b.status,
              b.paymentMethod,
            ])
            downloadCSV("reservations.csv", hdrs, rws)
          }}
          className="mp-btn mp-btn-secondary !text-sm !py-2.5 !px-4 flex-shrink-0"
          title="Exporter CSV"
        >
          <Download className="w-4 h-4" />
          <span className="hidden sm:inline">Exporter CSV</span>
        </button>
      </div>

      {loading ? (
        <TableSkeleton rows={6} columns={6} label="Chargement des réservations…" />
      ) : bookings.length === 0 ? (
        <EmptyState
          icon={CalendarCheck}
          title={search ? "Aucun résultat" : "Aucune réservation"}
          description={
            search
              ? `Aucune réservation ne correspond à « ${search} ». Essayez avec un autre terme.`
              : "Les réservations effectuées par vos élèves apparaîtront ici."
          }
          {...(search
            ? {
                action: {
                  label: "Effacer la recherche",
                  onClick: () => onSearchChange(""),
                  icon: X,
                },
              }
            : {})}
        />
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Élève</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Cours</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Paiement</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3 text-sm">{formatDate(b.sessionDate)}</td>
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium">{b.user.name}</div>
                      <div className="text-xs text-gray-400">{b.user.email}</div>
                    </td>
                    <td className="px-4 py-3 text-sm">{b.courseName}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={b.status} map={statusLabels} colors={statusColors} />
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">{b.paymentMethod}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {b.status !== "CONFIRMED" && b.status !== "ATTENDED" && b.status !== "CANCELLED" && (
                          <button
                            onClick={() => onUpdateStatus(b.id, "CONFIRMED")}
                            className="p-1.5 rounded-lg hover:bg-emerald-50 transition-colors text-gray-400 hover:text-emerald-600"
                            title="Confirmer"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        {b.status !== "ATTENDED" && b.status !== "CANCELLED" && (
                          <button
                            onClick={() => onUpdateStatus(b.id, "ATTENDED")}
                            className="p-1.5 rounded-lg hover:bg-blue-50 transition-colors text-gray-400 hover:text-blue-600"
                            title="Marquer présent"
                          >
                            <UserCheck className="w-4 h-4" />
                          </button>
                        )}
                        {b.status !== "CANCELLED" && (
                          <button
                            onClick={() => onUpdateStatus(b.id, "CANCELLED")}
                            className="p-1.5 rounded-lg hover:bg-red-50 transition-colors text-gray-400 hover:text-red-600"
                            title="Annuler"
                          >
                            <Ban className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {bookings.map((b) => (
              <div key={b.id} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-sm font-medium">{b.user.name}</p>
                    <p className="text-xs text-gray-400">{b.user.email}</p>
                  </div>
                  <StatusBadge status={b.status} map={statusLabels} colors={statusColors} />
                </div>
                <div className="text-sm text-gray-500 mb-3">
                  {b.courseName} · {formatDate(b.sessionDate)} · {formatTime(b.startTime)}
                </div>
                <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                  {b.status !== "CONFIRMED" && b.status !== "ATTENDED" && b.status !== "CANCELLED" && (
                    <button onClick={() => onUpdateStatus(b.id, "CONFIRMED")} className="text-xs text-emerald-600 hover:underline flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Confirmer
                    </button>
                  )}
                  {b.status !== "ATTENDED" && b.status !== "CANCELLED" && (
                    <button onClick={() => onUpdateStatus(b.id, "ATTENDED")} className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                      <UserCheck className="w-3.5 h-3.5" /> Présent
                    </button>
                  )}
                  {b.status !== "CANCELLED" && (
                    <button onClick={() => onUpdateStatus(b.id, "CANCELLED")} className="text-xs text-red-500 hover:underline flex items-center gap-1 ml-auto">
                      <Ban className="w-3.5 h-3.5" /> Annuler
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-gray-500">{total} réservation{total > 1 ? "s" : ""}</p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onPageChange(Math.max(0, page - 1))}
                  disabled={page === 0}
                  className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-sm text-gray-600">
                  {page + 1} / {totalPages}
                </span>
                <button
                  onClick={() => onPageChange(Math.min(totalPages - 1, page + 1))}
                  disabled={page >= totalPages - 1}
                  className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

/* ============================================================
   UNPAID TAB
   ============================================================ */

function UnpaidTab({
  groups,
  totalAmount,
  totalCount,
  loading,
  onMarkUserPaid,
  onMarkBookingPaid,
}: {
  groups: UnpaidGroup[]
  totalAmount: number
  totalCount: number
  loading: boolean
  onMarkUserPaid: (userId: string) => void
  onMarkBookingPaid: (bookingId: string) => void
}) {
  const [expandedUser, setExpandedUser] = useState<string | null>(null)

  if (loading) {
    return <TableSkeleton rows={4} columns={4} label="Chargement des impayés…" />
  }

  if (groups.length === 0) {
    return (
      <EmptyState
        icon={BadgeCheck}
        title="Aucun impayé"
        description="Toutes les séances sont réglées. Bravo !"
      />
    )
  }

  return (
    <div className="space-y-4">
      {/* Total summary */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
              <Banknote className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="font-heading text-lg font-bold text-amber-800">
                {formatPrice(totalAmount)} en attente
              </p>
              <p className="text-sm text-amber-700">
                {totalCount} séance{totalCount > 1 ? "s" : ""} impayée{totalCount > 1 ? "s" : ""} · {groups.length} membre{groups.length > 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Grouped by user */}
      <div className="space-y-3">
        {groups.map((group) => {
          const isExpanded = expandedUser === group.user.id
          return (
            <div
              key={group.user.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <button
                onClick={() => setExpandedUser(isExpanded ? null : group.user.id)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-mp-ocean/10 flex items-center justify-center flex-shrink-0">
                    <span className="font-heading font-semibold text-mp-ocean text-sm">
                      {group.user.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-heading font-semibold text-mp-charcoal truncate">
                      {group.user.name}
                    </p>
                    <p className="text-xs text-mp-charcoal-light truncate">
                      {group.user.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 flex-shrink-0">
                  <div className="text-right">
                    <p className="font-heading font-bold text-amber-700">
                      {formatPrice(group.totalAmount)}
                    </p>
                    <p className="text-xs text-mp-charcoal-light">
                      {group.totalCount} séance{group.totalCount > 1 ? "s" : ""}
                    </p>
                  </div>
                  <ChevronRight
                    className={clsx(
                      "w-5 h-5 text-gray-400 transition-transform",
                      isExpanded && "rotate-90"
                    )}
                  />
                </div>
              </button>

              {isExpanded && (
                <div className="border-t border-gray-100">
                  {/* Contact actions */}
                  <div className="flex flex-wrap gap-2 px-4 py-3 bg-gray-50 border-b border-gray-100">
                    <a
                      href={`mailto:${group.user.email}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-xs font-medium text-mp-charcoal hover:bg-mp-ocean hover:text-white hover:border-mp-ocean transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      Email
                    </a>
                    {group.user.phone && (
                      <a
                        href={`tel:${group.user.phone}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-xs font-medium text-mp-charcoal hover:bg-mp-ocean hover:text-white hover:border-mp-ocean transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        {group.user.phone}
                      </a>
                    )}
                    <button
                      onClick={() => onMarkUserPaid(group.user.id)}
                      className="ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-medium hover:bg-emerald-700 transition-colors"
                    >
                      <BadgeCheck className="w-3.5 h-3.5" />
                      Tout marquer payé ({formatPrice(group.totalAmount)})
                    </button>
                  </div>

                  {/* Booking list */}
                  <div className="divide-y divide-gray-100">
                    {group.bookings.map((b) => (
                      <div
                        key={b.id}
                        className="flex items-center justify-between px-4 py-3"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="text-xs text-mp-charcoal-light w-16 flex-shrink-0">
                            {formatDate(b.sessionDate)}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-mp-charcoal text-sm truncate">
                              {b.courseName}
                            </p>
                            <p className="text-xs text-mp-charcoal-light">
                              {formatTime(b.startTime)} · {b.instructor}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="font-heading font-semibold text-mp-charcoal text-sm">
                            {formatPrice(b.amount)}
                          </span>
                          <button
                            onClick={() => onMarkBookingPaid(b.id)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-mp-ocean text-white text-xs font-medium hover:bg-mp-ocean-dark transition-colors"
                            title="Marquer cette séance comme payée"
                          >
                            <BadgeCheck className="w-3 h-3" />
                            Encaisser
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ============================================================
   USERS TAB
   ============================================================ */

function UsersTab({
  users,
  total,
  loading,
  page,
  search,
  onSearchChange,
  onPageChange,
  onUpdateRole,
}: {
  users: AdminUser[]
  total: number
  loading: boolean
  page: number
  search: string
  onSearchChange: (s: string) => void
  onPageChange: (p: number) => void
  onUpdateRole: (id: string, role: string) => void
}) {
  const totalPages = Math.ceil(total / 20)
  const [editingRole, setEditingRole] = useState<string | null>(null)

  return (
    <div>
      {/* Search + Export */}
      <div className="mb-4 flex items-center gap-3">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Rechercher par nom ou email..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-mp-ocean focus:border-mp-ocean"
          />
        </div>
        <button
          onClick={() => {
            const hdrs = ["Nom", "Email", "Rôle", "Inscrit le", "Total cours", "Carte active"]
            const rws = users.map((u) => [
              u.name,
              u.email,
              roleLabels[u.role] ?? u.role,
              formatDate(u.createdAt),
              String(u.totalBookings),
              u.activeCard ? u.activeCard.type + " (" + u.activeCard.remainingSessions + " restantes)" : "Non",
            ])
            downloadCSV("membres.csv", hdrs, rws)
          }}
          className="mp-btn mp-btn-secondary !text-sm !py-2.5 !px-4 flex-shrink-0"
          title="Exporter CSV"
        >
          <Download className="w-4 h-4" />
          <span className="hidden sm:inline">Exporter CSV</span>
        </button>
      </div>

      {loading ? (
        <TableSkeleton rows={6} columns={7} label="Chargement des membres…" />
      ) : users.length === 0 ? (
        <EmptyState
          icon={Users}
          title={search ? "Aucun membre trouvé" : "Aucun membre"}
          description={
            search
              ? `Aucun membre ne correspond à « ${search} ».`
              : "Les membres inscrits apparaîtront ici."
          }
          {...(search
            ? {
                action: {
                  label: "Effacer la recherche",
                  onClick: () => onSearchChange(""),
                  icon: X,
                },
              }
            : {})}
        />
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Rôle</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Inscrit le</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Cours</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Carte active</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium">{u.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{u.email}</td>
                    <td className="px-4 py-3">
                      {editingRole === u.id ? (
                        <select
                          defaultValue={u.role}
                          onChange={(e) => {
                            onUpdateRole(u.id, e.target.value)
                            setEditingRole(null)
                          }}
                          onBlur={() => setEditingRole(null)}
                          autoFocus
                          className="text-xs border border-gray-200 rounded px-2 py-1 focus:ring-2 focus:ring-mp-ocean"
                        >
                          <option value="USER">Utilisateur</option>
                          <option value="ADMIN">Administrateur</option>
                          <option value="INSTRUCTOR">Instructeur</option>
                        </select>
                      ) : (
                        <StatusBadge status={u.role} map={roleLabels} colors={roleColors} />
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">{formatDate(u.createdAt)}</td>
                    <td className="px-4 py-3 text-sm">{u.totalBookings}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {u.activeCard ? `${u.activeCard.type} (${u.activeCard.remainingSessions} restants)` : "—"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => setEditingRole(u.id)}
                        className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-mp-ocean"
                        title="Changer rôle"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {users.map((u) => (
              <div key={u.id} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-sm font-medium">{u.name}</p>
                    <p className="text-xs text-gray-400">{u.email}</p>
                  </div>
                  <StatusBadge status={u.role} map={roleLabels} colors={roleColors} />
                </div>
                <div className="text-sm text-gray-500">
                  Inscrit le {formatDate(u.createdAt)} · {u.totalBookings} cours
                  {u.activeCard && ` · Carte ${u.activeCard.type}`}
                </div>
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                  <button
                    onClick={() => setEditingRole(editingRole === u.id ? null : u.id)}
                    className="text-xs text-mp-ocean hover:underline flex items-center gap-1"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Changer rôle
                  </button>
                  {editingRole === u.id && (
                    <select
                      defaultValue={u.role}
                      onChange={(e) => {
                        onUpdateRole(u.id, e.target.value)
                        setEditingRole(null)
                      }}
                      className="text-xs border border-gray-200 rounded px-2 py-1 ml-2"
                    >
                      <option value="USER">Utilisateur</option>
                      <option value="ADMIN">Administrateur</option>
                      <option value="INSTRUCTOR">Instructeur</option>
                    </select>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-gray-500">{total} membre{total > 1 ? "s" : ""}</p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onPageChange(Math.max(0, page - 1))}
                  disabled={page === 0}
                  className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-sm text-gray-600">
                  {page + 1} / {totalPages}
                </span>
                <button
                  onClick={() => onPageChange(Math.min(totalPages - 1, page + 1))}
                  disabled={page >= totalPages - 1}
                  className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

/* ============================================================
   REVENUE TAB
   ============================================================ */

function RevenueTab({ stats }: { stats: Stats }) {
  return (
    <div className="max-w-xl">
      <div className="flex justify-end mb-4">
        <button
          onClick={() => {
            const hdrs = ["Type", "Montant"]
            const rws = stats.revenueBreakdown.map((item) => [
              revenueTypeLabels[item.type] ?? item.type,
              formatPrice(item.amount),
            ])
            rws.push(["TOTAL", formatPrice(stats.revenueThisMonth)])
            downloadCSV("revenus.csv", hdrs, rws)
          }}
          className="mp-btn mp-btn-secondary !text-sm !py-2.5 !px-4"
          title="Exporter CSV"
        >
          <Download className="w-4 h-4" />
          <span className="hidden sm:inline">Exporter CSV</span>
        </button>
      </div>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Total */}
        <div className="p-6 border-b border-gray-100">
          <p className="text-sm text-gray-500 mb-1">Revenus totaux ce mois</p>
          <p className="text-3xl font-heading font-bold text-mp-charcoal">{formatPrice(stats.revenueThisMonth)}</p>
        </div>

        {/* Breakdown */}
        <div className="divide-y divide-gray-50">
          {stats.revenueBreakdown.length === 0 ? (
            <div className="p-6 text-center text-gray-400 text-sm">Aucun revenu ce mois.</div>
          ) : (
            stats.revenueBreakdown.map((item) => (
              <div key={item.type} className="flex items-center justify-between px-6 py-4">
                <span className="text-sm text-gray-600">{revenueTypeLabels[item.type] ?? item.type}</span>
                <span className="text-sm font-medium text-mp-charcoal">{formatPrice(item.amount)}</span>
              </div>
            ))
          )}
        </div>

        {/* Additional stats */}
        <div className="p-6 border-t border-gray-100 bg-gray-50/50 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Cartes actives</span>
            <span className="text-sm font-medium">{stats.activeCards}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Abonnements actifs</span>
            <span className="text-sm font-medium">{stats.activeSubscriptions}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Cours le plus populaire</span>
            <span className="text-sm font-medium">{stats.popularCourseName}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ============================================================
   CHECK-IN PANEL (used inside SessionsTab)
   ============================================================ */

interface CheckinResult {
  ok: boolean
  userName?: string
  courseName?: string
  time?: string
  error?: string
}

interface AttendanceEntry {
  id: string
  userName: string
  userEmail: string
  status: string
}

function CheckinPanel({ sessions }: { sessions: AdminSession[] }) {
  const [code, setCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<CheckinResult | null>(null)
  const [selectedSession, setSelectedSession] = useState<string | null>(null)
  const [attendance, setAttendance] = useState<AttendanceEntry[]>([])
  const [attendanceInfo, setAttendanceInfo] = useState<{
    attended: number
    total: number
    courseName: string
  } | null>(null)
  const [attendanceLoading, setAttendanceLoading] = useState(false)

  // Filter today's sessions
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todaySessions = sessions.filter((s) => {
    const d = new Date(s.date)
    d.setHours(0, 0, 0, 0)
    return d.getTime() === today.getTime()
  })

  async function handleCheckin() {
    if (!code.trim()) return
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch("/api/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim() }),
      })
      const data = await res.json()
      if (res.ok) {
        setResult({ ok: true, userName: data.userName, courseName: data.courseName, time: data.time })
        setCode("")
        // Refresh attendance if viewing a session
        if (selectedSession) fetchAttendance(selectedSession)
      } else {
        setResult({ ok: false, error: data.error })
      }
    } catch {
      setResult({ ok: false, error: "Erreur de connexion." })
    } finally {
      setLoading(false)
    }
  }

  async function fetchAttendance(sessionId: string) {
    setAttendanceLoading(true)
    try {
      const res = await fetch(`/api/checkin?sessionId=${sessionId}`)
      if (res.ok) {
        const data = await res.json()
        setAttendance(data.bookings ?? [])
        setAttendanceInfo({
          attended: data.attended,
          total: data.total,
          courseName: data.courseName,
        })
      }
    } catch {
      // Silently fail
    } finally {
      setAttendanceLoading(false)
    }
  }

  function handleSelectSession(sessionId: string) {
    setSelectedSession(sessionId)
    fetchAttendance(sessionId)
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <QrCode className="w-5 h-5 text-mp-ocean" />
        <h3 className="font-heading text-base font-semibold text-mp-charcoal">
          Check-in du jour
        </h3>
      </div>

      {/* Check-in input */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleCheckin()}
          placeholder="Scanner ou entrer le code (ex: CHECKIN:abc123)"
          className="flex-1 px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-mp-ocean focus:border-mp-ocean"
        />
        <button
          onClick={handleCheckin}
          disabled={loading || !code.trim()}
          className="mp-btn mp-btn-primary !text-sm !py-2.5 !px-5 disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            "Pointer"
          )}
        </button>
      </div>

      {/* Result feedback */}
      {result && (
        <div
          className={clsx(
            "flex items-center gap-2 p-3 rounded-lg mb-4 text-sm",
            result.ok
              ? "bg-emerald-50 text-emerald-700"
              : "bg-red-50 text-red-700"
          )}
        >
          {result.ok ? (
            <>
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>
                {result.userName} — {result.courseName} {result.time}
              </span>
            </>
          ) : (
            <>
              <XCircle className="w-4 h-4 flex-shrink-0" />
              <span>{result.error}</span>
            </>
          )}
        </div>
      )}

      {/* Today's sessions selector */}
      {todaySessions.length > 0 ? (
        <div>
          <p className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wider">
            Séances du jour
          </p>
          <div className="flex flex-wrap gap-2 mb-4">
            {todaySessions.map((s) => (
              <button
                key={s.id}
                onClick={() => handleSelectSession(s.id)}
                className={clsx(
                  "px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors",
                  selectedSession === s.id
                    ? "bg-mp-ocean text-white border-mp-ocean"
                    : "bg-white text-gray-600 border-gray-200 hover:border-mp-ocean hover:text-mp-ocean"
                )}
              >
                {formatTime(s.startTime)} — {s.courseType.name} ({s.currentParticipants}/{s.maxParticipants})
              </button>
            ))}
          </div>

          {/* Attendance list */}
          {selectedSession && (
            <div>
              {attendanceLoading ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="w-5 h-5 animate-spin text-mp-ocean" />
                </div>
              ) : (
                <>
                  {attendanceInfo && (
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm font-heading font-semibold text-mp-charcoal">
                        {attendanceInfo.courseName}
                      </span>
                      <span className={clsx(
                        "text-xs font-medium px-2 py-0.5 rounded-full",
                        attendanceInfo.attended === attendanceInfo.total
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                      )}>
                        {attendanceInfo.attended}/{attendanceInfo.total} présents
                      </span>
                    </div>
                  )}
                  {attendance.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-4">
                      Aucun inscrit.
                    </p>
                  ) : (
                    <div className="space-y-1">
                      {attendance.map((entry) => (
                        <div
                          key={entry.id}
                          className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50"
                        >
                          <div className="flex items-center gap-2">
                            {entry.status === "ATTENDED" ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            ) : (
                              <Clock className="w-4 h-4 text-gray-300" />
                            )}
                            <div>
                              <p className="text-sm font-medium">{entry.userName}</p>
                              <p className="text-xs text-gray-400">{entry.userEmail}</p>
                            </div>
                          </div>
                          <StatusBadge
                            status={entry.status}
                            map={statusLabels}
                            colors={statusColors}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      ) : (
        <p className="text-sm text-gray-400">Aucune séance prévue aujourd&apos;hui.</p>
      )}
    </div>
  )
}

/* ============================================================
   BLOG TAB
   ============================================================ */

function BlogTab({
  posts,
  loading,
  onEdit,
  onDelete,
  onCreate,
}: {
  posts: AdminBlogPost[]
  loading: boolean
  onEdit: (p: AdminBlogPost) => void
  onDelete: (id: string) => void
  onCreate: () => void
}) {
  if (loading) {
    return <TableSkeleton rows={4} columns={4} label="Chargement des articles…" />
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500">{posts.length} article{posts.length !== 1 ? "s" : ""}</p>
        <button onClick={onCreate} className="mp-btn mp-btn-primary !text-sm !py-2 !px-4 flex items-center gap-1.5">
          <Plus className="w-4 h-4" /> Nouvel article
        </button>
      </div>

      {posts.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="Aucun article publié"
          description="Partagez actualités, astuces et conseils santé avec vos élèves."
          action={{
            label: "Créer un article",
            onClick: onCreate,
            icon: Plus,
          }}
        />
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="hidden sm:grid grid-cols-[1fr_100px_120px_100px] gap-4 px-6 py-3 border-b border-gray-100 bg-gray-50/50 text-xs font-medium text-gray-500 uppercase tracking-wider">
            <span>Titre</span>
            <span>Statut</span>
            <span>Date</span>
            <span className="text-right">Actions</span>
          </div>
          {posts.map((post) => (
            <div
              key={post.id}
              className="grid grid-cols-1 sm:grid-cols-[1fr_100px_120px_100px] gap-2 sm:gap-4 px-6 py-4 border-b border-gray-50 hover:bg-gray-50/50 transition-colors items-center"
            >
              <div>
                <p className="text-sm font-medium text-mp-charcoal">{post.title}</p>
                <p className="text-xs text-gray-400 mt-0.5">{post.slug}</p>
              </div>
              <div>
                <span
                  className={clsx(
                    "text-xs font-medium px-2 py-0.5 rounded-full",
                    post.published
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-amber-100 text-amber-700"
                  )}
                >
                  {post.published ? "Publié" : "Brouillon"}
                </span>
              </div>
              <div className="text-xs text-gray-500">
                {post.publishedAt ? formatDate(post.publishedAt) : "—"}
              </div>
              <div className="flex items-center justify-end gap-1">
                <button
                  onClick={() => onEdit(post)}
                  className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-mp-ocean"
                  title="Modifier"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(post.id)}
                  className="p-1.5 rounded-lg hover:bg-red-50 transition-colors text-gray-400 hover:text-red-500"
                  title="Supprimer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ============================================================
   BLOG FORM (used inside Modal)
   ============================================================ */

function BlogForm({
  post,
  onSave,
  onCancel,
}: {
  post: AdminBlogPost | null
  onSave: (data: {
    id?: string
    title: string
    slug: string
    excerpt: string
    content: string
    coverImage: string
    tags: string[]
    published: boolean
  }) => void
  onCancel: () => void
}) {
  const [title, setTitle] = useState(post?.title ?? "")
  const [slug, setSlug] = useState(post?.slug ?? "")
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "")
  const [content, setContent] = useState(post?.content ?? "")
  const [coverImage, setCoverImage] = useState(post?.coverImage ?? "")
  const [tagsStr, setTagsStr] = useState((post?.tags ?? []).join(", "))
  const [published, setPublished] = useState(post?.published ?? false)
  const [saving, setSaving] = useState(false)

  function generateSlug(t: string): string {
    return t
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }

  function handleTitleChange(value: string) {
    setTitle(value)
    if (!post) setSlug(generateSlug(value))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    await onSave({
      ...(post ? { id: post.id } : {}),
      title,
      slug,
      excerpt,
      content,
      coverImage,
      tags: tagsStr.split(",").map((t) => t.trim()).filter(Boolean),
      published,
    })
    setSaving(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
        <input
          type="text"
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-mp-ocean focus:border-mp-ocean"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
        <input
          type="text"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-mp-ocean focus:border-mp-ocean font-mono"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Extrait</label>
        <textarea
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-mp-ocean focus:border-mp-ocean"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Contenu</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={10}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-mp-ocean focus:border-mp-ocean font-mono"
          placeholder="Contenu de l'article..."
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Image de couverture (URL)</label>
        <input
          type="text"
          value={coverImage}
          onChange={(e) => setCoverImage(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-mp-ocean focus:border-mp-ocean"
          placeholder="https://..."
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Tags (séparés par des virgules)</label>
        <input
          type="text"
          value={tagsStr}
          onChange={(e) => setTagsStr(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-mp-ocean focus:border-mp-ocean"
          placeholder="conseils, pilates, santé"
        />
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="published"
          checked={published}
          onChange={(e) => setPublished(e.target.checked)}
          className="w-4 h-4 text-mp-ocean border-gray-300 rounded focus:ring-mp-ocean"
        />
        <label htmlFor="published" className="text-sm text-gray-700">Publier immédiatement</label>
      </div>
      <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800">
          Annuler
        </button>
        <button
          type="submit"
          disabled={saving}
          className="mp-btn mp-btn-primary !text-sm !py-2 !px-5 disabled:opacity-50 flex items-center gap-1.5"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
          {post ? "Enregistrer" : "Créer"}
        </button>
      </div>
    </form>
  )
}

/* ============================================================
   ANALYTICS TAB
   ============================================================ */

interface AnalyticsData {
  weeklyBookings: { week: string; count: number }[]
  weeklyRevenue: { week: string; amount: number }[]
  courseTypeDistribution: { name: string; count: number }[]
  occupancyByDay: { day: string; rate: number }[]
  peakHours: { hour: string; count: number }[]
  memberGrowth: { month: string; count: number }[]
  retentionRate: number
}

const CHART_COLORS = ["#6b9fad", "#8faa8b", "#c9a96e", "#d4a0a0", "#7b8fa1", "#a3c9a8", "#d4b896", "#b8a0b8"]

function AnalyticsTab() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [chartsReady, setChartsReady] = useState(false)

  // Dynamically import recharts to avoid SSR issues
  const [RC, setRC] = useState<typeof import("recharts") | null>(null)

  useEffect(() => {
    import("recharts").then((mod) => {
      setRC(mod)
      setChartsReady(true)
    })
  }, [])

  useEffect(() => {
    fetch("/api/admin/analytics")
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading || !chartsReady || !RC) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 h-80 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-48 mb-6" />
              <div className="h-full bg-gray-100 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!data) {
    return <div className="text-center text-gray-400 py-12">Impossible de charger les analytics.</div>
  }

  const {
    ResponsiveContainer,
    LineChart, Line,
    BarChart, Bar,
    PieChart, Pie, Cell,
    AreaChart, Area,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  } = RC

  const eurFormatter = (value: number) =>
    new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(value / 100)

  const pctFormatter = (value: RechartsValue) => `${Math.round(Number(value ?? 0) * 100)}%`

  const monthLabels: Record<string, string> = {
    "01": "Jan", "02": "Fév", "03": "Mars", "04": "Avr",
    "05": "Mai", "06": "Juin", "07": "Juil", "08": "Août",
    "09": "Sep", "10": "Oct", "11": "Nov", "12": "Déc",
  }

  const formatMonth = (m: unknown) => {
    const str = String(m ?? "")
    const parts = str.split("-")
    const key = parts[1] ?? ""
    return monthLabels[key] || key
  }

  return (
    <div className="space-y-6">
      {/* Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly bookings - Line chart */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-heading font-semibold text-mp-charcoal mb-4 flex items-center gap-2">
            <CalendarCheck className="w-4 h-4 text-mp-ocean" />
            Réservations par semaine
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.weeklyBookings}>
                <defs>
                  <linearGradient id="bookingFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6b9fad" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6b9fad" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="week" tick={{ fontSize: 11 }} tickFormatter={(w: number | string) => String(w).replace(/^\d{4}-/, "")} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip
                  formatter={(value: RechartsValue): [React.ReactNode, string] => [value ?? 0, "Réservations"]}
                  labelFormatter={(label: React.ReactNode) => `Semaine ${String(label ?? "")}`}
                  contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb" }}
                />
                <Area type="monotone" dataKey="count" stroke="#6b9fad" strokeWidth={2} fill="url(#bookingFill)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weekly revenue - Bar chart */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-heading font-semibold text-mp-charcoal mb-4 flex items-center gap-2">
            <Euro className="w-4 h-4 text-mp-sage" />
            Revenus par semaine
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.weeklyRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="week" tick={{ fontSize: 11 }} tickFormatter={(w: number | string) => String(w).replace(/^\d{4}-/, "")} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v: number | string) => `${Math.round(Number(v) / 100)}\u00a0\u20ac`} />
                <Tooltip
                  formatter={(value: RechartsValue): [React.ReactNode, string] => [eurFormatter(Number(value ?? 0)), "Revenus"]}
                  labelFormatter={(label: React.ReactNode) => `Semaine ${String(label ?? "")}`}
                  contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb" }}
                />
                <Bar dataKey="amount" fill="#8faa8b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Course type distribution - Pie chart */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-heading font-semibold text-mp-charcoal mb-4 flex items-center gap-2">
            <Eye className="w-4 h-4 text-mp-gold" />
            Répartition par type de cours
          </h3>
          <div className="h-64">
            {data.courseTypeDistribution.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-400 text-sm">Aucune donnée</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.courseTypeDistribution}
                    dataKey="count"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    label={({ name, percent }: { name?: string; percent?: number }) => `${name ?? ""} (${((percent ?? 0) * 100).toFixed(0)}%)`}
                    labelLine={{ strokeWidth: 1 }}
                  >
                    {data.courseTypeDistribution.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: RechartsValue, name: number | string | undefined): [React.ReactNode, number | string] => [value ?? 0, name ?? ""]}
                    contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Occupancy by day - Horizontal bar */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-heading font-semibold text-mp-charcoal mb-4 flex items-center gap-2">
            <Users className="w-4 h-4 text-mp-rose" />
            Taux d&apos;occupation par jour
          </h3>
          <div className="h-64">
            {data.occupancyByDay.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-400 text-sm">Aucune donnée</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.occupancyByDay} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis type="number" tick={{ fontSize: 11 }} tickFormatter={pctFormatter} domain={[0, 1]} />
                  <YAxis type="category" dataKey="day" tick={{ fontSize: 11 }} width={80} />
                  <Tooltip
                    formatter={(value: RechartsValue): [React.ReactNode, string] => [pctFormatter(value), "Occupation"]}
                    contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb" }}
                  />
                  <Bar dataKey="rate" fill="#d4a0a0" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Row 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Peak hours - Vertical bar */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-heading font-semibold text-mp-charcoal mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-mp-ocean" />
            Heures de pointe
          </h3>
          <div className="h-64">
            {data.peakHours.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-400 text-sm">Aucune donnée</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.peakHours}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="hour" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                  <Tooltip
                    formatter={(value: RechartsValue): [React.ReactNode, string] => [value ?? 0, "Réservations"]}
                    contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb" }}
                  />
                  <Bar dataKey="count" fill="#c9a96e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Member growth - Area chart */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-heading font-semibold text-mp-charcoal mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-mp-sage" />
            Croissance membres
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.memberGrowth}>
                <defs>
                  <linearGradient id="memberFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8faa8b" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8faa8b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} tickFormatter={formatMonth} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip
                  formatter={(value: RechartsValue): [React.ReactNode, string] => [value ?? 0, "Nouveaux membres"]}
                  labelFormatter={formatMonth}
                  contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb" }}
                />
                <Area type="monotone" dataKey="count" stroke="#8faa8b" strokeWidth={2} fill="url(#memberFill)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 4 - Retention rate */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h3 className="font-heading font-semibold text-mp-charcoal mb-6 flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-mp-ocean" />
          Taux de rétention
        </h3>
        <div className="flex items-center justify-center">
          <div className="relative w-40 h-40">
            <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
              <circle cx="60" cy="60" r="52" fill="none" stroke="#f3f4f6" strokeWidth="10" />
              <circle
                cx="60"
                cy="60"
                r="52"
                fill="none"
                stroke="#6b9fad"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={`${(data.retentionRate / 100) * 2 * Math.PI * 52} ${2 * Math.PI * 52}`}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-heading font-bold text-mp-charcoal">{data.retentionRate}%</span>
              <span className="text-xs text-gray-500 mt-1">rétention 30j</span>
            </div>
          </div>
          <div className="ml-8 max-w-xs">
            <p className="text-sm text-gray-500">
              Pourcentage de membres ayant effectué au moins 2 réservations dans les 30 jours suivant leur première réservation.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ============================================================
   MESSAGES TAB
   ============================================================ */

interface SentMessage {
  subject: string
  message: string
  recipients: string
  sentAt: string
  count: number
}

const recipientLabels: Record<string, string> = {
  "all": "Tous les membres",
  "active-card": "Détenteurs de carte active",
  "subscribers": "Abonnés mensuels",
  "inactive": "Membres inactifs",
}

function MessagesTab({ stats }: { stats: Stats | null }) {
  const [recipients, setRecipients] = useState<string>("all")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [sending, setSending] = useState(false)
  const [sentMessages, setSentMessages] = useState<SentMessage[]>([])
  const [loadingHistory, setLoadingHistory] = useState(true)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  const fetchHistory = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/messages")
      if (res.ok) {
        const data = await res.json()
        setSentMessages(data.messages ?? [])
      }
    } catch {
      // ignore
    } finally {
      setLoadingHistory(false)
    }
  }, [])

  useEffect(() => {
    fetchHistory()
  }, [fetchHistory])

  const handleSend = async () => {
    if (!subject.trim() || !message.trim()) {
      setError("Veuillez remplir l\u2019objet et le message.")
      return
    }
    setSending(true)
    setError("")
    setSuccess("")
    try {
      const res = await fetch("/api/admin/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, message, recipients }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "Erreur lors de l\u2019envoi")
        return
      }
      setSuccess(`Message envoy\u00e9 \u00e0 ${data.sent} destinataire${data.sent > 1 ? "s" : ""}.`)
      setSubject("")
      setMessage("")
      fetchHistory()
    } catch {
      setError("Erreur r\u00e9seau")
    } finally {
      setSending(false)
    }
  }

  const recipientOptions = [
    { value: "all", label: "Tous les membres", count: stats?.totalUsers ?? null },
    { value: "active-card", label: "D\u00e9tenteurs de carte active", count: stats?.activeCards ?? null },
    { value: "subscribers", label: "Abonn\u00e9s mensuels", count: stats?.activeSubscriptions ?? null },
    { value: "inactive", label: "Membres inactifs", count: null },
  ]

  return (
    <div className="space-y-8">
      {/* Send form */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Mail className="w-5 h-5 text-mp-ocean" />
          <h2 className="text-lg font-heading font-semibold text-gray-900">Envoyer un message</h2>
        </div>

        {/* Recipients */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-3">Destinataires</label>
          <div className="space-y-2">
            {recipientOptions.map((opt) => (
              <label
                key={opt.value}
                className={clsx(
                  "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors",
                  recipients === opt.value
                    ? "border-mp-ocean bg-mp-ocean/5"
                    : "border-gray-200 hover:border-gray-300"
                )}
              >
                <input
                  type="radio"
                  name="recipients"
                  value={opt.value}
                  checked={recipients === opt.value}
                  onChange={(e) => setRecipients(e.target.value)}
                  className="text-mp-ocean focus:ring-mp-ocean"
                />
                <span className="text-sm text-gray-900">{opt.label}</span>
                {opt.count !== null && (
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                    {opt.count}
                  </span>
                )}
              </label>
            ))}
          </div>
        </div>

        {/* Subject */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Objet</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-mp-ocean focus:border-mp-ocean"
            placeholder="Objet du message..."
          />
        </div>

        {/* Message */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={5}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-mp-ocean focus:border-mp-ocean resize-y"
            placeholder="Contenu du message..."
          />
        </div>

        {/* Feedback */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-sm text-emerald-700">
            {success}
          </div>
        )}

        {/* Send button */}
        <button
          onClick={handleSend}
          disabled={sending || !subject.trim() || !message.trim()}
          className={clsx(
            "inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors",
            sending || !subject.trim() || !message.trim()
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-mp-ocean text-white hover:bg-mp-ocean-dark"
          )}
        >
          {sending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Envoi en cours...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Envoyer
            </>
          )}
        </button>
      </div>

      {/* History */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-heading font-semibold text-gray-900 mb-4">
          Historique des messages envoy&eacute;s
        </h2>

        {loadingHistory ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-mp-ocean" />
          </div>
        ) : sentMessages.length === 0 ? (
          <p className="text-sm text-gray-500 py-4">Aucun message envoy&eacute; pour le moment.</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {sentMessages.map((msg, i) => {
              const dateStr = new Date(msg.sentAt).toLocaleDateString("fr-FR", {
                day: "2-digit",
                month: "2-digit",
              })
              return (
                <div key={i} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xs text-gray-500 w-12 flex-shrink-0">{dateStr}</span>
                    <span className="text-sm font-medium text-gray-900 truncate">
                      &laquo;&nbsp;{msg.subject}&nbsp;&raquo;
                    </span>
                    <span className="text-xs text-gray-500 flex-shrink-0">
                      {recipientLabels[msg.recipients] ?? msg.recipients}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
                    {msg.count} dest.
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
