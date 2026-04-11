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
  { name: "compte", path: "/compte" },
  { name: "mentions-legales", path: "/mentions-legales" },
];

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  for (const { name, path: pagePath } of pages) {
    // Desktop
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(`${BASE_URL}${pagePath}`, { waitUntil: "networkidle0", timeout: 20000 });
    await page.screenshot({ path: path.join(OUT_DIR, `${name}-desktop.png`), fullPage: true });
    console.log(`✓ ${name}-desktop.png`);

    // Mobile
    await page.setViewport({ width: 390, height: 844 });
    await page.goto(`${BASE_URL}${pagePath}`, { waitUntil: "networkidle0", timeout: 20000 });
    await page.screenshot({ path: path.join(OUT_DIR, `${name}-mobile.png`), fullPage: true });
    console.log(`✓ ${name}-mobile.png`);
  }

  await browser.close();
  console.log(`\nDone! ${pages.length * 2} screenshots saved to ./screenshots/`);
}

main().catch(console.error);
