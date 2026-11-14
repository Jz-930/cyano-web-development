import fs from "node:fs";
import path from "node:path";
import { chromium } from "@playwright/test";

const root = path.resolve(import.meta.dirname, "..");
const args = process.argv.slice(2);
const urlIdx = args.indexOf("--url");
const baseURL = urlIdx >= 0 && args[urlIdx + 1] ? args[urlIdx + 1] : "http://127.0.0.1:3010";

const PAGES = [
  ["zh-home", "/"],
  ["en-home", "/en"],
  ["zh-services", "/services"],
  ["en-services", "/en/services"],
  ["zh-solution-doc", "/services/document-automation"],
  ["en-solution-doc", "/en/services/document-automation"],
  ["zh-cases", "/cases"],
  ["en-cases", "/en/cases"],
  ["zh-case-proposal", "/cases/proposal-generation"],
  ["en-case-proposal", "/en/cases/proposal-generation"],
  ["en-case-wiki", "/en/cases/it-knowledge-assistant"],
  ["zh-technology", "/technology"],
  ["en-technology", "/en/technology"],
  ["zh-engagement", "/engagement"],
  ["en-engagement", "/en/engagement"],
  ["zh-about", "/about"],
  ["en-about", "/en/about"],
  ["en-insights", "/en/insights"],
  ["zh-article", "/insights/proposal-draft-in-15-minutes"],
  ["en-article", "/en/insights/proposal-draft-in-15-minutes"],
  ["zh-contact", "/contact"],
  ["en-contact", "/en/contact"],
];

const WIDTHS = [1440, 1280, 1024, 800, 390];
const issues = [];
const byWidth = {};

const browser = await chromium.launch({ channel: "chrome", headless: true });
try {
  for (const width of WIDTHS) {
    const ctx = await browser.newContext({
      viewport: { width, height: 900 },
      deviceScaleFactor: 1,
    });
    const pageLefts = [];

    for (const [name, route] of PAGES) {
      const page = await ctx.newPage();
      await page.goto(baseURL + route, { waitUntil: "domcontentloaded" });
      await page.evaluate(() => document.fonts?.ready);
      const items = await page.evaluate(() => {
        const describe = (el) => {
          const p = el.parentElement;
          const pDesc = p ? `${p.tagName.toLowerCase()}${p.className ? "." + String(p.className).trim().split(/\s+/).join(".") : ""}` : "root";
          const sDesc = `${el.tagName.toLowerCase()}${el.className ? "." + String(el.className).trim().split(/\s+/).join(".") : ""}`;
          return `${pDesc} > ${sDesc}`;
        };
        return Array.from(document.querySelectorAll(".wrap"))
          .filter((el) => {
            const cs = getComputedStyle(el);
            if (cs.display === "none" || cs.visibility === "hidden") return false;
            const r = el.getBoundingClientRect();
            return r.width > 0 && r.height > 0;
          })
          .map((el) => {
            const r = el.getBoundingClientRect();
            return {
              selector: describe(el),
              left: Number(r.left.toFixed(2)),
              width: Number(r.width.toFixed(2)),
            };
          });
      });
      await page.close();

      if (items.length === 0) continue;
      const lefts = items.map((x) => x.left);
      const minL = Math.min(...lefts);
      const maxL = Math.max(...lefts);
      if (maxL - minL > 1) {
        issues.push({
          type: "within-page",
          width,
          page: name,
          route,
          minLeft: minL,
          maxLeft: maxL,
          delta: Number((maxL - minL).toFixed(2)),
          items,
        });
      }
      pageLefts.push({ page: name, route, medianLeft: lefts[0], items });
    }

    if (pageLefts.length > 0) {
      const allLefts = pageLefts.flatMap((p) => p.items.map((i) => i.left));
      const minAll = Math.min(...allLefts);
      const maxAll = Math.max(...allLefts);
      byWidth[width] = {
        minLeft: minAll,
        maxLeft: maxAll,
        delta: Number((maxAll - minAll).toFixed(2)),
        pagesChecked: pageLefts.length,
      };
      if (maxAll - minAll > 1) {
        const mode = pageLefts[0].medianLeft;
        const outliers = pageLefts.flatMap((p) =>
          p.items
            .filter((i) => Math.abs(i.left - mode) > 1)
            .map((i) => ({ page: p.page, route: p.route, ...i })),
        );
        issues.push({
          type: "across-pages",
          width,
          minLeft: minAll,
          maxLeft: maxAll,
          delta: Number((maxAll - minAll).toFixed(2)),
          outliers,
        });
      }
    }

    await ctx.close();
  }
} finally {
  await browser.close();
}

const reportDir = path.join(root, "reports");
fs.mkdirSync(reportDir, { recursive: true });
fs.writeFileSync(
  path.join(reportDir, "gutters.json"),
  JSON.stringify({ summaryByWidth: byWidth, issueCount: issues.length, issues }, null, 2) + "\n",
);

console.log(`Checked gutters across ${PAGES.length} pages × ${WIDTHS.length} widths: ${issues.length} inconsistencies.`);
if (issues.length > 0) {
  console.error(JSON.stringify(issues, null, 2));
  process.exitCode = 1;
}
