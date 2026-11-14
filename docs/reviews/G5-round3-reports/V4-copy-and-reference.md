# V4 · 文案排版评审（R-COPY）与竞品资料吸收方案

评审日期：2026-11-13
评审范围：`docs/reviews/G5-round3-screens/` 中指定的全部桌面与手机截图；`site/content/v1/*`、`site/content/v3/pages/*`、`site/app/styles/*`（只看与排版相关的规则）；方案 §0.2、§0.3、§0.4、§3.1–3.6；`content/sources.md`；竞品资料 A-01…A-08、B-01…B-13、C-p01…C-p21 与 `C.txt`。
只读评审，项目内只写了本文件。

> 引用说明：按版权规范，竞品原文全文只直接引用 1 处（≤15 字）。其余例子用“截图编号 + 转述”指明位置，团队打开对应切片即可看到原文。

---

## 1. R-COPY 评分

通过线：每维 ≥ 5，均分 ≥ 6。**中英文均未通过。**

| 维度 | EN | ZH | 理由 |
|---|---|---|---|
| 一眼看懂（标题串读成论证） | 4 | 4 | 首页标题串起来是：Custom AI for your everyday work → Experience in AI models and enterprise software → Four problems we solve → Client projects → What does AI need to work in a business? → Custom development, pilots and managed services → The founding team → Project notes… → Tell us about your workflow。这一串是栏目名，读不出“你的问题 → 我们的解法 → 证据 → 下一步”。“Four problems we solve / 我们解决的四类问题”下面列的是四个产品名，标题和内容对不上。 |
| 分量感 | 4 | 4 | 案例数字有分量（15 分钟、99%、80%、<3s），但都排在第 3 屏以后。首屏只有一句泛泛的定位和服务清单。展示字体 300 细体，中文也落到 300，深色底上像发丝线，压不住版面。 |
| 具体 | 5 | 5 | 案例和方案详情页很具体：系统名、周期、行业、截图、在线 Demo 都有。首页、技术页、关于页的导语停在“我们做什么”，很少写“你会得到什么”。 |
| 可信 | 5 | 5 | 真实截图、3 个在线 Demo、NDA 演示、脱敏说明、基准测试星号都在加分。扣分点有两个：案例“项目成果摘要”配了大引号图标，看起来像客户原话；技术页曲线标着“示意数据，不是内部基准”，反而削弱了旁边的真实基准数字。 |
| 行文质量 | 5 | 5 | 中英文都干净准确，没有空话。问题是太平、偏说明书口吻（“这里介绍……”“We assess…”），句子都对，但没有一句让人想转发给老板。英文有几处小毛病：首字母小写、拼写不统一、“up to”悬在数字后面。 |
| 一致性 | 4 | 4 | “How we work”同时是导航页名和关于页的小节名；单位小字和标签重复（6 industries / Industries in production）；中文页残留英文大写（CYANO CORE、关于 CYANO、02 / CYANO）；方案 §3.3 已定的全站收尾口号“先诊断，再交付，长期负责。”全站没有出现；联系页底部还挂着“去联系页”的 CTA。 |
| **均分** | **4.5** | **4.5** | 未达 6。 |
| 附加：排版工艺 | 4 | 3 | 手机首屏文字重叠；关于页一个 h2 几乎不可见；中文标题系统性断词；中文小字只有 12px；中英文混排的 chip 基线不齐。 |
| 附加：易读性 | 4 | 4 | 正文行距 1.9–2.0，手机上像双倍行距，段落散；12px 灰字在浅灰底上偏弱；FAQ 全部折叠，扫读时只看得到问题。 |
| 附加：击中力 | 3 | 3 | 忙碌的决策者扫一遍，能知道“这是一家做定制 AI 的工程团队、团队背景不错”，但不会产生“这说的就是我”。原因是全站没有用他的语言说出他的痛点，第一眼也看不到“2 天 → 15 分钟”这种对比结果。竞品资料恰好在这一项上很强，见第 3、4 节。 |

---

## 2. 问题清单（排版在前，英文在前）

### A. 排版与版式

**A1 【严重】手机首屏文字重叠（EN/ZH）**
- 位置：`en-home-mobile-02`、`zh-home-mobile-02`，Hero 卡片底边。
- 现象：英文的 eyebrow 条 “CUSTOM DEVELOPMENT · PILOTS · MANAGED SERVICES” 叠在 “View full screen” 按钮和聊天气泡文字上；中文的 “定制开发 · 试点 · 托管服务” 压在 “15 分钟” 指标上，两层字都读不出。
- 修改：≤768px 时，这条 hero-footer（连同 “SCROLL TO EXPLORE / 向下探索”）改为 `position: static`，放在 Hero 卡片之后，上边距 24px；或者手机端直接隐藏。建议把它换成第 4 节 H-1 的“证据条”。

**A2 【严重】关于页小节标题几乎不可见（EN/ZH）**
- 位置：`en-about-d-03` 的 “OUR SERVICES” 区块（“Designed around your sources and process.”），`zh-about-d-03` 的 “服务范围” 区块（“按你的资料与流程，设计合适的系统。”）。
- 根因：`v3-foundation.css` 里 `.name-story h2{color:var(--p3)}` 是给深色底设计的（#e8eef0）；`v3.css` 把 `.name-story` 背景改成了浅色 `var(--p1)`（#f8fafa），却没有改 h2 颜色。两个文件里的字号也互相冲突（48px，以及 32px/1.5）。
- 修改：`.name-story h2{color:var(--ink);font-size:40px;line-height:1.2;font-weight:450}`，中文改为 `line-height:1.3`。

**A3 【重要】展示字重过细，分量感不足（EN/ZH）**
- 位置：全站 h1/h2，例如 `en-home-d-01`、`zh-home-d-01`、各页 Page Hero。
- 现象：`.hero-content h1{font-size:68px;font-weight:300}`。Manrope 300 在 68px 下勉强成立；中文落到 Noto Sans SC 300，深底上偏虚，看起来像“临时稿”。
- 修改：
  - 英文 h1 用 Manrope 500，`letter-spacing:-0.025em`，`line-height:1.05`；h2 用 450–500。
  - 中文 h1 用 Noto Sans SC 500，`letter-spacing:0`，`line-height:1.25`；h2 用 500，`line-height:1.3`。中文不要用负字距。

**A4 【重要】正文行距过松（EN/ZH）**
- 位置：`en-home-mobile-02/03` 的 “WHO WE ARE” 正文，`en-about-d-03` 的创始人简介。
- 现象：`v3-foundation.css` 里有 11 处 `line-height:1.9`、6 处 `2`、3 处 `1.95`。段落被拉散，眼睛找不到下一行；手机上一屏只剩 8–9 行字。
- 修改：
  - 英文正文 17px/1.6，手机 17px/1.55。
  - 中文正文 16px/1.75，手机 16px/1.7。
  - 卡片说明英文 15px/1.55，中文 15px/1.65。
  - 段宽英文 ≤ 68ch，中文 ≤ 36em。

