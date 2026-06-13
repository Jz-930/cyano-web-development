/* eslint-disable @typescript-eslint/no-explicit-any */

export type Locale = "cn" | "en";

export type Tone = "mint" | "amber" | "coral" | "blue";

export type PageHeroKey = "services" | "cases" | "technology" | "contact";

export type PageMeta = {
  title: string;
  description: string;
};

export type PageHeroContent = {
  eyebrow: string;
  title: string;
  accent: string;
  description: string;
  primaryLabel: string;
  secondaryLabel: string;
};

export type MediaItemContent = {
  src: string;
  alt: string;
  label: string;
};

export type CaseStatContent = [value: string, label: string, highlight: boolean];

export type CaseStudyContent = {
  tag: string;
  title: string;
  pain: string;
  solution: string;
  image: string;
  caption?: string;
  gallery?: MediaItemContent[];
  tone: Tone;
  reverse?: boolean;
  demoHref?: string;
  stats: CaseStatContent[];
};

export type SiteContent = {
  meta: Record<string, PageMeta>;
  common: {
    mediaDefaultCaption: string;
    painLabel: string;
    solutionLabel: string;
    demoLabel: string;
  };
  nav: {
    items: Array<{ label: string; href: string }>;
    contactLabel: string;
    openMenuLabel: string;
    closeMenuLabel: string;
    switchToEnglishLabel: string;
    switchToChineseLabel: string;
  };
  home: Record<string, any>;
  pageHeroes: Record<PageHeroKey, PageHeroContent>;
  services: Record<string, any>;
  cases: {
    section: {
      kicker: string;
      title: string;
      description: string;
    };
    gallery: {
      openGalleryLabel: (title: string) => string;
      imageAltWithCaption: (title: string) => string;
      imageAltWithoutCaption: (title: string) => string;
      mediaLabel: (tag: string) => string;
      viewMore: string;
      closeLabel: string;
      openOriginalLabel: string;
      originalText: string;
      previousLabel: string;
      nextLabel: string;
      thumbsLabel: string;
      viewThumbLabel: (label: string) => string;
    };
    studies: CaseStudyContent[];
  };
  contact: Record<string, any>;
  technology: Record<string, any>;
  projectShowcase: Record<string, any>;
  galleryViewer: {
    controlsLabel: string;
    back: string;
    original: string;
    navigationLabel: string;
    previous: string;
    next: string;
    imageAlt: (index: number) => string;
  };
};
