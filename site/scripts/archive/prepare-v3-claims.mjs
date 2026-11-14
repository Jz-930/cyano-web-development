import fs from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'../..');
let out='# v3 待确认说法清单\n\n本清单转录已有两份内容核对记录，不新增评审结论。未勾选不等于批准；默认恢复 v1。对照提交：`b9dcf94`。同一说法在中英文报告中重复时保留两处出处。\n\n确认后须补充依据、适用范围、确认人和日期，才可登记 `sources.md` 并发布。截图数字只可解释“界面示例”；曲线数字只可标“示意”。\n\n';
for(const [lang,file]of [['ZH','content-audit-zh.md'],['EN','content-audit-en.md']]){
 const report=await fs.readFile(path.join(root,'docs/reviews/G5-round2-reports',file),'utf8');
 const section=report.split('## 3.')[1].split('## 4.')[0];
 const rows=section.split(/\r?\n/).filter(l=>l.startsWith('|')&&!l.startsWith('|---')).slice(1);
 out+=`## ${lang} 原报告所列说法\n\n| 批准 | 编号 | 说法（原报告） | 页面 | 现有依据 | 默认处理建议 | 确认人 |\n|---|---|---|---|---|---|---|\n`;
 rows.forEach((row,i)=>{const cells=row.split('|').slice(1,-1).map(x=>x.trim());let id,claim,page,evidence;if(lang==='ZH')[id,claim,page,evidence]=cells;else{[claim,page,evidence]=cells;id=`E${i+1}`;}
 const owner=/法律|法务|privacy|terms|绝不|never|NDA|SLA|承诺/.test(claim+' '+page)?'你 + 法务':/技术|模型|SQL|检索|延迟|latency|ACL|Token|audit|benchmark|retrieval/i.test(claim+' '+page)?'你 + 技术负责人':'你 / 项目负责人';
 const recommendation=/截图|公式|示意|样例|演示/.test(evidence+claim)?'撤下客户事实表述；可核实后仅作界面示例/示意':'恢复 v1；新增部分暂不发布';
 out+=`| ☐ | ${lang}-${id} | ${claim} | ${page} | ${evidence} | ${recommendation} | ${owner} |\n`;
 });
 out+=`\n出处：[${file}](../docs/reviews/G5-round2-reports/${file}) 第 3 节。\n\n`;
}
out+='## 需单独处理的原稿项\n\n- ☐ 知识库“3 秒找到有出处的答案”：源自 v1 `copy.json` D.1，但 v1 未渲染。默认不用于通用方案承诺；请确认是否启用及适用条件。\n- ☐ < 200ms：默认恢复“响应延迟”，不可未经确认改为“检索与拼装延迟”。\n- ☐ 未提供的新英文改写审批：默认沿用 v1 英文，不自行认定已批准。\n\n## 确认记录模板\n\n`编号 / 采用原文 / 依据文件 / 适用项目与限制 / 确认人 / 日期`\n';
await fs.writeFile(path.join(root,'content/claims-pending.md'),out);
console.log('Prepared existing report claims for confirmation.');
