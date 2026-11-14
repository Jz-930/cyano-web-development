# v4 实施手册 · 03 设计 Token 与点缀（阶段 2）

> 本文件给出 `site/app/styles/v4/tokens.css`、`base.css`（排版部分）、`decor.css` 的完整内容与使用规则。直接复制，不改数值。
> 规则：v4 的所有 CSS 只能通过 `var(--…)` 使用颜色、阴影、圆角、时长；不允许直接写十六进制或 `rgba()`，**唯一例外**是本文件里定义 Token 的地方。

---

## 1. `v4/tokens.css` 全文

```css
:root{
  /* ---------- 基础色（与 v3 相同，不改） ---------- */
  --n0:#070b0f; --n1:#0b1117; --n2:#111a21; --n3:#18242d;
  --p0:#f3f6f7; --p1:#f8fafa; --p2:#ffffff; --p3:#e8eef0;
  --brand:#3898a8; --cyan:#38c8e0; --ice:#a5ecf5; --link:#0b6f80; --deep:#062f3a;
  --ink:#152b34; --muted:#52636b; --light:#e8fbfe; --on-dark:#b8cbd3;
  --amber:#f2b544; --amber-ink:#a65a06; --risk:#fb7185; --risk-ink:#be123c;
  --field-line:#6f8188;

  /* ---------- 透明度变体（点缀只能用这些） ---------- */
  --cyan-04:rgba(56,200,224,.04); --cyan-08:rgba(56,200,224,.08); --cyan-10:rgba(56,200,224,.10);
  --cyan-12:rgba(56,200,224,.12); --cyan-18:rgba(56,200,224,.18); --cyan-22:rgba(56,200,224,.22);
  --cyan-35:rgba(56,200,224,.35); --cyan-40:rgba(56,200,224,.40); --cyan-45:rgba(56,200,224,.45);
  --cyan-50:rgba(56,200,224,.50); --cyan-60:rgba(56,200,224,.60);
  --ice-25:rgba(165,236,245,.25);
  --white-04:rgba(255,255,255,.04); --white-06:rgba(255,255,255,.06); --white-08:rgba(255,255,255,.08); --white-10:rgba(255,255,255,.10);
  --frost-04:rgba(180,220,235,.04); --frost-07:rgba(180,220,235,.07); --frost-10:rgba(180,220,235,.10); --frost-15:rgba(180,220,235,.15);
  --ink-06:rgba(12,28,36,.06); --ink-08:rgba(12,28,36,.08); --ink-12:rgba(12,28,36,.12); --ink-20:rgba(21,43,52,.20); --ink-30:rgba(21,43,52,.30);
  --n0-70:rgba(7,11,15,.70); --n1-58:rgba(11,17,23,.58); --p0-72:rgba(243,246,247,.72);
  --amber-12:rgba(242,181,68,.12); --risk-12:rgba(251,113,133,.12);

  /* ---------- 线 ---------- */
  --line:var(--ink-12);          /* 纸面普通描边 */
  --line-soft:var(--ink-08);     /* 纸面分隔线 */
  --dark-line:var(--frost-15);   /* 暗区普通描边 */
  --dark-line-soft:var(--frost-10);
  --highlight:var(--white-08);   /* 玻璃描边 */

  /* ---------- 圆角 ---------- */
  --r-chip:999px; --r-control:8px; --r-card:14px; --r-window:18px; --r-panel:24px; --r-phone:40px;

  /* ---------- 间距（只用这些） ---------- */
  --sp-1:4px; --sp-2:8px; --sp-3:12px; --sp-4:16px; --sp-5:24px; --sp-6:32px; --sp-7:48px; --sp-8:64px; --sp-9:96px; --sp-10:128px;
  --section-y:clamp(64px,8.9vw,128px);   /* 区块上下内边距：390 宽 64px，1440 宽 128px */
  --stack-heading:clamp(32px,4.4vw,64px); /* 区块标题到内容的距离 */

  /* ---------- 阴影与层级 ---------- */
  --shadow:0 1px 2px var(--ink-06),0 8px 24px -12px rgba(12,28,36,.10);
  --shadow-hover:0 2px 4px var(--ink-06),0 16px 32px -12px rgba(12,28,36,.16);
  --shadow-window:0 24px 64px -24px rgba(3,6,7,.35);
  --glass-shadow:0 30px 80px -30px rgba(0,0,0,.70);
  --inner-highlight:inset 0 1px 0 var(--white-10);
  --focus-ring:0 0 0 3px var(--cyan-35);

  /* ---------- 发光（只表示状态） ---------- */
  --glow-state:0 0 0 1px var(--cyan-60),0 0 16px var(--cyan-35);
  --glow-button:0 0 0 1px var(--cyan-50),0 0 24px -4px var(--cyan-45);
  --glow-text:0 0 24px var(--ice-25);

  /* ---------- 字体 ---------- */
  --sans:var(--font-sans),"Noto Sans SC Subset","Noto Sans SC Fallback",sans-serif;
  --display:var(--font-display),"Noto Sans SC Subset","Noto Sans SC Fallback",sans-serif;
  --mono:var(--font-mono),var(--sans);

  /* ---------- 层级 z-index ---------- */
  --z-field:0; --z-content:1; --z-stage:2; --z-sticky:50; --z-header:100; --z-overlay:200; --z-toast:300;
}
```

