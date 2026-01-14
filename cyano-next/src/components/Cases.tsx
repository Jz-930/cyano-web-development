"use client";

import { useReveal } from "@/hooks/useReveal";

const Cases = () => {
    useReveal();

    return (
        <section id="cases" className="section-padding overflow-hidden">
            <div className="container">
                {/* Section Header */}
                <div className="text-center mb-[120px] reveal">
                    <h2 className="mb-6">
                        落地场景
                    </h2>
                    <p className="text-[1.2rem] max-w-2xl mx-auto">
                        已在金融、法务、IT 运维等领域验证的实际效能
                    </p>
                </div>

                {/* Case 1: 智能标书与方案生成 */}
                <div className="case-item reveal grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center mb-[200px]">
                    <div className="ui-visual">
                        <div className="ui-window bg-bg-card border-border-light shadow-2xl">
                            <div className="ui-topbar bg-bg-card-hover border-b border-border-light">
                                <div className="dot opacity-50"></div>
                            </div>
                            <div className="ui-content">
                                <div className="sk-sidebar border-r border-border-light">
                                    <div className="sk-icon opacity-30"></div>
                                    <div className="sk-icon opacity-30"></div>
                                </div>
                                <div className="sk-main">
                                    <div className="highlight-bar mb-4">
                                        <span>&gt; Generating Proposal...</span>
                                        <span>99% Match</span>
                                    </div>
                                    <div className="sk-box mb-4 opacity-50"></div>
                                    <div className="sk-line mb-3 opacity-30"></div>
                                    <div className="sk-line mb-3 opacity-30"></div>
                                    <div className="sk-line short opacity-30"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="case-info">
                        <span className="case-tag">文档自动化</span>
                        <h3 className="text-[2.5rem] mb-6 font-heading font-semibold text-white">
                            智能标书与方案生成
                        </h3>
                        <p className="mb-10 font-light text-text-muted leading-relaxed">
                            痛点：历史标书分散，撰写技术方案耗时，且易遗漏参数。<br />
                            方案：构建专用知识库，RAG 引擎自动提取相似条款，Agent 自动填充参数。
                        </p>
                        <div className="stats-grid border-t border-border-light pt-8">
                            <div className="stat">
                                <h4 className="text-4xl">15min</h4>
                                <span>生成初稿</span>
                            </div>
                            <div className="stat">
                                <h4 className="text-4xl text-accent-cyan">99%</h4>
                                <span>引用准确率</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Case 2: 合同风险智能审查 */}
                <div className="case-item reveal grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center mb-[200px]">
                    <div className="case-info order-2 lg:order-1">
                        <span className="case-tag">合规风控</span>
                        <h3 className="text-[2.5rem] mb-6 font-heading font-semibold text-white">
                            合同风险智能审查
                        </h3>
                        <p className="mb-10 font-light text-text-muted leading-relaxed">
                            痛点：人工审核大量合同耗时费力，标准不一，易漏看风险条款。<br />
                            方案：将《合规手册》转化为校验链，自动标记风险并给出修改建议。
                        </p>
                        <div className="stats-grid border-t border-border-light pt-8">
                            <div className="stat">
                                <h4 className="text-4xl text-accent-cyan">100%</h4>
                                <span>风险覆盖</span>
                            </div>
                            <div className="stat">
                                <h4 className="text-4xl">5x</h4>
                                <span>效率提升</span>
                            </div>
                        </div>
                    </div>
                    <div className="ui-visual order-1 lg:order-2">
                        <div className="ui-window bg-bg-card border-border-light shadow-2xl">
                            <div className="ui-topbar bg-bg-card-hover border-b border-border-light">
                                <div className="dot opacity-50"></div>
                            </div>
                            <div className="ui-content">
                                <div className="sk-sidebar border-r border-border-light">
                                    <div className="sk-icon opacity-30"></div>
                                </div>
                                <div className="sk-main">
                                    <div className="sk-line mb-4 opacity-30"></div>
                                    <div className="sk-line short mb-4" style={{ background: "rgba(255, 77, 79, 0.2)" }}></div>
                                    <div className="sk-line mb-4 opacity-30"></div>
                                    <div className="sk-line mb-4 opacity-30"></div>
                                    <div className="risk-alert mt-auto">
                                        <i className="fas fa-exclamation-triangle"></i>
                                        Risk Detected: Liability Clause missing...
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Case 3: 内部智能 IT 助手 */}
                <div className="case-item reveal grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center mb-[200px]">
                    <div className="ui-visual">
                        <div className="ui-window bg-bg-card border-border-light shadow-2xl">
                            <div className="ui-topbar bg-bg-card-hover border-b border-border-light">
                                <div className="dot opacity-50"></div>
                            </div>
                            <div className="ui-content flex flex-col justify-end gap-6 bg-[url('/grid.svg')] bg-cover opacity-80">
                                <div className="chat-bubble user self-end bg-white/10 text-white border border-white/5 shadow-lg backdrop-blur-sm">
                                    如何配置内网 VPN？
                                </div>
                                <div className="chat-bubble ai self-start">
                                    根据《IT 运维手册 v3.0》P.42，请按照以下步骤操作：<br />
                                    1. 下载 Cert.p12 证书...
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="case-info">
                        <span className="case-tag">企业 Wiki</span>
                        <h3 className="text-[2.5rem] mb-6 font-heading font-semibold text-white">
                            内部智能 IT 助手
                        </h3>
                        <p className="mb-10 font-light text-text-muted leading-relaxed">
                            痛点：内部工单积压，员工重复回答相同问题，知识库更新滞后。<br />
                            方案：接入内网 Wiki，7x24 小时自动处理常见咨询，无法回答时转接人工。
                        </p>
                        <div className="stats-grid border-t border-border-light pt-8">
                            <div className="stat">
                                <h4 className="text-4xl text-accent-cyan">80%</h4>
                                <span>拦截工单</span>
                            </div>
                            <div className="stat">
                                <h4 className="text-4xl">&lt;3s</h4>
                                <span>响应时间</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Case 4: 自然语言业务数据查询 (Coming Soon) */}
                <div className="case-item reveal grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                    <div className="case-info order-2 lg:order-1">
                        <span className="case-tag">数据查询</span>
                        <h3 className="text-[2.5rem] mb-6 font-heading font-semibold text-white">
                            自然语言业务数据查询
                        </h3>
                        <p className="mb-8 font-light text-text-muted leading-relaxed">
                            痛点：业务人员不懂 SQL，查询复杂库存/销量数据需依赖 IT 部门导数。<br />
                            方案：Text-to-SQL 智能体，允许业务人员用自然语言直接与数据库交互。
                        </p>
                    </div>
                    <div className="ui-visual order-1 lg:order-2">
                        <div className="ui-window flex items-center justify-center border-dashed border-2 border-white/10 bg-transparent opacity-60 hover:opacity-100 transition-opacity">
                            <span className="font-heading tracking-widest text-text-muted text-lg">DATA AGENT COMING SOON</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Cases;
