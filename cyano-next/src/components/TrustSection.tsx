"use client";

import { useReveal } from "@/hooks/useReveal";
import { FaCloud, FaServer } from "react-icons/fa";
import { SiOpenai, SiMysql, SiMeta } from "react-icons/si";

const TrustSection = () => {
    useReveal();

    const sectionStyle: React.CSSProperties = {
        padding: "160px 0",
        borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
    };

    const containerStyle: React.CSSProperties = {
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "0 32px",
    };

    const gridStyle: React.CSSProperties = {
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "48px",
        maxWidth: "1000px",
        margin: "0 auto",
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
        transition: "color 0.4s ease",
    };

    const descStyle: React.CSSProperties = {
        color: "#888899",
        fontWeight: 300,
        lineHeight: 1.8,
        fontSize: "1.1rem",
        transition: "color 0.4s ease",
    };

    return (
        <section id="deploy" style={sectionStyle}>
            <div className="reveal" style={containerStyle}>
                {/* Brand Logos */}
                <div style={{ display: "flex", justifyContent: "center", gap: "40px", opacity: 0.5, fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "1.1rem", marginBottom: "100px", flexWrap: "wrap", alignItems: "center" }}>
                    <div className="flex items-center gap-2">
                        <SiOpenai className="text-xl" />
                        <span>OPENAI</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <svg viewBox="0 0 1024 1024" fill="currentColor" height="1em" width="1em" className="text-xl">
                            <path d="M512 0C229.23 0 0 229.23 0 512s229.23 512 512 512 512-229.23 512-512S794.77 0 512 0zm0 946.46c-239.7 0-434.46-194.76-434.46-434.46S272.3 77.54 512 77.54 946.46 272.3 946.46 512 751.7 946.46 512 946.46zM765.3 355.6c-48.5-48.5-127.3-48.5-175.7 0L426.5 518.7c-9.4 9.4-24.6 9.4-33.9 0l-45.3-45.3c-9.4-9.4-9.4-24.6 0-33.9l45.3-45.3c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-45.3 45.3c-28.1 28.1-28.1 73.7 0 101.8l163.1 163.1c48.5 48.5 127.3 48.5 175.7 0l113.1-113.1c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0L765.3 355.6z" />
                        </svg>
                        <span>DEEPSEEK</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <SiMeta className="text-xl" />
                        <span>LLAMA 3</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <svg viewBox="0 0 24 24" fill="currentColor" height="1em" width="1em" className="text-xl">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9v-2h2v2zm0-4H9V7h2v5zm4 4h-2v-2h2v2zm0-4h-2V7h2v5z" />
                        </svg>
                        <span>FEISHU</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <SiMysql className="text-xl" />
                        <span>MYSQL</span>
                    </div>
                </div>

                <h2 style={{
                    marginBottom: "80px",
                    textAlign: "center",
                    fontFamily: "var(--font-heading)",
                    fontWeight: 600,
                    letterSpacing: "-0.02em",
                    fontSize: "clamp(2rem, 4vw, 3rem)",
                    color: "white",
                }}>
                    兼容并蓄，安全落地
                </h2>

                <div className="trust-grid" style={gridStyle}>
                    <div
                        className="trust-card"
                        style={{
                            padding: "48px",
                            border: "1px solid rgba(255, 255, 255, 0.06)",
                            backgroundColor: "#0A0A0C",
                            borderRadius: "12px",
                            transition: "all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)",
                            cursor: "pointer",
                        }}
                    >
                        <h3 className="card-title" style={titleStyle}>
                            <span className="card-icon" style={{
                                color: "#00F2FF",
                                fontSize: "1.5rem",
                                display: "flex",
                                alignItems: "center",
                                transition: "transform 0.4s ease, color 0.4s ease",
                            }}>
                                <FaCloud />
                            </span>
                            SaaS 托管版
                        </h3>
                        <p className="card-desc" style={descStyle}>
                            即刻接入，弹性扩展。适合快速验证与轻量级场景。我们为您提供隔离的云端环境，确保业务快速上线。
                        </p>
                    </div>
                    <div
                        className="trust-card"
                        style={{
                            padding: "48px",
                            border: "1px solid rgba(255, 255, 255, 0.06)",
                            backgroundColor: "#0A0A0C",
                            borderRadius: "12px",
                            transition: "all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)",
                            cursor: "pointer",
                        }}
                    >
                        <h3 className="card-title" style={titleStyle}>
                            <span className="card-icon" style={{
                                color: "#00F2FF",
                                fontSize: "1.5rem",
                                display: "flex",
                                alignItems: "center",
                                transition: "transform 0.4s ease, color 0.4s ease",
                            }}>
                                <FaServer />
                            </span>
                            私有化部署版
                        </h3>
                        <p className="card-desc" style={descStyle}>
                            数据不出域，模型本地运行。提供完整的 Docker 交付与本地算力适配，确保绝对的数据主权与合规。
                        </p>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @media (max-width: 768px) {
                    .trust-grid {
                        grid-template-columns: 1fr !important;
                        gap: 24px !important;
                    }
                }
                .trust-card:hover {
                    background-color: #121214 !important;
                    border-color: #00F2FF !important;
                    transform: translateY(-8px);
                    box-shadow: 0 20px 60px rgba(0, 242, 255, 0.15);
                }
                .trust-card:hover .card-icon {
                    transform: scale(1.2);
                }
                .trust-card:hover .card-title {
                    color: #00F2FF !important;
                }
            `}</style>
        </section>
    );
};

export default TrustSection;
