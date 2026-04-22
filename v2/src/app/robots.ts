import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/env";

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
        "/reservation/succes",
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
