"use client";

import MediaFrame from "@/components/MediaFrame";
import { useReveal } from "@/hooks/useReveal";

const opportunityGroups = [
    {
        label: "New Capability",
        title: "过去做不了，现在能做",
        desc: "AI 让个性化推荐、精准获客、客户画像和面向每个客户的销售素材生成具备规模化可能。",
        points: ["个性化找客户", "精准定位客群", "一客一稿销售内容", "新增服务能力"],
        image: "/media/opportunity-new-capability.svg",
        tone: "coral" as const,
        dot: "accent-dot accent-dot--coral",
        accentText: "text-accent-coral",
    },
    {
        label: "Efficiency",
        title: "已经在做，但成本太高",
        desc: "把文档、审核、查询、客服、运营等重复流程转成 AI 工作流，减少人工、返工和等待时间。",
        points: ["文档自动化", "合同与合规审查", "内部知识问答", "数据查询与运营任务"],
        image: "/media/workflow-efficiency.svg",
        tone: "blue" as const,
        dot: "accent-dot accent-dot--blue",
        accentText: "text-accent-blue",
    },
];

const OpportunitySection = () => {
    useReveal();

    return (
        <section id="services" className="lab-section">
            <div className="lab-container">
                <div className="reveal mb-16 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
                    <div>
                        <div className="lab-kicker mb-4">AI OPPORTUNITY DIAGNOSIS</div>
                        <h2 className="section-title">
                            两类 AI 机会，
                            <span className="text-brand-mint"> 先判断值不值得做</span>
                        </h2>
                    </div>
                    <p className="section-copy">
                        Cyano 不会为了使用 AI 而使用 AI。我们先判断这是新能力建设，还是现有流程降本增效，再决定产品、工作流或托管服务的合作方式。
                    </p>
                </div>

                <div className="reveal grid gap-8 lg:grid-cols-2">
                    {opportunityGroups.map((group, index) => (
                        <article key={group.title} className="opportunity-card lab-panel flex flex-col p-4 md:p-5 lg:p-6">
                            <MediaFrame
                                src={group.image}
                                alt={`${group.title}视觉占位图`}
                                label={`${group.label} 视觉占位`}
                                tone={group.tone}
                            />
                            <div className="flex flex-1 flex-col px-2 pt-6 md:px-3 md:pt-7">
                                <div className="mb-5 flex items-center justify-between gap-4">
                                    <span className="lab-label">{group.label}</span>
                                    <span className={`font-heading text-sm ${group.accentText}`}>0{index + 1}</span>
                                </div>
                                <h3 className="mb-4 font-heading text-[1.85rem] leading-tight text-white md:text-[2.15rem] lg:text-[2.05rem] xl:text-[2.2rem]">
                                    {group.title}
                                </h3>
                                <p className="mb-7 text-base leading-8 text-text-muted md:text-[1.03rem]">{group.desc}</p>
                                <div className="grid gap-3 md:gap-3.5">
                                    {group.points.map((point) => (
                                        <div key={point} className="bullet-row">
                                            <span className={group.dot} />
                                            <span>{point}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </article>
                    ))}
                </div>

                <div className="reveal mt-10 lab-panel grid gap-6 p-7 md:grid-cols-[260px_1fr] md:p-8">
                    <div className="grid-surface flex min-h-[180px] items-center justify-center rounded-2xl border border-brand-mint/15 bg-black/25">
                        <div className="soft-teal-glow flex h-28 w-28 flex-col items-center justify-center rounded-full border border-brand-mint/45 bg-[#031012]/90 text-center">
                            <span className="lab-label mb-2">CYANO</span>
                            <span className="text-xs text-text-muted">Diagnosis Core</span>
                        </div>
                    </div>
                    <div className="self-center">
                        <div className="lab-label mb-3">VALUE MODEL MATCHED</div>
                        <p className="section-copy">
                            这一步的目标不是把所有想法都做成软件，而是判断客户到底该买工具、买试点，还是买结果。机会类型判断清楚，后面的合作方式和收费逻辑才不会混乱。
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default OpportunitySection;
