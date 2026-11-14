# Cyano v4 验收与自测报告（W4-08）

> 生成时间：2026-11-14
> 分支：`v4/06-final`（阶段链路：`master` → `v4/00-fixes` → `v4/01-foundation` → `v4/02-system` → `v4/03-components` → `v4/04-home` → `v4/05-pages` → `v4/06-final`）
> 测量基准：生产构建 `npm run build` + `npx next start -p 3010 -H 127.0.0.1`（Chrome 稳定版真实 GPU / CDP 手机模拟）

---

## 1. 自报表（`10-验收自测清单.md` §9）

| 项目 | 阈值 | 实测 | 测量文件 |
|---|---|---|---|
| 手机 TBT `/` | ≤ 200ms | **163 ms**（5 次冷启动中位数） | `site/reports/perf.json` |
| 手机 TBT `/en` | ≤ 200ms | **83 ms**（5 次冷启动中位数） | `site/reports/perf.json` |
| 手机 TBT `/technology` | ≤ 200ms | **72 ms**（5 次冷启动中位数） | `site/reports/perf.json` |
| 手机 TBT `/cases/proposal-generation` | ≤ 200ms | **73 ms**（5 次冷启动中位数） | `site/reports/perf.json` |
| 手机 LCP `/` | ≤ 2.5s | **1.104 s**（1104 ms，LCP 元素 `h1.h1-home`；`/en` 为 **0.868 s**，`h1.h1-home`；`/technology` **0.964 s**；`/cases/proposal-generation` **0.996 s**） | `site/reports/perf.json` |
| CLS 最大值（全部页面） | ≤ 0.05 | **0.027**（手机 4 页 × 5 次最大为 `/cases/proposal-generation` 0.027；桌面全站 46 路由最大为 `/services/document-automation` 0.0135） | `site/reports/perf.json` |
| 首屏字体 `/`（中文） | ≤ 150KB | **147.7 KB**（encoded 151,244 B / transfer 149.2 KB = 152,744 B） | `site/reports/perf.json` |
| 首屏字体 `/about` | ≤ 150KB | **113.3 KB**（encoded 115,968 B / transfer 114.7 KB = 117,468 B） | `site/reports/perf.json` |
| 首屏字体 `/technology` | ≤ 150KB | **122.5 KB**（encoded 125,392 B / transfer 123.9 KB = 126,892 B） | `site/reports/perf.json` |
| 光场帧耗时（桌面真实 GPU `/`） | ≤ 4ms | **2.325 ms**（341 帧中位数，P95 = 3.365 ms） | `site/reports/perf.json` |
| 首页初始 JS | ≤ 180KB | **`/` = 172.5 KiB**（176,676 B gzip，13 文件）；**`/en` = 172.5 KiB**（176,600 B gzip，13 文件） | `site/reports/budgets.json` |
| `light-field.js` gzip | ≤ 8KB | **3.26 KiB**（3,336 B gzip；海报 `public/media/field/hero.avif` = 4,059 B ≤ 60 KB） | `site/reports/budgets.json` |
| ≤ 12px 字符占比（最差页面） | ≤ 8% | **7.76%**（84 个路由×视口中最差为 `/cases/it-knowledge-assistant @ 1440×900`） | `site/reports/small-text.json` |
| 内容核对：未登记 / v1 缺失 | 0 / 0 | **0 / 0**（46 页：v1 原文 6,496 处，已批改写 28 处，已批新增 1,340 处） | `site/reports/content-check.json` |
| 数字登记：未登记数字 | 0 | **0**（42 路由全检通过） | `site/reports/numbers.json` |
| 交互：无反馈 / 0ms 切换 | 0 / 0 | **0 / 0**（46 路由、772 个交互元素、166 个焦点环对比度 ≥ 3:1 全部达标） | `site/reports/interactions.json` |
| 点缀超限 | 0 | **0**（46 路由全检通过） | `site/reports/decor.json` |
| 静态对比度不达标 | 0 | **0**（35 个页面×视口，4,702 个文本节点 + 54 个非文本控件全部达标） | `site/reports/contrast.json` |
| 首屏逐帧对比度不达标帧 | 0 | **0**（4 路由 × 50 帧 = 200 帧，最低实测 **10.69:1** ≥ 4.5:1） | `site/reports/frame-contrast.json` |
| 首屏 5 秒帧差 | ≥ 8% | **22.01%**（76,123 / 345,800 环形像素变化） | `site/reports/frame-diff.json` |
| axe critical + serious（全部页面） | 0 | **0**（70 项桌面 + 手机页面及交互打开态测试全部通过） | `site/test-results/smoke-axe.json` |
| 版心不一致 | 0 | **0**（22 页 × 5 宽度 = 110 组全检 0 条） | `site/reports/gutters.json` |
| 中文标题断词 | 0 | **0**（23 中文路由 × 3 宽度全检 0 条） | `site/reports/zh-breaks.json` |
| CSS 总体积 | ≤ 90,000 字节 | **89,174 字节**（见 §2 `wc -c` 明细） | §2 `wc -c` 输出 |
| `!important`（v4 文件，减弱动效除外） | 0 | **0**（见 §2 `grep` 输出） | §2 `grep` 输出 |
| K-01 到 K-14 落地 | 14 / 14 | **14 / 14**（逐项截图路径见 §3） | `docs/reviews/v4-selfcheck/final/`（见 §3） |
| 第一批招牌交互 S1、S5、S6、S10、S11 | 5 / 5 | **5 / 5**（常规 + `-reduced` 双版本录屏路径见 §4.1） | `docs/reviews/v4-selfcheck/stage-4/`、`stage-5/`（见 §4.1） |
| 第二批 S2、S3、S7、S8、S9 | 5 / 5（S3、S7 视文案批准情况） | **5 / 5**（`09` 文件已全部批准，S3、S7 均已完整上线并录屏，路径见 §4.2） | `docs/reviews/v4-selfcheck/stage-5/`（见 §4.2） |
| `09` 文件批准情况 | — | **已批准（含甲类）196 行 / 待批准 0 行 / 不用 3 行**（对应 JSON 键：`copy-new.json` `approved=237`、`class-a=42`、`pending=0`、`rejected=6`；`copy-overrides.json` `approved=2`） | `site/content/v4/copy-new.json`、`site/content/v4/copy-overrides.json` |

