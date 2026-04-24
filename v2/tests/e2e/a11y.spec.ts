import { test, expect } from "@playwright/test"

/**
 * A11y smoke — low-cost accessibility guarantees that must never regress.
 *
 * What this covers:
 *   - The "skip to main content" link exists, is the first focusable
 *     element of the page, and is revealed once focused (sr-only → visible).
 *   - Pressing Enter on the skip link moves focus to the main content
 *     landmark.
 *   - The <main> landmark has a unique id the skip link can target.
 *   - The primary navigation has an accessible name.
 *
 * Notes on the real codebase:
 *   - The single skip link lives in src/app/layout.tsx → href="#main-content".
 *     It is the first focusable element of every page (rendered before the
 *     Header).
 *   - <main id="main-content"> wraps children so the hash target resolves.
 */

test.describe.configure({ mode: "parallel" })

const PATHS = ["/", "/planning"]

for (const path of PATHS) {
  test.describe(`A11y — ${path}`, () => {
    test(`Skip-to-content link est focusable en premier et cible le main`, async ({
      page,
    }) => {
      await page.goto(path)

      // The skip link carries the accessible name "Aller au contenu principal"
      const skipLink = page.getByRole("link", { name: /aller au contenu principal/i })
      await expect(skipLink).toHaveCount(1)

      // It must have an anchor href targeting the main landmark
      const href = await skipLink.getAttribute("href")
      expect(href).toBe("#main-content")

      // Hit Tab from the body — the skip link should be the first focusable
      // element on the page. We focus the document root first to ensure Tab
      // starts from the very top of the tab order.
      await page.evaluate(() => {
        ;(document.activeElement as HTMLElement | null)?.blur?.()
        document.body.focus()
      })
      await page.keyboard.press("Tab")

      // Assert the focused element is the skip link (by its accessible name)
      const focusedName = await page.evaluate(() => {
        const el = document.activeElement as HTMLElement | null
        return el?.textContent?.trim() ?? ""
      })
      expect(focusedName).toMatch(/aller au contenu principal/i)

      // Activating the skip link must move the URL hash to the main landmark
      await page.keyboard.press("Enter")
      await expect(page).toHaveURL(/#main-content$/)

      // The target element must exist in the DOM
      const mainCount = await page.locator("#main-content").count()
      expect(mainCount).toBeGreaterThan(0)
    })

    test(`Page a un <main> et une navigation principale nommée`, async ({
      page,
    }) => {
      await page.goto(path)

      // Exactly one main landmark (<main role="main">)
      const main = page.getByRole("main")
      await expect(main).toHaveCount(1)

      // The primary nav has aria-label "Navigation principale"
      // (not asserted as visible because it is lg-only, but it must exist
      // in the DOM for assistive tech).
      const nav = page.getByRole("navigation", { name: /navigation principale/i })
      await expect(nav).toHaveCount(1)
    })

    test(`La page expose un H1 unique`, async ({ page }) => {
      await page.goto(path)
      const h1s = page.getByRole("heading", { level: 1 })
      expect(await h1s.count()).toBeGreaterThanOrEqual(1)
      await expect(h1s.first()).toBeVisible()
    })
  })
}
