/**
 * POST /api/admin/users/[id]/send-email
 *
 * Send a personalised email to a single member from the admin panel.
 * Wraps the Resend client and writes an EmailLog row (templateKey =
 * "admin_manual"). The body is rendered as plain paragraphs inside the
 * shared `layout` template so the email matches the rest of the brand.
 *
 * Body: { subject: string, message: string, replyTo?: string }
 */
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { z } from "zod"
import { requireAdmin } from "@/lib/admin"
import { prisma } from "@/lib/prisma"
import { sendEmail } from "@/lib/resend"
import { layout } from "@/lib/email-templates"

interface Params { params: Promise<{ id: string }> }

const schema = z.object({
  subject: z.string().min(1).max(200),
  message: z.string().min(1).max(10_000),
  replyTo: z.string().email().optional(),
})

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
}

function paragraphsToHtml(body: string): string {
  return body
    .split(/\n{2,}/)
    .map((p) => `<p style="margin:0 0 14px;font-size:15px;color:#2c2c2c;line-height:1.6;">${escapeHtml(p).replace(/\n/g, "<br/>")}</p>`)
    .join("")
}

export async function POST(request: NextRequest, { params }: Params) {
  const session = await requireAdmin(request)
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
  const { id } = await params

  let body: unknown
  try { body = await request.json() } catch { return NextResponse.json({ error: "JSON invalide" }, { status: 400 }) }
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Champs invalides", details: parsed.error.issues }, { status: 400 })
  }

  const user = await prisma.user.findUnique({
    where: { id },
    select: { email: true, name: true },
  })
  if (!user) return NextResponse.json({ error: "Membre introuvable" }, { status: 404 })

  const html = layout(
    parsed.data.subject,
    `<h1 style="margin:0 0 16px;font-size:20px;color:#2c2c2c;">${escapeHtml(parsed.data.subject)}</h1>
     ${paragraphsToHtml(parsed.data.message)}`
  )

  try {
    const res = await sendEmail({
      to: user.email,
      subject: parsed.data.subject,
      html,
      text: parsed.data.message,
      replyTo: parsed.data.replyTo,
      templateKey: "admin_manual",
    })
    return NextResponse.json({ ok: true, id: res.id })
  } catch (err) {
    return NextResponse.json(
      { error: "Échec de l'envoi", detail: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    )
  }
}
