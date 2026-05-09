"use client";

import Script from "next/script";
import React from "react";

type ServiceHeroSplineProps = {
    src: string;
    title: string;
    variant?: "default" | "project" | "home";
};

const splineViewerScript = "/vendor/spline-viewer-1.12.92.js";

const ServiceHeroSpline = ({ src, title, variant = "default" }: ServiceHeroSplineProps) => {
    const viewerId = React.useId();
    const [isLoaded, setIsLoaded] = React.useState(false);
    const isProject = variant === "project";
    const isHome = variant === "home";
    const usesSplineViewer = src.endsWith(".splinecode");

    const handleWheel = React.useCallback((event: React.WheelEvent<Element>) => {
        event.preventDefault();
        event.stopPropagation();
        window.scrollBy({
            left: event.deltaX,
            top: event.deltaY,
            behavior: "auto",
        });
    }, []);

    React.useEffect(() => {
        setIsLoaded(false);
        const fallbackTimer = window.setTimeout(() => setIsLoaded(true), 1200);

        return () => window.clearTimeout(fallbackTimer);
    }, [src]);

    React.useEffect(() => {
        if (!usesSplineViewer) return;

        const viewer = document.getElementById(viewerId);
        if (!viewer) return;

        const handleLoadComplete = () => setIsLoaded(true);

        viewer.addEventListener("load-complete", handleLoadComplete);
        return () => viewer.removeEventListener("load-complete", handleLoadComplete);
    }, [viewerId, src, usesSplineViewer]);

    const sceneClassName = [
        "service-hero-scene",
        isProject ? "service-hero-scene--project" : "",
        isHome ? "service-hero-scene--home" : "",
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <div className={sceneClassName} aria-hidden="true">
            {usesSplineViewer && <Script id="page-hero-spline-viewer-loader" type="module" src={splineViewerScript} strategy="afterInteractive" />}
            <div className="hero-scene-glow hero-scene-glow--mint" />
            <div className="hero-scene-glow hero-scene-glow--amber" />
            {usesSplineViewer
                ? React.createElement("spline-viewer", {
                    id: viewerId,
                    className: `service-hero-frame service-hero-viewer ${isLoaded ? "service-hero-frame--ready" : ""}`,
                    url: src,
                    background: "transparent",
                    "events-target": "global",
                    loading: "eager",
                    title,
                    onWheel: handleWheel,
                    onWheelCapture: handleWheel,
                })
                : (
                    <iframe
                        className={`service-hero-frame ${isLoaded ? "service-hero-frame--ready" : ""}`}
                        src={src}
                        title={title}
                        loading="eager"
                        allow="fullscreen; xr-spatial-tracking"
                        referrerPolicy="strict-origin-when-cross-origin"
                        tabIndex={-1}
                        onLoad={() => setIsLoaded(true)}
                        onWheel={handleWheel}
                        onWheelCapture={handleWheel}
                    />
                )}
        </div>
    );
};

export default ServiceHeroSpline;
