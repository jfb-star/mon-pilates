import "server-only"

import { sign } from "@/lib/unsubscribe-token"

/**
 * Build a public unsubscribe URL for the given email.
 * Uses NEXT_PUBLIC_SITE_URL (falls back to NEXTAUTH_URL then localhost).
 */
export function getUnsubscribeUrl(email: string): string {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.NEXTAUTH_URL ??
    "http://localhost:3456"
  const token = sign(email)
  return `${base.replace(/\/$/, "")}/unsubscribe?token=${encodeURIComponent(token)}`
}
