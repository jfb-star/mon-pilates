import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ isFirstTimer: true })
  }

  const count = await prisma.booking.count({
    where: {
      userId: session.user.id,
      status: { not: "CANCELLED" },
    },
  })

  return NextResponse.json({ isFirstTimer: count === 0 })
}
