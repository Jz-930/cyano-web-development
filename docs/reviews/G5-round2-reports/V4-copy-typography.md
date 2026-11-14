# G5 第 2 轮 · V4 双语文案与排版评审（R-COPY）

> 评审者：V4 双语品牌文案与字体排印总监（独立评审 Agent）。日期：2026-11-13。
> 本文件由执行者根据评审者在会话中提交的最终报告转存（评审者在保存文件前因额度中断）。内容未删改。

**结论：英文版和中文版都未过 R-COPY 及格线。** 英文版均分 4.67，可信度、写作质量、一致性三项低于 5；中文版均分 5.67，单项都达到 5，但均分不到 6。中文版另有两个系统性排印缺陷（等宽标签回落到宋体、标题断词与单字成行），排印工艺只给 3 分。

评审依据：按要求阅读的截图（未读清单见第 5 节），并核对了 `site\app\styles\site.css`、`tokens.css`、`site\app\(en)\en\layout.tsx`、`site\components\TechVisuals.tsx`、`site\content\solutions-v2.json`。字号是按截图像素估的，误差约 ±1px。字体回落类问题来自这批 Windows 截图，macOS 上表现可能不同。

---

## 1. 评分

### 英文版

| 维度 | 分 | 一句话理由 |
|---|---|---|
| Scannable | 5 | 首页标题串起来是完整论证；但方案页 H1 丢了首词，"Four …" 句式用了五次以上 |
| Weight | 5 | 语气克制、有工程感；但卡片文案像内部规格书，缺人名和客户名 |
| Specific | 6 | "2 days → 15 min"、"80% · < 3s"、"10 weeks"、4h+4h+6h+2h=16h 的拆解都很实 |
| Credible | 4 | 创始人匿名；四人团队写两个 "100%"；"100%* Core business instruction recall"；图表圆点不在曲线上 |
| Writing quality | 4 | 语法基本干净，但电报体名词堆叠多，有明显译文腔 |
| Consistency | 4 | 方案名、行业名、合作模式名、流程阶段名、数字写法、连接号都不统一 |
| **均分** | **4.67** | **未过线** |
| Typographic craft | 4 | 骨架对（Manrope Light + Inter + JetBrains Mono，英文标题有 `text-wrap: balance`），细节失控 |
| Legibility | 4 | 正文 16–18px 没问题；但 11–13px 的等宽和灰字很多，黑底灰字偏暗，三处文字压在图上 |

### 中文版

| 维度 | 分 | 一句话理由 |
|---|---|---|
| Scannable | 6 | "把 AI 用进正式业务，必须解决四个工程问题" 这类标题自成论证 |
| Weight | 6 | 语气笃定，不油腻 |
| Specific | 6 | 数字和场景与英文同源，且表达更自然 |
| Credible | 5 | 同样有 100%×2 和匿名创始人；"某…机构" 的脱敏写法在中文语境可接受 |
| Writing quality | 6 | 地道，是原生中文；文章正文明显好于英文版 |
| Consistency | 5 | "创始团队 / 核心合伙人" 混用；大量英文标签未本地化 |
| **均分** | **5.67** | **单项过线，均分未到 6** |
| Typographic craft | 3 | 等宽标签全部回落宋体；H1/H2 多处断词和单字成行 |
| Legibility | 4 | 卡片里 12–13px 灰色中文太小；宋体伪粗彩色小字发糊 |

**英文版是为英文设计的，还是中文版式灌英文？** 大约七成是为英文设计的：有独立的 `:lang(en)` 规则、句首大写、标题平衡换行。剩下三成是"灌"的痕迹：
- 用 "·" 作万能分隔符，这是中文间隔号的习惯。
- 四栏卡片宽约 210px，按中文信息密度定的，英文被迫压成 "Requirement parse & case match" 这种 "+ / &" 电报体。
- 正文行距 1.68–1.72，偏中文的松。
- 小字普遍 13px。

---

## 2. 问题清单

### 英文 · 字体排印

