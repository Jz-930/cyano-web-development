# Cyano 官网 v5：写实摄影配图规划与生图 Prompt

> 日期：2026-11-15 ｜ 适用版本：v4.2 之后
> 目的：给目前偏素的页面补上“现场感”。产品样机、界面截图负责证明“系统真的存在”；照片负责讲清楚“这些系统用在什么地方、替谁解决了什么麻烦”。
> 已确认（2026-11-15）：照片里的人物正常出镜，不刻意露脸也不刻意回避；首页首屏不加照片背板。

---

## 1. 设计思路

### 1.1 照片在这个网站里干什么

现在的页面几乎全是界面样机、线稿和光场，读者看到的是“系统”，看不到“业务现场”。照片补的就是这一块。整套照片沿着同一条故事线拍：

| 阶段 | 照片讲什么 | 典型画面 |
|---|---|---|
| 一、散乱的资料 | 企业知识原本的样子：堆着、分散、靠人记 | 文件柜、成摞的标书、红笔批改的两版资料、各人各自的便签 |
| 二、工程化处理 | Cyano 的工作方式：先诊断，再一步步做成系统 | 白板上的流程草图、深夜两块屏幕前的工程师、验收清单 |
| 三、业务现场在用 | 系统交付后，一线人员手里拿的是结果 | 设备旁拿平板的销售工程师、仓库通道里查库存的店长、整理收支的物业管理员 |

全站只拍一个系列，用同一套光线、色调和镜头语言，看起来像同一位摄影师在同一个项目里拍完的。

### 1.2 必须守住的规则

这些规则来自原方案 R1–R12 和 v4 计划，生图和挑图时都要检查：

| 规则 | 对照片的要求 |
|---|---|
| 人物 | 正常出镜：机位由画面要讲的事决定，该拍全身就拍全身，该拍手部特写就拍特写，不为露脸或藏脸专门调整。人物专注在手上的事，不看镜头、不摆姿势。外貌以东亚面孔为主、夹杂其他族裔，商务休闲装，兼顾中国与北美两个市场 |
| R8 团队 | 照片里的人是“行业里的工作者”，不代表 Cyano 团队，也不代表具体客户员工。不放进团队区块，不配姓名或职位图注。创始人继续用现有插画形象 |
| R9 案例真实 | 照片是“行业场景”，不是客户现场纪实。页面上不配“项目现场”之类的图注；案例界面依旧用真实截图 |
| R7 不提部署位置 | 不拍机房、数据中心、云图标；画面里不出现可辨认的城市地标、国家标识、路牌 |
| R10 不用图库 | 全部自己生成；同时要避开图库味（见 §2.4） |
| 品牌色 | 只允许一个青绿色强调光，其余低饱和；不出现洋红、紫色、彩虹光、橙青大片调色 |
| 文字 | 画面里**不要任何可读文字**（生图模型写出的字基本是乱码）。屏幕、文件上只出现虚化的版式块，需要真实界面时后期合成真截图 |
| 证据优先 | 照片不替代样机。凡是原来放样机的位置，照片只做背景或配角，样机依旧压在照片上面 |

### 1.3 和现有页面怎么拼

| 页面区块类型 | 照片调性 | 拼法 |
|---|---|---|
| 深色区块（技术页、合作方式页部分段落、收尾区、404） | **低调光 LOW-KEY**：深青黑阴影、一盏冷色实用光源 | 照片边缘用渐变遮罩融进 `--ink-950`，文字区一侧留 50–60% 暗部空白；叠 2.5–3% 颗粒，与光场的颗粒一致 |
| 浅色区块（纸面、mist） | **高调光 HIGH-KEY**：阴天窗光、干净的白、沙色中性调 | 圆角 12px 的独立图片，不加阴影；需要时样机从右下角压住照片 1/4，形成“现场 + 系统”的叠压 |
| 卡片小图 | 同所在区块的调性 | 统一 4:3 或 3:2，同一排卡片的取景距离一致（都是特写，或都是中景） |

首页首屏维持现有的光场 + 舞台样机，不加照片。

---

## 2. 统一风格块（每条 Prompt 都已经内嵌，以下供核对）

英文 Prompt 对大多数模型更稳定，所以 Prompt 用英文写；需要中文模型时，把画面描述译成中文，风格块保留英文也可以。

### 2.1 STYLE-DARK（深色区块用）

```
Photorealistic commercial editorial photograph, full-frame camera, 35mm prime lens at f/2, available light plus one soft cool practical light source, deep teal-black shadows, neutral clean highlights, restrained desaturated color with a single cyan-teal accent, fine subtle film grain, crisp micro-detail on real materials (paper fibers, brushed aluminum, matte plastic, wood grain), shallow depth of field, calm, precise, quiet mood, candid documentary feel, people absorbed in their work and not looking at the camera, natural skin texture, no legible text, no logos, no brand names, no watermark.
```

### 2.2 STYLE-LIGHT（浅色区块用）

