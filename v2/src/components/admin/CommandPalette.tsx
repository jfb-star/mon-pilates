"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import { useRouter } from "next/navigation"
import {
  Search, Calendar, ClipboardList, Users, Database, Mail, FileText,
  CreditCard, MessageSquare, BookOpen, LayoutDashboard, ArrowRight, Loader2,
} from "lucide-react"
import { clsx } from "clsx"

/**
 * Cmd+K command palette. Two kinds of commands:
 *   1. Static section jumps (Membres, Séances, etc.)
 *   2. Dynamic member search — fires after 250ms of typing, hits
 *      /api/admin/users?search=… and lists matching members. Clicking
 *      one navigates to /admin/users/{id}.
 *
 * Keyboard: ↑↓ to move, Enter to activate, ESC to close.
 */

interface SectionItem {
  type: "section"
  label: string
  href: string
  icon: typeof Search
  keywords?: string
}

interface MemberItem {
  type: "member"
  id: string
  name: string
  email: string
}

type Item = SectionItem | MemberItem

const SECTION_ITEMS: SectionItem[] = [
  { type: "section", label: "Tableau de bord",  href: "/admin",                  icon: LayoutDashboard, keywords: "dashboard accueil" },
  { type: "section", label: "Séances",          href: "/admin?tab=sessions",     icon: Calendar,        keywords: "cours planning" },
  { type: "section", label: "Réservations",     href: "/admin?tab=bookings",     icon: ClipboardList,   keywords: "bookings resa" },
  { type: "section", label: "Membres",          href: "/admin?tab=users",        icon: Users,           keywords: "clients utilisateurs" },
  { type: "section", label: "Impayés",          href: "/admin?tab=unpaid",       icon: CreditCard,      keywords: "paiement" },
  { type: "section", label: "Revenus",          href: "/admin?tab=revenue",      icon: CreditCard,      keywords: "ca chiffre affaires" },
  { type: "section", label: "Migration Bsport", href: "/admin/migration",        icon: Database,        keywords: "import" },
  { type: "section", label: "Templates emails", href: "/admin/emails/templates", icon: Mail },
  { type: "section", label: "Campagnes emails", href: "/admin/emails/campaigns", icon: Mail },
  { type: "section", label: "Logs emails",      href: "/admin/emails/logs",      icon: FileText },
  { type: "section", label: "Messages contact", href: "/admin/contact",          icon: MessageSquare },
  { type: "section", label: "Instructeurs",     href: "/admin/instructors",      icon: BookOpen },
  { type: "section", label: "Types de cours",   href: "/admin/course-types",     icon: FileText },
  { type: "section", label: "Plannings",        href: "/admin/schedules",        icon: Calendar },
]

