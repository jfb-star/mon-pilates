"use client"

import { useCallback, useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  Plus,
  Loader2,
  Shield,
  X,
  Edit3,
  Trash2,
  Send,
  RefreshCcw,
  Megaphone,
} from "lucide-react"
import { clsx } from "clsx"

interface Audience {
  id: string
  name: string
}

interface AdminCampaign {
  id: string
  name: string
  subject: string
  mjmlSource: string
  htmlCompiled: string
  status: string
  resendBroadcastId: string | null
  resendAudienceId: string | null
  scheduledAt: string | null
  sentAt: string | null
  stats: Record<string, unknown>
  createdAt: string
  updatedAt: string
}

interface FormState {
  name: string
  subject: string
  mjmlSource: string
  resendAudienceId: string
}

const emptyForm: FormState = {
  name: "",
  subject: "",
  mjmlSource: "",
  resendAudienceId: "",
}

function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h3 className="font-heading text-lg font-semibold text-mp-charcoal">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    DRAFT: "bg-gray-100 text-gray-700",
    SCHEDULED: "bg-amber-100 text-amber-700",
    SENDING: "bg-blue-100 text-blue-700",
    SENT: "bg-emerald-100 text-emerald-700",
    FAILED: "bg-red-100 text-red-700",
  }
  return (
    <span
      className={clsx(
        "inline-flex px-2 py-0.5 rounded-full text-xs font-medium",
        map[status] ?? "bg-gray-100 text-gray-700"
      )}
    >
      {status}
    </span>
  )
}

function extractCount(stats: Record<string, unknown>, keys: string[]): number | null {
  for (const k of keys) {
    const v = stats[k]
    if (typeof v === "number") return v
  }
  return null
}

