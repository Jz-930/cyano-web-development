"use client";
import {useEffect} from "react";
import {usePathname} from "next/navigation";
export function MotionRuntime(){
 const pathname=usePathname();
 useEffect(()=>{
  const media=matchMedia('(prefers-reduced-motion: reduce)');if(media.matches)return;
  const cards=document.querySelectorAll<HTMLElement>('.case-card,.engagement-card,.team-card,.plain-card');
  const visible=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.remove('motion-pending');visible.unobserve(e.target);}}),{threshold:.08});
  cards.forEach(card=>{card.classList.add('motion-card');if(card.getBoundingClientRect().top>innerHeight)card.classList.add('motion-pending');visible.observe(card);});
  const stages=document.querySelectorAll<HTMLElement>('.product-stage');
  const stageObserver=new IntersectionObserver(entries=>entries.forEach(e=>(e.target as HTMLElement).dataset.playing=String(e.isIntersecting)));stages.forEach(e=>stageObserver.observe(e));
  const move=(event:PointerEvent)=>{if(event.pointerType==='touch')return;const card=(event.target as Element).closest<HTMLElement>('.case-card,.engagement-card,.team-card,.plain-card');if(!card)return;const r=card.getBoundingClientRect();card.style.setProperty('--mx',`${event.clientX-r.left}px`);card.style.setProperty('--my',`${event.clientY-r.top}px`);};
  const visibility=()=>document.documentElement.classList.toggle('motion-paused',document.hidden);
  const reduce=()=>{if(media.matches){cards.forEach(c=>c.classList.remove('motion-pending'));document.documentElement.classList.add('motion-paused');}else visibility();};
  document.addEventListener('pointermove',move,{passive:true});document.addEventListener('visibilitychange',visibility);media.addEventListener('change',reduce);visibility();
  return()=>{visible.disconnect();stageObserver.disconnect();cards.forEach(c=>c.classList.remove('motion-pending'));document.removeEventListener('pointermove',move);document.removeEventListener('visibilitychange',visibility);media.removeEventListener('change',reduce);document.documentElement.classList.remove('motion-paused');};
 },[pathname]);return null;
}
