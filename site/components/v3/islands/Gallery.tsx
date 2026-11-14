import {type Locale,cases} from "@/lib/content-v4";
import {Gallery as GalleryClient} from "../GalleryIsland";
export function Gallery({item,locale}:{item:ReturnType<typeof cases>[number];locale:Locale}){return <GalleryClient item={{images:item.images,main:item.main,system:item.system}} locale={locale}/>;}
