import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import Cases from "@/components/Cases";
import Footer from "@/components/Footer";

const projectHeroSplineUrl = "/spline/ai-data-model-interaction.scene.splinecode";

export const metadata: Metadata = {
  title: "项目展示 | Cyano",
  description: "Cyano 项目展示页，集中呈现销售咨询、文档自动化、房屋管理、企业知识库、数据查询与创意写作等 AI 产品落地成果。",
};

export default function CasesPage() {
  return (
    <main className="min-h-screen bg-transparent text-text-main font-sans selection:bg-accent-cyan selection:text-black">
      <Navbar />
      <PageHero
        eyebrow="PROJECT SHOWCASE"
        title="项目与产品能力，"
        accent="集中展示落地价值"
        description="每个案例都围绕业务痛点、AI 工作流、系统界面和可衡量价值展开，帮助你判断 Cyano 如何把模型能力转化为可上线、可维护的企业产品。"
        primaryHref="#cases"
        primaryLabel="查看落地场景"
        secondaryHref="/contact"
        secondaryLabel="联系我们"
        splineEmbedUrl={projectHeroSplineUrl}
        splineTitle="AI data model interaction"
        splineVariant="project"
      />
      <Cases />
      <Footer />
    </main>
  );
}
