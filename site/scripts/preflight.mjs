import fs from "node:fs/promises";
import path from "node:path";
import dns from "node:dns/promises";

const root = path.resolve(import.meta.dirname, "..");
const cases = JSON.parse(
  await fs.readFile(path.join(root, "content/v4/cases.json"), "utf8")
);

const availability = { email: false, demos: {} };
try {
  availability.email = (await dns.resolveMx("cyano.app")).length > 0;
} catch {}

const results = await Promise.all(
  cases
    .filter((c) => c.demo)
    .map(async (c) => {
      try {
        const response = await fetch(c.demo, {
          signal: AbortSignal.timeout(12000),
        });
        const html = await response.text();
        const ok =
          response.status === 200 && /<title>[^<]+<\/title>/i.test(html);
        availability.demos[c.slug] = ok;
        return `${c.demo} — HTTP ${response.status}; enabled=${ok}`;
      } catch (e) {
        availability.demos[c.slug] = false;
        return `${c.demo} — disabled: ${e.message}`;
      }
    })
);

await fs.writeFile(
  path.join(root, "content/availability.json"),
  JSON.stringify(availability, null, 2)
);
await fs.writeFile(
  path.join(root, "../docs/link-report.md"),
  `# Link availability\n\n${new Date().toISOString()}\n\n${results.join("\n\n")}\n`
);
console.log("✓ Online link availability verified:\n" + results.join("\n"));
