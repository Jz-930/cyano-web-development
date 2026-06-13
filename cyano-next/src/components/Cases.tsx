"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { FiChevronLeft, FiChevronRight, FiExternalLink, FiMaximize2, FiX } from "react-icons/fi";
import MediaFrame from "@/components/MediaFrame";
import { useReveal } from "@/hooks/useReveal";
import { useI18n } from "@/i18n/LanguageProvider";
import type { CaseStudyContent, SiteContent } from "@/i18n/types";

type ActiveGallery = {
    caseIndex: number;
    photoIndex: number;
};

const mobileGalleryQuery = "(max-width: 767px), ((hover: none) and (pointer: coarse) and (max-height: 480px))";

const getGalleryViewerHref = (caseIndex: number, photoIndex = 0) => {
    const params = new URLSearchParams({
        case: String(caseIndex),
        photo: String(photoIndex),
        back: `/cases#case-study-${caseIndex}`,
    });

    return `/gallery-viewer?${params.toString()}`;
};

const shouldUseMobileGalleryViewer = () => window.matchMedia(mobileGalleryQuery).matches;

const getCaseGallery = (item: CaseStudyContent, galleryCopy: SiteContent["cases"]["gallery"]) => (
    item.gallery?.length
        ? item.gallery
        : [
            {
                src: item.image,
                alt: galleryCopy.imageAltWithoutCaption(item.title),
                label: item.tag,
            },
        ]
);

