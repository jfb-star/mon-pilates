"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  CreditCard,
  User,
  Clock,
  Gift,
  LogOut,
  ChevronRight,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { clsx } from "clsx";

/* ============================================================
   MOCK DATA — will be replaced with real API calls
   ============================================================ */

const mockUser = {
  name: "Camille Dupont",
  email: "camille.dupont@email.com",
  phone: "06 12 34 56 78",
  memberSince: "Janvier 2026",
};

const mockBookings = [
  {
    id: "b1",
    courseName: "Pilates Mat",
    instructor: "Marie Lefèvre",
    date: "Lundi 14 avril",
    time: "09:00",
    duration: "55 min",
    status: "confirmed" as const,
  },
  {
    id: "b2",
    courseName: "Pilates Reformer",
    instructor: "Sophie Martin",
    date: "Mercredi 16 avril",
    time: "10:15",
    duration: "50 min",
    status: "confirmed" as const,
  },
  {
    id: "b3",
    courseName: "Pilates Mat",
    instructor: "Sophie Martin",
    date: "Vendredi 18 avril",
    time: "18:00",
    duration: "55 min",
    status: "waitlist" as const,
  },
];

const pastBookings = [
  {
    id: "p1",
    courseName: "Pilates Mat",
    instructor: "Marie Lefèvre",
    date: "Lundi 7 avril",
    time: "09:00",
    status: "attended" as const,
  },
  {
    id: "p2",
    courseName: "Pilates Doux",
    instructor: "Marie Lefèvre",
    date: "Vendredi 4 avril",
    time: "10:15",
    status: "attended" as const,
  },
  {
    id: "p3",
    courseName: "Pilates Reformer",
    instructor: "Sophie Martin",
    date: "Mercredi 2 avril",
    time: "10:15",
    status: "cancelled" as const,
  },
];

const mockCard = {
  type: "Carte 10 cours",
  remaining: 7,
  total: 10,
  expiresAt: "15 septembre 2026",
  purchasedAt: "15 mars 2026",
};

type Tab = "reservations" | "historique" | "carte" | "profil";

const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "reservations", label: "Réservations", icon: Calendar },
  { id: "historique", label: "Historique", icon: Clock },
  { id: "carte", label: "Ma carte", icon: CreditCard },
  { id: "profil", label: "Profil", icon: User },
];

/* ============================================================
   STATUS HELPERS
   ============================================================ */

function StatusBadge({ status }: { status: string }) {
  const config = {
    confirmed: {
      label: "Confirmé",
      className: "bg-mp-sage/15 text-mp-sage",
      icon: CheckCircle,
    },
    waitlist: {
      label: "Liste d'attente",
      className: "bg-mp-gold/15 text-mp-gold",
      icon: AlertCircle,
    },
    attended: {
      label: "Effectué",
      className: "bg-mp-ocean/15 text-mp-ocean",
      icon: CheckCircle,
    },
    cancelled: {
      label: "Annulé",
      className: "bg-mp-rose/15 text-mp-rose",
      icon: XCircle,
    },
  }[status] ?? {
    label: status,
    className: "bg-gray-100 text-gray-600",
    icon: AlertCircle,
  };

  const Icon = config.icon;
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-heading font-medium",
        config.className
      )}
    >
      <Icon className="w-3.5 h-3.5" />
      {config.label}
    </span>
  );
}

/* ============================================================
   TAB CONTENT
   ============================================================ */