export function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [members, setMembers] = useState<MemberItem[]>([])
  const [searching, setSearching] = useState(false)
  const [activeIdx, setActiveIdx] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  // Reset on open
  useEffect(() => {
    if (open) {
      setQuery("")
      setMembers([])
      setActiveIdx(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  // Debounced member search
  useEffect(() => {
    if (!open) return
    if (query.length < 2) {
      setMembers([])
      return
    }
    setSearching(true)
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/admin/users?search=${encodeURIComponent(query)}&limit=8`)
        if (res.ok) {
          const data = await res.json()
          setMembers((data.users || []).map((u: { id: string; name: string; email: string }) => ({
            type: "member" as const,
            id: u.id,
            name: u.name,
            email: u.email,
          })))
        }
      } finally {
        setSearching(false)
      }
    }, 250)
    return () => clearTimeout(t)
  }, [query, open])

  // Filter sections by query (substring match in label or keywords)
  const filteredSections = useMemo(() => {
    if (!query) return SECTION_ITEMS
    const q = query.toLowerCase()
    return SECTION_ITEMS.filter((s) =>
      s.label.toLowerCase().includes(q) || (s.keywords || "").toLowerCase().includes(q)
    )
  }, [query])

  const items: Item[] = useMemo(() => [...members, ...filteredSections], [members, filteredSections])

  // Reset active item when results change
  useEffect(() => { setActiveIdx(0) }, [items.length])

  // Keyboard: ↑↓ to navigate, Enter to activate, ESC to close
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { e.preventDefault(); onClose() }
      else if (e.key === "ArrowDown") { e.preventDefault(); setActiveIdx((i) => Math.min(items.length - 1, i + 1)) }
      else if (e.key === "ArrowUp") { e.preventDefault(); setActiveIdx((i) => Math.max(0, i - 1)) }
      else if (e.key === "Enter") {
        e.preventDefault()
        const it = items[activeIdx]
        if (it) activate(it)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, items, activeIdx, onClose]) // eslint-disable-line react-hooks/exhaustive-deps

  function activate(it: Item) {
    if (it.type === "section") router.push(it.href)
    else router.push(`/admin/users/${it.id}`)
    onClose()
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center pt-24 sm:pt-32 px-4 bg-black/30 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
          <Search className="w-5 h-5 text-gray-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un membre, une section…"
            className="flex-1 outline-none text-sm placeholder:text-gray-400"
          />
          {searching && <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />}
          <kbd className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded hidden sm:inline">ESC</kbd>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto py-2">
          {items.length === 0 && (
            <p className="text-sm text-gray-400 italic px-4 py-6 text-center">
              {query.length < 2 ? "Tapez au moins 2 caractères pour rechercher un membre" : "Aucun résultat"}
            </p>
          )}

          {/* Members section */}
          {members.length > 0 && (
            <div>
              <p className="text-[10px] font-heading uppercase tracking-wider text-gray-400 px-4 pt-1 pb-1.5">
                Membres
              </p>
              {members.map((m, i) => (
                <button
                  key={m.id}
                  onClick={() => activate(m)}
                  onMouseEnter={() => setActiveIdx(i)}
                  className={clsx(
                    "w-full flex items-center gap-3 px-4 py-2 text-left text-sm transition-colors",
                    activeIdx === i ? "bg-mp-ocean/10" : "hover:bg-gray-50"
                  )}
                >
                  <Users className="w-4 h-4 text-gray-400 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-mp-charcoal truncate">{m.name}</p>
                    <p className="text-xs text-gray-500 truncate">{m.email}</p>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-gray-300 shrink-0" />
                </button>
              ))}
            </div>
          )}

          {/* Sections */}
          {filteredSections.length > 0 && (
            <div>
              <p className="text-[10px] font-heading uppercase tracking-wider text-gray-400 px-4 pt-2 pb-1.5">
                Sections
              </p>
              {filteredSections.map((s, idx) => {
                const i = members.length + idx
                return (
                  <button
                    key={s.href}
                    onClick={() => activate(s)}
                    onMouseEnter={() => setActiveIdx(i)}
                    className={clsx(
                      "w-full flex items-center gap-3 px-4 py-2 text-left text-sm transition-colors",
                      activeIdx === i ? "bg-mp-ocean/10" : "hover:bg-gray-50"
                    )}
                  >
                    <s.icon className="w-4 h-4 text-gray-400 shrink-0" />
                    <span className="flex-1 text-mp-charcoal">{s.label}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-gray-300 shrink-0" />
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer hints */}
        <div className="border-t border-gray-100 px-4 py-2 flex items-center gap-3 text-[10px] text-gray-400">
          <span><kbd className="bg-gray-100 px-1.5 py-0.5 rounded">↑↓</kbd> naviguer</span>
          <span><kbd className="bg-gray-100 px-1.5 py-0.5 rounded">↵</kbd> ouvrir</span>
          <span><kbd className="bg-gray-100 px-1.5 py-0.5 rounded">ESC</kbd> fermer</span>
        </div>
      </div>
    </div>
  )
}
