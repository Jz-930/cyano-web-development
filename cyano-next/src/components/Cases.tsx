"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { FiChevronLeft, FiChevronRight, FiExternalLink, FiMaximize2, FiX } from "react-icons/fi";
import MediaFrame from "@/components/MediaFrame";
import { useReveal } from "@/hooks/useReveal";

type CaseStudy = {
    tag: string;
    title: string;
    pain: string;
    solution: string;
    image: string;
    caption?: string;
    gallery?: Array<{
        src: string;
        alt: string;
        label: string;
    }>;
    tone: "mint" | "amber" | "coral" | "blue";
    reverse?: boolean;
    demoHref?: string;
    stats: Array<[value: string, label: string, highlight: boolean]>;
};

type ActiveGallery = {
    caseIndex: number;
    photoIndex: number;
};

const mobileGalleryQuery = "(hover: none), (pointer: coarse), (max-width: 768px)";

const getGalleryViewerHref = (caseIndex: number, photoIndex = 0) => {
    const params = new URLSearchParams({
        case: String(caseIndex),
        photo: String(photoIndex),
        back: `/cases#case-study-${caseIndex}`,
    });

    return `/gallery-viewer.html?${params.toString()}`;
};

const shouldUseMobileGalleryViewer = () => window.matchMedia(mobileGalleryQuery).matches;

