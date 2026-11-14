import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "../..");
const rawCases = JSON.parse(fs.readFileSync(path.join(root, "content/v1/cases.json"), "utf8"));
const renderedBaseline = JSON.parse(
  fs.readFileSync(path.join(root, "content/v1/rendered-baseline.json"), "utf8"),
);

const industries = {
  zh: [
    "工程与制造",
    "专业服务与投研",
    "企业服务",
    "零售与供应链",
    "房地产与物业",
    "内容与传媒",
  ],
  en: [
    "Engineering & Manufacturing",
    "Professional Services & Research",
    "Enterprise Services",
    "Retail & Supply Chain",
    "Real Estate & Property",
    "Content & Media",
  ],
};

const englishCases = [
  {
    title: "Round-the-clock answers from product and project records",
    system: "LNPE Engineering Advisor",
    profile:
      "An engineering equipment company with complex product lines and technical specifications.",
    stats: [
      ["24/7", "Product and technical inquiries"],
      ["Seconds", "Product & project retrieval"],
      ["1:1", "Personalized sales content"],
    ],
    before:
      "Customers waited for engineers. Sales teams searched through scattered documentation.",
    after:
      "Answers based on product records, equipment matching and customer-specific sales material.",
    outcome:
      "The engineering team now supports round-the-clock professional inquiries. Salespeople can retrieve specifications, comparable projects and pricing references in the field.",
  },
  {
    title: "From two days to 15 minutes: AI-drafted proposals and reports",
    system: "Intelligent Proposal Builder",
    profile:
      "A professional consulting and research firm producing high volumes of evidence-based proposals.",
    stats: [
      ["15 min", "To a first proposal draft"],
      ["99%", "Citation accuracy"],
      ["7", "Completeness checks"],
    ],
    before: "Two days of drafting, followed by repeated manual checks.",
    after:
      "A draft in 15 minutes, automatically checked for completeness and ready for human review.",
    outcome:
      "Writers spend less time assembling source material and more time improving the argument. A first draft can be generated in 15 minutes.",
  },
  {
    title: "AI handles 80% of routine inquiries, averaging under 3 seconds",
    system: "Enterprise Wiki IT Assistant",
    profile:
      "An enterprise IT department supporting a large internal workforce and a high volume of requests.",
    stats: [
      ["80%", "Routine tickets handled"],
      ["< 3s", "Average response time"],
      ["24/7", "Always available"],
    ],
    before:
      "Employees queued for IT support, with the same questions answered repeatedly.",
    after: "Cited answers in seconds, with complex requests routed to a human.",
    outcome:
      "AI now handles 80% of routine inquiries, giving the IT team more time for systems work that requires their expertise.",
  },
  {
    title: "Query inventory and sales in plain language",
    system: "SmartDoc AI Data Query",
    profile:
      "A retail and supply chain business with a large SKU catalog and extensive inventory and sales data.",
    stats: [
      ["0", "Lines of SQL to write"],
      ["Seconds", "To a query result"],
      ["Plain language", "Inventory & sales questions"],
    ],
    before:
      "Business users filed a request and waited a day or longer for a data export.",
    after: "A plain-language question returns a table or chart within seconds.",
    outcome:
      "Business teams query inventory and sales directly. Routine reporting no longer depends on the IT queue.",
  },
  {
    title: "Extract expenses from messages and organize property accounts",
    system: "AlphaHouse Property Management",
    profile:
      "A property management and rental operator overseeing multiple rental properties.",
    stats: [
      ["Automatic", "Expense statements"],
      ["Connected", "Messages & payments"],
      ["Per property", "Performance per property"],
    ],
    before:
      "Messages and expenses were scattered across channels and reconciled by hand.",
    after:
      "AI extracts rental, repair and management expenses into property-level statements.",
    outcome:
      "Daily communication becomes structured accounts. Owners can review income, expenses and investment performance for each property.",
  },
  {
    title: "Manage character details and branches in million-word stories",
    system: "DME Writing Engine",
    profile:
      "A content production team creating long-form fiction and scripts.",
    stats: [
      ["1M+ words", "Designed memory capacity"],
      ["Multi-branch", "Separate storylines"],
      ["Multi-model", "Flexible model selection"],
    ],
    before:
      "Long-form AI writing confused character facts and alternate storylines.",
    after:
      "A controlled memory layer loads the right context and keeps branches separate.",
    outcome:
      "Writers manage character settings and story branches, with relevant records retrieved for each generation.",
  },
];

