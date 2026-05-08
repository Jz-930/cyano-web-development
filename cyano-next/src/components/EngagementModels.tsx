"use client";

import Link from "next/link";
import { useState } from "react";
import MediaFrame from "@/components/MediaFrame";
import { useReveal } from "@/hooks/useReveal";

const models = [
    {
        label: "Mode 01",
        title: "完整定制开发",
        short: "客户买断工具或工作流",
        bestFor: "需求明确、希望长期拥有一套可反复使用的 AI 工具或系统。",
        deliverable: "完整产品设计、开发交付、阶段验收、上线后的基础托管与维护。",
        billing: "前期投入更高，长期使用成本更可控；新增功能、接口变化和额外支持按范围另行评估。",
        cta: "评估买断方案",
        tone: "mint" as const,
        dot: "accent-dot",
    },
    {
        label: "Mode 02",
        title: "低启动费 + 持续服务",
        short: "先跑起来，再按使用持续合作",
        bestFor: "客户想降低前期投入，希望先验证业务价值和使用规模。",
        deliverable: "快速试点、核心工作流上线、持续月费、使用费或服务费支持迭代。",
        billing: "低启动费不是便宜买断；长期总成本通常高于直接买断，具体根据开发投入和服务规模评估。",
        cta: "启动试点",
        tone: "amber" as const,
        dot: "accent-dot accent-dot--amber",
    },
    {
        label: "Mode 03",
        title: "托管式 AI 服务",
        short: "客户买结果，不一定买工具",
        bestFor: "任务批量、重复、可验收，客户更关心结果、价格和交付速度。",
        deliverable: "Cyano 用 AI 和内部工作流完成交付，客户按任务、数量、项目或周期付费。",
        billing: "以客户原有人工或外包成本为参照，目标是用更低成本获得更稳定、更快的产出。",
        cta: "提交托管任务",
        tone: "blue" as const,
        dot: "accent-dot accent-dot--blue",
    },
];

const EngagementModels = () => {
    useReveal();
    const [activeIndex, setActiveIndex] = useState(0);
    const active = models[activeIndex];

    return (
        <section id="engagement" className="lab-section">
            <div className="lab-container">
                <div className="reveal mb-16 grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
                    <div>
                        <div className="lab-kicker mb-4">SERVICE MODELS</div>
                        <h2 className="section-title">
                            三种合作方式，
                            <span className="text-accent-amber"> 对应不同预算与风险</span>
                        </h2>
                    </div>
                    <p className="section-copy">
                        每个工具型项目都会先评估完整开发价值，再根据客户预算、使用周期和风险选择合作方式。网站只展示合作逻辑，具体报价在业务诊断后形成。
                    </p>
                </div>

                <div className="reveal grid gap-8 lg:grid-cols-[340px_1fr]">
                    <div className="grid content-start gap-4">
                        {models.map((model, index) => {
                            const isActive = activeIndex === index;
                            return (
                                <button
                                    key={model.title}
                                    type="button"
                                    onClick={() => setActiveIndex(index)}
                                    onMouseEnter={() => setActiveIndex(index)}
                                    className={`lab-panel group p-6 text-left transition-all duration-300 ${isActive ? "border-brand-mint/45 bg-white/[0.045] soft-teal-glow" : "hover:-translate-y-1 hover:border-white/20"}`}
                                >
                                    <div className="mb-4 flex items-center justify-between gap-4">
                                        <span className="lab-label">{model.label}</span>
                                        <span className={model.dot} />
                                    </div>
                                    <h3 className="mb-2 font-heading text-[1.55rem] leading-snug text-white">{model.title}</h3>
                                    <p className="text-sm leading-6 text-text-muted">{model.short}</p>
                                </button>
                            );
                        })}
                    </div>

                    <div className="grid gap-5">
                        <MediaFrame
                            src="/media/engagement-models.svg"
                            alt="三种合作方式视觉占位图"
                            label={`${active.label} 合作方式图像占位`}
                            tone={active.tone}
                        />

                        <div className="lab-panel scanline p-7 md:p-8 lg:p-10">
                            <div className="mb-8 flex flex-wrap items-start justify-between gap-5 border-b border-white/10 pb-6">
                                <div>
                                    <div className="lab-label mb-3">{active.label} / Selected Path</div>
                                    <h3 className="font-heading text-[2.2rem] leading-tight text-white md:text-[2.8rem]">
                                        {active.title}
                                    </h3>
                                </div>
                                <Link href="#contact" className="cyano-button">
                                    {active.cta}
                                </Link>
                            </div>

                            <div className="grid gap-4 md:grid-cols-3">
                                {[
                                    ["适合谁", active.bestFor, active.dot],
                                    ["客户得到什么", active.deliverable, "accent-dot"],
                                    ["收费逻辑", active.billing, "accent-dot accent-dot--amber"],
                                ].map(([title, desc, dot]) => (
                                    <div key={title} className="content-card">
                                        <div className="mb-4 flex items-center gap-3">
                                            <span className={dot} />
                                            <span className="font-heading text-sm font-semibold text-white">{title}</span>
                                        </div>
                                        <p className="text-sm leading-7 text-text-muted">{desc}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-8 rounded-2xl border border-brand-mint/15 bg-brand-mint/[0.035] p-6">
                                <div className="mb-4 flex items-center gap-3">
                                    <span className="accent-dot" />
                                    <span className="lab-label">Decision Rule</span>
                                </div>
                                <p className="leading-8 text-white/80">
                                    如果客户想长期拥有工具，优先选择买断；如果想降低前期投入，选择低启动试点；如果只关心结果交付，选择托管式 AI 服务。
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default EngagementModels;
