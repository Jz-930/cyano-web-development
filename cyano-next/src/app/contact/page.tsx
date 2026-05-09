import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import ContactOptions from "@/components/ContactOptions";
import Footer from "@/components/Footer";

const homeHeroSplineUrl = "/spline/cyano-robot.scene.splinecode";

export const metadata: Metadata = {
  title: "联系我们 | Cyano",
  description: "联系 Cyano，讨论定制 AI 工具、低启动试点、托管式 AI 服务、项目展示和技术部署问题。",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-transparent text-text-main font-sans selection:bg-accent-cyan selection:text-black">
      <Navbar />
      <PageHero
        eyebrow="CONTACT US"
        title="联系我们，"
        accent="从业务问题开始"
        description="无论你想定制 AI 工具、启动试点、查看项目展示，还是讨论托管式 AI 服务，都可以先把业务场景、当前成本和目标结果讲清楚。"
        primaryHref="#contact"
        primaryLabel="填写咨询表单"
        secondaryHref="/cases"
        secondaryLabel="先看项目展示"
        splineEmbedUrl={homeHeroSplineUrl}
        splineTitle="Cyano live 3D robot"
        splineVariant="home"
      />
      <ContactOptions />
      <Footer />
    </main>
  );
}