1. **【严重】方案页 H1 首词丢失。** `en-solution-doc-d-01` 的 H1 和 `en-services-d-03` 的 H2 都渲染为 "cited proposal and report drafts in as little as 15 minutes"，小写开头。源头是 `site\content\solutions-v2.json:125`，值为 `" cited proposal and report…"`，前面有空格，首词被删。修：改为 "Cited proposal and report drafts in as little as 15 minutes"。

2. **【严重】图表坐标轴字体回落成衬线体。** `en-technology-d-04`（中文版 `zh-technology-d-04` 同样）的 "Turn 1 / Turn 50 / Turn 100" 是约 24px 的灰色衬线字，全站唯一的衬线。原因在 `TechVisuals.tsx:319–326`：SVG `<text>` 写的是 `fontFamily="monospace"`，没走 `--font-mono`，且 SVG 被放大约 2 倍。修：改 `fontFamily="var(--font-mono), Consolas, monospace"`，把字号调到渲染后 12–13px，fill 提到 0.7。同图青色圆点（y≈677）不在青色曲线（y≈648）上，损害可信度。

3. **【严重】文字压在主视觉上。** 三处：
   - `en-home-d-01`：导语 "…proposal drafting, / …managed AI workflows, / …deployment and maintenance." 的右端压进玻璃管。
   - `en-home-mobile-01`：H1 "Custom AI systems built for everyday work" 和导语整段压在球体上。
   - `en-about-d-04`：正文 "Sales inquiries demand exact product specs…" 直接叠在彩色波纹上。
   修：桌面首屏文字栏 `max-width: 34rem`，或加一层左侧渐变遮罩（#030B12，0 到 55% 宽度由实到透）；移动端把图透明度降到 0.25 或移到文字下方；About 的波纹下移，与文字留 48px 以上。

4. **【重要】展示字字距过紧、字重过轻。** `site.css:62` 给 Manrope 300 设了 `letter-spacing: -0.03em`。在 48–69px 时，"bottlenecks"、"workflow"、"Intelligent Proposal Builder" 里的 ll、il、rn 竖画粘连（`en-home-d-03`、`en-case-proposal-d-03`）。修：60px 以上用 -0.02em，40–48px 用 -0.012em；白底 H2 的字重从 300 提到 400，300 只留给 H1。

5. **【重要】小字下限过低。** 11px 等宽标签到处都是："01 · SOURCES"、"Role-tiered"、"Sub-second"、"99% cited"、"W0 W2 W6 W12+"、FAQ 序号 "01"、"SPECIALTY: …"。12–13px 灰字说明也很多。修：等宽标签不低于 12px、字距 0.08em；说明文字不低于 14px；白底灰字不浅于 #4B5563。

6. **【重要】黑底次级文字又小又暗，还比白底粗一档。** 例子：
   - `en-home-d-07`："Transforming scattered documents, tables and approval rules into…"
   - `en-technology-d-05`：脚注 "* Based on Cyano internal 100-turn enterprise workflow benchmarks…" 和 "Consistent budget speed at turn 100 as at turn 1"
   - `en-solution-doc-d-04`："A scoped pilot typically delivers a working v1 in 2–6 weeks…"
   - 页脚："Serving enterprises in China and North America…"
   这些都是约 13px、中灰、看上去是 500–600 字重。修：统一 14–15px、字重 400、颜色不低于 rgba(255,255,255,.72)。

7. **【重要】等宽字被用来排整句。** 例子：
   - `en-case-proposal-d-03`："01 / 02 · Main workspace: staged workflow and 7-point completeness checklist on the left, constraint extraction in the center, and live memo draft with stress-test alerts on the right."，12px 粗等宽，每行约 105 字符。
   - `en-engagement-d-02`：琥珀色等宽两行 "2-6 weeks to working v1 · Sample align → Working v1 → Expand or stop"。
   - `en-case-proposal-d-05`：18px 等宽 "~2 working days (16 hrs)" 和 "15 min draft + human review"。
   修：整句改 Inter 14/22；等宽只留给三个词以内的标签和纯数字。