```
Photorealistic commercial editorial photograph, full-frame camera, 50mm prime lens at f/2.8, soft overcast daylight from a large window, clean bright whites with a faint cool mint tint, warm sand-beige neutrals, muted desaturated palette with one small teal accent, true-to-life textures, gentle shallow depth of field, orderly, quiet, professional mood, candid documentary feel, people absorbed in their work and not looking at the camera, natural skin texture, no legible text, no logos, no brand names, no watermark.
```

### 2.3 通用负面词（支持 Negative Prompt 的模型就填上）

```
stock photo look, posed, people looking at camera, cheesy smile, handshake, thumbs up, holographic HUD, floating interface, glowing brain, robot, humanoid AI, circuit board overlay, neon purple, magenta, rainbow light, orange and teal blockbuster grading, lens flare, server room, data center, cloud icons, gibberish text, readable text, logos, distorted hands, extra fingers, waxy plastic skin, airbrushed faces, CGI render, 3D illustration, cartoon, oversaturated, HDR halo, messy clutter, dirty, dramatic smoke
```

### 2.4 一眼图库味的东西，一律不要

握手、对着镜头笑、几个人围着屏幕指指点点、悬浮的全息界面、发光大脑、机器人、蓝紫色赛博光、灯泡、拼图块、商务人士跳起来。画面要像杂志专题里“记录一个工作现场”的照片，而不是广告里的“表演工作”。人物的表情是专注、思考、平静，不是兴奋。

### 2.5 色调参考值（后期统一调色时用）

| 位置 | 目标色 |
|---|---|
| 暗部 | 向 `#062F3A`（deep-teal）偏 |
| 高光 | 中性白，浅色区块略偏 `#F4FBFB`（mist） |
| 中性暖色 | `#E9E1D3`（sand），用于纸张、木桌、墙面 |
| 唯一强调色 | `#3FA0A6`（brand-teal），来自屏幕光、指示灯或小物件 |
| 饱和度 | 整体 -15% 左右；肤色单独保护，不要被青色调染灰 |

---

## 3. 配图位置总表

优先级：**P0** 先做，补上后“太素”的问题基本解决；**P1** 第二批；**P2** 有余力再做。

| 编号 | 页面 · 区块 | 调性 | 比例 / 导出尺寸 | 优先级 | 用途说明 |
|---|---|---|---|---|---|
| ~~PH-01~~ | ~~首页 · 首屏背板~~ | — | — | 取消 | 首屏不加照片，编号保留不复用 |
| PH-02 | 首页 · 顾虑四问「找不到」 | LIGHT | 4:3 · 1600×1200 | P1 | 四张卡片顶部小图 |
| PH-03 | 首页 · 顾虑四问「说不准」 | LIGHT | 4:3 · 1600×1200 | P1 | 同上 |
| PH-04 | 首页 · 顾虑四问「不敢交」 | LIGHT | 4:3 · 1600×1200 | P1 | 同上 |
| PH-05 | 首页 · 顾虑四问「各用各」 | LIGHT | 4:3 · 1600×1200 | P1 | 同上 |
| PH-06 | 首页四类场景 · 方案详情首屏「销售与客户咨询 AI」 | LIGHT | 3:2 · 2400×1600 | **P0** | 中景环境照；样机压在右下角 |
| PH-07 | 同上「文档、标书与方案自动化」 | LIGHT | 3:2 · 2400×1600 | **P0** | 同上 |
| PH-08 | 同上「企业知识库与内部助手」 | LIGHT | 3:2 · 2400×1600 | **P0** | 同上 |
| PH-09 | 同上「业务数据查询与分析」 | LIGHT | 3:2 · 2400×1600 | **P0** | 同上 |
| PH-10 | 首页合作方式 · 合作方式页首屏「诊断工作坊」 | LIGHT | 16:9 · 2400×1350 | P1 | 落地路径第一步“1 周评估”的画面 |
| PH-11 | 全站收尾区 · 关于页“澜屿”名字由来 · OG 图底 | DARK | 21:9 · 3360×1440 | **P0** | 品牌母题“深海与岛屿”的真实版 |
| PH-12 | 案例详情「工程与制造 · 销售顾问 AI」 | LIGHT | 3:2 · 2400×1600（可裁 21:9） | **P0** | 案例首屏与“界面实录”之间的通栏氛围带；案例卡悬停时淡入 |
| PH-13 | 案例详情「专业服务与投研 · 标书生成」 | DARK | 同上 | **P0** | 同上；配合“2 天 → 15 分钟” |
| PH-14 | 案例详情「企业服务 · IT 知识库助手」 | LIGHT | 同上 | **P0** | 同上 |
| PH-15 | 案例详情「零售与供应链 · 自然语言查数」 | LIGHT | 同上 | **P0** | 同上 |
| PH-16 | 案例详情「房地产与物业 · 收支整理」 | LIGHT | 同上 | **P0** | 同上 |
| PH-17 | 案例详情「内容与传媒 · 长篇写作记忆」 | DARK | 同上 | **P0** | 同上 |
| PH-18 | 技术页 · 首屏右侧或第 2 区块引子「工程现场」 | DARK | 16:9 · 2880×1620 | P1 | 与 K-08 光场叠加，或放在四层架构图上方 |
| PH-19 | 合作方式页 · 部署方式「私有化部署」 | DARK | 4:3 · 1600×1200 | P2 | 放在 SaaS / 私有化对比图旁；不提位置 |
| PH-20 | 合作方式页 · 五步流程「试点验收」 | LIGHT | 3:2 · 2400×1600 | P1 | 流程第 4 步旁 |
| PH-21 | 合作方式页 · 托管式服务「长期负责」 | DARK | 3:2 · 2400×1600 | P1 | 托管卡或“长期负责”段落旁 |
| PH-22 | 关于页 · 服务范围与原则 | LIGHT | 3:2 · 2400×1600 | P2 | “先诊断，再交付”的工作台俯拍 |
| PH-23 | 联系页 · 首屏右侧 | LIGHT | 4:5 · 1600×2000 | P1 | 配“1 个工作日内回复” |
| PH-24 | 404 页 | DARK | 16:9 · 2880×1620 | P2 | 雾中孤屿 |

