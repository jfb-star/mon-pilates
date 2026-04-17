"use client"

import { useState, useEffect } from "react"

const SCHEDULE: Record<number, [number, number] | null> = {
  0: null,          // Dimanche
  1: [9, 20],       // Lundi
  2: [9, 20],       // Mardi
  3: [9, 20],       // Mercredi
  4: [9, 20],       // Jeudi
  5: [9, 20],       // Vendredi
  6: [9, 14],       // Samedi
}

const DAY_NAMES = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"]

function getNextOpenInfo(now: Date): string {
  const currentDay = now.getDay()
  const currentHour = now.getHours()
  const todaySchedule = SCHEDULE[currentDay]

  // If before opening today
  if (todaySchedule && currentHour < todaySchedule[0]) {
    return `Ouvre à ${todaySchedule[0]}h`
  }

  // Find next open day
  for (let offset = 1; offset <= 7; offset++) {
    const nextDay = (currentDay + offset) % 7
    const hours = SCHEDULE[nextDay]
    if (hours) {
      if (offset === 1) return `Ouvre demain à ${hours[0]}h`
      return `Ouvre ${DAY_NAMES[nextDay]} à ${hours[0]}h`
    }
  }
  return ""
}

export function OpenStatus() {
  const [isOpen, setIsOpen] = useState<boolean | null>(null)
  const [nextOpen, setNextOpen] = useState("")

  useEffect(() => {
    const check = () => {
      const now = new Date()
      const hours = SCHEDULE[now.getDay()]
      if (!hours) {
        setIsOpen(false)
        setNextOpen(getNextOpenInfo(now))
        return
      }
      const h = now.getHours()
      const open = h >= hours[0] && h < hours[1]
      setIsOpen(open)
      if (!open) {
        setNextOpen(getNextOpenInfo(now))
      }
    }
    check()
    const interval = setInterval(check, 60_000)
    return () => clearInterval(interval)
  }, [])

  if (isOpen === null) return null

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-heading font-semibold ${
        isOpen
          ? "bg-emerald-50 text-emerald-700"
          : "bg-red-50 text-red-600"
      }`}
    >
      <span
        className={`w-2 h-2 rounded-full ${
          isOpen ? "bg-emerald-500 animate-pulse" : "bg-red-400"
        }`}
      />
      {isOpen ? "Ouvert maintenant" : `Fermé${nextOpen ? ` · ${nextOpen}` : ""}`}
    </span>
  )
}
