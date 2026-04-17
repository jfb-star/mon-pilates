import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { rateLimit } from "@/lib/rate-limit"

export async function POST(request: NextRequest) {
  // Rate limit: 2 subscriptions per minute per IP
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown"
  const { allowed } = rateLimit(`newsletter:${ip}`, { maxRequests: 2, windowMs: 60_000 })

  if (!allowed) {
    return NextResponse.json(
      { error: "Veuillez patienter avant de réessayer." },
      { status: 429 }
    )
  }

  try {
    const body = await request.json()
    const { email: rawEmail } = body as { email?: string }

    // Sanitize: trim and enforce RFC 5321 max length (320 chars)
    const email = typeof rawEmail === "string" ? rawEmail.trim().slice(0, 320) : ""

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Email invalide." }, { status: 400 })
    }

    // TODO: When Brevo API key is configured, add to mailing list:
    // const brevoKey = process.env.BREVO_API_KEY
    // if (brevoKey) {
    //   await fetch("https://api.brevo.com/v3/contacts", {
    //     method: "POST",
    //     headers: {
    //       "api-key": brevoKey,
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({
    //       email,
    //       listIds: [2], // Newsletter list ID
    //       updateEnabled: true,
    //     }),
    //   })
    // }

    console.log("[newsletter] New subscriber:", email)

    return NextResponse.json({
      success: true,
      message: "Inscription confirmée !",
    })
  } catch {
    return NextResponse.json(
      { error: "Données invalides." },
      { status: 400 }
    )
  }
}
