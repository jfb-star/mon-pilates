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
  Mail,
  Send,
} from "lucide-react"
import { clsx } from "clsx"

interface AdminTemplate {
  id: string
  key: string
  name: string
  subject: string
  mjmlSource: string
  htmlCompiled: string
  variables: string[]
  updatedAt: string
  createdAt: string
}

interface FormState {
  key: string
  name: string
  subject: string
  mjmlSource: string
  variables: string
}

const emptyForm: FormState = {
  key: "",
  name: "",
  subject: "",
  mjmlSource: "",
  variables: "",
}

function Modal({
  open,
  onClose,
  title,
  children,
  size = "lg",
}: {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  size?: "lg" | "xl" | "2xl"
}) {
  if (!open) return null
  const maxW =
    size === "2xl" ? "max-w-6xl" : size === "xl" ? "max-w-4xl" : "max-w-lg"
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div
        className={clsx(
          "relative bg-white rounded-2xl shadow-2xl w-full mx-4 max-h-[90vh] overflow-y-auto",
          maxW
        )}
      >
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

function substitutePreview(
  html: string,
  variables: string[]
): string {
  let out = html
  for (const v of variables) {
    const re = new RegExp(`\\{\\{\\s*${v}\\s*\\}\\}`, "g")
    out = out.replace(re, `${v} sample`)
  }
  return out
}

export default function AdminEmailTemplatesPage() {
  const { data: authSession, status: authStatus } = useSession()
  const router = useRouter()
  const role = (authSession?.user as { role?: string } | undefined)?.role
  const isAdmin = role === "ADMIN" || role === "INSTRUCTOR"

  const [templates, setTemplates] = useState<AdminTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<AdminTemplate | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)

  useEffect(() => {
    if (authStatus === "unauthenticated") router.push("/connexion")
    else if (authStatus === "authenticated" && !isAdmin) router.push("/compte")
  }, [authStatus, isAdmin, router])

  const fetchTemplates = useCallback(() => {
    setLoading(true)
    fetch("/api/admin/email-templates")
      .then((r) => {
        if (r.status === 403) throw new Error("forbidden")
        return r.json()
      })
      .then((data) => setTemplates(data.templates ?? []))
      .catch((err) => {
        if (err.message === "forbidden") setError("Accès réservé aux administrateurs.")
        else setError("Impossible de charger les templates.")
      })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (authStatus === "authenticated" && isAdmin) fetchTemplates()
  }, [authStatus, isAdmin, fetchTemplates])

  const openCreate = () => {
    setEditing(null)
    setForm(emptyForm)
    setFormError(null)
    setShowForm(true)
  }

  const openEdit = (t: AdminTemplate) => {
    setEditing(t)
    setForm({
      key: t.key,
      name: t.name,
      subject: t.subject,
      mjmlSource: t.mjmlSource,
      variables: t.variables.join(", "),
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
        key: form.key,
        name: form.name,
        subject: form.subject,
        mjmlSource: form.mjmlSource,
        variables: form.variables,
      }
      const res = editing
        ? await fetch(`/api/admin/email-templates/${editing.key}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
        : await fetch("/api/admin/email-templates", {
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
      fetchTemplates()
    } catch {
      setFormError("Erreur réseau.")
    } finally {
      setSaving(false)
    }
  }

  const remove = async (t: AdminTemplate) => {
    if (!confirm(`Supprimer le template ${t.name} ?`)) return
    const res = await fetch(`/api/admin/email-templates/${t.key}`, {
      method: "DELETE",
    })
    const data = await res.json()
    if (!res.ok) alert(data.error || "Erreur")
    fetchTemplates()
  }

  const testSend = async (t: AdminTemplate) => {
    const email = prompt(`Envoyer un test du template "${t.name}" à quelle adresse ?`)
    if (!email) return
    try {
      const res = await fetch(`/api/admin/email-templates/${t.key}/test`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok) {
        alert(data.error || "Erreur")
      } else {
        setInfo(`Email de test envoyé à ${email}.`)
      }
    } catch {
      alert("Erreur réseau.")
    }
  }

  if (loading && !templates.length) {
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

  const previewVars = form.variables
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)

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
              Templates email
            </h1>
          </div>
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 px-4 py-2 bg-mp-ocean text-white rounded-lg text-sm font-medium hover:bg-mp-ocean-dark transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nouveau template
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

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Key</th>
                <th className="px-4 py-3 text-left font-medium">Nom</th>
                <th className="px-4 py-3 text-left font-medium">Sujet</th>
                <th className="px-4 py-3 text-left font-medium">Mis à jour</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {templates.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                    Aucun template pour le moment.
                  </td>
                </tr>
              )}
              {templates.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-mp-ocean" />
                      <code className="text-xs font-mono text-mp-charcoal">
                        {t.key}
                      </code>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-mp-charcoal">{t.name}</td>
                  <td className="px-4 py-3 text-gray-600 truncate max-w-xs">
                    {t.subject}
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {new Date(t.updatedAt).toLocaleString("fr-FR")}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEdit(t)}
                        className="p-1.5 text-gray-500 hover:text-mp-ocean hover:bg-mp-ocean/10 rounded-lg"
                        aria-label="Modifier"
                        title="Modifier"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => testSend(t)}
                        className="p-1.5 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg"
                        aria-label="Envoyer un test"
                        title="Envoyer un test"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => remove(t)}
                        className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                        aria-label="Supprimer"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      <Modal
        open={showForm}
        onClose={closeForm}
        title={editing ? "Modifier le template" : "Nouveau template"}
        size={editing ? "2xl" : "xl"}
      >
        <div
          className={clsx(
            "grid gap-4",
            editing ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"
          )}
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field
                label="Key"
                value={form.key}
                onChange={(v) => setForm({ ...form, key: v })}
                hint="Slug unique (ex: booking_confirm)"
                required
                disabled={!!editing}
              />
              <Field
                label="Nom"
                value={form.name}
                onChange={(v) => setForm({ ...form, name: v })}
                required
              />
            </div>
            <Field
              label="Sujet"
              value={form.subject}
              onChange={(v) => setForm({ ...form, subject: v })}
              required
            />
            <Field
              label="Variables"
              value={form.variables}
              onChange={(v) => setForm({ ...form, variables: v })}
              hint="Séparées par des virgules (ex: firstName, date, link)"
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Source MJML / HTML <span className="text-red-500">*</span>
              </label>
              <textarea
                value={form.mjmlSource}
                onChange={(e) => setForm({ ...form, mjmlSource: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-mp-ocean focus:border-mp-ocean resize-y"
                style={{ minHeight: "400px" }}
                spellCheck={false}
              />
              <p className="mt-1 text-xs text-gray-400">
                Placeholders {"{{"} variable {"}}"} substitués à l&apos;envoi.
              </p>
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
                  !form.key ||
                  !form.name ||
                  !form.subject ||
                  !form.mjmlSource
                }
                className={clsx(
                  "inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  saving ||
                    !form.key ||
                    !form.name ||
                    !form.subject ||
                    !form.mjmlSource
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-mp-ocean text-white hover:bg-mp-ocean-dark"
                )}
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {editing ? "Enregistrer" : "Créer le template"}
              </button>
            </div>
          </div>

          {editing && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Aperçu
              </label>
              <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                <iframe
                  title="Aperçu du template"
                  sandbox="allow-same-origin"
                  srcDoc={substitutePreview(form.mjmlSource, previewVars)}
                  className="w-full"
                  style={{ minHeight: "500px", border: 0 }}
                />
              </div>
              <p className="text-xs text-gray-400">
                Les variables sont remplacées par &laquo; nom sample &raquo;.
              </p>
            </div>
          )}
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
  disabled,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
  hint?: string
  required?: boolean
  disabled?: boolean
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
        disabled={disabled}
        className={clsx(
          "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-mp-ocean focus:border-mp-ocean",
          disabled && "bg-gray-50 text-gray-500 cursor-not-allowed"
        )}
      />
      {hint && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
    </div>
  )
}
