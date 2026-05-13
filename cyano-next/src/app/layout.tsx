import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { GlobalStarsBackground } from "@/components/GlobalStarsBackground";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600"],
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Cyano | 定制 AI 产品与企业 AI 工作流",
  description: "Cyano 帮企业定制 AI 工具、AI 工作流和托管式 AI 服务，将企业知识转化为可交付的 AI 生产力。",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/logo.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  userScalable: true,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} bg-background text-text-main font-sans antialiased`}
      >
        <GlobalStarsBackground />
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}
