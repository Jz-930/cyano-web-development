"use client";

import Link from "next/link";
import { useI18n } from "@/i18n/LanguageProvider";

const HomeTechnologyPreview = () => {
    const { content } = useI18n();
    const technologyPreview = content.home.technologyPreview;

    return (
        <section className="lab-section">
            <div className="lab-container">
                <div className="reveal lab-panel grid gap-8 p-7 md:p-9 lg:grid-cols-[0.85fr_1.15fr] lg:p-10">
                    <div>
                        <div className="lab-kicker mb-4">{technologyPreview.kicker}</div>
                        <h2 className="section-title mb-6">
                            {technologyPreview.title}
                            <span className="text-brand-mint">{technologyPreview.accent}</span>
                        </h2>
                        <p className="section-copy">
                            {technologyPreview.description}
                        </p>
                    </div>

                    <div className="grid content-center gap-4">
                        {technologyPreview.points.map((point: string, index: number) => (
                            <div key={point} className="content-card flex items-start gap-4">
                                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-brand-mint/25 bg-brand-mint/10 font-heading text-xs text-brand-mint">
                                    0{index + 1}
                                </span>
                                <p className="text-sm leading-7 text-white/76">{point}</p>
                            </div>
                        ))}
                        <div className="pt-2">
                            <Link href="/technology" className="cyano-ghost-button">
                                {technologyPreview.ctaLabel}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HomeTechnologyPreview;
