import { NextResponse } from "next/server"
import { hash } from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { validateResetToken, consumeResetToken } from "@/lib/password-reset"
import { isAllowedOrigin } from "@/lib/utils"

export async function POST(request: Request) {
  if (!isAllowedOrigin(request.headers.get("origin"))) {
    return NextResponse.json({ error: "Origine non autorisée" }, { status: 403 })
  }

  try {
    const body = await request.json()
    const { token, password } = body

    if (!token || !password) {
      return NextResponse.json(
        { error: "Le token et le mot de passe sont requis." },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Le mot de passe doit contenir au moins 8 caractères." },
        { status: 400 }
      )
    }

    // Validate token
    const tokenData = await validateResetToken(token)
    if (!tokenData) {
      return NextResponse.json(
        { error: "Ce lien est invalide ou a expiré. Veuillez refaire une demande." },
        { status: 400 }
      )
    }

    // Hash new password and update user
    const passwordHash = await hash(password, 12)
    await prisma.user.update({
      where: { id: tokenData.userId },
      data: { passwordHash },
    })

    // Mark the token as used (idempotent; cron can purge old rows)
    await consumeResetToken(token)

    return NextResponse.json({
      message: "Votre mot de passe a été réinitialisé avec succès.",
    })
  } catch {
    return NextResponse.json(
      { error: "Erreur lors de la réinitialisation du mot de passe." },
      { status: 500 }
    )
  }
}
