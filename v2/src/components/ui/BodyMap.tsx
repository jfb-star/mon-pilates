"use client";

import { useState, useCallback, type KeyboardEvent } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

/* ----------------------------------------------------------
   DATA
   ---------------------------------------------------------- */

const courseNames: Record<string, string> = {
  "tous-niveaux": "Pilates Tous Niveaux",
  "machine": "Pilates Machine",
  "maternite": "Pré & post-natal",
  "doux-seniors": "Pilates Doux – Seniors",
  "avance": "Pilates Avancé",
};

interface BodyZone {
  id: string;
  label: string;
  courses: string[];
  benefits: string;
  exercises: string[];
}

const bodyZones: BodyZone[] = [
  {
    id: "neck",
    label: "Nuque & Cervicales",
    courses: ["tous-niveaux", "doux-seniors"],
    benefits:
      "Relâche les tensions cervicales et améliore la mobilité du cou",
    exercises: ["Roll Down", "Neck Pull", "Chest Lift"],
  },
  {
    id: "shoulders",
    label: "Épaules & Bras",
    courses: ["machine", "tous-niveaux", "avance"],
    benefits:
      "Renforce la ceinture scapulaire et libère les épaules",
    exercises: ["Arm Circles", "Push-Up", "Pulling Straps"],
  },
  {
    id: "back",
    label: "Dos",
    courses: ["tous-niveaux", "machine", "doux-seniors"],
    benefits:
      "Soulage les douleurs dorsales et renforce les muscles profonds",
    exercises: ["Swan", "Swimming", "Cat-Cow"],
  },
  {
    id: "core",
    label: "Abdominaux & Centre",
    courses: ["tous-niveaux", "machine", "avance"],
    benefits:
      "Renforce le powerhouse — centre de toute la méthode Pilates",
    exercises: ["The Hundred", "Teaser", "Plank"],
  },
  {
    id: "hips",
    label: "Hanches & Bassin",
    courses: ["tous-niveaux", "maternite", "doux-seniors"],
    benefits:
      "Stabilise le bassin et améliore la souplesse des hanches",
    exercises: ["Pelvic Curl", "Clam", "Hip Circles"],
  },
  {
    id: "legs",
    label: "Jambes & Pieds",
    courses: ["machine", "avance", "tous-niveaux"],
    benefits: "Tonifie les jambes et améliore l'équilibre",
    exercises: ["Footwork", "Leg Circles", "Side Kicks"],
  },
];

/* ----------------------------------------------------------
   SVG ZONE DEFINITIONS (position over body outline)
   ---------------------------------------------------------- */

interface ZoneShape {
  id: string;
  type: "ellipse" | "rect";
  attrs: Record<string, number>;
}

const zoneShapes: ZoneShape[] = [
  { id: "neck", type: "ellipse", attrs: { cx: 150, cy: 72, rx: 22, ry: 14 } },
  { id: "shoulders", type: "ellipse", attrs: { cx: 150, cy: 112, rx: 58, ry: 18 } },
  { id: "back", type: "rect", attrs: { x: 122, y: 130, width: 56, height: 52, rx: 10 } },
  { id: "core", type: "ellipse", attrs: { cx: 150, cy: 210, rx: 36, ry: 28 } },
  { id: "hips", type: "ellipse", attrs: { cx: 150, cy: 258, rx: 44, ry: 22 } },
  { id: "legs", type: "rect", attrs: { x: 114, y: 290, width: 72, height: 130, rx: 14 } },
];

/* ----------------------------------------------------------
   COMPONENT
   ---------------------------------------------------------- */

