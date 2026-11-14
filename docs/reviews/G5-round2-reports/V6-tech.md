# V6 技术评审（R-TECH）— Cyano 官网 v2 本地实现

评审日期：2026-11-13　评审对象：`site\`（Next.js 16.4.6，`next build --webpack`，BUILD_ID `iDJpgGFT2a7jJx0YqUGYz`，01:57 构建）＋ 运行中的 `next start`（http://localhost:3000）
方法：只读。curl / Node 脚本读取 HTML、构建产物与源码；无头 Chrome 157（独立 profile、CDP 端口 9412）测量；`tsc --noEmit --incremental false`。
前一位评审的中间产物已核对：其 HTML 快照与当前服务器输出 md5 完全一致（构建未变），`out_desktop.txt`（/、/technology 桌面）、`out_mobile.txt`（/、/en、/technology、/cases/proposal-generation 手机）和 `contrast.txt` 可直接复用；其余项（/en 与案例页桌面、复测手机、字号统计、目标尺寸、版心、图片、字体回退、字重、动效、键盘、页头、结构化数据、源码统计、API）为本轮补测。
未能验证：Lighthouse 分数（本机未安装 lighthouse，按约束不安装）、`npm ci` 实际结果、真实邮件投递。

---

## 1. 六项分数

| 维度 | 分数 | 是否过线（≥5） |
|---|---|---|
| 代码结构 | **4** | 否 |
| 性能 | **4** | 否 |
| 可访问性 | **5** | 勉强过线 |
| 可维护性 | **3** | 否 |
| 健壮性 | **4** | 否 |
| 工程展示力（附加） | **4** | — |

**代码结构 4**：做得好的部分：内容放在 JSON 里，4 个集合有 zod schema，类型由 schema 推导，`tsc` 0 错误；路由层很薄（page.tsx 14–43 行）。扣分原因：`components/PageTemplates.tsx` 有 2,166 行、85 KB，13 个页面视图写在一个文件里（HomeView 318 行、CaseDetailView 305 行、SolutionDetailView 275 行）；9 个 `"use client"` 模块都直接 import `@/lib/content`，双语全量内容和 zod 因此进了客户端；代码里有 188 处 `t(locale,"中","英")` 内联文案，TS/TSX 中有 3,440 个汉字（占全部中文文案 13.1%），法律条款整段写在 `lib/content.ts`；siteCopy、articles、availability 三个文件没有经过 schema 校验。

**性能 4**：CLS 全部为 0；滚动全程 0 个长任务；桌面 LCP 0.2–0.7 s；LCP 图片有 preload。扣分原因：每页首屏 JS gzip 266.9 KB，比 180 KB 预算高 48%，所有页面的 chunk 集合完全相同，没有路由级拆分，应用级动态 chunk 为 0，内容 JSON 有 69.9 KB gz 打进客户端；`images.unoptimized: true`，全站 0 个 srcset、0 张 AVIF；英文页会下载 100 KB 中文字体；手机首页 LCP 两次测量分别为 2.02 s 和 2.55 s，TBT 分别为 112 ms 和 276 ms，第二次两项都超预算；4x CPU 下首页静置时主线程占用 22–29%（Canvas）。

**可访问性 5**：基础做得扎实：每页唯一 H1，有 skip link 和 landmark；移动菜单会把背景设为 inert，焦点能移入并返回，Esc 可关闭；动画有暂停按钮；reduced-motion 下 rAF 为 0、内容直接显示终态；表单提交后焦点移到状态区；除 1 处外，可点击目标都 ≥24 px。不达标项：输入框焦点指示只有约 1.1–1.2:1，深色页头上的焦点环只有 2.51:1，都低于 3:1；有 4 组 12 px 文字对比度在 3.19–3.77；/cases 和 /insights 的标题从 H1 直接跳到 H3；手机端 SVG 文字只有 7 px；灯箱没有焦点陷阱；禁用 JS 时 15 个区块不可见。

**可维护性 3**：新增案例做不到“只改内容文件”。`scripts/validate-v2.mjs` 把案例数（6）、截图数（31）等写死，而它是 build 的第一步，加一个案例构建就会失败。schema 规定数组长度固定为 3 或 4；media-manifest 要单独跑脚本生成；新增行业要改 3 处代码。Token 基本没有被使用（组件里 486 处 hex，`var()` 只有 10 处）。项目没有 lint、没有测试、没有 CI，lockfile 与 package.json 不同步。

**健壮性 4**：API 有 zod 校验、Origin 校验、16 KB 上限、蜜罐、超时控制和 HTML 转义，投递未配置时返回 503 并有明确提示，客户端会区分“网络中断，信息尚未发送”。问题：自动回执会发到用户填写的任意邮箱，可被滥用；限流用的是进程内 Map，key 取自可伪造的 X-Forwarded-For，而且只在校验通过后才计数；没有字段级错误提示；404 页 SSR 输出为空 body、没有 title；禁用 JS 时内容隐藏；`getMediaMeta` 查不到时静默回落到 1440×900。

**工程展示力 4**：现有亮点：首屏 Canvas 光带、“溯源”演示舞台（有暂停按钮）、技术页可拖动曲线、带热点的截图画廊和灯箱、合作方式问卷、案例筛选，加上 0 CLS 和流畅的滚动。缺陷会被懂行的人一眼看到：技术页曲线上的圆点不落在曲线上，数值是代码公式而不是测量值；中文和 Inter 的所有字重渲染完全相同，层级塌缩；首页首屏页头是一条 #333333 灰带；等宽类里的中文回退到系统字体；没有数字滚动，工作流图不会按步骤点亮，也没有页面过渡；Canvas 按帧步进，离屏后 rAF 仍在运行。

---

## 2. 测量结果

### 2.1 HTML 与首屏资源（`next start` 实测，gzip 为 zlib -9；服务器实际 gzip 传输量写在括号里）

| 页面 | HTML 原始 / gzip / br | 其中内联 RSC 脚本 | 首屏 JS gzip 合计 | CSS gzip | 实际请求字体（字节） | 首屏图片 | LCP 元素 / preload |
|---|---|---|---|---|---|---|---|
| `/` | 188,211 / 43,417 / 31,352（传输 43,890） | 81,149 B | **266,907**（原始 852,600） | 13,014 + 3,338 | noto-sc-core 99,504、manrope 17,652、inter 6,340、jetbrains 5,232，共 **128,728**（传输 131,899） | 桌面：hero 98,422 + logo 6,984 + 首个案例截图 56,582（lazy，位于视口内 y=797），共 **161,988**；手机：105,406 | `IMG cyano-hero-laminar.webp`（装饰图，`aria-hidden`）；有 preload，但没有 fetchpriority，请求优先级为 **Low** |
| `/en` | 189,373 / 41,820 / 30,693 | 84,782 B | **266,834** | 13,014 + 426（随后又加载 zh 的 3,338） | 3 个 Latin 字体共 29,224，**另外在预取后加载 noto-sc-core 99,504**（桌面 t=735 ms，手机 t=1,889 ms） | 同 `/` | 同 `/` |
| `/cases/proposal-generation` | 142,366 / 33,844 / 23,230 | 76,095 B | **266,907** | 13,014 + 3,338 | 首页的 4 个 + noto-sc-ext 51,884，共 **180,612**（传输 184,576） | prisms 35,694 + 两个 logo 15,136，共 50,830 | `IMG cyano-white-prisms.webp`，有 preload |
| `/technology` | 75,527 / 15,173 / 11,598 | 35,026 B | **266,906** | 13,014 + 3,338 | 同案例页，共 180,612 | astrolabe 217,566 + logo-light 8,152 + logo-dark 6,984，共 **232,702（超出 220 KB 预算）** | `IMG cyano-white-tech-astrolabe.webp`，有 preload |

**JS chunk 明细（所有页面完全相同，gzip）**

| chunk | 大小 | 内容 |
|---|---|---|
| 4bd1b696 | 63,911 | react-dom |
| 3794 | 67,049 | next 客户端 / router |
| **9295** | **69,912** | **cases / solutions / insights / site-copy / query-demo / media-manifest 内容 JSON，含 19,523 个汉字** |
| **455** | **24,781** | **zod 运行时**、lucide |
| 1177 | 23,981 | 应用客户端组件（Canvas、表单、InteractiveDemo、Home/Case 可视化等） |
| 5906 | 7,247 | — |
| 9773 | 3,631 | Header |
| 8500 | 3,245 | — |
| 其他 | webpack 1,762、main-app 224、layout 373/366、error 653/587、page **138** | — |

- polyfills 39,520 带 nomodule，现代浏览器不加载。
- 每个页面的 page chunk 都只有 148 B（原始），说明没有路由级拆分。
- `react-loadable-manifest` 里只有 Next 内部的 `_app`、`_error` 两个动态 chunk，**应用级动态 import 为 0**，全仓库没有 `next/dynamic`。
- 一次完整会话（含滚动）的脚本传输量为 295.9 KB / 28 个请求。首页还发出 46 个 RSC 预取请求，共 319 KB。

**CSS**
- 主样式 `6e25…css`：72,704 B 原始 / 13,014 B gz。
- zh 字体 CSS `60df…css`：8,826 / 3,338。
- en next/font CSS `d215…css`：1,322 / 426。
- 中文页会额外加载 en 的 CSS，英文页也会额外加载 zh 的 CSS（两边交叉加载）。
- 每页都下载深色和浅色两个 logo。

### 2.2 运行性能（CDP 实测；TBT 为 FCP 到 load+3/5 s 之间 Σ(长任务−50ms)，不等同于 Lighthouse 实验室 TBT）

**桌面 1440×900，不节流**

| 页面 | FCP | LCP | CLS | TBT | 滚动整页 | 静置主线程 |
|---|---|---|---|---|---|---|
| `/` | 272 | 272 | 0 | 0 | 长任务 0，最长帧 25.1 ms，>50 ms 帧 0 | task 4.9%，script 1.0%，Canvas 2,408 次 stroke / 5 s |
| `/en` | 676 | 676 | 0 | 0 | 长任务 0，最长帧 41.5 ms | task 5.5% |
| `/technology` | 196 | 196 | 0 | 0 | 长任务 0，最长帧 **58.3 ms**（1 帧 >50 ms） | 0% |
| `/cases/proposal-generation` | 304 | 304 | 0 | 0 | 长任务 0，最长帧 24.9 ms | 0% |

**手机 390×844、DPR 3、4x CPU、Fast 4G（约 9 Mbps / 165 ms）**

| 页面 | FCP | LCP | CLS | TBT（加载期长任务） | 滚动整页 | 静置主线程 |
|---|---|---|---|---|---|---|
| `/` 第 1 次 | 1,556 | 2,024 | 0 | 112（87 / 149 / 63 ms） | 长任务 0，最长帧 41.7 ms | **task 21.7%**，script 4.0% |
| `/` 第 2 次 | 1,816 | **2,548** | 0 | **276**（113 / 245 / 131 ms） | 长任务 0，最长帧 33.3 ms | **task 28.9%**，script 5.2% |
| `/en` | 1,028 | 1,196 | 0 | 188（217 / 71 ms） | 长任务 0，最长帧 41.7 ms | task 21.9% |
| `/technology` 第 1 次 | 1,220 | 1,512 | 0 | 120 | 长任务 0，最长帧 25.1 ms | 0% |
| `/technology` 第 2 次 | 1,648 | 2,064 | 0 | **244** | 长任务 0，最长帧 33.4 ms | 0% |
| `/en/technology` | 816 | 956 | 0 | 191 | 长任务 0，最长帧 41.6 ms | 0% |
| `/cases/proposal-generation` | 1,528 | 1,528 | 0 | 130 | 长任务 0，最长帧 25 ms | 0% |

- 离屏测试：首页滚到底后 2 s 内 Canvas 绘制 0 次，但 **rAF 仍有 241 次**（循环没有停止）。
- Lighthouse 移动端 Performance 与 A11y 分数：**未验证**。

### 2.3 字体

**自托管情况**：全部自托管。
- Latin 通过 `next/font/local` 加载 `app/fonts/*`：manrope-latin 17,652 B、inter-latin 6,340 B、jetbrains-mono-latin 5,232 B，都带 size-adjust 回退。
- 中文通过 `/fonts/noto-sc-core.woff2`（99,504 B，733 个码位）和 `noto-sc-ext.woff2`（51,884 B，329 个码位）加载，用 unicode-range 拆分。
- JetBrains Mono 已自托管（`preload:false`）。
- 字体族与要求一致（Manrope / Inter / 思源黑体 / JetBrains Mono），每个字重文件都 ≤350 KB。

**未引用的字体文件**：`public/fonts/inter.woff2`（48,256 B）、`public/fonts/manrope.woff2`（24,532 B）。

**@font-face 声明与文件不符（关键问题）**：

| 字体 | 文件实际情况 | @font-face 声明 |
|---|---|---|
| inter-latin | 静态，usWeightClass 450，无 fvar | `font-weight:100 900` |
| jetbrains-mono | 静态 500 | 100–800 |
| noto-sc-core / ext | 静态 400（内部名称为 “Noto Sans SC Thin”） | 400–700 |
| manrope | 真正的可变字体，wght 200–800 | 200–800 |

- 用 canvas 测量墨量，300/400/500/600/700 的结果完全相同：Noto 均为 3,454，Inter 均为 4,508，JetBrains 均为 4,854。只有 Manrope 随字重递增（2,956 → 5,617）。
- 中文首页按计算字重统计：500 / 600 / 700 共 1,242 个字符，实际都以 400 渲染。英文首页 Inter 500 / 600 共 1,482 个字符，实际都以 450 渲染。
- 原因在 `scripts/subset-font.mjs:22,39,191` 的 `variationAxes` 把字重钉死了。

**中文子集覆盖**：对 46 个 URL 的渲染文本扫描，结果如下。
- 全角标点 ，：；？！（）、。「」《》“”—… 全部覆盖。
- 没有任何自托管字体覆盖的字符：**→（U+2192）**（中文页 11 次、英文页 28 次）、↗、≤、≥、≈、～（目前未在正文中出现）、¥、μ、§，以及英文页的 ‑（U+2011，Inter 子集缺失）。

**回退到系统字体（Chrome 实测）**：
- `.font-mono-tech` 的字体栈是 `jetbrainsMono, ui-monospace, …, monospace`，**不含思源黑体**。实测这些等宽文本组里出现的汉字与 → 全部回退到系统字体。涉及的不同字符数：首页两组分别为 144 和 15、案例页 41 和 27、技术页 60、文章页 37（这是组内不同字符数，其中汉字全部缺失）。
- 技术页 SVG `<text fontFamily="monospace">`（"Turn 1/50/100"）全部使用系统 monospace。
- 语言切换按钮 “EN / 中文” 用内联 system-ui 字体栈（`Header.tsx:304`）。

**英文页加载中文字体**：会加载。zh 根布局在 `<head>` 里手写了 preload（`app/(zh)/layout.tsx:39-45`）。英文页的语言切换 Link 预取 `/` 后，React 把 `preload font noto-sc-core` 和 `preload style 60df…css` 注入英文页文档（CDP 记录到 initiator=script）。

**首屏字体合计**：首页 128.7 KB，不超过 150 KB 预算；技术页和案例页 180.6 KB。

### 2.4 图片

- **组件使用**：用了 `next/image`（22 处）。另有 4 处原生 `<img>`：BrandLogo、灯箱、Footer、PageTemplates:246。
- **未优化**：`next.config.ts:19` 设置了 `images.unoptimized:true`，因此：
  - 全站 srcset 为 **0**，`sizes` 属性不起作用；
  - **没有 AVIF**，`formats` 配置不生效，全部是单一尺寸的 WebP；
  - 宽高和 blur 占位都有。
- **原图与显示尺寸差距**：

| 图片 | 原图 | 显示尺寸 | 过量倍数 |
|---|---|---|---|
| 案例缩略图 | 1600×1000 | 108×64 | **14.8×** |
| 首页方案图 | 1400×788 | 396×223 | 3.54×（桌面） |
| logo | 128 | 32 | 4× |
| astrolabe、prisms、monolith | 1400 | 580 | 2.41× |
| team | 1536 | 616 | 2.49× |

  手机 DPR 3 下这些比例约为 1.25–1.7×，基本合理。
- **生成图体积**：`public/art` 共 32 个文件、2,077,333 B，其中 7 个未被引用，共 435,436 B：
  - founder-1..4.webp、founder-4-avatar.webp 与对应的 `*-natural` 文件字节完全相同（md5 一致）；
  - team.webp 与 team-natural.webp 相同；
  - portraits.webp 未使用。
- `public/media` 下 5 个 SVG（共 9.6 KB）未被引用；截图全部被引用。
- **`mix-blend-mode` 使用位置**：`.art-on-white`（multiply）和 `.art-on-black`（screen）。
  - 首页 5 处：hero 1425×860 screen、方案图 multiply、wave 带 screen、engagement multiply、收尾 aurora 1425×605 screen；
  - 内页首屏 multiply，加收尾 aurora screen。
  - 另外 hero 舞台有 `backdrop-filter: blur(40px)` 和 `filter: blur(64px)` 的大面积层。

### 2.5 CSS / Token / 字号

- **硬编码统计**（components 与 app 下的 TSX/TS）：
  - hex 字面量 **486** 处，**66** 种；rgba 21 处，17 种；
  - Tailwind 任意色类（如 `bg-[#…]`、`text-[#…]`）**353** 个，72 种；
  - `text-[Npx]` **289** 个；
  - `var(--…)` 只有 **10** 处（只用了 `--fs-h2` 和 `--fs-display`）。
  - `site.css` 自己也硬编码了 #000000、#030B12、#FFFFFF、#64748B 等。
- **不同字号取值**（渲染后统计，每种语言 12 页并集）：中文、英文在 1440 宽下各 **27 级**，在 390 宽下各 **24 级**，预算为 ≤10 级。
- **≤12px 字符占比**（渲染后按字符计，预算 ≤8%）：

| 页面 | 1440 宽 | 390 宽 |
|---|---|---|
| 中文首页 | **14.1%** | **13.6%** |
| 英文首页 | **12.3%** | **12.0%** |
| /cases | 18.1% | — |
| /services | 13.4% | — |

  HTML 文本中没有 <12px 的字，但技术页 SVG 文字在 390 宽下渲染为 **7 px**。
- **`!important`**：7 个，都在 reduced-motion 块里。
- **断点**：只有 640/768/1024（sm/md/lg）和手写的 768/1024，没有 xl。
- **版心宽度**：1023→1024 为 928→929，1279→1280 为 1184→1185，都没有跳变；**767→768 为 712→673（−39 px）**，因为左右留白从 20 px 变成 40 px。H1 字号用 clamp 连续变化。

### 2.6 动效对照

| 要求 | 结果 |
|---|---|
| 进入动效：淡入 + 上移 16px、360ms、错开 70ms | **有缺陷**：实际 18px / 520ms（`site.css:387-397`），错开为 70ms 或 60ms；不作用于首屏；禁用 JS 时 15/15 区块一直不可见 |
| 工作流图按步骤点亮 | **无**：`CaseWorkflowGraph` 是静态的；首页工作流需手动切换 tab |
| 首屏 Canvas 动效 | **有，但有缺陷**：DPR 封顶 1.75（合理）；按帧 `t+=0.014` 步进，不是按时间；离屏后 rAF 不停；只监听 window resize，不用 ResizeObserver；reduced-motion 下只画一帧静态画面（合格）；每次 pointermove 都调用 getBoundingClientRect |
| 数字滚动到位 | **无**（ResultsBand 是静态数字） |
| 图表随拖动实时重算 | **有，但有缺陷**：见下方技术页曲线 |
| 溯源线 | **部分**：Hero 用 setInterval 每 2.8 s 轮换高亮来源，有暂停按钮，但离屏不暂停 |
| 页面过渡 | **无** |
| 只动 transform / opacity | **有缺陷**：`.link-inline-tech:hover` 动 `gap`（布局属性，22 处），另有 7 处 `transition-all` |
| prefers-reduced-motion | **合格**：rAF 为 0，reveal 全部显示，hero 暂停，scroll-behavior 为 auto |

**技术页曲线**：
- 圆点 y 坐标按线性插值计算，而曲线是二次贝塞尔。Cyano Core 圆点在 T25 / T50 / T80 / T100 分别偏离曲线 5.6 / 10.5 / 13.7 / 15.0 个 viewBox 单位（桌面约 12–32 px）；原始曲线圆点最多偏离 3.5 个单位。
- 显示的数值来自代码公式（`TechVisuals.tsx:229-236`）：`240+turn*27.5` ms、`145+min(turn,20)*1.8` ms、`14+turn*0.32`%，**不是测量值**。

### 2.7 对比度（最低 15 组，渲染后实测）

| # | 比值 | 前景 / 背景 | 文字 | 位置 | 结论 |
|---|---|---|---|---|---|
| 1 | 1.61 | #CCCCCC / #FFFFFF | 13px “/” 分隔符 | `/`，`aria-hidden` | 装饰性，豁免 |
| 2 | **3.19** | #D97706 / #FFFFFF | 12px/500 | `/services/document-automation` | 不合格 |
| 3 | **3.54** | #888888 / #FFFFFF | 12px | `/insights/proposal-draft-in-15-minutes` | 不合格 |
| 4 | **3.68** | #0891B2 / #FFFFFF | 12px/700 “01 输入源” | `/cases/proposal-generation` | 不合格 |
| 5 | **3.77** | #059669 / #FFFFFF | 12px/700 “03 规则校验” | 同上 | 不合格 |
| 6 | 4.53 | #64748B / #F6FAFC | 13px | `/`、`/en` | 合格 |
| 7 | 4.70 | #E11D48 / #FFFFFF | 12px | 案例页 | 合格 |
| 8 | 4.76 | #64748B / #FFFFFF | 12px | 技术页、文章页 | 合格 |
| 9 | 4.78 | #B45309 / #F6FAFC | 12px | — | 合格 |
| 10 | 4.79 | #0B7A8C / #F6FAFC | 12–13px | — | 合格 |
| 11 | 5.02 | #B45309 / #FFFFFF | — | — | 合格 |
| 12 | 5.03 | #0B7A8C / #FFFFFF | — | — | 合格 |
| 13 | 5.03 | #FFFFFF / #0B7A8C | 按钮 | — | 合格 |
| 14 | 5.10 | #0E7490 / #F6FAFC | — | — | 合格 |
| 15 | 5.32 | rgba(255,255,255,.5)≈#808080 / #000000 | — | — | 合格 |

- **焦点环**：
  - 浅色背景上的 #0B7A8C：5.03（白底）/ 4.79（#F6FAFC），合格。
  - 深色区的 #22D3EE，合格。
  - **首页页头**：页头不在 `.surface-dark` 内，焦点环用的是浅色值 #0B7A8C，落在 #333333 上只有 **2.51:1**，不合格。
- **输入框**：
  - 静态边框 #64748B / #FFF 为 4.76，合格。
  - **焦点态**：`outline:none`，边框从 #64748B 变成 #0B7A8C，两者对比只有 **1.06:1**；外加 rgba(11,122,140,.16) 的 3px 光晕，与白底对比约 **1.24:1**。**低于 3:1，不合格。**
- **可点击目标**：抽查 9 个页面 / 视口，除联系页同意复选框 20×20 外全部 ≥24×24。该复选框有可点击的 label，严格来说仍算不合格。
- **其他**：390 宽下无水平溢出。

### 2.8 页头灰带（已核实）

- `/` 在 1440 和 390 下，页头计算背景都是 `oklab(0 0 0 / 0.8)`（`bg-[#000000]/80` 加 `backdrop-blur-md`）。
- 页头是 `position: sticky`，留在文档流里（`main` 的 top 为 77），它背后的元素是 **BODY，背景 #FFFFFF**。黑色 80% 叠在白色上，得到 0.2×255 = 51，即 **#333333**。
- 截屏取色：(720,8) 和 (792,70) 都是 **#333333**，紧接着的 hero 在 (720,120) 是 **#06090E**，形成明显断层。
- 滚动 600 px 后页头下方变成深色内容，取色为 #051014 或 #010203，灰带消失。
- `/en` 情况相同；`/technology`（浅色页头）是 #FFFEFF，正常。
- 代码位置：`Header.tsx:132-142`。

### 2.9 响应头、缓存、SEO

- **安全头**（所有路径）：CSP（`default-src 'self'`，但 **`script-src 'unsafe-inline'`**、`style-src 'unsafe-inline'`）、HSTS（`max-age=63072000; includeSubDomains; preload`）、nosniff、Referrer-Policy、Permissions-Policy、X-Frame-Options SAMEORIGIN；`poweredByHeader` 已关闭。
- **缓存**：
  - HTML：`s-maxage=31536000`，`x-nextjs-prerender: 1`，`x-nextjs-cache: HIT`，即全站 SSG。
  - `/_next/static`：immutable。
  - `/fonts/*` 和 `/art/*` 也是 `public, max-age=31536000, immutable`，但**文件名没有哈希**。
- **结构化数据**（全部能被 JSON 解析）：

| 页面 | 类型 |
|---|---|
| `/`、`/en` | Organization、WebSite |
| 解决方案详情 | BreadcrumbList(3)、Service、FAQPage(3 问) |
| `/engagement` | BreadcrumbList、FAQPage(7 问) |
| 文章 | BreadcrumbList、Article |
| 其他内页 | BreadcrumbList |
| `/privacy` | 无 |

  Article 的 author 是没有 `name` 的 Person，也没有 `image`。
- **sitemap**：46 个 URL，每个都带 zh-CN 和 en 的 `xhtml:link` alternate（没有 x-default），lastmod 全部硬编码为 2026-11-12。robots 正确。
- **页面 meta**：每页有 canonical 和 hreflang（zh-CN / en / x-default）；46 个页面的 title 和 description 都 **46/46 唯一**。英文页有 11 个过长，例如 `/en/cases/sales-consultant-ai` title 101 字符、description 181 字符，`/en` 的 description 179 字符。
- **404**：
  - 根路径下的 404（如 `/does-not-exist`）SSR 输出 `<html id="__next_error__">`，body 为空，**没有 `<title>`，也没有 lang**。客户端渲染后能显示 H1，但 title 仍为空。`/en/nope` 同样 title 为空。
  - `/favicon.ico` 返回 404（站点声明的图标是 icon.svg）。
- **console**：抽查的页面都没有 JS 错误。

### 2.10 代码质量

- **大文件**：
  - PageTemplates.tsx：2,166 行，85,135 B，13 个视图。
  - CaseVisuals.tsx：778 行，其中 AnnotatedSystemGallery 283 行。
  - HomeVisuals.tsx：613 行。
- **客户端组件**：9 个 `"use client"` 文件（ResultsBand 这类没有状态的组件也被标成了客户端组件）。
- **内联文案**：`t(locale,…)` 188 处；TS/TSX 中有 3,440 个汉字，content JSON 中有 22,852 个，代码内占 **13.1%**。
- **内容校验**：cases、solutions、founders、insights 在模块加载时用 zod parse（客户端也会执行）；siteCopy、articles、availability **没有 schema**。
- **新增一个案例实际要改的地方**：
  1. `content/cases-v2.json`：hotspots、workflow、timeline 必须恰好 4 项，stats、challenges、techHighlights 必须恰好 3 项；
  2. 把截图放进 `public/media/<slug>/`；
  3. 手动运行 `scripts/prepare-v2-media-and-fonts.mjs` 重新生成 `lib/media-manifest.json`；
  4. 在仓库根目录的 `content/sources.md` 里补 sourceId；
  5. **修改 `scripts/validate-v2.mjs` 里的硬编码计数（6 个案例、31 张截图）**，否则构建失败；
  6. 如果是新行业，还要改 `lib/schema.ts` 的 enum、`lib/content.ts` 的 `industriesList`、`CaseVisuals.tsx` 的 `INDUSTRY_ACCENT`；
  7. 如果有演示，改 `availability.json`；交互 Demo 只支持 kb / sql，并且由 `PageTemplates.tsx:915-916` 按 slug 硬编码决定。

  **合计 5–9 处，其中 1–4 处是代码或脚本。**
- **死代码 / 未用资源**：
  - 未用资源见 2.3 与 2.4（art 7 个文件 435 KB、fonts 72.8 KB、media 5 个 SVG）。
  - node_modules 中 framer-motion（5.4 MB）、next-intl 仍在；`npm ls` 报告 **30 个 extraneous 包**。
  - **package-lock.json 的根依赖仍声明 framer-motion ^12 和 next-intl ^4，version 为 0.1.0，而 package.json 是 2.0.0**，两者不同步，预计 `npm ci` 会失败（未实际执行）。
- **scripts/**：共 9 个脚本。
  - validate-v2：计数校验、sourceId 校验、禁用词校验。
  - subset-font：按用字子集化。
  - scan：构建后扫描 HTML 禁用词。
  - smoke、preflight：链接与 API 冒烟测试。
  - process-* / prepare-*：资产处理。
  - fetch-fonts：从 Google Fonts 拉取字体，产物 `public/fonts/inter|manrope.woff2` 已不再使用。
- **lint / 测试 / CI**：**都没有**（无 ESLint 配置、无测试框架、无 `.github`）。
- **类型检查**：`tsc --noEmit --incremental false`，**0 错误**（755 个文件，1.2 s）。

### 2.11 表单与 API（`app/api/contact/route.ts`、`components/ContactForm.tsx`）

用 curl 实测（只发无效载荷，避免真实投递）：

| 请求 | 结果 |
|---|---|
| 空字段 | 400（返回中文提示） |
| 跨域 Origin | 403 |
| 非 JSON | 400 |
| 数组 | 400 |
| 蜜罐字段 `website` 有值 | 400 |
| GET | 405 |

- **校验**：服务端用 zod（邮箱、长度、枚举、consent 等），客户端只靠原生 required，**message 的 ≥10 字符要求前端不校验**，也没有 aria-invalid 或字段级错误。
- **限流**：进程内 `Map`，每小时 5 次，key 为 XFF 第一段的 sha256；只有在校验通过且投递已配置时才计数；重启或多实例时失效。
- **滥用防护**：有 Origin 校验、16 KB 上限、蜜罐，没有人机验证。**自动回执会发给用户填写的任意邮箱。**
- **失败处理**：投递失败返回 502，但线索不做任何留存；未配置投递时返回 503，提示“信息尚未发送”。
- **成功后焦点**：焦点移到 `role=status`、`tabIndex=-1` 的成功区（合格）；失败时焦点移到 `role=alert`（合格）。
- **移动菜单**：inert、焦点移入、Esc 关闭后焦点回到按钮，均合格。
- **画廊灯箱**：`role=dialog` 加 `aria-modal`，打开时焦点移到关闭按钮，但**没有焦点陷阱，背景也没有设为 inert**。

---

## 3. 问题清单（按严重度排序）

1. **【严重】首屏 JS 超预算 48%，没有路由拆分和懒加载，内容与 zod 进了客户端**
   - 位置：所有页面；`components/*.tsx`（9 个 `"use client"` 模块 import `@/lib/content`）；`lib/content.ts:15-31`。
   - 现象：每页首屏 JS gzip 266.9 KB，预算 180 KB；所有页面 chunk 集合完全相同，page chunk 只有 148 B；chunk 9295（69.9 KB gz）是双语全量内容 JSON，chunk 455 带着 zod（24.8 KB gz，含 lucide）；InteractiveDemo、Canvas、各类图形组件没有任何 `next/dynamic`；英文页也下载 19.5K 汉字；客户端启动时还要执行 zod parse，这是手机 TBT 112–276 ms 的主要来源之一。
   - 建议：
     - 只把渲染所需的“已选语言、已裁剪字段”作为 props 传给客户端组件，客户端禁止 import `lib/content`（加 `import "server-only"` 防护）；
     - zod 校验移到构建期或服务端；
     - 交互 Demo、Canvas、图表、灯箱用 `next/dynamic` 加可见性触发懒加载；
     - 拆分 PageTemplates，让每个路由只引用自己的客户端组件。

2. **【严重】新增案例、文章、方案无法“只改内容文件”**
   - 位置：`scripts/validate-v2.mjs:19-22`（6 / 4 / 4 / 3 计数）、`:24-48`（31 张截图）；`lib/schema.ts`（大量 `.length(3)` / `.length(4)`）；`lib/content.ts:99-106`；`CaseVisuals.tsx:29`；`PageTemplates.tsx:915-916`。
   - 现象：validate-v2 是 `npm run build` 的第一步，加一个案例或一篇文章构建就会失败；workflow 步骤、热点数量被写死成固定长度；media-manifest 要手动跑脚本；新增行业要改 3 个代码文件；交互 Demo 按 slug 硬编码。
   - 建议：
     - 删除计数断言，改成结构与引用完整性校验；
     - 数组改为 min/max；
     - 把 media-manifest 生成并入 build；
     - 行业表、强调色、Demo 映射都移进内容文件。

3. **【严重】所有字重都失效（中文、Inter、JetBrains）**
   - 位置：`scripts/subset-font.mjs:22`（Inter 钉死 wght 450）、`:39`（Mono 500）、`:191`（Noto 400）；`app/(zh)/layout.tsx:8-26`；`cjk-font.css`（声明 400–700）。
   - 现象：子集是静态单字重，但 @font-face 声明了字重范围，浏览器既不切换字重也不合成粗体。实测 300–700 墨量完全相同。中文首页 1,242 个 500–700 字重的字符、英文首页 1,482 个 Inter 500/600 字符都按常规字重渲染，`font-semibold` 全站无效，标题和强调的层级塌缩。
   - 建议：
     - 保留 wght 轴做子集（harfbuzz subset 支持 variable），或分别产出 400 / 500 / 600 的静态文件并如实声明；
     - Inter 的子集码位补上 → ‑ § ¥ μ。

4. **【严重】焦点指示不达标（WCAG 1.4.11，项目要求 ≥3:1）**
   - 位置：`app/styles/site.css:358-365`；`site.css:83-92`；`Header.tsx:155`。
   - 现象：
     - 输入框、下拉框、文本域聚焦时 `outline:none`，边框从 #64748B 变为 #0B7A8C，对比只有 1.06:1，16% 光晕约 1.24:1，键盘用户几乎看不出焦点在哪；
     - 首页深色页头中的链接和按钮使用浅色焦点环 #0B7A8C，落在 #333333 上只有 2.51:1。
   - 建议：
     - 输入框改用 2px 实色 outline 或 box-shadow（#0B7A8C，加 2px offset）；
     - 给深色页头加 `.surface-dark` 或单独设置焦点环颜色为 #22D3EE。

5. **【重要】英文页下载 100 KB 中文字体和 zh 的 CSS**
   - 位置：`app/(zh)/layout.tsx:39-45`（手写 `<link rel=preload>`），加上 Header 语言切换 Link 的预取。
   - 现象：在 /en，预取 `/` 后 React 把 noto-sc-core 的 preload（99,504 B）和 60df…css 注入页面（initiator=script），桌面 t=735 ms、手机 t=1,889 ms 开始下载；中文页同样会加载 en 的 d215…css。
   - 建议：
     - 删掉手写 preload，改用 `next/font/local` 管理 Noto（自动按布局 preload）；
     - 或者给语言切换链接设置 `prefetch={false}`。

6. **【重要】图片完全没有走优化管线**
   - 位置：`next.config.ts:17-20`。
   - 现象：`unoptimized:true` 导致 0 个 srcset、0 张 AVIF，`formats` 配置不生效；案例缩略图过量 14.8 倍，桌面方案图过量 3.5 倍；技术页首屏图片 232.7 KB，超过 220 KB 预算；LCP 请求优先级为 Low。
   - 建议：
     - 关闭 unoptimized（自托管时启用 sharp），或者构建期用 sharp 产出多尺寸 AVIF/WebP，用 `<picture>` 加 srcset；
     - LCP 图片加 `fetchPriority="high"`；
     - 把 `priority` 换成 Next 16 的 `preload` 或 `loading="eager"`（`PageTemplates.tsx:174`、`PageHeaders.tsx:125`，`priority` 在 Next 16 已弃用）。

7. **【重要】手机首页性能贴线或超线**
   - 位置：`/`（4x CPU、Fast 4G）。
   - 现象：两次测量 LCP 为 2,024 ms 和 2,548 ms，TBT 为 112 ms 和 276 ms，第二次两项都超预算；LCP 元素是装饰性的 hero 图（`aria-hidden`），而不是标题；静置时主线程占用 21.7–28.9%（Canvas）。
   - 建议：
     - 先完成问题 1、5、6；
     - 手机端降低 Canvas 帧率或改成静态图；
     - hero 背景图按视口尺寸出图。

8. **【重要】Canvas 与 Hero 动画实现质量**
   - 位置：`components/MotionPrimitives.tsx:85,164-171,173-178,189`；`HeroProvenanceStage.tsx:23-47`。
   - 现象：
     - 用帧计数推进时间（`t+=0.014`），120 Hz 屏幕上速度翻倍；
     - 离屏时只是跳过绘制，rAF 循环一直在跑（实测 2 s 内 241 次）；
     - 每次 pointermove 都调用 getBoundingClientRect；
     - 只监听 window resize；
     - Hero 的 setInterval 离屏也不暂停，每 2.8 s 触发一次重渲染。
   - 建议：
     - 改用 `performance.now()` 时间差驱动；
     - 用 IntersectionObserver 加 visibilitychange 真正停止 rAF 和 interval；
     - 改用 ResizeObserver；
     - 在 resize 时缓存 rect。

9. **【重要】动效规格未兑现**
   - 位置：`site.css:387-397`、`:297-312`；`CaseVisuals.tsx:678-743`；`HomeVisuals.tsx:58-140`。
   - 现象：
     - 进入动效是 18px / 520ms，要求是 16px / 360ms；
     - 没有数字滚动，工作流图不会按步骤点亮，也没有页面过渡；
     - `.link-inline-tech:hover` 动画 `gap`（布局属性，22 处），另有 7 处 `transition-all`。
   - 建议：
     - 按规格修改；
     - hover 位移用 transform 实现；
     - 补上计数动画、按步骤点亮（用 IntersectionObserver 驱动，reduced-motion 时直接显示终态）；
     - 可以考虑 View Transitions。

10. **【重要】技术页交互曲线“不真实”**
    - 位置：`components/TechVisuals.tsx:229-236`、`:283-327`。
    - 现象：
      - 圆点 y 坐标按线性插值，而曲线是二次贝塞尔，Core 圆点最大偏离 15 个 viewBox 单位（桌面约 32 px）；
      - 数值是 `240+turn*27.5` 这类线性公式，却以 “~ms*” 的形式呈现为测量值；
      - SVG 轴标签在 390 宽下只有 7 px，字体为系统 monospace。
    - 建议：
      - 从同一组真实基准数据生成曲线 path 和圆点（插值或解析求 t）；
      - 数据放进内容文件并标注来源；
      - 轴标签改成 HTML 叠加，或保证最小 12 px 并使用自托管字体。

11. **【重要】设计 Token 名存实亡，字号失控**
    - 位置：全部组件；`app/styles/tokens.css`。
    - 现象：
      - 组件里 486 处 hex（66 种）、353 个任意色类、289 个 `text-[Npx]`，`var()` 只有 10 处；
      - 每种语言渲染出 27 级字号（预算 ≤10）；
      - ≤12px 字符占比：首页 12.0–14.1%，/cases 18.1%（预算 ≤8%）。
    - 建议：
      - 在 Tailwind v4 的 `@theme` 里把 Token 定义成工具类（`text-ink-strong`、`text-meta` 等）；
      - 加 stylelint 或 eslint 规则禁止 `#hex` 和 `text-[px]`；
      - 字号收敛到 8–10 级，12px 只用于少量标签。

12. **【重要】首页首屏页头是 #333333 灰带**
    - 位置：`components/Header.tsx:132-142`、`:155`。
    - 现象：sticky 页头留在文档流中，它背后是白色 body；80% 黑叠白得到 #333333（截屏取色核实），与下方 #000 hero 断层。
    - 建议：首页页头不透明度 0 时直接用 #000（或 `--bg-obsidian`），或者 hero 用负 margin 延伸到页头下方，或者首页 body / html 背景设为黑色。

13. **【重要】字体和艺术图 immutable 缓存但文件名没有哈希**
    - 位置：`next.config.ts:55-72`；`scripts/subset-font.mjs:126`。
    - 现象：中文子集每次构建按用字重新生成，文件名却一直是 `noto-sc-core.woff2`，回访用户一年内都会用旧子集，新增的汉字会回退到系统字体；art 图片同理。
    - 建议：文件名加内容哈希（或交给 next/font 处理），或者去掉 immutable。

14. **【重要】等宽类中文和部分符号回退到系统字体**
    - 位置：`site.css:167-170`；`Header.tsx:304`；`TechVisuals.tsx:319-327`。
    - 现象：`.font-mono-tech` 字体栈不含思源黑体，实测首页、案例页、技术页、文章页等宽文本里的汉字全部用系统字体渲染（各页涉及几十到上百个不同字符）；→ ¥ § μ ‑ 在子集中缺失；语言切换按钮和 SVG 标签用的也是系统字体。
    - 建议：mono 字体栈追加 `"Noto Sans SC Subset"`；子集脚本补上符号；SVG 使用 `var(--font-mono)`。

15. **【重要】PageTemplates 巨型文件，文案和代码混杂**
    - 位置：`components/PageTemplates.tsx`（2,166 行）；`lib/content.ts:108-221`（法律条款）；`InteractiveDemo.tsx:8-64`（628 个汉字）；`ContactForm.tsx:182-188`。
    - 现象：13 个视图在同一个文件里，单个函数最长 318 行；有 188 处内联双语字符串，代码中汉字占 13.1%；siteCopy、articles、availability 没有 schema。
    - 建议：
      - 按路由拆成 `views/*` 和 `sections/*`；
      - 内联文案迁入 `site-copy`，加 key 完整性校验；
      - 所有 JSON 都用 zod 在构建期校验。

16. **【重要】联系 API 可被滥用，线索可能丢失**
    - 位置：`app/api/contact/route.ts:18`、`:71-73`、`:103-106`、`:129-140`、`:170-179`。
    - 现象：
      - 自动回执发给用户填写的邮箱，攻击者可以借站点向任意地址发信；
      - 限流是进程内 Map，key 用可伪造的 XFF 第一段，而且只在校验通过后计数；
      - 没有人机验证，也没有最短填写时间检查；
      - 投递失败时不做任何留存，线索直接丢失。
    - 建议：
      - 取消自动回执，或只在通过 Turnstile 等验证后发送；
      - 用平台提供的可信 IP 加 KV / Redis 做限流，并对所有请求计数；
      - 失败时写入队列或存储并告警。

17. **【重要】缺少工程保障，依赖状态不一致**
    - 位置：`site/package.json`、`package-lock.json`；仓库根目录。
    - 现象：没有 ESLint、没有测试、没有 CI；lockfile 根依赖仍有 framer-motion 和 next-intl，版本号是 0.1.0 而 package.json 是 2.0.0；`npm ls` 报告 30 个 extraneous 包。
    - 建议：重新生成 lockfile；加 eslint-config-next 和 `tsc`；把 smoke 脚本接入 CI，并加 Playwright 与 axe 冒烟测试。

18. **【一般】禁用 JS 或水合失败时内容不可见**
    - 位置：`site.css:387-392`；`MotionPrimitives.tsx:8-55`。
    - 现象：15 个 `.reveal-block` 的 SSR 初始状态是 `opacity:0`，没有 `<noscript>` 兜底，禁用 JS 时 15/15 不可见。
    - 建议：用 `html.js` 类或 `@media (scripting: enabled)` 控制初始隐藏。

19. **【一般】404 页没有 title 和 lang，SSR 内容为空**
    - 位置：根路径 404（`/does-not-exist`）；`app/(zh)/[...missing]`。
    - 现象：SSR 输出 `<html id="__next_error__">`，body 为空，title 为空；`/en/nope` 的 title 也为空；`/favicon.ico` 返回 404。
    - 建议：在 not-found 中导出 metadata（如 “页面未找到 | Cyano”）；多根布局时提供全局 not-found；补上 favicon.ico。

20. **【一般】4 组小字对比度不足**
    - 位置：
      - `/services/document-automation`：#D97706，3.19；
      - `/insights/proposal-draft-in-15-minutes`：#888888，3.54；
      - `/cases/proposal-generation`：#0891B2，3.68；#059669，3.77。
    - 现象：12px 文字低于 4.5:1。
    - 建议：改用 Token 中的深色系（`--accent-amber-ink` #B45309、`--ink-muted` #52606D、`--accent-cyano-ink` #0B7A8C 等）。

21. **【一般】标题层级跳级**
    - 位置：`/cases`、`/insights`（`CaseVisuals.tsx:116` 的 CaseCard 用 h3、EditorialVisuals 的卡片也用 h3）。
    - 现象：H1 之后直接出现 H3。
    - 建议：列表页加一个 h2（可以是 sr-only），或让卡片标题层级由 props 决定。

22. **【一般】灯箱没有焦点陷阱**
    - 位置：`components/CaseVisuals.tsx:414-434`、`:600-676`。
    - 现象：`role=dialog` 加 `aria-modal`，但 Tab 可以移出对话框，背景没有设为 inert。
    - 建议：复用移动菜单的 inert 和焦点陷阱逻辑，或改用原生 `<dialog>.showModal()`。

23. **【一般】表单校验体验**
    - 位置：`components/ContactForm.tsx:95-147`、`:329-340`、`:357`。
    - 现象：没有字段级错误和 aria-invalid / aria-describedby；message 的最少 10 个字符只在服务端校验，返回笼统提示；同意复选框 20×20。
    - 建议：客户端用同一份 zod schema 做字段校验并关联错误信息；加 `minLength`；复选框至少 24px。

24. **【一般】资源冗余**
    - 位置：`public/art`、`public/fonts`、`public/media`；`node_modules`。
    - 现象：art 下 7 个未引用文件共 435 KB（其中 5 个与 `*-natural` 字节相同）；`inter.woff2` 和 `manrope.woff2` 共 72.8 KB 未用；5 个 SVG 未用；每页都下载两个 logo；首页 46 个 RSC 预取请求共 319 KB；每页额外加载另一语言的布局 CSS。
    - 建议：删除未用文件；logo 改为单个 SVG（currentColor）；减少视口内 Link 预取。

25. **【一般】CSP 与缓存细节**
    - 位置：`next.config.ts:3-13`。
    - 现象：`script-src 'unsafe-inline'` 削弱了 CSP；HTML 只有 `s-maxage`。
    - 建议：评估对 SSG 内联脚本使用 hash 或 nonce（可以借助 Next 16 的相关支持）；在 CDN 层设置 `stale-while-revalidate`。

26. **【一般】SEO 细节**
    - 位置：`lib/content.ts:364-392`、`app/sitemap.ts:10`；英文 SEO 文案。
    - 现象：Article 的 author 没有 `name`，也没有 `image`；英文有 11 页 title 或 description 过长（最长 title 101 字符）；sitemap lastmod 硬编码；sitemap 没有 x-default。
    - 建议：补全 Article 字段；英文 title 控制在约 60 字符、description 约 155 字符；lastmod 取自内容日期。

27. **【一般】静默回退会掩盖内容错误**
    - 位置：`lib/content.ts:41-49`（`getMediaMeta`）、`:75-77`（`getFounder`）。
    - 现象：新图片没有登记到 manifest 时，会静默使用 1440×900、无占位，导致宽高比错误、有 CLS 风险；未知作者会被显示成第一位创始人。
    - 建议：构建期直接报错，不做静默回退。

28. **【一般】版心在 767→768 处跳变**
    - 位置：`site.css:97-106`。
    - 现象：版心宽度从 712 px 跳到 673 px（左右留白 20→40 px）；section 内边距在 1024 处从 92 px 跳到 148 px。
    - 建议：左右留白用 `clamp(20px, 5vw, 40px)` 连续过渡。

---

## 4. 做得好的、可以保留不动

- **全站 SSG 与路由**：`generateStaticParams` 加 `dynamicParams=false`；中英文分成两个根布局，`lang` 正确；46 个 URL 都是静态预渲染。
- **布局稳定**：CLS 全部为 0；滚动全程没有超过 50 ms 的长任务（只有技术页 1 帧 58 ms）；桌面 LCP 0.2–0.7 s；内页 LCP 图片有 preload。
- **安全响应头**：齐全（CSP、HSTS、nosniff、Referrer-Policy、Permissions-Policy、XFO），`poweredByHeader` 已关闭；`/_next/static` 使用 immutable 缓存。
- **SEO 基础**：
  - 每页 title 和 description 都唯一（46/46），有 canonical 和三向 hreflang；
  - sitemap 带 alternates，robots 正确；
  - JSON-LD 类型齐全（Organization、WebSite、Service、Article、BreadcrumbList、FAQPage），并且都能被正确解析。
- **可访问性工程**：
  - 每页唯一 H1，有 skip link 和 landmark；
  - 移动菜单的 inert、焦点移入与返回、Esc 关闭、滚动锁定都做到了；
  - 下拉菜单有 aria-expanded，Hero 动画有暂停按钮；
  - reduced-motion 全面生效（rAF 为 0、终态直接显示、scroll-behavior 为 auto）；
  - 表单提交后焦点移到 status / alert 区；
  - 可点击目标基本都 ≥24px；
  - 390 宽下没有水平溢出。
- **内容模型方向正确**：zod schema 推导类型；构建前有禁用词、sourceId 溯源、截图存在性校验（去掉计数硬编码后值得保留）；构建后还会扫描 HTML 禁用词。
- **中文字体子集**：按全站用字自动生成，并拆成首页 core 和 ext 两部分，全角标点覆盖完整；首页首屏字体 128.7 KB，在预算内；Latin 字体用 next/font/local 自托管，带 size-adjust 回退。
- **API 的基本防线**：有 zod、Origin 校验、16 KB 上限、蜜罐、15 s / 5 s 超时和 HTML 转义；缺少配置时返回 503 并诚实提示“信息尚未发送”；客户端能区分网络错误。
- **TypeScript**：strict 模式，`tsc` 0 错误。
