"use client";

import { useReveal } from "@/hooks/useReveal";

const Philosophy = () => {
    useReveal();

    const items = [
        {
            id: "01",
            title: "知识孤岛",
            desc: "核心数据散落在文档、数据库与历史记录中，通用 AI 拿不到也用不好，回答空洞无据。",
            iconColor1: "#3FA0A6",
            iconColor2: "#7EF5D6",
        },
        {
            id: "02",
            title: "上下文受限",
            desc: "模型窗口有限，信息喂不全就会产生幻觉，导致输出结果漂移，无法处理复杂任务。",
            iconColor1: "#00F2FF",
            iconColor2: "#3FA0A6",
        },
        {
            id: "03",
            title: "输出不可控",
            desc: "同题不同答，缺乏校验规则，企业不敢将 AI 用于合同、财务等关键业务流程。",
            iconColor1: "#7EF5D6",
            iconColor2: "#00F2FF",
        },
        {
            id: "04",
            title: "无法规模化",
            desc: "依赖个别员工的 Prompt 技巧只能救急，无法沉淀为可复用的组织能力，且难以审计。",
            iconColor1: "#3FA0A6",
            iconColor2: "#062F3A",
        },
    ];

    const sectionStyle: React.CSSProperties = {
        padding: "160px 0",
        borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
    };

    const containerStyle: React.CSSProperties = {
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "0 40px",
    };

    const gridStyle: React.CSSProperties = {
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "24px",
    };

    return (
        <section id="philosophy" style={sectionStyle}>
            {/* Blur-only Background Container */}
            <div style={{
                maxWidth: "1280px",
                margin: "0 auto",
                padding: "60px",
                backdropFilter: "blur(20px)",
                borderRadius: "24px",
                border: "1px solid rgba(255, 255, 255, 0.06)",
                position: "relative",
                zIndex: 1,
            }}>
                <div style={containerStyle}>
                    <h2
                        className="reveal"
                        style={{
                            marginBottom: "100px",
                            maxWidth: "800px",
                            fontFamily: "var(--font-heading)",
                            fontWeight: 600,
                            fontSize: "clamp(2rem, 4vw, 3rem)",
                            letterSpacing: "-0.02em",
                            lineHeight: 1.2,
                            color: "white",
                        }}
                    >
                        为什么 ChatGPT 无法<br />
                        直接接管您的业务？
                    </h2>

                    <div className="reveal philosophy-grid" style={gridStyle}>
                        {items.map((item, index) => (
                            <div
                                key={item.id}
                                className="philosophy-card"
                                style={{
                                    padding: "32px",
                                    backgroundColor: "rgba(255, 255, 255, 0.03)",
                                    border: "1px solid rgba(255, 255, 255, 0.1)",
                                    borderRadius: "16px",
                                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
                                    backdropFilter: "blur(4px)",
                                    transition: "all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)",
                                    cursor: "pointer",
                                }}
                            >
                                {/* Icon */}
                                <div className="card-icon" style={{
                                    marginBottom: "24px",
                                    width: "48px",
                                    height: "48px",
                                    display: "flex",
                                    flexDirection: index === 1 ? "row" : "column",
                                    justifyContent: index === 1 ? "flex-start" : "flex-end",
                                    alignItems: index === 1 ? "center" : index === 2 ? "center" : "flex-start",
                                    transition: "filter 0.4s ease",
                                }}>
                                    {index === 0 && (
                                        <>
                                            <div style={{ width: "100%", height: "24px", backgroundColor: item.iconColor1, borderBottomLeftRadius: "24px", borderBottomRightRadius: "24px" }} />
                                            <div style={{ width: "100%", height: "12px", backgroundColor: item.iconColor2, borderBottomLeftRadius: "24px", borderBottomRightRadius: "24px", marginTop: "-4px", opacity: 0.7 }} />
                                        </>
                                    )}
                                    {index === 1 && (
                                        <>
                                            <div style={{ width: "24px", height: "40px", backgroundColor: item.iconColor1, borderTopLeftRadius: "4px", borderBottomLeftRadius: "4px" }} />
                                            <div style={{ width: "24px", height: "40px", backgroundColor: item.iconColor2, borderTopRightRadius: "24px", borderBottomRightRadius: "24px" }} />
                                        </>
                                    )}
                                    {index === 2 && (
                                        <>
                                            <div style={{ width: "40px", height: "24px", backgroundColor: item.iconColor1, borderTopLeftRadius: "24px", borderTopRightRadius: "24px" }} />
                                            <div style={{ width: "48px", height: "16px", backgroundColor: item.iconColor2, borderRadius: "2px" }} />
                                        </>
                                    )}
                                    {index === 3 && (
                                        <div style={{ position: "relative", width: "48px", height: "48px" }}>
                                            <div style={{ position: "absolute", top: 0, right: 0, width: "32px", height: "32px", backgroundColor: item.iconColor1, borderTopRightRadius: "8px" }} />
                                            <div style={{ position: "absolute", bottom: 0, left: 0, width: "32px", height: "32px", backgroundColor: item.iconColor2, borderBottomLeftRadius: "8px" }} />
                                        </div>
                                    )}
                                </div>
                                {/* Title */}
                                <h3 className="card-title" style={{
                                    fontSize: "1.25rem",
                                    fontWeight: 700,
                                    color: "white",
                                    marginBottom: "12px",
                                    fontFamily: "var(--font-heading)",
                                    transition: "color 0.4s ease",
                                }}>
                                    {item.title}
                                </h3>
                                {/* Description */}
                                <p className="card-desc" style={{
                                    fontSize: "0.95rem",
                                    lineHeight: 1.6,
                                    color: "#888899",
                                    transition: "color 0.4s ease",
                                }}>
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style jsx>{`
                @media (max-width: 1024px) {
                    .philosophy-grid {
                        grid-template-columns: repeat(2, 1fr) !important;
                    }
                }
                @media (max-width: 640px) {
                    .philosophy-grid {
                        grid-template-columns: 1fr !important;
                    }
                }
                .philosophy-card:hover {
                    background-color: rgba(63, 160, 166, 0.08) !important;
                    border-color: rgba(126, 245, 214, 0.45) !important;
                    transform: translateY(-8px);
                    box-shadow: 0 20px 60px rgba(0, 242, 255, 0.12);
                }
                .philosophy-card:hover .card-title {
                    color: #7EF5D6 !important;
                }
                .philosophy-card:hover .card-desc {
                    color: rgba(255,255,255,0.78) !important;
                }
                .philosophy-card:hover .card-icon {
                    filter: brightness(0.8) saturate(1.2);
                }
            `}</style>
        </section>
    );
};

export default Philosophy;
