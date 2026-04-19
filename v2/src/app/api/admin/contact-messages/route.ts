import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { requireAdmin } from "@/lib/admin"
import { prisma } from "@/lib/prisma"
import type { Prisma } from "@prisma/client"

// GET: list contact messages with optional status filter
export async function GET(request: NextRequest) {
  const session = await requireAdmin()
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
  }

  const { searchParams } = new URL(request.url)
  const status = searchParams.get("status")
  const limit = parseInt(searchParams.get("limit") ?? "100", 10)
  const offset = parseInt(searchParams.get("offset") ?? "0", 10)

  const where: Prisma.ContactMessageWhereInput = {}
  if (status) where.status = status

  const [messages, total, counts] = await Promise.all([
    prisma.contactMessage.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
    }),
    prisma.contactMessage.count({ where }),
    prisma.contactMessage.groupBy({
      by: ["status"],
      _count: { _all: true },
    }),
  ])

  const byStatus: Record<string, number> = { NEW: 0, READ: 0, HANDLED: 0 }
  for (const row of counts) byStatus[row.status] = row._count._all

  return NextResponse.json({
    messages: messages.map((m) => ({
      id: m.id,
      firstName: m.firstName,
      lastName: m.lastName,
      email: m.email,
      phone: m.phone,
      subject: m.subject,
      message: m.message,
      status: m.status,
      createdAt: m.createdAt,
    })),
    total,
    byStatus,
  })
}
