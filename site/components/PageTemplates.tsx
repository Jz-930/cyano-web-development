import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  CheckCircle2,
  Clock,
  Lock,
  ShieldCheck,
  Sparkles,
  UserCheck,
} from "lucide-react";
import {
  type Locale,
  articleJsonLd,
  breadcrumbJsonLd,
  casesList,
  faqJsonLd,
  getArticleBlocks,
  getCase,
  getFounder,
  getInsight,
  getMediaMeta,
  getSolution,
  href,
  isDemoEnabled,
  legalCopy,
  organizationJsonLd,
  pick,
  serviceJsonLd,
  siteCopy,
  solutionsList,
  t,
  websiteJsonLd,
} from "@/lib/content";
import {
  getOptionalClients,
  getOptionalTestimonials,
} from "@/lib/server-inputs";
import { Footer } from "./Footer";
import { PageHeader } from "./PageHeaders";
import { HeroProvenanceStage } from "./HeroProvenanceStage";
import { Reveal, SpectralFlowCanvas } from "./MotionPrimitives";
import {
  EngagementTimelineScale,
  EngineeringBeforeAfter,
  FoundersShowcase,
  ResultsBand,
  SOLUTION_GALLERY_THEMES,
  SolutionsWorkflowExplorer,
} from "./HomeVisuals";
import {
  AnnotatedSystemGallery,
  BeforeAfterTracks,
  CaseCard,
  CaseDeliveryTimeline,
  CaseFilterGrid,
  CaseWorkflowGraph,
} from "./CaseVisuals";
import {
  ContextBudgetBar,
  CoreArchitectureInteractive,
  SupportedStackGroups,
  TurnCostLatencyChart,
} from "./TechVisuals";
import {
  ComparisonMatrix,
  DeploymentOptionsGrid,
  ModeSelectorQuiz,
} from "./EngagementVisuals";
import {
  ArticleInlineDiagram,
  ArticlePullQuote,
  CopyLinkButton,
  InsightCardsGrid,
  InsightCoverGraphic,
} from "./EditorialVisuals";
import { InteractiveDemo } from "./InteractiveDemo";
import { ContactForm, FAQList } from "./ContactForm";

export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replaceAll("<", "\\u003c"),
      }}
    />
  );
}

