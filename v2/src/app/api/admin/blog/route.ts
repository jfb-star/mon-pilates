import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { requireStaff } from "@/lib/admin"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET: All blog posts (admin)
export async function GET() {
  const session = await requireStaff()
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
  }

  const posts = await prisma.blogPost.findMany({
    orderBy: { publishedAt: "desc" },
    include: { author: { select: { name: true } } },
  })

  return NextResponse.json({
    posts: posts.map((p) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      excerpt: p.excerpt,
      content: p.content,
      coverImage: p.coverImage,
      published: p.published,
      publishedAt: p.publishedAt,
      authorName: p.author.name,
      tags: JSON.parse(p.tags),
    })),
  })
}

// POST: Create blog post
export async function POST(request: NextRequest) {
  const session = await requireStaff(request)
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
  }

  try {
    const body = await request.json()
    const { title, slug, excerpt, content, coverImage, tags, published } = body

    if (!title || !slug) {
      return NextResponse.json({ error: "Titre et slug requis." }, { status: 400 })
    }

    // Check slug uniqueness
    const existing = await prisma.blogPost.findUnique({ where: { slug } })
    if (existing) {
      return NextResponse.json({ error: "Ce slug existe déjà." }, { status: 400 })
    }

    const authSession = await auth()
    const authorId = authSession?.user?.id
    if (!authorId) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
    }

    const post = await prisma.blogPost.create({
      data: {
        title,
        slug,
        excerpt: excerpt || null,
        content: typeof content === "string" ? content : JSON.stringify(content || []),
        coverImage: coverImage || null,
        tags: JSON.stringify(tags || []),
        published: published ?? false,
        publishedAt: published ? new Date() : null,
        authorId,
      },
    })

    return NextResponse.json({ post }, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Erreur lors de la création." }, { status: 500 })
  }
}

// PATCH: Update blog post
export async function PATCH(request: NextRequest) {
  const session = await requireStaff(request)
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
  }

  try {
    const body = await request.json()
    const { id, ...fields } = body

    if (!id) {
      return NextResponse.json({ error: "ID requis." }, { status: 400 })
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: Record<string, any> = {}

    if (fields.title !== undefined) data.title = fields.title
    if (fields.slug !== undefined) data.slug = fields.slug
    if (fields.excerpt !== undefined) data.excerpt = fields.excerpt || null
    if (fields.content !== undefined) {
      data.content = typeof fields.content === "string" ? fields.content : JSON.stringify(fields.content)
    }
    if (fields.coverImage !== undefined) data.coverImage = fields.coverImage || null
    if (fields.tags !== undefined) data.tags = JSON.stringify(fields.tags)
    if (fields.published !== undefined) {
      data.published = fields.published
      if (fields.published) {
        // Set publishedAt if publishing for the first time
        const existing = await prisma.blogPost.findUnique({ where: { id }, select: { publishedAt: true } })
        if (!existing?.publishedAt) {
          data.publishedAt = new Date()
        }
      }
    }

    const post = await prisma.blogPost.update({
      where: { id },
      data,
    })

    return NextResponse.json({ post })
  } catch {
    return NextResponse.json({ error: "Erreur lors de la mise à jour." }, { status: 500 })
  }
}

// DELETE: Delete blog post
export async function DELETE(request: NextRequest) {
  const session = await requireStaff(request)
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "ID requis." }, { status: 400 })
    }

    await prisma.blogPost.delete({ where: { id } })

    return NextResponse.json({ message: "Article supprimé." })
  } catch {
    return NextResponse.json({ error: "Erreur lors de la suppression." }, { status: 500 })
  }
}