**不放照片的地方：** 首页首屏、案例截图画廊、技术页四层架构图、上下文装箱器、对比表、甘特图、FAQ、文章正文。这些地方的主角是证据和交互，加照片只会分散注意。洞察文章封面维持 v4 的代码排版封面。

**数量：** P0 共 11 张，P1 9 张，P2 3 张，合计 23 张。每张建议生成 4–8 张候选再挑。

---

## 4. 逐张 Prompt

每条 Prompt 都是完整的，可以直接复制。`[ ]` 里是给你看的构图与用法说明，不要粘进生图工具。

### PH-02 顾虑四问 ·「找不到」

[故事：资料明明有，但散在柜子里、共享盘里，找一份要翻半天。取景：中近景，人在柜子前翻找。]

```
Photorealistic commercial editorial photograph of an office worker standing at an open steel filing cabinet, one drawer pulled out and packed tightly with hanging folders and plain colored tabs in beige, pale grey and muted mint. She is pulling one thick folder halfway out with one hand while holding a second folder under her arm, searching, brow slightly furrowed. On the desk beside the cabinet, slightly out of focus, a laptop shows a blurred grid of folder icons. Medium close shot, the drawer and her hands are the sharpest point. Soft overcast daylight from a large window, clean bright whites with a faint cool mint tint, warm sand-beige neutrals, muted desaturated palette with one small teal accent, full-frame camera, 50mm prime lens at f/2.8, true-to-life textures of paper and metal, gentle shallow depth of field, overloaded but orderly mood, candid documentary feel, not looking at the camera, natural skin texture, no legible text, no logos, no watermark. Aspect ratio 4:3.
```

### PH-03 顾虑四问 ·「说不准」

[故事：同一份资料有两个版本，数字对不上，没人确定哪个是对的。俯拍特写，画面焦点在纸上。]

```
Photorealistic commercial editorial photograph, top-down view of a light oak desk with two printed copies of the same technical specification sheet laid side by side, nearly identical layouts. On the right copy, one table cell is circled in red pen and a question mark is drawn in the margin. A hand holding the red pen hovers between the two pages, hesitating. A ceramic coffee cup and a pair of reading glasses at the edge of the frame. All printed text is soft and illegible, only the layout blocks are visible. Soft overcast daylight from a large window, clean bright whites with a faint cool mint tint, warm sand-beige neutrals, muted desaturated palette, the red pen mark is the only saturated color, full-frame camera, 50mm prime lens at f/2.8, true-to-life paper texture, gentle shallow depth of field, quiet, uncertain mood, no legible text, no logos, no watermark. Aspect ratio 4:3.
```

### PH-04 顾虑四问 ·「不敢交」

[故事：AI 写出来的东西，没人复核就不敢交给客户。画面停在“签字前的一秒”。]

```
Photorealistic commercial editorial photograph of a senior reviewer seated at a clean white desk, leaning over a printed draft document, a fountain pen held just above the signature line, not yet signing, reading the page carefully. Next to the document, a short printed checklist with three boxes ticked in pencil and the last box still empty. An open laptop sits to the side in soft focus. Medium close shot from a slight side angle, focus on the pen tip and the page. All text illegible, only layout blocks visible. Soft overcast daylight from a large window, clean bright whites with a faint cool mint tint, warm sand-beige neutrals, muted desaturated palette with one small teal accent, full-frame camera, 50mm prime lens at f/2.8, true-to-life textures, gentle shallow depth of field, careful, deliberate mood, candid documentary feel, not looking at the camera, natural skin texture, no legible text, no logos, no watermark. Aspect ratio 4:3.
```

### PH-05 顾虑四问 ·「各用各」

[故事：每个人各用各的 AI 工具、各存各的提示词，经验沉淀不下来。正俯拍，四个工位像四块拼不起来的地图。]

