import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

/**
 * POST /api/gift-cards/redeem
 * Redeem a gift card code and apply it to the authenticated user's account.
 */
export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Connectez-vous pour utiliser une carte cadeau." }, { status: 401 })
  }

  const userId = session.user.id

  try {
    const body = await req.json()
    const { code } = body as { code?: string }

    if (!code || typeof code !== "string") {
      return NextResponse.json({ error: "Code de carte cadeau requis." }, { status: 400 })
    }

    // Validate format: MP-XXXX-XXXX
    const codePattern = /^MP-[A-Z0-9]{4}-[A-Z0-9]{4}$/
    if (!codePattern.test(code.trim().toUpperCase())) {
      return NextResponse.json({ error: "Format de code invalide. Attendu : MP-XXXX-XXXX." }, { status: 400 })
    }

    const normalizedCode = code.trim().toUpperCase()

    // Look up the gift card
    const giftCard = await prisma.giftCard.findUnique({
      where: { code: normalizedCode },
    })

    if (!giftCard) {
      return NextResponse.json({ error: "Carte cadeau introuvable." }, { status: 404 })
    }

    // Validate status
    if (giftCard.status !== "ACTIVE") {
      return NextResponse.json({ error: "Cette carte cadeau a déjà été utilisée ou est inactive." }, { status: 400 })
    }

    // Validate expiration
    if (giftCard.expiresAt < new Date()) {
      return NextResponse.json({ error: "Cette carte cadeau est expirée." }, { status: 400 })
    }

    // Validate not already redeemed by another user
    if (giftCard.redeemedByUserId && giftCard.redeemedByUserId !== userId) {
      return NextResponse.json({ error: "Cette carte cadeau a déjà été utilisée par un autre compte." }, { status: 400 })
    }

    // Gift card with sessions (course sessions)
    if (giftCard.sessions && giftCard.sessions > 0) {
      const sessionsToGrant = giftCard.remainingSessions ?? giftCard.sessions

      // Create a CourseCard for the user
      // We need a payment record for the CourseCard relation
      const result = await prisma.$transaction(async (tx) => {
        // Create a placeholder payment for the gift card redemption
        const payment = await tx.payment.create({
          data: {
            userId,
            amount: 0,
            currency: "eur",
            status: "COMPLETED",
            type: "GIFT_CARD",
            metadata: JSON.stringify({ giftCardCode: normalizedCode }),
          },
        })

        // Create course card
        await tx.courseCard.create({
          data: {
            userId,
            paymentId: payment.id,
            type: "GIFT_CARD",
            totalSessions: sessionsToGrant,
            remainingSessions: sessionsToGrant,
            purchasedAt: new Date(),
            expiresAt: giftCard.expiresAt,
          },
        })

        // Update gift card status
        await tx.giftCard.update({
          where: { id: giftCard.id },
          data: {
            redeemedByUserId: userId,
            redeemedAt: new Date(),
            status: "REDEEMED",
            remainingSessions: 0,
          },
        })

        return sessionsToGrant
      })

      return NextResponse.json({
        ok: true,
        type: "sessions",
        sessions: result,
        message: `Carte cadeau activée ! ${result} séance${result > 1 ? "s" : ""} ajoutée${result > 1 ? "s" : ""} à votre compte.`,
      })
    }

    // Gift card with amount (money value)
    if (giftCard.amount && giftCard.amount > 0) {
      const amountToCredit = giftCard.remainingAmount ?? giftCard.amount

      await prisma.giftCard.update({
        where: { id: giftCard.id },
        data: {
          redeemedByUserId: userId,
          redeemedAt: new Date(),
          // Keep status ACTIVE so the remaining amount can be used
          // Only mark REDEEMED when fully spent
        },
      })

      const amountInEuros = amountToCredit / 100

      return NextResponse.json({
        ok: true,
        type: "amount",
        amount: amountToCredit,
        message: `Carte cadeau activée ! ${amountInEuros.toFixed(2)} € de crédit ajouté à votre compte.`,
      })
    }

    return NextResponse.json({ error: "Carte cadeau invalide : aucune valeur associée." }, { status: 400 })
  } catch (err) {
    console.error("[gift-cards/redeem]", err)
    return NextResponse.json({ error: "Erreur lors de l'activation de la carte cadeau." }, { status: 500 })
  }
}
