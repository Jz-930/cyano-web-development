import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { availability } from "@/lib/content";
import {
  href,
  solutions,
  t,
  text,
  type Locale,
} from "@/lib/content-v4";
import { BrandMark } from "./BrandMark";

export function SiteFooter({ locale }: { locale: Locale }) {
  const columnTitles = text("D.1", "页脚栏目标题", locale).split(" · ");
  const legalLinks = text("D.1", "页脚法律链接", locale).split(" · ");

  return (
    <footer className="footer dark" data-header="dark">
      <div className="wrap">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link className="footer-brand-link" href={href(locale)} aria-label="Cyano">
              <span className="brand">
                <BrandMark size={32} className="footer-mark" />
                <span>CYANO</span>
              </span>
            </Link>
            <p className="footer-positioning">{text("D.1", "页脚定位句", locale)}</p>
            <span className="footer-region">{text("D.1", "页脚服务地区", locale)}</span>
          </div>

          <div className="footer-col">
            <h3 className="eyebrow">{columnTitles[0]}</h3>
            {solutions(locale).map((s) => (
              <Link
                key={s.slug}
                className="footer-link"
                href={href(locale, "/services/" + s.slug)}
              >
                {s.name}
              </Link>
            ))}
          </div>

          <div className="footer-col">
            <h3 className="eyebrow">{columnTitles[1]}</h3>
            {["about", "cases", "technology", "engagement", "insights"].map(
              (p, i) => (
                <Link key={p} className="footer-link" href={href(locale, "/" + p)}>
                  {t(
                    locale,
                    ["关于我们", "案例", "方法与技术", "合作方式", "洞察"][i],
                    [
                      "About",
                      "Case studies",
                      "Technology",
                      "How we work",
                      "Insights",
                    ][i],
                  )}
                </Link>
              ),
            )}
          </div>

          <div className="footer-col">
            <h3 className="eyebrow">{columnTitles[2]}</h3>
            <Link className="footer-link" href={href(locale, "/contact#form")}>
              <span>{text("D.1", "主按钮", locale)}</span>
              <ArrowUpRight size={14} aria-hidden="true" />
            </Link>
            {availability.email ? (
              <a className="footer-link" href="mailto:hello@cyano.app">
                hello@cyano.app
              </a>
            ) : null}
            <span className="footer-location">
              <span className="status-dot" aria-hidden="true" />
              {t(
                locale,
                "中国 · 北美 · 全球远程交付",
                "China · North America · Worldwide",
              )}
            </span>
          </div>
        </div>

        <div className="footer-bottom">
          <span>
            {t(
              locale,
              "© 2026 Cyano Intelligence · 澜屿智创 版权所有",
              "© 2026 Cyano Intelligence. All rights reserved.",
            )}
          </span>
          <div className="footer-legal">
            <Link className="footer-legal-link" href={href(locale, "/privacy")}>
              {legalLinks[0]}
            </Link>
            <Link className="footer-legal-link" href={href(locale, "/terms")}>
              {legalLinks[1]}
            </Link>
            <span>CYANO INTELLIGENCE</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
