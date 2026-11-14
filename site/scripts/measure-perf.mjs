import fs from "node:fs/promises";
import path from "node:path";
import { chromium } from "@playwright/test";

const root = path.resolve(import.meta.dirname, "..");
const baseUrl = process.env.BASE_URL || "http://127.0.0.1:3010";
const runsArg = process.argv.find((a) => a.startsWith("--runs="));
const RUNS = runsArg ? Number(runsArg.split("=")[1]) : 5;

function median(values) {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0
    ? sorted[mid]
    : (sorted[mid - 1] + sorted[mid]) / 2;
}

const OBSERVER_INIT_SCRIPT = () => {
  window.__perf = {
    fcp: null,
    lcp: null,
    lcpTag: null,
    lcpSelector: null,
    cls: 0,
    longTasks: [],
  };

  function describeEl(el) {
    if (!el || !el.tagName) return null;
    const tag = el.tagName.toLowerCase();
    const id = el.id ? `#${el.id}` : "";
    const cls =
      typeof el.className === "string" && el.className.trim()
        ? "." + el.className.trim().split(/\s+/).slice(0, 2).join(".")
        : "";
    return `${tag}${id}${cls}`;
  }

  try {
    new PerformanceObserver((list) => {
      for (const e of list.getEntries()) {
        if (e.name === "first-contentful-paint" && window.__perf.fcp === null) {
          window.__perf.fcp = e.startTime;
        }
      }
    }).observe({ type: "paint", buffered: true });
  } catch {}

  try {
    new PerformanceObserver((list) => {
      for (const e of list.getEntries()) {
        window.__perf.lcp = e.startTime;
        if (e.element) {
          window.__perf.lcpTag = e.element.tagName.toLowerCase();
          window.__perf.lcpSelector = describeEl(e.element);
        }
      }
    }).observe({ type: "largest-contentful-paint", buffered: true });
  } catch {}

  try {
    new PerformanceObserver((list) => {
      for (const e of list.getEntries()) {
        if (!e.hadRecentInput) {
          window.__perf.cls += e.value;
        }
      }
    }).observe({ type: "layout-shift", buffered: true });
  } catch {}

  try {
    new PerformanceObserver((list) => {
      for (const e of list.getEntries()) {
        window.__perf.longTasks.push({ startTime: e.startTime, duration: e.duration });
      }
    }).observe({ type: "longtask", buffered: true });
  } catch {}
};

const browser = await chromium.launch({ channel: "chrome" });

// 1. Mobile TBT & LCP (4x CPU throttling + Slow 4G, 5 cold runs median)
const mobileRoutes = ["/", "/en", "/technology", "/cases/proposal-generation"];
const mobileResults = {};

for (const route of mobileRoutes) {
  const samples = [];
  for (let i = 0; i < RUNS; i++) {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 3,
      isMobile: true,
      hasTouch: true,
    });
    await context.addInitScript(OBSERVER_INIT_SCRIPT);
    const page = await context.newPage();
    const cdp = await context.newCDPSession(page);
    await cdp.send("Network.enable");
    await cdp.send("Network.setCacheDisabled", { cacheDisabled: true });
    await cdp.send("Network.emulateNetworkConditions", {
      offline: false,
      latency: 150,
      downloadThroughput: (1.6 * 1024 * 1024) / 8,
      uploadThroughput: (750 * 1024) / 8,
    });
    await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });

    await page.goto(`${baseUrl}${route}`, { waitUntil: "load", timeout: 60000 });
    await page.waitForTimeout(5000);

    const data = await page.evaluate(() => {
      const p = window.__perf;
      const fcp = p.fcp ?? 0;
      let tbt = 0;
      for (const lt of p.longTasks) {
        if (lt.startTime + lt.duration <= fcp) continue;
        const effectiveDuration =
          lt.startTime < fcp ? lt.duration - (fcp - lt.startTime) : lt.duration;
        if (effectiveDuration > 50) {
          tbt += effectiveDuration - 50;
        }
      }
      return {
        fcpMs: Math.round(fcp),
        lcpMs: Math.round(p.lcp ?? fcp),
        lcpTag: p.lcpTag,
        lcpSelector: p.lcpSelector,
        tbtMs: Math.round(tbt),
        cls: Number(p.cls.toFixed(4)),
      };
    });

    samples.push(data);
    await context.close();
  }

  mobileResults[route] = {
    medianTbtMs: Math.round(median(samples.map((s) => s.tbtMs))),
    medianLcpMs: Math.round(median(samples.map((s) => s.lcpMs))),
    medianCls: Number(median(samples.map((s) => s.cls)).toFixed(4)),
    lcpTag: samples[Math.floor(samples.length / 2)]?.lcpTag ?? null,
    lcpSelector: samples[Math.floor(samples.length / 2)]?.lcpSelector ?? null,
    samples,
  };
}

// 2. First-screen font bytes on /, /about, /technology (zh, cold cache)
const fontRoutes = ["/", "/about", "/technology"];
const fontResults = {};

