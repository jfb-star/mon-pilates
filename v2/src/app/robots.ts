import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/env";

/**
 * robots.txt — blocks private/auth/dynamic routes from indexing while
 * keeping everything under /, /blog, /cours, /planning, /tarifs, etc. open.
 *
 * Kept in sync with `src/app/sitemap.ts` (which skips the same paths) and
 * with page-level `robots: { index: false }` on success/cancel pages.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin",
        "/admin/*",
        "/api/*",
        "/compte",
        "/compte/*",
        "/connexion",
        "/inscription",
        "/reset-password",
        "/defis",
        "/instructeur",
        "/instructeur/*",
        "/reservation/succes",
        "/reservation/annulation",
        "/unsubscribe",
      ],
    },
    host: SITE_URL,
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
