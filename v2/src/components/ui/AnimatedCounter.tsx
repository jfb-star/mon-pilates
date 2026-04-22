"use client"

import { useEffect, useRef, useState } from "react"

interface AnimatedCounterProps {
  end: number
  suffix?: string
  prefix?: string
  duration?: number
  decimals?: number
}

export function AnimatedCounter({
  end,
  suffix = "",
  prefix = "",
  duration = 900,
  decimals = 0,
}: AnimatedCounterProps) {
  // Start close to end so a glance never shows wildly-wrong numbers
  // (e.g. "2.3/5" during animation read as a bad rating).
  const startFraction = 0.85
  const [value, setValue] = useState(end * startFraction)
  const ref = useRef<HTMLSpanElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setValue(end)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true
          const startValue = end * startFraction
          const delta = end - startValue
          const start = performance.now()
          const animate = (now: number) => {
            const elapsed = now - start
            const progress = Math.min(elapsed / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            setValue(startValue + eased * delta)
            if (progress < 1) requestAnimationFrame(animate)
          }
          requestAnimationFrame(animate)
        }
      },
      { threshold: 0.5 },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [end, duration])

  const display = decimals > 0 ? value.toFixed(decimals) : Math.round(value)

  return (
    <span ref={ref}>
      {prefix}
      {display}
      {suffix}
    </span>
  )
}
