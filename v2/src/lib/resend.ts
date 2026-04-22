import "server-only"

import { Resend } from "resend"
import { prisma } from "@/lib/prisma"

// ---------------------------------------------------------------------------
// Module init — single client, fail fast if FROM is missing.
// ---------------------------------------------------------------------------

const RESEND_API_KEY = process.env.RESEND_API_KEY
const RESEND_FROM = process.env.RESEND_FROM

if (!RESEND_FROM) {
  // Fail fast on boot — prevents silent misconfiguration of the transactional
  // layer.  Tests / CI should set a placeholder value.
  throw new Error(
    "[resend] RESEND_FROM env variable is not set — define it in .env (e.g. \"Mon Pilates <onboarding@resend.dev>\")"
  )
}

// The SDK accepts an undefined key (and will then throw on first call) — we
// keep a `null` sentinel so callers can branch cleanly in tests / local dev.
const resend: Resend | null = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null

// From this point `RESEND_FROM` is guaranteed to be set; capture for closures.
const FROM: string = RESEND_FROM

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function escapeHtml(value: string | number): string {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

/**
 * Substitute {{varName}} placeholders.  Unknown vars are left as-is and a
 * console warning is emitted.  Values are HTML-escaped to prevent XSS from
 * user-supplied names / messages landing in rendered email bodies.
 */
function substitute(
  template: string,
  vars: Record<string, string | number>
): string {
  return template.replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (match, key) => {
    if (Object.prototype.hasOwnProperty.call(vars, key)) {
      const value = vars[key]
      if (value !== undefined) {
        return escapeHtml(value)
      }
    }
    console.warn(`[resend] unmatched placeholder {{${key}}} left in template`)
    return match
  })
}

async function writeLog(entry: {
  templateKey?: string | null
  toEmail: string
  subject: string
  providerId?: string | null
  status: "SENT" | "FAILED" | "BOUNCED"
  error?: string | null
}): Promise<void> {
  try {
    await prisma.emailLog.create({
      data: {
        templateKey: entry.templateKey ?? null,
        toEmail: entry.toEmail,
        subject: entry.subject,
        providerId: entry.providerId ?? null,
        status: entry.status,
        error: entry.error ?? null,
      },
    })
  } catch (err) {
    // Never let logging kill the send path.
    console.error("[resend] Failed to write EmailLog:", err)
  }
}

// ---------------------------------------------------------------------------
// sendEmail — the raw wrapper around Resend's emails.send
// ---------------------------------------------------------------------------

export async function sendEmail(opts: {
  to: string | string[]
  subject: string
  html: string
  text?: string
  replyTo?: string
  tags?: { name: string; value: string }[]
  templateKey?: string
}): Promise<{ id: string }> {
  const primaryTo = Array.isArray(opts.to) ? (opts.to[0] ?? "") : opts.to

  if (!resend) {
    const msg = "RESEND_API_KEY not configured"
    console.warn(`[resend] ${msg} — email not sent: ${opts.subject}`)
    await writeLog({
      templateKey: opts.templateKey,
      toEmail: primaryTo,
      subject: opts.subject,
      status: "FAILED",
      error: msg,
    })
    throw new Error(msg)
  }

  try {
    const { data, error } = await resend.emails.send({
      from: FROM,
      to: opts.to,
      subject: opts.subject,
      html: opts.html,
      text: opts.text,
      replyTo: opts.replyTo,
      tags: opts.tags,
    })

    if (error || !data) {
      const message = error?.message ?? "Unknown Resend error"
      await writeLog({
        templateKey: opts.templateKey,
        toEmail: primaryTo,
        subject: opts.subject,
        status: "FAILED",
        error: message,
      })
      throw new Error(`[resend] ${message}`)
    }

    await writeLog({
      templateKey: opts.templateKey,
      toEmail: primaryTo,
      subject: opts.subject,
      providerId: data.id,
      status: "SENT",
    })

    return { id: data.id }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    // If we already logged above we'll double-log; dedupe by tagging our own
    // thrown errors so the catch handler knows not to re-log.
    if (!message.startsWith("[resend] ")) {
      await writeLog({
        templateKey: opts.templateKey,
        toEmail: primaryTo,
        subject: opts.subject,
        status: "FAILED",
        error: message,
      })
    }
    throw err
  }
}

