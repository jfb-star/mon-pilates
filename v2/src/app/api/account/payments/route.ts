import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  const payments = await prisma.payment.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
    select: {
      id: true,
      amount: true,
      currency: true,
      type: true,
      status: true,
      createdAt: true,
      stripeCheckoutSessionId: true,
    },
  })

  return NextResponse.json({
    payments: payments.map((p) => ({
      id: p.id,
      amount: p.amount,
      currency: p.currency,
      type: p.type,
      status: p.status,
      createdAt: p.createdAt.toISOString(),
      stripeCheckoutSessionId: p.stripeCheckoutSessionId,
    })),
  })
}
