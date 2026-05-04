/**
 * Zod schemas for Bsport API payloads.
 *
 * Source of truth: `scripts/bsport-openapi.yml`. We only validate fields we
 * care about for migration; unknown fields are stripped (Zod default), so
 * Bsport adding fields won't break us. Required fields per the spec are
 * marked required here; optional fields use .nullable() / .optional().
 *
 * Used by:
 *   - scripts/import-bsport.ts (CSV + API + fixture parsing)
 *   - src/app/api/webhooks/bsport/route.ts (webhook payload validation)
 */
import { z } from "zod"

/**
 * Bsport member as returned by /customer-data-platform/v1/member/
 *
 * NOTE: the OpenAPI spec at api-docs.dev.bsport.io documents a different
 * endpoint shape (firstname/lastname/is_archived/etc.) but the live prod
 * admin uses snake_case (first_name/last_name/archived). We accept BOTH
 * via .or() / .optional() so this schema works for fixtures, scraped data,
 * and (eventually) the official API.
 */
export const BsportClientSchema = z.object({
  id: z.number().int(),
  // Bsport allows null/empty emails (POS-created members, walk-ins). We
  // accept anything here and let the importer SKIP rows without a usable
  // email (since V2 requires unique non-null email).
  email: z.string().nullable().optional(),
  // first/last name: Bsport prod returns first_name/last_name (snake_case)
  // and `name` (full); the OpenAPI spec uses firstname/lastname. Accept all.
  first_name: z.string().nullable().optional(),
  last_name: z.string().nullable().optional(),
  firstname: z.string().nullable().optional(),
  lastname: z.string().nullable().optional(),
  name: z.string().nullable().optional(),
  fullname: z.string().nullable().optional(),
  // phone: not in /customer-data-platform/v1/member/ payload — comes from
  // a separate detail endpoint. We accept either spelling.
  phone_number: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  // Birthday: prod uses `birthday`, OpenAPI uses `birth_date`
  birthday: z.string().nullable().optional(),
  birth_date: z.string().nullable().optional(),
  gender: z.string().nullable().optional(),
  // Archived flag: prod uses `archived`, OpenAPI uses `is_archived`
  archived: z.boolean().optional(),
  is_archived: z.boolean().optional(),
  // Email/SMS opt-in: prod uses `accept_email`, OpenAPI uses `is_email_accepted`
  accept_email: z.boolean().optional(),
  accept_sms: z.boolean().optional(),
  is_email_accepted: z.boolean().optional(),
  is_sms_accepted: z.boolean().optional(),
  // Joined date: prod uses `date_joined` (ISO datetime), OpenAPI uses `joined_date` (date)
  date_joined: z.string().nullable().optional(),
  joined_date: z.string().nullable().optional(),
  membership_id: z.string().nullable().optional(),
  total_unpaid_amount: z.union([z.string(), z.number()]).nullable().optional(),
  payment_backend_customer_id: z.string().nullable().optional(),
  // Other prod-only fields we may want later
  consumer: z.number().int().nullable().optional(),
  user_id: z.number().int().nullable().optional(),
  has_bought_pack: z.boolean().optional(),
  tags: z.array(z.unknown()).optional(),
}).passthrough()
export type BsportClient = z.infer<typeof BsportClientSchema>

/**
 * Helper: normalize a BsportClient into a canonical shape with non-null
 * firstname/lastname/etc. so the importer doesn't have to branch on which
 * variant of field name is present.
 */
export function normalizeClient(c: BsportClient): {
  id: number
  email: string | null
  firstname: string
  lastname: string
  fullname: string
  phone: string | null
  archived: boolean
  acceptEmail: boolean
  joinedDate: string | null
} {
  const firstname = c.first_name ?? c.firstname ?? ""
  const lastname = c.last_name ?? c.lastname ?? ""
  const fullname = c.name ?? c.fullname ?? `${firstname} ${lastname}`.trim()
  // Trim and validate email shape — return null if missing or malformed
  // so the importer can skip the row without trying to create a V2 user.
  const rawEmail = (c.email ?? "").trim()
  const email = rawEmail && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(rawEmail) ? rawEmail : null
  return {
    id: c.id,
    email,
    firstname,
    lastname,
    fullname,
    phone: c.phone_number ?? c.phone ?? null,
    archived: c.archived ?? c.is_archived ?? false,
    acceptEmail: c.accept_email ?? c.is_email_accepted ?? false,
    joinedDate: c.date_joined ?? c.joined_date ?? null,
  }
}