8. **【重要】创始人卡片的 SPECIALTY 行不可读且错位。** `en-home-d-12`、`en-about-d-03`："SPECIALTY: SOP MAPPING & CITATION-BACKED HUMAN REVIEW INTERFACES" 是 11px 全大写等宽，折 2–3 行，四张卡四种颜色。第四张折三行，"Head of Product & Solutions" 比其他三张低约 20px。它还和下面的标签行、"Owns:" 行说的是同一件事。修：删掉这一行；或改成 Inter 13px 句首大写、单色、固定两行高。

9. **【重要】标题坏断行。** 只靠 `text-wrap: balance` 不够：
   - `en-home-d-09`："Start with a custom build, a / scoped pilot or managed delivery"，行尾悬着冠词 a。
   - `en-engagement-d-04`："Five stages from initial work- / sample review to ongoing upkeep"，连字符处断开。
   - `en-about-d-05`："Plan for post- / launch maintenance"。
   - `en-home-d-13`："A proposal draft in 15 / minutes: how we built it"。
   - `en-about-d-01`："…tools teams rely / on every day"，拆开了 rely on。
   修：加不换行空格（`a&nbsp;scoped`、`15&nbsp;minutes`），复合词包 nowrap，或按第 4 节改写。

10. **【重要】首页数据带第一列折行。** `en-home-d-02/03`："2 days → 15 min" 在约 54px 时折成两行，"min" 单独掉下去，另两列是单行，三列说明文字基线差约 55px。修：数字 `white-space: nowrap`，字号上限降到 48px，或栅格改 1.25fr 1fr 1fr。

11. **【重要】文章正文行长过长。** `en-article-d-02`～`06`：18px 正文排在 720px 栏宽上，每行约 86–90 字符，行距 31px（1.72）。侧栏在 x≈350 结束，正文从 x=640 开始，中间空 290px，版心右偏。修：正文 `max-width: 64ch`（约 620px），行距 1.6，把空出来的宽度还给左右留白。

12. **【一般】窄栏孤行。**
    - `en-services-d-02/03/04`："Internal project-matching & spec / workbench"、"Customer-specific recommendation / briefs"、"Editable section-by-section proposal / drafts"、"Role- and department-scoped knowledge / index"。
    - `en-home-d-08`："…sensitive pricing or / HR rules."、"…/ by hand."
    - `en-technology-d-04/05`："zero- / fabrication policies"、"100- / turn runs"。
    修：清单改单栏或列宽不小于 22rem；`li` 也加 `text-wrap: pretty`；复合词 nowrap。

13. **【一般】行业列表行尾悬挂斜杠。** `en-home-d-03`、`en-home-mobile-04`："Consulting & Research /"、"Real Estate & Property /" 的斜杠留在行尾。修：改 3×2 栅格；或把分隔符做成每项的 `::before`，行首项隐藏。

14. **【一般】"TEAM CREDENTIALS ·" 自成一种标签样式。** `en-home-d-03`：它以正文字号（约 16px）全大写、无字距内联在段首，和全站 eyebrow（13px/600/0.08em）不同。修：单独成行，用 eyebrow 样式。

15. **【一般】H2 有三四种尺寸，看不出规则。** 标准 H2 是 48px；`en-engagement-d-02` "Answer three questions to see a recommended starting model" 约 40px；`en-contact-d-02` "Scope assessment, NDA demos or architecture fit" 约 30px；`en-solution-doc-d-03` "Key engineering capabilities" 约 28px。另外 `en-engagement-d-02` 的 eyebrow "INTERACTIVE FIT SELECTOR" 比别处大、字距更紧。

16. **【一般】连接号和单位写法混乱。** `en-engagement-d-03` 同一屏上，等宽写 "6-12 weeks to v1"、"2-6 weeks to working v1"（连字符），表格写 "6–12 weeks"、"2–6 weeks"（en dash）。时间单位有 "15 min"、"15m"、"15-min"、"15 minutes"、"2d → 15m"、"(16 hrs)"、"4h"、"< 2w"、"2 wks"。规则建议：行文用 "15 minutes"，指标用 "15 min"，区间一律 en dash，禁用 2w/2d/15m。