**A5 【重要】数字条的单位与标签重复、错位（EN，ZH 同）**
- 位置：`en-home-d-02`、`en-about-d-02`、`zh-home-d-02`。
- 现象：“6+ years”“6 industries”的单位小字离数字约 40px，像漂在空中；“6 industries / Industries in production”同一个词说了两遍。中文“6 个 / 已服务行业”也一样。
- 修改：数字只写 “6+” 和 “6”，单位并进标签。
  - EN：“6+ — years of engineering, minimum, for every core member”；“6 — industries with systems in production”。
  - ZH：“6+ 年 —— 每位核心成员的最低开发经验”，“6 —— 个行业已有系统上线”。
  - 单位如果保留，与数字基线对齐，间距 4px，字号取数字的 0.32 倍。

**A6 【重要】“Click to enlarge / 点击放大”半透明压边（EN/ZH）**
- 位置：`en-case-proposal-d-03`、`zh-case-proposal-d-03`，截图右下。
- 现象：胶囊按钮横跨深色截图和浅色画框边界，白字落在浅底的那一半读不出。
- 修改：按钮整体放进截图内侧，右下各留 16px；背景 `rgba(7,11,15,.72)`，加 `backdrop-filter: blur(6px)`，白字 14px。

**A7 【一般】行业标签框换行（EN）**
- 位置：`en-home-d-04`、`en-home-mobile-05/06`。
- 现象：“Professional Services & Research”“Engineering & Manufacturing”在带边框的小标签里折成两行，和右侧指标挤在一起。
- 修改：行业改成无框的 12px 大写 eyebrow（`letter-spacing:.08em`），单行显示，指标换到下一行左对齐。

**A8 【一般】基准星号漂离数字（EN/ZH）**
- 位置：`en-technology-d-04`、`zh-technology-d-04`。
- 现象：“* ”浮在数字右上方约 20px。
- 修改：`sup{font-size:.38em;vertical-align:.9em;margin-left:2px}`，让星号紧贴数字。

**A9 【一般】手机方案标签三行折断（EN）**
- 位置：`en-home-mobile-03`，“Four problems we solve”两列网格。
- 现象：“Knowledge & / Internal / Assistants” 折成三行。
- 修改：手机端改为单列，每项 20px/1.3，编号与标题同行。

**A10 【一般】手机案例卡截图只剩一条细带（EN/ZH）**
- 位置：`en-home-mobile-05/06`、`zh-home-mobile-05/06`。
- 现象：截图区高约 40–60px，内容不可辨认，等于没有放图。
- 修改：手机截图区最小高 200px，`object-fit:cover`，`object-position` 对准关键区域（例如 IT 助手对准 80% 和 <3s 卡片，标书系统对准右侧初稿）。

**A11 【一般】三篇洞察卡用同一张示意图（EN/ZH）**
- 位置：`en-home-d-07`、`zh-home-d-07`。
- 现象：三张卡用同一张节点线图，看起来像模板没填完。
- 修改：每篇改用对应系统的真实截图裁切（标书初稿、Wiki 来源引用、合作方式对比表），或者至少换三种不同的示意构图。

**A12 【一般】英文页日期格式（EN）**
- 位置：`en-home-d-07`。
- 现象：“2026.11.10”是中文习惯。
- 修改：改为 “Nov 10, 2026”。

**A13 【一般】面包屑大小写混用（EN/ZH）**
- 位置：`en-services-d-01` “Home / SOLUTIONS”，`en-engagement-d-01` “HOW WE WORK”，`en-contact-d-01` “LET’S TALK”，`zh-technology-d-01` “首页 / CYANO CORE”，`zh-about-d-01` “关于 CYANO”。
- 现象：面包屑直接沿用了 eyebrow 的全大写。
- 修改：面包屑用页面名，英文句首大写（Solutions / How we work / Contact），中文用导航名（方法与技术 / 关于我们）。

**A14 【严重】中文标题系统性断词（ZH）**
- 位置与现象：
  - `zh-home-d-04`：“AI 处理 80% 常见咨 / 询”
  - `zh-home-d-07`：“企业知识库需要怎样 / 的检索……”、“……智能 / 标书系统……”
  - `zh-home-mobile-03`：“文档、标书与方 / 案自动化”、“企业知识库与内 / 部助手”、“销售与客户咨询 / AI”
  - `zh-home-mobile-05`：“把方案初稿从两 / 天缩短到 15 分钟”
  - `zh-home-mobile-06`：“企业使用 AI，需 / 要处理哪些问题？”
- 根因：中文 h1–h4 没有设置断行策略。
- 修改：
  1. 中文 h1–h4 加 `text-wrap:balance; line-break:strict;`。
  2. 在文案 JSON 里给语义词组包 `<span class="nw">`（`white-space:nowrap`），例如“常见咨询”“智能标书”“方案自动化”“内部助手”“两天”“需要”。v3 页面已支持 `\n`，长标题也可以手工给断点，例如“AI 处理 80% 常见咨询，\n平均响应低于 3 秒”。
  3. 不要对中文全局用 `word-break:keep-all`，否则整句不换行会溢出。

**A15 【重要】中文首屏“AI。”成孤行（ZH）**
- 位置：`zh-home-d-01`、`zh-home-mobile-01`。
- 现象：标题排成“为企业开发 / 日常工作用得上的 / AI。”，最后一行只有“AI。”。
- 根因：`.hero-content h1{max-width:12ch}`。`ch` 按拉丁字符“0”计宽，不适用于中文。
- 修改：中文改用 `max-width:9em`，并手工断为“为企业开发\n日常工作用得上的 AI。”。

**A16 【重要】中文小字只有约 12px（ZH）**
- 位置：`zh-home-d-02` 行业条，`zh-home-d-05` 卡片 eyebrow（自有系统 / 小范围试用），`zh-home-d-07` 日期与作者，`zh-case-proposal-d-03` “过去 / 现在”。
- 现象：中文 12px 笔画发糊；英式大字距（约 .12em）放在中文上还会显得散。
- 修改：中文 meta 最小 13px，eyebrow 14px、字重 500、`letter-spacing:.04em`；“过去 / 现在”标签至少 14px。

**A17 【一般】中英混排 chip 基线不齐（ZH）**
- 位置：`zh-technology-d-04`。
- 现象：“通义千问”“飞书”“钉钉”“企业微信”比拉丁 chip 低约 2px。
- 修改：chip 用 `display:inline-flex;align-items:center;line-height:1;height:56px`；也可以给中文子集字体加 `ascent-override/descent-override`，与 Inter 对齐。

**A18 【一般】新增中文文案需要重跑字体子集（ZH）**
- 位置：`cjk-font.css` 由 `scripts/subset-font.mjs` 自动生成。
- 现象：本报告第 4 节的新文案会引入子集外的字（例如“诊”“挑”，当前两个子集文件的 unicode-range 都不含），这些字会回退到微软雅黑，造成同一行里混用两种字形。
- 修改：每次改中文文案后，把重跑子集脚本加入构建检查。

### B. 文案

