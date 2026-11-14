import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { chromium } from "@playwright/test";

const root = path.resolve(import.meta.dirname, "..");
const baseUrl = process.env.BASE_URL || "http://127.0.0.1:3010";

const args = process.argv.slice(2);
const routesIdx = args.indexOf("--routes");
const routes =
  routesIdx >= 0 && args[routesIdx + 1]
    ? args[routesIdx + 1].split(",").map((s) => s.trim())
    : ["/", "/en", "/technology", "/en/technology"];

function srgbToLinear(c) {
  const v = c / 255;
  return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}

function relLum(r, g, b) {
  return (
    0.2126 * srgbToLinear(r) +
    0.7152 * srgbToLinear(g) +
    0.0722 * srgbToLinear(b)
  );
}

function contrastRatio(l1, l2) {
  const hi = Math.max(l1, l2);
  const lo = Math.min(l1, l2);
  return (hi + 0.05) / (lo + 0.05);
}

function parseRgb(colorStr) {
  const m = String(colorStr).match(
    /rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)/i,
  );
  if (!m) return [255, 255, 255];
  return [Number(m[1]), Number(m[2]), Number(m[3])];
}

const browser = await chromium.launch({
  channel: "chrome",
  headless: false,
});

const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
  reducedMotion: "no-preference",
});

const failures = [];
const routeSummaries = [];

for (const route of routes) {
  const page = await context.newPage();
  await page.goto(`${baseUrl}${route}`, { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);

  const targets = await page.evaluate(() => {
    const hero = document.querySelector("main section") || document.body;
    const candidates = [
      { role: "h1", el: hero.querySelector("h1") },
      {
        role: "lede",
        el:
          hero.querySelector(".lede, .hero-lede") ||
          Array.from(hero.querySelectorAll("p")).find(
            (p) => !p.classList.contains("eyebrow") && !p.classList.contains("small"),
          ),
      },
      ...Array.from(
        hero.querySelectorAll(
          ".hero-buttons a, .hero-actions a, .page-hero-copy a, a.button, a.button-secondary",
        ),
      )
        .slice(0, 2)
        .map((el, i) => ({ role: `button-${i + 1}`, el })),
    ].filter((item) => item.el);

    return candidates
      .map(({ role, el }) => {
        const st = getComputedStyle(el);
        const r = el.getBoundingClientRect();
        const isBtn =
          el.classList.contains("button") ||
          el.classList.contains("button-secondary");
        const insetX = isBtn ? 6 : 0;
        const insetY = isBtn ? 4 : 0;
        return {
          role,
          text: (el.textContent || "").replace(/\s+/g, " ").trim().slice(0, 28),
          color: st.color,
          rect: {
            x: Math.max(0, Math.round(r.x + insetX)),
            y: Math.max(0, Math.round(r.y + insetY)),
            width: Math.max(4, Math.round(r.width - insetX * 2)),
            height: Math.max(4, Math.round(r.height - insetY * 2)),
          },
        };
      })
      .filter(
        (t) =>
          t.rect.y < 900 &&
          t.rect.x < 1440 &&
          t.rect.width > 4 &&
          t.rect.height > 4,
      );
  });

  let minRouteContrast = Infinity;
  let worstTarget = null;

  for (let frameIdx = 0; frameIdx < 50; frameIdx++) {
    const png = await page.screenshot({ type: "png" });
    const { data, info } = await sharp(png)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const W = info.width;
    const H = info.height;
    const ch = info.channels;

    for (const t of targets) {
      const [cr, cg, cb] = parseRgb(t.color);
      const fgLum = relLum(cr, cg, cb);
      const x0 = Math.max(0, t.rect.x);
      const y0 = Math.max(0, t.rect.y);
      const x1 = Math.min(W, t.rect.x + t.rect.width);
      const y1 = Math.min(H, t.rect.y + t.rect.height);

      const lums = [];
      // Step by 2px for fast 50-frame evaluation while sampling hundreds of pixels per box
      for (let y = y0; y < y1; y += 2) {
        for (let x = x0; x < x1; x += 2) {
          const idx = (y * W + x) * ch;
          lums.push(relLum(data[idx], data[idx + 1], data[idx + 2]));
        }
      }
      if (!lums.length) continue;
      lums.sort((a, b) => a - b);
      const bgLum = lums[Math.floor(lums.length / 2)];
      const ratio = Number(contrastRatio(fgLum, bgLum).toFixed(2));

      if (ratio < minRouteContrast) {
        minRouteContrast = ratio;
        worstTarget = { frame: frameIdx, role: t.role, text: t.text, ratio };
      }
      if (ratio < 4.5) {
        failures.push({
          route,
          frame: frameIdx,
          timeMs: frameIdx * 200,
          role: t.role,
          text: t.text,
          ratio,
        });
      }
    }

    if (frameIdx < 49) {
      await page.waitForTimeout(200);
    }
  }

  routeSummaries.push({
    route,
    framesChecked: 50,
    targetsChecked: targets.length,
    minContrast: minRouteContrast === Infinity ? null : minRouteContrast,
    worstTarget,
  });
  await page.close();
}

await browser.close();

const report = {
  checkedAt: new Date().toISOString(),
  threshold: 4.5,
  framesPerRoute: 50,
  intervalMs: 200,
  routes: routeSummaries,
  failingFramesCount: failures.length,
  failures: failures.slice(0, 50),
};

const reportsDir = path.join(root, "reports");
await fs.mkdir(reportsDir, { recursive: true });
await fs.writeFile(
  path.join(reportsDir, "frame-contrast.json"),
  JSON.stringify(report, null, 2) + "\n",
  "utf8",
);

console.log(
  `✓ check-frame-contrast (${routes.length} routes × 50 frames): failingFrames=${failures.length}, min=${Math.min(...routeSummaries.map((r) => r.minContrast ?? 99)).toFixed(2)}:1.`,
);

if (failures.length > 0) {
  console.error("Failing frames (< 4.5:1):", failures.slice(0, 15));
  process.exit(1);
}
