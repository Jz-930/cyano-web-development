# 网站公开文案修复记录

修改日期：2026-06-13

本次已将站内不适合公开的构建阶段文案改为更商业、专业、面向客户价值的表达。处理范围包括：
- 根目录静态页：`index.html`
- Next 站点页面与组件：`cyano-next/src/app/**`、`cyano-next/src/components/**`
- 图像说明、图注、SEO description、页面主文案、未挂载但存在复用风险的组件文案

## 已完成修改

| 位置 | 原文 | 修改后 |
| --- | --- | --- |
| `cyano-next/src/app/cases/page.tsx` metadata description | `Cyano 项目、产品演示和落地场景展示页，使用 AI 数据模型互动视觉承接现有项目介绍、截图、视频和交互演示位置。` | `Cyano 项目展示页，集中呈现销售咨询、文档自动化、房屋管理、企业知识库、数据查询与创意写作等 AI 产品落地成果。` |
| `cyano-next/src/app/cases/page.tsx` Hero accent | `统一沉淀在这里` | `集中展示落地价值` |
| `cyano-next/src/app/cases/page.tsx` Hero description | `这页为已有产品介绍和演示素材预留结构，同时完整保留原有落地场景。后续只需要把截图、视频、说明和交互入口补进对应卡片。` | `每个案例都围绕业务痛点、AI 工作流、系统界面和可衡量价值展开，帮助你判断 Cyano 如何把模型能力转化为可上线、可维护的企业产品。` |
| `cyano-next/src/components/HomeCasesPreview.tsx` 项目状态 | `演示整理中` | `销售咨询 AI` |
| `cyano-next/src/components/HomeCasesPreview.tsx` 销售素材项目说明 | `为精准获客、客户画像和一客一稿销售内容预留产品介绍与演示入口。` | `基于真实产品资料、客户画像和历史案例，帮助销售团队完成专业咨询、需求收束和一客一稿触达。` |
| `cyano-next/src/components/HomeCasesPreview.tsx` 项目状态 | `项目位预留` | `文档自动化` |
| `cyano-next/src/components/HomeCasesPreview.tsx` 标书项目说明 | `保留文档自动化、知识库引用和方案生成类项目的展示位置。` | `连接历史标书、知识库和项目参数，生成可编辑的方案初稿，让文档生产从经验驱动变成流程化交付。` |
| `cyano-next/src/components/HomeCasesPreview.tsx` 项目状态 | `内部演示` | `企业知识库` |
| `cyano-next/src/components/HomeCasesPreview.tsx` 知识库项目说明 | `为内部问答、IT 助手、知识库检索和工单拦截类演示留好内容位。` | `接入企业 Wiki、SOP 和工单系统，自动回答员工问题并保留引用依据，降低重复支持成本。` |
| `cyano-next/src/components/HomeCasesPreview.tsx` 区块说明 | `对LLM进行调整，规划完全适合您现有工作流的高效管线，并封装成易用、稳定的软件落地，让AI，真的能够接手现有工作。` | `围绕客户现有数据、知识库和工作流定制 AI 管线，并封装成易用、稳定的软件产品，让 AI 真正接入销售、文档、运营和内部支持等关键流程。` |
| `cyano-next/src/components/HomeCasesPreview.tsx` CTA 说明 | `不同行业千变万化，但人类的思考总有迹可循，来查看更多案例展示` | `查看更多真实界面与业务场景，了解 Cyano 如何把 AI 能力落到具体流程。` |
| `cyano-next/src/components/MediaFrame.tsx` 默认图注 | `后续替换为实际截图 / 客户场景图` | `业务流程与系统能力示意图` |
| `cyano-next/src/components/ProcessTimeline.tsx` 图片 alt | `合作流程视觉占位图` | `Cyano 合作流程示意图` |
| `cyano-next/src/components/ProcessTimeline.tsx` 图片 label | `流程图占位` | `合作流程图` |
| `cyano-next/src/components/TechnicalProof.tsx` 图片 alt | `Cyano 技术保障视觉占位图` | `Cyano 技术保障架构示意图` |
| `cyano-next/src/components/TechnicalProof.tsx` 图片 label | `技术保障图占位` | `技术保障架构` |
| `cyano-next/src/components/ContactOptions.tsx` 项目展示说明 | `适合想看现有项目、产品介绍、截图、录屏或交互演示的客户。后续项目素材会统一沉淀在项目展示页。` | `适合想了解已有项目、产品界面、演示入口和落地场景的客户，先从真实案例判断匹配度。` |
| `cyano-next/src/components/OpportunitySection.tsx` 图片 alt | ``${group.title}视觉占位图`` | ``${group.title}能力示意图`` |
| `cyano-next/src/components/EngagementModels.tsx` 图片 alt | `三种合作方式视觉占位图` | `三种合作方式示意图` |
| `cyano-next/src/components/Cases.tsx` 无 caption 时的图片 alt fallback | ``item.caption ? `${item.title}实际界面截图` : `${item.title}视觉占位图` `` | ``item.caption ? `${item.title}实际界面截图` : `${item.title}场景示意图` `` |
| `cyano-next/src/components/HomeServicesPreview.tsx` 服务页说明 | `详细的“两类 AI 机会、三种合作方式、五步合作流程”都保留在服务页。` | `你可以在服务页查看完整的机会诊断、合作模式和交付流程。` |
| `index.html` 数据查询案例视觉文字 | `DATA AGENT COMING SOON` | `NATURAL LANGUAGE DATA QUERY` |
| `index.html` 联系区标题 | `Ready to upgrade?` | `准备开始一次 AI 业务升级？` |
| `index.html` 表单下拉默认项 | `感兴趣的场景...` | `请选择感兴趣的场景` |

