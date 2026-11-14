import fs from "node:fs/promises";
import path from "node:path";
import { chromium } from "@playwright/test";

const root = path.resolve(import.meta.dirname, "..");
const baseUrl = process.env.BASE_URL || "http://127.0.0.1:3010";
const allowlistData = JSON.parse(
  await fs.readFile(path.join(root, "content/v4/numeric-allowlist.json"), "utf8"),
);
const allowed = new Set(
  Object.values(allowlistData)
    .flat()
    .map((s) => String(s).trim()),
);

const cases = JSON.parse(await fs.readFile(path.join(root, "content/v4/cases.json"), "utf8"));
const solutions = JSON.parse(
  await fs.readFile(path.join(root, "content/v4/solutions.json"), "utf8"),
);
const insights = JSON.parse(
  await fs.readFile(path.join(root, "content/v4/insights.json"), "utf8"),
);

// All site routes except /privacy and /terms (02 §9.2)
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

const browser = await chromium.launch({ channel: "chrome" });
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });

const violations = [];

for (const route of routes) {
  const page = await context.newPage();
  await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle" });
  const pageHits = await page.evaluate(() => {
    const NUM_RE =
      /(?:<\s*)?\d+(?:[.,:×/–-]\d+)*[%+]?(?:[\s-]*(?:个工作日|个月|分钟|毫秒|小时|年|周|天|秒|项|个|份|轮|级|行|(?:business days?|minutes?|months?|weeks?|hours?|days?|years?|min|ms|s)(?![A-Za-z])))?/g;

    function selectorOf(el) {
      if (!el || el.nodeType !== 1) return "unknown";
      const parts = [];
      let cur = el;
      while (cur && cur.nodeType === 1 && cur !== document.body && parts.length < 4) {
        let seg = cur.tagName.toLowerCase();
        if (cur.id) {
          seg += `#${cur.id}`;
          parts.unshift(seg);
          break;
        }
        const cls =
          typeof cur.className === "string"
            ? cur.className
                .trim()
                .split(/\s+/)
                .filter(Boolean)
                .slice(0, 2)
                .join(".")
            : "";
        if (cls) seg += `.${cls}`;
        parts.unshift(seg);
        cur = cur.parentElement;
      }
      return parts.join(" > ");
    }

    function isHiddenOrSkipped(el) {
      if (!el || el.nodeType !== 1) return true;
      if (el.closest("[data-demo], script, style, svg, noscript, [aria-hidden='true']")) {
        return true;
      }
      let cur = el;
      while (cur && cur.nodeType === 1) {
        const st = getComputedStyle(cur);
        if (st.display === "none" || st.visibility === "hidden") return true;
        cur = cur.parentElement;
      }
      return false;
    }

    const items = [];
    for (const el of document.body.querySelectorAll("*")) {
      if (isHiddenOrSkipped(el)) continue;
      let buf = "";
      const flush = () => {
        if (!buf || !/\d/.test(buf)) {
          buf = "";
          return;
        }
        const text = buf;
        buf = "";
        for (const m of text.matchAll(NUM_RE)) {
          const token = m[0].replace(/\s+/g, " ").trim();
          if (token) {
            items.push({
              token,
              selector: selectorOf(el),
              context: text.replace(/\s+/g, " ").trim().slice(0, 120),
            });
          }
        }
      };
      for (const child of el.childNodes) {
        if (child.nodeType === Node.TEXT_NODE) {
          buf += child.nodeValue || "";
        } else if (child.nodeType !== Node.COMMENT_NODE) {
          flush();
        }
      }
      flush();
    }

    const attrEls = document.querySelectorAll("[alt], [aria-label], [placeholder], [title]");
    for (const el of attrEls) {
      if (isHiddenOrSkipped(el)) continue;
      for (const attr of ["alt", "aria-label", "placeholder", "title"]) {
        const val = el.getAttribute(attr);
        if (!val || !/\d/.test(val)) continue;
        for (const m of val.matchAll(NUM_RE)) {
          const token = m[0].replace(/\s+/g, " ").trim();
          if (token) {
            items.push({
              token,
              selector: `${selectorOf(el)}[${attr}]`,
              context: val.slice(0, 120),
            });
          }
        }
      }
    }
    return items;
  });

  for (const hit of pageHits) {
    if (!allowed.has(hit.token)) {
      violations.push({ route, ...hit });
    }
  }
  await page.close();
}

await browser.close();

const reportsDir = path.join(root, "reports");
await fs.mkdir(reportsDir, { recursive: true });
await fs.writeFile(
  path.join(reportsDir, "numbers.json"),
  JSON.stringify({ checkedRoutes: routes.length, count: violations.length, violations }, null, 2) +
    "\n",
  "utf8",
);

if (violations.length > 0) {
  console.error(`Found ${violations.length} unregistered numeric occurrence(s):`);
  for (const v of violations.slice(0, 40)) {
    console.error(`  [${v.route}] "${v.token}" in ${v.selector} — ${v.context}`);
  }
  process.exit(1);
}

console.log(`✓ check-numbers passed across ${routes.length} routes (0 unregistered numbers).`);
