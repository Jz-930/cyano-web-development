import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import TechnicalProof from "@/components/TechnicalProof";
import TrustSection from "@/components/TrustSection";
import Footer from "@/components/Footer";

const projectHeroSplineUrl = "/spline/ai-data-model-interaction.scene.splinecode";

export const metadata: Metadata = {
  title: "技术保障 | Cyano",
  description: "Cyano 的长上下文 Agent、上下文估值引擎、性能指标、四层智能架构、兼容与部署方案。",
};

export default function TechnologyPage() {
  return (
    <main className="min-h-screen bg-transparent text-text-main font-sans selection:bg-accent-cyan selection:text-black">
      <Navbar />
      <PageHero
        eyebrow="TECHNICAL PROOF"
        title="工程能力不是装饰，"
        accent="是稳定交付的底座"
        description="这里完整保留原技术内容：长上下文 Agents 的挑战、上下文估值引擎、大规模优化、四层架构、系统能力对比，以及兼容与部署方案。"
        primaryHref="#technical-proof"
        primaryLabel="阅读技术论证"
        secondaryHref="/services"
        secondaryLabel="回到合作方式"
        splineEmbedUrl={projectHeroSplineUrl}
        splineTitle="AI data model interaction"
        splineVariant="project"
      />
      <TechnicalProof />
      <TrustSection />
      <Footer />
    </main>
  );
}
