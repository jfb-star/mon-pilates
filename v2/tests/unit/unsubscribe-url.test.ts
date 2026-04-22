import { describe, it, expect, beforeEach, afterEach } from "vitest"

describe("getUnsubscribeUrl", () => {
  const originalSite = process.env.NEXT_PUBLIC_SITE_URL
  const originalAuth = process.env.NEXTAUTH_URL

  beforeEach(() => {
    process.env.UNSUBSCRIBE_SECRET = "test-unsub-secret"
  })

  afterEach(() => {
    process.env.NEXT_PUBLIC_SITE_URL = originalSite
    process.env.NEXTAUTH_URL = originalAuth
  })

  async function freshImport() {
    // unsubscribe-url reads env at call-time via sign() + inline env lookup,
    // but we still want module isolation in case of future caching changes.
    return await import("@/lib/unsubscribe-url")
  }

  it("builds a URL on the configured NEXT_PUBLIC_SITE_URL", async () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://example.com"
    const { getUnsubscribeUrl } = await freshImport()
    const url = getUnsubscribeUrl("alice@example.com")
    expect(url.startsWith("https://example.com/unsubscribe?token=")).toBe(true)
  })

  it("strips trailing slash from the base URL", async () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://example.com/"
    const { getUnsubscribeUrl } = await freshImport()
    const url = getUnsubscribeUrl("alice@example.com")
    expect(url.startsWith("https://example.com/unsubscribe?token=")).toBe(true)
    expect(url.startsWith("https://example.com//unsubscribe")).toBe(false)
  })

  it("falls back to NEXTAUTH_URL when NEXT_PUBLIC_SITE_URL is unset", async () => {
    delete process.env.NEXT_PUBLIC_SITE_URL
    process.env.NEXTAUTH_URL = "https://auth.example.com"
    const { getUnsubscribeUrl } = await freshImport()
    const url = getUnsubscribeUrl("alice@example.com")
    expect(url.startsWith("https://auth.example.com/unsubscribe?token=")).toBe(true)
  })

  it("falls back to localhost:3456 when both env vars are unset", async () => {
    delete process.env.NEXT_PUBLIC_SITE_URL
    delete process.env.NEXTAUTH_URL
    const { getUnsubscribeUrl } = await freshImport()
    const url = getUnsubscribeUrl("alice@example.com")
    expect(url.startsWith("http://localhost:3456/unsubscribe?token=")).toBe(true)
  })

  it("URL-encodes the token", async () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://example.com"
    const { getUnsubscribeUrl } = await freshImport()
    const url = getUnsubscribeUrl("alice+tag@example.com")
    const token = new URL(url).searchParams.get("token")
    expect(token).toBeTruthy()
    // Token is base64url — it must not contain raw '+' / '/' / '='.
    expect(token).not.toMatch(/[+/=]/)
  })

  it("round-trips: token from url is verifiable", async () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://example.com"
    const { getUnsubscribeUrl } = await freshImport()
    const { verify } = await import("@/lib/unsubscribe-token")
    const url = getUnsubscribeUrl("bob@example.com")
    const token = new URL(url).searchParams.get("token")
    expect(verify(token)).toBe("bob@example.com")
  })

  it("produces different tokens for different emails", async () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://example.com"
    const { getUnsubscribeUrl } = await freshImport()
    const a = getUnsubscribeUrl("a@example.com")
    const b = getUnsubscribeUrl("b@example.com")
    expect(a).not.toBe(b)
  })
})
