"use client"

import { useState, type FormEvent } from "react"
import { Loader2, CheckCircle } from "lucide-react"

export function NewsletterForm() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMsg, setErrorMsg] = useState("")

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!email.trim()) return

    setStatus("loading")
    setErrorMsg("")

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Erreur lors de l'inscription.")
      }

      setStatus("success")
      setEmail("")
    } catch (err) {
      setStatus("error")
      setErrorMsg(err instanceof Error ? err.message : "Une erreur est survenue.")
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center gap-2 p-4 bg-mp-sage/10 rounded-2xl" role="status" aria-live="polite">
        <CheckCircle className="w-6 h-6 text-mp-sage" aria-hidden="true" />
        <p className="font-heading font-semibold text-mp-sage">Inscription confirmée !</p>
        <p className="font-body text-xs text-mp-text-light">Votre guide « 7 exercices Pilates » arrive dans votre boîte mail.</p>
      </div>
    )
  }

  return (
    <>
      <form className="flex gap-2" onSubmit={handleSubmit} aria-label="Inscription à la newsletter">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="votre@email.com"
          autoComplete="email"
          required
          className="flex-1 px-4 py-3 rounded-full border border-mp-sand-dark bg-mp-white text-mp-text font-body text-sm focus:outline-none focus:border-mp-ocean focus:ring-2 focus:ring-mp-ocean/20"
          aria-label="Adresse email pour la newsletter"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="mp-btn mp-btn-primary text-sm whitespace-nowrap disabled:opacity-60"
        >
          {status === "loading" ? (
            <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
          ) : (
            "S'abonner"
          )}
        </button>
      </form>
      {status === "error" && (
        <p role="alert" className="text-xs text-red-600 mt-2">{errorMsg}</p>
      )}
    </>
  )
}
