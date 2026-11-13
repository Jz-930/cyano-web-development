import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  Locale,
  t,
  text,
  routes,
  solutions,
  cases,
  insights,
} from "@/lib/content";
import {
  Home,
  Services,
  SolutionDetail,
  CasesPage,
  CaseDetail,
  Technology,
  Engagement,
  About,
  Contact,
  Insights,
  Article,
  Legal,
} from "@/components/pages";
export const dynamicParams = true;
export function generateStaticParams() {
  return routes.map((r) => ({ path: r ? r.split("/") : [] }));
}
function route(path: string[] = []) {
  const locale: Locale = path[0] === "en" ? "en" : "zh";
  return {
    locale,
    segments: locale === "en" ? path.slice(1) : path,
    path: (locale === "en" ? path.slice(1) : path).join("/"),
  };
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ path?: string[] }>;
}): Promise<Metadata> {
  const { path: raw = [] } = await params;
  const { locale, path, segments } = route(raw);
  let title = t(
    locale,
    "企业 AI 工程与定制解决方案",
    "Enterprise AI Engineering",
  );
  const map: Record<string, [string, string]> = {
    services: ["解决方案", "Solutions"],
    cases: ["案例", "Case studies"],
    technology: ["方法与技术", "Technology"],
    engagement: ["合作方式", "How we work"],
    about: ["关于我们", "About"],
    contact: ["联系我们", "Contact"],
    insights: ["洞察", "Insights"],
    privacy: ["隐私政策", "Privacy Policy"],
    terms: ["使用条款", "Terms of Use"],
  };
  if (map[path]) title = t(locale, ...map[path]);
  if (segments[0] === "cases" && segments[1])
    title = cases(locale).find((c) => c.slug === segments[1])?.title || title;
  if (segments[0] === "services" && segments[1])
    title =
      solutions(locale).find((c) => c.slug === segments[1])?.name || title;
  if (segments[0] === "insights" && segments[1])
    title =
      insights(locale).find((c) => c.slug === segments[1])?.title || title;
  const description = t(
    locale,
    "Cyano（澜屿智创）为企业定制 AI 工具、工作流与托管式服务。从业务诊断开始，交付能上线、能审计、能持续迭代的系统。",
    "Cyano builds custom enterprise AI tools, workflows and managed services. Start with a diagnosis. Ship systems you can audit, maintain and grow.",
  );
  const url = "https://cyano.app/" + raw.join("/");
  return {
    title: title + " | Cyano",
    description,
    metadataBase: new URL("https://cyano.app"),
    alternates: {
      canonical: url,
      languages: {
        "zh-CN": "https://cyano.app/" + path,
        en: "https://cyano.app/en" + (path ? "/" + path : ""),
        "x-default": "https://cyano.app/" + path,
      },
    },
    openGraph: {
      title: title + " | Cyano",
      description,
      url,
      siteName: "Cyano Intelligence",
      locale: locale === "zh" ? "zh_CN" : "en_US",
      type: "website",
      images: [
        {
          url: "/art/og.jpg",
          width: 1200,
          height: 630,
          alt: "Cyano Intelligence — " + title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: title + " | Cyano",
      description,
      images: ["/art/og.jpg"],
    },
    icons: { icon: "/icon.svg", apple: "/apple-touch-icon.png" },
  };
}
export default async function Page({
  params,
}: {
  params: Promise<{ path?: string[] }>;
}) {
  const { path: raw = [] } = await params;
  const { locale, path, segments } = route(raw);
  let content: React.ReactNode;
  if (!path) content = <Home locale={locale} />;
  else if (path === "services") content = <Services locale={locale} />;
  else if (
    segments[0] === "services" &&
    solutions(locale).some((s) => s.slug === segments[1]) &&
    segments.length === 2
  )
    content = <SolutionDetail locale={locale} slug={segments[1]} />;
  else if (path === "cases") content = <CasesPage locale={locale} />;
  else if (
    segments[0] === "cases" &&
    cases(locale).some((s) => s.slug === segments[1]) &&
    segments.length === 2
  )
    content = <CaseDetail locale={locale} slug={segments[1]} />;
  else if (path === "technology") content = <Technology locale={locale} />;
  else if (path === "engagement") content = <Engagement locale={locale} />;
  else if (path === "about") content = <About locale={locale} />;
  else if (path === "contact") content = <Contact locale={locale} />;
  else if (path === "insights") content = <Insights locale={locale} />;
  else if (
    segments[0] === "insights" &&
    insights(locale).some((s) => s.slug === segments[1]) &&
    segments.length === 2
  )
    content = <Article locale={locale} slug={segments[1]} />;
  else if (path === "privacy" || path === "terms")
    content = <Legal locale={locale} type={path} />;
  else notFound();
  return (
    <>
      {content}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Cyano Intelligence",
            alternateName: "澜屿智创",
            url: "https://cyano.app",
            logo: "https://cyano.app/logo.png",
            description: text("D.1", "页脚定位句", locale),
          }).replaceAll("<", "\\u003c"),
        }}
      />
    </>
  );
}
