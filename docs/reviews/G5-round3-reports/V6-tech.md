# V6 技术评审（R-TECH）— Cyano 官网 v3 本地实现（第 3 轮）

评审日期：2026-11-13　评审对象：`site\`（Next.js 16.4.6，`next build --webpack`，BUILD_ID `fw7-m939NgYDXUOjR1eC8`，19:00 构建），运行中的 `next start`（http://127.0.0.1:3010）。代码是 `ae74106` 之上未提交的改动（98 个已跟踪文件，+4,666 / −10,876 行，另有大量未跟踪新文件）。

方法：只读。curl 与 Node 脚本读取 HTML、构建产物和源码；无头 Chrome 157 测量（独立 profile，CDP 端口 9414，测完已关闭）。WebGL 走 SwiftShader（软件渲染）；`tsc --noEmit --incremental false`、`eslint`（不带 --fix）。测量脚本与原始输出在 `C:\Users\jiack\AppData\Local\Temp\claude\202c36f9dd01914c\d3228c04-82ea-4392-b60d-e1a12d8ed096\scratchpad\v6r3\`。

**过程说明**：约 22:2x 到 22:45，3010 端口停止监听，进程 PID 35072 消失。原因不在本评审，我也没有重启它。之后它由他人重新拉起（PID 68900）。核对结果：BUILD_ID 相同，首页 HTML 的 md5 与重启前的快照完全一致，所以前后两段测量对应同一个构建。

**未验证**：Lighthouse 分数（本机没有安装）、`npm ci` 实际执行、CI 实际运行、`npm run check:content`（脚本会写文件，按约束不运行，只读审阅）、真实邮件或网关投递、真实 GPU 下的帧耗时（本机为 SwiftShader）。

---

## 1. 六项分数

| 维度 | 第 2 轮 | 第 3 轮 | 是否过线（≥5） |
|---|---|---|---|
| 代码结构 | 4 | **4** | 否 |
| 性能 | 4 | **4** | 否 |
| 可访问性 | 5 | **5** | 过线 |
| 可维护性 | 3 | **4** | 否 |
| 健壮性 | 4 | **5** | 过线 |
| 工程展示力（附加） | 4 | **5** | — |

**代码结构 4（持平）**

进步：
- 运行时结构基本修好。每个路由都有自己的 page chunk（2.1–6.8 KB），应用级动态 chunk 有 4 个：光场、图表、交互 Demo、灯箱。
- `lib/content.ts`、`lib/v1-content.ts` 都加了 `server-only`，zod 和全量内容已不进客户端。
- `PageTemplates.tsx` 拆成 `components/v3/pages/*`，最大的 Home.tsx 只有 221 行。

扣分：源码层面是一次批量迁移（codemod）的产物，没有整理。
- `app/styles/v3-foundation.css` 共 62.9 KB，只有 11 行，其中一行长 39,560 个字符，是压缩形态的源码。
- 248 个选择器同时在 foundation 和 v3.css 里定义，靠后者覆盖；构建后的 CSS 里有 30 个 `!important`。
- TSX 是压缩式单行写法，`import` 散落在文件中间，例如 `interactive.tsx`、`islands/*`。
- 留有 5 个无人引用的文件：`PageTemplates.tsx`（门面）、`v3/interactive.tsx`、`v3/visuals.tsx`、`islands/AmbientFlow.tsx`、`lib/server-inputs.ts`。
- 内容并存三套来源：`content/v1/*`、`content/*-v2.json`、`content/v3/pages/*`。

**性能 4（持平；结构性指标大幅改善，但出现新的严重回退）**

改善：
- 首页首屏 JS 为 147.9 KB gz（预算 180 KB），v2 是 266.9 KB。
- 手机首页 LCP 从 2.0–2.5 s 降到 1.33 s；CLS 约等于 0。
- 图片改为 AVIF/WebP 多尺寸加哈希命名。
- 光场离屏和标签页隐藏时真正停止。

扣分：
- **手机首页 TBT 770–807 ms**（v2 是 112–276 ms）。trace 归因主要是 Layout：Noto 可变字体到达后整页重排 470–740 ms，`text-wrap: pretty/balance` 约占 30%。
- 手机首页静置时主线程占用 24–33%，与 v2 持平。其中约 16 个百分点来自装饰性无限循环动画 `stage-progress`，它每帧都触发样式重算。
- 首屏字体：首页 170.6 KB，内页 271.5 KB，预算 150 KB。
- 每页预加载一个 512×512、84.7 KB 的 `logo.png`，只按 32 px 显示。

**可访问性 5（持平，问题结构变了）**

已修：
- 页头焦点环用亮青（9.88:1）。
- 灯箱和截图放大改为原生 `<dialog>.showModal()`。
- 禁用 JS 时内容可见，`<noscript>` 中有四个工程问题。
- reduced-motion 下：无 canvas，rAF 为 0，没有运行中的动画，主线程 0%。

axe（wcag2a/2aa/21aa/22aa）在 8 个页面 / 视口下为 0 违规，**但 /about 有 1 个 serious 违规**：H2「按你的资料与流程，设计合适的系统。」颜色 #E8EEF0 在 #F8FAFA 上，对比度 **1.12:1**，几乎看不见。

其余问题：
- 输入框焦点环是 35% 透明的青色，只有 1.28:1。
- 输入框边界只有 1.27:1。
- /cases、/engagement、文章页的标题从 H1 跳到 H3。
- 同意复选框仍是 20×20。

**可维护性 4（+1）**

进步：
- 组件里的十六进制颜色从 486 处降到 **4 处**（只在两个 error.tsx 中），CSS 全部改用 Token。
- ESLint、`tsc`、GitHub Actions、Playwright + axe 冒烟测试都已接入。
- lockfile 与 package.json 同步（3.0.0），`validate-v2` 中写死的计数已移除。
- 字体和媒体文件名带内容哈希。

扣分：内容与代码的分离**回退**了。
- 英文案例正文、行业表、工期、合作模式、方案文案、文章标题、作者映射都写在 `lib/v1-content.ts` 的位置数组里（共 41 处 `[...][i]`）。
- 方案与案例之间、文章与案例图之间用下标耦合（`rawCases[i]`）。
- 页面文案的 key 是哈希值（`pageCopy.cacaceaf63e`，110 处）。
- 新增一个案例要改 6–8 处，其中 3–4 处是代码。
- 一次性迁移脚本仍留在 `scripts/`。

**健壮性 5（+1）**

做好的部分：
- 联系 API 取消了访客自动回执，改为“网关持久化确认后才返回成功”，失败或未配置时明确告诉用户未发送。
- `Picture` 和 `getMediaMeta` 查不到资源时直接抛错，不再静默回退。
- WebGL 编译失败、上下文丢失、不支持时都回到静态海报。
- 404 页有 title 和 noindex。

问题：
- 404 页的 SSR 没有 `lang`，body 为空；客户端水合后 `document.title` 变成空字符串。
- 技术页同屏同时出现「基于 Cyano 内部基准测试」和「不是内部基准测试结果」两句矛盾的说明。
- 结构化数据的面包屑名称变成了 slug。
- 内容靠下标映射，一旦顺序错位不会有任何报错。

**工程展示力 5（+1）**

亮点：
- 真正的原生 WebGL 光场：50% 分辨率，空闲 30 fps，交互时 60 fps，按时间差推进，用 IntersectionObserver 和 visibilitychange 真正停止，并处理了上下文丢失。
- 光场模块只有 2 KB gz。
- 数字滚动、卡片光斑跟随指针、四个工程问题支持键盘切换。
- 技术页曲线与圆点来自同一组数据，并标注为示意。

不足：
- 光场在首屏几乎被玻璃产品舞台挡住，可见部分只在右缘（像素变化最多 44 级，文字栏为 0）。
- 技术页没有做出“三通道汇聚”形态，只是同一个着色器降低透明度。
- 首屏舞台不会在案例之间切换。
- 工作流不会逐步点亮，溯源线没有画出动效。
- View Transitions 只写了 `@view-transition{navigation:auto}`，对 Next 的客户端导航不起作用。
- 首屏“真实界面”局部图源只有 440 px 宽，桌面放大 1.65 倍，手机 DPR 3 下只有约 0.36 倍分辨率，看起来发虚。

---

## 2. 测量结果

### 2.1 HTML 与首屏资源（gzip 为 zlib -9；JS 只计现代浏览器会加载的模块脚本）

| 页面 | HTML 原始 / gzip / br | 内联 RSC | 首屏 JS gzip（个数） | CSS gzip | 实际请求字体（传输字节） | 首屏图片（传输） | LCP 元素 / preload |
|---|---|---|---|---|---|---|---|
| `/` | 119,742 / 21,643 / 13,635 | 67,622 | **147,894**（11 个） | 20,906 + 2,698 | Noto core 114,963 + Inter 31,161 + Manrope 18,445 + Mono 6,024 = **170,593**（超预算） | logo.png 84,670 + 海报 1,717 + 首屏截图局部 11,442 = **97,829** | 桌面：**H1**（336 ms）；手机：首屏截图局部 `dd25…-320.avif`（1,332–1,344 ms）。preload：logo.png、海报；截图局部 `fetchpriority=high` |
| `/en` | 122,848 / 20,666 / 13,412 | 75,178 | **147,819**（11 个） | 20,906 + 428 | 3 个拉丁字体共 **55,630**，**没有 Noto** | 同 `/` | 桌面和手机都是 H1 |
| `/cases/proposal-generation` | 69,118 / 12,684 / 9,117 | 42,604 | **147,394**（10 个） | 20,906 + 2,698 | core 114,963 + ext 100,935 + 3 个拉丁字体 = **271,528** | 首屏只有 logo 和海报，共 86,387（另有主图 41,664 和缩略图在 203 ms 时开始预载） | H1 |
| `/technology` | 60,435 / 11,569 / 8,716 | 38,803 | **143,396**（9 个） | 20,906 + 2,698 | **271,528** | 86,387 | 正文 P `.large-copy` |

**JS 拆分（gzip）**：

| 类别 | 内容与大小 |
|---|---|
| 公共部分 | react-dom 63,911、next/router 67,049、8500 共 3,245、5495（Header 等）3,685、2606（lucide）3,977、webpack 1,843 |
| page chunk | 首页 133 B、案例详情 2,417、技术页 2,396、文章 1,846 |
| 动态 chunk | 光场 7702 **1,982**、图表 4506 1,414、交互 Demo 6553 5,465、灯箱 8128 657 |

- chunk 里已经没有 zod 和内容 JSON。
- 残留：交互 Demo chunk 中有 700 个汉字，英文页也会加载；Header 和表单 chunk 中有双语文案。

**CSS**：

| 文件 | 原始 | gzip | 说明 |
|---|---|---|---|
| 主样式 `54f2…css` | 108,487 B | 20,906 | v2 为 72,704 / 13,014，增加 61% |
| zh 字体 CSS | 7,233 B | 2,698 | |
| en 字体 CSS | 1,334 B | 428 | |

英文页不再交叉加载 zh 的 CSS（5 秒内只有 2 个样式表请求）。

**会话总量**（桌面首页，含滚动）：

| 类型 | 请求数 | 字节 |
|---|---|---|
| 脚本 | 22 | 188.3 KB |
| RSC 预取 | 41 | 162.8 KB |
| 合计 | 80 | 758.7 KB |

### 2.2 运行性能（CDP；TBT = FCP 到 load+3 s（桌面）或 +5 s（手机）之间 Σ(长任务 − 50 ms)，不等于 Lighthouse TBT）

**桌面 1440×900，不节流**

| 页面 | FCP / LCP | CLS | TBT（长任务） | 滚动整页 | 静置 5 s 主线程 |
|---|---|---|---|---|---|
| `/` | 336 / 336 | 0.0001 | **168**（64 / 196 / 72） | 长任务 0；>50 ms 帧 **7 个**，最长 **83 ms** | task **6.3%**，样式重算 548 次 / 5 s |
| `/en` | 260 / 260 | 0.0002 | 51 | 长任务 0；>50 ms 帧 5 个，最长 **133 ms** | 5.9% |
| `/technology` | 248 / 248 | 0 | 68 | 长任务 0，最长 25 ms | 2.0%，样式重算 0 |
| `/cases/proposal-generation` | 244 / 244 | 0 | 9 | 长任务 0；>50 ms 帧 2 个，最长 117 ms | 2.1% |

**手机 390×844，DPR 3，4x CPU，Fast 4G**

| 页面 | FCP / LCP | CLS | TBT（加载期长任务） | 滚动整页 | 静置主线程 |
|---|---|---|---|---|---|
| `/` 第 1 次 | 1,344 / **1,344** | 0 | **807**（265 / **642**） | 长任务 0，最长 58 ms | **23.9%**，样式重算 600 次 / 5 s |
| `/` 第 2 次 | 1,332 / 1,332 | 0 | **770**（256 / 148 / **516**） | 长任务 0，最长 42 ms | **24.2%** |
| `/en` | 968 / 968 | 0 | 139 | 长任务 0 | **33.3%** |
| `/technology` | 1,032 / 1,032 | 0 | 0 | **1 个长任务 55 ms**，最长帧 75 ms | 7.5% |
| `/cases/proposal-generation` | 1,320 / 1,320 | 0 | 217 | 长任务 0 | 11.7% |

**长任务归因**（手机首页 trace）：

| 时间点 | 时长 | 构成 |
|---|---|---|
| 483 ms | 1,173 ms | Layout 1,011 ms |
| 2,204 ms | 763 ms | Layout 739 ms，与 Noto core 到达时间吻合 |
| 1,962 ms | 230 ms | JS（3794 的 EvaluateScript）225 ms |

对照实验：

| 条件 | 两次大 Layout |
|---|---|
| 原样 | 1,011 / 739 ms |
| 关闭 `text-wrap` | 679 / 468 ms |
| 全部改用系统字体 | 594 ms；第二次（字体切换引起）**消失** |

结论：第一次 Layout 中有一部分是 Windows 上 CJK 系统回退字体的初始化成本，真机会有差异；第二次重排由可变 Noto 子集的字体切换引起，问题真实存在。

### 2.3 品牌光场（实测）

| 项 | 结果 |
|---|---|
| 是否 WebGL | 是，原生 `getContext('webgl')`，渲染器 ANGLE / SwiftShader。没有 three.js |
| 分辨率 | canvas 720×444，对应 CSS 1440×889，即 **50%**，DPR 按 1 计算 |
| 帧率 | 静置 **30.2 次 drawArrays / s**，指针移动时 **58.6 / s** |
| 离屏 | 滚到中段后 3 s 内 draws 0、rAF 0，**真正停止** |
| 标签页隐藏 | 伪造 `visibilitychange` 和切到真实后台标签页两种方式都是 0 draws / 0 rAF，恢复后继续 |
| 页面底部 | 收尾区光场在视口内，30 fps，属于预期 |
| reduced-motion | 不加载模块、无 canvas、只显示海报，rAF 为 0，运行中的动画为 0 |
| 体积 | 光场 chunk 1,982 B gz（自报 2,149），海报 AVIF 945 B，1440×900 |
| 加载时机 | 由 IntersectionObserver 触发，首屏立即加载；没有按计划在 FCP 之后的空闲时间加载 |
| 首屏 5 帧差异（间隔 1.5 s） | 全屏平均差 0.84 → 1.86 级；右上区平均差 12.4 级，最大 44 级，59.6% 的像素变化 ≥4 级；**文字栏（左 45%）最大 5 级**，只有颗粒 |
| 文字栏背后亮度 | 相对亮度 p50 0.0032、p90 0.0038（接近 N0 #070B0F），白色正文对比度约 19:1，**达标** |
| 是否肉眼可见 | 只在右缘 1360–1440 px 和右上角能看出缓慢流动的青光（像素约 #0E4250 → #0D3946）。三条流线被玻璃舞台和 blur(20px) 挡住 |
| 技术页 | 同一着色器，`.field-panel{opacity:.45}`，没有“三通道汇聚”形态；首屏 5 帧最大差 19 级 |
| 其他 | rAF 以显示刷新率（约 120 次 / s）空转，再在内部节流到 30 fps |

### 2.4 字体

**字重已经真正生效**（canvas 墨量法，40 px）：

| 字体 | 300 | 400 | 500 | 600 | 700 | 结论 |
|---|---|---|---|---|---|---|
| Noto Sans SC Subset | 2,273 | 3,434 | 4,257 | 4,795 | 5,322 | 有效 |
| interLatin | 3,155 | 4,131 | 4,899 | 5,629 | 6,336 | 有效 |
| manropeDisplay | 2,956 | 3,660 | 4,320 | 4,978 | 5,617 | 有效 |
| jetbrainsMono | 4,854 | 4,854 | 4,854 | 6,616 | 6,616 | 静态 500，600 以上是合成粗体 |

**字体文件**（读取 fvar 表）：

| 文件 | 大小 | 码位 | 字重轴 |
|---|---|---|---|
| noto-sc-core.0ffaf5e35a | 114,168 B | 452（445 个汉字） | wght 300–700 |
| noto-sc-ext.ed86848444 | 100,140 B | 362（357 个汉字） | wght 300–700 |
| inter-latin | 30,368 B | 111 | 100–900 |
| manrope-latin | 17,652 B | 122 | 200–800 |
| jetbrains-mono-latin | 5,232 B | — | 静态 500 |

- 可变字体子集每个字形约 250 B，v2 的静态子集约 136 B，这是首屏字体超预算的直接原因。

**回退检查**：
- 等宽文本中的汉字：0 处（首页、技术页、案例页、/en、/en/technology 都检查过）。
- SVG `<text>`：0 处，曲线轴标签已改为 HTML。
- 英文页的语言切换「中文」落到 Microsoft YaHei（系统字体）。
- 英文页没有请求 Noto；zh 页的 ext 子集只在内页加载。
- 子集对全站用字的覆盖：服务器中途停止，sitemap 扫描没有完成，**未验证**。自报“812 个中文字形”，实测 core + ext 共 802 个汉字码位，基本相符。

### 2.5 颜色、Token、字号

**硬编码统计**（components / app / lib 下的 TS/TSX/JS）：

| 项 | v2 | v3 |
|---|---|---|
| 十六进制字面量 | 486 | **4**（`#444444`、`#111111`，只在两个 error.tsx 中） |
| 任意色类 | 353 | 2（`text-[#…]`，同上） |
| `text-[Npx]` | 289 | **2** |

- v3.css 和 v3-foundation.css 中十六进制颜色为 0，rgba 也为 0，全部引用 `v3-tokens.css`。
- ESLint 有自定义 token 规则，但只覆盖 `components/**/*.tsx` 中的字符串字面量，app/ 和模板字符串不在范围内，所以 error.tsx 漏检。

**渲染后的字号**（每种语言 12 页取并集）：

| 视口 | 中文 | 英文 |
|---|---|---|
| 1440 | **9 级**（11.2、12、14、16、18、20、24、32、48） | **10 级**（以上 9 级加 68） |
| 390 | 8 级 | 9 级 |

/cases 有 11.2 px 文字，违反“禁止 11px”。

**≤12 px 字符占比**（v2 预算 ≤8%）：

| 页面 | 1440 宽 | 390 宽 |
|---|---|---|
| 中文首页 | **18.9%** | **21.9%** |
| 英文首页 | 18.3% | 21.2% |
| /cases | **28.8%** | 28.3% |
| /en/cases | 24.2% | 24.3% |
| /insights | 25.6% | 22.0% |
| /services/document-automation | 16.7% | 17.8% |

全部比 v2 的 12–18% 还高。原因是案例卡片的系统名、标签和 meta 都是 12 px。

**对比度最低的组**（渲染后实测；页头组的计算把背景当成白底，属于假阳性，已剔除）：

| # | 比值 | 前景 / 背景 | 文字 | 位置 | 结论 |
|---|---|---|---|---|---|
| 1 | **1.12** | #E8EEF0 / #F8FAFA | 32 px/300 的 H2「按你的资料与流程…」 | `/about` | **不合格**（axe serious） |
| 2 | 1.5 | #FFF / #CDD4D7 | 14 px「点击放大」 | 案例画廊 | 叠在截图上，需人工确认，疑似不合格 |
| 3 | **3.37** | #3898A8 / #FFF | 16 px 必填 * | `/contact` | 不合格 |
| 4 | 4.98 | #0B6F80 / #E8EEF0 | 14 px/500 eyebrow | 案例、技术页 | 合格 |
| 5 | 5.22 | #3898A8 / #111A21 | 12 px 编号 | 技术页 | 合格 |
| 6 | 5.34 | #52636B / #E8EEF0 | 12 px 系统名 / 标签 | 多页 | 合格 |
| 7 | 5.37 | #0B6F80 / #F3F6F7 | eyebrow | 多页 | 合格 |
| 8 | 5.57 | #0B6F80 / #F8FAFA | eyebrow | 多页 | 合格 |
| 9 | 5.75 | #B8CBD3 70% / #111A21 | 14 px 说明 | 技术页 | 合格 |
| 10 | 5.76 | #52636B / #F3F6F7 | 12–16 px | 多页 | 合格 |
| 11 | 5.83 | #0B6F80 / #FFF | 链接 | 多页 | 合格 |
| 12 | 5.97 | #52636B / #F8FAFA | 正文 | 多页 | 合格 |
| 13 | 6.0 | #B8CBD3 70% / #0B1117 | 说明 | 技术页 | 合格 |
| 14 | 6.26 | #52636B / #FFF | 正文 | 多页 | 合格 |
| 15 | 6.54 | #FB7185 / #111A21 | 14 px | 首页 | 合格 |

**焦点与目标尺寸**：

| 项 | 实测 | 结论 |
|---|---|---|
| 深色页头和深色区焦点环 | #38C8E0 / N0 = 9.88:1 | 合格 |
| 浅色区焦点环 | #0B6F80，5.4–5.8:1 | 合格 |
| 输入框焦点 | 1 px 边框变为 #0B6F80（与未聚焦边框对比 4.57），外加 **2 px 35% 透明青色 outline（对白底 1.28:1）**；计划要求“2px 实色描边” | 未做到 |
| 输入框静态边界 | rgba(12,28,36,.12) 叠 #F8FAFA，约 **1.27:1**（WCAG 1.4.11） | 不合格 |
| 可点击目标 <24 px | 同意复选框 20×20；页脚「隐私政策 / 使用条款」48×21；面包屑「首页」24×21；「向下探索」74×21 | 后两类可按间距例外豁免，复选框不行 |

**axe-core 4.x**（tags：wcag2a/2aa/21aa/22aa）：`/`（1440、390）、`/en`、`/cases`、`/cases/proposal-generation`、`/technology`（390）、`/contact`、文章页都是 **0**；`/about` 有 **1**（color-contrast，serious）。

### 2.6 材质（DOM 计算样式统计，1440 宽）

| 页面 | backdrop-filter | 渐变 | 颗粒 | 无限循环动画 |
|---|---|---|---|---|
| `/` | 3 处：页头 1440×81、产品舞台 719×536（压在动态 WebGL 上）、收尾面板 1280×218，都是 blur(20px) saturate(1.5) | 13 个 radial：10 个卡片指针光斑 `::after`、3 个工程纸圆点网格 | 只有着色器里的颗粒，CSS 中没有颗粒图层 | **3 个** `channel 7s infinite`（stage-progress） |
| 技术页、案例页、方案页、关于页、文章页 | 2 处（页头加收尾） | 1 个 linear（page-hero-shade）加 0–4 个指针光斑 | — | 0 |

其他统计：
- `mix-blend-mode` 为 0 处，`filter` 只有案例画廊按钮的 brightness 1 处。
- 同屏玻璃最多 2 块（页头加舞台），符合“≤3 块”。

**性能开销**：

| 页面 | 静置主线程（4x） | 说明 |
|---|---|---|
| 技术页 | 7.5% | 只有光场 |
| 首页 | 24–33% | 光场加 stage-progress 动画加玻璃 |

首页每 5 s 有 548–600 次样式重算，技术页为 0，说明多出的开销来自 `stage-progress` 的伪元素动画。玻璃叠在 30 fps 的 canvas 上，每帧都要重新模糊，这部分合成开销在 GPU 或合成线程，主线程数字体现不出来。

### 2.7 动效对照（计划 §4.9 和 W3-05）

| 要求 | 结果 |
|---|---|
| 品牌光场 | **有**（见 2.3）；技术页“三通道汇聚”形态**无**；滚动改变相位，**有** |
| 溯源线画出（stroke-dashoffset）与光点移动 | **无**：全站 CSS 和组件中没有 dashoffset；首屏只有 3 条 1 px 线的 translateX 循环 |
| 数字滚动到位 | **有**（`CountValue`）：700 ms，ease-out cubic，可见 60% 时触发，隐藏或离屏时直接显示终值，有 sr-only 真值 |
| 工作流逐步点亮 | **无**（`.workflow-step` 是静态的） |
| 卡片光斑跟随指针 | **有**；每次 pointermove 都调用 getBoundingClientRect |
| View Transitions（页头不动，内容淡入） | **有缺陷**：只写了 `@view-transition{navigation:auto}`，只对整页（跨文档）导航生效，Next `<Link>` 的客户端导航不会触发；也没有 `startViewTransition` |
| 首屏舞台每 6–8 s 在两三个案例之间切换，可暂停 | **无**：只显示一个案例；资料卡第 1 项固定高亮；`data-playing` 只用来暂停 CSS 动画 |
| 进入动效 16 px / 360 ms | **有**（`.motion-pending` translateY(16px)，.36 s）；禁用 JS 时不隐藏 |
| 时长与缓动 | 按钮 120 ms、卡片 240 ms，缓动 `cubic-bezier(.2,.7,.2,1)`，**符合** |
| 禁止装饰循环 | **违反**：`stage-progress` 无限循环（7 s） |
| reduced-motion | **合格**：无光场、无动画、无 rAF |

### 2.8 内容与代码分离

**新增一个案例实际要改的地方**：

| # | 位置 | 改什么 | 类型 |
|---|---|---|---|
| 1 | `content/v1/cases.json` | 中文正文、图片、stats、sourceId | 内容 |
| 2 | `lib/v1-content.ts` 的 `englishCases[i]` | 英文正文，按下标对应 | **代码** |
| 3 | `lib/v1-content.ts` 的 `industries.zh/en[i]`、工期数组 `[i]`、合作模式 `[0,1,4,5].includes(i)` | 按下标 | **代码** |
| 4 | `components/v3/ui.tsx` 的 `industryIcons[i]` | 按下标 | **代码** |
| 5 | `content/cases-v2.json` | 供 `generateStaticParams`、title、description 使用；新行业还要改 `lib/schema.ts` 的 `industryKey` 枚举（**代码**） | 内容 + 代码 |
| 6 | 仓库根目录 `content/sources.md` | sourceId | 内容 |
| 7 | `public/media/<slug>/` | 截图；`build-v3-media` 会在构建时自动生成 | 素材 |
| — | 顺带影响 | 方案 i 对应案例 i（`caseSlug: rawCases[i].slug`），文章配图取 `rawCases[2]`、`[1]`、`[0]`。插入新案例会让这些映射**静默错位** | — |

合计 6–8 处，其中 3–4 处是代码；v2 是 5–9 处，其中 1–4 处是代码。最大的风险是下标耦合，错位时没有任何报错。

**内容来源并存**：

| 来源 | 汉字数 |
|---|---|
| `content/v1/*` | 4,924 |
| `content/*-v2.json` | 9,796（`site-copy-v2` 4,430、`cases-v2` 2,553、`solutions-v2` 1,749 等，大部分只给 metadata 用或已经没人用） |
| `content/v3/pages/*`（哈希 key） | 1,346 |
| 代码中 | **2,683**（占 11.8%，v2 为 13.1%）。最多的是 Legal.tsx 590、InteractiveDemoClient 468、v1-content.ts 346 |

**校验脚本是否可信**（只读审阅）：

`validate-v3.mjs`（build 的第一步）：
- 用 zod 校验 v1 cases、copy、articles、availability 和 4 个 v2 集合，检查截图是否存在、sourceId 是否登记、方案引用的案例、文章作者、Demo 表格列数。这部分合理。
- “数字登记”是**自我循环**：它把 v1 基线中所有含数字的片段直接记为 `sourceId:'v1-final-content'`，并没有检查当前页面上的数字是否已登记。所以计划 §8 的“页面上没有未登记的数字”这一条实际上没有被验证。
- 它会在 build 时写入 `content/numeric-register-v3.json`，build 有副作用。

`check-v1-content.mjs`（`npm run check:content`）：
- 用 `git show b9dcf94` 取出 v1 源码，在 vm 中执行并渲染，再拿到的文本节点去和当前 HTML 的全文（去掉空白后）做子串比对。
- 宽松之处：
  - 少于 4 个字符的片段直接忽略，所以「99%」「7×24」「15」这类短数字不检查；
  - 不检查位置、顺序和所在页面区块；
  - 隐藏内容（dialog、sr-only、noscript）也算存在。
- 依赖 git 历史（CI 设置了 `fetch-depth:0`），会写 `docs/implementation/v1-content-regression.json`。
- 结论：用来证明“没有漏掉 v1 文案”大体可信；用来证明“数字、事实正确”或“没有多出来的内容”**不可信**。

### 2.9 响应头、缓存、SEO

**安全头**：与 v2 相同，有 CSP（仍是 `script-src 'unsafe-inline'`）、HSTS preload、nosniff、XFO、Referrer-Policy、Permissions-Policy。

**缓存**：

| 资源 | Cache-Control |
|---|---|
| HTML | `s-maxage=31536000`，HIT，全站 SSG |
| `/fonts/*.hash.woff2`、`/media/v3/*` | `public, max-age=31536000, immutable`，带哈希，**正确** |
| `/logo.png`、`/v3-materials/field-poster.avif`、`/favicon.ico` | `max-age=0` |

**404**：

| 路径 | SSR 状态 | SSR 内容 | 客户端水合后 |
|---|---|---|---|
| `/does-not-exist` | 404 | `<title>页面未找到 | Cyano</title>`，noindex；但 `<html id="__next_error__">` **没有 lang**，禁用 JS 时 body 文本只有 13 个字符 | `lang=zh-CN`，H1 正常，**`document.title` 变成 ""** |
| `/en/nope` | 404 | title「Page not found | Cyano」、noindex | — |
| `/favicon.ico` | 200（2,113 B） | — | — |

**sitemap 与 robots**：46 个 URL，都有 zh-CN / en alternate；没有 x-default；lastmod 全部硬编码为 2026-11-12。robots 正确。

**页面 meta**：每页有 canonical 和三向 hreflang（x-default 指向中文）。存在的问题：
- `/insights` 的 `<title>` 中含**换行符**（「企业 AI 项目的\n设计与实施经验」）；
- `/cases` 的 description 只有 18 个字（「6 个客户项目 · 覆盖 6 个行业」）；
- 英文案例页 title 100 个字符，`/en` 的 description 207 个字符（v2 为 179）。

**JSON-LD**：都能解析。
- Article 的 author 已改为 `Organization{name}`，修好了。
- **BreadcrumbList 回退**：只有两级，第二级的 name 是 slug（"proposal-generation"、"cases"、"technology"），案例详情缺少“案例”这一级。
- Service 和 FAQPage 正常。

**重定向**：`/services/diagnosis` 308 跳到 `/engagement#diagnosis`，正常。

### 2.10 表单与 API（curl 实测，只发送无效或不会投递的载荷）

| 请求 | 结果 |
|---|---|
| `{}` | 400（中文提示） |
| 数组 | 400 |
| 非 JSON | 400 |
| message 少于 10 个字 | 400 |
| 蜜罐字段有值 | 400 |
| 合法载荷 | **503**「…你的信息尚未发送」（未配置网关） |
| 跨域 Origin | 403 |
| GET | 405 |

- 访客自动回执已经去掉。
- 限流交给网关做，但 key 仍取自 XFF 第一段（可伪造）。
- 没有 Origin 头的请求（curl、脚本）直接放行。
- 客户端有 required 和 minLength，但没有 aria-invalid 和字段级错误。

### 2.11 布局与版心

| 视口宽 | 767 | 768 | 801 | 999 | 1199 | 1280 | 1440 |
|---|---|---|---|---|---|---|---|
| 正文版心 左留白 / 宽度 | 64 / 640 | **20** / 728 | 44 / 712 | **116** / 768 | 88 / 1024 | 71 / 1138 | 80 / 1280 |

- 767→768 时留白从 64 跳到 20，801 时又变成 44，999 时变成 116，**不单调**。
- 首页在 767 宽时，hero 文字左边距 20，下方各区块是 64，同一页不对齐；801 宽时 hero 文字栏只有 283 px。
- 根因：项目自定义的 `.container` 与 Tailwind v4 内置的 `container` 工具类重名。`@import "tailwindcss"` 扫描到类名后，生成了 640/768/1024/1280 的 max-width 断点，与 v3 自己写的 `width:calc(100% - Npx)` 叠加。
- 390 宽下没有水平溢出（`.hero-diagram` 超出视口，但被父级裁掉）。

### 2.12 工程保障

| 项 | 结果 |
|---|---|
| `tsc --noEmit --incremental false` | **0 错误** |
| `eslint app components lib …` | **0 问题**（退出码 0）。配置只有 4 条基础规则加一条自定义 token 规则，没有 `eslint-config-next`、react-hooks、jsx-a11y |
| lockfile | name / version 3.0.0 与 package.json 一致，依赖逐项一致；`framer-motion`、`next-intl` 已移除；`npm ls` 只有 1 个 extraneous（`@emnapi/runtime`）。`npm ci` 未实际执行 |
| CI | `.github/workflows/site.yml`：npm ci → lint → typecheck → build → check:content → Playwright（9 个路由的冒烟测试，含 axe critical/serious、H1 唯一、无溢出、无 pageerror，另有法律文案和无 JS 两个用例）。未在本机运行，GitHub 上的结果未知 |
| 未引用的公开资源 | 24 个文件，404 KB：`/v3-materials/` 下 14 个样张文件 305 KB（包括 **可公开访问的 `zh.html`、`en.html`、`study.js`** 和 4 个未使用的字体）；`/fonts/inter.woff2`、`manrope.woff2` 共 72.8 KB；5 个 SVG；2 个 logo webp |
| scripts/ | 24 个，其中一次性迁移和代码改写脚本（restore-v1-content、split-v3-*、finish-v3-migration、wire-v3-*、extract-*）和 v2 遗留脚本（validate-v2、prepare-v2-*、process-*、fetch-fonts）至少 14 个 |

---

## 3. 自报数字与实测对照

| 自报项（v3-implementation-status / build-budgets / functional-checks） | 自报 | 实测 | 判定 |
|---|---|---|---|
| 首页首屏脚本 gzip | 中文 148,265 B（144.8 KiB）、英文 148,190 | 147,894 / 147,819（zlib -9）；会话中脚本实际传输 188.3 KB（含预取和动态 chunk） | **属实** |
| 技术页 / 联系页 / 条款页脚本 | 143,731 / 145,296 / 142,318 | 技术页 143,396 | 属实 |
| 光场模块 gzip | 2,149 B | 1,982 B（chunk 7702） | 属实 |
| 静态海报 | AVIF 945 B | 945 B，1440×900 | 属实；但**它不是 LCP 元素**（桌面 LCP 是 H1，手机是截图局部） |
| 字体轴 | Inter 100–900、Manrope 200–800、Noto 300–700 | fvar 一致，墨量随字重递增 | **属实**（未提到 JetBrains 是静态 500） |
| “英文布局不加载中文字体” | 无 Noto 请求 | 桌面和手机 /en 都没有 Noto | 属实 |
| 812 个中文字形 | 812 | core 445 + ext 357 = 802 个汉字码位 | 基本属实 |
| 生产构建、TypeScript、ESLint 通过 | 通过 | tsc 0、eslint 0 | 属实（ESLint 规则很少） |
| “路由分别导入，客户端只接收当前语言数据” | — | 有路由 chunk；但 Demo、Header、表单 chunk 中仍有双语文案 | 基本属实 |
| “图表、演示、光场和灯箱按需加载” | — | 4 个应用级动态 chunk | 属实 |
| “修正文字对比度” | — | /about H2 **1.12:1**，必填 * 3.37 | **部分不实** |
| 浏览器 axe（8 个桌面、7 个手机页面） | 0 违规 | 抽查 8 个页面 / 视口为 0；**/about 有 1 个 serious**（自报没有检查 /about） | 覆盖不全 |
| “保留无 JavaScript 可读内容” | — | 禁用 JS 时 0 个隐藏卡片，H1 和 noscript 都在 | 属实 |
| “补 favicon 和结构化数据” | — | favicon.ico 200；Article author 已修；但**面包屑名称变成 slug** | 部分属实 |
| “37 个素材生成多尺寸 AVIF/WebP，缩略图单独选尺寸” | — | `/media/v3` 共 307 个文件，srcset 和 AVIF 生效；**首屏局部图源只有 440 px，最大变体 320** | 属实但有缺陷 |
| 首页高度 | 桌面 6,561、手机 9,615 | 6,537 / 9,615 | 属实（桌面 7.3 屏，手机 11.4 屏，在计划的 9 / 14 屏内） |
| 手机字号（functional-checks） | 每页 5–7 级 | 中文 8 级、英文 9 级（12 页并集），/cases 有 11.2 px | 页内属实，全站更多 |
| “限定位置毛玻璃” | — | 每页 2–3 处 | 属实 |
| 未自报的项 | — | 手机首页 TBT 770–807 ms、首屏字体 170.6 / 271.5 KB、logo 84.7 KB、≤12 px 占比 18.9–28.8% | 自报回避了这些不利数字 |

