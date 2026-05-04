/**
 * Member detail page (admin only).
 *
 * Server component fetches the full user record (profile + all cards +
 * recent bookings + recent payments) then renders a client component for
 * the interactive parts (edit profile, edit/cancel cards).
 */
import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { requireStaff } from "@/lib/admin"
import { prisma } from "@/lib/prisma"
import { MemberDetailClient, type MemberDetail } from "./MemberDetailClient"

export const dynamic = "force-dynamic"

export default async function MemberDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await requireStaff()
  if (!session) redirect("/connexion?returnTo=/admin")
  const { id } = await params

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true, name: true, email: true, phone: true,
      birthday: true, addressLine: true, postalCode: true, city: true, country: true,
      role: true, createdAt: true,
      bsportId: true, bsportConsumerId: true,
      migrationSource: true, needsActivation: true,
      courseCards: {
        orderBy: { purchasedAt: "desc" },
        select: {
          id: true, type: true, totalSessions: true, remainingSessions: true,
          purchasedAt: true, expiresAt: true, bsportId: true,
          payment: { select: { id: true, amount: true, currency: true, status: true, externalProvider: true } },
        },
      },
      bookings: {
        orderBy: { createdAt: "desc" },
        take: 30,
        select: {
          id: true, status: true, paymentMethod: true, paymentStatus: true,
          createdAt: true, cancelledAt: true, paidAt: true,
          session: { select: {
            date: true, startTime: true, endTime: true,
            courseType: { select: { name: true, slug: true } },
            instructor: { select: { user: { select: { name: true } } } },
          } },
        },
      },
      payments: {
        orderBy: { createdAt: "desc" },
        take: 30,
        select: {
          id: true, amount: true, currency: true, status: true, type: true,
          stripeCheckoutSessionId: true, stripePaymentIntentId: true,
          externalProvider: true, createdAt: true,
        },
      },
    },
  })

  if (!user) notFound()

  // Serialize Date → string for the client boundary. After JSON round-trip,
  // all Date fields become ISO strings, matching the MemberDetail shape.
  const safeUser = JSON.parse(JSON.stringify(user)) as MemberDetail

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <Link href="/admin" className="inline-flex items-center gap-1 text-sm text-mp-ocean hover:underline mb-4">
        <ChevronLeft className="w-4 h-4" /> Retour à l&apos;admin
      </Link>
      <MemberDetailClient initialUser={safeUser} />
    </main>
  )
}
