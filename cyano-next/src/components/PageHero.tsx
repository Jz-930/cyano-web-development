import Link from "next/link";
import ServiceHeroSpline from "@/components/ServiceHeroSpline";

type PageHeroProps = {
    eyebrow: string;
    title: string;
    accent: string;
    description: string;
    primaryHref?: string;
    primaryLabel?: string;
    secondaryHref?: string;
    secondaryLabel?: string;
    splineEmbedUrl?: string;
    splineTitle?: string;
    splineVariant?: "default" | "project" | "home";
};

const PageHero = ({
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
                    <div className="lab-kicker mb-5">{eyebrow}</div>
                    <h1 className="page-hero__title">
                        {title}
                        <span className="block bg-gradient-to-r from-brand-mint via-accent-cyan to-accent-amber bg-clip-text text-transparent">
                            {accent}
                        </span>
                    </h1>
                    <p className="page-hero__description">{description}</p>
                    {(primaryHref || secondaryHref) && (
                        <div className="page-hero__actions">
                            {primaryHref && primaryLabel && (
                                <Link href={primaryHref} className="cyano-button">
                                    {primaryLabel}
                                </Link>
                            )}
                            {secondaryHref && secondaryLabel && (
                                <Link href={secondaryHref} className="cyano-ghost-button">
                                    {secondaryLabel}
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