---

## 2. 表面层级（什么底用什么色）

| 名称 | 背景 | 文字 | 次要文字 | 描边 | 用在哪 |
|---|---|---|---|---|---|
| 暗区页面底 | `--n0` | `--light` | `--on-dark` | `--dark-line` | 首屏、收尾区、页脚 |
| 暗面板 | `--n1` | `--light` | `--on-dark` | `--dark-line` | 嵌入暗面板、案例封面上半 |
| 样机窗口 | `--n2` | `--light` | `--on-dark` | `--dark-line` | 样机外框、技术页汇合小窗 |
| 暗区悬停 | `--n3` | — | — | — | 暗区列表项悬停、下拉项悬停 |
| 纸面页面底 | `--p0` | `--ink` | `--muted` | `--line` | 默认 |
| 纸面交替区 | `--p1` | `--ink` | `--muted` | `--line` | 原 `.mist` 区块 |
| 纸面卡片 | `--p2` | `--ink` | `--muted` | `--line` | 卡片、表格、样机内的白纸界面 |
| 纸面内嵌 | `--p3` | `--ink` | `--muted` | — | 卡内应对条、表头、输入框禁用态 |

**明暗编排规则**：同一页面暗区与纸面区交替，不连续出现两个全宽暗区（嵌入暗面板不算全宽暗区）。每页最多 1 个嵌入暗面板。首页的嵌入暗面板只有“四个工程问题”一个；案例区的暗色样机卡是卡片，不是面板。

---

## 3. 圆角使用表

| Token | 用在 |
|---|---|
| `--r-chip` | 标签、时间对比胶囊、徽标 |
| `--r-control` | 按钮、输入框、下拉项 |
| `--r-card` | 卡片、表格外框、指标小牌 |
| `--r-window` | 样机窗口 |
| `--r-panel` | 嵌入暗面板、首屏舞台外框、收尾卡 |
| `--r-phone` | 手机样机 |

---

## 4. 图层次序

所有带定位的新元素只用 `--z-*` Token。光场 `--z-field`，正文 `--z-content`，样机舞台 `--z-stage`，吸顶元素 `--z-sticky`，页头 `--z-header`，灯箱与对话框 `--z-overlay`。

---

## 5. 排版（写入 `v4/base.css`）

### 5.1 字号表

