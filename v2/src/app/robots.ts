import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/admin/", "/compte/", "/connexion/", "/reservation/", "/reset-password/", "/bienvenue/"],
    },
    sitemap: "https://mon-pilates.bzh/sitemap.xml",
  };
}
