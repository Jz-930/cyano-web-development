# Cyano 官网 v2 美术视觉规范与 AI 生图任务书（Art & Prompt Handoff Spec）

> **用途说明**：当前官网已完成全部 18 组美术槽位的第一轮绘制、边缘融合处理与前端接入，网站现已可直接运行。你可以将本文档**原封不动交给更擅长生图的美术 Agent（Midjourney v6.1 / Flux.1 Pro / Google Imagen / Nano Banana / Recraft 等）**逐张重绘升级。
>
> **零改代码替换流程**：
> 1. 美术 Agent 按下方编号生成高清原图，直接覆盖保存至 `assets/source/cyano-v2/<文件名>.png`（支持 `.png` / `.webp` / `.jpg`）。
> 2. 若重绘团队插画（`ART-17` / `ART-18`），直接替换原图 `assets/source/team-business-glasses.png` 与 `assets/source/portraits-business-glasses.png`（或直接覆盖 `site/public/art/team-natural.webp` 与 `site/public/art/founder-1..4-natural.webp`）。
> 3. 在 `site/` 目录下执行一行命令：
>    ```powershell
>    node scripts/process-cyano-art.mjs
>    ```
>    脚本会自动完成尺寸裁切、白底 `#FFFFFF` 正片叠底无缝边缘校准、黑底 `#000000` 滤色纯黑压暗、WebP 压缩、模糊占位（`blurDataURL`）刷新，并自动合成带官方 Logo 的社交分享卡 `og.jpg`。

---

## 一、Cyano 核心品牌视觉基因（美术 Agent 必读）

### 1. 官方 Logo 几何母题（`site/public/logo.png`）
Cyano 的官方标志是一个**等轴测圆角立方体的青蓝色字母 `C` 结构**，其核心视觉特征是：
- **左侧连续圆弧曲率**（稳固的工程底座与统一架构）；
- **右侧裂解为三条平行的层流通道（3 parallel laminar channels）**，并向右延伸、离散为**有序悬浮的圆角数据液滴/微粒（ordered data droplets / nodes）**。

因此，全站 3D 光学雕塑与抽象视觉应围绕 **「浑浊离散输入 → 精密光学棱镜/层流通道校准 → 平滑有序的高可信输出」** 这一工程母题展开，呼应 Cyano Logo 的层流 `C` 与液滴粒子语言，**绝不能做成与品牌无关的通用炫光壁纸**。

### 2. Cyano 多色光学色谱（告别单一死绿，严禁照搬竞品大红）
所有美术素材必须采用 **以 Cyano 青蓝为主导（约占画面色彩能量的 45%–55%），辅以宝石钴蓝、暖香槟琥珀金、微紫折射光** 的多色光学配色体系：

| 色彩角色 | 亮白画廊态（`#FFFFFF` 底）色值参考 | 暗夜剧场态（`#000000` / `#02080E` 底）色值参考 | 视觉占比与语义 |
| :--- | :--- | :--- | :--- |
| **主品牌色 · Cyano 青蓝（Teal / Cyan）** | `#2C8B96` / `#0B7A8C` | `#22D3EE` / `#38E4F2` | **45%–55%（绝对视觉锚点）**：呼应官方 Logo，代表核心工程底座 |
| **第二主色 · 宝石钴蓝（Sapphire Cobalt）** | `#1D4ED8` / `#2563EB` | `#3B82F6` / `#60A5FA` | **20%–25%**：拉开冷色调纵深层次，避免单调绿意 |
| **暖色高光 · 香槟琥珀金（Warm Champagne Gold）** | `#B45309` / `#D97706` | `#F59E0B` / `#FBBF24` | **12%–18%（关键冷暖对比）**：代表人工复核关口、高价值上下文与冷暖呼吸感 |
| **折射过渡 · 光学紫罗兰（Iridescent Violet）** | `#6D28D9` | `#A78BFA` | **5%–10%**：玻璃棱镜边缘的自然色散折射（克制点缀，不喧宾夺主） |

### 3. 三条绝对红线（违反任一条即作废）
1. **严禁地理与海岛意象**（来自 `docs/visual-direction.md`）：画面中**绝对禁止**出现岛屿、海岸线、海浪、水面涟漪、地图、等高线、地球仪、云海航拍。
2. **严禁伪造文字与假 UI**：3D 美术与编辑部插画中**绝对禁止**生成任何中英文字母、数字、乱码标签或伪造软件界面框（真实业务界面已由网站直接挂载 31 张真实生产截图 `/media/*`）。
3. **边缘必须绝对纯净以实现「无框呼吸感」**：
   - **白底画廊系列（`mode: "white"`）**：前端使用 `mix-blend-mode: multiply` 直接融入 `#FFFFFF` 纯白页面。**四周至少留白 12%–18% 纯白 `#FFFFFF`（RGB `255,255,255`）**，主体投影必须柔和消散在画布内部，严禁触碰四边导致出现灰色矩形切边。
   - **黑底剧场系列（`mode: "black"`）**：前端使用 `mix-blend-mode: screen` 融入 `#02080E` / `#000000` 暗色舞台。**背景必须是纯净无噪点的纯黑 `#000000`**，特别是需要排字的区域必须保持深邃留黑。

