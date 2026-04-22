import { describe, it, expect, vi, beforeEach } from "vitest"

// Mock the Resend wrapper so no real network call is attempted.
vi.mock("@/lib/resend", () => ({
  sendEmail: vi.fn().mockResolvedValue({ id: "msg_123" }),
}))

// Prisma is a transitive dep through @/lib/resend — mock it too so we don't
// try to spin up a real client.
vi.mock("@/lib/prisma", () => ({
  prisma: {
    emailLog: { create: vi.fn().mockResolvedValue({}) },
    emailTemplate: { findUnique: vi.fn().mockResolvedValue(null) },
  },
}))

import { sendEmail } from "@/lib/resend"
import { sendMarketingEmail } from "@/lib/email-marketing"

type MockedSendEmail = typeof sendEmail & ReturnType<typeof vi.fn>

describe("sendMarketingEmail", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(sendEmail as MockedSendEmail).mockResolvedValue({ id: "msg_123" })
  })

  it("forwards the message id from the underlying transport", async () => {
    const result = await sendMarketingEmail({
      to: "alice@example.com",
      subject: "Hello",
      html: "<p>Hi</p>",
    })
    expect(result).toEqual({ id: "msg_123" })
    expect(sendEmail).toHaveBeenCalledTimes(1)
  })

  it("injects the unsubscribe footer before </body> when present", async () => {
    await sendMarketingEmail({
      to: "alice@example.com",
      subject: "Hello",
      html: "<html><body><p>Hi</p></body></html>",
    })
    const call = (sendEmail as MockedSendEmail).mock.calls[0][0] as {
      html: string
    }
    expect(call.html).toMatch(/<\/body>/)
    expect(call.html).toContain("Se désinscrire")
    // Footer must sit before </body>, not after.
    const footerIdx = call.html.indexOf("Se désinscrire")
    const bodyCloseIdx = call.html.indexOf("</body>")
    expect(footerIdx).toBeLessThan(bodyCloseIdx)
  })

  it("appends the footer when no </body> tag exists", async () => {
    await sendMarketingEmail({
      to: "alice@example.com",
      subject: "Hello",
      html: "<p>Plain fragment</p>",
    })
    const call = (sendEmail as MockedSendEmail).mock.calls[0][0] as {
      html: string
    }
    expect(call.html.startsWith("<p>Plain fragment</p>")).toBe(true)
    expect(call.html).toContain("Se désinscrire")
  })

  it("points the unsubscribe link at the /unsubscribe endpoint", async () => {
    await sendMarketingEmail({
      to: "alice@example.com",
      subject: "Hello",
      html: "<p>Hi</p>",
    })
    const call = (sendEmail as MockedSendEmail).mock.calls[0][0] as {
      html: string
    }
    expect(call.html).toMatch(/\/unsubscribe\?token=/)
  })

  it("appends a text footer when text is provided", async () => {
    await sendMarketingEmail({
      to: "alice@example.com",
      subject: "Hello",
      html: "<p>Hi</p>",
      text: "Hello Alice",
    })
    const call = (sendEmail as MockedSendEmail).mock.calls[0][0] as {
      text?: string
    }
    expect(call.text).toBeDefined()
    expect(call.text).toContain("Hello Alice")
    expect(call.text).toContain("Se désinscrire")
    expect(call.text).toMatch(/https?:\/\/\S+\/unsubscribe\?token=/)
  })

  it("omits text when not provided", async () => {
    await sendMarketingEmail({
      to: "alice@example.com",
      subject: "Hello",
      html: "<p>Hi</p>",
    })
    const call = (sendEmail as MockedSendEmail).mock.calls[0][0] as {
      text?: string
    }
    expect(call.text).toBeUndefined()
  })

  it("adds a category=marketing tag (and preserves caller tags)", async () => {
    await sendMarketingEmail({
      to: "alice@example.com",
      subject: "Hello",
      html: "<p>Hi</p>",
      tags: [{ name: "campaign", value: "spring-2026" }],
    })
    const call = (sendEmail as MockedSendEmail).mock.calls[0][0] as {
      tags: { name: string; value: string }[]
    }
    expect(call.tags).toContainEqual({ name: "campaign", value: "spring-2026" })
    expect(call.tags).toContainEqual({ name: "category", value: "marketing" })
  })

  it("forwards replyTo, subject, to, and templateKey as-is", async () => {
    await sendMarketingEmail({
      to: "alice@example.com",
      subject: "S",
      html: "<p>H</p>",
      replyTo: "support@example.com",
      templateKey: "newsletter-weekly",
    })
    const call = (sendEmail as MockedSendEmail).mock.calls[0][0] as Record<
      string,
      unknown
    >
    expect(call.to).toBe("alice@example.com")
    expect(call.subject).toBe("S")
    expect(call.replyTo).toBe("support@example.com")
    expect(call.templateKey).toBe("newsletter-weekly")
  })

  it("produces different unsubscribe links per recipient", async () => {
    await sendMarketingEmail({
      to: "a@example.com",
      subject: "Hello",
      html: "<p>Hi</p>",
    })
    await sendMarketingEmail({
      to: "b@example.com",
      subject: "Hello",
      html: "<p>Hi</p>",
    })
    const calls = (sendEmail as MockedSendEmail).mock.calls
    const urlA = String(calls[0][0].html).match(
      /\/unsubscribe\?token=([^"\s]+)/
    )?.[1]
    const urlB = String(calls[1][0].html).match(
      /\/unsubscribe\?token=([^"\s]+)/
    )?.[1]
    expect(urlA).toBeTruthy()
    expect(urlB).toBeTruthy()
    expect(urlA).not.toEqual(urlB)
  })
})
