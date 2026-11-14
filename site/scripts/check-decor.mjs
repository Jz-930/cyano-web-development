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
  "privacy",
  "terms",
];
const routes = baseRoutes.flatMap((r) => [r ? `/${r}` : "/", r ? `/en/${r}` : "/en"]);

const browser = await chromium.launch({ channel: "chrome" });
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });

const violations = [];
const concurrency = 4;
let idx = 0;

async function worker() {
  const page = await context.newPage();
  while (idx < routes.length) {
    const route = routes[idx++];
    await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle" });

    const totalHeight = await page.evaluate(() => document.documentElement.scrollHeight);
    const stops = [0];
    for (let y = 900; y < totalHeight; y += 900) stops.push(y);

    // Structural checks once per page
    const structural = await page.evaluate(() => {
      const errs = [];
      function sel(el) {
        if (!el || !el.tagName) return "unknown";
        const cls =
          typeof el.className === "string" && el.className.trim()
            ? "." + el.className.trim().split(/\s+/).slice(0, 3).join(".")
            : "";
        return `${el.tagName.toLowerCase()}${cls}`;
      }

      const glassSelector =
        ".glass, .glass-badge, .glass-header-dark, .glass-header-paper, .glass-scrim";
      for (const el of document.querySelectorAll(glassSelector)) {
        const parentGlass = el.parentElement?.closest(glassSelector);
        if (parentGlass) {
          errs.push({
            rule: "nested-glass",
            scrollY: 0,
            detail: `${sel(el)} inside ${sel(parentGlass)}`,
          });
        }
      }

      // Paper-surface prohibition: no .glass, .glow-state, .halo-stage, .line-grid on paper surface
      for (const el of document.querySelectorAll(
        ".glass, .glow-state, .halo-stage, .line-grid",
      )) {
        if (
          el.closest(
            ".dark, [data-surface='dark'], [data-header='dark'], .site-header, .screen-dialog, .case-cover-top, .mk-win",
          )
        ) {
          continue;
        }
        errs.push({
          rule: "dark-decor-on-paper",
          scrollY: 0,
          detail: `${sel(el)} rendered outside dark surface`,
        });
      }
      return errs;
    });

    for (const err of structural) {
      violations.push({ route, ...err });
    }

    for (const y of stops) {
      await page.evaluate((pos) => window.scrollTo(0, pos), y);
      await page.waitForTimeout(80);
      const vpHits = await page.evaluate((scrollY) => {
        const errs = [];
        const vh = window.innerHeight;
        const vw = window.innerWidth;

        function inViewport(el) {
          const st = getComputedStyle(el);
          if (st.display === "none" || st.visibility === "hidden" || st.opacity === "0") {
            return false;
          }
          const r = el.getBoundingClientRect();
          return r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < vh && r.right > 0 && r.left < vw;
        }

        function sel(el) {
          const cls =
            typeof el.className === "string" && el.className.trim()
              ? "." + el.className.trim().split(/\s+/).slice(0, 2).join(".")
              : "";
          return `${el.tagName.toLowerCase()}${cls}`;
        }

        const glassEls = [
          ...document.querySelectorAll(
            ".glass, .glass-badge, .glass-header-dark, .glass-header-paper",
          ),
        ].filter(inViewport);
        if (glassEls.length > 3) {
          errs.push({
            rule: "glass-per-viewport-max-3",
            scrollY,
            detail: `${glassEls.length} visible: ${glassEls.map(sel).join(", ")}`,
          });
        }

        const edgeEls = [
          ...document.querySelectorAll(".edge-hero, .edge-closing"),
          ...[...document.querySelectorAll(".edge-pointer")].filter((e) => e.matches(":hover")),
        ].filter(inViewport);
        if (edgeEls.length > 2) {
          errs.push({
            rule: "edge-per-viewport-max-2",
            scrollY,
            detail: `${edgeEls.length} visible: ${edgeEls.map(sel).join(", ")}`,
          });
        }

        const glowEls = [
          ...document.querySelectorAll(".glow-state"),
          ...[...document.querySelectorAll(".glow-number")].filter(
            (e) => getComputedStyle(e).textShadow !== "none",
          ),
        ].filter(inViewport);
        if (glowEls.length > 3) {
          errs.push({
            rule: "glow-per-viewport-max-3",
            scrollY,
            detail: `${glowEls.length} visible: ${glowEls.map(sel).join(", ")}`,
          });
        }

        const haloEls = [
          ...document.querySelectorAll(
            ".halo-stage, .halo-panel, .halo-button, .light-field",
          ),
        ].filter(inViewport);
        if (haloEls.length > 2) {
          errs.push({
            rule: "halo-per-viewport-max-2",
            scrollY,
            detail: `${haloEls.length} visible: ${haloEls.map(sel).join(", ")}`,
          });
        }

        const ruleDotEls = [...document.querySelectorAll(".rule-dot")].filter(inViewport);
        if (ruleDotEls.length > 2) {
          errs.push({
            rule: "rule-dot-per-viewport-max-2",
            scrollY,
            detail: `${ruleDotEls.length} visible`,
          });
        }

        const dotGrids = [...document.querySelectorAll(".dot-grid")].filter(inViewport);
        const lineGrids = [...document.querySelectorAll(".line-grid")].filter(inViewport);
        if (dotGrids.length > 0 && lineGrids.length > 0) {
          errs.push({
            rule: "dot-grid-and-line-grid-coexist",
            scrollY,
            detail: `dot-grid(${dotGrids.map(sel).join(",")}) + line-grid(${lineGrids.map(sel).join(",")})`,
          });
        }

        return errs;
      }, y);

      for (const err of vpHits) {
        violations.push({ route, ...err });
      }
    }
  }
  await page.close();
}

await Promise.all(Array.from({ length: concurrency }, () => worker()));
await browser.close();

const reportsDir = path.join(root, "reports");
await fs.mkdir(reportsDir, { recursive: true });
await fs.writeFile(
  path.join(reportsDir, "decor.json"),
  JSON.stringify(
    { checkedRoutes: routes.length, count: violations.length, violations },
    null,
    2,
  ) + "\n",
  "utf8",
);

if (violations.length > 0) {
  console.error(`Found ${violations.length} decor violation(s):`);
  for (const v of violations.slice(0, 30)) {
    console.error(`  [${v.route} @ y=${v.scrollY}] ${v.rule}: ${v.detail}`);
  }
  process.exit(1);
}

console.log(`✓ check-decor passed across ${routes.length} routes (0 violations).`);
