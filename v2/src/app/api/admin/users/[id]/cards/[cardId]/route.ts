/**
 * Admin actions on a member's CourseCard.
 *
 * PATCH  → adjust remainingSessions and/or expiresAt (extend/shorten validity)
 * DELETE → cancel the card (set remainingSessions=0 + expiresAt=now)
 *          We DO NOT hard-delete because the row may be linked to a Payment
 *          and historical bookings; soft-cancel preserves audit trail.
 *
 * Both require ADMIN role + valid origin.
 */
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { z } from "zod"
import { requireAdmin } from "@/lib/admin"
import { prisma } from "@/lib/prisma"

interface Params { params: Promise<{ id: string; cardId: string }> }

const cardPatchSchema = z.object({
  remainingSessions: z.number().int().min(0).max(1000).optional(),
  expiresAt: z.string().regex(/^\d{4}-\d{2}-\d{2}/).optional(), // ISO date or datetime
  // Optional admin note recorded in MigrationBatch-like audit trail.
  // Future: add CardAdjustment table for full audit log.
  reason: z.string().max(500).optional(),
})

export async function PATCH(request: NextRequest, { params }: Params) {
  const session = await requireAdmin(request)
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
  const { id: userId, cardId } = await params

  let body: unknown
  try { body = await request.json() } catch { return NextResponse.json({ error: "JSON invalide" }, { status: 400 }) }
  const parsed = cardPatchSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Champs invalides", details: parsed.error.issues }, { status: 400 })
  }

  // Verify the card belongs to this user (defence-in-depth — would be
  // catastrophic to update a card belonging to another customer)
  const existing = await prisma.courseCard.findUnique({ where: { id: cardId }, select: { userId: true, totalSessions: true } })
  if (!existing) return NextResponse.json({ error: "Carte introuvable" }, { status: 404 })
  if (existing.userId !== userId) return NextResponse.json({ error: "Carte / membre incohérent" }, { status: 400 })

  const data: { remainingSessions?: number; expiresAt?: Date } = {}
  if (parsed.data.remainingSessions !== undefined) {
    // Don't allow setting more credits than the card was originally sold for
    if (parsed.data.remainingSessions > existing.totalSessions) {
      return NextResponse.json(
        { error: `Impossible : la carte d'origine fait ${existing.totalSessions} séances` },
        { status: 400 }
      )
    }
    data.remainingSessions = parsed.data.remainingSessions
  }
  if (parsed.data.expiresAt) data.expiresAt = new Date(parsed.data.expiresAt)

  const card = await prisma.courseCard.update({ where: { id: cardId }, data })
  return NextResponse.json({ card })
}

export async function DELETE(request: NextRequest, { params }: Params) {
  const session = await requireAdmin(request)
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
  const { id: userId, cardId } = await params

  const existing = await prisma.courseCard.findUnique({ where: { id: cardId }, select: { userId: true } })
  if (!existing) return NextResponse.json({ error: "Carte introuvable" }, { status: 404 })
  if (existing.userId !== userId) return NextResponse.json({ error: "Carte / membre incohérent" }, { status: 400 })

  // Soft-cancel: set credits to 0 and expire immediately. Keeps the row for
  // audit/history (a hard delete would cascade-delete bookings linked to it).
  const card = await prisma.courseCard.update({
    where: { id: cardId },
    data: { remainingSessions: 0, expiresAt: new Date() },
  })
  return NextResponse.json({ card, action: "cancelled" })
}
