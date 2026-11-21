// Selenium smoke suite for HolisticAsF — runs all views at desktop + mobile widths.
import { Builder, By } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome.js";
import assert from "node:assert/strict";

const SITES = [
  { name: "client-home", url: "https://holisticasf-client.vercel.app", ready: /nourish with purpose/i },
  { name: "client-products", url: "https://holisticasf-client.vercel.app/products", ready: /top sellers|latest collections|products/i },
  { name: "client-cart", url: "https://holisticasf-client.vercel.app/cart", ready: /cart/i },
  { name: "admin", url: "https://holisticasf-admin.vercel.app/admin", ready: /admin|dashboard/i },
  { name: "admin-login", url: "https://holisticasf-admin.vercel.app/login", ready: /sign in|login/i },
  { name: "mobile-home", url: "https://holisticasf-mobile.vercel.app", ready: /nourish with purpose/i },
];

const buildDriver = (w, h) => {
  const opts = new chrome.Options();
  opts.addArguments("--headless=new", `--window-size=${w},${h}`, "--no-sandbox", "--disable-dev-shm-usage");
  return new Builder().forBrowser("chrome").setChromeOptions(opts).build();
};

const results = [];
for (const [label, w, h] of [["desktop", 1280, 900], ["mobile", 390, 844]]) {
  const driver = buildDriver(w, h);
  try {
    for (const site of SITES) {
      try {
        await driver.get(site.url);
        await new Promise((r) => setTimeout(r, 2000));
        const text = await driver.findElement(By.tagName("body")).getText();
        const broken = await driver.executeScript(
          "return [...document.images].filter(i=>i.complete && !i.naturalWidth).length"
        );
        const ok = text.length > 20 && site.ready.test(text) && broken === 0;
        results.push({ site: site.name, mode: label, ok, chars: text.length, broken });
      } catch (e) {
        results.push({ site: site.name, mode: label, ok: false, error: String(e.message).slice(0, 80) });
      }
    }
  } finally {
    await driver.quit();
  }
}
for (const r of results) {
  console.log(`${r.ok ? "PASS" : "FAIL"} ${r.mode.padEnd(7)} ${r.site.padEnd(18)} ${r.chars ?? "-"} chars broken=${r.broken ?? "-"} ${r.error || ""}`);
}
const failed = results.filter((r) => !r.ok);
assert.equal(failed.length, 0, `${failed.length}/${results.length} checks failed`);
