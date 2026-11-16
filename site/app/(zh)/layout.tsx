import "../styles/site.css";
import "../styles/cjk-font.css";
import localFont from "next/font/local";
import cjkPreload from "../fonts/cjk-preload.json";
import { Header } from "@/components/Header";
import { MotionRuntime } from "@/components/v4/MotionRuntime";
import { PaperField } from "@/components/v4/PaperField";
import { RouteFocus } from "@/components/v4/RouteFocus";
import { RouteTransitions } from "@/components/v4/RouteTransitions";
import { SiteFooter } from "@/components/v4/SiteFooter";
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
      suppressHydrationWarning
      className={`${manropeDisplay.variable} ${interLatin.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js')",
          }}
        />
        <link
          rel="preload"
          href={cjkPreload.core}
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <a className="skip-link" href="#main">
          {pick("zh", siteCopy.nav.skipToMain)}
        </a>
        <Header locale="zh" />
        <RouteFocus />
        <PaperField />
        <MotionRuntime />
        <RouteTransitions>{children}</RouteTransitions>
        <SiteFooter locale="zh" />
      </body>
    </html>
  );
}
