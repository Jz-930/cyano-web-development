"use client";

import { useReveal } from "@/hooks/useReveal";
import { useI18n } from "@/i18n/LanguageProvider";

const PerformanceSection = () => {
    useReveal();
    const { content } = useI18n();
    const performance = content.technology.performance;
    const metrics = performance.metrics as Array<{ value: string; unit: string; label: string; desc: string }>;
    const bottomMetrics = performance.bottomMetrics as Array<[string, string]>;

    const sectionStyle: React.CSSProperties = {
        padding: "160px 0",
        borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
    };

    const containerStyle: React.CSSProperties = {
        maxWidth: "1240px",
        margin: "0 auto",
        padding: "0 32px",
    };

    const gridStyle: React.CSSProperties = {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "80px",
        alignItems: "center",
    };

    const metricCardStyle: React.CSSProperties = {
        padding: "24px",
        borderLeft: "2px solid #00F2FF",
        backgroundColor: "rgba(255,255,255,0.01)",
        marginBottom: "24px",
        transition: "all 0.3s ease",
    };

    return (
        <section style={sectionStyle}>
            <div style={containerStyle}>
                <div className="reveal performance-grid" style={gridStyle}>
                    {/* Left: Text & Key Metrics */}
                    <div>
                        <h2 style={{
                            fontSize: "clamp(2.2rem, 4vw, 3rem)",
                            fontFamily: "var(--font-heading)",
                            fontWeight: 600,
                            color: "white",
                            marginBottom: "24px",
                            letterSpacing: "-0.02em",
                        }}>
                            {performance.titlePrefix}<span style={{ color: "#00F2FF" }}>{performance.titleAccent}</span>
                        </h2>
                        <p style={{
                            color: "#888899",
                            fontSize: "1.1rem",
                            fontWeight: 300,
                            marginBottom: "48px",
                        }}>
                            {performance.description}
                        </p>

                        <div>
                            {metrics.map((metric) => (
                                <div className="metric-card" style={metricCardStyle} key={metric.label}>
                                    <h4 style={{
                                        fontSize: "2rem",
                                        fontFamily: "var(--font-heading)",
                                        fontWeight: 700,
                                        color: "white",
                                        marginBottom: "8px",
                                    }}>
                                        {metric.value}<span style={{ fontSize: "1rem", color: "#888899" }}>{metric.unit}</span>
                                    </h4>
                                    <p style={{
                                        fontSize: "0.8rem",
                                        fontFamily: "monospace",
                                        color: "#00F2FF",
                                        textTransform: "uppercase",
                                        letterSpacing: "0.15em",
                                        marginBottom: "8px",
                                    }}>
                                        {metric.label}
                                    </p>
                                    <p style={{ color: "#888899", fontSize: "0.9rem" }}>
                                        {metric.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Chart */}
                    <div style={{
                        backgroundColor: "#0A0A0C",
                        padding: "40px",
                        borderRadius: "16px",
                        border: "1px solid rgba(255,255,255,0.06)",
                    }}>
                        <h3 style={{
                            fontSize: "1.25rem",
                            fontFamily: "var(--font-heading)",
                            fontWeight: 600,
                            color: "white",
                            marginBottom: "40px",
                        }}>
                            {performance.chartTitle}
                        </h3>

                        <div style={{ marginBottom: "32px" }}>
                            {/* Bar Standard */}
                            <div style={{ marginBottom: "32px" }}>
                                <div style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    fontSize: "0.8rem",
                                    marginBottom: "8px",
                                    color: "#888899",
                                    fontFamily: "monospace",
                                    textTransform: "uppercase",
                                }}>
                                    <span>{performance.standardLabel}</span>
                                    <span>{performance.standardCost}</span>
                                </div>
                                <div style={{
                                    height: "48px",
                                    backgroundColor: "#1A1A1C",
                                    borderRadius: "4px",
                                    width: "100%",
                                }} />
                            </div>

                            {/* Bar Optimization */}
                            <div>
                                <div style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    fontSize: "0.8rem",
                                    marginBottom: "8px",
                                    color: "white",
                                    fontFamily: "monospace",
                                    textTransform: "uppercase",
                                }}>
                                    <span>{performance.cyanoLabel}</span>
                                    <span style={{ color: "#00F2FF", fontWeight: 700 }}>{performance.cyanoCost}</span>
                                </div>
                                <div style={{
                                    height: "48px",
                                    backgroundColor: "#1A1A1C",
                                    borderRadius: "4px",
                                    width: "100%",
                                    position: "relative",
                                    display: "flex",
                                    alignItems: "center",
                                }}>
                                    <div style={{
                                        height: "100%",
                                        width: "60%",
                                        backgroundColor: "#00F2FF",
                                        borderRadius: "4px",
                                        boxShadow: "0 0 20px rgba(0,242,255,0.3)",
                                    }} />
                                    <span style={{
                                        marginLeft: "16px",
                                        fontSize: "0.75rem",
                                        color: "white",
                                        fontWeight: 700,
                                    }}>
                                        {performance.savingsLabel}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div style={{
                            marginTop: "40px",
                            paddingTop: "32px",
                            borderTop: "1px solid rgba(255,255,255,0.06)",
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: "16px",
                        }}>
                            {bottomMetrics.map(([value, label]) => (
                            <div style={{ textAlign: "center" }} key={label}>
                                <div style={{
                                    fontSize: "2rem",
                                    fontWeight: 700,
                                    color: "white",
                                    marginBottom: "4px",
                                }}>
                                    {value}
                                </div>
                                <div style={{
                                    fontSize: "0.7rem",
                                    color: "#888899",
                                    textTransform: "uppercase",
                                }}>
                                    {label}
                                </div>
                            </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @media (max-width: 900px) {
                    .performance-grid {
                        grid-template-columns: 1fr !important;
                        gap: 48px !important;
                    }
                }
                .metric-card:hover {
                    background-color: rgba(255,255,255,0.02) !important;
                }
            `}</style>
        </section>
    );
};

export default PerformanceSection;