**B1 【严重】“项目成果摘要”做成了引语样式（EN/ZH）**
- 位置：`en-case-proposal-d-04`、`zh-case-proposal-d-04`。
- 现象：第三人称的成果摘要配了大号右引号图标和左侧弧线，视觉上等于“客户评价”。方案 §3.6 的红线不允许虚构带引号的客户原话；§0.4 规定引语只能来自 `testimonials.json`。
- 修改：删掉引号图标，改成“成果条”样式：左侧 2px 青色竖线，上方放大号指标“2 天 → 15 分钟”，下方保留原句“上线后，该机构的撰写团队……”。

**B2 【重要】标题承诺“问题”，内容给的是产品目录（EN，ZH 同）**
- 位置：`en-home-d-02/03` “Four problems we solve”，下面列的是 Sales & Customer AI 等四个方案名；`zh-home-d-02/03` “我们解决的四类问题”同样如此。
- 修改：二选一。
  - 改标题：EN “Four kinds of work we take off your team’s plate”；ZH “四类最先交给 AI 的工作”。
  - 或者改条目，用 v1 已定的痛点做条目名：
    - EN：“Customers wait for an engineer” / “A proposal takes two days” / “Staff ask IT the same questions” / “Every number goes through the IT queue”
    - ZH：“客户问题要等工程师回复” / “一份方案初稿要两天” / “员工反复问 IT 同样的问题” / “查一个数要等 IT 导数”

**B3 【重要】首屏没有结果证据（EN，ZH 同）**
- 位置：`en-home-d-01`。
- 现象：“Custom AI for your everyday work.” 加一段服务清单，没有一个结果数字。最好的证据（15 分钟、80%）要滚到第 4 屏才出现。
- 修改：H1 维持负责人认可的版本，在 CTA 下加一条证据条（示范稿见第 4 节 H-1）。
- 另需负责人决定：方案 §3.3 已定的首页主标题是 “Turn your company’s knowledge into AI that ships. / 将企业知识，转化为可交付的 AI 生产力”，与 v1 定稿 H1 不同，请明确以哪一版为准。

**B4 【重要】联系页条目首字母小写（EN）**
- 位置：`en-contact-d-01/02`，Topics to discuss 三条：“review goals, process…”、“arrange a demo…”、“data access, permissions…”。
- 原因：v1 原句以破折号连接，拆成“标题 + 说明”后没有调整大小写。
- 修改：改为 “Review goals, process, data and costs to choose between a custom build, a pilot or a managed service.” / “Arrange a demo relevant to your business. Full walkthroughs require an NDA.” / “Data access, permissions, private deployment, model choice and maintenance.”

**B5 【重要】拼写不统一（EN）**
- 位置：`en-home-d-01` Hero 卡片写 “anonymised”，案例页写 “anonymized”。
- 修改：北美客户为主，全站统一用美式拼写 “anonymized”。

**B6 【重要】技术页指标表述（EN/ZH）**
- 位置：`en-technology-d-04`、`zh-technology-d-04`。
- 现象 1：“40% / Lower token cost, up to”，“up to”挂在标签末尾，扫读时会读成固定的 40%。
- 现象 2：v1 定稿里“< 200ms —— 响应延迟，第 1 轮与第 100 轮一样快”这一句被缩成了“Response latency”，丢掉了最有冲击力的半句。
- 修改：
  - 数字写 “Up to 40%”，标签写 “lower token cost”；中文数字写“最多 40%”，标签写“Token 成本降低”。
  - 延迟恢复 v1 原句：EN “as fast at turn 100 as at turn 1”；ZH “第 1 轮与第 100 轮一样快”。

**B7 【重要】“How we work”一词两用（EN）**
- 位置：导航 “How we work” 指合作方式页；`en-about-d-04` 的原则小节标题也是 “How we work”。
- 修改：关于页小节改为 “Our principles”，或用承诺式标题 “Four rules every project follows”。

**B8 【重要】全站同一个收尾 CTA，联系页还指向自己（EN/ZH）**
- 位置：每页底部的 “Tell us about your workflow”；`en-contact-d-03` 在联系页底部仍放“Discuss your project”，指回当前页。
- 修改：按页面换收尾。
  - 案例页用已定的 D.1 案例 CTA：“Book a confidential demo · Get the full case book”。
  - 技术页用已定的 D.6 收尾：“Talk to our CTO about your data and deployment requirements.”
  - 联系页去掉收尾条。
  - 首页收尾改用 §3.3 口号：“Diagnose. Deliver. Sustain. / 先诊断，再交付，长期负责。”

**B9 【一般】创始人简介四段重复同一组事实（EN，ZH 同）**
- 位置：`en-about-d-03`、`zh-about-d-02`。
- 现象：四段都写“世界 500 强 / 6 年以上 / AI 模型研发”。这组事实上方数字条已经讲过，重复四遍反而显得是凑字。
- 修改：在卡片组上方用一句话统一交代团队背景，每张卡只写这个人负责的事，例如 CTO：“主导 Cyano Core 架构：长上下文管理、知识检索与 Agent 任务编排。”

**B10 【一般】SaaS 与私有化部署用了同一个图标（EN）**
- 位置：`en-engagement-d-03`。
- 修改：SaaS 用云图标，私有化用“服务器 + 锁”图标。

**B11 【一般】FAQ 全部折叠（EN，ZH 同）**
- 位置：`en-engagement-d-04`、`en-solution-doc-d-04`。
- 现象：决策者扫读时只看得到问题。答案恰恰是全站最能打消顾虑的内容，比如“效果不达预期可以停”。
- 修改：默认展开前 3 条；其余条目在问题下显示一行灰色答案摘要。

**B12 【一般】已定稿的强素材没有上线（EN/ZH）**
- D.6 对比表（知识来源 / 执行过程 / 模型接入 / 模型更换，每行“之前 → 之后”）在 v1 与 v3 都没有渲染。
- §3.3 收尾口号全站缺席。
- 修改：两项都已获批，可直接使用（位置见第 4 节 T-3、H-8）。

**B13 【重要】技术页导语是目录口吻（ZH，EN 同）**
- 位置：`zh-technology-d-01`。
- 现象：“这里介绍资料检索、上下文管理和任务编排的处理方法……”只告诉读者页面里有什么，没有给结论。
- 修改：示范稿见第 4 节 T-1。

**B14 【重要】案例“使用前后”没有做出对比焦点（ZH，EN 同）**
- 位置：`zh-case-proposal-d-03`、`en-case-proposal-d-03`。
- 现象：“过去 / 现在”两张卡的字号与正文相同，最关键的“2 天 → 15 分钟”埋在句子里。
- 修改：卡片上方加一条大号时间对比，示范稿见第 4 节 C-1。

**B15 【一般】眉标与内容不符（ZH）**
- 位置：`zh-about-d-03`，眉标“服务范围”下讲的是设计方法。英文 “OUR SERVICES” 同样不符。
- 修改：眉标改为“设计方法 / OUR APPROACH”。

**B16 【一般】中文页残留英文编号与大写（ZH）**
- 位置：`zh-home-d-04` 案例卡 “02 / CYANO”，`zh-technology-d-01` “CYANO CORE”。
- 现象：“02 / CYANO”是内部编号，对客户没有意义。
- 修改：编号删除或改为“案例 02”；中文页统一写“Cyano Core”“关于 Cyano”。