for (const route of fontRoutes) {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  await context.addInitScript(OBSERVER_INIT_SCRIPT);
  const page = await context.newPage();
  const cdp = await context.newCDPSession(page);
  await cdp.send("Network.enable");
  await cdp.send("Network.setCacheDisabled", { cacheDisabled: true });

  const cdpFonts = [];
  cdp.on("Network.responseReceived", (ev) => {
    if (ev.response.url.includes(".woff2")) {
      cdpFonts.push({
        requestId: ev.requestId,
        url: ev.response.url,
        encodedDataLength: ev.response.encodedDataLength || 0,
      });
    }
  });
  cdp.on("Network.loadingFinished", (ev) => {
    const item = cdpFonts.find((f) => f.requestId === ev.requestId);
    if (item && ev.encodedDataLength) {
      item.encodedDataLength = ev.encodedDataLength;
    }
  });

  await page.goto(`${baseUrl}${route}`, { waitUntil: "load" });
  await page.waitForTimeout(1500);

  const perfFonts = await page.evaluate(() => {
    const lcpCutoff = (window.__perf?.lcp ?? performance.now()) + 100;
    const entries = performance
      .getEntriesByType("resource")
      .filter((r) => r.name.includes(".woff2") && r.startTime <= lcpCutoff);
    return {
      lcpMs: Math.round(window.__perf?.lcp ?? 0),
      files: entries.map((r) => ({
        url: new URL(r.name).pathname,
        initiatorType: r.initiatorType,
        startTime: Math.round(r.startTime),
        transferSize: r.transferSize,
        encodedBodySize: r.encodedBodySize,
      })),
    };
  });

  const transferBytes = perfFonts.files.reduce(
    (s, f) => s + (f.transferSize || f.encodedBodySize || 0),
    0,
  );
  const encodedBytes = perfFonts.files.reduce((s, f) => s + (f.encodedBodySize || 0), 0);
  fontResults[route] = {
    transferBytes,
    transferKB: Number((transferBytes / 1024).toFixed(1)),
    encodedBytes,
    encodedKB: Number((encodedBytes / 1024).toFixed(1)),
    lcpMs: perfFonts.lcpMs,
    files: perfFonts.files,
  };
  await context.close();
}

// 3. CLS sweep across all sitemap routes (10 §7.2: 全部页面 ≤ 0.05) + logo.png zero-request check
let clsRoutes = [
  "/",
  "/en",
  "/services",
  "/en/services",
  "/services/document-automation",
  "/en/services/document-automation",
  "/cases",
  "/en/cases",
  "/cases/proposal-generation",
  "/en/cases/proposal-generation",
  "/en/cases/it-knowledge-assistant",
  "/technology",
  "/en/technology",
  "/engagement",
  "/en/engagement",
  "/about",
  "/en/about",
  "/en/insights",
  "/insights/proposal-draft-in-15-minutes",
  "/en/insights/proposal-draft-in-15-minutes",
  "/contact",
  "/en/contact",
];
try {
  const xml = await (await fetch(`${baseUrl}/sitemap.xml`)).text();
  const discovered = [...xml.matchAll(/<loc>https?:\/\/[^<]+?(\/[^<]*|)<\/loc>/g)].map(
    (m) => m[1] || "/",
  );
  if (discovered.length >= clsRoutes.length) {
    clsRoutes = [...new Set([...clsRoutes, ...discovered])];
  }
} catch {}

const clsByRoute = {};
const logoRequests = [];

const sweepCtx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
await sweepCtx.addInitScript(OBSERVER_INIT_SCRIPT);
const sweepConcurrency = 4;
let sweepIdx = 0;

async function sweepWorker() {
  const page = await sweepCtx.newPage();
  let currentRoute = "/";
  page.on("request", (req) => {
    if (req.url().includes("/logo.png")) {
      logoRequests.push({ route: currentRoute, url: req.url() });
    }
  });
  while (sweepIdx < clsRoutes.length) {
    const r = clsRoutes[sweepIdx++];
    currentRoute = r;
    await page.goto(`${baseUrl}${r}`, { waitUntil: "networkidle" });
    await page.waitForTimeout(300);
    const cls = await page.evaluate(() => Number((window.__perf?.cls ?? 0).toFixed(4)));
    clsByRoute[r] = cls;
  }
  await page.close();
}

await Promise.all(Array.from({ length: sweepConcurrency }, () => sweepWorker()));
await sweepCtx.close();
await browser.close();

