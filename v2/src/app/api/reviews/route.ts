import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

// GET /api/reviews?courseType=slug
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const courseTypeSlug = searchParams.get("courseType")

    const where: Record<string, unknown> = {}
    if (courseTypeSlug) {
      const courseType = await prisma.courseType.findUnique({
        where: { slug: courseTypeSlug },
      })
      if (!courseType) {
        return NextResponse.json(
          { error: "Type de cours introuvable" },
          { status: 404 }
        )
      }
      where.courseTypeId = courseType.id
    }

    const reviews = await prisma.review.findMany({
      where,
      include: {
        user: { select: { name: true } },
        courseType: { select: { slug: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 20,
    })

    // Calculate aggregates
    const aggregate = await prisma.review.aggregate({
      where,
      _avg: { rating: true },
      _count: { rating: true },
    })

    const formattedReviews = reviews.map((r) => {
      // Show first name + last initial for privacy
      const nameParts = r.user.name.split(" ")
      const displayName =
        nameParts.length > 1
          ? `${nameParts[0]} ${nameParts[nameParts.length - 1][0]}.`
          : nameParts[0]

      return {
        id: r.id,
        displayName,
        rating: r.rating,
        comment: r.comment,
        courseTypeSlug: r.courseType.slug,
        courseTypeName: r.courseType.name,
        createdAt: r.createdAt.toISOString(),
      }
    })

    return NextResponse.json({
      reviews: formattedReviews,
      averageRating: aggregate._avg.rating
        ? Math.round(aggregate._avg.rating * 10) / 10
        : null,
      totalReviews: aggregate._count.rating,
    })
  } catch (error) {
    console.error("GET /api/reviews error:", error)
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    )
  }
}

// POST /api/reviews
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Vous devez être connecté pour laisser un avis." },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { courseTypeSlug, rating, comment } = body

    // Validate rating
    if (!rating || !Number.isInteger(rating) || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "La note doit être un entier entre 1 et 5." },
        { status: 400 }
      )
    }

    // Validate comment length
    if (comment && typeof comment === "string" && comment.length > 500) {
      return NextResponse.json(
        { error: "Le commentaire ne doit pas dépasser 500 caractères." },
        { status: 400 }
      )
    }

    // Look up course type
    if (!courseTypeSlug || typeof courseTypeSlug !== "string") {
      return NextResponse.json(
        { error: "Le type de cours est requis." },
        { status: 400 }
      )
    }

    const courseType = await prisma.courseType.findUnique({
      where: { slug: courseTypeSlug },
    })

    if (!courseType) {
      return NextResponse.json(
        { error: "Type de cours introuvable." },
        { status: 404 }
      )
    }

    // Check user has attended at least 1 session of this course type
    const attendedBooking = await prisma.booking.findFirst({
      where: {
        userId: session.user.id,
        status: { in: ["ATTENDED", "CONFIRMED"] },
        session: {
          courseTypeId: courseType.id,
        },
      },
    })

    if (!attendedBooking) {
      return NextResponse.json(
        {
          error:
            "Vous devez avoir participé à au moins une séance de ce cours pour laisser un avis.",
        },
        { status: 403 }
      )
    }

    // Upsert review
    const review = await prisma.review.upsert({
      where: {
        userId_courseTypeId: {
          userId: session.user.id,
          courseTypeId: courseType.id,
        },
      },
      update: {
        rating,
        comment: comment?.trim() || null,
      },
      create: {
        userId: session.user.id,
        courseTypeId: courseType.id,
        rating,
        comment: comment?.trim() || null,
      },
      include: {
        user: { select: { name: true } },
        courseType: { select: { slug: true, name: true } },
      },
    })

    const nameParts = review.user.name.split(" ")
    const displayName =
      nameParts.length > 1
        ? `${nameParts[0]} ${nameParts[nameParts.length - 1][0]}.`
        : nameParts[0]

    return NextResponse.json({
      review: {
        id: review.id,
        displayName,
        rating: review.rating,
        comment: review.comment,
        courseTypeSlug: review.courseType.slug,
        courseTypeName: review.courseType.name,
        createdAt: review.createdAt.toISOString(),
      },
    })
  } catch (error) {
    console.error("POST /api/reviews error:", error)
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    )
  }
}
