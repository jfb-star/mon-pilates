"use client"

import React, { useEffect, useRef } from "react"
import { AlertTriangle, X } from "lucide-react"
import { clsx } from "clsx"

interface ConfirmDialogProps {
  open: boolean
  title: string
  /** Description/body. Pass a React node if you need to emphasize the item name. */
  description: React.ReactNode
  confirmLabel?: string
  cancelLabel?: string
  variant?: "danger" | "default"
  loading?: boolean
  onConfirm: () => void
  onCancel: () => void
}

/**
 * Destructive-action confirm dialog.
 *
 * Replaces raw `confirm()` calls so the user sees the item being acted on,
 * the button is clearly destructive, Escape/backdrop cancel, and focus is
 * trapped inside the dialog while open.
 */
export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirmer",
  cancelLabel = "Annuler",
  variant = "danger",
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const confirmBtnRef = useRef<HTMLButtonElement>(null)
  const previouslyFocused = useRef<HTMLElement | null>(null)

  // Escape to close, focus trap, restore focus
  useEffect(() => {
    if (!open) return
    previouslyFocused.current = document.activeElement as HTMLElement | null
    // Focus the cancel action by default (safer for destructive dialogs)
    const t = window.setTimeout(() => {
      confirmBtnRef.current?.focus()
    }, 0)

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault()
        if (!loading) onCancel()
        return
      }
      if (e.key === "Tab" && dialogRef.current) {
        const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
        if (focusables.length === 0) return
        const first = focusables[0]!
        const last = focusables[focusables.length - 1]!
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener("keydown", onKey)
    return () => {
      window.clearTimeout(t)
      document.removeEventListener("keydown", onKey)
      previouslyFocused.current?.focus?.()
    }
  }, [open, loading, onCancel])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
    >
      <div
        className="absolute inset-0 bg-black/50"
        onClick={() => {
          if (!loading) onCancel()
        }}
        aria-hidden="true"
      />
      <div
        ref={dialogRef}
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
      >
        <div className="flex items-start gap-4 p-6">
          <div
            className={clsx(
              "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
              variant === "danger"
                ? "bg-red-100 text-red-600"
                : "bg-mp-ocean/10 text-mp-ocean"
            )}
            aria-hidden="true"
          >
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h3
              id="confirm-dialog-title"
              className="font-heading text-lg font-semibold text-mp-charcoal"
            >
              {title}
            </h3>
            <div className="mt-1 text-sm text-mp-text-light">
              {description}
            </div>
          </div>
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors text-gray-400 disabled:opacity-50"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex items-center justify-end gap-2 px-6 py-4 bg-gray-50 border-t border-gray-100">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 rounded-lg text-sm font-medium text-mp-charcoal hover:bg-gray-100 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mp-ocean disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            ref={confirmBtnRef}
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={clsx(
              "px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-60 disabled:cursor-not-allowed",
              variant === "danger"
                ? "bg-red-600 hover:bg-red-700 focus-visible:outline-red-600"
                : "bg-mp-ocean hover:bg-mp-ocean-dark focus-visible:outline-mp-ocean"
            )}
          >
            {loading ? "…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
