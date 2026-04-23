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
  BadgeCheck,
} from "lucide-react"
import { clsx } from "clsx"
import { useToast } from "@/components/ui/Toast"
import { EmptyState } from "@/components/admin/EmptyState"

interface AdminCourseType {
  id: string
  name: string
  slug: string
  description: string | null
  shortDescription: string | null
  duration: number
  level: string
  intensity: number
  maxParticipants: number
  image: string | null
  color: string | null
  icon: string | null
  benefits: string[]
  equipment: string[]
  sessionCount: number
  scheduleCount: number
}

interface FormState {
  name: string
  slug: string
  description: string
  shortDescription: string
  duration: string
  level: string
  intensity: string
  maxParticipants: string
  image: string
  color: string
  icon: string
  benefits: string
  equipment: string
}

const emptyForm: FormState = {
  name: "",
  slug: "",
  description: "",
  shortDescription: "",
  duration: "55",
  level: "ALL_LEVELS",
  intensity: "3",
  maxParticipants: "8",
  image: "",
  color: "",
  icon: "",
  benefits: "",
  equipment: "",
}

const levelLabels: Record<string, string> = {
  BEGINNER: "Débutant",
  INTERMEDIATE: "Intermédiaire",
  ADVANCED: "Avancé",
  ALL_LEVELS: "Tous niveaux",
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
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white">
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

export default function AdminCourseTypesPage() {
  const { data: authSession, status: authStatus } = useSession()
  const router = useRouter()
  const toast = useToast()
  const role = (authSession?.user as { role?: string } | undefined)?.role
  const isAdmin = role === "ADMIN" || role === "INSTRUCTOR"

  const [items, setItems] = useState<AdminCourseType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<AdminCourseType | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  useEffect(() => {
    if (authStatus === "unauthenticated") router.push("/connexion")
    else if (authStatus === "authenticated" && !isAdmin) router.push("/compte")
  }, [authStatus, isAdmin, router])

  const fetchList = useCallback(() => {
    setLoading(true)
    fetch("/api/admin/course-types")
      .then((r) => {
        if (r.status === 403) throw new Error("forbidden")
        return r.json()
      })
      .then((data) => setItems(data.courseTypes ?? []))
      .catch((err) => {
        if (err.message === "forbidden") setError("Accès réservé aux administrateurs.")
        else setError("Impossible de charger les types de cours.")
      })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (authStatus === "authenticated" && isAdmin) fetchList()
  }, [authStatus, isAdmin, fetchList])

  const openCreate = () => {
    setEditing(null)
    setForm(emptyForm)
    setFormError(null)
    setShowForm(true)
  }

  const openEdit = (c: AdminCourseType) => {
    setEditing(c)
    setForm({
      name: c.name,
      slug: c.slug,
      description: c.description ?? "",
      shortDescription: c.shortDescription ?? "",
      duration: String(c.duration),
      level: c.level,
      intensity: String(c.intensity),
      maxParticipants: String(c.maxParticipants),
      image: c.image ?? "",
      color: c.color ?? "",
      icon: c.icon ?? "",
      benefits: c.benefits.join(", "),
      equipment: c.equipment.join(", "),
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
        ...form,
        duration: parseInt(form.duration, 10),
        intensity: parseInt(form.intensity, 10),
        maxParticipants: parseInt(form.maxParticipants, 10),
      }
      const res = editing
        ? await fetch(`/api/admin/course-types/${editing.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
        : await fetch("/api/admin/course-types", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
      const data = await res.json()
      if (!res.ok) {
        setFormError(data.error || "Erreur lors de l'enregistrement.")
        return
      }
      toast.success(editing ? "Type de cours mis à jour." : "Type de cours créé.")
      closeForm()
      fetchList()
    } catch {
      setFormError("Erreur réseau.")
    } finally {
      setSaving(false)
    }
  }

  const remove = async (c: AdminCourseType) => {
    if (!confirm(`Supprimer le type de cours "${c.name}" ?`)) return
    const res = await fetch(`/api/admin/course-types/${c.id}`, { method: "DELETE" })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      toast.error(data.error || "Suppression impossible.")
      return
    }
    toast.success(`"${c.name}" supprimé.`)
    fetchList()
  }

  if (loading && !items.length) {
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
            <h1 className="font-heading text-xl font-bold text-mp-charcoal">
              Types de cours
            </h1>
          </div>
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 px-4 py-2 bg-mp-ocean text-white rounded-lg text-sm font-medium hover:bg-mp-ocean-dark transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nouveau type
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {items.length === 0 ? (
          <EmptyState
            icon={BadgeCheck}
            title="Aucun type de cours"
            description="Créez votre premier type de cours (Pilates doux, Matwork, Prénatal…). Il pourra ensuite être assigné à un planning ou une séance."
            action={{
              label: "Nouveau type",
              onClick: openCreate,
              icon: Plus,
            }}
          />
        ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Nom</th>
                <th className="px-4 py-3 text-left font-medium">Slug</th>
                <th className="px-4 py-3 text-left font-medium">Durée</th>
                <th className="px-4 py-3 text-left font-medium">Niveau</th>
                <th className="px-4 py-3 text-left font-medium">Capacité</th>
                <th className="px-4 py-3 text-left font-medium">Séances</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {c.color && (
                        <span
                          className="w-3 h-3 rounded-full flex-shrink-0"
                          style={{ background: c.color }}
                        />
                      )}
                      <span className="font-medium text-mp-charcoal">{c.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600 font-mono text-xs">{c.slug}</td>
                  <td className="px-4 py-3 text-gray-600">{c.duration} min</td>
                  <td className="px-4 py-3 text-gray-600">
                    {levelLabels[c.level] ?? c.level}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{c.maxParticipants}</td>
                  <td className="px-4 py-3 text-gray-600">{c.sessionCount}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEdit(c)}
                        className="p-1.5 text-gray-500 hover:text-mp-ocean hover:bg-mp-ocean/10 rounded-lg"
                        aria-label="Modifier"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => remove(c)}
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
        )}
      </main>

      <Modal
        open={showForm}
        onClose={closeForm}
        title={editing ? "Modifier le type de cours" : "Nouveau type de cours"}
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
              label="Slug"
              value={form.slug}
              onChange={(v) => setForm({ ...form, slug: v })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description courte
            </label>
            <input
              type="text"
              value={form.shortDescription}
              onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-mp-ocean focus:border-mp-ocean"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description longue
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-mp-ocean focus:border-mp-ocean resize-y"
            />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Field
              label="Durée (min)"
              type="number"
              value={form.duration}
              onChange={(v) => setForm({ ...form, duration: v })}
              required
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Niveau</label>
              <select
                value={form.level}
                onChange={(e) => setForm({ ...form, level: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-mp-ocean focus:border-mp-ocean bg-white"
              >
                <option value="ALL_LEVELS">Tous niveaux</option>
                <option value="BEGINNER">Débutant</option>
                <option value="INTERMEDIATE">Intermédiaire</option>
                <option value="ADVANCED">Avancé</option>
              </select>
            </div>
            <Field
              label="Intensité (1-5)"
              type="number"
              value={form.intensity}
              onChange={(v) => setForm({ ...form, intensity: v })}
            />
            <Field
              label="Capacité"
              type="number"
              value={form.maxParticipants}
              onChange={(v) => setForm({ ...form, maxParticipants: v })}
              required
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Field label="Image URL" value={form.image} onChange={(v) => setForm({ ...form, image: v })} />
            <Field label="Couleur" value={form.color} onChange={(v) => setForm({ ...form, color: v })} hint="#hex" />
            <Field label="Icône" value={form.icon} onChange={(v) => setForm({ ...form, icon: v })} />
          </div>
          <Field
            label="Bénéfices"
            value={form.benefits}
            onChange={(v) => setForm({ ...form, benefits: v })}
            hint="Séparés par des virgules"
          />
          <Field
            label="Équipement"
            value={form.equipment}
            onChange={(v) => setForm({ ...form, equipment: v })}
            hint="Séparé par des virgules"
          />

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
              disabled={saving || !form.name || !form.slug}
              className={clsx(
                "inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                saving || !form.name || !form.slug
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-mp-ocean text-white hover:bg-mp-ocean-dark"
              )}
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {editing ? "Enregistrer" : "Créer"}
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
