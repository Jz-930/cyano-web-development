"use client";

import Link from "next/link";
import { useState } from "react";
import MediaFrame from "@/components/MediaFrame";
import { useReveal } from "@/hooks/useReveal";

const models = [
    {
        label: "Mode 01",
        title: "完整定制开发",
        short: "为企业打造可长期使用的 AI 工作平台",
        bestFor: "适合目标清晰、使用频率高，希望把 AI 能力沉淀为自有系统的团队。",
        deliverable: "从需求梳理、产品设计、模型接入、工作流开发到上线维护，交付可持续迭代的业务系统。",
        advantage: "帮助企业建立长期可控的 AI 能力，让核心流程、数据和团队经验持续沉淀。",
        cta: "咨询定制方案",
        tone: "mint" as const,
        dot: "accent-dot",
    },
    {
        label: "Mode 02",
        title: "轻量试点与分期开发",
        short: "先跑通关键场景，再逐步扩展",
        bestFor: "适合想快速验证 AI 价值、控制初期投入，并用真实反馈推动内部决策的团队。",
        deliverable: "优先上线核心流程和最小可用方案，结合使用反馈持续迭代到更完整的平台。",
        advantage: "启动更快、节奏更灵活，帮助客户在技术快速变化中保留选择空间。",
        cta: "启动试点咨询",
        tone: "amber" as const,
        dot: "accent-dot accent-dot--amber",
    },
    {
        label: "Mode 03",
        title: "托管式 AI 服务",
        short: "把持续任务交给 Cyano，直接获得结果",
        bestFor: "适合有大量重复性产出、需要稳定质量和交付速度，但暂时不想自建系统的团队。",
        deliverable: "Cyano 结合 AI 工作流和专业服务，持续完成内容、数据、流程或运营类任务。",
        advantage: "以结果为导向，更快释放团队人力，也方便未来沉淀为专属工具或平台。",
        cta: "咨询托管服务",
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
                            多种合作方式，
                            <span className="text-accent-amber"> 灵活接入企业 AI 能力</span>
                        </h2>
                    </div>
                    <p className="section-copy">
                        Cyano 可以从完整平台建设、轻量试点到托管式持续交付，按企业阶段选择最合适的路径。我们先理解业务目标和工作流程，再让 AI 能力以可控、可扩展的方式进入团队。
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
                            label={`${active.label} 合作模式`}
                            caption="根据业务阶段选择合适路径"
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
                                    ["适合场景", active.bestFor, active.dot],
                                    ["你将获得", active.deliverable, "accent-dot"],
                                    ["合作优势", active.advantage, "accent-dot accent-dot--amber"],
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
                                    <span className="lab-label">HOW TO CHOOSE</span>
                                </div>
                                <p className="leading-8 text-white/80">
                                    如果你想沉淀长期能力，可以选择完整定制；如果你想先验证价值，可以从轻量试点开始；如果你需要立刻释放团队人力，托管式服务能更快带来稳定产出。
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
