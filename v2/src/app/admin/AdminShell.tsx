"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard, Calendar, ClipboardList, AlertCircle, Users, BookOpen,
  CreditCard, Mail, FileText, Database, MessageSquare, Settings, Search,
  ChevronLeft, ChevronRight, Menu, X, Home,
} from "lucide-react"
import { clsx } from "clsx"
import { CommandPalette } from "@/components/admin/CommandPalette"

interface NavItem {
  label: string
  href: string
  icon: typeof LayoutDashboard
  adminOnly?: boolean
  /** kbd shortcut hint (e.g. "g s" → "g then s") */
  shortcut?: string
}

const NAV_GROUPS: { title: string; items: NavItem[] }[] = [
  {
    title: "Activité",
    items: [
      { label: "Tableau de bord",  href: "/admin",                 icon: LayoutDashboard, shortcut: "g d" },
      { label: "Séances",          href: "/admin?tab=sessions",    icon: Calendar,        shortcut: "g s" },
      { label: "Réservations",     href: "/admin?tab=bookings",    icon: ClipboardList,   shortcut: "g b" },
      { label: "Impayés",          href: "/admin?tab=unpaid",      icon: AlertCircle },
    ],
  },
  {
    title: "Membres",
    items: [
      { label: "Membres",          href: "/admin?tab=users",       icon: Users,           shortcut: "g u" },
      { label: "Instructeurs",     href: "/admin/instructors",     icon: BookOpen,        adminOnly: true },
    ],
  },
  {
    title: "Catalogue",
    items: [
      { label: "Types de cours",   href: "/admin/course-types",    icon: FileText,        adminOnly: true },
      { label: "Plannings",        href: "/admin/schedules",       icon: Calendar,        adminOnly: true },
      { label: "Revenus",          href: "/admin?tab=revenue",     icon: CreditCard,      adminOnly: true },
    ],
  },
  {
    title: "Communication",
    items: [
      { label: "Templates",        href: "/admin/emails/templates",icon: Mail,            adminOnly: true },
      { label: "Campagnes",        href: "/admin/emails/campaigns",icon: Mail,            adminOnly: true },
      { label: "Logs emails",      href: "/admin/emails/logs",     icon: FileText,        adminOnly: true },
      { label: "Messages contact", href: "/admin/contact",         icon: MessageSquare },
      { label: "Blog",             href: "/admin?tab=blog",        icon: FileText,        adminOnly: true },
    ],
  },
  {
    title: "Système",
    items: [
      { label: "Migration Bsport", href: "/admin/migration",       icon: Database,        adminOnly: true },
      { label: "Analytics",        href: "/admin?tab=analytics",   icon: LayoutDashboard, adminOnly: true },
    ],
  },
]

function isItemActive(href: string, pathname: string, tab: string | null): boolean {
  if (href === "/admin" && pathname === "/admin" && !tab) return true
  if (href.includes("?tab=")) {
    const [path, query] = href.split("?")
    if (pathname !== path) return false
    return query === `tab=${tab}`
  }
  return pathname === href || pathname.startsWith(href + "/")
}

