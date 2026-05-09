import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import OpportunitySection from "@/components/OpportunitySection";
import EngagementModels from "@/components/EngagementModels";
import ProcessTimeline from "@/components/ProcessTimeline";
import ServiceFAQ from "@/components/ServiceFAQ";
import Footer from "@/components/Footer";

const projectHeroSplineUrl = "/spline/ai-data-model-interaction.scene.splinecode";

export const metadata: Metadata = {
  title: "服务与合作 | Cyano",
  description: "了解 Cyano 的 AI 机会诊断、完整定制开发、低启动试点、托管式 AI 服务和合作流程。",
};

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-transparent text-text-main font-sans selection:bg-accent-cyan selection:text-black">
      <Navbar />
      <PageHero
        eyebrow="SERVICES & ENGAGEMENT"
        title="Cyano永远先调研"
        accent="再给出最合适方案"
        description="AI所带来的机会在各个行业之中均有不同，我们会先学习和研究客户现有的工作流程，帮助客户理解AI所带来的发展优势，再考虑合作形式。"
        primaryHref="#services"
        primaryLabel="查看机会诊断"
        secondaryHref="/contact"
        secondaryLabel="联系我们"
        splineEmbedUrl={projectHeroSplineUrl}
        splineTitle="AI data model interaction"
        splineVariant="project"
      />
      <OpportunitySection />
      <EngagementModels />
      <ProcessTimeline />
      <ServiceFAQ />
      <Footer />
    </main>
  );
}