// ---------------------------------------------------------------------------
// renderTemplate / sendTemplate — DB-backed templates with Mustache-style vars
// ---------------------------------------------------------------------------

export async function renderTemplate(
  key: string,
  vars: Record<string, string | number>
): Promise<{ subject: string; html: string }> {
  const template = await prisma.emailTemplate.findUnique({
    where: { key },
  })

  if (!template) {
    throw new Error(`[resend] EmailTemplate not found for key="${key}"`)
  }

  return {
    subject: substitute(template.subject, vars),
    html: substitute(template.htmlCompiled, vars),
  }
}

export async function sendTemplate(
  key: string,
  to: string | string[],
  vars: Record<string, string | number>
): Promise<{ id: string }> {
  const { subject, html } = await renderTemplate(key, vars)
  return sendEmail({
    to,
    subject,
    html,
    templateKey: key,
    tags: [{ name: "template", value: key }],
  })
}

// ---------------------------------------------------------------------------
// Audiences (Resend Segments in the v6 SDK — old terminology = "Audiences")
// ---------------------------------------------------------------------------

function requireResend(): Resend {
  if (!resend) {
    throw new Error("[resend] RESEND_API_KEY not configured")
  }
  return resend
}

export async function listAudiences(): Promise<{ id: string; name: string }[]> {
  const r = requireResend()
  const { data, error } = await r.audiences.list()
  if (error || !data) {
    throw new Error(`[resend] listAudiences failed: ${error?.message ?? "unknown"}`)
  }
  // Resend's list response: { data: Segment[], has_more, object }
  const items = (data.data ?? []) as Array<{ id: string; name: string }>
  return items.map((s) => ({ id: s.id, name: s.name }))
}

export async function createAudience(name: string): Promise<{ id: string }> {
  const r = requireResend()
  const { data, error } = await r.audiences.create({ name })
  if (error || !data) {
    throw new Error(`[resend] createAudience failed: ${error?.message ?? "unknown"}`)
  }
  return { id: data.id }
}

export async function addContact(
  audienceId: string,
  email: string,
  firstName?: string
): Promise<{ id: string }> {
  const r = requireResend()
  // Use the legacy payload shape (audienceId) — still supported by the SDK and
  // simpler than the segments[] form.  If Resend removes it later we'll
  // migrate to { segments: [{ id: audienceId }] }.
  const { data, error } = await r.contacts.create({
    audienceId,
    email,
    firstName,
  })
  if (error || !data) {
    throw new Error(`[resend] addContact failed: ${error?.message ?? "unknown"}`)
  }
  return { id: data.id }
}

export async function removeContact(
  audienceId: string,
  contactId: string
): Promise<void> {
  const r = requireResend()
  const { error } = await r.contacts.remove({ audienceId, id: contactId })
  if (error) {
    throw new Error(`[resend] removeContact failed: ${error.message}`)
  }
}

// ---------------------------------------------------------------------------
// Broadcasts
// ---------------------------------------------------------------------------

export async function createBroadcast(opts: {
  audienceId: string
  from: string
  subject: string
  html: string
  name: string
}): Promise<{ id: string }> {
  const r = requireResend()
  const { data, error } = await r.broadcasts.create({
    audienceId: opts.audienceId,
    from: opts.from,
    subject: opts.subject,
    html: opts.html,
    name: opts.name,
  })
  if (error || !data) {
    throw new Error(`[resend] createBroadcast failed: ${error?.message ?? "unknown"}`)
  }
  return { id: data.id }
}

export async function sendBroadcast(
  broadcastId: string,
  scheduledAt?: Date
): Promise<void> {
  const r = requireResend()
  const payload = scheduledAt ? { scheduledAt: scheduledAt.toISOString() } : undefined
  const { error } = await r.broadcasts.send(broadcastId, payload)
  if (error) {
    throw new Error(`[resend] sendBroadcast failed: ${error.message}`)
  }
}

export async function getBroadcastStats(
  broadcastId: string
): Promise<Record<string, unknown>> {
  const r = requireResend()
  const { data, error } = await r.broadcasts.get(broadcastId)
  if (error || !data) {
    throw new Error(`[resend] getBroadcastStats failed: ${error?.message ?? "unknown"}`)
  }
  // Return the full broadcast object — callers can cherry-pick the stats
  // fields they need (opens, clicks, bounces, status, sent_at, ...).
  return data as unknown as Record<string, unknown>
}
