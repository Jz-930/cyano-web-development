import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import GalleryViewerClient from "./GalleryViewerClient";
import { siteContent } from "@/i18n/locales";

export const metadata: Metadata = {
    ...siteContent.cn.meta["/gallery-viewer"],
    robots: {
        index: false,
        follow: false,
    },
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    userScalable: true,
    viewportFit: "cover",
};

export default function GalleryViewerPage() {
    return (
        <Suspense fallback={<main className="gallery-viewer-page" />}>
            <GalleryViewerClient />
        </Suspense>
    );
}
