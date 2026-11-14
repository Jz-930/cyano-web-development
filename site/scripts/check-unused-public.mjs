import fs from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const publicDir = path.join(root, "public");
const reportsDir = path.join(root, "reports");

async function walkFiles(dir) {
  const out = [];
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...(await walkFiles(full)));
    } else if (entry.isFile()) {
      out.push(full);
    }
  }
  return out;
}

const searchDirs = [
  path.join(root, "app"),
  path.join(root, "components"),
  path.join(root, "lib"),
  path.join(root, "content"),
  path.join(root, ".next/server/app"),
];

const textExt = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".mjs",
  ".cjs",
  ".json",
  ".css",
  ".html",
  ".md",
]);

const haystackChunks = [];
for (const dir of searchDirs) {
  const files = await walkFiles(dir);
  for (const file of files) {
    if (!textExt.has(path.extname(file).toLowerCase())) continue;
    haystackChunks.push(await fs.readFile(file, "utf8"));
  }
}
const haystack = haystackChunks.join("\n");

const publicFiles = (await walkFiles(publicDir)).sort();
const unused = [];

for (const absFile of publicFiles) {
  const relPath = "/" + path.relative(publicDir, absFile).replace(/\\/g, "/");
  if (!haystack.includes(relPath)) {
    unused.push(relPath);
  }
}

await fs.mkdir(reportsDir, { recursive: true });
const reportPath = path.join(reportsDir, "unused-public.txt");
await fs.writeFile(
  reportPath,
  unused.length ? unused.join("\n") + "\n" : "",
  "utf8",
);

if (unused.length > 0) {
  console.error(`Found ${unused.length} unused public file(s):`);
  for (const item of unused) console.error(`  ${item}`);
  process.exit(1);
}

console.log(`✓ check-unused-public passed (${publicFiles.length} public files all referenced, 0 unused).`);
