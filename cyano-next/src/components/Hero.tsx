"use client";

import Link from "next/link";
import Script from "next/script";
import React from "react";
import { useI18n } from "@/i18n/LanguageProvider";

const splineViewerScript = "/vendor/spline-viewer-1.12.92.js";
const splineSceneUrl = "/spline/cyano-robot.scene.splinecode";
const mobileHeroVideoUrl = "/media/hero-videos/cyano-robot-mobile.mp4?v=20260513a";
const phoneHeroMediaQuery = "(max-width: 767px), ((hover: none) and (pointer: coarse) and (max-height: 480px))";

const Hero = () => {
    const { content } = useI18n();
    const hero = content.home.hero;
    const viewerId = React.useId();
    const [sceneReady, setSceneReady] = React.useState(false);
    const [shouldRenderScene, setShouldRenderScene] = React.useState(false);
    const [useMobileVideo, setUseMobileVideo] = React.useState(false);

    React.useEffect(() => {
        const mediaQuery = window.matchMedia(phoneHeroMediaQuery);
        const updateRenderMode = () => {
            const shouldUseVideo = mediaQuery.matches;
            setUseMobileVideo(shouldUseVideo);
            setShouldRenderScene(!shouldUseVideo);
        };

        updateRenderMode();
        mediaQuery.addEventListener("change", updateRenderMode);

        return () => mediaQuery.removeEventListener("change", updateRenderMode);
    }, []);

    React.useEffect(() => {
        if (!shouldRenderScene) {
            setSceneReady(true);
            return;
        }

        const viewer = document.getElementById(viewerId);
        if (!viewer) return;

        const handleLoadComplete = () => setSceneReady(true);

        viewer.addEventListener("load-complete", handleLoadComplete);
        return () => viewer.removeEventListener("load-complete", handleLoadComplete);
    }, [viewerId, shouldRenderScene]);

    return (
        <section
            className="hero-section relative flex min-h-screen items-center overflow-hidden border-b border-white/5 bg-transparent pt-24"
        >
            {shouldRenderScene && <Script id="spline-viewer-loader" type="module" src={splineViewerScript} strategy="afterInteractive" />}

            <div className="hero-inner relative z-10">
                <div className="reveal hero-copy min-w-0 text-left">
                    <h1 className="hero-title max-w-4xl">
                        {hero.titleLines[0]}
                        <span className="block bg-gradient-to-r from-white via-brand-mint to-accent-cyan bg-clip-text text-transparent">
                            {hero.titleLines[1]}
                        </span>
                        <span className="block bg-gradient-to-r from-brand-mint via-accent-cyan to-accent-amber bg-clip-text text-transparent">
                            {hero.titleLines[2]}
                        </span>
                    </h1>
                    <p className="hero-description mb-10">
                        {hero.description}
                    </p>
                    <div className="mb-9 grid max-w-2xl gap-3 sm:grid-cols-3">
                        {hero.chips.map((label: string, index: number) => {
                            const dot = ["accent-dot", "accent-dot accent-dot--amber", "accent-dot accent-dot--blue"][index];
                            return (
                            <div key={label} className="console-chip">
                                <span className={`${dot} mr-2`} />
                                {label}
                            </div>
                            );
                        })}
                    </div>
                    <div className="hero-actions">
                        <Link href="/services" className="cyano-button">
                            {hero.primaryLabel}
                        </Link>
                        <Link href="/cases" className="cyano-ghost-button">
                            {hero.secondaryLabel}
                        </Link>
                    </div>
                </div>
            </div>

            <div className="hero-scene" aria-hidden="true">
                <div className="hero-scene-glow hero-scene-glow--mint" />
                <div className="hero-scene-glow hero-scene-glow--amber" />
                {shouldRenderScene ? React.createElement("spline-viewer", {
                    id: viewerId,
                    className: `hero-spline-viewer ${sceneReady ? "hero-spline-viewer--ready" : ""}`,
                    url: splineSceneUrl,
                    background: "transparent",
                    "events-target": "global",
                    loading: "eager",
                    title: hero.splineTitle,
                }) : useMobileVideo ? (
                    <video
                        className="hero-spline-viewer hero-mobile-video hero-spline-viewer--ready"
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="auto"
                        aria-label={hero.mobileVideoLabel}
                    >
                        <source src={mobileHeroVideoUrl} type="video/mp4" />
                    </video>
                ) : <div className="hero-spline-viewer hero-spline-viewer--static hero-spline-viewer--ready" />}
            </div>
        </section>
    );
};

export default Hero;
