import { test, expect } from "@playwright/test"

/**
 * Auth flows — the /connexion page hosts login, register, and forgot-password
 * modes via in-page toggle buttons (there is no separate /inscription or
 * /mot-de-passe-oublie route in this codebase).
 *
 * These tests exercise the UI contract only — no real DB / no real email send
 * is required. The forgot-password endpoint is allowed to be hit because the
 * success banner is shown regardless of whether the email exists (generic
 * response to avoid user enumeration).
 */

test.describe.configure({ mode: "parallel" })

test.describe("Auth — /connexion", () => {
  test("Utilisateur peut voir la page de connexion", async ({ page }) => {
    await page.goto("/connexion")

    // Heading
    await expect(
      page.getByRole("heading", { name: /bon retour/i })
    ).toBeVisible()

    // Email + password fields (login mode is default)
    await expect(page.getByLabel(/^email$/i)).toBeVisible()
    await expect(page.getByLabel(/^mot de passe$/i)).toBeVisible()

    // Submit button
    await expect(
      page.getByRole("button", { name: /se connecter/i })
    ).toBeVisible()

    // Forgot-password link (rendered as a <button>)
    await expect(
      page.getByRole("button", { name: /mot de passe oublié/i })
    ).toBeVisible()
  })

  test("Login avec credentials invalides affiche une erreur", async ({ page }) => {
    // Stub the NextAuth credentials callback so the test never hits the DB
    await page.route("**/api/auth/callback/credentials**", async (route) => {
      await route.fulfill({
        status: 401,
        contentType: "application/json",
        body: JSON.stringify({ url: null, error: "CredentialsSignin" }),
      })
    })

    await page.goto("/connexion")

    await page.getByLabel(/^email$/i).fill("wrong@test.com")
    await page.getByLabel(/^mot de passe$/i).fill("badpass")
    await page.getByRole("button", { name: /se connecter/i }).click()

    // The component renders errors in a role="alert" div. Exclude Next's
    // always-present route announcer ("__next-route-announcer__") and the
    // toast copy that mirrors the message — the in-form alert is the first
    // match with non-empty text.
    const alert = page
      .getByRole("alert")
      .filter({ hasText: /incorrect|erreur/i })
      .first()
    await expect(alert).toBeVisible()
  })

  test("Page inscription charge et formulaire a les bons champs", async ({ page }) => {
    // Register mode is reached via the "Créer un compte" toggle on /connexion
    await page.goto("/connexion")
    await page.getByRole("button", { name: /créer un compte/i }).click()

    // Heading switches
    await expect(
      page.getByRole("heading", { name: /bienvenue/i })
    ).toBeVisible()

    // All required fields
    await expect(page.getByLabel(/nom complet/i)).toBeVisible()
    await expect(page.getByLabel(/^email$/i)).toBeVisible()
    await expect(
      page.getByLabel(/^mot de passe/i).first()
    ).toBeVisible()
    await expect(
      page.getByLabel(/confirmer le mot de passe/i)
    ).toBeVisible()

    await expect(
      page.getByRole("button", { name: /créer mon compte/i })
    ).toBeVisible()
  })

  test("Password reset form submit affiche confirmation", async ({ page }) => {
    // Stub the forgot-password endpoint so no email is actually sent
    await page.route("**/api/auth/forgot-password", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ ok: true }),
      })
    })

    await page.goto("/connexion")
    await page.getByRole("button", { name: /mot de passe oublié/i }).click()

    await expect(
      page.getByRole("heading", { name: /mot de passe oublié/i })
    ).toBeVisible()

    await page.getByLabel(/^email$/i).fill("anyone@test.com")
    await page.getByRole("button", { name: /envoyer le lien/i }).click()

    // Generic success message (no user enumeration)
    await expect(
      page.getByText(
        /si un compte existe avec cet email|vous recevrez un lien/i
      )
    ).toBeVisible()
  })
})
