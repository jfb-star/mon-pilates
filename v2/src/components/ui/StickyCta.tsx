"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Calendar } from "lucide-react"
import { useIsFirstTimer } from "@/hooks/useIsFirstTimer"

interface StickyCtaProps {
  text?: string
  href?: string
  price?: string
}

export function StickyCta({
  text = "Cours d'essai",
  href = "/planning",
  price = "10€",
}: StickyCtaProps) {
  const [visible, setVisible] = useState(false)
  const isFirstTimer = useIsFirstTimer()
  const showTrial = isFirstTimer !== false

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const nearBottom =
        scrollY + window.innerHeight >
        document.documentElement.scrollHeight - 300
      setVisible(scrollY > 800 && !nearBottom)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div
      role="complementary"
      aria-hidden={!visible}
      tabIndex={-1}
      className={`fixed bottom-0 left-0 right-0 z-30 hidden sm:block transition-transform duration-300 ${
        visible ? "translate-y-0" : "translate-y-full pointer-events-none"
      }`}
    >
      <div className="bg-mp-charcoal/95 backdrop-blur-xl border-t border-white/10">
        <div className="mp-container flex items-center justify-between py-3">
          <p className="font-heading text-sm text-white/80">
            {showTrial ? (
              <>
                <span className="font-semibold text-white">Première séance à {price}</span>
                {" "}— Satisfait(e) ou remboursé(e)
              </>
            ) : (
              <span className="font-semibold text-white">R&eacute;servez votre prochain cours</span>
            )}
          </p>
          <Link
            href={href}
            tabIndex={visible ? 0 : -1}
            className="mp-btn mp-btn-primary !py-2.5 !px-6 text-sm"
          >
            <Calendar className="w-4 h-4" aria-hidden="true" />
            {showTrial ? `${text} — ${price}` : "R\u00e9server un cours"}
          </Link>
        </div>
      </div>
    </div>
  )
}
