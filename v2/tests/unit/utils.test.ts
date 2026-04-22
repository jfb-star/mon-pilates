import { describe, it, expect, afterEach, beforeEach } from "vitest"
import {
  cn,
  sanitizeString,
  isAllowedOrigin,
  formatPrice,
  formatDate,
  formatTime,
  generateGiftCardCode,
} from "@/lib/utils"

describe("cn", () => {
  it("joins class strings", () => {
    expect(cn("a", "b", "c")).toBe("a b c")
  })

  it("skips falsy values", () => {
    expect(cn("a", false, null, undefined, "b")).toBe("a b")
  })

  it("handles conditional objects", () => {
    expect(cn("base", { active: true, hidden: false })).toBe("base active")
  })

  it("returns empty string with no inputs", () => {
    expect(cn()).toBe("")
  })
})

describe("sanitizeString", () => {
  it("trims surrounding whitespace", () => {
    expect(sanitizeString("  hello  ", 10)).toBe("hello")
  })

  it("enforces max length", () => {
    expect(sanitizeString("abcdefghij", 5)).toBe("abcde")
  })

  it("handles empty strings", () => {
    expect(sanitizeString("", 10)).toBe("")
  })

  it("handles strings shorter than max", () => {
    expect(sanitizeString("hi", 100)).toBe("hi")
  })
})

describe("isAllowedOrigin", () => {
  const originalVercelEnv = process.env.VERCEL_ENV

  afterEach(() => {
    if (originalVercelEnv === undefined) {
      delete process.env.VERCEL_ENV
    } else {
      process.env.VERCEL_ENV = originalVercelEnv
    }
  })

  it("returns false for null/empty origin", () => {
    expect(isAllowedOrigin(null)).toBe(false)
    expect(isAllowedOrigin("")).toBe(false)
  })

  it("allows whitelisted apex domain", () => {
    expect(isAllowedOrigin("https://mon-pilates.bzh")).toBe(true)
  })

  it("allows whitelisted www subdomain", () => {
    expect(isAllowedOrigin("https://www.mon-pilates.bzh")).toBe(true)
  })

  it("allows localhost in dev/preview (non-prod)", () => {
    delete process.env.VERCEL_ENV
    expect(isAllowedOrigin("http://localhost:3456")).toBe(true)
    expect(isAllowedOrigin("http://127.0.0.1:3000")).toBe(true)
  })

  it("allows localhost in Vercel preview", () => {
    process.env.VERCEL_ENV = "preview"
    expect(isAllowedOrigin("http://localhost:3456")).toBe(true)
  })

  it("refuses localhost in Vercel production", () => {
    process.env.VERCEL_ENV = "production"
    expect(isAllowedOrigin("http://localhost:3456")).toBe(false)
    expect(isAllowedOrigin("http://127.0.0.1:3000")).toBe(false)
  })

  it("still allows whitelisted origins in production", () => {
    process.env.VERCEL_ENV = "production"
    expect(isAllowedOrigin("https://mon-pilates.bzh")).toBe(true)
  })

  it("refuses arbitrary origins", () => {
    expect(isAllowedOrigin("https://evil.com")).toBe(false)
    expect(isAllowedOrigin("https://mon-pilates.evil.com")).toBe(false)
  })

  it("refuses malformed origins", () => {
    expect(isAllowedOrigin("not a url")).toBe(false)
  })
})

describe("formatPrice", () => {
  it("formats whole euros", () => {
    // The intl output uses a non-breaking space; use toMatch instead of toBe.
    expect(formatPrice(2500)).toMatch(/25,00/)
    expect(formatPrice(2500)).toMatch(/€/)
  })

  it("formats zero", () => {
    expect(formatPrice(0)).toMatch(/0,00/)
  })

  it("formats fractional cents", () => {
    expect(formatPrice(1299)).toMatch(/12,99/)
  })

  it("formats large amounts", () => {
    // fr-FR thousand separator is a non-breaking space.
    const out = formatPrice(1234567)
    expect(out).toMatch(/12/)
    expect(out).toMatch(/345,67/)
  })
})

describe("formatDate", () => {
  it("formats a date in French long format", () => {
    const d = new Date(2026, 3, 11) // April 11 2026 (month is 0-indexed)
    const out = formatDate(d)
    expect(out).toMatch(/11/)
    expect(out).toMatch(/avril/)
    expect(out).toMatch(/2026/)
  })
})

describe("formatTime", () => {
  it("formats HH:00 as Hh", () => {
    expect(formatTime("14:00")).toBe("14h")
    expect(formatTime("09:00")).toBe("09h")
  })

  it("formats HH:MM as HhMM when minutes != 00", () => {
    expect(formatTime("14:30")).toBe("14h30")
    expect(formatTime("09:15")).toBe("09h15")
  })
})

describe("generateGiftCardCode", () => {
  it("matches the GIFT-XXXX-XXXX-XXXX shape", () => {
    const code = generateGiftCardCode()
    expect(code).toMatch(/^GIFT-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/)
  })

  it("never uses ambiguous chars (0, O, 1, I)", () => {
    for (let i = 0; i < 50; i++) {
      const code = generateGiftCardCode()
      const body = code.replace("GIFT-", "").replace(/-/g, "")
      expect(body).not.toMatch(/[0O1I]/)
    }
  })

  it("produces unique codes (statistical)", () => {
    const codes = new Set<string>()
    for (let i = 0; i < 50; i++) {
      codes.add(generateGiftCardCode())
    }
    expect(codes.size).toBe(50)
  })
})
