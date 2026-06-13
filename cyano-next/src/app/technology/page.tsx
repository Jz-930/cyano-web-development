import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import TechnicalProof from "@/components/TechnicalProof";
import TrustSection from "@/components/TrustSection";
import Footer from "@/components/Footer";
import { siteContent } from "@/i18n/locales";

const projectHeroSplineUrl = "/spline/ai-data-model-interaction.scene.splinecode";

export const metadata: Metadata = {
  ...siteContent.cn.meta["/technology"],
};

export default function TechnologyPage() {
  return (
    <main className="min-h-screen bg-transparent text-text-main font-sans selection:bg-accent-cyan selection:text-black">
      <Navbar />
      <PageHero
        pageKey="technology"
        primaryHref="#technical-proof"
        secondaryHref="/services"
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