| 角色 | 英文（桌面 / 手机） | 中文（桌面 / 手机） | 字体 | 字重 | 行高 | 字距 |
|---|---|---|---|---|---|---|
| H1 首页 | 68 / 44px | 52 / 34px | `--display` | 英 300；中 400 | 英 1.06；中 1.3 | 英 -0.02em；中 0 |
| H1 内页 | 56 / 40px | 44 / 32px | `--display` | 英 300；中 400 | 英 1.1；中 1.32 | 英 -0.015em；中 0 |
| H2 | 44 / 32px | 36 / 28px | `--display` | 英 300；中 400 | 英 1.15；中 1.38 | 英 -0.01em；中 0 |
| H3 | 22 / 20px | 22 / 20px | `--sans` | 500 | 1.4 | 0 |
| 导语 `.lede` | 20 / 18px | 19 / 17px | `--sans` | 400 | 英 1.6；中 1.8 | 0 |
| 正文 | 17 / 16px | 16 / 16px | `--sans` | 400 | 英 1.7；中 1.85 | 0 |
| 小字 | 14px | 14px | `--sans` | 400 | 1.6 | 0 |
| 眉题 `.eyebrow` | 13px | 13px | `--mono` | 500 | 1.4 | 英 0.08em 大写；中 0.04em |
| 等宽标注 `.label` | 12px | 12px | `--mono` | 500 | 1.4 | 0.04em |
| 大号数字 `.figure` | 56 / 40px | 56 / 40px | `--display` | 300 | 1.05 | -0.02em，`font-variant-numeric:tabular-nums` |

**12px 只允许用于** `.label`（样机界面内的系统名、坐标、编号）与页脚版权行。正文、说明、按钮、表格、图注一律 ≥ 14px。

### 5.2 行长

英文正文 `max-width:68ch`，英文导语 `max-width:56ch`；中文正文 `max-width:38em`，中文导语 `max-width:32em`。标题不设字符宽度上限（断行由 `Phrase` 控制）。

### 5.3 段落与标题间距

- H2 下边距：`var(--sp-5)`；H2 与导语之间 `var(--sp-4)`；导语到内容 `var(--stack-heading)`。
- 段落之间：英文 `1em`，中文 `0.9em`。
- 卡片内：H3 与正文 `var(--sp-3)`；卡片内边距桌面 `var(--sp-6)`，手机 `var(--sp-5)`。

### 5.4 代码

```css
html{-webkit-text-size-adjust:100%;text-rendering:optimizeLegibility}
body{font:400 17px/1.7 var(--sans);color:var(--ink);background:var(--p0)}
:lang(zh-CN) body{font-size:16px;line-height:1.85}
h1,h2,h3{font-family:var(--display);color:inherit;margin:0}
h1,h2,.lede{text-wrap:balance}
.h1-home{font-size:clamp(44px,4.72vw,68px);font-weight:300;line-height:1.06;letter-spacing:-.02em}
:lang(zh-CN) .h1-home{font-size:clamp(34px,3.61vw,52px);font-weight:400;line-height:1.3;letter-spacing:0}
.h1-page{font-size:clamp(40px,3.89vw,56px);font-weight:300;line-height:1.1;letter-spacing:-.015em}
:lang(zh-CN) .h1-page{font-size:clamp(32px,3.06vw,44px);font-weight:400;line-height:1.32;letter-spacing:0}
.h2{font-size:clamp(32px,3.06vw,44px);font-weight:300;line-height:1.15;letter-spacing:-.01em}
:lang(zh-CN) .h2{font-size:clamp(28px,2.5vw,36px);font-weight:400;line-height:1.38;letter-spacing:0}
.h3{font:500 clamp(20px,1.53vw,22px)/1.4 var(--sans)}
.lede{font-size:clamp(18px,1.39vw,20px);line-height:1.6;max-width:56ch;color:var(--muted)}
:lang(zh-CN) .lede{font-size:clamp(17px,1.32vw,19px);line-height:1.8;max-width:32em}
.prose p{max-width:68ch}
:lang(zh-CN) .prose p{max-width:38em}
.small{font-size:14px;line-height:1.6}
.eyebrow{font:500 13px/1.4 var(--mono);letter-spacing:.08em;text-transform:uppercase;color:var(--link)}
:lang(zh-CN) .eyebrow{letter-spacing:.04em;text-transform:none}
.dark .eyebrow,.eyebrow.on-dark{color:var(--ice)}
.label{font:500 12px/1.4 var(--mono);letter-spacing:.04em;color:var(--muted)}
.dark .label{color:var(--on-dark)}
.figure{font:300 clamp(40px,3.89vw,56px)/1.05 var(--display);letter-spacing:-.02em;font-variant-numeric:tabular-nums}
.dark .figure{color:var(--ice)}
.dark{color:var(--light);background:var(--n0)}
.dark .lede,.dark p{color:var(--on-dark)}
```

