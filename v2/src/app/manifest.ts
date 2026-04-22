import type { MetadataRoute } from "next"

/**
 * PWA manifest (Next.js 16 file convention).
 *
 * Replaces the legacy static `public/manifest.json` — Next.js now serves
 * this route at `/manifest.webmanifest` automatically, and it is picked up
 * by the browser via the default `<link rel="manifest">` injection.
 *
 * Icons fallback: we use `logo-square.webp` as a single 512×512 source when
 * dedicated 192/512 PNGs are not yet generated. This is acceptable for a
 * first pass — ship dedicated `/icons/icon-192.png` and `/icons/icon-512.png`
 * later for better install-prompt UX on Android.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Mon Pilates — Studio Ploemeur",
    short_name: "Mon Pilates",
    description: "Cours de Pilates à Ploemeur et Lorient",
    start_url: "/",
    display: "standalone",
    background_color: "#fdfcf9",
    theme_color: "#3e7787",
    orientation: "portrait-primary",
    lang: "fr",
    categories: ["health", "fitness", "lifestyle"],
    icons: [
      {
        src: "/favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      // Fallback single raster source. Browsers that need specific sizes will
      // rasterize from this (acceptable for a first PWA pass).
      // NOTE: Next.js types restrict `purpose` to a single token, so "any" and
      // "maskable" are emitted as separate entries. The web manifest spec
      // allows them on one entry ("any maskable"), but Next.js 16's
      // MetadataRoute.Manifest type enforces one value per entry.
      {
        src: "/logo-square.webp",
        sizes: "192x192",
        type: "image/webp",
        purpose: "any",
      },
      {
        src: "/logo-square.webp",
        sizes: "192x192",
        type: "image/webp",
        purpose: "maskable",
      },
      {
        src: "/logo-square.webp",
        sizes: "512x512",
        type: "image/webp",
        purpose: "any",
      },
      {
        src: "/logo-square.webp",
        sizes: "512x512",
        type: "image/webp",
        purpose: "maskable",
      },
      {
        src: "/logo-square.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/logo-square.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  }
}