// 4. Desktop "/" GPU frame time median via headed Chrome CDP Tracing (10 §7.2: ≤ 4ms)
let desktopGpu = {
  route: "/",
  frameCount: 0,
  medianGpuFrameMs: 0,
  p95GpuFrameMs: 0,
};
{
  const gpuBrowser = await chromium.launch({ channel: "chrome", headless: false });
  const gpuCtx = await gpuBrowser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
  });
  const gpuPage = await gpuCtx.newPage();
  await gpuPage.goto(`${baseUrl}/`, { waitUntil: "load", timeout: 60000 });
  await gpuPage.waitForTimeout(1500);

  const cdp = await gpuCtx.newCDPSession(gpuPage);
  const traceEvents = [];
  cdp.on("Tracing.dataCollected", (ev) => {
    if (Array.isArray(ev.value)) traceEvents.push(...ev.value);
  });
  const donePromise = new Promise((resolve) => cdp.once("Tracing.tracingComplete", resolve));
  await cdp.send("Tracing.start", {
    categories:
      "devtools.timeline,disabled-by-default-devtools.timeline,disabled-by-default-devtools.timeline.frame",
    transferMode: "ReportEvents",
  });
  await gpuPage.waitForTimeout(3000);
  await cdp.send("Tracing.end");
  await donePromise;

  // Determine actual display vsync interval from BeginFrame events (e.g. 8333us @ 120Hz, 16667us @ 60Hz)
  const beginFrames = traceEvents
    .filter((ev) => ev.name === "BeginFrame" && typeof ev.ts === "number")
    .map((ev) => ev.ts)
    .sort((a, b) => a - b);
  const bfDeltas = beginFrames
    .slice(1)
    .map((ts, idx) => ts - beginFrames[idx])
    .filter((d) => d >= 3000 && d <= 35000);
  const vsyncUs = bfDeltas.length ? median(bfDeltas) : 16667;

  // Sum GPUTask durations (in microseconds) per actual rendered frame vsync bucket
  const buckets = new Map();
  for (const ev of traceEvents) {
    if (ev.name === "GPUTask" && typeof ev.dur === "number" && typeof ev.ts === "number") {
      const slot = Math.floor(ev.ts / vsyncUs);
      buckets.set(slot, (buckets.get(slot) || 0) + ev.dur / 1000);
    }
  }
  const frameGpuMs = [...buckets.values()].filter((v) => v > 0).sort((a, b) => a - b);
  const medGpu = Number(median(frameGpuMs).toFixed(3));
  const p95Gpu = frameGpuMs.length
    ? Number(frameGpuMs[Math.min(frameGpuMs.length - 1, Math.floor(frameGpuMs.length * 0.95))].toFixed(3))
    : 0;
  desktopGpu = {
    route: "/",
    vsyncMs: Number((vsyncUs / 1000).toFixed(3)),
    frameCount: frameGpuMs.length,
    medianGpuFrameMs: medGpu,
    p95GpuFrameMs: p95Gpu,
  };
  await gpuCtx.close();
  await gpuBrowser.close();
}

const maxCls = Math.max(
  ...Object.values(clsByRoute),
  ...Object.values(mobileResults).map((m) => m.medianCls),
);

const failures = [];
for (const [route, m] of Object.entries(mobileResults)) {
  if (m.medianTbtMs > 200) {
    failures.push(`Mobile TBT ${route} = ${m.medianTbtMs}ms (> 200ms)`);
  }
  if (m.medianLcpMs > 2500) {
    failures.push(`Mobile LCP ${route} = ${m.medianLcpMs}ms (> 2500ms)`);
  }
  if ((route === "/" || route === "/en") && m.lcpTag !== "h1") {
    failures.push(`LCP element on ${route} = ${m.lcpTag} (expected h1)`);
  }
}
for (const [route, f] of Object.entries(fontResults)) {
  if (f.encodedBytes > 150 * 1024) {
    failures.push(
      `First-screen fonts ${route} = ${f.encodedKB}KB (${f.encodedBytes} bytes > 150KB)`,
    );
  }
}
if (maxCls > 0.05) {
  failures.push(`Max CLS = ${maxCls} (> 0.05)`);
}
if (desktopGpu.medianGpuFrameMs > 4) {
  failures.push(`Desktop / GPU median frame time = ${desktopGpu.medianGpuFrameMs}ms (> 4ms)`);
}
if (logoRequests.length > 0) {
  failures.push(`/logo.png requested on ${logoRequests.length} page(s)`);
}

const report = {
  measuredAt: new Date().toISOString(),
  runsPerMobilePage: RUNS,
  mobile: mobileResults,
  firstScreenFonts: fontResults,
  desktopGpu,
  maxCls,
  clsByRoute,
  logoRequests,
  failures,
};

const reportsDir = path.join(root, "reports");
await fs.mkdir(reportsDir, { recursive: true });
await fs.writeFile(
  path.join(reportsDir, "perf.json"),
  JSON.stringify(report, null, 2) + "\n",
  "utf8",
);

if (failures.length > 0) {
  console.error("Performance budget failure(s):");
  for (const msg of failures) console.error(`  - ${msg}`);
  process.exit(1);
}

console.log(
  `✓ measure-perf passed: mobile TBT [${Object.entries(mobileResults)
    .map(([r, m]) => `${r}=${m.medianTbtMs}ms`)
    .join(", ")}], fonts [${Object.entries(fontResults)
    .map(([r, f]) => `${r}=${f.encodedKB}KB`)
    .join(", ")}], gpuMedian=${desktopGpu.medianGpuFrameMs}ms, maxCLS=${maxCls}, logoRequests=0.`,
);
