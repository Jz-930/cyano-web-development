import type { Metadata, Viewport } from "next";
import "./globals.css";
import { GlobalStarsBackground } from "@/components/GlobalStarsBackground";
import { LanguageProvider } from "@/i18n/LanguageProvider";
import { siteContent } from "@/i18n/locales";

export const metadata: Metadata = {
  ...siteContent.cn.meta["/"],
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
    <html lang="zh-CN" suppressHydrationWarning>
      <body
        className="bg-background text-text-main font-sans antialiased"
      >
        <LanguageProvider>
          <GlobalStarsBackground />
          <div className="relative z-10">
            {children}
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}