结论：这一轮的体积类自报数字**与实测相符**（第 2 轮严重不符），但 functional-checks 选择性覆盖页面，而且没有报告运行时性能和字体预算。

---

## 4. 问题清单（按严重度排序）

1. **【严重】手机首页 TBT 770–807 ms，比 v2 恶化约 3–7 倍**
   - 位置：`/`（4x CPU、Fast 4G）；`app/styles/v3-foundation.css`（`h1–h4{text-wrap:balance}`、`p{text-wrap:pretty}`）；Noto 可变子集。
   - 现象：
     - 加载期有 642 ms 和 516 ms 的长任务，trace 显示 92–97% 是 Layout；
     - Noto core 到达后整页重排 739 ms，关闭 text-wrap 后降到 468 ms，换成系统字体后这次重排消失；
     - `/en` 是 139 ms，技术页是 0。
   - 建议：
     - 正文 `p` 去掉 `text-wrap:pretty`，只给标题用 balance；
     - Noto 首屏子集改为静态 400 和 500 两个文件，或缩小 core 码位，降低字体切换的重排成本；
     - 加 `size-adjust` 和 `ascent-override` 匹配回退字体；
     - 考虑对首屏以下的区块使用 `content-visibility:auto`。

2. **【严重】内容与代码的分离回退，新增内容要改代码，且下标耦合会静默错位**
   - 位置：`lib/v1-content.ts`（`englishCases`、`industries`、工期、`[0,1,4,5].includes(i)`、方案和文章的 `[...][i]`，共 41 处）；`components/v3/ui.tsx` 的 `industryIcons`；`content/v3/pages/*.json` 的哈希 key（110 处 `pageCopy.cxxxxxxxx`）；同时存在的 `content/*-v2.json`。
   - 现象：
     - 新增一个案例要改 6–8 处，其中 3–4 处是代码；
     - 方案 i 对应案例 i，文章配图取 `rawCases[2]`；
     - 内容编辑者无法从 `cbb17f6527c` 这样的 key 看出它对应哪段文案；
     - metadata 读 v2 JSON，正文读 v1 JSON，两者可能不一致。
   - 建议：
     - 合并成一套按 slug 索引的双语内容（cases、solutions、insights 各一个 JSON，`{zh,en}` 字段并排）；
     - 下标映射改成显式的 `caseSlug`、`authorId`、`industryKey` 字段；
     - copy key 用语义名称；
     - 删除不再使用的 v2 内容文件。

