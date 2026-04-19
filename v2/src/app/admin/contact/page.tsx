"use client"

import { useCallback, useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  Loader2,
  Shield,
  Trash2,
  Mail,
  Phone,
  Inbox,
} from "lucide-react"
import { clsx } from "clsx"

interface ContactMessage {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string | null
  subject: string
  message: string
  status: string
  createdAt: string
}

const statusLabels: Record<string, string> = {
  NEW: "Nouveau",
  READ: "Lu",
  HANDLED: "Traité",
}

const statusColors: Record<string, string> = {
  NEW: "bg-red-100 text-red-700",
  READ: "bg-amber-100 text-amber-700",
  HANDLED: "bg-emerald-100 text-emerald-700",
}

export default function AdminContactPage() {
  const { data: authSession, status: authStatus } = useSession()
  const router = useRouter()
  const role = (authSession?.user as { role?: string } | undefined)?.role
  const isAdmin = role === "ADMIN" || role === "INSTRUCTOR"

  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [byStatus, setByStatus] = useState<Record<string, number>>({
    NEW: 0,
    READ: 0,
    HANDLED: 0,
  })
  const [filter, setFilter] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => {
    if (authStatus === "unauthenticated") router.push("/connexion")
    else if (authStatus === "authenticated" && !isAdmin) router.push("/compte")
  }, [authStatus, isAdmin, router])

  const fetchMessages = useCallback(() => {
    setLoading(true)
    const params = new URLSearchParams()
    if (filter) params.set("status", filter)
    fetch(`/api/admin/contact-messages?${params}`)
      .then((r) => {
        if (r.status === 403) throw new Error("forbidden")
        return r.json()
      })
      .then((data) => {
        setMessages(data.messages ?? [])
        setByStatus(data.byStatus ?? { NEW: 0, READ: 0, HANDLED: 0 })
      })
      .catch((err) => {
        if (err.message === "forbidden") setError("Accès réservé aux administrateurs.")
        else setError("Impossible de charger les messages.")
      })
      .finally(() => setLoading(false))
  }, [filter])

  useEffect(() => {
    if (authStatus === "authenticated" && isAdmin) fetchMessages()
  }, [authStatus, isAdmin, fetchMessages])

  const updateStatus = async (id: string, status: string) => {
    const res = await fetch(`/api/admin/contact-messages/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    })
    if (!res.ok) {
      const data = await res.json()
      alert(data.error || "Erreur")
      return
    }
    fetchMessages()
  }

  const remove = async (id: string) => {
    if (!confirm("Supprimer définitivement ce message ?")) return
    const res = await fetch(`/api/admin/contact-messages/${id}`, {
      method: "DELETE",
    })
    if (!res.ok) {
      const data = await res.json()
      alert(data.error || "Erreur")
      return
    }
    if (expanded === id) setExpanded(null)
    fetchMessages()
  }

  const openMessage = async (m: ContactMessage) => {
    setExpanded(expanded === m.id ? null : m.id)
    if (m.status === "NEW") {
      // auto-mark as READ on first open
      await fetch(`/api/admin/contact-messages/${m.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "READ" }),
      })
      fetchMessages()
    }
  }

  if (loading && !messages.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-mp-cream">
        <Loader2 className="w-8 h-8 animate-spin text-mp-ocean" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-mp-cream gap-4">
        <Shield className="w-12 h-12 text-red-400" />
        <p className="font-heading text-lg text-mp-charcoal">{error}</p>
        <Link href="/admin" className="text-mp-ocean hover:underline text-sm">
          Retour à l&apos;administration
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="flex items-center gap-1.5 text-sm text-mp-text-light hover:text-mp-ocean transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Administration
            </Link>
            <div className="h-5 w-px bg-gray-200" />
            <h1 className="font-heading text-xl font-bold text-mp-charcoal">
              Messages de contact
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex flex-wrap gap-2">
          <FilterChip
            label={`Tous (${byStatus.NEW + byStatus.READ + byStatus.HANDLED})`}
            active={filter === ""}
            onClick={() => setFilter("")}
          />
          <FilterChip
            label={`Nouveaux (${byStatus.NEW ?? 0})`}
            active={filter === "NEW"}
            onClick={() => setFilter("NEW")}
          />
          <FilterChip
            label={`Lus (${byStatus.READ ?? 0})`}
            active={filter === "READ"}
            onClick={() => setFilter("READ")}
          />
          <FilterChip
            label={`Traités (${byStatus.HANDLED ?? 0})`}
            active={filter === "HANDLED"}
            onClick={() => setFilter("HANDLED")}
          />
        </div>

        <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
          {messages.length === 0 && (
            <div className="p-12 flex flex-col items-center gap-3 text-gray-400">
              <Inbox className="w-10 h-10" />
              <p className="text-sm">Aucun message à afficher.</p>
            </div>
          )}
          {messages.map((m) => {
            const isOpen = expanded === m.id
            const fullName = `${m.firstName} ${m.lastName}`.trim()
            return (
              <div key={m.id} className="px-4 sm:px-5 py-4">
                <div className="flex items-start gap-4">
                  <button
                    onClick={() => openMessage(m)}
                    className="flex-1 text-left min-w-0"
                  >
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-medium text-mp-charcoal">{fullName}</span>
                      <span
                        className={clsx(
                          "inline-flex px-2 py-0.5 rounded-full text-xs font-medium",
                          statusColors[m.status] ?? "bg-gray-100 text-gray-600"
                        )}
                      >
                        {statusLabels[m.status] ?? m.status}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(m.createdAt).toLocaleString("fr-FR", {
                          day: "2-digit",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <div className="text-sm text-mp-charcoal truncate">{m.subject}</div>
                    <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                      <span className="inline-flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {m.email}
                      </span>
                      {m.phone && (
                        <span className="inline-flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {m.phone}
                        </span>
                      )}
                    </div>
                  </button>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <select
                      value={m.status}
                      onChange={(e) => updateStatus(m.id, e.target.value)}
                      className="px-2 py-1.5 border border-gray-300 rounded-lg text-xs bg-white focus:ring-2 focus:ring-mp-ocean focus:border-mp-ocean"
                    >
                      <option value="NEW">Nouveau</option>
                      <option value="READ">Lu</option>
                      <option value="HANDLED">Traité</option>
                    </select>
                    <button
                      onClick={() => remove(m.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                      aria-label="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                {isOpen && (
                  <div className="mt-3 ml-0 p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <p className="text-sm text-mp-charcoal whitespace-pre-wrap">
                      {m.message}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <a
                        href={`mailto:${m.email}?subject=Re:%20${encodeURIComponent(m.subject)}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-mp-ocean text-white hover:bg-mp-ocean-dark transition-colors"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        Répondre par email
                      </a>
                      {m.phone && (
                        <a
                          href={`tel:${m.phone}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-white text-mp-charcoal border border-gray-200 hover:border-mp-ocean transition-colors"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          Appeler
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </main>
    </div>
  )
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors",
        active
          ? "bg-mp-ocean text-white"
          : "bg-white text-gray-600 border border-gray-200 hover:border-mp-ocean hover:text-mp-ocean"
      )}
    >
      {label}
    </button>
  )
}
