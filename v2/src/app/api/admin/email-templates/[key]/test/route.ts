import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { requireAdmin } from "@/lib/admin"
import { prisma } from "@/lib/prisma"
import { sendTemplate } from "@/lib/resend"

type Ctx = { params: Promise<{ key: string }> }

// POST: send a test email for this template
export async function POST(request: NextRequest, ctx: Ctx) {
  const session = await requireAdmin()
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
  }

  try {
    const { key } = await ctx.params
    const body = await request.json()
    const email = typeof body?.email === "string" ? body.email.trim() : ""

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Email invalide." }, { status: 400 })
    }

    const t = await prisma.emailTemplate.findUnique({ where: { key } })
    if (!t) {
      return NextResponse.json({ error: "Template introuvable." }, { status: 404 })
    }

    let variables: string[] = []
    try {
      const parsed: unknown = JSON.parse(t.variables)
      if (Array.isArray(parsed)) variables = parsed.filter((v): v is string => typeof v === "string")
    } catch {
      variables = []
    }

    const sampleVars: Record<string, string> = {}
    for (const v of variables) sampleVars[v] = `${v} sample`

    const result = await sendTemplate(key, email, sampleVars)
    return NextResponse.json({ id: result.id, message: "Email de test envoyé." })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur inconnue"
    return NextResponse.json(
      { error: `Erreur lors de l'envoi: ${message}` },
      { status: 500 }
    )
  }
}
