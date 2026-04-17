import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"

// GET: Public blog posts
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get("slug")

  try {
    if (slug) {
      const post = await prisma.blogPost.findUnique({
        where: { slug, published: true },
        include: { author: { select: { name: true } } },
      })

      if (!post) {
        return NextResponse.json({ post: null })
      }

      return NextResponse.json({
        post: {
          ...post,
          tags: JSON.parse(post.tags),
          content: JSON.parse(post.content),
          authorName: post.author.name,
        },
      })
    }

    const posts = await prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { publishedAt: "desc" },
      include: { author: { select: { name: true } } },
    })

    return NextResponse.json({
      posts: posts.map((p) => ({
        ...p,
        tags: JSON.parse(p.tags),
        content: JSON.parse(p.content),
        authorName: p.author.name,
      })),
    })
  } catch {
    return NextResponse.json({ posts: [], post: null })
  }
}
