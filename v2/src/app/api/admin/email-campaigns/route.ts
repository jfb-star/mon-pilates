import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { requireAdmin } from "@/lib/admin"
import { prisma } from "@/lib/prisma"

// GET: list campaigns
export async function GET() {
  const session = await requireAdmin()
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
  }

  const campaigns = await prisma.emailCampaign.findMany({
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json({
    campaigns: campaigns.map((c) => ({
      id: c.id,
      name: c.name,
      subject: c.subject,
      mjmlSource: c.mjmlSource,
      htmlCompiled: c.htmlCompiled,
      status: c.status,
      resendBroadcastId: c.resendBroadcastId,
      resendAudienceId: c.resendAudienceId,
      audienceFilter: c.audienceFilter,
      scheduledAt: c.scheduledAt ? c.scheduledAt.toISOString() : null,
      sentAt: c.sentAt ? c.sentAt.toISOString() : null,
      stats: (() => {
        try {
          return JSON.parse(c.stats) as Record<string, unknown>
        } catch {
          return {} as Record<string, unknown>
        }
      })(),
      createdAt: c.createdAt.toISOString(),
      updatedAt: c.updatedAt.toISOString(),
    })),
  })
}

// POST: create campaign as DRAFT
export async function POST(request: NextRequest) {
  const session = await requireAdmin(request)
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
  }

  try {
    const body = await request.json()
    const {
      name,
      subject,
      mjmlSource,
      resendAudienceId,
    }: {
      name?: string
      subject?: string
      mjmlSource?: string
      resendAudienceId?: string
    } = body

    if (!name || !subject || !mjmlSource) {
      return NextResponse.json(
        { error: "name, subject et mjmlSource sont requis." },
        { status: 400 }
      )
    }

    const created = await prisma.emailCampaign.create({
      data: {
        name,
        subject,
        mjmlSource,
        htmlCompiled: mjmlSource,
        status: "DRAFT",
        resendAudienceId: resendAudienceId ?? null,
        createdBy: session.user?.id ?? null,
      },
    })

    return NextResponse.json({ campaign: { id: created.id } }, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: "Erreur lors de la création de la campagne." },
      { status: 500 }
    )
  }
}
