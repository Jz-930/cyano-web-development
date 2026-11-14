import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
for(const route of ['/','/en','/services/document-automation','/en/services/document-automation','/cases/property-management','/technology','/engagement','/contact','/terms']){
 test(`page smoke ${route}`,async({page})=>{
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
  const response=await page.goto(route);expect(response?.status()).toBe(200);
  await expect(page.locator('h1')).toHaveCount(1);await expect(page.locator('main')).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
  const results=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
  expect(results.violations.filter(v=>['critical','serious'].includes(v.impact||''))).toEqual([]);
  expect(errors).toEqual([]);
 });
}
test('legal wording and restored compatibility list',async({page})=>{
 await page.goto('/terms');await expect(page.getByText('本网站用于介绍 Cyano 的能力、服务与项目。内容仅供参考，不构成合同承诺；具体服务范围、交付标准与价格以双方协议为准。')).toBeVisible();
 await page.goto('/technology');for(const label of ['Google Gemini','DeepSeek','MySQL','SharePoint','Confluence','ERP / CRM'])await expect(page.getByText(label,{exact:true})).toBeVisible();
});
test('content remains available without JavaScript',async({browser})=>{
 const context=await browser.newContext({javaScriptEnabled:false});const page=await context.newPage();
 await page.goto('http://127.0.0.1:3010/');await expect(page.getByRole('heading',{level:1})).toBeVisible();await expect(page.getByText('我们先了解一项工作现在如何完成、资料存在哪里、结果由谁审核，再设计系统。上线后继续维护知识库、处理使用反馈，并按业务变化调整流程。')).toBeVisible();await context.close();
});
