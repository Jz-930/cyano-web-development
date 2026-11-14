import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

// Full 10 §5 page table (both zh & en counterparts) + legal pages
const SMOKE_ROUTES = [
  "/",
  "/en",
  "/services",
  "/en/services",
  "/services/document-automation",
  "/en/services/document-automation",
  "/cases",
  "/en/cases",
  "/cases/proposal-generation",
  "/en/cases/proposal-generation",
  "/cases/it-knowledge-assistant",
  "/en/cases/it-knowledge-assistant",
  "/technology",
  "/en/technology",
  "/engagement",
  "/en/engagement",
  "/about",
  "/en/about",
  "/insights",
  "/en/insights",
  "/insights/proposal-draft-in-15-minutes",
  "/en/insights/proposal-draft-in-15-minutes",
  "/contact",
  "/en/contact",
  "/privacy",
  "/en/privacy",
  "/terms",
  "/en/terms",
];

for (const route of SMOKE_ROUTES) {
  test(`page smoke + axe ${route}`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.emulateMedia({ reducedMotion: "reduce" });
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("main")).toBeVisible();
    // Force content-visibility: auto sections to render before axe scan
    await page.addStyleTag({
      content: "main > section, .closing, .footer { content-visibility: visible !important; }",
    });
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBeTruthy();
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(
      results.violations.filter((v) => ["critical", "serious"].includes(v.impact || "")),
    ).toEqual([]);
    expect(errors).toEqual([]);
  });
}

test("axe interactive state: mobile menu open", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const toggle = page.locator(".menu-toggle");
  await expect(toggle).toBeVisible();
  await toggle.click();
  await expect(page.locator('.mobile-nav[data-open="true"]')).toBeVisible();
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(
    results.violations.filter((v) => ["critical", "serious"].includes(v.impact || "")),
  ).toEqual([]);
});

test("axe interactive state: lightbox open and Escape focus return", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/cases/proposal-generation");
  const trigger = page.locator(".gallery-main.zoomable").first();
  await trigger.scrollIntoViewIfNeeded();
  await trigger.click();
  const dialog = page.locator("dialog.screen-dialog[open]");
  await expect(dialog).toBeVisible();
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(
    results.violations.filter((v) => ["critical", "serious"].includes(v.impact || "")),
  ).toEqual([]);
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(trigger).toBeFocused();
});

test("axe interactive state: FAQ expanded", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/engagement");
  const closedIdx = await page
    .locator("details.faq-item")
    .evaluateAll((els) => els.findIndex((el) => !el.hasAttribute("open")));
  expect(closedIdx).toBeGreaterThanOrEqual(0);
  const faqItem = page.locator("details.faq-item").nth(closedIdx);
  await expect(faqItem).not.toHaveAttribute("open", "");
  await faqItem.locator("summary").scrollIntoViewIfNeeded();
  await faqItem.locator("summary").click();
  await expect(faqItem).toHaveAttribute("open", "");
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(
    results.violations.filter((v) => ["critical", "serious"].includes(v.impact || "")),
  ).toEqual([]);
});

test("axe interactive state: S10 CitationPeek open", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const citeBtn = page.locator(".cite-trigger").first();
  await citeBtn.scrollIntoViewIfNeeded();
  await citeBtn.click();
  await expect(page.locator('.cite-card[data-open="true"]')).toBeVisible();
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(
    results.violations.filter((v) => ["critical", "serious"].includes(v.impact || "")),
  ).toEqual([]);
});

test("screen-reader semantics: mockup figcaption, S1 pause toggle, and form errors", async ({
  page,
}) => {
  await page.goto("/");
  const captions = page.locator("figure.mk-window > figcaption");
  expect(await captions.count()).toBeGreaterThan(0);
  expect((await captions.first().textContent())?.trim().length).toBeGreaterThan(0);

  const stageToggle = page.locator("button.stage-toggle");
  await expect(stageToggle).toHaveAttribute("aria-pressed", "false");
  await stageToggle.click();
  await expect(stageToggle).toHaveAttribute("aria-pressed", "true");

  await page.goto("/contact");
  await page.locator('form.contact-form button[type="submit"]').click();
  const firstInput = page.locator('form.contact-form input[name="name"]');
  await expect(firstInput).toHaveAttribute("aria-invalid", "true");
  await expect(firstInput).toBeFocused();
  await expect(page.locator("#err-name.field-error")).toBeVisible();

  const studyRes = await page.request.get("/v4-study");
  expect(studyRes.status()).toBe(404);
  const sitemapXml = await (await page.request.get("/sitemap.xml")).text();
  expect(sitemapXml).not.toContain("v4-study");
});

test("legal wording and restored compatibility list", async ({ page }) => {
  await page.goto("/terms");
  await expect(
    page.getByText(
      "本网站用于介绍 Cyano 的能力、服务与项目。内容仅供参考，不构成合同承诺；具体服务范围、交付标准与价格以双方协议为准。",
    ),
  ).toBeVisible();
  await page.goto("/technology");
  for (const label of [
    "Google Gemini",
    "DeepSeek",
    "MySQL",
    "SharePoint",
    "Confluence",
    "ERP / CRM",
  ]) {
    await expect(page.getByText(label, { exact: true })).toBeVisible();
  }
});

test("content and FAQ remain available without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:3010/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(
    page.getByText(
      "我们先了解一项工作现在如何完成、资料存在哪里、结果由谁审核，再设计系统。上线后继续维护知识库、处理使用反馈，并按业务变化调整流程。",
    ),
  ).toBeVisible();
  await page.goto("http://127.0.0.1:3010/engagement");
  const items = page.locator("details.faq-item");
  const count = await items.count();
  let closedIdx = -1;
  for (let i = 0; i < count; i++) {
    if ((await items.nth(i).getAttribute("open")) === null) {
      closedIdx = i;
      break;
    }
  }
  expect(closedIdx).toBeGreaterThanOrEqual(0);
  const faqItem = items.nth(closedIdx);
  await expect(faqItem).not.toHaveAttribute("open", "");
  await faqItem.locator("summary").click();
  await expect(faqItem).toHaveAttribute("open", "");
  await context.close();
});
