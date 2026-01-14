import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Philosophy from "@/components/Philosophy";
import Architecture from "@/components/Architecture";
import ComparisonTable from "@/components/ComparisonTable";
import Cases from "@/components/Cases";
import TrustSection from "@/components/TrustSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-text-main font-sans selection:bg-accent-cyan selection:text-black">
      <Navbar />
      <Hero />
      <Philosophy />
      <Architecture />
      <ComparisonTable />
      <Cases />
      <TrustSection />
      <Footer />
    </main>
  );
}
