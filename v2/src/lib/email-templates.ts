// ---------------------------------------------------------------------------
// Pure HTML builders for the transactional templates.
//
// Kept in a dedicated, dependency-free module so prisma/seed.ts can import it
// from a plain Node script (no Next runtime, no server-only). `email.ts`
// re-exports the same builders for app code.
// ---------------------------------------------------------------------------

import { SITE_URL } from "@/lib/env"

// Keep the NEXTAUTH_URL priority so email links match the auth redirect
// origin, but fall back to the shared SITE_URL constant instead of the apex.
export const EMAIL_SITE_URL = process.env.NEXTAUTH_URL || SITE_URL

export function layout(title: string, body: string): string {
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

export function btn(href: string, label: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px 0;"><tr><td style="background-color:#6b9fad;border-radius:8px;padding:14px 28px;"><a href="${href}" style="color:#ffffff;text-decoration:none;font-size:15px;font-weight:bold;">${label}</a></td></tr></table>`
}

// ---------------------------------------------------------------------------
// Template builders — placeholder syntax is {{varName}} (Mustache-style).
// ---------------------------------------------------------------------------

export function buildBookingConfirmHtml(): string {
  return layout(
    "Réservation confirmée — {{courseName}}",
    `<h1 style="margin:0 0 16px;font-size:22px;color:#2c2c2c;">Réservation confirmée</h1>
     <p style="margin:0 0 12px;font-size:15px;color:#2c2c2c;line-height:1.6;">
       Votre cours est bien réservé. Voici les détails :
     </p>
     <table role="presentation" cellpadding="0" cellspacing="0" style="margin:16px 0;width:100%;border:1px solid #e8e2da;border-radius:8px;overflow:hidden;">
       <tr><td style="padding:10px 16px;background-color:#faf7f3;font-size:14px;color:#888;width:120px;">Cours</td><td style="padding:10px 16px;font-size:14px;color:#2c2c2c;font-weight:bold;">{{courseName}}</td></tr>
       <tr><td style="padding:10px 16px;background-color:#faf7f3;font-size:14px;color:#888;">Date</td><td style="padding:10px 16px;font-size:14px;color:#2c2c2c;">{{date}}</td></tr>
       <tr><td style="padding:10px 16px;background-color:#faf7f3;font-size:14px;color:#888;">Heure</td><td style="padding:10px 16px;font-size:14px;color:#2c2c2c;">{{time}}</td></tr>
       <tr><td style="padding:10px 16px;background-color:#faf7f3;font-size:14px;color:#888;">Professeur</td><td style="padding:10px 16px;font-size:14px;color:#2c2c2c;">{{instructor}}</td></tr>
     </table>
     <p style="margin:16px 0 0;font-size:14px;color:#888;line-height:1.5;">
       Pensez à arriver 5 minutes avant le début du cours. À bientôt !
     </p>`
  )
}

export function buildBookingReminderHtml(): string {
  return layout(
    "Rappel : {{courseName}} demain",
    `<h1 style="margin:0 0 16px;font-size:22px;color:#2c2c2c;">Rappel de votre cours</h1>
     <p style="margin:0 0 12px;font-size:15px;color:#2c2c2c;line-height:1.6;">
       Votre cours a lieu demain. N'oubliez pas !
     </p>
     <table role="presentation" cellpadding="0" cellspacing="0" style="margin:16px 0;width:100%;border:1px solid #e8e2da;border-radius:8px;overflow:hidden;">
       <tr><td style="padding:10px 16px;background-color:#faf7f3;font-size:14px;color:#888;width:120px;">Cours</td><td style="padding:10px 16px;font-size:14px;color:#2c2c2c;font-weight:bold;">{{courseName}}</td></tr>
       <tr><td style="padding:10px 16px;background-color:#faf7f3;font-size:14px;color:#888;">Date</td><td style="padding:10px 16px;font-size:14px;color:#2c2c2c;">{{date}}</td></tr>
       <tr><td style="padding:10px 16px;background-color:#faf7f3;font-size:14px;color:#888;">Heure</td><td style="padding:10px 16px;font-size:14px;color:#2c2c2c;">{{time}}</td></tr>
       <tr><td style="padding:10px 16px;background-color:#faf7f3;font-size:14px;color:#888;">Professeur</td><td style="padding:10px 16px;font-size:14px;color:#2c2c2c;">{{instructor}}</td></tr>
     </table>
     <p style="margin:16px 0 0;font-size:14px;color:#888;line-height:1.5;">
       Si vous ne pouvez pas venir, merci d'annuler votre réservation au plus tôt pour libérer la place.
     </p>`
  )
}

export function buildBookingCancelledHtml(): string {
  return layout(
    "Annulation — {{courseName}}",
    `<h1 style="margin:0 0 16px;font-size:22px;color:#2c2c2c;">Votre séance a été annulée</h1>
     <p style="margin:0 0 12px;font-size:15px;color:#2c2c2c;line-height:1.6;">
       Bonjour {{userName}},
     </p>
     <p style="margin:0 0 12px;font-size:15px;color:#2c2c2c;line-height:1.6;">
       Votre réservation pour le cours suivant a bien été annulée :
     </p>
     <table role="presentation" cellpadding="0" cellspacing="0" style="margin:16px 0;width:100%;border:1px solid #e8e2da;border-radius:8px;overflow:hidden;">
       <tr><td style="padding:10px 16px;background-color:#faf7f3;font-size:14px;color:#888;width:120px;">Cours</td><td style="padding:10px 16px;font-size:14px;color:#2c2c2c;font-weight:bold;">{{courseName}}</td></tr>
       <tr><td style="padding:10px 16px;background-color:#faf7f3;font-size:14px;color:#888;">Date</td><td style="padding:10px 16px;font-size:14px;color:#2c2c2c;">{{date}}</td></tr>
       <tr><td style="padding:10px 16px;background-color:#faf7f3;font-size:14px;color:#888;">Heure</td><td style="padding:10px 16px;font-size:14px;color:#2c2c2c;">{{time}}</td></tr>
     </table>
     <p style="margin:16px 0 0;font-size:14px;color:#888;line-height:1.5;">
       Si cette annulation n'est pas de votre fait, contactez-nous rapidement.
     </p>`
  )
}

export function buildResetPasswordHtml(): string {
  return layout(
    "Réinitialisation du mot de passe",
    `<h1 style="margin:0 0 16px;font-size:22px;color:#2c2c2c;">Réinitialisation du mot de passe</h1>
     <p style="margin:0 0 12px;font-size:15px;color:#2c2c2c;line-height:1.6;">
       Bonjour {{name}},
     </p>
     <p style="margin:0 0 12px;font-size:15px;color:#2c2c2c;line-height:1.6;">
       Vous avez demandé la réinitialisation de votre mot de passe. Cliquez sur le bouton ci-dessous pour choisir un nouveau mot de passe :
     </p>
     ${btn("{{resetUrl}}", "Réinitialiser mon mot de passe")}
     <p style="margin:16px 0 0;font-size:13px;color:#888;line-height:1.5;">
       Ce lien est valable pendant 1 heure. Si vous n'êtes pas à l'origine de cette demande, ignorez simplement cet email.
     </p>`
  )
}

export function buildWelcomeHtml(): string {
  return layout(
    "Bienvenue chez Mon Pilates !",
    `<h1 style="margin:0 0 16px;font-size:22px;color:#2c2c2c;">Bienvenue, {{name}} !</h1>
     <p style="margin:0 0 12px;font-size:15px;color:#2c2c2c;line-height:1.6;">
       Votre compte a été créé avec succès. Vous pouvez dès maintenant réserver vos cours de Pilates.
     </p>
     ${btn(`${EMAIL_SITE_URL}/planning`, "Voir le planning")}
     <p style="margin:16px 0 0;font-size:14px;color:#888;line-height:1.5;">
       Si vous avez des questions, n'hésitez pas à nous contacter au 06 99 18 32 16 ou par email à contact@mon-pilates.bzh.
     </p>`
  )
}
