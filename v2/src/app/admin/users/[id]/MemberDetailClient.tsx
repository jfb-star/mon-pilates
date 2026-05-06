"use client"

import { useState } from "react"
import {
  Mail, Phone, MapPin, CalendarDays, CreditCard, Calendar, AlertCircle,
  Edit2, Plus, Minus, Ban, Loader2, Send, KeyRound, Link as LinkIcon, Copy, Check,
} from "lucide-react"
import { ConfirmDialog } from "@/components/admin/ConfirmDialog"

/* ---------- Types ---------- */

interface Card {
  id: string
  type: string
  totalSessions: number
  remainingSessions: number
  purchasedAt: string
  expiresAt: string
  bsportId: number | null
  payment: { id: string; amount: number; currency: string; status: string; externalProvider: string | null } | null
}
interface Booking {
  id: string
  status: string
  paymentMethod: string
  paymentStatus: string
  createdAt: string
  cancelledAt: string | null
  paidAt: string | null
  session: {
    date: string
    startTime: string
    endTime: string
    courseType: { name: string; slug: string }
    instructor: { user: { name: string } }
  }
}
interface Payment {
  id: string
  amount: number
  currency: string
  status: string
  type: string
  stripeCheckoutSessionId: string | null
  stripePaymentIntentId: string | null
  externalProvider: string | null
  createdAt: string
}
export interface MemberDetail {
  id: string
  name: string
  email: string
  phone: string | null
  birthday: string | null
  addressLine: string | null
  postalCode: string | null
  city: string | null
  country: string | null
  role: string
  createdAt: string
  bsportId: number | null
  bsportConsumerId: number | null
  migrationSource: string | null
  needsActivation: boolean
  courseCards: Card[]
  bookings: Booking[]
  payments: Payment[]
}

/* ---------- Helpers ---------- */

function fmtDate(d: string | null): string {
  if (!d) return "—"
  return new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" })
}
function fmtDateTime(d: string | null): string {
  if (!d) return "—"
  return new Date(d).toLocaleString("fr-FR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })
}
function fmtPrice(cents: number, currency: string = "eur"): string {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: currency.toUpperCase() }).format(cents / 100)
}
function isCardActive(c: Card): boolean {
  return c.remainingSessions > 0 && new Date(c.expiresAt) > new Date()
}

/* ---------- Component ---------- */

