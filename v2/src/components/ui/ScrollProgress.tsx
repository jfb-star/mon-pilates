"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"

export function ScrollProgress() {
  const [progress, setProgress] = useState(0)
  const pathname = usePathname()

  // Show on content-rich pages
  const showOnPages = !pathname.startsWith("/admin") && !pathname.startsWith("/connexion")

  useEffect(() => {
    if (!showOnPages) return
    function handleScroll() {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      if (docHeight > 0) {
        setProgress(Math.min((scrollTop / docHeight) * 100, 100))
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [showOnPages])

  if (!showOnPages || progress < 1) return null

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[60] h-[3px] pointer-events-none"
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Progression de lecture"
    >
      <div
        className="h-full bg-gradient-to-r from-mp-ocean to-mp-sage transition-[width] duration-100 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}
