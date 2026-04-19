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
  UserCheck,
} from "lucide-react"
import { clsx } from "clsx"

interface AdminInstructor {
  id: string
  userId: string
  slug: string
  bio: string | null
  photo: string | null
  certifications: string | null
  specialties: string[]
  name: string
  email: string
  role: string
  sessionCount: number
  scheduleCount: number
}

interface FormState {
  name: string
  email: string
  slug: string
  bio: string
  photo: string
  certifications: string
  specialties: string
}

const emptyForm: FormState = {
  name: "",
  email: "",
  slug: "",
  bio: "",
  photo: "",
  certifications: "",
  specialties: "",
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
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
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

export default function AdminInstructorsPage() {
  const { data: authSession, status: authStatus } = useSession()
  const router = useRouter()
  const role = (authSession?.user as { role?: string } | undefined)?.role
  const isAdmin = role === "ADMIN" || role === "INSTRUCTOR"

  const [instructors, setInstructors] = useState<AdminInstructor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<AdminInstructor | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [createdInfo, setCreatedInfo] = useState<{ email: string; password: string } | null>(null)

  useEffect(() => {
    if (authStatus === "unauthenticated") router.push("/connexion")
    else if (authStatus === "authenticated" && !isAdmin) router.push("/compte")
  }, [authStatus, isAdmin, router])

  const fetchInstructors = useCallback(() => {
    setLoading(true)
    fetch("/api/admin/instructors")
      .then((r) => {
        if (r.status === 403) throw new Error("forbidden")
        return r.json()
      })
      .then((data) => setInstructors(data.instructors ?? []))
      .catch((err) => {
        if (err.message === "forbidden") setError("Accès réservé aux administrateurs.")
        else setError("Impossible de charger les coachs.")
      })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (authStatus === "authenticated" && isAdmin) fetchInstructors()
  }, [authStatus, isAdmin, fetchInstructors])

  const openCreate = () => {
    setEditing(null)
    setForm(emptyForm)
    setFormError(null)
    setShowForm(true)
  }

  const openEdit = (i: AdminInstructor) => {
    setEditing(i)
    setForm({
      name: i.name,
      email: i.email,
      slug: i.slug,
      bio: i.bio ?? "",
      photo: i.photo ?? "",
      certifications: i.certifications ?? "",
      specialties: i.specialties.join(", "),
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
        email: form.email,
        slug: form.slug,
        bio: form.bio,
        photo: form.photo,
        certifications: form.certifications,
        specialties: form.specialties,
      }
      const res = editing
        ? await fetch(`/api/admin/instructors/${editing.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
        : await fetch("/api/admin/instructors", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
      const data = await res.json()
      if (!res.ok) {
        setFormError(data.error || "Erreur lors de l'enregistrement.")
        return
      }
      if (!editing && data.tempPassword) {
        setCreatedInfo({ email: form.email, password: data.tempPassword })
      }
      closeForm()
      fetchInstructors()
    } catch {
      setFormError("Erreur réseau.")
    } finally {
      setSaving(false)
    }
  }

  const remove = async (i: AdminInstructor) => {
    if (!confirm(`Supprimer le coach ${i.name} ?`)) return
    const res = await fetch(`/api/admin/instructors/${i.id}`, { method: "DELETE" })
    const data = await res.json()
    if (!res.ok) alert(data.error || "Erreur")
    fetchInstructors()
  }

  if (loading && !instructors.length) {
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
            <h1 className="font-heading text-xl font-bold text-mp-charcoal">Coachs</h1>
          </div>
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 px-4 py-2 bg-mp-ocean text-white rounded-lg text-sm font-medium hover:bg-mp-ocean-dark transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nouveau coach
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {createdInfo && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
            <p className="text-sm font-semibold text-emerald-900 mb-1">Coach créé.</p>
            <p className="text-xs text-emerald-800">
              Mot de passe temporaire pour {createdInfo.email} :
              <code className="ml-2 px-2 py-0.5 bg-white rounded border border-emerald-200 font-mono">
                {createdInfo.password}
              </code>
            </p>
            <p className="text-xs text-emerald-700 mt-2">
              Transmettez-le à l&apos;intéressé, qui pourra le changer via &laquo; Mot de passe oublié &raquo;.
            </p>
            <button
              onClick={() => setCreatedInfo(null)}
              className="mt-2 text-xs text-emerald-800 hover:underline"
            >
              Masquer
            </button>
          </div>
        )}

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Coach</th>
                <th className="px-4 py-3 text-left font-medium">Slug</th>
                <th className="px-4 py-3 text-left font-medium">Spécialités</th>
                <th className="px-4 py-3 text-left font-medium">Séances</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {instructors.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                    Aucun coach pour le moment.
                  </td>
                </tr>
              )}
              {instructors.map((i) => (
                <tr key={i.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {i.photo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={i.photo}
                          alt={i.name}
                          className="w-9 h-9 rounded-full object-cover bg-gray-100"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-mp-ocean/10 flex items-center justify-center">
                          <UserCheck className="w-4 h-4 text-mp-ocean" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="font-medium text-mp-charcoal truncate">{i.name}</div>
                        <div className="text-xs text-gray-500 truncate">{i.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600 font-mono text-xs">{i.slug}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {i.specialties.slice(0, 3).map((s) => (
                        <span
                          key={s}
                          className="inline-flex px-2 py-0.5 rounded-full text-xs bg-mp-ocean/10 text-mp-ocean-dark"
                        >
                          {s}
                        </span>
                      ))}
                      {i.specialties.length > 3 && (
                        <span className="text-xs text-gray-400">+{i.specialties.length - 3}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {i.sessionCount} séance{i.sessionCount > 1 ? "s" : ""}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEdit(i)}
                        className="p-1.5 text-gray-500 hover:text-mp-ocean hover:bg-mp-ocean/10 rounded-lg"
                        aria-label="Modifier"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => remove(i)}
                        className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                        aria-label="Supprimer"
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
        title={editing ? "Modifier le coach" : "Nouveau coach"}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field
              label="Nom"
              value={form.name}
              onChange={(v) => setForm({ ...form, name: v })}
              required
            />
            <Field
              label="Email"
              type="email"
              value={form.email}
              onChange={(v) => setForm({ ...form, email: v })}
              required
            />
          </div>
          <Field
            label="Slug"
            value={form.slug}
            onChange={(v) => setForm({ ...form, slug: v })}
            hint="Identifiant URL unique (ex: jeanne-dupont)"
            required
          />
          <Field
            label="Photo URL"
            value={form.photo}
            onChange={(v) => setForm({ ...form, photo: v })}
          />
          <Field
            label="Certifications"
            value={form.certifications}
            onChange={(v) => setForm({ ...form, certifications: v })}
            hint="Texte libre"
          />
          <Field
            label="Spécialités"
            value={form.specialties}
            onChange={(v) => setForm({ ...form, specialties: v })}
            hint="Séparées par des virgules (ex: Pilates, Matwork, Prénatal)"
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
            <textarea
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-mp-ocean focus:border-mp-ocean resize-y"
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
              disabled={saving || !form.name || !form.email || !form.slug}
              className={clsx(
                "inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                saving || !form.name || !form.email || !form.slug
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-mp-ocean text-white hover:bg-mp-ocean-dark"
              )}
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {editing ? "Enregistrer" : "Créer le coach"}
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