/**
 * Bsport "consumer payment pack" (= our CourseCard).
 * Real prod endpoint: /buyable/v1/payment-pack/consumer-payment-pack/
 *
 * Field name variants (prod vs OpenAPI):
 *   member_id           ↔ client_id
 *   payment_pack         ↔ pass_id
 *   available_credits   ↔ available_credits_amount
 *   used_credits        ↔ used_credits_amount
 *   date_bought         ↔ purchased_date
 *   disabled            ↔ is_disabled
 */
export const BsportClientPassSchema = z.object({
  id: z.number().int(),
  // Member: prod = `member_id`, OpenAPI = `client_id`
  member_id: z.number().int().nullable().optional(),
  client_id: z.number().int().nullable().optional(),
  // Pass template: prod = `payment_pack` (number) or `payment_pack_id` (string!), OpenAPI = `pass_id`
  payment_pack: z.union([z.number().int(), z.string()]).nullable().optional(),
  payment_pack_id: z.union([z.number().int(), z.string()]).nullable().optional(),
  pass_id: z.number().int().nullable().optional(),
  // Credits: prod uses snake without _amount suffix
  available_credits: z.number().int().nullable().optional(),
  used_credits: z.number().int().nullable().optional(),
  available_credits_amount: z.number().int().nullable().optional(),
  used_credits_amount: z.number().int().nullable().optional(),
  starting_date: z.string(),
  ending_date: z.string(),
  // Purchased date: prod = `date_bought`
  date_bought: z.string().nullable().optional(),
  purchased_date: z.string().nullable().optional(),
  disabled: z.boolean().optional(),
  is_disabled: z.boolean().optional(),
}).passthrough()
export type BsportClientPass = z.infer<typeof BsportClientPassSchema>

export function normalizeClientPass(p: BsportClientPass): {
  id: number
  memberId: number
  passTemplateId: number
  availableCredits: number
  usedCredits: number
  startingDate: string
  endingDate: string
  purchasedDate: string
  disabled: boolean
} {
  const memberId = p.member_id ?? p.client_id ?? 0
  const ppRaw = p.payment_pack ?? p.payment_pack_id ?? p.pass_id ?? 0
  const passTemplateId = typeof ppRaw === "string" ? parseInt(ppRaw, 10) : ppRaw
  return {
    id: p.id,
    memberId,
    passTemplateId,
    availableCredits: p.available_credits ?? p.available_credits_amount ?? 0,
    usedCredits: p.used_credits ?? p.used_credits_amount ?? 0,
    startingDate: p.starting_date,
    endingDate: p.ending_date,
    purchasedDate: p.date_bought ?? p.purchased_date ?? p.starting_date,
    disabled: p.disabled ?? p.is_disabled ?? false,
  }
}

/**
 * Bsport BookingOutput — a single reservation slot.
 * client_id links to a ClientOutput. session_id refers to a Bsport-side
 * session that we may not have a direct V2 equivalent for; we recreate the
 * V2 Session row at import time using session_start_at + a heuristic for
 * the matching Schedule + CourseType.
 */
export const BsportBookingSchema = z.object({
  id: z.number().int(),
  client_id: z.number().int(),
  client_pass_id: z.number().int().nullable().optional(),
  session_id: z.number().int().nullable().optional(),
  session_start_at: z.string(), // ISO datetime
  created_at: z.string(),
  canceled_at: z.string().nullable().optional(),
  has_attended: z.boolean().default(false),
  is_no_show: z.boolean().default(false),
  credit_consumed: z.number().int().default(1),
  is_credit_refunded: z.boolean().default(false),
  teacher_id: z.number().int().nullable().optional(),
  location_id: z.number().int().nullable().optional(),
  source: z.string().nullable().optional(),
  booking_status_code: z.string().nullable().optional(),
})
export type BsportBooking = z.infer<typeof BsportBookingSchema>

/**
 * Pass template (5/10/20 cours pack catalog) from /buyable/v1/payment-pack/payment-pack/.
 * Field name variants: prod = `credits` / `duration_days`, OpenAPI = `credits_amount` / `duration_in_days`.
 */
