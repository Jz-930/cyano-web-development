import ChallengeSection from "@/components/ChallengeSection";
import SolutionSection from "@/components/SolutionSection";
import PerformanceSection from "@/components/PerformanceSection";
import Architecture from "@/components/Architecture";
import ComparisonTable from "@/components/ComparisonTable";
import MediaFrame from "@/components/MediaFrame";

const TechnicalProof = () => {
    return (
        <div id="technical-proof" className="relative">
            <section className="lab-section !pb-20">
                <div className="lab-container">
                    <div className="reveal grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
                        <div>
                            <div className="lab-kicker mb-4">TECHNICAL PROOF</div>
                            <h2 className="section-title mb-6">
                                工程能力不是装饰，
                                <span className="text-brand-mint"> 是稳定交付的底座</span>
                            </h2>
                            <p className="section-copy">
                                以下保留原有技术内容：长上下文 Agents 的成本、延迟与召回挑战，Cyano 的上下文估值引擎、性能指标、四层架构和系统能力对比。
                            </p>
                        </div>
                        <MediaFrame
                            src="/media/technical-stack.svg"
                            alt="Cyano 技术保障视觉占位图"
                            label="技术保障图占位"
                            tone="mint"
                        />
                    </div>
                </div>
            </section>
            <ChallengeSection />
            <SolutionSection />
            <PerformanceSection />
            <Architecture />
            <ComparisonTable />
        </div>
    );
};

export default TechnicalProof;
