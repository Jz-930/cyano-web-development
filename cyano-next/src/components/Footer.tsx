"use client";

import { useReveal } from "@/hooks/useReveal";

const Footer = () => {
    useReveal();

    const inputStyle: React.CSSProperties = {
        width: "100%",
        backgroundColor: "#111",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        padding: "20px",
        color: "white",
        fontSize: "1.1rem",
        borderRadius: "8px",
        outline: "none",
        transition: "all 0.3s ease",
    };

    const buttonStyle: React.CSSProperties = {
        width: "100%",
        marginTop: "32px",
        backgroundColor: "#00F2FF",
        color: "black",
        padding: "20px 40px",
        fontFamily: "var(--font-heading)",
        fontWeight: 700,
        fontSize: "1rem",
        textTransform: "uppercase",
        letterSpacing: "0.1em",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
        transition: "all 0.3s ease",
    };

    return (
        <footer id="contact" style={{ paddingTop: "160px", paddingBottom: "100px", borderTop: "1px solid rgba(255, 255, 255, 0.06)", backgroundColor: "black" }}>
            <div className="reveal" style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 32px", textAlign: "center" }}>
                <h2 style={{ marginBottom: "60px", fontFamily: "var(--font-heading)", fontWeight: 600, letterSpacing: "-0.02em", fontSize: "3rem", color: "white" }}>
                    Ready to upgrade?
                </h2>
                <form style={{ maxWidth: "500px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "20px" }}>
                    <input
                        type="text"
                        style={inputStyle}
                        placeholder="姓名 / Name"
                    />
                    <input
                        type="text"
                        style={inputStyle}
                        placeholder="公司 / Company"
                    />
                    <input
                        type="text"
                        style={inputStyle}
                        placeholder="工作邮箱 / Work Email"
                    />
                    <select style={{ ...inputStyle, color: "#888" }}>
                        <option>感兴趣的场景...</option>
                        <option>文档自动化</option>
                        <option>合规风控</option>
                        <option>企业知识库</option>
                    </select>
                    <button
                        type="button"
                        style={buttonStyle}
                    >
                        提交咨询
                    </button>
                </form>
                <div style={{ marginTop: "100px", color: "#888899", fontSize: "0.9rem", letterSpacing: "0.05em", opacity: 0.6 }}>
                    &copy; 2026 Cyano Intelligence. All Rights Reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
