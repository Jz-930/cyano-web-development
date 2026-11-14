import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "../..");
const v4Dir = path.join(root, "content/v4");
const mockupsDir = path.join(v4Dir, "mockups");
fs.mkdirSync(mockupsDir, { recursive: true });

// 1. industries.json (02 §4.3)
const industries = [
  { id: "engineering", order: 0, label: { zh: "工程与制造", en: "Engineering & Manufacturing" } },
  { id: "professional-services", order: 1, label: { zh: "专业服务与投研", en: "Professional Services & Research" } },
  { id: "enterprise-services", order: 2, label: { zh: "企业服务", en: "Enterprise Services" } },
  { id: "retail", order: 3, label: { zh: "零售与供应链", en: "Retail & Supply Chain" } },
  { id: "real-estate", order: 4, label: { zh: "房地产与物业", en: "Real Estate & Property" } },
  { id: "content-media", order: 5, label: { zh: "内容与传媒", en: "Content & Media" } },
];
fs.writeFileSync(path.join(v4Dir, "industries.json"), JSON.stringify(industries, null, 2) + "\n");

// 2. solutions.json (02 §4.3, migrating from v1/copy.json + solutions-v2.json)
const v1Copy = JSON.parse(fs.readFileSync(path.join(root, "content/v1/copy.json"), "utf8"));
const oldSolutions = JSON.parse(fs.readFileSync(path.join(root, "content/solutions-v2.json"), "utf8"));
const solOutputs = [
  { zh: "专业咨询 · 项目匹配 · 销售材料", en: "Expert answers · Project matching · Sales content" },
  { zh: "标书初稿 · 方案报告 · 完整性检查", en: "Proposal drafts · Research reports · Validation" },
  { zh: "知识问答 · 引用溯源 · 工单分流", en: "Knowledge Q&A · Source citations · Ticket routing" },
  { zh: "自然语言查询 · 数据报表 · 趋势分析", en: "Plain-language queries · Reports · Trend analysis" },
];
const heroKeys = ["销售 Hero", "文档 Hero", "知识库 Hero", "数据 Hero"];
const solutions = oldSolutions.map((s, i) => ({
  slug: s.slug,
  order: i,
  name: s.name,
  shortName: s.shortName,
  promise: v1Copy["D.3"][heroKeys[i]],
  intro: s.intro,
  outputs: solOutputs[i],
  metaDescription: s.metaDescription,
  deliverables: s.deliverables,
  capabilities: s.capabilities,
  caseSlug: s.caseSlug,
  pains: s.pains,
  workflow: s.workflow,
  faqs: s.faqs,
}));
fs.writeFileSync(path.join(v4Dir, "solutions.json"), JSON.stringify(solutions, null, 2) + "\n");

// 3. team.json (02 §4.3 + 07 §7.3 stages from [3, 0, 3, 1, 2] -> F1:[2], F2:[4], F3:[5], F4:[1,3])
const rawFounders = JSON.parse(fs.readFileSync(path.join(root, "content/v1/founders.json"), "utf8"));
const stageMap = [[2], [4], [5], [1, 3]];
const team = rawFounders.map((f, i) => ({
  id: f.id,
  order: i,
  role: { zh: f.role[0], en: f.role[1] },
  tags: { zh: f.tags[0], en: f.tags[1] },
  motto: { zh: f.motto[0], en: f.motto[1] },
  bio: { zh: f.bio[0], en: f.bio[1] },
  portrait: `/art/founder-${i + 1}.webp`,
  stages: stageMap[i],
}));
fs.writeFileSync(path.join(v4Dir, "team.json"), JSON.stringify(team, null, 2) + "\n");

// 4. site.json (02 §4.1 & §8.3: migrated verbatim from site-copy-v2.json)
const siteCopy = JSON.parse(fs.readFileSync(path.join(root, "content/site-copy-v2.json"), "utf8"));
fs.writeFileSync(path.join(v4Dir, "site.json"), JSON.stringify(siteCopy, null, 2) + "\n");

// 5. insights.json (02 §8.3: migrated verbatim from insights-v2.json + articles.json)
const oldInsights = JSON.parse(fs.readFileSync(path.join(root, "content/insights-v2.json"), "utf8"));
const oldArticles = JSON.parse(fs.readFileSync(path.join(root, "content/articles.json"), "utf8"));
const v4Cases = JSON.parse(fs.readFileSync(path.join(v4Dir, "cases.json"), "utf8"));
const insightImages = [
  v4Cases[2].images[0],
  v4Cases[1].images[0],
  v4Cases[0].images[2],
];
const insights = oldInsights.map((ins, i) => ({
  ...ins,
  order: i,
  image: insightImages[i],
  blocks: oldArticles[ins.slug],
}));
fs.writeFileSync(path.join(v4Dir, "insights.json"), JSON.stringify(insights, null, 2) + "\n");

// 6. copy-overrides.json & copy-new.json (09-文案对照稿.md all rows)
const entry = (zh, en, status, ref) => ({ zh, en, status, ref });

const copyOverrides = {
  "D.4/如果效果不达预期怎么办？ / What if results fall short?": entry(
    "试点开始前，双方先约定验收标准。如果结果不达预期，可以补充资料、调整流程，也可以停止试点，再决定是否加大投入。",
    "Before the pilot, we agree on acceptance criteria. If results fall short, we can add source material, adjust the workflow or stop the pilot, then decide whether to invest further.",
    "approved",
    "09#E-3",
  ),
  "D.4/数据安全如何保障？ / How is our data protected?": entry(
    "支持私有化部署，数据不出你的环境；系统内置权限控制、日志审计与敏感信息拦截。",
    "Private deployment keeps data inside your environment. Every system includes access control, full audit logs and sensitive-data filtering.",
    "approved",
    "09#D-20",
  ),
};
fs.writeFileSync(path.join(v4Dir, "copy-overrides.json"), JSON.stringify(copyOverrides, null, 2) + "\n");

