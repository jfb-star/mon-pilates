import { ImageResponse } from "next/og"
import { courses } from "@/lib/mock-data"

export const alt = "Cours de Pilates — Mon Pilates, Larmor-Plage"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

const OCEAN = "#3e7787"
const OCEAN_DARK = "#2a5d6e"
const SAGE = "#5a7856"
const ROSE = "#d4a0a0"
const CHARCOAL = "#2c2c2c"
const SAND = "#f5f0eb"
const CREAM = "#faf7f3"

// Per-course accent colour — matches the course-type palette used elsewhere.
const courseAccents: Record<string, string> = {
  mat: OCEAN,
  reformer: SAGE,
  prenatal: ROSE,
  doux: "#a3c9d3",
  intensif: CHARCOAL,
}

export default async function CoursOGImage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const course = courses.find((c) => c.slug === slug)

  const title = course?.name ?? "Cours de Pilates"
  const description =
    course?.shortDescription ??
    "Découvrez les cours de Pilates Mon Pilates à Larmor-Plage."
  const level = course?.level ?? "Tous niveaux"
  const duration = course?.duration ?? "55 min"
  const accent = courseAccents[slug] ?? OCEAN

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: `linear-gradient(135deg, ${CREAM} 0%, ${SAND} 55%, #e6edf0 100%)`,
          fontFamily: "system-ui, -apple-system, Segoe UI, sans-serif",
          color: CHARCOAL,
          position: "relative",
        }}
      >
        {/* Accent bar — coloured per course type */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            bottom: 0,
            width: 18,
            background: accent,
            display: "flex",
          }}
        />

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: 16,
              background: OCEAN,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: 28,
              fontWeight: 700,
            }}
          >
            MP
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 30, fontWeight: 700, lineHeight: 1 }}>Mon Pilates</div>
            <div style={{ fontSize: 18, color: OCEAN_DARK, marginTop: 4 }}>
              Cours · Studio à Larmor-Plage
            </div>
          </div>
        </div>

        {/* Title + description */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div
            style={{
              display: "flex",
              fontSize: title.length > 35 ? 68 : 82,
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: -1.5,
              color: CHARCOAL,
              maxWidth: 1020,
            }}
          >
            {title}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 28,
              lineHeight: 1.3,
              color: "#4a4a4a",
              maxWidth: 980,
            }}
          >
            {description}
          </div>
        </div>

        {/* Footer meta */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 22,
          }}
        >
          <div style={{ display: "flex", gap: 12 }}>
            <div
              style={{
                display: "flex",
                padding: "10px 22px",
                borderRadius: 999,
                background: accent,
                color: "white",
                fontWeight: 600,
              }}
            >
              {level}
            </div>
            <div
              style={{
                display: "flex",
                padding: "10px 22px",
                borderRadius: 999,
                background: "white",
                color: CHARCOAL,
                fontWeight: 600,
                border: `2px solid ${accent}`,
              }}
            >
              {duration}
            </div>
          </div>
          <div style={{ display: "flex", color: CHARCOAL, fontWeight: 600 }}>
            mon-pilates.bzh
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