3. **【严重】首屏字体超出预算**
   - 位置：`scripts/subset-font.mjs:169`（`variationAxes wght 300–700`）；`app/(zh)/layout.tsx`。
   - 现象：
     - 中文首页 170.6 KB（预算 150 KB）；
     - 内页 271.5 KB（core 115 KB + ext 101 KB + 拉丁字体 55.6 KB），比 v2 的 180.6 KB 还多 50%；
     - Inter 从 6.3 KB 变成 31.2 KB。
   - 建议：
     - 中文只保留实际用到的 2–3 个字重做静态子集，或把 wght 范围收窄到 400–600；
     - ext 子集按路由拆分，或推迟加载；
     - Inter 子集去掉不用的字重区间。

4. **【重要】版心断点紊乱：`.container` 与 Tailwind 内置工具类重名**
   - 位置：`app/styles/site.css` 中的 `@import "tailwindcss"` 加上 v3 的 `.container` 规则。
   - 现象：
     - 左留白 767→64、768→20、801→44、999→116、1199→88，不单调，同一页中 hero 和正文不对齐；
     - 801 宽时 hero 文字栏只有 283 px。
   - 建议：把类名改成 `.wrap` 或 `.page-container`，或在 Tailwind 中禁用 container 工具类；留白统一为 `clamp(20px,5vw,80px)`。

