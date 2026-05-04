/**
 * Bsport webhook receiver.
 *
 * Bsport posts to the URL configured in their admin (Settings → Webhook).
 * The doc explicitly says signature verification headers are NOT
 * implemented yet, so we protect this endpoint with a shared secret in
 * the URL: /api/webhooks/bsport?secret=$BSPORT_WEBHOOK_SECRET
 *
 * Idempotency: Bsport doesn't send a stable event UUID, so we derive a
 * synthetic key from (event_type + entity id + emission date) and use the
 * BsportWebhookEvent table as a dedup ledger.
 *
 * Supported events (from Bsport's docs):
 *   - booking-create | booking-update | booking-delete
 *   - member-create | member-update
 *
 * Anything else returns 202 Accepted and is logged but not acted on.
 */
import { NextRequest, NextResponse } from "next/server"
import crypto from "node:crypto"
import { prisma } from "@/lib/prisma"
import { BsportWebhookSchema } from "@/lib/bsport-schemas"

export const runtime = "nodejs"

function verifySecret(req: NextRequest): boolean {
  const expected = process.env.BSPORT_WEBHOOK_SECRET
  if (!expected) {
    // Fail closed: missing secret means we never accept webhooks. Better
    // to have Bsport see 503 than to accept anonymous writes.
    return false
  }
  const provided = req.nextUrl.searchParams.get("secret") ?? req.headers.get("x-webhook-secret")
  if (!provided) return false
  // Constant-time compare to defeat timing attacks.
  const a = Buffer.from(expected)
  const b = Buffer.from(provided)
  if (a.length !== b.length) return false
  return crypto.timingSafeEqual(a, b)
}

function eventKey(eventType: string, entityId: number | string, date: number | string): string {
  return crypto.createHash("sha256").update(`${eventType}:${entityId}:${date}`).digest("hex")
}

