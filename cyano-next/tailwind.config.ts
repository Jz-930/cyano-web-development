import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "#050505",
                "bg-color": "#050505",     // Alias for bg-bg-color
                "bg-card": "#0A0A0C",      // Alias for bg-bg-card
                "bg-card-hover": "#121214", // Alias for hover states
                card: "#0A0A0C",
                "text-main": "#FFFFFF",
                "text-muted": "#888899",
                "accent-cyan": "#00F2FF",
                "accent-dim": "rgba(0, 242, 255, 0.1)",
                "accent-glow": "rgba(0, 242, 255, 0.4)",
                "border-light": "rgba(255, 255, 255, 0.06)",
                "border-hover": "rgba(255, 255, 255, 0.15)",
            },
            fontFamily: {
                sans: ["var(--font-inter)", "sans-serif"],
                heading: ["var(--font-space-grotesk)", "sans-serif"],
            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
            },
        },
    },
    plugins: [],
};
export default config;
