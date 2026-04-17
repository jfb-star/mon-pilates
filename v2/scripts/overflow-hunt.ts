import puppeteer from "puppeteer"

const BASE = process.argv[2] || "http://localhost:3456"

async function check(path: string) {
  const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox"] })
  const page = await browser.newPage()
  await page.setViewport({ width: 390, height: 844 })
  await page.goto(BASE + path, { waitUntil: "networkidle0", timeout: 30000 })
  await new Promise(r => setTimeout(r, 2000))
  const offenders = await page.evaluate(() => {
    const vw = document.documentElement.clientWidth
    const result: { tag: string; id: string; cls: string; right: number; width: number }[] = []
    document.querySelectorAll("*").forEach(el => {
      const r = (el as HTMLElement).getBoundingClientRect()
      if (r.right > vw + 1) {
        result.push({
          tag: el.tagName.toLowerCase(),
          id: (el as HTMLElement).id || "",
          cls: ((el as HTMLElement).className || "").toString().slice(0, 100),
          right: Math.round(r.right),
          width: Math.round(r.width),
        })
      }
    })
    return result.slice(0, 15)
  })
  console.log(`\n=== ${path} (vw=390) ===`)
  console.log(JSON.stringify(offenders, null, 2))
  await browser.close()
}

;(async () => { await check("/"); await check("/planning") })()
