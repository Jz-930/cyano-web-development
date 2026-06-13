import type { SiteContent } from "../../types";

const cn: SiteContent = {
  meta: {
    "/": {
      title: "Cyano | 定制 AI 产品与企业 AI 工作流",
      description: "Cyano 帮企业定制 AI 工具、AI 工作流和托管式 AI 服务，将企业知识转化为可交付的 AI 生产力。",
    },
    "/services": {
      title: "服务与合作 | Cyano",
      description: "了解 Cyano 的 AI 机会诊断、完整定制开发、低启动试点、托管式 AI 服务和合作流程。",
    },
    "/cases": {
      title: "项目展示 | Cyano",
      description: "Cyano 项目展示页，集中呈现销售咨询、文档自动化、房屋管理、企业知识库、数据查询与创意写作等 AI 产品落地成果。",
    },
    "/technology": {
      title: "技术保障 | Cyano",
      description: "Cyano 的长上下文 Agent、上下文估值引擎、性能指标、四层智能架构、兼容与部署方案。",
    },
    "/contact": {
      title: "联系我们 | Cyano",
      description: "联系 Cyano，讨论定制 AI 工具、低启动试点、托管式 AI 服务、项目展示和技术部署问题。",
    },
    "/gallery-viewer": {
      title: "项目截图 | Cyano",
      description: "查看 Cyano 项目展示截图。",
    },
  },
  common: {
    mediaDefaultCaption: "业务流程与系统能力示意图",
    painLabel: "痛点",
    solutionLabel: "方案",
    demoLabel: "查看 DEMO",
  },
  nav: {
    items: [
      { label: "首页", href: "/" },
      { label: "服务与合作", href: "/services" },
      { label: "项目展示", href: "/cases" },
      { label: "技术保障", href: "/technology" },
    ],
    contactLabel: "联系我们",
    openMenuLabel: "打开导航菜单",
    closeMenuLabel: "关闭导航菜单",
    switchToEnglishLabel: "切换到英文",
    switchToChineseLabel: "切换到中文",
  },
  home: {
    hero: {
      titleLines: ["将企业知识", "转化为可交付的", "AI 生产力"],
      description:
        "Cyano 帮企业从业务机会梳理开始，设计定制 AI 工具、AI 工作流和托管式 AI 服务，让 AI 不只停留在聊天窗口，而是进入可上线、可维护、可持续合作的生产系统。",
      chips: ["定制 AI 工具", "低启动试点", "托管式服务"],
      primaryLabel: "查看合作方式",
      secondaryLabel: "查看项目展示",
      mobileVideoLabel: "Cyano 动态机器人预览",
      splineTitle: "Cyano live 3D robot",
    },
    signals: {
      kicker: "How We Start",
      title: "CYANO Tech如何开展工作",
      description:
        "我们不会一开始就把需求做成一个固定软件，而是先把业务目标、流程边界、交付责任和合作方式拆清楚，再进入方案设计。",
      items: [
        {
          label: "Business Signal",
          title: "识别新能力与降本增效机会",
          body: "先判断是过去做不了、现在能做的能力，还是把已有流程转成更低成本的 AI 工作流。",
          dot: "accent-dot",
        },
        {
          label: "Workflow Mapping",
          title: "拆解输入、校验、输出和审核点",
          body: "把业务步骤拆成可交付模块，明确哪里自动化，哪里保留人工判断和责任边界。",
          dot: "accent-dot accent-dot--amber",
        },
        {
          label: "Service Model",
          title: "匹配买断、试点或托管式服务",
          body: "根据预算、内部能力和上线节奏，选择完整定制、低启动试点或持续托管合作。",
          dot: "accent-dot accent-dot--blue",
        },
        {
          label: "Delivery Guardrail",
          title: "沉淀可审计、可维护的企业工作流",
          body: "交付不止是一个演示原型，而是能被团队使用、复盘、维护和持续迭代的生产系统。",
          dot: "accent-dot accent-dot--coral",
        },
      ],
    },
    philosophy: {
      titleLines: ["为何通用模型（如chatGPT） 无法", "直接接管您的业务？"],
      items: [
        {
          id: "01",
          title: "知识孤岛",
          desc: "核心数据散落在文档、数据库与历史记录中，通用 AI 拿不到也用不好，回答空洞无据。",
        },
        {
          id: "02",
          title: "上下文受限",
          desc: "模型窗口有限，信息喂不全就会产生幻觉，导致输出结果漂移，无法处理复杂任务。",
        },
        {
          id: "03",
          title: "输出不可控",
          desc: "同题不同答，缺乏校验规则，企业不敢将 AI 用于合同、财务等关键业务流程。",
        },
        {
          id: "04",
          title: "无法规模化",
          desc: "依赖个别员工的 Prompt 技巧只能救急，无法沉淀为可复用的组织能力，且难以审计。",
        },
      ],
    },
    servicesPreview: {
      kicker: "SERVICE PATHS",
      title: "多种合作模式",
      description:
        "Cyano充分考虑并理解目前LLM发展迅速，技术迭代所带来的影响。我们提供完整开发、分期开发和分包托管等多种合作模式。确保客户在AI技术发展的路径中总是独占鳌头。",
      paths: [
        {
          label: "Mode 01",
          title: "完整定制开发",
          body: "需求明确、希望长期拥有 AI 工具或工作流时，采用完整产品设计、开发、上线与基础维护。",
          dot: "accent-dot",
        },
        {
          label: "Mode 02",
          title: "低启动费 + 持续服务",
          body: "先用较低前期投入跑出试点，再按使用、服务和迭代周期持续合作。",
          dot: "accent-dot accent-dot--amber",
        },
        {
          label: "Mode 03",
          title: "托管式 AI 服务",
          body: "客户买结果，Cyano 用 AI 与内部工作流交付批量任务、项目成果或持续产出。",
          dot: "accent-dot accent-dot--blue",
        },
      ],
      ctaDescription: "你可以在服务页查看完整的机会诊断、合作模式和交付流程。",
      ctaLabel: "查看服务与合作",
    },
    casesPreview: {
      kicker: "PROJECT SHOWCASE",
      title: "项目展示",
      description:
        "围绕客户现有数据、知识库和工作流定制 AI 管线，并封装成易用、稳定的软件产品，让 AI 真正接入销售、文档、运营和内部支持等关键流程。",
      projects: [
        {
          status: "销售咨询 AI",
          title: "个性化销售素材生成",
          body: "基于真实产品资料、客户画像和历史案例，帮助销售团队完成专业咨询、需求收束和一客一稿触达。",
          tags: ["精准获客", "销售内容", "一客一稿"],
          dot: "accent-dot accent-dot--amber",
        },
        {
          status: "文档自动化",
          title: "智能标书与方案生成",
          body: "连接历史标书、知识库和项目参数，生成可编辑的方案初稿，让文档生产从经验驱动变成流程化交付。",
          tags: ["文档自动化", "RAG", "方案生成"],
          dot: "accent-dot",
        },
        {
          status: "企业知识库",
          title: "企业知识库 AI 助手",
          body: "接入企业 Wiki、SOP 和工单系统，自动回答员工问题并保留引用依据，降低重复支持成本。",
          tags: ["企业 Wiki", "IT 助手", "知识问答"],
          dot: "accent-dot accent-dot--blue",
        },
      ],
      ctaDescription: "查看更多真实界面与业务场景，了解 Cyano 如何把 AI 能力落到具体流程。",
      ctaLabel: "查看项目展示",
    },
    technologyPreview: {
      kicker: "TECHNICAL PROOF",
      title: "技术保障如何让 AI",
      accent: " 真正进入业务",
      description:
        "了解Cyano在实际处理企业 AI 落地中如何解决：长上下文、知识召回、Agent 编排、成本延迟、权限治理、系统集成和部署方式。我们提供了更多技术说明。",
      points: [
        "长上下文与知识召回：让模型在真实业务资料中找到正确依据",
        "Agent 与工作流编排：把复杂任务拆成可追踪、可校验的步骤",
        "成本、延迟与稳定性优化：让系统能在日常使用中持续运行",
        "权限、兼容与部署方案：适配企业现有系统、安全边界和维护要求",
      ],
      ctaLabel: "查看技术保障详情",
    },
  },
  pageHeroes: {
    services: {
      eyebrow: "SERVICES & ENGAGEMENT",
      title: "Cyano永远先调研",
      accent: "再给出最合适方案",
      description:
        "AI所带来的机会在各个行业之中均有不同，我们会先学习和研究客户现有的工作流程，帮助客户理解AI所带来的发展优势，再考虑合作形式。",
      primaryLabel: "查看机会诊断",
      secondaryLabel: "联系我们",
    },
    cases: {
      eyebrow: "PROJECT SHOWCASE",
      title: "项目与产品能力，",
      accent: "集中展示落地价值",
      description:
        "每个案例都围绕业务痛点、AI 工作流、系统界面和可衡量价值展开，帮助你判断 Cyano 如何把模型能力转化为可上线、可维护的企业产品。",
      primaryLabel: "查看落地场景",
      secondaryLabel: "联系我们",
    },
    technology: {
      eyebrow: "TECHNICAL PROOF",
      title: "工程能力不是装饰，",
      accent: "是稳定交付的底座",
      description:
        "长上下文 Agents 的设计、上下文估值引擎、大规模优化、四层架构、系统能力对比，以及兼容与部署方案。",
      primaryLabel: "阅读技术论证",
      secondaryLabel: "回到合作方式",
    },
    contact: {
      eyebrow: "CONTACT US",
      title: "联系我们，",
      accent: "从业务问题开始",
      description:
        "无论你想定制 AI 工具、启动试点、查看项目展示，还是讨论托管式 AI 服务，都可以先把业务场景、当前成本和目标结果讲清楚。",
      primaryLabel: "填写咨询表单",
      secondaryLabel: "先看项目展示",
    },
  },
  services: {
    opportunities: {
      kicker: "AI OPPORTUNITY DIAGNOSIS",
      title: "两类 AI 机会，",
      accent: " 帮助企业成长",
      description:
        "Cyano 不会为了使用 AI 而使用 AI。我们先判断这是新能力建设，还是现有流程降本增效，再决定产品、工作流或托管服务的合作方式。",
      groups: [
        {
          label: "New Capability",
          mediaLabel: "过去无法精确完成的工作，在AI的助力下精确完成",
          title: "过去做不了，现在能做",
          desc: "AI 让个性化推荐、精准获客、客户画像和面向每个客户的销售素材生成具备规模化可能。",
          points: ["个性化找客户", "精准定位客群", "一客一稿销售内容", "新增服务能力"],
          image: "/media/opportunity-new-capability.svg",
          tone: "coral",
          dot: "accent-dot accent-dot--coral",
          accentText: "text-accent-coral",
        },
        {
          label: "Efficiency",
          mediaLabel: "过去工作量巨大的工作，在AI的助力下解放劳动力",
          title: "已经在做，但成本太高",
          desc: "把文档、审核、查询、客服、运营等重复流程转成 AI 工作流，减少人工、返工和等待时间。",
          points: ["文档自动化", "合同与合规审查", "内部知识问答", "数据查询与运营任务"],
          image: "/media/workflow-efficiency.svg",
          tone: "blue",
          dot: "accent-dot accent-dot--blue",
          accentText: "text-accent-blue",
        },
      ],
      coreLabel: "CYANO",
      coreSubLabel: "Diagnosis Core",
      valueLabel: "VALUE MODEL MATCHED",
      valueDescription:
        "Cyano的目标不是把所有想法都做成软件，而是帮助客户判断到底该买工具，做开发，还是买结果。我们帮助客户判断他们现在的工作有哪些适合AI接入，帮助他们理解AI会带来的改变，以及之后的发展方向。",
    },
    engagement: {
      kicker: "SERVICE MODELS",
      title: "多种合作方式，",
      accent: " 灵活接入企业 AI 能力",
      description:
        "Cyano 可以从完整平台建设、轻量试点到托管式持续交付，按企业阶段选择最合适的路径。我们先理解业务目标和工作流程，再让 AI 能力以可控、可扩展的方式进入团队。",
      imageAlt: "三种合作方式示意图",
      caption: "根据业务阶段选择合适路径",
      selectedPathLabel: "Selected Path",
      detailTitles: ["适合场景", "你将获得", "合作优势"],
      chooseKicker: "HOW TO CHOOSE",
      chooseDescription:
        "如果你想沉淀长期能力，可以选择完整定制；如果你想先验证价值，可以从轻量试点开始；如果你需要立刻释放团队人力，托管式服务能更快带来稳定产出。",
      models: [
        {
          label: "Mode 01",
          title: "完整定制开发",
          short: "为企业打造可长期使用的 AI 工作平台",
          bestFor: "适合目标清晰、使用频率高，希望把 AI 能力沉淀为自有系统的团队。",
          deliverable: "从需求梳理、产品设计、模型接入、工作流开发到上线维护，交付可持续迭代的业务系统。",
          advantage: "帮助企业建立长期可控的 AI 能力，让核心流程、数据和团队经验持续沉淀。",
          cta: "咨询定制方案",
          tone: "mint",
          dot: "accent-dot",
        },
        {
          label: "Mode 02",
          title: "轻量试点与分期开发",
          short: "先跑通关键场景，再逐步扩展",
          bestFor: "适合想快速验证 AI 价值、控制初期投入，并用真实反馈推动内部决策的团队。",
          deliverable: "优先上线核心流程和最小可用方案，结合使用反馈持续迭代到更完整的平台。",
          advantage: "启动更快、节奏更灵活，帮助客户在技术快速变化中保留选择空间。",
          cta: "启动试点咨询",
          tone: "amber",
          dot: "accent-dot accent-dot--amber",
        },
        {
          label: "Mode 03",
          title: "托管式 AI 服务",
          short: "把持续任务交给 Cyano，直接获得结果",
          bestFor: "适合有大量重复性产出、需要稳定质量和交付速度，但暂时不想自建系统的团队。",
          deliverable: "Cyano 结合 AI 工作流和专业服务，持续完成内容、数据、流程或运营类任务。",
          advantage: "以结果为导向，更快释放团队人力，也方便未来沉淀为专属工具或平台。",
          cta: "咨询托管服务",
          tone: "blue",
          dot: "accent-dot accent-dot--blue",
        },
      ],
    },
    process: {
      kicker: "DELIVERY SEQUENCE",
      title: "从一次业务诊断开始，",
      accent: " 到可维护的交付",
      description:
        "Cyano 的合作流程把“想法”变成可验收、可上线、可维护的系统或服务，同时让客户在一开始就知道自己是在买工具、买使用权，还是买结果。",
      imageAlt: "Cyano 合作流程示意图",
      imageLabel: "合作流程图",
      currentPhaseLabel: "Current Phase",
      ctaLabel: "预约一次业务诊断",
      steps: [
        {
          title: "业务诊断",
          desc: "先判断这是新能力建设，还是现有流程降本增效，避免把 AI 做成展示品。",
          signal: "Problem Framed",
          dot: "accent-dot",
        },
        {
          title: "价值评估",
          desc: "一起核算人工、外包、管理、返工和机会成本，判断这件事是否值得投入。",
          signal: "Value Scored",
          dot: "accent-dot accent-dot--amber",
        },
        {
          title: "方案报价",
          desc: "明确工具买断、低启动持续服务，或托管式交付的边界和收费逻辑。",
          signal: "Model Selected",
          dot: "accent-dot accent-dot--coral",
        },
        {
          title: "开发 / 试点 / 托管交付",
          desc: "按选定模式交付可用工具、业务工作流，或成批任务结果。",
          signal: "Workflow Live",
          dot: "accent-dot",
        },
        {
          title: "上线维护与迭代",
          desc: "根据托管、接口变化、新需求和使用反馈，持续优化系统与服务。",
          signal: "Ops Loop",
          dot: "accent-dot accent-dot--blue",
        },
      ],
    },
    faq: {
      kicker: "FAQ",
      title: "选择适合你的 AI 合作路径",
      description:
        "不同企业的 AI 起点不同，Cyano 会先理解业务现状，再帮助你判断适合完整开发、轻量试点，还是托管式持续交付。",
      items: [
        {
          question: "应该完整定制，还是从轻量试点开始？",
          answer:
            "如果目标明确、使用频率高，Cyano 可以直接规划完整工作平台；如果场景还在探索，我们会先用轻量试点快速验证价值，让团队用真实反馈决定下一步。",
        },
        {
          question: "什么时候适合选择托管式 AI 服务？",
          answer:
            "当你更关心稳定产出，而不是自己组建技术团队维护系统时，Cyano 可以把 AI 工作流、人工审核和持续交付结合起来，帮助企业更快获得结果。",
        },
        {
          question: "前期调研会为客户带来什么？",
          answer:
            "我们会先理解现有流程、数据来源、团队协作方式和增长目标，找到最适合 AI 接入的位置，再给出清晰、可执行的建设路径。",
        },
        {
          question: "如何获得适合自己的合作方案？",
          answer:
            "每个行业、流程和团队阶段都不一样。联系 Cyano 后，我们会根据业务价值、技术复杂度、使用规模和上线节奏，提供更贴合实际的个性化建议。",
        },
      ],
    },
  },
  cases: {
    section: {
      kicker: "USE CASES",
      title: "落地场景",
      description:
        "从销售咨询、房屋管理到创意写作，展示 Cyano 如何把 AI 接入真实业务流程，让模型理解产品、客户、数据、知识和创作上下文。",
    },
    gallery: {
      openGalleryLabel: (title: string) => `打开${title}相册`,
      imageAltWithCaption: (title: string) => `${title}实际界面截图`,
      imageAltWithoutCaption: (title: string) => `${title}场景示意图`,
      mediaLabel: (tag: string) => `${tag} 场景图`,
      viewMore: "查看更多",
      closeLabel: "关闭相册",
      openOriginalLabel: "在新标签打开原图",
      originalText: "原图",
      previousLabel: "上一张",
      nextLabel: "下一张",
      thumbsLabel: "相册缩略图",
      viewThumbLabel: (label: string) => `查看${label}`,
    },
    studies: [
      {
        tag: "销售咨询 AI",
        title: "基于实际数据的销售咨询 AI",
        pain: "传统客服或销售问答无法深入理解产品细节、历史案例和真实客户需求，线下销售也难以快速查询并准确介绍产品。",
        solution:
          "构建深度结合产品资料、过往客户案例和真实业务数据的咨询机器人，根据客户问题收束话题方向，持续输出专业、精确的答案，并辅助线下销售查询、理解和介绍产品。",
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
        tone: "amber",
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
        tone: "mint",
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
        solution:
          "基于手机端房屋联络平台，AI 理解复杂沟通、费用逻辑和用户对话流程，自动提取租赁、维修、管理等财务流动，生成账单明细和物业表现记录，帮助屋主精细化评估投资表现。",
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
        tone: "coral",
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
        tone: "blue",
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
        tone: "blue",
        reverse: true,
        stats: [],
      },
      {
        tag: "创意写作",
        title: "创意写作记忆控制系统",
        pain: "传统大模型对话很难精确控制记忆，长篇小说或剧本创作中容易混淆人物设定、剧情分支、背景信息和当前上下文。",
        solution:
          "构建可控记忆层，帮助作者管理剧情分支、隔离当前对话记忆、压缩背景信息，并让不同内容片段按需热插拔进入模型上下文；同时兼容常见大模型，也可部署专门训练用于写作的私有模型。",
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
        tone: "mint",
        stats: [
          ["Memory", "精准记忆控制", true],
          ["Branch", "剧情分支管理", false],
        ],
      },
    ],
  },
  contact: {
    options: {
      kicker: "CONTACT TOPICS",
      title: "你可以从这三类问题开始",
      description:
        "联系我们不需要先准备完整需求文档。只要说明当前业务场景、已有资料、希望改善的结果，我们就能判断下一步该怎么推进。",
      items: [
        {
          label: "Business Diagnosis",
          title: "讨论业务问题",
          body: "适合还不确定该做工具、试点还是托管服务的客户。先把目标、流程、数据和成本讲清楚。",
          dot: "accent-dot",
        },
        {
          label: "Project Showcase",
          title: "查看项目展示",
          body: "适合想了解已有项目、产品界面、演示入口和落地场景的客户，先从真实案例判断匹配度。",
          dot: "accent-dot accent-dot--amber",
        },
        {
          label: "Technical Fit",
          title: "确认技术与部署",
          body: "适合需要讨论数据接入、权限、私有化部署、模型兼容和后续维护责任的客户。",
          dot: "accent-dot accent-dot--blue",
        },
      ],
    },
    footer: {
      kicker: "CONTACT US",
      title: "联系我们",
      description:
        "我们提供多类型的合作模式，不论搭建自己的工作平台、协作开发还是直接将工作交给Cyano托管。联系我们，获得更多针对性咨询。",
      bullets: [
        "定价灵活，Cyano提供基于最前沿LLM技术的个性化评估",
        "支持买断、低启动持续服务、托管式交付",
        "SaaS 托管与私有化部署均可讨论",
      ],
      fields: {
        name: "姓名 / Name",
        company: "公司 / Company",
        email: "工作邮箱 / Work Email",
        selectOptions: [
          "我想定制 AI 工具",
          "我想低成本启动试点",
          "我想把任务交给 Cyano 托管",
          "我还不确定，想先评估",
        ],
        message: "简单描述你的业务场景、现有成本或希望 AI 帮你完成的任务",
        submit: "提交咨询",
      },
      copyright: "© 2026 Cyano Intelligence. All Rights Reserved.",
    },
  },
  technology: {
    proof: {
      kicker: "TECHNICAL PROOF",
      title: "工程能力不是装饰，",
      accent: " 是稳定交付的底座",
      description: "长上下文 Agents 的成本、延迟与召回挑战，Cyano 的上下文估值引擎、性能指标、四层架构和系统能力对比。",
      imageAlt: "Cyano 技术保障架构示意图",
      imageLabel: "技术保障架构",
    },
    challenges: {
      titlePrefix: "长上下文 ",
      titleAccent: "Agents",
      titleSuffix: " 的不可能三角",
      description: "随着对话深度增加，暴力堆砌 Token 只会带来系统性崩溃。",
      items: [
        {
          title: "Cost Explosion",
          subtitle: "成本失控",
          desc: "随着对话轮数增加，全量历史传输导致 API 成本呈指数级上升。单次对话成本可能翻几十倍。",
        },
        {
          title: "Latency Spikes",
          subtitle: "首字延迟 (TTFT)",
          desc: "上下文窗口负载过高会导致 Time-To-First-Token (首字时间) 显著增加，破坏实时交互体验。",
        },
        {
          title: '"Lost in the Middle"',
          subtitle: "中间迷失效应",
          desc: "海量噪声会导致模型注意力分散。更多的数据不等于更智能，反而会导致模型忽略中间的关键指令。",
        },
      ],
    },
    solution: {
      titlePrefix: "智能上下文",
      titleAccent: "估值",
      titleSuffix: "引擎",
      description: "像操作系统管理虚拟内存一样，动态管理 Agent 的长期记忆。",
      rawLabel: "Raw Conversation Flow",
      outputLabel: "High-Value Memory",
      weightLabel: "Weight",
      optimizedLabel: "Optimized",
      levels: [
        {
          level: "Level 1",
          title: "Immutable Directives",
          weight: "0.4",
          strategy: "无损保留 (Lossless Retention)",
          desc: "代理配置、输出格式等最高权重指令，100% 召回。",
        },
        {
          level: "Level 2",
          title: "Key States",
          weight: "0.3",
          strategy: "结构化摘要 (Structured Summary)",
          desc: '将"登录成功"、"数据解析中"等节点转化为高密度状态数据。',
        },
        {
          level: "Level 3",
          title: "Reasoning Chains",
          weight: "0.2",
          strategy: "激进剪枝 (Aggressive Pruning)",
          desc: "针对 CoT (思维链) 过程，仅保留最终结论，剔除冗长的试错路径。",
        },
        {
          level: "Level 4",
          title: "Noise & Logs",
          weight: "0.1",
          strategy: "根因提取 (Root Cause Only)",
          desc: "遇到报错时，仅保留错误原因，自动清洗堆栈噪声。",
        },
      ],
    },
    performance: {
      titlePrefix: "大规模",
      titleAccent: "优化",
      description: "基于 100 轮对话测试基准",
      metrics: [
        {
          value: "< 200",
          unit: "ms",
          label: "Latency Stability",
          desc: "无论第 1 轮还是第 50 轮，响应速度恒定",
        },
        {
          value: "100",
          unit: "%",
          label: "Instruction Recall",
          desc: "核心配置指令零丢失",
        },
      ],
      chartTitle: "Cost Analysis (Token Usage)",
      standardLabel: "Standard RAG",
      standardCost: "100% Cost",
      cyanoLabel: "Cyano Engine",
      cyanoCost: "-40% Cost",
      savingsLabel: "Savings",
      bottomMetrics: [
        ["10X", "ROI Increase"],
        ["∞", "Context Scaling"],
      ],
    },
    architecture: {
      title: "Cyano 四层智能架构",
      steps: [
        {
          id: 0,
          title: "01. 知识摄入层 (Ingestion)",
          desc: "连接 PDF、SQL、API 等多源异构数据，建立带权限管理的动态向量索引。",
        },
        {
          id: 1,
          title: "02. 上下文编排 (RAG Engine)",
          desc: "在有限 Token 预算内，自动清洗、拼装最相关的 1% 信息，消除模型噪音。",
        },
        {
          id: 2,
          title: "03. 任务执行层 (Agent)",
          desc: "将 SOP 固化为 Playbook。包含标准步骤、校验规则与兜底机制，像代码一样执行。",
          highlight: true,
        },
        {
          id: 3,
          title: "04. 企业级治理 (Governance)",
          desc: "全链路日志审计、引用溯源、敏感词拦截。",
        },
      ],
      layers: ["SaaS Application UI", "Cyano Agent Core", "RAG Context Engine", "Enterprise Data (Files/DB)"],
    },
    comparison: {
      title: "从个人技巧进化为系统能力",
      headers: ["Dimension", "Traditional Prompt Engineering", "Cyano Intelligence"],
      rows: [
        {
          title: "驱动核心",
          bad: "个人灵感与技巧",
          good: "企业知识库 + SOP",
        },
        {
          title: "稳定性",
          bad: "随机性强，难以复现",
          good: "输出稳定，可审计，可复用",
        },
        {
          title: "模型关系",
          bad: "深度绑定特定模型习惯",
          good: "模型无关 (Model Agnostic)",
        },
        {
          title: "可迁移性",
          bad: "不可迁移，永远跟不上大模型发展速度",
          good: "可迁移，永远适用当下最合适的模型",
        },
      ],
    },
    trust: {
      title: "兼容并蓄，安全落地",
      cards: [
        {
          title: "SaaS 托管版",
          desc: "即刻接入，弹性扩展。适合快速验证与轻量级场景。我们为您提供隔离的云端环境，确保业务快速上线。",
        },
        {
          title: "私有化部署版",
          desc: "数据不出域，模型本地运行。提供完整的 Docker 交付与本地算力适配，确保绝对的数据主权与合规。",
        },
      ],
    },
  },
  projectShowcase: {
    featured: {
      kicker: "FEATURED PROJECTS",
      title: "项目能力展示，",
      accent: " 覆盖真实业务场景",
      description: "每个项目围绕业务价值、适用场景、核心能力和交付形态展开，帮助客户快速判断 Cyano 的 AI 产品是否匹配自己的业务问题。",
      projects: [
        {
          status: "销售咨询 AI",
          title: "个性化销售素材生成",
          value: "基于客户画像、行业信号和销售目标，生成一客一稿的触达内容。",
          audience: "适合需要批量获客、销售触达和客户分层运营的团队。",
          image: "/media/case-sales.svg",
          tone: "amber",
          tags: ["精准获客", "客户画像", "销售素材"],
        },
        {
          status: "文档自动化",
          title: "智能标书与方案生成",
          value: "从历史标书、知识库和项目参数中生成可编辑的方案初稿。",
          audience: "适合需要频繁输出投标文件、技术方案和商务材料的团队。",
          image: "/media/case-proposal.svg",
          tone: "mint",
          tags: ["文档自动化", "知识库引用", "方案生成"],
        },
        {
          status: "企业知识库",
          title: "企业知识库 AI 助手",
          value: "接入内部 Wiki、手册或 SOP，回答员工问题并保留引用依据。",
          audience: "适合 IT、运营、客服和内部支持场景。",
          image: "/media/case-assistant.svg",
          tone: "blue",
          tags: ["企业 Wiki", "IT 助手", "知识问答"],
        },
      ],
    },
    materials: {
      kicker: "SHOWCASE MATERIALS",
      title: "按场景查看项目材料",
      description: "项目材料围绕界面截图、流程说明和演示入口组织，方便客户快速理解系统形态、交付边界和业务收益。",
      slots: [
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
      ],
      ctaDescription: "如果你希望了解某类场景是否适合自己的业务，可以联系我们进行一次业务诊断。",
      ctaLabel: "联系我们",
    },
  },
  galleryViewer: {
    controlsLabel: "相册控制",
    back: "返回",
    original: "原图",
    navigationLabel: "相册导航",
    previous: "上一张",
    next: "下一张",
    imageAlt: (index: number) => `Cyano 项目截图 ${index}`,
  },
};

export default cn;
