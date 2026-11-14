import "../styles/site.css";
import "../styles/cjk-font.css";
import localFont from "next/font/local";
import { Header } from "@/components/Header";
import { MotionRuntime } from "@/components/v3/MotionRuntime";
import { pick, siteCopy } from "@/lib/content";

const manropeDisplay = localFont({
  src: "../fonts/manrope-latin.woff2",
  variable: "--font-display",
  display: "swap",
  weight: "200 800",
});

const interLatin = localFont({
  src: "../fonts/inter-latin.woff2",
  variable: "--font-sans",
  display: "swap",
  weight: "100 900",
});

const jetbrainsMono = localFont({
  src: "../fonts/jetbrains-mono-latin.woff2",
  variable: "--font-mono",
  display: "swap",
  weight: "500",
  preload: false,
});

export default function ZhRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="zh-CN"
      className={`${manropeDisplay.variable} ${interLatin.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        <a className="skip-link" href="#main">
          {pick("zh", siteCopy.nav.skipToMain)}
        </a>
        <Header locale="zh" />
        <MotionRuntime />
        {children}
      </body>
    </html>
  );
}