### 4. 通用反向提示词（Global Negative Prompt）
所有 3D 光学槽位（`ART-01` 至 `ART-16`）请统一附带以下 Negative Prompt：
```text
text, letters, numbers, watermark, signature, logo stamp, UI mockup, dashboard screen, wireframe box, island, ocean, sea waves, water surface, beach, coastline, map, globe, topography, contour lines, human hands, robots, brains, circuit board clichés, muddy monochrome green, crimson red dominance, cluttered background, cropped shadow at border, frame, border
```

---

## 二、18 组美术槽位逐张规格与 Prompt 清单

---

### A. 暗夜剧场全出血与核心工程舞台系列（Dark Stage Series · 5 张）

#### `ART-01` · 首页首屏主视觉：Cyano 层流 `C` 光学雕塑（Homepage Hero）
- **覆盖源文件**：`assets/source/cyano-v2/cyano-hero-laminar.png`（现已有 `.jpg`）
- **生成目标路径**：`site/public/art/cyano-hero-laminar.webp`
- **尺寸与比例**：`1600 × 900`（`16:9`，建议原图生成 `2560 × 1440` 或更高）
- **合成模式**：`mode: "black"`（纯黑 `#000000` 背景 + 前端 `screen` 混合）
- **页面位置与构图安全区**：首页（`/` 与 `/en`）第一幕全屏背景，同时用于合成 `og.jpg`。**左半侧 0%–44% 区域承载大号主标题与按钮，必须保持大面积纯黑留白**；视觉重心放在**右侧 48%–96%**，且四周保留呼吸空间。
- **English Prompt**：
  ```text
  Monumental minimalist 3D optical glass sculpture on a pure pitch-black #000000 studio void, inspired by an isometric rounded C-shaped architectural form splitting on the right into three parallel laminar optical channels that dissolve into ordered luminous floating glass droplets. Positioned on the right side of a wide 16:9 composition with generous pure black negative space on the left 45% for typography. Translucent Dichroic Cyano Teal (#22D3EE) and Deep Ocean Cyan (#0B7A8C) glass as the dominant color, accented with Sapphire Cobalt (#3B82F6) internal caustics, delicate Iridescent Violet edge dispersion, and warm Champagne Amber-Gold (#FBBF24) micro-droplet highlights. Physical Octane/Redshift studio render, razor-sharp glass refraction, serene gallery luxury, zero clutter, no text, no water or waves. --ar 16:9 --v 6.1 --style raw
  ```
- **中文生图提示词**：
  ```text
  极简高定 3D 光学玻璃雕塑，置于纯净无瑕的纯黑（#000000）暗房背景中。造型灵感源自 Cyano 品牌标志：右侧矗立一座宏伟的圆角 C 形层流光学玻璃主体，向右平滑分流为三条平行的精密光学轨道，并有序离散为悬浮发光的圆角玻璃液滴微粒。16:9 宽画幅构图，画面左侧 45% 保持纯净深邃的黑色负空间以便排版大标题，视觉主体集中在画面中右侧。色彩以通透的 Cyano 青蓝色（#22D3EE 与 #0B7A8C）为主导，内部交织宝石钴蓝（#3B82F6）焦散光路与克制的暖香槟琥珀金（#FBBF24）核心微粒高光，边缘带细微紫罗兰光学色散。物理级光线追踪渲染，高级艺术画廊质感，无任何文字、无海浪水面、无杂乱线条。
  ```

---

#### `ART-02` · 全站底部收官横幅：层流极光天际线（Global Closing CTA）
- **覆盖源文件**：`assets/source/cyano-v2/cyano-closing-aurora.png`
- **生成目标路径**：`site/public/art/cyano-closing-aurora.webp`
- **尺寸与比例**：`1600 × 900`（`16:9`）
- **合成模式**：`mode: "black"`（纯黑 `#000000` 背景 + 前端 `screen` 混合）
- **页面位置与构图安全区**：除联系页外所有页面底部的全出血暗色行动召唤区（`#site-closing-cta`）。左侧放置标题与按钮，**丝滑的光学层流光带从左下轻盈掠向右上角并汇聚为璀璨青蓝与暖金微粒**，整体通透克制，不抢前景白字对比度。
- **English Prompt**：
  ```text
  Ultra-wide minimalist 3D optical light sculpture on pure #000000 black background, three sweeping silk-like translucent glass ribbons flowing gracefully from lower-left toward upper-right, dispersing into calm ordered luminous droplets on the right side. Dominant luminous Cyano Cyan (#22D3EE) and Teal (#0B7A8C) ribbons interwoven with deep Sapphire Blue (#2563EB) and a subtle warm Champagne Gold (#FBBF24) filament. Left half remains dark and calm with ample pure black breathing room. High-craft architectural glass refraction, soft volumetric caustics, Leica studio lighting, zero text, no horizon terrain or water. --ar 16:9 --v 6.1 --style raw
  ```
- **中文生图提示词**：
  ```text
  超宽幅极简 3D 光学丝带雕塑，纯黑（#000000）背景。三条轻盈通透的层流光学玻璃丝带从左下方向右上方舒展掠过，在画面右侧自然离散为有序排列的发光液滴微粒。主色调为清澈的 Cyano 青蓝（#22D3EE / #0B7A8C），交织深邃宝石钴蓝（#2563EB）与一缕温暖的香槟琥珀金（#FBBF24）高光丝线。画面左半部保持低调深邃的大面积留黑以衬托白色大字。物理级玻璃折射与柔和焦散，静谧克制，无文字、无地形海面。
  ```

---

