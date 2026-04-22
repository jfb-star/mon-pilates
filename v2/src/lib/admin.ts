import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { isAllowedOrigin } from "@/lib/utils"

type AllowedRole = "ADMIN" | "INSTRUCTOR"

/**
 * Shared gate used by requireAdmin/requireStaff. Performs:
 *  - Origin check on mutations (defence-in-depth CSRF on top of SameSite=Lax cookies)
 *  - Session lookup
 *  - Fresh DB role check (never trust JWT-only claims)
 */
async function gate(allowed: ReadonlyArray<AllowedRole>, request?: Request) {
  if (request) {
    const method = request.method.toUpperCase()
    const isMutation =
      method === "POST" || method === "PATCH" || method === "PUT" || method === "DELETE"
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

  if (!user?.role || !allowed.includes(user.role as AllowedRole)) return null

  return session
}

/**
 * Strict ADMIN-only gate. Use for routes that touch user accounts, email
 * marketing, contact messages, course-types, schedules, or instructor
 * management — anything an instructor should not be able to mutate.
 *
 * When a Request is passed, mutation methods (POST/PATCH/PUT/DELETE) also
 * require the Origin header to match an allowed origin — a defence-in-depth
 * CSRF check on top of SameSite=Lax cookies.
 */
export async function requireAdmin(request?: Request) {
  return gate(["ADMIN"], request)
}

/**
 * Staff gate — ADMIN or INSTRUCTOR. Use for routes where instructors
 * legitimately need access (e.g. their own bookings/sessions listings).
 * Route handlers are still responsible for filtering data to the caller
 * when the caller is an INSTRUCTOR.
 */
export async function requireStaff(request?: Request) {
  return gate(["ADMIN", "INSTRUCTOR"], request)
}
