"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Calendar,
  CreditCard,
  User,
  Clock,
  Gift,
  LogOut,
  ChevronDown,
  ChevronRight,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  Download,
  Flame,
  TrendingUp,
  Sparkles,
  Repeat,
  Receipt,
  Banknote,
  BadgeCheck,
  Ticket,
  ExternalLink,
  Share2,
  Copy,
  Users,
  MessageCircle,
  Mail,
  Settings,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

/* Google Calendar inline SVG icon (no extra dep needed) */
function GoogleCalendarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
      <path d="M10 14l2 2 4-4" />
    </svg>
  );
}
import { clsx } from "clsx";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { LoyaltySection } from "@/components/ui/LoyaltySection";
import { ProgressJourney } from "@/components/ui/ProgressJourney";
import Skeleton from "@/components/ui/Skeleton";

const breadcrumbItems = [
  { name: "Accueil", href: "/" },
  { name: "Mon Studio", href: "/compte" },
];

/* ============================================================
   TYPES
   ============================================================ */

interface AccountData {
  user: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    birthday: string | null;
    addressLine: string | null;
    postalCode: string | null;
    city: string | null;
    country: string | null;
    memberSince: string;
  };
  upcomingBookings: {
    id: string;
    status: string;
    courseName: string;
    courseSlug: string;
    instructor: string;
    date: string;
    startTime: string;
    endTime: string;
    paymentMethod: string;
    paymentStatus: string;
  }[];
  pastBookings: {
    id: string;
    status: string;
    courseName: string;
    instructor: string;
    date: string;
    startTime: string;
  }[];
  balance: {
    unpaidCount: number;
    unpaidAmount: number;
  };
  activeCard: {
    type: string;
    remaining: number;
    total: number;
    purchasedAt: string;
    expiresAt: string;
  } | null;
}

interface SubscriptionData {
  id: string;
  status: string;
  plan: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  stripePriceId: string | null;
}

interface PaymentData {
  id: string;
  amount: number;
  currency: string;
  type: string;
  status: string;
  createdAt: string;
  stripeCheckoutSessionId: string | null;
}

/* ============================================================
   HELPERS
   ============================================================ */

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

function formatDateShort(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
  });
}

function formatMemberSince(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    month: "long",
    year: "numeric",
  });
}

