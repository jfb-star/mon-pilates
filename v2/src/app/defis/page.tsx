"use client";

import { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import { Flame, Trophy, Target, Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";

interface GridCell {
  date: string;
  count: number;
  dayOfWeek: number;
}

interface ChallengeData {
  id: string;
  title: string;
  description: string;
  icon: string;
  type: "weekly" | "monthly" | "lifetime";
  target: number;
  rewardPoints: number;
  current: number;
  completed: boolean;
}

interface ChallengesResponse {
  currentStreak: number;
  longestStreak: number;
  totalClasses: number;
  grid: GridCell[];
  challenges: ChallengeData[];
  weekResets: string;
  monthResets: string;
}

const DAYS_FR = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
const MONTHS_FR = ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc"];

function getColor(count: number) {
  if (count === 0) return "bg-gray-100 dark:bg-gray-800";
  if (count === 1) return "bg-[#8FAE8F]/40";
  if (count === 2) return "bg-[#0077B6]/50";
  return "bg-[#0077B6]";
}

function formatDateFr(dateStr: string) {
  const d = new Date(dateStr);
  const day = DAYS_FR[d.getDay() === 0 ? 6 : d.getDay() - 1];
  return `${day} ${d.getDate()} ${MONTHS_FR[d.getMonth()]} — `;
}

function Countdown({ target }: { target: string }) {
  const [remaining, setRemaining] = useState("");

  useEffect(() => {
    const update = () => {
      const diff = new Date(target).getTime() - Date.now();
      if (diff <= 0) {
        setRemaining("Terminé");
        return;
      }
      const days = Math.floor(diff / 86400000);
      const hours = Math.floor((diff % 86400000) / 3600000);
      const mins = Math.floor((diff % 3600000) / 60000);
      setRemaining(days > 0 ? `${days}j ${hours}h` : `${hours}h ${mins}min`);
    };
    update();
    const id = setInterval(update, 60000);
    return () => clearInterval(id);
  }, [target]);

  return <span className="text-sm text-mp-text/50">{remaining}</span>;
}

export default function DefisPage() {
  const { data: session } = useSession();
  const [data, setData] = useState<ChallengesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; text: string } | null>(null);

  useEffect(() => {
    if (!session?.user) return;
    fetch("/api/challenges")
      .then((r) => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, [session]);

  // Month labels for grid
  const monthLabels = useMemo(() => {
    if (!data?.grid.length) return [];
    const labels: { label: string; col: number }[] = [];
    let lastMonth = -1;
    for (let w = 0; w < 52; w++) {
      const cell = data.grid[w * 7];
      if (!cell) continue;
      const month = new Date(cell.date).getMonth();
      if (month !== lastMonth) {
        labels.push({ label: MONTHS_FR[month] ?? "", col: w });
        lastMonth = month;
      }
    }
    return labels;
  }, [data]);

  if (!session?.user) {
    return (
      <div className="pt-32 pb-20 mp-container text-center">
        <Trophy className="w-16 h-16 mx-auto text-mp-ocean/30 mb-6" />
        <h1 className="font-heading text-3xl font-bold text-mp-text mb-4">Défis & Streaks</h1>
        <p className="text-mp-text/60 mb-8">Connectez-vous pour suivre vos défis et votre progression.</p>
        <Link href="/connexion" className="mp-btn-primary">
          Se connecter
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="pt-32 pb-20 mp-container" role="status" aria-label="Chargement">
        <div className="animate-pulse space-y-8">
          <div className="h-10 w-64 bg-gray-200 rounded-lg mx-auto" />
          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-2xl" />
            ))}
          </div>
          <div className="h-40 bg-gray-200 rounded-2xl" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const weekly = data.challenges.filter((c) => c.type === "weekly");
  const monthly = data.challenges.filter((c) => c.type === "monthly");
  const lifetime = data.challenges.filter((c) => c.type === "lifetime");

  return (
    <div className="pt-28 pb-20 bg-gradient-to-b from-mp-cream to-mp-white min-h-screen">
      <div className="mp-container">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-mp-ocean/10 text-mp-ocean text-sm font-medium mb-4">
            <Flame className="w-4 h-4" />
            Vos défis
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-mp-text mb-3">
            Défis & Streaks
          </h1>
          <p className="text-mp-text/60 max-w-md mx-auto">
            Relevez des défis, maintenez votre streak et gagnez des points de fidélité.
          </p>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto mb-12">
          <div className="bg-white rounded-2xl p-5 text-center shadow-sm border border-gray-100 card-lift">
            <div className="text-3xl font-bold text-mp-ocean">{data.currentStreak}</div>
            <div className="text-xs text-mp-text/50 mt-1 flex items-center justify-center gap-1">
              <Flame className="w-3 h-3 text-orange-500" /> Streak actuel
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 text-center shadow-sm border border-gray-100 card-lift">
            <div className="text-3xl font-bold text-[#8FAE8F]">{data.longestStreak}</div>
            <div className="text-xs text-mp-text/50 mt-1 flex items-center justify-center gap-1">
              <Trophy className="w-3 h-3 text-amber-500" /> Record
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 text-center shadow-sm border border-gray-100 card-lift">
            <div className="text-3xl font-bold text-mp-text">{data.totalClasses}</div>
            <div className="text-xs text-mp-text/50 mt-1 flex items-center justify-center gap-1">
              <Target className="w-3 h-3" /> Total cours
            </div>
          </div>
        </div>

        {/* Activity Grid (GitHub-style) */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-12 overflow-x-auto">
          <h2 className="font-heading text-lg font-semibold text-mp-text mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-mp-ocean" />
            Activité (52 semaines)
          </h2>

          {/* Month labels */}
          <div className="relative ml-10 mb-1">
            <div className="flex" style={{ gap: 0 }}>
              {monthLabels.map((m, i) => (
                <div
                  key={i}
                  className="text-[10px] text-mp-text/40 absolute"
                  style={{ left: m.col * 14 }}
                >
                  {m.label}
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-0.5 mt-5 relative">
            {/* Day labels */}
            <div className="flex flex-col gap-0.5 mr-1.5 shrink-0">
              {DAYS_FR.map((d, i) => (
                <div
                  key={i}
                  className="text-[10px] text-mp-text/40 h-[12px] flex items-center"
                >
                  {i % 2 === 0 ? d : ""}
                </div>
              ))}
            </div>

            {/* Grid */}
            {Array.from({ length: 52 }, (_, w) => (
              <div key={w} className="flex flex-col gap-0.5">
                {Array.from({ length: 7 }, (_, d) => {
                  const cell = data.grid[w * 7 + d];
                  if (!cell) return <div key={d} className="w-[12px] h-[12px]" />;
                  return (
                    <div
                      key={d}
                      className={`w-[12px] h-[12px] rounded-[2px] cursor-pointer transition-transform hover:scale-150 ${getColor(cell.count)}`}
                      onMouseEnter={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        setTooltip({
                          x: rect.left + rect.width / 2,
                          y: rect.top - 8,
                          text: `${formatDateFr(cell.date)}${cell.count} cours`,
                        });
                      }}
                      onMouseLeave={() => setTooltip(null)}
                    />
                  );
                })}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-2 mt-4 text-[10px] text-mp-text/40">
            <span>Moins</span>
            <div className="w-[12px] h-[12px] rounded-[2px] bg-gray-100" />
            <div className="w-[12px] h-[12px] rounded-[2px] bg-[#8FAE8F]/40" />
            <div className="w-[12px] h-[12px] rounded-[2px] bg-[#0077B6]/50" />
            <div className="w-[12px] h-[12px] rounded-[2px] bg-[#0077B6]" />
            <span>Plus</span>
          </div>

          {/* Tooltip */}
          {tooltip && (
            <div
              className="fixed z-50 bg-[#2D2D2D] text-white text-xs px-3 py-1.5 rounded-lg shadow-lg pointer-events-none -translate-x-1/2 -translate-y-full"
              style={{ left: tooltip.x, top: tooltip.y }}
            >
              {tooltip.text}
            </div>
          )}
        </div>

        {/* Weekly Challenges */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-xl font-semibold text-mp-text flex items-center gap-2">
              <span className="text-2xl">🎯</span> Défis de la semaine
            </h2>
            <div className="flex items-center gap-2 text-sm text-mp-text/50">
              <span>Renouvellement dans</span>
              <Countdown target={data.weekResets} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {weekly.map((c) => (
              <ChallengeCard key={c.id} challenge={c} />
            ))}
          </div>
        </section>

        {/* Monthly Challenges */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-xl font-semibold text-mp-text flex items-center gap-2">
              <span className="text-2xl">📅</span> Défis du mois
            </h2>
            <div className="flex items-center gap-2 text-sm text-mp-text/50">
              <span>Renouvellement dans</span>
              <Countdown target={data.monthResets} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {monthly.map((c) => (
              <ChallengeCard key={c.id} challenge={c} />
            ))}
          </div>
        </section>

        {/* Lifetime / Hall of Fame */}
        <section className="mb-10">
          <h2 className="font-heading text-xl font-semibold text-mp-text flex items-center gap-2 mb-4">
            <span className="text-2xl">🏆</span> Hall of Fame
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {lifetime.map((c) => (
              <ChallengeCard key={c.id} challenge={c} />
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link
            href="/planning"
            className="mp-btn-primary inline-flex items-center gap-2"
          >
            Réserver un cours <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

function ChallengeCard({ challenge }: { challenge: ChallengeData }) {
  const pct = challenge.target > 0 ? (challenge.current / challenge.target) * 100 : 0;

  return (
    <div
      className={`bg-white rounded-2xl p-5 shadow-sm border transition-all ${
        challenge.completed
          ? "border-[#8FAE8F] bg-[#8FAE8F]/5"
          : "border-gray-100 hover:border-mp-ocean/20"
      }`}
    >
      <div className="flex items-start gap-4">
        <div className="text-3xl shrink-0">{challenge.icon}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-heading font-semibold text-mp-text">{challenge.title}</h3>
            {challenge.completed && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#8FAE8F]/20 text-[#5a7d5a] font-medium">
                Complété
              </span>
            )}
          </div>
          <p className="text-sm text-mp-text/60 mt-0.5">{challenge.description}</p>

          {/* Progress bar */}
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs text-mp-text/50 mb-1">
              <span>
                {challenge.current}/{challenge.target}
              </span>
              <span>+{challenge.rewardPoints} pts</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700 ease-out"
                style={{
                  width: `${Math.min(pct, 100)}%`,
                  background: challenge.completed
                    ? "linear-gradient(90deg, #8FAE8F, #6d9e6d)"
                    : "linear-gradient(90deg, #0077B6, #00a8e8)",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
