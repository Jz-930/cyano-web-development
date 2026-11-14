import manifestData from "@/lib/responsive-media.json";
type Asset={width:number;height:number;variants:{width:number;webp:string;avif:string}[]};
const manifest=manifestData as Record<string,Asset>;
export function Picture({src,alt,sizes="(max-width: 800px) calc(100vw - 40px), 600px",priority=false,thumbnail=false}:{src:string;alt:string;sizes?:string;priority?:boolean;thumbnail?:boolean}){
 const asset=manifest[src];
 if(!asset)throw new Error(`Responsive image missing: ${src}`);
 const variants=thumbnail?asset.variants.filter(v=>v.width<=320):asset.variants;
 const fallback=variants.find(v=>v.width>=640)||variants.at(-1)!;
 return <picture><source type="image/avif" srcSet={variants.map(v=>`${v.avif} ${v.width}w`).join(", ")} sizes={sizes}/><img src={fallback.webp} srcSet={variants.map(v=>`${v.webp} ${v.width}w`).join(", ")} sizes={sizes} alt={alt} width={asset.width} height={asset.height} loading={priority?"eager":"lazy"} fetchPriority={priority?"high":"auto"}/></picture>;
}