export function AdminShell({ role, children }: { role: string; children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [paletteOpen, setPaletteOpen] = useState(false)

  // Read ?tab= from the URL — using window.location is fine here because
  // the sidebar re-renders on navigation; this avoids a useSearchParams
  // Suspense boundary around the entire layout.
  const [currentTab, setCurrentTab] = useState<string | null>(null)
  useEffect(() => {
    const update = () => {
      const u = new URL(window.location.href)
      setCurrentTab(u.searchParams.get("tab"))
    }
    update()
    window.addEventListener("popstate", update)
    return () => window.removeEventListener("popstate", update)
  }, [pathname])

  // Cmd/Ctrl+K → open command palette ; ESC → close any open overlay.
  // Single-key shortcuts (g+s etc.) are handled inside the palette via
  // its own keydown listener so they don't fire while typing.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      const inField = target?.tagName === "INPUT" || target?.tagName === "TEXTAREA" || target?.isContentEditable
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setPaletteOpen(true)
        return
      }
      if (inField) return
      // "g" then a letter — chord detection
      if (e.key === "g") {
        e.preventDefault()
        const handler = (e2: KeyboardEvent) => {
          window.removeEventListener("keydown", handler)
          const map: Record<string, string> = {
            d: "/admin",
            s: "/admin?tab=sessions",
            b: "/admin?tab=bookings",
            u: "/admin?tab=users",
            m: "/admin/migration",
          }
          const dest = map[e2.key.toLowerCase()]
          if (dest) router.push(dest)
        }
        window.addEventListener("keydown", handler, { once: true })
        setTimeout(() => window.removeEventListener("keydown", handler), 1500)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [router])

  const visibleGroups = useMemo(() => {
    return NAV_GROUPS.map((g) => ({
      ...g,
      items: g.items.filter((it) => !it.adminOnly || role === "ADMIN"),
    })).filter((g) => g.items.length > 0)
  }, [role])

  return (
    <div className="min-h-screen bg-gray-50/50 flex">
      {/* Mobile menu trigger (top-left) */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-3 left-3 z-30 w-10 h-10 rounded-xl bg-white border border-gray-200 shadow-sm flex items-center justify-center hover:bg-gray-50"
        aria-label="Ouvrir le menu admin"
      >
        <Menu className="w-5 h-5 text-mp-charcoal" />
      </button>

      {/* Sidebar — fixed position, width animates on collapse */}
      <aside
        className={clsx(
          "fixed lg:sticky inset-y-0 left-0 z-40 bg-white border-r border-gray-200 flex flex-col transition-[width,transform] duration-200",
          "h-screen top-0",
          collapsed ? "w-16" : "w-60",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Brand / collapse toggle */}
        <div className="h-14 flex items-center justify-between px-4 border-b border-gray-100">
          {!collapsed && (
            <Link href="/admin" className="font-heading font-bold text-mp-charcoal text-base whitespace-nowrap overflow-hidden">
              Mon Pilates
            </Link>
          )}
          <button
            onClick={() => setCollapsed((v) => !v)}
            className="hidden lg:flex w-8 h-8 rounded-lg hover:bg-gray-100 items-center justify-center text-gray-400 hover:text-mp-ocean transition-colors"
            aria-label={collapsed ? "Étendre" : "Réduire"}
            title={collapsed ? "Étendre" : "Réduire"}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search trigger (opens command palette) */}
        <button
          onClick={() => setPaletteOpen(true)}
          className={clsx(
            "mx-3 mt-3 mb-2 px-3 py-2 rounded-lg border border-gray-200 hover:border-mp-ocean/40 hover:bg-mp-ocean/5 transition-colors flex items-center gap-2 text-sm text-gray-500",
            collapsed && "justify-center px-2"
          )}
        >
          <Search className="w-4 h-4 shrink-0" />
          {!collapsed && (
            <>
              <span className="flex-1 text-left">Rechercher…</span>
              <kbd className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">⌘K</kbd>
            </>
          )}
        </button>

        {/* Nav groups */}
        <nav className="flex-1 overflow-y-auto py-2 px-2 space-y-4">
          {visibleGroups.map((group) => (
            <div key={group.title}>
              {!collapsed && (
                <p className="text-[10px] font-heading uppercase tracking-wider text-gray-400 px-3 mb-1.5">
                  {group.title}
                </p>
              )}
              <ul className="space-y-0.5">
                {group.items.map((item) => {
                  const active = isItemActive(item.href, pathname, currentTab)
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={clsx(
                          "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-heading transition-colors",
                          active
                            ? "bg-mp-ocean/10 text-mp-ocean-dark font-semibold"
                            : "text-gray-600 hover:bg-gray-50 hover:text-mp-charcoal",
                          collapsed && "justify-center"
                        )}
                        title={collapsed ? item.label : undefined}
                      >
                        <item.icon className="w-4 h-4 shrink-0" />
                        {!collapsed && (
                          <>
                            <span className="flex-1 truncate">{item.label}</span>
                            {item.shortcut && (
                              <kbd className="text-[10px] text-gray-400 hidden xl:inline">{item.shortcut}</kbd>
                            )}
                          </>
                        )}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Footer link to public site */}
        <div className="border-t border-gray-100 p-2">
          <Link
            href="/"
            className={clsx(
              "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-heading text-gray-500 hover:bg-gray-50 hover:text-mp-charcoal",
              collapsed && "justify-center"
            )}
          >
            <Home className="w-4 h-4 shrink-0" />
            {!collapsed && <span>Voir le site</span>}
          </Link>
        </div>
      </aside>

      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-black/30 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Main content */}
      <main className="flex-1 min-w-0">
        {children}
      </main>

      {/* Cmd+K palette */}
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </div>
  )
}
