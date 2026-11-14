import {type Locale} from "@/lib/v1-content";
import {CopyLink as CopyLinkClient} from "../CopyLinkClient";
export function CopyLink({locale}:{locale:Locale}){return <CopyLinkClient locale={locale}  />;}
