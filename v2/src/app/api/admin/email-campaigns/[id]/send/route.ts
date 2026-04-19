import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { requireAdmin } from "@/lib/admin"
import { prisma } from "@/lib/prisma"
import { createBroadcast, sendBroadcast } from "@/lib/resend"

type Ctx = { params: Promise<{ id: string }> }

const RESEND_FROM = process.env.RESEND_FROM ?? ""

// POST: validate DRAFT|SCHEDULED, create broadcast, send, store id, mark SENT
export async function POST(_request: NextRequest, ctx: Ctx) {
  const session = await requireAdmin()
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
  }

  try {
    const { id } = await ctx.params
    const campaign = await prisma.emailCampaign.findUnique({ where: { id } })
    if (!campaign) {
      return NextResponse.json({ error: "Campagne introuvable." }, { status: 404 })
    }
    if (campaign.status !== "DRAFT" && campaign.status !== "SCHEDULED") {
      return NextResponse.json(
        { error: "Seules les campagnes en brouillon ou planifiées peuvent être envoyées." },
        { status: 400 }
      )
    }
    if (!campaign.resendAudienceId) {
      return NextResponse.json(
        { error: "Aucune audience Resend n'est configurée pour cette campagne." },
        { status: 400 }
      )
    }
    if (!RESEND_FROM) {
      return NextResponse.json(
        { error: "RESEND_FROM n'est pas configuré." },
        { status: 500 }
      )
    }

    const { id: broadcastId } = await createBroadcast({
      audienceId: campaign.resendAudienceId,
      from: RESEND_FROM,
      subject: campaign.subject,
      html: campaign.htmlCompiled,
      name: campaign.name,
    })

    await sendBroadcast(broadcastId)

    const updated = await prisma.emailCampaign.update({
      where: { id },
      data: {
        resendBroadcastId: broadcastId,
        status: "SENT",
        sentAt: new Date(),
      },
    })

    return NextResponse.json({
      message: "Campagne envoyée.",
      campaign: { id: updated.id, resendBroadcastId: updated.resendBroadcastId },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur inconnue"
    return NextResponse.json(
      { error: `Erreur lors de l'envoi: ${message}` },
      { status: 500 }
    )
  }
}
