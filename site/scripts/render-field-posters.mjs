import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "@playwright/test";
import sharp from "sharp";

const root = path.resolve(import.meta.dirname, "..");
const shaderSource = await fs.readFile(
  path.join(root, "components/v4/light-field.js"),
  "utf8",
);
const fragMatch = shaderSource.match(/const fragment\s*=\s*`([\s\S]*?)`;/);
if (!fragMatch) {
  throw new Error("Could not extract fragment shader from light-field.js");
}
const fragment = fragMatch[1];

// 1440x900 measured focus & textEdge coordinates for the 5 field presets (05 §1.4–1.5)
const PRESETS = [
  { name: "hero", mode: 0, strength: 1.0, focus: [0.58, 0.5], textEdge: 0.412 },
  { name: "solution", mode: 0, strength: 0.4, focus: [0.52, 0.5], textEdge: 0.486 },
  { name: "converge", mode: 1, strength: 0.7, focus: [0.68, 0.5], textEdge: 0.486 },
  { name: "panel", mode: 0, strength: 0.15, focus: [0.56, 0.48], textEdge: 0.0 },
  { name: "closing", mode: 1, strength: 0.22, focus: [0.78, 0.5], textEdge: 0.52 },
];

const tmpHtml = path.join(os.tmpdir(), `cyano-field-posters-${Date.now()}.html`);
const html = `<!doctype html>
<html>
<head><meta charset="utf-8"><style>html,body{margin:0;padding:0;background:#070b0f;overflow:hidden}canvas{display:block;width:1440px;height:900px}</style></head>
<body>
<canvas id="c" width="1440" height="900"></canvas>
<script>
const vertex = "attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}";
const fragment = ${JSON.stringify(fragment)};
const canvas = document.getElementById("c");
const gl = canvas.getContext("webgl", { alpha: false, antialias: false, preserveDrawingBuffer: true });
function compile(type, src) {
  const s = gl.createShader(type);
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
  return s;
}
const prog = gl.createProgram();
gl.attachShader(prog, compile(gl.VERTEX_SHADER, vertex));
gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, fragment));
gl.linkProgram(prog);
gl.useProgram(prog);
const buf = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buf);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]), gl.STATIC_DRAW);
const loc = gl.getAttribLocation(prog, "p");
gl.enableVertexAttribArray(loc);
gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
const u = Object.fromEntries(
  ["resolution","time","pointer","phase","strength","focus","mode","intro","textEdge"]
    .map(n => [n, gl.getUniformLocation(prog, n)])
);
window.renderPreset = (cfg) => {
  gl.viewport(0, 0, 1440, 900);
  gl.uniform2f(u.resolution, 1440, 900);
  gl.uniform1f(u.time, 8.0);
  gl.uniform2f(u.pointer, 0, 0);
  gl.uniform1f(u.phase, 0);
  gl.uniform1f(u.strength, cfg.strength);
  gl.uniform2f(u.focus, cfg.focus[0], cfg.focus[1]);
  gl.uniform1f(u.mode, cfg.mode);
  gl.uniform1f(u.intro, 1.0);
  gl.uniform1f(u.textEdge, cfg.textEdge);
  gl.drawArrays(gl.TRIANGLES, 0, 6);
  gl.finish();
  return canvas.toDataURL("image/png");
};
</script>
</body>
</html>`;

async function writeSafe(dest, buf) {
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      await fs.writeFile(dest, buf);
      return;
    } catch (err) {
      if (attempt === 4) throw err;
      await new Promise((r) => setTimeout(r, 120 * (attempt + 1)));
    }
  }
}

await fs.writeFile(tmpHtml, html, "utf8");
const outDir = path.join(root, "public/media/field");
await fs.mkdir(outDir, { recursive: true });

const browser = await chromium.launch({ channel: "chrome", headless: false });
try {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(pathToFileURL(tmpHtml).href, { waitUntil: "load" });

  for (const preset of PRESETS) {
    const dataUrl = await page.evaluate((cfg) => window.renderPreset(cfg), preset);
    const pngBuf = Buffer.from(dataUrl.replace(/^data:image\/png;base64,/, ""), "base64");

    // 1440x900 AVIF (strip shader dither grain & keep <= 5.4KB so full-bleed backdrop stays < 0.05 bpp and h1 remains LCP per 10 §7.2)
    let avifQuality = 52;
    let avif1440 = await sharp(pngBuf)
      .blur(1.8)
      .avif({ quality: avifQuality, effort: 6 })
      .toBuffer();
    while (avif1440.length > 5400 && avifQuality > 24) {
      avifQuality -= 4;
      avif1440 = await sharp(pngBuf)
        .blur(1.8)
        .avif({ quality: avifQuality, effort: 6 })
        .toBuffer();
    }
    await writeSafe(path.join(outDir, `${preset.name}.avif`), avif1440);

    // 720x450 AVIF (keep <= 1050B so even on 390px mobile CSS pixels, bpp < 0.035 << 0.05 WICG low-entropy backdrop threshold)
    let q720 = 42;
    let avif720 = await sharp(pngBuf)
      .resize(720, 450, { fit: "cover" })
      .blur(2.2)
      .avif({ quality: q720, effort: 6 })
      .toBuffer();
    while (avif720.length > 1050 && q720 > 16) {
      q720 -= 4;
      avif720 = await sharp(pngBuf)
        .resize(720, 450, { fit: "cover" })
        .blur(2.8)
        .avif({ quality: q720, effort: 6 })
        .toBuffer();
    }
    await writeSafe(path.join(outDir, `${preset.name}-720.avif`), avif720);

    const webp1440 = await sharp(pngBuf)
      .blur(1.8)
      .webp({ quality: 68, effort: 6 })
      .toBuffer();
    await writeSafe(path.join(outDir, `${preset.name}.webp`), webp1440);

    const webp720 = await sharp(pngBuf)
      .resize(720, 450, { fit: "cover" })
      .blur(2.2)
      .webp({ quality: 62, effort: 6 })
      .toBuffer();
    await writeSafe(path.join(outDir, `${preset.name}-720.webp`), webp720);

    console.log(
      `✓ ${preset.name}: 1440.avif=${(avif1440.length / 1024).toFixed(1)}KB (q=${avifQuality}), 720.avif=${(avif720.length / 1024).toFixed(1)}KB, 1440.webp=${(webp1440.length / 1024).toFixed(1)}KB`,
    );
  }
  await ctx.close();
} finally {
  await browser.close();
  await fs.rm(tmpHtml, { force: true });
}
