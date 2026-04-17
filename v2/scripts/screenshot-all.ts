import puppeteer from "puppeteer";
import path from "path";
import fs from "fs";

const BASE_URL = process.argv[2] || "http://localhost:3456";
const OUT_DIR = path.resolve(__dirname, "../screenshots");

const pages = [
  { name: "home", path: "/" },
  { name: "planning", path: "/planning" },
  { name: "cours", path: "/cours" },
  { name: "cours-mat", path: "/cours/mat" },
  { name: "tarifs", path: "/tarifs" },
  { name: "equipe", path: "/equipe" },
  { name: "blog", path: "/blog" },
  { name: "blog-article", path: "/blog/5-exercices-pilates-mal-de-dos" },
  { name: "contact", path: "/contact" },
  { name: "carte-cadeau", path: "/carte-cadeau" },
  { name: "mentions-legales", path: "/mentions-legales" },
  { name: "connexion", path: "/connexion" },
  { name: "premiere-visite", path: "/premiere-visite" },
];

async function main() {
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
      const response = await page.goto(`${BASE_URL}${pagePath}`, {
        waitUntil: "networkidle0",
        timeout: 60000,
      });
      if (!response || !response.ok()) {
        console.log(`✗ ${name} - HTTP ${response?.status()}`);
        await page.close();
        continue;
      }
      await new Promise((r) => setTimeout(r, 2000));
      // Scroll to trigger IntersectionObserver reveals
      await page.evaluate(async () => {
        const step = window.innerHeight;
        const max = document.body.scrollHeight;
        for (let y = 0; y < max; y += step) {
          window.scrollTo(0, y);
          await new Promise(r => setTimeout(r, 200));
        }
        window.scrollTo(0, 0);
        await new Promise(r => setTimeout(r, 300));
      });
      await page.screenshot({
        path: path.join(OUT_DIR, `${name}-desktop.png`),
        fullPage: true,
      });
      console.log(`✓ ${name}-desktop.png`);

      // Mobile
      await page.setViewport({ width: 390, height: 844 });
      await page.goto(`${BASE_URL}${pagePath}`, {
        waitUntil: "networkidle0",
        timeout: 60000,
      });
      await new Promise((r) => setTimeout(r, 2000));
      await page.evaluate(async () => {
        const step = window.innerHeight;
        const max = document.body.scrollHeight;
        for (let y = 0; y < max; y += step) {
          window.scrollTo(0, y);
          await new Promise(r => setTimeout(r, 200));
        }
        window.scrollTo(0, 0);
        await new Promise(r => setTimeout(r, 300));
      });
      await page.screenshot({
        path: path.join(OUT_DIR, `${name}-mobile.png`),
        fullPage: true,
      });
      console.log(`✓ ${name}-mobile.png`);
    } catch (e: any) {
      console.log(`✗ ${name} failed: ${e.message}`);
    }

    await page.close();
  }

  await browser.close();
  console.log(`\nDone! Screenshots saved to ./screenshots/`);
}

main().catch(console.error);
