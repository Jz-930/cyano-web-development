const contactOptions = [
    {
        label: "Business Diagnosis",
        title: "讨论业务问题",
        body: "适合还不确定该做工具、试点还是托管服务的客户。先把目标、流程、数据和成本讲清楚。",
        dot: "accent-dot",
    },
    {
        label: "Project Showcase",
        title: "查看项目展示",
        body: "适合想看现有项目、产品介绍、截图、录屏或交互演示的客户。后续项目素材会统一沉淀在项目展示页。",
        dot: "accent-dot accent-dot--amber",
    },
    {
        label: "Technical Fit",
        title: "确认技术与部署",
        body: "适合需要讨论数据接入、权限、私有化部署、模型兼容和后续维护责任的客户。",
        dot: "accent-dot accent-dot--blue",
    },
];

const ContactOptions = () => {
    return (
        <section className="lab-section">
            <div className="lab-container">
                <div className="reveal mb-12 max-w-3xl">
                    <div className="lab-kicker mb-4">CONTACT TOPICS</div>
                    <h2 className="section-title">你可以从这三类问题开始</h2>
                    <p className="section-copy mt-5">
                        联系我们不需要先准备完整需求文档。只要说明当前业务场景、已有资料、希望改善的结果，我们就能判断下一步该怎么推进。
                    </p>
                </div>

                <div className="reveal grid gap-5 lg:grid-cols-3">
                    {contactOptions.map((option) => (
                        <article key={option.title} className="lab-panel p-6 md:p-7">
                            <div className="mb-6 flex items-center justify-between gap-4">
                                <span className="lab-label">{option.label}</span>
                                <span className={option.dot} />
                            </div>
                            <h3 className="mb-4 font-heading text-[1.55rem] leading-tight text-white">{option.title}</h3>
                            <p className="text-sm leading-7 text-text-muted">{option.body}</p>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ContactOptions;
