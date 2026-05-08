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
                background: "#030607",
                "bg-color": "#030607",     // Alias for bg-bg-color
                "bg-card": "#071012",      // Alias for bg-bg-card
                "bg-card-hover": "#0D191B", // Alias for hover states
                card: "#0A0A0C",
                "text-main": "#FFFFFF",
                "text-muted": "#91A3A6",
                "brand-teal": "#3FA0A6",
                "brand-mint": "#7EF5D6",
                "deep-teal": "#062F3A",
                "accent-cyan": "#00F2FF",
                "accent-amber": "#FFCF5C",
                "accent-coral": "#FF6B6B",
                "accent-blue": "#5D8DFF",
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
