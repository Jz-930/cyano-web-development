import fs from "node:fs";
import path from "node:path";
import { chromium } from "@playwright/test";
import sharp from "sharp";

const root = path.resolve(import.meta.dirname, "..");
const args = process.argv.slice(2);
const getArg = (flag, fallback) => {
  const idx = args.indexOf(flag);
  return idx >= 0 && args[idx + 1] ? args[idx + 1] : fallback;
};

const baseURL = getArg("--url", "http://127.0.0.1:3010");
const outDir = path.resolve(root, getArg("--out", "reports/screens"));
const compareDir = getArg("--compare", "") ? path.resolve(root, getArg("--compare", "")) : "";
const skipHeroFrames = args.includes("--no-heroframes");

const DESKTOP_PAGES = [
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

const MOBILE_PAGES = [
  ["zh-home", "/"],
  ["en-home", "/en"],
  ["zh-case-proposal", "/cases/proposal-generation"],
  ["en-case-proposal", "/en/cases/proposal-generation"],
  ["en-technology", "/en/technology"],
  ["en-engagement", "/en/engagement"],
  ["zh-about", "/about"],
  ["en-contact", "/en/contact"],
  ["en-services", "/en/services"],
];

const EXTRA_WIDTHS = [
  { tag: "w1024", width: 1024, height: 768 },
  { tag: "w1280", width: 1280, height: 800 },
];
const EXTRA_PAGES = [
  ["zh-home", "/"],
  ["en-home", "/en"],
  ["zh-technology", "/technology"],
];

fs.mkdirSync(outDir, { recursive: true });
const indexLines = [];
const overflowErrors = [];

async function capturePageTiles(context, name, route, suffix, vw, vh) {
  const page = await context.newPage();
  await page.addInitScript(() => {
    const fixed = 2400;
    try {
      Object.defineProperty(performance, "now", { value: () => fixed, configurable: true });
    } catch {}
  });
  await page.goto(baseURL + route, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts?.ready);
  await page.waitForTimeout(250);

  let totalHeight = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < totalHeight; y += vh) {
    await page.evaluate((pos) => window.scrollTo(0, pos), y);
    await page.waitForTimeout(400);
    totalHeight = await page.evaluate(() => document.documentElement.scrollHeight);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(300);

  const metrics = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    scrollHeight: document.documentElement.scrollHeight,
  }));

  if (metrics.scrollWidth > vw) {
    overflowErrors.push(`${name}-${suffix} (${route}): scrollWidth=${metrics.scrollWidth} > viewport=${vw}`);
  }

  const maxScroll = Math.max(0, metrics.scrollHeight - vh);
  const stops = [0];
  for (let y = vh; y < maxScroll; y += vh) stops.push(y);
  if (maxScroll > 0) stops.push(maxScroll);

  for (let i = 0; i < stops.length; i++) {
    const y = stops[i];
    await page.evaluate(
      ({ pos, unpin }) => {
        const hdr = document.querySelector(".site-header, [data-header]");
        if (hdr instanceof HTMLElement) {
          if (unpin) hdr.style.setProperty("position", "absolute", "important");
          else hdr.style.removeProperty("position");
        }
        window.scrollTo(0, pos);
      },
      { pos: y, unpin: i > 0 },
    );
    await page.waitForTimeout(160);
    const filename = `${name}-${suffix}-${String(i + 1).padStart(2, "0")}.jpg`;
    await page.screenshot({
      path: path.join(outDir, filename),
      type: "jpeg",
      quality: 88,
    });
  }

  await page.close();
  return `${name}-${suffix}: ${route} viewport=${vw} scrollWidth=${metrics.scrollWidth} cssHeight=${metrics.scrollHeight} tiles=${stops.length}`;
}

async function runPool(items, concurrency, fn) {
  const results = new Array(items.length);
  let next = 0;
  const workers = Array.from({ length: Math.min(concurrency, items.length) }, async () => {
    while (true) {
      const idx = next++;
      if (idx >= items.length) break;
      results[idx] = await fn(items[idx], idx);
    }
  });
  await Promise.all(workers);
  return results;
}