const TABLE = [
  {
    order: 0,
    slug: "sales-consultant-ai",
    industryId: "engineering",
    zhIndustry: "工程与制造",
    enIndustry: "Engineering & Manufacturing",
    solution: "sales-ai",
    mockup: "sales",
  },
  {
    order: 1,
    slug: "proposal-generation",
    industryId: "professional-services",
    zhIndustry: "专业服务与投研",
    enIndustry: "Professional Services & Research",
    solution: "document-automation",
    mockup: "proposal",
  },
  {
    order: 2,
    slug: "it-knowledge-assistant",
    industryId: "enterprise-services",
    zhIndustry: "企业服务",
    enIndustry: "Enterprise Services",
    solution: "knowledge-assistant",
    mockup: "wiki",
  },
  {
    order: 3,
    slug: "nl-data-query",
    industryId: "retail",
    zhIndustry: "零售与供应链",
    enIndustry: "Retail & Supply Chain",
    solution: "data-query",
    mockup: "data",
  },
  {
    order: 4,
    slug: "property-management",
    industryId: "real-estate",
    zhIndustry: "房地产与物业",
    enIndustry: "Real Estate & Property",
    solution: "vertical",
    mockup: "property",
  },
  {
    order: 5,
    slug: "writing-memory-engine",
    industryId: "content-media",
    zhIndustry: "内容与传媒",
    enIndustry: "Content & Media",
    solution: "vertical",
    mockup: "writing",
  },
];

const enDurations = [
  "8 weeks",
  "10 weeks",
  "4-week pilot · 8-week rollout",
  "6 weeks",
  "8 weeks",
  "10 weeks",
];

if (rawCases.length !== TABLE.length) {
  throw new Error(`Expected ${TABLE.length} cases, got ${rawCases.length}`);
}

const outCases = rawCases.map((c, i) => {
  const row = TABLE[i];
  if (c.slug !== row.slug) {
    throw new Error(`Position ${i} slug mismatch: expected ${row.slug}, got ${c.slug}`);
  }
  if (industries.zh[i] !== row.zhIndustry || industries.en[i] !== row.enIndustry) {
    throw new Error(`Position ${i} industry table mismatch`);
  }

  const parts = c.beforeAfter.split(" → ");
  if (parts.length !== 2) throw new Error(`Invalid beforeAfter format in ${c.slug}`);
  const zhBefore = parts[0].replace(/^过去：/, "");
  const zhAfter = parts[1].replace(/^现在：/, "");
  if (`过去：${zhBefore} → 现在：${zhAfter}` !== c.beforeAfter) {
    throw new Error(`Round-trip beforeAfter mismatch in ${c.slug}`);
  }

  const en = englishCases[i];
  const enModel = [0, 1, 4, 5].includes(i) ? "Full custom build" : "Pilot + ongoing service";

  const stats = c.stats.map((s, si) => ({
    value: { zh: s.value, en: en.stats[si][0] },
    label: { zh: s.label, en: en.stats[si][1] },
    sourceId: s.sourceId,
  }));

  const item = {
    slug: c.slug,
    order: row.order,
    industry: row.industryId,
    solution: row.solution,
    model: { zh: c.model, en: enModel },
    duration: { zh: c.duration, en: enDurations[i] },
    title: { zh: c.title, en: en.title },
    system: { zh: c.system, en: en.system },
    profile: { zh: c.profile, en: en.profile },
    stats,
    before: { zh: zhBefore, en: en.before },
    after: { zh: zhAfter, en: en.after },
    outcome: { zh: c.outcome, en: en.outcome },
    images: c.images,
    main: c.main,
    ...(c.demo ? { demo: c.demo } : {}),
    mockup: row.mockup,
  };
  return item;
});

// Self-check against rendered-baseline.json case pages
const norm = (s) =>
  s
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, "");
for (let i = 0; i < outCases.length; i++) {
  const item = outCases[i];
  const row = TABLE[i];
  for (const locale of ["zh", "en"]) {
    const routeKey = locale === "zh" ? `/cases/${item.slug}` : `/en/cases/${item.slug}`;
    const baseline = renderedBaseline[routeKey];
    if (!baseline) throw new Error(`Missing baseline route ${routeKey}`);
    const pageNorm = norm(baseline.text);
    const expectedStrings = [
      locale === "zh" ? row.zhIndustry : row.enIndustry,
      item.title[locale],
      item.system[locale],
      item.profile[locale],
      item.model[locale],
      item.duration[locale],
      item.before[locale],
      item.after[locale],
      item.outcome[locale],
      ...item.stats.flatMap((s) => [s.value[locale], s.label[locale]]),
    ];
    for (const str of expectedStrings) {
      if (!pageNorm.includes(norm(str))) {
        throw new Error(`Self-check failed on ${routeKey}: missing "${str}"`);
      }
    }
  }
}

const outDir = path.join(root, "content/v4");
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "cases.json"), JSON.stringify(outCases, null, 2) + "\n");
console.log(`Generated content/v4/cases.json (${outCases.length} cases) and verified 100% match against rendered-baseline.json.`);
