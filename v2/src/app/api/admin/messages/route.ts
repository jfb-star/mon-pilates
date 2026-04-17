import { NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/admin"
import { prisma } from "@/lib/prisma"

type RecipientFilter = "all" | "active-card" | "subscribers" | "inactive"

async function getRecipientEmails(filter: RecipientFilter) {
  const now = new Date()

  switch (filter) {
    case "all": {
      const users = await prisma.user.findMany({
        select: { id: true, email: true, name: true },
      })
      return users
    }

    case "active-card": {
      const cards = await prisma.courseCard.findMany({
        where: {
          remainingSessions: { gt: 0 },
          expiresAt: { gt: now },
        },
        select: { user: { select: { id: true, email: true, name: true } } },
      })
      // Deduplicate by user id
      const map = new Map(cards.map((c) => [c.user.id, c.user]))
      return Array.from(map.values())
    }

    case "subscribers": {
      const subs = await prisma.subscription.findMany({
        where: { status: "ACTIVE" },
        select: { user: { select: { id: true, email: true, name: true } } },
      })
      const map = new Map(subs.map((s) => [s.user.id, s.user]))
      return Array.from(map.values())
    }

    case "inactive": {
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      // Users who have no booking with createdAt in the last 30 days
      const users = await prisma.user.findMany({
        where: {
          role: "USER",
          bookings: {
            none: {
              createdAt: { gte: thirtyDaysAgo },
            },
          },
        },
        select: { id: true, email: true, name: true },
      })
      return users
    }

    default:
      return []
  }
}

export async function POST(request: NextRequest) {
  const session = await requireAdmin()
  if (!session) {
    return NextResponse.json({ error: "Non autoris\u00e9" }, { status: 403 })
  }

  try {
    const body = await request.json()
    const { subject, message, recipients } = body as {
      subject: string
      message: string
      recipients: RecipientFilter
    }

    if (!subject || !message || !recipients) {
      return NextResponse.json({ error: "Champs requis : subject, message, recipients" }, { status: 400 })
    }

    const validFilters: RecipientFilter[] = ["all", "active-card", "subscribers", "inactive"]
    if (!validFilters.includes(recipients)) {
      return NextResponse.json({ error: "Filtre de destinataires invalide" }, { status: 400 })
    }

    const users = await getRecipientEmails(recipients)

    if (users.length === 0) {
      return NextResponse.json({ error: "Aucun destinataire trouv\u00e9" }, { status: 404 })
    }

    // Create notifications for each user
    await prisma.notification.createMany({
      data: users.map((u) => ({
        userId: u.id,
        type: "ADMIN_MESSAGE",
        title: subject,
        message,
        data: JSON.stringify({ recipients, sentBy: session.user?.id }),
      })),
    })

    // Log (in production, send via Resend)
    console.log(`[Admin Message] "${subject}" sent to ${users.length} users (filter: ${recipients})`)
    console.log(`[Admin Message] Recipients: ${users.map((u) => u.email).join(", ")}`)

    return NextResponse.json({ sent: users.length, recipients })
  } catch (error) {
    console.error("Admin message error:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

export async function GET() {
  const session = await requireAdmin()
  if (!session) {
    return NextResponse.json({ error: "Non autoris\u00e9" }, { status: 403 })
  }

  // Get recent admin messages — one per unique (title+message+createdAt) group
  const recentMessages = await prisma.notification.findMany({
    where: { type: "ADMIN_MESSAGE" },
    orderBy: { createdAt: "desc" },
    take: 200, // fetch enough to group
    select: {
      title: true,
      message: true,
      data: true,
      createdAt: true,
    },
  })

  // Group by title+createdAt (within same second = same batch)
  const grouped = new Map<string, { subject: string; message: string; recipients: string; sentAt: string; count: number }>()

  for (const n of recentMessages) {
    const key = `${n.title}|${n.createdAt.toISOString().slice(0, 19)}`
    if (!grouped.has(key)) {
      const meta = n.data ? (() => { try { return JSON.parse(n.data) } catch { return {} } })() : {}
      grouped.set(key, {
        subject: n.title,
        message: n.message,
        recipients: meta.recipients ?? "all",
        sentAt: n.createdAt.toISOString(),
        count: 0,
      })
    }
    grouped.get(key)!.count++
  }

  const messages = Array.from(grouped.values())
    .sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime())
    .slice(0, 20)

  return NextResponse.json({ messages })
}