#### `ART-03` · 多频光学层流波谱（Engineering Wave Spectrum）
- **覆盖源文件**：`assets/source/cyano-v2/cyano-wave-spectrum.png`
- **生成目标路径**：`site/public/art/cyano-wave-spectrum.webp`
- **尺寸与比例**：`1600 × 900`（`16:9`）
- **合成模式**：`mode: "black"`（纯黑 `#000000` 背景）
- **页面位置与构图安全区**：用于①首页第五幕「为什么生产级 AI 需要软件工程」双联画右侧；②关于我们页（`/about`）「设计克制」暗色横幅底部背景。造型为水平舒展的精密正弦光学纤维束。
- **English Prompt**：
  ```text
  Horizontal precision harmonic wave composed of 24 ultra-fine luminous optical glass filaments sweeping smoothly across a pure #000000 black void. Polychromatic engineering spectrum led by Cyano Teal and Electric Cyan (#22D3EE), transitioning smoothly into Sapphire Cobalt (#3B82F6), soft Violet (#A78BFA), and a crisp Warm Amber-Gold (#FBBF24) reference curve. Generous pure black space above and below the wave, mathematical elegance, clean studio macro photography of fiber optics, zero noise, no text. --ar 16:9 --v 6.1 --style raw
  ```
- **中文生图提示词**：
  ```text
  水平舒展的精密谐波光纤雕塑，置于纯黑（#000000）背景中央偏下位置，上下留出充足纯黑呼吸空间。由二十余根纤细锐利的半透明发光玻璃光纤组成平滑正弦层流波束，色彩以 Cyano 青蓝（#22D3EE）为主导，平滑过渡至宝石钴蓝（#3B82F6）、淡紫罗兰（#A78BFA）与一根代表基准校准的暖香槟琥珀金（#FBBF24）光轨。数学般的秩序感与微距光学镜头质感，无噪点、无文字。
  ```

---

#### `ART-04` · Cyano Core 四层光学晶片架构（4-Layer Optical Strata）
- **覆盖源文件**：`assets/source/cyano-v2/cyano-core-strata.png`
- **生成目标路径**：`site/public/art/cyano-core-strata.webp`
- **尺寸与比例**：`1400 × 875`（`16:10`）
- **合成模式**：`mode: "cover"`（深黑曜石暗房背景 `#02080E`）
- **页面位置与构图安全区**：用于①技术架构页（`/technology`）`Cyano Core` 四层交互架构右栏主图；②解决方案总览页（`/services`）底部垂直定制展示卡；③四个解决方案详情页（`/services/[slug]`）右侧交付清单顶部。必须清晰呈现 **上下悬浮对齐的 4 层精密光学玻璃晶片**，一条垂直校准光轴贯通四层。
- **English Prompt**：
  ```text
  Isometric architectural 3D product render of exactly four horizontally levitating precision-milled optical glass plates stacked with clean vertical breathing space in a dark obsidian studio (#02080E). A vertical collimated cyan laser beam passes cleanly through the center of all four layers. From bottom to top, the four beveled glass strata glow subtly along their polished edges in Cyano Cyan (#22D3EE), Sapphire Blue (#60A5FA), Soft Violet (#A78BFA), and Warm Champagne Gold (#FBBF24). Crisp Leica macro depth-of-field, refined industrial design luxury, balanced 20% dark margin around the sculpture, no text or labels. --ar 16:10 --v 6.1 --style raw
  ```
- **中文生图提示词**：
  ```text
  等轴测高级工业设计 3D 渲染：在深邃黑曜石暗房（#02080E）中央，精确悬浮着上下垂直对齐、间距均匀的四层精密倒角光学玻璃晶片（象征 Cyano Core 四层架构），一束垂直准直的青蓝色校准光束居中贯通四层晶片。自下而上四层玻璃边缘分别泛出清澈的青蓝（#22D3EE）、宝石蓝（#60A5FA）、微紫（#A78BFA）与暖琥珀金（#FBBF24）折射微光。四周保留约 20% 纯净暗部留白，徕卡微距景深，精密仪器质感，无任何文字标签。
  ```

---

#### `ART-05` · 上下文动态估值棱镜（Context Valuation Prism）
- **覆盖源文件**：`assets/source/cyano-v2/cyano-context-prism.png`
- **生成目标路径**：`site/public/art/cyano-context-prism.webp`
- **尺寸与比例**：`1400 × 788`（`16:9`）
- **合成模式**：`mode: "cover"`（深黑曜石暗房背景 `#02080E`）
- **页面位置与构图安全区**：用于①首页第五幕双联画左侧；②技术架构页（`/technology`）「长上下文动态估值」暗色章节右栏主图。视觉叙事：**左侧杂乱离散的磨砂碎屑进入中央 Cyano 青蓝光学棱镜，右侧射出四道平行纯净的分级光束**（直观诠释「上下文估值压缩」）。
- **English Prompt**：
  ```text
  Minimalist 3D optical engineering metaphor in a dark #02080E studio: on the left, scattered translucent frosted glass shards converge into a central precision-cut Cyano Teal (#0B7A8C) octagonal optical prism; emerging from the right side of the prism are exactly four crisp, parallel collimated light beams in Electric Cyan (#22D3EE), Sapphire Blue (#60A5FA), Iridescent Violet (#A78BFA), and Warm Amber Gold (#FBBF24). Clear left-to-right visual storytelling of noise-to-order transformation, generous dark negative space around the subject, photorealistic glass caustics, no text. --ar 16:9 --v 6.1 --style raw
  ```