17. **【一般】编号标签至少有 9 种语法。** "01 · SOURCES"（首页、服务页）、"01 / SOURCES"（首页黑底表）、"01 SOURCES"（案例页）、"LAYER 01 · INGESTION · L1"（L1 重复）、"MODEL 01 · …"、"SRC 01"、"TIER 01 · 24%"、"STEP 1"、"LAYER A"。统一成一种，例如 "01 · Sources"。

18. **【一般】箭头和连字符疑似走了回落字体（不确定）。** "2 days → 15 min"、"Assess → Architect → Build → Deploy & own" 里的箭头是细长形，像系统字体；"Version‑tagged clause chunks"、"sign‑off"（`en-case-proposal-d-05/06`）的连字符比邻字粗。内容 JSON 里有 214 个 U+2011 不换行连字符，可能是原因。修：箭头改内联 SVG；U+2011 换成普通 "-" 加 nowrap，或确认字体子集包含该字形。

19. **【一般】大小写规则不一。** 导航是 Title Case（"How We Work"），按钮是句首大写，Insights 分类是句首大写（"Knowledge management"、"Working together"），部署卡是 Title Case（"Isolated SaaS Hosting"、"Private Environment Deployment"）。同一个词有 "Full Custom Build" 和 "Full custom build" 两种。句中出现 "your internal Wiki"、"Meta Llama (Private)"、"PDF (Scanned OCR & multi-page tables)"。规则建议：除导航、专有名词、三个合作模式名外，一律句首大写。

20. **【一般】"&" 滥用到句子里。** "Routine inquiries handled & avg response"、"Context selection, latency & token cost"、"Compare models & take the 3-step selector"。句子里用 and，"&" 只留给名称类标签；"avg" 不要缩写。

21. **【一般】右对齐的 13px 灰字。** `en-home-d-10`："Best for clear requirements, daily usage and / long-term ownership" 右对齐、左侧参差，难读。修：改左对齐，14px。

22. **【一般】卡片标题行数不一，正文错位。** `en-solution-doc-d-02`（"Days spent assembling / and checking drafts" 两行，邻卡一行）、`en-engagement-d-04/05`（"Agree scope / & acceptance"）、`en-about-d-05`。修：标题区固定两行高，或压到一行。

23. **【一般】移动端断行。**
    - `en-home-mobile-02`："80% routine tickets · < / 3s"，"<" 和 "3s" 被拆开。
    - `en-home-mobile-03`："…firm system · 7 / completeness checks"。
    - `en-case-proposal-mobile-01`：H1 因硬换行加自动换行排成 5 行，"proposals" 独占一行。修：640px 以下去掉硬换行。
    - `en-case-proposal-mobile-06`：注释写 "annotations on the right"，手机上注释在下方；注释图标对的是四行文字的中线，应对首行。

### 英文 · 文案

24. **【严重】创始人没有名字。** 卡片标题只有职位（"Chief Executive Officer"），文章署名是 "Head of Engineering Delivery / Cyano Founding Team"。北美 B2B 买家默认要看到姓名和 LinkedIn。再加上四人团队写两个 "100%"（`en-about-d-02`）和首页的 "100% of core team members have Fortune Global 500 engineering experience"，读起来像在遮掩规模。修：给姓名；数据带改成 "4 founders · 6+ years each · 6 industries · N systems in production"。

25. **【重要】术语不一致。**
    - 方案名："Sales & Customer AI"（标签页、页脚、服务页）对 "01 · SALES & ADVISORY"（首页）。
    - 行业名："Consulting & Research" 对 "PROFESSIONAL SERVICES & RESEARCH"；"Enterprise IT & Services" 对 "ENTERPRISE SERVICES"。
    - 托管模式："managed delivery"、"Managed AI Service"、"managed AI workflows"、"managed service"。
    - 试点模式："Scoped Pilot + Ongoing Service"、"scoped pilot"、"2–6 week pilot"。
    - 同一系统的四阶段：方案页是 Sources / Orchestration / Verification / Output，案例页是 Sources / Staged drafting / Validation / Human sign-off。
    - 其他："FREQUENT QUESTIONS" 对 "COMMON QUESTIONS"；"FOUNDING TEAM" 对 "CORE FOUNDERS"；"6 industries" 对 "6 sectors"；"7-point"、"seven-point"、"7 checks"、"7 completeness checks"。