```
Photorealistic commercial editorial photograph, straight overhead view of four desks pushed together into one block with visible gaps between them, four colleagues each working alone, each workspace arranged in a completely different way: one with a spiral notebook and pencil, one with a grid of small paper sticky notes in muted sand and mint, one with a tablet and stylus, one with a laptop and a printed sheet covered in handwritten notes. Four different coffee mugs, four different chargers. Their heads, shoulders and hands are seen from above as they type and write, each absorbed in their own screen, no one interacting. Soft overcast daylight from a large window, clean bright whites with a faint cool mint tint, warm sand-beige neutrals, muted desaturated palette with one small teal accent, full-frame camera, 35mm lens at f/4 for even sharpness, true-to-life textures, orderly composition, candid documentary feel, no legible text, no logos, no watermark. Aspect ratio 4:3.
```

### PH-06 销售与客户咨询 AI · 设备展厅里的销售工程师

[故事：工程设备的销售，客户问到参数和项目案例时，答案就在手里的平板上。中景，右下角留给样机叠压。]

```
Photorealistic commercial editorial photograph inside a bright industrial equipment showroom. A large precision pump and valve assembly with brushed steel and matte grey painted surfaces dominates the left half of the frame. Beside it, a sales engineer in his thirties wearing a plain navy work jacket turns a tablet toward a client so they can both read it; the screen shows a soft blurred chat layout with a teal accent. The client, a woman in a light shirt holding a folded catalog, leans in to look at the screen. Both are focused on the tablet, mid-conversation. A low table with product catalogs and a white hard hat in the background. Medium shot from about ten meters away at eye level. Soft overcast daylight from high clerestory windows, clean bright whites with a faint cool mint tint, warm sand-beige neutrals, muted desaturated palette with one small teal accent from the tablet screen, full-frame camera, 50mm prime lens at f/2.8, true-to-life metal and fabric textures, gentle shallow depth of field, confident, professional mood, candid documentary feel, not looking at the camera, natural skin texture, no legible text, no logos, no watermark. Aspect ratio 3:2, keep the lower right quarter calm for an overlaid interface card.
```

### PH-07 文档、标书与方案自动化 · 投标会议桌

[故事：写一份方案要翻几十份参考资料。长会议桌，纵深透视，资料从前景排到远处。]

```
Photorealistic commercial editorial photograph of a long meeting table in a quiet consulting office, receding in perspective. Along the table: thick bound tender documents, ring binders with paper index tabs, reference reports bristling with small paper flags, an open laptop near the foreground. In the foreground, a consultant's hand turns a page of a bound proposal draft. Further down the table, two colleagues sit reading and taking notes, softly out of focus. Late-afternoon soft daylight through tall windows on the right, long gentle shadows across the table, clean bright whites with a faint cool mint tint, warm sand-beige neutrals, muted desaturated palette with one small teal accent from the laptop screen, full-frame camera, 50mm prime lens at f/2.8, true-to-life paper texture, gentle shallow depth of field, focused, methodical mood, candid documentary feel, not looking at the camera, no legible text, no logos, no watermark. Aspect ratio 3:2, keep the lower right quarter calm for an overlaid interface card.
```

### PH-08 企业知识库与内部助手 · 新员工第一周

[故事：新员工有一堆问题——怎么连 VPN、报销找谁——以前要问 IT 同事，现在先问助手。]

```
Photorealistic commercial editorial photograph of a clean open-plan office corner. A young new employee sits at a desk typing a question on a laptop, the screen showing a soft blurred question-and-answer layout with a teal accent, reading the answer with a small look of relief. On the desk: a freshly opened laptop box, a coiled charging cable, a visitor badge on a lanyard with no text, and a printed onboarding checklist. In the background, out of focus, a colleague walks past carrying a mug. Three-quarter side view at desk height. Soft overcast daylight from a large window, clean bright whites with a faint cool mint tint, warm sand-beige neutrals, muted desaturated palette with one small teal accent, full-frame camera, 50mm prime lens at f/2.8, true-to-life textures, gentle shallow depth of field, calm, welcoming mood, candid documentary feel, not looking at the camera, natural skin texture, no legible text, no logos, no watermark. Aspect ratio 3:2, keep the lower right quarter calm for an overlaid interface card.
```

### PH-09 业务数据查询与分析 · 仓储通道

[故事：店长站在货架间直接问“这周哪个仓缺货”，不用等报表。纵深通道，人物在画面右三分之一。]

```
Photorealistic commercial editorial photograph of a tidy retail distribution warehouse aisle, tall shelving with plain unbranded cardboard cartons receding into soft depth. A store operations manager in a sand-colored jacket stands in the right third of the frame, looking down at a tablet that shows a soft blurred bar chart in teal, one finger about to tap the screen. A flatbed cart with a handheld barcode scanner rests beside him. Wide-medium shot down the aisle. Soft even daylight from skylights, clean bright whites with a faint cool mint tint, warm sand-beige cardboard tones, muted desaturated palette with one small teal accent from the tablet, full-frame camera, 35mm prime lens at f/2.8, true-to-life textures of cardboard and steel, gentle shallow depth of field, orderly, efficient mood, candid documentary feel, not looking at the camera, natural skin texture, no legible text or labels, no logos, no watermark. Aspect ratio 3:2, keep the lower left quarter calm for an overlaid interface card.
```

