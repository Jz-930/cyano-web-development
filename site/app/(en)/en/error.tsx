"use client";

import React from "react";
import Link from "next/link";

export default function EnError({ reset }: { reset: () => void }) {
  return (
    <main id="main" className="site-section surface-light min-h-[65vh]">
      <div className="site-wrap max-w-2xl py-16">
        <span className="eyebrow-badge">ERROR</span>
        <h1 className="mt-4 text-[length:var(--fs-display)] text-[#111111]">
          Something went wrong loading this page
        </h1>
        <p className="mt-4 text-[16px] text-[#444444]">
          Please retry loading the page or return to the homepage.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <button type="button" onClick={reset} className="btn-primary-dark">
            Try again
          </button>
          <Link href="/en" className="btn-secondary-light">
            Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