- **中文生图提示词**：
  ```text
  深黑曜石暗房（#02080E）中的极简 3D 光学工程隐喻雕塑：画面左侧是若干零散无序的半透明磨砂玻璃碎片，向中间汇聚进入一枚精密切割的 Cyano 青蓝（#0B7A8C）八角光学棱镜；经过棱镜校准筛选后，右侧射出四道绝对平行、干净锐利的准直光束，分别为亮青蓝（#22D3EE）、宝石蓝（#60A5FA）、微紫（#A78BFA）与暖琥珀金（#FBBF24）。从左至右清晰传达「杂乱输入 → 核心估值筛选 → 四级高价值上下文」的工程逻辑，四周充足暗部留白，无文字。
  ```

---

### B. 纯白画廊无缝正片叠底系列（Gallery White Multiply Series · 8 张）

> **⚠️ 白底系列统一硬性规范**：以下 8 张图全部在 `#FFFFFF` 纯白背景上通过 CSS `mix-blend-mode: multiply` 无框呈现。**画布背景必须是 100% 纯白 `#FFFFFF`（不要灰底、不要渐变底、不要暗角）**，主体占画面中央 65%–72%，四周边缘留出干净纯白区域，底部接触阴影必须轻柔且完全收在画布内部。

#### `ART-06` · 解决方案 01：销售线索筛选漏斗雕塑（Sales & Lead Automation）
- **覆盖源文件**：`assets/source/cyano-v2/cyano-sol-sales.png`
- **生成目标路径**：`site/public/art/cyano-sol-sales.webp`
- **尺寸与比例**：`1400 × 788`（`16:9`）
- **合成模式**：`mode: "white"`（纯白 `#FFFFFF` 背景 + `multiply` 无缝叠底）
- **页面位置**：首页方案切换器 Tab 01、`/services` 第 01 章配图、`/services/sales-automation` 页头主视觉。
- **English Prompt**：
  ```text
  Minimalist 3D studio sculpture isolated on a pure solid #FFFFFF white background: three curved Dichroic Cyano Teal (#0B7A8C) and Sapphire glass vanes arranged as an open architectural aperture funneling scattered translucent spheres into a single aligned row of glowing Warm Amber-Gold (#D97706) and Cyan (#0891B2) precision spheres on the right. Bright high-key gallery daylight, soft clean contact shadow fully contained inside a generous 18% pure white margin on all four sides, crisp glass refraction, zero background gradient, no text. --ar 16:9 --v 6.1 --style raw
  ```
- **中文生图提示词**：
  ```text
  纯白无瑕背景（#FFFFFF）上的极简高调 3D 光学雕塑：三片优雅弧形的 Cyano 青蓝（#0B7A8C）与宝石蓝二向色光学玻璃导流叶片组成开放式筛选通道，将左侧离散的透明微球筛选汇聚为右侧一列整齐对齐的暖琥珀金（#D97706）与青色（#0891B2）高价值晶球（象征销售线索去重打分与自动跟进）。明亮艺术画廊柔光，极淡的底部接触阴影完全收在画布内部，四周保留 18% 以上绝对纯白留白，无边框、无文字。
  ```

---

#### `ART-07` · 解决方案 02：标书与报告编排叠层雕塑（Proposal & Document Intelligence）
- **覆盖源文件**：`assets/source/cyano-v2/cyano-sol-docs.png`
- **生成目标路径**：`site/public/art/cyano-sol-docs.webp`
- **尺寸与比例**：`1400 × 788`（`16:9`）
- **合成模式**：`mode: "white"`（纯白 `#FFFFFF` 背景 + `multiply` 无缝叠底）
- **页面位置**：首页方案切换器 Tab 02、`/services` 总览页头与第 02 章配图、`/services/doc-intelligence` 页头主视觉。
- **English Prompt**：
  ```text
  Minimalist 3D optical sculpture isolated on a pure solid #FFFFFF white background: seven thin precision-beveled architectural glass folios fanning gracefully in an isometric arc and aligning into a crisp unified vertical volume on the right, threaded by a fine Sapphire Blue (#1D4ED8) and Cyano Teal (#0B7A8C) optical alignment rod with a single Warm Champagne Gold (#D97706) verification seal sphere. Pure white studio cyclorama, 18% pure #FFFFFF margin on all edges, soft subtle shadow, no printed text or lines on the glass sheets. --ar 16:9 --v 6.1 --style raw
  ```
- **中文生图提示词**：
  ```text
  纯白背景（#FFFFFF）上的极简 3D 光学雕塑：七片纤薄精密倒角的半透明青蓝（#0B7A8C）与钴蓝（#1D4ED8）光学玻璃书页沿等轴测弧线优雅展开，并在右侧严丝合缝地对齐合拢为规整的成册体块，一根纤细的光学校准轴贯穿其中，旁侧悬浮一枚象征人工核验把关的暖琥珀金（#D97706）玻璃圆珠。高调明亮影棚布光，玻璃片上无任何文字印刷，四周保留充足纯白留白。
  ```

---

