import { ImageResponse } from "next/og"

// Image metadata
export const alt = "Mon Pilates — Studio de Pilates face à l'océan à Larmor-Plage"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

// Brand palette — kept inline so the ImageResponse renderer (Satori) has
// concrete color values (no CSS variables).
const OCEAN = "#3e7787"
const OCEAN_DARK = "#2a5d6e"
const SAND = "#f5f0eb"
const CREAM = "#faf7f3"
const CHARCOAL = "#2c2c2c"

export default function OGImage() {
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
          background: `linear-gradient(135deg, ${CREAM} 0%, ${SAND} 50%, #e8eef1 100%)`,
          fontFamily: "system-ui, -apple-system, Segoe UI, sans-serif",
          color: CHARCOAL,
          position: "relative",
        }}
      >
        {/* Decorative accent bar on the left edge */}
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

        {/* Header — brand lockup */}
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 18,
              background: OCEAN,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: 36,
              fontWeight: 700,
              letterSpacing: -1,
            }}
          >
            MP
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 42, fontWeight: 700, lineHeight: 1, color: CHARCOAL }}>
              Mon Pilates
            </div>
            <div style={{ fontSize: 22, color: OCEAN_DARK, marginTop: 6, fontWeight: 500 }}>
              Studio à Larmor-Plage
            </div>
          </div>
        </div>

        {/* Main headline */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              fontSize: 88,
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: -2,
              color: CHARCOAL,
              maxWidth: 1000,
              display: "flex",
            }}
          >
            Le Pilates face à l&apos;océan.
          </div>
          <div
            style={{
              fontSize: 34,
              fontWeight: 400,
              lineHeight: 1.3,
              color: "#4a4a4a",
              maxWidth: 980,
              display: "flex",
            }}
          >
            Cours tapis, privés sur appareil & pré/post-natal. Cours d&apos;essai à 10&nbsp;€.
          </div>
        </div>

        {/* Footer baseline */}
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
          <div style={{ display: "flex", color: CHARCOAL, fontWeight: 600 }}>
            mon-pilates.bzh
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