现有组件中的 `h1`、`h2` 改为加上对应类名：首页 H1 加 `h1-home`，内页 H1 加 `h1-page`，所有区块标题 H2 加 `h2`，卡片标题 H3 加 `h3`。旧 CSS 中针对 `h1`、`h2`、`.section-heading h2`、`.page-hero h1`、`.hero-content h1` 的字号、字重、行高、字距声明在阶段 5 的死规则清理中删除；在此之前，新类名在 `v4-base` 层，已经覆盖旧规则。

---

## 6. 点缀总表与每屏上限

| 点缀 | 类名 | 每屏上限（一个视口高度内） | 绝对不能用在 |
|---|---|---|---|
| 磨砂玻璃 | `.glass`、`.glass-badge`、`.glass-header-dark`、`.glass-header-paper`、`.glass-scrim` | 3 块（页头算 1 块） | 纸面区里的卡片；没有光或内容透过的平底上；玻璃之上再叠玻璃 |
| 背景光晕 | `.halo-*` | 2 处光源（光场本身算 1 处） | 纸面区（只允许 `.halo-paper-leak`）；正文正后方使对比度 < 4.5:1 |
| 渐变描边 | `.edge-hero`、`.edge-closing`、`.edge-pointer` | 2 个 | 按钮背景；普通卡片 |
| 渐变竖线 | `.split-line` | 1 条 | — |
| 颗粒 | 光场 shader 内 + 海报烘焙 | — | 纸面区 |
| 景深 | `.depth-back` | 每个画面只分前、中、后三层 | 正文、按钮、链接、输入框 |
| 发光 | `--glow-state`、`--glow-button`、`--glow-text` | 3 个 | 纸面区；常态装饰 |
| 带光点分隔线 | `.rule-dot` | 2 条 | 卡片之间 |
| 工程纸点阵 | `.dot-grid` | — | 正文背后；与线网格同时出现 |
| 暗区线网格 | `.line-grid` | — | 纸面区；整页铺满 |

阶段 6 运行 `scripts/check-decor.mjs`（§14）验证上限。

---

## 7. 磨砂玻璃（`v4/decor.css`）

```css
.glass{background:var(--n1-58);-webkit-backdrop-filter:blur(20px) saturate(150%);backdrop-filter:blur(20px) saturate(150%);border:1px solid var(--white-08);box-shadow:var(--inner-highlight),var(--glass-shadow);border-radius:var(--r-panel)}
.glass-badge{background:var(--n1-58);-webkit-backdrop-filter:blur(16px) saturate(150%);backdrop-filter:blur(16px) saturate(150%);border:1px solid var(--white-08);box-shadow:var(--inner-highlight),0 16px 40px -16px rgba(0,0,0,.6);border-radius:var(--r-card);padding:var(--sp-3) var(--sp-4)}
.glass-header-dark{background:var(--n1-58);-webkit-backdrop-filter:blur(20px) saturate(150%);backdrop-filter:blur(20px) saturate(150%);border-bottom:1px solid var(--white-06)}
.glass-header-paper{background:var(--p0-72);-webkit-backdrop-filter:blur(16px) saturate(140%);backdrop-filter:blur(16px) saturate(140%);border-bottom:1px solid var(--ink-08)}
.glass-scrim{background:var(--n0-70);-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px)}
@supports not ((backdrop-filter:blur(1px)) or (-webkit-backdrop-filter:blur(1px))){
  .glass,.glass-badge,.glass-header-dark{background:var(--n1)}
  .glass-header-paper{background:var(--p0)}
  .glass-scrim{background:rgba(7,11,15,.88)}
}
```

