const faqs = [
    {
        question: "应该完整定制，还是从轻量试点开始？",
        answer: "如果目标明确、使用频率高，Cyano 可以直接规划完整工作平台；如果场景还在探索，我们会先用轻量试点快速验证价值，让团队用真实反馈决定下一步。",
    },
    {
        question: "什么时候适合选择托管式 AI 服务？",
        answer: "当你更关心稳定产出，而不是自己组建技术团队维护系统时，Cyano 可以把 AI 工作流、人工审核和持续交付结合起来，帮助企业更快获得结果。",
    },
    {
        question: "前期调研会为客户带来什么？",
        answer: "我们会先理解现有流程、数据来源、团队协作方式和增长目标，找到最适合 AI 接入的位置，再给出清晰、可执行的建设路径。",
    },
    {
        question: "如何获得适合自己的合作方案？",
        answer: "每个行业、流程和团队阶段都不一样。联系 Cyano 后，我们会根据业务价值、技术复杂度、使用规模和上线节奏，提供更贴合实际的个性化建议。",
    },
];

const ServiceFAQ = () => {
    return (
        <section className="lab-section">
            <div className="lab-container">
                <div className="reveal mb-12 max-w-3xl">
                    <div className="lab-kicker mb-4">FAQ</div>
                    <h2 className="section-title">选择适合你的 AI 合作路径</h2>
                    <p className="section-copy mt-5">
                        不同企业的 AI 起点不同，Cyano 会先理解业务现状，再帮助你判断适合完整开发、轻量试点，还是托管式持续交付。
                    </p>
                </div>

                <div className="reveal grid gap-5 md:grid-cols-2">
                    {faqs.map((item) => (
                        <article key={item.question} className="lab-panel p-6 md:p-7">
                            <h3 className="mb-4 font-heading text-[1.35rem] leading-snug text-white">{item.question}</h3>
                            <p className="text-sm leading-7 text-text-muted">{item.answer}</p>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ServiceFAQ;
