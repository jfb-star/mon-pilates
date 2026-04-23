"use client"

import { useState, type FormEvent } from "react"
import { Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/Toast"

export function NewsletterForm() {
  const toast = useToast()
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading">("idle")

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!email.trim()) return

    setStatus("loading")

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || "Erreur lors de l'inscription.")
      }

      toast.success("Inscription confirmée ! Vérifiez votre boîte mail.")
      setEmail("")
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Une erreur est survenue."
      toast.error(message)
    } finally {
      setStatus("idle")
    }
  }

  return (
    <form className="flex gap-2" onSubmit={handleSubmit} aria-label="Inscription à la newsletter">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="votre@email.com"
        autoComplete="email"
        required
        className="flex-1 px-4 py-3 rounded-full border border-mp-sand-dark bg-mp-white text-mp-text font-body text-sm focus:outline-none focus-visible:outline-2 focus-visible:outline-mp-ocean focus-visible:outline-offset-2"
        aria-label="Adresse email pour la newsletter"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="mp-btn mp-btn-primary text-sm whitespace-nowrap disabled:opacity-60"
      >
        {status === "loading" ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
            <span className="sr-only">Inscription en cours…</span>
          </>
        ) : (
          "S'abonner"
        )}
      </button>
    </form>
  )
}
