"use client";

import React from "react";
import Link from "next/link";

export default function ZhError({ reset }: { reset: () => void }) {
  return (
    <main id="main" className="site-section surface-light min-h-[65vh]">
      <div className="site-container max-w-2xl py-16">
        <span className="eyebrow-badge">ERROR</span>
        <h1 className="mt-4 text-[length:var(--fs-display)] text-[#111111]">
          页面加载遇到临时问题
        </h1>
        <p className="mt-4 text-[16px] text-[#444444]">
          请尝试重新加载当前页面，或返回首页继续浏览。
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <button type="button" onClick={reset} className="btn-primary-dark">
            重新加载
          </button>
          <Link href="/" className="btn-secondary-light">
            返回首页
          </Link>
        </div>
      </div>
    </main>
  );
}
