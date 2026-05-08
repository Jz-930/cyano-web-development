import { FiActivity, FiCpu, FiGitBranch, FiShield } from "react-icons/fi";

const signals = [
    {
        label: "Business Signal",
        title: "识别新能力与降本增效机会",
        body: "先判断是过去做不了、现在能做的能力，还是把已有流程转成更低成本的 AI 工作流。",
        dot: "accent-dot",
        icon: FiActivity,
    },
    {
        label: "Workflow Mapping",
        title: "拆解输入、校验、输出和审核点",
        body: "把业务步骤拆成可交付模块，明确哪里自动化，哪里保留人工判断和责任边界。",
        dot: "accent-dot accent-dot--amber",
        icon: FiGitBranch,
    },
    {
        label: "Service Model",
        title: "匹配买断、试点或托管式服务",
        body: "根据预算、内部能力和上线节奏，选择完整定制、低启动试点或持续托管合作。",
        dot: "accent-dot accent-dot--blue",
        icon: FiCpu,
    },
    {
        label: "Delivery Guardrail",
        title: "沉淀可审计、可维护的企业工作流",
        body: "交付不止是一个 Demo，而是能被团队使用、复盘、维护和持续迭代的生产系统。",
        dot: "accent-dot accent-dot--coral",
        icon: FiShield,
    },
];

const HeroSignalsSection = () => (
    <section className="lab-section signal-section" id="diagnosis">
        <div className="lab-container">
            <div className="mb-12 grid gap-7 md:mb-14 lg:grid-cols-[0.86fr_1fr] lg:items-end">
                <div>
                    <div className="lab-kicker mb-5">How We Start</div>
                    <h2 className="section-title">先判断机会，再决定产品、工作流或托管服务</h2>
                </div>
                <p className="section-copy">
                    我们不会一开始就把需求做成一个固定软件，而是先把业务目标、流程边界、交付责任和合作方式拆清楚，再进入方案设计。
                </p>
            </div>

            <div className="signal-section-grid">
                {signals.map((signal) => {
                    const Icon = signal.icon;
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

export default HeroSignalsSection;