const caseStudies: CaseStudy[] = [
    {
        tag: "销售咨询 AI",
        title: "基于实际数据的销售咨询 AI",
        pain: "传统客服或销售问答无法深入理解产品细节、历史案例和真实客户需求，线下销售也难以快速查询并准确介绍产品。",
        solution: "构建深度结合产品资料、过往客户案例和真实业务数据的咨询机器人，根据客户问题收束话题方向，持续输出专业、精确的答案，并辅助线下销售查询、理解和介绍产品。",
        image: "/media/lnpe-sales-ai/lnpe-sales-consultant-01-public-assistant.webp",
        caption: "LNPE 智能工程顾问实际界面截图",
        gallery: [
            {
                src: "/media/lnpe-sales-ai/lnpe-sales-consultant-01-public-assistant.webp",
                alt: "LNPE 官网中的智能工程顾问根据实际项目数据回答客户问题",
                label: "前台咨询入口",
            },
            {
                src: "/media/lnpe-sales-ai/lnpe-sales-consultant-02-access-portal.webp",
                alt: "LNPE 内部工程助手访问入口",
                label: "内部访问入口",
            },
            {
                src: "/media/lnpe-sales-ai/lnpe-sales-consultant-03-project-match.webp",
                alt: "LNPE 工程助手匹配相似项目和设备记录",
                label: "项目数据匹配",
            },
            {
                src: "/media/lnpe-sales-ai/lnpe-sales-consultant-04-price-reference.webp",
                alt: "LNPE 工程助手查询内部报价参考数据",
                label: "报价参考数据",
            },
        ],
        tone: "amber" as const,
        demoHref: "https://lnpe-2026.vercel.app/",
        stats: [
            ["Data", "真实数据理解", true],
            ["Sales", "销售现场支持", false],
        ],
    },
    {
        tag: "文档自动化",
        title: "智能标书与方案生成",
        pain: "历史标书分散，撰写技术方案耗时，且易遗漏参数。",
        solution: "构建专用知识库，RAG 引擎自动提取相似条款，Agent 自动填充参数。",
        image: "/media/huisheng-proposal-ai/huisheng-proposal-ai-01-workflow-draft.webp",
        caption: "Huisheng 智能标书与方案生成实际界面截图",
        gallery: [
            {
                src: "/media/huisheng-proposal-ai/huisheng-proposal-ai-01-workflow-draft.webp",
                alt: "Huisheng 智能标书与方案生成在调研计划阶段生成甲方沟通备忘录和盈利能力评估模型",
                label: "调研与草稿生成",
            },
            {
                src: "/media/huisheng-proposal-ai/huisheng-proposal-ai-02-start-draft.webp",
                alt: "Huisheng 智能标书与方案生成的初始文字助手和报告草稿面板",
                label: "草稿生成入口",
            },
        ],
        tone: "mint" as const,
        demoHref: "https://research-bp-writing.vercel.app/",
        stats: [
            ["15min", "生成初稿", false],
            ["99%", "引用准确率", true],
        ],
    },
    {
        tag: "房屋管理",
        title: "房屋管理助手",
        pain: "房屋管理和出租过程中，沟通记录、费用往来和投资表现分散在不同渠道，屋主很难持续形成清晰账单与决策依据。",
        solution: "基于手机端房屋联络平台，AI 理解复杂沟通、费用逻辑和用户对话流程，自动提取租赁、维修、管理等财务流动，生成账单明细和物业表现记录，帮助屋主精细化评估投资表现。",
        image: "/media/alpha-house-ai/alpha-house-02-messages.webp",
        caption: "AlphaHouse 房东记账与管理工具实际界面截图",
        gallery: [
            {
                src: "/media/alpha-house-ai/alpha-house-02-messages.webp",
                alt: "AlphaHouse 消息工单页面展示租客消息、维修工单和退房清算提醒",
                label: "消息工单",
            },
            {
                src: "/media/alpha-house-ai/alpha-house-03-work-order-chat.webp",
                alt: "AlphaHouse 维修工单聊天页面展示水管维修沟通记录",
                label: "工单沟通",
            },
            {
                src: "/media/alpha-house-ai/alpha-house-04-finance.webp",
                alt: "AlphaHouse 财务与账单页面展示房产净收入、收入支出和账目明细",
                label: "财务与账单",
            },
            {
                src: "/media/alpha-house-ai/alpha-house-05-contacts.webp",
                alt: "AlphaHouse 通讯录页面展示租客、维修工和关联房产联系人",
                label: "通讯录",
            },
            {
                src: "/media/alpha-house-ai/alpha-house-06-reports.webp",
                alt: "AlphaHouse 数据报表页面展示年度利润、收入支出和报表导出",
                label: "数据报表",
            },
            {
                src: "/media/alpha-house-ai/alpha-house-01-login.webp",
                alt: "AlphaHouse 登录页面展示北美房东记账与管理工具入口",
                label: "登录入口",
            },
        ],
        tone: "coral" as const,
        reverse: true,
        demoHref: "https://alphahouse-demo.vercel.app/",
        stats: [
            ["Ledger", "账单自动生成", true],
            ["Insight", "投资表现评估", false],
        ],
    },
    {
        tag: "企业 Wiki",
        title: "内部智能 IT 助手",
        pain: "内部工单积压，员工重复回答相同问题，知识库更新滞后。",
        solution: "接入内网 Wiki，7x24 小时自动处理常见咨询，无法回答时转接人工。",
        image: "/media/enterprise-wiki-ai/enterprise-wiki-it-assistant-01-dashboard.webp",
        caption: "Enterprise Wiki 智能 IT 助手实际界面截图",
        gallery: [
            {
                src: "/media/enterprise-wiki-ai/enterprise-wiki-it-assistant-01-dashboard.webp",
                alt: "Enterprise Wiki 智能 IT 助手仪表盘展示工单拦截率、响应时间和聊天窗口",
                label: "支持仪表盘",
            },
            {
                src: "/media/enterprise-wiki-ai/enterprise-wiki-it-assistant-02-articles.webp",
                alt: "Enterprise Wiki 知识库文章列表按分类和更新时间组织 IT 支持内容",
                label: "Wiki 文章库",
            },
            {
                src: "/media/enterprise-wiki-ai/enterprise-wiki-it-assistant-03-article-detail.webp",
                alt: "Enterprise Wiki 文章详情页展示 VPN 设置步骤和相关帮助内容",
                label: "知识文章详情",
            },
            {
                src: "/media/enterprise-wiki-ai/enterprise-wiki-it-assistant-04-ticket-detail.webp",
                alt: "Enterprise Wiki 工单详情页展示员工问题、AI 推荐文章和人工升级状态",
                label: "工单详情联动",
            },
            {
                src: "/media/enterprise-wiki-ai/enterprise-wiki-it-assistant-05-analytics.webp",
                alt: "Enterprise Wiki 分析面板展示自动化支持、文章命中率和工单趋势",
                label: "数据分析面板",
            },
        ],
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
        image: "/media/smartdoc-ui-suite/smartdoc-ui-suite-01-dashboard-overview.webp",
        caption: "SmartDoc AI 自然语言业务数据查询实际界面截图",
        gallery: [
            {
                src: "/media/smartdoc-ui-suite/smartdoc-ui-suite-01-dashboard-overview.webp",
                alt: "SmartDoc AI 仪表盘展示文档自动化、SQL 查询管控和最近查询活动",
                label: "业务仪表盘",
            },
            {
                src: "/media/smartdoc-ui-suite/smartdoc-ui-suite-02-sql-control-center.webp",
                alt: "SmartDoc AI SQL 管控中心展示连接、Schema、查询校验和只读执行流程",
                label: "SQL 管控中心",
            },
            {
                src: "/media/smartdoc-ui-suite/smartdoc-ui-suite-03-knowledge-base.webp",
                alt: "SmartDoc AI 知识库页面展示已索引文档、分类和同步状态",
                label: "知识库管理",
            },
            {
                src: "/media/smartdoc-ui-suite/smartdoc-ui-suite-04-proposal-builder.webp",
                alt: "SmartDoc AI 方案生成器展示需求、引用来源和生成中的业务文档",
                label: "方案生成流程",
            },
            {
                src: "/media/smartdoc-ui-suite/smartdoc-ui-suite-05-review-audit.webp",
                alt: "SmartDoc AI 审核与审计页面展示引用校验、SQL 日志和合规检查",
                label: "审核与审计",
            },
            {
                src: "/media/smartdoc-ui-suite/smartdoc-ui-suite-06-template-library.webp",
                alt: "SmartDoc AI 模板库页面展示业务模板、分类和使用频次",
                label: "模板库",
            },
        ],
        tone: "blue" as const,
        reverse: true,
        stats: [],
    },
    {
        tag: "创意写作",
        title: "创意写作记忆控制系统",
        pain: "传统大模型对话很难精确控制记忆，长篇小说或剧本创作中容易混淆人物设定、剧情分支、背景信息和当前上下文。",
        solution: "构建可控记忆层，帮助作者管理剧情分支、隔离当前对话记忆、压缩背景信息，并让不同内容片段按需热插拔进入模型上下文；同时兼容常见大模型，也可部署专门训练用于写作的私有模型。",
        image: "/media/dme-writing-engine/dme-writing-engine-01-chat-branch-switch.webp",
        caption: "DME 写作引擎记忆控制系统实际界面截图",
        gallery: [
            {
                src: "/media/dme-writing-engine/dme-writing-engine-01-chat-branch-switch.webp",
                alt: "DME 写作引擎在聊天界面中切换剧情分支并控制当前写作上下文",
                label: "剧情分支切换",
            },
            {
                src: "/media/dme-writing-engine/dme-writing-engine-02-chat-memory-drawer.webp",
                alt: "DME 写作引擎在对话侧边栏中管理角色、背景和当前记忆",
                label: "对话记忆抽屉",
            },
            {
                src: "/media/dme-writing-engine/dme-writing-engine-03-context-memory-stats.webp",
                alt: "DME 写作引擎展示上下文容量、记忆层级和写作素材使用统计",
                label: "上下文统计",
            },
            {
                src: "/media/dme-writing-engine/dme-writing-engine-04-note-editor-ai-panel.webp",
                alt: "DME 写作引擎在笔记编辑器中联动 AI 面板生成和整理创作内容",
                label: "笔记与 AI 面板",
            },
            {
                src: "/media/dme-writing-engine/dme-writing-engine-05-fragments-library-bulk.webp",
                alt: "DME 写作引擎批量管理设定片段、剧情材料和可插拔上下文素材",
                label: "片段库管理",
            },
            {
                src: "/media/dme-writing-engine/dme-writing-engine-06-archive-pack-inspect.webp",
                alt: "DME 写作引擎检查归档包中的记忆片段、引用和素材结构",
                label: "归档包检查",
            },
            {
                src: "/media/dme-writing-engine/dme-writing-engine-07-connections-settings.webp",
                alt: "DME 写作引擎配置大模型连接、写作模型和系统参数",
                label: "模型连接设置",
            },
            {
                src: "/media/dme-writing-engine/dme-writing-engine-00-startup-loading.webp",
                alt: "DME 写作引擎启动加载界面",
                label: "启动界面",
            },
        ],
        tone: "mint" as const,
        stats: [
            ["Memory", "精准记忆控制", true],
            ["Branch", "剧情分支管理", false],
        ],
    },
];

