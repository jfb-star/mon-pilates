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
  Calendar,
} from "lucide-react"
import { clsx } from "clsx"
import { useToast } from "@/components/ui/Toast"
import { EmptyState } from "@/components/admin/EmptyState"

interface AdminSchedule {
  id: string
  courseTypeId: string
  instructorId: string
  dayOfWeek: number
  startTime: string
  endTime: string
  isRecurring: boolean
  startDate: string
  endDate: string | null
  maxParticipants: number | null
  courseType: { id: string; name: string; slug: string; color: string | null }
  instructor: { id: string; slug: string; name: string }
}

interface InstructorOpt {
  id: string
  name: string
}

interface CourseTypeOpt {
  id: string
  name: string
}

interface FormState {
  courseTypeId: string
  instructorId: string
  dayOfWeek: string
  startTime: string
  endTime: string
  startDate: string
  endDate: string
  maxParticipants: string
  isRecurring: boolean
}

const emptyForm: FormState = {
  courseTypeId: "",
  instructorId: "",
  dayOfWeek: "1",
  startTime: "09:00",
  endTime: "10:00",
  startDate: "",
  endDate: "",
  maxParticipants: "",
  isRecurring: true,
}

const dayLabels = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"]

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
        <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white">
          <h3 className="font-heading text-lg font-semibold text-mp-charcoal">{title}</h3>
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