## 未挂载组件的风险清理

`cyano-next/src/components/ProjectShowcase.tsx` 当前没有被页面引用，但此前保留了较多“占位、预留、后续替换”类源码残留。本次已一并改为正式公开文案，避免后续复用时误带到页面上。

| 位置 | 原文 | 修改后 |
| --- | --- | --- |
| `ProjectShowcase.tsx` 项目状态 | `演示整理中` | `销售咨询 AI` |
| `ProjectShowcase.tsx` 项目状态 | `项目位预留` | `文档自动化` |
| `ProjectShowcase.tsx` 项目状态 | `内部演示` | `企业知识库` |
| `ProjectShowcase.tsx` 材料卡标题 | `产品截图位` | `产品界面展示` |
| `ProjectShowcase.tsx` 材料卡说明 | `用于放置真实界面截图、任务面板、结果页或后台控制台。` | `通过系统界面、任务面板和结果页，直观看到 AI 如何接入真实业务流程。` |
| `ProjectShowcase.tsx` 材料卡状态 | `素材待整理` | `界面展示` |
| `ProjectShowcase.tsx` 材料卡标题 | `视频讲解位` | `流程演示` |
| `ProjectShowcase.tsx` 材料卡说明 | `用于承接录屏、短视频、流程讲解或客户演示版本。` | `用录屏、讲解和客户演示串联输入、处理、审核和交付结果，降低理解成本。` |
| `ProjectShowcase.tsx` 材料卡状态 | `可后续接入` | `演示入口` |
| `ProjectShowcase.tsx` 材料卡标题 | `交互演示位` | `交互体验` |
| `ProjectShowcase.tsx` 材料卡说明 | `用于未来嵌入可点击演示、表单模拟器或公开体验入口。` | `通过可点击演示、表单模拟器或体验入口，让客户更快判断场景是否适合自身业务。` |
| `ProjectShowcase.tsx` 材料卡状态 | `结构已预留` | `体验入口` |
| `ProjectShowcase.tsx` 区块标题 | `已有项目先占位，后续替换成真实素材` | `项目能力展示，覆盖真实业务场景` |
| `ProjectShowcase.tsx` 区块说明 | `这里的卡片字段已经按项目展示设计好：项目名称、价值、适用场景、素材状态、截图/视频位和核心能力标签都可以逐步补齐。` | `每个项目围绕业务价值、适用场景、核心能力和交付形态展开，帮助客户快速判断 Cyano 的 AI 产品是否匹配自己的业务问题。` |
| `ProjectShowcase.tsx` 图片 alt | ``${project.title}项目视觉占位图`` | ``${project.title}项目场景图`` |
| `ProjectShowcase.tsx` 图片 label | ``${project.status} / Project Slot`` | ``${project.status} / Project Overview`` |
| `ProjectShowcase.tsx` 材料区标题 | `演示素材入口先留好` | `按场景查看项目材料` |
| `ProjectShowcase.tsx` 材料区说明 | `下一步整理产品截图、录屏或交互演示时，直接替换这些卡片，不需要重新规划页面。` | `项目材料围绕界面截图、流程说明和演示入口组织，方便客户快速理解系统形态、交付边界和业务收益。` |
| `ProjectShowcase.tsx` 底部说明 | `当前页面先保留结构，后续每新增一个项目，只需要填项目卡片字段或扩展为单独详情页。` | `如果你希望了解某类场景是否适合自己的业务，可以联系我们进行一次业务诊断。` |

## 复查结果

已用关键词复扫以下范围：
- `index.html`
- `cyano-next/src/**`
- `cyano-next/public/**`，排除第三方 vendor

复扫未再发现这些公开风险词：`占位`、`预留`、`后续替换`、`素材待整理`、`内容位`、`COMING SOON`、`Project Slot`、`视觉占位图`。

唯一仍匹配到 `后续` 的位置是 `cyano-next/src/components/ContactOptions.tsx` 里的 `后续维护责任`，该处是正常业务语义，不属于构建笔记。

## 验证记录

- 已通过：`./node_modules/.bin/eslint`
- 已通过：`./node_modules/.bin/tsc --noEmit`
- 未完成：本地 Next dev server 页面验证。`127.0.0.1:3000` 已被占用，改用 `127.0.0.1:3001` 后，Next 启动被当前环境中的 SWC 原生模块代码签名问题拦截：`Failed to load SWC binary for darwin/arm64`。该问题与本次文案修改无关。