**B17 【一般】技术页曲线的免责小字削弱真实数字（EN/ZH）**
- 位置：`en-technology-d-03`、`zh-technology-d-03`。
- 现象：图下写“不是内部基准测试结果，也不代表项目性能承诺”，正好紧挨着真实基准数字（<200ms 等），读者容易连带怀疑真实数字。
- 修改：
  - 首选：用 `sources.md` core-benchmarks 的真实基准画图（第 1 轮与第 100 轮两点即可），只保留 “*基于 Cyano 内部基准测试” 一处脚注。
  - 如果真实数据不能出图，就去掉这张曲线，只留数字。
- 需负责人提供：基准测试各轮次的原始延迟数据。

**B18 【一般】联系页表单预选值（EN/ZH）**
- 位置：`en-contact-d-02`。
- 现象：“Inquiry type”默认选中“Requirements assessment”，“Preferred start”默认选中“Not sure yet”。用户不改就提交，会污染线索分类。描述框的示例文字用青色，看起来像已填写的内容。
- 修改：两个下拉框改为“请选择 / Select”空值，且咨询类型设为必选；示例文字改为 `--muted` 灰色斜体。

---

## 3. 竞品资料拆解

### 3.1 为什么容易击中用户：一句话结论

对方几乎每一节都在回答买方脑子里**已经有的问题**，而不是介绍自己。

1. 开篇就替买方问出“选谁”。
2. 把买方说不出口的顾虑（怕出事、钱不够、员工不会用、怕落后）命名成四个短词。
3. 主动替买方做横向比较，并由自己定比较维度。
4. 每一节结尾用一句话收束，方便买方转述给领导。
5. 用买方口吻提出反对意见，再一条条拆掉。

内容不一定高级，但**信息结构完全按买方的决策顺序排**。Cyano 现在是按自己的组织结构排（团队 → 方案 → 案例 → 技术 → 合作），这是击中力只有 3 分的根本原因。

### 3.2 表达模式表

| # | 模式 | 对方原例（位置 + 转述） | 为什么起作用 | Cyano 能否用 |
|---|---|---|---|---|
| P1 | **开篇提问**：首屏 H1 就是买方心里的评估问题 | A-01 主标题后半句：“政企客户到底该选谁？”；B-12 收尾也是问句（问对方是否准备好让 AI 干活） | 买方处在“比较阶段”，问题式标题把页面定位成“帮你做决策的材料”，而不是广告，读者会带着问题读下去 | 可以。用 Cyano 客户的真问题，见 H-2、S-1、E-1 |
| P2 | **痛点命名**：用三字短词给顾虑分类，卡内直接给答案 | B-02/03 四张深色卡，分别命名为不敢用、用不起、用不好、跟不上（对应安全、成本、会不会用、怕落后），每卡底部嵌一个带勾的应对框 | 四个词覆盖了“不买的全部理由”，好记、能复述；问题与答案在同一张卡里，一眼闭环 | 可以，换成 Cyano 自己的四个词（来自 v1 四个痛点），见 H-2 |
| P3 | **市场诊断（现象卡）**：先描述行业乱象，再出场 | A-01/02 四张编号“现象”卡：大厂只卖能力、开源不等于能用、公有云不敢碰、自建周期长 | 把自己放在“分析师”位置，先建立判断力再推销 | 部分可用：只描述“做法类型”，**不点名**，见 H-4 |
| P4 | **≠ 句式**：两个名词对立，改写评估标准 | A-03 四张卡：模型能力≠落地能力、部署交付≠产品交付、技术指标≠客户价值、单点能力≠整体方案 | 一个符号压缩一整段论证，并悄悄把比较标准换成对自己有利的那一项 | 可以，写 Cyano 自己的对立项，见 S-3、T-2 |
| P5 | **类比** | A-06/07 用食材供应链比喻各类厂商与自己（面粉 / 小麦 / 烤箱 / 餐厅）；B-03 把四层架构比作发动机、大脑、操作系统、即战力；B-05 把数据比作放在自家保险柜 | 不懂技术的领导能拿去向上汇报；类比在组织内部会被二次传播 | 可以，但只用一个贯穿全站的类比，见 H-5 |
| P6 | **同类方案对比表** | A-04 九个维度 × 五类方案、B-10/11 九个维度 × 三条路线；自己那一列高亮，对手格子用勾 / 叉 / 橙色“需自行……”；表下一句结论 | 买方本来就在比；替他比，就拿到了“定标准”的权力。把“自建”也列为竞争方案，因为那才是真正的替代选项 | 可以，但对比的是“做法”而不是“品牌”，并且只写可核实的事实，见 H-4、E-4 |
| P7 | **证据堆叠 + “也就是说”翻译** | B-01 年份 / 年限 / 参展三个大数字；B-01/02 证书卡每张都接一句“也就是说，……”把资质翻译成买方利益；客户名胶囊墙；页脚重复资质 | “也就是说”是最值得学的一招：证据本身不打动人，翻译成“对你意味着什么”才会 | 可以学“也就是说”；奖项、资质、客户名墙不能学（红线），见 H-6 |
| P8 | **场景卡 + “之前 → 之后”时间标签** | B-08…B-10 共 16 张编号卡：场景名 + 部门标签 + 带具体数量的操作描述 + 底部闪电小标签，写成“X 小时 → Y 分钟” | 部门标签让读者 1 秒找到“我那张”；具体数量让场景显得真实；底部时间标签是扫读时唯一要记住的东西 | **最该学**。Cyano 的 6 个案例天然就是这种卡，见 H-3、S-2、C-1 |
| P9 | **异议处理：FAQ 用买方原话提问** | B-11/12 七条带引号的问题：免费模型不够用吗、IT 说能自己搭、数据敏感、员工不会用、能不能便宜、太新不急、性能够不够；先认同（“理解”“谨慎是对的”）再拆解；全部展开 | 这些正是会议室里真实出现的反对意见。书面上提前回答，销售拜访就从“解释”变成“确认” | 可以写买方口吻的问题，但**不加引号、不署名**，不能写成客户原话，见 E-5 |
| P10 | **行动号召与落地路径** | C-p20 三步路径（试点 → 拓展 → 全面推广），写明起步部门和起步规模；A-07、B-12 用“预约演示，亲眼看区别”收尾 | 把“买不买”拆成“先试一小步”，降低决策门槛，同时让人看到终点 | 可以，Cyano 有现成事实（1 周 → 2–6 周 → 6–12 周），见 E-2 |
| P11 | **数字用法** | B-05 一排巨号数字（百分比、0、无穷符号、10+）；B-05 列出“自建”的设备、年薪、周期成本；场景卡里的“3 分钟”“5 分钟” | 数字做标题比形容词快；**列替代方案的成本**，会让自己的价格显得小，而不用报价 | 数字做标题可以学；替代方案成本必须由负责人提供；“无穷”“无限”这类不可证数字不能学 |
| P12 | **每节一句结论条** | A、B 每节末尾都有一条左蓝线的大字总结 | 扫读者只读这些也能拿到全部论点 | 学结构，但**不能做成引语样式**（与 B1 同理），改成“结论条” |
| P13 | **语气** | 第二人称“您”；口语化；绝对化（只有我们、唯一）；制造紧迫感（被甩开） | 亲切、敢下结论，读起来像销售在面前说话 | 学亲切和敢下结论；不学绝对化和恐吓。Cyano 全站用“你”，保持不变 |

