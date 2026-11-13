const fs=require('node:fs');
const path=require('node:path');
const ts=require('typescript');
const root=path.resolve(__dirname,'..');
const replacements=new Map([
['已落地行业','已服务行业'],
['业务诊断','需求评估'],['Diagnose','Assess requirements'],['Size the value','Estimate costs and benefits'],['Run & improve','Maintain and update'],
['业务诊断 · 产品设计 · 解决方案','需求评估 · 产品设计 · 解决方案'],['Diagnosis · Product design · Solutions','Requirements · Product design · Solutions'],
['梳理目标、流程与数据，一周内给出诊断结论。','梳理目标、流程与数据，一周内给出评估结论。'],
['测算人工、外包与返工成本，明确投入回报与优先级。','估算人工、外包与返工成本，比较预期收益，确定开发顺序。'],
['确认范围边界、合作方式、验收标准与报价。','确认项目范围、合作方式、验收标准与报价。'],
['追踪使用反馈，优化系统，持续迭代新需求。','处理使用反馈与故障，按约定更新资料和功能。'],
['Map goals, workflows and data. Receive a diagnosis within one week.','Review goals, workflows and data, with an assessment within one week.'],
['Size current costs, expected return and priorities.','Estimate current costs and expected benefits to prioritize development.'],
['Monitor real use, improve reliability and iterate on new needs.','Address user feedback and faults, and update sources and features as agreed.'],
['可以。诊断阶段会确认数据来源、接口和权限，优先复用现有数据库、文档与业务系统。','可以。评估阶段会确认数据来源、接口和权限，优先使用现有数据库、文档与业务系统。'],
['Yes. Diagnosis covers data sources, interfaces and permissions, prioritizing the systems and documents you already use.','Yes. The assessment covers data sources, interfaces and permissions, starting with the systems and documents you already use.'],
['过去：2 天撰写 + 反复核对资料 → 现在：15 分钟生成初稿，AI 自动完成完整性检查，人工只需复核','过去：2 天撰写并反复核对资料 → 现在：15 分钟生成初稿并执行完整性检查，再由人工修改、复核'],
['先理解流程，再设计系统','梳理流程与系统需求'],
['AI 工作流与人工审核的持续结果','按批次交付经过人工审核的结果'],
['由 Cyano 全面负责','Cyano 负责运行与交付'],
['Ongoing AI outputs with human review','Batch outputs reviewed by people'],
['前期诊断会带来什么？ / What does the diagnosis give us?','需求评估会提供什么？ / What does the assessment provide?'],
['目标明确、使用频率高，可以直接规划完整系统；场景还在探索，就先用低启动试点快速验证价值，用真实反馈决定下一步。','需求明确且使用频繁时，可以规划完整系统。对效果或使用量还没有把握时，先用小范围试点测试，再决定是否扩展。'],
['If the goal is clear and usage is high, plan the full system. If you\'re still exploring, start with a pilot and let real results decide the next step.','A full build suits clear requirements and frequent use. If results or likely usage remain uncertain, test a smaller scope in a pilot before expanding.'],
['当你更关心稳定产出，而不想自己组建团队维护系统时。Cyano 用 AI 工作流加人工审核，直接交付结果。','适合希望按批次委托工作、暂不准备自行维护系统的团队。客户提供资料与标准，Cyano 运行 AI 工作流并审核结果。'],
['When you care about reliable output more than running the system yourself. We combine AI workflows with human review and deliver the results.','It suits teams that want to outsource recurring work without operating a system. You supply sources and criteria; Cyano runs the AI workflow and reviews the output.'],
['一周内给出诊断结论和建议的合作方式。','一周内给出需求评估结论和合作建议。'],
['Within a week, you get a diagnosis and a recommended engagement model.','Within a week, we provide an assessment and a recommended way to proceed.'],
['我想定制 AI 工具 · 我想低成本启动试点 · 我想把任务交给 Cyano 托管 · 我想预约保密案例演示 · 我还不确定，想先评估','定制 AI 系统 · 小范围试点 · 托管服务 · 预约案例演示 · 先评估需求'],
['Build a custom AI tool · Start a low-cost pilot · Hand work to a managed service · Book a confidential case demo · Not sure yet — help me evaluate','Custom AI system · Pilot project · Managed service · Case demo · Requirements assessment'],
['六个案例的流程、界面与成果整理为中英文资料，可通过邮箱索取。','可通过邮箱了解六个案例的流程、界面与成果，支持中英文沟通。'],
['Request workflows, screenshots and results for all six projects by email, in English or Chinese.','Contact us by email for project workflows, screenshots and results, in English or Chinese.'],
]);
const changes=[];
function processJSON(value,file){if(typeof value==='string'){if(replacements.has(value)){changes.push({file,before:value,after:replacements.get(value)});return replacements.get(value)}return value}if(Array.isArray(value))return value.map(x=>processJSON(x,file));if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).map(([k,v])=>[replacements.get(k)||k,processJSON(v,file)]));return value}
for(const name of ['copy','founders','cases']){const p=path.join(root,'content',name+'.json');let data=processJSON(JSON.parse(fs.readFileSync(p,'utf8')),'content/'+name+'.json');if(name==='copy'){for(const k of ['信任条数字 4'])data['D.2'][k].zh=data['D.2'][k].zh.replace('已落地行业','已服务行业');data['D.7']['团队数字'].zh=data['D.7']['团队数字'].zh.replace('已落地行业','已服务行业')}fs.writeFileSync(p,JSON.stringify(data,null,2)+'\n')}
for(const file of ['components/pages.tsx','components/ui.tsx','lib/content.ts']){const p=path.join(root,file);let raw=fs.readFileSync(p,'utf8');const src=ts.createSourceFile(file,raw,99,true,4);const edits=[];function walk(n){if(ts.isStringLiteral(n)&&replacements.has(n.text)){edits.push({start:n.getStart(src),end:n.end,text:JSON.stringify(replacements.get(n.text))});changes.push({file,before:n.text,after:replacements.get(n.text)})}ts.forEachChild(n,walk)}walk(src);for(const e of edits.sort((a,b)=>b.start-a.start))raw=raw.slice(0,e.start)+e.text+raw.slice(e.end);fs.writeFileSync(p,raw)}
fs.writeFileSync(path.join(root,'../docs/copy-review/final-changes.json'),JSON.stringify(changes,null,2)+'\n');
console.log('Final consistency revisions:',changes.length);