const copyNew = {
  // §1 Class-A functional & fact-table strings
  "F10-e1": entry("请填写这一项。", "Please fill in this field.", "class-a", "09#F10-e1"),
  "F10-e2": entry("请填写有效的邮箱地址。", "Please enter a valid email address.", "class-a", "09#F10-e2"),
  "F10-e3": entry("请先阅读并同意隐私政策。", "Please accept the Privacy Policy to continue.", "class-a", "09#F10-e3"),
  "F12-1": entry(
    "了解 Cyano（澜屿智创）如何收集、使用和保护你在业务咨询中提供的信息，以及你的查询与删除权利。",
    "How Cyano Intelligence collects, uses, stores and protects inquiry information, along with retention periods and your data rights.",
    "class-a",
    "09#F12-1",
  ),
  "F12-2": entry(
    "查看 Cyano（澜屿智创）官方网站的内容说明、知识产权声明、合理使用规范与外部链接说明。",
    "Website terms of use, intellectual property notices, acceptable use guidelines and external link notices for Cyano Intelligence.",
    "class-a",
    "09#F12-2",
  ),
  "E-T1": entry("6–12 周完成首期上线", "First release in 6–12 weeks", "class-a", "09#E-T1"),
  "E-T2": entry("2–6 周上线首个可用版本", "First working version in 2–6 weeks", "class-a", "09#E-T2"),
  "E-T3": entry("首批结果 2 周内交付", "First results within 2 weeks", "class-a", "09#E-T3"),
  "G-1": entry("需求评估", "Assessment", "class-a", "09#G-1"),
  "G-2": entry("首期上线", "First release", "class-a", "09#G-2"),
  "G-3": entry("首个可用版本", "First working version", "class-a", "09#G-3"),
  "G-4": entry("首批结果", "First results", "class-a", "09#G-4"),
  "G-5": entry("按月 / 按批次持续交付", "Ongoing monthly or batch delivery", "class-a", "09#G-5"),
  "G-6": entry("试点", "Pilot", "class-a", "09#G-6"),
  "G-7": entry("人工验收", "Human sign-off", "class-a", "09#G-7"),
  "G-8": entry("Docker", "Docker", "class-a", "09#G-8"),
  "G-cap": entry("三种合作方式的典型周期对比", "Typical timelines for the three engagement models", "class-a", "09#G-cap"),
  "K-T1": entry("1 个工作日", "1 business day", "class-a", "09#K-T1"),
  "K-T2": entry("1 周", "1 week", "class-a", "09#K-T2"),
  "S1-pause": entry("暂停演示", "Pause demo", "class-a", "09#S1-pause"),
  "S1-play": entry("播放演示", "Play demo", "class-a", "09#S1-play"),
  "S3-ill": entry("示意图", "Illustration", "class-a", "09#S3-ill"),
  "S3-idx": entry("索引", "Index", "class-a", "09#S3-idx"),
  "S5-token": entry("任务", "Task", "class-a", "09#S5-token"),
  "S5-review": entry("人工复核", "Human review", "class-a", "09#S5-review"),
  "S5-rerun": entry("重新运行", "Run again", "class-a", "09#S5-rerun"),
  "S7-badge": entry("推荐", "Recommended", "class-a", "09#S7-badge"),
  "S9-label": entry("拖动对比过去与现在", "Drag to compare before and after", "class-a", "09#S9-label"),
  "S9-before": entry("过去", "Before", "class-a", "09#S9-before"),
  "S9-after": entry("现在", "After", "class-a", "09#S9-after"),
  "S9-r1": entry("2 天", "2 days", "class-a", "09#S9-r1"),
  "S9-r2": entry("15 分钟", "15 minutes", "class-a", "09#S9-r2"),
  "S11-auto": entry("自动播放", "Auto-play", "class-a", "09#S11-auto"),
  "T-3h1": entry("过去", "Before", "class-a", "09#T-3h1"),
  "T-3h2": entry("现在", "With Cyano Core", "class-a", "09#T-3h2"),
  "cite-label": entry("依据", "Source", "class-a", "09#cite-label"),
  "cite-case": entry("查看案例", "View case", "class-a", "09#cite-case"),
  "copied": entry("已复制", "Copied", "class-a", "09#copied"),

  // §2 Home
  "H-0": entry("想让 AI 接手日常工作？", "Want AI to take on day-to-day work?", "approved", "09#H-0"),
  "H-1a": entry("方案初稿 **2 天 → 15 分钟**", "Proposal drafts **2 days → 15 min**", "approved", "09#H-1a"),
  "H-1b": entry("常见 IT 咨询 **80%** 由 AI 处理", "**80%** of routine IT inquiries handled by AI", "approved", "09#H-1b"),
  "H-1c": entry("试点 **2–6 周**交付首个可用版本", "First working pilot in **2–6 weeks**", "approved", "09#H-1c"),
  "H-1d": entry("**1 个工作日**内回复", "Reply within **1 business day**", "approved", "09#H-1d"),
  "H-1n": entry("界面为重建示意，数据已脱敏", "Recreated interface; data anonymised", "approved", "09#H-1n"),
  "H-2t": entry("用了 AI 工具，日常工作为什么还没变快？", "Why isn't day-to-day work getting faster with AI tools?", "approved", "09#H-2t"),
  "H-2s": entry("模型之外，企业还常遇到下面四个问题。", "Beyond the model, companies often face these four issues.", "approved", "09#H-2s"),
  "H-2k1": entry("找不到", "Can't find it", "approved", "09#H-2k1"),
  "H-2k2": entry("说不准", "Can't rely on it", "approved", "09#H-2k2"),
  "H-2k3": entry("不敢交", "Can't sign off", "approved", "09#H-2k3"),
  "H-2k4": entry("各用各", "Everyone works their own way", "approved", "09#H-2k4"),
  "H-2c": entry(
    "资料、权限和审核流程，需要与模型一起设计。",
    "Sources, access controls and review steps have to be designed alongside the model.",
    "approved",
    "09#H-2c",
  ),

  // H-3 (01..06)
  "H-3d01": entry("方案·投标团队", "Bid team", "approved", "09#H-3.01"),
  "H-3b01": entry("2 天", "2 days", "approved", "09#H-3.01"),
  "H-3a01": entry("**15 分钟**", "**15 min**", "approved", "09#H-3.01"),
  "H-3d02": entry("IT 支持", "IT support", "approved", "09#H-3.02"),
  "H-3b02": entry("排队等回复", "Waiting in the queue", "approved", "09#H-3.02"),
  "H-3a02": entry("**< 3 秒**", "**< 3 s**", "approved", "09#H-3.02"),
  "H-3d03": entry("业务·运营", "Operations", "approved", "09#H-3.03"),
  "H-3b03": entry("等 IT 导出数据一天以上", "A day or more for an IT export", "approved", "09#H-3.03"),
  "H-3a03": entry("**秒级**", "**Seconds**", "approved", "09#H-3.03"),
  "H-3d04": entry("销售·售前", "Sales", "approved", "09#H-3.04"),
  "H-3b04": entry("等工程师回复", "Waiting for an engineer", "approved", "09#H-3.04"),
  "H-3a04": entry("**7×24**", "**24/7**", "approved", "09#H-3.04"),
  "H-3d05": entry("物业运营·财务", "Property ops", "approved", "09#H-3.05"),
  "H-3b05": entry("手工整理", "Manual bookkeeping", "approved", "09#H-3.05"),
  "H-3a05": entry("**自动生成账单**", "**Auto-generated statements**", "approved", "09#H-3.05"),
  "H-3d06": entry("内容团队", "Content team", "approved", "09#H-3.06"),
  "H-3b06": entry("AI 记混设定", "Mixed-up story details", "approved", "09#H-3.06"),
  "H-3a06": entry("**分支互不干扰**", "**Branches stay separate**", "approved", "09#H-3.06"),

  // H-4
  "H-4e": entry("怎么选", "Your options", "approved", "09#H-4e"),
  "H-4t": entry("三种使用 AI 的做法，有什么区别？", "How do these three ways of using AI compare?", "approved", "09#H-4t"),
  "H-4r0": entry("对比维度", "Compare", "approved", "09#H-4r0"),
  "H-4c1": entry("员工各自使用通用 AI 工具", "Staff use general AI tools on their own", "approved", "09#H-4c1"),
  "H-4c2": entry("企业自建团队", "Build it in-house", "approved", "09#H-4c2"),
  "H-4c3": entry("Cyano：定制 + 持续维护", "Cyano: custom build + ongoing support", "approved", "09#H-4c3"),
  "H-4r1": entry("资料从哪来", "Where sources come from", "approved", "09#H-4r1"),
  "H-4r1c1": entry("员工手动提供", "Staff provide sources manually", "approved", "09#H-4r1"),
  "H-4r1c2": entry("需自行搭建检索与权限管理", "You build retrieval and access controls", "approved", "09#H-4r1"),
  "H-4r1c3": entry("按权限检索企业知识库", "Permission-aware search of your knowledge base", "approved", "09#H-4r1"),
  "H-4r2": entry("怎么执行", "How the work runs", "approved", "09#H-4r2"),
  "H-4r2c1": entry("各自编写提示词", "Everyone writes their own prompts", "approved", "09#H-4r2"),
  "H-4r2c2": entry("需自行开发流程", "You build the workflows", "approved", "09#H-4r2"),
  "H-4r2c3": entry("按 SOP 执行并记录步骤", "Runs your SOPs and records each step", "approved", "09#H-4r2"),
  "H-4r3": entry("结果怎么核", "How results are checked", "approved", "09#H-4r3"),
  "H-4r3c1": entry("靠个人判断", "Personal judgement", "approved", "09#H-4r3"),
  "H-4r3c2": entry("需自行设计", "You design the checks", "approved", "09#H-4r3"),
  "H-4r3c3": entry("规则校验 + 来源引用 + 人工审核", "Rule checks, citations and human review", "approved", "09#H-4r3"),
  // H-4r4 & H-4r5 rejected ("暂不用（缺事实）")
  "H-4r4": entry("多久有可用版本", "Time to a working version", "rejected", "09#H-4r4"),
  "H-4r4c1": entry("立即可用，但不接入业务资料", "Immediate, but without your business data", "rejected", "09#H-4r4"),
  "H-4r4c3": entry("试点 2–6 周首个可用版本", "First working pilot in 2–6 weeks", "rejected", "09#H-4r4"),
  "H-4r5": entry("换模型时", "When you switch models", "rejected", "09#H-4r5"),
  "H-4r5c1": entry("逐项调整", "Adjust each item", "rejected", "09#H-4r5"),
  "H-4r5c3": entry("保留知识与流程，测试后再切换", "Keep knowledge and workflows; switch after testing", "rejected", "09#H-4r5"),
  "H-4r6": entry("上线后谁维护", "Who maintains it", "approved", "09#H-4r6"),
  "H-4r6c1": entry("无人负责", "No one", "approved", "09#H-4r6"),
  "H-4r6c2": entry("自有团队", "Your own team", "approved", "09#H-4r6"),
  "H-4r6c3": entry("三种合作方式都包含上线维护", "Support is included in all three engagement models", "approved", "09#H-4r6"),
  "H-4r7": entry("怎么推行到团队", "How it reaches your team", "approved", "09#H-4r7"),
  "H-4r7c1": entry("各自摸索", "Everyone figures it out alone", "approved", "09#H-4r7"),
  "H-4r7c2": entry("需自行安排培训与推广", "Training and rollout to organise yourself", "approved", "09#H-4r7"),
  "H-4r7c3": entry("配套培训，分阶段上线，员工用熟一步再推进下一步", "Training included; staged rollout, one step at a time", "approved", "09#H-4r7"),
  "H-4n1": entry("能聊天 ≠ 能上线", "Being able to chat ≠ being ready for production", "approved", "09#H-4n1"),
  "H-4n2": entry("接入模型 ≠ 用上你的资料", "Connecting a model ≠ using your knowledge", "approved", "09#H-4n2"),
  "H-4n3": entry("换模型 ≠ 推倒重来", "Switching models ≠ starting over", "approved", "09#H-4n3"),
  "H-4z": entry("模型之外，还要看谁负责资料、流程和维护。", "Beyond the model, consider who manages the sources, workflows and ongoing maintenance.", "approved", "09#H-4z"),

  // H-5, E-2, H-6, H-7, H-8
  "H-5a1": entry("买工具", "Own the tool", "approved", "09#H-5a1"),
  "H-5a2": entry("买使用权", "Pay for access", "approved", "09#H-5a2"),
  "H-5a3": entry("买结果", "Buy the outcome", "approved", "09#H-5a3"),
  "E-2.1": entry("**1 周** 给出需求评估结论", "**1 week** — assessment findings", "approved", "09#E-2.1"),
  "E-2.2": entry("**2–6 周** 试点上线首个可用版本", "**2–6 weeks** — first working pilot", "approved", "09#E-2.2"),
  "E-2.3": entry("**按结果决定**：扩展、调整或停止", "**Decide based on results**: expand, adjust or stop", "approved", "09#E-2.3"),
  "H-6.1": entry("需求、开发和上线后的维护，都由同一个资深核心团队负责。", "The same experienced core team handles requirements, development and post-launch support.", "approved", "09#H-6.1"),
  "H-6.2": entry("我们了解模型的工作原理，也熟悉企业系统的上线要求。", "We understand how models work and what it takes to put enterprise systems into use.", "approved", "09#H-6.2"),
  "H-6.3": entry("我们在大型组织工作过，熟悉其中的协作方式和系统上线要求。", "We have worked in large organisations and know how teams collaborate and what system rollouts require.", "approved", "09#H-6.3"),
  "H-6.4": entry("工程制造、投研、物业、零售、企业服务、内容传媒。", "Manufacturing, investment research, property, retail, enterprise services and media.", "approved", "09#H-6.4"),
  "H-7t": entry("常见问题", "Common questions", "approved", "09#H-7t"),
  "H-7q1": entry("数据很敏感，能放在我们自己的环境吗？", "Our data is sensitive. Can it stay in our own environment?", "approved", "09#H-7q1"),
  "H-7q2": entry("效果不好怎么办？", "What if it doesn't work well enough?", "approved", "09#H-7q2"),
  "H-7q3": entry("先做试点，还是直接开发完整系统？", "Should we pilot first or build the full system?", "approved", "09#H-7q3"),
  "H-7l": entry("查看全部问题", "See all questions", "approved", "09#H-7l"),
  "H-8t": entry("先诊断，再交付，长期负责。", "Diagnose. Deliver. Sustain.", "approved", "09#H-8t"),
  "H-8s": entry(
    "带一份现在的工作样本来。30–45 分钟沟通，一周内给你需求评估结论和合作建议。",
    "Bring a sample of your current work for a 30–45 minute call. Within a week, we'll give you an assessment and recommend a way to work together.",
    "approved",
    "09#H-8s",
  ),

  // §3.1 Services & Solutions
  "S-1": entry("哪一项工作，最该先交给 AI？", "Which part of the work should AI take on first?", "approved", "09#S-1"),
  "S-2.1": entry("等工程师回复 → **7×24 即时应答**", "Waiting for an engineer → **24/7 instant answers**", "approved", "09#S-2.1"),
  "S-2.2": entry("2 天 → **15 分钟**", "2 days → **15 min**", "approved", "09#S-2.2"),
  "S-2.3": entry("排队等 IT → **< 3 秒带出处**", "Waiting for IT → **cited answers in < 3 s**", "approved", "09#S-2.3"),
  "S-2.4": entry("等 IT 导出数据 → **秒级自助查询**", "Waiting for IT to export data → **self-service queries in seconds**", "approved", "09#S-2.4"),
  "S-3a1": entry("→ 接入历史标书、知识文档和项目参数，统一检索。", "→ Past bids, knowledge documents and project parameters in one search.", "approved", "09#S-3a1"),
  "S-3a2": entry("→ 15 分钟生成带引用、可编辑的初稿。", "→ An editable, cited draft in 15 minutes.", "approved", "09#S-3a2"),
  "S-3a3": entry("→ 自动完成 7 项完整性检查，再交人工复核。", "→ 7 automatic completeness checks, then human review.", "approved", "09#S-3a3"),
  "S-3neq.document-automation": entry(
    "**生成一段文字 ≠ 完成一份可交付的初稿。** 初稿要有出处、查得出遗漏、改得动。在已交付的项目中，引用准确率为 99%，7 项完整性检查自动执行。",
    "**Generated text ≠ a draft ready for delivery.** A draft needs source citations, checks for missing information and editable text. In the delivered project, citation accuracy was 99%, with 7 completeness checks run automatically.",
    "approved",
    "09#S-3neq.document-automation",
  ),
  "S-3neq.sales-ai": entry("**能聊天 ≠ 能答专业参数。**", "**Chatting ≠ answering spec questions.**", "approved", "09#S-3neq.sales-ai"),
  "S-3neq.knowledge-assistant": entry("**搜得到 ≠ 答得有出处。**", "**Finding information ≠ giving an answer with sources.**", "approved", "09#S-3neq.knowledge-assistant"),
  "S-3neq.data-query": entry("**会写 SQL 的人 ≠ 要数的人。**", "**The people who can write SQL ≠ the people who need the numbers.**", "approved", "09#S-3neq.data-query"),
  "S-4q1": entry("我们现在用的系统能直接接吗？", "Will it work with the systems we already use?", "approved", "09#S-4q1"),
  "S-4q2": entry("AI 答错了怎么办？", "What happens when the AI gets it wrong?", "approved", "09#S-4q2"),
  "S-4q3": entry("多久能先用起来？", "How soon can my team actually use it?", "approved", "09#S-4q3"),

  // S-W
  "S-W.sales-ai.1": entry("产品资料与项目记录", "Product and project records", "approved", "09#S-W.sales-ai"),
  "S-W.sales-ai.2": entry("Cyano Core", "Cyano Core", "class-a", "09#S-W.sales-ai"),
  "S-W.sales-ai.3": entry("来源核对", "Source check", "approved", "09#S-W.sales-ai"),
  "S-W.sales-ai.4": entry("即时回答与销售材料", "Answers and sales material", "approved", "09#S-W.sales-ai"),
  "S-W.document-automation.1": entry("历史方案与项目参数", "Past proposals and parameters", "approved", "09#S-W.document-automation"),
  "S-W.document-automation.2": entry("Cyano Core", "Cyano Core", "class-a", "09#S-W.document-automation"),
  "S-W.document-automation.3": entry("完整性检查 · 人工复核", "Checks · human review", "approved", "09#S-W.document-automation"),
  "S-W.document-automation.4": entry("可编辑初稿", "Editable draft", "approved", "09#S-W.document-automation"),
  "S-W.knowledge-assistant.1": entry("内部文档与制度", "Internal documents and policies", "approved", "09#S-W.knowledge-assistant"),
  "S-W.knowledge-assistant.2": entry("Cyano Core", "Cyano Core", "class-a", "09#S-W.knowledge-assistant"),
  "S-W.knowledge-assistant.3": entry("权限与出处", "Permissions and sources", "approved", "09#S-W.knowledge-assistant"),
  "S-W.knowledge-assistant.4": entry("带出处的回答", "Cited answers", "approved", "09#S-W.knowledge-assistant"),
  "S-W.data-query.1": entry("自然语言提问", "Plain-language questions", "approved", "09#S-W.data-query"),
  "S-W.data-query.2": entry("Cyano Core", "Cyano Core", "class-a", "09#S-W.data-query"),
  "S-W.data-query.3": entry("查询可核对", "Reviewable query", "approved", "09#S-W.data-query"),
  "S-W.data-query.4": entry("表格与图表", "Tables and charts", "approved", "09#S-W.data-query"),

  // §3.2 Cases
  "C-1.proposal-generation": entry("过去 **2 天** → 现在 **15 分钟**", "Before **2 days** → After **15 minutes**", "approved", "09#C-1.proposal-generation"),
  "C-1.it-knowledge-assistant": entry("排队等 IT 回复 → **3 秒内**带出处回答", "Waiting for IT → cited answers in **under 3 seconds**", "approved", "09#C-1.it-knowledge-assistant"),
  "C-1.nl-data-query": entry("等 IT 导出数据一天以上 → **秒级**", "A day or more for an export → **seconds**", "approved", "09#C-1.nl-data-query"),
  "C-1.sales-consultant-ai": entry("等工程师回复 → **7×24** 即时回答", "Waiting for an engineer → **24/7** instant answers", "approved", "09#C-1.sales-consultant-ai"),
  "C-3.1": entry("打开在线 Demo 试用 ↗", "Try the live demo ↗", "approved", "09#C-3.1"),
  "C-3.2": entry("签署保密协议，由工程师演示完整系统", "Sign an NDA to see an engineer demonstrate the full system", "approved", "09#C-3.2"),
  "C-3.3": entry("索取完整案例集，中英文均可", "Request the full case study collection in English or Chinese", "approved", "09#C-3.3"),
  "C-3t": entry("你可以亲自验证", "See it for yourself", "approved", "09#C-3t"),
  "S9.b1": entry("收集资料", "Gather sources", "approved", "09#S9.b1"),
  "S9.b2": entry("起草", "Draft", "approved", "09#S9.b2"),
  "S9.b3": entry("核对参数", "Check parameters", "approved", "09#S9.b3"),
  "S9.b4": entry("修改", "Revise", "approved", "09#S9.b4"),

  // §3.3 Engagement
  "E-1": entry("用一周评估 AI 是否适合你的业务。", "Find out in one week whether AI fits your business.", "approved", "09#E-1"),
  "E-3": entry(
    "试点开始前，双方先约定验收标准。如果结果不达预期，可以补充资料、调整流程，也可以停止试点，再决定是否加大投入。",
    "Before the pilot, we agree on acceptance criteria. If results fall short, we can add source material, adjust the workflow or stop the pilot, then decide whether to invest further.",
    "approved",
    "09#E-3",
  ),
  "E-4r1": entry("首期周期", "Initial timeline", "approved", "09#E-4r1"),
  "E-4r1.1": entry("6–12 周", "6–12 weeks", "approved", "09#E-4r1"),
  "E-4r1.2": entry("2–6 周", "2–6 weeks", "approved", "09#E-4r1"),
  "E-4r1.3": entry("首批 2 周内", "First batch within 2 weeks", "approved", "09#E-4r1"),
  "E-4r2": entry("你需要准备", "What you prepare", "approved", "09#E-4r2"),
  "E-4r2.1": entry("明确的需求与验收人", "Clear requirements and an approver", "approved", "09#E-4r2"),
  "E-4r2.2": entry("一个小范围场景与工作样本", "One narrow use case and work samples", "approved", "09#E-4r2"),
  "E-4r2.3": entry("资料与质量标准", "Sources and quality standards", "approved", "09#E-4r2"),
  "E-4own.custom": entry("系统归你 · 维护范围合作时约定", "You own the system · Support scope agreed upfront", "approved", "09#E-4own.custom"),
  "E-4own.pilot": entry("先验证效果 · 维护范围合作时约定", "Check the results first · Support scope agreed upfront", "approved", "09#E-4own.pilot"),
  "E-4own.managed": entry("Cyano 运行并交付结果", "Cyano runs it and delivers results", "approved", "09#E-4own.managed"),
  "G-note": entry("典型安排；具体范围与时间以需求评估和双方协议为准。", "Typical schedule; scope and timing depend on the assessment and our agreement.", "approved", "09#G-note"),
  "E-5t": entry("常见问题", "Common questions", "approved", "09#E-5t"),
  "E-5q1": entry("先做试点，还是直接开发完整系统？", "Should we pilot first or build the full system?", "approved", "09#E-5q1"),
  "E-5q2": entry("数据很敏感，能放在我们自己的环境吗？", "Our data is sensitive. Can it stay in our own environment?", "approved", "09#E-5q2"),
  "E-5q3": entry("效果不好怎么办？", "What if it doesn't work well enough?", "approved", "09#E-5q3"),
  "E-5q4": entry("我们不想自己维护系统。", "We don't want to maintain a system ourselves.", "approved", "09#E-5q4"),
  "E-5q5": entry("上线以后出了问题找谁？", "Who do we call when something breaks after launch?", "approved", "09#E-5q5"),
  "E-5q6": entry("大概要花多少钱？", "Roughly what will it cost?", "approved", "09#E-5q6"),
  "E-5q7": entry("需求评估会给我们什么？", "What do we get from the assessment?", "approved", "09#E-5q7"),
  "E-5q8": entry("我们 IT 也能自己搭，为什么找你们？", "Our IT team could build this. Why work with you?", "approved", "09#E-5q8"),
  "E-5a8": entry(
    "可以自己搭。区别在于经验：Cyano 每位核心成员都参与过 AI 模型研发，团队已在 6 个行业交付企业 AI 系统，清楚模型在实际业务里容易在哪里出错，也知道资料、权限和审核该怎么接入。我们交付的也不只是软件，而是一整套服务：从需求评估、开发、培训到上线后的跟进，一直跟到系统在日常工作里真正用起来。",
    "You can. The difference is experience: every Cyano core member has worked on AI model R&D, and the team has delivered enterprise AI systems in six industries. We know where models tend to fail in real work, and how sources, permissions and review steps should be connected. And we deliver a full service, not just software: assessment, build, training and follow-through until the system is part of everyday work.",
    "approved",
    "09#E-5a8",
  ),
  "E-5q9": entry("员工不会用怎么办？", "What if our staff struggle to adopt it?", "approved", "09#E-5q9"),
  "E-5a9": entry(
    "我们提供配套培训，并分阶段上线：一次只改一个环节，等员工用熟、我们根据反馈打磨好，再推进下一步。不会一次性推翻现有的工作流程。",
    "Training is included, and we roll out in stages: one part of the workflow at a time. Once your team is comfortable with it and we have refined it from their feedback, we move to the next step. We don't overturn your existing workflow in one go.",
    "approved",
    "09#E-5a9",
  ),
  "D-20": entry(
    "支持私有化部署，数据不出你的环境；系统内置权限控制、日志审计与敏感信息拦截。",
    "Private deployment keeps data inside your environment. Every system includes access control, full audit logs and sensitive-data filtering.",
    "approved",
    "09#D-20",
  ),
  "S7.q1": entry("系统需要归你们所有吗？", "Do you need to own the system?", "approved", "09#S7.q1"),
  "S7.q2": entry("想先在小范围内验证效果吗？", "Want to test it on a small scale first?", "approved", "09#S7.q2"),
  "S7.q3": entry("希望由 Cyano 负责运行？", "Want Cyano to run it for you?", "approved", "09#S7.q3"),

  // §3.4 Technology
  "T-1": entry("到第 100 轮对话，响应仍在 200 毫秒以内。*", "Response time stays under 200 ms, even at turn 100.*", "approved", "09#T-1"),
  "T-1s": entry(
    "Cyano Core 按任务选择上下文：核心指令召回率 100%，Token 成本最多降低 40%。*",
    "Cyano Core selects context for each task: 100% recall of core instructions, up to 40% lower token cost.*",
    "approved",
    "09#T-1s",
  ),
  "T-2.1": entry("接入模型 ≠ 用上你的资料", "Connecting a model ≠ using your knowledge", "approved", "09#T-2.1"),
  "T-2.2": entry("能对话 ≠ 能上线", "Being able to chat ≠ being ready for production", "approved", "09#T-2.2"),
  "T-2.3": entry("换模型 ≠ 推倒重来", "Switching models ≠ starting over", "approved", "09#T-2.3"),
  "T-4q": entry("数据能不能不出我们的环境？", "Can our data stay inside our environment?", "approved", "09#T-4q"),
  "S3-m1": entry("发送完整历史", "Send full history", "approved", "09#S3-m1"),
  "S3-m2": entry("按任务选择上下文", "Select context per task", "approved", "09#S3-m2"),
  "S3-t1": entry("对话初期", "Early in the conversation", "approved", "09#S3-t1"),
  "S3-t2": entry("长对话", "Long conversation", "approved", "09#S3-t2"),
  "S3-l1": entry("用户", "User", "approved", "09#S3-l1"),
  "S3-l2": entry("助手", "Assistant", "approved", "09#S3-l2"),
  "S3-l3": entry("资料片段", "Source excerpt", "approved", "09#S3-l3"),
  "S3-l4": entry("关键指令", "Core instruction", "approved", "09#S3-l4"),
  "S11-l3": entry("来源不明", "No source", "approved", "09#S11-l3"),

  // §3.5 About
  "A-1.1": entry("需求、开发和上线后的维护，都由同一个资深核心团队负责。", "The same experienced core team handles requirements, development and post-launch support.", "approved", "09#A-1.1"),
  "A-1.2": entry("我们了解模型的工作原理，也熟悉企业系统的上线要求。", "We understand how models work and what it takes to put enterprise systems into use.", "approved", "09#A-1.2"),
  "A-1.3": entry("我们在大型组织工作过，熟悉其中的协作方式和系统上线要求。", "We have worked in large organisations and know how teams collaborate and what system rollouts require.", "approved", "09#A-1.3"),
  "A-2.1": entry("开发前先算账", "We do the math before we build", "approved", "09#A-2.1"),
  "A-2.2": entry("开工前先定验收标准", "We agree on acceptance criteria before work begins", "approved", "09#A-2.2"),
  "A-2.3": entry("关键结论都有出处", "Key statements link to their sources", "approved", "09#A-2.3"),
  "A-2.4": entry("上线后有人负责维护", "Someone is responsible for maintenance after launch", "approved", "09#A-2.4"),

  // §3.6 Contact & Closing
  "K-1": entry(
    "不用先写需求文档。告诉我们三件事：现在怎么做、要花多久、想改进什么。",
    "No requirements document needed. Tell us three things: how the work is done today, how long it takes, and what you want to improve.",
    "approved",
    "09#K-1",
  ),
  "K-2": entry("一份现在的工作样本 · 用到的资料或系统 · 由谁审核结果", "A sample of the work · the sources or systems it uses · who reviews the result", "approved", "09#K-2"),
  "K-2t": entry("带什么来", "What to bring", "approved", "09#K-2t"),
  "K-13i1": entry("1 个工作日内回复", "Reply within 1 business day", "approved", "09#K-13i1"),
  "K-13i2": entry("30–45 分钟沟通", "A 30–45 minute call", "approved", "09#K-13i2"),
  "K-13i3": entry("可签署保密协议", "NDA available", "approved", "09#K-13i3"),

  // §5.9 Gallery captions G.<slug>.1..n
  "G.sales-consultant-ai.1": entry("公开咨询助手", "Public assistant", "approved", "09#G.sales-consultant-ai"),
  "G.sales-consultant-ai.2": entry("内部访问入口", "Internal access portal", "approved", "09#G.sales-consultant-ai"),
  "G.sales-consultant-ai.3": entry("项目匹配", "Project matching", "approved", "09#G.sales-consultant-ai"),
  "G.sales-consultant-ai.4": entry("价格参考", "Price reference", "approved", "09#G.sales-consultant-ai"),
  "G.proposal-generation.1": entry("工作流与初稿", "Workflow and draft", "approved", "09#G.proposal-generation"),
  "G.proposal-generation.2": entry("开始生成初稿", "Starting a draft", "approved", "09#G.proposal-generation"),
  "G.it-knowledge-assistant.1": entry("总览", "Overview", "approved", "09#G.it-knowledge-assistant"),
  "G.it-knowledge-assistant.2": entry("知识文章", "Articles", "approved", "09#G.it-knowledge-assistant"),
  "G.it-knowledge-assistant.3": entry("文章详情", "Article detail", "approved", "09#G.it-knowledge-assistant"),
  "G.it-knowledge-assistant.4": entry("工单详情", "Ticket detail", "approved", "09#G.it-knowledge-assistant"),
  "G.it-knowledge-assistant.5": entry("数据分析", "Analytics", "approved", "09#G.it-knowledge-assistant"),
  "G.nl-data-query.1": entry("总览", "Overview", "approved", "09#G.nl-data-query"),
  "G.nl-data-query.2": entry("SQL 控制台", "SQL console", "approved", "09#G.nl-data-query"),
  "G.nl-data-query.3": entry("知识库", "Knowledge base", "approved", "09#G.nl-data-query"),
  "G.nl-data-query.4": entry("方案生成", "Proposal builder", "approved", "09#G.nl-data-query"),
  "G.nl-data-query.5": entry("审核记录", "Review log", "approved", "09#G.nl-data-query"),
  "G.nl-data-query.6": entry("模板库", "Template library", "approved", "09#G.nl-data-query"),
  "G.property-management.1": entry("登录", "Sign-in", "approved", "09#G.property-management"),
  "G.property-management.2": entry("消息", "Messages", "approved", "09#G.property-management"),
  "G.property-management.3": entry("工单对话", "Work-order chat", "approved", "09#G.property-management"),
  "G.property-management.4": entry("收支", "Finances", "approved", "09#G.property-management"),
  "G.property-management.5": entry("联系人", "Contacts", "approved", "09#G.property-management"),
  "G.property-management.6": entry("报告", "Reports", "approved", "09#G.property-management"),
  "G.writing-memory-engine.1": entry("启动", "Start-up", "approved", "09#G.writing-memory-engine"),
  "G.writing-memory-engine.2": entry("对话与分支切换", "Chat and branch switch", "approved", "09#G.writing-memory-engine"),
  "G.writing-memory-engine.3": entry("记忆抽屉", "Memory drawer", "approved", "09#G.writing-memory-engine"),
  "G.writing-memory-engine.4": entry("上下文记忆统计", "Context memory stats", "approved", "09#G.writing-memory-engine"),
  "G.writing-memory-engine.5": entry("笔记编辑与 AI 面板", "Note editor and AI panel", "approved", "09#G.writing-memory-engine"),
  "G.writing-memory-engine.6": entry("片段库", "Fragment library", "approved", "09#G.writing-memory-engine"),
  "G.writing-memory-engine.7": entry("归档检查", "Archive inspection", "approved", "09#G.writing-memory-engine"),
  "G.writing-memory-engine.8": entry("连接设置", "Connection settings", "approved", "09#G.writing-memory-engine"),

  // §5.11 S5 workflow artifacts
  "S5.sales-ai.1": entry("接入产品资料与项目记录", "Product and project records connected", "approved", "09#S5.sales-ai"),
  "S5.sales-ai.2": entry("按问题检索参数与相似项目", "Specs and comparable projects retrieved for the question", "approved", "09#S5.sales-ai"),
  "S5.sales-ai.3": entry("回答附带资料来源，供核对", "Answers cite their sources for checking", "approved", "09#S5.sales-ai"),
  "S5.sales-ai.4": entry("即时回答与客户专属材料", "Instant answers and material tailored to each customer", "approved", "09#S5.sales-ai"),
  "S5.document-automation.1": entry("接入历史方案、知识文档和项目参数", "Past proposals, knowledge documents and project parameters connected", "approved", "09#S5.document-automation"),
  "S5.document-automation.2": entry("检索相关段落，生成带引用的初稿", "Relevant passages retrieved; cited draft generated", "approved", "09#S5.document-automation"),
  "S5.document-automation.3": entry("执行 7 项完整性检查，交人工复核", "7 completeness checks, then human review", "approved", "09#S5.document-automation"),
  "S5.document-automation.4": entry("可编辑的方案初稿", "An editable proposal draft", "approved", "09#S5.document-automation"),
  "S5.knowledge-assistant.1": entry("按权限接入内部文档与制度", "Internal documents and policies connected with access controls", "approved", "09#S5.knowledge-assistant"),
  "S5.knowledge-assistant.2": entry("检索相关条目，生成带出处的回答", "Entries retrieved; cited answer generated", "approved", "09#S5.knowledge-assistant"),
  "S5.knowledge-assistant.3": entry("复杂问题转人工处理", "Complex cases handed to staff", "approved", "09#S5.knowledge-assistant"),
  "S5.knowledge-assistant.4": entry("员工直接获得带出处的答案", "Employees get cited answers", "approved", "09#S5.knowledge-assistant"),
  "S5.data-query.1": entry("连接业务数据库，配置可查询范围", "Databases connected with query scope set", "approved", "09#S5.data-query"),
  "S5.data-query.2": entry("把自然语言问题转换为查询", "Question converted into a query", "approved", "09#S5.data-query"),
  "S5.data-query.3": entry("查询语句与结果可供核对", "Query and results open for review", "approved", "09#S5.data-query"),
  "S5.data-query.4": entry("返回表格与图表", "Tables and charts returned", "approved", "09#S5.data-query"),

  // §6 Insight cover keywords
  "cover.why-chatgpt-is-not-a-knowledge-base": entry("知识库", "Knowledge base", "approved", "09#cover.why-chatgpt-is-not-a-knowledge-base"),
  "cover.proposal-draft-in-15-minutes": entry("15 分钟", "15 min", "approved", "09#cover.proposal-draft-in-15-minutes"),
  "cover.buy-pilot-or-managed": entry("定制 · 试点 · 托管", "Build · Pilot · Managed", "approved", "09#cover.buy-pilot-or-managed"),
  "cover.layers.1": entry("公开", "Public", "approved", "09#cover.layers"),
  "cover.layers.2": entry("部门", "Department", "approved", "09#cover.layers"),
  "cover.layers.3": entry("项目", "Project", "approved", "09#cover.layers"),
  "cover.layers.4": entry("个人", "Personal", "approved", "09#cover.layers"),

  // §7 CitationPeek S10
  "cite.case-proposal-15min": entry(
    "指生成可编辑、待人工复核的初稿所需时间，来自已交付项目。",
    "Time to an editable draft awaiting human review, in a delivered project.",
    "approved",
    "09#cite.case-proposal-15min",
  ),
  "cite.case-proposal-99": entry(
    "该项目的引用准确率，不代表所有生成内容的准确率。",
    "Citation accuracy in this project, not accuracy of all generated text.",
    "approved",
    "09#cite.case-proposal-99",
  ),
  "cite.case-wiki-80": entry(
    "该项目中常见工单由 AI 处理的比例；新项目另设验收标准。",
    "Share of routine tickets handled by AI in this project; new projects set their own targets.",
    "approved",
    "09#cite.case-wiki-80",
  ),
  "cite.case-wiki-3s": entry(
    "该项目的平均响应时间。",
    "Average response time in this project.",
    "approved",
    "09#cite.case-wiki-3s",
  ),
  "cite.core-200ms": entry(
    "100 轮长对话的内部基准测试结果，不是所有任务的端到端延迟承诺。",
    "Internal benchmark over a 100-turn conversation; not an end-to-end latency guarantee.",
    "approved",
    "09#cite.core-200ms",
  ),
  "cite.core-100": entry(
    "同一内部基准测试中核心指令的召回率。",
    "Core-instruction recall in the same internal benchmark.",
    "approved",
    "09#cite.core-100",
  ),
  "cite.core-40": entry(
    "同一内部基准测试中 Token 成本的最大降幅。",
    "Maximum token-cost reduction in the same internal benchmark.",
    "approved",
    "09#cite.core-40",
  ),
  "cite.team-6y": entry(
    "指每位核心成员的最低开发年限，不是公司成立年限。",
    "The minimum development experience of each core member, not company age.",
    "approved",
    "09#cite.team-6y",
  ),
};
fs.writeFileSync(path.join(v4Dir, "copy-new.json"), JSON.stringify(copyNew, null, 2) + "\n");

