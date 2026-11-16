import { BrandMark } from "@/components/v4/BrandMark";

export function Logo() {
  return (
    <span className="brand">
      <BrandMark size={32} />
      <span>CYANO</span>
      <span className="brand-cn" lang="zh-CN">
        <span className="brand-dot" aria-hidden="true">·</span>澜屿智创
      </span>
    </span>
  );
}

