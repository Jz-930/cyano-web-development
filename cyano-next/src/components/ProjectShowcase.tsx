import Link from "next/link";
import MediaFrame from "@/components/MediaFrame";

const featuredProjects = [
    {
        status: "销售咨询 AI",
        title: "个性化销售素材生成",
        value: "基于客户画像、行业信号和销售目标，生成一客一稿的触达内容。",
        audience: "适合需要批量获客、销售触达和客户分层运营的团队。",
        image: "/media/case-sales.svg",
        tone: "amber" as const,
        tags: ["精准获客", "客户画像", "销售素材"],
    },
    {
        status: "文档自动化",
        title: "智能标书与方案生成",
        value: "从历史标书、知识库和项目参数中生成可编辑的方案初稿。",
        audience: "适合需要频繁输出投标文件、技术方案和商务材料的团队。",
        image: "/media/case-proposal.svg",
        tone: "mint" as const,
        tags: ["文档自动化", "知识库引用", "方案生成"],
    },
    {
        status: "企业知识库",
        title: "企业知识库 AI 助手",
        value: "接入内部 Wiki、手册或 SOP，回答员工问题并保留引用依据。",
        audience: "适合 IT、运营、客服和内部支持场景。",
        image: "/media/case-assistant.svg",
        tone: "blue" as const,
        tags: ["企业 Wiki", "IT 助手", "知识问答"],
    },
];

const demoSlots = [
    {
        title: "产品界面展示",
        body: "通过系统界面、任务面板和结果页，直观看到 AI 如何接入真实业务流程。",
        status: "界面展示",
    },
    {
        title: "流程演示",
        body: "用录屏、讲解和客户演示串联输入、处理、审核和交付结果，降低理解成本。",
        status: "演示入口",
    },
    {
        title: "交互体验",
        body: "通过可点击演示、表单模拟器或体验入口，让客户更快判断场景是否适合自身业务。",
        status: "体验入口",
    },
];

const ProjectShowcase = () => {
    return (
        <>
            <section className="lab-section">
                <div className="lab-container">
                    <div className="reveal mb-14 grid gap-8 lg:grid-cols-[0.86fr_1.14fr] lg:items-end">
                        <div>
                            <div className="lab-kicker mb-4">FEATURED PROJECTS</div>
                            <h2 className="section-title">
                                项目能力展示，
                                <span className="text-brand-mint"> 覆盖真实业务场景</span>
                            </h2>
                        </div>
                        <p className="section-copy">
                            每个项目围绕业务价值、适用场景、核心能力和交付形态展开，帮助客户快速判断 Cyano 的 AI 产品是否匹配自己的业务问题。
                        </p>
                    </div>

                    <div className="reveal grid gap-7 lg:grid-cols-3">
                        {featuredProjects.map((project) => (
                            <article key={project.title} className="lab-panel flex flex-col p-4 md:p-5">
                                <MediaFrame
                                    src={project.image}
                                    alt={`${project.title}项目场景图`}
                                    label={`${project.status} / Project Overview`}
                                    tone={project.tone}
                                />
                                <div className="flex flex-1 flex-col px-2 pt-6 md:px-3">
                                    <div className="mb-4 flex items-center justify-between gap-4">
                                        <span className="lab-label">{project.status}</span>
                                        <span className="accent-dot" />
                                    </div>
                                    <h3 className="mb-4 font-heading text-[1.55rem] leading-tight text-white">{project.title}</h3>
                                    <p className="mb-4 text-sm leading-7 text-white/74">{project.value}</p>
                                    <p className="mb-6 text-sm leading-7 text-text-muted">{project.audience}</p>
                                    <div className="mt-auto flex flex-wrap gap-2">
                                        {project.tags.map((tag) => (
                                            <span key={tag} className="rounded-full border border-white/10 bg-white/[0.035] px-3 py-1 text-xs text-white/68">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section className="lab-section">
                <div className="lab-container">
                    <div className="reveal mb-12 max-w-3xl">
                        <div className="lab-kicker mb-4">SHOWCASE MATERIALS</div>
                        <h2 className="section-title">按场景查看项目材料</h2>
                        <p className="section-copy mt-5">
                            项目材料围绕界面截图、流程说明和演示入口组织，方便客户快速理解系统形态、交付边界和业务收益。
                        </p>
                    </div>

                    <div className="reveal grid gap-5 md:grid-cols-3">
                        {demoSlots.map((slot) => (
                            <article key={slot.title} className="lab-panel min-h-[240px] p-6 md:p-7">
                                <div className="mb-6 flex items-center justify-between gap-4">
                                    <span className="lab-label">{slot.status}</span>
                                    <span className="accent-dot accent-dot--blue" />
                                </div>
                                <h3 className="mb-4 font-heading text-[1.45rem] leading-tight text-white">{slot.title}</h3>
                                <p className="text-sm leading-7 text-text-muted">{slot.body}</p>
                            </article>
                        ))}
                    </div>

                    <div className="reveal mt-9 flex flex-wrap items-center justify-between gap-5 rounded-3xl border border-brand-mint/15 bg-white/[0.025] p-6 md:p-7">
                        <p className="max-w-2xl text-base leading-8 text-white/72">
                            如果你希望了解某类场景是否适合自己的业务，可以联系我们进行一次业务诊断。
                        </p>
                        <Link href="/contact" className="cyano-button">
                            联系我们
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
};

export default ProjectShowcase;
