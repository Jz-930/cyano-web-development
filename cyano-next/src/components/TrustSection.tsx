"use client";

import { useReveal } from "@/hooks/useReveal";
import { FaCloud, FaServer } from "react-icons/fa";

const TrustSection = () => {
    useReveal();

    const cardStyle: React.CSSProperties = {
        padding: "48px",
        border: "1px solid rgba(255, 255, 255, 0.06)",
        backgroundColor: "#0A0A0C",
        borderRadius: "12px",
        transition: "all 0.3s ease",
    };

    const titleStyle: React.CSSProperties = {
        fontSize: "1.8rem",
        marginBottom: "24px",
        color: "white",
        display: "flex",
        alignItems: "center",
        gap: "16px",
        fontFamily: "var(--font-heading)",
        fontWeight: 600,
    };

    const descStyle: React.CSSProperties = {
        color: "#888899",
        fontWeight: 300,
        lineHeight: 1.8,
        fontSize: "1.1rem",
    };

    return (
        <section id="deploy" style={{ padding: "160px 0", backgroundColor: "#080808", borderBottom: "1px solid rgba(255, 255, 255, 0.06)" }}>
            <div className="reveal" style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 32px" }}>
                {/* Brand Logos */}
                <div style={{ display: "flex", justifyContent: "center", gap: "60px", opacity: 0.3, fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "1.2rem", marginBottom: "100px", flexWrap: "wrap" }}>
                    <span>OPENAI</span>
                    <span>DEEPSEEK</span>
                    <span>LLAMA 3</span>
                    <span>FEISHU</span>
                    <span>MYSQL</span>
                </div>

                <h2 style={{ marginBottom: "80px", textAlign: "center", fontFamily: "var(--font-heading)", fontWeight: 600, letterSpacing: "-0.02em", fontSize: "3rem", color: "white" }}>
                    兼容并蓄，安全落地
                </h2>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "48px", maxWidth: "1000px", margin: "0 auto" }}>
                    <div style={cardStyle}>
                        <h3 style={titleStyle}>
                            <FaCloud style={{ color: "#00F2FF", fontSize: "1.5rem" }} />
                            SaaS 托管版
                        </h3>
                        <p style={descStyle}>
                            即刻接入，弹性扩展。适合快速验证与轻量级场景。我们为您提供隔离的云端环境，确保业务快速上线。
                        </p>
                    </div>
                    <div style={cardStyle}>
                        <h3 style={titleStyle}>
                            <FaServer style={{ color: "#00F2FF", fontSize: "1.5rem" }} />
                            私有化部署版
                        </h3>
                        <p style={descStyle}>
                            数据不出域，模型本地运行。提供完整的 Docker 交付与本地算力适配，确保绝对的数据主权与合规。
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TrustSection;
