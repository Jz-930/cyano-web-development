import "../globals.css";
import "../business.css";
import "../fonts.css";
import "../refinements.css";
import { LocaleProvider } from "@/components/locale-provider";
import { Header } from "@/components/interactive";
import { Footer } from "@/components/ui";
export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ path?: string[] }>;
}) {
  const { path = [] } = await params;
  const locale = path[0] === "en" ? "en" : "zh";
  return (
    <html lang={locale === "zh" ? "zh-CN" : "en"}>
      <body>
        <LocaleProvider locale={locale}>
          <a className="skip-link" href="#main">
            {locale === "zh" ? "跳转到主要内容" : "Skip to content"}
          </a>
          <Header locale={locale} />
          <main id="main">{children}</main>
          <Footer locale={locale} />
        </LocaleProvider>
      </body>
    </html>
  );
}
