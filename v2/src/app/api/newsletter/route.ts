import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { rateLimit } from "@/lib/rate-limit"
import { addContact } from "@/lib/resend"

/**
 * Newsletter signup — public endpoint.
 *
 * Rate limit: 5 requests per 15 min, keyed by both IP AND email (two buckets,
 * fail the request if either exceeds).  Returns a generic 200 on already-
 * subscribed to prevent enumeration.  Only malformed input returns 400.
 */

const NewsletterSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1)
    .max(320)
    .email(),
})

const RATE_OPTS = { maxRequests: 5, windowMs: 15 * 60_000 }

export async function POST(request: NextRequest): Promise<Response> {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown"

  const ipLimit = rateLimit(`newsletter:ip:${ip}`, RATE_OPTS)
  if (!ipLimit.allowed) {
    return NextResponse.json(
      { error: "Veuillez patienter avant de réessayer." },
      { status: 429 }
    )
  }

  let parsed: z.infer<typeof NewsletterSchema>
  try {
    const body = (await request.json()) as unknown
    parsed = NewsletterSchema.parse(body)
  } catch {
    return NextResponse.json({ error: "Email invalide." }, { status: 400 })
  }

  const email = parsed.email.toLowerCase()

  // Per-email rate limit — defence against a spammer rotating IPs.
  const emailLimit = rateLimit(`newsletter:email:${email}`, RATE_OPTS)
  if (!emailLimit.allowed) {
    return NextResponse.json(
      { error: "Veuillez patienter avant de réessayer." },
      { status: 429 }
    )
  }

  try {
    // Link to a User if one exists under this email.
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    })

    // Upsert — re-subscribe clears unsubscribedAt.
    const existing = await prisma.subscriber.findUnique({
      where: { email },
      select: { id: true },
    })

    const now = new Date()
    const subscriber = existing
      ? await prisma.subscriber.update({
          where: { email },
          data: {
            unsubscribedAt: null,
            userId: user?.id ?? undefined,
          },
        })
      : await prisma.subscriber.create({
          data: {
            email,
            consentAt: now,
            tags: JSON.stringify(["newsletter"]),
            userId: user?.id ?? null,
          },
        })

    // Push to Resend if we have an audience configured — fail-soft.
    const audienceId = process.env.RESEND_NEWSLETTER_AUDIENCE_ID
    if (audienceId) {
      try {
        const { id: contactId } = await addContact(audienceId, email)
        await prisma.subscriber.update({
          where: { id: subscriber.id },
          data: {
            resendContactId: contactId,
            resendAudienceId: audienceId,
          },
        })
      } catch (err) {
        console.warn("[newsletter] Resend addContact failed (non-fatal):", err)
      }
    } else {
      console.warn(
        "[newsletter] RESEND_NEWSLETTER_AUDIENCE_ID not set — skipping Resend push."
      )
    }

    return NextResponse.json({
      success: true,
      message: "Inscription confirmée !",
    })
  } catch (err) {
    console.error("[newsletter] signup failed:", err)
    // Generic 200-ish response is fine but we should signal an internal
    // problem distinctly from "already subscribed".  Use 500 here.
    return NextResponse.json(
      { error: "Une erreur est survenue." },
      { status: 500 }
    )
  }
}
