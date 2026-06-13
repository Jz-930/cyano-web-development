import type { SiteContent } from "../../types";

const en: SiteContent = {
  meta: {
    "/": {
      title: "Cyano | Custom AI Products and Enterprise AI Workflows",
      description:
        "Cyano builds custom AI tools, AI workflows, and managed AI services that turn enterprise knowledge into deployable productivity.",
    },
    "/services": {
      title: "Services & Engagement | Cyano",
      description:
        "Explore Cyano's AI opportunity diagnosis, custom development, lightweight pilots, managed AI services, and delivery process.",
    },
    "/cases": {
      title: "Project Showcase | Cyano",
      description:
        "Explore Cyano AI product work across sales consulting, document automation, property management, enterprise knowledge bases, data queries, and creative writing.",
    },
    "/technology": {
      title: "Technical Proof | Cyano",
      description:
        "Cyano's long-context Agents, context valuation engine, performance metrics, four-layer intelligence architecture, compatibility, and deployment options.",
    },
    "/contact": {
      title: "Contact Us | Cyano",
      description:
        "Contact Cyano to discuss custom AI tools, lightweight pilots, managed AI services, project examples, and technical deployment needs.",
    },
    "/gallery-viewer": {
      title: "Project Screenshots | Cyano",
      description: "View Cyano project showcase screenshots.",
    },
  },
  common: {
    mediaDefaultCaption: "Business workflow and system capability diagram",
    painLabel: "Challenge",
    solutionLabel: "Solution",
    demoLabel: "View Demo",
  },
  nav: {
    items: [
      { label: "Home", href: "/" },
      { label: "Services", href: "/services" },
      { label: "Projects", href: "/cases" },
      { label: "Technology", href: "/technology" },
    ],
    contactLabel: "Contact",
    openMenuLabel: "Open navigation menu",
    closeMenuLabel: "Close navigation menu",
    switchToEnglishLabel: "Switch to English",
    switchToChineseLabel: "Switch to Chinese",
  },
  home: {
    hero: {
      titleLines: ["Turn Enterprise Knowledge", "Into Deployable", "AI Productivity"],
      description:
        "Cyano starts with business opportunity discovery, then designs custom AI tools, AI workflows, and managed AI services. We move AI beyond the chat window and into production systems that can be launched, maintained, and improved over time.",
      chips: ["Custom AI Tools", "Low-Risk Pilots", "Managed AI Services"],
      primaryLabel: "Explore Engagement Models",
      secondaryLabel: "View Projects",
      mobileVideoLabel: "Cyano animated robot preview",
      splineTitle: "Cyano live 3D robot",
    },
    signals: {
      kicker: "How We Start",
      title: "How CYANO Tech Works",
      description:
        "We do not turn a request into fixed software on day one. We first clarify business goals, workflow boundaries, delivery ownership, and the right engagement model before moving into solution design.",
      items: [
        {
          label: "Business Signal",
          title: "Identify new capabilities and efficiency opportunities",
          body: "We determine whether AI enables work that was previously impractical, or whether an existing process can be redesigned as a lower-cost AI workflow.",
          dot: "accent-dot",
        },
        {
          label: "Workflow Mapping",
          title: "Map inputs, validation, outputs, and review points",
          body: "We break business steps into deliverable modules and define what should be automated, where human judgment stays, and who owns each decision.",
          dot: "accent-dot accent-dot--amber",
        },
        {
          label: "Service Model",
          title: "Match custom builds, pilots, or managed service",
          body: "Based on budget, internal capacity, and launch timeline, we choose full custom development, a lightweight pilot, or ongoing managed delivery.",
          dot: "accent-dot accent-dot--blue",
        },
        {
          label: "Delivery Guardrail",
          title: "Build auditable and maintainable enterprise workflows",
          body: "Delivery is not just a demo prototype. It is a production system that teams can use, review, maintain, and improve continuously.",
          dot: "accent-dot accent-dot--coral",
        },
      ],
    },
    philosophy: {
      titleLines: ["Why generic models like ChatGPT", "cannot directly run your business"],
      items: [
        {
          id: "01",
          title: "Knowledge silos",
          desc: "Core data is scattered across documents, databases, and historical records. Generic AI cannot access it reliably or use it with evidence.",
        },
        {
          id: "02",
          title: "Limited context",
          desc: "Model windows are finite. When the right information is missing, outputs drift, hallucinations appear, and complex work breaks down.",
        },
        {
          id: "03",
          title: "Uncontrolled outputs",
          desc: "The same question can produce different answers. Without validation rules, enterprises cannot trust AI in contracts, finance, or other critical workflows.",
        },
        {
          id: "04",
          title: "Hard to scale",
          desc: "Prompt skills from a few employees can help in the moment, but they do not become reusable, auditable organizational capability.",
        },
      ],
    },
    servicesPreview: {
      kicker: "SERVICE PATHS",
      title: "Flexible Engagement Models",
      description:
        "Cyano understands that LLM technology is evolving quickly. We offer full custom development, phased delivery, and managed service models so clients can stay ahead as AI capabilities continue to change.",
      paths: [
        {
          label: "Mode 01",
          title: "Full Custom Development",
          body: "For clear requirements and long-term ownership, we handle product design, development, launch, and foundational maintenance.",
          dot: "accent-dot",
        },
        {
          label: "Mode 02",
          title: "Low Upfront Cost + Ongoing Service",
          body: "Start with a lower initial investment, validate the pilot, then continue through usage, service, and iteration cycles.",
          dot: "accent-dot accent-dot--amber",
        },
        {
          label: "Mode 03",
          title: "Managed AI Service",
          body: "Clients buy outcomes while Cyano uses AI workflows and internal operations to deliver recurring tasks, project output, or ongoing production.",
          dot: "accent-dot accent-dot--blue",
        },
      ],
      ctaDescription: "The Services page explains opportunity diagnosis, engagement models, and the full delivery process.",
      ctaLabel: "View Services",
    },
    casesPreview: {
      kicker: "PROJECT SHOWCASE",
      title: "Project Showcase",
      description:
        "We customize AI pipelines around client data, knowledge bases, and workflows, then package them into stable, usable software products that connect AI to sales, documents, operations, and internal support.",
      projects: [
        {
          status: "Sales AI",
          title: "Personalized Sales Material Generation",
          body: "Using real product data, customer profiles, and historical cases, the system helps sales teams provide expert consultation, refine customer needs, and create one-to-one outreach.",
          tags: ["Targeted Leads", "Sales Content", "Personalized Outreach"],
          dot: "accent-dot accent-dot--amber",
        },
        {
          status: "Document Automation",
          title: "Intelligent Proposal and Bid Generation",
          body: "Connect historical bids, knowledge bases, and project parameters to generate editable first drafts and turn document production into a repeatable delivery workflow.",
          tags: ["Document Automation", "RAG", "Proposal Generation"],
          dot: "accent-dot",
        },
        {
          status: "Enterprise Knowledge Base",
          title: "Enterprise Knowledge AI Assistant",
          body: "Connect company wikis, SOPs, and ticketing systems so the AI can answer employee questions with sources and reduce repetitive support work.",
          tags: ["Enterprise Wiki", "IT Assistant", "Knowledge Q&A"],
          dot: "accent-dot accent-dot--blue",
        },
      ],
      ctaDescription: "View real interfaces and business scenarios to see how Cyano turns AI capability into working operational systems.",
      ctaLabel: "View Projects",
    },
    technologyPreview: {
      kicker: "TECHNICAL PROOF",
      title: "How Technical Foundations Let AI",
      accent: " Enter Real Operations",
      description:
        "See how Cyano solves long context, knowledge retrieval, Agent orchestration, cost and latency control, permission governance, system integration, and deployment in real enterprise AI projects.",
      points: [
        "Long context and knowledge retrieval: help models find the right evidence inside real business materials",
        "Agent and workflow orchestration: break complex tasks into traceable, verifiable steps",
        "Cost, latency, and stability optimization: keep systems running in everyday usage",
        "Permissions, compatibility, and deployment: fit enterprise systems, security boundaries, and maintenance needs",
      ],
      ctaLabel: "View Technical Details",
    },
  },
  pageHeroes: {
    services: {
      eyebrow: "SERVICES & ENGAGEMENT",
      title: "Cyano Starts With Research",
      accent: "Then Designs the Right Path",
      description:
        "AI opportunities vary by industry and workflow. We first study the client's existing processes, help them understand where AI can create advantage, and then recommend the right engagement model.",
      primaryLabel: "View Opportunity Diagnosis",
      secondaryLabel: "Contact Us",
    },
    cases: {
      eyebrow: "PROJECT SHOWCASE",
      title: "Projects and Product Capabilities,",
      accent: "Focused on Real Delivery Value",
      description:
        "Each case is organized around business pain points, AI workflows, system interfaces, and measurable value, helping you assess how Cyano turns model capability into launch-ready and maintainable enterprise products.",
      primaryLabel: "View Use Cases",
      secondaryLabel: "Contact Us",
    },
    technology: {
      eyebrow: "TECHNICAL PROOF",
      title: "Engineering Is Not Decoration,",
      accent: "It Is the Base of Stable Delivery",
      description:
        "Long-context Agent design, context valuation, large-scale optimization, four-layer architecture, system capability comparison, compatibility, and deployment options.",
      primaryLabel: "Read Technical Proof",
      secondaryLabel: "Back to Services",
    },
    contact: {
      eyebrow: "CONTACT US",
      title: "Contact Us,",
      accent: "Starting From the Business Problem",
      description:
        "Whether you want a custom AI tool, a pilot, a project walkthrough, or a managed AI service, start by describing your business scenario, current cost, and target outcome.",
      primaryLabel: "Fill Out Inquiry Form",
      secondaryLabel: "View Projects First",
    },
  },
  services: {
    opportunities: {
      kicker: "AI OPPORTUNITY DIAGNOSIS",
      title: "Two Types of AI Opportunity,",
      accent: " Built for Business Growth",
      description:
        "Cyano does not use AI just for the sake of using AI. We first decide whether the opportunity is a new capability or an efficiency gain, then choose the right product, workflow, or managed service model.",
      groups: [
        {
          label: "New Capability",
          mediaLabel: "Work that used to be hard to complete precisely can now be done with AI support",
          title: "Previously impractical, now possible",
          desc: "AI makes personalized recommendation, targeted acquisition, customer profiling, and one-to-one sales material generation possible at scale.",
          points: ["Personalized lead discovery", "Precise customer targeting", "One-to-one sales content", "New service capability"],
          image: "/media/opportunity-new-capability.svg",
          tone: "coral",
          dot: "accent-dot accent-dot--coral",
          accentText: "text-accent-coral",
        },
        {
          label: "Efficiency",
          mediaLabel: "High-volume manual work can be redesigned with AI to free team capacity",
          title: "Already happening, but too expensive",
          desc: "Turn repetitive document, review, query, support, and operations work into AI workflows that reduce labor, rework, and waiting time.",
          points: ["Document automation", "Contract and compliance review", "Internal knowledge Q&A", "Data query and operations tasks"],
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
        "Cyano's goal is not to turn every idea into software. We help clients decide whether they should buy a tool, build a system, or buy outcomes. We identify where AI fits into current work, clarify the changes it can create, and map the development path that follows.",
    },
    engagement: {
      kicker: "SERVICE MODELS",
      title: "Flexible Engagement Models,",
      accent: " Built for Enterprise AI Adoption",
      description:
        "Cyano supports full platform builds, lightweight pilots, and managed ongoing delivery. We first understand the business goal and workflow, then introduce AI in a controlled and scalable way.",
      imageAlt: "Diagram of three engagement models",
      caption: "Choose the right path based on business stage",
      selectedPathLabel: "Selected Path",
      detailTitles: ["Best For", "What You Get", "Why It Works"],
      chooseKicker: "HOW TO CHOOSE",
      chooseDescription:
        "Choose full custom development when you want long-term capability. Start with a lightweight pilot when you need to validate value first. Use managed service when you need stable output and immediate team capacity relief.",
      models: [
        {
          label: "Mode 01",
          title: "Full Custom Development",
          short: "Build a long-term AI work platform for your organization",
          bestFor: "Teams with clear goals, high usage frequency, and a need to turn AI capability into an owned internal system.",
          deliverable:
            "From requirement discovery, product design, model integration, and workflow development to launch and maintenance, we deliver a business system that can keep evolving.",
          advantage: "Helps the enterprise build long-term, controllable AI capability while preserving core workflows, data, and team knowledge.",
          cta: "Discuss Custom Build",
          tone: "mint",
          dot: "accent-dot",
        },
        {
          label: "Mode 02",
          title: "Lightweight Pilot and Phased Development",
          short: "Validate the key scenario first, then expand gradually",
          bestFor: "Teams that want to validate AI value quickly, control initial cost, and use real feedback to support internal decisions.",
          deliverable: "Launch the core workflow and minimum viable solution first, then iterate from user feedback toward a more complete platform.",
          advantage: "Faster to start, more flexible in pace, and better suited to a fast-changing AI technology landscape.",
          cta: "Start a Pilot",
          tone: "amber",
          dot: "accent-dot accent-dot--amber",
        },
        {
          label: "Mode 03",
          title: "Managed AI Service",
          short: "Hand recurring work to Cyano and receive finished outcomes",
          bestFor: "Teams with high-volume repetitive output that need stable quality and delivery speed without building their own technical operation first.",
          deliverable: "Cyano combines AI workflows and professional service operations to continuously deliver content, data, process, or operations tasks.",
          advantage: "Outcome-driven delivery releases team capacity faster and can later be productized into a dedicated tool or platform.",
          cta: "Discuss Managed Service",
          tone: "blue",
          dot: "accent-dot accent-dot--blue",
        },
      ],
    },
    process: {
      kicker: "DELIVERY SEQUENCE",
      title: "Start With Business Diagnosis,",
      accent: " End With Maintainable Delivery",
      description:
        "Cyano's delivery process turns an idea into an accepted, launched, and maintainable system or service. Clients know from the beginning whether they are buying a tool, usage rights, or outcomes.",
      imageAlt: "Cyano engagement process diagram",
      imageLabel: "Engagement Process Map",
      currentPhaseLabel: "Current Phase",
      ctaLabel: "Book a Business Diagnosis",
      steps: [
        {
          title: "Business Diagnosis",
          desc: "Determine whether this is a new capability or an efficiency opportunity, so AI does not become a showcase feature with no operational value.",
          signal: "Problem Framed",
          dot: "accent-dot",
        },
        {
          title: "Value Assessment",
          desc: "Calculate labor, outsourcing, management, rework, and opportunity cost together to decide whether the work is worth investing in.",
          signal: "Value Scored",
          dot: "accent-dot accent-dot--amber",
        },
        {
          title: "Solution and Pricing",
          desc: "Define the boundary and pricing logic for tool ownership, low-upfront ongoing service, or managed delivery.",
          signal: "Model Selected",
          dot: "accent-dot accent-dot--coral",
        },
        {
          title: "Build / Pilot / Managed Delivery",
          desc: "Deliver usable tools, business workflows, or batches of task outcomes based on the selected model.",
          signal: "Workflow Live",
          dot: "accent-dot",
        },
        {
          title: "Launch, Maintenance, and Iteration",
          desc: "Continue improving systems and services based on hosting needs, interface changes, new requirements, and real usage feedback.",
          signal: "Ops Loop",
          dot: "accent-dot accent-dot--blue",
        },
      ],
    },
    faq: {
      kicker: "FAQ",
      title: "Choose the Right AI Engagement Path",
      description:
        "Every company starts from a different AI baseline. Cyano first understands the current business reality, then helps you decide whether full development, a lightweight pilot, or managed ongoing delivery fits best.",
      items: [
        {
          question: "Should we build a full custom platform or start with a lightweight pilot?",
          answer:
            "If the goal is clear and usage is frequent, Cyano can plan a full work platform directly. If the scenario is still being explored, we use a lightweight pilot to validate value quickly and let real feedback guide the next step.",
        },
        {
          question: "When is managed AI service the right choice?",
          answer:
            "Managed service fits when you care more about stable output than building and maintaining an internal technical team. Cyano combines AI workflows, human review, and ongoing delivery so the business can get results faster.",
        },
        {
          question: "What does the upfront diagnosis provide?",
          answer:
            "We study existing workflows, data sources, team collaboration, and growth goals, identify the best entry point for AI, and turn that into a clear and executable build path.",
        },
        {
          question: "How do we get an engagement plan that fits our business?",
          answer:
            "Every industry, workflow, and team stage is different. After you contact Cyano, we evaluate business value, technical complexity, usage scale, and launch pace to provide a practical recommendation.",
        },
      ],
    },
  },
  cases: {
    section: {
      kicker: "USE CASES",
      title: "Use Cases",
      description:
        "From sales consultation and property management to creative writing, these cases show how Cyano connects AI to real workflows so models can understand products, customers, data, knowledge, and creative context.",
    },
    gallery: {
      openGalleryLabel: (title: string) => `Open ${title} gallery`,
      imageAltWithCaption: (title: string) => `${title} actual interface screenshot`,
      imageAltWithoutCaption: (title: string) => `${title} scenario illustration`,
      mediaLabel: (tag: string) => `${tag} scenario`,
      viewMore: "View More",
      closeLabel: "Close gallery",
      openOriginalLabel: "Open original image in a new tab",
      originalText: "Original",
      previousLabel: "Previous image",
      nextLabel: "Next image",
      thumbsLabel: "Gallery thumbnails",
      viewThumbLabel: (label: string) => `View ${label}`,
    },
    studies: [
      {
        tag: "Sales AI",
        title: "Sales Consulting AI Based on Real Business Data",
        pain:
          "Traditional customer support or sales Q&A cannot deeply understand product details, historical cases, and real customer needs. Offline sales teams also struggle to query and explain products accurately in real time.",
        solution:
          "We built a consulting assistant that combines product materials, past customer cases, and real business data. It narrows the topic based on customer questions, delivers professional and accurate answers, and helps offline sales teams query, understand, and present products.",
        image: "/media/lnpe-sales-ai/lnpe-sales-consultant-01-public-assistant.webp",
        caption: "Actual interface screenshot of the LNPE Intelligent Engineering Advisor",
        gallery: [
          {
            src: "/media/lnpe-sales-ai/lnpe-sales-consultant-01-public-assistant.webp",
            alt: "The LNPE website intelligent engineering advisor answers customer questions using real project data",
            label: "Public consulting entry",
          },
          {
            src: "/media/lnpe-sales-ai/lnpe-sales-consultant-02-access-portal.webp",
            alt: "Internal access portal for the LNPE engineering assistant",
            label: "Internal access portal",
          },
          {
            src: "/media/lnpe-sales-ai/lnpe-sales-consultant-03-project-match.webp",
            alt: "The LNPE engineering assistant matches similar projects and equipment records",
            label: "Project data matching",
          },
          {
            src: "/media/lnpe-sales-ai/lnpe-sales-consultant-04-price-reference.webp",
            alt: "The LNPE engineering assistant queries internal pricing reference data",
            label: "Pricing reference data",
          },
        ],
        tone: "amber",
        demoHref: "https://lnpe-2026.vercel.app/",
        stats: [
          ["Data", "Real data understanding", true],
          ["Sales", "Field sales support", false],
        ],
      },
      {
        tag: "Document Automation",
        title: "Intelligent Proposal and Bid Generation",
        pain: "Historical bids are scattered, technical proposal writing is slow, and key parameters are easy to miss.",
        solution: "A dedicated knowledge base and RAG engine retrieve similar clauses while an Agent fills project parameters automatically.",
        image: "/media/huisheng-proposal-ai/huisheng-proposal-ai-01-workflow-draft.webp",
        caption: "Actual interface screenshot of Huisheng intelligent proposal and bid generation",
        gallery: [
          {
            src: "/media/huisheng-proposal-ai/huisheng-proposal-ai-01-workflow-draft.webp",
            alt: "Huisheng proposal AI generates a client communication memo and profitability model during the research planning stage",
            label: "Research and draft generation",
          },
          {
            src: "/media/huisheng-proposal-ai/huisheng-proposal-ai-02-start-draft.webp",
            alt: "Huisheng proposal AI text assistant and report draft panel",
            label: "Draft generation entry",
          },
        ],
        tone: "mint",
        demoHref: "https://research-bp-writing.vercel.app/",
        stats: [
          ["15min", "First draft generated", false],
          ["99%", "Citation accuracy", true],
        ],
      },
      {
        tag: "Property Management",
        title: "Property Management Assistant",
        pain:
          "During property management and leasing, communication records, expenses, and investment performance are scattered across channels, making it hard for owners to maintain clear accounts and decision records.",
        solution:
          "Built on a mobile property communication platform, AI understands complex conversations, expense logic, and user flows. It extracts rent, repairs, management, and other financial movements, then generates billing details and property performance records for better investment analysis.",
        image: "/media/alpha-house-ai/alpha-house-02-messages.webp",
        caption: "Actual interface screenshot of the AlphaHouse landlord accounting and management tool",
        gallery: [
          {
            src: "/media/alpha-house-ai/alpha-house-02-messages.webp",
            alt: "AlphaHouse message and ticket page showing tenant messages, repair orders, and move-out settlement reminders",
            label: "Messages and tickets",
          },
          {
            src: "/media/alpha-house-ai/alpha-house-03-work-order-chat.webp",
            alt: "AlphaHouse repair ticket chat page showing plumbing repair communication",
            label: "Work order chat",
          },
          {
            src: "/media/alpha-house-ai/alpha-house-04-finance.webp",
            alt: "AlphaHouse finance and billing page showing net income, income and expenses, and account details",
            label: "Finance and billing",
          },
          {
            src: "/media/alpha-house-ai/alpha-house-05-contacts.webp",
            alt: "AlphaHouse contacts page showing tenants, repair vendors, and related property contacts",
            label: "Contacts",
          },
          {
            src: "/media/alpha-house-ai/alpha-house-06-reports.webp",
            alt: "AlphaHouse reporting page showing annual profit, income and expenses, and report export",
            label: "Reports",
          },
          {
            src: "/media/alpha-house-ai/alpha-house-01-login.webp",
            alt: "AlphaHouse login page for the North American landlord accounting and management tool",
            label: "Login entry",
          },
        ],
        tone: "coral",
        reverse: true,
        demoHref: "https://alphahouse-demo.vercel.app/",
        stats: [
          ["Ledger", "Automated billing", true],
          ["Insight", "Investment performance review", false],
        ],
      },
      {
        tag: "Enterprise Wiki",
        title: "Internal Intelligent IT Assistant",
        pain: "Internal tickets pile up, employees repeat the same answers, and the knowledge base often falls behind.",
        solution: "Connect the internal Wiki so the assistant can answer common requests 24/7 and escalate to a human when it cannot resolve the issue.",
        image: "/media/enterprise-wiki-ai/enterprise-wiki-it-assistant-01-dashboard.webp",
        caption: "Actual interface screenshot of the Enterprise Wiki intelligent IT assistant",
        gallery: [
          {
            src: "/media/enterprise-wiki-ai/enterprise-wiki-it-assistant-01-dashboard.webp",
            alt: "Enterprise Wiki IT assistant dashboard showing ticket deflection rate, response time, and chat window",
            label: "Support dashboard",
          },
          {
            src: "/media/enterprise-wiki-ai/enterprise-wiki-it-assistant-02-articles.webp",
            alt: "Enterprise Wiki knowledge articles organized by category and update time",
            label: "Wiki article library",
          },
          {
            src: "/media/enterprise-wiki-ai/enterprise-wiki-it-assistant-03-article-detail.webp",
            alt: "Enterprise Wiki article detail page showing VPN setup steps and related help content",
            label: "Knowledge article detail",
          },
          {
            src: "/media/enterprise-wiki-ai/enterprise-wiki-it-assistant-04-ticket-detail.webp",
            alt: "Enterprise Wiki ticket detail page showing employee question, AI recommended article, and human escalation status",
            label: "Ticket detail linkage",
          },
          {
            src: "/media/enterprise-wiki-ai/enterprise-wiki-it-assistant-05-analytics.webp",
            alt: "Enterprise Wiki analytics panel showing automated support, article hit rate, and ticket trends",
            label: "Analytics panel",
          },
        ],
        tone: "blue",
        stats: [
          ["80%", "Ticket deflection", true],
          ["<3s", "Response time", false],
        ],
      },
      {
        tag: "Data Query",
        title: "Natural-Language Business Data Query",
        pain: "Business users do not know SQL and must rely on IT teams to export complex inventory or sales data.",
        solution: "A Text-to-SQL Agent lets business users interact directly with databases using natural language.",
        image: "/media/smartdoc-ui-suite/smartdoc-ui-suite-01-dashboard-overview.webp",
        caption: "Actual interface screenshot of SmartDoc AI natural-language business data query",
        gallery: [
          {
            src: "/media/smartdoc-ui-suite/smartdoc-ui-suite-01-dashboard-overview.webp",
            alt: "SmartDoc AI dashboard showing document automation, SQL query governance, and recent query activity",
            label: "Business dashboard",
          },
          {
            src: "/media/smartdoc-ui-suite/smartdoc-ui-suite-02-sql-control-center.webp",
            alt: "SmartDoc AI SQL control center showing connections, schema, query validation, and read-only execution flow",
            label: "SQL control center",
          },
          {
            src: "/media/smartdoc-ui-suite/smartdoc-ui-suite-03-knowledge-base.webp",
            alt: "SmartDoc AI knowledge base page showing indexed documents, categories, and sync status",
            label: "Knowledge base management",
          },
          {
            src: "/media/smartdoc-ui-suite/smartdoc-ui-suite-04-proposal-builder.webp",
            alt: "SmartDoc AI proposal builder showing requirements, sources, and a generated business document",
            label: "Proposal generation flow",
          },
          {
            src: "/media/smartdoc-ui-suite/smartdoc-ui-suite-05-review-audit.webp",
            alt: "SmartDoc AI review and audit page showing citation validation, SQL logs, and compliance checks",
            label: "Review and audit",
          },
          {
            src: "/media/smartdoc-ui-suite/smartdoc-ui-suite-06-template-library.webp",
            alt: "SmartDoc AI template library showing business templates, categories, and usage frequency",
            label: "Template library",
          },
        ],
        tone: "blue",
        reverse: true,
        stats: [],
      },
      {
        tag: "Creative Writing",
        title: "Creative Writing Memory Control System",
        pain:
          "Traditional large-model conversations make memory hard to control. Long-form fiction or scripts can easily mix up character settings, plot branches, background information, and current context.",
        solution:
          "We built a controllable memory layer that helps authors manage plot branches, isolate current conversation memory, compress background information, and hot-swap content fragments into model context as needed. It supports common large models and can also run privately trained writing models.",
        image: "/media/dme-writing-engine/dme-writing-engine-01-chat-branch-switch.webp",
        caption: "Actual interface screenshot of the DME writing engine memory control system",
        gallery: [
          {
            src: "/media/dme-writing-engine/dme-writing-engine-01-chat-branch-switch.webp",
            alt: "DME writing engine switches plot branches and controls current writing context in the chat interface",
            label: "Plot branch switching",
          },
          {
            src: "/media/dme-writing-engine/dme-writing-engine-02-chat-memory-drawer.webp",
            alt: "DME writing engine manages characters, background, and current memory in the chat sidebar drawer",
            label: "Conversation memory drawer",
          },
          {
            src: "/media/dme-writing-engine/dme-writing-engine-03-context-memory-stats.webp",
            alt: "DME writing engine shows context capacity, memory layers, and writing material usage statistics",
            label: "Context statistics",
          },
          {
            src: "/media/dme-writing-engine/dme-writing-engine-04-note-editor-ai-panel.webp",
            alt: "DME writing engine links a note editor with an AI panel to generate and organize creative content",
            label: "Notes and AI panel",
          },
          {
            src: "/media/dme-writing-engine/dme-writing-engine-05-fragments-library-bulk.webp",
            alt: "DME writing engine batch manages setting fragments, plot materials, and pluggable context assets",
            label: "Fragment library management",
          },
          {
            src: "/media/dme-writing-engine/dme-writing-engine-06-archive-pack-inspect.webp",
            alt: "DME writing engine inspects memory fragments, references, and material structure inside an archive pack",
            label: "Archive pack inspection",
          },
          {
            src: "/media/dme-writing-engine/dme-writing-engine-07-connections-settings.webp",
            alt: "DME writing engine configures large model connections, writing models, and system parameters",
            label: "Model connection settings",
          },
          {
            src: "/media/dme-writing-engine/dme-writing-engine-00-startup-loading.webp",
            alt: "DME writing engine startup loading screen",
            label: "Startup screen",
          },
        ],
        tone: "mint",
        stats: [
          ["Memory", "Precise memory control", true],
          ["Branch", "Plot branch management", false],
        ],
      },
    ],
  },
  contact: {
    options: {
      kicker: "CONTACT TOPICS",
      title: "Start With One of These Three Questions",
      description:
        "You do not need a complete requirements document before contacting us. Describe the current business scenario, existing materials, and the result you want to improve, and we can recommend the next step.",
      items: [
        {
          label: "Business Diagnosis",
          title: "Discuss the Business Problem",
          body: "Best when you are not yet sure whether you need a tool, a pilot, or managed service. We start by clarifying goals, workflows, data, and cost.",
          dot: "accent-dot",
        },
        {
          label: "Project Showcase",
          title: "Review Existing Projects",
          body: "Best when you want to understand existing work, product interfaces, demos, and use cases before judging fit.",
          dot: "accent-dot accent-dot--amber",
        },
        {
          label: "Technical Fit",
          title: "Confirm Technology and Deployment",
          body: "Best when you need to discuss data access, permissions, private deployment, model compatibility, and maintenance ownership.",
          dot: "accent-dot accent-dot--blue",
        },
      ],
    },
    footer: {
      kicker: "CONTACT US",
      title: "Contact Us",
      description:
        "We support several engagement models, from building your own work platform and co-developing systems to handing recurring work to Cyano as a managed service. Contact us for a more specific recommendation.",
      bullets: [
        "Flexible pricing with personalized assessment based on frontier LLM technology",
        "Supports buyout, low-upfront ongoing service, and managed delivery",
        "SaaS hosting and private deployment are both available for discussion",
      ],
      fields: {
        name: "Name",
        company: "Company",
        email: "Work Email",
        selectOptions: [
          "I want to build a custom AI tool",
          "I want to start with a low-cost pilot",
          "I want Cyano to manage the work",
          "I am not sure yet and want an assessment",
        ],
        message: "Briefly describe your business scenario, current cost, or the task you want AI to handle",
        submit: "Submit Inquiry",
      },
      copyright: "© 2026 Cyano Intelligence. All Rights Reserved.",
    },
  },
  technology: {
    proof: {
      kicker: "TECHNICAL PROOF",
      title: "Engineering Is Not Decoration,",
      accent: " It Is the Base of Stable Delivery",
      description:
        "The cost, latency, and retrieval challenges of long-context Agents, plus Cyano's context valuation engine, performance metrics, four-layer architecture, and system capability comparison.",
      imageAlt: "Cyano technical assurance architecture diagram",
      imageLabel: "Technical Assurance Architecture",
    },
    challenges: {
      titlePrefix: "The Impossible Triangle of Long-Context ",
      titleAccent: "Agents",
      titleSuffix: "",
      description: "As conversations deepen, brute-force token stacking leads to systemic breakdown.",
      items: [
        {
          title: "Cost Explosion",
          subtitle: "Cost Drift",
          desc: "As conversation rounds increase, sending full history causes API cost to rise exponentially. A single conversation can become dozens of times more expensive.",
        },
        {
          title: "Latency Spikes",
          subtitle: "TTFT Degradation",
          desc: "An overloaded context window significantly increases Time to First Token, damaging the real-time interaction experience.",
        },
        {
          title: '"Lost in the Middle"',
          subtitle: "Attention Dilution",
          desc: "Large amounts of noise distract model attention. More data does not always mean more intelligence; it can cause the model to miss critical instructions in the middle.",
        },
      ],
    },
    solution: {
      titlePrefix: "Intelligent Context ",
      titleAccent: "Valuation",
      titleSuffix: " Engine",
      description: "Manage an Agent's long-term memory dynamically, similar to how an operating system manages virtual memory.",
      rawLabel: "Raw Conversation Flow",
      outputLabel: "High-Value Memory",
      weightLabel: "Weight",
      optimizedLabel: "Optimized",
      levels: [
        {
          level: "Level 1",
          title: "Immutable Directives",
          weight: "0.4",
          strategy: "Lossless Retention",
          desc: "Highest-priority directives such as agent configuration and output format are recalled with full fidelity.",
        },
        {
          level: "Level 2",
          title: "Key States",
          weight: "0.3",
          strategy: "Structured Summary",
          desc: 'States such as "login successful" or "data parsing" are converted into dense structured state data.',
        },
        {
          level: "Level 3",
          title: "Reasoning Chains",
          weight: "0.2",
          strategy: "Aggressive Pruning",
          desc: "For chain-of-thought processes, only the final conclusion is retained while redundant trial paths are removed.",
        },
        {
          level: "Level 4",
          title: "Noise & Logs",
          weight: "0.1",
          strategy: "Root Cause Only",
          desc: "When errors occur, only the root cause is retained and stack noise is cleaned automatically.",
        },
      ],
    },
    performance: {
      titlePrefix: "Large-Scale ",
      titleAccent: "Optimization",
      description: "Based on a 100-turn conversation benchmark",
      metrics: [
        {
          value: "< 200",
          unit: "ms",
          label: "Latency Stability",
          desc: "Response speed stays stable from round 1 through round 50",
        },
        {
          value: "100",
          unit: "%",
          label: "Instruction Recall",
          desc: "Core configuration directives are retained without loss",
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
      title: "Cyano Four-Layer Intelligence Architecture",
      steps: [
        {
          id: 0,
          title: "01. Knowledge Ingestion Layer",
          desc: "Connect PDFs, SQL, APIs, and other heterogeneous data sources, then build dynamic vector indexes with permission controls.",
        },
        {
          id: 1,
          title: "02. Context Orchestration (RAG Engine)",
          desc: "Within a limited token budget, clean and assemble the most relevant 1% of information to reduce model noise.",
        },
        {
          id: 2,
          title: "03. Task Execution Layer (Agent)",
          desc: "Turn SOPs into playbooks with standard steps, validation rules, and fallback mechanisms that execute like code.",
          highlight: true,
        },
        {
          id: 3,
          title: "04. Enterprise Governance",
          desc: "Full-chain audit logs, citation tracing, and sensitive content interception.",
        },
      ],
      layers: ["SaaS Application UI", "Cyano Agent Core", "RAG Context Engine", "Enterprise Data (Files/DB)"],
    },
    comparison: {
      title: "From Individual Prompt Skills to System Capability",
      headers: ["Dimension", "Traditional Prompt Engineering", "Cyano Intelligence"],
      rows: [
        {
          title: "Core driver",
          bad: "Individual inspiration and technique",
          good: "Enterprise knowledge base + SOP",
        },
        {
          title: "Stability",
          bad: "Random outputs that are hard to reproduce",
          good: "Stable, auditable, reusable output",
        },
        {
          title: "Model relationship",
          bad: "Deeply tied to one model's habits",
          good: "Model agnostic",
        },
        {
          title: "Portability",
          bad: "Hard to migrate and always chasing model changes",
          good: "Portable and able to use the best model available now",
        },
      ],
    },
    trust: {
      title: "Compatible, Secure, and Ready to Deploy",
      cards: [
        {
          title: "SaaS Hosted Edition",
          desc: "Start quickly and scale elastically. Suitable for fast validation and lightweight scenarios. We provide an isolated cloud environment so the business can go live faster.",
        },
        {
          title: "Private Deployment Edition",
          desc: "Keep data in your own environment and run models locally. We provide complete Docker delivery and local compute adaptation to support data sovereignty and compliance.",
        },
      ],
    },
  },
  projectShowcase: {
    featured: {
      kicker: "FEATURED PROJECTS",
      title: "Project Capability Showcase,",
      accent: " Across Real Business Scenarios",
      description:
        "Each project is organized around business value, target users, core capabilities, and delivery form, helping clients quickly judge whether Cyano's AI products match their business problem.",
      projects: [
        {
          status: "Sales AI",
          title: "Personalized Sales Material Generation",
          value: "Generate one-to-one outreach content from customer profiles, industry signals, and sales goals.",
          audience: "Designed for teams that need lead generation, sales outreach, and customer segmentation at scale.",
          image: "/media/case-sales.svg",
          tone: "amber",
          tags: ["Targeted Leads", "Customer Profiles", "Sales Materials"],
        },
        {
          status: "Document Automation",
          title: "Intelligent Proposal and Bid Generation",
          value: "Generate editable proposal drafts from historical bids, knowledge bases, and project parameters.",
          audience: "Designed for teams that frequently produce bid documents, technical proposals, and business materials.",
          image: "/media/case-proposal.svg",
          tone: "mint",
          tags: ["Document Automation", "Knowledge References", "Proposal Generation"],
        },
        {
          status: "Enterprise Knowledge Base",
          title: "Enterprise Knowledge AI Assistant",
          value: "Connect internal wikis, manuals, or SOPs to answer employee questions with cited sources.",
          audience: "Designed for IT, operations, customer support, and internal support scenarios.",
          image: "/media/case-assistant.svg",
          tone: "blue",
          tags: ["Enterprise Wiki", "IT Assistant", "Knowledge Q&A"],
        },
      ],
    },
    materials: {
      kicker: "SHOWCASE MATERIALS",
      title: "Explore Project Materials by Scenario",
      description:
        "Project materials are organized around interface screenshots, process walkthroughs, and demo entries so clients can quickly understand system form, delivery scope, and business value.",
      slots: [
        {
          title: "Product Interface Showcase",
          body: "Use system interfaces, task panels, and result pages to see how AI connects to real business workflows.",
          status: "Interface Showcase",
        },
        {
          title: "Process Walkthrough",
          body: "Use screen recordings, explanations, and client demos to connect inputs, processing, review, and delivered output.",
          status: "Demo Entry",
        },
        {
          title: "Interactive Experience",
          body: "Use clickable demos, form simulators, or trial entries to help clients judge whether a scenario fits their business.",
          status: "Experience Entry",
        },
      ],
      ctaDescription: "If you want to know whether a scenario fits your business, contact us for a business diagnosis.",
      ctaLabel: "Contact Us",
    },
  },
  galleryViewer: {
    controlsLabel: "Gallery controls",
    back: "Back",
    original: "Original",
    navigationLabel: "Gallery navigation",
    previous: "Previous",
    next: "Next",
    imageAlt: (index: number) => `Cyano project screenshot ${index}`,
  },
};

export default en;