export function PageShell({
  locale,
  hideClosingCta = false,
  children,
}: {
  locale: Locale;
  hideClosingCta?: boolean;
  children: React.ReactNode;
}) {
  return (
    <>
      <main id="main">{children}</main>
      <Footer locale={locale} hideClosingCta={hideClosingCta} />
    </>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
  dark = false,
  action,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  dark?: boolean;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-12 flex flex-col justify-between gap-6 md:mb-16 lg:flex-row lg:items-end">
      <div className="max-w-3xl">
        <span className={`eyebrow-badge ${dark ? "eyebrow-badge-dark" : ""}`}>
          {eyebrow}
        </span>
        <h2
          className={`mt-3 text-[length:var(--fs-h2)] ${
            dark ? "text-white" : "text-[#111111]"
          }`}
        >
          {title}
        </h2>
        {description && (
          <p
            className={`prose-measure mt-4 text-[16px] leading-relaxed md:text-[17px] ${
              dark ? "text-white/72" : "text-[#444444]"
            }`}
          >
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

/* ==========================================================================
   1. HOMEPAGE (/ & /en) — Cyano Polychromatic Cinema, Real Systems & Gallery Rhythm
   ========================================================================== */
export function HomeView({ locale }: { locale: Locale }) {
  const heroLaminarMeta = getMediaMeta("/art/cyano-hero-laminar.webp");
  const homeTeamMeta = getMediaMeta("/art/team-natural.webp");
  const coreCases = casesList.filter((c) => c.group === "core");
  const clients = getOptionalClients();
  const testimonials = getOptionalTestimonials();

  return (
    <PageShell locale={locale}>
      {/* ACT 1: FULL-BLEED OBSIDIAN CYANO LAMINAR HERO + LIVE PRODUCTION SYSTEM STAGE */}
      <section className="surface-obsidian relative overflow-hidden pt-20 pb-20 md:pt-28 md:pb-28">
        {/* Seamless Nocturnal Cyano Laminar C-Channel & Data Droplet Sculpture */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[760px] overflow-hidden md:h-[860px]">
          <Image
            src="/art/cyano-hero-laminar.webp"
            alt=""
            aria-hidden="true"
            width={heroLaminarMeta.width}
            height={heroLaminarMeta.height}
            priority
            sizes="100vw"
            className="art-on-black h-full w-full object-cover object-right opacity-95"
          />
          {/* Gentle left & bottom vignette keeping typography 100% legible */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-r from-[#02080E] via-[#02080E]/74 to-transparent lg:via-[#02080E]/42"
          />
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#02080E] via-[#02080E]/85 to-transparent"
          />
          <SpectralFlowCanvas intensity="hero" />
        </div>

        <div className="site-container relative z-10">
          <div className="max-w-2xl pt-4 md:pt-8">
            <span className="eyebrow-badge eyebrow-badge-dark">
              {pick(locale, siteCopy.home.eyebrow)}
            </span>
            <h1 className="mt-5 text-[clamp(2.75rem,5.4vw,4.65rem)] font-normal leading-[1.1] tracking-tight text-white">
              {locale === "zh" ? (
                <>
                  <span className="block">为企业开发日常工作</span>
                  <span className="block">用得上的 AI 系统</span>
                </>
              ) : (
                pick(locale, siteCopy.home.title)
              )}
            </h1>
            <p className="prose-measure mt-6 text-[17px] leading-relaxed text-white/82 md:text-[18px]">
              {pick(locale, siteCopy.home.subtitle)}
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-7">
              <Link
                href={href(locale, "/contact#form")}
                className="btn-primary-mint"
              >
                <span>{pick(locale, siteCopy.nav.primaryCta)}</span>
                <ArrowUpRight size={17} />
              </Link>
              <Link
                href={href(locale, "/cases")}
                className="link-inline-dark"
              >
                <span>{pick(locale, siteCopy.home.secondaryCta)}</span>
                <ArrowRight size={17} />
              </Link>
            </div>
          </div>

          {/* Real Production System Showcase right inside the Hero Theater (honoring v1 business clarity!) */}
          <div className="mt-20 md:mt-28">
            <HeroProvenanceStage locale={locale} />
          </div>
        </div>
      </section>

      {/* ACT 2: MONUMENTAL GALLERY-WHITE RESULTS & CREDIBILITY BAND (G-03 + D-4) */}
      <ResultsBand locale={locale} />

      {/* OPTIONAL CLIENT LOGO WALL (G-16: only renders if content/inputs/clients.json exists) */}
      {clients.length > 0 && (
        <section className="surface-light border-b border-black/[0.08] py-12">
          <div className="site-container">
            <p className="font-mono-tech text-center text-[12px] uppercase tracking-[0.1em] text-[#666666]">
              {t(locale, "合作与服务过的机构", "ORGANIZATIONS WE HAVE WORKED WITH")}
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-10">
              {clients.map((cl) => (
                <img
                  key={cl.name}
                  src={cl.logoSrc}
                  alt={cl.name}
                  className="h-8 w-auto opacity-75 grayscale transition hover:opacity-100 hover:grayscale-0"
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ACT 3: GALLERY-WHITE SOLUTIONS WORKFLOW EXPLORER WITH SEAMLESS MULTIPLY ART (G-04) */}
      <section className="site-section surface-light border-b border-black/[0.08]">
        <div className="site-container">
          <Reveal>
            <SectionHeading
              eyebrow={pick(locale, siteCopy.home.solutionsSection.eyebrow)}
              title={pick(locale, siteCopy.home.solutionsSection.title)}
              description={pick(
                locale,
                siteCopy.home.solutionsSection.description
              )}
              action={
                <Link
                  href={href(locale, "/services")}
                  className="link-inline-tech"
                >
                  <span>{pick(locale, siteCopy.nav.allSolutions)}</span>
                  <ArrowRight size={16} />
                </Link>
              }
            />
          </Reveal>
          <Reveal delayMs={70}>
            <SolutionsWorkflowExplorer locale={locale} />
          </Reveal>
        </div>
      </section>

      {/* ACT 4: DELIVERED PRODUCTION SYSTEMS GALLERY */}
      <section className="site-section surface-mist">
        <div className="site-container space-y-16">
          <Reveal>
            <SectionHeading
              eyebrow={pick(locale, siteCopy.home.casesSection.eyebrow)}
              title={pick(locale, siteCopy.home.casesSection.title)}
              description={pick(locale, siteCopy.home.casesSection.description)}
              action={
                <Link
                  href={href(locale, "/cases")}
                  className="link-inline-tech"
                >
                  <span>{pick(locale, siteCopy.home.casesSection.viewAll)}</span>
                  <ArrowRight size={16} />
                </Link>
              }
            />
          </Reveal>

          <div className="grid gap-x-10 gap-y-16 md:grid-cols-2">
            {coreCases.map((c, idx) => (
              <Reveal key={c.slug} delayMs={idx * 60}>
                <CaseCard item={c} locale={locale} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ACT 5: NOCTURNAL ENGINEERING STAGE & OPTICAL DIPTYCH (G-05) */}
      <section className="site-section surface-obsidian">
        <div className="site-container relative z-10">
          <Reveal>
            <SectionHeading
              dark
              eyebrow={pick(locale, siteCopy.home.engineeringSection.eyebrow)}
              title={pick(locale, siteCopy.home.engineeringSection.title)}
              description={pick(
                locale,
                siteCopy.home.engineeringSection.description
              )}
              action={
                <Link
                  href={href(locale, "/technology")}
                  className="link-inline-dark"
                >
                  <span>{pick(locale, siteCopy.home.engineeringSection.cta)}</span>
                  <ArrowRight size={16} />
                </Link>
              }
            />
          </Reveal>
          <Reveal delayMs={70}>
            <EngineeringBeforeAfter locale={locale} />
          </Reveal>
        </div>
      </section>

      {/* ACT 6: ENGAGEMENT MODELS & PROPORTIONAL TIMELINE SCALE (G-06) */}
      <section className="site-section surface-light border-b border-black/[0.08]">
        <div className="site-container">
          <Reveal>
            <SectionHeading
              eyebrow={pick(locale, siteCopy.home.engagementSection.eyebrow)}
              title={pick(locale, siteCopy.home.engagementSection.title)}
              description={pick(
                locale,
                siteCopy.home.engagementSection.description
              )}
              action={
                <Link
                  href={href(locale, "/engagement")}
                  className="link-inline-tech"
                >
                  <span>{pick(locale, siteCopy.home.engagementSection.cta)}</span>
                  <ArrowRight size={16} />
                </Link>
              }
            />
          </Reveal>
          <Reveal delayMs={70}>
            <EngagementTimelineScale locale={locale} />
          </Reveal>
        </div>
      </section>

      {/* ACT 7: NATURAL FULL-COLOR FOUNDING TEAM + STUDIO WORKFLOW ILLUSTRATION (G-21) */}
      <section className="site-section surface-light border-b border-black/[0.08]">
        <div className="site-container space-y-16">
          <Reveal>
            <div className="grid items-center gap-10 lg:grid-cols-12">
              <div className="lg:col-span-6">
                <span className="eyebrow-badge">
                  {pick(locale, siteCopy.home.foundersSection.eyebrow)}
                </span>
                <h2 className="mt-3 text-[length:var(--fs-h2)] text-[#0B1520]">
                  {pick(locale, siteCopy.home.foundersSection.title)}
                </h2>
                <p className="prose-measure mt-4 text-[16px] leading-relaxed text-[#444444] md:text-[17px]">
                  {pick(locale, siteCopy.home.foundersSection.description)}
                </p>
                <div className="mt-7">
                  <Link
                    href={href(locale, "/about")}
                    className="link-inline-tech"
                  >
                    <span>{pick(locale, siteCopy.home.foundersSection.cta)}</span>
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>

              <div className="overflow-hidden rounded-2xl bg-[#F8F6F2] ring-1 ring-black/[0.06] lg:col-span-6">
                <Image
                  src="/art/team-natural.webp"
                  alt={t(
                    locale,
                    "Cyano 四位核心创始人共同评审企业 AI 系统架构的插画",
                    "Illustration of Cyano's four founders reviewing an enterprise AI system architecture"
                  )}
                  width={homeTeamMeta.width}
                  height={homeTeamMeta.height}
                  sizes="(max-width: 1024px) 94vw, 600px"
                  placeholder={homeTeamMeta.blurDataURL ? "blur" : "empty"}
                  blurDataURL={homeTeamMeta.blurDataURL || undefined}
                  className="block h-auto w-full object-cover"
                />
              </div>
            </div>
          </Reveal>

          <Reveal delayMs={70}>
            <FoundersShowcase locale={locale} />
          </Reveal>

          {/* Optional verified testimonials (G-16) */}
          {testimonials.length > 0 && (
            <div className="mt-16 grid gap-10 border-t border-black/10 pt-12 md:grid-cols-2">
              {testimonials.map((tm, idx) => (
                <blockquote key={idx} className="m-0 border-l-2 border-[#0B7A8C] pl-6">
                  <p className="text-[17px] leading-relaxed text-[#0B1520]">
                    “{pick(locale, tm.quote)}”
                  </p>
                  <footer className="mt-3 text-[13px] font-medium text-[#666666]">
                    {pick(locale, tm.authorTitle)} · {pick(locale, tm.companyType)}
                  </footer>
                </blockquote>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ACT 8: ENGINEERING INSIGHTS (G-19) */}
      <section className="site-section surface-mist">
        <div className="site-container">
          <Reveal>
            <SectionHeading
              eyebrow={pick(locale, siteCopy.home.insightsSection.eyebrow)}
              title={pick(locale, siteCopy.home.insightsSection.title)}
              action={
                <Link
                  href={href(locale, "/insights")}
                  className="link-inline-tech"
                >
                  <span>
                    {pick(locale, siteCopy.home.insightsSection.viewAll)}
                  </span>
                  <ArrowRight size={16} />
                </Link>
              }
            />
          </Reveal>
          <Reveal delayMs={70}>
            <InsightCardsGrid locale={locale} />
          </Reveal>
        </div>
      </section>

      <JsonLd data={[organizationJsonLd(locale), websiteJsonLd(locale)]} />
    </PageShell>
  );
}

/* ==========================================================================
   2. SOLUTIONS OVERVIEW (/services & /en/services)
   ========================================================================== */
export function ServicesOverviewView({ locale }: { locale: Locale }) {
  const domainAccents = ["#0B7A8C", "#1D4ED8", "#6D28D9", "#B45309"];
  const strataMeta = getMediaMeta("/art/cyano-core-strata.webp");

  return (
    <PageShell locale={locale}>
      <PageHeader
        locale={locale}
        variant="services"
        breadcrumbs={[{ label: pick(locale, siteCopy.nav.solutions) }]}
        eyebrow={t(locale, "企业 AI 解决方案", "ENTERPRISE AI SOLUTIONS")}
        title={t(
          locale,
          "围绕销售、标书、知识库与数据查询构建系统",
          "Production AI for sales, proposals, knowledge and data"
        )}
        intro={t(
          locale,
          "我们先核对任务频率、资料现状与审核责任，判断哪些步骤值得引入 AI。你可以选择完整定制系统、2–6 周低启动试点，或委托我们按批次托管交付。",
          "We evaluate task frequency, source readiness and review gates to pinpoint where AI saves real hours—available as an owned custom system, a 2–6 week pilot or a managed service."
        )}
      >
        <Link href={href(locale, "/contact#form")} className="btn-primary-dark">
          <span>{pick(locale, siteCopy.nav.primaryCta)}</span>
          <ArrowUpRight size={17} />
        </Link>
        <Link href={href(locale, "/engagement")} className="link-inline-tech">
          <span>{pick(locale, siteCopy.footer.secondaryCta)}</span>
          <ArrowRight size={16} />
        </Link>
      </PageHeader>

      <section className="site-section surface-light">
        <div className="site-container">
          {/* Open Gallery Chapters Separated by Clean Hairlines (ZERO outer card boxes!) */}
          <div className="divide-y divide-black/12 border-t border-b border-black/12">
            {solutionsList.map((sol, idx) => {
              const theme =
                SOLUTION_GALLERY_THEMES[sol.slug] ?? {
                  art: "/art/cyano-sol-docs.webp",
                  accent: domainAccents[idx % domainAccents.length],
                };
              const accent = theme.accent;
              const solArtMeta = getMediaMeta(theme.art);
              return (
                <Reveal key={sol.slug}>
                  <article className="py-14 md:py-20">
                    <div className="grid gap-12 lg:grid-cols-12 lg:items-start">
                      {/* Left 6 Columns: Promise, Dedicated Gallery Sculpture, Deliverables & Links */}
                      <div className="lg:col-span-6">
                        <span
                          className="font-mono-tech text-[12px] font-medium uppercase tracking-[0.12em]"
                          style={{ color: accent }}
                        >
                          0{idx + 1} · {pick(locale, sol.name)}
                        </span>
                        <h2 className="mt-3 text-[clamp(1.75rem,2.8vw,2.45rem)] font-normal text-[#0B1520]">
                          {pick(locale, sol.promise)}
                        </h2>
                        <p className="mt-4 text-[16px] leading-relaxed text-[#444444]">
                          {pick(locale, sol.intro)}
                        </p>

                        {/* Seamless Gallery-White Bespoke Optical Sculpture for Each Domain */}
                        <div className="my-7 flex items-center justify-center sm:justify-start">
                          <Image
                            src={theme.art}
                            alt=""
                            aria-hidden="true"
                            width={solArtMeta.width}
                            height={solArtMeta.height}
                            sizes="(max-width: 1024px) 84vw, 380px"
                            className="art-on-white h-auto w-full max-w-[380px] object-contain"
                          />
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                          {sol.deliverables.map((d, dIdx) => (
                            <div
                              key={dIdx}
                              className="flex items-start gap-2.5 text-[14px] text-[#222222]"
                            >
                              <Check
                                size={16}
                                style={{ color: accent }}
                                className="mt-0.5 shrink-0"
                              />
                              <span>{pick(locale, d)}</span>
                            </div>
                          ))}
                        </div>

                        <div className="mt-9 flex flex-wrap items-center gap-7">
                          <Link
                            href={href(locale, `/services/${sol.slug}`)}
                            className="btn-primary-dark"
                          >
                            <span>{t(locale, "查看方案详情", "Explore solution")}</span>
                            <ArrowRight size={16} />
                          </Link>
                          <Link
                            href={href(locale, `/cases/${sol.caseSlug}`)}
                            className="link-inline-tech"
                          >
                            <span>
                              {t(locale, "查看对应客户项目", "See production case")}
                            </span>
                            <ArrowUpRight size={15} />
                          </Link>
                        </div>
                      </div>

                      {/* Right 6 Columns: Minimalist 2x2 Architectural Hairline Pipeline */}
                      <div className="grid border-t border-l border-black/12 sm:grid-cols-2 lg:col-span-6">
                        {sol.workflow.map((node, nIdx) => (
                          <div
                            key={nIdx}
                            className="flex flex-col justify-between border-r border-b border-black/12 p-6 sm:p-7"
                          >
                            <div>
                              <div className="flex items-center justify-between gap-2">
                                <span
                                  className="font-mono-tech text-[12px] font-medium uppercase"
                                  style={{
                                    color: node.humanReview ? "#D97706" : accent,
                                  }}
                                >
                                  0{nIdx + 1} · {pick(locale, node.stage)}
                                </span>
                                {node.humanReview && (
                                  <UserCheck size={15} className="text-[#D97706]" />
                                )}
                              </div>
                              <h3 className="mt-3 text-[18px] font-medium text-[#111111]">
                                {pick(locale, node.title)}
                              </h3>
                              <p className="mt-2 text-[14px] leading-relaxed text-[#555555]">
                                {pick(locale, node.detail)}
                              </p>
                            </div>
                            <div className="font-mono-tech mt-5 pt-3 border-t border-black/[0.06] text-[12px] text-[#666666]">
                              {pick(locale, node.badge)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>

          {/* Specialized Vertical Custom Builds Spotlight with Bespoke Optical Strata */}
          <div className="mt-16 overflow-hidden rounded-2xl bg-[#02080E] text-white ring-1 ring-white/[0.08] lg:grid lg:grid-cols-12 lg:items-center">
            <div className="p-8 sm:p-12 lg:col-span-7">
              <span className="eyebrow-badge eyebrow-badge-dark">
                {t(locale, "垂直场景定制", "SPECIALIZED VERTICAL SYSTEMS")}
              </span>
              <h2 className="mt-3 text-[26px] font-normal text-white md:text-[30px]">
                {t(
                  locale,
                  "你的业务场景不在上述四类清单中？",
                  "Have a specialized domain workflow outside these four?"
                )}
              </h2>
              <p className="mt-3 text-[15px] leading-relaxed text-white/75">
                {t(
                  locale,
                  "我们也承接多物业资产财务归集、百万字长篇设定记忆管理等行业专有系统。带上一份现有工作样本即可评估可行性与实施周期。",
                  "We also engineer vertical systems such as multi-property OCR accounting and million-word narrative memory engines. Bring a work sample to assess fit."
                )}
              </p>
              <div className="mt-7">
                <Link
                  href={href(locale, "/contact#form")}
                  className="btn-primary-mint"
                >
                  <span>{pick(locale, siteCopy.nav.primaryCta)}</span>
                  <ArrowUpRight size={16} />
                </Link>
              </div>
            </div>

            <div className="relative hidden h-full min-h-[260px] overflow-hidden lg:col-span-5 lg:block">
              <Image
                src="/art/cyano-core-strata.webp"
                alt=""
                aria-hidden="true"
                width={strataMeta.width}
                height={strataMeta.height}
                sizes="480px"
                className="h-full w-full object-cover opacity-90"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 left-0 w-28 bg-gradient-to-r from-[#02080E] to-transparent"
              />
            </div>
          </div>
        </div>
      </section>

      <JsonLd
        data={breadcrumbJsonLd(locale, [
          { name: t(locale, "首页", "Home"), path: "/" },
          { name: pick(locale, siteCopy.nav.solutions), path: "/services" },
        ])}
      />
    </PageShell>
  );
}

/* ==========================================================================
   3. SOLUTION DETAIL (/services/[slug] & /en/services/[slug])
   ========================================================================== */
export function SolutionDetailView({
  locale,
  slug,
}: {
  locale: Locale;
  slug: string;
}) {
  const sol = getSolution(slug)!;
  const relatedCase = getCase(sol.caseSlug)!;
  const solTheme = SOLUTION_GALLERY_THEMES[sol.slug];
  const strataMeta = getMediaMeta("/art/cyano-core-strata.webp");
  const painAccents = ["#0B7A8C", "#1D4ED8", "#B45309"];

  return (
    <PageShell locale={locale}>
      <PageHeader
        locale={locale}
        variant="services"
        artOverride={solTheme?.art}
        breadcrumbs={[
          { label: pick(locale, siteCopy.nav.solutions), path: "/services" },
          { label: pick(locale, sol.name) },
        ]}
        eyebrow={pick(locale, sol.name)}
        title={pick(locale, sol.promise)}
        intro={pick(locale, sol.intro)}
      >
        <Link href={href(locale, "/contact#form")} className="btn-primary-dark">
          <span>{pick(locale, siteCopy.nav.primaryCta)}</span>
          <ArrowUpRight size={17} />
        </Link>
        <Link
          href={href(locale, `/cases/${relatedCase.slug}`)}
          className="link-inline-tech"
        >
          <span>{t(locale, "查看相关生产案例", "See production case")}</span>
          <ArrowRight size={16} />
        </Link>
      </PageHeader>

      {/* Operational Bottlenecks — 3 Open Hairline Columns */}
      <section className="site-section surface-light border-b border-black/[0.08]">
        <div className="site-container">
          <SectionHeading
            eyebrow={t(locale, "典型业务痛点", "OPERATIONAL BOTTLENECKS")}
            title={t(
              locale,
              "这项工作在日常执行中常遇到的三个问题",
              "Three recurring bottlenecks in this workflow"
            )}
          />
          <div className="grid gap-10 border-t border-black/12 pt-10 md:grid-cols-3 md:gap-0 md:divide-x md:divide-black/10">
            {sol.pains.map((pain, idx) => (
              <article
                key={idx}
                className={`flex flex-col justify-between ${
                  idx === 0
                    ? "md:pr-9"
                    : idx === 1
                      ? "md:px-9"
                      : "md:pl-9"
                }`}
              >
                <div>
                  <span
                    className="font-mono-tech text-[12px] font-medium"
                    style={{ color: painAccents[idx % painAccents.length] }}
                  >
                    0{idx + 1}
                  </span>
                  <h3 className="mt-3 text-[21px] font-normal text-[#111111]">
                    {pick(locale, pain.title)}
                  </h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-[#444444]">
                    {pick(locale, pain.scenario)}
                  </p>
                </div>
                <div
                  className="font-mono-tech mt-6 border-t border-black/[0.08] pt-3 text-[12px] font-medium"
                  style={{ color: painAccents[idx % painAccents.length] }}
                >
                  {pick(locale, pain.metricTag)}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Bespoke 4-Stage Workflow + Capabilities + Nocturnal Deliverables */}
      <section className="site-section surface-mist">
        <div className="site-container space-y-20">
          <div>
            <SectionHeading
              eyebrow={t(locale, "工程处理链路", "WORKFLOW ARCHITECTURE")}
              title={t(
                locale,
                "系统如何按步骤处理任务并保留复核控制",
                "How the system processes requests with human checkpoints"
              )}
            />
            <div className="grid border-t border-l border-black/12 bg-white md:grid-cols-2 lg:grid-cols-4">
              {sol.workflow.map((node, idx) => (
                <div
                  key={idx}
                  className="flex flex-col justify-between border-r border-b border-black/12 p-7"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className="font-mono-tech text-[12px] font-medium uppercase"
                        style={{
                          color: node.humanReview ? "#D97706" : "#4F46E5",
                        }}
                      >
                        0{idx + 1} · {pick(locale, node.stage)}
                      </span>
                      {node.humanReview && (
                        <UserCheck size={15} className="text-[#D97706]" />
                      )}
                    </div>
                    <h3 className="mt-3 text-[18px] font-medium text-[#111111]">
                      {pick(locale, node.title)}
                    </h3>
                    <p className="mt-2.5 text-[14px] leading-relaxed text-[#555555]">
                      {pick(locale, node.detail)}
                    </p>
                  </div>
                  <div className="font-mono-tech mt-6 border-t border-black/[0.07] pt-3 text-[12px] text-[#666666]">
                    {pick(locale, node.badge)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-12 lg:grid-cols-12 lg:items-start">
            <div className="lg:col-span-7">
              <span className="eyebrow-badge">
                {t(locale, "工程细节", "CAPABILITIES")}
              </span>
              <h3 className="mt-2 text-[28px] font-normal text-[#111111]">
                {t(locale, "关键工程能力", "Key engineering capabilities")}
              </h3>
              <div className="mt-6 divide-y divide-black/10 border-t border-b border-black/10">
                {sol.capabilities.map((cap, idx) => (
                  <div key={idx} className="py-6">
                    <h4 className="text-[18px] font-medium text-[#111111]">
                      {pick(locale, cap.title)}
                    </h4>
                    <p className="mt-2 text-[15px] leading-relaxed text-[#444444]">
                      {pick(locale, cap.detail)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl bg-[#02080E] text-white ring-1 ring-white/[0.08] lg:col-span-5">
              <div className="relative aspect-[16/9] w-full overflow-hidden">
                <Image
                  src="/art/cyano-core-strata.webp"
                  alt=""
                  aria-hidden="true"
                  width={strataMeta.width}
                  height={strataMeta.height}
                  sizes="(max-width: 1024px) 94vw, 480px"
                  className="h-full w-full object-cover"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#02080E] to-transparent"
                />
              </div>
              <div className="p-8 pt-4 sm:p-10 sm:pt-5">
                <span className="font-mono-tech text-[12px] uppercase tracking-[0.12em] text-[#22D3EE]">
                  {t(locale, "交付清单", "DELIVERABLES")}
                </span>
                <h3 className="mt-2 text-[26px] font-normal text-white">
                  {t(locale, "你将获得的交付物", "What your team receives")}
                </h3>
                <ul className="mt-6 flex list-none flex-col gap-4 p-0">
                  {sol.deliverables.map((del, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-3 text-[15px] text-white/85"
                    >
                      <CheckCircle2
                        size={18}
                        className="mt-0.5 shrink-0 text-[#22D3EE]"
                      />
                      <span>{pick(locale, del)}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-8 border-t border-white/12 pt-5 text-[13px] leading-relaxed text-white/60">
                  {t(
                    locale,
                    "低启动试点通常在 2–6 周内交付首个可用版本；完整定制首期一般为 6–12 周。",
                    "A scoped pilot typically delivers a working v1 in 2–6 weeks; full custom builds take 6–12 weeks depending on integrations."
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Case + Optional Interactive Demo + FAQs */}
      <section className="site-section surface-light">
        <div className="site-container space-y-20">
          <div>
            <SectionHeading
              eyebrow={t(locale, "已交付客户系统", "IN PRODUCTION")}
              title={t(
                locale,
                "查看该方向下的真实系统与项目成果",
                "Inspect a live client system built on this workflow"
              )}
            />
            <div className="max-w-3xl">
              <CaseCard item={relatedCase} locale={locale} />
            </div>
          </div>

          {(sol.slug === "knowledge-assistant" ||
            sol.slug === "data-query") && (
            <div>
              <SectionHeading
                eyebrow={t(locale, "在线交互预览", "INTERACTIVE SANDBOX")}
                title={t(
                  locale,
                  "点击示例问题，查看检索与只读校验流程",
                  "Test sample prompts to inspect citations & validation"
                )}
              />
              <InteractiveDemo
                locale={locale}
                mode={sol.slug === "data-query" ? "sql" : "kb"}
              />
            </div>
          )}

          <div>
            <SectionHeading
              eyebrow={t(locale, "常见疑问", "COMMON QUESTIONS")}
              title={t(
                locale,
                "启动前经常沟通的三个问题",
                "Questions teams ask before starting"
              )}
            />
            <FAQList items={sol.faqs} locale={locale} />
          </div>
        </div>
      </section>

      <JsonLd
        data={[
          breadcrumbJsonLd(locale, [
            { name: t(locale, "首页", "Home"), path: "/" },
            { name: pick(locale, siteCopy.nav.solutions), path: "/services" },
            { name: pick(locale, sol.name), path: `/services/${sol.slug}` },
          ]),
          serviceJsonLd(locale, sol),
          faqJsonLd(locale, sol.faqs),
        ]}
      />
    </PageShell>
  );
}

/* ==========================================================================
   4. CASES OVERVIEW (/cases & /en/cases)
   ========================================================================== */
export function CasesOverviewView({ locale }: { locale: Locale }) {
  return (
    <PageShell locale={locale}>
      <PageHeader
        locale={locale}
        variant="cases"
        breadcrumbs={[{ label: pick(locale, siteCopy.nav.cases) }]}
        eyebrow={t(locale, "客户项目实录", "CLIENT SYSTEMS")}
        title={t(
          locale,
          "六个已交付客户项目的真实界面与成果",
          "Six client AI systems running in production"
        )}
        intro={t(
          locale,
          "覆盖工程制造、咨询投研、企业 IT、零售供应链、物业管理与内容生产六个行业。界面中的客户专有信息已按保密协议脱敏。",
          "Spanning manufacturing, consulting, enterprise IT, retail, property operations and content production. Screenshots are anonymized per client confidentiality agreements."
        )}
      >
        <Link
          href={href(locale, "/contact?inquiry=demo#form")}
          className="btn-primary-dark"
        >
          <span>{pick(locale, siteCopy.demo.ndaButton)}</span>
          <ArrowUpRight size={17} />
        </Link>
      </PageHeader>

      <section className="site-section surface-light">
        <div className="site-container space-y-12">
          <div className="flex items-start gap-3 border-l-2 border-[#0B7A8C] pl-4 text-[14px] text-[#444444]">
            <Lock size={16} className="mt-0.5 shrink-0 text-[#0B7A8C]" />
            <p>{pick(locale, siteCopy.demo.publicNote)}</p>
          </div>

          <CaseFilterGrid locale={locale} />
        </div>
      </section>

      <JsonLd
        data={breadcrumbJsonLd(locale, [
          { name: t(locale, "首页", "Home"), path: "/" },
          { name: pick(locale, siteCopy.nav.cases), path: "/cases" },
        ])}
      />
    </PageShell>
  );
}

/* ==========================================================================
   5. CASE DETAIL (/cases/[slug] & /en/cases/[slug])
   ========================================================================== */
export function CaseDetailView({
  locale,
  slug,
}: {
  locale: Locale;
  slug: string;
}) {
  const item = getCase(slug)!;
  const showPublicDemo = Boolean(item.demoUrl && isDemoEnabled(item.slug));
  const moreCases = casesList.filter((c) => c.slug !== slug).slice(0, 2);
  const statAccents = ["#0B7A8C", "#1D4ED8", "#B45309"];

  return (
    <PageShell locale={locale}>
      <PageHeader
        locale={locale}
        variant="cases"
        breadcrumbs={[
          { label: pick(locale, siteCopy.nav.cases), path: "/cases" },
          { label: pick(locale, item.system) },
        ]}
        eyebrow={`${pick(locale, item.industry)} · ${pick(
          locale,
          item.solutionLabel
        )}`}
        title={pick(locale, item.title)}
        intro={pick(locale, item.profile)}
      >
        <Link
          href={href(locale, `/contact?case=${item.slug}#form`)}
          className="btn-primary-dark"
        >
          <span>{pick(locale, siteCopy.demo.ndaButton)}</span>
          <ArrowUpRight size={17} />
        </Link>
        {showPublicDemo && item.demoUrl && (
          <a
            href={item.demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary-light"
          >
            <span>{pick(locale, siteCopy.demo.publicButton)}</span>
            <ArrowUpRight size={16} />
          </a>
        )}
      </PageHeader>

      {/* Architectural Fact Strip + 3 Monumental Scoped Metrics (jrvs.ca/data-and-ai style) */}
      <section className="surface-light border-b border-black/[0.08] py-16">
        <div className="site-container space-y-14">
          <div className="grid gap-8 border-b border-black/10 pb-10 sm:grid-cols-2 lg:grid-cols-4">
            {[
              [t(locale, "交付系统", "System"), pick(locale, item.system)],
              [t(locale, "方案分类", "Category"), pick(locale, item.solutionLabel)],
              [t(locale, "合作方式", "Engagement"), pick(locale, item.model)],
              [t(locale, "实施周期", "Delivery time"), pick(locale, item.duration)],
            ].map(([label, val]) => (
              <div key={label}>
                <span className="font-mono-tech block text-[12px] uppercase tracking-[0.08em] text-[#666666]">
                  {label}
                </span>
                <span className="mt-1.5 block text-[17px] font-medium text-[#111111]">
                  {val}
                </span>
              </div>
            ))}
          </div>

          <div className="grid gap-10 md:grid-cols-3 md:gap-0 md:divide-x md:divide-black/10">
            {item.stats.map((st, idx) => (
              <div
                key={idx}
                className={`${
                  idx === 0
                    ? "md:pr-10"
                    : idx === 1
                      ? "md:px-10"
                      : "md:pl-10"
                }`}
              >
                <div
                  aria-hidden="true"
                  className="h-[2px] w-10"
                  style={{ backgroundColor: statAccents[idx % statAccents.length] }}
                />
                <div className="mt-6 text-[clamp(2.2rem,3.4vw,3.1rem)] font-light tracking-tight text-[#111111] tabular-nums">
                  {pick(locale, st.value)}
                </div>
                <div className="mt-3 text-[17px] font-medium text-[#111111]">
                  {pick(locale, st.label)}
                </div>
                <p className="mt-1.5 text-[14px] leading-relaxed text-[#666666]">
                  {pick(locale, st.condition)}
                </p>
              </div>
            ))}
          </div>

          {showPublicDemo && (
            <p className="text-[13px] text-[#666666]">
              {pick(locale, siteCopy.demo.publicNote)}
            </p>
          )}
        </div>
      </section>

      {/* Background, Challenges & Why Generic Chat Falls Short */}
      <section className="site-section surface-light">
        <div className="site-container grid gap-12 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-7">
            <span className="eyebrow-badge">
              {t(locale, "项目背景与挑战", "CONTEXT & CHALLENGES")}
            </span>
            <h2 className="mt-3 text-[length:var(--fs-h2)] text-[#111111]">
              {t(
                locale,
                "立项前需要解决的实际阻力",
                "What slowed the team down before this build"
              )}
            </h2>
            <p className="mt-5 text-[16px] leading-relaxed text-[#444444]">
              {pick(locale, item.background)}
            </p>
            <ul className="mt-8 flex list-none flex-col divide-y divide-black/10 border-t border-b border-black/10 p-0">
              {item.challenges.map((ch, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-4 py-5 text-[15px] text-[#222222]"
                >
                  <span className="font-mono-tech mt-0.5 text-[12px] font-medium text-[#0B7A8C]">
                    0{idx + 1}
                  </span>
                  <span>{pick(locale, ch)}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col justify-between rounded-2xl bg-[#000000] p-8 text-white sm:p-10 lg:col-span-5">
            <div>
              <span className="eyebrow-badge eyebrow-badge-dark">
                {t(locale, "工程必要性", "WHY CUSTOM ENGINEERING")}
              </span>
              <h3 className="mt-3 text-[24px] font-normal text-white">
                {t(
                  locale,
                  "为什么通用聊天工具无法直接胜任？",
                  "Why off-the-shelf chat tools could not handle this"
                )}
              </h3>
              <p className="mt-4 text-[15px] leading-relaxed text-white/80">
                {pick(locale, item.whyNotGeneric)}
              </p>
            </div>

            <div className="mt-8 space-y-3 border-t border-white/12 pt-6">
              <span className="font-mono-tech block text-[12px] uppercase tracking-[0.1em] text-[#00C2FF]">
                {t(locale, "关键技术亮点", "TECHNICAL HIGHLIGHTS")}
              </span>
              {item.techHighlights.map((th, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 text-[14px] text-white/80"
                >
                  <Check size={15} className="mt-0.5 shrink-0 text-[#00C2FF]" />
                  <span>{pick(locale, th)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Annotated System Gallery (G-13) */}
      <section className="site-section surface-mist">
        <div className="site-container">
          <SectionHeading
            eyebrow={t(locale, "生产界面实拍与标注", "ANNOTATED SYSTEM SCREENS")}
            title={pick(locale, item.system)}
            description={t(
              locale,
              "点击图上数字标号查看对应功能模块说明，或切换下方缩略图浏览全部界面。",
              "Select numbered pins to inspect key workflow controls, or switch thumbnails below to browse all screens."
            )}
          />
          <AnnotatedSystemGallery item={item} locale={locale} />
        </div>
      </section>

      {/* Before/After Tracks (G-12) + Workflow Graph (G-14) + Delivery Timeline (G-15) */}
      <section className="site-section surface-light">
        <div className="site-container space-y-24">
          <div>
            <SectionHeading
              eyebrow={t(locale, "流程耗时对比", "BEFORE & AFTER CYCLE TIME")}
              title={t(
                locale,
                "改造前后的执行链路与人工把关节点",
                "How task execution and human review changed"
              )}
            />
            <BeforeAfterTracks item={item} locale={locale} />
          </div>

          <div>
            <SectionHeading
              eyebrow={t(locale, "定制工作流拆解", "SYSTEM WORKFLOW")}
              title={t(
                locale,
                "从输入源接入到业务交付的四个阶段",
                "Four stages from source intake to verified output"
              )}
            />
            <CaseWorkflowGraph item={item} locale={locale} />
          </div>

          <div>
            <SectionHeading
              eyebrow={t(locale, "实施与交付节奏", "DELIVERY TIMELINE")}
              title={t(
                locale,
                "该项目从梳理到正式上线的推进里程碑",
                "Milestones from initial audit to production launch"
              )}
            />
            <CaseDeliveryTimeline item={item} locale={locale} />
          </div>

          {item.interactiveDemo && (
            <div>
              <SectionHeading
                eyebrow={t(locale, "交互沙盒体验", "INTERACTIVE WALKTHROUGH")}
                title={t(
                  locale,
                  "在线体验脱敏示例问答与校验过程",
                  "Try preset anonymized queries right on this page"
                )}
              />
              <InteractiveDemo locale={locale} mode={item.interactiveDemo} />
            </div>
          )}

          {/* Project Outcome Summary Stage (Fixes V-18: NO Quote icon!) */}
          <div className="surface-closing rounded-2xl p-8 text-white md:p-14">
            <div className="flex items-center gap-2 font-mono-tech text-[12px] font-medium uppercase tracking-[0.12em] text-[#00C2FF]">
              <Sparkles size={15} />
              <span>{t(locale, "项目交付成果总结", "PROJECT OUTCOME SUMMARY")}</span>
            </div>
            <h2 className="mt-4 max-w-4xl text-[clamp(1.6rem,2.7vw,2.35rem)] font-normal leading-snug text-white">
              {pick(locale, item.outcome)}
            </h2>
            <div className="mt-8 flex flex-wrap items-center gap-6">
              <Link
                href={href(locale, `/contact?case=${item.slug}#form`)}
                className="btn-primary-mint"
              >
                <span>
                  {t(locale, "评估类似业务场景", "Discuss a similar workflow")}
                </span>
                <ArrowUpRight size={16} />
              </Link>
              <Link
                href={href(locale, "/technology")}
                className="link-inline-dark"
              >
                <span>{t(locale, "了解底层工程架构", "Explore Cyano Core")}</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          {/* More Systems in Production */}
          <div>
            <SectionHeading
              eyebrow={t(locale, "继续浏览", "MORE CLIENT SYSTEMS")}
              title={t(
                locale,
                "其他正在运行的客户项目",
                "Other systems running in production"
              )}
            />
            <div className="grid gap-10 md:grid-cols-2">
              {moreCases.map((mc) => (
                <CaseCard key={mc.slug} item={mc} locale={locale} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <JsonLd
        data={breadcrumbJsonLd(locale, [
          { name: t(locale, "首页", "Home"), path: "/" },
          { name: pick(locale, siteCopy.nav.cases), path: "/cases" },
          { name: pick(locale, item.system), path: `/cases/${item.slug}` },
        ])}
      />
    </PageShell>
  );
}

/* ==========================================================================
   6. TECHNOLOGY (/technology & /en/technology)
   ========================================================================== */
export function TechnologyView({ locale }: { locale: Locale }) {
  const prismMeta = getMediaMeta("/art/cyano-context-prism.webp");

  return (
    <PageShell locale={locale}>
      <PageHeader
        locale={locale}
        variant="technology"
        breadcrumbs={[{ label: pick(locale, siteCopy.nav.technology) }]}
        eyebrow={pick(locale, siteCopy.technology.eyebrow)}
        title={pick(locale, siteCopy.technology.title)}
        intro={pick(locale, siteCopy.technology.intro)}
      >
        <Link href={href(locale, "/contact#form")} className="btn-primary-dark">
          <span>{pick(locale, siteCopy.technology.cta)}</span>
          <ArrowUpRight size={17} />
        </Link>
      </PageHeader>

      {/* 4-Layer Interactive Cyano Core Stack (G-08) */}
      <section className="site-section surface-light">
        <div className="site-container">
          <SectionHeading
            eyebrow={t(locale, "四层工程架构", "FOUR-LAYER PLATFORM")}
            title="Cyano Core"
            description={pick(locale, siteCopy.technology.coreDefinition)}
          />
          <CoreArchitectureInteractive locale={locale} />
        </div>
      </section>

      {/* Context Engineering & Interactive Benchmark Chart on Obsidian Stage (G-09 + G-10) */}
      <section className="site-section surface-obsidian">
        <div className="site-container space-y-16">
          <div className="grid items-center gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <span className="eyebrow-badge eyebrow-badge-dark">
                {t(locale, "长上下文动态估值", "CONTEXT BUDGET ENGINEERING")}
              </span>
              <h2 className="mt-3 text-[length:var(--fs-h2)] text-white">
                {t(
                  locale,
                  "按当前子任务选择高价值上下文，保持多轮长对话稳定低延迟",
                  "Selective four-tier context keeps 100-turn workflows fast and predictable"
                )}
              </h2>
            </div>

            <div className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-[#000000] ring-1 ring-white/[0.08] lg:col-span-5">
              <Image
                src="/art/cyano-context-prism.webp"
                alt=""
                aria-hidden="true"
                width={prismMeta.width}
                height={prismMeta.height}
                sizes="(max-width: 1024px) 94vw, 520px"
                className="h-full w-full object-cover"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#02080E] to-transparent"
              />
            </div>
          </div>

          <ContextBudgetBar locale={locale} />
          <TurnCostLatencyChart locale={locale} />
        </div>
      </section>

      {/* Supported Models, Systems & Security Governance (G-11) */}
      <section className="site-section surface-light">
        <div className="site-container space-y-16">
          <div>
            <SectionHeading
              eyebrow={t(locale, "生态兼容与连接器", "SUPPORTED STACK")}
              title={t(
                locale,
                "灵活对接主流大模型、企业数据库与现有协作工具",
                "Connect foundation models, databases and collaboration suites"
              )}
            />
            <SupportedStackGroups locale={locale} />
          </div>

          <div className="flex flex-col items-start justify-between gap-8 rounded-2xl bg-[#000000] p-8 text-white sm:p-12 md:flex-row md:items-center">
            <div className="flex max-w-3xl items-start gap-5">
              <ShieldCheck
                size={32}
                strokeWidth={1.35}
                className="mt-1 shrink-0 text-[#00C2FF]"
              />
              <div>
                <h2 className="text-[24px] font-normal text-white md:text-[28px]">
                  {pick(locale, siteCopy.technology.securityBanner.title)}
                </h2>
                <p className="mt-3 text-[15px] leading-relaxed text-white/75">
                  {pick(locale, siteCopy.technology.securityBanner.body)}
                </p>
              </div>
            </div>
            <Link
              href={href(locale, "/contact#form")}
              className="btn-primary-mint shrink-0"
            >
              <span>{t(locale, "确认安全与部署方案", "Discuss deployment")}</span>
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <JsonLd
        data={breadcrumbJsonLd(locale, [
          { name: t(locale, "首页", "Home"), path: "/" },
          { name: pick(locale, siteCopy.nav.technology), path: "/technology" },
        ])}
      />
    </PageShell>
  );
}

/* ==========================================================================
   7. ENGAGEMENT (/engagement & /en/engagement)
   ========================================================================== */
export function EngagementView({ locale }: { locale: Locale }) {
  const stepAccents = ["#0B7A8C", "#1D4ED8", "#0E7490", "#6D28D9", "#B45309"];

  return (
    <PageShell locale={locale}>
      <PageHeader
        locale={locale}
        variant="engagement"
        breadcrumbs={[{ label: pick(locale, siteCopy.nav.engagement) }]}
        eyebrow={pick(locale, siteCopy.engagement.eyebrow)}
        title={pick(locale, siteCopy.engagement.title)}
        intro={pick(locale, siteCopy.engagement.intro)}
      >
        <Link href={href(locale, "/contact#form")} className="btn-primary-dark">
          <span>{pick(locale, siteCopy.nav.primaryCta)}</span>
          <ArrowUpRight size={17} />
        </Link>
      </PageHeader>

      {/* Interactive 3-Question Selector + Timeline + 5-Row Matrix */}
      <section className="site-section surface-light border-b border-black/[0.08]">
        <div className="site-container space-y-20">
          <ModeSelectorQuiz locale={locale} />

          <div>
            <SectionHeading
              eyebrow={t(locale, "三种模式全景对比", "SIDE-BY-SIDE COMPARISON")}
              title={t(
                locale,
                "交付周期、资产归属与日常运维责任一览",
                "Compare timeline, ownership and operating responsibility"
              )}
            />
            <div className="space-y-12">
              <EngagementTimelineScale locale={locale} compact />
              <ComparisonMatrix locale={locale} />
            </div>
          </div>
        </div>
      </section>

      {/* 5-Step Delivery Process (#diagnosis) + Deployment Options */}
      <section id="diagnosis" className="site-section surface-mist">
        <div className="site-container space-y-20">
          <div>
            <SectionHeading
              eyebrow={t(locale, "五步标准推进流程", "DELIVERY PROCESS")}
              title={t(
                locale,
                "从需求诊断到上线后长期维护",
                "Five stages from initial work-sample review to ongoing upkeep"
              )}
            />
            <div className="grid border-t border-l border-black/12 bg-white md:grid-cols-3 lg:grid-cols-5">
              {siteCopy.engagement.processSteps.map((st, idx) => {
                const owner = getFounder(st.ownerId as "F1" | "F2" | "F3" | "F4");
                return (
                  <div
                    key={st.step}
                    className="flex flex-col justify-between border-r border-b border-black/12 p-6"
                  >
                    <div>
                      <span
                        className="font-mono-tech text-[13px] font-medium"
                        style={{ color: stepAccents[idx % stepAccents.length] }}
                      >
                        {st.step}
                      </span>
                      <h3 className="mt-3 text-[19px] font-normal text-[#111111]">
                        {pick(locale, st.title)}
                      </h3>
                      <p className="mt-2.5 text-[14px] leading-relaxed text-[#555555]">
                        {pick(locale, st.detail)}
                      </p>
                    </div>
                    <div className="mt-6 border-t border-black/[0.07] pt-3 text-[12px] text-[#666666]">
                      {t(locale, "主导：", "Lead: ")}
                      <strong className="font-medium text-[#111111]">
                        {pick(locale, owner.role)}
                      </strong>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <SectionHeading
              eyebrow={t(locale, "环境与部署方式", "DEPLOYMENT ENVIRONMENTS")}
              title={t(
                locale,
                "支持隔离云端托管与客户自有环境私有化部署",
                "Choose isolated SaaS hosting or Docker private deployment"
              )}
            />
            <DeploymentOptionsGrid locale={locale} />
          </div>
        </div>
      </section>

      {/* 7 FAQs */}
      <section className="site-section surface-light">
        <div className="site-container grid gap-12 lg:grid-cols-[0.38fr_0.62fr] lg:items-start">
          <div>
            <span className="eyebrow-badge">
              {t(locale, "合作常见问题", "FREQUENT QUESTIONS")}
            </span>
            <h2 className="mt-3 text-[length:var(--fs-h2)] text-[#111111]">
              {t(
                locale,
                "启动沟通前你可能关心的问题",
                "Practical answers before our first call"
              )}
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-[#444444]">
              {t(
                locale,
                "还有其他关于数据边界、预算核算或排期的具体问题？可以直接预约一次 30–45 分钟沟通。",
                "Have a question on data access, custom scoping or compliance? Book a 30–45 minute assessment call."
              )}
            </p>
            <Link
              href={href(locale, "/contact#form")}
              className="btn-primary-dark mt-8"
            >
              <span>{pick(locale, siteCopy.nav.primaryCta)}</span>
              <ArrowUpRight size={16} />
            </Link>
          </div>

          <FAQList items={siteCopy.engagement.faqs} locale={locale} />
        </div>
      </section>

      <JsonLd
        data={[
          breadcrumbJsonLd(locale, [
            { name: t(locale, "首页", "Home"), path: "/" },
            { name: pick(locale, siteCopy.nav.engagement), path: "/engagement" },
          ]),
          faqJsonLd(locale, siteCopy.engagement.faqs),
        ]}
      />
    </PageShell>
  );
}

/* ==========================================================================
   8. ABOUT (/about & /en/about)
   ========================================================================== */
export function AboutView({ locale }: { locale: Locale }) {
  const teamMeta = getMediaMeta("/art/team-natural.webp");
  const waveMeta = getMediaMeta("/art/cyano-wave-spectrum.webp");
  const principleAccents = ["#0B7A8C", "#1D4ED8", "#6D28D9", "#B45309"];

  return (
    <PageShell locale={locale}>
      <PageHeader
        locale={locale}
        variant="about"
        breadcrumbs={[{ label: pick(locale, siteCopy.nav.about) }]}
        eyebrow={pick(locale, siteCopy.about.eyebrow)}
        title={pick(locale, siteCopy.about.title)}
        intro={pick(locale, siteCopy.about.intro)}
      />

      {/* Team Background + Natural-Color Studio Group Illustration + 4 Architectural Credentials */}
      <section className="site-section surface-light border-b border-black/[0.08]">
        <div className="site-container space-y-20">
          <div className="grid items-center gap-12 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <span className="eyebrow-badge">
                {t(locale, "我们是谁", "WHO WE ARE")}
              </span>
              <h2 className="mt-3 text-[length:var(--fs-h2)] text-[#111111]">
                {pick(locale, siteCopy.about.whoWeAreTitle)}
              </h2>
              <p className="mt-5 text-[16px] leading-relaxed text-[#444444]">
                {pick(locale, siteCopy.about.whoWeAreP1)}
              </p>
              <p className="mt-4 text-[16px] leading-relaxed text-[#444444]">
                {pick(locale, siteCopy.about.whoWeAreP2)}
              </p>
            </div>

            <div className="overflow-hidden rounded-2xl bg-[#F8F6F2] ring-1 ring-black/[0.06] lg:col-span-6">
              <Image
                src="/art/team-natural.webp"
                alt={t(
                  locale,
                  "Cyano 四位核心创始人研讨企业工作流架构的插画",
                  "Illustration of Cyano's four founders reviewing an enterprise AI workflow"
                )}
                width={teamMeta.width}
                height={teamMeta.height}
                sizes="(max-width: 1024px) 94vw, 600px"
                placeholder={teamMeta.blurDataURL ? "blur" : "empty"}
                blurDataURL={teamMeta.blurDataURL || undefined}
                className="block h-auto w-full object-cover"
              />
            </div>
          </div>

          {/* jrvs.ca-inspired 4-Cell Hairline Credential Grid */}
          <div className="grid border-t border-l border-black/12 sm:grid-cols-2 lg:grid-cols-4">
            {siteCopy.about.credentials.map((cred, idx) => (
              <div
                key={idx}
                className="border-r border-b border-black/12 p-8"
              >
                <div className="text-[clamp(2.4rem,3.6vw,3.3rem)] font-light leading-none tracking-tight text-[#111111] tabular-nums">
                  {cred.value}
                  {pick(locale, cred.unit) && (
                    <span
                      className="ml-1.5 text-[18px] font-normal"
                      style={{
                        color: principleAccents[idx % principleAccents.length],
                      }}
                    >
                      {pick(locale, cred.unit)}
                    </span>
                  )}
                </div>
                <p className="mt-4 text-[14px] leading-relaxed text-[#555555]">
                  {pick(locale, cred.label)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4 Founders with Full Bio (G-21) */}
      <section className="site-section surface-mist">
        <div className="site-container">
          <SectionHeading
            eyebrow={t(locale, "核心合伙人", "CORE FOUNDERS")}
            title={pick(locale, siteCopy.home.foundersSection.title)}
            description={pick(locale, siteCopy.home.foundersSection.description)}
          />
          <FoundersShowcase locale={locale} fullBio />
        </div>
      </section>

      {/* Design Discipline Cyano Wave Band */}
      <section className="surface-obsidian relative overflow-hidden py-24 md:py-32">
        <Image
          src="/art/cyano-wave-spectrum.webp"
          alt=""
          aria-hidden="true"
          width={waveMeta.width}
          height={waveMeta.height}
          sizes="100vw"
          className="art-on-black pointer-events-none absolute inset-x-0 bottom-0 h-64 w-full object-cover opacity-55"
        />
        <div className="site-container relative z-10 max-w-4xl">
          <span className="eyebrow-badge eyebrow-badge-dark">
            {pick(locale, siteCopy.about.scopeEyebrow)}
          </span>
          <h2 className="mt-4 text-[length:var(--fs-h2)] text-white">
            {pick(locale, siteCopy.about.scopeTitle)}
          </h2>
          <p className="mt-6 text-[18px] leading-relaxed text-white/80">
            {pick(locale, siteCopy.about.scopeBody)}
          </p>
        </div>
      </section>

      {/* 4 Operating Principles — Open Hairline Columns */}
      <section className="site-section surface-light">
        <div className="site-container">
          <SectionHeading
            eyebrow={pick(locale, siteCopy.about.principlesEyebrow)}
            title={pick(locale, siteCopy.about.principlesTitle)}
          />
          <div className="grid gap-10 border-t border-black/12 pt-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0 lg:divide-x lg:divide-black/10">
            {siteCopy.about.principles.map((pr, idx) => (
              <div
                key={pr.code}
                className={`${
                  idx === 0
                    ? "lg:pr-8"
                    : idx === siteCopy.about.principles.length - 1
                      ? "lg:pl-8"
                      : "lg:px-8"
                }`}
              >
                <span
                  className="font-mono-tech text-[13px] font-medium"
                  style={{
                    color: principleAccents[idx % principleAccents.length],
                  }}
                >
                  {pr.code}
                </span>
                <h3 className="mt-3 text-[20px] font-normal text-[#111111]">
                  {pick(locale, pr.title)}
                </h3>
                <p className="mt-3 text-[14px] leading-relaxed text-[#555555]">
                  {pick(locale, pr.body)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <JsonLd
        data={breadcrumbJsonLd(locale, [
          { name: t(locale, "首页", "Home"), path: "/" },
          { name: pick(locale, siteCopy.nav.about), path: "/about" },
        ])}
      />
    </PageShell>
  );
}

/* ==========================================================================
   9. INSIGHTS OVERVIEW & ARTICLE DETAIL (/insights & /insights/[slug])
   ========================================================================== */
export function InsightsOverviewView({ locale }: { locale: Locale }) {
  return (
    <PageShell locale={locale}>
      <PageHeader
        locale={locale}
        variant="insights"
        breadcrumbs={[{ label: pick(locale, siteCopy.nav.insights) }]}
        eyebrow={t(locale, "工程洞察与指南", "ENGINEERING INSIGHTS")}
        title={t(
          locale,
          "企业 AI 系统设计与项目落地经验",
          "Field notes on designing and shipping enterprise AI"
        )}
        intro={t(
          locale,
          "围绕内部知识库权限与维护、15 分钟标书初稿的分阶段核验，以及定制、试点与托管服务的选择方法。",
          "Practical engineering notes on permission-aware RAG maintenance, staged proposal drafting with 7 QA gates, and choosing between custom builds, pilots and managed services."
        )}
      />

      <section className="site-section surface-light">
        <div className="site-container">
          <InsightCardsGrid locale={locale} />
        </div>
      </section>

      <JsonLd
        data={breadcrumbJsonLd(locale, [
          { name: t(locale, "首页", "Home"), path: "/" },
          { name: pick(locale, siteCopy.nav.insights), path: "/insights" },
        ])}
      />
    </PageShell>
  );
}

export function InsightArticleView({
  locale,
  slug,
}: {
  locale: Locale;
  slug: string;
}) {
  const ins = getInsight(slug)!;
  const author = getFounder(ins.authorId);
  const authorMeta = getMediaMeta(author.portrait);
  const blocks = getArticleBlocks(slug, locale);
  const relatedCase = getCase(ins.relatedCaseSlug);

  return (
    <PageShell locale={locale}>
      <PageHeader
        locale={locale}
        variant="insights"
        breadcrumbs={[
          { label: pick(locale, siteCopy.nav.insights), path: "/insights" },
          { label: pick(locale, ins.category) },
        ]}
        eyebrow={`${pick(locale, ins.category)} · ${ins.coverCode}`}
        title={pick(locale, ins.title)}
        intro={pick(locale, ins.metaDescription)}
      >
        <div className="flex flex-wrap items-center gap-4 text-[13px] text-[#666666]">
          <span>{pick(locale, ins.dateDisplay)}</span>
          <span>·</span>
          <span className="inline-flex items-center gap-1.5">
            <Clock size={14} className="text-[#0B7A8C]" />
            {pick(locale, ins.readingTime)}
          </span>
          <span>·</span>
          <span>{pick(locale, author.role)}</span>
        </div>
      </PageHeader>

      <section className="site-section surface-light">
        <div className="site-container grid gap-12 lg:grid-cols-[270px_minmax(0,720px)] lg:justify-between">
          {/* Left-Aligned Unboxed Sticky Sidebar (Fixes V-16) */}
          <aside className="space-y-8 lg:sticky lg:top-28 lg:self-start">
            <div className="border-b border-black/10 pb-6">
              <div className="flex items-center gap-3.5">
                <Image
                  src={author.portrait}
                  alt={pick(locale, author.role)}
                  width={authorMeta.width}
                  height={authorMeta.height}
                  className="h-12 w-12 rounded-full object-cover object-top"
                />
                <div>
                  <div className="text-[14px] font-medium text-[#111111]">
                    {pick(locale, author.role)}
                  </div>
                  <div className="text-[12px] text-[#666666]">
                    {t(locale, "Cyano 创始团队", "Cyano Founding Team")}
                  </div>
                </div>
              </div>
              <div className="mt-5">
                <CopyLinkButton locale={locale} />
              </div>
            </div>

            <nav
              aria-label={t(locale, "文章章节目录", "Table of contents")}
              className="hidden lg:block"
            >
              <div className="font-mono-tech text-[12px] font-medium uppercase tracking-[0.1em] text-[#0B7A8C]">
                {t(locale, "本文目录", "ON THIS PAGE")}
              </div>
              <ol className="mt-3 flex list-none flex-col gap-2.5 p-0 text-[13px]">
                {blocks.map((b, idx) => (
                  <li key={idx}>
                    <a
                      href={`#section-${idx + 1}`}
                      className="inline-flex min-h-[28px] items-start text-[#444444] transition-colors hover:text-[#111111]"
                    >
                      <span className="font-mono-tech mr-2.5 mt-0.5 text-[12px] text-[#888888]">
                        0{idx + 1}
                      </span>
                      <span>{b.q}</span>
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </aside>

          {/* Main Editorial Article Body with Bespoke Cover Plate, Diagrams & Pull-Quote (G-20) */}
          <article className="min-w-0">
            <div className="mb-12">
              <InsightCoverGraphic item={ins} locale={locale} />
            </div>

            {blocks.map((block, idx) => {
              const diagAfter = ins.diagrams.find(
                (d) => d.insertAfterIndex === idx
              );
              const quoteAfter =
                ins.pullQuote.insertAfterIndex === idx ? ins.pullQuote : null;

              return (
                <React.Fragment key={idx}>
                  <section
                    id={`section-${idx + 1}`}
                    className="mb-12 scroll-mt-28"
                  >
                    <h2 className="text-[24px] font-normal text-[#111111] md:text-[28px]">
                      {block.q}
                    </h2>
                    <div className="mt-4 space-y-4 text-[17px] leading-[1.82] text-[#333333]">
                      {block.a.split("\n\n").map((para, pIdx) => (
                        <p key={pIdx}>{para}</p>
                      ))}
                    </div>
                  </section>

                  {diagAfter && (
                    <ArticleInlineDiagram diagram={diagAfter} locale={locale} />
                  )}
                  {quoteAfter && (
                    <ArticlePullQuote pullQuote={quoteAfter} locale={locale} />
                  )}
                </React.Fragment>
              );
            })}

            {relatedCase && (
              <div className="mt-16 border-t border-black/15 pt-10">
                <span className="eyebrow-badge">
                  {t(locale, "关联生产案例", "RELATED PRODUCTION SYSTEM")}
                </span>
                <h3 className="mt-2 text-[24px] font-normal text-[#111111]">
                  {pick(locale, relatedCase.title)}
                </h3>
                <p className="mt-2.5 text-[15px] text-[#444444]">
                  {pick(locale, relatedCase.profile)}
                </p>
                <div className="mt-6 flex flex-wrap items-center gap-6">
                  <Link
                    href={href(locale, `/cases/${relatedCase.slug}`)}
                    className="btn-primary-dark"
                  >
                    <span>{t(locale, "查看该客户案例", "Inspect case study")}</span>
                    <ArrowRight size={15} />
                  </Link>
                  <Link
                    href={href(locale, "/contact#form")}
                    className="link-inline-tech"
                  >
                    <span>{pick(locale, siteCopy.nav.primaryCta)}</span>
                    <ArrowRight size={15} />
                  </Link>
                </div>
              </div>
            )}
          </article>
        </div>
      </section>

      <JsonLd
        data={[
          breadcrumbJsonLd(locale, [
            { name: t(locale, "首页", "Home"), path: "/" },
            { name: pick(locale, siteCopy.nav.insights), path: "/insights" },
            { name: pick(locale, ins.title), path: `/insights/${ins.slug}` },
          ]),
          articleJsonLd(locale, ins),
        ]}
      />
    </PageShell>
  );
}

/* ==========================================================================
   10. CONTACT (/contact & /en/contact) — hideClosingCta=true (V-17) & Form First on Mobile (M-04)
   ========================================================================== */
export function ContactView({ locale }: { locale: Locale }) {
  const avatarMeta = getMediaMeta("/art/founder-4-avatar-natural.webp");

  return (
    <PageShell locale={locale} hideClosingCta>
      <PageHeader
        locale={locale}
        variant="contact"
        breadcrumbs={[{ label: pick(locale, siteCopy.nav.contact) }]}
        eyebrow={pick(locale, siteCopy.contact.eyebrow)}
        title={pick(locale, siteCopy.contact.title)}
        intro={pick(locale, siteCopy.contact.intro)}
      />

      <section className="site-section surface-mist">
        <div className="site-container grid gap-12 lg:grid-cols-[0.88fr_1.12fr] lg:items-start">
          {/* Form appears FIRST on mobile (< 1024px) per M-04, right column on desktop */}
          <div id="form" className="order-1 scroll-mt-24 lg:order-2">
            <ContactForm locale={locale} />
          </div>

          {/* Left Aside on Desktop / Below Form on Mobile */}
          <aside className="order-2 space-y-10 lg:order-1">
            <div>
              <span className="eyebrow-badge">
                {pick(locale, siteCopy.contact.topicsEyebrow)}
              </span>
              <h2 className="mt-2 text-[28px] font-normal text-[#111111]">
                {pick(locale, siteCopy.contact.topicsTitle)}
              </h2>

              <div className="mt-6 divide-y divide-black/10 border-t border-b border-black/10">
                {siteCopy.contact.topics.map((tp) => (
                  <div key={tp.code} className="py-5">
                    <span className="font-mono-tech text-[12px] font-medium text-[#0B7A8C]">
                      {tp.code}
                    </span>
                    <h3 className="mt-1 text-[18px] font-medium text-[#111111]">
                      {pick(locale, tp.title)}
                    </h3>
                    <p className="mt-1.5 text-[14px] leading-relaxed text-[#555555]">
                      {pick(locale, tp.body)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Crisp Natural-Color 160x160 Founder-4 Avatar */}
            <div className="flex items-center gap-4">
              <Image
                src="/art/founder-4-avatar-natural.webp"
                alt={t(
                  locale,
                  "产品与解决方案负责人插画头像",
                  "Head of Product & Solutions avatar"
                )}
                width={avatarMeta.width}
                height={avatarMeta.height}
                className="h-16 w-16 shrink-0 rounded-full object-cover"
              />
              <div>
                <h3 className="text-[16px] font-medium text-[#111111]">
                  {pick(locale, siteCopy.contact.responderTitle)}
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-[#555555]">
                  {pick(locale, siteCopy.contact.responderBody)}
                </p>
              </div>
            </div>

            {/* What happens next — Calm Nocturnal Block */}
            <div className="rounded-2xl bg-[#02080E] p-7 text-white ring-1 ring-white/[0.08]">
              <h3 className="font-mono-tech text-[13px] uppercase tracking-[0.1em] text-[#22D3EE]">
                {pick(locale, siteCopy.contact.nextStepsTitle)}
              </h3>
              <ol className="mt-5 flex list-none flex-col gap-4 p-0 text-[14px] text-white/80">
                {siteCopy.contact.nextSteps.map((st, idx) => (
                  <li key={idx} className="flex items-start gap-3.5">
                    <span className="font-mono-tech mt-0.5 text-[12px] font-medium text-[#FBBF24]">
                      0{idx + 1}
                    </span>
                    <span>{pick(locale, st)}</span>
                  </li>
                ))}
              </ol>
            </div>
          </aside>
        </div>
      </section>

      <JsonLd
        data={breadcrumbJsonLd(locale, [
          { name: t(locale, "首页", "Home"), path: "/" },
          { name: pick(locale, siteCopy.nav.contact), path: "/contact" },
        ])}
      />
    </PageShell>
  );
}

/* ==========================================================================
   11. PRIVACY & TERMS (/privacy, /terms & /en/privacy, /en/terms)
   ========================================================================== */
export function LegalView({
  locale,
  type,
}: {
  locale: Locale;
  type: "privacy" | "terms";
}) {
  const isPrivacy = type === "privacy";
  const title = pick(
    locale,
    isPrivacy ? siteCopy.seo.privacy.title : siteCopy.seo.terms.title
  );
  const sections = isPrivacy
    ? legalCopy.privacy[locale]
    : legalCopy.terms[locale];

  return (
    <PageShell locale={locale}>
      <PageHeader
        locale={locale}
        variant="legal"
        breadcrumbs={[{ label: title }]}
        eyebrow="CYANO INTELLIGENCE"
        title={title}
        intro={pick(locale, legalCopy.updatedDisplay)}
      />

      <section className="site-section surface-light">
        <article className="site-container max-w-3xl space-y-10">
          {sections.map(([heading, body]) => (
            <section key={heading} className="space-y-3">
              <h2 className="text-[22px] font-normal text-[#111111]">
                {heading}
              </h2>
              <p className="text-[16px] leading-relaxed text-[#444444]">
                {body}
              </p>
            </section>
          ))}

          <div className="border-t border-black/10 pt-6">
            <Link
              href={href(locale, "/contact#form")}
              className="link-inline-tech"
            >
              <span>{pick(locale, siteCopy.nav.contact)}</span>
              <ArrowUpRight size={15} />
            </Link>
          </div>
        </article>
      </section>
    </PageShell>
  );
}

/* ==========================================================================
   12. 404 NOT FOUND
   ========================================================================== */
export function NotFoundView({ locale }: { locale: Locale }) {
  return (
    <PageShell locale={locale} hideClosingCta>
      <PageHeader
        locale={locale}
        variant="legal"
        breadcrumbs={[{ label: "404" }]}
        eyebrow="STATUS 404"
        title={pick(locale, siteCopy.notFound.title)}
        intro={pick(locale, siteCopy.notFound.body)}
      >
        <Link href={href(locale)} className="btn-primary-dark">
          <span>{pick(locale, siteCopy.notFound.homeCta)}</span>
        </Link>
        <Link href={href(locale, "/cases")} className="btn-secondary-light">
          <span>{pick(locale, siteCopy.notFound.casesCta)}</span>
        </Link>
      </PageHeader>
    </PageShell>
  );
}