### 3.3 版式形式表

| 形式 | 对方做法（位置） | 借鉴价值 |
|---|---|---|
| 固定小节节奏 | 每节都是：大标题（问题或结论）→ 短色线 → 一行副题 → 卡片 / 表格 → 结论条（A、B 全篇） | **高**。Cyano 现在每节节奏不一，统一后扫读成本大降 |
| 痛点卡内嵌答案 | 问题标题 + 现象 + 卡底应对框（B-02/03） | **高** |
| 编号场景卡 + 时间对比 chip | 编号、部门 pill、正文加粗关键数、底部时间 chip（B-08~10） | **高** |
| 高亮自己一列的对比表 | 自己那列表头实色，勾 / 叉 / 中间态三色（A-04、B-11、C-p13） | **高**，但换成 Cyano 的冷色单色体系 |
| “我方 vs 自建”双卡 | 左卡打叉列成本，右卡打勾列交付（B-05） | 中。Cyano 缺可公开的成本数字，暂不做 |
| 大数字条 | 3–4 个巨号数字 + 一行标签（B-01、B-05、B-06） | 中。Cyano 已有，问题在于摆放位置（应进首屏） |
| FAQ 全展开 | 加粗问题 + 左竖线答案，不折叠（B-11/12） | **高** |
| 三步路径卡 | 01→02→03 横排带箭头（C-p20） | **高** |
| 输入 → 系统 → 输出图 | 左列资料类型 → 中间 AI → 右列成果（C-p11） | 中高。Cyano 可以用真实资料名和真实成果名画一张 |
| 等式图 | 模型 + 应用 + 数据 = 生产力（C-p09） | 中。可改成“你的资料 + 你的流程 + 合适的模型 = 能上线的系统” |
| 深浅分段 | 深色段与浅色段交替（A、B） | Cyano 已有 |
| 幻灯片页眉 | 英文大字距 eyebrow + 中文标题 + 一行副题（C 全篇） | Cyano 已有类似体系 |

### 3.4 不能照搬的清单

**A. 与硬性规则（§0.2 / §3.6）冲突**

1. **极限词**：对方大量使用“唯一”“最懂”“最高等级”“全国第一台”“最优选择”“只有我们”（A-05~08、B-01/02、C-p03）。这些属于 §3.6 红线，不写。
2. **保证性承诺**：对方写数据永远不出门、合规无忧、当天可用、核心逻辑 100% 不被外部模型学习、安心使用无顾虑等（B-02~05、C-p20）。
   - Cyano 只能写已定稿的事实性描述：“支持私有化部署，数据不出你的环境”（D.4）。
   - 不写“保证 / 永远 / 无忧 / 确保”。
3. **资质、奖项、认证、证书墙**：C-p19、B-01/02 的整套做法，§3.6 红线明确不设资质 / 奖项模块。
4. **客户名称墙**：B-02 的机构名胶囊墙违反 R9（客户名不写进网站）。Logo 墙只能来自 `clients.json`，当前不存在。
5. **客户原话**：对方 FAQ 用带引号的“客户原话”。Cyano 可以写买方口吻的问题，但不加引号、不署名、小节标题用“你可能会问”，不能伪装成真实客户发言。所有引语只能来自 `testimonials.json`。
6. **不可核实的数字**：效率提升 20 倍、三年总成本 5–10 倍、自建设备与年薪成本、数十家客户、上百人并发等，Cyano 一概不能套用。凡是需要“替代方案成本”的地方，标“需负责人提供”。
7. **部署位置**：R7 规定不提服务器所在地和云厂商，“内网 / 机房”类措辞也尽量避免，只讲“SaaS 托管 / 私有化部署”。

**B. 与 Cyano 业务不同**

1. **标准化、开箱即用、当天可用**：对方卖的是预装一体机加年费订阅；Cyano 是“先诊断、再交付”。照搬“开箱即用”会直接否定 Cyano 的第二支柱。Cyano 的对等表述是“1 周诊断结论、2–6 周首个可用版本”。
2. **硬件、坐席、无限 Token、信创适配**：Cyano 没有这些产品属性，不写。
3. **“项目制周期长”的攻击**：对方在 A-06 把“项目制”当成缺点批评。Cyano 恰恰是定制工程，不能自我否定；应把“定制”写成优势（用你的资料、你的流程），并用试点消解“周期长”的顾虑。
4. **“十余年只做政企”式的年限背书**：Cyano 的硬事实是“每位核心成员 6 年以上”，不是公司成立年限（`sources.md` team-experience 的 salesAnswer 明确如此）。不能写成公司历史。

**C. 点名竞争对手的风险**

1. A-02、A-04 点名评价百度、阿里、华为、科大讯飞、字节跳动、DeepSeek、智谱等，并附负面判断。
   - **法律风险**：《广告法》第 13 条（广告不得贬低其他生产经营者的商品或服务），《反不正当竞争法》关于商业诋毁的规定。比较广告内容不实或片面，还会构成虚假宣传。
   - **业务矛盾**：Cyano 在技术页列出“支持 OpenAI GPT、Claude、Gemini、DeepSeek、通义千问、Llama”，§3.4 第⑥条是“模型无关”。一边接入、一边贬低，自相矛盾；方案 §3.6 也禁止暗示与这些厂商存在合作关系。
   - **做法**：只按做法类型对比（员工各自用通用 AI 工具 / 企业自建 / 定制 + 维护），不出现任何品牌名、产品名。中间列的每一格由负责人确认措辞。
2. **恐吓式紧迫感**：例如 C-p05 的“被甩开”、C-p20 的“锁定 3–5 年领先窗口”。这不违反红线，但与 Cyano “成熟、有分量”的语气不符，而且“锁定窗口”接近效果保证，建议不用。

---

## 4. Cyano 吸收方案：按页面区块的示范稿

说明：
- 下列文案只使用 `site/content/v1`、方案 §0.3 事实表、`content/sources.md` 中的事实。
- 每条标出来源；凡需新事实，均标“**需负责人提供**”。
- 这些是**建议稿**，正文基线仍以负责人认可的 v1 为准；采纳哪条需负责人逐条批准，之后才能进入 `site/content`。

### 首页

**H-1 首屏证据条（新增；放在 CTA 下方，替代现有 “定制开发 · 试点 · 托管服务” 条，同时解决 A1）**
- ZH：方案初稿 **2 天 → 15 分钟** ｜ 常见 IT 咨询 **80%** 由 AI 处理 ｜ 试点 **2–6 周** 交付首个可用版本 ｜ **1 个工作日**内回复
- EN：Proposal drafts **2 days → 15 min** · **80%** of routine IT inquiries handled by AI · First working pilot in **2–6 weeks** · Reply within **1 business day**
- 来源：case-proposal-generation、case-it-knowledge-assistant、engagement-timing。每项可链接到对应案例。
- 注：H1 本身是否改用 §3.3 版本，需负责人决定（见 B3）。