async function captureHeroFrames(browser) {
  for (const [prefix, route] of [
    ["zh", "/"],
    ["en", "/en"],
  ]) {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();
    const start = Date.now();
    await page.goto(baseURL + route, { waitUntil: "domcontentloaded" });
    for (const ms of [400, 1500, 3000, 5000, 8000]) {
      const wait = ms - (Date.now() - start);
      if (wait > 0) await page.waitForTimeout(wait);
      const fname = `${prefix}-home-heroframe-${String(ms).padStart(4, "0")}ms.jpg`;
      await page.screenshot({
        path: path.join(outDir, fname),
        type: "jpeg",
        quality: 88,
      });
    }
    await context.close();
  }
}

async function compareDirectories(baseDir, currDir) {
  const files = fs
    .readdirSync(baseDir)
    .filter((f) => f.endsWith(".jpg") && !f.includes("heroframe"))
    .sort();
  const diffs = [];
  for (const file of files) {
    const pA = path.join(baseDir, file);
    const pB = path.join(currDir, file);
    if (!fs.existsSync(pB)) {
      diffs.push({ file, pct: 100, note: "missing in current" });
      continue;
    }
    const imgA = await sharp(pA).raw().toBuffer({ resolveWithObject: true });
    const imgB = await sharp(pB).raw().toBuffer({ resolveWithObject: true });
    if (
      imgA.info.width !== imgB.info.width ||
      imgA.info.height !== imgB.info.height
    ) {
      diffs.push({ file, pct: 100, note: "dimension mismatch" });
      continue;
    }
    let changed = 0;
    const total = imgA.info.width * imgA.info.height;
    const ch = imgA.info.channels;
    for (let i = 0; i < imgA.data.length; i += ch) {
      const dr = imgA.data[i] - imgB.data[i];
      const dg = imgA.data[i + 1] - imgB.data[i + 1];
      const db = imgA.data[i + 2] - imgB.data[i + 2];
      if (Math.sqrt(dr * dr + dg * dg + db * db) > 12) changed++;
    }
    const pct = Number(((changed / total) * 100).toFixed(4));
    diffs.push({ file, pct });
  }
  const over = diffs.filter((d) => d.pct > 0.5);
  const reportPath = path.join(currDir, "compare-report.json");
  fs.writeFileSync(
    reportPath,
    JSON.stringify({ totalFiles: diffs.length, overThreshold: over, all: diffs }, null, 2) + "\n",
  );
  console.log(
    `Compared ${diffs.length} screenshots against ${baseDir}: maxDiff=${Math.max(0, ...diffs.map((d) => d.pct)).toFixed(4)}%, over 0.5%=${over.length}`,
  );
  if (over.length) {
    console.error("Screenshots exceeding 0.5% diff:", over);
    process.exitCode = 1;
  }
}

const browser = await chromium.launch({ channel: "chrome", headless: true });
try {
  indexLines.push(
    ...(await runPool(DESKTOP_PAGES, 4, async ([name, route]) => {
      const ctx = await browser.newContext({
        viewport: { width: 1440, height: 900 },
        deviceScaleFactor: 1,
      });
      try {
        return await capturePageTiles(ctx, name, route, "d", 1440, 900);
      } finally {
        await ctx.close();
      }
    })),
  );

  indexLines.push(
    ...(await runPool(MOBILE_PAGES, 4, async ([name, route]) => {
      const ctx = await browser.newContext({
        viewport: { width: 390, height: 844 },
        deviceScaleFactor: 3,
        isMobile: true,
        hasTouch: true,
        userAgent:
          "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
      });
      try {
        return await capturePageTiles(ctx, name, route, "m", 390, 844);
      } finally {
        await ctx.close();
      }
    })),
  );

  for (const { tag, width, height } of EXTRA_WIDTHS) {
    indexLines.push(
      ...(await runPool(EXTRA_PAGES, 3, async ([name, route]) => {
        const ctx = await browser.newContext({
          viewport: { width, height },
          deviceScaleFactor: 1,
        });
        try {
          return await capturePageTiles(ctx, name, route, tag, width, height);
        } finally {
          await ctx.close();
        }
      })),
    );
  }

  if (!skipHeroFrames) {
    await captureHeroFrames(browser);
  }

  fs.writeFileSync(path.join(outDir, "index.txt"), indexLines.join("\n") + "\n");
  console.log(`Captured ${indexLines.length} page viewports into ${outDir}`);

  if (overflowErrors.length) {
    console.error("Horizontal overflow detected:\n" + overflowErrors.join("\n"));
    process.exitCode = 1;
  }

  if (compareDir) {
    await compareDirectories(compareDir, outDir);
  }
} finally {
  await browser.close();
}
