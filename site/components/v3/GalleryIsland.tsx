"use client";
import {useRef,useState,useEffect} from "react";
import dynamic from "next/dynamic";
import {Search} from "lucide-react";
import {type Locale,t} from "@/lib/locale";
import {Picture} from "./Picture";
const Lightbox=dynamic(()=>import('./Lightbox').then(m=>m.Lightbox),{ssr:false});
export function Gallery({item,locale}:{item:{images:string[];main:number;system:string};locale:Locale}){
 const [current,setCurrent]=useState(item.main),[zoom,setZoom]=useState(false),[ready,setReady]=useState(false);
 const trigger=useRef<HTMLButtonElement>(null),host=useRef<HTMLDivElement>(null);
 useEffect(()=>{const observer=new IntersectionObserver(([entry])=>{if(entry.isIntersecting){setReady(true);observer.disconnect();}},{rootMargin:'200px'});if(host.current)observer.observe(host.current);return()=>observer.disconnect();},[]);
 return <div className="gallery" ref={host}><button ref={trigger} className="gallery-main" onClick={()=>{setReady(true);setZoom(true);}} aria-label={t(locale,"放大查看界面","Enlarge screenshot")}><Picture src={item.images[current]} alt={item.system+" — "+t(locale,"界面","screen")+" "+(current+1)} sizes="(max-width: 800px) 90vw, 1100px"/><span><Search size={17}/>{t(locale,"点击放大","Click to enlarge")}</span></button><div className="gallery-controls"><div className="gallery-thumbs">{item.images.map((src,i)=><button key={src} className={current===i?'selected':''} onClick={()=>setCurrent(i)} aria-label={t(locale,"查看界面 ","View screen ")+(i+1)} aria-pressed={current===i}><Picture src={src} alt="" thumbnail sizes="100px"/></button>)}</div><div className="gallery-count">{String(current+1).padStart(2,'0')} / {String(item.images.length).padStart(2,'0')}</div></div>{ready&&zoom&&<Lightbox locale={locale} images={item.images} label={item.system} current={current} onChange={setCurrent} onClose={()=>{setZoom(false);trigger.current?.focus();}}/>}</div>;
}
