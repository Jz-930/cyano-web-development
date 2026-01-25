import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ChallengeSection from "@/components/ChallengeSection";
import SolutionSection from "@/components/SolutionSection";
import PerformanceSection from "@/components/PerformanceSection";
import Philosophy from "@/components/Philosophy";
import Architecture from "@/components/Architecture";
import ComparisonTable from "@/components/ComparisonTable";
import Cases from "@/components/Cases";
import TrustSection from "@/components/TrustSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-transparent text-text-main font-sans selection:bg-accent-cyan selection:text-black">
      <Navbar />
      <Hero />
      <Philosophy />
      <ChallengeSection />
      <SolutionSection />
      <PerformanceSection />
      <Architecture />
      <ComparisonTable />
      <Cases />
      <TrustSection />
      <Footer />
    </main>
  );
}
