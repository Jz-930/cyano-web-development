"use client";

import MediaFrame from "@/components/MediaFrame";
import { useReveal } from "@/hooks/useReveal";

type CaseStudy = {
    tag: string;
    title: string;
    pain: string;
    solution: string;
    image: string;
    tone: "mint" | "amber" | "coral" | "blue";
    reverse?: boolean;
    stats: Array<[value: string, label: string, highlight: boolean]>;
};

const caseStudies: CaseStudy[] = [
    {
        tag: "精准获客",
        title: "个性化销售素材生成",
        pain: "过去无法为每一个潜在客户单独分析需求、定位切入点并撰写宣传内容。",
        solution: "结合客户画像、行业信号和销售目标，批量生成一客一稿的触达素材。",
        image: "/media/case-sales.svg",
        tone: "amber" as const,
        stats: [
            ["1:1", "个性化触达", true],
            ["Scale", "批量生成", false],
        ],
    },
    {
        tag: "文档自动化",
        title: "智能标书与方案生成",
        pain: "历史标书分散，撰写技术方案耗时，且易遗漏参数。",
        solution: "构建专用知识库，RAG 引擎自动提取相似条款，Agent 自动填充参数。",
        image: "/media/case-proposal.svg",
        tone: "mint" as const,
        stats: [
            ["15min", "生成初稿", false],
            ["99%", "引用准确率", true],
        ],
    },
    {
        tag: "合规风控",
        title: "合同风险智能审查",
        pain: "人工审核大量合同耗时费力，标准不一，易漏看风险条款。",
        solution: "将《合规手册》转化为校验链，自动标记风险并给出修改建议。",
        image: "/media/case-risk.svg",
        tone: "coral" as const,
        reverse: true,
        stats: [
            ["100%", "风险覆盖", true],
            ["5x", "效率提升", false],
        ],
    },
    {
        tag: "企业 Wiki",
        title: "内部智能 IT 助手",
        pain: "内部工单积压，员工重复回答相同问题，知识库更新滞后。",
        solution: "接入内网 Wiki，7x24 小时自动处理常见咨询，无法回答时转接人工。",
        image: "/media/case-assistant.svg",
        tone: "blue" as const,
        stats: [
            ["80%", "拦截工单", true],
            ["<3s", "响应时间", false],
        ],
    },
    {
        tag: "数据查询",
        title: "自然语言业务数据查询",
        pain: "业务人员不懂 SQL，查询复杂库存或销量数据需依赖 IT 部门导数。",
        solution: "Text-to-SQL 智能体，允许业务人员用自然语言直接与数据库交互。",
        image: "/media/case-data.svg",
        tone: "blue" as const,
        reverse: true,
        stats: [],
    },
];

const Cases = () => {
    useReveal();

    return (
        <section id="cases" className="section-padding overflow-hidden">
            <div className="container">
                <div className="reveal mb-20 text-center">
                    <div className="lab-kicker mb-4">USE CASES</div>
                    <h2 className="section-title mb-6">落地场景</h2>
                    <p className="section-copy mx-auto max-w-2xl">
                        从精准获客到企业知识库，展示 AI 如何进入真实业务流程。这里的图片先作为媒体占位，后续可以替换成实际产品截图、客户场景图或流程图。
                    </p>
                </div>

                <div className="grid gap-28">
                    {caseStudies.map((item) => {
                        const visual = (
                            <div className="ui-visual" key={`${item.title}-visual`}>
                                <MediaFrame
                                    src={item.image}
                                    alt={`${item.title}视觉占位图`}
                                    label={`${item.tag} 场景图占位`}
                                    tone={item.tone}
                                />
                            </div>
                        );

                        const info = (
                            <div className="case-info" key={`${item.title}-info`}>
                                <span className="case-tag">{item.tag}</span>
                                <h3 className="mb-6 font-heading text-[2.15rem] leading-tight text-white md:text-[2.5rem]">
                                    {item.title}
                                </h3>
                                <p className="mb-10 font-light leading-8 text-text-muted">
                                    痛点：{item.pain}
                                    <br />
                                    方案：{item.solution}
                                </p>
                                {item.stats.length > 0 && (
                                    <div className="stats-grid border-t border-border-light pt-8">
                                        {item.stats.map(([value, label, highlight]) => (
                                            <div className="stat" key={label}>
                                                <h4 className={`text-4xl ${highlight ? "text-accent-cyan" : "text-white"}`}>{value}</h4>
                                                <span>{label}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );

                        return (
                            <article key={item.title} className="case-item reveal">
                                {item.reverse ? (
                                    <>
                                        {info}
                                        {visual}
                                    </>
                                ) : (
                                    <>
                                        {visual}
                                        {info}
                                    </>
                                )}
                            </article>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default Cases;
