import {useId} from "react";
import illustration from "@/content/latency-illustration.json";
import {type Locale,t} from "@/lib/locale";
const points=illustration.points;
const x=(n:number)=>(n-1)/99*600;
const y=(n:number)=>230-n/3000*230;
const line=(key:"raw"|"core")=>points.map((p,i)=>`${i?"L":"M"}${x(p.turn)} ${y(p[key])}`).join(" ");
function value(turn:number,key:"raw"|"core"){const hi=points.findIndex(p=>p.turn>=turn);const a=points[Math.max(0,hi-1)],b=points[hi];return a[key]+(b[key]-a[key])*(turn-a.turn)/(b.turn-a.turn||1);}
export function ChartFigure({locale,turn=50,onChange}:{locale:Locale;turn?:number;onChange?:(turn:number)=>void}){
 const id=useId();const core=value(turn,"core"),raw=value(turn,"raw");
 return <div className="latency-card"><div className="chart-heading"><h3>{t(locale,"对话轮次与响应延迟","Conversation turns and response latency")}</h3><span>{t(locale,"示意数据 · ms","Illustrative data · ms")}</span></div><div className="chart-legend"><span>Cyano Core</span><span>{t(locale,"完整历史","Full history")}</span></div><div className="chart-plot"><div className="chart-y"><span>3,000</span><span>1,500</span><span>0</span></div><svg viewBox="0 0 600 230" preserveAspectRatio="none" role="img" aria-label={t(locale,"示意延迟趋势","Illustrative latency trend")}><path className="chart-grid" d="M0 1H600M0 115H600M0 229H600"/><path className="chart-raw" d={line("raw")}/><path className="chart-core" d={line("core")}/><path className="chart-grid" d={`M${x(turn)} 0V230`}/><circle className="point-raw" cx={x(turn)} cy={y(raw)} r="4"/><circle className="point-core" cx={x(turn)} cy={y(core)} r="4"/></svg></div><div className="chart-axis"><span>1</span><span>50</span><span>100</span></div><label className="chart-control" htmlFor={id}><span>{t(locale,`第 ${turn} 轮`,`Turn ${turn}`)}</span><input id={id} type="range" min={1} max={100} value={turn} disabled={!onChange} onChange={onChange?e=>onChange(Number(e.target.value)):undefined}/></label><div className="chart-values" aria-live="polite"><span>Cyano Core <strong>{Math.round(core)} ms</strong></span><span>{t(locale,"完整历史","Full history")} <strong>{Math.round(raw).toLocaleString(locale)} ms</strong></span></div><p className="benchmark-note">{t(locale,"曲线使用示意数据，不是内部基准测试结果，也不代表项目性能承诺。","The curves use illustrative data, not internal benchmark results or a project performance commitment.")}</p></div>;
}