**用在哪（全部位置，不多不少）**

| 位置 | 类 |
|---|---|
| 页头：页面顶部在暗区上方时 | `.glass-header-dark`（滚动切换规则见 `04` 文件 §3.3） |
| 页头：页面顶部在纸面区上方时（文章页、法律页、案例列表滚出首屏后） | `.glass-header-paper` |
| 首页首屏舞台外框 | `.glass` |
| 首页首屏“校验 / 引用”指标小牌、首屏证据条之外的浮动指标 | `.glass-badge` |
| 方案详情首屏指标条 | `.glass-badge` |
| 案例封面关键指标牌 | `.glass-badge` |
| 技术页首屏汇合点小窗 | `.glass` |
| 联系页首屏“回复时间轴”卡 | `.glass` |
| 引用溯源卡（S10，暗区内） | `.glass-badge` |
| 灯箱遮罩 | `.glass-scrim` |

---

## 8. 背景光晕

```css
.halo-host{position:relative;isolation:isolate}
.halo-stage::before{content:"";position:absolute;inset:-120px;z-index:-1;pointer-events:none;background:radial-gradient(60% 55% at 35% 70%,var(--cyan-10),transparent 70%);transform:scale(var(--breath,1));transition:transform 1200ms var(--ease-in-out)}
.halo-paper-leak{background-image:linear-gradient(180deg,var(--cyan-04),transparent 240px);background-repeat:no-repeat}
.halo-panel{position:relative;isolation:isolate;overflow:hidden}
.halo-panel::before{content:"";position:absolute;width:600px;height:400px;left:calc(var(--hx,75%) - 300px);top:calc(var(--hy,0%) - 200px);z-index:-1;pointer-events:none;background:radial-gradient(closest-side,var(--cyan-12),transparent)}
.halo-button{position:relative;isolation:isolate}
.halo-button::before{content:"";position:absolute;left:50%;top:50%;width:160px;height:160px;margin:-80px 0 0 -80px;border-radius:50%;z-index:-1;pointer-events:none;background:radial-gradient(closest-side,var(--cyan-18),transparent);transform:scale(1);transition:transform 240ms var(--ease-out)}
.halo-button:hover::before,.halo-button:focus-within::before{transform:scale(1.375)}
```

- **首屏右上主能量**由光场 shader 产生（`05` 文件 §1），不另加 CSS 光晕。
- `.halo-stage`：首页首屏舞台外层；S1 叙事播放时，脚本把 `--breath` 在 `1` 与 `1.03` 之间切换（每个叙事节拍一次，见 `08` 文件 S1）。
- `.halo-paper-leak`：每个纸面区的**第一个**区块（紧跟在暗区之后的那个）加这个类。
- `.halo-panel`：嵌入暗面板。指针跟随用 `components/v4/usePointerHalo.ts`：

```ts
"use client";
import { useEffect } from "react";
export function usePointerHalo(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current; if (!el) return;
    if (matchMedia("(prefers-reduced-motion: reduce), (pointer: coarse)").matches) return;
    let tx = 75, ty = 0, x = 75, y = 0, raf = 0, inside = false;
    const loop = () => { x += (tx - x) * 0.08; y += (ty - y) * 0.08;
      el.style.setProperty("--hx", x.toFixed(2) + "%"); el.style.setProperty("--hy", y.toFixed(2) + "%");
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.1 ? requestAnimationFrame(loop) : 0; };
    const move = (e: PointerEvent) => { const r = el.getBoundingClientRect(); inside = true;
      tx = ((e.clientX - r.left) / r.width) * 100; ty = ((e.clientY - r.top) / r.height) * 100; if (!raf) raf = requestAnimationFrame(loop); };
    const leave = () => { inside = false; tx = 75; ty = 0; if (!raf) raf = requestAnimationFrame(loop); };
    el.addEventListener("pointermove", move); el.addEventListener("pointerleave", leave);
    return () => { cancelAnimationFrame(raf); el.removeEventListener("pointermove", move); el.removeEventListener("pointerleave", leave); void inside; };
  }, [ref]);
}
```

