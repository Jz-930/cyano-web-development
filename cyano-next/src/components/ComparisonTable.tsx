"use client";

import { useReveal } from "@/hooks/useReveal";

const ComparisonTable = () => {
    useReveal();

    const rows = [
        {
            title: "驱动核心",
            bad: "个人灵感与技巧",
            good: "企业知识库 + SOP",
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                </svg>
            ),
        },
        {
            title: "稳定性",
            bad: "随机性强，难以复现",
            good: "输出稳定，可审计，可复用",
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
            ),
        },
        {
            title: "模型关系",
            bad: "深度绑定特定模型习惯",
            good: "模型无关 (Model Agnostic)",
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                    <path d="M8 21h8M12 17v4" />
                </svg>
            ),
        },
        {
            title: "可迁移性",
            bad: "不可迁移，永远跟不上大模型发展速度",
            good: "可迁移，永远适用当下最合适的模型",
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 1l4 4-4 4" />
                    <path d="M3 11V9a4 4 0 0 1 4-4h14" />
                    <path d="M7 23l-4-4 4-4" />
                    <path d="M21 13v2a4 4 0 0 1-4 4H3" />
                </svg>
            ),
        },
    ];

    // Status icons
    const CrossIcon = () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" style={{ marginRight: "12px", flexShrink: 0 }}>
            <circle cx="12" cy="12" r="10" opacity="0.2" />
            <path d="M15 9l-6 6M9 9l6 6" />
        </svg>
    );

    const CheckIcon = () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00F2FF" strokeWidth="2" style={{ marginRight: "12px", flexShrink: 0 }}>
            <circle cx="12" cy="12" r="10" opacity="0.2" />
            <path d="M9 12l2 2 4-4" />
        </svg>
    );

    const sectionStyle: React.CSSProperties = {
        padding: "140px 0",
        borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
    };

    const containerStyle: React.CSSProperties = {
        maxWidth: "1240px",
        margin: "0 auto",
        padding: "0 32px",
    };

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

    const headerRowStyle: React.CSSProperties = {
        display: "grid",
        gridTemplateColumns: "1fr 1.5fr 1.5fr",
        borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
        backgroundColor: "rgba(255, 255, 255, 0.02)",
    };

    const dataRowStyle: React.CSSProperties = {
        display: "grid",
        gridTemplateColumns: "1fr 1.5fr 1.5fr",
        borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
        transition: "background-color 0.3s",
    };

    return (
        <section style={sectionStyle}>
            {/* Frosted Glass Background Container */}
            <div style={{
                maxWidth: "1320px",
                margin: "0 auto",
                padding: "60px",
                backgroundColor: "rgba(10, 10, 12, 0.75)",
                backdropFilter: "blur(20px)",
                borderRadius: "24px",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                position: "relative",
                zIndex: 1,
            }}>
                <div style={containerStyle}>
                    <h2 style={{
                        textAlign: "center",
                        marginBottom: "80px",
                        fontFamily: "var(--font-heading)",
                        fontWeight: 600,
                        fontSize: "clamp(2rem, 4vw, 3rem)",
                        letterSpacing: "-0.02em",
                        color: "white",
                    }}>
                        从个人技巧进化为系统能力
                    </h2>

                    <div className="reveal" style={{ width: "100%", borderTop: "1px solid rgba(255, 255, 255, 0.06)", overflowX: "auto" }}>
                        {/* Header Row */}
                        <div className="table-row" style={headerRowStyle}>
                            <div style={headerCellStyle}>
                                Dimension
                            </div>
                            <div style={headerCellStyle}>
                                Traditional Prompt Engineering
                            </div>
                            <div style={{
                                ...headerCellStyle,
                                color: "#00F2FF",
                                fontWeight: 700,
                                position: "relative",
                                overflow: "hidden",
                            }}>
                                <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0, 242, 255, 0.03)" }} />
                                <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "2px", backgroundColor: "#00F2FF", opacity: 0.5, boxShadow: "0 0 10px rgba(0,242,255,0.5)" }} />
                                <span style={{ position: "relative", zIndex: 10 }}>Cyano Intelligence</span>
                            </div>
                        </div>

                        {/* Data Rows */}
                        {rows.map((row, i) => (
                            <div
                                key={i}
                                className="table-row data-row"
                                style={dataRowStyle}
                            >
                                <div style={{ ...dataCellStyle, fontFamily: "var(--font-heading)", color: "#888899", fontWeight: 500, display: "flex", alignItems: "center", gap: "16px" }}>
                                    <span style={{ color: "#00F2FF", opacity: 0.6 }}>{row.icon}</span>
                                    {row.title}
                                </div>
                                <div style={{ ...dataCellStyle, color: "#888899", opacity: 0.8, lineHeight: 1.6, fontWeight: 300, display: "flex", alignItems: "center" }}>
                                    <CrossIcon />
                                    {row.bad}
                                </div>
                                <div style={{ ...dataCellStyle, color: "white", fontWeight: 500, position: "relative", lineHeight: 1.6, display: "flex", alignItems: "center" }}>
                                    <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0, 242, 255, 0.015)" }} />
                                    <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "2px", backgroundColor: "#00F2FF", opacity: 0.3 }} />
                                    <span style={{ position: "relative", zIndex: 10, display: "flex", alignItems: "center" }}>
                                        <CheckIcon />
                                        {row.good}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style jsx>{`
                @media (max-width: 768px) {
                    .table-row {
                        grid-template-columns: 1fr !important;
                    }
                }
                .data-row:hover {
                    background-color: rgba(255, 255, 255, 0.02);
                }
            `}</style>
        </section>
    );
};

export default ComparisonTable;
