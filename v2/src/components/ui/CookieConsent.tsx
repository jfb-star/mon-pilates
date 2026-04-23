"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

const COOKIE_KEY = "mp_cookie_consent"

export function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_KEY)
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1500)
      return () => clearTimeout(timer)
    }
  }, [])

  function accept() {
    localStorage.setItem(COOKIE_KEY, "accepted")
    setVisible(false)
  }

  function decline() {
    localStorage.setItem(COOKIE_KEY, "declined")
    setVisible(false)
  }

  return (
    <div
      role="dialog"
      aria-label="Consentement aux cookies"
      aria-modal="false"
      aria-live="polite"
      tabIndex={visible ? undefined : -1}
      className={`fixed bottom-0 left-0 right-0 z-[70] p-4 sm:p-6 transition-all duration-400 ${
        visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-full pointer-events-none"
      }`}
    >
      <div className="mp-container">
        <div className="bg-mp-cream rounded-2xl shadow-2xl border border-mp-sand-dark/30 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 max-w-4xl mx-auto">
          <div className="flex-1">
            <p className="font-heading font-semibold text-mp-charcoal text-sm mb-1">
              Ce site utilise des cookies
            </p>
            <p className="font-body text-xs text-mp-text-light leading-relaxed">
              Nous utilisons uniquement des cookies essentiels au fonctionnement du site.
              Aucun cookie publicitaire ou de suivi.{" "}
              <Link
                href="/politique-cookies"
                className="text-mp-ocean underline"
              >
                Politique cookies
              </Link>
              {" · "}
              <Link
                href="/politique-confidentialite"
                className="text-mp-ocean underline"
              >
                Confidentialité
              </Link>
            </p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <button
              type="button"
              onClick={decline}
              className="px-4 py-2 rounded-full text-sm font-heading font-medium text-mp-text-light hover:text-mp-charcoal border border-mp-sand-dark hover:border-mp-charcoal/30 transition-colors focus:outline-none focus-visible:outline-2 focus-visible:outline-mp-ocean focus-visible:outline-offset-2"
            >
              Refuser
            </button>
            <button
              type="button"
              onClick={accept}
              className="px-5 py-2 rounded-full text-sm font-heading font-semibold bg-mp-ocean text-white hover:bg-mp-ocean-dark transition-colors shadow-sm focus:outline-none focus-visible:outline-2 focus-visible:outline-mp-ocean focus-visible:outline-offset-2"
            >
              Accepter
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