#### `ART-08` · 解决方案 03：权限知识图谱晶格雕塑（Enterprise Knowledge Assistant）
- **覆盖源文件**：`assets/source/cyano-v2/cyano-sol-kb.png`
- **生成目标路径**：`site/public/art/cyano-sol-kb.webp`
- **尺寸与比例**：`1400 × 788`（`16:9`）
- **合成模式**：`mode: "white"`（纯白 `#FFFFFF` 背景 + `multiply` 无缝叠底）
- **页面位置**：首页方案切换器 Tab 03、`/services` 第 03 章配图、`/services/knowledge-assistant` 页头、`/insights` 与文章详情页头。
- **English Prompt**：
  ```text
  Minimalist 3D studio sculpture isolated on a pure solid #FFFFFF white background: an ordered isometric constellation of faceted Cyano Teal (#0B7A8C), Sapphire Cobalt (#1D4ED8), and Iridescent Violet (#6D28D9) crystal polyhedrons connected by delicate brushed-silver hairlines, with one illuminated Warm Amber-Gold (#D97706) source-citation core node in clear focus. Clean Swiss architectural aesthetic, soft diffused daylight, generous 18% pure #FFFFFF white margin around the entire object, zero background tint, no text. --ar 16:9 --v 6.1 --style raw
  ```
- **中文生图提示词**：
  ```text
  纯白背景（#FFFFFF）上的极简 3D 空间晶格雕塑：由多面切割的 Cyano 青蓝（#0B7A8C）、宝石钴蓝（#1D4ED8）与淡紫罗兰（#6D28D9）光学水晶多面体按严谨几何秩序悬浮排列，节点之间由极细的哑光银金属丝精准连接，其中一枚核心溯源节点呈现温暖通透的琥珀金（#D97706）光泽（象征带权限隔离与原文溯源的知识库）。瑞士现代主义留白构图，四周 18% 纯白边界，无任何文字。
  ```

---

#### `ART-09` · 解决方案 04：只读数据矩阵立方雕塑（Natural-Language Data Query）
- **覆盖源文件**：`assets/source/cyano-v2/cyano-sol-data.png`
- **生成目标路径**：`site/public/art/cyano-sol-data.webp`
- **尺寸与比例**：`1400 × 788`（`16:9`）
- **合成模式**：`mode: "white"`（纯白 `#FFFFFF` 背景 + `multiply` 无缝叠底）
- **页面位置**：首页方案切换器 Tab 04、`/services` 第 04 章配图、`/services/data-query` 页头主视觉。
- **English Prompt**：
  ```text
  Minimalist 3D optical sculpture isolated on a pure solid #FFFFFF white background: a clean 3x3x3 isometric matrix of rounded precision glass cubes in clear crystal and Cyano Teal (#0B7A8C), with one elevated slice of Warm Amber-Gold (#D97706) and Sapphire (#1D4ED8) cubes cleanly extracted upward as a structured query result. High-key museum product photography, crisp caustics, soft contained contact shadow, wide pure #FFFFFF margins on all four sides, no numbers or text. --ar 16:9 --v 6.1 --style raw
  ```
- **中文生图提示词**：
  ```text
  纯白背景（#FFFFFF）上的极简 3D 光学矩阵雕塑：一座由圆角透明水晶与 Cyano 青蓝（#0B7A8C）玻璃立方体整齐排列而成的 3×3×3 等轴测数据立方阵列，其中一组宝石蓝（#1D4ED8）与暖琥珀金（#D97706）高亮切片向上轻盈抽离悬浮（象征经过五重只读校验精准提取的结构化查询结果）。高调美术馆级静物摄影，焦散清澈，四周宽阔纯白留白，无任何数字或文字。
  ```

---

#### `ART-10` · 品牌图腾雕塑：白底 Cyano `C` 玻璃纪念碑（Brand Monolith）
- **覆盖源文件**：`assets/source/cyano-v2/cyano-white-c-monolith.png`
- **生成目标路径**：`site/public/art/cyano-white-c-monolith.webp`
- **尺寸与比例**：`1400 × 788`（`16:9`）
- **合成模式**：`mode: "white"`（纯白 `#FFFFFF` 背景 + `multiply` 无缝叠底）
- **页面位置**：关于我们页（`/about`）与联系评估页（`/contact`）右上角画廊雕塑。直接把 Cyano 官方 Logo 的等轴测层流 `C` 转化为博物馆级厚重青蓝光学玻璃藏品！
- **English Prompt**：
  ```text
  Museum-grade minimalist 3D glass sculpture isolated on a pure solid #FFFFFF white background: an isometric rounded C-shaped architectural monolith crafted from thick polished Cyano Teal (#2C8B96) optical glass, whose right openings split into three parallel laminar channels releasing five levitating spheres in Cyan, Sapphire Blue (#1D4ED8), and Warm Champagne Gold (#D97706). Bright gallery lighting, delicate turquoise caustic refraction on the white floor fully contained within wide 20% pure #FFFFFF margins, iconic brand sculpture, zero text. --ar 16:9 --v 6.1 --style raw
  ```
- **中文生图提示词**：
  ```text
  纯白背景（#FFFFFF）上的博物馆级 3D 品牌玻璃雕塑：以厚重抛光的官方 Cyano 青蓝色（#2C8B96）光学玻璃雕琢出一座等轴测圆角 C 形立体雕塑，右侧开口自然分流为三条平行的精密层流槽道，向右释放出五枚悬浮的青蓝、宝石钴蓝（#1D4ED8）与暖香槟金（#D97706）圆润晶球。明亮画廊顶光，纯白地面上投下清澈淡雅的青蓝焦散光斑且完全收在四周 20% 纯白留白以内，无任何文字。
  ```

---

