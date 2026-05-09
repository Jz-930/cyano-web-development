import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import HeroSignalsSection from "@/components/HeroSignalsSection";
import Philosophy from "@/components/Philosophy";
import HomeServicesPreview from "@/components/HomeServicesPreview";
import HomeCasesPreview from "@/components/HomeCasesPreview";
import HomeTechnologyPreview from "@/components/HomeTechnologyPreview";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-transparent text-text-main font-sans selection:bg-accent-cyan selection:text-black">
      <Navbar />
      <Hero />
      <HeroSignalsSection />
      <Philosophy />
      <HomeServicesPreview />
      <HomeCasesPreview />
      <HomeTechnologyPreview />
      <Footer />
    </main>
  );
}
