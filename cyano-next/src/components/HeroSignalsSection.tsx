"use client";

import { FiActivity, FiCpu, FiGitBranch, FiShield } from "react-icons/fi";
import { useI18n } from "@/i18n/LanguageProvider";

const signalIcons = [FiActivity, FiGitBranch, FiCpu, FiShield];

const HeroSignalsSection = () => {
    const { content } = useI18n();
    const signals = content.home.signals;
    const signalItems = signals.items as Array<{ label: string; title: string; body: string; dot: string }>;

    return (
        <section className="lab-section signal-section" id="diagnosis">
            <div className="lab-container">
                <div className="mb-12 grid gap-7 md:mb-14 lg:grid-cols-[0.86fr_1fr] lg:items-end">
                    <div>
                        <div className="lab-kicker mb-5">{signals.kicker}</div>
                        <h2 className="section-title">{signals.title}</h2>
                    </div>
                    <p className="section-copy">{signals.description}</p>
                </div>

                <div className="signal-section-grid">
                    {signalItems.map((signal, index) => {
                        const Icon = signalIcons[index];
                        return (
                            <article key={signal.label} className="hero-signal-card">
                                <div className="hero-signal-heading">
                                    <span className="hero-signal-icon">
                                        <Icon aria-hidden="true" />
                                    </span>
                                    <span className={signal.dot} />
                                </div>
                                <div className="hero-signal-copy">
                                    <div className="lab-label">{signal.label}</div>
                                    <h3>{signal.title}</h3>
                                    <p>{signal.body}</p>
                                </div>
                            </article>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default HeroSignalsSection;