// 7. Mockup JSON files (§5.1–§5.8, §5.10)
const mk = (zh, en, status = "approved") => ({ zh, en, status });

fs.writeFileSync(
  path.join(mockupsDir, "proposal.json"),
  JSON.stringify(
    {
      docTitle: mk("方案初稿", "Proposal draft"),
      statusDraft: mk("草稿", "Draft"),
      statusReviewed: mk("已复核", "Reviewed"),
      h1: mk("一、项目背景", "1. Background"),
      s1: mk("本方案依据招标文件的技术要求，结合同类项目经验编写。", "This proposal follows the tender's technical requirements and draws on experience from similar projects."),
      h2: mk("二、技术方案", "2. Technical approach"),
      s2: mk("关键参数与已交付项目保持一致，差异项单独列出。", "Key parameters match delivered projects; differences are listed separately."),
      h3: mk("三、实施计划", "3. Delivery plan"),
      s3: mk("实施节点与验收标准见附件。", "Milestones and acceptance criteria are in the appendix."),
      checks: mk("完整性检查", "Completeness checks"),
      src1: mk("历史方案", "Past proposals"),
      src2: mk("知识文档", "Knowledge documents"),
      src3: mk("项目参数", "Project parameters"),
      input1: mk("历史方案", "Past proposals"),
      input2: mk("知识文档", "Knowledge documents"),
      input3: mk("项目参数", "Project parameters"),
      caption: mk("方案初稿界面示意：段落附带引用，完成完整性检查后交人工复核。", "Proposal draft interface: paragraphs include citations; completeness checks come before human review."),
    },
    null,
    2,
  ) + "\n",
);

