import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { z } from "zod"
import { requireAdmin } from "@/lib/admin"
import { prisma } from "@/lib/prisma"
import type { Prisma } from "@prisma/client"

const paginationSchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(50),
  offset: z.coerce.number().int().min(0).default(0),
})

// GET: list email logs with filters
export async function GET(request: NextRequest) {
  const session = await requireAdmin(request)
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
  }

  const { searchParams } = new URL(request.url)
  const parsed = paginationSchema.safeParse({
    limit: searchParams.get("limit") ?? undefined,
    offset: searchParams.get("offset") ?? undefined,
  })
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Paramètres de pagination invalides." },
      { status: 400 }
    )
  }
  const { limit, offset } = parsed.data

  const templateKey = searchParams.get("templateKey")
  const status = searchParams.get("status")
  const email = searchParams.get("email")
  const from = searchParams.get("from")
  const to = searchParams.get("to")

  const where: Prisma.EmailLogWhereInput = {}
  if (templateKey) where.templateKey = templateKey
  if (status) where.status = status
  if (email) where.toEmail = { contains: email }
  if (from || to) {
    const sentAt: Prisma.DateTimeFilter = {}
    if (from) {
      const d = new Date(from)
      if (!isNaN(d.getTime())) sentAt.gte = d
    }
    if (to) {
      const d = new Date(to)
      if (!isNaN(d.getTime())) {
        // include the whole "to" day
        const end = new Date(d)
        end.setDate(end.getDate() + 1)
        sentAt.lt = end
      }
    }
    where.sentAt = sentAt
  }

  const [logs, total] = await Promise.all([
    prisma.emailLog.findMany({
      where,
      orderBy: { sentAt: "desc" },
      take: limit,
      skip: offset,
    }),
    prisma.emailLog.count({ where }),
  ])

  return NextResponse.json({
    logs: logs.map((l) => ({
      id: l.id,
      templateKey: l.templateKey,
      toEmail: l.toEmail,
      subject: l.subject,
      providerId: l.providerId,
      status: l.status,
      error: l.error,
      sentAt: l.sentAt.toISOString(),
    })),
    total,
    limit,
    offset,
  })
}