- `.halo-button`：只用在收尾区的主按钮外层 `<span class="halo-button">`。

---

## 9. 渐变描边与渐变线

```css
.edge-hero,.edge-closing,.edge-pointer{position:relative}
.edge-hero::after,.edge-closing::after,.edge-pointer::after{content:"";position:absolute;inset:0;border-radius:inherit;padding:1px;pointer-events:none;
  -webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;
  mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);mask-composite:exclude}
.edge-hero::after{background:linear-gradient(135deg,var(--cyan-45) 0%,var(--white-08) 35%,var(--white-04) 100%)}
.edge-closing::after{background:linear-gradient(90deg,var(--white-06) 0%,var(--cyan-35) 70%,var(--white-06) 100%)}
.edge-pointer::after{background:radial-gradient(180px circle at var(--mx,50%) var(--my,50%),var(--cyan-50),var(--frost-10) 100%);opacity:0;transition:opacity 140ms var(--ease-out)}
.edge-pointer:hover::after{opacity:1}
.split-line{width:1px;align-self:stretch;background:linear-gradient(180deg,transparent 0%,var(--cyan-40) 50%,transparent 100%)}
```

| 类 | 用在哪 |
|---|---|
| `.edge-hero` | 首页首屏舞台外框（与 `.glass` 同一元素） |
| `.edge-closing` | 收尾卡 |
| `.edge-pointer` | 暗区里**可整卡点击**的卡片：案例封面卡（暗色上半）、技术页暗面板里的可点卡片；`--mx`、`--my` 由 `MotionRuntime` 写入（已有逻辑，F-15 已合帧） |
| `.split-line` | 首页“四个工程问题”分屏中线（K-02） |

三通道线的渐变流动段见 `05` 文件 §2，不在这里。

---

## 10. 颗粒

- 只在光场 shader 中实现：噪点强度从 `0.018` 提到 `0.028`（`05` 文件 §1.2 第 6 项）。
- 手机与减弱动效用的静态海报，生成时烘焙同样强度的单色噪点（`05` 文件 §1.5）。
- 纸面区不加任何颗粒纹理。

---

## 11. 景深与发光

```css
.depth-back{filter:blur(2px);opacity:.7;transform:scale(.96)}
.glow-state{box-shadow:var(--glow-state)}
.glow-number{text-shadow:var(--glow-text)}
```

- `.depth-back`：只用在首屏舞台后层来源卡（K-01）与案例封面后层（K-06）。悬停引用角标把来源卡“推近”时移除该类（过渡见 `08` 文件 S1）。
- `.glow-state`：生效的门禁节点（K-02）、三通道光点（`05` §2）、选中的来源项（K-01 来源栏）。只在状态成立时加类，状态结束移除。
- `--glow-button`：暗区主按钮悬停（`04` 文件 §3.1）。
- `.glow-number`：暗区里 ≥ 48px 的浅青数字（案例封面指标、案例详情首屏指标）。

---

## 12. 分隔线

```css
.rule{height:1px;border:0;background:var(--line-soft);margin:0}
.dark .rule{background:var(--dark-line-soft)}
.rule-dot{position:relative;height:1px;border:0;background:var(--line-soft);margin:0;overflow:visible}
.rule-dot::before{content:"";position:absolute;left:80px;top:-2px;width:5px;height:5px;border-radius:50%;background:var(--cyan)}
.rule-dot::after{content:"";position:absolute;left:80px;top:0;width:40px;height:1px;background:linear-gradient(90deg,transparent,var(--cyan),transparent);opacity:0;transform:translateX(0)}
html.js .rule-dot.is-in::after{animation:rule-run 900ms var(--ease-in-out) 1 forwards}
@keyframes rule-run{0%{opacity:1;transform:translateX(0)}90%{opacity:1}100%{opacity:0;transform:translateX(calc(100vw - 200px))}}
@media (prefers-reduced-motion:reduce){html.js .rule-dot.is-in::after{animation:none}}
```

