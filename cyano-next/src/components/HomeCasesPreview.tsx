import Link from "next/link";

const previewProjects = [
    {
        status: "演示整理中",
        title: "个性化销售素材生成",
        body: "为精准获客、客户画像和一客一稿销售内容预留产品介绍与演示入口。",
        tags: ["精准获客", "销售内容", "一客一稿"],
        dot: "accent-dot accent-dot--amber",
    },
    {
        status: "项目位预留",
        title: "智能标书与方案生成",
        body: "保留文档自动化、知识库引用和方案生成类项目的展示位置。",
        tags: ["文档自动化", "RAG", "方案生成"],
        dot: "accent-dot",
    },
    {
        status: "内部演示",
        title: "企业知识库 AI 助手",
        body: "为内部问答、IT 助手、知识库检索和工单拦截类演示留好内容位。",
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
                        对LLM进行调整，规划完全适合您现有工作流的高效管线，并封装成易用、稳定的软件落地，让AI，真的能够接手现有工作。
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
                        不同行业千变万化，但人类的思考总有迹可循，来查看更多案例展示
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
