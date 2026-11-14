import fs from "node:fs/promises";
import path from "node:path";
import { chromium } from "@playwright/test";

const root = path.resolve(import.meta.dirname, "..");
const baseUrl = process.env.BASE_URL || "http://127.0.0.1:3010";

const cases = JSON.parse(await fs.readFile(path.join(root, "content/v4/cases.json"), "utf8"));
const solutions = JSON.parse(
  await fs.readFile(path.join(root, "content/v4/solutions.json"), "utf8"),
);
const insights = JSON.parse(
  await fs.readFile(path.join(root, "content/v4/insights.json"), "utf8"),
);

// Legal pages (/privacy, /terms) excluded per 02 §9.3
const baseRoutes = [
  "",
  "services",
  ...solutions.map((s) => `services/${s.slug}`),
  "cases",
  ...cases.map((c) => `cases/${c.slug}`),
  "technology",
  "engagement",
  "about",
  "insights",
  ...insights.map((i) => `insights/${i.slug}`),
  "contact",
];
const routes = baseRoutes.flatMap((r) => [r ? `/${r}` : "/", r ? `/en/${r}` : "/en"]);

const viewports = [
  { name: "1440x900", width: 1440, height: 900, isMobile: false },
  { name: "390x844", width: 390, height: 844, isMobile: true },
];

const browser = await chromium.launch({ channel: "chrome" });
const results = [];

for (const vp of viewports) {
  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: vp.isMobile ? 3 : 1,
    isMobile: vp.isMobile,
    hasTouch: vp.isMobile,
  });

  const concurrency = 6;
  let idx = 0;
  async function worker() {
    const page = await context.newPage();
    while (idx < routes.length) {
      const route = routes[idx++];
      await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle" });
      const stats = await page.evaluate(() => {
        const buckets = {};
        let smallChars = 0;
        let totalChars = 0;

        function isSkipped(el) {
          if (!el || el.nodeType !== 1) return true;
          // Exclude footer copyright row (.footer-bottom) per 02 §9.3
          if (
            el.closest(
              ".footer-bottom, script, style, svg, noscript, [aria-hidden='true']",
            )
          ) {
            return true;
          }
          let cur = el;
          while (cur && cur.nodeType === 1) {
            const st = getComputedStyle(cur);
            if (st.display === "none" || st.visibility === "hidden" || st.opacity === "0") {
              return true;
            }
            cur = cur.parentElement;
          }
          return false;
        }

        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        let node;
        while ((node = walker.nextNode())) {
          const parent = node.parentElement;
          if (!parent || isSkipped(parent)) continue;
          const text = (node.nodeValue || "").replace(/\s+/g, "");
          if (!text.length) continue;
          const px = parseFloat(getComputedStyle(parent).fontSize);
          const key = `${Math.round(px * 10) / 10}px`;
          buckets[key] = (buckets[key] || 0) + text.length;
          totalChars += text.length;
          if (px <= 12.01) smallChars += text.length;
        }

        const ratioPct = totalChars > 0 ? (smallChars / totalChars) * 100 : 0;
        return { smallChars, totalChars, ratioPct: Number(ratioPct.toFixed(2)), buckets };
      });
      results.push({ route, viewport: vp.name, ...stats });
    }
    await page.close();
  }
  await Promise.all(Array.from({ length: concurrency }, () => worker()));
  await context.close();
}

await browser.close();

results.sort((a, b) => b.ratioPct - a.ratioPct);
const worst = results[0] || { route: "/", viewport: "1440x900", ratioPct: 0 };
const violations = results.filter((r) => r.ratioPct > 8);

const reportsDir = path.join(root, "reports");
await fs.mkdir(reportsDir, { recursive: true });
await fs.writeFile(
  path.join(reportsDir, "small-text.json"),
  JSON.stringify(
    {
      thresholdPct: 8,
      checkedCount: results.length,
      worst,
      violationCount: violations.length,
      violations,
      results,
    },
    null,
    2,
  ) + "\n",
  "utf8",
);

if (violations.length > 0) {
  console.error(
    `Small-text threshold (>8%) exceeded on ${violations.length} route/viewport pair(s):`,
  );
  for (const v of violations.slice(0, 20)) {
    console.error(
      `  [${v.viewport}] ${v.route}: ${v.ratioPct}% (${v.smallChars}/${v.totalChars})`,
    );
  }
  process.exit(1);
}

console.log(
  `✓ check-small-text passed across ${results.length} route/viewports (worst: ${worst.route} @ ${worst.viewport} = ${worst.ratioPct}% <= 8%).`,
);
