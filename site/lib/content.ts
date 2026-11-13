import copy from "@/content/copy.json";
import rawCases from "@/content/cases.json";
import rawFounders from "@/content/founders.json";
export type Locale = "zh" | "en";
export const t = (locale: Locale, zh: string, en: string) =>
  locale === "zh" ? zh : en;
export const text = (section: string, key: string, locale: Locale) => {
  const table = copy as Record<
    string,
    Record<string, { zh: string; en: string }>
  >;
  if (!table[section]?.[key]) throw new Error(`Missing copy ${section}/${key}`);
  return table[section][key][locale];
};
export const href = (locale: Locale, path = "") =>
  (locale === "en" ? "/en" : "") + (path || "/");
export const industries = {
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
export function cases(locale: Locale) {
  return rawCases.map((c, i) => ({
    ...c,
    index: i,
    industry: industries[locale][i],
    title: locale === "zh" ? c.title : englishCases[i].title,
    system: locale === "zh" ? c.system : englishCases[i].system,
    profile: locale === "zh" ? c.profile : englishCases[i].profile,
    stats:
      locale === "zh"
        ? c.stats
        : englishCases[i].stats.map(([value, label]) => ({
            value,
            label,
            sourceId: "case-" + c.slug,
          })),
    before:
      locale === "zh"
        ? c.beforeAfter.split(" → ")[0].replace("过去：", "")
        : englishCases[i].before,
    after:
      locale === "zh"
        ? c.beforeAfter.split(" → ")[1].replace("现在：", "")
        : englishCases[i].after,
    outcome: locale === "zh" ? c.outcome : englishCases[i].outcome,
    duration:
      locale === "zh"
        ? c.duration
        : [
            "8 weeks",
            "10 weeks",
            "4-week pilot · 8-week rollout",
            "6 weeks",
            "8 weeks",
            "10 weeks",
          ][i],
    model:
      locale === "zh"
        ? c.model
        : [0, 1, 4, 5].includes(i)
          ? "Full custom build"
          : "Pilot + ongoing service",
  }));
}
export type CaseStudy = ReturnType<typeof cases>[number];
export const founders = (locale: Locale) =>
  rawFounders.map((f, i) => ({
    id: f.id,
    role: f.role[locale === "zh" ? 0 : 1],
    tags: f.tags[locale === "zh" ? 0 : 1],
    motto: f.motto[locale === "zh" ? 0 : 1],
    bio: f.bio[locale === "zh" ? 0 : 1],
    image: "/art/founder-" + (i + 1) + ".webp",
  }));
const slugs = [
  "sales-ai",
  "document-automation",
  "knowledge-assistant",
  "data-query",
];
export function solutions(locale: Locale) {
  return slugs.map((slug, i) => ({
    slug,
    index: i,
    name: t(
      locale,
      [
        "销售与客户咨询 AI",
        "文档、标书与方案自动化",
        "企业知识库与内部助手",
        "业务数据查询与分析",
      ][i],
      [
        "Sales & Customer AI",
        "Document & Proposal Automation",
        "Knowledge & Internal Assistants",
        "Data Query & Analytics",
      ][i],
    ),
    promise: text(
      "D.3",
      ["销售 Hero", "文档 Hero", "知识库 Hero", "数据 Hero"][i],
      locale,
    ),
    intro: t(
      locale,
      [
        "根据产品资料、技术参数和历史项目回答客户问题，并准备对应的推荐方案与销售材料。",
        "把分散的历史标书、知识文档和项目参数连接起来，生成有引用、可编辑、经过完整性检查的方案初稿。",
        "连接 Wiki、操作规范与工单系统。常见问题附带来源回答，复杂请求转交支持团队。",
        "连接现有数据库，用自然语言查询库存、销量和经营数据。权限、查询校验与结果解释贯穿整个过程。",
      ][i],
      [
        "Use product documentation and project records to answer customer questions and prepare relevant recommendations and sales materials.",
        "Connect past proposals, reference documents and project parameters into editable, cited drafts with built-in completeness checks.",
        "Connect your wiki, SOPs and ticketing system to answer routine questions with sources and route complex requests to the support team.",
        "Query inventory, sales and operations in plain language, with permissions, query validation and clear explanations built in.",
      ][i],
    ),
    outputs: t(
      locale,
      [
        "专业咨询 · 项目匹配 · 销售材料",
        "标书初稿 · 方案报告 · 完整性检查",
        "知识问答 · 引用溯源 · 工单分流",
        "自然语言查询 · 数据报表 · 趋势分析",
      ][i],
      [
        "Expert answers · Project matching · Sales content",
        "Proposal drafts · Research reports · Validation",
        "Knowledge Q&A · Source citations · Ticket routing",
        "Plain-language queries · Reports · Trend analysis",
      ][i],
    ),
    caseSlug: rawCases[i].slug,
  }));
}
export const insightSlugs = [
  "why-chatgpt-is-not-a-knowledge-base",
  "proposal-draft-in-15-minutes",
  "buy-pilot-or-managed",
];
export const insights = (locale: Locale) =>
  insightSlugs.map((slug, i) => ({
    slug,
    index: i,
    title: t(
      locale,
      [
        "企业知识库需要怎样的检索、权限和维护",
        "15 分钟出标书初稿：智能标书系统是怎么搭起来的",
        "定制、试点还是托管：如何选择合作方式",
      ][i],
      [
        "Retrieval, permissions and maintenance for a company knowledge base",
        "A proposal draft in 15 minutes: how we built it",
        "Choosing a custom build, pilot or managed AI service",
      ][i],
    ),
    date: ["2026-11-10", "2026-11-03", "2026-10-27"][i],
    author: founders(locale)[[1, 2, 0][i]],
    category: t(
      locale,
      ["知识管理", "工程实践", "合作指南"][i],
      ["Knowledge management", "Engineering", "Working together"][i],
    ),
    image: [
      rawCases[2].images[0],
      rawCases[1].images[0],
      rawCases[0].images[2],
    ][i],
  }));
export const baseRoutes = [
  "",
  "services",
  ...slugs.map((s) => "services/" + s),
  "cases",
  ...rawCases.map((c) => "cases/" + c.slug),
  "technology",
  "engagement",
  "about",
  "insights",
  ...insightSlugs.map((s) => "insights/" + s),
  "contact",
  "privacy",
  "terms",
];
export const routes = baseRoutes.flatMap((r) => [r, "en" + (r ? "/" + r : "")]);
