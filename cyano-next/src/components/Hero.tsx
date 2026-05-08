"use client";

import Link from "next/link";
import Script from "next/script";
import React from "react";

const splineViewerScript = "https://unpkg.com/@splinetool/viewer@1.12.92/build/spline-viewer.js";
const splineSceneUrl = "/spline/cyano-robot.scene.splinecode";

const Hero = () => {
    const splineViewerRef = React.useRef<HTMLElement | null>(null);
    const [sceneReady, setSceneReady] = React.useState(false);

    React.useEffect(() => {
        const viewer = splineViewerRef.current;
        if (!viewer) return;

        const handleLoadComplete = () => setSceneReady(true);

        viewer.addEventListener("load-complete", handleLoadComplete);
        return () => viewer.removeEventListener("load-complete", handleLoadComplete);
    }, []);

    return (
        <section
            className="hero-section relative flex min-h-screen items-center overflow-hidden border-b border-white/5 bg-transparent pt-24"
        >
            <Script id="spline-viewer-loader" type="module" src={splineViewerScript} strategy="afterInteractive" />

            <div className="hero-inner relative z-10">
                <div className="reveal hero-copy min-w-0 text-left">
                    <h1 className="hero-title mb-8 max-w-4xl">
                        将企业知识
                        <span className="block bg-gradient-to-r from-white via-brand-mint to-accent-cyan bg-clip-text text-transparent">
                            转化为可交付的
                        </span>
                        <span className="block bg-gradient-to-r from-brand-mint via-accent-cyan to-accent-amber bg-clip-text text-transparent">
                            AI 生产力
                        </span>
                    </h1>
                    <p className="mb-10 max-w-2xl text-[1.12rem] leading-9 text-text-muted">
                        Cyano 帮企业从业务机会梳理开始，设计定制 AI 工具、AI 工作流和托管式 AI
                        服务，让 AI 不只停留在聊天窗口，而是进入可上线、可维护、可持续合作的生产系统。
                    </p>
                    <div className="mb-9 grid max-w-2xl gap-3 sm:grid-cols-3">
                        {[
                            ["定制 AI 工具", "accent-dot"],
                            ["低启动试点", "accent-dot accent-dot--amber"],
                            ["托管式服务", "accent-dot accent-dot--blue"],
                        ].map(([label, dot]) => (
                            <div key={label} className="console-chip">
                                <span className={`${dot} mr-2`} />
                                {label}
                            </div>
                        ))}
                    </div>
                    <div className="flex flex-wrap items-center gap-4">
                        <Link href="#engagement" className="cyano-button">
                            查看合作方式
                        </Link>
                        <Link href="#cases" className="cyano-ghost-button">
                            查看落地案例
                        </Link>
                    </div>
                </div>
            </div>

            <div className="hero-scene" aria-hidden="true">
                <div className="hero-scene-glow hero-scene-glow--mint" />
                <div className="hero-scene-glow hero-scene-glow--amber" />
                {React.createElement("spline-viewer", {
                    ref: splineViewerRef,
                    className: `hero-spline-viewer ${sceneReady ? "hero-spline-viewer--ready" : ""}`,
                    url: splineSceneUrl,
                    background: "transparent",
                    "events-target": "global",
                    loading: "eager",
                    title: "Cyano live 3D robot",
                })}
            </div>
        </section>
    );
};

export default Hero;
