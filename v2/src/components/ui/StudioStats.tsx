"use client"

import { AnimatedCounter } from "./AnimatedCounter"

const stats = [
  { value: 50, suffix: "m²", label: "d'espace intérieur" },
  { value: 5, suffix: "", label: "places max par cours" },
  { value: 6, suffix: "", label: "Reformer professionnels" },
  { value: 2, suffix: "", label: "instructrices certifiées" },
]

export function StudioStats() {
  return (
    <div className="grid grid-cols-2 gap-6 mb-8">
      {stats.map((stat) => (
        <div key={stat.label}>
          <p className="font-heading text-3xl font-bold text-mp-ocean">
            <AnimatedCounter end={stat.value} suffix={stat.suffix} />
          </p>
          <p className="font-body text-sm text-mp-text-light">{stat.label}</p>
        </div>
      ))}
    </div>
  )
}
