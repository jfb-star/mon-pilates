import { Resend } from "resend"
import { sendTemplate, sendEmail } from "@/lib/resend"
import {
  layout,
  btn,
  buildBookingConfirmHtml,
  buildBookingReminderHtml,
  buildBookingCancelledHtml,
  buildResetPasswordHtml,
  buildWelcomeHtml,
} from "@/lib/email-templates"

// Re-export so existing imports of these helpers from "@/lib/email" keep
// working, and so the prisma seed can pull them through one stable entry.
export {
  buildBookingConfirmHtml,
  buildBookingReminderHtml,
  buildBookingCancelledHtml,
  buildResetPasswordHtml,
  buildWelcomeHtml,
}

// ---------------------------------------------------------------------------
// Legacy Resend client — kept only so the fallback hardcoded-HTML branch can
// still deliver mail while the EmailTemplate rows haven't been seeded yet.
// Once `prisma db seed` has been run against the target DB the fallback stops
// firing and these hardcoded strings become dead code we can remove later.
// ---------------------------------------------------------------------------

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null

const FROM = process.env.RESEND_FROM || "Mon Pilates <onboarding@resend.dev>"
const SITE_URL = process.env.NEXTAUTH_URL || "https://mon-pilates.bzh"

// ---------------------------------------------------------------------------
// Fallback: raw-Resend send using the hardcoded HTML, used only when no DB
// template exists for the given key.  Mirrors the old behaviour.
// ---------------------------------------------------------------------------

async function fallbackSend(opts: {
  to: string
  subject: string
  html: string
  text: string
}): Promise<{ id: string } | null> {
  if (!resend) {
    console.warn("[email] RESEND_API_KEY non configurée — email non envoyé:", opts.subject)
    return null
  }

  try {
    const { data, error } = await resend.emails.send({
      from: FROM,
      to: opts.to,
      subject: opts.subject,
      html: opts.html,
      text: opts.text,
    })
    if (error || !data) {
      console.error("[email] Erreur Resend:", error)
      return null
    }
    return { id: data.id }
  } catch (err) {
    console.error("[email] Erreur lors de l'envoi:", err)
    return null
  }
}

/**
 * Try the DB-backed template first.  If it isn't seeded (fresh install) or
 * any unexpected error bubbles up from `sendTemplate`, fall back to the
 * hardcoded build-fn HTML so prod keeps delivering during the rollout.
 */
async function sendWithFallback(
  key: string,
  to: string,
  vars: Record<string, string | number>,
  fallback: { subject: string; html: string; text: string }
): Promise<{ id: string } | null> {
  try {
    const res = await sendTemplate(key, to, vars)
    return res
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    if (msg.includes("EmailTemplate not found")) {
      console.warn(
        `[email] Template "${key}" not in DB — using hardcoded fallback. Run \`prisma db seed\` to fix.`
      )
      return fallbackSend({ to, ...fallback })
    }
    // Any other error we treat as a real failure — re-throw so callers can
    // decide (most of them swallow email errors today).
    throw err
  }
}

// ---------------------------------------------------------------------------
// Public API — signatures unchanged so existing callers don't break.
// ---------------------------------------------------------------------------

export async function sendBookingConfirmation({
  to,
  courseName,
  date,
  time,
  instructor,
}: {
  to: string
  courseName: string
  date: string
  time: string
  instructor: string
}) {
  const subject = `Réservation confirmée — ${courseName}`
  const text = `Réservation confirmée\n\nCours : ${courseName}\nDate : ${date}\nHeure : ${time}\nProfesseur : ${instructor}\n\nPensez à arriver 5 minutes avant le début du cours.\n\nMon Pilates — Larmor-Plage`
  return sendWithFallback(
    "booking_confirm",
    to,
    { courseName, date, time, instructor },
    { subject, html: buildBookingConfirmHtml(), text }
  )
}

export async function sendBookingReminder({
  to,
  courseName,
  date,
  time,
  instructor,
}: {
  to: string
  courseName: string
  date: string
  time: string
  instructor: string
}) {
  const subject = `Rappel : ${courseName} demain`
  const text = `Rappel de votre cours\n\nCours : ${courseName}\nDate : ${date}\nHeure : ${time}\nProfesseur : ${instructor}\n\nSi vous ne pouvez pas venir, merci d'annuler votre réservation.\n\nMon Pilates — Larmor-Plage`
  return sendWithFallback(
    "booking_reminder",
    to,
    { courseName, date, time, instructor },
    { subject, html: buildBookingReminderHtml(), text }
  )
}