26. **【重要】电报体和行话密度过高。** "Requirement parse & case match"、"Price gate + engineer review"、"Sample align → Working v1 → Expand or stop"、"< 2w first batch → Continuous Cyano ops + QA"、"Human route"、"0 manual SQL"、"context-budgeted workflows"、"Context valuation"、"(-40% tok)"。高管读者扫不动。每张卡片标题应是一个完整的动宾短语。

27. **【重要】译文腔和不地道的说法。**
    - "Note: Client interface shown in production Chinese as deployed…"
    - "unstressed financial assumptions"（unstressed 是语音学用词）
    - "Compare models & take the 3-step selector"
    - "Book a 30–45 minute call with a sample of your current work"
    - "Docker private deployment"
    - "Our three models differ clearly in…"
    - "Consistent budget speed at turn 100 as at turn 1"
    - 反复出现的 "upkeep"
    - 英文表单的 "Phone or WeChat" 和 "(min 10 chars)"
    - 集成列表 "Lark / Feishu · DingTalk · WeCom" 排在 SharePoint 前，且没有 Slack、Teams、Google Drive
    - "Have a question on data access" 应为 about

28. **【重要】会被追问的数字。**
    - "100%* Core business instruction recall"：即使带星号也显得过满。
    - 服务页标签 "99% cited"：案例页写的是 "99% Project citation accuracy / Measured on project acceptance set prior to human sign-off"，缩写后含义变了。
    - "7 checks … Covers market, business model, compliance and stress-test items"：说七项只列四类。
    - 层级占比 24/32/26/18 加起来是 100%，旁边写 "~62% budget used"，要读者自己猜口径。

29. **【一般】文章正文像规格说明。** "People confirm important decisions."、"Records also include sources and update dates." 没有叙述者也没有场景。引文署名是 "— Lesson from the consulting & research proposal workflow"，引语需要一个说话人。面包屑末级是分类 "Engineering"，不是文章。

30. **【一般】英文页放中文界面截图。** `en-home-d-05`、`en-solution-doc-d-04/05`、`en-case-proposal-d-04` 的截图是中文界面，字小到看不清。Retail & Supply Chain 的系统叫 "SmartDoc AI Data Query"，截图里还有 "Proposal Builder" 标签；截图内写的是 "7x24 Automated Support"。修：提供英文化的脱敏截图，或裁到可读的局部。`en-case-proposal-d-04` 第二张缩略图是灰块，疑似没加载。

### 中文 · 字体排印

31. **【严重】等宽标签里的中文全部回落到宋体。** `site.css:168` 的 `.font-mono-tech` 字体栈是 `var(--font-mono), ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`，没有任何中文后备，Windows 上落到宋体，再被伪加粗、加宽字距。受影响的例子：
    - `zh-home-d-01`、`zh-home-mobile-01/02`："智能标书与方案生成系统"、"实时引用溯源链路"、"2 天 → 15 分钟"
    - `zh-home-d-09`："交付周期比例标尺（第 0 周 → 第 12 周）"、"模式 01 · 资产归客户所有"
    - `zh-home-d-11`、`zh-about-d-03`："专长：…"
    - `zh-case-proposal-d-04/05`："约 2 个工作日（16 小时）"、"15 分钟初稿 + 人工复核"、"改造前人工流程"
    - `zh-technology-d-03`："~62% 预算占用 · 关键指令 100% 保留"
    - `zh-article-d-03`："工程图解 01 · 三类资料分层隔离"
    修：字体栈在 `monospace` 之前补 `"Noto Sans SC Subset", "PingFang SC", "Microsoft YaHei"`。更好的做法是含中文的标签不用等宽类，改无衬线 13–14px、字重 500、字距不超过 0.04em，不要伪粗。

