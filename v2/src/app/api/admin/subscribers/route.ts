import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/admin"
import { prisma } from "@/lib/prisma"

/**
 * Read-only subscriber stats for the analytics tab.
 *
 * Returns:
 *   {
 *     total: number,         // all rows, incl. unsubscribed
 *     active: number,        // unsubscribedAt IS NULL
 *     unsubscribed: number,  // unsubscribedAt IS NOT NULL
 *     recentSignups: number, // active + created in the last 30 days
 *   }
 */
export async function GET(): Promise<Response> {
  const session = await requireAdmin()
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
  }

  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  try {
    const [total, active, unsubscribed, recentSignups] = await Promise.all([
      prisma.subscriber.count(),
      prisma.subscriber.count({ where: { unsubscribedAt: null } }),
      prisma.subscriber.count({ where: { unsubscribedAt: { not: null } } }),
      prisma.subscriber.count({
        where: { unsubscribedAt: null, createdAt: { gte: thirtyDaysAgo } },
      }),
    ])

    return NextResponse.json({
      total,
      active,
      unsubscribed,
      recentSignups,
    })
  } catch (err) {
    console.error("[admin/subscribers] stats query failed:", err)
    return NextResponse.json(
      { error: "Impossible de récupérer les statistiques." },
      { status: 500 }
    )
  }
}
