import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import { renderedPages } from "./rendered-pages.mjs";

for (const layout of ["app", "route-cache"]) {
  test(`reads all prerendered routes from ${layout}`, async (t) => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), "cyano-rendered-pages-"));
    t.after(() => fs.rm(root, { recursive: true, force: true }));
    const routes = ["/", "/about", "/en", "/en/insights/article"];
    const entries = Object.fromEntries(routes.map((route) => [route, {
      dataRoute: `${route === "/" ? "/index" : route}.rsc`,
    }]));
    await fs.mkdir(path.join(root, ".next"));
    await fs.writeFile(path.join(root, ".next/prerender-manifest.json"), JSON.stringify({ routes: entries }));
    for (const route of routes) {
      const name = route === "/" ? "index" : route.slice(1);
      const dir = layout === "app" ? "app" : `route-cache/APP_PAGE/${"a".repeat(64)}/$`;
      const file = path.join(root, ".next/server", dir, `${name}.html`);
      await fs.mkdir(path.dirname(file), { recursive: true });
      await fs.writeFile(file, `<html>${route}</html>`);
      if (layout === "route-cache") {
        await fs.writeFile(file.replace(/\.html$/, ".meta"), JSON.stringify({ routeCache: { isFallback: false } }));
      }
    }
    const pages = await renderedPages(root);
    assert.deepEqual([...pages.keys()].sort(), routes.sort());
    assert.equal(await fs.readFile(pages.get("/"), "utf8"), "<html>/</html>");
    await fs.unlink(pages.get("/about"));
    await assert.rejects(renderedPages(root), /HTML is missing for \/about/);
  });
}