5. **【重要】/about 页有一个 H2 几乎看不见（1.12:1）**
   - 位置：`components/v3/pages/About.tsx:47`（`.name-story`），沿用了暗区的 `Eyebrow light` 和浅色文字。
   - 现象：#E8EEF0 叠在 #F8FAFA 上，axe 报 serious；自报的 axe 没有覆盖 /about。
   - 建议：把这一段改回纸面墨色 Token；冒烟测试应覆盖全部 46 个路由。

6. **【重要】输入框的焦点与边界仍不达标（W3-07 没有按要求完成）**
   - 位置：`v3.css` 中 `.contact-form input:focus …` 和 `.contact-form input:not([type=checkbox])`。
   - 现象：
     - 焦点 outline 是 2 px、35% 透明的青色，对白底 1.28:1，实际起作用的只有 1 px 边框的颜色变化；
     - 静态边界 rgba(12,28,36,.12) 约 1.27:1；
     - 必填 * 为 3.37:1；
     - 同意复选框 20×20。
   - 建议：
     - 焦点用 `outline:2px solid var(--link); outline-offset:2px`；
     - 静态边框至少用 `#8A9AA2`（≥3:1）；
     - * 改用 `--link`；
     - 复选框至少 24 px。

7. **【重要】品牌光场存在感弱，没有做出计划中的构图和复用形态**
   - 位置：`components/v3/light-field.js`、`BusinessHeroVisual.tsx`、`CoreVisual.tsx`、`.field-panel{opacity:.45}`。
   - 现象：
     - 三条流线位于 uv.y≈0.68，正好被 719×536 的玻璃舞台和 blur(20px) 盖住，肉眼只能在右缘 80 px 和右上角看到微弱流动（最大变化 44 级）；
     - 技术页只是降低透明度，不是“三通道汇聚”；
     - 收尾区强度也只靠 opacity 调整；
     - 着色器没有按 strength 传参。
   - 建议：
     - 给 `mountField` 传入 `{intensity, form}` 等 uniform；
     - 流线从舞台外侧汇入；
     - 技术页用三条通道向中心汇聚的形态；
     - 在玻璃上留出可以透光的区域。