---

## 2. 命令原文输出摘录（`10-验收自测清单.md` §1）

```text
$ npm run typecheck
> tsc --noEmit
(exit 0)

$ npm run lint
> eslint app components lib next.config.ts playwright.config.ts tests
(exit 0)

$ npm run build
✓ validate-v4 passed (6 cases, 4 solutions, 285 copy-new, 2 copy-overrides, 66 zh-breaks, 13 numeric source groups, 6 v1 cases).
Built responsive AVIF/WebP variants for 35 original interface/portrait assets.
✓ CJK subsets (wght 400–500): noto-sc-core.b0db19b72d.woff2 (377 chars, 82.9 KB) + noto-sc-home.d6c6404bdc.woff2 (159 chars, 39.1 KB) + noto-sc-about.ebcd12093c.woff2 (14 chars, 4.6 KB) + noto-sc-tech.009f0ec7ed.woff2 (48 chars, 13.8 KB) + noto-sc-ext.867a514b5e.woff2 (241 chars, 57.7 KB); Latin: inter=10.8 KB, manrope=9.9 KB.
✓ Generating static pages using 23 workers (52/52)
✓ render-og generated 6 OG images (1200×630) in public/og/.
✓ Public copy & CJK glyph coverage scan passed across 49 rendered HTML pages (839 CJK glyphs covered).

$ npm run check:content
✓ check:content (46 pages): verbatim=6496, approvedOverride=28, approvedNew=1340, unregistered=0, missingV1=0.

$ node scripts/check-numbers.mjs
✓ check-numbers passed across 42 routes (0 unregistered numbers).

$ node scripts/check-small-text.mjs
✓ check-small-text passed across 84 route/viewports (worst: /cases/it-knowledge-assistant @ 1440x900 = 7.76% <= 8%).

$ node scripts/check-gutters.mjs
Checked gutters across 22 pages × 5 widths: 0 inconsistencies.

$ node scripts/check-decor.mjs
✓ check-decor passed across 46 routes (0 violations).

$ node scripts/check-interactions.mjs
✓ check-interactions (46 routes, 772 interactive, 166 focus checks): noFeedback=0, zeroMs=0, lowFocusContrast=0.

$ node scripts/check-contrast.mjs
✓ check-contrast passed (35 page/viewports, 4702 text nodes, 54 non-text controls, 0 violations).

$ node scripts/check-frame-contrast.mjs
✓ check-frame-contrast (4 routes × 50 frames): failingFrames=0, min=10.69:1.

$ node scripts/check-zh-breaks.mjs
Checked zh h1/h2 line breaks across 23 routes × 3 widths: 0 issues.

$ node scripts/production-budgets.mjs
/: 172.5 KiB initial scripts (13 files)
/en: 172.5 KiB initial scripts (13 files)
/technology: 161.3 KiB initial scripts (11 files)
/contact: 148.2 KiB initial scripts (10 files)
/en/terms: 144.6 KiB initial scripts (9 files)
Field: 3336 bytes gzip; poster: 4059 bytes

$ node scripts/measure-perf.mjs
✓ measure-perf passed: mobile TBT [/=163ms, /en=83ms, /technology=72ms, /cases/proposal-generation=73ms], fonts [/=147.7KB, /about=113.3KB, /technology=122.5KB], gpuMedian=2.325ms, maxCLS=0.027, logoRequests=0.

$ npm run test:smoke
Running 70 tests using 12 workers
  70 passed (25.2s)

$ node scripts/check-unused-public.mjs
✓ check-unused-public passed (370 public files all referenced, 0 unused).

$ node scripts/check-duplicate-selectors.mjs
0 duplicate selectors found.

$ node scripts/check-dead-css.mjs
Found 0 dead CSS rules across legacy stylesheets (usedClasses=2504).

$ wc -c app/styles/v3-*.css app/styles/v4/*.css app/styles/v4/*/*.css
   5438 app/styles/v3-foundation.css
     57 app/styles/v3-tokens.css
   4869 app/styles/v4/base.css
   4228 app/styles/v4/decor.css
   1876 app/styles/v4/motion.css
   3433 app/styles/v4/tokens.css
   2061 app/styles/v4/components/button.css
   1177 app/styles/v4/components/callout.css
   1222 app/styles/v4/components/card.css
    971 app/styles/v4/components/chip.css
   1924 app/styles/v4/components/citation.css
    683 app/styles/v4/components/cover.css
   1700 app/styles/v4/components/dropdown.css
   1069 app/styles/v4/components/faq.css
   2826 app/styles/v4/components/field.css
    826 app/styles/v4/components/light-field.css
   2840 app/styles/v4/components/link.css
    954 app/styles/v4/components/media.css
   1078 app/styles/v4/components/mobile-menu.css
   8013 app/styles/v4/components/mockup.css
   1874 app/styles/v4/components/nav.css
   1537 app/styles/v4/components/overlay.css
   1714 app/styles/v4/components/provenance.css
   1585 app/styles/v4/components/tabs.css
   3374 app/styles/v4/components/workflow.css
   1214 app/styles/v4/sections/about.css
    880 app/styles/v4/sections/article.css
   4223 app/styles/v4/sections/case.css
    722 app/styles/v4/sections/cases.css
    524 app/styles/v4/sections/closing.css
   1331 app/styles/v4/sections/contact.css
   1296 app/styles/v4/sections/engagement.css
   1362 app/styles/v4/sections/footer.css
   1599 app/styles/v4/sections/header.css
  10279 app/styles/v4/sections/home.css
    294 app/styles/v4/sections/insights.css
    137 app/styles/v4/sections/legal.css
    864 app/styles/v4/sections/page-hero.css
   2196 app/styles/v4/sections/services.css
    794 app/styles/v4/sections/solution.css
   4130 app/styles/v4/sections/technology.css
  89174 total

$ grep -rn "!important" app/styles/v4 | grep -v "prefers-reduced-motion" | wc -l
0
```

