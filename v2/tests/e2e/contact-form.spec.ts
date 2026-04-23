import { test, expect } from "@playwright/test"

/**
 * Contact form — /contact hosts a custom React form (ContactForm.tsx) with
 * client-side validation (firstName, lastName, email, subject, message
 * required; email must be well-formed; message ≥ 10 chars). Errors are
 * rendered in <p role="alert"> next to each invalid field.
 *
 * These tests verify:
 *   1) Submitting an empty form surfaces multiple inline error messages
 *      AND does not hit the /api/contact endpoint (no network request).
 *   2) Submitting a valid form hits /api/contact and, on success, swaps the
 *      form for a "Message envoyé !" confirmation block.
 *
 * We stub /api/contact to avoid the real Resend email send + DB write.
 * If any validation rule regresses (e.g. message length bypass, missing
 * subject accepted), users could submit garbage to the inbox. This suite
 * catches that cheaply.
 */

test.describe.configure({ mode: "parallel" })

test.describe("Contact form — /contact", () => {
  test("Soumission vide affiche les erreurs et ne POST pas", async ({ page }) => {
    let apiHit = false
    await page.route("**/api/contact", async (route) => {
      apiHit = true
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ ok: true }),
      })
    })

    await page.goto("/contact")

    // Submit without filling anything
    await page.getByRole("button", { name: /envoyer le message/i }).click()

    // At least the "requis" errors must appear — we expect multiple role=alert
    const alerts = page.getByRole("alert")
    await expect(alerts.first()).toBeVisible()
    expect(await alerts.count()).toBeGreaterThanOrEqual(3)

    // Specifically the firstName required message
    await expect(page.getByText(/le prénom est requis/i)).toBeVisible()
    await expect(page.getByText(/le nom est requis/i)).toBeVisible()
    await expect(page.getByText(/l'email est requis/i)).toBeVisible()

    // No POST should have been fired
    await page.waitForTimeout(300)
    expect(apiHit).toBe(false)
  })

  test("Email mal formé affiche l'erreur spécifique email", async ({ page }) => {
    await page.route("**/api/contact", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ ok: true }),
      })
    })

    await page.goto("/contact")

    await page.getByLabel(/^prénom/i).fill("Jean")
    await page.getByLabel(/^nom/i).fill("Dupont")
    await page.getByLabel(/^email/i).fill("pas-un-email")
    await page.getByLabel(/^sujet/i).selectOption({ label: "Question générale" })
    await page
      .getByLabel(/^message/i)
      .fill("Un message suffisamment long pour passer la validation.")

    await page.getByRole("button", { name: /envoyer le message/i }).click()

    await expect(page.getByText(/l'email n'est pas valide/i)).toBeVisible()
  })

  test("Soumission valide affiche la confirmation de succès", async ({ page }) => {
    // Stub the endpoint so the happy path runs without real email send
    await page.route("**/api/contact", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ ok: true }),
      })
    })

    await page.goto("/contact")

    await page.getByLabel(/^prénom/i).fill("Alice")
    await page.getByLabel(/^nom/i).fill("Martin")
    await page.getByLabel(/^email/i).fill("alice@example.com")
    await page.getByLabel(/^sujet/i).selectOption({ label: "Question générale" })
    await page
      .getByLabel(/^message/i)
      .fill("Bonjour, je souhaiterais en savoir plus sur les cours tapis.")

    await page.getByRole("button", { name: /envoyer le message/i }).click()

    // Success state: the form is replaced by a "Message envoyé !" card
    await expect(
      page.getByRole("heading", { name: /message envoyé/i })
    ).toBeVisible({ timeout: 10_000 })
    await expect(
      page.getByText(/nous vous répondrons dans les meilleurs délais/i)
    ).toBeVisible()
  })
})
