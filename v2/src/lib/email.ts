import { Resend } from "resend"

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null

const FROM = "Mon Pilates <noreply@mon-pilates.bzh>"
const SITE_URL = process.env.NEXTAUTH_URL || "https://mon-pilates.bzh"

// ---------------------------------------------------------------------------
// Shared layout helpers
// ---------------------------------------------------------------------------

function layout(title: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background-color:#faf7f3;font-family:Georgia,'Times New Roman',serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#faf7f3;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:12px;overflow:hidden;">
          <!-- Header -->
          <tr>
            <td style="background-color:#6b9fad;padding:28px 32px;text-align:center;">
              <span style="font-size:24px;font-weight:bold;color:#ffffff;letter-spacing:1px;">Mon Pilates</span>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:32px;">
              ${body}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color:#faf7f3;padding:20px 32px;text-align:center;border-top:1px solid #e8e2da;">
              <p style="margin:0 0 4px;font-size:13px;color:#888;">Mon Pilates &mdash; Larmor-Plage</p>
              <p style="margin:0;font-size:12px;color:#aaa;">Vous recevez cet email car vous avez un compte chez Mon Pilates.<br/>Pour ne plus recevoir ces emails, modifiez vos pr&eacute;f&eacute;rences dans votre espace client.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

function btn(href: string, label: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px 0;"><tr><td style="background-color:#6b9fad;border-radius:8px;padding:14px 28px;"><a href="${href}" style="color:#ffffff;text-decoration:none;font-size:15px;font-weight:bold;">${label}</a></td></tr></table>`
}

// ---------------------------------------------------------------------------
// Helper: safely send an email
// ---------------------------------------------------------------------------

async function send(opts: { to: string; subject: string; html: string; text: string }) {
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
    if (error) {
      console.error("[email] Erreur Resend:", error)
      return null
    }
    return data
  } catch (err) {
    console.error("[email] Erreur lors de l'envoi:", err)
    return null
  }
}

