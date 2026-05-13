/* eslint-disable @next/next/no-img-element -- Native image rendering keeps mobile browser zoom stable. */
"use client";

import { useSearchParams } from "next/navigation";

const galleries = [
    [
        "/media/lnpe-sales-ai/lnpe-sales-consultant-01-public-assistant.webp",
        "/media/lnpe-sales-ai/lnpe-sales-consultant-02-access-portal.webp",
        "/media/lnpe-sales-ai/lnpe-sales-consultant-03-project-match.webp",
        "/media/lnpe-sales-ai/lnpe-sales-consultant-04-price-reference.webp",
    ],
    [
        "/media/huisheng-proposal-ai/huisheng-proposal-ai-01-workflow-draft.webp",
        "/media/huisheng-proposal-ai/huisheng-proposal-ai-02-start-draft.webp",
    ],
    [
        "/media/alpha-house-ai/alpha-house-02-messages.webp",
        "/media/alpha-house-ai/alpha-house-03-work-order-chat.webp",
        "/media/alpha-house-ai/alpha-house-04-finance.webp",
        "/media/alpha-house-ai/alpha-house-05-contacts.webp",
        "/media/alpha-house-ai/alpha-house-06-reports.webp",
        "/media/alpha-house-ai/alpha-house-01-login.webp",
    ],
    [
        "/media/enterprise-wiki-ai/enterprise-wiki-it-assistant-01-dashboard.webp",
        "/media/enterprise-wiki-ai/enterprise-wiki-it-assistant-02-articles.webp",
        "/media/enterprise-wiki-ai/enterprise-wiki-it-assistant-03-article-detail.webp",
        "/media/enterprise-wiki-ai/enterprise-wiki-it-assistant-04-ticket-detail.webp",
        "/media/enterprise-wiki-ai/enterprise-wiki-it-assistant-05-analytics.webp",
    ],
    [
        "/media/smartdoc-ui-suite/smartdoc-ui-suite-01-dashboard-overview.webp",
        "/media/smartdoc-ui-suite/smartdoc-ui-suite-02-sql-control-center.webp",
        "/media/smartdoc-ui-suite/smartdoc-ui-suite-03-knowledge-base.webp",
        "/media/smartdoc-ui-suite/smartdoc-ui-suite-04-proposal-builder.webp",
        "/media/smartdoc-ui-suite/smartdoc-ui-suite-05-review-audit.webp",
        "/media/smartdoc-ui-suite/smartdoc-ui-suite-06-template-library.webp",
    ],
    [
        "/media/dme-writing-engine/dme-writing-engine-01-chat-branch-switch.webp",
        "/media/dme-writing-engine/dme-writing-engine-02-chat-memory-drawer.webp",
        "/media/dme-writing-engine/dme-writing-engine-03-context-memory-stats.webp",
        "/media/dme-writing-engine/dme-writing-engine-04-note-editor-ai-panel.webp",
        "/media/dme-writing-engine/dme-writing-engine-05-fragments-library-bulk.webp",
        "/media/dme-writing-engine/dme-writing-engine-06-archive-pack-inspect.webp",
        "/media/dme-writing-engine/dme-writing-engine-07-connections-settings.webp",
        "/media/dme-writing-engine/dme-writing-engine-00-startup-loading.webp",
    ],
];

const getSafeIndex = (value: string | null, length: number) => {
    const parsed = Number(value);

    if (!Number.isInteger(parsed) || parsed < 0 || parsed >= length) {
        return 0;
    }

    return parsed;
};

const getSafeBackHref = (value: string | null) => {
    if (!value || !value.startsWith("/") || value.startsWith("//")) {
        return "/cases";
    }

    return value;
};

export default function GalleryViewerClient() {
    const searchParams = useSearchParams();
    const caseIndex = getSafeIndex(searchParams.get("case"), galleries.length);
    const gallery = galleries[caseIndex];
    const photoIndex = getSafeIndex(searchParams.get("photo"), gallery.length);
    const backHref = getSafeBackHref(searchParams.get("back"));
    const src = gallery[photoIndex];
    const previousIndex = (photoIndex - 1 + gallery.length) % gallery.length;
    const nextIndex = (photoIndex + 1) % gallery.length;

    const getViewerHref = (targetPhotoIndex: number) => {
        const params = new URLSearchParams({
            case: String(caseIndex),
            photo: String(targetPhotoIndex),
            back: backHref,
        });

        return `/gallery-viewer?${params.toString()}`;
    };

    return (
        <main className="gallery-viewer-page">
            <nav className="gallery-viewer-bar" aria-label="Gallery controls">
                <a className="gallery-viewer-button" href={backHref}>
                    Back
                </a>
                <span className="gallery-viewer-count">
                    {photoIndex + 1} / {gallery.length}
                </span>
                <a className="gallery-viewer-button" href={src} target="_blank" rel="noreferrer">
                    Original
                </a>
            </nav>

            <div className="gallery-viewer-main">
                <img
                    className="gallery-viewer-image"
                    src={src}
                    alt={`Cyano project screenshot ${photoIndex + 1}`}
                />
            </div>

            <nav className="gallery-viewer-footer" aria-label="Gallery navigation">
                <a className="gallery-viewer-button" href={getViewerHref(previousIndex)}>
                    Previous
                </a>
                <a className="gallery-viewer-button" href={getViewerHref(nextIndex)}>
                    Next
                </a>
            </nav>
        </main>
    );
}