const getCaseGallery = (item: CaseStudy) => (
    item.gallery?.length
        ? item.gallery
        : [
            {
                src: item.image,
                alt: `${item.title}场景图`,
                label: item.tag,
            },
        ]
);

const Cases = () => {
    useReveal();
    const [activeGallery, setActiveGallery] = useState<ActiveGallery | null>(null);
    const [useMobileGallery, setUseMobileGallery] = useState(false);
    const galleryReturnScrollY = useRef(0);
    const galleryReturnCaseIndex = useRef<number | null>(null);

    const activeCase = activeGallery === null ? null : caseStudies[activeGallery.caseIndex];
    const activeImages = activeCase ? getCaseGallery(activeCase) : [];
    const activePhoto = activeGallery === null ? null : activeImages[activeGallery.photoIndex];

    const openGallery = useCallback((index: number) => {
        if (shouldUseMobileGalleryViewer()) {
            window.location.assign(getGalleryViewerHref(index, 0));
            return;
        }

        galleryReturnScrollY.current = window.scrollY;
        galleryReturnCaseIndex.current = index;
        window.scrollTo({ top: 0, behavior: "auto" });
        setActiveGallery({ caseIndex: index, photoIndex: 0 });
    }, []);

    const closeGallery = useCallback(() => {
        const returnCaseIndex = galleryReturnCaseIndex.current;
        setActiveGallery(null);
        window.requestAnimationFrame(() => {
            const returnCase = returnCaseIndex === null
                ? null
                : document.getElementById(`case-study-${returnCaseIndex}`);

            if (returnCase) {
                returnCase.scrollIntoView({ block: "center", behavior: "auto" });
            } else {
                window.scrollTo({ top: galleryReturnScrollY.current, behavior: "auto" });
            }

            galleryReturnCaseIndex.current = null;
        });
    }, []);

    const showPrevious = useCallback(() => {
        setActiveGallery((current) => {
            if (current === null) {
                return current;
            }

            const galleryLength = getCaseGallery(caseStudies[current.caseIndex]).length;

            return {
                ...current,
                photoIndex: (current.photoIndex - 1 + galleryLength) % galleryLength,
            };
        });
    }, []);

    const showNext = useCallback(() => {
        setActiveGallery((current) => {
            if (current === null) {
                return current;
            }

            const galleryLength = getCaseGallery(caseStudies[current.caseIndex]).length;

            return {
                ...current,
                photoIndex: (current.photoIndex + 1) % galleryLength,
            };
        });
    }, []);

    useEffect(() => {
        const mediaQuery = window.matchMedia(mobileGalleryQuery);
        const updateGalleryMode = () => setUseMobileGallery(mediaQuery.matches);

        updateGalleryMode();
        mediaQuery.addEventListener("change", updateGalleryMode);

        return () => {
            mediaQuery.removeEventListener("change", updateGalleryMode);
        };
    }, []);

    useEffect(() => {
        if (activeGallery === null) {
            return;
        }

        const previousOverflow = document.body.style.overflow;
        const shouldLockPageScroll = window.matchMedia("(min-width: 769px)").matches;
        let visualViewportFrame = 0;

        if (shouldLockPageScroll) {
            document.body.style.overflow = "hidden";
        }

        document.body.classList.add("case-gallery-active");
        document.documentElement.classList.add("case-gallery-active");

        const updateZoomingClass = () => {
            window.cancelAnimationFrame(visualViewportFrame);
            visualViewportFrame = window.requestAnimationFrame(() => {
                const isZooming = (window.visualViewport?.scale ?? 1) > 1.01;
                document.body.classList.toggle("case-gallery-zooming", isZooming);
                document.documentElement.classList.toggle("case-gallery-zooming", isZooming);
            });
        };

        updateZoomingClass();
        window.visualViewport?.addEventListener("resize", updateZoomingClass);
        window.visualViewport?.addEventListener("scroll", updateZoomingClass);

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                closeGallery();
            }

            if (event.key === "ArrowLeft") {
                showPrevious();
            }

            if (event.key === "ArrowRight") {
                showNext();
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            if (shouldLockPageScroll) {
                document.body.style.overflow = previousOverflow;
            }
            window.cancelAnimationFrame(visualViewportFrame);
            window.visualViewport?.removeEventListener("resize", updateZoomingClass);
            window.visualViewport?.removeEventListener("scroll", updateZoomingClass);
            document.body.classList.remove("case-gallery-active", "case-gallery-zooming");
            document.documentElement.classList.remove("case-gallery-active", "case-gallery-zooming");
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [activeGallery, closeGallery, showNext, showPrevious]);

    return (
        <>
            <section id="cases" className="section-padding cases-section">
                <div className="container">
                    <div className="reveal mb-20 text-center">
                        <div className="lab-kicker mb-4">USE CASES</div>
                        <h2 className="section-title mb-6">落地场景</h2>
                        <p className="section-copy mx-auto max-w-2xl">
                            从销售咨询、房屋管理到创意写作，展示 Cyano 如何把 AI 接入真实业务流程，让模型理解产品、客户、数据、知识和创作上下文。
                        </p>
                    </div>

                    <div className="grid gap-28">
                        {caseStudies.map((item, index) => {
                            const galleryLabel = `Open ${item.title} gallery`;
                            const visual = (
                                <div className="ui-visual" key={`${item.title}-visual`}>
                                    <div
                                        className="case-gallery-trigger"
                                        role="button"
                                        tabIndex={0}
                                        aria-label={galleryLabel}
                                        onClick={() => openGallery(index)}
                                        onKeyDown={(event) => {
                                            if (event.key === "Enter" || event.key === " ") {
                                                event.preventDefault();
                                                openGallery(index);
                                            }
                                        }}
                                    >
                                        <MediaFrame
                                            src={item.image}
                                            alt={item.caption ? `${item.title}实际界面截图` : `${item.title}视觉占位图`}
                                            label={`${item.tag} 场景图`}
                                            caption={item.caption}
                                            tone={item.tone}
                                            priority={index <= 1}
                                        />
                                        <span className="case-gallery-trigger__hint">
                                            <FiMaximize2 aria-hidden="true" />
                                            查看更多
                                        </span>
                                    </div>
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
                                    {(item.stats.length > 0 || item.demoHref) && (
                                        <div className="case-meta-row">
                                            {item.stats.length > 0 && (
                                                <div className="stats-grid">
                                                    {item.stats.map(([value, label, highlight]) => (
                                                        <div className="stat" key={label}>
                                                            <h4 className={`text-4xl ${highlight ? "text-accent-cyan" : "text-white"}`}>{value}</h4>
                                                            <span>{label}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                            {item.demoHref && (
                                                <div className="case-demo-action">
                                                    <a
                                                        href={item.demoHref}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="cyano-button"
                                                    >
                                                        查看 DEMO
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );

                            return (
                                <article key={item.title} id={`case-study-${index}`} className="case-item reveal">
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

            {activeCase && activePhoto && activeGallery && (
                <div className="case-gallery-backdrop" role="presentation" onClick={closeGallery}>
                    <div
                        className="case-gallery-dialog"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="case-gallery-title"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <button
                            type="button"
                            className="case-gallery-close"
                            aria-label="关闭相册"
                            onClick={closeGallery}
                        >
                            <FiX aria-hidden="true" />
                        </button>

                        <div className="case-gallery-stage">
                            <div className={`case-gallery-image-shell media-frame--${activeCase.tone}`}>
                                <Image
                                    key={activePhoto.src}
                                    src={activePhoto.src}
                                    alt={activePhoto.alt}
                                    width={1280}
                                    height={800}
                                    className="case-gallery-image"
                                    priority
                                    unoptimized
                                />
                                <a
                                    href={activePhoto.src}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="case-gallery-original"
                                    aria-label="在新标签打开原图"
                                >
                                    <FiExternalLink aria-hidden="true" />
                                    <span>原图</span>
                                </a>
                                <button
                                    type="button"
                                    className="case-gallery-nav case-gallery-nav--prev"
                                    aria-label="上一张"
                                    onClick={showPrevious}
                                >
                                    <FiChevronLeft aria-hidden="true" />
                                </button>
                                <button
                                    type="button"
                                    className="case-gallery-nav case-gallery-nav--next"
                                    aria-label="下一张"
                                    onClick={showNext}
                                >
                                    <FiChevronRight aria-hidden="true" />
                                </button>
                            </div>

                            <div className="case-gallery-copy">
                                <span className="case-tag">{activeCase.tag}</span>
                                <p className="case-gallery-count">
                                    {activeGallery.photoIndex + 1} / {activeImages.length}
                                </p>
                                <h3 id="case-gallery-title">{activeCase.title}</h3>
                                <p>
                                    痛点：{activeCase.pain}
                                    <br />
                                    方案：{activeCase.solution}
                                </p>
                            </div>
                        </div>

                        {!useMobileGallery && (
                            <div className="case-gallery-thumbs" aria-label="相册缩略图">
                            {activeImages.map((item, index) => (
                                <button
                                    type="button"
                                    key={`${activeCase.title}-${item.src}-${index}`}
                                    className={`case-gallery-thumb ${index === activeGallery.photoIndex ? "case-gallery-thumb--active" : ""}`}
                                    aria-label={`查看${item.label}`}
                                    aria-current={index === activeGallery.photoIndex ? "true" : undefined}
                                    onClick={() => setActiveGallery({ caseIndex: activeGallery.caseIndex, photoIndex: index })}
                                >
                                    <Image
                                        src={item.src}
                                        alt=""
                                        width={180}
                                        height={112}
                                        className="case-gallery-thumb__image"
                                    />
                                    <span>{item.label}</span>
                                </button>
                            ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default Cases;
