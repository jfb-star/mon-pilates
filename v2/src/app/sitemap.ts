import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/env";
import { prisma } from "@/lib/prisma";

const BASE_URL = SITE_URL;

/**
 * Dynamic sitemap — combines core static pages with every published BlogPost.
 * Priorities follow the brief: home=1.0 daily, blog index=0.9 daily,
 * other statics=0.5 monthly, articles=0.8 with lastModified=publishedAt.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${BASE_URL}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/tarifs`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/planning`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/reservation`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/blog`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/cgv`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/politique-confidentialite`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  ];

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

  return [...staticPages, ...blogPages];
}