8. **【重要】装饰性无限循环动画每帧触发样式重算**
   - 位置：`v3.css` 中的 `.stage-progress i:after{animation:channel 7s infinite}`。
   - 现象：
     - 首页静置时每 5 s 有 548–600 次样式重算，技术页为 0；
     - 4x CPU 下首页静置主线程 24–33%，技术页 7.5%；
     - 违反计划“禁止只为装饰的循环动画”。
   - 建议：删除这个动画，或改为 `will-change:transform` 的合成层动画，并在舞台离屏时暂停（目前只靠 `data-playing` 暂停）。

9. **【重要】动效清单缺项**
   - 位置：`ui.tsx:292`（workflow）、`BusinessHeroVisual.tsx`、`v3.css:2`。
   - 现象：
     - 没有溯源线画出（stroke-dashoffset），也没有光点移动；
     - 工作流不会逐步点亮；
     - 首屏舞台不切换案例；
     - View Transitions 只有跨文档的 `@view-transition`，对 Next 的客户端导航不起作用。
   - 建议：
     - 用 IntersectionObserver 驱动 SVG 路径 dashoffset 和步骤的 `data-active`，时长 900 ms；
     - 舞台用定时器在 2–3 个案例间切换，提供暂停按钮，离屏时停止；
     - 页面切换用 React `unstable_ViewTransition` 或在路由切换时调用 `document.startViewTransition`。

