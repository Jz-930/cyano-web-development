"use client";

import Link from "next/link";
import { useI18n } from "@/i18n/LanguageProvider";

const HomeCasesPreview = () => {
    const { content } = useI18n();
    const casesPreview = content.home.casesPreview;
    const previewProjects = casesPreview.projects as Array<{
        status: string;
        title: string;
        body: string;
        tags: string[];
        dot: string;
    }>;

    return (
        <section className="lab-section">
            <div className="lab-container">
                <div className="reveal mb-14 grid gap-8 lg:grid-cols-[0.86fr_1.14fr] lg:items-end">
                    <div>
                        <div className="lab-kicker mb-4">{casesPreview.kicker}</div>
                        <h2 className="section-title">
                            {casesPreview.title}
                        </h2>
                    </div>
                    <p className="section-copy">
                        {casesPreview.description}
                    </p>
                </div>

                <div className="reveal grid gap-5 lg:grid-cols-3">
                    {previewProjects.map((item) => (
                        <article key={item.title} className="lab-panel flex min-h-[320px] flex-col p-6 md:p-7">
                            <div className="mb-6 flex items-center justify-between gap-4">
                                <span className="lab-label">{item.status}</span>
                                <span className={item.dot} />
                            </div>
                            <h3 className="mb-4 font-heading text-[1.65rem] leading-tight text-white">{item.title}</h3>
                            <p className="mb-7 text-sm leading-7 text-text-muted">{item.body}</p>
                            <div className="mt-auto flex flex-wrap gap-2">
                                {item.tags.map((tag) => (
                                    <span key={tag} className="rounded-full border border-white/10 bg-white/[0.035] px-3 py-1 text-xs text-white/68">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </article>
                    ))}
                </div>

                <div className="reveal mt-9 flex flex-wrap items-center justify-between gap-5 rounded-3xl border border-accent-amber/20 bg-accent-amber/[0.035] p-6 md:p-7">
                    <p className="max-w-2xl text-base leading-8 text-white/72">
                        {casesPreview.ctaDescription}
                    </p>
                    <Link href="/cases" className="cyano-button">
                        {casesPreview.ctaLabel}
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default HomeCasesPreview;