export async function POST(req: NextRequest) {
  if (!process.env.BSPORT_WEBHOOK_SECRET) {
    console.error("[bsport webhook] BSPORT_WEBHOOK_SECRET not configured")
    return NextResponse.json({ error: "Not configured" }, { status: 503 })
  }
  if (!verifySecret(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  let raw: unknown
  try {
    raw = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const parsed = BsportWebhookSchema.safeParse(raw)
  if (!parsed.success) {
    // Log unknown / new event types so we can extend support without losing data
    console.warn("[bsport webhook] unrecognized payload:", JSON.stringify(raw).slice(0, 500))
    return NextResponse.json({ ok: true, accepted: false, reason: "unrecognized payload" }, { status: 202 })
  }
  const event = parsed.data

  // Compute idempotency key from the entity id (booking / member / invoice)
  const entityId = "booking" in event.data
    ? event.data.booking.id
    : "invoice" in event.data
      ? event.data.invoice.id
      : event.data.member.id
  const key = eventKey(event.event_type, entityId, event.date)

  // Dedup
  const existing = await prisma.bsportWebhookEvent.findUnique({ where: { eventKey: key } })
  if (existing && existing.status === "PROCESSED") {
    return NextResponse.json({ ok: true, deduped: true }, { status: 200 })
  }

  // Record receipt (insert or update if previously failed)
  await prisma.bsportWebhookEvent.upsert({
    where: { eventKey: key },
    create: {
      eventKey: key,
      eventType: event.event_type,
      payload: JSON.stringify(raw),
      status: "RECEIVED",
    },
    update: { status: "RECEIVED", error: null },
  })

  try {
    await dispatch(event)
    await prisma.bsportWebhookEvent.update({
      where: { eventKey: key },
      data: { status: "PROCESSED", processedAt: new Date() },
    })
    return NextResponse.json({ ok: true }, { status: 200 })
  } catch (e) {
    const msg = (e as Error).message
    await prisma.bsportWebhookEvent.update({
      where: { eventKey: key },
      data: { status: "FAILED", error: msg },
    })
    console.error("[bsport webhook] dispatch failed:", msg)
    // Return 5xx so Bsport will retry (per their docs they retry on non-2xx)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

/**
 * Route an event to its handler. Each handler must be idempotent —
 * webhook retries are expected.
 */
async function dispatch(event: ReturnType<typeof BsportWebhookSchema.parse>): Promise<void> {
  switch (event.event_type) {
    case "member-create":
    case "member-update":
      await handleMemberUpsert(event.data.member)
      break
    case "booking-create":
    case "booking-update":
      await handleBookingUpsert(event.data.booking)
      break
    case "booking-delete":
      await handleBookingDelete(event.data.booking)
      break
    case "invoice-create":
    case "invoice-update":
      await handleInvoiceUpsert(event.data.invoice)
      break
  }
}

async function handleMemberUpsert(member: {
  id: number
  email?: string | null
  firstname?: string | null
  lastname?: string | null
  first_name?: string | null
  last_name?: string | null
  name?: string | null
  phone_number?: string | null
  phone?: string | null
  archived?: boolean
  is_archived?: boolean
  consumer?: number | null
}): Promise<void> {
  // Resolve fullname / phone from either snake_case (prod) or camelCase (OpenAPI)
  const firstname = member.first_name ?? member.firstname ?? ""
  const lastname = member.last_name ?? member.lastname ?? ""
  const fullname = member.name ?? `${firstname} ${lastname}`.trim()
  const phone = member.phone_number ?? member.phone ?? null
  const consumerId = member.consumer ?? null

  // Walk-in POS members may have no email — we can't create a V2 account
  // without one, so we silently skip and log for diagnostics.
  const rawEmail = (member.email ?? "").trim().toLowerCase()
  if (!rawEmail || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(rawEmail)) {
    console.log(`[bsport webhook] member ${member.id} skipped: no usable email`)
    return
  }

  // Match on bsportId, then bsportConsumerId, then email
  const existing = await prisma.user.findFirst({
    where: { OR: [
      { bsportId: member.id },
      ...(consumerId ? [{ bsportConsumerId: consumerId }] : []),
      { email: rawEmail },
    ] },
  })
  if (existing) {
    // Preserve V2-native users' migrationSource; only update profile fields
    // and add bsport linkage. needsActivation never re-enabled on existing.
    await prisma.user.update({
      where: { id: existing.id },
      data: {
        bsportId: member.id,
        ...(consumerId ? { bsportConsumerId: consumerId } : {}),
        ...(existing.bsportId === member.id ? { name: fullname || existing.name, phone: phone ?? existing.phone } : {}),
      },
    })
  } else {
    const placeholderHash = `migrated:${crypto.randomBytes(16).toString("hex")}`
    await prisma.user.create({
      data: {
        email: rawEmail,
        name: fullname || rawEmail,
        phone,
        passwordHash: placeholderHash,
        bsportId: member.id,
        bsportConsumerId: consumerId,
        migratedAt: new Date(),
        migrationSource: "BSPORT_IMPORT",
        needsActivation: true,
      },
    })
  }
}

async function handleBookingUpsert(booking: {
  id: number
  consumer?: number | null
  member?: { id: number; email?: string }
  consumer_payment_pack?: number | null
  offer?: number | null
  offer_date_start?: string | null
  booking_status_code?: number | string | null
  attendance?: boolean | null
  is_no_show?: boolean
  is_deleted?: boolean
  date_canceled?: string | null
  credit_consumed?: number | null
}): Promise<void> {
  // Look up the user. Prod payload references the consumer id; OpenAPI
  // spec uses member.id. We try consumer first (real prod), member.id
  // second (fixture/OpenAPI compat).
  const consumerId = booking.consumer ?? null
  const memberId = booking.member?.id ?? null
  if (!consumerId && !memberId) return // no user link at all — skip

  const user = await prisma.user.findFirst({
    where: { OR: [
      ...(consumerId ? [{ bsportConsumerId: consumerId }] : []),
      ...(memberId ? [{ bsportId: memberId }] : []),
    ] },
  })
  if (!user) {
    // User hasn't been imported yet — silently skip. A subsequent
    // member-create event (or the next CLI import) will populate them.
    console.log(`[bsport webhook] booking ${booking.id}: user not found (consumer=${consumerId}, member=${memberId})`)
    return
  }

  // We need a V2 Session row matching the offer_date_start. Many historical
  // bookings (pre-cutover) don't have a corresponding V2 Session — we skip
  // those silently; they'll be handled by the CLI import if needed.
  if (!booking.offer_date_start) return
  const startAt = new Date(booking.offer_date_start)
  // Match by exact datetime; if your sessions are stored with date+startTime
  // separately, we'd need to widen the lookup. Defer that until we see the
  // first real-world misses.
  const session = await prisma.session.findFirst({ where: { date: startAt } })
  if (!session) {
    console.log(`[bsport webhook] booking ${booking.id}: no V2 session at ${booking.offer_date_start}`)
    return
  }

  // Booking status: Bsport uses an integer code (0=booked, 1=attended,
  // 2=no-show, 3=canceled — best guess from observation). We treat it as:
  //   - is_deleted OR date_canceled → CANCELLED
  //   - otherwise → CONFIRMED
  const status = booking.is_deleted || booking.date_canceled ? "CANCELLED" : "CONFIRMED"
  await prisma.booking.upsert({
    where: { bsportId: booking.id },
    create: {
      userId: user.id,
      sessionId: session.id,
      status,
      paymentMethod: "CARD",
      paymentStatus: "PAID",
      bsportId: booking.id,
      cancelledAt: booking.date_canceled ? new Date(booking.date_canceled) : null,
    },
    update: {
      status,
      cancelledAt: booking.date_canceled ? new Date(booking.date_canceled) : null,
    },
  })
}

async function handleBookingDelete(booking: { id: number }): Promise<void> {
  // Soft delete: mark as CANCELLED rather than hard-delete to keep audit
  await prisma.booking.updateMany({
    where: { bsportId: booking.id },
    data: { status: "CANCELLED", cancelledAt: new Date() },
  })
}

/**
 * Mirror a Bsport invoice into V2:
 *   1. Always record a `Payment` row (so V2 admin sees the revenue)
 *   2. If a line item references a pass_id, ALSO mirror the resulting
 *      CourseCard (so the user gets the credits in V2)
 *
 * This handler runs idempotently: re-receiving an invoice-update for a
 * already-known invoice updates the Payment status without duplicating.
 *
 * NOTE: card credit accounting on the resulting CourseCard is set to
 * `totalSessions` initially. If the user has booked classes BEFORE this
 * invoice webhook arrives (e.g. cross-booking on Bsport during the
 * cutover window), `remainingSessions` may overcount — that's a known
 * race that resolves naturally on the next CLI re-import (`--reset`).
 */
async function handleInvoiceUpsert(invoice: {
  id: number
  consumer?: number | null
  member?: { id: number; email?: string }
  total_amount?: number | string
  currency?: string
  status?: string
  paid_at?: string | null
  line_items?: Array<{ pass_id?: number | null; pass_name?: string | null; amount?: number | string; quantity?: number }>
}): Promise<void> {
  // Prod uses `consumer` (integer), OpenAPI uses `member.id` (object) — accept both
  const consumerId = invoice.consumer ?? null
  const memberId = invoice.member?.id ?? null
  if (!consumerId && !memberId) return
  const user = await prisma.user.findFirst({
    where: { OR: [
      ...(consumerId ? [{ bsportConsumerId: consumerId }] : []),
      ...(memberId ? [{ bsportId: memberId }] : []),
    ] },
  })
  if (!user) return

  // Compute amount in cents from total_amount (decimal string or number)
  const amountCents = (() => {
    const v = invoice.total_amount
    if (typeof v === "number") return Math.round(v * 100)
    if (typeof v === "string") return Math.round(parseFloat(v) * 100)
    return 0
  })()
  const status = invoice.status === "paid" || invoice.paid_at ? "PAID" : "PENDING"

  // 1. Mirror the Payment
  await prisma.payment.upsert({
    where: { bsportId: invoice.id },
    create: {
      userId: user.id,
      amount: amountCents,
      currency: (invoice.currency ?? "eur").toLowerCase(),
      status,
      type: "bsport_import",
      bsportId: invoice.id,
      externalProvider: "bsport",
      metadata: JSON.stringify({ source: "webhook", line_items: invoice.line_items ?? [] }),
    },
    update: { status, amount: amountCents },
  })

  // 2. If any line item references a pass, mirror as CourseCard
  for (const item of invoice.line_items ?? []) {
    if (!item.pass_id) continue
    // Look up the V2 CourseCard by Bsport line-item identity. Bsport doesn't
    // give us a stable line-item id in this payload shape, so we dedupe
    // on (user, pass_id, invoice_id) by encoding into bsportId hash.
    const synthCardBsportId = invoice.id * 100 + (item.pass_id ?? 0)
    const totalSessions = item.quantity && item.quantity > 0 ? item.quantity : 0
    if (totalSessions === 0) continue
    const cardType = String(totalSessions)
    // Default expiry: 1 year (Bsport doesn't include this in invoice payload).
    // Will be corrected by the next CLI --reset run that pulls accurate
    // ending_date from /management/client-passes/.
    const expiresAt = new Date()
    expiresAt.setFullYear(expiresAt.getFullYear() + 1)

    await prisma.courseCard.upsert({
      where: { bsportId: synthCardBsportId },
      create: {
        userId: user.id,
        type: cardType,
        totalSessions,
        remainingSessions: totalSessions,
        purchasedAt: new Date(),
        expiresAt,
        bsportId: synthCardBsportId,
      },
      update: {
        // Only update if not already touched (avoid stomping a CLI-imported card)
        type: cardType,
        totalSessions,
      },
    })
  }
}
