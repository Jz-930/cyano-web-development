import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import ContactOptions from "@/components/ContactOptions";
import Footer from "@/components/Footer";
import { siteContent } from "@/i18n/locales";

const homeHeroSplineUrl = "/spline/cyano-robot.scene.splinecode";

export const metadata: Metadata = {
  ...siteContent.cn.meta["/contact"],
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-transparent text-text-main font-sans selection:bg-accent-cyan selection:text-black">
      <Navbar />
      <PageHero
        pageKey="contact"
        primaryHref="#contact"
        secondaryHref="/cases"
        splineEmbedUrl={homeHeroSplineUrl}
        splineTitle="Cyano live 3D robot"
        splineVariant="home"
      />
      <ContactOptions />
      <Footer />
    </main>
  );
}