### PH-10 诊断工作坊 · 白板上的流程

[故事：合作的第一步是 1 周诊断：把现在的业务流程画出来，找出值得交给 AI 的环节。]

```
Photorealistic commercial editorial photograph of a workshop in a bright meeting room. A consultant stands at a large whiteboard covered with a hand-drawn process flow: rectangular boxes connected by arrows, a few loops, one box circled twice in teal marker, plain paper sticky notes in sand and pale grey stuck beside some boxes, no words, only shapes and lines. She is mid-stroke drawing a new arrow with a teal marker, half turned toward two client team members seated at the table who are watching the board and pointing at one box. Two open laptops and printed process documents on the table. Medium-wide shot from the side of the room. Soft overcast daylight from a large window, clean bright whites with a faint cool mint tint, warm sand-beige neutrals, muted desaturated palette, the teal marker line is the only accent color, full-frame camera, 35mm prime lens at f/2.8, true-to-life textures, gentle shallow depth of field, focused, collaborative mood, candid documentary feel, not looking at the camera, natural skin texture, no legible text, no logos, no watermark. Aspect ratio 16:9.
```

### PH-11 澜 · 屿 · 蓝调时刻的海与岛

[品牌母题的写实版：深色海面、带岩层纹理的小岛，海面上一缕缕微弱的青色光（海洋发光浮游生物是真实现象，也正好对应“光流连接孤岛”）。中左大面积暗海面留给收尾标语与按钮。这张是整套风格的基准，第一个做。]

```
Photorealistic fine-art landscape photograph of a calm dark sea at blue hour, shot from a low cliff. Several small rocky islets with visible layered rock strata are scattered across the right half of the frame, receding into soft haze. Faint natural bioluminescent plankton traces thin cyan-teal lines along the gentle wave edges, loosely connecting the islets. The left and center of the frame is a wide expanse of near-black water and deep teal sky, clean negative space. Long exposure, smooth glassy water, full-frame camera, 35mm prime lens, tripod, deep teal-black shadows, neutral highlights, restrained desaturated color with the single cyan-teal accent of the glowing water, fine film grain, crisp rock texture, serene, vast, precise mood, no people, no boats, no buildings, no lights on shore, no text, no watermark. Aspect ratio 21:9.
```

### PH-12 案例 · 工程与制造（销售顾问 AI）

[与 PH-06 同一行业的“细节特写”，场景换到项目现场办公室。]

```
Photorealistic commercial editorial photograph of an engineering company's site office. On a sturdy work table: rolled engineering drawings held by rubber bands, a white hard hat, a thick product specification binder, and a tablet lying on top of the binder with a soft blurred chat layout and a teal accent on screen. Through the window behind, out of focus, a steel structure under construction and a crane silhouette in pale daylight, a site worker in a hard hat walking past outside. Soft overcast daylight, clean bright whites with a faint cool mint tint, warm sand-beige neutrals, muted desaturated palette with one small teal accent, full-frame camera, 50mm prime lens at f/2.8, true-to-life textures of paper, plastic and steel, gentle shallow depth of field, practical, grounded mood, no legible text, no logos, no watermark. Aspect ratio 3:2, keep the main subject within the central band so it can also be cropped to 21:9.
```

### PH-13 案例 · 专业服务与投研（方案初稿 2 天 → 15 分钟）

[讲“过去那两天”：深夜还在翻资料拼方案。用暗调，和页面里的前后对照擦除交互形成对比。]

```
Photorealistic commercial editorial photograph of a consultant working late in the evening at her desk. A tall stack of research reports and industry studies with paper flags, a printed proposal draft with handwritten margin notes, a highlighter, and an open laptop casting a soft cyan-teal glow onto the papers and onto her face and hands. She rests her chin on one hand, reading a report, the other hand marking a page. A desk lamp with a warm low light sits at the far edge. The background is a dark, empty office, out of focus. Medium shot from a three-quarter side angle. Full-frame camera, 35mm prime lens at f/2, the laptop and the small lamp are the only light sources, deep teal-black shadows, neutral highlights, restrained desaturated color with a single cyan-teal accent, fine film grain, crisp paper texture, shallow depth of field, tired but determined mood, candid documentary feel, not looking at the camera, natural skin texture, no legible text, no logos, no watermark. Aspect ratio 3:2, keep the main subject within the central band so it can also be cropped to 21:9.
```

### PH-14 案例 · 企业服务（IT 知识库，80% 常见咨询由 AI 处理）

