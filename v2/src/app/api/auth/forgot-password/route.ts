import { NextResponse } from "next/server"
import { randomUUID } from "crypto"
import { prisma } from "@/lib/prisma"
import { checkRateLimit } from "@/lib/rate-limit"
import { storeResetToken } from "@/lib/password-reset"
import { sendPasswordReset } from "@/lib/email"
import { isAllowedOrigin } from "@/lib/utils"

export async function POST(request: Request) {
  if (!isAllowedOrigin(request.headers.get("origin"))) {
    return NextResponse.json({ error: "Origine non autorisée" }, { status: 403 })
  }

  // Rate limit: 5 per 15 minutes per IP (combined with per-email below)
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  const { allowed, resetAt } = await checkRateLimit(`forgot-password:${ip}`, {
    maxRequests: 5,
    windowMs: 15 * 60 * 1000,
  })
  if (!allowed) {
    const retryAfter = Math.max(1, Math.ceil((resetAt - Date.now()) / 1000))
    return NextResponse.json(
      { error: "Trop de tentatives. Réessayez dans quelques minutes." },
      { status: 429, headers: { "Retry-After": String(retryAfter) } }
    )
  }

  try {
    const body = await request.json()
    const email = (body.email as string)?.toLowerCase().trim()

    if (!email) {
      return NextResponse.json(
        { error: "L'adresse email est requise." },
        { status: 400 }
      )
    }

    // Additional rate limit: 5 per 15 minutes per email address.
    // Prevents account-specific spam even if the attacker rotates IPs.
    const { allowed: emailAllowed } = await checkRateLimit(`forgot-password:email:${email}`, {
      maxRequests: 5,
      windowMs: 15 * 60 * 1000,
    })
    if (!emailAllowed) {
      // Return the same generic 200 body we'd send for non-existent users,
      // so a probing attacker can't distinguish throttled from real responses.
      return NextResponse.json({
        message: "Si un compte existe avec cet email, vous recevrez un lien de réinitialisation.",
      })
    }

    // Always return 200 to not reveal if email exists
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, name: true, email: true },
    })

    if (user) {
      const token = randomUUID()
      await storeResetToken(token, user.id)
      sendPasswordReset({ to: user.email, name: user.name, resetToken: token }).catch(() => {
        // Silently ignore email send failures
      })
    }

    return NextResponse.json({
      message: "Si un compte existe avec cet email, vous recevrez un lien de réinitialisation.",
    })
  } catch {
    return NextResponse.json(
      { error: "Erreur lors du traitement de la demande." },
      { status: 500 }
    )
  }
}
