import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/env";
import { prisma } from "@/lib/prisma";

const BASE_URL = SITE_URL;

// Course detail slugs exposed under /cours/[slug] — mirrors lib/mock-data.ts
// courseTypes. Duplicating here (rather than importing) keeps the sitemap
// route free of client-only dependencies in lib/mock-data.
const COURSE_SLUGS = ["tous-niveaux", "doux-seniors", "avance", "maternite", "machine", "prive"] as const;

/**
 * Dynamic sitemap — combines core static pages, course detail pages, and
 * every published BlogPost.
 *
 * Priorities: home=1.0 daily, planning/tarifs/cours=0.8 weekly (money pages),
 * blog index=0.9 daily, articles=0.8 with lastModified=publishedAt,
 * course details=0.7 weekly, other statics=0.5 monthly, legal pages=0.3.
 *
 * Excluded: /admin/*, /api/*, /compte, /connexion, /defis, /instructeur,
 * /reset-password, /reservation/succes, /reservation/annulation,
 * /unsubscribe — handled by robots.ts or page-level `robots: { index: false }`.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${BASE_URL}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/equipe`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/cours`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/tarifs`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/planning`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${BASE_URL}/premiere-visite`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/carte-cadeau`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/bienvenue`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/blog`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/cgv`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/mentions-legales`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/politique-confidentialite`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/politique-cookies`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  const coursePages: MetadataRoute.Sitemap = COURSE_SLUGS.map((slug) => ({
    url: `${BASE_URL}/cours/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  let blogPages: MetadataRoute.Sitemap = [];
  try {
    const posts = await prisma.blogPost.findMany({
      where: { published: true },
      select: { slug: true, publishedAt: true },
    });
    blogPages = posts.map((p) => ({
      url: `${BASE_URL}/blog/${p.slug}`,
      lastModified: p.publishedAt ?? now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
  } catch {
    // DB unavailable at build (e.g. preview without DATABASE_URL) — ship statics only.
    blogPages = [];
  }

  return [...staticPages, ...coursePages, ...blogPages];
}
