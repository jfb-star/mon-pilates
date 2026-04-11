import puppeteer from "puppeteer";
import path from "path";

const BASE_URL = process.argv[2] || "http://localhost:3456";
const OUT_DIR = path.resolve(__dirname, "../screenshots");

async function main() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // Desktop screenshot (full page)
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(BASE_URL, { waitUntil: "networkidle0", timeout: 15000 });
  await page.screenshot({
    path: path.join(OUT_DIR, "home-desktop.png"),
    fullPage: true,
  });
  console.log("✓ home-desktop.png");

  // Mobile screenshot (full page)
  await page.setViewport({ width: 390, height: 844 });
  await page.goto(BASE_URL, { waitUntil: "networkidle0", timeout: 15000 });
  await page.screenshot({
    path: path.join(OUT_DIR, "home-mobile.png"),
    fullPage: true,
  });
  console.log("✓ home-mobile.png");

  // Above the fold only (desktop)
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(BASE_URL, { waitUntil: "networkidle0", timeout: 15000 });
  await page.screenshot({
    path: path.join(OUT_DIR, "home-hero-desktop.png"),
    fullPage: false,
  });
  console.log("✓ home-hero-desktop.png");

  // Above the fold only (mobile)
  await page.setViewport({ width: 390, height: 844 });
  await page.goto(BASE_URL, { waitUntil: "networkidle0", timeout: 15000 });
  await page.screenshot({
    path: path.join(OUT_DIR, "home-hero-mobile.png"),
    fullPage: false,
  });
  console.log("✓ home-hero-mobile.png");

  await browser.close();
  console.log("\nDone! Screenshots saved to ./screenshots/");
}

main().catch(console.error);
