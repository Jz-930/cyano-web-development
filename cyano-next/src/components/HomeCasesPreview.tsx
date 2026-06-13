import Link from "next/link";

const previewProjects = [
    {
        status: "销售咨询 AI",
        title: "个性化销售素材生成",
        body: "基于真实产品资料、客户画像和历史案例，帮助销售团队完成专业咨询、需求收束和一客一稿触达。",
        tags: ["精准获客", "销售内容", "一客一稿"],
        dot: "accent-dot accent-dot--amber",
    },
    {
        status: "文档自动化",
        title: "智能标书与方案生成",
        body: "连接历史标书、知识库和项目参数，生成可编辑的方案初稿，让文档生产从经验驱动变成流程化交付。",
        tags: ["文档自动化", "RAG", "方案生成"],
        dot: "accent-dot",
    },
    {
        status: "企业知识库",
        title: "企业知识库 AI 助手",
        body: "接入企业 Wiki、SOP 和工单系统，自动回答员工问题并保留引用依据，降低重复支持成本。",
        tags: ["企业 Wiki", "IT 助手", "知识问答"],
        dot: "accent-dot accent-dot--blue",
    },
];

const HomeCasesPreview = () => {
    return (
        <section className="lab-section">
            <div className="lab-container">
                <div className="reveal mb-14 grid gap-8 lg:grid-cols-[0.86fr_1.14fr] lg:items-end">
                    <div>
                        <div className="lab-kicker mb-4">PROJECT SHOWCASE</div>
                        <h2 className="section-title">
                            项目展示
                        </h2>
                    </div>
                    <p className="section-copy">
                        围绕客户现有数据、知识库和工作流定制 AI 管线，并封装成易用、稳定的软件产品，让 AI 真正接入销售、文档、运营和内部支持等关键流程。
                    </p>
                </div>

                <div className="reveal grid gap-5 lg:grid-cols-3">
                    {previewProjects.map((item) => (
                        <article key={item.title} className="lab-panel flex min-h-[320px] flex-col p-6 md:p-7">
                            <div className="mb-6 flex items-center justify-between gap-4">
                                <span className="lab-label">{item.status}</span>
                                <span className={item.dot} />
                            </div>
                            <h3 className="mb-4 font-heading text-[1.65rem] leading-tight text-white">{item.title}</h3>
                            <p className="mb-7 text-sm leading-7 text-text-muted">{item.body}</p>
                            <div className="mt-auto flex flex-wrap gap-2">
                                {item.tags.map((tag) => (
                                    <span key={tag} className="rounded-full border border-white/10 bg-white/[0.035] px-3 py-1 text-xs text-white/68">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </article>
                    ))}
                </div>

                <div className="reveal mt-9 flex flex-wrap items-center justify-between gap-5 rounded-3xl border border-accent-amber/20 bg-accent-amber/[0.035] p-6 md:p-7">
                    <p className="max-w-2xl text-base leading-8 text-white/72">
                        查看更多真实界面与业务场景，了解 Cyano 如何把 AI 能力落到具体流程。
                    </p>
                    <Link href="/cases" className="cyano-button">
                        查看项目展示
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default HomeCasesPreview;