```
Photorealistic commercial editorial photograph of an IT service desk in a bright corporate office. On a clean workbench: three laptops in a row, one with its lid open showing a soft blurred ticket list with a teal accent, neatly coiled cables in a tray, a headset hanging on the edge of a monitor, a small box of spare keyboards. An IT technician stands at the bench plugging a cable into one laptop while glancing at the ticket list, relaxed and unhurried. Behind, out of focus, glass partitions and a quiet open-plan floor. Medium shot at bench height. Soft overcast daylight from a large window, clean bright whites with a faint cool mint tint, warm sand-beige neutrals, muted desaturated palette with one small teal accent, full-frame camera, 50mm prime lens at f/2.8, true-to-life textures, gentle shallow depth of field, calm, under-control mood, candid documentary feel, not looking at the camera, natural skin texture, no legible text, no logos, no watermark. Aspect ratio 3:2, keep the main subject within the central band so it can also be cropped to 21:9.
```

### PH-15 案例 · 零售与供应链（业务人员直接提问查库存与销量）

[与 PH-09 区分：这张是近景，手和平板为主。]

```
Photorealistic commercial editorial photograph, close view in a retail stockroom. In the foreground, a hand holds a tablet showing a soft blurred table of numbers and a small teal bar chart. In the middle ground, a handheld barcode scanner rests on top of a stack of plain unbranded cardboard cartons. Background: shelves of cartons and folded shopping crates, and a stock clerk restacking boxes, softly out of focus. Soft even daylight from a high window, clean bright whites with a faint cool mint tint, warm sand-beige cardboard tones, muted desaturated palette with one small teal accent from the tablet, full-frame camera, 50mm prime lens at f/2.8, true-to-life textures of cardboard and plastic, gentle shallow depth of field, efficient, practical mood, candid documentary feel, no legible text or labels, no logos, no watermark. Aspect ratio 3:2, keep the main subject within the central band so it can also be cropped to 21:9.
```

### PH-16 案例 · 房地产与物业（从沟通记录提取费用，按房产整理收支）

```
Photorealistic commercial editorial photograph of a property manager at her desk by a window. Several sets of keys with blank paper tags laid in a neat row, small piles of paper receipts and invoices sorted into groups and held with binder clips, a smartphone showing a soft blurred chat thread with message bubbles, and a laptop showing a soft blurred spreadsheet with a teal header row. She places one receipt onto a pile while checking the laptop screen. Through the window, out of focus, the facade of a modern mid-rise residential building with balconies. Medium shot from the side of the desk. Soft overcast daylight, clean bright whites with a faint cool mint tint, warm sand-beige neutrals, muted desaturated palette with one small teal accent, full-frame camera, 50mm prime lens at f/2.8, true-to-life textures of paper and metal keys, gentle shallow depth of field, orderly, reassuring mood, candid documentary feel, not looking at the camera, natural skin texture, no legible text, no logos, no watermark. Aspect ratio 3:2, keep the main subject within the central band so it can also be cropped to 21:9.
```

### PH-17 案例 · 内容与传媒（管理百万字长篇的人物设定与剧情分支）

```
Photorealistic commercial editorial photograph of a novelist's studio at night. A wall-mounted cork board covered with dozens of plain index cards connected by thin taut threads, forming branching story paths, a few cards marked with small teal pins. A writer stands in front of the board in profile, one hand moving a card to a new branch, the other holding a pencil, thinking. Below, a wooden desk with tall stacks of manuscript pages bound with clips, an open notebook, and a laptop casting a soft cyan-teal glow. A small warm desk lamp at the edge. Medium shot. Full-frame camera, 35mm prime lens at f/2, the laptop and lamp are the only light sources, deep teal-black shadows, neutral highlights, restrained desaturated color with a single cyan-teal accent, fine film grain, crisp paper and cork texture, shallow depth of field, absorbed, intricate mood, candid documentary feel, not looking at the camera, natural skin texture, no legible text, no logos, no watermark. Aspect ratio 3:2, keep the main subject within the central band so it can also be cropped to 21:9.
```

### PH-18 技术页 · 工程现场

[讲“工程能力”：不是概念，是有人在一行行调。过肩视角是为了让屏幕和手绘架构图成为主角。]

```
Photorealistic commercial editorial photograph, over-the-shoulder view of an engineer working late at night at a desk with two monitors showing soft blurred columns of code and log lines in white and cyan-teal on dark backgrounds. The engineer's shoulder, the side of the head and one hand on a mouse are in the left foreground, softly out of focus. On the desk: a mechanical keyboard, an open paper notebook with a hand-drawn diagram of four stacked rectangles connected by arrows, a mechanical pencil, a glass of water. The room is dark, monitors are the main light source. Full-frame camera, 35mm prime lens at f/2, deep teal-black shadows, neutral highlights, restrained desaturated color with a single cyan-teal accent, fine film grain, crisp detail on keys and paper, shallow depth of field focused on the notebook diagram, precise, concentrated mood, candid documentary feel, no legible text, no logos, no watermark. Aspect ratio 16:9, keep the right 40% darker for overlaying a small glass panel.
```

