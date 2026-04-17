import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

/**
 * Require an ADMIN or INSTRUCTOR role.
 * Returns the session if authorized, null otherwise.
 * Always checks the database role (not just the JWT).
 */
export async function requireAdmin() {
  const session = await auth()
  if (!session?.user?.id) return null

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  })

  if (user?.role !== "ADMIN" && user?.role !== "INSTRUCTOR") return null

  return session
}