---

## 3. K-01 到 K-14 落地核对与截图路径

| 编号 | 模块内容 | 终版截图路径 |
|---|---|---|
| K-01 | 首页首屏光场 + 三层溯源舞台 + 证据条 | `docs/reviews/v4-selfcheck/final/zh-home-d-01.jpg`、`docs/reviews/v4-selfcheck/final/en-home-d-01.jpg`、`docs/reviews/v4-selfcheck/final/zh-home-m-01.jpg` |
| K-02 | 首页“顾虑四问”内嵌暗面板与 4 幕演示舞台 | `docs/reviews/v4-selfcheck/final/zh-home-d-02.jpg`、`docs/reviews/v4-selfcheck/final/en-home-d-02.jpg` |
| K-03 | 首页四类场景选项卡探索器 | `docs/reviews/v4-selfcheck/final/zh-home-d-04.jpg`、`docs/reviews/v4-selfcheck/final/en-home-d-04.jpg` |
| K-04 | 方案总览交替通栏样机卡 + 编号标注 + 卡底工作流条 | `docs/reviews/v4-selfcheck/final/zh-services-d-02.jpg`、`docs/reviews/v4-selfcheck/final/zh-services-d-03.jpg`、`docs/reviews/v4-selfcheck/final/en-services-d-02.jpg` |
| K-05 | 方案详情首屏输入三卡 → Core → 输出样机 + 玻璃指标条 | `docs/reviews/v4-selfcheck/final/zh-solution-doc-d-01.jpg`、`docs/reviews/v4-selfcheck/final/en-solution-doc-d-01.jpg` |
| K-06 | 案例暗色样机封面卡（首页精选与案例列表） | `docs/reviews/v4-selfcheck/final/zh-home-d-05.jpg`、`docs/reviews/v4-selfcheck/final/zh-cases-d-02.jpg`、`docs/reviews/v4-selfcheck/final/en-cases-d-02.jpg` |
| K-07 | 案例详情首屏主界面样机溢出纸面 + 发光数字 | `docs/reviews/v4-selfcheck/final/zh-case-proposal-d-01.jpg`、`docs/reviews/v4-selfcheck/final/en-case-wiki-d-01.jpg`、`docs/reviews/v4-selfcheck/final/zh-case-proposal-m-01.jpg` |
| K-08 | 技术页首屏汇聚光场 + 汇合点四层玻璃小窗 | `docs/reviews/v4-selfcheck/final/zh-technology-d-01.jpg`、`docs/reviews/v4-selfcheck/final/en-technology-d-01.jpg`、`docs/reviews/v4-selfcheck/final/en-technology-m-01.jpg` |
| K-09 | 技术页 Cyano Core 四层架构图 + 溯源连线 | `docs/reviews/v4-selfcheck/final/zh-technology-d-02.jpg`、`docs/reviews/v4-selfcheck/final/en-technology-d-02.jpg` |
| K-10 | 关于页 4×5 责任矩阵（头像、阶段轨、悬停联动） | `docs/reviews/v4-selfcheck/final/zh-about-d-02.jpg`、`docs/reviews/v4-selfcheck/final/zh-about-d-03.jpg`、`docs/reviews/v4-selfcheck/final/en-about-d-03.jpg` |
| K-11 | 合作甘特图 `EngagementGantt`（首屏发光版、纸面完整版、首页紧凑版） | `docs/reviews/v4-selfcheck/final/zh-engagement-d-01.jpg`、`docs/reviews/v4-selfcheck/final/zh-engagement-d-02.jpg`、`docs/reviews/v4-selfcheck/final/zh-home-d-07.jpg` |
| K-12 | 洞察文章几何封面 `InsightCover`（三种主题构图） | `docs/reviews/v4-selfcheck/final/en-insights-d-01.jpg`、`docs/reviews/v4-selfcheck/final/zh-article-d-01.jpg`、`docs/reviews/v4-selfcheck/final/zh-home-d-11.jpg` |
| K-13 | 收尾区 `ClosingCta` 汇聚光场 + 三通道溯源线 + 发光按钮 | `docs/reviews/v4-selfcheck/final/zh-home-d-12.jpg`、`docs/reviews/v4-selfcheck/final/en-home-d-12.jpg` |
| K-14 | 内页统一 `PageHero` 框架（9 类内页首屏主视觉互不相同） | `docs/reviews/v4-selfcheck/final/zh-services-d-01.jpg`、`zh-solution-doc-d-01.jpg`、`zh-cases-d-01.jpg`、`zh-case-proposal-d-01.jpg`、`zh-technology-d-01.jpg`、`zh-engagement-d-01.jpg`、`zh-about-d-01.jpg`、`zh-contact-d-01.jpg`、`en-insights-d-01.jpg` |