**H-2 提问式痛点区（改造现有 “企业使用 AI，需要处理哪些问题？” 区块；对应模式 P1 + P2）**
- 标题
  - ZH：AI 工具人人都有了，日常工作为什么还没变快？
  - EN：Everyone has an AI tool. Why isn’t the work any faster?
- 副题
  - ZH：卡住企业的，通常不是模型，而是下面四件事。
  - EN：It’s rarely the model. It’s usually one of these four.
- 四张卡（短词 + 现象 + 卡内应对；内容来自 D.2 痛点 1–4）：
  1. **找不到 / Can’t find it**
     - ZH：产品资料、业务记录和操作经验散在不同文档与系统里。→ 接入并整理资料，按权限建立检索索引。
     - EN：Product information, records and procedures live in different documents and systems. → We connect them into one permission-aware index.
  2. **说不准 / Can’t rely on it**
     - ZH：一次能交给模型的信息有限，无关资料还会干扰回答。→ Cyano Core 按当前任务挑选相关资料与上下文。
     - EN：Each request has a size limit, and irrelevant material distracts the model. → Cyano Core selects the sources and context each task needs.
  3. **不敢交 / Can’t sign off**
     - ZH：生成内容可能出错，合同、财务类工作必须有人审。→ 在流程中加入规则校验、来源引用和人工审核。
     - EN：Generated content can be wrong, and contracts or finances need review. → Validation rules, citations and human approval are built into the workflow.
  4. **各用各 / Can’t repeat it**
     - ZH：每人写自己的提示词，做法和结果都不统一。→ 按企业 SOP 固定操作步骤，保留执行记录，团队重复使用。
     - EN：Everyone writes their own prompts, so methods and results vary. → Shared steps from your SOPs, with every run recorded.
- 结论条（不用引号样式）
  - ZH：资料、权限和审核流程，需要与模型一起设计。（沿用已定句）
  - EN：Sources, access controls and review steps have to be designed alongside the model.

**H-3 场景卡 + “之前 → 之后”标签（改造 “我们解决的四类问题” 与 “精选案例”；对应模式 P8）**

卡片格式：编号 · 场景名 · 部门标签 · 两句描述 · 底部时间对比 chip。六张卡对应六个真实案例：

| # | 场景（ZH / EN） | 部门标签 | 描述（ZH） | 底部标签 |
|---|---|---|---|---|
| 01 | 标书与方案初稿 / Proposal drafts | 方案·投标团队 / Bid team | 接入历史方案、知识文档和项目参数，生成带引用的初稿，自动执行 7 项完整性检查，再交人工复核。 | **2 天 → 15 分钟** / 2 days → 15 min |
| 02 | 内部 IT 咨询 / Internal IT questions | IT 支持 / IT support | 员工直接提问，拿到带出处的答案；复杂问题自动转人工。 | **排队等回复 → < 3 秒** · 80% 自动处理 / Queue → < 3 s |
| 03 | 查库存与销量 / Inventory & sales queries | 业务·运营 / Operations | 用一句话提问，返回表格与图表，不写一行 SQL。 | **等 IT 导数一天以上 → 秒级** / A day in the IT queue → seconds |
| 04 | 客户技术咨询 / Customer technical inquiries | 销售·售前 / Sales | 基于真实产品资料与项目记录即时回答，并为每位客户生成专属材料。 | **等工程师回复 → 7×24 应答** / Wait for an engineer → 24/7 |
| 05 | 房产收支整理 / Property accounts | 物业运营·财务 / Property ops | 从日常沟通中提取租赁、维修与管理费用，按房产生成账单与报告。 | **手工整理 → 自动生成账单** / Manual bookkeeping → auto-generated statements |
| 06 | 长篇设定管理 / Long-form story memory | 内容团队 / Content team | 百万字级设定按需调用，剧情分支互不干扰。 | **AI 记混设定 → 分支互不干扰** / Mixed-up characters → clean branches |

- 来源：v1 `cases.json` 的 beforeAfter / stats / profile。
- 部门标签由案例画像归纳，不是新事实，但措辞请负责人过目。
- 案例 03 的“一天以上”取自 beforeAfter 原句“等待一天甚至更久”。

**H-4 做法对比区（新增；首页或合作方式页二选一；对应模式 P3 + P6）**
- 标题
  - ZH：同样是“用上 AI”，三种做法差在哪？
  - EN：Three ways to “use AI”, and where they differ
- 表格：

| 维度 | 员工各自使用通用 AI 工具 | 企业自建团队 | Cyano：定制 + 持续维护 |
|---|---|---|---|
| 资料从哪来 | 员工手动提供 | 需自行建设检索与权限 | 按权限检索企业知识库 |
| 怎么执行 | 各自编写提示词 | 需自行开发流程 | 按 SOP 执行并记录步骤 |
| 结果怎么核 | 靠个人判断 | 需自行设计 | 规则校验 + 来源引用 + 人工审核 |
| 多久有可用版本 | 立即可用，但不接入业务资料 | **需负责人提供** | 试点 2–6 周首个可用版本 |
| 换模型时 | 逐项调整 | **需负责人提供** | 保留知识与流程，测试后再切换 |
| 上线后谁维护 | 无人负责 | 自有团队 | 三种合作方式都包含上线维护 |

- 来源：D.6 对比表行（已定稿未上线）、D.4 FAQ、engagement-timing。
- 中间两列只描述做法、不点名任何厂商，**每格措辞需负责人确认**。
- 结论条
  - ZH：差别不在模型，在于资料、流程和维护有没有人负责。
  - EN：The difference isn’t the model. It’s who owns the sources, the workflow and the upkeep.

**H-5 合作方式：一个贯穿全站的类比（对应模式 P5）**
- 事实表已有“买工具 / 买使用权 / 买结果”三分法，直接放大成卡片眉标：
  - **买工具｜完整定制开发**：系统归你，6–12 周首期上线。EN：Own the tool — the system is yours; first release in 6–12 weeks.
  - **买使用权｜低启动试点 + 持续服务**：先做小范围版本，2–6 周可用，看效果再扩。EN：Try it first — a smaller working version in 2–6 weeks; expand on results.
  - **买结果｜托管式 AI 服务**：你给资料和标准，我们运行、审核、交付，首批 2 周内。EN：Buy the outcome — you supply sources and standards; we run, review and deliver, first batch within 2 weeks.
- 可选的形象类比：“建一条自己的产线 / 先开一个工位试产 / 委托代工按批交货”。属于风格选择，**需负责人决定**是否使用。

**H-6 团队数字 + “也就是说”（对应模式 P7）**
- **6+ 年** 每位核心成员的最低开发经验
  - ZH：也就是说，需求、开发和上线维护，由同一个资深核心团队负责。（D.7：团队共同负责需求分析、开发和上线维护）
  - EN：In practice: the same senior team handles requirements, build and post-launch support.