10. **【重要】首屏“真实界面”局部图分辨率不足**
    - 位置：`public/v3-materials/proposal-focus.webp`、`wiki-focus.webp`（440×310，只有 160 和 320 两个变体）；`ScreenshotZoom.tsx` 的 `sizes="(max-width:800px) 90vw, 450px"`。
    - 现象：
      - 桌面显示 527 px，用的是 320 px 文件，放大 1.65 倍；
      - 手机 DPR 3 下显示 322 CSS px，只有约 0.36 倍分辨率，截图里的文字发糊；
      - 计划要求裁出约 600 px 的焦点区；
      - 案例主图 `sizes=1100px`，实际显示 1278 px。
    - 建议：从原始截图重新裁出 ≥1200 px 宽的焦点区，并生成 640/960/1280 三档；`sizes` 按实际布局写。

11. **【重要】每页预加载 84.7 KB 的 512×512 PNG logo**
    - 位置：`components/v3/ui.tsx:99`，页头和页脚各引用一次；`/logo.png` 是 `max-age=0`。
    - 现象：只按 32 px 显示，约是需要大小的 16 倍；是首屏图片中最大的一项；不能长缓存。
    - 建议：改用内联 SVG（currentColor）或 64 px 的 WebP（<3 KB），带哈希并 immutable 缓存。

