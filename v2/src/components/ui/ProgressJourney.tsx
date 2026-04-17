"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { Star, Award, Flame, BookOpen, Calendar } from "lucide-react";

interface Milestone {
  date: string;
  label: string;
  type: "first" | "count" | "streak" | "review" | "course";
}

const MONTHS_FR = ["jan.", "fév.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];

function formatDate(d: string) {
  const date = new Date(d);
  return `${date.getDate()} ${MONTHS_FR[date.getMonth()]} ${date.getFullYear()}`;
}

const ICON_MAP = {
  first: Calendar,
  count: Award,
  streak: Flame,
  review: Star,
  course: BookOpen,
};

export function ProgressJourney() {
  const { data: session } = useSession();
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!session?.user) return;

    // Compute milestones from challenges/booking data
    fetch("/api/challenges")
      .then((r) => r.json())
      .then((data) => {
        const ms: Milestone[] = [];

        // Find first class date from grid
        const firstDay = data.grid?.find((g: { count: number; date: string }) => g.count > 0);
        if (firstDay) {
          ms.push({ date: firstDay.date, label: "Premier cours", type: "first" });
        }

        // Count milestones
        if (data.totalClasses >= 10) {
          ms.push({ date: "", label: "10 cours complétés", type: "count" });
        }
        if (data.totalClasses >= 25) {
          ms.push({ date: "", label: "25 cours complétés", type: "count" });
        }
        if (data.totalClasses >= 50) {
          ms.push({ date: "", label: "50 cours complétés", type: "count" });
        }

        // Streak
        if (data.longestStreak >= 4) {
          ms.push({ date: "", label: `Record de ${data.longestStreak} semaines`, type: "streak" });
        }

        // Course types tried
        const completed = data.challenges?.filter(
          (c: { id: string; completed: boolean }) => c.completed && c.id.startsWith("l")
        );
        if (completed?.length > 0) {
          for (const c of completed) {
            ms.push({ date: "", label: c.title, type: "course" });
          }
        }

        setMilestones(ms);
      })
      .catch(() => {});
  }, [session]);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  if (!session?.user || milestones.length === 0) return null;

  return (
    <div ref={ref} className="mt-12">
      <h2 className="font-heading text-xl font-bold text-mp-text mb-8 flex items-center gap-2">
        <Award className="w-5 h-5 text-mp-ocean" />
        Votre parcours Pilates
      </h2>

      <div className="relative ml-4 sm:ml-8">
        {/* Vertical line */}
        <div
          className="absolute left-0 top-0 w-[3px] rounded-full"
          style={{
            background: "linear-gradient(to bottom, #0077B6, #8FAE8F)",
            height: visible ? "100%" : "0%",
            transition: "height 1.5s ease-out",
          }}
        />

        {/* Milestones */}
        <div className="space-y-8">
          {milestones.map((m, i) => {
            const Icon = ICON_MAP[m.type];
            return (
              <div
                key={i}
                className="relative pl-10"
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateX(0)" : "translateX(-20px)",
                  transition: `opacity 500ms ease ${200 + i * 150}ms, transform 500ms ease ${200 + i * 150}ms`,
                }}
              >
                {/* Node */}
                <div className="absolute left-[-6px] top-1 w-[15px] h-[15px] rounded-full bg-white border-[3px] border-mp-ocean shadow-sm" />

                {/* Content */}
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-mp-ocean/10 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-mp-ocean" />
                    </div>
                    <div>
                      <p className="font-heading font-semibold text-mp-text text-sm">{m.label}</p>
                      {m.date && (
                        <p className="text-xs text-mp-text/50 mt-0.5">{formatDate(m.date)}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
