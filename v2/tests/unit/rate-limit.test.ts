import { describe, it, expect, beforeEach } from "vitest"
import { checkRateLimit } from "@/lib/rate-limit"

// These tests cover the in-memory fallback only (no Upstash env set).
// Upstash branch is exercised manually in staging.

describe("checkRateLimit (in-memory fallback)", () => {
  let keyCounter = 0
  let key: string
  beforeEach(() => {
    // Unique key per test so the global memory store doesn't bleed.
    keyCounter += 1
    key = `test:${keyCounter}:${Date.now()}`
  })

  it("allows the first request", async () => {
    const r = await checkRateLimit(key, { maxRequests: 3, windowMs: 60_000 })
    expect(r.allowed).toBe(true)
    expect(r.remaining).toBe(2)
  })

  it("allows up to maxRequests", async () => {
    const opts = { maxRequests: 3, windowMs: 60_000 }
    const r1 = await checkRateLimit(key, opts)
    const r2 = await checkRateLimit(key, opts)
    const r3 = await checkRateLimit(key, opts)
    expect([r1.allowed, r2.allowed, r3.allowed]).toEqual([true, true, true])
    expect(r3.remaining).toBe(0)
  })

  it("blocks after maxRequests is exceeded", async () => {
    const opts = { maxRequests: 2, windowMs: 60_000 }
    await checkRateLimit(key, opts)
    await checkRateLimit(key, opts)
    const r3 = await checkRateLimit(key, opts)
    expect(r3.allowed).toBe(false)
    expect(r3.remaining).toBe(0)
  })

  it("isolates buckets by key", async () => {
    const opts = { maxRequests: 1, windowMs: 60_000 }
    const a = await checkRateLimit(`${key}:A`, opts)
    const b = await checkRateLimit(`${key}:B`, opts)
    expect(a.allowed).toBe(true)
    expect(b.allowed).toBe(true)
  })

  it("resets the bucket after windowMs elapses", async () => {
    const opts = { maxRequests: 1, windowMs: 50 }
    const r1 = await checkRateLimit(key, opts)
    const r2 = await checkRateLimit(key, opts)
    expect(r1.allowed).toBe(true)
    expect(r2.allowed).toBe(false)
    await new Promise((r) => setTimeout(r, 80))
    const r3 = await checkRateLimit(key, opts)
    expect(r3.allowed).toBe(true)
  })

  it("returns a resetAt timestamp in the future", async () => {
    const before = Date.now()
    const r = await checkRateLimit(key, { maxRequests: 5, windowMs: 10_000 })
    expect(r.resetAt).toBeGreaterThanOrEqual(before)
    expect(r.resetAt).toBeLessThanOrEqual(before + 10_000 + 100)
  })
})