fs.writeFileSync(
  path.join(mockupsDir, "wiki.json"),
  JSON.stringify(
    {
      question: mk("远程办公有哪些安全要求？", "What are the security rules for remote work?", "class-a"),
      answer: mk(
        "使用公司批准的 VPN 和设备，开启磁盘加密与自动锁屏。不要把业务资料同步到个人云盘；共享文件前核对接收人的访问权限。",
        "Use approved devices and VPN, enable disk encryption and auto-lock. Keep company files out of personal cloud drives and verify sharing permissions.",
        "class-a",
      ),
      src1: mk("远程办公制度", "Remote work policy"),
      src2: mk("信息安全手册", "Information security handbook"),
      perm: mk("按权限检索", "Search with access controls"),
      handoff: mk("转人工", "Contact IT"),
      statusDone: mk("已回答", "Answered"),
      input1: mk("员工提问", "Employee question"),
      caption: mk("IT 知识助手界面示意：回答附带出处，复杂问题转人工。", "IT assistant interface: cited answers, with complex cases handed to staff."),
    },
    null,
    2,
  ) + "\n",
);

fs.writeFileSync(
  path.join(mockupsDir, "sales.json"),
  JSON.stringify(
    {
      q: mk("这类设备适合我们的工况吗？", "Is this equipment right for our operating conditions?"),
      row1: mk("型号与参数已核对", "Model and specs checked"),
      row2: mk("工况条件已匹配", "Operating conditions matched"),
      row3: mk("已找到相似项目", "Comparable projects found"),
      drawer: mk("引用来源", "Sources"),
      src1: mk("产品资料", "Product documentation"),
      src2: mk("项目记录", "Project records"),
      similar: mk("相似项目", "Comparable project"),
      input1: mk("客户提问", "Customer question"),
      caption: mk("销售顾问界面示意：根据产品资料与项目记录回答客户问题。", "Sales advisor interface: answers customer questions using product documentation and project records."),
    },
    null,
    2,
  ) + "\n",
);

