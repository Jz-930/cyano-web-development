import {EngineeringDiagram} from "./EngineeringDiagram";
import {type Locale,t,cases,founders} from "@/lib/content-v4";
import {LightField} from "./LightField";
import {ScreenshotZoom} from "./ScreenshotZoom";

export function BusinessHeroVisual({locale}:{locale:Locale}){
  const item=cases(locale)[locale==="zh"?1:2];
  const sources=locale==="zh"?["核心诉求","盈利能力评估","压力测试"]:["Setup VPN on Windows","VPN Troubleshooting","Human review"];
  return <><LightField/><div className="hero-stage-wrap"><div className="product-stage glass">
    <div className="stage-top"><strong>{item.system}</strong><span>{t(locale,"界面示例","Interface example")}</span></div>
    <div className="stage-body"><ScreenshotZoom image={item.images[item.main]} crop={`/v3-materials/${locale==="zh"?"proposal":"wiki"}-focus.webp`} label={item.system} locale={locale}/><div className="source-rail">{sources.map((s,i)=><div className={`source-item ${i===0?"active":""}`} key={s}><small>{String(i+1).padStart(2,"0")}</small>{s}</div>)}</div></div>
    <div className="stage-flow"><div><span>{item.stats[0].label}</span><div className="stage-value">{item.stats[0].value}</div></div><div><span>{item.stats[1].label}</span><div className="stage-value">{item.stats[1].value}</div></div></div>
    <p className="stage-note">{t(locale,"客户信息与数据已按保密要求脱敏。","Client information and data have been anonymised for confidentiality.")}</p>
  </div></div></>;
}
export function CoreVisual({locale}:{locale:Locale}){return <><LightField strength="panel"/><div className="hero-diagram" aria-hidden="true"><EngineeringDiagram variant={1}/></div></>;}
export function TeamDiagram({locale}:{locale:Locale}){return <div className="team-constellation">{founders(locale).map((f,i)=><div key={f.id}><span className="team-role-number" aria-hidden="true">0{i+1}</span><span>{f.role}</span></div>)}</div>;}
