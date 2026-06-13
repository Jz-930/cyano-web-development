"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import MediaFrame from "@/components/MediaFrame";
import { useReveal } from "@/hooks/useReveal";
import { useI18n } from "@/i18n/LanguageProvider";

const ProcessTimeline = () => {
    useReveal();
    const { content } = useI18n();
    const process = content.services.process;
    const steps = process.steps as Array<{ title: string; desc: string; signal: string; dot: string }>;
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
                        <div className="lab-kicker mb-4">{process.kicker}</div>
                        <h2 className="section-title">
                            {process.title}
                            <span className="text-brand-mint">{process.accent}</span>
                        </h2>
                    </div>
                    <p className="section-copy">
                        {process.description}
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
                                alt={process.imageAlt}
                                label={process.imageLabel}
                                tone="amber"
                            />
                            <div className="lab-panel scanline p-7">
                                <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-5">
                                    <span className="lab-label">{process.currentPhaseLabel}</span>
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
                                    {process.ctaLabel}
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
