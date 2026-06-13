"use client";

import MediaFrame from "@/components/MediaFrame";
import { useReveal } from "@/hooks/useReveal";
import { useI18n } from "@/i18n/LanguageProvider";
import type { Tone } from "@/i18n/types";

const OpportunitySection = () => {
    useReveal();
    const { content } = useI18n();
    const opportunities = content.services.opportunities;
    const groups = opportunities.groups as Array<{
        label: string;
        mediaLabel: string;
        title: string;
        desc: string;
        points: string[];
        image: string;
        tone: Tone;
        dot: string;
        accentText: string;
    }>;

    return (
        <section id="services" className="lab-section">
            <div className="lab-container">
                <div className="reveal mb-16 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
                    <div>
                        <div className="lab-kicker mb-4">{opportunities.kicker}</div>
                        <h2 className="section-title">
                            {opportunities.title}
                            <span className="text-brand-mint">{opportunities.accent}</span>
                        </h2>
                    </div>
                    <p className="section-copy">
                        {opportunities.description}
                    </p>
                </div>

                <div className="reveal grid gap-8 lg:grid-cols-2">
                    {groups.map((group, index) => (
                        <article key={group.title} className="opportunity-card lab-panel flex flex-col p-4 md:p-5 lg:p-6">
                            <MediaFrame
                                src={group.image}
                                alt={`${group.title} ${content.common.mediaDefaultCaption}`}
                                label={group.mediaLabel}
                                caption={null}
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
                                    {group.points.map((point: string) => (
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
                            <span className="lab-label mb-2">{opportunities.coreLabel}</span>
                            <span className="text-xs text-text-muted">{opportunities.coreSubLabel}</span>
                        </div>
                    </div>
                    <div className="self-center">
                        <div className="lab-label mb-3">{opportunities.valueLabel}</div>
                        <p className="section-copy">
                            {opportunities.valueDescription}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default OpportunitySection;
