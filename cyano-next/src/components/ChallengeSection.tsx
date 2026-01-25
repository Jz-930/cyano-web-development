"use client";

import { useReveal } from "@/hooks/useReveal";

const ChallengeSection = () => {
    useReveal();

    const challenges = [
        {
            icon: (
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M24 4V44" stroke="#00F2FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M4 24H44" stroke="#00F2FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M34 14L44 4" stroke="#00F2FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M14 34L4 44" stroke="#00F2FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            ),
            title: "Cost Explosion",
            subtitle: "成本失控",
            desc: "随着对话轮数增加，全量历史传输导致 API 成本呈指数级上升。单次对话成本可能翻几十倍。"
        },
        {
            icon: (
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="24" cy="24" r="20" stroke="#00F2FF" strokeWidth="2" />
                    <path d="M24 10V24L34 34" stroke="#00F2FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            ),
            title: "Latency Spikes",
            subtitle: "首字延迟 (TTFT)",
            desc: "上下文窗口负载过高会导致 Time-To-First-Token (首字时间) 显著增加，破坏实时交互体验。"
        },
        {
            icon: (
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M24 4L4 44H44L24 4Z" stroke="#00F2FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M24 14V34" stroke="#00F2FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="24" cy="38" r="2" fill="#00F2FF" />
                </svg>
            ),
            title: "\"Lost in the Middle\"",
            subtitle: "中间迷失效应",
            desc: "海量噪声会导致模型注意力分散。更多的数据不等于更智能，反而会导致模型忽略中间的关键指令。"
        }
    ];

    const sectionStyle: React.CSSProperties = {
        padding: "160px 0",
        borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
    };

    const containerStyle: React.CSSProperties = {
        maxWidth: "1240px",
        margin: "0 auto",
        padding: "0 32px",
    };

    const headerStyle: React.CSSProperties = {
        textAlign: "center",
        marginBottom: "80px",
    };

    const gridStyle: React.CSSProperties = {
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "32px",
    };

    const cardStyle: React.CSSProperties = {
        padding: "32px",
        backgroundColor: "#0A0A0C",
        border: "1px solid rgba(255, 255, 255, 0.06)",
        borderRadius: "12px",
        transition: "all 0.4s ease",
    };

    return (
        <section style={sectionStyle}>
            <div style={containerStyle}>
                <div className="reveal" style={headerStyle}>
                    <h2 style={{
                        fontSize: "clamp(2.5rem, 5vw, 3.5rem)",
                        fontFamily: "var(--font-heading)",
                        fontWeight: 600,
                        color: "white",
                        marginBottom: "24px",
                        letterSpacing: "-0.02em",
                    }}>
                        长上下文 <span style={{ color: "#00F2FF" }}>Agents</span> 的不可能三角
                    </h2>
                    <p style={{
                        color: "#888899",
                        fontSize: "1.25rem",
                        fontWeight: 300,
                        maxWidth: "700px",
                        margin: "0 auto",
                    }}>
                        随着对话深度增加，暴力堆砌 Token 只会带来系统性崩溃。
                    </p>
                </div>

                {/* Triangle Layout Container */}
                <div className="reveal" style={{ position: "relative", maxWidth: "900px", margin: "0 auto" }}>
                    {/* SVG Triangle Lines */}
                    <svg
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            pointerEvents: "none",
                            zIndex: 0,
                        }}
                        viewBox="0 0 900 600"
                        preserveAspectRatio="xMidYMid meet"
                    >
                        {/* Triangle connecting lines */}
                        <path
                            d="M 450 80 L 150 480 L 750 480 Z"
                            fill="none"
                            stroke="#00F2FF"
                            strokeWidth="1"
                            strokeDasharray="8 8"
                            opacity="0.3"
                        />
                        {/* Glow effect */}
                        <path
                            d="M 450 80 L 150 480 L 750 480 Z"
                            fill="none"
                            stroke="#00F2FF"
                            strokeWidth="2"
                            strokeDasharray="8 8"
                            opacity="0.1"
                            filter="blur(4px)"
                        />
                    </svg>

                    {/* Top Card (Card 0) */}
                    <div style={{ display: "flex", justifyContent: "center", marginBottom: "60px", position: "relative", zIndex: 1 }}>
                        <div
                            className="challenge-card"
                            style={{
                                ...cardStyle,
                                width: "320px",
                                textAlign: "center",
                            }}
                        >
                            <div style={{ marginBottom: "24px", opacity: 0.8, display: "flex", justifyContent: "center" }}>
                                {challenges[0].icon}
                            </div>
                            <h3 style={{
                                fontSize: "1.5rem",
                                fontFamily: "var(--font-heading)",
                                fontWeight: 700,
                                color: "white",
                                marginBottom: "8px",
                            }}>
                                {challenges[0].title}
                            </h3>
                            <p style={{
                                fontSize: "0.85rem",
                                fontFamily: "monospace",
                                color: "#00F2FF",
                                marginBottom: "20px",
                                textTransform: "uppercase",
                                letterSpacing: "0.1em",
                                opacity: 0.7,
                            }}>
                                {challenges[0].subtitle}
                            </p>
                            <p style={{
                                color: "#888899",
                                lineHeight: 1.7,
                                fontWeight: 300,
                            }}>
                                {challenges[0].desc}
                            </p>
                        </div>
                    </div>

                    {/* Bottom Two Cards (Card 1 & 2) */}
                    <div style={{ display: "flex", justifyContent: "space-between", gap: "48px", position: "relative", zIndex: 1 }}>
                        {[1, 2].map((cardIndex) => (
                            <div
                                key={cardIndex}
                                className="challenge-card"
                                style={{
                                    ...cardStyle,
                                    flex: 1,
                                    maxWidth: "380px",
                                    textAlign: "center",
                                }}
                            >
                                <div style={{ marginBottom: "24px", opacity: 0.8, display: "flex", justifyContent: "center" }}>
                                    {challenges[cardIndex].icon}
                                </div>
                                <h3 style={{
                                    fontSize: "1.5rem",
                                    fontFamily: "var(--font-heading)",
                                    fontWeight: 700,
                                    color: "white",
                                    marginBottom: "8px",
                                }}>
                                    {challenges[cardIndex].title}
                                </h3>
                                <p style={{
                                    fontSize: "0.85rem",
                                    fontFamily: "monospace",
                                    color: "#00F2FF",
                                    marginBottom: "20px",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.1em",
                                    opacity: 0.7,
                                }}>
                                    {challenges[cardIndex].subtitle}
                                </p>
                                <p style={{
                                    color: "#888899",
                                    lineHeight: 1.7,
                                    fontWeight: 300,
                                }}>
                                    {challenges[cardIndex].desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style jsx>{`
                @media (max-width: 768px) {
                    .challenge-card {
                        width: 100% !important;
                        max-width: 100% !important;
                    }
                }
                .challenge-card:hover {
                    background-color: #121214 !important;
                    border-color: #00F2FF !important;
                    transform: translateY(-4px);
                }
            `}</style>
        </section>
    );
};

export default ChallengeSection;
