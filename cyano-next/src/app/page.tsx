import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import HeroSignalsSection from "@/components/HeroSignalsSection";
import Philosophy from "@/components/Philosophy";
import OpportunitySection from "@/components/OpportunitySection";
import EngagementModels from "@/components/EngagementModels";
import ProcessTimeline from "@/components/ProcessTimeline";
import Cases from "@/components/Cases";
import TechnicalProof from "@/components/TechnicalProof";
import TrustSection from "@/components/TrustSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-transparent text-text-main font-sans selection:bg-accent-cyan selection:text-black">
      <Navbar />
      <Hero />
      <HeroSignalsSection />
      <Philosophy />
      <OpportunitySection />
      <EngagementModels />
      <ProcessTimeline />
      <Cases />
      <TechnicalProof />
      <TrustSection />
      <Footer />
    </main>
  );
}
