import pageCopy from "@/content/v3/pages/EngagementCards.json";
import Link from "next/link";
import { ArrowUpRight, KeyRound, Sprout, PackageCheck } from "lucide-react";
import { Locale, t, href } from "@/lib/v1-content";

export function EngagementCards({ locale }: { locale: Locale }) {
  return (
    <div className="engagement-grid">
      {[KeyRound, Sprout, PackageCheck].map((Icon, i) => (
        <article key={i} className={"engagement-card engagement-" + i}>
          <div className="engagement-top">
            <span>0{i + 1}</span>
            <Icon size={35} strokeWidth={1.2} />
          </div>
          <span className="tag">
            {pageCopy.ca4258756dc[locale][i]}
          </span>
          <h3>
            {pageCopy.cae79c93a25[locale][i]}
          </h3>
          <p>
            {pageCopy.c3df04afb52[locale][i]}
          </p>
          <div className="engagement-bottom">
            <span>
              {pageCopy.ccc77638506[locale][i]}
            </span>
            <Link
              href={href(locale, "/contact#form")}
              aria-label={pageCopy.c0ed5e080c6[locale]}
            >
              <ArrowUpRight size={20} />
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}