export function BodyMap() {
  const [selected, setSelected] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  const handleSelect = useCallback((id: string) => {
    setSelected((prev) => (prev === id ? null : id));
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent, id: string) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleSelect(id);
      }
    },
    [handleSelect],
  );

  const activeZone = bodyZones.find((z) => z.id === selected);

  return (
    <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-12">
      {/* ---- SVG BODY ---- */}
      <div className="w-full lg:w-[40%] flex justify-center shrink-0">
        <svg
          viewBox="0 0 300 460"
          className="w-[280px] sm:w-[300px] lg:w-[300px] h-auto select-none"
          aria-label="Carte du corps — cliquez sur une zone pour voir les cours correspondants"
          role="img"
        >
          <defs>
            <radialGradient id="bodymap-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="var(--mp-ocean)" stopOpacity="0.35" />
              <stop offset="100%" stopColor="var(--mp-ocean)" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="bodymap-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--mp-ocean)" stopOpacity="0.6" />
              <stop offset="100%" stopColor="var(--mp-ocean-dark)" stopOpacity="0.75" />
            </linearGradient>
          </defs>

          {/* Body silhouette outline */}
          <g fill="none" stroke="var(--mp-sand-dark)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            {/* Head */}
            <ellipse cx="150" cy="38" rx="24" ry="28" />
            {/* Neck */}
            <line x1="140" y1="65" x2="140" y2="80" />
            <line x1="160" y1="65" x2="160" y2="80" />
            {/* Shoulders + torso */}
            <path d="M140,80 C130,82 105,88 88,104 C82,110 80,118 80,128" />
            <path d="M160,80 C170,82 195,88 212,104 C218,110 220,118 220,128" />
            {/* Arms left */}
            <path d="M80,128 C76,148 72,175 70,200 C68,218 66,235 68,250" />
            {/* Arms right */}
            <path d="M220,128 C224,148 228,175 230,200 C232,218 234,235 232,250" />
            {/* Torso sides */}
            <path d="M108,100 C104,130 102,160 106,190 C108,210 112,230 116,248" />
            <path d="M192,100 C196,130 198,160 194,190 C192,210 188,230 184,248" />
            {/* Hips */}
            <path d="M116,248 C112,260 108,270 110,280" />
            <path d="M184,248 C188,260 192,270 190,280" />
            {/* Legs left */}
            <path d="M110,280 C108,310 106,340 108,370 C110,390 112,410 115,435" />
            {/* Legs right */}
            <path d="M190,280 C192,310 194,340 192,370 C190,390 188,410 185,435" />
            {/* Inner legs */}
            <path d="M136,272 C134,310 132,340 134,370 C135,390 136,410 138,435" />
            <path d="M164,272 C166,310 168,340 166,370 C165,390 164,410 162,435" />
            {/* Feet */}
            <path d="M115,435 C110,442 105,448 100,450" />
            <path d="M138,435 C136,442 134,448 132,450" />
            <path d="M185,435 C190,442 195,448 200,450" />
            <path d="M162,435 C164,442 166,448 168,450" />
          </g>

          {/* Clickable zones */}
          {zoneShapes.map((zone) => {
            const isSelected = selected === zone.id;
            const isHovered = hovered === zone.id;
            const isActive = isSelected || isHovered;

            const baseStyle: React.CSSProperties = {
              cursor: "pointer",
              transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
              fill: isSelected
                ? "url(#bodymap-fill)"
                : isHovered
                  ? "rgba(107,159,173,0.18)"
                  : "rgba(107,159,173,0.06)",
              stroke: isActive ? "var(--mp-ocean)" : "var(--mp-sand-dark)",
              strokeWidth: isActive ? 2 : 1,
              filter: isSelected ? "drop-shadow(0 0 8px rgba(107,159,173,0.5))" : "none",
            };

            const common = {
              role: "button" as const,
              tabIndex: 0,
              "aria-label": bodyZones.find((z) => z.id === zone.id)?.label,
              "aria-pressed": isSelected,
              style: baseStyle,
              onClick: () => handleSelect(zone.id),
              onKeyDown: (e: KeyboardEvent<SVGElement>) => handleKeyDown(e, zone.id),
              onMouseEnter: () => setHovered(zone.id),
              onMouseLeave: () => setHovered(null),
              onFocus: () => setHovered(zone.id),
              onBlur: () => setHovered(null),
            };

            if (zone.type === "ellipse") {
              return (
                <ellipse
                  key={zone.id}
                  cx={zone.attrs.cx}
                  cy={zone.attrs.cy}
                  rx={zone.attrs.rx}
                  ry={zone.attrs.ry}
                  {...common}
                />
              );
            }

            return (
              <rect
                key={zone.id}
                x={zone.attrs.x}
                y={zone.attrs.y}
                width={zone.attrs.width}
                height={zone.attrs.height}
                rx={zone.attrs.rx}
                {...common}
              />
            );
          })}

          {/* Zone labels (decorative) */}
          {zoneShapes.map((zone) => {
            const z = bodyZones.find((b) => b.id === zone.id)!;
            const cy =
              zone.type === "ellipse"
                ? zone.attrs.cy
                : (zone.attrs.y ?? 0) + (zone.attrs.height ?? 0) / 2;
            const isActive = selected === zone.id || hovered === zone.id;

            return (
              <text
                key={`label-${zone.id}`}
                x="150"
                y={(cy ?? 0) + 1}
                textAnchor="middle"
                dominantBaseline="central"
                className="pointer-events-none font-heading"
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  fill: isActive ? "var(--mp-ocean-dark)" : "var(--mp-text-muted)",
                  opacity: isActive ? 1 : 0.7,
                  transition: "all 0.3s ease",
                }}
              >
                {z.label}
              </text>
            );
          })}
        </svg>
      </div>

      {/* ---- INFO PANEL ---- */}
      <div className="w-full lg:w-[60%] min-h-[280px]">
        {activeZone ? (
          <div
            key={activeZone.id}
            className="animate-fade-in rounded-2xl border border-mp-sand-dark/30 bg-mp-white p-6 sm:p-8 shadow-sm"
          >
            {/* Title */}
            <h3 className="font-heading text-xl sm:text-2xl font-bold text-mp-charcoal mb-3">
              {activeZone.label}
            </h3>

            {/* Benefits */}
            <p className="font-body text-mp-text-light leading-relaxed mb-5">
              {activeZone.benefits}
            </p>

            {/* Exercises */}
            <div className="mb-6">
              <p className="font-heading text-sm font-semibold text-mp-charcoal mb-2">
                Exercices cl&eacute;s&nbsp;:
              </p>
              <div className="flex flex-wrap gap-2">
                {activeZone.exercises.map((ex) => (
                  <span
                    key={ex}
                    className="inline-block bg-mp-ocean/10 text-mp-ocean text-sm font-heading font-medium px-3 py-1 rounded-full"
                  >
                    {ex}
                  </span>
                ))}
              </div>
            </div>

            {/* Recommended courses */}
            <div>
              <p className="font-heading text-sm font-semibold text-mp-charcoal mb-3">
                Cours recommand&eacute;s&nbsp;:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {activeZone.courses.map((slug) => (
                  <Link
                    key={slug}
                    href={`/planning?filter=${slug}`}
                    className="group flex items-center justify-between gap-3 rounded-xl border border-mp-sand-dark/30 bg-mp-cream px-4 py-3 transition-all hover:border-mp-ocean/30 hover:shadow-md"
                  >
                    <span className="font-heading text-sm font-semibold text-mp-charcoal">
                      {courseNames[slug] ?? slug}
                    </span>
                    <span className="flex items-center gap-1 text-xs font-heading font-medium text-mp-ocean group-hover:translate-x-0.5 transition-transform">
                      R&eacute;server
                      <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full min-h-[280px] text-center px-4">
            <div className="w-16 h-16 rounded-full bg-mp-ocean/10 flex items-center justify-center mb-4">
              <svg
                viewBox="0 0 24 24"
                className="w-7 h-7 text-mp-ocean"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2a5 5 0 0 1 5 5v1a5 5 0 0 1-10 0V7a5 5 0 0 1 5-5Z" />
                <path d="M8 14h8l2 8H6l2-8Z" />
              </svg>
            </div>
            <p className="font-heading text-base sm:text-lg font-semibold text-mp-charcoal mb-1">
              Explorez votre corps
            </p>
            <p className="font-body text-sm text-mp-text-muted max-w-xs">
              Cliquez sur une zone du corps pour d&eacute;couvrir les cours
              adapt&eacute;s
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
