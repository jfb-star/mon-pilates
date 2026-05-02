import puppeteer from "puppeteer";
import path from "path";
import fs from "fs";

const BASE_URL = process.argv[2] || "http://localhost:3456";
const OUT_DIR = path.resolve(__dirname, "../screenshots-sections");

const pages = [
  { name: "home", path: "/" },
  { name: "planning", path: "/planning" },
  { name: "cours", path: "/cours" },
  { name: "cours-tapis", path: "/cours/tapis" },
  { name: "tarifs", path: "/tarifs" },
  { name: "equipe", path: "/equipe" },
  { name: "blog", path: "/blog" },
  { name: "contact", path: "/contact" },
  { name: "carte-cadeau", path: "/carte-cadeau" },
  { name: "connexion", path: "/connexion" },
  { name: "premiere-visite", path: "/premiere-visite" },
  { name: "mentions-legales", path: "/mentions-legales" },
];

/** Capture a sequence of viewport-sized snaps as the user scrolls through the page. */
async function captureScrollSequence(page: any, baseName: string, viewportLabel: string, maxFrames = 6) {
  const pageHeight = await page.evaluate(() => document.body.scrollHeight);
  const vh = await page.evaluate(() => window.innerHeight);
  const frames = Math.min(maxFrames, Math.ceil(pageHeight / vh));
  for (let i = 0; i < frames; i++) {
    const y = i * (vh * 0.85);
    await page.evaluate((scrollY: number) => window.scrollTo(0, scrollY), y);
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(OUT_DIR, `${baseName}-${viewportLabel}-${String(i + 1).padStart(2, "0")}.png`),
      fullPage: false,
    });
  }
}

async function main() {
  fs.rmSync(OUT_DIR, { recursive: true, force: true });
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
  });

  for (const { name, path: pagePath } of pages) {
    const page = await browser.newPage();
    try {
      // Desktop
      await page.setViewport({ width: 1440, height: 900 });
      const r1 = await page.goto(`${BASE_URL}${pagePath}`, { waitUntil: "networkidle0", timeout: 60000 });
      if (!r1 || !r1.ok()) {
        console.log(`✗ ${name} - HTTP ${r1?.status()}`);
        await page.close();
        continue;
      }
      await page.evaluate(() => localStorage.setItem("mp_cookie_consent", "accepted"));
      await page.reload({ waitUntil: "networkidle0" });
      await new Promise((r) => setTimeout(r, 1200));
      await captureScrollSequence(page, name, "desktop");
      console.log(`✓ ${name} desktop sequence`);

      // Mobile
      await page.setViewport({ width: 390, height: 844 });
      await page.goto(`${BASE_URL}${pagePath}`, { waitUntil: "networkidle0", timeout: 60000 });
      await page.evaluate(() => localStorage.setItem("mp_cookie_consent", "accepted"));
      await page.reload({ waitUntil: "networkidle0" });
      await new Promise((r) => setTimeout(r, 1200));
      await captureScrollSequence(page, name, "mobile");
      console.log(`✓ ${name} mobile sequence`);
    } catch (e: any) {
      console.log(`✗ ${name} failed: ${e.message}`);
    }
    await page.close();
  }

  await browser.close();
  console.log(`\nDone. Viewport snaps saved to ${OUT_DIR}`);
}

main().catch(console.error);
