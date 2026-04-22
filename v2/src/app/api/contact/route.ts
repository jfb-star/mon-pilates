import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { checkRateLimit } from "@/lib/rate-limit"
import { sanitizeString } from "@/lib/utils"

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

    // Log the contact message (in production, save to DB + send notification email)
    console.log("[contact] New message:", {
      from: `${firstName} ${lastName} <${email}>`,
      phone: phone || "N/A",
      subject,
      message: message.substring(0, 100) + "...",
      timestamp: new Date().toISOString(),
    })

    // TODO: When Brevo/SMTP is configured, send notification email to contact@mon-pilates.bzh
    // TODO: Save to database (ContactMessage model)

    return NextResponse.json({ success: true, message: "Message reçu." })
  } catch {
    return NextResponse.json(
      { error: "Données invalides." },
      { status: 400 }
    )
  }
}
