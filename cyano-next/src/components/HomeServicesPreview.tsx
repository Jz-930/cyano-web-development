"use client";

import Link from "next/link";
import { useI18n } from "@/i18n/LanguageProvider";

const HomeServicesPreview = () => {
    const { content } = useI18n();
    const servicesPreview = content.home.servicesPreview;
    const servicePaths = servicesPreview.paths as Array<{ label: string; title: string; body: string; dot: string }>;

    return (
        <section className="lab-section">
            <div className="lab-container">
                <div className="reveal mb-14 grid gap-8 lg:grid-cols-[0.88fr_1.12fr] lg:items-end">
                    <div>
                        <div className="lab-kicker mb-4">{servicesPreview.kicker}</div>
                        <h2 className="section-title">
                            {servicesPreview.title}
                        </h2>
                    </div>
                    <p className="section-copy">
                        {servicesPreview.description}
                    </p>
                </div>

                <div className="reveal grid gap-5 lg:grid-cols-3">
                    {servicePaths.map((item) => (
                        <article key={item.title} className="lab-panel p-6 md:p-7">
                            <div className="mb-5 flex items-center justify-between gap-4">
                                <span className="lab-label">{item.label}</span>
                                <span className={item.dot} />
                            </div>
                            <h3 className="mb-4 font-heading text-[1.55rem] leading-tight text-white">{item.title}</h3>
                            <p className="text-sm leading-7 text-text-muted">{item.body}</p>
                        </article>
                    ))}
                </div>

                <div className="reveal mt-9 flex flex-wrap items-center justify-between gap-5 rounded-3xl border border-brand-mint/15 bg-white/[0.025] p-6 md:p-7">
                    <p className="max-w-2xl text-base leading-8 text-white/72">
                        {servicesPreview.ctaDescription}
                    </p>
                    <Link href="/services" className="cyano-button">
                        {servicesPreview.ctaLabel}
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default HomeServicesPreview;
