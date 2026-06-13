"use client";

import { useReveal } from "@/hooks/useReveal";
import { useState } from "react";
import { useI18n } from "@/i18n/LanguageProvider";

const Architecture = () => {
    useReveal();
    const { content } = useI18n();
    const architecture = content.technology.architecture;
    const [activeStep, setActiveStep] = useState(1);
    const steps = architecture.steps as Array<{ id: number; title: string; desc: string; highlight?: boolean }>;
    const layers = architecture.layers as string[];

    const layerMapping = [3, 2, 1, 0];

    const sectionStyle: React.CSSProperties = {
        padding: "140px 0",
        borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
    };

    const containerStyle: React.CSSProperties = {
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "0 32px",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "80px",
        alignItems: "center",
    };

    const stepStyle: React.CSSProperties = {
        padding: "32px 0",
        borderTop: "1px solid rgba(255, 255, 255, 0.06)",
        cursor: "default",
    };

    const layerBoxStyle = (isActive: boolean): React.CSSProperties => ({
        width: "240px",
        height: "50px",
        border: isActive ? "1px solid #00F2FF" : "1px solid rgba(255, 255, 255, 0.06)",
        backgroundColor: isActive ? "rgba(0, 242, 255, 0.02)" : "rgba(0, 0, 0, 0.5)",
        backdropFilter: "blur(5px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--font-heading)",
        fontSize: "12px",
        letterSpacing: "1px",
        color: isActive ? "#00F2FF" : "#888899",
        boxShadow: isActive ? "0 0 30px rgba(0, 242, 255, 0.05)" : "none",
        transition: "all 0.5s ease",
    });

    const diagramStyle: React.CSSProperties = {
        height: "500px",
        position: "relative",
        background: "radial-gradient(circle at center, rgba(255,255,255,0.02) 0%, transparent 70%)",
        border: "1px solid rgba(255, 255, 255, 0.06)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "20px",
    };

    return (
        <section id="architecture" style={sectionStyle}>
            {/* Frosted Glass Background Container */}
            <div style={{
                maxWidth: "1280px",
                margin: "0 auto",
                padding: "60px",
                backgroundColor: "rgba(10, 10, 12, 0.75)",
                backdropFilter: "blur(20px)",
                borderRadius: "24px",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                position: "relative",
                zIndex: 1,
            }}>
                <div className="architecture-container" style={containerStyle}>
                    <div className="reveal">
                        <h2 style={{
                            marginBottom: "40px",
                            fontSize: "clamp(2rem, 3vw, 2.5rem)",
                            fontFamily: "var(--font-heading)",
                            fontWeight: 600,
                            letterSpacing: "-0.02em",
                            color: "white",
                        }}>
                            {architecture.title}
                        </h2>

                        {steps.map((step, index) => (
                            <div
                                key={index}
                                style={stepStyle}
                                onMouseEnter={() => setActiveStep(index)}
                            >
                                <h4 style={{
                                    fontSize: "1.2rem",
                                    marginBottom: "8px",
                                    display: "flex",
                                    alignItems: "center",
                                    fontFamily: "var(--font-heading)",
                                    fontWeight: 600,
                                    color: step.highlight ? "#00F2FF" : (activeStep === index ? "white" : "#888899"),
                                    transition: "color 0.3s ease",
                                }}>
                                    <span style={{
                                        width: "6px",
                                        height: "6px",
                                        backgroundColor: activeStep === index ? "#00F2FF" : "#333",
                                        marginRight: "16px",
                                        borderRadius: "50%",
                                        boxShadow: activeStep === index ? "0 0 10px #00F2FF" : "none",
                                        transition: "all 0.5s ease",
                                    }} />
                                    {step.title}
                                </h4>
                                <p style={{ color: "#888899", fontWeight: 300, paddingLeft: "22px" }}>{step.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="reveal" style={diagramStyle}>
                        {layers.map((text, idx) => {
                            const isActive = layerMapping[activeStep] === idx;
                            return (
                                <div key={idx} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                    <div style={layerBoxStyle(isActive)}>
                                        {text}
                                    </div>
                                    {idx < 3 && (
                                        <div style={{
                                            width: "1px",
                                            height: "30px",
                                            background: "linear-gradient(to bottom, transparent, #333, transparent)",
                                            margin: "8px 0",
                                        }} />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <style jsx>{`
                @media (max-width: 900px) {
                    .architecture-container {
                        grid-template-columns: 1fr !important;
                        gap: 48px !important;
                    }
                }
            `}</style>
        </section>
    );
};

export default Architecture;
