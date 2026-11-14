import pageCopy from "@/content/v4/pages/EngagementCards.json";
import Link from "next/link";
import { ArrowUpRight, KeyRound, Sprout, PackageCheck } from "lucide-react";
import { Locale, t, href } from "@/lib/content-v4";

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
            {pageCopy.own_a_system[locale][i]}
          </span>
          <h3>
            {pageCopy.full_custom_build[locale][i]}
          </h3>
          <p>
            {pageCopy.for_teams_with_clear[locale][i]}
          </p>
          <div className="engagement-bottom">
            <span>
              {pageCopy.first_release_in_6[locale][i]}
            </span>
            <Link
              href={href(locale, "/contact#form")}
              aria-label={pageCopy.discuss_engagement[locale]}
            >
              <ArrowUpRight size={20} />
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}
