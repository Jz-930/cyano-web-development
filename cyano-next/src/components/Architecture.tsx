"use client";

import { useReveal } from "@/hooks/useReveal";
import { useState } from "react";

const Architecture = () => {
    useReveal();
    const [activeStep, setActiveStep] = useState(1);

    const steps = [
        {
            id: 0,
            title: "01. 知识摄入层 (Ingestion)",
            desc: "连接 PDF、SQL、API 等多源异构数据，建立带权限管理的动态向量索引。",
        },
        {
            id: 1,
            title: "02. 上下文编排 (RAG Engine)",
            desc: "在有限 Token 预算内，自动清洗、拼装最相关的 1% 信息，消除模型噪音。",
        },
        {
            id: 2,
            title: "03. 任务执行层 (Agent)",
            desc: "将 SOP 固化为 Playbook。包含标准步骤、校验规则与兜底机制，像代码一样执行。",
            highlight: true,
        },
        {
            id: 3,
            title: "04. 企业级治理 (Governance)",
            desc: "全链路日志审计、引用溯源、敏感词拦截。",
        },
    ];

    const layers = [
        "SaaS Application UI",
        "Cyano Agent Core",
        "RAG Context Engine",
        "Enterprise Data (Files/DB)",
    ];

    const layerMapping = [3, 2, 1, 0];

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

    return (
        <section id="architecture" style={{ padding: "140px 0", borderBottom: "1px solid rgba(255, 255, 255, 0.06)" }}>
            <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 32px", display: "flex", flexDirection: "row", gap: "80px", alignItems: "center", flexWrap: "wrap" }}>
                <div className="reveal" style={{ flex: 1, minWidth: "300px" }}>
                    <h2 style={{ marginBottom: "40px", fontSize: "2.5rem", fontFamily: "var(--font-heading)", fontWeight: 600, letterSpacing: "-0.02em", color: "white" }}>
                        Cyano 四层智能架构
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

                <div className="reveal" style={{
                    flex: 1,
                    height: "500px",
                    minWidth: "300px",
                    position: "relative",
                    background: "radial-gradient(circle at center, rgba(255,255,255,0.02) 0%, transparent 70%)",
                    border: "1px solid rgba(255, 255, 255, 0.06)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "20px",
                }}>
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
        </section>
    );
};

export default Architecture;
