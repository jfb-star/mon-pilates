import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { Webhook } from "svix"
import { prisma } from "@/lib/prisma"

/**
 * Resend webhook receiver — verifies Svix-compatible signature BEFORE parsing
 * the body, then fans-out the event to narrow handlers.  Every handler is
 * wrapped in try/catch: we always return 200 quickly so Resend does not retry
 * on DB hiccups.
 *
 * Auth model: signature only.  Do NOT add requireAdmin() here.
 */

type ResendEventType =
  | "email.sent"
  | "email.delivered"
  | "email.delivery_delayed"
  | "email.bounced"
  | "email.complained"
  | "email.opened"
  | "email.clicked"
  | "contact.created"
  | "contact.updated"
  | "contact.deleted"

interface ResendEmailEventData {
  email_id?: string
  to?: string | string[]
  from?: string
  subject?: string
  // Bounce / complaint metadata — shape varies, we only rely on a free-text
  // reason field.
  bounce?: { message?: string; subType?: string; type?: string }
  reason?: string
}

interface ResendContactEventData {
  id?: string
  email?: string
  audience_id?: string
  first_name?: string
  last_name?: string
}

interface ResendEventPayload {
  type: ResendEventType
  created_at?: string
  data: ResendEmailEventData & ResendContactEventData
}

function firstRecipient(to: string | string[] | undefined): string | null {
  if (!to) return null
  if (Array.isArray(to)) return to[0] ?? null
  return to
}

async function handleEmailEvent(
  type: ResendEventType,
  data: ResendEmailEventData
): Promise<void> {
  const providerId = data.email_id
  if (!providerId) return

  const reason =
    data.bounce?.message ??
    data.bounce?.subType ??
    data.bounce?.type ??
    data.reason ??
    null

  try {
    if (type === "email.bounced") {
      await prisma.emailLog.updateMany({
        where: { providerId },
        data: { status: "BOUNCED", error: reason },
      })
    } else if (type === "email.complained") {
      await prisma.emailLog.updateMany({
        where: { providerId },
        data: { status: "FAILED", error: reason ?? "complaint" },
      })

      // Complaint → unsubscribe the recipient (hard opt-out).
      const email = firstRecipient(data.to)
      if (email) {
        try {
          await prisma.subscriber.updateMany({
            where: { email },
            data: { unsubscribedAt: new Date() },
          })
        } catch (err) {
          console.error("[resend-webhook] subscriber unsub on complaint failed:", err)
        }
      }
    } else if (type === "email.delivered") {
      await prisma.emailLog.updateMany({
        where: { providerId },
        data: { status: "DELIVERED" },
      })
    }
  } catch (err) {
    console.error(`[resend-webhook] handleEmailEvent(${type}) failed:`, err)
  }
}

async function handleContactEvent(
  type: ResendEventType,
  data: ResendContactEventData
): Promise<void> {
  if (!data.email) return

  try {
    if (type === "contact.deleted") {
      await prisma.subscriber.updateMany({
        where: { email: data.email },
        data: { unsubscribedAt: new Date() },
      })
      return
    }

    // created / updated — sync the contact ids onto the local row if any.
    const updates: {
      resendContactId?: string
      resendAudienceId?: string
    } = {}
    if (data.id) updates.resendContactId = data.id
    if (data.audience_id) updates.resendAudienceId = data.audience_id

    if (Object.keys(updates).length === 0) return

    await prisma.subscriber.updateMany({
      where: { email: data.email },
      data: updates,
    })
  } catch (err) {
    console.error(`[resend-webhook] handleContactEvent(${type}) failed:`, err)
  }
}

export async function POST(request: NextRequest): Promise<Response> {
  const secret = process.env.RESEND_WEBHOOK_SECRET
  if (!secret) {
    console.error("[resend-webhook] RESEND_WEBHOOK_SECRET not set")
    // Return 200 so Resend doesn't retry forever against a misconfigured env.
    return NextResponse.json({ received: true, skipped: "no secret" })
  }

  // IMPORTANT: verify the raw body before parsing.
  const rawBody = await request.text()
  const svixId = request.headers.get("svix-id")
  const svixTimestamp = request.headers.get("svix-timestamp")
  const svixSignature = request.headers.get("svix-signature")

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json({ error: "missing svix headers" }, { status: 400 })
  }

  let payload: ResendEventPayload
  try {
    const wh = new Webhook(secret)
    const verified = wh.verify(rawBody, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as ResendEventPayload
    payload = verified
  } catch (err) {
    console.warn("[resend-webhook] signature verification failed:", err)
    return NextResponse.json({ error: "invalid signature" }, { status: 401 })
  }

  const { type, data } = payload

  try {
    switch (type) {
      case "email.bounced":
      case "email.complained":
      case "email.delivered":
        await handleEmailEvent(type, data)
        break
      case "contact.created":
      case "contact.updated":
      case "contact.deleted":
        await handleContactEvent(type, data)
        break
      default:
        // Ignore other event types (opened, clicked, sent, etc.) for now.
        break
    }
  } catch (err) {
    // Defence-in-depth — inner handlers already swallow their errors.
    console.error("[resend-webhook] top-level handler error:", err)
  }

  return NextResponse.json({ received: true })
}