export async function sendBookingCancelled({
  to,
  userName,
  courseName,
  date,
  time,
}: {
  to: string
  userName: string
  courseName: string
  date: string
  time: string
}) {
  const subject = `Annulation — ${courseName}`
  const text = `Bonjour ${userName},\n\nVotre réservation pour ${courseName} du ${date} à ${time} a été annulée.\n\nMon Pilates — Larmor-Plage`
  return sendWithFallback(
    "booking_cancelled",
    to,
    { userName, courseName, date, time },
    { subject, html: buildBookingCancelledHtml(), text }
  )
}

export async function sendPasswordReset({
  to,
  name,
  resetToken,
}: {
  to: string
  name: string
  resetToken: string
}) {
  const resetUrl = `${SITE_URL}/reset-password?token=${resetToken}`
  const subject = "Réinitialisation de votre mot de passe"
  const text = `Bonjour ${name},\n\nVous avez demandé la réinitialisation de votre mot de passe.\n\nCliquez sur ce lien pour choisir un nouveau mot de passe :\n${resetUrl}\n\nCe lien est valable pendant 1 heure.\n\nSi vous n'êtes pas à l'origine de cette demande, ignorez cet email.\n\nMon Pilates — Larmor-Plage`
  return sendWithFallback(
    "reset_password",
    to,
    { name, resetUrl },
    { subject, html: buildResetPasswordHtml(), text }
  )
}

export async function sendWelcome({
  to,
  name,
}: {
  to: string
  name: string
}) {
  const subject = "Bienvenue chez Mon Pilates !"
  const text = `Bienvenue ${name} !\n\nVotre compte a été créé avec succès.\n\nRéservez vos cours sur ${SITE_URL}/planning\n\nÀ bientôt !\nMon Pilates — Larmor-Plage`
  return sendWithFallback(
    "welcome",
    to,
    { name },
    { subject, html: buildWelcomeHtml(), text }
  )
}

// ---------------------------------------------------------------------------
// The items below aren't yet migrated to DB templates (out of scope for this
// pass).  They go through the low-level `sendEmail` wrapper so they still
// benefit from EmailLog tracking.
// ---------------------------------------------------------------------------

export async function sendWaitlistPromotion({
  to,
  courseName,
  date,
  time,
}: {
  to: string
  courseName: string
  date: string
  time: string
}) {
  const subject = `Place disponible — ${courseName}`
  const html = layout(
    subject,
    `<h1 style="margin:0 0 16px;font-size:22px;color:#2c2c2c;">Une place s'est libérée !</h1>
     <p style="margin:0 0 12px;font-size:15px;color:#2c2c2c;line-height:1.6;">
       Bonne nouvelle ! Une place s'est libérée pour le cours auquel vous étiez en liste d'attente :
     </p>
     <table role="presentation" cellpadding="0" cellspacing="0" style="margin:16px 0;width:100%;border:1px solid #e8e2da;border-radius:8px;overflow:hidden;">
       <tr><td style="padding:10px 16px;background-color:#faf7f3;font-size:14px;color:#888;width:120px;">Cours</td><td style="padding:10px 16px;font-size:14px;color:#2c2c2c;font-weight:bold;">${courseName}</td></tr>
       <tr><td style="padding:10px 16px;background-color:#faf7f3;font-size:14px;color:#888;">Date</td><td style="padding:10px 16px;font-size:14px;color:#2c2c2c;">${date}</td></tr>
       <tr><td style="padding:10px 16px;background-color:#faf7f3;font-size:14px;color:#888;">Heure</td><td style="padding:10px 16px;font-size:14px;color:#2c2c2c;">${time}</td></tr>
     </table>
     <p style="margin:0 0 12px;font-size:15px;color:#2c2c2c;line-height:1.6;">
       Votre inscription a été automatiquement confirmée.
     </p>`
  )
  const text = `Une place s'est libérée !\n\nCours : ${courseName}\nDate : ${date}\nHeure : ${time}\n\nVotre inscription a été automatiquement confirmée.\n\nMon Pilates — Larmor-Plage`
  try {
    return await sendEmail({ to, subject, html, text })
  } catch {
    return null
  }
}

