# 数字依据登记（内部）

## v1-final-content
- authority: `b9dcf94`，进入 v2 前最后定稿的完整 v1 快照；用户于 2026-11-13 明确要求恢复该版内容。
- inventory: `content/numeric-register-v3.json` 逐页登记 v1 已渲染文本中含数字的全部片段；构建时从锁定的 `site/content/v1/rendered-baseline.json` 生成。
- interpretation: 案例、团队、周期、文章日期等指标继续按下方各原始 sourceId 的口径解释；此登记只证明文案出处，不宣称第三方实测。页序号、日期、Demo 中的操作数字也纳入清单。
- exceptions: 按已批准的 v3 计划不展示 10× 投入回报；表单不再自动发送回执，因此成功文案删除“确认邮件已发送”。法律正文不变。

## latency-illustration-v3
- value: 图表轮次 1 / 10 / 25 / 50 / 75 / 100；原始上下文延迟 265 / 510 / 930 / 1615 / 2300 / 2990 ms；Cyano Core 148 / 164 / 181 / 181 / 181 / 181 ms。
- derivation: `site/content/latency-illustration.json`，仅为交互示意，非内部基准或客户测量值。
- presentation: 曲线、圆点、滑块读数使用同一数据及线性插值；图表紧邻说明“不是内部基准测试结果，也不代表项目性能承诺”。

本地预览依据用户提供的《Cyano官网重建方案.md》§0.3、§6.7 与附录 D。未把来源声明包装成第三方验证。

## team-experience
- value: 6+ 年；100% AI 模型研发；100% 世界 500 强经历；6 个落地行业。
- derivation: 用户方案 §0.3 项目事实表及 D.2、D.7。
- salesAnswer: 指每位核心成员的最低开发年限，以及核心成员拥有相关经历的比例；不是公司成立年限或客户数量。

## case-sales-consultant-ai
- value: 7×24、秒级、一客一稿；8 周。
- derivation: 方案 §6.7；现站 LNPE 智能工程顾问页面与公开 Demo；系统设计能力和项目周期。
- salesAnswer: 指该系统的持续咨询能力、资料检索与个性化材料生成，不是所有客户项目的保证值。

## case-proposal-generation
- value: 2 天 → 15 分钟、99%、7 项；10 周。
- derivation: 方案 §6.7 说明 15 分钟与99%来自现站公开数据；7 项来自在线 Demo 完整性清单。
- salesAnswer: 15 分钟指可编辑、待人工复核的初稿；99%为该项目引用准确率，不代表所有生成内容准确率。

## case-it-knowledge-assistant
- value: 80%、<3s、7×24；试点4周、全面上线8周。
- derivation: 方案 §6.7 与现站 Enterprise Wiki 实际界面已公开数据。
- salesAnswer: 80%指该案例常见工单自动拦截比例，响应速度为该项目平均值，具体新项目另设验收。

## case-nl-data-query
- value: 0 行 SQL、秒级、自然语言；6 周。
- derivation: 方案 §6.7 系统设计能力。
- salesAnswer: 业务人员不必手写SQL；实际查询耗时受数据库、查询复杂度和数据量影响。

## case-property-management
- value: 自动、多渠道、一目了然；8 周。
- derivation: 方案 §6.7 AlphaHouse 系统设计能力。
- salesAnswer: 指费用提取、沟通归集与按物业展示收支的功能，不表示投资回报保证。

## case-writing-memory-engine
- value: 百万字级、多分支、多模型；10 周。
- derivation: 方案 §6.7 记忆层设计容量及能力范围。
- salesAnswer: 百万字级为记忆管理设计容量，不等同于每次模型调用输入百万字。

## core-benchmarks
- value: <200ms、100%、最多40%、4级记忆分层。
- derivation: 用户方案 §0.3、§5.7、D.6 内部基准数据与上下文估值引擎四级分层设计（核心指令、关键状态、推理摘要、故障根因）。按 updating-plan D-3 建议，“最高10倍回报”仅留作线下沟通参考，不在技术页展示。
- salesAnswer: <200ms、100%召回与最多40%成本降低均为100轮长对话内部基准测试条件下的数据，不是所有业务任务的端到端延迟承诺；四级分层为上下文估值引擎架构设计。

## engagement-timing
- value: 1周诊断、2–6周试点、6–12周定制、2周首批托管结果、1个工作日响应、30–45分钟沟通。
- derivation: 用户方案 §0.3、D.4、D.8。
- salesAnswer: 为典型安排；具体范围与时间以诊断和双方协议为准。

## interactive-dataset
- value: 数据查询体验中的销售额、库存、周转与增幅。
- derivation: 为本地交互演示编排的非客户数据，保存在 site/content/query-demo.json，不作为公司业绩指标。
- salesAnswer: 用于展示提问与结果的对应关系，完整实际系统可预约演示。

## editorial-dates
- value: 2026-11-10、2026-11-03、2026-10-27。
- derivation: 按方案 D.9 要求，以本地预览日期 2026-11-12 倒排 2、9、16 天。
- salesAnswer: 当前为预览编排日期；正式发布前以实际发布日期复核。

## owner-service-facts
- value: 核心成员均参与过 AI 模型研发，并在多个行业交付过企业 AI 系统；提供配套培训；分阶段上线，每个环节等员工用熟、按反馈打磨后再推进下一步，不一次性推翻现有工作流程；服务跟进到项目落地。
- derivation: 负责人于 2026-11-14 提供（v4 文案对照稿 H-4r7、E-5a8、E-5a9）。
- salesAnswer: 描述服务方式，不含数字，不构成交付周期或效果承诺；培训的具体形式按项目约定。
