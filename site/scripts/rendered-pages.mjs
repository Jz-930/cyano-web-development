import fs from "node:fs/promises";
import path from "node:path";

async function htmlFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true }).catch((error) => {
    if (error.code === "ENOENT") return [];
    throw error;
  });
  const files = [];
  for (const entry of entries) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await htmlFiles(file));
    else if (entry.name.endsWith(".html")) files.push(file);
  }
  return files;
}

// Next.js 16 adapters store prerenders under scoped route-cache keys.
// Read those artifacts in place; never flatten or change their cache ownership.
export async function renderedPages(root) {
  const server = path.join(root, ".next/server");
  const appDir = path.join(server, "app");
  const cacheDir = path.join(server, "route-cache/APP_PAGE");
  const manifest = JSON.parse(await fs.readFile(path.join(root, ".next/prerender-manifest.json"), "utf8"));
  const pages = new Map();
  // A running local server may also have runtime cache copies. Select the build
  // layout as a whole so those copies never replace immutable build artifacts.
  const inApp = await fs.stat(path.join(appDir, "index.html")).then(() => true, (error) => {
    if (error.code === "ENOENT") return false;
    throw error;
  });
  for (const file of await htmlFiles(inApp ? appDir : cacheDir)) {
    let name = path.relative(inApp ? appDir : cacheDir, file).replace(/\\/g, "/");
    if (!inApp) {
      const scopedPath = name.match(/^[a-f0-9]{64}\/\$\/(.+)$/);
      if (!scopedPath) throw new Error(`Unrecognized prerender cache path: ${file}`);
      const meta = JSON.parse(await fs.readFile(file.replace(/\.html$/, ".meta"), "utf8"));
      if (meta.routeCache?.isFallback) continue;
      name = scopedPath[1];
    }
    let route = "/" + name.replace(/\.html$/, "");
    route = route === "/index" ? "/" : route.startsWith("/index/") ? route.slice(6) : route;
    if (!manifest.routes[route]) continue;
    if (pages.has(route)) throw new Error(`Multiple prerenders found for ${route}`);
    pages.set(route, file);
  }
  if (!pages.has("/")) throw new Error("Homepage HTML is missing from the Next.js build outputs");
  for (const [route, entry] of Object.entries(manifest.routes)) {
    if (entry.dataRoute?.endsWith(".rsc") && !pages.has(route)) {
      throw new Error(`Prerendered HTML is missing for ${route}`);
    }
  }
  return pages;
}