---

## 4. 招牌交互录屏路径（`10-验收自测清单.md` §6）

### 4.1 第一批招牌交互（5 / 5）

- **S1 首屏叙事与角标溯源**：
  - `docs/reviews/v4-selfcheck/stage-4/S1-home-zh-1440.webm` / `S1-home-zh-1440-reduced.webm`
  - `docs/reviews/v4-selfcheck/stage-4/S1-home-en-1440.webm` / `S1-home-en-1440-reduced.webm`
  - `docs/reviews/v4-selfcheck/stage-4/S1-home-zh-390.webm` / `S1-home-zh-390-reduced.webm`
  - `docs/reviews/v4-selfcheck/stage-4/S1-cite-hover-1440.webm` / `S1-cite-hover-1440-reduced.webm`
- **S5 工作流四步试运行与重跑**：
  - `docs/reviews/v4-selfcheck/stage-5/S5-solution-1440.webm` / `S5-solution-1440-reduced.webm`
  - `docs/reviews/v4-selfcheck/stage-5/S5-case-1440.webm` / `S5-case-1440-reduced.webm`
- **S6 首页四类场景选项卡切换**：
  - `docs/reviews/v4-selfcheck/stage-4/S6-home-1440.webm` / `S6-home-1440-reduced.webm`
- **S10 引用溯源浮层卡 `CitationPeek`**：
  - `docs/reviews/v4-selfcheck/stage-4/S10-1440.webm` / `S10-1440-reduced.webm`
