import { test, expect } from "@playwright/test"

/**
 * Navigation — from the homepage, the desktop header must expose links to
 * the four critical public routes: Planning, Tarifs, Contact, and Nos cours.
 * Clicking each one must land on the corresponding URL and render its H1.
 *
 * Notes on the real codebase:
 *   - The top-level nav is rendered inside <nav aria-label="Navigation
 *     principale"> (lg:flex only). Playwright's chromium "Desktop Chrome"
 *     device is 1280×720, so the desktop nav IS visible by default.
 *   - The navigation links array in Header.tsx reads:
 *       Nos cours / Planning / Tarifs / Notre studio / L'équipe / Blog / Contact
 *     (plus an optional "Première visite" for first-time visitors). The
 *     first-timer link is cookie-driven, so we scope the locator to the
 *     <nav aria-label="Navigation principale"> to avoid duplicates and
 *     to be robust across variants.
 */

test.describe.configure({ mode: "parallel" })

const NAV_TARGETS: { name: RegExp; path: string; heading: RegExp }[] = [
  { name: /nos cours/i, path: "/cours", heading: /cours|pilates/i },
  { name: /^planning$/i, path: "/planning", heading: /planning/i },
  { name: /^tarifs$/i, path: "/tarifs", heading: /tarifs/i },
  { name: /^contact$/i, path: "/contact", heading: /contact/i },
]

test.describe("Navigation — header links depuis la home", () => {
  for (const { name, path, heading } of NAV_TARGETS) {
    test(`Header → ${path}`, async ({ page }) => {
      await page.goto("/")

      // Restrict to the main desktop nav — avoids clashes with the mobile
      // drawer or the footer (which repeats the same links).
      const nav = page.getByRole("navigation", { name: /navigation principale/i })
      await expect(nav).toBeVisible()

      const link = nav.getByRole("link", { name }).first()
      await expect(link).toBeVisible()
      await link.click()

      await page.waitForURL(new RegExp(`${path.replace("/", "\\/")}(\\?|$|#)`), {
        timeout: 15_000,
      })
      expect(new URL(page.url()).pathname).toBe(path)

      // The landed page must render an H1 matching the expected theme.
      await expect(page.getByRole("heading", { level: 1 }).first()).toContainText(heading)
    })
  }

  test("Logo → retour à la home", async ({ page }) => {
    await page.goto("/planning")

    // The logo link has aria-label "Mon Pilates — Accueil"
    const logo = page.getByRole("link", { name: /mon pilates.*accueil/i }).first()
    await expect(logo).toBeVisible()
    await logo.click()

    await page.waitForURL(/\/$/, { timeout: 10_000 })
    expect(new URL(page.url()).pathname).toBe("/")
  })
})

test.describe("Navigation — footer présent sur les pages clés", () => {
  const PATHS = ["/", "/planning", "/tarifs", "/contact", "/cours"]

  for (const path of PATHS) {
    test(`Footer visible sur ${path}`, async ({ page }) => {
      await page.goto(path)
      const footer = page.locator("footer, [role='contentinfo']").first()
      await expect(footer).toBeVisible()
    })
  }
})