fs.writeFileSync(
  path.join(mockupsDir, "data.json"),
  JSON.stringify(
    {
      question: mk("本月各区域销售额是多少？", "Sales by region this month?", "class-a"),
      input1: mk("自然语言提问", "Plain-language question"),
      caption: mk("数据查询界面示意：一句话提问，生成查询并返回结果。演示数据。", "Data query interface: a plain-language question becomes a query that returns results. Demo data."),
    },
    null,
    2,
  ) + "\n",
);

fs.writeFileSync(
  path.join(mockupsDir, "property.json"),
  JSON.stringify(
    {
      tag1: mk("租赁", "Rent"),
      tag2: mk("维修", "Repairs"),
      tag3: mk("管理费用", "Management fees"),
      summary: mk("按房产查看", "By property"),
      caption: mk("物业管理界面示意：从日常沟通中提取费用，按房产汇总。", "Property interface: costs extracted from messages and grouped by property."),
    },
    null,
    2,
  ) + "\n",
);

fs.writeFileSync(
  path.join(mockupsDir, "writing.json"),
  JSON.stringify(
    {
      main: mk("主线", "Main"),
      branchA: mk("分支 A", "Branch A"),
      branchB: mk("分支 B", "Branch B"),
      mem1: mk("人物设定", "Character profiles"),
      mem2: mk("世界观", "World setting"),
      mem3: mk("剧情节点", "Plot points"),
      caption: mk("写作引擎界面示意：设定按需调用，分支互不干扰。", "Writing engine interface: retrieves story details as needed and keeps branches separate."),
    },
    null,
    2,
  ) + "\n",
);

