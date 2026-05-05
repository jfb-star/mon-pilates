/**
 * POST /api/admin/users/[id]/resend-activation
 *
 * Re-issue an activation/password-reset link to a member who hasn't yet
 * activated their account (typically a Bsport import where we don't know
 * the original password). Generates a fresh single-use token, persists its
 * SHA-256 hash via storeResetToken, and dispatches the migration template
 * (which renders the "Activer mon compte" CTA).
 *
 * For non-imported users (no `needsActivation` flag set), we fall back to
 * the standard password-reset template — same token mechanics, different
 * copy.
 *
 * Returns:
 *   200 { ok: true, channel: "bsport_migration_welcome" | "reset_password" }
 *   404 if the user doesn't exist
 */
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { randomBytes } from "crypto"
import { requireAdmin } from "@/lib/admin"
import { prisma } from "@/lib/prisma"
import { storeResetToken } from "@/lib/password-reset"
import { sendTemplate } from "@/lib/resend"
import { SITE_URL } from "@/lib/env"

interface Params { params: Promise<{ id: string }> }

function buildCardSummary(cards: { type: string; remainingSessions: number; expiresAt: Date }[]): string {
  const active = cards.filter((c) => c.remainingSessions > 0 && c.expiresAt > new Date())
  if (active.length === 0) return ""
  const c = active[0]!
  const dateStr = c.expiresAt.toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" })
  const summary = `Carte ${c.type} séances — ${c.remainingSessions} séance${c.remainingSessions > 1 ? "s" : ""} restante${c.remainingSessions > 1 ? "s" : ""}, valable jusqu'au ${dateStr}`
  return `<div style="margin:16px 0;padding:14px 18px;background-color:#faf7f3;border-left:4px solid #6b9fad;border-radius:4px;font-size:14px;color:#2c2c2c;">${summary}</div>`
}

export async function POST(request: NextRequest, { params }: Params) {
  const session = await requireAdmin(request)
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
  const { id } = await params

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      name: true,
      needsActivation: true,
      migrationSource: true,
      courseCards: {
        select: { type: true, remainingSessions: true, expiresAt: true },
        orderBy: { expiresAt: "desc" },
      },
    },
  })
  if (!user) return NextResponse.json({ error: "Membre introuvable" }, { status: 404 })

  const token = randomBytes(32).toString("hex")
  await storeResetToken(token, user.id)
  const activationUrl = `${SITE_URL}/reset-password?token=${token}`

  // Imported & not yet activated → migration welcome (richer copy + card summary)
  // Otherwise → plain reset-password
  const useMigrationTemplate = user.needsActivation && user.migrationSource === "BSPORT_IMPORT"
  const templateKey = useMigrationTemplate ? "bsport_migration_welcome" : "reset_password"

  try {
    await sendTemplate(templateKey, user.email, useMigrationTemplate
      ? { name: user.name, activationUrl, cardSummary: buildCardSummary(user.courseCards) }
      : { name: user.name, resetUrl: activationUrl }
    )
  } catch (err) {
    return NextResponse.json(
      { error: "Échec de l'envoi de l'email", detail: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    )
  }

  return NextResponse.json({ ok: true, channel: templateKey })
}
