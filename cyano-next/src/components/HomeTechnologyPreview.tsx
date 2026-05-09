import Link from "next/link";

const proofPoints = [
    "长上下文与知识召回：让模型在真实业务资料中找到正确依据",
    "Agent 与工作流编排：把复杂任务拆成可追踪、可校验的步骤",
    "成本、延迟与稳定性优化：让系统能在日常使用中持续运行",
    "权限、兼容与部署方案：适配企业现有系统、安全边界和维护要求",
];

const HomeTechnologyPreview = () => {
    return (
        <section className="lab-section">
            <div className="lab-container">
                <div className="reveal lab-panel grid gap-8 p-7 md:p-9 lg:grid-cols-[0.85fr_1.15fr] lg:p-10">
                    <div>
                        <div className="lab-kicker mb-4">TECHNICAL PROOF</div>
                        <h2 className="section-title mb-6">
                            技术保障如何让 AI
                            <span className="text-brand-mint"> 真正进入业务</span>
                        </h2>
                        <p className="section-copy">
                            了解Cyano在实际处理企业 AI 落地中如何解决：长上下文、知识召回、Agent 编排、成本延迟、权限治理、系统集成和部署方式。我们提供了更多技术说明。
                        </p>
                    </div>

                    <div className="grid content-center gap-4">
                        {proofPoints.map((point, index) => (
                            <div key={point} className="content-card flex items-start gap-4">
                                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-brand-mint/25 bg-brand-mint/10 font-heading text-xs text-brand-mint">
                                    0{index + 1}
                                </span>
                                <p className="text-sm leading-7 text-white/76">{point}</p>
                            </div>
                        ))}
                        <div className="pt-2">
                            <Link href="/technology" className="cyano-ghost-button">
                                查看技术保障详情
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HomeTechnologyPreview;
