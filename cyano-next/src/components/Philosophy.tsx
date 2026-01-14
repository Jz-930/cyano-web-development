"use client";

import { useReveal } from "@/hooks/useReveal";

const Philosophy = () => {
    useReveal();

    const items = [
        {
            id: "01",
            title: "知识孤岛",
            desc: "核心数据散落在文档、数据库与历史记录中，通用 AI 拿不到也用不好，回答空洞无据。",
            iconColor1: "#60A5FA",
            iconColor2: "#93C5FD",
        },
        {
            id: "02",
            title: "上下文受限",
            desc: "模型窗口有限，信息喂不全就会产生幻觉，导致输出结果漂移，无法处理复杂任务。",
            iconColor1: "#EF4444",
            iconColor2: "#FDA4AF",
        },
        {
            id: "03",
            title: "输出不可控",
            desc: "同题不同答，缺乏校验规则，企业不敢将 AI 用于合同、财务等关键业务流程。",
            iconColor1: "#BEF264",
            iconColor2: "#22C55E",
        },
        {
            id: "04",
            title: "无法规模化",
            desc: "依赖个别员工的 Prompt 技巧只能救急，无法沉淀为可复用的组织能力，且难以审计。",
            iconColor1: "#A78BFA",
            iconColor2: "#7C3AED",
        },
    ];

    // Card style object to guarantee rendering
    const cardStyle: React.CSSProperties = {
        padding: "32px",
        backgroundColor: "rgba(255, 255, 255, 0.03)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        borderRadius: "16px",
        backdropFilter: "blur(4px)",
        transition: "all 0.3s ease",
    };

    return (
        <section id="philosophy" className="section-padding">
            <div className="container">
                <h2
                    className="reveal"
                    style={{
                        marginBottom: "120px",
                        maxWidth: "800px",
                        fontFamily: "var(--font-heading)",
                        fontWeight: 600,
                        fontSize: "3rem",
                        letterSpacing: "-0.02em",
                        lineHeight: 1.2
                    }}
                >
                    为什么 ChatGPT 无法<br />
                    直接接管您的业务？
                </h2>

                <div
                    className="reveal"
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(4, 1fr)",
                        gap: "24px",
                    }}
                >
                    {items.map((item, index) => (
                        <div key={item.id} style={cardStyle}>
                            {/* Icon */}
                            <div style={{ marginBottom: "24px", width: "48px", height: "48px", display: "flex", flexDirection: index === 1 ? "row" : "column", justifyContent: index === 1 ? "flex-start" : "flex-end", alignItems: index === 1 ? "center" : index === 2 ? "center" : "flex-start" }}>
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
                            <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "white", marginBottom: "12px", fontFamily: "var(--font-heading)" }}>
                                {item.title}
                            </h3>
                            {/* Description */}
                            <p style={{ fontSize: "0.95rem", lineHeight: 1.6, color: "#888899" }}>
                                {item.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Philosophy;
