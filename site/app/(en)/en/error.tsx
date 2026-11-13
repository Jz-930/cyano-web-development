"use client";

import React from "react";
import Link from "next/link";

export default function EnError({ reset }: { reset: () => void }) {
  return (
    <main id="main" className="site-section surface-obsidian min-h-[65vh]">
      <div className="site-container max-w-2xl py-16">
        <span className="eyebrow-badge eyebrow-badge-dark">ERROR</span>
        <h1 className="mt-4 text-[length:var(--fs-display)] text-[#F2FAF9]">
          Something went wrong loading this page
        </h1>
        <p className="mt-3 text-[16px] text-[#B4CFD2]">
          Please retry loading the page or return to the homepage.
        </p>
        <div className="mt-7 flex flex-wrap gap-3.5">
          <button type="button" onClick={reset} className="btn-primary-mint">
            Try again
          </button>
          <Link href="/en" className="btn-secondary-glass">
            Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
