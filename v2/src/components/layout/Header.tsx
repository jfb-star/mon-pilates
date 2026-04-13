"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X, Calendar } from "lucide-react"
import { clsx } from "clsx"

const navigation = [
  { name: "Nos cours", href: "/cours" },
  { name: "Planning", href: "/planning" },
  { name: "Tarifs", href: "/tarifs" },
  { name: "L'\u00e9quipe", href: "/equipe" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/contact" },
]

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => { document.body.style.overflow = "" }
  }, [mobileOpen])

  const headerSolid = scrolled || mobileOpen

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:mp-btn focus:mp-btn-primary"
      >
        Aller au contenu principal
      </a>

      {/* Top bar */}
      <header
        className={clsx(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          headerSolid
            ? "bg-white/95 backdrop-blur-xl shadow-[0_1px_20px_rgba(0,0,0,0.06)]"
            : "bg-gradient-to-b from-black/30 to-transparent"
        )}
      >
        <div
          className={clsx(
            "mp-container flex items-center justify-between transition-all duration-500",
            headerSolid ? "h-[72px]" : "h-24"
          )}
        >
          {/* Logo */}
          <Link href="/" className="relative flex items-center group">
            <Image
              src="/images/logo.png"
              alt="Mon Pilates"
              width={160}
              height={60}
              className={clsx(
                "h-12 w-auto transition-all duration-500 object-contain",
                headerSolid ? "" : "brightness-0 invert"
              )}
              priority
            />
          </Link>

          {/* Desktop navigation */}
          <nav
            className="hidden lg:flex items-center gap-1"
            aria-label="Navigation principale"
          >
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "font-heading text-[13px] font-medium px-4 py-2 rounded-full transition-all duration-300",
                  "relative after:absolute after:bottom-0.5 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-[2px] after:rounded-full after:transition-all after:duration-300 hover:after:w-5",
                  scrolled
                    ? "text-mp-charcoal-light hover:text-mp-ocean after:bg-mp-ocean"
                    : "text-white/85 hover:text-white after:bg-white"
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Link
              href="/connexion"
              className={clsx(
                "hidden sm:flex items-center gap-1.5 font-heading text-[13px] font-medium px-3 py-2 rounded-full transition-all",
                scrolled
                  ? "text-mp-charcoal-light hover:text-mp-ocean"
                  : "text-white/80 hover:text-white"
              )}
            >
              Connexion
            </Link>

            <Link
              href="/planning"
              className={clsx(
                "mp-btn hidden sm:inline-flex text-[13px] !py-2.5 !px-5",
                scrolled
                  ? "mp-btn-primary"
                  : "!bg-white/15 !text-white !border-white/30 backdrop-blur-sm hover:!bg-white hover:!text-mp-ocean"
              )}
            >
              <Calendar className="w-4 h-4" />
              R&eacute;server
            </Link>

            {/* Mobile menu button */}
            <button
              type="button"
              className={clsx(
                "lg:hidden p-2.5 rounded-full transition-colors relative z-[60]",
                headerSolid
                  ? "text-mp-charcoal hover:bg-mp-cream"
                  : "text-white hover:bg-white/10"
              )}
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-expanded={mobileOpen}
              aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
            >
              {mobileOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile full-screen overlay menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[55] lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          {/* Panel */}
          <nav
            className="absolute top-[72px] left-0 right-0 bg-white shadow-2xl border-t border-mp-sand/40 animate-[slideDown_0.25s_ease-out]"
            aria-label="Navigation mobile"
          >
            <div className="mp-container py-6 flex flex-col gap-1">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="font-heading text-base font-medium text-mp-charcoal-light hover:text-mp-ocean hover:bg-mp-cream px-4 py-3.5 rounded-xl transition-all"
                >
                  {item.name}
                </Link>
              ))}
              <Link
                href="/connexion"
                onClick={() => setMobileOpen(false)}
                className="font-heading text-base font-medium text-mp-charcoal-light hover:text-mp-ocean hover:bg-mp-cream px-4 py-3.5 rounded-xl transition-all"
              >
                Connexion
              </Link>
              <Link
                href="/planning"
                onClick={() => setMobileOpen(false)}
                className="mp-btn mp-btn-primary mt-4 text-center justify-center"
              >
                <Calendar className="w-4 h-4" />
                R&eacute;server un cours
              </Link>
            </div>
          </nav>
        </div>
      )}
    </>
  )
}
