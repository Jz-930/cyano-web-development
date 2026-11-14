import Link from "next/link";
import pageCopy from "@/content/v4/pages/Missing.json";
import { href, text, type Locale } from "@/lib/content-v4";
import { FieldPoster } from "../FieldPoster";
import { Phrase } from "../Phrase";

export function Missing({ locale }: { locale: Locale }) {
  return (
    <section className="dark missing-section relative isolate overflow-hidden [min-height:76vh] [padding:140px_0_var(--sp-9)] flex items-center" data-header="dark">
      <FieldPoster preset="converge" opacity={0.5} />
      <div className="wrap">
        <div className="missing-inner relative [z-index:var(--z-content)] [max-width:56ch] [margin-inline:auto] flex flex-col items-center text-center [gap:var(--sp-4)]">
          <p className="eyebrow on-dark">404</p>
          <h1 className="h1-page">
            <Phrase text={text("D.9", "标题", locale)} locale={locale} />
          </h1>
          <p className="lede">{text("D.9", "正文", locale)}</p>
          <div className="missing-actions flex flex-wrap justify-center [gap:var(--sp-3)] [margin-top:var(--sp-2)]">
            <Link className="button" href={href(locale)}>
              {pageCopy.back_to_home[locale]}
            </Link>
            <Link
              className="button-secondary on-dark"
              href={href(locale, "/cases")}
            >
              {pageCopy.see_our_work[locale]}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
