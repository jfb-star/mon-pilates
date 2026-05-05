"use client"

import { Keyboard } from "lucide-react"

/**
 * Modal listing every keyboard shortcut available in the admin panel.
 * Triggered by pressing `?` (handled in AdminShell). Two columns: navigation
 * chord shortcuts (g + letter) and command palette / global actions.
 *
 * Kept in sync by hand with AdminShell's keydown handler — there's no
 * single source of truth (the chord map is small enough that doing so
 * via a registry would be overkill).
 */

interface Shortcut {
  keys: string[]
  label: string
}

const NAV_SHORTCUTS: Shortcut[] = [
  { keys: ["g", "d"], label: "Tableau de bord" },
  { keys: ["g", "s"], label: "Séances" },
  { keys: ["g", "b"], label: "Réservations" },
  { keys: ["g", "u"], label: "Membres" },
  { keys: ["g", "m"], label: "Migration Bsport" },
]

const GLOBAL_SHORTCUTS: Shortcut[] = [
  { keys: ["⌘", "K"], label: "Ouvrir la palette de commandes" },
  { keys: ["?"], label: "Afficher cette aide" },
  { keys: ["Esc"], label: "Fermer une boîte de dialogue" },
]

export function ShortcutsDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/30 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 mb-4">
          <Keyboard className="w-5 h-5 text-mp-ocean" />
          <h3 className="font-heading text-lg font-bold text-mp-charcoal">Raccourcis clavier</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <ShortcutGroup title="Navigation" shortcuts={NAV_SHORTCUTS} />
          <ShortcutGroup title="Global" shortcuts={GLOBAL_SHORTCUTS} />
        </div>

        <p className="text-[11px] text-gray-400 mt-5">
          Astuce&nbsp;: les raccourcis « g + lettre » se déclenchent uniquement quand le focus n&apos;est pas dans un champ de saisie.
        </p>

        <div className="flex justify-end mt-4">
          <button onClick={onClose} className="text-sm text-gray-500 hover:text-mp-charcoal">Fermer</button>
        </div>
      </div>
    </div>
  )
}

function ShortcutGroup({ title, shortcuts }: { title: string; shortcuts: Shortcut[] }) {
  return (
    <div>
      <p className="text-[10px] font-heading uppercase tracking-wider text-gray-400 mb-2">{title}</p>
      <ul className="space-y-1.5">
        {shortcuts.map((s) => (
          <li key={s.label} className="flex items-center justify-between text-sm">
            <span className="text-mp-charcoal">{s.label}</span>
            <span className="flex items-center gap-1">
              {s.keys.map((k, i) => (
                <kbd key={i} className="text-[11px] bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded border border-gray-200 min-w-[20px] text-center">
                  {k}
                </kbd>
              ))}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