export function MemberDetailClient({ initialUser }: { initialUser: MemberDetail }) {
  const [user, setUser] = useState(initialUser)
  const [editingCard, setEditingCard] = useState<Card | null>(null)
  const [pendingCancelCard, setPendingCancelCard] = useState<Card | null>(null)
  const [editingProfile, setEditingProfile] = useState(false)
  const [composingEmail, setComposingEmail] = useState(false)
  const [confirmActivation, setConfirmActivation] = useState(false)
  const [paymentLinkOpen, setPaymentLinkOpen] = useState(false)
  const [toast, setToast] = useState<{ kind: "ok" | "err"; msg: string } | null>(null)

  const activeCards = user.courseCards.filter(isCardActive)
  const totalSpent = user.payments.filter((p) => p.status === "COMPLETED").reduce((s, p) => s + p.amount, 0)
  const upcomingBookings = user.bookings.filter((b) => b.status !== "CANCELLED" && new Date(b.session.date) >= new Date())
  const pastBookings = user.bookings.filter((b) => b.status === "CANCELLED" || new Date(b.session.date) < new Date())
  const unpaidCount = user.bookings.filter((b) => b.status !== "CANCELLED" && b.paymentStatus === "PENDING").length

  function flash(kind: "ok" | "err", msg: string) {
    setToast({ kind, msg })
    setTimeout(() => setToast(null), 4000)
  }

  return (
    <div className="space-y-6">
      {/* Header / identity */}
      <header className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="min-w-0">
            <h1 className="font-heading text-2xl font-bold text-mp-charcoal break-words">{user.name}</h1>
            <p className="text-sm text-gray-500 mt-1">
              Membre depuis {fmtDate(user.createdAt)}
              {user.bsportId && <span className="ml-2 text-xs bg-mp-ocean/10 text-mp-ocean-dark px-2 py-0.5 rounded">Bsport #{user.bsportId}</span>}
              {user.needsActivation && <span className="ml-2 text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded">Compte non activé</span>}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 self-start">
            <button
              onClick={() => setComposingEmail(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-heading bg-mp-ocean/10 text-mp-ocean-dark hover:bg-mp-ocean/15 transition-colors"
              title="Envoyer un email personnalisé"
            >
              <Send className="w-4 h-4" /> Email
            </button>
            {unpaidCount > 0 && (
              <button
                onClick={() => setPaymentLinkOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-heading bg-amber-100 text-amber-800 hover:bg-amber-200 transition-colors"
                title={`${unpaidCount} séance${unpaidCount > 1 ? "s" : ""} à régler`}
              >
                <LinkIcon className="w-4 h-4" /> Lien paiement
                <span className="ml-0.5 text-xs bg-amber-200/70 px-1.5 rounded">{unpaidCount}</span>
              </button>
            )}
            {user.needsActivation && (
              <button
                onClick={() => setConfirmActivation(true)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-heading bg-mp-sage/15 text-mp-sage-dark hover:bg-mp-sage/25 transition-colors"
                title="Renvoyer le mail d'activation"
              >
                <KeyRound className="w-4 h-4" /> Activation
              </button>
            )}
            <button
              onClick={() => setEditingProfile(true)}
              className="mp-btn mp-btn-secondary !text-sm !py-2 !px-3"
            >
              <Edit2 className="w-4 h-4" /> Modifier
            </button>
          </div>
        </div>

        {/* Identity grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 text-sm">
          <InfoRow icon={Mail} label="Email" value={user.email} />
          <InfoRow icon={Phone} label="Téléphone" value={user.phone || "—"} />
          <InfoRow icon={CalendarDays} label="Date de naissance" value={fmtDate(user.birthday)} />
          <InfoRow
            icon={MapPin}
            label="Adresse"
            value={[user.addressLine, [user.postalCode, user.city].filter(Boolean).join(" "), user.country].filter(Boolean).join(", ") || "—"}
          />
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-gray-100">
          <Stat label="Cartes actives" value={activeCards.length} />
          <Stat label="Réservations à venir" value={upcomingBookings.length} />
          <Stat label="Total dépensé" value={fmtPrice(totalSpent)} small />
        </div>
      </header>

      {/* CARDS */}
      <section className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading text-lg font-bold text-mp-charcoal flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-mp-ocean" />
            Cartes ({user.courseCards.length})
          </h2>
        </div>
        {user.courseCards.length === 0 ? (
          <p className="text-sm text-gray-500 italic">Aucune carte enregistrée.</p>
        ) : (
          <div className="space-y-3">
            {user.courseCards.map((c) => (
              <CardRow
                key={c.id}
                card={c}
                onEdit={() => setEditingCard(c)}
                onCancel={() => setPendingCancelCard(c)}
              />
            ))}
          </div>
        )}
      </section>

      {/* BOOKINGS */}
      <section className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <h2 className="font-heading text-lg font-bold text-mp-charcoal flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-mp-ocean" />
          Réservations ({user.bookings.length})
        </h2>
        {upcomingBookings.length > 0 && (
          <>
            <p className="text-xs font-heading uppercase tracking-wider text-mp-text-muted mb-2">À venir</p>
            <div className="space-y-2 mb-4">
              {upcomingBookings.map((b) => <BookingRow key={b.id} booking={b} upcoming />)}
            </div>
          </>
        )}
        {pastBookings.length > 0 && (
          <>
            <p className="text-xs font-heading uppercase tracking-wider text-mp-text-muted mb-2">Historique</p>
            <div className="space-y-2">
              {pastBookings.slice(0, 10).map((b) => <BookingRow key={b.id} booking={b} />)}
            </div>
          </>
        )}
        {user.bookings.length === 0 && <p className="text-sm text-gray-500 italic">Aucune réservation.</p>}
      </section>

      {/* PAYMENTS */}
      <section className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <h2 className="font-heading text-lg font-bold text-mp-charcoal flex items-center gap-2 mb-4">
          <AlertCircle className="w-5 h-5 text-mp-ocean" />
          Paiements ({user.payments.length})
        </h2>
        {user.payments.length === 0 ? (
          <p className="text-sm text-gray-500 italic">Aucun paiement.</p>
        ) : (
          <div className="space-y-2">
            {user.payments.map((p) => (
              <div key={p.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50/50 text-sm">
                <div>
                  <p className="font-medium">{fmtPrice(p.amount, p.currency)} <span className="text-xs text-gray-400">· {p.type}</span></p>
                  <p className="text-xs text-gray-500">{fmtDateTime(p.createdAt)} · {p.externalProvider ?? "Stripe"}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded ${p.status === "COMPLETED" ? "bg-mp-sage/15 text-mp-sage-dark" : "bg-amber-100 text-amber-700"}`}>{p.status}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* MODALS */}
      {editingCard && (
        <CardEditModal
          card={editingCard}
          userId={user.id}
          onSaved={(updated) => {
            setUser({ ...user, courseCards: user.courseCards.map((c) => c.id === updated.id ? { ...c, ...updated } : c) })
            setEditingCard(null)
          }}
          onClose={() => setEditingCard(null)}
        />
      )}
      <ConfirmDialog
        open={!!pendingCancelCard}
        title="Annuler cette carte ?"
        description={pendingCancelCard ? (
          <>
            <p className="mb-2">
              Carte <strong>{pendingCancelCard.type} séances</strong> achetée le {fmtDate(pendingCancelCard.purchasedAt)}.
            </p>
            <p className="text-sm">
              Les <strong>{pendingCancelCard.remainingSessions} séance{pendingCancelCard.remainingSessions > 1 ? "s" : ""} restante{pendingCancelCard.remainingSessions > 1 ? "s" : ""}</strong> seront perdues. La carte sera marquée expirée immédiatement.
            </p>
          </>
        ) : ""}
        confirmLabel="Annuler la carte"
        cancelLabel="Garder"
        variant="danger"
        onConfirm={async () => {
          if (!pendingCancelCard) return
          const res = await fetch(`/api/admin/users/${user.id}/cards/${pendingCancelCard.id}`, { method: "DELETE" })
          if (res.ok) {
            const { card } = await res.json()
            setUser({ ...user, courseCards: user.courseCards.map((c) => c.id === card.id ? { ...c, ...card } : c) })
          }
          setPendingCancelCard(null)
        }}
        onCancel={() => setPendingCancelCard(null)}
      />
      {editingProfile && (
        <ProfileEditModal
          user={user}
          onSaved={(updated) => { setUser({ ...user, ...updated }); setEditingProfile(false) }}
          onClose={() => setEditingProfile(false)}
        />
      )}

      {/* QUICK ACTIONS */}
      {composingEmail && (
        <SendEmailModal
          userId={user.id}
          userName={user.name}
          userEmail={user.email}
          onSent={() => { flash("ok", "Email envoyé"); setComposingEmail(false) }}
          onClose={() => setComposingEmail(false)}
        />
      )}
      {paymentLinkOpen && (
        <PaymentLinkModal
          userId={user.id}
          unpaidCount={unpaidCount}
          onDone={() => setPaymentLinkOpen(false)}
          onFlash={flash}
        />
      )}
      <ConfirmDialog
        open={confirmActivation}
        title="Renvoyer le mail d'activation ?"
        description={
          <p>
            Un nouveau lien d&apos;activation (valable 1&nbsp;h) sera envoyé à <strong>{user.email}</strong>.
            Le lien précédent sera invalidé.
          </p>
        }
        confirmLabel="Envoyer"
        cancelLabel="Annuler"
        onConfirm={async () => {
          setConfirmActivation(false)
          const res = await fetch(`/api/admin/users/${user.id}/resend-activation`, { method: "POST" })
          if (res.ok) flash("ok", "Email d'activation envoyé")
          else {
            const data = await res.json().catch(() => ({}))
            flash("err", data.error || "Échec de l'envoi")
          }
        }}
        onCancel={() => setConfirmActivation(false)}
      />

      {/* TOAST */}
      {toast && (
        <div className={`fixed bottom-4 right-4 z-[70] px-4 py-3 rounded-xl shadow-lg text-sm font-heading flex items-center gap-2 ${
          toast.kind === "ok" ? "bg-mp-sage/95 text-white" : "bg-red-600 text-white"
        }`}>
          {toast.kind === "ok" ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {toast.msg}
        </div>
      )}
    </div>
  )
}

/* ---------- Sub-components ---------- */

function InfoRow({ icon: Icon, label, value }: { icon: typeof Mail; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="w-4 h-4 text-mp-text-light/60 mt-0.5 shrink-0" />
      <div className="min-w-0">
        <p className="text-xs font-heading uppercase tracking-wide text-mp-text-muted">{label}</p>
        <p className="text-sm text-mp-charcoal break-words">{value}</p>
      </div>
    </div>
  )
}

function Stat({ label, value, small }: { label: string; value: string | number; small?: boolean }) {
  return (
    <div>
      <p className={`font-heading font-bold text-mp-charcoal ${small ? "text-lg" : "text-2xl"}`}>{value}</p>
      <p className="text-xs text-mp-text-muted">{label}</p>
    </div>
  )
}

function CardRow({ card, onEdit, onCancel }: { card: Card; onEdit: () => void; onCancel: () => void }) {
  const active = isCardActive(card)
  const expiresIn = Math.ceil((new Date(card.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  return (
    <div className={`p-4 rounded-xl border ${active ? "border-mp-sage/30 bg-mp-sage/5" : "border-gray-200 bg-gray-50/40"}`}>
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="min-w-0">
          <p className="font-heading font-semibold text-mp-charcoal">
            Carte {card.type} séances
            {!active && <span className="ml-2 text-xs text-gray-400">(expirée)</span>}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            <strong className={active ? "text-mp-sage-dark" : "text-gray-500"}>{card.remainingSessions}</strong>
            <span className="text-gray-400"> / {card.totalSessions}</span> restantes
            {active && <span className="text-xs text-gray-500 ml-2">(expire dans {expiresIn}j)</span>}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Achetée le {fmtDate(card.purchasedAt)} · expire le {fmtDate(card.expiresAt)}
            {card.payment && <span className="ml-2">· {fmtPrice(card.payment.amount, card.payment.currency)} {card.payment.externalProvider ? `(${card.payment.externalProvider})` : ""}</span>}
          </p>
        </div>
        {active && (
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={onEdit}
              className="p-1.5 rounded-lg hover:bg-white transition-colors text-gray-500 hover:text-mp-ocean"
              title="Modifier"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={onCancel}
              className="p-1.5 rounded-lg hover:bg-red-50 transition-colors text-gray-500 hover:text-red-600"
              title="Annuler la carte"
            >
              <Ban className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function BookingRow({ booking, upcoming }: { booking: Booking; upcoming?: boolean }) {
  const cancelled = booking.status === "CANCELLED"
  return (
    <div className={`flex items-center justify-between p-3 rounded-lg text-sm ${upcoming ? "bg-mp-ocean/5" : "bg-gray-50/50"} ${cancelled ? "opacity-60" : ""}`}>
      <div>
        <p className="font-medium">
          {booking.session.courseType.name}
          {cancelled && <span className="ml-2 text-xs text-red-600">(annulée)</span>}
        </p>
        <p className="text-xs text-gray-500">
          {fmtDate(booking.session.date)} · {booking.session.startTime} - {booking.session.endTime}
          {booking.session.instructor.user.name && ` · ${booking.session.instructor.user.name}`}
        </p>
      </div>
      <span className={`text-xs px-2 py-0.5 rounded shrink-0 ${
        booking.paymentStatus === "PAID" ? "bg-mp-sage/15 text-mp-sage-dark" : "bg-amber-100 text-amber-700"
      }`}>
        {booking.paymentStatus === "PAID" ? "Payé" : "À régler"}
      </span>
    </div>
  )
}

/* ---------- Card edit modal ---------- */

function CardEditModal({ card, userId, onSaved, onClose }: {
  card: Card
  userId: string
  onSaved: (c: Card) => void
  onClose: () => void
}) {
  const [remaining, setRemaining] = useState(card.remainingSessions)
  const [expiresAt, setExpiresAt] = useState(card.expiresAt.slice(0, 10))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  async function handleSave() {
    setSaving(true)
    setError("")
    const res = await fetch(`/api/admin/users/${userId}/cards/${card.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ remainingSessions: remaining, expiresAt }),
    })
    setSaving(false)
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      setError(data.error || "Erreur lors de la mise à jour")
      return
    }
    const { card: updated } = await res.json()
    onSaved(updated)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
        <h3 className="font-heading text-lg font-bold text-mp-charcoal mb-4">Modifier la carte</h3>
        <div className="space-y-4">
          <div>
            <label className="block font-heading text-xs font-medium text-mp-text-light mb-1.5">
              Crédits restants <span className="text-mp-text-muted/70 font-normal">(max {card.totalSessions})</span>
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setRemaining(Math.max(0, remaining - 1))}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50"
              >
                <Minus className="w-4 h-4" />
              </button>
              <input
                type="number"
                min={0}
                max={card.totalSessions}
                value={remaining}
                onChange={(e) => setRemaining(Math.max(0, Math.min(card.totalSessions, parseInt(e.target.value) || 0)))}
                className="w-20 text-center px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-mp-ocean"
              />
              <button
                type="button"
                onClick={() => setRemaining(Math.min(card.totalSessions, remaining + 1))}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50"
              >
                <Plus className="w-4 h-4" />
              </button>
              <span className="text-sm text-gray-500 ml-2">/ {card.totalSessions}</span>
            </div>
          </div>
          <div>
            <label className="block font-heading text-xs font-medium text-mp-text-light mb-1.5">
              Date d&apos;expiration
            </label>
            <input
              type="date"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
              min={new Date().toISOString().slice(0, 10)}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-mp-ocean"
            />
          </div>
          {error && <p className="text-xs text-red-600">{error}</p>}
        </div>
        <div className="flex gap-2 justify-end mt-6">
          <button onClick={onClose} className="mp-btn mp-btn-secondary !text-sm">Annuler</button>
          <button onClick={handleSave} disabled={saving} className="mp-btn mp-btn-primary !text-sm">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Enregistrer"}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ---------- Profile edit modal ---------- */

function ProfileEditModal({ user, onSaved, onClose }: {
  user: MemberDetail
  onSaved: (u: Partial<MemberDetail>) => void
  onClose: () => void
}) {
  const [name, setName] = useState(user.name)
  const [phone, setPhone] = useState(user.phone ?? "")
  const [birthday, setBirthday] = useState(user.birthday ? user.birthday.slice(0, 10) : "")
  const [addressLine, setAddressLine] = useState(user.addressLine ?? "")
  const [postalCode, setPostalCode] = useState(user.postalCode ?? "")
  const [city, setCity] = useState(user.city ?? "")
  const [country, setCountry] = useState(user.country ?? "France")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  async function handleSave() {
    setSaving(true)
    setError("")
    const res = await fetch(`/api/admin/users/${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name.trim(),
        phone: phone.trim() || null,
        birthday: birthday || null,
        addressLine: addressLine.trim() || null,
        postalCode: postalCode.trim() || null,
        city: city.trim() || null,
        country: country.trim() || null,
      }),
    })
    setSaving(false)
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      setError(data.error || "Erreur lors de la mise à jour")
      return
    }
    const { user: updated } = await res.json()
    onSaved(updated)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 my-8" onClick={(e) => e.stopPropagation()}>
        <h3 className="font-heading text-lg font-bold text-mp-charcoal mb-4">Modifier le profil</h3>
        <div className="space-y-3">
          <Field label="Nom complet" value={name} onChange={setName} />
          <Field label="Téléphone" value={phone} onChange={setPhone} type="tel" />
          <Field label="Date de naissance" value={birthday} onChange={setBirthday} type="date" />
          <Field label="Adresse" value={addressLine} onChange={setAddressLine} />
          <div className="grid grid-cols-3 gap-3">
            <Field label="Code postal" value={postalCode} onChange={setPostalCode} />
            <div className="col-span-2"><Field label="Ville" value={city} onChange={setCity} /></div>
          </div>
          <Field label="Pays" value={country} onChange={setCountry} />
          {error && <p className="text-xs text-red-600">{error}</p>}
        </div>
        <div className="flex gap-2 justify-end mt-6">
          <button onClick={onClose} className="mp-btn mp-btn-secondary !text-sm">Annuler</button>
          <button onClick={handleSave} disabled={saving} className="mp-btn mp-btn-primary !text-sm">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Enregistrer"}
          </button>
        </div>
      </div>
    </div>
  )
}

function Field({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div>
      <label className="block font-heading text-xs font-medium text-mp-text-light mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-mp-ocean text-sm"
      />
    </div>
  )
}

/* ---------- Send manual email modal ---------- */

function SendEmailModal({ userId, userName, userEmail, onSent, onClose }: {
  userId: string
  userName: string
  userEmail: string
  onSent: () => void
  onClose: () => void
}) {
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [sending, setSending] = useState(false)
  const [error, setError] = useState("")

  async function handleSend() {
    if (!subject.trim() || !message.trim()) {
      setError("Sujet et message obligatoires")
      return
    }
    setSending(true)
    setError("")
    const res = await fetch(`/api/admin/users/${userId}/send-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject: subject.trim(), message: message.trim() }),
    })
    setSending(false)
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      setError(data.error || "Échec de l'envoi")
      return
    }
    onSent()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 my-8" onClick={(e) => e.stopPropagation()}>
        <h3 className="font-heading text-lg font-bold text-mp-charcoal mb-1">Email à {userName}</h3>
        <p className="text-xs text-gray-500 mb-4">{userEmail}</p>
        <div className="space-y-3">
          <Field label="Sujet" value={subject} onChange={setSubject} />
          <div>
            <label className="block font-heading text-xs font-medium text-mp-text-light mb-1.5">Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={8}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-mp-ocean text-sm resize-y"
              placeholder="Bonjour…"
            />
            <p className="text-[11px] text-gray-400 mt-1">Les sauts de ligne doubles créent un nouveau paragraphe.</p>
          </div>
          {error && <p className="text-xs text-red-600">{error}</p>}
        </div>
        <div className="flex gap-2 justify-end mt-6">
          <button onClick={onClose} className="mp-btn mp-btn-secondary !text-sm">Annuler</button>
          <button onClick={handleSend} disabled={sending} className="mp-btn mp-btn-primary !text-sm">
            {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Send className="w-4 h-4" /> Envoyer</>}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ---------- Payment-link modal ---------- */

function PaymentLinkModal({ userId, unpaidCount, onDone, onFlash }: {
  userId: string
  unpaidCount: number
  onDone: () => void
  onFlash: (kind: "ok" | "err", msg: string) => void
}) {
  const [loading, setLoading] = useState(false)
  const [url, setUrl] = useState<string | null>(null)
  const [amount, setAmount] = useState<number | null>(null)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState("")

  async function generate(sendEmail: boolean) {
    setLoading(true)
    setError("")
    const res = await fetch(`/api/admin/users/${userId}/payment-link`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sendEmail }),
    })
    setLoading(false)
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      setError(data.error || "Échec de la génération")
      return
    }
    const data = await res.json()
    setUrl(data.url)
    setAmount(data.amount)
    if (sendEmail) {
      onFlash(data.emailed ? "ok" : "err", data.emailed ? "Lien envoyé par email" : "Lien généré, mais email non envoyé")
    }
  }

  async function copy() {
    if (!url) return
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto" onClick={onDone}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 my-8" onClick={(e) => e.stopPropagation()}>
        <h3 className="font-heading text-lg font-bold text-mp-charcoal mb-1">Lien de paiement</h3>
        <p className="text-xs text-gray-500 mb-4">
          {unpaidCount} séance{unpaidCount > 1 ? "s" : ""} en attente de règlement.
        </p>

        {!url && (
          <div className="space-y-2">
            <button
              onClick={() => generate(true)}
              disabled={loading}
              className="w-full mp-btn mp-btn-primary !text-sm"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Send className="w-4 h-4" /> Générer & envoyer par email</>}
            </button>
            <button
              onClick={() => generate(false)}
              disabled={loading}
              className="w-full mp-btn mp-btn-secondary !text-sm"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><LinkIcon className="w-4 h-4" /> Générer un lien à copier</>}
            </button>
            {error && <p className="text-xs text-red-600 mt-2">{error}</p>}
          </div>
        )}

        {url && (
          <div className="space-y-3">
            {amount !== null && (
              <p className="text-sm text-mp-charcoal">
                Montant&nbsp;: <strong>{(amount / 100).toFixed(2).replace(".", ",")}&nbsp;€</strong>
              </p>
            )}
            <div className="p-2 rounded-lg border border-gray-200 bg-gray-50/50 break-all text-xs text-gray-700 font-mono">
              {url}
            </div>
            <button
              onClick={copy}
              className="w-full mp-btn mp-btn-primary !text-sm"
            >
              {copied ? <><Check className="w-4 h-4" /> Copié</> : <><Copy className="w-4 h-4" /> Copier le lien</>}
            </button>
          </div>
        )}

        <div className="flex justify-end mt-4">
          <button onClick={onDone} className="text-sm text-gray-500 hover:text-mp-charcoal">Fermer</button>
        </div>
      </div>
    </div>
  )
}