function formatRelativeDate(dateStr: string): string {
  const d = new Date(dateStr);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const target = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const diffDays = Math.round(
    (target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays === 0) return "Aujourd\u2019hui";
  if (diffDays === 1) return "Demain";
  if (diffDays === 2) return "Apr\u00e8s-demain";
  return formatDate(dateStr);
}

/** Course color dot — pick a color based on course name hash */
function courseColor(name: string): string {
  const colors = [
    "bg-mp-ocean",
    "bg-mp-sage",
    "bg-mp-gold",
    "bg-mp-rose",
    "bg-mp-ocean-light",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length] ?? "bg-mp-ocean";
}

/** Generate a Google Calendar "add event" URL */
function generateGoogleCalendarUrl({
  title,
  startDate,
  endDate,
  description,
  location,
}: {
  title: string;
  startDate: Date;
  endDate: Date;
  description: string;
  location: string;
}): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  const fmt = (d: Date) =>
    `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(
      d.getHours()
    )}${pad(d.getMinutes())}00`;
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${fmt(startDate)}/${fmt(endDate)}`,
    details: description,
    location,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/** Generate an ICS calendar event and trigger download */
function generateICS({
  title,
  description,
  startDate,
  endDate,
  location,
}: {
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  location: string;
}) {
  const pad = (n: number) => String(n).padStart(2, "0");
  const formatDT = (d: Date) =>
    `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(
      d.getHours()
    )}${pad(d.getMinutes())}00`;

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Mon Pilates//Booking//FR",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VTIMEZONE",
    "TZID:Europe/Paris",
    "BEGIN:DAYLIGHT",
    "TZOFFSETFROM:+0100",
    "TZOFFSETTO:+0200",
    "TZNAME:CEST",
    "DTSTART:19700329T020000",
    "RRULE:FREQ=YEARLY;BYDAY=-1SU;BYMONTH=3",
    "END:DAYLIGHT",
    "BEGIN:STANDARD",
    "TZOFFSETFROM:+0200",
    "TZOFFSETTO:+0100",
    "TZNAME:CET",
    "DTSTART:19701025T030000",
    "RRULE:FREQ=YEARLY;BYDAY=-1SU;BYMONTH=10",
    "END:STANDARD",
    "END:VTIMEZONE",
    "BEGIN:VEVENT",
    `DTSTART;TZID=Europe/Paris:${formatDT(startDate)}`,
    `DTEND;TZID=Europe/Paris:${formatDT(endDate)}`,
    `SUMMARY:${title} - Mon Pilates`,
    `DESCRIPTION:${description}\\nMon Pilates - Larmor-Plage`,
    `LOCATION:Mon Pilates\\, 14 Boulevard des Dunes\\, 56260 Larmor-Plage`,
    `ORGANIZER;CN=Mon Pilates:mailto:contact@mon-pilates.bzh`,
    `UID:${Date.now()}@mon-pilates.bzh`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${title.replace(/\s+/g, "_")}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function parseSessionDateTime(date: string, time: string): Date {
  const d = new Date(date);
  const [h, m] = time.split(":").map(Number);
  d.setHours(h ?? 0, m ?? 0, 0, 0);
  return d;
}

/** Count bookings this month with status CONFIRMED or ATTENDED */
function countThisMonth(
  upcoming: AccountData["upcomingBookings"],
  past: AccountData["pastBookings"]
): number {
  const now = new Date();
  const thisMonth = now.getMonth();
  const thisYear = now.getFullYear();

  const upcomingCount = upcoming.filter((b) => {
    const d = new Date(b.date);
    return (
      d.getMonth() === thisMonth &&
      d.getFullYear() === thisYear &&
      (b.status === "CONFIRMED" || b.status === "ATTENDED")
    );
  }).length;

  const pastCount = past.filter((b) => {
    const d = new Date(b.date);
    return (
      d.getMonth() === thisMonth &&
      d.getFullYear() === thisYear &&
      b.status === "ATTENDED"
    );
  }).length;

  return upcomingCount + pastCount;
}

/** Calculate consecutive-week streak */
function calculateStreak(
  upcoming: AccountData["upcomingBookings"],
  past: AccountData["pastBookings"]
): number {
  // Gather all relevant dates
  const dates: Date[] = [];
  for (const b of past) {
    if (b.status === "ATTENDED") dates.push(new Date(b.date));
  }
  for (const b of upcoming) {
    if (b.status === "CONFIRMED") dates.push(new Date(b.date));
  }

  if (dates.length === 0) return 0;

  // Get ISO week number
  const getWeek = (d: Date) => {
    const tmp = new Date(d.getTime());
    tmp.setHours(0, 0, 0, 0);
    tmp.setDate(tmp.getDate() + 3 - ((tmp.getDay() + 6) % 7));
    const jan4 = new Date(tmp.getFullYear(), 0, 4);
    return (
      1 +
      Math.round(
        ((tmp.getTime() - jan4.getTime()) / 86400000 -
          3 +
          ((jan4.getDay() + 6) % 7)) /
          7
      )
    );
  };
  const getYearWeek = (d: Date) => `${d.getFullYear()}-${getWeek(d)}`;

  const weekSet = new Set(dates.map(getYearWeek));

  // Walk backwards from current week
  const now = new Date();
  let streak = 0;
  let cursor = new Date(now);
  while (true) {
    const yw = getYearWeek(cursor);
    if (weekSet.has(yw)) {
      streak++;
      cursor.setDate(cursor.getDate() - 7);
    } else {
      break;
    }
  }
  return streak;
}

function StatusBadge({ status }: { status: string }) {
  const config = {
    CONFIRMED: {
      label: "Confirm\u00e9",
      className: "bg-mp-sage/15 text-mp-sage",
      icon: CheckCircle,
    },
    WAITLIST: {
      label: "Liste d\u2019attente",
      className: "bg-mp-gold/15 text-mp-gold",
      icon: AlertCircle,
    },
    ATTENDED: {
      label: "Effectu\u00e9",
      className: "bg-mp-ocean/15 text-mp-ocean",
      icon: CheckCircle,
    },
    CANCELLED: {
      label: "Annul\u00e9",
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
      <Icon className="w-3.5 h-3.5" aria-hidden="true" />
      {config.label}
    </span>
  );
}

/* ============================================================
   SECTION COMPONENTS
   ============================================================ */

const CANCEL_REASONS = [
  "Emp\u00eachement personnel",
  "Horaire ne convient plus",
  "Probl\u00e8me de sant\u00e9",
  "Autre",
] as const;

/** Inline cancellation survey */
function CancelSurvey({
  bookingId,
  onConfirm,
  onDismiss,
}: {
  bookingId: string;
  onConfirm: (id: string, reason?: string) => void;
  onDismiss: () => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <div className="mt-3 p-4 bg-mp-cream rounded-xl border border-mp-sand-dark/10 space-y-3">
      <p className="font-heading text-sm font-semibold text-mp-charcoal">
        Pourquoi annulez-vous ?
      </p>
      <div className="space-y-2">
        {CANCEL_REASONS.map((reason) => (
          <label
            key={reason}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <input
              type="radio"
              name={`cancel-reason-${bookingId}`}
              value={reason}
              checked={selected === reason}
              onChange={() => setSelected(reason)}
              className="w-4 h-4 text-mp-ocean focus:ring-mp-ocean border-gray-300"
            />
            <span className="text-sm text-mp-text-light group-hover:text-mp-charcoal transition-colors">
              {reason}
            </span>
          </label>
        ))}
      </div>
      <div className="flex gap-2 pt-1">
        <button
          onClick={async () => {
            setLoading(true);
            await onConfirm(bookingId, selected ?? undefined);
            setLoading(false);
          }}
          disabled={loading}
          className="inline-flex items-center gap-1.5 text-xs font-heading font-medium text-white bg-mp-rose hover:bg-mp-rose/90 px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="w-3 h-3 animate-spin" aria-hidden="true" />
          ) : (
            <XCircle className="w-3 h-3" aria-hidden="true" />
          )}
          Confirmer l&apos;annulation
        </button>
        <button
          onClick={onDismiss}
          className="text-xs font-heading font-medium text-mp-text-light hover:text-mp-charcoal px-3 py-2 transition-colors"
        >
          Garder ma r&eacute;servation
        </button>
      </div>
    </div>
  );
}

/** Top hero: welcome + next class + stats */
function WelcomeSection({
  user,
  upcomingBookings,
  pastBookings,
  onCancel,
}: {
  user: AccountData["user"];
  upcomingBookings: AccountData["upcomingBookings"];
  pastBookings: AccountData["pastBookings"];
  onCancel: (id: string, reason?: string) => void;
}) {
  const firstName = user.name.split(" ")[0];
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const [cancellingHeroId, setCancellingHeroId] = useState<string | null>(null);
  const nextClass = upcomingBookings[0] ?? null;
  const coursesThisMonth = countThisMonth(upcomingBookings, pastBookings);
  const streak = calculateStreak(upcomingBookings, pastBookings);
  const monthGoal = 16;
  const progressPct = Math.min(100, Math.round((coursesThisMonth / monthGoal) * 100));

  return (
    <section className="pt-32 pb-10 bg-mp-cream">
      <div className="mp-container">
        <Breadcrumb items={breadcrumbItems} />

        {/* Welcome header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-full bg-mp-ocean flex items-center justify-center flex-shrink-0">
            <span className="font-heading text-xl font-bold text-white">
              {initials}
            </span>
          </div>
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-mp-charcoal">
              Bonjour {firstName} &#128075;
            </h1>
            <p className="font-body text-sm text-mp-text-light">
              Membre depuis {formatMemberSince(user.memberSince)}
            </p>
          </div>
        </div>

        {/* Next class + Stats grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Next class card */}
          <div className="lg:col-span-2 mp-card !rounded-2xl p-6 hover:!transform-none border-l-4 border-l-mp-sage">
            <p className="text-xs font-heading font-semibold text-mp-text-light uppercase tracking-wider mb-3">
              Prochain cours
            </p>
            {nextClass ? (
              <div>
                <div className="flex items-start gap-3">
                  <span
                    className={clsx(
                      "w-3 h-3 rounded-full mt-1.5 flex-shrink-0",
                      courseColor(nextClass.courseName)
                    )}
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-heading text-lg font-bold text-mp-charcoal">
                      {nextClass.courseName}
                    </h3>
                    <p className="text-sm text-mp-text-light mt-1">
                      {formatRelativeDate(nextClass.date)}, {nextClass.startTime}{" "}
                      &mdash; {nextClass.endTime}
                    </p>
                    <p className="text-sm text-mp-text-light">
                      avec {nextClass.instructor}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-4 ml-6">
                  <button
                    onClick={() => {
                      const start = parseSessionDateTime(
                        nextClass.date,
                        nextClass.startTime
                      );
                      const end = parseSessionDateTime(
                        nextClass.date,
                        nextClass.endTime
                      );
                      generateICS({
                        title: nextClass.courseName,
                        description: `Cours avec ${nextClass.instructor}`,
                        startDate: start,
                        endDate: end,
                        location: "Mon Pilates, 14 Boulevard des Dunes, 56260 Larmor-Plage",
                      });
                    }}
                    className="mp-btn mp-btn-secondary text-xs !py-2 !px-3"
                  >
                    <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
                    Calendrier (.ics)
                  </button>
                  <a
                    href={generateGoogleCalendarUrl({
                      title: `${nextClass.courseName} - Mon Pilates`,
                      startDate: parseSessionDateTime(nextClass.date, nextClass.startTime),
                      endDate: parseSessionDateTime(nextClass.date, nextClass.endTime),
                      description: `Cours avec ${nextClass.instructor}\nMon Pilates - Larmor-Plage`,
                      location: "Mon Pilates, 14 Boulevard des Dunes, 56260 Larmor-Plage",
                    })}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mp-btn mp-btn-secondary text-xs !py-2 !px-3"
                  >
                    <GoogleCalendarIcon className="w-3.5 h-3.5" />
                    Google Calendar
                  </a>
                  <button
                    onClick={() => setCancellingHeroId(cancellingHeroId === nextClass.id ? null : nextClass.id)}
                    className="text-xs text-mp-rose hover:text-mp-rose/80 font-heading font-medium transition-colors px-3 py-2"
                  >
                    Annuler
                  </button>
                </div>
                {cancellingHeroId === nextClass.id && (
                  <div className="ml-6">
                    <CancelSurvey
                      bookingId={nextClass.id}
                      onConfirm={(id, reason) => {
                        setCancellingHeroId(null);
                        onCancel(id, reason);
                      }}
                      onDismiss={() => setCancellingHeroId(null)}
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 px-4 rounded-xl border-2 border-dashed border-mp-sand">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-mp-ocean/10 text-mp-ocean mb-3">
                  <Calendar className="w-6 h-6" aria-hidden="true" />
                </div>
                <h3 className="font-heading text-base font-semibold text-mp-charcoal mb-1">
                  Aucune r&eacute;servation pour le moment
                </h3>
                <p className="text-sm text-mp-text-light mb-4">
                  D&eacute;couvrez notre planning et r&eacute;servez votre premi&egrave;re s&eacute;ance.
                </p>
                <Link
                  href="/planning"
                  className="mp-btn mp-btn-primary inline-flex items-center gap-2 text-sm"
                >
                  Voir le planning
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </div>
            )}
          </div>

          {/* Stats card */}
          <div className="mp-card !rounded-2xl p-6 hover:!transform-none flex flex-col justify-between">
            <p className="text-xs font-heading font-semibold text-mp-text-light uppercase tracking-wider mb-4">
              Ma pratique
            </p>

            <div className="space-y-4 flex-1">
              {/* Courses this month */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-mp-ocean/10 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-4.5 h-4.5 text-mp-ocean" aria-hidden="true" />
                </div>
                <div>
                  <p className="font-heading text-xl font-bold text-mp-charcoal leading-none">
                    {coursesThisMonth}
                  </p>
                  <p className="text-xs text-mp-text-light">cours ce mois</p>
                </div>
              </div>

              {/* Streak */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-mp-gold/10 flex items-center justify-center flex-shrink-0">
                  <Flame className="w-4.5 h-4.5 text-mp-gold" aria-hidden="true" />
                </div>
                <div>
                  <p className="font-heading text-xl font-bold text-mp-charcoal leading-none">
                    {streak}
                  </p>
                  <p className="text-xs text-mp-text-light">
                    semaine{streak > 1 ? "s" : ""} cons&eacute;cutive{streak > 1 ? "s" : ""}
                  </p>
                </div>
              </div>

              {/* Progress bar */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs text-mp-text-light">Objectif mensuel</span>
                  <span className="text-xs font-heading font-semibold text-mp-ocean">
                    {progressPct}%
                  </span>
                </div>
                <div
                  className="bg-mp-sand rounded-full h-2.5"
                  role="progressbar"
                  aria-valuenow={coursesThisMonth}
                  aria-valuemin={0}
                  aria-valuemax={monthGoal}
                  aria-label={`${coursesThisMonth} cours sur ${monthGoal} ce mois`}
                >
                  <div
                    className="bg-mp-ocean rounded-full h-2.5 transition-all duration-500"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Card/subscription status bar */
function CardStatusSection({ card }: { card: AccountData["activeCard"] }) {
  if (!card) {
    return (
      <section className="py-6 bg-mp-white border-y border-mp-sand-dark/20">
        <div className="mp-container max-w-3xl">
          <div className="text-center py-8 px-4 rounded-xl border-2 border-dashed border-mp-sand">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-mp-ocean/10 text-mp-ocean mb-3">
              <CreditCard className="w-6 h-6" aria-hidden="true" />
            </div>
            <h3 className="font-heading text-base font-semibold text-mp-charcoal mb-1">
              Aucune carte de cours active
            </h3>
            <p className="text-sm text-mp-text-light mb-4">
              <Sparkles className="inline-block w-3.5 h-3.5 text-mp-gold -mt-0.5 mr-1" aria-hidden="true" />
              &Eacute;conomisez jusqu&apos;&agrave; 28% avec une carte de cours ou un abonnement.
            </p>
            <Link
              href="/tarifs"
              className="mp-btn mp-btn-gold inline-flex items-center gap-2 text-sm"
            >
              D&eacute;couvrir nos formules
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const percentage = (card.remaining / card.total) * 100;
  const isLow = card.remaining <= 2;

  return (
    <section className="py-6 bg-mp-white border-y border-mp-sand-dark/20">
      <div className="mp-container">
        <div className="!rounded-2xl overflow-hidden shadow-md" style={{ background: "linear-gradient(135deg, #0077B6, #005a8c)", color: "white", padding: "1.5rem" }}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <CreditCard className="w-8 h-8 text-white/40 flex-shrink-0" aria-hidden="true" />
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-heading text-sm font-medium text-white/70">
                    {card.type}
                  </p>
                  {isLow && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-mp-rose/80 text-white text-xs font-heading font-medium">
                      <AlertCircle className="w-3 h-3" aria-hidden="true" />
                      Plus que {card.remaining} s&eacute;ance{card.remaining > 1 ? "s" : ""} !
                    </span>
                  )}
                </div>
                <p className="font-heading text-2xl font-bold mt-0.5">
                  {card.remaining}{" "}
                  <span className="text-base font-normal text-white/60">
                    / {card.total} cours restants
                  </span>
                </p>
              </div>
            </div>
            <Link
              href="/tarifs"
              className="mp-btn text-sm !py-2 !px-4 !bg-white !text-mp-ocean hover:!bg-white/90 flex-shrink-0"
            >
              Renouveler
            </Link>
          </div>

          <div
            className="bg-white/20 rounded-full h-2.5 mt-4"
            role="progressbar"
            aria-valuenow={card.remaining}
            aria-valuemin={0}
            aria-valuemax={card.total}
            aria-label={`${card.remaining} cours restants sur ${card.total}`}
          >
            <div
              className={clsx(
                "rounded-full h-2.5 transition-all",
                isLow ? "bg-mp-rose" : "bg-white"
              )}
              style={{ width: `${percentage}%` }}
            />
          </div>

          <div className="flex justify-between text-xs text-white/50 mt-2">
            <span>Achet&eacute;e le {formatDateShort(card.purchasedAt)}</span>
            <span>Expire le {formatDateShort(card.expiresAt)}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Referral / Parrainage section */
function ReferralSection() {
  const [referralData, setReferralData] = useState<{
    code: string;
    referralLink: string;
    referredCount: number;
    creditsEarned: number;
  } | null>(null);
  const [loadingRef, setLoadingRef] = useState(true);
  const [copied, setCopied] = useState<"code" | "link" | null>(null);

  useEffect(() => {
    async function fetchReferral() {
      try {
        const res = await fetch("/api/account/referral");
        if (res.ok) {
          const data = await res.json();
          setReferralData(data);
        }
      } catch {
        // Silently fail
      } finally {
        setLoadingRef(false);
      }
    }
    fetchReferral();
  }, []);

  async function copyToClipboard(text: string, type: "code" | "link") {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    }
  }

  function shareWhatsApp() {
    if (!referralData) return;
    const msg = `Je fais du Pilates chez Mon Pilates et j\u2019adore ! Inscris-toi avec mon code ${referralData.code} et on gagne chacun un cours offert : ${referralData.referralLink}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank");
  }

  function shareEmail() {
    if (!referralData) return;
    const subject = "Un cours de Pilates offert pour toi !";
    const body = `Salut !\n\nJe fais du Pilates chez Mon Pilates et c\u2019est super.\nInscris-toi avec mon code de parrainage et on gagne chacun un cours offert !\n\nMon code : ${referralData.code}\nOu inscris-toi directement ici : ${referralData.referralLink}\n\n\u00c0 bient\u00f4t au studio !`;
    window.open(
      `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
      "_blank"
    );
  }

  if (loadingRef) {
    return (
      <div className="mp-card !rounded-2xl p-5 hover:!transform-none border border-mp-ocean/20 bg-mp-ocean/5">
        <div className="flex items-center justify-center py-4">
          <Loader2 className="w-5 h-5 text-mp-ocean animate-spin" aria-hidden="true" />
        </div>
      </div>
    );
  }

  if (!referralData) return null;

  return (
    <div className="mp-card !rounded-2xl p-5 hover:!transform-none border border-mp-ocean/20 bg-mp-ocean/5">
      <div className="flex items-start gap-3 mb-4">
        <Share2 className="w-5 h-5 text-mp-ocean flex-shrink-0 mt-0.5" aria-hidden="true" />
        <div>
          <p className="font-heading text-sm font-semibold text-mp-charcoal">
            Parrainage
          </p>
          <p className="font-body text-xs text-mp-text-light mt-0.5">
            Invitez vos proches, gagnez des cours !
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <p className="font-body text-xs text-mp-text-light mb-1.5">Votre code :</p>
          <div className="flex items-center gap-2">
            <span className="font-heading text-lg font-bold text-mp-ocean tracking-wider">
              {referralData.code}
            </span>
            <button
              onClick={() => copyToClipboard(referralData.code, "code")}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-mp-ocean/30 text-xs font-heading font-medium text-mp-ocean hover:bg-mp-ocean/10 transition-colors"
            >
              <Copy className="w-3.5 h-3.5" aria-hidden="true" />
              {copied === "code" ? "Copi\u00e9 !" : "Copier"}
            </button>
          </div>
        </div>

        <div>
          <p className="font-body text-xs text-mp-text-light mb-1.5">
            Ou partagez ce lien :
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            <code className="text-xs bg-mp-white px-3 py-1.5 rounded-lg border border-mp-sand-dark/30 text-mp-text-light font-body break-all">
              {referralData.referralLink}
            </code>
          </div>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <button
              onClick={() => copyToClipboard(referralData.referralLink, "link")}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-mp-ocean/30 text-xs font-heading font-medium text-mp-ocean hover:bg-mp-ocean/10 transition-colors"
            >
              <Copy className="w-3.5 h-3.5" aria-hidden="true" />
              {copied === "link" ? "Copi\u00e9 !" : "Copier le lien"}
            </button>
            <button
              onClick={shareWhatsApp}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#25D366] text-white text-xs font-heading font-medium hover:bg-[#20BD5A] transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" aria-hidden="true" />
              WhatsApp
            </button>
            <button
              onClick={shareEmail}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-mp-sand-dark/30 text-xs font-heading font-medium text-mp-charcoal hover:bg-mp-sand/30 transition-colors"
            >
              <Mail className="w-3.5 h-3.5" aria-hidden="true" />
              Email
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4 pt-2 border-t border-mp-ocean/10">
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-mp-ocean" aria-hidden="true" />
            <span className="font-heading text-sm font-bold text-mp-charcoal">
              {referralData.referredCount}
            </span>
            <span className="font-body text-xs text-mp-text-light">
              ami{referralData.referredCount > 1 ? "s" : ""} parrain&eacute;{referralData.referredCount > 1 ? "s" : ""}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Gift className="w-4 h-4 text-mp-gold" aria-hidden="true" />
            <span className="font-heading text-sm font-bold text-mp-charcoal">
              {referralData.creditsEarned}
            </span>
            <span className="font-body text-xs text-mp-text-light">
              cours offert{referralData.creditsEarned > 1 ? "s" : ""} gagn&eacute;{referralData.creditsEarned > 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Gift card redemption */
function GiftCardRedeemSection() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  function formatCode(raw: string): string {
    // Allow typing in MP-XXXX-XXXX format
    const clean = raw.toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (clean.length <= 2) return clean;
    if (clean.length <= 6) return `${clean.slice(0, 2)}-${clean.slice(2)}`;
    return `${clean.slice(0, 2)}-${clean.slice(2, 6)}-${clean.slice(6, 10)}`;
  }

  async function handleRedeem() {
    if (code.replace(/-/g, "").length < 10) return;
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/gift-cards/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({
          type: "success",
          text: data.message || "Carte cadeau appliqu\u00e9e avec succ\u00e8s !",
        });
        setCode("");
      } else {
        setMessage({
          type: "error",
          text: data.error || "Code invalide ou expir\u00e9.",
        });
      }
    } catch {
      setMessage({ type: "error", text: "Erreur de connexion." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mp-card !rounded-2xl p-5 hover:!transform-none bg-mp-gold/5 border border-mp-gold/20">
      <div className="flex items-start gap-3">
        <Gift className="w-5 h-5 text-mp-gold flex-shrink-0 mt-0.5" aria-hidden="true" />
        <div className="flex-1">
          <p className="font-heading text-sm font-semibold text-mp-charcoal mb-2">
            Vous avez une carte cadeau ?
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(formatCode(e.target.value))}
              placeholder="MP-XXXX-XXXX"
              maxLength={12}
              className="flex-1 px-3 py-2 rounded-xl border border-mp-sand-dark bg-mp-white text-mp-text font-body text-sm focus:outline-none focus-visible:outline-2 focus-visible:outline-mp-ocean focus-visible:outline-offset-2 placeholder:text-mp-text-light/50"
            />
            <button
              onClick={handleRedeem}
              disabled={loading || code.replace(/-/g, "").length < 10}
              className="mp-btn mp-btn-gold text-xs !py-2 !px-4 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
              ) : (
                "Appliquer"
              )}
            </button>
          </div>
          {message && (
            <p
              className={clsx(
                "text-xs mt-2 font-body",
                message.type === "success"
                  ? "text-mp-sage"
                  : "text-mp-rose"
              )}
            >
              {message.text}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/** Upcoming bookings list */
function UpcomingBookingsSection({
  bookings,
  onCancel,
}: {
  bookings: AccountData["upcomingBookings"];
  onCancel: (id: string, reason?: string) => void;
}) {
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  // Skip first booking since it's shown in the hero
  const remaining = bookings.slice(1);

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-heading text-lg font-bold text-mp-charcoal">
          Prochaines r&eacute;servations
          {bookings.length > 0 && (
            <span className="text-sm font-normal text-mp-text-light ml-2">
              ({bookings.length})
            </span>
          )}
        </h2>
        <Link
          href="/planning"
          className="mp-btn mp-btn-primary text-xs !py-2 !px-4"
        >
          <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
          R&eacute;server
        </Link>
      </div>

      {remaining.length === 0 && bookings.length <= 1 ? (
        <div className="text-center py-8 px-4 rounded-xl border-2 border-dashed border-mp-sand">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-mp-ocean/10 text-mp-ocean mb-3">
            <Calendar className="w-6 h-6" aria-hidden="true" />
          </div>
          <h3 className="font-heading text-base font-semibold text-mp-charcoal mb-1">
            {bookings.length === 1
              ? "Aucune autre s\u00e9ance r\u00e9serv\u00e9e"
              : "Aucune r\u00e9servation pour le moment"}
          </h3>
          <p className="text-sm text-mp-text-light mb-4">
            D&eacute;couvrez notre planning et r&eacute;servez votre prochaine s&eacute;ance.
          </p>
          <Link
            href="/planning"
            className="mp-btn mp-btn-primary inline-flex items-center gap-2 text-sm"
          >
            Voir le planning
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {remaining.map((booking) => (
            <div
              key={booking.id}
              className="mp-card !rounded-xl p-4 hover:!transform-none"
            >
              <div className="flex items-start gap-3">
                <span
                  className={clsx(
                    "w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0",
                    courseColor(booking.courseName)
                  )}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-heading font-semibold text-mp-charcoal text-sm">
                        {booking.courseName}
                      </h3>
                      <p className="text-xs text-mp-text-light mt-0.5">
                        {formatRelativeDate(booking.date)} &middot;{" "}
                        {booking.startTime} &mdash; {booking.endTime}
                      </p>
                      <p className="text-xs text-mp-text-light">
                        avec {booking.instructor}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <StatusBadge status={booking.status} />
                      {booking.paymentStatus === "PAID" ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-medium">
                          <BadgeCheck className="w-3 h-3" aria-hidden="true" />
                          Pay&eacute;
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-xs font-medium">
                          <Banknote className="w-3 h-3" aria-hidden="true" />
                          &Agrave; payer
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => {
                        const start = parseSessionDateTime(
                          booking.date,
                          booking.startTime
                        );
                        const end = parseSessionDateTime(
                          booking.date,
                          booking.endTime
                        );
                        generateICS({
                          title: booking.courseName,
                          description: `Cours avec ${booking.instructor}`,
                          startDate: start,
                          endDate: end,
                          location: "Mon Pilates, 14 Boulevard des Dunes, 56260 Larmor-Plage",
                        });
                      }}
                      className="inline-flex items-center gap-1.5 text-xs text-mp-ocean hover:text-mp-ocean-dark font-heading font-medium transition-colors"
                    >
                      <Download className="w-3 h-3" aria-hidden="true" />
                      .ics
                    </button>
                    <a
                      href={generateGoogleCalendarUrl({
                        title: `${booking.courseName} - Mon Pilates`,
                        startDate: parseSessionDateTime(booking.date, booking.startTime),
                        endDate: parseSessionDateTime(booking.date, booking.endTime),
                        description: `Cours avec ${booking.instructor}\nMon Pilates - Larmor-Plage`,
                        location: "Mon Pilates, 14 Boulevard des Dunes, 56260 Larmor-Plage",
                      })}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-mp-ocean hover:text-mp-ocean-dark font-heading font-medium transition-colors"
                    >
                      <GoogleCalendarIcon className="w-3 h-3" />
                      Google
                    </a>
                    <button
                      onClick={() => setCancellingId(cancellingId === booking.id ? null : booking.id)}
                      className="inline-flex items-center gap-1 text-xs text-mp-rose hover:text-mp-rose/80 font-heading font-medium transition-colors"
                    >
                      Annuler
                    </button>
                  </div>
                  {cancellingId === booking.id && (
                    <CancelSurvey
                      bookingId={booking.id}
                      onConfirm={(id, reason) => {
                        setCancellingId(null);
                        onCancel(id, reason);
                      }}
                      onDismiss={() => setCancellingId(null)}
                    />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/** Recurring slots section */
function RecurringSection() {
  const [recurring, setRecurring] = useState<
    {
      scheduleId: string;
      dayName: string;
      startTime: string;
      courseName: string;
      courseSlug: string;
      instructor: string;
      nextSessionDate: string;
      futureBookingsCount: number;
    }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState<string | null>(null);

  const fetchRecurring = useCallback(async () => {
    try {
      const res = await fetch("/api/bookings/recurring");
      if (res.ok) {
        const data = await res.json();
        setRecurring(data.recurring ?? []);
      }
    } catch {
      // Silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecurring();
  }, [fetchRecurring]);

  async function handleUnsubscribe(scheduleId: string) {
    if (!confirm("Voulez-vous vraiment vous d\u00e9sinscrire de ce cr\u00e9neau r\u00e9current ?"))
      return;
    setCancelling(scheduleId);
    try {
      const res = await fetch("/api/bookings/recurring", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scheduleId }),
      });
      if (res.ok) {
        setRecurring((prev) => prev.filter((r) => r.scheduleId !== scheduleId));
      } else {
        const data = await res.json();
        alert(data.error || "Erreur lors de la d\u00e9sinscription.");
      }
    } catch {
      alert("Erreur de connexion.");
    } finally {
      setCancelling(null);
    }
  }

  if (loading) return null;

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Repeat className="w-4.5 h-4.5 text-mp-ocean" aria-hidden="true" />
        <h2 className="font-heading text-lg font-bold text-mp-charcoal">
          Mes cr&eacute;neaux r&eacute;currents
        </h2>
      </div>

      {recurring.length === 0 ? (
        <div className="text-center py-8 px-4 rounded-xl border-2 border-dashed border-mp-sand">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-mp-ocean/10 text-mp-ocean mb-3">
            <Repeat className="w-6 h-6" aria-hidden="true" />
          </div>
          <h3 className="font-heading text-base font-semibold text-mp-charcoal mb-1">
            Aucun cr&eacute;neau r&eacute;current
          </h3>
          <p className="text-sm text-mp-text-light mb-4">
            Cochez &laquo;&nbsp;R&eacute;server chaque semaine&nbsp;&raquo; lors de votre prochaine r&eacute;servation.
          </p>
          <Link
            href="/planning"
            className="mp-btn mp-btn-secondary inline-flex items-center gap-2 text-sm"
          >
            Voir le planning
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {recurring.map((slot) => (
            <div
              key={slot.scheduleId}
              className="mp-card !rounded-xl p-4 hover:!transform-none"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <span
                    className={clsx(
                      "w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0",
                      courseColor(slot.courseName)
                    )}
                  />
                  <div className="min-w-0">
                    <p className="font-heading font-semibold text-mp-charcoal text-sm">
                      Tous les {slot.dayName.toLowerCase()}s &agrave; {slot.startTime}
                    </p>
                    <p className="text-xs text-mp-text-light mt-0.5">
                      {slot.courseName} avec {slot.instructor}
                    </p>
                    <p className="text-xs text-mp-text-muted mt-0.5">
                      {slot.futureBookingsCount} s&eacute;ance{slot.futureBookingsCount > 1 ? "s" : ""} &agrave; venir
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleUnsubscribe(slot.scheduleId)}
                  disabled={cancelling === slot.scheduleId}
                  className="flex-shrink-0 text-xs text-mp-rose hover:text-mp-rose/80 font-heading font-medium transition-colors mt-1"
                >
                  {cancelling === slot.scheduleId ? (
                    <Loader2
                      className="w-4 h-4 animate-spin"
                      aria-hidden="true"
                    />
                  ) : (
                    "Se d\u00e9sinscrire"
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/** Past classes — collapsible */
function PastClassesSection({
  bookings,
  memberSince,
}: {
  bookings: AccountData["pastBookings"];
  memberSince: string;
}) {
  const [open, setOpen] = useState(false);
  const attendedCount = bookings.filter((b) => b.status === "ATTENDED").length;

  if (bookings.length === 0) {
    return (
      <div className="text-center py-8 px-4 rounded-xl border-2 border-dashed border-mp-sand">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-mp-ocean/10 text-mp-ocean mb-3">
          <Clock className="w-6 h-6" aria-hidden="true" />
        </div>
        <h3 className="font-heading text-base font-semibold text-mp-charcoal mb-1">
          Aucun historique pour le moment
        </h3>
        <p className="text-sm text-mp-text-light">
          Votre historique s&rsquo;affichera ici apr&egrave;s votre premi&egrave;re s&eacute;ance.
        </p>
      </div>
    );
  }

  return (
    <div className="mp-card !rounded-2xl overflow-hidden hover:!transform-none">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-mp-sand/30 transition-colors"
        aria-expanded={open}
      >
        <div className="flex items-center gap-3">
          <Clock className="w-5 h-5 text-mp-text-light/60" aria-hidden="true" />
          <span className="font-heading font-semibold text-mp-charcoal text-sm">
            Historique
          </span>
          <span className="text-xs text-mp-text-light bg-mp-sand/60 px-2 py-0.5 rounded-full">
            {attendedCount} cours
          </span>
        </div>
        <ChevronDown
          className={clsx(
            "w-5 h-5 text-mp-text-light transition-transform duration-200",
            open && "rotate-180"
          )}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div className="border-t border-mp-sand-dark/10">
          <div className="max-h-80 overflow-y-auto">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="flex items-center justify-between px-5 py-3 border-b border-mp-sand-dark/5 last:border-0"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xs text-mp-text-light w-16 flex-shrink-0">
                    {formatDateShort(booking.date)}
                  </span>
                  <span className="font-heading text-sm text-mp-charcoal truncate">
                    {booking.courseName}
                  </span>
                </div>
                <span className="text-xs text-mp-text-light flex-shrink-0 ml-3">
                  {booking.instructor}
                </span>
              </div>
            ))}
          </div>
          <div className="px-5 py-3 bg-mp-sand/20 text-center">
            <p className="text-xs text-mp-text-light">
              {attendedCount} cours effectu&eacute;{attendedCount > 1 ? "s" : ""}{" "}
              depuis {formatMemberSince(memberSince)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

/** Profile section — collapsible. Includes optional fields (birthday +
 * 4-line address) that the user can fill in if they want; only `name`
 * is conceptually required (already set at signup). */
function ProfileSection({
  user,
  onSave,
}: {
  user: AccountData["user"];
  onSave: (data: {
    name: string
    phone: string
    birthday: string
    addressLine: string
    postalCode: string
    city: string
    country: string
  }) => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone ?? "");
  // <input type="date"> needs an ISO yyyy-mm-dd value (no time). user.birthday
  // arrives as an ISO datetime string from the JSON API, so we slice it.
  const [birthday, setBirthday] = useState(user.birthday ? user.birthday.slice(0, 10) : "");
  const [addressLine, setAddressLine] = useState(user.addressLine ?? "");
  const [postalCode, setPostalCode] = useState(user.postalCode ?? "");
  const [city, setCity] = useState(user.city ?? "");
  const [country, setCountry] = useState(user.country ?? "France");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    await onSave({ name, phone, birthday, addressLine, postalCode, city, country });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div className="mp-card !rounded-2xl overflow-hidden hover:!transform-none">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-mp-sand/30 transition-colors"
        aria-expanded={open}
      >
        <div className="flex items-center gap-3">
          <User className="w-5 h-5 text-mp-text-light/60" aria-hidden="true" />
          <span className="font-heading font-semibold text-mp-charcoal text-sm">
            Mon profil
          </span>
        </div>
        <ChevronDown
          className={clsx(
            "w-5 h-5 text-mp-text-light transition-transform duration-200",
            open && "rotate-180"
          )}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div className="border-t border-mp-sand-dark/10 p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            <div>
              <label
                htmlFor="profile-name"
                className="block font-heading text-xs font-medium text-mp-text-light mb-1.5"
              >
                Nom complet
              </label>
              <input
                id="profile-name"
                type="text"
                autoComplete="name"
                enterKeyHint="next"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-mp-sand-dark bg-mp-white text-mp-text font-body text-sm focus:outline-none focus-visible:outline-2 focus-visible:outline-mp-ocean focus-visible:outline-offset-2"
              />
            </div>
            <div>
              <label
                htmlFor="profile-email"
                className="block font-heading text-xs font-medium text-mp-text-light mb-1.5"
              >
                Email
              </label>
              <input
                id="profile-email"
                type="email"
                value={user.email}
                disabled
                aria-disabled="true"
                className="w-full px-3 py-2.5 rounded-xl border border-mp-sand-dark bg-mp-sand/50 text-mp-text-light font-body text-sm cursor-not-allowed"
              />
            </div>
            <div>
              <label
                htmlFor="profile-tel"
                className="block font-heading text-xs font-medium text-mp-text-light mb-1.5"
              >
                T&eacute;l&eacute;phone <span className="text-mp-text-muted/70 font-normal">(optionnel)</span>
              </label>
              <input
                id="profile-tel"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                enterKeyHint="next"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-mp-sand-dark bg-mp-white text-mp-text font-body text-sm focus:outline-none focus-visible:outline-2 focus-visible:outline-mp-ocean focus-visible:outline-offset-2"
              />
            </div>
            <div>
              <label
                htmlFor="profile-birthday"
                className="block font-heading text-xs font-medium text-mp-text-light mb-1.5"
              >
                Date de naissance <span className="text-mp-text-muted/70 font-normal">(optionnel)</span>
              </label>
              <input
                id="profile-birthday"
                type="date"
                autoComplete="bday"
                enterKeyHint="next"
                value={birthday}
                onChange={(e) => setBirthday(e.target.value)}
                max={new Date().toISOString().slice(0, 10)}
                className="w-full px-3 py-2.5 rounded-xl border border-mp-sand-dark bg-mp-white text-mp-text font-body text-sm focus:outline-none focus-visible:outline-2 focus-visible:outline-mp-ocean focus-visible:outline-offset-2"
              />
            </div>
          </div>

          {/* Address — entirely optional, collapsed visually under a sub-heading */}
          <div className="border-t border-mp-sand-dark/20 pt-4 mb-5">
            <p className="font-heading text-xs font-medium text-mp-text-light mb-3">
              Adresse <span className="text-mp-text-muted/70 font-normal">(optionnel — utile pour les cartes cadeaux papier ou la facturation)</span>
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label htmlFor="profile-address" className="block font-heading text-xs font-medium text-mp-text-light mb-1.5">
                  Adresse
                </label>
                <input
                  id="profile-address"
                  type="text"
                  autoComplete="street-address"
                  enterKeyHint="next"
                  placeholder="14 Boulevard des Dunes"
                  value={addressLine}
                  onChange={(e) => setAddressLine(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-mp-sand-dark bg-mp-white text-mp-text font-body text-sm focus:outline-none focus-visible:outline-2 focus-visible:outline-mp-ocean focus-visible:outline-offset-2"
                />
              </div>
              <div>
                <label htmlFor="profile-postal" className="block font-heading text-xs font-medium text-mp-text-light mb-1.5">
                  Code postal
                </label>
                <input
                  id="profile-postal"
                  type="text"
                  inputMode="numeric"
                  autoComplete="postal-code"
                  enterKeyHint="next"
                  placeholder="56260"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-mp-sand-dark bg-mp-white text-mp-text font-body text-sm focus:outline-none focus-visible:outline-2 focus-visible:outline-mp-ocean focus-visible:outline-offset-2"
                />
              </div>
              <div>
                <label htmlFor="profile-city" className="block font-heading text-xs font-medium text-mp-text-light mb-1.5">
                  Ville
                </label>
                <input
                  id="profile-city"
                  type="text"
                  autoComplete="address-level2"
                  enterKeyHint="next"
                  placeholder="Larmor-Plage"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-mp-sand-dark bg-mp-white text-mp-text font-body text-sm focus:outline-none focus-visible:outline-2 focus-visible:outline-mp-ocean focus-visible:outline-offset-2"
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="profile-country" className="block font-heading text-xs font-medium text-mp-text-light mb-1.5">
                  Pays
                </label>
                <input
                  id="profile-country"
                  type="text"
                  autoComplete="country-name"
                  enterKeyHint="done"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-mp-sand-dark bg-mp-white text-mp-text font-body text-sm focus:outline-none focus-visible:outline-2 focus-visible:outline-mp-ocean focus-visible:outline-offset-2"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="mp-btn mp-btn-primary text-sm"
            >
              {saving ? (
                <Loader2
                  className="w-4 h-4 animate-spin"
                  aria-hidden="true"
                />
              ) : saved ? (
                <>
                  <CheckCircle className="w-4 h-4" aria-hidden="true" />
                  Enregistr&eacute;
                </>
              ) : (
                "Enregistrer"
              )}
            </button>
            <Link
              href="/compte/preferences"
              className="mp-btn mp-btn-secondary text-sm"
            >
              <Settings className="w-4 h-4" aria-hidden="true" />
              Pr&eacute;f&eacute;rences
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="mp-btn mp-btn-secondary text-sm !text-mp-rose !border-mp-rose hover:!bg-mp-rose hover:!text-white"
            >
              <LogOut className="w-4 h-4" aria-hidden="true" />
              Se d&eacute;connecter
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/** Payment type → French label */
function paymentTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    TRIAL: "Cours d\u2019essai",
    BOOKING: "S\u00e9ance unitaire",
    SUBSCRIPTION: "Abonnement mensuel",
    GIFT_CARD: "Carte cadeau",
    COURSE_CARD: "Carte de cours",
  };
  return labels[type] ?? type;
}

/** Format cents to EUR string */
function formatEur(cents: number): string {
  return (cents / 100).toLocaleString("fr-FR", {
    style: "currency",
    currency: "EUR",
  });
}

/** Subscription management section */
function SubscriptionSection({
  subscription,
  onAction,
  actionLoading,
}: {
  subscription: SubscriptionData;
  onAction: (action: "cancel" | "resume") => void;
  actionLoading: boolean;
}) {
  const renewDate = new Date(subscription.currentPeriodEnd).toLocaleDateString(
    "fr-FR",
    { day: "numeric", month: "long", year: "numeric" }
  );

  return (
    <div className="mp-card !rounded-2xl overflow-hidden hover:!transform-none border-l-4 border-l-mp-ocean p-5">
      <div className="flex items-start gap-3">
        <CreditCard
          className="w-5 h-5 text-mp-ocean flex-shrink-0 mt-0.5"
          aria-hidden="true"
        />
        <div className="flex-1">
          <p className="font-heading text-sm font-semibold text-mp-charcoal">
            Mon abonnement
          </p>
          <p className="font-body text-sm text-mp-text-light mt-1">
            Abonnement {subscription.plan}
          </p>

          {subscription.cancelAtPeriodEnd ? (
            <>
              <div className="flex items-center gap-2 mt-3 px-3 py-2 rounded-xl bg-mp-gold/10 border border-mp-gold/20">
                <AlertCircle
                  className="w-4 h-4 text-mp-gold flex-shrink-0"
                  aria-hidden="true"
                />
                <p className="font-body text-xs text-mp-text">
                  Annulation pr&eacute;vue le {renewDate}
                </p>
              </div>
              <button
                onClick={() => onAction("resume")}
                disabled={actionLoading}
                className="mp-btn mp-btn-primary text-xs !py-2 !px-4 mt-3"
              >
                {actionLoading ? (
                  <Loader2
                    className="w-4 h-4 animate-spin"
                    aria-hidden="true"
                  />
                ) : (
                  "Reprendre l\u2019abonnement"
                )}
              </button>
            </>
          ) : (
            <>
              <p className="font-body text-xs text-mp-text-light mt-1">
                Prochain renouvellement : {renewDate}
              </p>
              <button
                onClick={() => onAction("cancel")}
                disabled={actionLoading}
                className="text-xs text-mp-rose hover:text-mp-rose/80 font-heading font-medium transition-colors mt-3"
              >
                {actionLoading ? (
                  <Loader2
                    className="w-4 h-4 animate-spin"
                    aria-hidden="true"
                  />
                ) : (
                  "Annuler l\u2019abonnement"
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/** Billing portal button */
function BillingPortalButton() {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  async function handleClick() {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/account/billing-portal", {
        method: "POST",
      });
      const data = await res.json();
      if (res.ok && data.url) {
        window.location.href = data.url;
      } else {
        setErrorMsg("Le portail Stripe n\u2019est pas encore disponible pour votre compte. Effectuez un premier paiement en ligne pour y acc\u00e9der.");
      }
    } catch {
      setErrorMsg("Erreur de connexion.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="text-center">
      <button
        onClick={handleClick}
        disabled={loading}
        className="inline-flex items-center gap-2 text-xs text-mp-ocean hover:text-mp-ocean-dark font-heading font-medium transition-colors disabled:opacity-50"
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
        ) : (
          <>
            <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
            G\u00e9rer mes paiements et factures
          </>
        )}
      </button>
      {errorMsg && (
        <p className="text-xs text-mp-text/50 mt-2 max-w-xs mx-auto">{errorMsg}</p>
      )}
    </div>
  );
}

/** Payment history — collapsible */
function PaymentHistorySection({ payments }: { payments: PaymentData[] }) {
  const [open, setOpen] = useState(false);

  if (payments.length === 0) return null;

  return (
    <div className="mp-card !rounded-2xl overflow-hidden hover:!transform-none">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-mp-sand/30 transition-colors"
        aria-expanded={open}
      >
        <div className="flex items-center gap-3">
          <Receipt
            className="w-5 h-5 text-mp-text-light/60"
            aria-hidden="true"
          />
          <span className="font-heading font-semibold text-mp-charcoal text-sm">
            Historique des paiements
          </span>
          <span className="text-xs text-mp-text-light bg-mp-sand/60 px-2 py-0.5 rounded-full">
            {payments.length}
          </span>
        </div>
        <ChevronDown
          className={clsx(
            "w-5 h-5 text-mp-text-light transition-transform duration-200",
            open && "rotate-180"
          )}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div className="border-t border-mp-sand-dark/10">
          <div className="max-h-80 overflow-y-auto">
            {payments.map((payment) => {
              const dateStr = new Date(payment.createdAt).toLocaleDateString(
                "fr-FR",
                { day: "2-digit", month: "2-digit", year: "numeric" }
              );

              const statusIcon =
                payment.status === "COMPLETED" ? (
                  <CheckCircle
                    className="w-4 h-4 text-mp-sage flex-shrink-0"
                    aria-label="Compl\u00e9t\u00e9"
                  />
                ) : payment.status === "PENDING" ? (
                  <Clock
                    className="w-4 h-4 text-mp-gold flex-shrink-0"
                    aria-label="En attente"
                  />
                ) : (
                  <XCircle
                    className="w-4 h-4 text-mp-rose flex-shrink-0"
                    aria-label="\u00c9chou\u00e9"
                  />
                );

              return (
                <div
                  key={payment.id}
                  className="flex items-center justify-between px-5 py-3 border-b border-mp-sand-dark/5 last:border-0"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xs text-mp-text-light w-20 flex-shrink-0">
                      {dateStr}
                    </span>
                    <span className="font-heading text-sm text-mp-charcoal truncate">
                      {paymentTypeLabel(payment.type)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                    <span className="font-heading text-sm font-semibold text-mp-charcoal">
                      {formatEur(payment.amount)}
                    </span>
                    {statusIcon}
                    {payment.status === "COMPLETED" && (
                      <a
                        href={`/api/account/invoice?paymentId=${payment.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 rounded-md text-mp-text-light/50 hover:text-mp-ocean hover:bg-mp-ocean/10 transition-colors"
                        title="T&eacute;l&eacute;charger la facture"
                        aria-label="T&eacute;l&eacute;charger la facture"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="px-5 py-3 border-t border-mp-sand-dark/10 bg-mp-sand/20 flex justify-center">
            <BillingPortalButton />
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================================================
   UNPAID BALANCE SECTION
   ============================================================ */

function UnpaidBalanceSection({
  unpaidCount,
  unpaidAmount,
  cardRemaining,
  onSettled,
}: {
  unpaidCount: number;
  unpaidAmount: number;
  cardRemaining: number;
  onSettled: () => void;
}) {
  const [busy, setBusy] = useState<"card" | "online" | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const canUseCard = cardRemaining > 0;
  const cardWillCover = Math.min(cardRemaining, unpaidCount);

  async function payWithCard() {
    setBusy("card");
    setErrorMsg("");
    try {
      const res = await fetch("/api/account/settle-unpaid", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ method: "card" }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Erreur");
        return;
      }
      onSettled();
    } catch {
      setErrorMsg("Erreur r\u00e9seau");
    } finally {
      setBusy(null);
    }
  }

  async function payOnline() {
    setBusy("online");
    setErrorMsg("");
    try {
      const res = await fetch("/api/account/settle-unpaid", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ method: "online" }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Erreur");
        return;
      }
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      setErrorMsg("Erreur r\u00e9seau");
    } finally {
      setBusy(null);
    }
  }

  return (
    <section className="py-6 bg-amber-50 border-y border-amber-200">
      <div className="mp-container max-w-3xl">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
            <Banknote className="w-5 h-5 text-amber-600" aria-hidden="true" />
          </div>
          <div className="flex-1">
            <p className="font-heading text-sm font-semibold text-amber-800">
              {unpaidCount} s&eacute;ance{unpaidCount > 1 ? "s" : ""} en attente de paiement
            </p>
            <p className="font-body text-xs text-amber-700">
              Montant d&ucirc; :{" "}
              <span className="font-semibold">
                {(unpaidAmount / 100).toLocaleString("fr-FR", {
                  style: "currency",
                  currency: "EUR",
                })}
              </span>
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          <button
            onClick={payWithCard}
            disabled={!canUseCard || busy !== null}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-white border border-amber-300 text-amber-900 font-medium text-sm hover:bg-amber-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {busy === "card" ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Ticket className="w-4 h-4" />
            )}
            {canUseCard ? (
              <span>
                R&eacute;gler avec ma carte
                <span className="text-amber-600 ml-1">
                  ({cardWillCover}/{unpaidCount})
                </span>
              </span>
            ) : (
              <span>Aucune carte disponible</span>
            )}
          </button>

          <button
            onClick={payOnline}
            disabled={busy !== null}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-amber-600 text-white font-medium text-sm hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {busy === "online" ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <CreditCard className="w-4 h-4" />
            )}
            Payer{" "}
            {(unpaidAmount / 100).toLocaleString("fr-FR", {
              style: "currency",
              currency: "EUR",
            })}{" "}
            en ligne
          </button>
        </div>

        {errorMsg && (
          <p className="mt-3 text-xs text-red-600 font-body">{errorMsg}</p>
        )}
      </div>
    </section>
  );
}

