"use client";

import { useReveal } from "@/hooks/useReveal";

const ComparisonTable = () => {
    useReveal();

    const rows = [
        {
            title: "驱动核心",
            bad: "个人灵感与技巧",
            good: "企业知识库 + SOP",
        },
        {
            title: "稳定性",
            bad: "随机性强，难以复现",
            good: "输出稳定，可审计，可复用",
        },
        {
            title: "模型关系",
            bad: "深度绑定特定模型习惯",
            good: "模型无关 (Model Agnostic)",
        },
    ];

    const headerCellStyle: React.CSSProperties = {
        padding: "40px",
        fontSize: "0.85rem",
        textTransform: "uppercase",
        letterSpacing: "0.1em",
        fontFamily: "var(--font-heading)",
        color: "#888899",
        fontWeight: 600,
    };

    const dataCellStyle: React.CSSProperties = {
        padding: "40px",
        fontSize: "1rem",
        borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
    };

    return (
        <section style={{ padding: "140px 0", borderBottom: "1px solid rgba(255, 255, 255, 0.06)" }}>
            <div style={{ maxWidth: "1240px", margin: "0 auto", padding: "0 32px" }}>
                <h2 style={{ textAlign: "center", marginBottom: "80px", fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: "3rem", letterSpacing: "-0.02em", color: "white" }}>
                    从"个人技巧"进化为"系统能力"
                </h2>
                <div className="reveal" style={{ width: "100%", borderTop: "1px solid rgba(255, 255, 255, 0.06)" }}>
                    {/* Header Row */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr 1.5fr", borderBottom: "1px solid rgba(255, 255, 255, 0.06)", backgroundColor: "rgba(255, 255, 255, 0.02)" }}>
                        <div style={headerCellStyle}>
                            Dimension
                        </div>
                        <div style={headerCellStyle}>
                            Traditional Prompt Engineering
                        </div>
                        <div style={{ ...headerCellStyle, color: "#00F2FF", fontWeight: 700, position: "relative", overflow: "hidden" }}>
                            <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0, 242, 255, 0.03)" }} />
                            <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "2px", backgroundColor: "#00F2FF", opacity: 0.5, boxShadow: "0 0 10px rgba(0,242,255,0.5)" }} />
                            <span style={{ position: "relative", zIndex: 10 }}>Cyano Intelligence</span>
                        </div>
                    </div>
                    {/* Data Rows */}
                    {rows.map((row, i) => (
                        <div
                            key={i}
                            style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr 1.5fr", borderBottom: "1px solid rgba(255, 255, 255, 0.06)", transition: "background-color 0.3s" }}
                        >
                            <div style={{ ...dataCellStyle, fontFamily: "var(--font-heading)", color: "#888899", fontWeight: 500 }}>
                                {row.title}
                            </div>
                            <div style={{ ...dataCellStyle, color: "#888899", opacity: 0.8, lineHeight: 1.6, fontWeight: 300 }}>
                                {row.bad}
                            </div>
                            <div style={{ ...dataCellStyle, color: "white", fontWeight: 500, position: "relative", lineHeight: 1.6 }}>
                                <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0, 242, 255, 0.015)" }} />
                                <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "2px", backgroundColor: "#00F2FF", opacity: 0.3 }} />
                                <span style={{ position: "relative", zIndex: 10 }}>{row.good}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ComparisonTable;
