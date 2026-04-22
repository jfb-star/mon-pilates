import "server-only"

import crypto from "node:crypto"

/**
 * HMAC-based unsubscribe token.
 *
 * Token format:  base64url(email) + "." + base64url(hmac_sha256(email, secret))
 *
 * - Non-expiring (unsubscribe links appear in archived emails that may be
 *   opened years later; we don't want the link to rot).
 * - Constant-time comparison on verify.
 * - No PII leaked in URLs beyond the email itself, which the user already
 *   owns.
 */

function getSecret(): string {
  const secret = process.env.UNSUBSCRIBE_SECRET
  if (!secret) {
    throw new Error(
      "[unsubscribe-token] UNSUBSCRIBE_SECRET env variable is not set"
    )
  }
  return secret
}

function b64urlEncode(input: Buffer | string): string {
  const buf = typeof input === "string" ? Buffer.from(input, "utf8") : input
  return buf
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "")
}

function b64urlDecode(input: string): Buffer {
  const pad = input.length % 4 === 0 ? "" : "=".repeat(4 - (input.length % 4))
  const normalized = input.replace(/-/g, "+").replace(/_/g, "/") + pad
  return Buffer.from(normalized, "base64")
}

function hmac(email: string, secret: string): string {
  return b64urlEncode(
    crypto.createHmac("sha256", secret).update(email).digest()
  )
}

export function sign(email: string): string {
  const secret = getSecret()
  const normalized = email.trim().toLowerCase()
  const sig = hmac(normalized, secret)
  return `${b64urlEncode(normalized)}.${sig}`
}

/**
 * Returns the email if the token is valid, else null.
 * Uses timingSafeEqual to prevent timing attacks on the signature check.
 */
export function verify(token: string | null | undefined): string | null {
  if (!token || typeof token !== "string") return null

  const parts = token.split(".")
  if (parts.length !== 2) return null

  const [emailPart, sigPart] = parts
  if (!emailPart || !sigPart) return null
  let email: string
  try {
    email = b64urlDecode(emailPart).toString("utf8")
  } catch {
    return null
  }

  const expected = hmac(email, getSecret())

  const a = Buffer.from(sigPart)
  const b = Buffer.from(expected)
  if (a.length !== b.length) return null
  if (!crypto.timingSafeEqual(a, b)) return null

  return email
}
