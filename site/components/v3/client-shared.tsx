import { MessagesSquare, FileText, Network, ChartNoAxesCombined } from "lucide-react";
import { BrandMark } from "@/components/v4/BrandMark";

export function Logo() {
  return (
    <span className="brand">
      <BrandMark size={32} />
      <span>CYANO</span>
    </span>
  );
}

export const solutionIcons = [MessagesSquare, FileText, Network, ChartNoAxesCombined];
