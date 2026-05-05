/**
 * POST /api/admin/users/[id]/payment-link
 *
 * Admin-side equivalent of /api/account/settle-unpaid: generate a Stripe
 * checkout URL covering all (or a subset) of the member's PENDING bookings,
 * and optionally email the link to them.
 *
 * Body: { bookingIds?: string[]; sendEmail?: boolean }
 *
 * Returns:
 *   200 { url, amount, count, emailed: boolean }
 *   400 if the member has no unpaid bookings
 *   404 if the member doesn't exist
 *
 * The Stripe metadata mirrors the member-driven settle-unpaid flow so the
 * existing webhook handler picks it up — no separate code path on success.
 */
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { z } from "zod"
import { requireAdmin } from "@/lib/admin"
import { prisma } from "@/lib/prisma"
import { stripe, SESSION_PRICE_CENTS } from "@/lib/stripe"
import { sendEmail } from "@/lib/resend"
import { layout, btn } from "@/lib/email-templates"
import { SITE_URL } from "@/lib/env"

interface Params { params: Promise<{ id: string }> }

const schema = z.object({
  bookingIds: z.array(z.string()).optional(),
  sendEmail: z.boolean().optional().default(false),
})

export async function POST(request: NextRequest, { params }: Params) {
  const session = await requireAdmin(request)
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
  const { id } = await params

  let body: unknown = {}
  try { body = await request.json() } catch { /* empty body ok */ }
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Champs invalides", details: parsed.error.issues }, { status: 400 })
  }
  const { bookingIds, sendEmail: shouldEmail } = parsed.data

  const user = await prisma.user.findUnique({
    where: { id },
    select: { id: true, email: true, name: true },
  })
  if (!user) return NextResponse.json({ error: "Membre introuvable" }, { status: 404 })

  const unpaid = await prisma.booking.findMany({
    where: {
      userId: user.id,
      paymentStatus: "PENDING",
      status: { not: "CANCELLED" },
      ...(bookingIds && bookingIds.length > 0 ? { id: { in: bookingIds } } : {}),
    },
    orderBy: { createdAt: "asc" },
    select: { id: true },
  })

  if (unpaid.length === 0) {
    return NextResponse.json({ error: "Aucune séance à régler" }, { status: 400 })
  }

  const origin = request.headers.get("origin") || SITE_URL
  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card", "link"],
    locale: "fr",
    customer_email: user.email,
    line_items: [
      {
        price_data: {
          currency: "eur",
          product_data: {
            name: `Régularisation ${unpaid.length} séance${unpaid.length > 1 ? "s" : ""}`,
          },
          unit_amount: SESSION_PRICE_CENTS,
        },
        quantity: unpaid.length,
      },
    ],
    metadata: {
      type: "settle-unpaid",
      userId: user.id,
      bookingIds: unpaid.map((b) => b.id).join(","),
      issuedBy: "admin",
    },
    success_url: `${origin}/compte?settled=1`,
    cancel_url: `${origin}/compte`,
  })

  if (!checkoutSession.url) {
    return NextResponse.json({ error: "Stripe n'a pas renvoyé d'URL" }, { status: 502 })
  }

  const amount = unpaid.length * SESSION_PRICE_CENTS
  let emailed = false

  if (shouldEmail) {
    const amountEur = (amount / 100).toFixed(2).replace(".", ",")
    const html = layout(
      "Lien de paiement",
      `<h1 style="margin:0 0 16px;font-size:20px;color:#2c2c2c;">Bonjour ${user.name},</h1>
       <p style="margin:0 0 12px;font-size:15px;color:#2c2c2c;line-height:1.6;">
         Vous avez <strong>${unpaid.length} séance${unpaid.length > 1 ? "s" : ""}</strong> en attente de règlement, soit <strong>${amountEur}&nbsp;€</strong>.
       </p>
       <p style="margin:0 0 12px;font-size:15px;color:#2c2c2c;line-height:1.6;">
         Vous pouvez régler en quelques secondes via le lien sécurisé ci-dessous (valable 24&nbsp;h)&nbsp;:
       </p>
       ${btn(checkoutSession.url, "Régler maintenant")}
       <p style="margin:16px 0 0;font-size:13px;color:#888;line-height:1.5;">
         Lien envoyé par l'équipe Mon&nbsp;Pilates. Une question&nbsp;? Répondez à cet email.
       </p>`
    )
    try {
      await sendEmail({
        to: user.email,
        subject: `Lien de paiement — ${unpaid.length} séance${unpaid.length > 1 ? "s" : ""}`,
        html,
        text: `Bonjour ${user.name},\n\nVous avez ${unpaid.length} séance${unpaid.length > 1 ? "s" : ""} à régler (${amountEur} €).\n\nRégler en ligne : ${checkoutSession.url}\n\nMon Pilates — Larmor-Plage`,
        templateKey: "admin_payment_link",
      })
      emailed = true
    } catch {
      // We still return the URL — the admin can copy/paste it manually.
      emailed = false
    }
  }

  return NextResponse.json({
    url: checkoutSession.url,
    amount,
    count: unpaid.length,
    emailed,
  })
}
