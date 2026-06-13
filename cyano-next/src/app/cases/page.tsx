import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import Cases from "@/components/Cases";
import Footer from "@/components/Footer";
import { siteContent } from "@/i18n/locales";

const projectHeroSplineUrl = "/spline/ai-data-model-interaction.scene.splinecode";

export const metadata: Metadata = {
  ...siteContent.cn.meta["/cases"],
};

export default function CasesPage() {
  return (
    <main className="min-h-screen bg-transparent text-text-main font-sans selection:bg-accent-cyan selection:text-black">
      <Navbar />
      <PageHero
        pageKey="cases"
        primaryHref="#cases"
        secondaryHref="/contact"
        splineEmbedUrl={projectHeroSplineUrl}
        splineTitle="AI data model interaction"
        splineVariant="project"
      />
      <Cases />
      <Footer />
    </main>
  );
}
