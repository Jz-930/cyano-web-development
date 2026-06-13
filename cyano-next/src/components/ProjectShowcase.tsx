"use client";

import Link from "next/link";
import MediaFrame from "@/components/MediaFrame";
import { useI18n } from "@/i18n/LanguageProvider";
import type { Tone } from "@/i18n/types";

const ProjectShowcase = () => {
    const { content } = useI18n();
    const showcase = content.projectShowcase;
    const featured = showcase.featured;
    const materials = showcase.materials;
    const projects = featured.projects as Array<{
        status: string;
        title: string;
        value: string;
        audience: string;
        image: string;
        tone: Tone;
        tags: string[];
    }>;
    const slots = materials.slots as Array<{ title: string; body: string; status: string }>;

    return (
        <>
            <section className="lab-section">
                <div className="lab-container">
                    <div className="reveal mb-14 grid gap-8 lg:grid-cols-[0.86fr_1.14fr] lg:items-end">
                        <div>
                            <div className="lab-kicker mb-4">{featured.kicker}</div>
                            <h2 className="section-title">
                                {featured.title}
                                <span className="text-brand-mint">{featured.accent}</span>
                            </h2>
                        </div>
                        <p className="section-copy">{featured.description}</p>
                    </div>

                    <div className="reveal grid gap-7 lg:grid-cols-3">
                        {projects.map((project) => (
                            <article key={project.title} className="lab-panel flex flex-col p-4 md:p-5">
                                <MediaFrame
                                    src={project.image}
                                    alt={`${project.title} ${content.common.mediaDefaultCaption}`}
                                    label={`${project.status} / Project Overview`}
                                    tone={project.tone}
                                />
                                <div className="flex flex-1 flex-col px-2 pt-6 md:px-3">
                                    <div className="mb-4 flex items-center justify-between gap-4">
                                        <span className="lab-label">{project.status}</span>
                                        <span className="accent-dot" />
                                    </div>
                                    <h3 className="mb-4 font-heading text-[1.55rem] leading-tight text-white">{project.title}</h3>
                                    <p className="mb-4 text-sm leading-7 text-white/74">{project.value}</p>
                                    <p className="mb-6 text-sm leading-7 text-text-muted">{project.audience}</p>
                                    <div className="mt-auto flex flex-wrap gap-2">
                                        {project.tags.map((tag: string) => (
                                            <span key={tag} className="rounded-full border border-white/10 bg-white/[0.035] px-3 py-1 text-xs text-white/68">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section className="lab-section">
                <div className="lab-container">
                    <div className="reveal mb-12 max-w-3xl">
                        <div className="lab-kicker mb-4">{materials.kicker}</div>
                        <h2 className="section-title">{materials.title}</h2>
                        <p className="section-copy mt-5">{materials.description}</p>
                    </div>

                    <div className="reveal grid gap-5 md:grid-cols-3">
                        {slots.map((slot) => (
                            <article key={slot.title} className="lab-panel min-h-[240px] p-6 md:p-7">
                                <div className="mb-6 flex items-center justify-between gap-4">
                                    <span className="lab-label">{slot.status}</span>
                                    <span className="accent-dot accent-dot--blue" />
                                </div>
                                <h3 className="mb-4 font-heading text-[1.45rem] leading-tight text-white">{slot.title}</h3>
                                <p className="text-sm leading-7 text-text-muted">{slot.body}</p>
                            </article>
                        ))}
                    </div>

                    <div className="reveal mt-9 flex flex-wrap items-center justify-between gap-5 rounded-3xl border border-brand-mint/15 bg-white/[0.025] p-6 md:p-7">
                        <p className="max-w-2xl text-base leading-8 text-white/72">{materials.ctaDescription}</p>
                        <Link href="/contact" className="cyano-button">
                            {materials.ctaLabel}
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
};

export default ProjectShowcase;
