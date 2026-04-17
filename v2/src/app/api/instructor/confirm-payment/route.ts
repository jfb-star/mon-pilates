import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  })

  if (user?.role !== "INSTRUCTOR" && user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
  }

  let body: { bookingId?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Corps invalide" }, { status: 400 })
  }

  const { bookingId } = body
  if (!bookingId) {
    return NextResponse.json({ error: "bookingId requis" }, { status: 400 })
  }

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      session: { include: { instructor: true } },
      user: { select: { name: true } },
    },
  })

  if (!booking) {
    return NextResponse.json({ error: "Réservation introuvable" }, { status: 404 })
  }

  if (booking.paymentStatus === "PAID") {
    return NextResponse.json({ error: "Déjà payé" }, { status: 400 })
  }

  await prisma.booking.update({
    where: { id: bookingId },
    data: {
      paymentStatus: "PAID",
      paidAt: new Date(),
    },
  })

  return NextResponse.json({
    ok: true,
    userName: booking.user.name,
  })
}
