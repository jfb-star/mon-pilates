"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Sparkles, Calendar, Clock, User, ArrowRight } from "lucide-react";
import Link from "next/link";

interface Recommendation {
  id: string;
  courseName: string;
  courseSlug: string;
  courseColor: string | null;
  description: string | null;
  instructor: string;
  date: string;
  startTime: string;
  endTime: string;
  spotsLeft: number;
  tags: string[];
  score: number;
}

const TAG_COLORS: Record<string, string> = {
  "Votre créneau": "bg-[#0077B6]/10 text-[#0077B6]",
  "Votre horaire": "bg-[#0077B6]/10 text-[#0077B6]",
  "Votre favori": "bg-amber-50 text-amber-700",
  "Nouveau pour vous": "bg-[#8FAE8F]/15 text-[#5a7d5a]",
  "Places dispo": "bg-emerald-50 text-emerald-700",
  "Dernières places": "bg-red-50 text-red-600",
};

const DAYS_FR = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

function formatDateShort(dateStr: string) {
  const d = new Date(dateStr);
  return `${DAYS_FR[d.getDay()]} ${d.getDate()}/${(d.getMonth() + 1).toString().padStart(2, "0")}`;
}

function formatTime(t: string) {
  const [h, m] = t.split(":");
  return m === "00" ? `${h}h` : `${h}h${m}`;
}

export function SmartRecommendations() {
  const { data: session } = useSession();
  const [recs, setRecs] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasHistory, setHasHistory] = useState(true);

  useEffect(() => {
    if (!session?.user) {
      setLoading(false);
      return;
    }
    fetch("/api/recommendations")
      .then((r) => r.json())
      .then((data) => {
        setRecs(data.recommendations ?? []);
        setHasHistory(data.hasHistory ?? false);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [session]);

  if (!session?.user) {
    return (
      <div className="bg-gradient-to-r from-mp-ocean/5 to-[#8FAE8F]/5 rounded-2xl p-6 mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Sparkles className="w-5 h-5 text-mp-ocean" />
          <h3 className="font-heading font-semibold text-mp-text">Recommandations personnalisées</h3>
        </div>
        <p className="text-sm text-mp-text/60 mb-4">
          Connectez-vous pour recevoir des suggestions de cours adaptées à vos habitudes.
        </p>
        <Link href="/connexion" className="text-sm font-medium text-mp-ocean hover:underline inline-flex items-center gap-1">
          Se connecter <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-5 h-5 rounded bg-gray-200 animate-shimmer" />
          <div className="w-48 h-5 rounded bg-gray-200 animate-shimmer" />
        </div>
        <div className="flex gap-4 overflow-hidden">
          {[0, 1, 2].map((i) => (
            <div key={i} className="w-72 shrink-0 h-36 rounded-2xl bg-gray-200 animate-shimmer" />
          ))}
        </div>
      </div>
    );
  }

  if (!hasHistory || recs.length === 0) {
    return (
      <div className="bg-gradient-to-r from-mp-ocean/5 to-[#8FAE8F]/5 rounded-2xl p-6 mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Sparkles className="w-5 h-5 text-mp-ocean" />
          <h3 className="font-heading font-semibold text-mp-text">Commencez votre parcours</h3>
        </div>
        <p className="text-sm text-mp-text/60">
          Réservez vos premiers cours et nous vous proposerons des recommandations personnalisées.
        </p>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-4">
        <Sparkles className="w-5 h-5 text-mp-ocean" />
        <h3 className="font-heading font-semibold text-mp-text">Recommandé pour vous</h3>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {recs.map((rec) => (
          <div
            key={rec.id}
            className="w-72 shrink-0 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-5 card-lift"
          >
            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {rec.tags.map((tag) => (
                <span
                  key={tag}
                  className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${TAG_COLORS[tag] ?? "bg-gray-100 text-gray-600"}`}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Course info */}
            <h4 className="font-heading font-semibold text-mp-text mb-1">{rec.courseName}</h4>
            {rec.description && (
              <p className="text-xs text-mp-text/50 mb-3 line-clamp-1">{rec.description}</p>
            )}

            {/* Details */}
            <div className="space-y-1.5 text-xs text-mp-text/60">
              <div className="flex items-center gap-2">
                <Calendar className="w-3 h-3" />
                {formatDateShort(rec.date)}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3 h-3" />
                {formatTime(rec.startTime)} - {formatTime(rec.endTime)}
              </div>
              <div className="flex items-center gap-2">
                <User className="w-3 h-3" />
                {rec.instructor}
              </div>
            </div>

            {/* Spots + CTA */}
            <div className="flex items-center justify-between mt-4">
              <span
                className={`text-xs font-medium ${
                  rec.spotsLeft <= 2 ? "text-red-500" : "text-[#8FAE8F]"
                }`}
              >
                {rec.spotsLeft} place{rec.spotsLeft > 1 ? "s" : ""}
              </span>
              <Link
                href={`/planning?filter=${rec.courseSlug}`}
                className="text-xs font-medium text-mp-ocean hover:text-mp-ocean-dark inline-flex items-center gap-1 btn-press"
              >
                Réserver <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