32. **【严重】标题断词和单字成行。**
    - `zh-home-mobile-01` H1："为企业开发日常工 / 作 / 用得上的 AI 系统"，首屏 "作" 独占一行。
    - `zh-case-proposal-d-01` H1："把方案初稿从两天缩 / 短到 15 分钟"。
    - `zh-about-d-01` H1："为企业开发并长期维 / 护真正用得起来的 AI / 工具"。
    - `zh-article-d-01` H1："15 分钟出标书初 / 稿：智能标书系统是 / 怎么搭起来的"。
    - `zh-about-d-03` H2："四位创始人直接参与评估、架构与交 / 付"。
    - `zh-case-proposal-d-06` H2："该项目从梳理到正式上线的推进里程 / 碑"。
    - `zh-home-d-08` H2："…选择定制、试 / 点或托管"。
    - `zh-home-d-10` H2："…评估、架 / 构与交付"。
    - `zh-home-d-03` H3："根据产品资料与历史项 / 目，专业回答客户问题"。
    - `zh-about-d-02` H2："…企业系统交付 / 经验"。
    原因：`text-wrap: balance` 只加在 `:lang(en)` 上（`site.css:66`），中文标题没有任何断行控制。修：H1–H3 按词组包 `<span style="white-space:nowrap">`，或用 BudouX（zh-hans）加 `word-break: keep-all`；中文也开 `text-wrap: balance`。建议断法：
    - "把方案初稿 / 从两天缩短到 15 分钟"
    - "为企业开发并长期维护 / 真正用得起来的 AI 工具"
    - "15 分钟出标书初稿： / 智能标书系统是怎么搭起来的"
    - "四位创始人直接参与 / 评估、架构与交付"
    - "按确定性与内部精力， / 选择定制、试点或托管"
    - "从梳理到正式上线的 / 推进里程碑"

33. **【重要】中文小字过小。** 卡片说明是 13px 灰字（`zh-home-d-04` 流程卡、`zh-about-d-05` 原则卡、`zh-case-proposal-d-06` 时间线、`zh-home-d-12` 文章摘要）；eyebrow 约 12px 加字距（"核心业务场景"、"项目背景与挑战"）；`zh-home-d-09` 右对齐说明约 12px。中文笔画密，次级文字不应低于 14px，eyebrow 用 13–14px。

34. **【重要】卡片内断词和孤字。**
    - `zh-home-d-04`："历史项目台 / 账"、"工程 / 师确认"、"经工 / 程师审定"、"选型建 / 议书"。
    - `zh-home-d-09` 右对齐："…自有系统的 / 企业"、"运维人 / 员的团队"。
    - `zh-home-d-03`："6 年以 / 上软件工程经验"。
    - `zh-about-d-03`："背景与 6 / 年以上"。
    - `zh-case-proposal-d-02`："串用旧参 / 数。"
    - `zh-home-d-12`："怎么搭 / 起来的"。
    - `zh-home-d-13`："实施周 / 期与预期改善"。
    修：数字和单位包 nowrap；卡片标题压到一行以内（如 "规格书 + 历史台账"）；右对齐改左对齐。

35. **【重要】大量英文标签未本地化，且标准不一。** "01 / SOURCES"、"02 / CONTEXT"、"CYANO CORE 工程方案"、"LAYER 01 · INGESTION · L1"、"TIER 01 · 24%"、"STEP 1"、"LAYER A"、"NOTE 02 · STAGED DRAFTING"、"SRC 01"、"W0 W2 W6 W12+"、"(-40% tok)"、图表 "Turn 1/50/100"。同站别处又译了（"01 · 输入源"、"02 · AI 编排"）。要么全译，要么只保留编号。

