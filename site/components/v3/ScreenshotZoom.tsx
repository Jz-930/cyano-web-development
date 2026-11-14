"use client";
import {Picture} from "./Picture";

import {useRef} from "react";
import {type Locale,t} from "@/lib/locale";
export function ScreenshotZoom({image,crop,label,locale}:{image:string;crop:string;label:string;locale:Locale}){
 const dialog=useRef<HTMLDialogElement>(null);
 return <><button className="screen-focus" onClick={()=>dialog.current?.showModal()} aria-label={t(locale,"放大查看：","Enlarge: ")+label}><Picture src={crop} alt={label} priority sizes="(max-width: 800px) 90vw, 450px"/><span className="screen-caption">{t(locale,"点击查看完整界面 ↗","View full screen ↗")}</span></button><dialog ref={dialog} className="screen-dialog" onClick={e=>{if(e.target===e.currentTarget)dialog.current?.close();}}><button className="dialog-close" onClick={()=>dialog.current?.close()}>{t(locale,"关闭 ×","Close ×")}</button><Picture src={image} alt={label} sizes="90vw"/><p>{label}</p></dialog></>;
}
