import { NextResponse } from "next/server"
import { randomUUID } from "crypto"
import { prisma } from "@/lib/prisma"
import { rateLimit } from "@/lib/rate-limit"
import { storeResetToken } from "@/lib/password-reset"
import { sendPasswordReset } from "@/lib/email"

export async function POST(request: Request) {
  // Rate limit: 3 per 15 minutes per IP
  const ip = request.headers.get("x-forwarded-for") ?? "unknown"
  const { allowed } = rateLimit(`forgot-password:${ip}`, {
    maxRequests: 3,
    windowMs: 15 * 60 * 1000,
  })
  if (!allowed) {
    return NextResponse.json(
      { error: "Trop de tentatives. Réessayez dans quelques minutes." },
      { status: 429 }
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

    // Always return 200 to not reveal if email exists
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, name: true, email: true },
    })

    if (user) {
      const token = randomUUID()
      storeResetToken(token, user.id)
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
