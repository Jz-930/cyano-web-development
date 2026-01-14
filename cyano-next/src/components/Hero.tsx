"use client";

import Link from "next/link";

const Hero = () => {
    const labelStyle: React.CSSProperties = {
        display: "inline-block",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        backgroundColor: "rgba(255, 255, 255, 0.03)",
        padding: "6px 16px",
        borderRadius: "50px",
        fontSize: "12px",
        fontFamily: "var(--font-heading)",
        color: "#00F2FF",
        marginBottom: "30px",
        letterSpacing: "1px",
    };

    const h1Style: React.CSSProperties = {
        fontSize: "clamp(3rem, 8vw, 5rem)",
        lineHeight: 1.05,
        marginBottom: "32px",
        fontFamily: "var(--font-heading)",
        fontWeight: 600,
        letterSpacing: "-0.02em",
        background: "linear-gradient(180deg, #FFFFFF 0%, #888888 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
    };

    const pStyle: React.CSSProperties = {
        fontSize: "1.25rem",
        color: "#888899",
        fontWeight: 300,
        maxWidth: "760px",
        margin: "0 auto 48px",
        lineHeight: 1.7,
    };

    const btnPrimaryStyle: React.CSSProperties = {
        display: "inline-block",
        backgroundColor: "#00F2FF",
        color: "black",
        padding: "16px 40px",
        fontWeight: 700,
        fontSize: "14px",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        border: "none",
        transition: "all 0.3s ease",
        textDecoration: "none",
    };

    const linkSecondaryStyle: React.CSSProperties = {
        marginLeft: "24px",
        fontSize: "14px",
        color: "#888899",
        textDecoration: "none",
        borderBottom: "1px solid transparent",
        transition: "all 0.3s ease",
    };

    return (
        <section style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", position: "relative", overflow: "hidden" }}>
            {/* Background Glow */}
            <div style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: "800px",
                height: "800px",
                background: "radial-gradient(circle, rgba(0,242,255,0.06) 0%, rgba(0,0,0,0) 60%)",
                transform: "translate(-50%, -50%)",
                zIndex: -1,
                pointerEvents: "none",
            }} />

            <div className="reveal" style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 32px" }}>
                <div style={labelStyle}>
                    ENTERPRISE AI INFRASTRUCTURE
                </div>
                <h1 style={h1Style}>
                    将企业知识<br />转化为可交付的 AI 生产力
                </h1>
                <p style={pStyle}>
                    不微调模型，不改变业务流。Cyano 为企业构建"知识+流程+治理"的智能中台，让 AI 从"聊天玩具"进化为稳定、可控的数字员工。
                </p>
                <div>
                    <Link href="#contact" style={btnPrimaryStyle}>
                        探索解决方案
                    </Link>
                    <Link href="#cases" style={linkSecondaryStyle}>
                        查看案例 ↓
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default Hero;
