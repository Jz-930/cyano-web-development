import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import OpportunitySection from "@/components/OpportunitySection";
import EngagementModels from "@/components/EngagementModels";
import ProcessTimeline from "@/components/ProcessTimeline";
import ServiceFAQ from "@/components/ServiceFAQ";
import Footer from "@/components/Footer";
import { siteContent } from "@/i18n/locales";

const projectHeroSplineUrl = "/spline/ai-data-model-interaction.scene.splinecode";

export const metadata: Metadata = {
  ...siteContent.cn.meta["/services"],
};

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-transparent text-text-main font-sans selection:bg-accent-cyan selection:text-black">
      <Navbar />
      <PageHero
        pageKey="services"
        primaryHref="#services"
        secondaryHref="/contact"
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
