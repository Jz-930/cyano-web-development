import fs from 'node:fs/promises';
const replace=async(file,fn)=>{const old=await fs.readFile(file,'utf8');await fs.writeFile(file,fn(old))};
await replace('components/pages.tsx',s=>s.replace("import Link from 'next/link';","import Link from 'next/link';\nimport {BusinessHeroVisual,CoreVisual} from './business-visuals';")
.replace('<img className="page-hero-art" src={art} alt="" width="1672" height="941" fetchPriority="high"/>','<CoreVisual locale={locale}/>')
.replace(/<picture><source media="\(max-width: 640px\)" srcSet="\/art\/hero-mobile.webp"\/><img className="hero-art"[^>]+\/><\/picture><div className="hero-shade"\/><AmbientFlow\/>/,'<div className="hero-business-backdrop"/><BusinessHeroVisual locale={locale}/>')
.replace("<>Your knowledge.<br/>Real-world<br/><span>AI productivity.</span></>","<>Turn your company’s<br/>knowledge into<br/><span>AI that ships.</span></>")
.replace('连接知识孤岛，让价值持续发生','从真实业务出发，交付可用的 AI')
.replace('CONNECTED KNOWLEDGE. LASTING VALUE.','YOUR KNOWLEDGE. YOUR WORKFLOW. REAL RESULTS.')
.replace(/<div className="service-art"><img src=\{i%2\?'\/art\/technology.webp':'\/art\/hero.webp'\} alt="" width="960" height="540" loading="lazy"\/><Icon size=\{62\} strokeWidth=\{.8\}\/><\/div>/,'<div className="service-art"><img src={cases(locale)[i].images[cases(locale)[i].main]} alt={cases(locale)[i].system} width="1600" height="1000" loading="lazy"/></div>')
.replace("'澜，是流动。\\n屿，是连接的起点。','Waves move.\\nIslands connect.'","'从企业经验，\\n到每天都能用的能力。','Your expertise.\\nWorking every day.'")
.replace("{text('D.7','名字的由来正文',locale)}","{t(locale,'Cyano（澜屿智创）专注一件事：把企业已有的资料、经验和流程，转化为能被团队每天使用的 AI 系统。我们从具体问题出发，把数据、模型与业务规则连接起来，并对上线后的维护与迭代负责。','Cyano turns the knowledge and workflows already inside your company into AI systems your team can use every day. We start with a concrete business problem, connect data, models and rules, and take responsibility for maintenance and improvement after launch.')}")
);
await replace('components/interactive.tsx',s=>s.replace("<img src={selected%2?'/art/technology.webp':'/art/hero.webp'} alt=\"\" width=\"960\" height=\"540\" loading=\"lazy\"/><span className=\"solution-symbol\"><Icon size={36} strokeWidth={1}/></span>","<img src={cases(locale)[selected].images[cases(locale)[selected].main]} alt={cases(locale)[selected].system} width=\"1600\" height=\"1000\" loading=\"lazy\"/>"));
await replace('lib/content.ts',s=>s.replace("image:['/art/hero.webp','/art/technology.webp','/art/hero.webp'][i]","image:[rawCases[2].images[0],rawCases[1].images[0],rawCases[0].images[2]][i]"));
await replace('components/ui.tsx',s=>s.replace('src="/art/team.webp" alt={t(locale,`Cyano','src="/art/portraits.webp" alt={t(locale,`Cyano'));
await replace('app/[[...path]]/not-found.tsx',s=>s.replace('<img className="page-hero-art" src="/art/hero.webp" alt=""/>','').replace("This island isn't on the map yet.","This page could not be found.").replace('这座岛还不在地图上。','没有找到这个页面。'));
console.log('Business-first visual revision applied.');
