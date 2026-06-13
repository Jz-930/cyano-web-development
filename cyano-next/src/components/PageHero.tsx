"use client";

import Link from "next/link";
import ServiceHeroSpline from "@/components/ServiceHeroSpline";
import { useI18n } from "@/i18n/LanguageProvider";
import type { PageHeroKey } from "@/i18n/types";

type PageHeroProps = {
    pageKey?: PageHeroKey;
    eyebrow?: string;
    title?: string;
    accent?: string;
    description?: string;
    primaryHref?: string;
    primaryLabel?: string;
    secondaryHref?: string;
    secondaryLabel?: string;
    splineEmbedUrl?: string;
    splineTitle?: string;
    splineVariant?: "default" | "project" | "home";
};

const PageHero = ({
    pageKey,
    eyebrow,
    title,
    accent,
    description,
    primaryHref,
    primaryLabel,
    secondaryHref,
    secondaryLabel,
    splineEmbedUrl,
    splineTitle = "Spline 3D scene",
    splineVariant = "default",
}: PageHeroProps) => {
    const { content } = useI18n();
    const localizedHero = pageKey ? content.pageHeroes[pageKey] : null;
    const resolvedEyebrow = localizedHero?.eyebrow ?? eyebrow;
    const resolvedTitle = localizedHero?.title ?? title;
    const resolvedAccent = localizedHero?.accent ?? accent;
    const resolvedDescription = localizedHero?.description ?? description;
    const resolvedPrimaryLabel = localizedHero?.primaryLabel ?? primaryLabel;
    const resolvedSecondaryLabel = localizedHero?.secondaryLabel ?? secondaryLabel;
    const heroClassName = [
        "lab-section page-hero !pt-36 md:!pt-44",
        splineEmbedUrl ? "page-hero--with-scene" : "",
        splineVariant === "project" ? "page-hero--project-scene" : "",
        splineVariant === "home" ? "page-hero--home-scene" : "",
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <section className={heroClassName}>
            {splineEmbedUrl && <ServiceHeroSpline src={splineEmbedUrl} title={splineTitle} variant={splineVariant} />}
            <div className="lab-container">
                <div className="reveal page-hero__copy">
                    {resolvedEyebrow && <div className="lab-kicker mb-5">{resolvedEyebrow}</div>}
                    <h1 className="page-hero__title">
                        {resolvedTitle}
                        <span className="block bg-gradient-to-r from-brand-mint via-accent-cyan to-accent-amber bg-clip-text text-transparent">
                            {resolvedAccent}
                        </span>
                    </h1>
                    {resolvedDescription && <p className="page-hero__description">{resolvedDescription}</p>}
                    {(primaryHref || secondaryHref) && (
                        <div className="page-hero__actions">
                            {primaryHref && resolvedPrimaryLabel && (
                                <Link href={primaryHref} className="cyano-button">
                                    {resolvedPrimaryLabel}
                                </Link>
                            )}
                            {secondaryHref && resolvedSecondaryLabel && (
                                <Link href={secondaryHref} className="cyano-ghost-button">
                                    {resolvedSecondaryLabel}
                                </Link>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default PageHero;
