"use client"
import { useMemo } from "react"

export function OceanParticles() {
  const particles = useMemo(() =>
    Array.from({ length: 25 }, (_, i) => ({
      id: i,
      size: Math.random() * 6 + 2,
      x: Math.random() * 100,
      delay: Math.random() * 20,
      duration: Math.random() * 15 + 15,
      opacity: Math.random() * 0.3 + 0.05,
      drift: (Math.random() - 0.5) * 30,
    }))
  , [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none motion-safe:block motion-reduce:hidden" aria-hidden="true">
      {particles.map(p => (
        <span
          key={p.id}
          className="absolute rounded-full animate-ocean-float"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            bottom: '-10px',
            opacity: p.opacity,
            background: `radial-gradient(circle, rgba(107,159,173,0.6), rgba(143,170,139,0.3))`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            '--drift': `${p.drift}px`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  )
}
