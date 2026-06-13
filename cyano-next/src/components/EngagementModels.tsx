"use client";

import Link from "next/link";
import { useState } from "react";
import MediaFrame from "@/components/MediaFrame";
import { useReveal } from "@/hooks/useReveal";
import { useI18n } from "@/i18n/LanguageProvider";
import type { Tone } from "@/i18n/types";

type EngagementModel = {
    label: string;
    title: string;
    short: string;
    bestFor: string;
    deliverable: string;
    advantage: string;
    cta: string;
    tone: Tone;
    dot: string;
};

const EngagementModels = () => {
    useReveal();
    const { content } = useI18n();
    const engagement = content.services.engagement;
    const models = engagement.models as EngagementModel[];
    const [activeIndex, setActiveIndex] = useState(0);
    const active = models[activeIndex];

    return (
        <section id="engagement" className="lab-section">
            <div className="lab-container">
                <div className="reveal mb-16 grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
                    <div>
                        <div className="lab-kicker mb-4">{engagement.kicker}</div>
                        <h2 className="section-title">
                            {engagement.title}
                            <span className="text-accent-amber">{engagement.accent}</span>
                        </h2>
                    </div>
                    <p className="section-copy">
                        {engagement.description}
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
                            alt={engagement.imageAlt}
                            label={`${active.label} ${engagement.selectedPathLabel}`}
                            caption={engagement.caption}
                            tone={active.tone}
                        />

                        <div className="lab-panel scanline p-7 md:p-8 lg:p-10">
                            <div className="mb-8 flex flex-wrap items-start justify-between gap-5 border-b border-white/10 pb-6">
                                <div>
                                    <div className="lab-label mb-3">{active.label} / {engagement.selectedPathLabel}</div>
                                    <h3 className="font-heading text-[2.2rem] leading-tight text-white md:text-[2.8rem]">
                                        {active.title}
                                    </h3>
                                </div>
                                <Link href="#contact" className="cyano-button">
                                    {active.cta}
                                </Link>
                            </div>

                            <div className="grid gap-4 md:grid-cols-3">
                                {([
                                    [engagement.detailTitles[0], active.bestFor, active.dot],
                                    [engagement.detailTitles[1], active.deliverable, "accent-dot"],
                                    [engagement.detailTitles[2], active.advantage, "accent-dot accent-dot--amber"],
                                ] as Array<[string, string, string]>).map(([title, desc, dot]) => (
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
                                    <span className="lab-label">{engagement.chooseKicker}</span>
                                </div>
                                <p className="leading-8 text-white/80">
                                    {engagement.chooseDescription}
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