12. **【重要】源码可读性差，层叠债务重**
    - 位置：`app/styles/v3-foundation.css`（11 行 / 62.9 KB，单行 39,560 字符）、`v3.css`（43 行 / 41 KB）；`components/v3/*.tsx` 的压缩式写法。
    - 现象：
      - 248 个选择器在两个文件中重复定义，后者覆盖前者；
      - 构建后有 30 个 `!important`；
      - 主 CSS 比 v2 大 61%；
      - TSX 中 import 散落在文件中间，单行几百到上千字符。
    - 建议：
      - 用 Prettier 格式化后入库；
      - foundation 和 v3 合并去重；
      - 按组件或区块拆分 CSS（CSS Modules 或 `@layer`）；
      - 加 stylelint。

13. **【重要】死代码、一次性迁移脚本和公开可访问的样张文件**
    - 位置：
      - 死代码：`components/PageTemplates.tsx`、`v3/interactive.tsx`、`v3/visuals.tsx`、`islands/AmbientFlow.tsx`、`lib/server-inputs.ts`；
      - 脚本：`scripts/` 中至少 14 个迁移或 v2 遗留脚本；
      - 公开文件：`public/v3-materials/{zh,en}.html`、`study.js/css`、4 个字体，以及 `public/fonts/inter|manrope.woff2`、5 个 SVG。
    - 现象：24 个未被引用的公开文件共 404 KB；样张页面可以直接访问（`/v3-materials/zh.html` 返回 200）。
    - 建议：删除或移到 `assets/`；迁移脚本归档到 `scripts/archive/` 或直接删除。

14. **【重要】校验脚本的结论被夸大**
    - 位置：`scripts/validate-v3.mjs`（numeric-register 部分）、`scripts/check-v1-content.mjs`。
    - 现象：
      - “数字登记”是把 v1 基线中的数字自动登记，并没有校验当前页面；
      - 文本回归只做子串存在性检查，忽略少于 4 个字符的片段（短数字不检查），也不检查多出来的内容；
      - 两个脚本都会写仓库文件，build 有副作用。
    - 建议：
      - 改为从当前 HTML 抽出所有数字，与 `numeric-register` 比对；未登记的报错；
      - 短片段也纳入检查；
      - 报告输出到 `.next` 或临时目录。

15. **【重要】技术页同屏出现相互矛盾的说明**
    - 位置：`/technology`，`p.benchmark-note`。
    - 现象：同一页上同时出现「\* 基于 Cyano 内部基准测试。」和「曲线使用示意数据，不是内部基准测试结果，也不代表项目性能承诺。」，对读者来说是事实冲突。
    - 建议：删除 v1 恢复回来的「基于内部基准测试」脚注，或者让它只对应确有实测的指标。

16. **【重要】≤12 px 文字占比反而上升**
    - 位置：案例卡片的系统名、标签、meta 和 eyebrow（12 px）。
    - 现象：首页 18.9% / 21.9%，/cases 28.8%，/insights 25.6%（v2 为 12–18%，预算 ≤8%）；/cases 还有 11.2 px 文字。
    - 建议：卡片 meta 改为 14 px；12 px 只用于至多一个编号标签；找到并去掉 11.2 px 的来源（可能是 em 缩放）。

17. **【一般】标题层级跳级没有修**
    - 位置：`/cases`（1→3）、`/engagement`（1→3）、文章页（1→3→4）。
    - 建议：列表区补一个 H2（可以是 sr-only），卡片的标题级别通过 props 传入。

18. **【一般】404 页的 SSR 和水合问题**
    - 位置：`app/(zh)/[...missing]`、`not-found.tsx`。
    - 现象：
      - SSR 有 title 和 noindex，但 `<html>` 没有 lang；
      - 禁用 JS 时 body 文本只有 13 个字符；
      - 客户端渲染后 `document.title` 变成空字符串。
    - 建议：使用 Next 16 的 `global-not-found.js`，或在多根布局下由各根布局的 not-found 做 SSR；回归测试要断言水合后的 title。

19. **【一般】结构化数据与 meta 回退**
    - 位置：`components/v3/PageShell.tsx:9`（面包屑）、`/insights` 的 title、`/cases` 的 description、英文 SEO 文案。
    - 现象：
      - BreadcrumbList 第二级的 name 是 slug，缺少“案例”和“方案”这一级；
      - title 里有换行符；
      - description 18 个字；
      - 英文 title 100 个字符，description 207 个字符；
      - sitemap 没有 x-default，lastmod 硬编码。
    - 建议：面包屑使用页面 H1 或中文名称，做成三级；SEO 文案单独维护并去掉换行；lastmod 取内容日期。

20. **【一般】桌面滚动有可感知的掉帧**
    - 位置：`/`、`/en`、案例页（1440，不节流）。
    - 现象：首页 7 帧超过 50 ms（最长 83 ms），`/en` 最长 133 ms；v2 的最长帧是 25–41 ms。可能来自玻璃叠在动态 canvas 上的合成，以及首次进入视口的 AVIF 解码。SwiftShader 会放大这一现象，需要在真实 GPU 上复测。
    - 建议：舞台玻璃在 canvas 上改为预模糊的静态底；离屏的大图加 `decoding="async"`。

21. **【一般】光场和指针跟随的实现细节**
    - 位置：`light-field.js` 的 tick；`MotionRuntime.tsx` 的 move。
    - 现象：
      - rAF 以显示刷新率（约 120 次 / s）空转，内部再节流到 30 fps；
      - 每次 pointermove 都对卡片调用 getBoundingClientRect；
      - 光场在 IntersectionObserver 触发时立即加载，没有等到 FCP 之后的 idle。
    - 建议：静止时改用 `setTimeout` 加 rAF 的 30 fps 调度；在 pointerenter 时缓存 rect；用 `requestIdleCallback` 推迟 import。

22. **【一般】客户端 chunk 中仍有另一种语言的文案**
    - 位置：`InteractiveDemoClient.tsx`（468 个汉字，chunk 6553 中有 700 个汉字，英文页也会加载）、`HeaderClient`、`ContactFormClient`。
    - 建议：Demo 数据由服务端按语言作为 props 传入。

23. **【一般】JetBrains Mono 只有静态 500；英文页的「中文」使用系统字体**
    - 现象：mono 的 600/700 是合成粗体；`/en` 的语言切换文字回落到 Microsoft YaHei，违反“回落字体 0 处”。
    - 建议：mono 只使用 500；英文布局对「中文」两个字使用内联的小子集，或者干脆写成「ZH」。

24. **【一般】CSP 与联系 API 的残余风险**
    - 位置：`next.config.ts:5`；`app/api/contact/route.ts:20-22,77`。
    - 现象：`script-src 'unsafe-inline'`；没有 Origin 头的请求直接放行；限流 key 取自可伪造的 XFF。
    - 建议：SSG 内联脚本改用 hash；要求请求带 Origin 或 Sec-Fetch-Site；使用平台提供的可信 IP（如 `x-real-ip` 或 `request.ip`）。

25. **【一般】ESLint 只是名义上存在**
    - 位置：`eslint.config.mjs`。
    - 现象：没有 `eslint-config-next`、`react-hooks`、`jsx-a11y`；token 规则只覆盖 components 中的字符串字面量，`app/**/error.tsx` 中有 4 处十六进制颜色没有被发现。
    - 建议：接入 `next/core-web-vitals`、`jsx-a11y`，token 规则覆盖 app/ 和模板字符串。

