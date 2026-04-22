import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { requireAdmin } from "@/lib/admin"
import { prisma } from "@/lib/prisma"
import { getBroadcastStats } from "@/lib/resend"

type Ctx = { params: Promise<{ id: string }> }

// POST: refresh Resend stats JSON
export async function POST(request: NextRequest, ctx: Ctx) {
  const session = await requireAdmin(request)
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
  }

  try {
    const { id } = await ctx.params
    const campaign = await prisma.emailCampaign.findUnique({ where: { id } })
    if (!campaign) {
      return NextResponse.json({ error: "Campagne introuvable." }, { status: 404 })
    }
    if (!campaign.resendBroadcastId) {
      return NextResponse.json(
        { error: "Cette campagne n'a pas de broadcast Resend associé." },
        { status: 400 }
      )
    }

    const stats = await getBroadcastStats(campaign.resendBroadcastId)
    const withRefreshedAt = { ...stats, _refreshedAt: new Date().toISOString() }

    await prisma.emailCampaign.update({
      where: { id },
      data: { stats: JSON.stringify(withRefreshedAt) },
    })

    return NextResponse.json({ stats: withRefreshedAt })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur inconnue"
    return NextResponse.json(
      { error: `Erreur lors du rafraîchissement des stats: ${message}` },
      { status: 500 }
    )
  }
}
