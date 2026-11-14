import { NotFoundView } from "@/components/v3/views/NotFoundView";
export const metadata={title:"页面未找到 | Cyano",robots:{index:false}};

export default function ZhNotFound() {
  return <NotFoundView locale="zh" />;
}
