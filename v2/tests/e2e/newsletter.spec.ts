import { test, expect } from "@playwright/test"

/**
 * Newsletter signup — the footer exposes an inscription form that posts to
 * `/api/newsletter`. The form is a plain HTML <form method="POST"> (no JS
 * handler), so a successful POST triggers a full-page navigation: the server
 * route renders / returns a response that the browser navigates to.
 *
 * We don't want to hit the real rate-limited endpoint nor write to the DB,
 * so we intercept the POST and return a redirect back to the current page
 * with a `?newsletter=ok` query flag (mirroring the shape the route would
 * use for success). The test asserts:
 *   - the form is rendered on the homepage
 *   - it has the right action + accessible name
 *   - submitting fires the network call with the email as form data
 *
 * If the form ever regresses (wrong action, removed, missing email input,
 * broken accessibility), this fails loudly before real users notice.
 */

test.describe("Newsletter — inscription depuis le footer", () => {
  test("Le formulaire newsletter est présent et envoie l'email saisi", async ({
    page,
  }) => {
    // Intercept the POST so no real email / DB / rate-limit hit
    let capturedBody: string | null = null
    await page.route("**/api/newsletter", async (route) => {
      capturedBody = route.request().postData()
      await route.fulfill({
        status: 303,
        headers: { Location: "/?newsletter=ok" },
        body: "",
      })
    })

    await page.goto("/")

    // The form is inside the footer and carries an accessible name
    const form = page.getByRole("form", {
      name: /inscription à la newsletter/i,
    })
    await expect(form).toBeVisible()

    // Action points to /api/newsletter (relative URL ok)
    await expect(form).toHaveAttribute("action", "/api/newsletter")

    // Email input must be present with the expected accessible label
    const emailInput = form.getByLabel(/votre adresse email/i)
    await expect(emailInput).toBeVisible()
    await expect(emailInput).toHaveAttribute("type", "email")
    await expect(emailInput).toHaveAttribute("required", "")

    // Submit button must be visible
    const submit = form.getByRole("button", { name: /s'inscrire/i })
    await expect(submit).toBeVisible()

    // Fill + submit → should POST to the intercepted route
    await emailInput.fill("test-newsletter@example.com")
    await submit.click()

    // Wait a moment for the intercepted request to be captured
    await expect
      .poll(() => capturedBody, { timeout: 5_000 })
      .not.toBeNull()

    expect(capturedBody).toMatch(/email=test-newsletter%40example\.com/)
  })

  test("Email invalide est rejeté par la validation HTML5 (pas d'appel réseau)", async ({
    page,
  }) => {
    let requestFired = false
    await page.route("**/api/newsletter", async (route) => {
      requestFired = true
      await route.fulfill({ status: 200, body: "ok" })
    })

    await page.goto("/")

    const form = page.getByRole("form", {
      name: /inscription à la newsletter/i,
    })
    const emailInput = form.getByLabel(/votre adresse email/i)

    // Non-email string — browser must block submission on `type="email"`
    await emailInput.fill("not-an-email")
    await form.getByRole("button", { name: /s'inscrire/i }).click()

    // Give the browser a tick; no request must have been fired
    await page.waitForTimeout(500)
    expect(requestFired).toBe(false)

    // The invalid input should report as invalid via the constraint API
    const isInvalid = await emailInput.evaluate(
      (el) => (el as HTMLInputElement).validity.valid === false
    )
    expect(isInvalid).toBe(true)
  })
})