#### `ART-11` · 技术架构页头：光学星盘校准仪（Calibration Astrolabe）
- **覆盖源文件**：`assets/source/cyano-v2/cyano-white-tech-astrolabe.png`
- **生成目标路径**：`site/public/art/cyano-white-tech-astrolabe.webp`
- **尺寸与比例**：`1400 × 788`（`16:9`）
- **合成模式**：`mode: "white"`（纯白 `#FFFFFF` 背景 + `multiply` 无缝叠底）
- **页面位置**：技术与方法页（`/technology`）页头右侧主视觉（致敬 `jrvs.ca` 精密几何仪器感，但完全采用 Cyano 青蓝+钴蓝+暖金多色体系）。
- **English Prompt**：
  ```text
  Precision 3D architectural gyroscope and optical astrolabe sculpture isolated on a pure solid #FFFFFF white background: concentric ultra-thin brushed titanium rings and beveled Cyano Teal (#0B7A8C) and Sapphire Blue (#1D4ED8) glass lenses suspended around a luminous Warm Champagne Gold (#D97706) core sphere. Swiss horology and optical engineering aesthetic, razor-sharp studio lighting, wide 18% pure #FFFFFF margins on all sides so edges dissolve invisibly into white, no numbers, no dial markings, no text. --ar 16:9 --v 6.1 --style raw
  ```
- **中文生图提示词**：
  ```text
  纯白背景（#FFFFFF）上的精密 3D 光学校准陀螺星盘雕塑：由纤细的拉丝钛金属同心环与精密切割的 Cyano 青蓝（#0B7A8C）、宝石钴蓝（#1D4ED8）光学透镜交错悬浮，环绕中央一枚温润发光的香槟琥珀金（#D97706）核心晶球。瑞士精密钟表与光学仪器美学，线条洗练克制，四周保留 18% 以上绝对纯白边界以便无缝融入白底页面，无刻度数字、无文字。
  ```

---

#### `ART-12` · 合作模式三联雕塑：三种起步体量（3-Mode Delivery Triptych）
- **覆盖源文件**：`assets/source/cyano-v2/cyano-white-engagement.png`
- **生成目标路径**：`site/public/art/cyano-white-engagement.webp`
- **尺寸与比例**：`1400 × 788`（`16:9`）
- **合成模式**：`mode: "white"`（纯白 `#FFFFFF` 背景 + `multiply` 无缝叠底）
- **页面位置**：首页第六幕「合作模式」顶部右侧雕塑、以及合作模式页（`/engagement`）页头主视觉。用**左中右三座递进演化的光学体块**直观对应「2–6 周敏捷试点 / 6–12 周完整定制 / 持续托管批次交付」。
- **English Prompt**：
  ```text
  Minimalist 3D architectural triptych isolated on a pure solid #FFFFFF white background: three distinct yet harmonious optical glass sculptures arranged from left to right with generous spacing — (1) a nimble compact Warm Amber-Gold (#D97706) and clear glass seed prism, (2) a substantial interlocking Cyano Teal (#0B7A8C) multi-module architectural cube, and (3) a rhythmic series of sleek Sapphire Blue (#1D4ED8) parallel laminar fins. High-key gallery lighting, soft clean shadows contained well inside 18% pure #FFFFFF borders, no text. --ar 16:9 --v 6.1 --style raw
  ```
- **中文生图提示词**：
  ```text
  纯白背景（#FFFFFF）上的极简 3D 光学三联雕塑：从左至右留白均匀地排列三座彼此呼应的精致玻璃几何体——左侧为轻巧敏捷的暖琥珀金（#D97706）透明起航棱镜（对应低启动试点），中央为稳固咬合的 Cyano 青蓝（#0B7A8C）模块化核心立方体（对应完整定制开发），右侧为富有韵律的宝石钴蓝（#1D4ED8）平行层流叶片序列（对应持续托管交付）。明亮画廊布光，柔和阴影完全收在四周 18% 纯白边距内，无文字。
  ```

---

#### `ART-13` · 客户案例页头：多色折射棱镜阵列（Harmonic Prisms）
- **覆盖源文件**：`assets/source/cyano-v2/cyano-white-prisms.png`
- **生成目标路径**：`site/public/art/cyano-white-prisms.webp`
- **尺寸与比例**：`1400 × 788`（`16:9`）
- **合成模式**：`mode: "white"`（纯白 `#FFFFFF` 背景 + `multiply` 无缝叠底）
- **页面位置**：客户项目总览页（`/cases`）、六个案例详情页（`/cases/[slug]`）以及法律条款页头右侧视觉（象征六个行业的生产落地与可量化折射成果）。
- **English Prompt**：
  ```text
  Minimalist 3D studio sculpture isolated on a pure solid #FFFFFF white background: six standing precision-cut vertical optical glass prisms arranged in a gentle arc, refracting crisp polychromatic caustics in Cyano Teal (#0B7A8C), Electric Cyan (#06B6D4), Sapphire Cobalt (#1D4ED8), Violet (#6D28D9), and Warm Champagne Gold (#D97706) onto the pure white floor. Clean architectural gallery photography, wide 18% pure #FFFFFF margins on all four sides, zero frame, no text. --ar 16:9 --v 6.1 --style raw
  ```
- **中文生图提示词**：
  ```text
  纯白背景（#FFFFFF）上的极简 3D 光学棱镜雕塑：六座高低错落、精密切割的竖向透明光学玻璃柱沿优雅微弧排列（象征六个已交付行业），在明亮顶光下向纯白地面折射出清澈绚丽的 Cyano 青蓝（#0B7A8C）、亮青、宝石钴蓝（#1D4ED8）、微紫（#6D28D9）与暖香槟金（#D97706）多色焦散光斑。四周保留 18% 以上绝对纯白边界，无边框、无文字。
  ```

