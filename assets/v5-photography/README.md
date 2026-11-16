# Cyano v5 摄影素材

按 `docs/v5-photography-plan.md` 生成 PH-02 至 PH-24，共 23 张选用候选；PH-01 已取消。使用真实摄影 skill 与内置 image_gen，共生成 36 张，含三类风格样张各 4 张及 4 次定向返工（含 PH-02 重新选角）。尚待用户审美确认。

- `masters/`：23 张原生 PNG，优先使用。
- `web/avif/`、`web/webp/`：同尺寸压缩副本，各 23 张。
- `candidates/`：13 张未选样张或已弃用版本。
- `manifest.csv`：编号、描述、实际尺寸、文件路径、替代文字与哈希。
- `manifest.json`：另含每张选用图的实际提示词；`generation-records.json` 留存全部生成记录。

图片为生成的行业场景，不代表 Cyano 团队、真实客户或项目现场纪实。网页、代码和 site/public 均未修改。

尺寸使用工具返回的原生分辨率；未插值放大为方案中的 1600/2400/2880/3360 档，也未虚标 2x。AVIF/WebP 未裁切、未加网页遮罩，未叠加额外 LUT 或颗粒；人物肤色与场景光线保留。

| 编号 | 内容 | 原生尺寸 | PNG |
|---|---|---|---|
| PH-02 | 顾虑四问 ·「找不到」 | 1448 × 1086 | [查看](masters/ph-02-filing-cabinet.png) |
| PH-03 | 顾虑四问 ·「说不准」 | 1448 × 1086 | [查看](masters/ph-03-version-review.png) |
| PH-04 | 顾虑四问 ·「不敢交」 | 1448 × 1086 | [查看](masters/ph-04-approval-check.png) |
| PH-05 | 顾虑四问 ·「各用各」 | 1448 × 1086 | [查看](masters/ph-05-separate-workspaces.png) |
| PH-06 | 销售与客户咨询 AI · 设备展厅里的销售工程师 | 1536 × 1024 | [查看](masters/ph-06-equipment-consultation.png) |
| PH-07 | 文档、标书与方案自动化 · 投标会议桌 | 1536 × 1024 | [查看](masters/ph-07-proposal-table.png) |
| PH-08 | 企业知识库与内部助手 · 新员工第一周 | 1536 × 1024 | [查看](masters/ph-08-employee-onboarding.png) |
| PH-09 | 业务数据查询与分析 · 仓储通道 | 1536 × 1024 | [查看](masters/ph-09-warehouse-aisle.png) |
| PH-10 | 诊断工作坊 · 白板上的流程 | 1672 × 941 | [查看](masters/ph-10-diagnostic-workshop.png) |
| PH-11 | 澜 · 屿 · 蓝调时刻的海与岛 | 1914 × 822 | [查看](masters/ph-11-sea-and-islets.png) |
| PH-12 | 案例 · 工程与制造（销售顾问 AI） | 1536 × 1024 | [查看](masters/ph-12-engineering-desk.png) |
| PH-13 | 案例 · 专业服务与投研（方案初稿 2 天 → 15 分钟） | 1536 × 1024 | [查看](masters/ph-13-late-research.png) |
| PH-14 | 案例 · 企业服务（IT 知识库，80% 常见咨询由 AI 处理） | 1536 × 1024 | [查看](masters/ph-14-it-service-desk.png) |
| PH-15 | 案例 · 零售与供应链（业务人员直接提问查库存与销量） | 1536 × 1024 | [查看](masters/ph-15-stockroom-tablet.png) |
| PH-16 | 案例 · 房地产与物业（从沟通记录提取费用，按房产整理收支） | 1536 × 1024 | [查看](masters/ph-16-property-receipts.png) |
| PH-17 | 案例 · 内容与传媒（管理百万字长篇的人物设定与剧情分支） | 1536 × 1024 | [查看](masters/ph-17-story-branches.png) |
| PH-18 | 技术页 · 工程现场 | 1672 × 941 | [查看](masters/ph-18-engineering-night.png) |
| PH-19 | 合作方式页 · 私有化部署 | 1448 × 1086 | [查看](masters/ph-19-locked-cabinet.png) |
| PH-20 | 合作方式页 · 试点验收 | 1536 × 1024 | [查看](masters/ph-20-pilot-acceptance.png) |
| PH-21 | 合作方式页 · 托管式服务「长期负责」 | 1536 × 1024 | [查看](masters/ph-21-dawn-monitoring.png) |
| PH-22 | 关于页 · 先诊断，再交付 | 1536 × 1024 | [查看](masters/ph-22-architecture-review.png) |
| PH-23 | 联系页 · 一个工作日内回复 | 1122 × 1402 | [查看](masters/ph-23-contact-desk.png) |
| PH-24 | 404 · 雾中孤屿 | 1672 × 941 | [查看](masters/ph-24-mist-islet.png) |
