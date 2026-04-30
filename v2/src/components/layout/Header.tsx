"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import { Menu, X, Calendar, User, Shield, BookOpen, Flame, Phone, Mail } from "lucide-react"
import { clsx } from "clsx"
import { useFocusTrap } from "@/hooks/useFocusTrap"
import { useIsFirstTimer } from "@/hooks/useIsFirstTimer"
import { NotificationBell } from "@/components/ui/NotificationBell"
import { ThemeToggle } from "@/components/ui/ThemeToggle"

const baseNavigation = [
  { name: "Nos cours", href: "/cours" },
  { name: "Planning", href: "/planning" },
  { name: "Tarifs", href: "/tarifs" },
  { name: "Notre studio", href: "/about" },
  { name: "L'\u00e9quipe", href: "/equipe" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/contact" },
]
const firstTimerEntry = { name: "Première visite", href: "/premiere-visite" }

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const { data: session } = useSession()
  const isLoggedIn = !!session?.user
  const userRole = (session?.user as { role?: string } | undefined)?.role
  const isAdmin = userRole === "ADMIN" || userRole === "INSTRUCTOR"
  const isInstructor = userRole === "INSTRUCTOR" || userRole === "ADMIN"

  useEffect(() => {
    let ticking = false
    const update = () => {
      ticking = false
      const next = window.scrollY > 8
      setScrolled((prev) => (prev === next ? prev : next))
    }
    const handleScroll = () => {
      if (!ticking) {
        ticking = true
        window.requestAnimationFrame(update)
      }
    }
    update()
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden"
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") setMobileOpen(false)
      }
      document.addEventListener("keydown", handleEscape)
      return () => {
        document.body.style.overflow = ""
        document.removeEventListener("keydown", handleEscape)
      }
    } else {
      document.body.style.overflow = ""
    }
    return () => { document.body.style.overflow = "" }
  }, [mobileOpen])

  const mobileMenuRef = useFocusTrap(mobileOpen)
  const headerSolid = scrolled || mobileOpen
  const isFirstTimer = useIsFirstTimer()
  // While loading, show the trial entries to avoid layout flash
  const showTrial = isFirstTimer !== false
  const navigation = showTrial ? [firstTimerEntry, ...baseNavigation] : baseNavigation

  return (
    <>
      {/* Top bar */}
      <header
        role="banner"
        className={clsx(
          "fixed top-0 left-0 right-0 z-50 transition-[background-color,box-shadow,backdrop-filter,height] duration-200 ease-out motion-reduce:transition-none",
          headerSolid
            ? mobileOpen
              ? "bg-mp-white/95 backdrop-blur-xl backdrop-saturate-150"
              : "bg-mp-white/80 backdrop-blur-xl backdrop-saturate-150 shadow-[0_4px_20px_-8px_rgba(0,0,0,0.12),0_1px_0_0_rgba(0,0,0,0.04)]"
            : "bg-gradient-to-b from-black/30 to-transparent"
        )}
      >
        <div
          className={clsx(
            "mp-container flex items-center justify-between transition-[height] duration-200 ease-out motion-reduce:transition-none",
            headerSolid ? "h-[72px]" : "h-24"
          )}
        >
          {/* Logo */}
          <Link href="/" className="relative flex items-center group" aria-label="Mon Pilates — Accueil">
            <Image
              src="/logo.webp"
              alt="Mon Pilates"
              width={240}
              height={144}
              priority
              sizes="(max-width: 1024px) 120px, 160px"
              className={clsx(
                "transition-all duration-500 object-contain",
                headerSolid ? "h-11 w-auto" : "h-14 w-auto",
                !headerSolid && "brightness-0 invert"
              )}
            />
          </Link>

          {/* Desktop navigation */}
          <nav
            className="hidden lg:flex items-center gap-0.5"
            aria-label="Navigation principale"
          >
            {navigation.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={clsx(
                    "font-heading text-[13px] font-medium px-3 py-2 rounded-full whitespace-nowrap transition-all duration-300",
                    "relative after:absolute after:bottom-0.5 after:left-1/2 after:-translate-x-1/2 after:h-[2px] after:rounded-full after:transition-all after:duration-300",
                    "focus:outline-none focus-visible:outline-2 focus-visible:outline-mp-ocean focus-visible:outline-offset-2",
                    isActive ? "after:w-5" : "after:w-0 hover:after:w-5",
                    scrolled
                      ? clsx(
                          "after:bg-mp-ocean",
                          isActive ? "text-mp-ocean" : "text-mp-charcoal-light hover:text-mp-ocean"
                        )
                      : clsx(
                          "after:bg-white",
                          isActive ? "text-white" : "text-white/90 hover:text-white"
                        )
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1.5">
            {isInstructor && (
              <Link
                href="/instructeur"
                className={clsx(
                  "hidden xl:flex items-center gap-1.5 font-heading text-[13px] font-medium px-2.5 py-2 rounded-full whitespace-nowrap transition-all",
                  scrolled
                    ? "text-mp-ocean hover:text-mp-ocean-dark hover:bg-mp-ocean/5"
                    : "text-white/80 hover:text-white"
                )}
              >
                <BookOpen className="w-4 h-4" aria-hidden="true" />
                Espace pro
              </Link>
            )}
            {isAdmin && (
              <Link
                href="/admin"
                className={clsx(
                  "hidden xl:flex items-center gap-1.5 font-heading text-[13px] font-medium px-2.5 py-2 rounded-full whitespace-nowrap transition-all",
                  scrolled
                    ? "text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                    : "text-white/80 hover:text-white"
                )}
              >
                <Shield className="w-4 h-4" aria-hidden="true" />
                Admin
              </Link>
            )}
            <div className="hidden sm:block">
              <ThemeToggle scrolled={scrolled} />
            </div>
            {isLoggedIn && (
              <div className="hidden sm:block">
                <NotificationBell scrolled={scrolled} />
              </div>
            )}
            {isLoggedIn && (
              <Link
                href="/defis"
                className={clsx(
                  "hidden xl:flex items-center gap-1.5 font-heading text-[13px] font-medium px-2.5 py-2 rounded-full whitespace-nowrap transition-all",
                  scrolled
                    ? "text-orange-500 hover:text-orange-600 hover:bg-orange-50"
                    : "text-white/80 hover:text-white"
                )}
              >
                <Flame className="w-4 h-4" aria-hidden="true" />
                Défis
              </Link>
            )}
            <Link
              href={isLoggedIn ? "/compte" : "/connexion"}
              className={clsx(
                "hidden sm:flex items-center gap-1.5 font-heading text-[13px] font-medium px-2.5 py-2 rounded-full whitespace-nowrap transition-all",
                scrolled
                  ? "text-mp-charcoal-light hover:text-mp-ocean"
                  : "text-white/80 hover:text-white"
              )}
              aria-label={isLoggedIn ? "Mon compte" : "Connexion"}
            >
              <User className="w-4 h-4" aria-hidden="true" />
              <span className="hidden xl:inline">{isLoggedIn ? "Mon compte" : "Connexion"}</span>
            </Link>

            <Link
              href="/planning"
              className={clsx(
                "mp-btn hidden sm:inline-flex text-[13px] !py-2.5 !px-6",
                scrolled
                  ? "mp-btn-primary"
                  : "!bg-white !text-mp-charcoal hover:!bg-mp-ocean-light hover:!text-white !shadow-lg"
              )}
            >
              <Calendar className="w-4 h-4" aria-hidden="true" />
              Réserver
            </Link>

            {/* Mobile menu button */}
            <button
              type="button"
              className={clsx(
                "lg:hidden p-2.5 rounded-full transition-colors relative z-[60]",
                "focus:outline-none focus-visible:outline-2 focus-visible:outline-mp-ocean focus-visible:outline-offset-2",
                headerSolid
                  ? "text-mp-charcoal hover:bg-mp-cream"
                  : "text-white hover:bg-white/10"
              )}
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu-panel"
              aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
            >
              {mobileOpen ? (
                <X className="w-6 h-6" aria-hidden="true" />
              ) : (
                <Menu className="w-6 h-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile full-screen overlay menu */}
      <div
        id="mobile-menu-panel"
        ref={mobileMenuRef}
        role="dialog"
        aria-modal="true"
        aria-label="Menu de navigation"
        className={clsx(
          "fixed inset-0 z-[55] lg:hidden transition-visibility duration-300",
          mobileOpen ? "visible" : "invisible pointer-events-none"
        )}
      >
        {/* Backdrop */}
        <div
          className={clsx(
            "absolute inset-0 bg-black/40 transition-opacity duration-300",
            mobileOpen ? "opacity-100" : "opacity-0"
          )}
          aria-hidden="true"
          onClick={() => setMobileOpen(false)}
        />
        {/* Panel */}
        <nav
          className={clsx(
            "absolute top-[72px] left-0 right-0 bg-mp-white shadow-2xl border-t border-mp-sand/40 transition-all duration-300",
            mobileOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
          )}
          aria-label="Navigation mobile"
        >
          <div className="mp-container py-6 flex flex-col gap-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={clsx(
                    "font-heading text-base font-medium px-4 py-3.5 rounded-xl transition-all",
                    "focus:outline-none focus-visible:outline-2 focus-visible:outline-mp-ocean focus-visible:outline-offset-2",
                    isActive
                      ? "text-mp-ocean bg-mp-ocean/5 border-l-2 border-mp-ocean"
                      : "text-mp-charcoal-light hover:text-mp-ocean hover:bg-mp-cream"
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  {item.name}
                </Link>
              )
            })}
            {isInstructor && (
              <Link
                href="/instructeur"
                onClick={() => setMobileOpen(false)}
                className="font-heading text-base font-medium text-mp-ocean hover:text-mp-ocean-dark hover:bg-mp-ocean/5 px-4 py-3.5 rounded-xl transition-all flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4" aria-hidden="true" />
                Mon espace
              </Link>
            )}
            {isAdmin && (
              <Link
                href="/admin"
                onClick={() => setMobileOpen(false)}
                className="font-heading text-base font-medium text-purple-600 hover:text-purple-700 hover:bg-purple-50 px-4 py-3.5 rounded-xl transition-all flex items-center gap-2"
              >
                <Shield className="w-4 h-4" aria-hidden="true" />
                Administration
              </Link>
            )}
            <div className="px-4 py-2 flex items-center gap-2">
              <ThemeToggle scrolled={true} />
              <span className="font-heading text-sm text-mp-text-light">Apparence</span>
            </div>
            {isLoggedIn && (
              <div className="px-4 py-2">
                <NotificationBell scrolled={true} />
              </div>
            )}
            {isLoggedIn && (
              <Link
                href="/defis"
                onClick={() => setMobileOpen(false)}
                className="font-heading text-base font-medium text-orange-500 hover:text-orange-600 hover:bg-orange-50 px-4 py-3.5 rounded-xl transition-all flex items-center gap-2"
              >
                <Flame className="w-4 h-4" aria-hidden="true" />
                Défis & Streaks
              </Link>
            )}
            <Link
              href={isLoggedIn ? "/compte" : "/connexion"}
              onClick={() => setMobileOpen(false)}
              className="font-heading text-base font-medium text-mp-charcoal-light hover:text-mp-ocean hover:bg-mp-cream px-4 py-3.5 rounded-xl transition-all flex items-center gap-2"
            >
              {isLoggedIn ? (
                <>
                  <User className="w-4 h-4" aria-hidden="true" />
                  Mon compte
                </>
              ) : (
                "Connexion"
              )}
            </Link>
            <Link
              href="/planning"
              onClick={() => setMobileOpen(false)}
              className="mp-btn mp-btn-primary mt-4 text-center justify-center"
            >
              <Calendar className="w-4 h-4" aria-hidden="true" />
              R&eacute;server un cours
            </Link>
            <div className="mt-6 pt-6 border-t border-mp-sand">
              <p className="font-heading text-sm font-semibold text-mp-charcoal mb-3">Nous contacter</p>
              <div className="flex flex-col gap-2">
                <a href="tel:+33699183216" className="flex items-center gap-3 text-sm text-mp-text hover:text-mp-ocean">
                  <Phone className="w-4 h-4" aria-hidden="true" /> 06 99 18 32 16
                </a>
                <a href="mailto:contact@mon-pilates.bzh" className="flex items-center gap-3 text-sm text-mp-text hover:text-mp-ocean">
                  <Mail className="w-4 h-4" aria-hidden="true" /> contact@mon-pilates.bzh
                </a>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </>
  )
}
