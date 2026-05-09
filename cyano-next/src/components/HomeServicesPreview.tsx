import Link from "next/link";

const servicePaths = [
    {
        label: "Mode 01",
        title: "完整定制开发",
        body: "需求明确、希望长期拥有 AI 工具或工作流时，采用完整产品设计、开发、上线与基础维护。",
        dot: "accent-dot",
    },
    {
        label: "Mode 02",
        title: "低启动费 + 持续服务",
        body: "先用较低前期投入跑出试点，再按使用、服务和迭代周期持续合作。",
        dot: "accent-dot accent-dot--amber",
    },
    {
        label: "Mode 03",
        title: "托管式 AI 服务",
        body: "客户买结果，Cyano 用 AI 与内部工作流交付批量任务、项目成果或持续产出。",
        dot: "accent-dot accent-dot--blue",
    },
];

const HomeServicesPreview = () => {
    return (
        <section className="lab-section">
            <div className="lab-container">
                <div className="reveal mb-14 grid gap-8 lg:grid-cols-[0.88fr_1.12fr] lg:items-end">
                    <div>
                        <div className="lab-kicker mb-4">SERVICE PATHS</div>
                        <h2 className="section-title">
                            多种合作模式
                        </h2>
                    </div>
                    <p className="section-copy">
                        Cyano充分考虑并理解目前LLM发展迅速，技术迭代所带来的影响。我们提供完整开发、分期开发和分包托管等多种合作模式。确保客户在AI技术发展的路径中总是独占鳌头。
                    </p>
                </div>

                <div className="reveal grid gap-5 lg:grid-cols-3">
                    {servicePaths.map((item) => (
                        <article key={item.title} className="lab-panel p-6 md:p-7">
                            <div className="mb-5 flex items-center justify-between gap-4">
                                <span className="lab-label">{item.label}</span>
                                <span className={item.dot} />
                            </div>
                            <h3 className="mb-4 font-heading text-[1.55rem] leading-tight text-white">{item.title}</h3>
                            <p className="text-sm leading-7 text-text-muted">{item.body}</p>
                        </article>
                    ))}
                </div>

                <div className="reveal mt-9 flex flex-wrap items-center justify-between gap-5 rounded-3xl border border-brand-mint/15 bg-white/[0.025] p-6 md:p-7">
                    <p className="max-w-2xl text-base leading-8 text-white/72">
                        详细的“两类 AI 机会、三种合作方式、五步合作流程”都保留在服务页。
                    </p>
                    <Link href="/services" className="cyano-button">
                        查看服务与合作
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default HomeServicesPreview;
