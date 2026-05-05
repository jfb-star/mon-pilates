/**
 * GET /api/admin/sidebar-counts
 *
 * Tiny endpoint polled by the admin sidebar (~every 60s) to drive the
 * little numeric badges on nav items: unpaid bookings, new contact
 * messages, members still pending activation.
 *
 * Counts only — no PII — so we keep it cheap and cacheable. INSTRUCTOR
 * sees the same shape but the consumer (sidebar) only renders what's
 * relevant for their visible nav items.
 */
import { NextResponse } from "next/server"
import { requireStaff } from "@/lib/admin"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await requireStaff()
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 403 })

  const [unpaidBookings, newContactMessages, needsActivation] = await Promise.all([
    prisma.booking.count({
      where: { paymentStatus: "PENDING", status: { not: "CANCELLED" } },
    }),
    prisma.contactMessage.count({
      where: { status: "NEW" },
    }),
    prisma.user.count({
      where: { needsActivation: true },
    }),
  ])

  return NextResponse.json(
    { unpaidBookings, newContactMessages, needsActivation },
    {
      headers: {
        // Allow CDN to share for 30s but force re-validate so admins see fresh
        // numbers on the next poll cycle.
        "Cache-Control": "private, max-age=30, must-revalidate",
      },
    }
  )
}
