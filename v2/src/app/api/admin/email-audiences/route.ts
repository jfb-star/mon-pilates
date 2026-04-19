import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { requireAdmin } from "@/lib/admin"
import { listAudiences, createAudience } from "@/lib/resend"

// GET: list Resend audiences
export async function GET() {
  const session = await requireAdmin()
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
  }

  try {
    const audiences = await listAudiences()
    return NextResponse.json({ audiences })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur inconnue"
    return NextResponse.json(
      { error: `Erreur Resend: ${message}` },
      { status: 500 }
    )
  }
}

// POST: create Resend audience
export async function POST(request: NextRequest) {
  const session = await requireAdmin()
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
  }

  try {
    const body = await request.json()
    const name = typeof body?.name === "string" ? body.name.trim() : ""
    if (!name) {
      return NextResponse.json({ error: "Le nom est requis." }, { status: 400 })
    }

    const { id } = await createAudience(name)
    return NextResponse.json({ id, name }, { status: 201 })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur inconnue"
    return NextResponse.json(
      { error: `Erreur Resend: ${message}` },
      { status: 500 }
    )
  }
}