export default function AdminEmailCampaignsPage() {
  const { data: authSession, status: authStatus } = useSession()
  const router = useRouter()
  const role = (authSession?.user as { role?: string } | undefined)?.role
  const isAdmin = role === "ADMIN" || role === "INSTRUCTOR"

  const [campaigns, setCampaigns] = useState<AdminCampaign[]>([])
  const [audiences, setAudiences] = useState<Audience[]>([])
  const [audiencesError, setAudiencesError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<AdminCampaign | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)

  useEffect(() => {
    if (authStatus === "unauthenticated") router.push("/connexion")
    else if (authStatus === "authenticated" && !isAdmin) router.push("/compte")
  }, [authStatus, isAdmin, router])

  const fetchCampaigns = useCallback(() => {
    setLoading(true)
    fetch("/api/admin/email-campaigns")
      .then((r) => {
        if (r.status === 403) throw new Error("forbidden")
        return r.json()
      })
      .then((data) => setCampaigns(data.campaigns ?? []))
      .catch((err) => {
        if (err.message === "forbidden") setError("Accès réservé aux administrateurs.")
        else setError("Impossible de charger les campagnes.")
      })
      .finally(() => setLoading(false))
  }, [])

  const fetchAudiences = useCallback(() => {
    fetch("/api/admin/email-audiences")
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setAudiencesError(data.error)
        else setAudiences(data.audiences ?? [])
      })
      .catch(() => setAudiencesError("Impossible de charger les audiences."))
  }, [])

  useEffect(() => {
    if (authStatus === "authenticated" && isAdmin) {
      fetchCampaigns()
      fetchAudiences()
    }
  }, [authStatus, isAdmin, fetchCampaigns, fetchAudiences])

  const openCreate = () => {
    setEditing(null)
    setForm(emptyForm)
    setFormError(null)
    setShowForm(true)
  }

  const openEdit = (c: AdminCampaign) => {
    setEditing(c)
    setForm({
      name: c.name,
      subject: c.subject,
      mjmlSource: c.mjmlSource,
      resendAudienceId: c.resendAudienceId ?? "",
    })
    setFormError(null)
    setShowForm(true)
  }

  const closeForm = () => {
    setShowForm(false)
    setEditing(null)
    setFormError(null)
  }

  const save = async () => {
    setSaving(true)
    setFormError(null)
    try {
      const payload = {
        name: form.name,
        subject: form.subject,
        mjmlSource: form.mjmlSource,
        resendAudienceId: form.resendAudienceId || null,
      }
      const res = editing
        ? await fetch(`/api/admin/email-campaigns/${editing.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
        : await fetch("/api/admin/email-campaigns", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
      const data = await res.json()
      if (!res.ok) {
        setFormError(data.error || "Erreur lors de l'enregistrement.")
        return
      }
      closeForm()
      fetchCampaigns()
    } catch {
      setFormError("Erreur réseau.")
    } finally {
      setSaving(false)
    }
  }

  const remove = async (c: AdminCampaign) => {
    if (!confirm(`Supprimer la campagne "${c.name}" ?`)) return
    const res = await fetch(`/api/admin/email-campaigns/${c.id}`, {
      method: "DELETE",
    })
    const data = await res.json()
    if (!res.ok) alert(data.error || "Erreur")
    fetchCampaigns()
  }

  const sendCampaign = async (c: AdminCampaign) => {
    if (
      !confirm(
        `Envoyer la campagne "${c.name}" à l'audience sélectionnée ? Cette action est irréversible.`
      )
    )
      return
    setBusyId(c.id)
    try {
      const res = await fetch(`/api/admin/email-campaigns/${c.id}/send`, {
        method: "POST",
      })
      const data = await res.json()
      if (!res.ok) alert(data.error || "Erreur")
      else setInfo(`Campagne "${c.name}" envoyée.`)
      fetchCampaigns()
    } catch {
      alert("Erreur réseau.")
    } finally {
      setBusyId(null)
    }
  }

  const refreshStats = async (c: AdminCampaign) => {
    setBusyId(c.id)
    try {
      const res = await fetch(
        `/api/admin/email-campaigns/${c.id}/refresh-stats`,
        { method: "POST" }
      )
      const data = await res.json()
      if (!res.ok) alert(data.error || "Erreur")
      fetchCampaigns()
    } catch {
      alert("Erreur réseau.")
    } finally {
      setBusyId(null)
    }
  }

  if (loading && !campaigns.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-mp-cream">
        <Loader2 className="w-8 h-8 animate-spin text-mp-ocean" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-mp-cream gap-4">
        <Shield className="w-12 h-12 text-red-400" />
        <p className="font-heading text-lg text-mp-charcoal">{error}</p>
        <Link href="/admin" className="text-mp-ocean hover:underline text-sm">
          Retour à l&apos;administration
        </Link>
      </div>
    )
  }

  const audienceName = (id: string | null) =>
    id ? audiences.find((a) => a.id === id)?.name ?? id : "—"

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="flex items-center gap-1.5 text-sm text-mp-text-light hover:text-mp-ocean transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Administration
            </Link>
            <div className="h-5 w-px bg-gray-200" />
            <h1 className="font-heading text-xl font-bold text-mp-charcoal">
              Campagnes
            </h1>
          </div>
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 px-4 py-2 bg-mp-ocean text-white rounded-lg text-sm font-medium hover:bg-mp-ocean-dark transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nouvelle campagne
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {info && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between">
            <p className="text-sm text-emerald-800">{info}</p>
            <button
              onClick={() => setInfo(null)}
              className="text-xs text-emerald-700 hover:underline"
            >
              Masquer
            </button>
          </div>
        )}

        {audiencesError && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-800">
              Audiences Resend : {audiencesError}
            </p>
          </div>
        )}

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Nom</th>
                <th className="px-4 py-3 text-left font-medium">Sujet</th>
                <th className="px-4 py-3 text-left font-medium">Statut</th>
                <th className="px-4 py-3 text-left font-medium">Audience</th>
                <th className="px-4 py-3 text-left font-medium">Envoyée</th>
                <th className="px-4 py-3 text-left font-medium">Ouvertures / Clics</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {campaigns.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                    Aucune campagne pour le moment.
                  </td>
                </tr>
              )}
              {campaigns.map((c) => {
                const opens = extractCount(c.stats, [
                  "opens",
                  "opened",
                  "open_count",
                  "opened_count",
                ])
                const clicks = extractCount(c.stats, [
                  "clicks",
                  "clicked",
                  "click_count",
                  "clicked_count",
                ])
                const refreshed =
                  typeof c.stats?.["_refreshedAt"] === "string"
                    ? (c.stats["_refreshedAt"] as string)
                    : null
                const busy = busyId === c.id
                return (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Megaphone className="w-4 h-4 text-mp-ocean" />
                        <span className="text-mp-charcoal">{c.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600 truncate max-w-xs">
                      {c.subject}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={c.status} />
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-xs">
                      {audienceName(c.resendAudienceId)}
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {c.sentAt
                        ? new Date(c.sentAt).toLocaleString("fr-FR")
                        : "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-xs">
                      {c.status === "SENT" ? (
                        <div>
                          <div>
                            {opens ?? "?"} / {clicks ?? "?"}
                          </div>
                          {refreshed && (
                            <div className="text-gray-400">
                              MAJ {new Date(refreshed).toLocaleString("fr-FR")}
                            </div>
                          )}
                        </div>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        {c.status === "DRAFT" && (
                          <>
                            <button
                              onClick={() => openEdit(c)}
                              className="p-1.5 text-gray-500 hover:text-mp-ocean hover:bg-mp-ocean/10 rounded-lg"
                              aria-label="Modifier"
                              title="Modifier"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => sendCampaign(c)}
                              disabled={busy || !c.resendAudienceId}
                              className={clsx(
                                "p-1.5 rounded-lg",
                                busy || !c.resendAudienceId
                                  ? "text-gray-300 cursor-not-allowed"
                                  : "text-gray-500 hover:text-emerald-600 hover:bg-emerald-50"
                              )}
                              aria-label="Envoyer"
                              title={
                                c.resendAudienceId
                                  ? "Envoyer"
                                  : "Aucune audience configurée"
                              }
                            >
                              {busy ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Send className="w-4 h-4" />
                              )}
                            </button>
                            <button
                              onClick={() => remove(c)}
                              className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                              aria-label="Supprimer"
                              title="Supprimer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        {c.status === "SENT" && (
                          <button
                            onClick={() => refreshStats(c)}
                            disabled={busy}
                            className={clsx(
                              "p-1.5 rounded-lg",
                              busy
                                ? "text-gray-300 cursor-not-allowed"
                                : "text-gray-500 hover:text-mp-ocean hover:bg-mp-ocean/10"
                            )}
                            aria-label="Rafraîchir les stats"
                            title="Rafraîchir les stats"
                          >
                            {busy ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <RefreshCcw className="w-4 h-4" />
                            )}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </main>

      <Modal
        open={showForm}
        onClose={closeForm}
        title={editing ? "Modifier la campagne" : "Nouvelle campagne"}
      >
        <div className="space-y-4">
          <Field
            label="Nom"
            value={form.name}
            onChange={(v) => setForm({ ...form, name: v })}
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Audience <span className="text-red-500">*</span>
            </label>
            <select
              value={form.resendAudienceId}
              onChange={(e) =>
                setForm({ ...form, resendAudienceId: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-mp-ocean focus:border-mp-ocean bg-white"
            >
              <option value="">— Choisir une audience —</option>
              {audiences.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
            {audiencesError && (
              <p className="mt-1 text-xs text-amber-600">{audiencesError}</p>
            )}
          </div>
          <Field
            label="Sujet"
            value={form.subject}
            onChange={(v) => setForm({ ...form, subject: v })}
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Source MJML / HTML <span className="text-red-500">*</span>
            </label>
            <textarea
              value={form.mjmlSource}
              onChange={(e) => setForm({ ...form, mjmlSource: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-mp-ocean focus:border-mp-ocean resize-y"
              style={{ minHeight: "300px" }}
              spellCheck={false}
            />
          </div>

          {formError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {formError}
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              onClick={closeForm}
              className="px-4 py-2 text-sm text-gray-600 hover:text-mp-charcoal transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={save}
              disabled={
                saving ||
                !form.name ||
                !form.subject ||
                !form.mjmlSource
              }
              className={clsx(
                "inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                saving || !form.name || !form.subject || !form.mjmlSource
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-mp-ocean text-white hover:bg-mp-ocean-dark"
              )}
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {editing ? "Enregistrer" : "Créer la campagne"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  hint,
  required,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
  hint?: string
  required?: boolean
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-mp-ocean focus:border-mp-ocean"
      />
      {hint && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
    </div>
  )
}