### PH-19 合作方式页 · 私有化部署

[讲“数据不出客户环境”：一台不起眼的设备，安静地锁在客户自己的机柜里。不是机房，是普通办公室的一角。]

```
Photorealistic commercial editorial photograph of a small locked network cabinet with a smoked glass door in the corner of a tidy office storage room. Inside, a single compact rack-mounted server unit and a network switch, very neat cable management, one small cyan-teal status light glowing. A key is in the cabinet lock. A plain wall and a corner of an office shelf around it. Low ambient light, full-frame camera, 50mm prime lens at f/2.2, deep teal-black shadows, neutral highlights, restrained desaturated color with the single cyan-teal status light as accent, fine film grain, crisp metal and glass texture, shallow depth of field, secure, contained, quiet mood, no people, no legible text, no brand names, no logos, no watermark. Aspect ratio 4:3.
```

### PH-20 合作方式页 · 试点验收

```
Photorealistic commercial editorial photograph of two people reviewing a pilot together at a meeting table, seen from the side. A client-side manager ticks a box on a printed acceptance checklist with a pencil while a delivery engineer beside him points at an open laptop showing a soft blurred interface with a teal accent, explaining one detail. A printed one-page summary with a simple bar chart lies between them. Two glasses of water, a closed notebook. Medium shot at table height, both engaged in the conversation. Soft overcast daylight from a large window, clean bright whites with a faint cool mint tint, warm sand-beige neutrals, muted desaturated palette with one small teal accent, full-frame camera, 50mm prime lens at f/2.8, true-to-life textures, gentle shallow depth of field, constructive, decisive mood, candid documentary feel, not looking at the camera, natural skin texture, no legible text, no logos, no watermark. Aspect ratio 3:2.
```

### PH-21 合作方式页 · 托管式服务「长期负责」

```
Photorealistic commercial editorial photograph of a quiet desk at early dawn, blue light just beginning outside a large window. A single monitor shows a soft blurred dashboard with a calm, steady cyan-teal line graph. Beside it, a neatly bound monthly report in a plain grey cover, a pen laid parallel to it, and a cup of tea with light steam. The rest of the office is dark and empty. Full-frame camera, 35mm prime lens at f/2, the monitor and the window are the only light sources, deep teal-black shadows, neutral highlights, restrained desaturated color with a single cyan-teal accent, fine film grain, crisp textures, shallow depth of field, steady, reliable, unhurried mood, no people, no legible text, no logos, no watermark. Aspect ratio 3:2.
```

### PH-22 关于页 · 先诊断，再交付

```
Photorealistic commercial editorial photograph, straight overhead view of a large light oak work table arranged with care: a printed architecture sketch of boxes and arrows with red pen review marks, an open laptop with a soft blurred interface and a teal accent, a short stack of paper sticky notes in sand and pale grey, a metal ruler, a mechanical pencil, and a cup of black coffee. Items are aligned at right angles with generous spacing. Two people's hands, one holding a pen, rest on the sketch as they discuss it. Soft overcast daylight from a large window, clean bright whites with a faint cool mint tint, warm sand-beige neutrals, muted desaturated palette with one small teal accent, full-frame camera, 35mm lens at f/4 for even sharpness, true-to-life textures, orderly, deliberate mood, no legible text, no logos, no watermark. Aspect ratio 3:2.
```

### PH-23 联系页 · 一个工作日内回复

[竖构图，安静、开放，像“我们已经准备好了”。上方留白给玻璃卡片。]

```
Photorealistic commercial editorial photograph of a clean desk by a window in soft morning light. An open notebook with a blank page and a pen resting across it, a closed laptop, a smartphone lying face down, a cup of coffee, and a small potted plant. Long soft window shadows fall diagonally across the desk surface. The upper 40% of the frame is a plain light wall with gentle light, clean negative space. Soft daylight, clean bright whites with a faint cool mint tint, warm sand-beige neutrals, muted desaturated palette with one small teal accent on the pen, full-frame camera, 50mm prime lens at f/2.8, true-to-life textures, gentle shallow depth of field, calm, open, ready mood, no people, no legible text, no logos, no watermark. Aspect ratio 4:5, vertical.
```

### PH-24 404 · 雾中孤屿

```
Photorealistic fine-art landscape photograph of a single small rocky islet with layered rock strata standing in calm dark water, surrounded by soft drifting sea fog at dawn. The islet is small, placed in the lower right third; the rest of the frame is open misty sea and sky in deep teal-grey tones. A faint thin cyan-teal glow traces the water line around the rock. Long exposure, glassy water, full-frame camera, 50mm lens, deep teal-black shadows, neutral highlights, restrained desaturated color with a single cyan-teal accent, fine film grain, quiet, solitary, slightly mysterious mood, no people, no boats, no buildings, no text, no watermark. Aspect ratio 16:9.
```

---

## 5. 生产顺序

