/**
 * Admin layout — persistent sidebar nav for ALL /admin/* pages.
 *
 * Renders a left sidebar with the major sections + a content area for the
 * routed page. The sidebar uses the same role check as the pages it wraps,
 * so an unauthorised user never sees the chrome (avoids "looks broken"
 * during the 401 → /connexion redirect).
 */
import { redirect } from "next/navigation"
import { requireStaff } from "@/lib/admin"
import { AdminShell } from "./AdminShell"

export const dynamic = "force-dynamic"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requireStaff()
  if (!session) redirect("/connexion?returnTo=/admin")

  const u = session.user as { role?: string; name?: string | null; email?: string | null } | undefined
  const role = u?.role ?? "USER"
  const name = u?.name ?? "Membre"
  const email = u?.email ?? ""

  return <AdminShell role={role} userName={name} userEmail={email}>{children}</AdminShell>
}
