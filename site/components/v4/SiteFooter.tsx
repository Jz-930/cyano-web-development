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
    <footer className="footer dark relative [background:var(--n1)] [color:var(--on-dark)] [border-top:1px_solid_var(--dark-line-soft)] [padding:var(--sp-8)_0_var(--sp-6)]" data-header="dark">
      <div className="wrap">
        <div className="footer-grid grid [gap:var(--sp-7)] [@media(max-width:600px)]:[gap:var(--sp-6)] [padding-bottom:var(--sp-7)]">
          <div className="footer-brand flex flex-col [align-items:flex-start] [gap:var(--sp-3)]">
            <Link className="footer-brand-link items-center" href={href(locale)} aria-label="Cyano">
              <span className="brand">
                <BrandMark size={32} className="footer-mark" />
                <span>CYANO</span>
              </span>
            </Link>
            <p className="footer-positioning [font-size:15px] [line-height:1.7] [color:var(--on-dark)] [max-width:34ch]">{text("D.1", "页脚定位句", locale)}</p>
            <span className="footer-region [font-size:14px] [line-height:1.5] [color:var(--on-dark)]">{text("D.1", "页脚服务地区", locale)}</span>
          </div>

          <div className="footer-col flex flex-col [align-items:flex-start] [gap:var(--sp-3)]">
            <h3 className="eyebrow">{columnTitles[0]}</h3>
            {solutions(locale).map((s) => (
              <Link
                key={s.slug}
                className="footer-link relative inline-flex items-center [gap:var(--sp-1)] [font-size:15px] [line-height:1.5] [padding-bottom:2px] [transition:color_var(--qtf)]"
                href={href(locale, "/services/" + s.slug)}
              >
                {s.name}
              </Link>
            ))}
          </div>

          <div className="footer-col flex flex-col [align-items:flex-start] [gap:var(--sp-3)]">
            <h3 className="eyebrow">{columnTitles[1]}</h3>
            {["about", "cases", "technology", "engagement", "insights"].map(
              (p, i) => (
                <Link key={p} className="footer-link relative inline-flex items-center [gap:var(--sp-1)] [font-size:15px] [line-height:1.5] [padding-bottom:2px] [transition:color_var(--qtf)]" href={href(locale, "/" + p)}>
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

          <div className="footer-col flex flex-col [align-items:flex-start] [gap:var(--sp-3)]">
            <h3 className="eyebrow">{columnTitles[2]}</h3>
            <Link className="footer-link relative inline-flex items-center [gap:var(--sp-1)] [font-size:15px] [line-height:1.5] [padding-bottom:2px] [transition:color_var(--qtf)]" href={href(locale, "/contact#form")}>
              <span>{text("D.1", "主按钮", locale)}</span>
              <ArrowUpRight size={14} aria-hidden="true" />
            </Link>
            {availability.email ? (
              <a className="footer-link relative inline-flex items-center [gap:var(--sp-1)] [font-size:15px] [line-height:1.5] [padding-bottom:2px] [transition:color_var(--qtf)]" href="mailto:hello@cyano.app">
                hello@cyano.app
              </a>
            ) : null}
            <span className="footer-location inline-flex items-center [gap:var(--sp-2)] [font-size:14px] [color:var(--on-dark)] [margin-top:var(--sp-1)]">
              <span className="status-dot inline-block" aria-hidden="true" />
              {t(
                locale,
                "中国 · 北美 · 全球远程交付",
                "China · North America · Worldwide",
              )}
            </span>
          </div>
        </div>

        <div className="footer-bottom flex-wrap [font-size:12px] [line-height:1.5] [color:var(--on-dark)] [@media(max-width:600px)]:flex-col">
          <span>
            {t(
              locale,
              "© 2026 Cyano Intelligence · 澜屿智创 版权所有",
              "© 2026 Cyano Intelligence. All rights reserved.",
            )}
          </span>
          <div className="footer-legal flex flex-wrap items-center [gap:var(--sp-5)]">
            <Link className="footer-legal-link [transition:color_var(--qtf)]" href={href(locale, "/privacy")}>
              {legalLinks[0]}
            </Link>
            <Link className="footer-legal-link [transition:color_var(--qtf)]" href={href(locale, "/terms")}>
              {legalLinks[1]}
            </Link>
            <span>CYANO INTELLIGENCE</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
