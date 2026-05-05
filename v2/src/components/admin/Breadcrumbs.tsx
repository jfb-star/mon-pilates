"use client"

import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"

/**
 * Auto-derived breadcrumbs from the current pathname (and an optional ?tab=).
 * Path segments are mapped to nice French labels — anything not in the map
 * falls back to a Title-Cased version of the slug. Pages can pass an extra
 * `trail` prop to add dynamic crumbs (e.g. a member's name on /admin/users/[id]).
 *
 * The trailing crumb is rendered as plain text (current page).
 */

const SEGMENT_LABELS: Record<string, string> = {
  admin: "Admin",
  users: "Membres",
  migration: "Migration Bsport",
  emails: "Emails",
  templates: "Templates",
  campaigns: "Campagnes",
  logs: "Logs",
  contact: "Messages contact",
  instructors: "Instructeurs",
  "course-types": "Types de cours",
  schedules: "Plannings",
}

const TAB_LABELS: Record<string, string> = {
  sessions: "Séances",
  bookings: "Réservations",
  users: "Membres",
  unpaid: "Impayés",
  revenue: "Revenus",
  blog: "Blog",
  analytics: "Analytics",
}

export interface Crumb {
  label: string
  href?: string
}

export function Breadcrumbs({
  pathname,
  tab,
  trail,
}: {
  pathname: string
  tab?: string | null
  trail?: Crumb[]
}) {
  const segments = pathname.split("/").filter(Boolean)
  const crumbs: Crumb[] = []

  // Always lead with Admin → /admin
  crumbs.push({ label: "Admin", href: "/admin" })

  // Walk path segments after /admin
  let acc = ""
  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i]!
    acc += `/${seg}`
    if (seg === "admin") continue // already added
    // Skip dynamic-id segments that aren't useful as their own crumb (e.g. cuid)
    if (/^[a-z0-9]{20,}$/i.test(seg)) continue
    const label = SEGMENT_LABELS[seg] ?? seg.charAt(0).toUpperCase() + seg.slice(1)
    crumbs.push({ label, href: acc })
  }

  // ?tab= adds a leaf crumb (e.g. /admin?tab=users → "Membres")
  if (tab && pathname === "/admin") {
    const label = TAB_LABELS[tab] ?? tab
    crumbs.push({ label, href: `/admin?tab=${tab}` })
  }

  // Page-specific extra crumbs (e.g. member name)
  if (trail && trail.length > 0) {
    crumbs.push(...trail)
  }

  return (
    <nav aria-label="Fil d'ariane" className="flex items-center gap-1.5 text-xs text-gray-500 overflow-x-auto whitespace-nowrap">
      <Link href="/admin" className="text-gray-400 hover:text-mp-ocean transition-colors shrink-0" aria-label="Accueil admin">
        <Home className="w-3.5 h-3.5" />
      </Link>
      {crumbs.slice(1).map((c, i) => {
        const isLast = i === crumbs.length - 2
        return (
          <span key={`${c.label}-${i}`} className="flex items-center gap-1.5 shrink-0">
            <ChevronRight className="w-3 h-3 text-gray-300" />
            {isLast || !c.href ? (
              <span className="font-heading text-mp-charcoal">{c.label}</span>
            ) : (
              <Link href={c.href} className="hover:text-mp-ocean transition-colors">
                {c.label}
              </Link>
            )}
          </span>
        )
      })}
    </nav>
  )
}