fs.writeFileSync(
  path.join(mockupsDir, "stage.json"),
  JSON.stringify(
    {
      "stage.proposal.card1": mk("招标文件", "Tender document"),
      "stage.proposal.card2": mk("项目参数表", "Parameter sheet"),
      "stage.proposal.card3": mk("历史方案", "Past proposal"),
      "stage.wiki.card1": mk("远程办公制度", "Remote work policy"),
      "stage.wiki.card2": mk("工单记录", "Ticket history"),
      "stage.wiki.card3": mk("信息安全手册", "Security handbook"),
    },
    null,
    2,
  ) + "\n",
);

fs.writeFileSync(
  path.join(mockupsDir, "callouts.json"),
  JSON.stringify(
    {
      "sales-ai": [
        { x: 30, y: 22, zh: "客户问题", en: "Customer question", status: "approved" },
        { x: 45, y: 62, zh: "按产品资料回答", en: "Answered from product data", status: "approved" },
        { x: 86, y: 30, zh: "引用来源", en: "Sources", status: "approved" },
      ],
      "document-automation": [
        { x: 40, y: 32, zh: "带引用的段落", en: "Cited paragraph", status: "approved" },
        { x: 55, y: 88, zh: "完整性检查", en: "Completeness checks", status: "approved" },
        { x: 88, y: 10, zh: "复核状态", en: "Review status", status: "approved" },
      ],
      "knowledge-assistant": [
        { x: 45, y: 10, zh: "员工提问", en: "Employee question", status: "approved" },
        { x: 50, y: 55, zh: "带出处的回答", en: "Cited answer", status: "approved" },
        { x: 30, y: 90, zh: "转人工", en: "Hand-off", status: "approved" },
      ],
      "data-query": [
        { x: 30, y: 10, zh: "一句话提问", en: "Plain-language question", status: "approved" },
        { x: 50, y: 42, zh: "生成的查询", en: "Generated query", status: "approved" },
        { x: 50, y: 80, zh: "结果", en: "Results", status: "approved" },
      ],
    },
    null,
    2,
  ) + "\n",
);

fs.writeFileSync(
  path.join(mockupsDir, "inout.json"),
  JSON.stringify(
    {
      "inout.sales-ai.src1": mk("产品手册", "Product manual"),
      "inout.sales-ai.src2": mk("参数表", "Spec sheet"),
      "inout.sales-ai.src3": mk("项目记录", "Project records"),
      "inout.document-automation.src1": mk("招标文件", "Tender document"),
      "inout.document-automation.src2": mk("项目参数表", "Parameter sheet"),
      "inout.document-automation.src3": mk("历史方案", "Past proposal"),
      "inout.knowledge-assistant.src1": mk("内部制度", "Policies"),
      "inout.knowledge-assistant.src2": mk("操作手册", "How-to guides"),
      "inout.knowledge-assistant.src3": mk("工单记录", "Ticket history"),
      "inout.data-query.src1": mk("销售数据", "Sales data"),
      "inout.data-query.src2": mk("库存数据", "Inventory data"),
      "inout.data-query.src3": mk("提问", "Question"),
    },
    null,
    2,
  ) + "\n",
);

console.log(`Generated content/v4/{industries,solutions,team,site,insights,copy-overrides,copy-new}.json and 9 mockups/*.json files (${Object.keys(copyNew).length} copy-new entries).`);