1. **先锁风格（3 张样张）：** PH-11（深色风景）、PH-07（浅色中景环境，有人物）、PH-03（浅色近景特写）。这三张覆盖了 DARK / LIGHT 两种调性和远、中、近三种景别。每张出 4–8 张候选，挑出一组后，把它们作为后续所有图的风格参考图（模型支持参考图的话）。
2. **P0 批量：** PH-06 ~ PH-09、PH-12 ~ PH-17。同一行业的两张（如 PH-06 与 PH-12）连着生成，保证服装、材质、色调一致。
3. **上线一轮看效果，再做 P1 与 P2。**

## 6. 挑图检查表

每张入选前逐条过：

| # | 检查项 | 不通过的典型情况 |
|---|---|---|
| 1 | 人物自然 | 看镜头、摆姿势、表情夸张、皮肤像蜡像或磨皮过度、五官变形 |
| 2 | 人物不重复 | 不同照片里出现同一张脸（生图模型常见），会显得像同一个演员 |
| 3 | 没有可读文字或乱码 | 文件上、屏幕上、纸箱上出现假字 |
| 4 | 没有品牌标识 | 电脑背面、设备铭牌、杯子上有 Logo |
| 5 | 手部正常 | 多指、手指融合、握笔姿势怪 |
| 6 | 色调统一 | 偏紫、偏洋红、橙青对比过强、饱和度过高、肤色发灰发青 |
| 7 | 只有一个强调色 | 画面里出现第二种鲜艳颜色（PH-03 的红笔除外） |
| 8 | 留白位置正确 | 需要压文字或样机的区域里有主体或高光 |
| 9 | 不像图库 | 人在“表演”工作、构图太满、过度干净像 3D 渲染 |
| 10 | 系列感 | 和已选的样张放在一起，像同一位摄影师拍的 |

## 7. 后期与接入

- **统一调色：** 选定样张后做一个 LUT（按 §2.5 的色值），所有图过同一个 LUT，再逐张微调曝光；有人物的图单独保护肤色。
- **深色区块用图：** 边缘做到 `--ink-950` 的渐变遮罩；加 2.5–3% 单色颗粒，与光场一致；文字区背后的亮度要保证正文对比度 ≥ 4.5:1。
- **导出：** AVIF + WebP，每张出 1x / 2x 两档（例如 3:2 图出 1200 与 2400 宽），放在 `site/public/media/photo/`，文件名 `ph-07-proposal-table-1200.avif` 这类格式。全部懒加载（首屏不放照片）。
- **替代文字：** 每张写一句客观描述（如“会议桌上叠放着标书与参考资料”），不写“示意图”，不写客户名，不给人物编身份。
- **性能：** 单页新增图片总量控制在 600KB 以内（AVIF）。

## 8. 已确认的决定（2026-11-15）

1. **人物正常出镜。** 不刻意露脸，也不刻意回避；机位只按画面要讲的事来定。照片里的人不代表团队或客户（§1.2）。
2. **首页首屏不加照片背板。** 原 PH-01 取消，首屏维持光场 + 舞台样机。

## 9. 接入记录（2026-11-15）

素材来自 `assets/v5-photography/masters`，替代文字作为已批准文案登记在 `site/content/v4/copy-new.json` 的 `photo.ph-xx` 条目，由 `site/scripts/build-photos.mjs`（`npm run build:photos`）生成 480 / 800 / 1200 / 原生宽度四档 AVIF + WebP，输出到 `site/public/media/photo/`，清单在 `site/lib/photo-media.json`，编号与原图文件名的对应在 `site/content/v5/photos.json`。页面统一用 `components/v4/Photo.tsx`。

| 位置 | 用图 | 做法 |
|---|---|---|
| 首页 · 顾虑四问 | PH-02 ~ 05 | 暗色面板右侧舞台顶部 21:9 通栏大图，随选项卡交叉淡入；手机端 16:10 |
| 首页 · 四类场景 | PH-06 ~ 09 | 右栏顶部 16:9 大图，界面样机卡片压住照片下沿（现场 + 系统叠压），随选项卡交叉淡入；桌面端左侧选项卡吸顶 |
| 首页 · 合作方式 | PH-10 | 标题下 21:9 通栏 |
| 全站收尾区 | PH-11 | 叠在光场上（滤色混合），向文字一侧渐隐 |
| 方案详情 ×4 | PH-06 ~ 09 | “需要解决的日常问题”标题下 21:9 通栏 |
| 案例详情 ×6 | PH-12 ~ 17 | “项目背景”上方 3:2 |
| 技术页 | PH-18 | Cyano Core 介绍右侧 |
| 合作方式页 | PH-10、PH-20、PH-21 | 流程区三联图，图注为第 01 / 04 / 05 步名称 |
| 关于页 | PH-24、PH-22 | “名字的由来”与“我们怎么工作”上方通栏 |
| 联系页 | PH-23 | 左栏“谁会回复你”卡片上方 |
| 404 | PH-24 | 叠在光场海报上 |

PH-19（私有化部署）暂未使用：部署区两张卡片是对称的示意图，单边加照片会破坏对称。
