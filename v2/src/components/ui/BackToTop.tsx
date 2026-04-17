"use client"

import { useState, useEffect } from "react"
import { ArrowUp } from "lucide-react"
import { clsx } from "clsx"

export function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 600)
    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Retour en haut de page"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      className={clsx(
        "fixed bottom-24 sm:bottom-6 right-6 z-40 w-12 h-12 rounded-full bg-mp-ocean/90 text-white shadow-lg backdrop-blur-sm flex items-center justify-center transition-all duration-300",
        "hover:bg-mp-ocean hover:shadow-xl hover:-translate-y-1",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      )}
    >
      <ArrowUp className="w-5 h-5" aria-hidden="true" />
    </button>
  )
}
