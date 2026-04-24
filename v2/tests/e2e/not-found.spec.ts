import { test, expect } from "@playwright/test"

/**
 * 404 — hitting a route that does not exist must render the custom
 * `src/app/not-found.tsx`, NOT the default Next.js 404 page.
 *
 * Custom page fingerprints:
 *   - H1: "Cette page a pris une pause"
 *   - Decorative "404" number rendered via aria-hidden wrapper
 *   - Suggestion cards with links to /planning, /cours, /tarifs, /equipe,
 *     /contact, /premiere-visite
 *   - CTA buttons: "Retour à l'accueil" + "Voir les cours"
 *   - <meta name="robots" content="noindex, nofollow"> via metadata export
 *
 * The Next.js default 404 page would render "404 | This page could not be
 * found." — an assertion on the French heading therefore guarantees we got
 * the custom one.
 */

test.describe("Custom 404 page", () => {
  test("Route inexistante → rend la page not-found personnalisée", async ({
    page,
  }) => {
    const response = await page.goto("/cette-page-nexiste-absolument-pas-42", {
      waitUntil: "domcontentloaded",
    })

    // Next renders custom not-found with HTTP 404
    expect(response?.status()).toBe(404)

    // Custom French H1 — the Next default would be "404 | This page could
    // not be found." in English.
    await expect(
      page.getByRole("heading", { level: 1, name: /cette page a pris une pause/i })
    ).toBeVisible()

    // Must NOT be the default Next 404 text
    const html = await page.content()
    expect(html).not.toMatch(/this page could not be found/i)

    // A couple of suggestion cards should be rendered
    await expect(
      page.getByRole("link", { name: /planning des cours/i })
    ).toBeVisible()
    await expect(
      page.getByRole("link", { name: "Retour à l'accueil", exact: true })
    ).toBeVisible()
  })

  test("404 → CTA 'Retour à l'accueil' ramène sur /", async ({ page }) => {
    await page.goto("/une-autre-route-qui-nexiste-pas")

    await expect(
      page.getByRole("heading", { level: 1, name: /cette page a pris une pause/i })
    ).toBeVisible()

    await page.getByRole("link", { name: "Retour à l'accueil", exact: true }).click()

    await page.waitForURL(/\/$/, { timeout: 10_000 })
    expect(new URL(page.url()).pathname).toBe("/")
  })
})