export async function sendCardExpiringSoon({
  to,
  name,
  remaining,
  expiresAt,
}: {
  to: string
  name: string
  remaining: number
  expiresAt: string
}) {
  const subject = "Votre carte de cours expire bientôt"
  const html = layout(
    subject,
    `<h1 style="margin:0 0 16px;font-size:22px;color:#2c2c2c;">Votre carte expire bientôt</h1>
     <p style="margin:0 0 12px;font-size:15px;color:#2c2c2c;line-height:1.6;">
       Bonjour ${name},
     </p>
     <p style="margin:0 0 12px;font-size:15px;color:#2c2c2c;line-height:1.6;">
       Votre carte de cours expire le <strong>${expiresAt}</strong>. Il vous reste <strong>${remaining} séance${remaining > 1 ? "s" : ""}</strong>.
     </p>
     <p style="margin:0 0 12px;font-size:15px;color:#2c2c2c;line-height:1.6;">
       Pensez à utiliser vos séances restantes ou à renouveler votre carte.
     </p>
     ${btn(`${SITE_URL}/tarifs`, "Voir les tarifs")}
     `
  )
  const text = `Bonjour ${name},\n\nVotre carte de cours expire le ${expiresAt}. Il vous reste ${remaining} séance${remaining > 1 ? "s" : ""}.\n\nPensez à utiliser vos séances restantes ou à renouveler votre carte.\n\nMon Pilates — Larmor-Plage`
  try {
    return await sendEmail({ to, subject, html, text })
  } catch {
    return null
  }
}

export async function sendGiftCard({
  to,
  recipientName,
  senderName,
  message,
  code,
  sessions,
  amount,
}: {
  to: string
  recipientName: string
  senderName: string
  message?: string
  code: string
  sessions?: number
  amount?: number
}) {
  const valueText = sessions
    ? `${sessions} séance${sessions > 1 ? "s" : ""} de Pilates`
    : amount
      ? `${(amount / 100).toFixed(2).replace(".", ",")} €`
      : "cours de Pilates"

  const subject = `${senderName} vous offre un cadeau !`
  const html = layout(
    subject,
    `<h1 style="margin:0 0 16px;font-size:22px;color:#2c2c2c;">Vous avez reçu un cadeau !</h1>
     <p style="margin:0 0 12px;font-size:15px;color:#2c2c2c;line-height:1.6;">
       Bonjour ${recipientName},
     </p>
     <p style="margin:0 0 12px;font-size:15px;color:#2c2c2c;line-height:1.6;">
       <strong>${senderName}</strong> vous offre <strong>${valueText}</strong> chez Mon Pilates !
     </p>
     ${message ? `<div style="margin:16px 0;padding:16px 20px;background-color:#faf7f3;border-left:4px solid #8faa8b;border-radius:4px;font-style:italic;font-size:15px;color:#2c2c2c;line-height:1.6;">${message}</div>` : ""}
     <div style="margin:20px 0;padding:20px;background-color:#faf7f3;border-radius:8px;text-align:center;">
       <p style="margin:0 0 8px;font-size:13px;color:#888;">Votre code cadeau</p>
       <p style="margin:0;font-size:24px;font-weight:bold;color:#6b9fad;letter-spacing:2px;">${code}</p>
     </div>
     ${btn(`${SITE_URL}/planning`, "Réserver un cours")}
     <p style="margin:16px 0 0;font-size:13px;color:#888;line-height:1.5;">
       Utilisez ce code lors de votre réservation ou en créant votre compte sur mon-pilates.bzh.
     </p>`
  )
  const text = `Bonjour ${recipientName},\n\n${senderName} vous offre ${valueText} chez Mon Pilates !\n\n${message ? `Message : "${message}"\n\n` : ""}Votre code cadeau : ${code}\n\nRéservez sur ${SITE_URL}/planning\n\nMon Pilates — Larmor-Plage`
  try {
    return await sendEmail({ to, subject, html, text })
  } catch {
    return null
  }
}