- **100%** 核心成员参与过 AI 模型研发
  - ZH：也就是说，既懂模型怎么工作，也懂企业系统怎么上线。（D.2 宣言句）
  - EN：In practice: we understand both how models behave and how enterprise systems go live.
- **100%** 核心成员有世界 500 强企业经历
  - ZH：也就是说，大型组织的协作方式与上线要求，我们在其中工作过。
  - 这一句是从事实推出的结论，**措辞需负责人确认**。
- **6** 个行业已有系统上线
  - ZH：工程制造、投研、物业、零售、企业服务、内容传媒。

**H-7 首页 FAQ 精选三条（新增，链接到合作方式页 FAQ）**
- 问题：数据很敏感，能放在我们自己的环境吗？／效果不好怎么办？／多久能先用起来？
- 答案用 E-5 的版本。

**H-8 首页收尾**
- 标题
  - ZH：先诊断，再交付，长期负责。（§3.3 已定）
  - EN：Diagnose. Deliver. Sustain.
- 副句
  - ZH：带一份现在的工作样本来。30–45 分钟沟通，一周内给你需求评估结论和合作建议。
  - EN：Bring a sample of today’s work. One 30–45 minute call, and an assessment with a recommended next step within a week.
- 来源：D.8。

### 方案页

**S-1 方案总览 Hero（对应模式 P1）**
- ZH：哪一项工作，最该先交给 AI？
- EN：Which part of the work should AI take on first?
- 导语沿用 D.3 已定稿：按工作频率、资料条件和审核要求来评估。

**S-2 四张方案卡加时间标签（对应模式 P8）**
- 销售：等工程师回复 → 7×24 即时应答
- 文档：2 天 → 15 分钟
- 知识库：排队等 IT → < 3 秒带出处
- 数据：等 IT 导数 → 秒级自助查询

**S-3 方案详情：痛点卡内嵌应对 + 一句 ≠（以文档自动化为例；对应模式 P2 + P4）**
- 01 历史方案分散，资料难以复用 → 接入历史标书、知识文档和项目参数，统一检索。
- 02 每份初稿耗时，反复核对参数 → 15 分钟生成带引用、可编辑的初稿。
- 03 关键条款容易遗漏，审核压力大 → 7 项完整性自动检查，再交人工复核。
- ≠ 句
  - ZH：**生成一段文字 ≠ 一份交得出去的初稿。** 初稿要有出处、查得出遗漏、改得动。在已交付的项目中，引用准确率 99%，7 项完整性检查自动执行。
  - EN：**Generated text ≠ a draft you can send.** A real draft cites its sources, flags what’s missing and stays editable. In the delivered project: 99% citation accuracy, 7 completeness checks run automatically.
- 其余三条方案线的 ≠ 句：
  - 销售：能聊天 ≠ 能答专业参数 / Chatting ≠ answering spec questions
  - 知识库：搜得到 ≠ 答得有出处 / Finding a page ≠ an answer with a source
  - 数据：会写 SQL 的人 ≠ 要数的人 / The people who can write SQL ≠ the people who need the numbers
- 痛点的“代价”（每月耗费多少工时、多少钱）**需负责人提供**，不要编。

**S-4 方案详情 FAQ 改买方口吻（四个方案页共用；对应模式 P9）**

| 现问题 | 改为（ZH） | 改为（EN） |
|---|---|---|
| 可以接入我们已有的系统吗？ | 我们现在用的系统能直接接吗？ | Will it work with the systems we already use? |
| 如何保证答案和结果可靠？ | AI 答错了怎么办？ | What happens when the AI gets it wrong? |
| 多久能看到第一版？ | 多久能先用起来？ | How soon can my team actually use it? |

- 答案保持已定稿内容不变，只改问题的说法。

### 案例页

**C-1 Hero 下的大号时间对比（对应模式 P8；解决 B14）**
- ZH：过去 **2 天** → 现在 **15 分钟**
- EN：Before **2 days** → After **15 minutes**
- 其余案例：
  - IT 助手：排队等 IT 回复 → **3 秒内**带出处回答
  - 数据查询：等 IT 导数一天以上 → **秒级**
  - LNPE：等工程师回复 → **7×24** 即时回答
- 来源：各案例 beforeAfter。

**C-2 “项目成果摘要”改为成果条（解决 B1）**
- 去掉引号图标，改为：大号指标 + 第三人称原句（已定稿，不改字）。

**C-3 “你可以亲自验证”证据组（对应模式 P7；替代通用收尾条）**
- ZH：
  - 打开在线 Demo，现在就试 ↗
  - 签署保密协议，由工程师演示完整系统
  - 索取完整案例集，中英文均可
- EN：
  - Try the live demo now ↗
  - See the full system under NDA, with an engineer
  - Get the full case book, in English or Chinese
- 来源：D.1、D.5。

**C-4 案例页收尾**
- ZH：想看与你业务相近的项目？预约工程师演示。
- EN：Book an engineer-led demo of a project relevant to your business.
- 来源：D.5 已定稿。

### 合作方式页

**E-1 Hero（对应模式 P1）**
- ZH：还不确定 AI 能不能用在你的业务上？先用一周弄清楚。
- EN：Not sure AI fits your work yet? Take one week to find out.
- 导语沿用 D.4。来源：1 周诊断（§0.3）。

**E-2 落地路径（对应模式 P10）**
- ZH：**1 周** 需求评估结论 → **2–6 周** 试点首个可用版本 → **按结果决定**：扩展、调整或停止
- 并列两条
  - 需求已明确：**6–12 周** 完整定制首期上线
  - 只要结果：托管服务 **2 周内**交付首批，之后按月或按批次持续交付
- EN：**1 week** — assessment → **2–6 weeks** — first working pilot → **You decide**: expand, adjust or stop
- 来源：§0.3、D.4。

**E-3 风险逆转句（不是保证）**
- ZH：试点开始前，双方先约定验收标准。结果不达预期，可以补充资料、调整流程，或者停下来，再决定要不要加大投入。
- EN：Before a pilot starts, we agree on what counts as success. If results fall short, we improve the sources, change the workflow or stop before you invest further.
- 来源：D.4 FAQ 原意。

**E-4 对比表加两行**
- 首期周期：6–12 周 / 2–6 周 / 首批 2 周内
- 你需要准备：明确的需求与验收人 / 一个小范围场景与工作样本 / 资料与质量标准
- “你需要准备”一行由 D.4 归纳，**措辞需负责人确认**。

**E-5 FAQ 改买方口吻，默认展开前 3 条（对应模式 P9）**
- 小节标题：ZH “你可能会问”；EN “Questions buyers ask us”。问题不加引号、不署名。
1. **先做试点，还是直接全做？** 答案沿用 D.4。
2. **数据很敏感，能放在我们自己的环境吗？**
   - ZH：可以。私有化部署时，模型与数据在你的环境中运行；我们交付 Docker 部署配置，并适配本地算力。系统内置权限控制、日志审计与敏感信息过滤。
   - 来源：D.4。
3. **效果不好怎么办？** 用 E-3。
4. **我们不想自己维护系统。** 答案为托管服务（D.4）。
5. **上线以后出了问题找谁？** 三种模式都包含上线后维护（D.4）。
6. **大概要花多少钱？**
   - ZH：价格不公开。需求评估会先估算改造成本与预期收益，再按业务价值、技术复杂度、使用规模和上线节奏给出报价。
   - 来源：§0.3 价格不公开、D.4。
