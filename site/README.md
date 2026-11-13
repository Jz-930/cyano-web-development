# Cyano 本地官网

Next.js 16 App Router · React 19 · TypeScript · Tailwind CSS 4 · next-intl。

## 启动

```powershell
cd 'F:\2026-11-10-Cyano Website Rebuild\site'
npm install
npm run dev
```

中文：http://localhost:3000/；英文：http://localhost:3000/en。

```powershell
npm run typecheck
npm run build
node scripts/smoke.mjs
```

生产构建前检查全部案例截图、邮箱 MX 与三个在线 Demo；链接不可用时隐藏对应入口。构建后扫描公开页面文字。

## 内容与素材

- `content/copy.json`：从方案附录 D 提取的中英文文案。
- `content/cases.json`：六个项目与31张原始界面路径。
- `content/articles.json`：三篇中英文文章。
- `content/founders.json`：角色、经历与介绍。
- `content/query-demo.json`：六类数据查询体验结果与只读 SQL。
- `public/media/`：保留原路径的旧站项目资源。
- `public/art/team.webp`、`portraits.webp`：四位戴眼镜的团队插画。
- `public/fonts/`：自托管字体，`noto-sc-subset.woff2` 为实际使用汉字子集。

当前视觉按用户最新指示采用真实业务系统界面与工程架构，取消岛屿、海洋等地理隐喻。生成源图和提示词记录见项目根目录 `assets/manifest.json`。

## 联系表单

复制 `.env.example` 为 `.env.local`，在本地填写 `RESEND_API_KEY`、`LEAD_INBOX`、`LEAD_FROM` 才能发送邮件。未配置时返回明确失败状态，不显示虚假的成功提示，也不保存个人资料。

当前版本是本地视觉与交互预览；未执行正式部署、域名切换、外部监控、跨邮箱送达验收。完整版案例 PDF、操作视频、外部 CRM/数据库存档尚未接入。上线差异见 `../docs/local-preview-status.md`。
