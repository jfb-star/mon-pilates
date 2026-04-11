"use client";

import { useState, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  User,
  Users,
  X,
  Filter,
  CalendarDays,
} from "lucide-react";
import { clsx } from "clsx";
import {
  startOfWeek,
  addWeeks,
  addDays,
  format,
  isToday,
  isSameWeek,
} from "date-fns";
import { fr } from "date-fns/locale";
import {
  weeklySessions,
  courseTypeColors,
  courseTypeLabels,
  dayNames,
  dayNamesShort,
  type Session,
  type CourseType,
  type Level,
} from "@/lib/mock-data";

/* ============================================================
   PLANNING PAGE
   ============================================================ */

const courseTypes: CourseType[] = ["mat", "reformer", "prenatal", "senior", "doux"];
const instructorNames = ["Marie Lefèvre", "Sophie Martin"];
const levels: Level[] = ["Tous niveaux", "Débutant", "Intermédiaire", "Avancé"];

export default function PlanningPage() {
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedTypes, setSelectedTypes] = useState<CourseType[]>([]);
  const [selectedInstructor, setSelectedInstructor] = useState<string>("");
  const [selectedLevel, setSelectedLevel] = useState<string>("");
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const weekStart = startOfWeek(addWeeks(new Date(), weekOffset), {
    weekStartsOn: 1,
  });

  const isCurrentWeek = isSameWeek(weekStart, new Date(), { weekStartsOn: 1 });

  const filteredSessions = useMemo(() => {
    return weeklySessions.filter((s) => {
      if (selectedTypes.length > 0 && !selectedTypes.includes(s.courseType))
        return false;
      if (selectedInstructor && s.instructor !== selectedInstructor)
        return false;
      if (selectedLevel && s.level !== selectedLevel) return false;
      return true;
    });
  }, [selectedTypes, selectedInstructor, selectedLevel]);

  function getSessionsForDay(dayOffset: number) {
    return filteredSessions
      .filter((s) => s.dayOffset === dayOffset)
      .sort((a, b) => a.time.localeCompare(b.time));
  }

  function toggleType(type: CourseType) {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  }

  function clearFilters() {
    setSelectedTypes([]);
    setSelectedInstructor("");
    setSelectedLevel("");
  }

  const hasFilters =
    selectedTypes.length > 0 || selectedInstructor !== "" || selectedLevel !== "";

  return (
    <div className="pt-20 min-h-screen bg-mp-cream">
      {/* Hero */}
      <section className="bg-gradient-to-br from-mp-sand via-mp-cream to-mp-ocean-light/20 py-12 sm:py-16">
        <div className="mp-container">
          <div className="flex items-center gap-3 mb-2">
            <CalendarDays className="w-8 h-8 text-mp-ocean" />
            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-mp-charcoal">
              Planning des cours
            </h1>
          </div>
          <p className="font-body text-mp-text-light text-lg max-w-xl mt-3">
            Consultez les disponibilités et réservez votre place en un clic.
          </p>
        </div>
      </section>

      <div className="mp-container py-8">
        {/* Week navigation */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setWeekOffset((w) => w - 1)}
              className="p-2 rounded-full hover:bg-mp-sand transition-colors"
              aria-label="Semaine précédente"
            >
              <ChevronLeft className="w-5 h-5 text-mp-charcoal" />
            </button>
            <h2 className="font-heading text-lg sm:text-xl font-semibold text-mp-charcoal min-w-[220px] text-center">
              {format(weekStart, "d MMM", { locale: fr })} —{" "}
              {format(addDays(weekStart, 6), "d MMM yyyy", { locale: fr })}
            </h2>
            <button
              onClick={() => setWeekOffset((w) => w + 1)}
              className="p-2 rounded-full hover:bg-mp-sand transition-colors"
              aria-label="Semaine suivante"
            >
              <ChevronRight className="w-5 h-5 text-mp-charcoal" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            {!isCurrentWeek && (
              <button
                onClick={() => setWeekOffset(0)}
                className="mp-btn mp-btn-secondary text-sm py-2 px-4"
              >
                Aujourd&apos;hui
              </button>
            )}
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className={clsx(
                "mp-btn text-sm py-2 px-4 flex items-center gap-2",
                hasFilters ? "mp-btn-primary" : "mp-btn-secondary"
              )}
              aria-expanded={filtersOpen}
            >
              <Filter className="w-4 h-4" />
              Filtres
              {hasFilters && (
                <span className="bg-white text-mp-ocean rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                  {selectedTypes.length +
                    (selectedInstructor ? 1 : 0) +
                    (selectedLevel ? 1 : 0)}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Filter bar */}
        <div
          className={clsx(
            "overflow-hidden transition-all duration-300",
            filtersOpen ? "max-h-[400px] opacity-100 mb-6" : "max-h-0 opacity-0"
          )}
        >
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-mp-sand-dark/30">
            {/* Course types */}
            <div className="mb-4">
              <p className="font-heading text-sm font-semibold text-mp-charcoal mb-2">
                Type de cours
              </p>
              <div className="flex flex-wrap gap-2">
                {courseTypes.map((type) => {
                  const colors = courseTypeColors[type];
                  const active = selectedTypes.includes(type);
                  return (
                    <button
                      key={type}
                      onClick={() => toggleType(type)}
                      className={clsx(
                        "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-heading font-medium transition-all border",
                        active
                          ? `${colors.bg} ${colors.text} ${colors.border}`
                          : "bg-mp-sand/50 text-mp-text-light border-transparent hover:bg-mp-sand"
                      )}
                    >
                      <span
                        className={clsx("w-2.5 h-2.5 rounded-full", colors.dot)}
                      />
                      {courseTypeLabels[type]}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Instructor + Level */}
            <div className="flex flex-wrap gap-4">
              <div>
                <label
                  htmlFor="instructor-filter"
                  className="font-heading text-sm font-semibold text-mp-charcoal mb-1 block"
                >
                  Instructrice
                </label>
                <select
                  id="instructor-filter"
                  value={selectedInstructor}
                  onChange={(e) => setSelectedInstructor(e.target.value)}
                  className="bg-mp-sand/50 border border-mp-sand-dark/30 rounded-lg px-3 py-2 text-sm font-body text-mp-text focus:outline-none focus:ring-2 focus:ring-mp-ocean/50"
                >
                  <option value="">Toutes</option>
                  {instructorNames.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="level-filter"
                  className="font-heading text-sm font-semibold text-mp-charcoal mb-1 block"
                >
                  Niveau
                </label>
                <select
                  id="level-filter"
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="bg-mp-sand/50 border border-mp-sand-dark/30 rounded-lg px-3 py-2 text-sm font-body text-mp-text focus:outline-none focus:ring-2 focus:ring-mp-ocean/50"
                >
                  <option value="">Tous</option>
                  {levels.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </div>
              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="self-end text-sm text-mp-ocean hover:text-mp-ocean-dark font-heading font-medium underline underline-offset-2"
                >
                  Effacer les filtres
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ======== DESKTOP: Week grid ======== */}
        <div className="hidden md:grid grid-cols-6 gap-3">
          {[0, 1, 2, 3, 4, 5].map((dayOffset) => {
            const dayDate = addDays(weekStart, dayOffset);
            const sessions = getSessionsForDay(dayOffset);
            const today = isToday(dayDate);

            return (
              <div key={dayOffset} className="min-w-0">
                {/* Day header */}
                <div
                  className={clsx(
                    "text-center py-3 rounded-xl mb-2 font-heading",
                    today
                      ? "bg-mp-ocean text-white"
                      : "bg-white text-mp-charcoal"
                  )}
                >
                  <p className="text-sm font-semibold">
                    {dayNamesShort[dayOffset]}
                  </p>
                  <p
                    className={clsx(
                      "text-xl font-bold",
                      today ? "text-white" : "text-mp-charcoal"
                    )}
                  >
                    {format(dayDate, "d")}
                  </p>
                </div>

                {/* Sessions */}
                <div className="space-y-2">
                  {sessions.length === 0 && (
                    <p className="text-xs text-mp-text-light text-center py-4 italic">
                      Aucun cours
                    </p>
                  )}
                  {sessions.map((session) => (
                    <SessionCard
                      key={session.id}
                      session={session}
                      compact
                      onClick={() => setSelectedSession(session)}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* ======== MOBILE: List view ======== */}
        <div className="md:hidden space-y-6">
          {[0, 1, 2, 3, 4, 5].map((dayOffset) => {
            const dayDate = addDays(weekStart, dayOffset);
            const sessions = getSessionsForDay(dayOffset);
            const today = isToday(dayDate);

            return (
              <div key={dayOffset}>
                <div
                  className={clsx(
                    "flex items-center gap-3 mb-3 px-1",
                    today && "text-mp-ocean"
                  )}
                >
                  <div
                    className={clsx(
                      "w-12 h-12 rounded-xl flex flex-col items-center justify-center font-heading",
                      today
                        ? "bg-mp-ocean text-white"
                        : "bg-white text-mp-charcoal"
                    )}
                  >
                    <span className="text-xs font-semibold leading-none">
                      {dayNamesShort[dayOffset]}
                    </span>
                    <span className="text-lg font-bold leading-none mt-0.5">
                      {format(dayDate, "d")}
                    </span>
                  </div>
                  <h3
                    className={clsx(
                      "font-heading text-base font-semibold",
                      today ? "text-mp-ocean" : "text-mp-charcoal"
                    )}
                  >
                    {dayNames[dayOffset]}
                    {today && (
                      <span className="ml-2 text-xs font-normal bg-mp-ocean/10 text-mp-ocean px-2 py-0.5 rounded-full">
                        Aujourd&apos;hui
                      </span>
                    )}
                  </h3>
                </div>

                {sessions.length === 0 ? (
                  <p className="text-sm text-mp-text-light italic pl-1">
                    Aucun cours ce jour
                  </p>
                ) : (
                  <div className="space-y-2">
                    {sessions.map((session) => (
                      <SessionCard
                        key={session.id}
                        session={session}
                        compact={false}
                        onClick={() => setSelectedSession(session)}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Session detail modal */}
      {selectedSession && (
        <SessionModal
          session={selectedSession}
          onClose={() => setSelectedSession(null)}
        />
      )}
    </div>
  );
}

/* ============================================================
   SESSION CARD
   ============================================================ */
function SessionCard({
  session,
  compact,
  onClick,
}: {
  session: Session;
  compact: boolean;
  onClick: () => void;
}) {
  const colors = courseTypeColors[session.courseType];
  const full = session.spotsRemaining === 0;
  const low = session.spotsRemaining > 0 && session.spotsRemaining <= 2;

  return (
    <button
      onClick={onClick}
      className={clsx(
        "w-full text-left rounded-xl p-3 border transition-all hover:shadow-md focus:outline-none focus:ring-2 focus:ring-mp-ocean/50",
        full ? "bg-mp-sand/60 border-mp-sand-dark/30 opacity-70" : "bg-white border-mp-sand-dark/30 hover:border-mp-ocean/30",
        compact ? "text-xs" : "text-sm"
      )}
      aria-label={`${session.courseName} à ${session.time} avec ${session.instructor}`}
    >
      <div className="flex items-start gap-2">
        <span className={clsx("w-2.5 h-2.5 rounded-full mt-1 shrink-0", colors.dot)} />
        <div className="min-w-0 flex-1">
          <p className={clsx("font-heading font-semibold text-mp-charcoal truncate", compact ? "text-xs" : "text-sm")}>
            {session.courseName}
          </p>
          <div className={clsx("flex items-center gap-1 text-mp-text-light mt-0.5", compact ? "text-[10px]" : "text-xs")}>
            <Clock className="w-3 h-3 shrink-0" />
            <span>{session.time}</span>
            <span className="mx-0.5">·</span>
            <span>{session.duration}</span>
          </div>
          {!compact && (
            <div className="flex items-center gap-1 text-xs text-mp-text-light mt-0.5">
              <User className="w-3 h-3 shrink-0" />
              <span>{session.instructor}</span>
            </div>
          )}
          <div className="flex items-center justify-between mt-1.5">
            <span
              className={clsx(
                "text-[10px] font-heading font-medium px-1.5 py-0.5 rounded-full",
                compact ? "" : "text-xs",
                full
                  ? "bg-mp-sand text-mp-text-light"
                  : low
                  ? "bg-red-50 text-red-600"
                  : "bg-mp-sage-light/40 text-mp-sage"
              )}
            >
              {full
                ? "Complet"
                : `${session.spotsRemaining} place${session.spotsRemaining > 1 ? "s" : ""}`}
            </span>
            {!compact && (
              <span className="text-[10px] font-heading text-mp-text-light bg-mp-sand/50 px-1.5 py-0.5 rounded-full">
                {session.level}
              </span>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}

/* ============================================================
   SESSION DETAIL MODAL
   ============================================================ */
function SessionModal({
  session,
  onClose,
}: {
  session: Session;
  onClose: () => void;
}) {
  const colors = courseTypeColors[session.courseType];
  const full = session.spotsRemaining === 0;
  const low = session.spotsRemaining > 0 && session.spotsRemaining <= 2;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label={`Détails du cours ${session.courseName}`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative bg-white rounded-t-3xl sm:rounded-2xl w-full sm:max-w-md max-h-[85vh] overflow-auto shadow-2xl animate-in">
        {/* Color accent bar */}
        <div className={clsx("h-1.5 w-full", colors.dot)} />

        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className={clsx("w-3.5 h-3.5 rounded-full", colors.dot)} />
              <div>
                <h2 className="font-heading text-xl font-bold text-mp-charcoal">
                  {session.courseName}
                </h2>
                <p className="text-sm text-mp-text-light font-heading">
                  {courseTypeLabels[session.courseType]}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-mp-sand transition-colors"
              aria-label="Fermer"
            >
              <X className="w-5 h-5 text-mp-text-light" />
            </button>
          </div>

          {/* Details */}
          <div className="space-y-4 mb-6">
            <div className="flex items-center gap-3 text-mp-text">
              <Clock className="w-5 h-5 text-mp-ocean" />
              <div>
                <p className="font-heading font-semibold">
                  {session.time} — {session.duration}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-mp-text">
              <User className="w-5 h-5 text-mp-ocean" />
              <p className="font-heading font-semibold">{session.instructor}</p>
            </div>
            <div className="flex items-center gap-3 text-mp-text">
              <Users className="w-5 h-5 text-mp-ocean" />
              <p className="font-heading">
                <span
                  className={clsx(
                    "font-semibold",
                    full
                      ? "text-mp-text-light"
                      : low
                      ? "text-red-600"
                      : "text-mp-sage"
                  )}
                >
                  {full
                    ? "Complet"
                    : `${session.spotsRemaining} place${session.spotsRemaining > 1 ? "s" : ""} restante${session.spotsRemaining > 1 ? "s" : ""}`}
                </span>{" "}
                <span className="text-mp-text-light text-sm">
                  / {session.spotsTotal} au total
                </span>
              </p>
            </div>
          </div>

          {/* Level badge */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-heading font-medium bg-mp-sand px-3 py-1 rounded-full text-mp-charcoal">
              {session.level}
            </span>
          </div>

          {/* Description */}
          <p className="font-body text-mp-text leading-relaxed mb-6">
            {session.description}
          </p>

          {/* CTA */}
          {full ? (
            <button
              className="mp-btn w-full bg-mp-sand text-mp-text-light cursor-not-allowed"
              disabled
            >
              Cours complet
            </button>
          ) : (
            <button className="mp-btn mp-btn-primary w-full">
              Réserver cette séance
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
