import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { isAllowedOrigin } from "@/lib/utils"

/**
 * Require an ADMIN or INSTRUCTOR role.
 * Returns the session if authorized, null otherwise.
 * Always checks the database role (not just the JWT).
 *
 * When a Request is passed, mutation methods (POST/PATCH/PUT/DELETE) also
 * require the Origin header to match an allowed origin — a defence-in-depth
 * CSRF check on top of SameSite=Lax cookies.
 */
export async function requireAdmin(request?: Request) {
  if (request) {
    const method = request.method.toUpperCase()
    const isMutation = method === "POST" || method === "PATCH" || method === "PUT" || method === "DELETE"
    if (isMutation && !isAllowedOrigin(request.headers.get("origin"))) {
      return null
    }
  }

  const session = await auth()
  if (!session?.user?.id) return null

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  })

  if (user?.role !== "ADMIN" && user?.role !== "INSTRUCTOR") return null

  return session
}