`.is-in` 由滚动揭示观察器加上（`04` 文件 §3.15，同一个观察器，阈值 0.5，只加一次）。

**位置**：每个纸面页面最多 2 条 `.rule-dot`，放在下列位置（其余分隔用 `.rule`）：

| 页面 | 位置 |
|---|---|
| 首页 | “几种做法怎么选”区块之前；“团队”区块之前 |
| 方案详情 | “系统如何处理”之前 |
| 案例详情 | “界面实录”之前 |
| 技术页 | “支持的模型与系统”之前 |
| 合作方式 | “项目流程”之前 |
| 关于 | “我们怎么工作”之前 |

---

## 13. 点阵与线网格

```css
.dot-grid{background-image:radial-gradient(var(--ink-06) 1px,transparent 1.2px);background-size:24px 24px;background-position:center;
  -webkit-mask-image:radial-gradient(ellipse 80% 80% at 50% 50%,#000 60%,transparent 100%);mask-image:radial-gradient(ellipse 80% 80% at 50% 50%,#000 60%,transparent 100%)}
.line-grid{position:relative;isolation:isolate}
.line-grid::before{content:"";position:absolute;inset:0;z-index:-1;pointer-events:none;
  background-image:linear-gradient(var(--frost-04) 1px,transparent 1px),linear-gradient(90deg,var(--frost-04) 1px,transparent 1px);background-size:48px 48px}
.line-grid::after{content:"";position:absolute;inset:0;z-index:-1;pointer-events:none;
  background-image:linear-gradient(var(--frost-07) 1px,transparent 1px),linear-gradient(90deg,var(--frost-07) 1px,transparent 1px);background-size:48px 48px;
  -webkit-mask-image:radial-gradient(40% 50% at var(--gx,75%) var(--gy,40%),#000,transparent);mask-image:radial-gradient(40% 50% at var(--gx,75%) var(--gy,40%),#000,transparent)}
```

- `.dot-grid`：放在**样机或图解所在的容器**上（不是整个区块）：首页方案区样机容器（K-03）、方案总览样机侧（K-04）、技术页四层架构图容器（K-09）、关于页责任矩阵卡（K-10）、案例详情“前后对比 + 处理步骤”卡。
- `.line-grid`：技术页首屏（K-08，`--gx:70%;--gy:50%` 与光场汇合点对齐）、首页“四个工程问题”暗面板（K-02）。

---

## 14. 上限检查脚本 `site/scripts/check-decor.mjs`

Playwright 打开全部页面（1440×900），从页面顶部开始每次滚动 900px，每个视口统计**与视口相交**的元素数量：

| 选择器 | 上限 |
|---|---|
| `.glass, .glass-badge, .glass-header-dark, .glass-header-paper` | 3 |
| `.edge-hero, .edge-closing` 加上处于 `:hover` 的 `.edge-pointer` | 2 |
| `.glow-state` 加上计算样式含 `text-shadow` 的 `.glow-number` | 3 |
| `.halo-stage, .halo-panel, .halo-button` 加上 `.light-field` | 2 |
| `.rule-dot` | 2 |
| 同一视口内同时存在 `.dot-grid` 与 `.line-grid` | 不允许 |

另外检查：`.glass*` 元素的父级链中不能再有 `.glass*`；纸面区（祖先没有 `.dark` 且背景为 P0–P3）内不能出现 `.glass`、`.glow-state`、`.halo-stage`、`.line-grid`。

输出超限的页面、滚动位置与元素选择器。**输出必须为 0 条。**