36. **【一般】标点和中西混排。**
    - `zh-article-d-04` 引文用西文弯引号，后引号还是斜的；署名用单个 "—"。修：用「」或中文字体的 "“”"，署名用 "——"。
    - `zh-technology-d-06`："通义千问（Qwen） · Meta Llama（本地/私有）"、"飞书（Feishu / Lark） · 钉钉（DingTalk） · 企业微信（WeCom） · SharePoint"。全角括号后再加空格和间隔号，间距忽大忽小。修：用顿号分隔。
    - `zh-technology-d-05`："…对比测试）；" 的分号前多一个空格。
    - 区间写法 "6-12 周"、"2-6 周"（连字符）对 "2–6 周"、"第 1–2 周"（en dash），应统一。
    - 文案写 "7×24"，截图里是 "7x24"。

37. **【一般】中文标题用了负字距。** `site.css:39` 给中文 H1/H2 设了 `letter-spacing: -0.015em`，思源黑体自带字面留白，负字距没有收益，建议设为 0。正文的中西文之间空格处理一致，这点做得好。

38. **【一般】文章行长略长。** `zh-article-d-02`：17px 排 720px，每行约 42 字，建议 36–38 字（约 640px）。行距 1.82 合适。

39. **【一般】文字压图。** 与英文同样的三处：`zh-home-d-01` 导语 "…也提供托管式 AI" 压进玻璃管；`zh-home-mobile-01` H1 压在球体上；`zh-about-d-04` 正文压在波纹上。

### 中文 · 文案

40. **【一般】称谓和名称不一。** 首页用 "创始团队"，About 用 "核心合伙人"（`zh-about-d-03`）；系统名有 "智能标书与方案生成系统" 和 "智能标书与方案生成" 两种；导航 "方法与技术" 对应英文 "Technology"，"合作方式" 对应 "How We Work"，中英信息架构的命名不对称。

---

## 3. 字体系统整体判断

**三套字体的选择是对的，问题在用法没有纪律。**

**用量（按截图估算）：**
- 字号约 16–18 级：69、54（数据）、48、44、40、36、30、28、26、21–22、20、18、17、16、15、14、13、12、11。`tokens.css` 只定义了 9 级，其余来自组件里的 Tailwind 任意值。
- 字重：Manrope 300 和 500；Inter 400、500、600；JetBrains Mono 约三档。
- 标签文字用了 6 种强调色：青、蓝、紫、橙、粉、琥珀。

**等宽字和全大写用在哪里：**
- eyebrow 是 Inter 全大写（13px/600/0.08em），基本一致，只有 "TEAM CREDENTIALS" 和 "INTERACTIVE FIT SELECTOR" 两处例外。
- 等宽字同时承担了七种角色：编号标签、行业标签、指标数字、整句说明、页脚栏目标题、邮箱、图表轴。一种"技术感"手法摊到七种语义上，信号就没了。
- 等宽全大写被用在 8–10 个词的长短语上（SPECIALTY 行、"PROPORTIONAL DELIVERY SCALE (WEEK 0 → WEEK 12)"、"MODEL 02 · VALIDATE ON REAL DATA"），折行后不可读。

**我会改的：**
1. 字号收敛到 9 级：68 / 48 / 32 / 24 / 20 / 18 / 16 / 14 / 12。禁止 11px 和 13px。次级标题统一 32px。
2. 等宽字只留两种用途：两三个词以内的编号标签（12px，0.08em，可大写）和纯数字指标。整句、人物专长、页脚标题都回到 Inter。
3. 含中文的字符串不用等宽类，并给字体栈补中文后备。
4. 标签颜色从 6 种减到 2 种：品牌青，加一种表示"人工关卡"的琥珀。
5. Manrope 300 只用于 H1；H2 用 400；字距按字号分档。
6. 黑底和白底使用同一字重，不靠加粗补对比度，靠提亮颜色。
7. 把编号标签语法、连接号、时间单位、大小写、"&"、分隔符这六条写成规范。
8. 中文标题建立断行机制；英文标题补不换行空格。

---

## 4. 建议重写的 15 句英文（现状 → 建议）

