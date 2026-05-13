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
    const [shouldRenderScene, setShouldRenderScene] = React.useState(false);
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
        const mediaQuery = window.matchMedia("(hover: none), (pointer: coarse), (max-width: 1024px)");
        const updateRenderMode = () => {
            setShouldRenderScene(!mediaQuery.matches);
        };

        updateRenderMode();
        mediaQuery.addEventListener("change", updateRenderMode);

        return () => mediaQuery.removeEventListener("change", updateRenderMode);
    }, []);

    React.useEffect(() => {
        setIsLoaded(false);
        if (!shouldRenderScene) {
            setIsLoaded(true);
            return;
        }

        const fallbackTimer = window.setTimeout(() => setIsLoaded(true), 1200);

        return () => window.clearTimeout(fallbackTimer);
    }, [src, shouldRenderScene]);

    React.useEffect(() => {
        if (!shouldRenderScene) return;
        if (!usesSplineViewer) return;

        const viewer = document.getElementById(viewerId);
        if (!viewer) return;

        const handleLoadComplete = () => setIsLoaded(true);

        viewer.addEventListener("load-complete", handleLoadComplete);
        return () => viewer.removeEventListener("load-complete", handleLoadComplete);
    }, [viewerId, src, usesSplineViewer, shouldRenderScene]);

    const sceneClassName = [
        "service-hero-scene",
        isProject ? "service-hero-scene--project" : "",
        isHome ? "service-hero-scene--home" : "",
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <div className={sceneClassName} aria-hidden="true">
            <div className="hero-scene-glow hero-scene-glow--mint" />
            <div className="hero-scene-glow hero-scene-glow--amber" />
            {shouldRenderScene && usesSplineViewer && <Script id="page-hero-spline-viewer-loader" type="module" src={splineViewerScript} strategy="afterInteractive" />}
            {shouldRenderScene
                ? usesSplineViewer
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
                    )
                : <div className="service-hero-frame service-hero-frame--static service-hero-frame--ready" />}
        </div>
    );
};

export default ServiceHeroSpline;