function ReservationsTab() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading text-xl font-bold text-mp-charcoal">
          Prochaines réservations
        </h2>
        <Link
          href="/planning"
          className="mp-btn mp-btn-primary text-sm !py-2 !px-4"
        >
          <Calendar className="w-4 h-4" />
          Réserver
        </Link>
      </div>

      {mockBookings.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="w-12 h-12 text-mp-text-light/30 mx-auto mb-3" />
          <p className="font-body text-mp-text-light">
            Aucune réservation à venir
          </p>
          <Link href="/planning" className="mp-btn mp-btn-primary mt-4 text-sm">
            Réserver un cours
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {mockBookings.map((booking) => (
            <div
              key={booking.id}
              className="mp-card !rounded-xl p-5 flex items-center justify-between gap-4 hover:!transform-none"
            >
              <div className="flex-1 min-w-0">
                <h3 className="font-heading font-semibold text-mp-charcoal">
                  {booking.courseName}
                </h3>
                <p className="text-sm text-mp-text-light mt-0.5">
                  {booking.date} · {booking.time} · {booking.duration}
                </p>
                <p className="text-sm text-mp-text-light">
                  avec {booking.instructor}
                </p>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <StatusBadge status={booking.status} />
                <button
                  className="text-sm text-mp-rose hover:text-mp-rose/80 font-heading font-medium transition-colors"
                  aria-label={`Annuler ${booking.courseName}`}
                >
                  Annuler
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function HistoriqueTab() {
  return (
    <div>
      <h2 className="font-heading text-xl font-bold text-mp-charcoal mb-6">
        Historique des cours
      </h2>
      <div className="space-y-3">
        {pastBookings.map((booking) => (
          <div
            key={booking.id}
            className="mp-card !rounded-xl p-5 flex items-center justify-between gap-4 hover:!transform-none"
          >
            <div className="flex-1 min-w-0">
              <h3 className="font-heading font-semibold text-mp-charcoal">
                {booking.courseName}
              </h3>
              <p className="text-sm text-mp-text-light mt-0.5">
                {booking.date} · {booking.time}
              </p>
              <p className="text-sm text-mp-text-light">
                avec {booking.instructor}
              </p>
            </div>
            <StatusBadge status={booking.status} />
          </div>
        ))}
      </div>
      <p className="text-center text-sm text-mp-text-light mt-6">
        12 cours effectués depuis {mockUser.memberSince}
      </p>
    </div>
  );
}

function CarteTab() {
  const percentage = (mockCard.remaining / mockCard.total) * 100;
  return (
    <div>
      <h2 className="font-heading text-xl font-bold text-mp-charcoal mb-6">
        Ma carte de cours
      </h2>

      <div className="mp-card !rounded-2xl p-8 bg-gradient-to-br from-mp-ocean to-mp-ocean-dark text-white hover:!transform-none">
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="font-heading text-sm font-medium text-white/70">
              {mockCard.type}
            </p>
            <p className="font-heading text-4xl font-bold mt-1">
              {mockCard.remaining}{" "}
              <span className="text-lg font-normal text-white/60">
                / {mockCard.total} cours
              </span>
            </p>
          </div>
          <CreditCard className="w-8 h-8 text-white/30" />
        </div>

        {/* Progress bar */}
        <div className="bg-white/20 rounded-full h-3 mb-4">
          <div
            className="bg-white rounded-full h-3 transition-all"
            style={{ width: `${percentage}%` }}
          />
        </div>

        <div className="flex justify-between text-sm text-white/60">
          <span>Achetée le {mockCard.purchasedAt}</span>
          <span>Expire le {mockCard.expiresAt}</span>
        </div>
      </div>

      <div className="mt-6 text-center">
        <Link href="/tarifs" className="mp-btn mp-btn-secondary text-sm">
          Renouveler ma carte
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

function ProfilTab() {
  return (
    <div>
      <h2 className="font-heading text-xl font-bold text-mp-charcoal mb-6">
        Mon profil
      </h2>

      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-heading text-sm font-medium text-mp-text-light mb-1.5">
              Nom complet
            </label>
            <input
              type="text"
              defaultValue={mockUser.name}
              className="w-full px-4 py-3 rounded-xl border border-mp-sand-dark bg-mp-white text-mp-text font-body text-sm focus:outline-none focus:border-mp-ocean focus:ring-2 focus:ring-mp-ocean/20"
            />
          </div>
          <div>
            <label className="block font-heading text-sm font-medium text-mp-text-light mb-1.5">
              Email
            </label>
            <input
              type="email"
              defaultValue={mockUser.email}
              className="w-full px-4 py-3 rounded-xl border border-mp-sand-dark bg-mp-white text-mp-text font-body text-sm focus:outline-none focus:border-mp-ocean focus:ring-2 focus:ring-mp-ocean/20"
            />
          </div>
          <div>
            <label className="block font-heading text-sm font-medium text-mp-text-light mb-1.5">
              Téléphone
            </label>
            <input
              type="tel"
              defaultValue={mockUser.phone}
              className="w-full px-4 py-3 rounded-xl border border-mp-sand-dark bg-mp-white text-mp-text font-body text-sm focus:outline-none focus:border-mp-ocean focus:ring-2 focus:ring-mp-ocean/20"
            />
          </div>
          <div>
            <label className="block font-heading text-sm font-medium text-mp-text-light mb-1.5">
              Membre depuis
            </label>
            <input
              type="text"
              value={mockUser.memberSince}
              disabled
              className="w-full px-4 py-3 rounded-xl border border-mp-sand-dark bg-mp-sand/50 text-mp-text-light font-body text-sm cursor-not-allowed"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button className="mp-btn mp-btn-primary text-sm">
            Enregistrer
          </button>
          <button className="mp-btn mp-btn-secondary text-sm !text-mp-rose !border-mp-rose hover:!bg-mp-rose hover:!text-white">
            <LogOut className="w-4 h-4" />
            Se déconnecter
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   PAGE COMPONENT
   ============================================================ */

export default function ComptePage() {
  const [activeTab, setActiveTab] = useState<Tab>("reservations");

  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-8 bg-mp-cream">
        <div className="mp-container">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-mp-ocean flex items-center justify-center">
              <span className="font-heading text-xl font-bold text-white">
                {mockUser.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </span>
            </div>
            <div>
              <h1 className="font-heading text-2xl sm:text-3xl font-bold text-mp-charcoal">
                Bonjour, {mockUser.name.split(" ")[0]}
              </h1>
              <p className="font-body text-sm text-mp-text-light">
                Membre depuis {mockUser.memberSince} ·{" "}
                <span className="text-mp-ocean font-medium">
                  {mockCard.remaining} cours restants
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="border-b border-mp-sand-dark/30 bg-mp-white sticky top-20 z-30">
        <div className="mp-container">
          <div className="flex gap-1 overflow-x-auto py-2 scrollbar-hide">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={clsx(
                    "flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-heading font-medium whitespace-nowrap transition-colors",
                    activeTab === tab.id
                      ? "bg-mp-ocean text-white"
                      : "text-mp-text-light hover:bg-mp-ocean/10 hover:text-mp-ocean"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="mp-section bg-mp-white">
        <div className="mp-container max-w-3xl">
          {activeTab === "reservations" && <ReservationsTab />}
          {activeTab === "historique" && <HistoriqueTab />}
          {activeTab === "carte" && <CarteTab />}
          {activeTab === "profil" && <ProfilTab />}
        </div>
      </section>

      {/* Gift card CTA */}
      <section className="py-12 bg-mp-cream">
        <div className="mp-container text-center">
          <Gift className="w-8 h-8 text-mp-gold mx-auto mb-3" />
          <h2 className="font-heading text-xl font-bold text-mp-charcoal mb-2">
            Offrez du Pilates
          </h2>
          <p className="font-body text-sm text-mp-text-light mb-4">
            Faites plaisir avec une carte cadeau personnalisée.
          </p>
          <Link href="/carte-cadeau" className="mp-btn mp-btn-gold text-sm">
            Carte cadeau
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
