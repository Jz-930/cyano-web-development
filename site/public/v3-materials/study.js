const data=JSON.parse(document.querySelector('#study-data').textContent);
const zh=data.locale==='zh',motion=matchMedia('(prefers-reduced-motion: reduce)');
let paused=motion.matches,stageVisible=false,stageTimer=0,stageStep=0;
const stage=document.querySelector('.product-stage'),pause=document.querySelector('.pause');
function stageState(){clearInterval(stageTimer);stageTimer=0;stage.classList.toggle('playing',!paused&&stageVisible&&!document.hidden);if(paused||motion.matches||!stageVisible||document.hidden)return;stageTimer=setInterval(()=>{stageStep=(stageStep+1)%3;document.querySelectorAll('.source-item').forEach((el,i)=>el.classList.toggle('active',i===stageStep));},2300);}
pause.addEventListener('click',()=>{paused=!paused;pause.setAttribute('aria-pressed',String(paused));pause.setAttribute('aria-label',zh?(paused?'播放动效':'暂停动效'):(paused?'Play animation':'Pause animation'));pause.innerHTML=paused?'<svg viewBox="0 0 16 16" aria-hidden="true"><path d="m4 2 10 6-10 6Z" fill="currentColor"/></svg>':'<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M5 3v10M11 3v10" stroke="currentColor" stroke-width="2"/></svg>';stageState();document.dispatchEvent(new Event('field-pause'));});
new IntersectionObserver(entries=>{stageVisible=entries[0].isIntersecting;stageState();}).observe(stage);
document.addEventListener('visibilitychange',stageState);motion.addEventListener('change',()=>{paused=motion.matches;stageState();document.dispatchEvent(new Event('field-pause'));});
const startFields=()=>{if(motion.matches)return;import('./light-field.js').then(({mountField})=>document.querySelectorAll('.light-field').forEach(el=>mountField(el,{paused:()=>paused}))).catch(()=>{});};
if('requestIdleCallback' in window)requestIdleCallback(startFields,{timeout:1500});else setTimeout(startFields,300);
const header=document.querySelector('.header'),hero=document.querySelector('.hero');
const updateHeader=()=>{header.classList.toggle('scrolled',scrollY>36);header.classList.toggle('on-stage',scrollY<hero.offsetHeight-50);};
window.addEventListener('scroll',updateHeader,{passive:true});updateHeader();
document.querySelectorAll('.dark-card').forEach(card=>{let rect;card.addEventListener('pointerenter',()=>rect=card.getBoundingClientRect());card.addEventListener('pointermove',e=>{if(motion.matches||!rect)return;card.style.setProperty('--mx',`${e.clientX-rect.left}px`);card.style.setProperty('--my',`${e.clientY-rect.top}px`);});card.addEventListener('pointerleave',()=>{card.style.removeProperty('--mx');card.style.removeProperty('--my');});});
const tabs=[...document.querySelectorAll('[data-proof]')];
const selectTab=i=>{tabs.forEach((tab,j)=>{tab.setAttribute('aria-selected',String(j===i));tab.tabIndex=j===i?0:-1;});document.querySelector('#proof-panel').setAttribute('aria-labelledby',tabs[i].id);document.querySelector('#proof-issue').textContent=data.proof[i].issue;document.querySelector('#proof-solution').textContent=data.proof[i].solution;};
tabs.forEach((tab,i)=>{tab.addEventListener('click',()=>selectTab(i));tab.addEventListener('keydown',e=>{const keys=['ArrowRight','ArrowDown','ArrowLeft','ArrowUp','Home','End'];if(!keys.includes(e.key))return;e.preventDefault();let n=e.key==='Home'?0:e.key==='End'?tabs.length-1:(i+(e.key==='ArrowRight'||e.key==='ArrowDown'?1:-1)+tabs.length)%tabs.length;selectTab(n);tabs[n].focus();});});
const dialog=document.querySelector('.lightbox');let lightboxTrigger;
document.querySelectorAll('[data-lightbox]').forEach(link=>link.addEventListener('click',e=>{e.preventDefault();lightboxTrigger=link;dialog.showModal();dialog.querySelector('button').focus();}));
dialog.querySelector('[data-close]').addEventListener('click',()=>dialog.close());dialog.addEventListener('close',()=>lightboxTrigger?.focus());dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
// Native modal dialog supplies inert background, Escape and focus containment.
fetch('./chart-data.json').then(r=>r.json()).then(({points})=>{
 const xy=(turn,val)=>[(turn-1)/99*600,230-val/3000*230];
 const path=key=>points.map((p,i)=>`${i?'L':'M'}${xy(p.turn,p[key]).join(' ')}`).join(' ');
 document.querySelector('#raw-path').setAttribute('d',path('raw'));document.querySelector('#core-path').setAttribute('d',path('core'));document.querySelector('#area').setAttribute('d',path('core')+'L600 230L0 230Z');
 const interpolate=(turn,key)=>{let hi=points.findIndex(p=>p.turn>=turn);if(hi===0)return points[0][key];const a=points[hi-1],b=points[hi];return a[key]+(b[key]-a[key])*(turn-a.turn)/(b.turn-a.turn);};
 const update=()=>{const turn=Number(document.querySelector('#turn').value),raw=interpolate(turn,'raw'),core=interpolate(turn,'core'),x=xy(turn,raw)[0];for(const [name,val] of [['raw',raw],['core',core]]){const [cx,cy]=xy(turn,val);document.querySelector(`#${name}-point`).setAttribute('cx',cx);document.querySelector(`#${name}-point`).setAttribute('cy',cy);document.querySelector(`#${name}-value`).textContent=`${Math.round(val).toLocaleString()} ms`;}document.querySelector('#cursor').setAttribute('d',`M${x} 0V230`);document.querySelector('#turn-label').textContent=zh?`第 ${turn} 轮`:`Turn ${turn}`;};
 document.querySelector('#turn').addEventListener('input',update);update();
}).catch(()=>{});
// Progressive enhancement: content remains visible if scripts do not execute.
if(!motion.matches){document.documentElement.classList.add('js');const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.remove('pending');observer.unobserve(e.target);}}),{threshold:.08});document.querySelectorAll('.reveal').forEach(el=>{if(el.getBoundingClientRect().top>innerHeight){el.classList.add('pending');observer.observe(el);}});}