const Cases = () => {
    useReveal();
    const { content } = useI18n();
    const { section, gallery, studies: caseStudies } = content.cases;
    const { common } = content;
    const [activeGallery, setActiveGallery] = useState<ActiveGallery | null>(null);
    const [useMobileGallery, setUseMobileGallery] = useState(false);
    const galleryReturnScrollY = useRef(0);
    const galleryReturnCaseIndex = useRef<number | null>(null);

    const activeCase = activeGallery === null ? null : caseStudies[activeGallery.caseIndex];
    const activeImages = activeCase ? getCaseGallery(activeCase, gallery) : [];
    const activePhoto = activeGallery === null ? null : activeImages[activeGallery.photoIndex];

    const openGallery = useCallback((index: number) => {
        if (shouldUseMobileGalleryViewer()) {
            window.location.assign(getGalleryViewerHref(index, 0));
            return;
        }

        galleryReturnScrollY.current = window.scrollY;
        galleryReturnCaseIndex.current = index;
        setActiveGallery({ caseIndex: index, photoIndex: 0 });
    }, []);

    const closeGallery = useCallback(() => {
        const returnScrollY = galleryReturnScrollY.current;
        setActiveGallery(null);
        window.requestAnimationFrame(() => {
            window.scrollTo({ top: returnScrollY, behavior: "auto" });
            galleryReturnCaseIndex.current = null;
        });
    }, []);

    const showPrevious = useCallback(() => {
        setActiveGallery((current) => {
            if (current === null) {
                return current;
            }

            const galleryLength = getCaseGallery(caseStudies[current.caseIndex], gallery).length;

            return {
                ...current,
                photoIndex: (current.photoIndex - 1 + galleryLength) % galleryLength,
            };
        });
    }, [caseStudies, gallery]);

    const showNext = useCallback(() => {
        setActiveGallery((current) => {
            if (current === null) {
                return current;
            }

            const galleryLength = getCaseGallery(caseStudies[current.caseIndex], gallery).length;

            return {
                ...current,
                photoIndex: (current.photoIndex + 1) % galleryLength,
            };
        });
    }, [caseStudies, gallery]);

    useEffect(() => {
        const mediaQuery = window.matchMedia(mobileGalleryQuery);
        const updateGalleryMode = () => setUseMobileGallery(mediaQuery.matches);

        updateGalleryMode();
        mediaQuery.addEventListener("change", updateGalleryMode);

        return () => {
            mediaQuery.removeEventListener("change", updateGalleryMode);
        };
    }, []);

    useEffect(() => {
        if (activeGallery === null) {
            return;
        }

        const previousBodyOverflow = document.body.style.overflow;
        const previousBodyPaddingRight = document.body.style.paddingRight;
        const previousDocumentOverflow = document.documentElement.style.overflow;
        const shouldLockPageScroll = !window.matchMedia(mobileGalleryQuery).matches;
        let visualViewportFrame = 0;

        if (shouldLockPageScroll) {
            const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
            document.documentElement.style.overflow = "hidden";
            document.body.style.overflow = "hidden";

            if (scrollbarWidth > 0) {
                document.body.style.paddingRight = `${scrollbarWidth}px`;
            }
        }

        document.body.classList.add("case-gallery-active");
        document.documentElement.classList.add("case-gallery-active");

        const updateZoomingClass = () => {
            window.cancelAnimationFrame(visualViewportFrame);
            visualViewportFrame = window.requestAnimationFrame(() => {
                const isZooming = (window.visualViewport?.scale ?? 1) > 1.01;
                document.body.classList.toggle("case-gallery-zooming", isZooming);
                document.documentElement.classList.toggle("case-gallery-zooming", isZooming);
            });
        };

        updateZoomingClass();
        window.visualViewport?.addEventListener("resize", updateZoomingClass);
        window.visualViewport?.addEventListener("scroll", updateZoomingClass);

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                closeGallery();
            }

            if (event.key === "ArrowLeft") {
                showPrevious();
            }

            if (event.key === "ArrowRight") {
                showNext();
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            if (shouldLockPageScroll) {
                document.documentElement.style.overflow = previousDocumentOverflow;
                document.body.style.overflow = previousBodyOverflow;
                document.body.style.paddingRight = previousBodyPaddingRight;
            }
            window.cancelAnimationFrame(visualViewportFrame);
            window.visualViewport?.removeEventListener("resize", updateZoomingClass);
            window.visualViewport?.removeEventListener("scroll", updateZoomingClass);
            document.body.classList.remove("case-gallery-active", "case-gallery-zooming");
            document.documentElement.classList.remove("case-gallery-active", "case-gallery-zooming");
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [activeGallery, closeGallery, showNext, showPrevious]);

    return (
        <>
            <section id="cases" className="section-padding cases-section">
                <div className="container">
                    <div className="reveal mb-20 text-center">
                        <div className="lab-kicker mb-4">{section.kicker}</div>
                        <h2 className="section-title mb-6">{section.title}</h2>
                        <p className="section-copy mx-auto max-w-2xl">{section.description}</p>
                    </div>

                    <div className="grid gap-28">
                        {caseStudies.map((item, index) => {
                            const galleryLabel = gallery.openGalleryLabel(item.title);
                            const visual = (
                                <div className="ui-visual" key={`${item.title}-visual`}>
                                    <div
                                        className="case-gallery-trigger"
                                        role="button"
                                        tabIndex={0}
                                        aria-label={galleryLabel}
                                        onClick={() => openGallery(index)}
                                        onKeyDown={(event) => {
                                            if (event.key === "Enter" || event.key === " ") {
                                                event.preventDefault();
                                                openGallery(index);
                                            }
                                        }}
                                    >
                                        <MediaFrame
                                            src={item.image}
                                            alt={item.caption ? gallery.imageAltWithCaption(item.title) : gallery.imageAltWithoutCaption(item.title)}
                                            label={gallery.mediaLabel(item.tag)}
                                            caption={item.caption}
                                            tone={item.tone}
                                            priority={index <= 1}
                                        />
                                        <span className="case-gallery-trigger__hint">
                                            <FiMaximize2 aria-hidden="true" />
                                            {gallery.viewMore}
                                        </span>
                                    </div>
                                </div>
                            );

                            const info = (
                                <div className="case-info" key={`${item.title}-info`}>
                                    <span className="case-tag">{item.tag}</span>
                                    <h3 className="mb-6 font-heading text-[2.15rem] leading-tight text-white md:text-[2.5rem]">
                                        {item.title}
                                    </h3>
                                    <p className="mb-10 font-light leading-8 text-text-muted">
                                        {common.painLabel}: {item.pain}
                                        <br />
                                        {common.solutionLabel}: {item.solution}
                                    </p>
                                    {(item.stats.length > 0 || item.demoHref) && (
                                        <div className="case-meta-row">
                                            {item.stats.length > 0 && (
                                                <div className="stats-grid">
                                                    {item.stats.map(([value, label, highlight]) => (
                                                        <div className="stat" key={label}>
                                                            <h4 className={`text-4xl ${highlight ? "text-accent-cyan" : "text-white"}`}>{value}</h4>
                                                            <span>{label}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                            {item.demoHref && (
                                                <div className="case-demo-action">
                                                    <a
                                                        href={item.demoHref}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="cyano-button"
                                                    >
                                                        {common.demoLabel}
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );

                            return (
                                <article key={item.title} id={`case-study-${index}`} className="case-item reveal">
                                    {item.reverse ? (
                                        <>
                                            {info}
                                            {visual}
                                        </>
                                    ) : (
                                        <>
                                            {visual}
                                            {info}
                                        </>
                                    )}
                                </article>
                            );
                        })}
                    </div>
                </div>
            </section>

            {activeCase && activePhoto && activeGallery && (
                <div className="case-gallery-backdrop" role="presentation" onClick={closeGallery}>
                    <div
                        className="case-gallery-dialog"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="case-gallery-title"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <button
                            type="button"
                            className="case-gallery-close"
                            aria-label={gallery.closeLabel}
                            onClick={closeGallery}
                        >
                            <FiX aria-hidden="true" />
                        </button>

                        <div className="case-gallery-stage">
                            <div className={`case-gallery-image-shell media-frame--${activeCase.tone}`}>
                                <Image
                                    key={activePhoto.src}
                                    src={activePhoto.src}
                                    alt={activePhoto.alt}
                                    width={1280}
                                    height={800}
                                    className="case-gallery-image"
                                    priority
                                    unoptimized
                                />
                                <a
                                    href={activePhoto.src}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="case-gallery-original"
                                    aria-label={gallery.openOriginalLabel}
                                >
                                    <FiExternalLink aria-hidden="true" />
                                    <span>{gallery.originalText}</span>
                                </a>
                                <button
                                    type="button"
                                    className="case-gallery-nav case-gallery-nav--prev"
                                    aria-label={gallery.previousLabel}
                                    onClick={showPrevious}
                                >
                                    <FiChevronLeft aria-hidden="true" />
                                </button>
                                <button
                                    type="button"
                                    className="case-gallery-nav case-gallery-nav--next"
                                    aria-label={gallery.nextLabel}
                                    onClick={showNext}
                                >
                                    <FiChevronRight aria-hidden="true" />
                                </button>
                            </div>

                            <div className="case-gallery-copy">
                                <span className="case-tag">{activeCase.tag}</span>
                                <p className="case-gallery-count">
                                    {activeGallery.photoIndex + 1} / {activeImages.length}
                                </p>
                                <h3 id="case-gallery-title">{activeCase.title}</h3>
                                <p>
                                    {common.painLabel}: {activeCase.pain}
                                    <br />
                                    {common.solutionLabel}: {activeCase.solution}
                                </p>
                            </div>
                        </div>

                        {!useMobileGallery && (
                            <div className="case-gallery-thumbs" aria-label={gallery.thumbsLabel}>
                                {activeImages.map((item, index) => (
                                    <button
                                        type="button"
                                        key={`${activeCase.title}-${item.src}-${index}`}
                                        className={`case-gallery-thumb ${index === activeGallery.photoIndex ? "case-gallery-thumb--active" : ""}`}
                                        aria-label={gallery.viewThumbLabel(item.label)}
                                        aria-current={index === activeGallery.photoIndex ? "true" : undefined}
                                        onClick={() => setActiveGallery({ caseIndex: activeGallery.caseIndex, photoIndex: index })}
                                    >
                                        <Image
                                            src={item.src}
                                            alt=""
                                            width={180}
                                            height={112}
                                            className="case-gallery-thumb__image"
                                        />
                                        <span>{item.label}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default Cases;
