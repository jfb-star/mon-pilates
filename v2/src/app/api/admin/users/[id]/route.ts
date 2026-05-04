/**
 * Member detail API for the admin "/admin/users/[id]" page.
 *
 * GET    → full member view (profile + all cards + recent bookings + payments)
 * PATCH  → update profile fields (name, phone, address, birthday, role)
 * DELETE → not implemented; admins should archive (set needsActivation=true) instead
 *
 * All operations require ADMIN role; INSTRUCTOR may GET only.
 */
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { z } from "zod"
import { requireAdmin, requireStaff } from "@/lib/admin"
import { prisma } from "@/lib/prisma"

interface Params { params: Promise<{ id: string }> }

export async function GET(request: NextRequest, { params }: Params) {
  const session = await requireStaff(request)
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
  const { id } = await params

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      birthday: true,
      addressLine: true,
      postalCode: true,
      city: true,
      country: true,
      role: true,
      createdAt: true,
      bsportId: true,
      bsportConsumerId: true,
      migrationSource: true,
      needsActivation: true,
      // All cards (active + expired + empty), most recent first
      courseCards: {
        orderBy: { purchasedAt: "desc" },
        select: {
          id: true,
          type: true,
          totalSessions: true,
          remainingSessions: true,
          purchasedAt: true,
          expiresAt: true,
          bsportId: true,
          payment: { select: { id: true, amount: true, currency: true, status: true, externalProvider: true } },
        },
      },
      // Last 30 bookings
      bookings: {
        orderBy: { createdAt: "desc" },
        take: 30,
        select: {
          id: true,
          status: true,
          paymentMethod: true,
          paymentStatus: true,
          createdAt: true,
          cancelledAt: true,
          paidAt: true,
          session: {
            select: {
              id: true,
              date: true,
              startTime: true,
              endTime: true,
              courseType: { select: { name: true, slug: true } },
              instructor: { include: { user: { select: { name: true } } } },
            },
          },
        },
      },
      // Last 30 payments
      payments: {
        orderBy: { createdAt: "desc" },
        take: 30,
        select: {
          id: true,
          amount: true,
          currency: true,
          status: true,
          type: true,
          stripeCheckoutSessionId: true,
          stripePaymentIntentId: true,
          externalProvider: true,
          createdAt: true,
        },
      },
    },
  })

  if (!user) return NextResponse.json({ error: "Membre introuvable" }, { status: 404 })
  return NextResponse.json({ user })
}

const profileUpdateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  phone: z.string().max(20).nullable().optional(),
  birthday: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().optional(),
  addressLine: z.string().max(200).nullable().optional(),
  postalCode: z.string().max(20).nullable().optional(),
  city: z.string().max(100).nullable().optional(),
  country: z.string().max(100).nullable().optional(),
  // Role change requires ADMIN; we re-check below.
  role: z.enum(["USER", "ADMIN", "INSTRUCTOR"]).optional(),
  // Reset activation flag (e.g. resend invite email after).
  needsActivation: z.boolean().optional(),
})

export async function PATCH(request: NextRequest, { params }: Params) {
  const session = await requireAdmin(request)
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
  const { id } = await params

  let body: unknown
  try { body = await request.json() } catch { return NextResponse.json({ error: "JSON invalide" }, { status: 400 }) }
  const parsed = profileUpdateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Champs invalides", details: parsed.error.issues }, { status: 400 })
  }
  const data: Record<string, unknown> = { ...parsed.data }
  if (data.birthday && typeof data.birthday === "string") data.birthday = new Date(data.birthday)

  const user = await prisma.user.update({ where: { id }, data })
  return NextResponse.json({ user })
}
