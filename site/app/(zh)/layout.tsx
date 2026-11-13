import "../styles/site.css";
import "../styles/cjk-font.css";
import localFont from "next/font/local";
import { Header } from "@/components/Header";
import { pick, siteCopy } from "@/lib/content";

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
  weight: "100 800",
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
      className={`${interLatin.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        <a className="skip-link" href="#main">
          {pick("zh", siteCopy.nav.skipToMain)}
        </a>
        <Header locale="zh" />
        {children}
      </body>
    </html>
  );
}
