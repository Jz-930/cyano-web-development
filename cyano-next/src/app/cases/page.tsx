import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import Cases from "@/components/Cases";
import Footer from "@/components/Footer";

const projectHeroSplineUrl = "/spline/ai-data-model-interaction.scene.splinecode";

export const metadata: Metadata = {
  title: "项目展示 | Cyano",
  description: "Cyano 项目、产品演示和落地场景展示页，使用 AI 数据模型互动视觉承接现有项目介绍、截图、视频和交互演示位置。",
};

export default function CasesPage() {
  return (
    <main className="min-h-screen bg-transparent text-text-main font-sans selection:bg-accent-cyan selection:text-black">
      <Navbar />
      <PageHero
        eyebrow="PROJECT SHOWCASE"
        title="项目与产品能力，"
        accent="统一沉淀在这里"
        description="这页为已有产品介绍和演示素材预留结构，同时完整保留原有落地场景。后续只需要把截图、视频、说明和交互入口补进对应卡片。"
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