- **S11 首页“顾虑四问”四幕切换与自动播放**：
  - `docs/reviews/v4-selfcheck/stage-4/S11-home-1440.webm` / `S11-home-1440-reduced.webm`

### 4.2 第二批招牌交互（5 / 5）

- **S2 技术页四层架构滚动点亮与悬停聚焦**：
  - `docs/reviews/v4-selfcheck/stage-5/S2-tech-1440.webm` / `S2-tech-1440-reduced.webm`
- **S3 技术页上下文装箱器（4 场景切换）**：
  - `docs/reviews/v4-selfcheck/stage-5/S3-tech-1440.webm` / `S3-tech-1440-reduced.webm`
- **S7 合作方式三问配置器与对比表联动高亮**：
  - `docs/reviews/v4-selfcheck/stage-5/S7-engagement-1440.webm` / `S7-engagement-1440-reduced.webm`
- **S8 案例列表胶囊滑块筛选与 FLIP 重排 + ViewTransition 形态过渡**：
  - `docs/reviews/v4-selfcheck/stage-5/S8-cases-1440.webm` / `S8-cases-1440-reduced.webm`
- **S9 标书案例前后对照擦除器（指针拖拽 + 方向键 + 减弱动效双栏态）**：
  - `docs/reviews/v4-selfcheck/stage-5/S9-case-1440.webm` / `S9-case-1440-reduced.webm`

### 4.3 基础导航、微交互与样张页必录清单

- **F-14 六栏目往返导航**：
  - `docs/reviews/v4-selfcheck/stage-0/nav-roundtrip-1440.webm` / `nav-roundtrip-1440-reduced.webm`
  - `docs/reviews/v4-selfcheck/stage-0/nav-roundtrip-390.webm` / `nav-roundtrip-390-reduced.webm`
- **阶段 2 全组件微交互状态**：
  - `docs/reviews/v4-selfcheck/stage-2/micro-interactions-1440.webm` / `micro-interactions-1440-reduced.webm`
- **阶段 3 样张页 `/v4-study`**：
  - `docs/reviews/v4-selfcheck/stage-3/v4-study-1440.webm` / `v4-study-1440-reduced.webm`
  - `docs/reviews/v4-selfcheck/stage-3/v4-study-390.webm` / `v4-study-390-reduced.webm`

---

## 5. 全套截图与录屏归档目录

- **终版全套截图（§5，37 组页面×视口 + 首屏 5 时间点序列帧 + `index.txt`，全部 `scrollWidth === viewport`）**：
  - `docs/reviews/v4-selfcheck/final/`
- **分阶段截图与必录 `.webm` 视频归档（§5 & §6，共 38 段有界面 Chrome 录屏，含全部 `-reduced` 减弱动效版本）**：
  - `docs/reviews/v4-selfcheck/stage-0/`
  - `docs/reviews/v4-selfcheck/stage-1/`
  - `docs/reviews/v4-selfcheck/stage-2/`
  - `docs/reviews/v4-selfcheck/stage-3/`
  - `docs/reviews/v4-selfcheck/stage-4/`
  - `docs/reviews/v4-selfcheck/stage-5/`