---

### C. 工程洞察专栏封面系列（Editorial Cover Series · 3 张）

#### `ART-14` · 洞察文章 01 封面：《为什么通用聊天工具不等于企业知识库》
- **覆盖源文件**：`assets/source/cyano-v2/cyano-insight-kb.png`
- **生成目标路径**：`site/public/art/cyano-insight-kb.webp`
- **尺寸与比例**：`1400 × 875`（`16:10`）
- **合成模式**：`mode: "cover"`（满版无框杂志插画卡片）
- **页面位置**：首页第八幕卡片 01、`/insights` 列表卡片 01、`/insights/why-chatgpt-is-not-a-knowledge-base` 正文顶部大幅头图。
- **English Prompt**：
  ```text
  Editorial 3D architectural still life in a deep twilight slate-navy (#06101A) gallery: translucent frosted glass partitions dividing distinct permission vaults, where a crisp Cyano Cyan (#22D3EE) optical beam selectively illuminates a single verified Warm Gold (#FBBF24) crystalline document block while keeping adjacent Sapphire (#3B82F6) compartments securely shielded.Sophisticated magazine cover art direction, Leica 50mm lens, rich color contrast, zero text or typography. --ar 16:10 --v 6.1 --style raw
  ```
- **中文生图提示词**：
  ```text
  高级科技商业杂志封面级 3D 静物摄影（16:10）：深邃暮色蓝黑（#06101A）空间中，数道半透明磨砂光学玻璃隔断构成严谨的权限分区结构；一束精准的 Cyano 亮青色（#22D3EE）检索光束穿过授权通道，点亮其中一枚温暖璀璨的琥珀金（#FBBF24）水晶块，而相邻宝石蓝（#3B82F6）隔间保持安静受控的隔离状态（直观传达「权限边界与精准溯源」）。无任何文字与假界面。
  ```

---

#### `ART-15` · 洞察文章 02 封面：《从 2 天到 15 分钟：技术标书初稿的七道核验》
- **覆盖源文件**：`assets/source/cyano-v2/cyano-insight-proposal.png`
- **生成目标路径**：`site/public/art/cyano-insight-proposal.webp`
- **尺寸与比例**：`1400 × 875`（`16:10`）
- **合成模式**：`mode: "cover"`
- **页面位置**：首页第八幕卡片 02、`/insights` 列表卡片 02、`/insights/proposal-draft-in-15-minutes` 正文顶部大幅头图。
- **English Prompt**：
  ```text
  Editorial 3D optical sculpture in a deep obsidian-teal (#041118) studio: a sleek collimated beam of luminous Cyano Cyan (#22D3EE) and Sapphire light passing sequentially through seven precision-machined translucent glass gate rings, with the final seventh gate glowing in Warm Champagne Amber-Gold (#FBBF24) to signify human final sign-off. Dramatic studio rim lighting, architectural precision, rich polychromatic caustics, zero text. --ar 16:10 --v 6.1 --style raw
  ```
- **中文生图提示词**：
  ```text
  高级科技杂志封面级 3D 光学摄影（16:10）：深邃黑青色（#041118）暗房中，一束高速纯净的 Cyano 青蓝（#22D3EE）与宝石蓝平行光流，依次穿过七道等距排列的精密环形光学玻璃校验门（象征标书初稿生成的七道自动核验关口），最右侧第七道关口泛出温暖的香槟琥珀金（#FBBF24）光芒（象征人工终审签发）。光影层次丰富，无任何文字。
  ```

---

#### `ART-16` · 洞察文章 03 封面：《定制开发、试点验证还是托管服务？》
- **覆盖源文件**：`assets/source/cyano-v2/cyano-insight-delivery.png`
- **生成目标路径**：`site/public/art/cyano-insight-delivery.webp`
- **尺寸与比例**：`1400 × 875`（`16:10`）
- **合成模式**：`mode: "cover"`
- **页面位置**：首页第八幕卡片 03、`/insights` 列表卡片 03、`/insights/buy-pilot-or-managed` 正文顶部大幅头图。
- **English Prompt**：
  ```text
  Editorial 3D architectural composition in a refined dark midnight studio (#060E18): three distinct polished optical pathways branching cleanly from a single luminous origin prism — a fast Warm Amber-Gold (#FBBF24) trajectory, a deep structural Cyano Teal (#22D3EE) bridge, and a steady parallel Sapphire Cobalt (#60A5FA) rail. Balanced magazine cover framing, tactile glass and anodized metal materials, rich polychromatic glow, no text. --ar 16:10 --v 6.1 --style raw
  ```
- **中文生图提示词**：
  ```text
  高级科技杂志封面级 3D 建筑感构图（16:10）：深邃午夜蓝黑（#060E18）影棚内，一枚发光原点棱镜清晰分流出三条质感各异的精密光学轨道——一条轻快敏捷的暖琥珀金（#FBBF24）验证轨迹、一座厚重稳固的 Cyano 青蓝（#22D3EE）定制主桥、以及一组平稳连续的宝石钴蓝（#60A5FA）平行托管导轨（象征三种企业 AI 交付路径的理性权衡）。材质通透细腻，无任何文字。
  ```