1. " cited proposal and report drafts in as little as 15 minutes" → "Cited proposal and report drafts in as little as 15 minutes"
2. "Routine inquiries handled & avg response" → "Routine inquiries resolved automatically; average response time"
3. "Compare models & take the 3-step selector" → "Compare models and find your fit in three questions"
4. "Book a 30–45 minute call with a sample of your current work to assess source readiness, timeline and expected impact." → "Book a 30–45 minute call and bring one sample of the work. We'll assess source readiness, timeline and expected impact."
5. "Note: Client interface shown in production Chinese as deployed for the client's working team; annotations on the right translate each workflow module." → "Note: The interface is shown in Chinese, as deployed for the client's team. The numbered annotations explain each module in English."
6. "Missing mandatory sections or unstressed financial assumptions had to be caught manually under tight deadlines." → "Missing mandatory sections and untested financial assumptions had to be caught by hand, under deadline."
7. "Writers shifted their time from hunting down source files to sharpening investment arguments, generating cited first drafts within 15 minutes for senior review." → "Analysts now spend their time sharpening the investment argument, not hunting for source files. A cited first draft is ready for senior review in 15 minutes."
8. "Engineering and maintaining AI tools teams rely on every day" → "We build and maintain the AI tools your teams use every day"
9. "Choose isolated SaaS hosting or Docker private deployment" → "Run it in our isolated cloud or inside your own environment"
10. "Five stages from initial work-sample review to ongoing upkeep" → "Five stages, from first sample review to ongoing support"
11. "Start with a custom build, a scoped pilot or managed delivery" → "Three ways to start: custom build, scoped pilot or managed service"
12. "Consistent budget speed at turn 100 as at turn 1" → "As fast at turn 100 as at turn 1"
13. "< 2w first batch → Continuous Cyano ops + QA" → "First batch in under 2 weeks → ongoing operation and QA by Cyano"
14. "Our three models differ clearly in timeline, ownership and who runs operations." → "The three models differ in timeline, ownership and who runs the system day to day."
15. "100% of core team members have Fortune Global 500 engineering experience, hands-on AI model R&D backgrounds and 6+ years building software—with systems running across 6 industries." → "Four founders, each with 6+ years in software, hands-on AI model R&D and Fortune Global 500 engineering experience. Systems in production across six industries."

> 执行者注：第 15 条改写里的 "Fortune Global 500 engineering experience" 沿用了 v2 新增的 "engineering"，事实表只写“曾任职于世界 500 强企业”。采用前需按事实表改为 "Fortune Global 500 experience"。

---

## 5. 未阅读的页面和截图

**必读清单内未读（7 张）：**
- 英文：`en-engagement-d-08`、`en-about-d-06`、`en-article-d-08`
- 中文：`zh-case-proposal-d-09`、`zh-technology-d-07`、`zh-technology-d-08`、`zh-about-d-06`

这 7 张都是各页最后一两屏，按页面结构推断是 CTA 和页脚。同一组 CTA 和页脚已在其他六个页面读过。

**必读清单外未读：**
- 整页未读：`en-cases-d-*`、`zh-cases-d-*`、`zh-services-d-*`、`zh-solution-doc-d-*`、`en-case-wiki-d-*`、`zh-engagement-d-*`、`en-insights-d-*`、`zh-contact-d-*`
- 部分未读：`zh-article-d-05`～`07`、`en-home-mobile-11`～`25`、`en-case-proposal-mobile-09`～`15`、`zh-home-mobile-09`～`23`
- 移动端整页未读：`zh-case-proposal-mobile-*`、`en-technology-mobile-*`、`en-engagement-mobile-*`、`zh-about-mobile-*`、`en-contact-mobile-*`、`en-services-mobile-*`
- 全部 `*-home-heroframe-*` 帧

**其他未核实项：**
- 没有逐条比对内容 JSON 里的全部字符串；引用的英文以截图渲染为准，只有第 1 条核对了源文件。
- 第 18 条的成因是推测。
- 所有字体回落判断基于这批 Windows 截图。