26. **【一般】静态资源缓存不一致**
    - 现象：`/logo.png`、`/v3-materials/field-poster.avif`、`/favicon.ico` 是 `max-age=0`；`/art/*` 仍配置了 immutable，但目录下只剩两个未使用的 logo。
    - 建议：这几个资源也带哈希并做长缓存；删除 `/art` 规则。

---

## 5. 第 2 轮 28 条问题的处理情况

| # | 第 2 轮问题 | 状态 | 说明 |
|---|---|---|---|
| 1 | 首屏 JS 超预算、没有路由拆分、内容和 zod 进客户端 | **已修** | 147.9 KB；有路由 chunk 和 4 个动态 chunk；`server-only`；zod 移到构建期；只剩少量双语文案 |
| 2 | 新增案例或文章无法只改内容 | **回退** | 计数断言已删、固定长度改为 max；但英文正文、行业、映射改成代码中的下标数组，新增案例要改 3–4 处代码，且会静默错位 |
| 3 | 字重全部失效 | **已修** | Noto、Inter、Manrope 的墨量随字重递增；mono 是静态 500 |
| 4 | 焦点指示不达标 | **部分修** | 页头和深色区 9.88:1；输入框 outline 1.28:1，静态边界 1.27:1 |
| 5 | 英文页下载中文字体 | **已修** | /en 在桌面和手机都没有 Noto 请求，也没有 zh CSS |
| 6 | 图片没有走优化管线 | **基本修好** | 有 srcset、AVIF、哈希和 `fetchpriority=high`；新问题：首屏局部图分辨率不足、512 px PNG logo、sizes 与实际不符 |
| 7 | 手机首页性能贴线或超线 | **部分修 / 回退** | LCP 1.33 s，达标；TBT 770–807 ms，更差；静置 24–33%，持平 |
| 8 | Canvas 与 Hero 动画实现质量 | **已修** | 按时间差推进；IO 加 visibility 真正停止；ResizeObserver；WebGL 上下文丢失处理 |
| 9 | 动效规格没有兑现 | **部分修** | 16 px / 360 ms、数字滚动、指针光斑、transform 悬停已做；工作流点亮、溯源线、页面过渡、舞台切换没做 |
| 10 | 技术页曲线不真实 | **已修（有新瑕疵）** | 曲线和圆点来自同一组数据，标注示意；但同屏有“基于内部基准测试”的矛盾脚注 |
| 11 | Token 名存实亡、字号失控 | **大部分修** | 十六进制 486→4，`text-[px]` 289→2；字号 27 级降到 9–10 级；≤12 px 占比反而升到 18.9–28.8% |
| 12 | 首页页头 #333 灰带 | **已修** | 页头顶部取色 #080F14 |
| 13 | immutable 缓存但没有哈希 | **已修** | 字体和 `/media/v3` 带哈希；logo 和海报缓存为 0（新的小问题） |
| 14 | 等宽类中文和符号回退 | **已修** | mono 中没有中文；SVG text 为 0；只剩英文页的「中文」 |
| 15 | PageTemplates 巨型文件、文案和代码混杂 | **部分修** | 已按页面拆分，代码中汉字占比 13.1%→11.8%；但出现压缩式源码、哈希 key 和死门面文件 |
| 16 | 联系 API 可被滥用，线索可能丢失 | **大部分修** | 去掉自动回执，持久化后才确认，未配置返回 503；XFF 作 key、无 Origin 放行仍在 |
| 17 | 没有 lint、测试、CI，lockfile 不一致 | **大部分修** | 有 ESLint（规则很少）、tsc、CI、Playwright 加 axe；lockfile 一致 |
| 18 | 禁用 JS 时内容不可见 | **已修** | 禁用 JS 时 0 个隐藏卡片，有 noscript 兜底 |
| 19 | 404 没有 title 和 lang | **部分修** | SSR 有 title 和 noindex，有 favicon；仍没有 lang、SSR body 为空、水合后 title 为空 |
| 20 | 4 组小字对比度不足 | **已修（有新问题）** | 原来的 4 组颜色都已去掉；新增 /about H2 1.12:1 和必填 * 3.37:1 |
| 21 | 标题层级跳级 | **未修** | /cases、/engagement、文章页 |
| 22 | 灯箱没有焦点陷阱 | **已修** | 原生 `showModal()` |
| 23 | 表单校验体验 | **部分修** | 有 required 和 minLength，空提交会聚焦第一项；没有 aria-invalid 和字段级错误；复选框 20 px |
| 24 | 资源冗余 | **部分修** | v2 生成图已下线；fonts、SVG、logo 遗留 99 KB；新增 305 KB 公开样张；RSC 预取 41 个 |
| 25 | CSP 与缓存细节 | **未修** | 仍是 `'unsafe-inline'` |
| 26 | SEO 细节 | **部分修 / 部分回退** | Article author 已修；英文 title / description 仍过长（207 字符）；面包屑变成 slug（回退）；title 换行；lastmod 硬编码；没有 x-default |
| 27 | 静默回退掩盖内容错误 | **已修** | `getMediaMeta` 和 `Picture` 查不到时抛错 |
| 28 | 版心在 767→768 跳变 | **回退** | 现在有 4 处跳变（20/64/44/116/88），根因是与 Tailwind 的 container 重名 |

统计：已修 12 条；大部分或基本修好 4 条；部分修 8 条（其中 #7、#26 有部分回退）；未修 2 条（#21、#25）；回退 2 条（#2、#28）。

---

## 6. 做得好、可以保留的

- **光场工程**：
  - 原生 WebGL、50% 分辨率、DPR 按 1 计算；
  - 空闲 30 fps，交互时 60 fps；
  - IntersectionObserver 和 visibilitychange 让它真正停止（离屏和隐藏时 rAF 都是 0）；
  - 处理了 `webglcontextlost`，编译失败时回到海报；
  - 模块 2 KB gz、海报 945 B；
  - reduced-motion 下完全不加载。这一块可以作为标准件保留。
- **客户端包的结构**：
  - 每个路由一个 chunk，客户端组件是孤岛；
  - 图表、Demo、光场、灯箱用 `next/dynamic` 加可见性触发；
  - 内容加 `server-only`，zod 只在构建期运行；
  - JS 从 266.9 KB 降到 147.9 KB，并且这次自报数字与实测一致。
- **Token 落地**：组件和样式中的十六进制颜色基本清零（486→4）；字号 Token 化（27 级降到 9–10 级）；有 lint 规则守护。
- **字体管线**：可变字重真正生效；按用字子集化，文件名带内容哈希并 immutable 缓存；英文页不碰中文字体；mono 中没有中文，SVG 中没有文字。
- **图片管线**：构建期用 sharp 产出 AVIF/WebP 多档文件，命名带哈希，用 `<picture>` 加 srcset，首屏图 `fetchpriority=high`，缺少清单条目时构建报错。
- **可访问性基础**：
  - 原生 dialog；
  - 深色区焦点环用亮青；
  - 禁用 JS 和 reduced-motion 时内容完整可读；
  - `CountValue` 带 sr-only 真值；
  - axe 在 8 个页面 / 视口下为 0；
  - 移动菜单的 inert、Esc 和焦点返回都保持。
- **联系 API 的思路**：“持久化后才确认成功”，取消访客自动回执，未配置时坦白告诉用户“尚未发送”，失败提示用户保留表单内容。
- **工程保障起步**：CI 串起 lint、typecheck、build、内容回归和 Playwright 加 axe；lockfile 一致；`tsc` 0 错误。
- **保留自上轮**：全站 SSG 和双根布局路由；CLS 约等于 0；安全响应头；canonical 和三向 hreflang；首页高度在预算内（桌面 7.3 屏，手机 11.4 屏）。