---

### D. 创始团队商业纪实插画系列（Founders Illustration Series · 2 组）

> **⚠️ 团队插画硬性红线（来自 `docs/updating-plan.md` R8 与 `docs/visual-direction.md`）**：
> 1. **四位核心创始人必须全部佩戴清晰可见的眼镜（All 4 founders MUST wear clear glasses）**。
> 2. 只体现工程、软件架构与企业办公研讨场景，**桌面与背景严禁出现地图、岛屿、地球仪或航海元素**。
> 3. **严禁对人物肖像施加任何绿色/青色单色滤镜或双色调（Duotone）染色**！必须保持温暖健康的自然肤色、真实自然的服装色彩（藏青、炭灰、暖驼色、米白）与温润暖白画纸背景（`#F8F6F2`）。

#### `ART-17` · 四位核心合伙人研讨全景插画（Studio Group Workflow Illustration）
- **输出路径**：替换源图 `assets/source/team-business-glasses.png` 并运行处理脚本生成 `site/public/art/team-natural.webp`
- **尺寸与比例**：`1408 × 768`（约 `16:9` 横版）
- **页面位置**：首页第七幕「核心团队」右栏主图、以及关于我们页（`/about`）第一屏右栏主图。
- **English Prompt**：
  ```text
  Warm modern editorial vector-painterly illustration (New Yorker / Monocle / Stripe Press editorial style) of four East Asian technology founders — ALL FOUR WEARING CLEAR EYEGLASSES — gathered around a clean architectural studio table reviewing enterprise workflow diagrams and minimalist software schematics on a sleek monitor and paper folios. Attire in refined navy, slate charcoal, crisp white shirt, and subtle Cyano teal knitwear accents against a bright airy sunlit studio background (#F2F7F9) with warm oak wood details. Natural full-color palette, confident and approachable expressions, zero maps, zero islands, zero illegible gibberish text. --ar 16:9 --v 6.1
  ```
- **中文生图提示词**：
  ```text
  现代商业杂志编辑部风格全彩插画（类似 Stripe Press / Monocle 清爽写实插画质感）：四位东亚科技公司核心创始人——**四个人全部佩戴清晰斯文的眼镜**——围坐在明亮整洁的设计工作室长桌旁，专注讨论企业工作流结构草图与简洁显示屏上的模块化框图。衣着为质感得体的深海军蓝、炭灰、白衬衫与淡雅的 Cyano 青蓝针织衫点缀，环境为通透明亮的浅雾白办公空间（#F2F7F9）配温润原木桌面。色彩自然丰富有呼吸感，严禁出现任何地图、岛屿、海浪或乱码文字。
  ```

---

#### `ART-18` · 四位创始人单人半身肖像（Individual Founder Portraits `F1–F4`）
- **输出路径**：替换源图 `assets/source/portraits-business-glasses.png`（四等分横排）后由脚本自动生成暖白底自然全彩的 `site/public/art/founder-1-natural.webp` .. `founder-4-natural.webp` 及 `founder-4-avatar-natural.webp`（`160 × 160` 头像，用于 `/contact` 响应说明区）。
- **角色对应关系**：
  - `founder-1.webp`（`F1` · 首席执行官 / 系统与项目负责人）：沉稳干练，佩戴金属细框眼镜，深藏青西装外套配白衬衫。
  - `founder-2.webp`（`F2` · 首席技术官 / AI 工程与数据负责人）：专注睿智，佩戴半框或黑框眼镜，深灰立领夹克配青蓝内搭。
  - `founder-3.webp`（`F3` · 设计负责人 / 界面与体验架构）：儒雅敏锐，佩戴透明浅色板材眼镜，极简炭黑针织衫。
  - `founder-4.webp`（`F4` · 产品与解决方案负责人）：亲和专业，佩戴圆润细框眼镜，浅雾蓝衬衫配深色外搭。
- **English Prompt（单人通用模板，替换各角色着装即可保持画风 100% 统一）**：
  ```text
  Clean modern editorial portrait illustration of an East Asian enterprise AI founder wearing clear eyeglasses, chest-up 3/4 view with a calm confident expression, dressed in [ROLE ATTIRE] with a subtle Cyano teal (#2C8B96) accent, set against a plain airy soft mist-white paper-grain studio background (#F4F7F9). Consistent Monocle / Linear editorial portrait series style, natural warm skin tones, crisp clean linework, generous headroom, no text. --ar 4:5 --v 6.1
  ```

---

## 三、生图验收自检表（交给画图 Agent 的最终 Checklist）

- [ ] **品牌辨识度**：一眼能看出 **Cyano 青蓝（Teal/Cyan）** 主导与 **层流 `C` / 有序液滴** 几何基因，绝不是单调暗绿，也不是大红黑底。
- [ ] **色彩丰富度**：画面内同时具备 **青蓝主色 + 宝石钴蓝冷色纵深 + 暖香槟琥珀金高光点缀**，通透高级。
- [ ] **白底无缝融合**：`ART-06` 至 `ART-13` 四周边缘像素是否为纯白 `#FFFFFF`，放入网页后无任何灰框切边？
- [ ] **黑底留白呼吸**：`ART-01`、`ART-02`、`ART-03` 文字叠放区是否保持深邃纯黑 `#000000`，不干扰标题阅读？
- [ ] **内容合规红线**：0 岛屿/海洋/地图、0 乱码假文字、4 位创始人 100% 佩戴眼镜。
