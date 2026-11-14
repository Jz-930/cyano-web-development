import { NotFoundView } from "@/components/v3/views/NotFoundView";
export const metadata={title:"Page not found | Cyano",robots:{index:false}};

export default function EnNotFound() {
  return <NotFoundView locale="en" />;
}
