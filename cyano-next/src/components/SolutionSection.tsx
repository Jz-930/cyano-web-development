"use client";

import { useReveal } from "@/hooks/useReveal";

const SolutionSection = () => {
    useReveal();

    const levels = [
        {
            level: "Level 1",
            title: "Immutable Directives",
            weight: "0.4",
            strategy: "无损保留 (Lossless Retention)",
            desc: "代理配置、输出格式等最高权重指令，100% 召回。",
        },
        {
            level: "Level 2",
            title: "Key States",
            weight: "0.3",
            strategy: "结构化摘要 (Structured Summary)",
            desc: '将"登录成功"、"数据解析中"等节点转化为高密度状态数据。',
        },
        {
            level: "Level 3",
            title: "Reasoning Chains",
            weight: "0.2",
            strategy: "激进剪枝 (Aggressive Pruning)",
            desc: "针对 CoT (思维链) 过程，仅保留最终结论，剔除冗长的试错路径。",
        },
        {
            level: "Level 4",
            title: "Noise & Logs",
            weight: "0.1",
            strategy: "根因提取 (Root Cause Only)",
            desc: "遇到报错时，仅保留错误原因，自动清洗堆栈噪声。",
        }
    ];

    const sectionStyle: React.CSSProperties = {
        padding: "160px 0",
        borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
        position: "relative",
        overflow: "hidden",
    };

    const containerStyle: React.CSSProperties = {
        maxWidth: "1400px",
        margin: "0 auto",
        padding: "0 32px",
        position: "relative",
        zIndex: 10,
    };

    const headerStyle: React.CSSProperties = {
        textAlign: "center",
        marginBottom: "80px",
    };

    const gridStyle: React.CSSProperties = {
        display: "grid",
        gridTemplateColumns: "1fr 2fr 1fr",
        gap: "48px",
        alignItems: "center",
    };

    return (
        <section style={sectionStyle}>
            {/* Background Decoration */}
            <div style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "800px",
                height: "800px",
                background: "radial-gradient(circle at center, rgba(0,242,255,0.03) 0%, transparent 70%)",
                pointerEvents: "none",
            }} />

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
                        智能上下文<span style={{ color: "#00F2FF", fontStyle: "italic" }}>估值</span>引擎
                    </h2>
                    <p style={{
                        color: "#888899",
                        fontSize: "1.25rem",
                        fontWeight: 300,
                        maxWidth: "700px",
                        margin: "0 auto",
                    }}>
                        像操作系统管理虚拟内存一样，动态管理 Agent 的长期记忆。
                    </p>
                </div>

                <div className="reveal solution-grid" style={gridStyle}>
                    {/* Left: Input Stream (Raw) */}
                    <div style={{ opacity: 0.5 }}>
                        <div style={{
                            fontSize: "0.7rem",
                            fontFamily: "monospace",
                            color: "#888899",
                            textTransform: "uppercase",
                            letterSpacing: "0.15em",
                            marginBottom: "16px",
                        }}>
                            Raw Conversation Flow
                        </div>
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div
                                key={i}
                                style={{
                                    height: "32px",
                                    backgroundColor: "#1A1A1C",
                                    border: "1px solid #333",
                                    borderRadius: "4px",
                                    marginBottom: "12px",
                                    opacity: 1 - i * 0.1,
                                }}
                            />
                        ))}
                    </div>

                    {/* Center: The Funnel / Engine */}
                    <div style={{ position: "relative" }}>
                        <div style={{
                            position: "absolute",
                            inset: 0,
                            background: "linear-gradient(to bottom, transparent, rgba(0,242,255,0.05), transparent)",
                            pointerEvents: "none",
                        }} />

                        {levels.map((level, index) => (
                            <div
                                key={index}
                                className="level-card"
                                style={{
                                    backgroundColor: "#0A0A0C",
                                    border: "1px solid rgba(255, 255, 255, 0.06)",
                                    padding: "24px",
                                    borderRadius: "8px",
                                    marginBottom: "8px",
                                    marginLeft: `${index * 24}px`,
                                    marginRight: `${index * 24}px`,
                                    opacity: 1 - (index * 0.05),
                                    transition: "all 0.3s ease",
                                }}
                            >
                                <div style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    marginBottom: "12px",
                                }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                        <span style={{
                                            fontSize: "0.7rem",
                                            fontFamily: "monospace",
                                            color: "#00F2FF",
                                            backgroundColor: "rgba(0,242,255,0.1)",
                                            padding: "4px 8px",
                                            borderRadius: "4px",
                                        }}>
                                            {level.level}
                                        </span>
                                        <h4 style={{
                                            fontSize: "1.1rem",
                                            fontFamily: "var(--font-heading)",
                                            fontWeight: 700,
                                            color: "white",
                                        }}>
                                            {level.title}
                                        </h4>
                                    </div>
                                    <div style={{
                                        fontSize: "0.7rem",
                                        fontFamily: "monospace",
                                        color: "#888899",
                                    }}>
                                        Weight: <span style={{ color: "white" }}>{level.weight}</span>
                                    </div>
                                </div>

                                <div style={{ paddingLeft: "0" }}>
                                    <div style={{
                                        fontSize: "0.9rem",
                                        color: "white",
                                        fontWeight: 500,
                                        marginBottom: "4px",
                                    }}>
                                        {level.strategy}
                                    </div>
                                    <div style={{
                                        fontSize: "0.8rem",
                                        color: "#888899",
                                        fontWeight: 300,
                                    }}>
                                        {level.desc}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Right: Output (High Value) */}
                    <div style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}>
                        <div style={{
                            fontSize: "0.7rem",
                            fontFamily: "monospace",
                            color: "#00F2FF",
                            textTransform: "uppercase",
                            letterSpacing: "0.15em",
                            marginBottom: "20px",
                        }}>
                            High-Value Memory
                        </div>
                        <div style={{
                            width: "180px",
                            height: "240px",
                            backgroundColor: "rgba(0,242,255,0.03)",
                            border: "1px solid #00F2FF",
                            borderRadius: "12px",
                            boxShadow: "0 0 40px rgba(0,242,255,0.1)",
                            padding: "20px",
                            display: "flex",
                            flexDirection: "column",
                            gap: "12px",
                            position: "relative",
                            overflow: "hidden",
                        }}>
                            <div style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: "2px",
                                backgroundColor: "#00F2FF",
                                boxShadow: "0 0 10px #00F2FF",
                            }} />
                            <div style={{ width: "75%", height: "8px", backgroundColor: "#00F2FF", opacity: 0.5, borderRadius: "4px" }} />
                            <div style={{ width: "50%", height: "8px", backgroundColor: "#00F2FF", opacity: 0.3, borderRadius: "4px" }} />
                            <div style={{ width: "100%", height: "4px", backgroundColor: "rgba(255,255,255,0.1)", borderRadius: "4px", marginTop: "16px" }} />
                            <div style={{ width: "100%", height: "4px", backgroundColor: "rgba(255,255,255,0.1)", borderRadius: "4px" }} />
                            <div style={{ width: "67%", height: "4px", backgroundColor: "rgba(255,255,255,0.1)", borderRadius: "4px" }} />

                            <div style={{
                                marginTop: "auto",
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                            }}>
                                <div style={{
                                    width: "8px",
                                    height: "8px",
                                    borderRadius: "50%",
                                    backgroundColor: "#00F2FF",
                                }} />
                                <span style={{
                                    fontSize: "0.65rem",
                                    color: "#00F2FF",
                                    fontFamily: "monospace",
                                }}>
                                    Optimized
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @media (max-width: 1024px) {
                    .solution-grid {
                        grid-template-columns: 1fr !important;
                        gap: 48px !important;
                    }
                }
                .level-card:hover {
                    border-color: #00F2FF !important;
                }
            `}</style>
        </section>
    );
};

export default SolutionSection;