// ---------------------------------------------------------------------------
// Email functions
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
  const html = layout(
    subject,
    `<h1 style="margin:0 0 16px;font-size:22px;color:#2c2c2c;">Réservation confirmée</h1>
     <p style="margin:0 0 12px;font-size:15px;color:#2c2c2c;line-height:1.6;">
       Votre cours est bien réservé. Voici les détails :
     </p>
     <table role="presentation" cellpadding="0" cellspacing="0" style="margin:16px 0;width:100%;border:1px solid #e8e2da;border-radius:8px;overflow:hidden;">
       <tr><td style="padding:10px 16px;background-color:#faf7f3;font-size:14px;color:#888;width:120px;">Cours</td><td style="padding:10px 16px;font-size:14px;color:#2c2c2c;font-weight:bold;">${courseName}</td></tr>
       <tr><td style="padding:10px 16px;background-color:#faf7f3;font-size:14px;color:#888;">Date</td><td style="padding:10px 16px;font-size:14px;color:#2c2c2c;">${date}</td></tr>
       <tr><td style="padding:10px 16px;background-color:#faf7f3;font-size:14px;color:#888;">Heure</td><td style="padding:10px 16px;font-size:14px;color:#2c2c2c;">${time}</td></tr>
       <tr><td style="padding:10px 16px;background-color:#faf7f3;font-size:14px;color:#888;">Professeur</td><td style="padding:10px 16px;font-size:14px;color:#2c2c2c;">${instructor}</td></tr>
     </table>
     <p style="margin:16px 0 0;font-size:14px;color:#888;line-height:1.5;">
       Pensez à arriver 5 minutes avant le début du cours. À bientôt !
     </p>`
  )
  const text = `Réservation confirmée\n\nCours : ${courseName}\nDate : ${date}\nHeure : ${time}\nProfesseur : ${instructor}\n\nPensez à arriver 5 minutes avant le début du cours.\n\nMon Pilates — Larmor-Plage`
  return send({ to, subject, html, text })
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
  const html = layout(
    subject,
    `<h1 style="margin:0 0 16px;font-size:22px;color:#2c2c2c;">Rappel de votre cours</h1>
     <p style="margin:0 0 12px;font-size:15px;color:#2c2c2c;line-height:1.6;">
       Votre cours a lieu demain. N'oubliez pas !
     </p>
     <table role="presentation" cellpadding="0" cellspacing="0" style="margin:16px 0;width:100%;border:1px solid #e8e2da;border-radius:8px;overflow:hidden;">
       <tr><td style="padding:10px 16px;background-color:#faf7f3;font-size:14px;color:#888;width:120px;">Cours</td><td style="padding:10px 16px;font-size:14px;color:#2c2c2c;font-weight:bold;">${courseName}</td></tr>
       <tr><td style="padding:10px 16px;background-color:#faf7f3;font-size:14px;color:#888;">Date</td><td style="padding:10px 16px;font-size:14px;color:#2c2c2c;">${date}</td></tr>
       <tr><td style="padding:10px 16px;background-color:#faf7f3;font-size:14px;color:#888;">Heure</td><td style="padding:10px 16px;font-size:14px;color:#2c2c2c;">${time}</td></tr>
       <tr><td style="padding:10px 16px;background-color:#faf7f3;font-size:14px;color:#888;">Professeur</td><td style="padding:10px 16px;font-size:14px;color:#2c2c2c;">${instructor}</td></tr>
     </table>
     <p style="margin:16px 0 0;font-size:14px;color:#888;line-height:1.5;">
       Si vous ne pouvez pas venir, merci d'annuler votre réservation au plus tôt pour libérer la place.
     </p>`
  )
  const text = `Rappel de votre cours\n\nCours : ${courseName}\nDate : ${date}\nHeure : ${time}\nProfesseur : ${instructor}\n\nSi vous ne pouvez pas venir, merci d'annuler votre réservation.\n\nMon Pilates — Larmor-Plage`
  return send({ to, subject, html, text })
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
  const html = layout(
    subject,
    `<h1 style="margin:0 0 16px;font-size:22px;color:#2c2c2c;">Réinitialisation du mot de passe</h1>
     <p style="margin:0 0 12px;font-size:15px;color:#2c2c2c;line-height:1.6;">
       Bonjour ${name},
     </p>
     <p style="margin:0 0 12px;font-size:15px;color:#2c2c2c;line-height:1.6;">
       Vous avez demandé la réinitialisation de votre mot de passe. Cliquez sur le bouton ci-dessous pour choisir un nouveau mot de passe :
     </p>
     ${btn(resetUrl, "Réinitialiser mon mot de passe")}
     <p style="margin:16px 0 0;font-size:13px;color:#888;line-height:1.5;">
       Ce lien est valable pendant 1 heure. Si vous n'êtes pas à l'origine de cette demande, ignorez simplement cet email.
     </p>`
  )
  const text = `Bonjour ${name},\n\nVous avez demandé la réinitialisation de votre mot de passe.\n\nCliquez sur ce lien pour choisir un nouveau mot de passe :\n${resetUrl}\n\nCe lien est valable pendant 1 heure.\n\nSi vous n'êtes pas à l'origine de cette demande, ignorez cet email.\n\nMon Pilates — Larmor-Plage`
  return send({ to, subject, html, text })
}

export async function sendWelcome({
  to,
  name,
}: {
  to: string
  name: string
}) {
  const subject = "Bienvenue chez Mon Pilates !"
  const html = layout(
    subject,
    `<h1 style="margin:0 0 16px;font-size:22px;color:#2c2c2c;">Bienvenue, ${name} !</h1>
     <p style="margin:0 0 12px;font-size:15px;color:#2c2c2c;line-height:1.6;">
       Votre compte a été créé avec succès. Vous pouvez dès maintenant réserver vos cours de Pilates.
     </p>
     ${btn(`${SITE_URL}/planning`, "Voir le planning")}
     <p style="margin:16px 0 0;font-size:14px;color:#888;line-height:1.5;">
       Si vous avez des questions, n'hésitez pas à nous contacter au 06 99 18 32 16 ou par email à contact@mon-pilates.bzh.
     </p>`
  )
  const text = `Bienvenue ${name} !\n\nVotre compte a été créé avec succès.\n\nRéservez vos cours sur ${SITE_URL}/planning\n\nÀ bientôt !\nMon Pilates — Larmor-Plage`
  return send({ to, subject, html, text })
}

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
  return send({ to, subject, html, text })
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
  return send({ to, subject, html, text })
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
  return send({ to, subject, html, text })
}
