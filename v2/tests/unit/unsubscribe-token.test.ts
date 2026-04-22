import { describe, it, expect, beforeAll } from "vitest"

beforeAll(() => {
  process.env.UNSUBSCRIBE_SECRET = "test-secret-do-not-use-in-prod"
})

async function loadModule() {
  // Dynamic import so UNSUBSCRIBE_SECRET is set before the module reads it.
  return await import("@/lib/unsubscribe-token")
}

describe("unsubscribe-token", () => {
  it("sign + verify round-trips a valid email", async () => {
    const { sign, verify } = await loadModule()
    const token = sign("alice@example.com")
    expect(verify(token)).toBe("alice@example.com")
  })

  it("normalizes email to lowercase + trim before signing", async () => {
    const { sign, verify } = await loadModule()
    const token = sign("  Alice@Example.COM  ")
    expect(verify(token)).toBe("alice@example.com")
  })

  it("rejects a tampered signature", async () => {
    const { sign, verify } = await loadModule()
    const token = sign("bob@example.com")
    const [email, sig] = token.split(".")
    if (!sig) throw new Error("missing sig")
    // Flip a byte in the signature.
    const tampered = `${email}.${sig.slice(0, -1)}${sig.slice(-1) === "A" ? "B" : "A"}`
    expect(verify(tampered)).toBeNull()
  })

  it("rejects a tampered email part", async () => {
    const { sign, verify } = await loadModule()
    const token = sign("alice@example.com")
    const [, sig] = token.split(".")
    const fakeEmail = Buffer.from("eve@example.com").toString("base64url")
    expect(verify(`${fakeEmail}.${sig}`)).toBeNull()
  })

  it("rejects malformed tokens", async () => {
    const { verify } = await loadModule()
    expect(verify(null)).toBeNull()
    expect(verify(undefined)).toBeNull()
    expect(verify("")).toBeNull()
    expect(verify("no-dot")).toBeNull()
    expect(verify("a.b.c")).toBeNull()
  })

  it("produces url-safe tokens (no +, /, or =)", async () => {
    const { sign } = await loadModule()
    const token = sign("alice+tag@example.com")
    expect(token).not.toMatch(/[+/=]/)
  })
})
