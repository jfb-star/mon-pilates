import { test, expect } from "@playwright/test"

/**
 * Unsubscribe flow — /unsubscribe?token=… is the email-link landing page.
 *
 * Two scenarios matter for users who click an unsubscribe link:
 *
 *   1. Token is missing or tampered → page renders a clear "Lien invalide
 *      ou expiré" message with a link to /contact for manual handling.
 *      Critical because a broken link on an unsubscribe email is a GDPR +
 *      reputation hazard (users will mark as spam).
 *
 *   2. Token looks valid in shape but the page flow exists — the confirm
 *      button is visible and posts to /api/unsubscribe. We cannot mint a
 *      real HMAC token from the E2E without leaking the secret, so we only
 *      assert the invalid-token UX here, which is what most mis-clicks hit.
 *
 * We intentionally do NOT assert the happy path because:
 *   - the token depends on UNSUBSCRIBE_TOKEN_SECRET at runtime
 *   - the unit suite (tests/unit/unsubscribe-token.test.ts) already covers
 *     the crypto end
 *   - E2E should catch the UI, which is what this does.
 */

test.describe("Unsubscribe — lien email invalide", () => {
  test("Sans token → affiche l'état 'Lien invalide ou expiré'", async ({
    page,
  }) => {
    await page.goto("/unsubscribe")

    await expect(
      page.getByRole("heading", { name: /lien invalide ou expiré/i })
    ).toBeVisible()

    // Must offer a path to manual handling via /contact
    const contactLink = page.getByRole("link", { name: /page contact/i })
    await expect(contactLink).toBeVisible()
    await expect(contactLink).toHaveAttribute("href", "/contact")
  })

  test("Token tronqué → même état 'Lien invalide ou expiré'", async ({
    page,
  }) => {
    await page.goto("/unsubscribe?token=clearly-broken-token")

    await expect(
      page.getByRole("heading", { name: /lien invalide ou expiré/i })
    ).toBeVisible()

    // No confirm button in this state — the form is NOT rendered
    await expect(
      page.getByRole("button", { name: /confirmer la désinscription/i })
    ).toHaveCount(0)
  })

  test("Cliquer sur 'page contact' depuis le lien invalide mène à /contact", async ({
    page,
  }) => {
    await page.goto("/unsubscribe?token=bad")

    await page.getByRole("link", { name: /page contact/i }).click()
    await page.waitForURL(/\/contact(\?|$|#)/, { timeout: 10_000 })
    expect(new URL(page.url()).pathname).toBe("/contact")
  })
})
