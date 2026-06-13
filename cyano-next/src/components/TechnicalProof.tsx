"use client";

import ChallengeSection from "@/components/ChallengeSection";
import SolutionSection from "@/components/SolutionSection";
import PerformanceSection from "@/components/PerformanceSection";
import Architecture from "@/components/Architecture";
import ComparisonTable from "@/components/ComparisonTable";
import MediaFrame from "@/components/MediaFrame";
import { useI18n } from "@/i18n/LanguageProvider";

const TechnicalProof = () => {
    const { content } = useI18n();
    const proof = content.technology.proof;

    return (
        <div id="technical-proof" className="relative">
            <section className="lab-section !pb-20">
                <div className="lab-container">
                    <div className="reveal grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
                        <div>
                            <div className="lab-kicker mb-4">{proof.kicker}</div>
                            <h2 className="section-title mb-6">
                                {proof.title}
                                <span className="text-brand-mint">{proof.accent}</span>
                            </h2>
                            <p className="section-copy">
                                {proof.description}
                            </p>
                        </div>
                        <MediaFrame
                            src="/media/technical-stack.svg"
                            alt={proof.imageAlt}
                            label={proof.imageLabel}
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
