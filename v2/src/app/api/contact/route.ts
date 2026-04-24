import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { checkRateLimit } from "@/lib/rate-limit"
import { sanitizeString } from "@/lib/utils"
import { prisma } from "@/lib/prisma"
import { sendContactNotification } from "@/lib/email"
import { log } from "@/lib/logger"

const VALID_SUBJECTS = [
  "Question générale",
  "Réservation",
  "Cours privé",
  "Partenariat",
  "Autre",
  // Legacy unaccented versions
  "Question generale",
  "Reservation",
  "Cours prive",
]

/** Max lengths for user-provided fields */
const MAX_NAME = 100
const MAX_EMAIL = 320
const MAX_PHONE = 20
const MAX_MESSAGE = 5000

export async function POST(request: NextRequest) {
  // Rate limit: 3 submissions per minute per IP
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  const { allowed, remaining, resetAt } = await checkRateLimit(`contact:${ip}`, { maxRequests: 3, windowMs: 60_000 })

  if (!allowed) {
    const retryAfter = Math.max(1, Math.ceil((resetAt - Date.now()) / 1000))
    return NextResponse.json(
      { error: "Trop de messages envoyés. Veuillez patienter une minute." },
      {
        status: 429,
        headers: {
          "X-RateLimit-Remaining": String(remaining),
          "Retry-After": String(retryAfter),
        },
      }
    )
  }

  try {
    const body = await request.json()
    const raw = body as {
      firstName?: string
      lastName?: string
      email?: string
      phone?: string
      subject?: string
      message?: string
    }

    // Sanitize inputs
    const firstName = typeof raw.firstName === "string" ? sanitizeString(raw.firstName, MAX_NAME) : ""
    const lastName = typeof raw.lastName === "string" ? sanitizeString(raw.lastName, MAX_NAME) : ""
    const email = typeof raw.email === "string" ? sanitizeString(raw.email, MAX_EMAIL) : ""
    const phone = typeof raw.phone === "string" ? sanitizeString(raw.phone, MAX_PHONE) : ""
    const subject = typeof raw.subject === "string" ? raw.subject.trim() : ""
    const message = typeof raw.message === "string" ? sanitizeString(raw.message, MAX_MESSAGE) : ""

    // Validation
    const errors: Record<string, string> = {}
    if (!firstName) errors.firstName = "Le prénom est requis."
    if (!lastName) errors.lastName = "Le nom est requis."
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errors.email = "Email invalide."
    if (phone && !/^[+\d\s()./-]{0,20}$/.test(phone))
      errors.phone = "Numéro de téléphone invalide."
    if (!subject || !VALID_SUBJECTS.includes(subject))
      errors.subject = "Sujet invalide."
    if (!message || message.length < 10)
      errors.message = "Le message doit contenir au moins 10 caractères."

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ errors }, { status: 400 })
    }

    // Persist to DB so the admin can read/respond from /admin/contact.
    try {
      await prisma.contactMessage.create({
        data: {
          firstName,
          lastName,
          email,
          phone: phone || null,
          subject,
          message,
        },
      })
    } catch (err) {
      log.error("[contact] Failed to persist ContactMessage", err, {
        email,
        subject,
      })
      // Don't fail the visitor's request just because DB write failed — we
      // still try to email-notify the owner below so the message isn't lost.
    }

    // Notify the owner inbox. Non-blocking: swallowed errors, never throws.
    sendContactNotification({
      firstName,
      lastName,
      email,
      phone: phone || undefined,
      subject,
      message,
    }).catch(() => {})

    log.info("contact.message.received", {
      email,
      subject,
      hasPhone: Boolean(phone),
    })

    return NextResponse.json({ success: true, message: "Message reçu." })
  } catch {
    return NextResponse.json(
      { error: "Données invalides." },
      { status: 400 }
    )
  }
}
