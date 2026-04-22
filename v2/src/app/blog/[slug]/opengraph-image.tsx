import { ImageResponse } from "next/og"
import { prisma } from "@/lib/prisma"
import { posts } from "./page"

export const alt = "Article du blog Mon Pilates"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

const OCEAN = "#3e7787"
const OCEAN_DARK = "#2a5d6e"
const SAND = "#f5f0eb"
const CREAM = "#faf7f3"
const CHARCOAL = "#2c2c2c"

async function getPostMeta(slug: string): Promise<{ title: string; category: string } | null> {
  // Try the DB first (same pattern as page.tsx)
  try {
    const dbPost = await prisma.blogPost.findUnique({
      where: { slug, published: true },
      select: { title: true, tags: true },
    })
    if (dbPost) {
      const tags = JSON.parse(dbPost.tags || "[]") as string[]
      return { title: dbPost.title, category: tags[0] || "Conseils" }
    }
  } catch {
    // Prisma may be unavailable at build time — fall through to the static list.
  }
  const staticPost = posts.find((p) => p.slug === slug)
  if (staticPost) return { title: staticPost.title, category: staticPost.category }
  return null
}

export default async function BlogOGImage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getPostMeta(slug)

  const title = post?.title ?? "Blog Mon Pilates"
  const category = post?.category ?? "Blog"

  // Shrink the title font if the headline is long so it never overflows.
  const titleFontSize = title.length > 80 ? 54 : title.length > 55 ? 64 : 76

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
          background: `linear-gradient(135deg, ${CREAM} 0%, ${SAND} 55%, #dce7eb 100%)`,
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

        {/* Header: brand + category pill */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
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
              <div style={{ fontSize: 18, color: OCEAN_DARK, marginTop: 4 }}>Blog</div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              padding: "10px 22px",
              borderRadius: 999,
              background: "rgba(62, 119, 135, 0.12)",
              color: OCEAN_DARK,
              fontSize: 22,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
          >
            {category}
          </div>
        </div>

        {/* Article title */}
        <div
          style={{
            display: "flex",
            fontSize: titleFontSize,
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: -1.5,
            color: CHARCOAL,
            maxWidth: 1040,
          }}
        >
          {title}
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 22,
            color: OCEAN_DARK,
            fontWeight: 500,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: 999,
                background: OCEAN,
                display: "flex",
              }}
            />
            Ploemeur · Larmor-Plage
          </div>
          <div style={{ display: "flex", color: CHARCOAL, fontWeight: 600 }}>
            mon-pilates.bzh/blog
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