export const BsportPassTemplateSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  credits: z.number().int().nullable().optional(),
  credits_amount: z.number().int().nullable().optional(),
  duration_days: z.number().int().nullable().optional(),
  duration_in_days: z.number().int().nullable().optional(),
}).passthrough()
export type BsportPassTemplate = z.infer<typeof BsportPassTemplateSchema>

export function normalizePassTemplate(t: BsportPassTemplate): {
  id: number
  name: string
  credits: number
  durationDays: number
} {
  return {
    id: t.id,
    name: t.name,
    credits: t.credits ?? t.credits_amount ?? 0,
    durationDays: t.duration_days ?? t.duration_in_days ?? 365,
  }
}

/* ---------- Webhook payload schemas ---------- */

/**
 * Booking webhook envelope. event_type is one of:
 *   - "booking-create"
 *   - "booking-update"
 *   - "booking-delete"
 * Payload `data.booking` shape is similar to BsportBookingSchema but with
 * extra nested member/offer info — we only validate the bits we need.
 */
export const BsportBookingWebhookSchema = z.object({
  event_type: z.enum(["booking-create", "booking-update", "booking-delete"]),
  date: z.number(), // Unix timestamp
  data: z.object({
    booking: z.object({
      id: z.number().int(),
      member: z.object({ id: z.number().int(), email: z.string().email().optional() }).passthrough().optional(),
      booking_status_code: z.string().nullable().optional(),
      attendance: z.boolean().nullable().optional(),
      is_deleted: z.boolean().optional(),
      offer_date_start: z.string().optional(),
      date_canceled: z.string().nullable().optional(),
      credit_consumed: z.number().int().optional(),
      is_no_show: z.boolean().optional(),
    }).passthrough(),
  }),
})
export type BsportBookingWebhook = z.infer<typeof BsportBookingWebhookSchema>

/**
 * Member webhook envelope. event_type:
 *   - "member-create"
 *   - "member-update"
 */
export const BsportMemberWebhookSchema = z.object({
  event_type: z.enum(["member-create", "member-update"]),
  date: z.number(),
  data: z.object({
    member: z.object({
      id: z.number().int(),
      email: z.string().email(),
      firstname: z.string().optional(),
      lastname: z.string().optional(),
      phone_number: z.string().nullable().optional(),
      archived: z.boolean().optional(),
    }).passthrough(),
  }),
})
export type BsportMemberWebhook = z.infer<typeof BsportMemberWebhookSchema>

/**
 * Invoice webhook envelope — fires when a sale is settled in Bsport
 * (card purchase, à-l'unité payment, etc.). Used during the cutover
 * window to mirror NEW card sales / payments from Bsport into V2.
 *
 * Event types per Bsport docs:
 *   - "invoice-create"
 *   - "invoice-update"
 *
 * Bsport's invoice payload is rich (line items, taxes, etc.) — we only
 * extract the bits we need for accounting + card crediting. Anything
 * else passes through via .passthrough().
 */
export const BsportInvoiceWebhookSchema = z.object({
  event_type: z.enum(["invoice-create", "invoice-update"]),
  date: z.number(),
  data: z.object({
    invoice: z.object({
      id: z.number().int(),
      member: z.object({ id: z.number().int(), email: z.string().email().optional() }).passthrough().optional(),
      total_amount: z.union([z.number(), z.string()]).optional(), // decimal as number or string
      currency: z.string().optional(),
      status: z.string().optional(),                              // "paid" | "pending" | "cancelled" | etc.
      created_at: z.string().optional(),
      paid_at: z.string().nullable().optional(),
      // Line items: each may correspond to a pass purchase, a single-class
      // ticket, etc. Bsport's exact shape isn't fully documented; we
      // accept any array and inspect at runtime.
      line_items: z.array(z.object({
        pass_id: z.number().int().nullable().optional(),
        pass_name: z.string().nullable().optional(),
        amount: z.union([z.number(), z.string()]).optional(),
        quantity: z.number().int().optional(),
      }).passthrough()).optional(),
    }).passthrough(),
  }),
})
export type BsportInvoiceWebhook = z.infer<typeof BsportInvoiceWebhookSchema>

/** Discriminated union for any Bsport webhook payload. */
export const BsportWebhookSchema = z.discriminatedUnion("event_type", [
  BsportBookingWebhookSchema,
  BsportMemberWebhookSchema,
  BsportInvoiceWebhookSchema,
])
export type BsportWebhook = z.infer<typeof BsportWebhookSchema>
