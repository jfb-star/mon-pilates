import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { requireAdmin } from "@/lib/admin"
import { prisma } from "@/lib/prisma"
import type { Prisma } from "@prisma/client"

type Ctx = { params: Promise<{ id: string }> }

// GET one
export async function GET(_request: NextRequest, ctx: Ctx) {
  const session = await requireAdmin()
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
  }

  const { id } = await ctx.params
  const c = await prisma.emailCampaign.findUnique({ where: { id } })
  if (!c) {
    return NextResponse.json({ error: "Campagne introuvable." }, { status: 404 })
  }

  return NextResponse.json({
    campaign: {
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
    },
  })
}

// PATCH: update DRAFT only
export async function PATCH(request: NextRequest, ctx: Ctx) {
  const session = await requireAdmin(request)
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
  }

  try {
    const { id } = await ctx.params
    const existing = await prisma.emailCampaign.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: "Campagne introuvable." }, { status: 404 })
    }
    if (existing.status !== "DRAFT") {
      return NextResponse.json(
        { error: "Seules les campagnes en brouillon sont modifiables." },
        { status: 400 }
      )
    }

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
      resendAudienceId?: string | null
    } = body

    const data: Prisma.EmailCampaignUpdateInput = {}
    if (name !== undefined) data.name = name
    if (subject !== undefined) data.subject = subject
    if (mjmlSource !== undefined) {
      data.mjmlSource = mjmlSource
      data.htmlCompiled = mjmlSource
    }
    if (resendAudienceId !== undefined) data.resendAudienceId = resendAudienceId

    await prisma.emailCampaign.update({ where: { id }, data })
    return NextResponse.json({ message: "Campagne mise à jour." })
  } catch {
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour." },
      { status: 500 }
    )
  }
}

// DELETE: only DRAFT
export async function DELETE(request: NextRequest, ctx: Ctx) {
  const session = await requireAdmin(request)
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
  }

  try {
    const { id } = await ctx.params
    const existing = await prisma.emailCampaign.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: "Campagne introuvable." }, { status: 404 })
    }
    if (existing.status !== "DRAFT") {
      return NextResponse.json(
        { error: "Seules les campagnes en brouillon sont supprimables." },
        { status: 400 }
      )
    }

    await prisma.emailCampaign.delete({ where: { id } })
    return NextResponse.json({ message: "Campagne supprimée." })
  } catch {
    return NextResponse.json(
      { error: "Erreur lors de la suppression." },
      { status: 500 }
    )
  }
}
