import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { isAllowedOrigin, sanitizeString } from "@/lib/utils"
import { prisma } from "@/lib/prisma"

/** Max length for a gift card code query param */
const MAX_CODE_LENGTH = 30

/**
 * GET /api/gift-cards?code=MP-XXXX-XXXX
 * Validate a gift card code without redeeming it.
 */
export async function GET(request: NextRequest) {
  const rawCode = request.nextUrl.searchParams.get("code") || ""
  const code = sanitizeString(rawCode, MAX_CODE_LENGTH)
  if (!code) {
    return NextResponse.json({ error: "Code requis." }, { status: 400 })
  }

  try {
    const giftCard = await prisma.giftCard.findUnique({
      where: { code: code.trim().toUpperCase() },
    })

    if (!giftCard) {
      return NextResponse.json({ valid: false, error: "Carte cadeau introuvable." })
    }

    // Check if usable
    const isExpired = giftCard.expiresAt < new Date()
    const isRedeemed = giftCard.status === "REDEEMED"
    const isInactive = giftCard.status !== "ACTIVE"

    if (isExpired || isRedeemed || isInactive) {
      return NextResponse.json({
        valid: false,
        error: isExpired
          ? "Cette carte cadeau est expirée."
          : "Cette carte cadeau a déjà été utilisée.",
      })
    }

    // Return minimal info about the card
    if (giftCard.sessions && giftCard.sessions > 0) {
      return NextResponse.json({
        valid: true,
        type: "sessions",
        value: giftCard.remainingSessions ?? giftCard.sessions,
      })
    }

    if (giftCard.amount && giftCard.amount > 0) {
      return NextResponse.json({
        valid: true,
        type: "amount",
        value: giftCard.remainingAmount ?? giftCard.amount,
      })
    }

    return NextResponse.json({ valid: false, error: "Carte cadeau invalide." })
  } catch (err) {
    console.error("[gift-cards/GET]", err)
    return NextResponse.json({ error: "Erreur lors de la vérification." }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  // Origin check -- reject cross-origin requests
  const origin = request.headers.get("origin")
  if (!isAllowedOrigin(origin)) {
    return NextResponse.json(
      { error: "Origine non autorisée." },
      { status: 403 }
    )
  }

  // TODO: Validate input, create Stripe checkout session, generate gift card code
  return NextResponse.json(
    { message: "Gift cards POST - not yet implemented" },
    { status: 501 }
  )
}