/* ============================================================
   PAGE COMPONENT
   ============================================================ */

export default function ComptePage() {
  const { data: sessionData, status } = useSession();
  const router = useRouter();
  const [accountData, setAccountData] = useState<AccountData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [payments, setPayments] = useState<PaymentData[]>([]);
  const [subActionLoading, setSubActionLoading] = useState(false);

  const fetchAccount = useCallback(async () => {
    try {
      const res = await fetch("/api/account");
      if (res.status === 401) {
        router.push("/connexion");
        return;
      }
      if (!res.ok) throw new Error("Erreur serveur");
      const data = await res.json();
      setAccountData(data);
    } catch {
      setError("Impossible de charger vos donn\u00e9es. Rechargez la page.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  const fetchSubscription = useCallback(async () => {
    try {
      const res = await fetch("/api/account/subscription");
      if (res.ok) {
        const data = await res.json();
        setSubscription(data.subscription ?? null);
      }
    } catch {
      // Silently fail
    }
  }, []);

  const fetchPayments = useCallback(async () => {
    try {
      const res = await fetch("/api/account/payments");
      if (res.ok) {
        const data = await res.json();
        setPayments(data.payments ?? []);
      }
    } catch {
      // Silently fail
    }
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/connexion");
      return;
    }
    if (status === "authenticated") {
      fetchAccount();
      fetchSubscription();
      fetchPayments();
    }
  }, [status, router, fetchAccount, fetchSubscription, fetchPayments]);

  async function handleSubscriptionAction(action: "cancel" | "resume") {
    const msg =
      action === "cancel"
        ? "Voulez-vous vraiment annuler votre abonnement ? Il restera actif jusqu\u2019\u00e0 la fin de la p\u00e9riode en cours."
        : "Voulez-vous reprendre votre abonnement ?";
    if (!confirm(msg)) return;
    setSubActionLoading(true);
    try {
      const res = await fetch("/api/account/subscription", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      if (res.ok) {
        await fetchSubscription();
      } else {
        const data = await res.json();
        alert(data.error || "Erreur lors de la mise \u00e0 jour.");
      }
    } catch {
      alert("Erreur de connexion.");
    } finally {
      setSubActionLoading(false);
    }
  }

  async function handleCancel(bookingId: string, reason?: string) {
    try {
      const res = await fetch(`/api/account/bookings?id=${bookingId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: reason || undefined }),
      });
      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Erreur lors de l\u2019annulation.");
        return;
      }
      fetchAccount();
    } catch {
      alert("Erreur de connexion.");
    }
  }

  async function handleSaveProfile(data: {
    name: string
    phone: string
    birthday: string
    addressLine: string
    postalCode: string
    city: string
    country: string
  }) {
    try {
      const res = await fetch("/api/account", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const errData = await res.json();
        alert(errData.error || "Erreur lors de la mise \u00e0 jour.");
        return;
      }
      fetchAccount();
    } catch {
      alert("Erreur de connexion.");
    }
  }

  if (status === "loading" || loading) {
    return (
      <div
        className="min-h-[70vh] bg-mp-cream"
        role="status"
        aria-label="Chargement du compte"
      >
        {/* Skeleton 1 — header utilisateur (avatar + nom + membre depuis) */}
        <section className="pt-32 pb-10">
          <div className="mp-container">
            <div className="flex items-center gap-4 mb-8">
              <Skeleton className="w-14 h-14 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-7 w-56 rounded-md" />
                <Skeleton className="h-4 w-40 rounded-md" />
              </div>
            </div>
            {/* Skeleton 2 — liste réservations (next class + stats) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <Skeleton className="lg:col-span-2 h-40 rounded-2xl" />
              <Skeleton className="h-40 rounded-2xl" />
            </div>
          </div>
        </section>
        {/* Skeleton 3 — fidélité / parcours */}
        <section className="py-8 bg-mp-white">
          <div className="mp-container max-w-3xl space-y-4">
            <Skeleton className="h-6 w-48 rounded-md" />
            <Skeleton className="h-32 w-full rounded-2xl" />
          </div>
        </section>
        <span className="sr-only">
          Chargement de votre espace personnel…
        </span>
      </div>
    );
  }

  if (error || !accountData) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-mp-cream">
        <div className="text-center">
          <p className="font-body text-mp-text-light mb-4">
            {error || "Impossible de charger le compte."}
          </p>
          <button
            onClick={() => fetchAccount()}
            className="mp-btn mp-btn-primary text-sm"
          >
            R&eacute;essayer
          </button>
        </div>
      </div>
    );
  }

  const { user, upcomingBookings, pastBookings, activeCard, balance } = accountData;

  return (
    <>
      {/* ═══════════════════════════════════════════════════
          SECTION A — Hero / Welcome
          Greeting + next class + monthly stats
          ═══════════════════════════════════════════════════ */}
      <WelcomeSection
        user={user}
        upcomingBookings={upcomingBookings}
        pastBookings={pastBookings}
        onCancel={handleCancel}
      />

      {/* ═══════════════════════════════════════════════════
          SECTION B — Alert : Unpaid balance (conditional)
          Financial red flags appear early where they can be acted on
          ═══════════════════════════════════════════════════ */}
      {balance.unpaidCount > 0 && (
        <UnpaidBalanceSection
          unpaidCount={balance.unpaidCount}
          unpaidAmount={balance.unpaidAmount}
          cardRemaining={activeCard?.remaining ?? 0}
          onSettled={() => fetchAccount()}
        />
      )}

      {/* ═══════════════════════════════════════════════════
          SECTION C — Account Essentials
          Card status (primary context) → Subscription → Profile
          ═══════════════════════════════════════════════════ */}
      <CardStatusSection card={activeCard} />

      <section className="mp-section bg-mp-white pb-0">
        <div className="mp-container max-w-3xl space-y-6">
          {subscription ? (
            <SubscriptionSection
              subscription={subscription}
              onAction={handleSubscriptionAction}
              actionLoading={subActionLoading}
            />
          ) : (
            <div className="text-center py-8 px-4 rounded-xl border-2 border-dashed border-mp-sand">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-mp-ocean/10 text-mp-ocean mb-3">
                <Repeat className="w-6 h-6" aria-hidden="true" />
              </div>
              <h3 className="font-heading text-base font-semibold text-mp-charcoal mb-1">
                Aucun abonnement actif
              </h3>
              <p className="text-sm text-mp-text-light mb-4">
                Pratiquez sans compter gr&acirc;ce &agrave; un abonnement mensuel.
              </p>
              <Link
                href="/tarifs"
                className="mp-btn mp-btn-secondary inline-flex items-center gap-2 text-sm"
              >
                D&eacute;couvrir les abonnements
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
          )}
          <ProfileSection user={user} onSave={handleSaveProfile} />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          SECTION D — Bookings Center
          Upcoming → Recurring → Past — contiguous timeline
          ═══════════════════════════════════════════════════ */}
      <section className="mp-section bg-mp-cream/30">
        <div className="mp-container max-w-3xl">
          <div className="mb-6">
            <h2 className="font-heading text-2xl font-bold text-mp-charcoal">Mes s&eacute;ances</h2>
            <p className="font-body text-sm text-mp-charcoal/60 mt-1">
              Prochains cours, cr&eacute;neaux r&eacute;currents et historique
            </p>
          </div>
          <div className="space-y-6">
            <UpcomingBookingsSection bookings={upcomingBookings} onCancel={handleCancel} />
            <RecurringSection />
            <PastClassesSection bookings={pastBookings} memberSince={user.memberSince} />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          SECTION E — Loyalty & Progress
          Gamification grouped together
          ═══════════════════════════════════════════════════ */}
      <section className="py-8 bg-mp-white">
        <div className="mp-container max-w-3xl">
          <div className="mb-6">
            <h2 className="font-heading text-2xl font-bold text-mp-charcoal">Mon parcours</h2>
            <p className="font-body text-sm text-mp-charcoal/60 mt-1">
              Votre progression et votre fid&eacute;lit&eacute;
            </p>
          </div>
          <div className="space-y-4">
            <LoyaltySection />
            <ProgressJourney />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          SECTION F — Rewards & Engagement
          Referral + Gift cards — secondary features
          ═══════════════════════════════════════════════════ */}
      <section className="mp-section bg-mp-cream/30">
        <div className="mp-container max-w-3xl">
          <div className="mb-6">
            <h2 className="font-heading text-2xl font-bold text-mp-charcoal">Avantages</h2>
            <p className="font-body text-sm text-mp-charcoal/60 mt-1">
              Parrainage et cartes cadeaux
            </p>
          </div>
          <div className="space-y-6">
            <ReferralSection />
            <GiftCardRedeemSection />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          SECTION G — Payment History (collapsed at bottom)
          ═══════════════════════════════════════════════════ */}
      <section className="py-8 bg-mp-white">
        <div className="mp-container max-w-3xl">
          <PaymentHistorySection payments={payments} />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          SECTION H — RGPD data export
          ═══════════════════════════════════════════════════ */}
      <section className="py-8 bg-mp-cream/30">
        <div className="mp-container max-w-3xl">
          <div className="mp-card !rounded-2xl p-6 hover:!transform-none">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-mp-ocean/10 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-5 h-5 text-mp-ocean" aria-hidden="true" />
              </div>
              <div className="flex-1">
                <h3 className="font-heading text-base font-semibold text-mp-charcoal mb-2">
                  Vos donn&eacute;es (RGPD)
                </h3>
                <p className="text-sm text-mp-text-light mb-4">
                  T&eacute;l&eacute;chargez l&rsquo;ensemble de vos donn&eacute;es personnelles au format JSON (art. 15 RGPD).
                </p>
                <a
                  href="/api/account/export"
                  download
                  className="mp-btn mp-btn-secondary inline-flex items-center gap-2 text-sm"
                >
                  <Download className="w-4 h-4" aria-hidden="true" />
                  T&eacute;l&eacute;charger mes donn&eacute;es
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
