import { ImageResponse } from "next/og"

export const alt = "Planning des cours — Mon Pilates, réservation en ligne"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

const OCEAN = "#3e7787"
const OCEAN_DARK = "#2a5d6e"
const SAND = "#f5f0eb"
const CREAM = "#faf7f3"
const CHARCOAL = "#2c2c2c"

export default function PlanningOGImage() {
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
          background: `linear-gradient(135deg, ${CREAM} 0%, ${SAND} 50%, #dce7eb 100%)`,
          fontFamily: "system-ui, -apple-system, Segoe UI, sans-serif",
          color: CHARCOAL,
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            bottom: 0,
            width: 14,
            background: `linear-gradient(180deg, ${OCEAN} 0%, ${OCEAN_DARK} 100%)`,
            display: "flex",
          }}
        />

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
            <div style={{ fontSize: 32, fontWeight: 700, lineHeight: 1 }}>Mon Pilates</div>
            <div style={{ fontSize: 18, color: OCEAN_DARK, marginTop: 4 }}>
              Planning · Réservation en ligne
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div
            style={{
              display: "flex",
              fontSize: 88,
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: -2,
              color: CHARCOAL,
              maxWidth: 1020,
            }}
          >
            Réservez votre cours de Pilates.
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 30,
              lineHeight: 1.3,
              color: "#4a4a4a",
              maxWidth: 980,
            }}
          >
            Tapis, cours privés sur appareil, pré & post-natal. Groupes de 5 max.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 24,
            color: OCEAN_DARK,
            fontWeight: 500,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: 999,
                background: OCEAN,
                display: "flex",
              }}
            />
            Ploemeur · Larmor-Plage
          </div>
          <div
            style={{
              display: "flex",
              padding: "12px 24px",
              borderRadius: 999,
              background: OCEAN,
              color: "white",
              fontWeight: 600,
              fontSize: 22,
            }}
          >
            Cours d&apos;essai 10&nbsp;€
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
