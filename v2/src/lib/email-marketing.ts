import "server-only"

import { sendEmail } from "@/lib/resend"
import { getUnsubscribeUrl } from "@/lib/unsubscribe-url"

/**
 * Marketing email wrapper.
 *
 * Appends a RGPD-compliant "Se désinscrire" footer (HTML + text) pointing at
 * the public /unsubscribe page with a signed HMAC token.  Transactional mail
 * must NOT flow through this helper — use `sendEmail` / `sendTemplate`
 * directly from `@/lib/resend`.
 */

function htmlFooter(unsubscribeUrl: string): string {
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin-top:32px;border-top:1px solid #e8e2da;padding-top:16px;">
      <tr>
        <td style="font-family:system-ui,-apple-system,sans-serif;font-size:12px;color:#888;line-height:1.5;text-align:center;">
          Vous recevez cet email parce que vous êtes inscrit·e à la newsletter Mon Pilates.<br />
          <a href="${unsubscribeUrl}" style="color:#6b9fad;text-decoration:underline;">Se désinscrire</a>
        </td>
      </tr>
    </table>`
}

function textFooter(unsubscribeUrl: string): string {
  return `\n\n---\nVous recevez cet email parce que vous êtes inscrit·e à la newsletter Mon Pilates.\nSe désinscrire : ${unsubscribeUrl}\n`
}

/**
 * Inject the unsubscribe footer into the body just before </body> if that tag
 * exists, otherwise append to the end.
 */
function injectHtmlFooter(html: string, footer: string): string {
  const bodyClose = html.lastIndexOf("</body>")
  if (bodyClose === -1) return html + footer
  return html.slice(0, bodyClose) + footer + html.slice(bodyClose)
}

export async function sendMarketingEmail(opts: {
  to: string
  subject: string
  html: string
  text?: string
  replyTo?: string
  tags?: { name: string; value: string }[]
  templateKey?: string
}): Promise<{ id: string }> {
  const url = getUnsubscribeUrl(opts.to)
  const html = injectHtmlFooter(opts.html, htmlFooter(url))
  const text =
    typeof opts.text === "string" ? opts.text + textFooter(url) : undefined

  return sendEmail({
    to: opts.to,
    subject: opts.subject,
    html,
    text,
    replyTo: opts.replyTo,
    tags: [...(opts.tags ?? []), { name: "category", value: "marketing" }],
    templateKey: opts.templateKey,
  })
}