export default function AdminSchedulesPage() {
  const { data: authSession, status: authStatus } = useSession()
  const router = useRouter()
  const toast = useToast()
  const role = (authSession?.user as { role?: string } | undefined)?.role
  const isAdmin = role === "ADMIN" || role === "INSTRUCTOR"

  const [schedules, setSchedules] = useState<AdminSchedule[]>([])
  const [instructors, setInstructors] = useState<InstructorOpt[]>([])
  const [courseTypes, setCourseTypes] = useState<CourseTypeOpt[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [instructorFilter, setInstructorFilter] = useState<string>("")

  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<AdminSchedule | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  useEffect(() => {
    if (authStatus === "unauthenticated") router.push("/connexion")
    else if (authStatus === "authenticated" && !isAdmin) router.push("/compte")
  }, [authStatus, isAdmin, router])

  const fetchSchedules = useCallback(() => {
    setLoading(true)
    const params = new URLSearchParams()
    if (instructorFilter) params.set("instructorId", instructorFilter)
    fetch(`/api/admin/schedules?${params}`)
      .then((r) => {
        if (r.status === 403) throw new Error("forbidden")
        return r.json()
      })
      .then((data) => setSchedules(data.schedules ?? []))
      .catch((err) => {
        if (err.message === "forbidden") setError("Accès réservé aux administrateurs.")
        else setError("Impossible de charger les plannings.")
      })
      .finally(() => setLoading(false))
  }, [instructorFilter])

  const fetchMetadata = useCallback(async () => {
    try {
      const [iRes, cRes] = await Promise.all([
        fetch("/api/admin/instructors"),
        fetch("/api/admin/course-types"),
      ])
      const iData = await iRes.json()
      const cData = await cRes.json()
      setInstructors(
        (iData.instructors ?? []).map((i: { id: string; name: string }) => ({
          id: i.id,
          name: i.name,
        }))
      )
      setCourseTypes(
        (cData.courseTypes ?? []).map((c: { id: string; name: string }) => ({
          id: c.id,
          name: c.name,
        }))
      )
    } catch {
      // ignore
    }
  }, [])

  useEffect(() => {
    if (authStatus === "authenticated" && isAdmin) {
      fetchMetadata()
      fetchSchedules()
    }
  }, [authStatus, isAdmin, fetchMetadata, fetchSchedules])

  const openCreate = () => {
    setEditing(null)
    setForm({
      ...emptyForm,
      startDate: new Date().toISOString().split("T")[0] ?? "",
    })
    setFormError(null)
    setShowForm(true)
  }

  const openEdit = (s: AdminSchedule) => {
    setEditing(s)
    setForm({
      courseTypeId: s.courseTypeId,
      instructorId: s.instructorId,
      dayOfWeek: String(s.dayOfWeek),
      startTime: s.startTime,
      endTime: s.endTime,
      startDate: new Date(s.startDate).toISOString().split("T")[0] ?? "",
      endDate: s.endDate ? new Date(s.endDate).toISOString().split("T")[0] ?? "" : "",
      maxParticipants: s.maxParticipants !== null ? String(s.maxParticipants) : "",
      isRecurring: s.isRecurring,
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
        courseTypeId: form.courseTypeId,
        instructorId: form.instructorId,
        dayOfWeek: parseInt(form.dayOfWeek, 10),
        startTime: form.startTime,
        endTime: form.endTime,
        startDate: form.startDate,
        endDate: form.endDate || null,
        maxParticipants: form.maxParticipants || null,
        isRecurring: form.isRecurring,
      }
      const res = editing
        ? await fetch(`/api/admin/schedules/${editing.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
        : await fetch("/api/admin/schedules", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
      const data = await res.json()
      if (!res.ok) {
        setFormError(data.error || "Erreur lors de l'enregistrement.")
        return
      }
      toast.success(editing ? "Planning mis à jour." : "Planning créé.")
      closeForm()
      fetchSchedules()
    } catch {
      setFormError("Erreur réseau.")
    } finally {
      setSaving(false)
    }
  }

  const remove = async (s: AdminSchedule) => {
    if (!confirm(`Supprimer ce planning ?`)) return
    const res = await fetch(`/api/admin/schedules/${s.id}`, { method: "DELETE" })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      toast.error(data.error || "Suppression impossible.")
      return
    }
    toast.success("Planning supprimé.")
    fetchSchedules()
  }

  if (loading && !schedules.length) {
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
            <h1 className="font-heading text-xl font-bold text-mp-charcoal">Plannings</h1>
          </div>
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 px-4 py-2 bg-mp-ocean text-white rounded-lg text-sm font-medium hover:bg-mp-ocean-dark transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nouveau planning
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <label className="text-sm text-gray-600">Filtrer par coach :</label>
          <select
            value={instructorFilter}
            onChange={(e) => setInstructorFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-mp-ocean focus:border-mp-ocean"
          >
            <option value="">Tous les coachs</option>
            {instructors.map((i) => (
              <option key={i.id} value={i.id}>
                {i.name}
              </option>
            ))}
          </select>
        </div>

        {schedules.length === 0 ? (
          <EmptyState
            icon={Calendar}
            title={
              instructorFilter
                ? "Aucun planning pour ce coach"
                : "Aucun planning"
            }
            description={
              instructorFilter
                ? "Ce coach n'a pas encore de créneau. Créez-en un ou changez de filtre."
                : "Créez votre premier créneau récurrent. Les séances seront ensuite générées automatiquement chaque semaine."
            }
            action={{
              label: "Nouveau planning",
              onClick: openCreate,
              icon: Plus,
            }}
          />
        ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Jour</th>
                <th className="px-4 py-3 text-left font-medium">Horaire</th>
                <th className="px-4 py-3 text-left font-medium">Cours</th>
                <th className="px-4 py-3 text-left font-medium">Coach</th>
                <th className="px-4 py-3 text-left font-medium">Récurrence</th>
                <th className="px-4 py-3 text-left font-medium">Capacité</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {schedules.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-2 text-mp-charcoal">
                      <Calendar className="w-4 h-4 text-mp-ocean" />
                      {dayLabels[s.dayOfWeek]}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-gray-700">
                    {s.startTime} – {s.endTime}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {s.courseType.color && (
                        <span
                          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                          style={{ background: s.courseType.color }}
                        />
                      )}
                      <span className="text-mp-charcoal">{s.courseType.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-700">{s.instructor.name}</td>
                  <td className="px-4 py-3">
                    <span
                      className={clsx(
                        "inline-flex px-2 py-0.5 rounded-full text-xs font-medium",
                        s.isRecurring
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                      )}
                    >
                      {s.isRecurring ? "Récurrent" : "Ponctuel"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {s.maxParticipants !== null ? s.maxParticipants : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEdit(s)}
                        className="p-1.5 text-gray-500 hover:text-mp-ocean hover:bg-mp-ocean/10 rounded-lg"
                        aria-label="Modifier"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => remove(s)}
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
        title={editing ? "Modifier le planning" : "Nouveau planning"}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type de cours <span className="text-red-500">*</span>
            </label>
            <select
              value={form.courseTypeId}
              onChange={(e) => setForm({ ...form, courseTypeId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-mp-ocean focus:border-mp-ocean"
            >
              <option value="">— Sélectionner —</option>
              {courseTypes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Coach <span className="text-red-500">*</span>
            </label>
            <select
              value={form.instructorId}
              onChange={(e) => setForm({ ...form, instructorId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-mp-ocean focus:border-mp-ocean"
            >
              <option value="">— Sélectionner —</option>
              {instructors.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.name}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Jour</label>
              <select
                value={form.dayOfWeek}
                onChange={(e) => setForm({ ...form, dayOfWeek: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-mp-ocean focus:border-mp-ocean"
              >
                {dayLabels.map((d, idx) => (
                  <option key={idx} value={idx}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Début</label>
              <input
                type="time"
                value={form.startTime}
                onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-mp-ocean focus:border-mp-ocean"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fin</label>
              <input
                type="time"
                value={form.endTime}
                onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-mp-ocean focus:border-mp-ocean"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date début <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-mp-ocean focus:border-mp-ocean"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date fin</label>
              <input
                type="date"
                value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-mp-ocean focus:border-mp-ocean"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Capacité (optionnel)
              </label>
              <input
                type="number"
                value={form.maxParticipants}
                onChange={(e) => setForm({ ...form, maxParticipants: e.target.value })}
                placeholder="hérite du type de cours"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-mp-ocean focus:border-mp-ocean"
              />
            </div>
            <label className="flex items-center gap-2 text-sm pb-2">
              <input
                type="checkbox"
                checked={form.isRecurring}
                onChange={(e) => setForm({ ...form, isRecurring: e.target.checked })}
                className="rounded border-gray-300 text-mp-ocean focus:ring-mp-ocean"
              />
              <span className="text-gray-700">Créneau récurrent</span>
            </label>
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
                !form.courseTypeId ||
                !form.instructorId ||
                !form.startDate
              }
              className={clsx(
                "inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                saving || !form.courseTypeId || !form.instructorId || !form.startDate
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