7. **我们 IT 也能自己搭，为什么找你们？**
   - ZH：可以先做一周需求评估，把资料接入、权限、审核和后续维护这些关键问题梳理清楚，再决定哪些部分由谁来做。
   - 更强的论点（例如自建所需人力与周期）**需负责人提供**。
8. **员工不会用怎么办？** 上线培训与使用支持的具体内容**需负责人提供**，现有事实不足以回答。

### 技术页

**T-1 Hero 结论化（解决 B13）**
- ZH：到第 100 轮对话，响应仍在 200 毫秒以内。*
- EN：At turn 100, still under 200 ms.*
- 副句
  - ZH：Cyano Core 按任务挑选上下文：核心指令 100% 召回，Token 成本最多降低 40%。*
  - EN：Cyano Core selects context for each task: 100% recall of core instructions, up to 40% lower token cost.*
- 脚注：* 基于 Cyano 内部基准测试。
- 来源：core-benchmarks；v1 D.6 “第 1 轮与第 100 轮一样快”。

**T-2 三个 ≠（对应模式 P4）**
- 接入模型 ≠ 用上你的资料 → 按权限检索企业知识库，而不是靠员工手动粘贴。EN：Connecting a model ≠ using your knowledge.
- 能对话 ≠ 能上线 → 按 SOP 执行、记录每一步，结论保留出处，供业务人员复核。EN：A chat ≠ a production system.
- 换模型 ≠ 推倒重来 → 知识与流程保留，测试新模型后再切换。EN：Switching models ≠ starting over.
- 来源：D.6 对比表、Cyano Core 定义。

**T-3 渲染 D.6 对比表（已定稿，从未上线）**
- 标题：统一管理知识、流程与模型接入 / Manage knowledge, workflows and model access
- 四行“之前 → 之后”原样使用。

**T-4 安全卡改为问答式**
- ZH 问题：数据能不能不出我们的环境？答案用 E-5 第 2 条。
- 收尾：和我们的技术负责人聊聊你的数据与部署要求。（D.6）

### 关于页

**A-1 团队数字条**：使用 H-6 的“也就是说”版本。

**A-2 原则改为承诺式标题（不是保证）**
- 开发前先算账 / We do the math before we build
- 开工前先定验收标准 / We agree on “done” before we start
- 关键结论都有出处 / Key statements link to their sources
- 上线后有人负责维护 / Someone owns it after launch
- 正文沿用 D.7 原则 1–4。

**A-3 品牌寓意（可选）**
- 方案 §3.2 的“澜屿”寓意（知识孤岛、让知识流动）是全站最好的自有类比。但 v1 定稿已把这一节换成“服务范围”，**是否恢复需负责人决定**。

### 联系页

**K-1 Hero**
- ZH：不用先写需求文档。告诉我们三件事：现在怎么做、要花多久、想改进什么。
- EN：No requirements document needed. Tell us three things: how the work is done today, how long it takes, and what you want to improve.
- 来源：D.8。

**K-2 “带什么来”清单**
- ZH：一份现在的工作样本 · 用到的资料或系统 · 由谁审核结果
- EN：A sample of the work · the sources or systems it uses · who reviews the result
- 来源：D.2 宣言段 2。

**K-3 接下来的时间轴（大号数字）**
- ZH：**1 个工作日** 回复 → **30–45 分钟** 沟通 → **1 周** 评估结论与合作建议 → 你决定是否推进，我们给出范围与报价
- EN：Reply in **1 business day** → a **30–45 min** call → assessment within **1 week** → you decide; we provide scope and a quote

**K-4 去掉联系页底部的收尾 CTA 条**（见 B8）。

### 视觉形式：借鉴什么，不借鉴什么

**借鉴（只取信息组织与版式结构）**
1. **固定小节节奏**：问题或结论式 h2 → 一行副题 → 内容 → 结论条。结论条用左侧 2px 青线 + 18px 正文，**不用引号**。
2. **痛点卡内嵌应对**：卡片下部用 `--p3` 浅底条承载“→ 应对”，与现象区用细线分隔。
3. **场景卡底部时间 chip**：等宽数字（MonoV3）+ 细箭头，青色描边、无填充；数字放大到 18px，其余 13px。
4. **对比表高亮自己一列**：自己一列用 `--deep` 底 + `--ice` 字；其余列单色灰。符号只用“●有 / ○部分 / —无”，**不用红叉绿勾**。
5. **FAQ 默认展开**：问题 18px/500，答案 16px，左侧细竖线。
6. **落地路径三步卡**：横排，用细线箭头连接，每步一个大号时长数字。
7. **输入 → Cyano Core → 输出图**：沿用 Cyano 现有线框示意风格，左列写真实资料名（历史标书、Wiki、工单、数据库），右列写真实成果名（带引用初稿、带出处答案、表格与图表）。

**不借鉴**
- emoji 图标与卡通图标；
- 高饱和蓝底黄字、红绿勾叉；
- 正文大段加粗蓝字；
- 证书照片与客户名胶囊墙；
- 无穷符号、“不限”这类不可证的大数字；
- 居中对齐的长段落；
- 千篇一律的白卡投影网格；
- 引号加左蓝线的“伪引语”条；
- 幻灯片背景里的巨型水印字。

Cyano 现有的深浅分段、真实截图、线框示意、等宽编号体系，品质已高于对方，保留即可。

---

## 5. 未读部分

- **截图**：指定清单已全部读完。未读、非指定的有：`zh-services-d-*`、`zh-solution-doc-d-*`、`zh-cases-d-*`、`en-cases-d-*`、`en-case-wiki-d-*`、`en-insights-d-*`、`*-article-d-*`、`zh-contact-d-*`；手机端除 en/zh 首页前 6 张以外的全部截图；全部 `*-home-heroframe-*`。
- **文案**：
  - 只读了 `site/content/v1/copy.json`、`cases.json`、`founders.json`、`v3/pages/*.json`，以及 `rendered-baseline.json` 中四个方案详情页。
  - 未读 `articles.json` 正文、`legal-v1.json`、`content/claims-pending.md`。
  - v2 文件（`*-v2.json`、`solutions-v2.json`）按 v3 恢复说明视为已废弃，未读。
- **竞品**：
  - A、B 的 `A.txt`、`B.txt` 为空，依据切片图片阅读。
  - C 依据 21 张页面图片与 `C.txt` 阅读。
  - 未直接打开 `reference/` 下的原 PDF。
- **样式**：只检索了与本报告结论相关的规则（`.name-story`、`.hero-content h1`、line-height、text-wrap、字体子集），没有逐行审 `v3.css` 与 `v3-foundation.css`。
- **交互**：未在浏览器中验证悬停、FAQ 展开、滚动动画。A2 的不可见标题已从 CSS 确认为配色问题，不是截图时机问题。
- **方案文档**：只读了 §0.1–§0.4 与 §3.1–§3.6，其余章节未读。
