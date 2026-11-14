import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { chromium } from "@playwright/test";

const root = path.resolve(import.meta.dirname, "..");
const baseUrl = process.env.BASE_URL || "http://127.0.0.1:3010";

const args = process.argv.slice(2);
function getArg(flag, fallback) {
  const idx = args.indexOf(flag);
  return idx >= 0 && args[idx + 1] ? args[idx + 1] : fallback;
}

const routePath = getArg("--route", "/");
const selector = getArg(
  "--selector",
  ".mk-stage, .hero-visual, .business-hero-visual",
);
const threshold = Number(getArg("--threshold", "0.08"));

const browser = await chromium.launch({
  channel: "chrome",
  headless: false,
});

const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
  reducedMotion: "no-preference",
});
await context.addInitScript(() => {
  window.__frameDiffHoldT0 = true;
  let frozenNow = 0;
  const origRAF = window.requestAnimationFrame.bind(window);
  window.requestAnimationFrame = (cb) =>
    origRAF((now) => {
      if (window.__frameDiffHoldT0) {
        if (!frozenNow) frozenNow = now || 16;
        cb(frozenNow);
      } else {
        cb(now);
      }
    });
});
const page = await context.newPage();

await page.goto(`${baseUrl}${routePath}`, { waitUntil: "domcontentloaded" });
// Capture frame at exact t=0s (hold rAF timestamp during Playwright screenshot IPC)
await page.waitForSelector(selector, { timeout: 10000 });
await page.waitForSelector(".light-field canvas.ready", { timeout: 5000 }).catch(() => {});

const stageBox = await page.evaluate((sel) => {
  const el = document.querySelector(sel);
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return {
    x: Math.round(r.x),
    y: Math.round(r.y),
    width: Math.round(r.width),
    height: Math.round(r.height),
  };
}, selector);

if (!stageBox) {
  await browser.close();
  throw new Error(`Stage element "${selector}" not found on ${routePath}`);
}

const frame0Png = await page.screenshot({ type: "png" });
await page.evaluate(() => {
  window.__frameDiffHoldT0 = false;
});
await page.waitForTimeout(5000);
const frame5Png = await page.screenshot({ type: "png" });

await browser.close();

const raw0 = await sharp(frame0Png)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });
const raw5 = await sharp(frame5Png)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const W = raw0.info.width;
const H = raw0.info.height;
const ch = raw0.info.channels;

// 10 §6.3: Ring region expanding stage bounding box outward by 120px
const outerX0 = Math.max(0, stageBox.x - 120);
const outerY0 = Math.max(0, stageBox.y - 120);
const outerX1 = Math.min(W, stageBox.x + stageBox.width + 120);
const outerY1 = Math.min(H, stageBox.y + stageBox.height + 120);

let ringPixels = 0;
let changedPixels = 0;

for (let y = outerY0; y < outerY1; y++) {
  for (let x = outerX0; x < outerX1; x++) {
    const insideStage =
      x >= stageBox.x &&
      x < stageBox.x + stageBox.width &&
      y >= stageBox.y &&
      y < stageBox.y + stageBox.height;
    if (insideStage) continue;

    ringPixels++;
    const i = (y * W + x) * ch;
    const dr = raw5.data[i] - raw0.data[i];
    const dg = raw5.data[i + 1] - raw0.data[i + 1];
    const db = raw5.data[i + 2] - raw0.data[i + 2];
    const dist = Math.sqrt(dr * dr + dg * dg + db * db);
    if (dist > 12) {
      changedPixels++;
    }
  }
}

const changedRatio = ringPixels > 0 ? changedPixels / ringPixels : 0;
const report = {
  checkedAt: new Date().toISOString(),
  route: routePath,
  selector,
  stageBox,
  ringBounds: { x0: outerX0, y0: outerY0, x1: outerX1, y1: outerY1 },
  ringPixels,
  changedPixels,
  changedRatio: Number(changedRatio.toFixed(4)),
  changedPercent: `${(changedRatio * 100).toFixed(2)}%`,
  threshold,
  passed: changedRatio >= threshold,
};

const reportsDir = path.join(root, "reports");
await fs.mkdir(reportsDir, { recursive: true });
await fs.writeFile(
  path.join(reportsDir, "frame-diff.json"),
  JSON.stringify(report, null, 2) + "\n",
  "utf8",
);

console.log(
  `✓ frame-diff on ${routePath}: ${(changedRatio * 100).toFixed(2)}% (${changedPixels}/${ringPixels} px, threshold ${(threshold * 100).toFixed(0)}%).`,
);

if (!report.passed) {
  console.error("frame-diff below threshold:", report);
  process.exit(1);
}
