"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import MediaFrame from "@/components/MediaFrame";
import { useReveal } from "@/hooks/useReveal";

const steps = [
    {
        title: "业务诊断",
        desc: "先判断这是新能力建设，还是现有流程降本增效，避免把 AI 做成展示品。",
        signal: "Problem Framed",
        dot: "accent-dot",
    },
    {
        title: "价值评估",
        desc: "一起核算人工、外包、管理、返工和机会成本，判断这件事是否值得投入。",
        signal: "Value Scored",
        dot: "accent-dot accent-dot--amber",
    },
    {
        title: "方案报价",
        desc: "明确工具买断、低启动持续服务，或托管式交付的边界和收费逻辑。",
        signal: "Model Selected",
        dot: "accent-dot accent-dot--coral",
    },
    {
        title: "开发 / 试点 / 托管交付",
        desc: "按选定模式交付可用工具、业务工作流，或成批任务结果。",
        signal: "Workflow Live",
        dot: "accent-dot",
    },
    {
        title: "上线维护与迭代",
        desc: "根据托管、接口变化、新需求和使用反馈，持续优化系统与服务。",
        signal: "Ops Loop",
        dot: "accent-dot accent-dot--blue",
    },
];

const ProcessTimeline = () => {
    useReveal();
    const [activeIndex, setActiveIndex] = useState(0);
    const refs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const index = Number((entry.target as HTMLElement).dataset.step);
                        if (!Number.isNaN(index)) {
                            setActiveIndex(index);
                        }
                    }
                });
            },
            { threshold: 0.55, rootMargin: "-15% 0px -25% 0px" }
        );

        const nodes = refs.current;
        nodes.forEach((node) => {
            if (node) observer.observe(node);
        });

        return () => {
            nodes.forEach((node) => {
                if (node) observer.unobserve(node);
            });
        };
    }, []);

    return (
        <section id="process" className="lab-section">
            <div className="lab-container">
                <div className="reveal mb-16 grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
                    <div>
                        <div className="lab-kicker mb-4">DELIVERY SEQUENCE</div>
                        <h2 className="section-title">
                            从一次业务诊断开始，
                            <span className="text-brand-mint"> 到可维护的交付</span>
                        </h2>
                    </div>
                    <p className="section-copy">
                        Cyano 的合作流程把“想法”变成可验收、可上线、可维护的系统或服务，同时让客户在一开始就知道自己是在买工具、买使用权，还是买结果。
                    </p>
                </div>

                <div className="reveal grid gap-10 lg:grid-cols-[1fr_390px]">
                    <div className="relative">
                        <div className="absolute left-[25px] top-8 hidden h-[calc(100%-64px)] w-px bg-white/10 md:block" />
                        <div
                            className="absolute left-[25px] top-8 hidden w-px bg-gradient-to-b from-brand-mint via-accent-amber to-accent-cyan transition-all duration-700 md:block"
                            style={{ height: `${Math.max(8, (activeIndex / (steps.length - 1)) * 100)}%` }}
                        />
                        <div className="grid gap-5">
                            {steps.map((step, index) => {
                                const isActive = activeIndex === index;
                                return (
                                    <div
                                        key={step.title}
                                        ref={(node) => {
                                            refs.current[index] = node;
                                        }}
                                        data-step={index}
                                        className={`lab-panel ml-0 p-6 transition-all duration-300 md:ml-16 md:p-7 ${isActive ? "border-brand-mint/45 bg-white/[0.045]" : "hover:border-white/20"}`}
                                    >
                                        <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
                                            <div className="flex items-start gap-4">
                                                <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border font-heading text-sm ${isActive ? "border-brand-mint bg-brand-mint/10 text-brand-mint soft-teal-glow" : "border-white/10 text-white/45"}`}>
                                                    0{index + 1}
                                                </span>
                                                <div>
                                                    <h3 className="font-heading text-[1.55rem] leading-tight text-white">{step.title}</h3>
                                                    <div className="mt-2 flex items-center gap-2">
                                                        <span className={step.dot} />
                                                        <span className="font-mono text-[11px] text-white/45">{step.signal}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <p className="max-w-2xl text-base leading-8 text-text-muted">{step.desc}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="hidden lg:block">
                        <div className="sticky top-28 grid gap-5">
                            <MediaFrame
                                src="/media/process-map.svg"
                                alt="合作流程视觉占位图"
                                label="流程图占位"
                                tone="amber"
                            />
                            <div className="lab-panel scanline p-7">
                                <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-5">
                                    <span className="lab-label">Current Phase</span>
                                    <span className="font-mono text-sm text-accent-amber">0{activeIndex + 1}/05</span>
                                </div>
                                <div className="mb-6">
                                    <div className="mb-4 flex items-center gap-3">
                                        <span className={steps[activeIndex].dot} />
                                        <h3 className="font-heading text-[1.8rem] leading-tight text-white">
                                            {steps[activeIndex].title}
                                        </h3>
                                    </div>
                                    <p className="text-sm leading-7 text-text-muted">{steps[activeIndex].desc}</p>
                                </div>
                                <div className="mb-7 h-2 overflow-hidden rounded-full bg-white/10">
                                    <div
                                        className="h-full rounded-full bg-gradient-to-r from-brand-mint via-accent-amber to-accent-cyan transition-all duration-700"
                                        style={{ width: `${((activeIndex + 1) / steps.length) * 100}%` }}
                                    />
                                </div>
                                <Link href="#contact" className="cyano-ghost-button w-full">
                                    预约一次业务诊断
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProcessTimeline;
