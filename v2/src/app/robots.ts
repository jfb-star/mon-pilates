import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/compte/"],
    },
    sitemap: "https://mon-pilates.bzh/sitemap.xml",
  };
}
