# Cyano 官网 v2 英文版审计报告（v1 → v2 对照 + 中英对等）

基线：v1 源码（`copy.json`、`lib/content.ts`、`components/pages.tsx|ui.tsx|interactive.tsx`、`articles.json`、`founders.json`）。v2：23 个 `en-*.txt`、23 个 `zh-*.txt`，加 `site/content/*-v2.json` 与 `site/components/*.tsx`。另看了 4 张案例主截图和 4 张 v2 页面截图做核对。全程只读，临时文件只写在 `scratchpad\audit-en\`。

## 1. 总体结论

**v2 英文不是"排版适配 + 约 15 条改写"，而是几乎整站重写。** 只有三篇文章正文（`articles.json`）和数据查询演示数据（`query-demo.json`）与 v1 逐字相同（脚本比对，中英文均无缺失段落）。其余页面的标题、导语、案例要素、FAQ、法律条款都被改写或替换，并新增了大量 v1 没有的事实性内容。

| 类别 | 数量（按第 2 节表格行计，约数） |
|---|---|
| 擅自改动（含义、强度、数字、限定词变化） | 26 |
| 遗漏 | 9 行，另有 2 行附带 |
| 错位 | 3 |
| 新增未批准事实声明 | 13 行，明细见第 3 节约 40 组 |
| 与事实表或规则冲突 | 7 |
| 站内不一致 | 14 组 |
| 中英不对等 | 约 30 处，见第 4 节 |
| 文本缺陷 | 7 |
| 其中"严重" | 8 |
| 仅措辞变化、含义未变（不列入发现） | 约 45–50 处（估算，如首屏 H1、各区块标题、收尾 CTA、About 第一段、隐私政策多数条款） |

没有发现的问题：`undefined`、占位符、内部编号外露、§9.3 明列的英文禁用词、云厂商或服务器位置、真名或前雇主名、英文页残留中文（只有语言切换"中文"）、日期格式错误（文章已是 `Nov 10, 2026`）。31 张截图全部在用，六个案例的周期和合作方式与 §6.7 一致。

**业务方最需要亲自看的 10 项**

1. **使用条款英文版删掉了"不构成合同承诺"**，中文版还在（#53）。
2. **新增保证性承诺**："client data is never used to train public models"，以及方案页多条 "No." 开头的绝对化安全回答，v1 和事实表都没有（#40、#16）。
3. **技术指标口径被改**："< 200ms Response latency" 变成 "Context retrieval & assembly latency"；交互曲线里的 ~2440ms、~181ms、-40% 是代码里的公式值，却带着"内部基准"星号，没有标"示意"（#35、#36）。
4. **六个案例页大量新编项目事实**：逐周交付里程碑、改造前耗时（"16 hrs" 及 4h/4h/6h/2h、"1–3 days"）、测试条件、"dozens of…"。`sources.md` 都没登记（#23、#29）。
5. **演示界面里的数字被写成客户事实**："over 1,200 internal Wiki articles"、"15% complex tickets routed to human"、"186 ms"、"Snowflake" 都出自截图里的演示数据（已看图确认）（#27、#31）。
6. **IT 案例标题变强**：v1 "AI handles 80% of routine inquiries, averaging under 3 seconds" 变成 "80% of routine IT tickets answered in under 3 seconds"，丢了"平均"，"handled" 变 "resolved"；中文版仍是"平均响应低于 3 秒"（#26）。
7. **单个案例的指标被写成通用方案能力**：方案流程图徽标 "99% cited"、"80% routine inquiries resolved"、"< 3s reply"、"Sub‑second"，方案 H1 "…in under 3 seconds"（#14、#9）。
8. **团队表述变化**："Former senior engineer at Fortune Global 500 companies"、"AI model inference optimization"、"post‑launch incident SLAs"、"All four founders stay directly involved…"；首页一句话写成 "Fortune Global 500 **engineering** experience"（#6、#44、#45）。
9. **承诺与报价口径变化**：定价 FAQ 的计价依据改了；新增 "agreed SLA"、"deployment & training"、"accuracy & time-savings report"、"Mutual NDA available"；"within 2 weeks" 变 "< 2 weeks"；多处 "as agreed"、"depending on scope" 限定词被删（#2、#41–43、#48）。
10. **被删内容与显眼缺陷**：services 页两张机会卡、方案页交付物 "Maintenance and ongoing iteration"、技术页三张难题卡、通用可靠性 FAQ 都没了；文档方案页 H1 以小写 "cited" 开头，句首缺词（#1、#13、#15、#16、#38）。

## 2. 逐页发现表

| # | 页面 | 类型 | 严重度 | v1 原文（位置） | v2 现文（位置） | 说明与建议 |
|---|---|---|---|---|---|---|
| 1 | 全站（services、document-automation、首页方案切换、导航下拉） | 文本缺陷 | 严重 | "Proposal drafts in as little as 15 minutes"（copy.json D.3.文档 Hero） | " cited proposal and report drafts in as little as 15 minutes"（solutions-v2.json document-automation.promise.en；en-services-document-automation.txt H1） | 句首有空格、小写、缺词，截图 en-solution-doc-d-01 已确认。同时加了 "cited" 和 "report"。建议恢复 v1 原句。 |
| 2 | engagement、home、文章 3、engagement 的 description | 擅改（数字限定） | 重要 | "First results within 2 weeks"（pages.tsx:382） | "< 2 weeks first batch · Ongoing"；"< 2w first batch"；"< 2 WKS"；"(< 2 weeks to first batch)" | 事实表是"2 周内"。"< 2 weeks" 更强，且与同页 "First batch within 2 weeks" 矛盾。统一为 within 2 weeks。 |
| 3 | 全站 | 不一致（C-06 未完成） | 一般 | "Full custom build / Pilot + ongoing service / Managed AI service"（pages.tsx:353-355） | "Full Custom Build"、"Full custom build"、"Scoped Pilot + Ongoing Service"、"Pilot + ongoing service"、"2–6 week scoped pilot"、"Managed AI Service"、"Managed AI workflow service"、"managed delivery" | 每种合作方式仍有 3 种以上写法，大小写也不一。 |
| 4 | home、cases | 擅改 + 不一致 | 一般 | "Professional Services & Research"、"Enterprise Services"（lib/content.ts industries.en） | 行业条与筛选："Consulting & Research"、"Enterprise IT & Services"；案例卡仍是 "Professional Services & Research"、"Enterprise Services" | 同一页两套行业名。建议用 v1 名称。 |
| 5 | home | 新增 + 错位 | 重要 | v1 无（v1 首屏为 "CLIENT PROJECT · DOCUMENT AUTOMATION … 2 days → 15 min"） | "LIVE SOURCE PROVENANCE / SRC 01 IT Access & VPN Policy §4.2 · Active version · Staff scope / SRC 02 Endpoint Troubleshooting SOP / SRC 03 Directory Role Clearance / Policy & citation checks 5/5"（site-copy-v2.json home.heroStage.en） | 换成英文界面系统符合 D-2。但三条来源和 "5/5" 是编的，截图里实际引用的是 "Setup VPN on Windows"，却标着 "Production UI" 和 "LIVE"。建议改成截图里真实存在的出处，或标明示意。 |
| 6 | home | 擅改（D-4 执行方式不同） | 重要 | 四个数字："Minimum engineering experience / Hands-on AI model R&D / Fortune Global 500 experience / Industries in production"（ui.tsx:145-148） | "100% of core team members have Fortune Global 500 engineering experience, hands-on AI model R&D backgrounds and 6+ years building software—with systems running across 6 industries."（home.credibilityLine） | 没用 D-4 指定的 "100% of core team from Fortune Global 500 companies"，也没有三个事实标签。新增的 "engineering" 超出事实表（只说"曾任职"；v1 CEO 简介是 "engineering and business roles"）。 |
| 7 | home | 擅改（含义与语气） | 重要 | "What does AI need to work in a business?"；"Review requirements — Generated content can be wrong, and work involving contracts or finances needs review. → Add validation rules, source citations and human approval to the workflow."（copy.json D.2.痛点 1–4） | "Four engineering gaps between a chat demo and production"；"Ad-hoc chat approach … Risk: Unacceptable errors in bids, contracts & finance"；"Outcome: Only active, role-authorized sources enter context"；"Outcome: Consistent team execution & sustained adoption" | 中性说明改成了贬通用聊天、给结果承诺的对比。G5 点名要保留的"承认生成内容可能出错"没了。四条全是新写的。 |
| 8 | home | 文本缺陷 + 规则（D-3） | 重要 | v1 首页无技术指标 | "Outcome: < 200ms* assembly at turn 100 & up to 40%* lower cost"（en-home.txt 第 123 行） | 星号在首页没有脚注，也没有测试条件。 |
| 9 | home、services、方案页 | 擅改（强度） | 重要 | "Find internal information with source citations"；"Use product documentation and project records to answer customer questions and prepare relevant recommendations and sales materials."；"Query inventory and sales in plain language"（copy.json D.3；content.ts solutions.intro） | "Permission‑aware internal answers with source citations in under 3 seconds"；"…answer prospect inquiries 24/7 and help field reps prepare tailored recommendations in seconds."；"Query inventory, sales and operations in plain language with read‑only SQL guardrails"；"…within seconds" | 案例级数字（<3s、24/7、秒级）升成了通用方案承诺。`sources.md` 写明这些不是所有项目的保证值。 |
| 10 | home、services、方案页 | 新增（替换原交付物） | 重要 | "Expert answers · Project matching · Sales content"；"Proposal drafts · Research reports · Validation"；"Knowledge Q&A · Source citations · Ticket routing"；"Plain-language queries · Reports · Trend analysis"（content.ts solutions.outputs） | 每条方案 4 项新交付物，如 "Split‑screen human review & Word/PDF export"、"Knowledge‑gap analytics & maintenance dashboard"、"5‑point read‑only SQL gate & PII masking"、"Public‑vs‑internal pricing access controls" | 16 项全是新承诺；"Research reports"、"Reports · Trend analysis" 消失。需业务方确认是否每个项目都交付这些。 |
| 11 | home、about | 擅改 | 重要 | 标签 "Strategy · Partnerships · AI commercialization"、"LLM engineering · Context architecture · Integration"、"Delivery · Operations · Quality"、"Requirements · Product design · Solutions"；motto 如 "Leads project assessment, client partnerships and business planning."（founders.json） | "ROI modeling · Scope & acceptance · Client partnerships"、"Context valuation · ACL retrieval · Multi‑model routing"、"Private Docker delivery · Regression evals · Production SRE"、"Workflow diagnosis · Human‑in‑the‑loop UX · SOP codification"；另加 "Specialty: …" 和 "Owns: …" | G-21 允许每人加一条专长，但原标签和 motto 被整体替换，内容需本人确认。 |
| 12 | home | 遗漏（计划允许合并） | 一般 | "We first examine how a task is done… After launch, we maintain the knowledge base, address user feedback and update workflows as the business changes."（D.2.宣言段 2）；"CUSTOM DEVELOPMENT · PILOTS · MANAGED SERVICES"（pages.tsx:138） | 首页只剩 "We map where your documents live, how tasks move and who signs off—then wire retrieval, validation and human checkpoints into daily work." | "WHO WE ARE" 段按计划 §6.1 删除。上线后维护那一句在首页没有对应内容了。 |
| 13 | services | 遗漏 | 重要 | "01 Expand customer services — Use product documentation and project experience to answer questions and prepare recommendations for each customer." / "02 Reduce repetitive work — Automate recurring document preparation, data queries and support questions…"（pages.tsx:420-434） | 无（en-services.txt、zh-services.txt 都没有） | 两张机会卡整块删除，中英文都删了，计划里没有授权。 |
| 14 | services、4 个方案页、home | 错位（案例指标挂到通用方案） | 严重 | 通用四步："Connect sources / Retrieve & generate / Validate & review / Deliver results"（ui.tsx:320-340） | 徽标 "99% cited"、"2d → 15m"、"< 3s reply"、"Sub‑second"、"Live sync"；步骤标题 "80% routine inquiries resolved"、"15‑min editable proposal draft" | 99%、80%、15 分钟是单个案例的数字。"99% cited" 把"引用准确率 99%"写成了"99% 有引用"。"Sub‑second" 没有任何依据（案例只写 "Seconds"，中文是"秒级检索"）。 |
| 15 | 4 个方案页 | 遗漏 | 重要 | "What you receive … Maintenance and ongoing iteration"（pages.tsx:575） | "What your team receives" 只列 4 项，没有维护 | 交付物里的"维护与持续迭代"在四个方案页中英文都删了。 |
| 16 | 4 个方案页 | 遗漏 + 新增 | 重要 | "Can it connect to our existing systems? — Yes. The assessment covers data sources, interfaces and permissions…"；"How do you make results reliable? — We use your own sources, citations, validation rules and human review. Uncertain tasks return to a business owner."（pages.tsx:606-623） | 每页 3 条新 FAQ，如 "No. Public and internal portals query physically separated index scopes."；"No. Connections use database‑enforced read‑only credentials, and our AST policy gate blocks any non‑SELECT statement…"；"Superseded versions are archived immediately…" | v1 两条通用 FAQ 被删。新答案是绝对化技术承诺，接近 §3.6"效果保证"红线，需技术负责人逐条确认。 |
| 17 | 4 个方案页 | 擅改（限定词） | 重要 | "A pilot typically delivers a first working version in 2–6 weeks, depending on scope and data access."（D.3.合作提示） | "Most teams start with one flagship product line… reaching a working version for field testing in 2–6 weeks."；"…delivering a working pilot in 2–6 weeks without warehouse refactoring." | "typically … depending on scope and data access" 被删，读起来像承诺。 |
| 18 | 4 个方案页 | 新增 + 数字误用 | 重要 | 只有三条标题，如 "Employees ask the same questions repeatedly"（pages.tsx:509-512） | "Today: 1–3 day engineering wait"、"Today: Half a day just locating files"、"Today: Up to 80% repetitive tickets"、"…asked dozens of times a week"、"Today: 1–2 day reporting lag"、"spending half of every review meeting reconciling totals" | 计划（V-08、G-16）允许补一句场景，但这些"现状"数字没有依据。"80%" 在这里指"重复工单占比"，在案例里指"自动处理比例"，同一数字两种含义。 |
| 19 | 4 个方案页 | 遗漏 | 一般 | 页顶结果栏显示关联案例 3 个数字（pages.tsx:531-537） | 无；案例卡只显示第 1 个数字 | "99% Citation accuracy"、"7 Completeness checks" 等不再出现在方案页。 |
| 20 | services/data-query | 擅改 | 一般 | "Business users cannot write SQL"（pages.tsx:512） | "Direct database access is too risky" | 第三个痛点换了主题。 |
| 21 | knowledge-assistant、data-query、IT 与数据案例页 | 新增（演示内数据） | 一般 | "Source: IT Service Policy · Access & Operations §n"；"Below are sample data and a read-only query for this question…"；第 6 问 "I need help with something else"（interactive.tsx:762、829、940） | "Bound source: Enterprise IT Security & Access SOP v3.4 §1 · Caller ACL verified"；"Metric definitions matched and 5-gate read-only SQL check passed."；"I have an exception not covered by policy" | 预置演示里说"已通过鉴权"、"5 重校验通过"，"v3.4" 是编的。免责声明还在。6 个问题和答案全部改写。 |
| 22 | cases | 擅改 | 一般 | "Six client projects: systems and results"；"Client information and data in the screenshots have been anonymized."（D.5、D.1.保密说明） | "Six client AI systems running in production"；"Screenshots are anonymized per client confidentiality agreements." | 新增"六个都在生产运行"和"按客户保密协议"两个说法。"Client project" 标签不再出现。D-6 分组已执行。 |
| 23 | 6 个案例页 | 新增（成组） | 严重 | v1 无。案例页只有画像、3 个数字、前后各一句、成果一句（content.ts englishCases） | 每页新增：背景段、3 条挑战、"Why off-the-shelf chat tools could not handle this"、3 条技术亮点、4 条界面标注、前后耗时轨、4 步流程与"Deliverable"、4 段里程碑（如 "Weeks 3–5 · Dual‑portal build"、"Weeks 7–8 · Historical backtesting"） | 总周期与 §6.7 一致，但逐周拆分和"做了什么"是新编的项目事实，`sources.md` 没有登记（违反 R5）。G-12、G-14、G-15 只授权了图的形式。需业务方逐案确认或删掉细节。 |
| 24 | IT、数据、写作案例页 | 遗漏 | 一般 | 每个案例页两处："…Client information and data in the screenshots have been anonymized. An engineer can demonstrate the full system under NDA."（pages.tsx:655、722）；"Company knowledge · Workflow orchestration · Access & audit"（:771） | 只有带公开 Demo 的 3 个案例显示 "Public sandboxes run on anonymized sample data…"；另 3 个没有任何脱敏或保密说明 | 建议 6 个案例页都保留截图已脱敏的说明。 |
| 25 | cases/sales-consultant-ai | 擅改 | 一般 | "Round-the-clock answers from product and project records"；"An engineering equipment company with complex product lines and technical specifications."；"1:1 — Personalized sales content"（englishCases[0]） | "Round‑the‑clock engineering answers from product and plant records"；"An industrial powder‑processing equipment manufacturer with complex machinery lines and global technical inquiries."；"1‑to‑1 — Tailored sales & pricing briefs"；"1–3 days waiting on engineering"；标注 "(66.8 μm)"、"T2 security clearance" | 画像更具体（中文 v1 已有"粉体"）。"pricing briefs"、"1–3 days"、"waited days" 是新增。66.8 μm、T2 出自截图，属客户工艺参数，请确认可否写成正文。 |
| 26 | cases/it-knowledge-assistant，及 home、cases、文章 1 的卡片 | 擅改（强度） | 严重 | "AI handles 80% of routine inquiries, averaging under 3 seconds"；"80% — Routine tickets handled"；"AI now handles 80% of routine inquiries…"（englishCases[2]） | "80% of routine IT tickets answered in under 3 seconds"；"80% — Routine inquiries resolved — Share of recurring Tier‑1 IT questions resolved without human queue"；"AI now resolves 80% of routine IT inquiries with direct Wiki citations…" | 丢了 "averaging"，"handled" 变 "resolved"。`sources.md` 的口径是"自动拦截比例"和"平均值"。中文 v2 仍是"平均响应低于 3 秒"。 |
| 27 | cases/it-knowledge-assistant | 错位 + 新增 | 重要 | "Employees queued for IT support…" / "Cited answers in seconds, with complex requests routed to a human." | "Despite maintaining over 1,200 internal Wiki articles…"；"Employee RBAC + 1,200+ SOPs"；"15% complex tickets routed to human"；"Hours in ticket queue"；"End‑to‑end including permission check, retrieval and citation" | 1,200+ 和 15% 来自演示界面截图（已看图确认），被写成客户事实。"Hours" 和 <3s 的口径说明没有依据。 |
| 28 | IT 案例 与 knowledge-assistant | 不一致 | 一般 | v1 无 | 案例页 "Monthly tuning of SOP coverage and routing thresholds"；方案页 "Analytics guide weekly SOP updates" | 维护频率月与周矛盾；中文是"每周未命中问题报表"。 |
| 29 | cases/proposal-generation | 新增 | 重要 | "Two days of drafting, followed by repeated manual checks."；"99% — Citation accuracy"；"A professional consulting and research firm producing high volumes of evidence-based proposals."（englishCases[1]） | "~2 working days (16 hrs)"；"Archive & policy search · 4h / Parameter cross‑check · 4h / Manual section drafting · 6h / Manual checklist review · 2h"；"99% — Project citation accuracy — Measured on project acceptance set prior to human sign‑off"；"Analysts prepare dozens of client proposals and investment memos each month."；"A consulting and investment research firm … and due‑diligence memos." | 工时拆分、"dozens"、99% 的测试条件都不在 `sources.md`。D-3 要求测试条件取自 sources 并由技术负责人确认。待确认。 |
| 30 | cases/nl-data-query | 擅改（案例定稿要素） | 重要 | 第 3 个数字 "Plain language — Inventory & sales questions"（englishCases[3]；§6.7"自然语言"） | "5 gates — Automated SQL policy checks — SELECT‑only, no DDL, PII masking, LIMIT enforcement and audit metadata" | §6.7 定稿的三个数字被换掉一个，中文也换成了"5 重"。 |
| 31 | cases/nl-data-query | 新增 + 与事实表不符 | 重要 | "Seconds — To a query result"；"A retail and supply chain business with a large SKU catalog and extensive inventory and sales data." | "Seconds — Policy‑checked query execution — Validated in read‑only sandbox (186 ms on benchmark vendor query)"；"Read‑only PostgreSQL, MySQL and Snowflake connectors with table‑level permission mapping."；"1–2 days waiting for IT export" | Snowflake 不在事实表兼容清单里，只在英文出现。186 ms 是演示截图上的数字，"benchmark vendor query" 是新编说法；中文带了"视数据库规模而定"的限定，英文没有。 |
| 32 | cases/property-management、cases | 擅改（系统名，R9） | 重要 | "AlphaHouse Property Management"（englishCases[4].system） | "AlphaHouse Property Ledger"；description 又写 "AlphaHouse property management system"；分组副题 "Property Ledger OCR · Long-Form Memory Engine" | R9 要求沿用系统名，中文仍是"房东记账与管理工具"。恢复 v1 名称。 |
| 33 | cases/property-management | 擅改 + 新增 | 一般 | "Automatic — Expense statements / Connected — Messages & payments / Per property — Performance per property"；"…Owners can review income, expenses and investment performance for each property." | "Automated — Receipt & work‑order extraction / Unified — Messages, work orders & ledger / Per‑unit — Property P&L and annual reports"；"Across dozens of units…"；"Days of manual monthly reconciliation"；成果句不再有 "investment performance" | "dozens of units"（中文"多套"）是数量夸大。OCR 是新能力表述，截图未逐张核对，待确认。同页账单类型有 "property‑tax and HOA bills" 和 "tax & utility bills" 两种写法。 |
| 34 | cases/writing-memory-engine | 擅改 | 一般 | "A content production team creating long-form fiction and scripts."；"Writers manage character settings and story branches, with relevant records retrieved for each generation." | "A serialized fiction and scriptwriting studio developing multi‑arc narratives spanning hundreds of thousands to over a million words."；"…keeping character rules and foreshadowed clues consistent across long‑form serials." | 画像新增作品体量；成果从"可管理"变成"保持一致"。`sources.md` 写明百万字是设计容量。 |
| 35 | technology（及 home） | 擅改 + 与事实表不符 | 严重 | "< 200ms* — response latency, as fast at turn 100 as at turn 1"（D.6.指标 1；pages.tsx:910 "Response latency"） | "< 200ms* — Context retrieval & assembly latency — Consistent budget speed at turn 100 as at turn 1" | 指标从"响应延迟"改成"上下文检索与拼装延迟"。事实表和 `sources.md` 写的是"响应延迟 <200ms（100 轮基准）"。可能更准确，但 D-3 只授权加测试条件，没授权改口径。"Consistent budget speed…" 也不通顺。待技术负责人确认。10× 已按 D-3 移除。 |
| 36 | technology | 新增 | 严重 | v1 只有 4 个静态数字和脚注 "* Based on Cyano internal benchmarks." | "Raw history: ~2440ms / Cyano Core: ~181ms* (-40% tok)"，可拖动 Turn 1–100 | 数值来自 `TechVisuals.tsx:227-229` 的公式（raw=240+27.5×轮数，第 100 轮约 2990ms；core 封顶约 181ms），不是测量值。计划 G-10 要求标"示意"，页面没标，还带基准星号。 |
| 37 | technology | 新增 | 重要 | 四条进度条标签 "Core instructions, preserved / Structured key states / Condensed reasoning records / Fault-cause records"（pages.tsx:880-883） | "TIER 01 · 24% / 32% / 26% / 18%"；"~62% budget used · 100% instruction retention"；审计记录 "acl_verified=true · active_docs=14 · denied_scopes=2"、"budget_used=3,840/8,192 tok · assembly_ms=142ms · core_rules=100%"、"playbook=proposal_v3 · checks_passed=7/7"、"citations_bound=9 · dlp_flags=0 · trace_id=cy_98f4a2" | 全部没有依据。英文标 "AUDIT TRACE RECORD"，中文标"审计日志记录样例"，英文缺"样例"。 |
| 38 | technology | 遗漏 | 一般 | "API costs — Resending the full history increases costs as a conversation grows." / "Response time — Longer inputs can increase the wait before the model begins responding." / "Missed instructions — A model may overlook important instructions within a large body of material."（D.6.难题 1–3） | 无（中英文都没有） | 三张难题卡被删。区块标题从 "Select context for each task to control cost and latency in long conversations." 变成 "Selective four-tier context keeps 100-turn workflows fast and predictable"，更强。 |
| 39 | technology | 擅改 | 一般 | "Ingestion — Connects PDFs, databases and APIs into a permission-aware, continuously updated index."；"Execution — … validation rules and exception handling."（D.6.第 1、3 层）；兼容标签 "Llama"、"ERP / CRM"、"PDF / Office"（pages.tsx:931-945） | "Connects PDFs (including OCR & complex tables), SQL databases and wikis…"；"…keeping latency flat and costs predictable"；"Meta Llama (Private)"、"ERP / CRM REST APIs"、"Markdown / Internal Wiki"、"Excel / CSV ledgers"、"Foundation models (mix or switch without rebuilding workflows)" | "APIs"、"continuously updated"、"exception handling" 被删；新增 OCR、REST API、Markdown/CSV、"无需重建即可切换模型"。分三组和 Qwen/Lark 英文名符合 G-11。 |
| 40 | engagement FAQ 5 | 新增 + 规则（§3.6） | 严重 | "Private deployment keeps data inside your environment. Every system includes access control, full audit logs and sensitive-data filtering."（D.4 数据安全） | "…Every system enforces pre-retrieval role permissions, sensitive-field filtering and complete audit logging—and client data is never used to train public models." | 新增保证性承诺，中文同样新增"绝不用于训练公共模型"。v1 和事实表都没有，需业务与法务确认。 |
| 41 | engagement FAQ 4 | 擅改（报价口径） | 重要 | "How do we get a tailored proposal? — Talk to us. We tailor the recommendation and quote to your business value, technical complexity, scale and timeline." | "How do you scope and price a project? — Pricing reflects workflow complexity, system integrations, deployment environment and support scope. Following our initial 30–45 minute call, we provide an itemized proposal with clear deliverables." | 计价依据变了（"business value"、"scale and timeline" 没了），新增"首次沟通后给逐项报价"的流程承诺。 |
| 42 | engagement 对比表 | 擅改 + 新增 | 重要 | "A complete system you own / Maintenance with ongoing iteration / Teams that need their own system"；"Batch outputs reviewed by people / Fully run by Cyano"（pages.tsx:1050-1062） | "Complete web/enterprise app, playbooks, deployment & training"；"Includes baseline maintenance; new features scoped on demand"；"Scoped working workflow + accuracy & time-savings report"；"Service access during pilot; convertible into an owned custom build"；"Operated end-to-end by Cyano with agreed SLA and QA" | 补到 5 行符合 G-18。但定制的维护范围从"含持续迭代"收窄为"基础维护"，并新增培训、评测报告、可转定制、SLA 等承诺。 |
| 43 | engagement 流程与部署 | 擅改 + 遗漏（限定词） | 重要 | "Deliver working tools, workflows or batch results on the agreed schedule."；"…update sources and features as agreed."；"Agree scope, engagement, acceptance criteria and price."；"…adapt them to local compute, with requirements agreed before the project starts."（pages.tsx:1123-1127；D.4.私有化部署） | "Execute source indexing, playbook orchestration, historical benchmark QA and environment deployment."；"…update indexes, rules and models as your business evolves."；"Lock down delivery model, data boundaries, evaluation criteria, human gates and transparent pricing."；"We deliver containerized configurations adapted to your security and compute rules." | "on the agreed schedule"、"as agreed"、"requirements agreed before the project starts" 三处边界限定被删；新增 "transparent pricing"。"怎么选"一段换成选择器符合 G-17。 |
| 44 | about | 擅改 | 重要 | "…The team handles requirements, development and post-launch maintenance."（D.7.我们是谁 2） | "…All four founders stay directly involved from assessment through production maintenance." | 从"团队负责"变成"四位创始人全程亲自参与"，是新的服务承诺（中文同改）。 |
| 45 | about | 擅改 + 新增 | 重要 | CTO："Previously worked at Fortune Global 500 companies… Leads Cyano Core architecture, including long-context management, retrieval and agent orchestration."；工程："…experience in AI model R&D and large-scale systems. Leads development, testing and operations, including incident handling and releases."（founders.json） | "Former senior engineer at Fortune Global 500 companies…designing priority‑weighted context management, permission‑scoped retrieval and deterministic SQL/SOP guardrails."；"…AI model inference optimization. Turns complex AI pipelines into testable, observable services with Docker on‑prem packaging and post‑launch incident SLAs." | "senior engineer" 是新编的职级，中文是"核心技术团队"。"AI model R&D" 变成 "inference optimization"，窄于事实表。"incident SLAs" 是新承诺。CEO 简介里 "strategy and client partnerships" 也没了。四人简介都被重写。 |
| 46 | about | 擅改 | 一般 | "How we work"；"Assess costs and benefits — Review workload, source quality and expected improvements before committing to development."（D.7.原则） | "Four commitments on every engagement"；"…before writing code—and advise honestly when a build is premature."；"Establish evaluation sets from real historical work…"；"…every deployment includes a clear process for source updates, regression checks and user feedback." | "原则"升级成"承诺"并加了具体做法。数字栏 "6 sectors" 与别处 "6 industries" 用词不一。 |
| 47 | contact | 擅改 + 不一致 | 重要 | "A senior consultant will review your inquiry and follow up about source material, timing and project requirements."（D.8.谁会回复你） | "Our Head of Product & Solutions and technical leads review every submission directly and reply within one business day."；同页 description 和提交成功提示仍是 "A senior consultant will reply within one business day."（ContactForm.tsx:167） | 回复人说法变了，且同一页两种说法。 |
| 48 | contact | 新增 | 一般 | "Your information is only used to respond and provide services."（interactive.tsx:741）；"Check technical fit — data access, permissions, private deployment, model choice and maintenance."；"Within a week, we provide an assessment and a recommended way to proceed." | "Used strictly to respond to your inquiry. Mutual NDA available prior to sharing sensitive files."；"…directly with our technical lead."；"Deliver a written feasibility assessment and recommended model within 1 week." | 新增"可签双向 NDA"、"书面"评估、"直接与技术负责人"；"model choice" 被删。表单字段齐全，T-11 的句首小写已修。 |
| 49 | 3 篇文章 | 新增 + 规则（§3.6、V-18） | 重要 | v1 无 | 带引号的引文，如 "“Cutting two days of assembly down to 15 minutes comes from staged engineering…” — Lesson from the consulting & research proposal workflow"（insights-v2.json pullQuote） | 正文之外新加带引号的话并署"来自某项目"。中文署"来自咨询与投研机构标书项目的交付总结"，更容易被读成客户原话。第 1 轮 V-18 刚要求去掉引号样式。建议去引号或改署"Cyano 团队"。 |
| 50 | insights、3 篇文章 | 新增 + 不一致 | 一般 | 列表页只有分类、日期、作者、标题 | "6 min read"；摘要；每篇 2 张图解，如 "Within one week of the call, we return a written assessment, recommended model and clear acceptance criteria."、"< 2 WKS Managed AI service"；导语 "…7 QA gates" | 图解说"一周内给验收标准"，与联系页第 3 步（决定推进后才给）不一致。"7 QA gates"、"7 completeness checks"、"7‑point"、"7 QA checks" 四种写法。日期格式已改好。 |
| 51 | 3 篇文章 | 遗漏 | 一般 | "Discuss a similar project — Bring your current process and a work sample to discuss scope, costs and implementation requirements."（pages.tsx:1414-1421） | 换成 "RELATED PRODUCTION SYSTEM" 卡片 | 文末引导语删除，影响小。 |
| 52 | privacy | 擅改（法律条款） | 重要 | "Inquiry information is generally retained for no more than 24 months…"；"We use encrypted transmission and access controls…"；"Policy updates will appear on this page."（pages.tsx:1494-1514） | "Inquiry records are retained for no longer than 24 months…"；"Data is protected with TLS encryption in transit and role-restricted access."；"Any material updates to this policy will be posted on this page."；"privacy-preserving site analytics"；"We never sell…" | "generally" 被删，变成硬承诺（中文仍是"通常"）。新增 TLS 这一具体技术参数。更新公示范围缩到"重大更新"。需法务确认。 |
| 53 | terms | 遗漏（法律条款） | 严重 | "Information is provided for reference and is not a contractual commitment. Scope, delivery requirements and pricing are governed by the parties’ agreement."（pages.tsx:1520） | "This website presents … for informational purposes. Project scope, acceptance criteria, SLAs and pricing are governed solely by written client agreements." | "不构成合同承诺"在英文被删，中文保留"不构成直接合同承诺"。新增 "SLAs"。 |
| 54 | terms | 擅改 + 遗漏 + 新增 | 重要 | "We aim for accuracy but do not warrant that all information is complete or current at all times."；"External links — We may link to third-party services and project experiences. Their operators control those sites, which have their own terms and privacy policies."；"…updates will be published here." | "While we keep material accurate, content is provided without implied warranties."；"Public demo sandboxes — … do not upload confidential business documents or personal data to public demo links."；"Updated versions take effect upon publication on this page." | 免责句变成断言"我们保持准确"。第三方链接免责条款被删（中英都删）。新增"发布即生效"（中文没有）。 |

**站内不一致（英文，第 6 类汇总）**

1. IT 案例 80% 有五种说法："handled"（首页结果带）、"resolved"（案例数字与卡片）、"answered in under 3 seconds"（标题）、"ticket deflection"（图注）、"Up to 80% repetitive tickets"（方案页，含义不同）。
2. "< 3s" 在案例里是 "Average response time"，在标题和方案 H1 里是非平均的 "in under 3 seconds"。
3. 托管首批："< 2 weeks"、"within 2 weeks"、"within two weeks"。
4. 合作方式名称（#3）。
5. 行业名（#4）。
6. AlphaHouse 系统名（#32）。
7. 知识维护频率周与月（#28）。
8. 联系页回复人（#47）。
9. 一周内交付什么：只有评估，还是含验收标准（#50）。
10. 标书检查项和 SQL 门禁的叫法各四种（"5 gates"、"5‑point"、"5‑gate policy check"、"5 SQL policy gates"）。
11. 销售检索速度："Seconds"（案例）与 "Sub‑second"（方案）。
12. 延迟数字：指标 "< 200ms"、曲线 "~181ms"、审计记录 "assembly_ms=142ms"。
13. 私有化部署名称："Private Environment Deployment"、"Docker private deployment"、"private deployment"。
14. 案例的称呼仍有 5 种以上："Case Studies"、"client systems"、"production case"、"Delivered client systems"、"Systems in production"。

**其他文本缺陷**

- 首页结果带 "2 days → 15 / min" 在数字和单位之间折行（截图 en-home-d-02）。
- "Note: Client interface shown in production Chinese as deployed for the client’s working team…" 表达生硬。
- "Consistent budget speed at turn 100 as at turn 1" 不通顺。
- 法律页日期 "November 12, 2026" 与文章 "Nov 10, 2026" 两种格式。
- 首屏检查计数是 5/5，内容文件里只有 4 条检查项（`home.heroStage.en.checks`），是否渲染待确认。

## 3. 新增事实声明完整表

依据列：sources = `content/sources.md`；事实表 = §0.3；截图 = 案例截图里可见（只核对了 4 张主图）；无 = 没找到依据。

| 新增声明 | 出现页面 | 依据 |
|---|---|---|
| 首屏 "SRC 01 IT Access & VPN Policy §4.2"、"SRC 02 Endpoint Troubleshooting SOP"、"SRC 03 Directory Role Clearance"、"Policy & citation checks 5/5"、"LIVE SOURCE PROVENANCE" | home | 无，且与截图里的实际引用不符 |
| "Handled automatically with exact SOP citations · 24/7 support"；"Context handoff built in"；"Read-only verified queries" | home | 部分（80%、<3s、24/7 在 sources；其余无） |
| "Fortune Global 500 **engineering** experience" | home | 事实表只写"曾任职" |
| 通用方案层面的 "24/7"、"in seconds"、"in under 3 seconds"、"within seconds" | home、services、方案页 | sources 只到案例级，并注明不是保证值 |
| 流程徽标 "Sub‑second"、"99% cited"、"< 3s reply"、"80% routine inquiries resolved"、"2d → 15m"、"Live sync"、"Role‑tiered" | home、services、方案页 | "Sub‑second"、"Live sync" 无；其余属案例数字被泛化 |
| 16 项交付物（如 "Word/PDF export"、"Knowledge‑gap analytics & maintenance dashboard"、"5‑point read‑only SQL gate & PII masking"） | home、services、方案页 | 无（部分功能截图可见） |
| 12 项 "Key engineering capabilities"（如 "AST‑level read‑only sandbox"、"Version‑aware indexing…Automatically retires superseded policies"、"Dual‑tier clearance gates"） | 4 个方案页 | 无 |
| 痛点现状："1–3 day engineering wait"、"After‑hours lead drop‑off"、"Hours per custom brief"、"Half a day just locating files"、"Up to 80% repetitive tickets"、"dozens of times a week"、"1–2 day reporting lag"、"half of every review meeting" | 4 个方案页 | 无（"~2 days per first draft" 有 v1 依据） |
| 12 条方案 FAQ（"physically separated index scopes"、"archived immediately"、"database‑enforced read‑only credentials"、"5–10 tables"、"embeddings and query logs entirely inside your environment"、"read‑only connectors"） | 4 个方案页 | 私有化 Docker 在事实表；其余无 |
| "full custom builds take 6–12 weeks depending on integrations" | 4 个方案页 | 事实表 |
| "Six client AI systems running in production"；"anonymized per client confidentiality agreements" | cases | v1 有 "industries with systems in production"；"保密协议"无 |
| 测试条件："Measured on project acceptance set prior to human sign‑off"（99%）；"End‑to‑end including permission check, retrieval and citation"（<3s）；"Share of recurring Tier‑1 IT questions resolved without human queue"（80%） | 案例页 | sources 没有这些口径，待技术负责人确认 |
| "186 ms on benchmark vendor query"；"Returns tabular results in 186 ms" | nl-data-query | 截图（演示界面）；"benchmark" 说法无 |
| "over 1,200 internal Wiki articles"、"1,200+ SOPs"、"15% complex tickets routed to human"、"15% escalation split" | it-knowledge-assistant，及 home、cases 图注 | 截图（演示界面数据），sources 无 |
| "Snowflake"、"ERP PostgreSQL, warehouse and CRM MySQL" | nl-data-query | 截图；Snowflake 不在事实表兼容清单 |
| "66.8 μm"、"P12 database"、"T2 security clearance"、"Jet Mill Line"、"LFP" | sales-consultant-ai，及卡片图注 | 截图；属客户参数，待确认可否入正文 |
| 改造前耗时："1–3 days waiting on engineering"、"~2 working days (16 hrs)" 及 4h/4h/6h/2h、"Hours in ticket queue"、"1–2 days waiting for IT export"、"Days of manual monthly reconciliation" | 6 个案例页 | "2 天"、"a day or longer" 有 v1 依据；其余无 |
| 逐周里程碑 24 条（含 "monthly plant‑record updates"、"Historical backtesting"、"Reconciliation testing"、"Long‑arc stress testing"） | 6 个案例页 | 总周期在 §6.7 和 sources；拆分与内容无 |
| 背景与挑战 24 条（"dozens of client proposals…each month"、"Across dozens of units"、"hundreds of character constraints"、"waited days for qualified replies"） | 6 个案例页 | 无 |
| "Why off-the-shelf chat tools could not handle this" 6 段、技术亮点 18 条、流程 24 步及 "Deliverable" | 6 个案例页 | 无（形式由 G-14 授权） |
| 画像新增："global technical inquiries"、"investment research…due‑diligence memos"、"across regional warehouses and vendors"、"residential…contractors and owner statements"、"hundreds of thousands to over a million words" | 案例页与卡片 | 部分对应中文 §6.7；其余无 |
| 数据案例新数字 "5 gates"；物业 "OCR"、"HOA bills"、"1‑tap check" | 案例页 | 5 项门禁截图可见；OCR 待核对截图 |
| 31 条截图说明、24 条界面标注 | 案例页 | §6.8 授权看图撰写；只抽查了 4 张主图，相符 |
| 记忆分层占比 24% / 32% / 26% / 18%；"~62% budget used · 100% instruction retention" | technology | 无 |
| 曲线 "Raw history: ~2440ms"、"Cyano Core: ~181ms* (-40% tok)"（随轮数变化） | technology | 无，是代码公式 |
| 审计记录样例 4 条（active_docs=14 等） | technology | 无 |
| 指标口径 "Context retrieval & assembly latency"、"Pinned system rules retained across 100-turn runs"、"Measured against resending full raw conversation history"；脚注 "100-turn enterprise workflow benchmarks; production latency and cost savings vary…" | technology | sources 只有"100 轮长对话内部基准"；对比基线近似 v1 难题 1；其余待确认 |
| "4 tiers" | technology | sources（core-benchmarks） |
| "(including OCR & complex tables)"、"immutable trace"、"mix or switch without rebuilding workflows"、"Meta Llama (Private)"、"ERP / CRM REST APIs"、"Markdown / Internal Wiki"、"Excel / CSV ledgers"、"Read-only SQL views & metric schemas" | technology | 事实表只有基础名称；限定语无 |
| 对比表："deployment & training"、"accuracy & time-savings report"、"convertible into an owned custom build"、"Client owns all source materials and delivered outputs"、"agreed SLA and QA" | engagement | 无 |
| "client data is never used to train public models" | engagement | 无 |
| "Following our initial 30–45 minute call, we provide an itemized proposal"；"optional iteration sprints"；"tenant-isolated"、"zero hardware setup" | engagement | 30–45 分钟在 sources；其余无 |
| 选择器三问及推荐打分逻辑 | engagement | 无（形式由 G-17 授权） |
| "All four founders stay directly involved from assessment through production maintenance" | about | 无 |
| 创始人专长、标签、"Owns:" 共 12 条；"Former senior engineer"；"AI model inference optimization"；"post‑launch incident SLAs" | home、about | 无（形式由 G-21 授权） |
| "advise honestly when a build is premature"；"evaluation sets from real historical work"；"regression checks" | about | 无 |
| "Our Head of Product & Solutions and technical leads review every submission directly"；"Mutual NDA available prior to sharing sensitive files"；"written feasibility assessment" | contact | 1 个工作日、1 周在 sources；其余无 |
| "6 min read / 7 min read"；3 条摘要；3 条引文；6 张图解（含 "Within one week of the call…clear acceptance criteria"） | insights、文章 | 无 |
| 演示："Enterprise IT Security & Access SOP v3.4 §1 · Caller ACL verified"；"5-gate read-only SQL check passed" | knowledge-assistant、data-query、两个案例页 | 演示数据（sources 的 interactive-dataset 只覆盖表格数据） |
| 首页对比区 4 组 Risk 与 Outcome（如 "regression suites"、"sustained adoption"） | home | 无 |
| "TLS encryption in transit"、"privacy-preserving"、"take effect upon publication"、"bypass rate limits"、"Public demo sandboxes" 条款、"SLAs" | privacy、terms | 无 |
| 23 条页面 description（如 "(< 2 weeks to first batch)"、"A senior consultant replies within one business day"） | 全部页面 | W-08 授权逐页写；内容是新的 |

## 4. 中英对等表（v2）

| 页面 | 中文 | 英文 | 性质 |
|---|---|---|---|
| home 首屏 | 智能标书系统；"SRC 01 产品与技术规格库 v4.2 · 命中 12 项生效参数"；"7/7"；"2 天 → 15 分钟 … 引用准确率 99%" | Enterprise Wiki IT Assistant；"IT Access & VPN Policy §4.2"；"5/5"；"80% routine tickets · < 3s" | **有意差异**（D-2）。两边的来源标签都是编的；中文叠层写 7/7，截图本身和中文案例标注是 5/7 |
| home 团队句 | "世界 500 强企业工作经历" | "Fortune Global 500 engineering experience" | 英文多了 "engineering" |
| home 对比区 | "三个月后沦为闲置工具" | "rapid abandonment after launch" | 中文多一个数字 |
| home、engagement 托管 | "2 周内首批交付"；"按周或按批次"、"按周/月" | "< 2 weeks first batch"；"monthly/batch" | 英文"<2 周"更强；中文"按周"与事实表"按月/按批次"不符 |
| services 文档流程徽标 | "逐句溯源" | "99% cited" | 不对等，英文多数字且用错 |
| services 销售流程徽标 | "秒级检索"、"ACL 权限分级" | "Sub‑second"、"Role‑tiered" | 英文更强 |
| services 知识库来源 | "同步飞书、钉钉、Confluence 与角色权限" | "Confluence, SharePoint, Lark & RBAC" | 系统清单不同 |
| knowledge-assistant 痛点 | "每天被问上百遍"；"80% 工单属重复常见咨询" | "dozens of times a week"；"Up to 80% repetitive tickets" | 量级不同 |
| data-query 痛点 | "开会时先花半小时对数字" | "spending half of every review meeting" | 不同 |
| sales-ai FAQ | "严格分离的索引范围" | "physically separated index scopes" | 英文更强 |
| knowledge-assistant FAQ 3 | "适配本地推理算力 … 文档与提问日志" | "documents, embeddings and query logs" | 细节不同 |
| IT 案例标题 | "80% 的常见咨询由 AI 处理，平均响应低于 3 秒" | "80% of routine IT tickets answered in under 3 seconds" | 英文丢了"平均" |
| IT 案例 | "上千篇"；亮点里有"15%"；标注"（10%）（5%）"；"每周未命中问题报表" | "over 1,200"；15% 只在耗时轨；标注无数字；"Monthly tuning" | 数字位置和频率不同 |
| 标书案例 | 标注"（当前 5/7）"；"每月需交付大量"；99% "人工复核后定稿" | 无 5/7；"dozens … each month"；"prior to human sign‑off" | 不对等 |
| 销售案例 | "如磷酸铁锂、高镍三元材料"；"核验百余组选型问答"；"销售培训" | 无物料举例；无数量；无培训；多 "waited days" | 不对等 |
| 数据案例 | "实际耗时视数据库规模与查询复杂度而定（示例查询约 186ms）"；"字段级权限映射"；无 Snowflake；"中文或英文…提问" | "(186 ms on benchmark vendor query)"；"table‑level"；"Snowflake" | 英文缺限定语并多一个系统名 |
| 物业案例 | "多套房源"；"管理费"；"按月自动生成屋主对账单"；"报税准备" | "dozens of units"；"HOA"；"daily mobile expense capture"；无报税 | HOA 属**有意本地化**；其余不对等 |
| 物业系统名 | "AlphaHouse 房东记账与管理工具" | "AlphaHouse Property Ledger" | 英文改名 |
| 写作案例 | "超过几十轮就会遗忘"；"数十万字连载样本" | "as chapters grow"；"multi‑volume drafts" | 中文多数字 |
| 案例界面语言注 | 无 | "Note: Client interface shown in production Chinese…"（标书、物业、写作） | **有意差异**（D-2、G-13） |
| technology 审计记录 | "审计日志记录样例" | "AUDIT TRACE RECORD" | 英文缺"样例" |
| technology 兼容 | "通义千问（Qwen）"、"飞书（Feishu / Lark）" | "Alibaba Qwen"、"Lark / Feishu" | **有意本地化**（G-11） |
| engagement 流程第 3 步 | "固定阶段报价" | "transparent pricing" | 含义不同 |
| engagement 对比表托管 | "异常处理与质量把关" | "agreed SLA and QA" | SLA 只在英文 |
| engagement 私有化 | "数据不出内网边界" | 无此句 | 英文缺 |
| engagement FAQ 2、7 | 举例"批量文档汇编、材料归档审核"；"书面约定" | "proposal assembly or document structuring"；"We agree on" | 举例不同，"书面"缺 |
| about 简介 | CTO "核心技术团队"；工程"训练与推理优化"、"保障响应速度与稳定性" | "Former senior engineer"；"inference optimization"、"post‑launch incident SLAs" | 英文多职级和 SLA |
| about 数字栏 | "6 个行业" | "6 sectors" | 用词 |
| contact | "带一份脱敏工作样本"；"通过邮件或你预留的方式" | "A single work sample"；无 | 细节 |
| privacy | "通常保留不超过 24 个月"；"不会出售或向广告网络共享"；"加密传输" | "retained for no longer than 24 months"；"never sell"；"TLS encryption in transit" | 承诺强度不同 |
| terms | "不构成直接合同承诺"；"将在本页同步发布"；"未经书面许可" | 无此句；"take effect upon publication"；"without permission"；多 "SLAs" | **法律条款不对等** |
| 文章引文署名 | "来自咨询与投研机构标书项目的交付总结" | "Lesson from the consulting & research proposal workflow" | 中文更像客户口吻 |
| 文章正文 | 与 v1 相同 | 与 v1 相同 | 对等 |

另：中文案例标注有"磷酸铁产线"，同页其他处是"磷酸铁锂"，疑为漏字。

## 5. 计划改写与 D-1…D-6 落实情况

| 项 | 状态 | 依据 |
|---|---|---|
| T-11 句首大写、大小写统一 | 部分。联系页三条已大写；又出了小写 H1 "cited proposal…"；合作方式名 Title Case 与 sentence case 混用 | #1、#3 |
| T-12 日期格式 | 已执行（"Nov 10, 2026"）；法律页用 "November 12, 2026" | en-insights.txt |
| V-02 英文页中文标签 | 已执行（Qwen、Lark、DingTalk、WeCom；界面语言注） | en-technology.txt |
| C-05 统计条 | 首页已改成一句话，措辞与 D-4 不同；About 页仍是四个数字、两个 100% 并排 | #6 |
| C-06 术语统一 | 未完成。合作方式、案例称呼仍各有多种写法，还新增行业名、系统名、检查项的不一致 | 不一致清单 |
| C-08 语态与译文腔 | 已执行（"faults" 删了；"Lower token cost, up to" 改为 "Up to 40% / Lower multi-turn token cost"；四层说明统一第三人称）；但借机重写了内容 | #39、#43 |
| V4 的 15 条改写 | 无法逐条核对（原文没给）。实际改动远超 15 条，几乎整站重写 | — |
| D-1 维持 R8；人像降为一行小卡、统一品牌色调；每人一条专长 | 做法不同。没有真名和照片；专长已加；人像仍是大卡、自然色（`founder-N-natural.webp`），没做双色调；另新编了 "senior engineer" | 截图 en-about-d-03 |
| D-2 英文首屏换英文界面系统并换数字；截图加标注和语言说明 | 已执行，但叠层来源标签是编的 | #5 |
| D-3 每个数字加测试条件；10× 不上页面 | 部分。技术页四个数字有条件和脚注，10× 已移除。但条件不出自 sources；首页星号没脚注；"99% cited" 没条件；延迟口径被改；曲线没标示意 | #8、#14、#35、#36 |
| D-4 一句话加三个事实标签，英文用 V4 改写 | 做法不同。只有一句话，没有三个标签，措辞不是 V4 版本 | #6 |
| D-5 Demo 按钮改名并加说明 | 已执行（"Try anonymized demo" 加 "Public sandboxes run on anonymized sample data…"）；没有公开 Demo 的 3 个案例页因此少了脱敏说明 | #24 |
| D-6 两个垂直案例单独分组、排在四条主线之后 | 已执行（"Specialized vertical systems"） | en-cases.txt |

## 6. 没有做到的部分

- 手机端、悬停态和折叠内容没有看渲染效果，只读了内容文件和组件源码（技术页四层、首屏叠层、选择器、演示答案、表单提示）。
- 31 张截图只核对了 4 张主图（IT 看板、SmartDoc SQL、LNPE 工作台、标书主界面）。AlphaHouse 和 DME 的图注与 "OCR" 等说法没有看图核对，标为待确认。
- 没查 JSON-LD 结构化数据、OG 标签、404 页、确认邮件正文、表单 API 返回文案。
- 中文 v2 相对中文 v1 的改动不在本次范围，只做了中英对等，顺带记了几处中文问题。
- "仅措辞变化"的数量和各类计数是按表格行估算的，不是逐句精确统计。
- v1 页面结构以源码为准，没有逐张对 v1 截图。
- V4 的 15 条改写原文不在文件里，只能按问题描述判断。

**相关路径**

- v1：`C:\Users\jiack\AppData\Local\Temp\claude\202c36f9dd01914c\391ecb91-5b50-4c74-8095-070e33788218\scratchpad\v1\site\content\copy.json`、同目录下 `lib\content.ts`、`components\pages.tsx`
- v2 内容：`F:\2026-11-10-Cyano Website Rebuild\site\content\site-copy-v2.json`、`cases-v2.json`、`solutions-v2.json`、`insights-v2.json`、`founders-v2.json`
- v2 组件：`F:\2026-11-10-Cyano Website Rebuild\site\components\TechVisuals.tsx`（曲线公式 227–229 行）、`InteractiveDemo.tsx`、`ContactForm.tsx`
- 审计中间文件（v1 英文抽取等）：`C:\Users\jiack\AppData\Local\Temp\claude\202c36f9dd01914c\391ecb91-5b50-4c74-8095-070e33788218\scratchpad\audit-en\`
