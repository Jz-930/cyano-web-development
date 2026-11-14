import {
  copyIfApproved,
  href,
  t,
  text,
  type Locale,
} from "@/lib/content-v4";
import { LightField } from "./LightField";
import { Phrase } from "./Phrase";
import { ClosingCtaAction } from "./ClosingCtaAction";

export function ClosingCta({
  locale,
  isHome = false,
}: {
  locale: Locale;
  isHome?: boolean;
}) {
  const title = isHome
    ? (copyIfApproved("H-8t", locale) ?? text("D.1", "收尾 CTA 口号", locale))
    : text("D.1", "收尾 CTA 口号", locale);
  const sub = isHome
    ? (copyIfApproved("H-8s", locale) ?? text("D.1", "收尾 CTA 副句", locale))
    : text("D.1", "收尾 CTA 副句", locale);

  const i1 = copyIfApproved("K-13i1", locale);
  const i2 = copyIfApproved("K-13i2", locale);
  const i3 = copyIfApproved("K-13i3", locale);
  const showInfo = Boolean(i1 && i2 && i3);

  return (
    <section className="closing dark relative isolate overflow-hidden [padding:var(--sp-9)_0]" data-header="dark">
      <LightField
        preset="closing"
        focusSelector=".closing .button"
        textEdgeSelector=".closing-copy"
      />
      <div className="wrap closing-wrap relative [z-index:var(--z-content)]">
        <div className="closing-card edge-closing relative [min-height:420px] [@media(max-width:1023px)]:min-h-0 [border-radius:var(--r-panel)] grid [grid-template-columns:minmax(0,7fr)_minmax(0,5fr)] [@media(max-width:1023px)]:[grid-template-columns:1fr] items-center [gap:var(--sp-7)] [padding:var(--sp-8)] [@media(max-width:1023px)]:[padding:var(--sp-6)] [background:var(--white-04)]" data-reveal="">
          <div className="closing-copy relative [z-index:var(--z-stage)]">
            <p className="eyebrow on-dark">
              {t(locale, "项目咨询", "CONTACT US")}
            </p>
            <h2 className="h2">
              <Phrase text={title} locale={locale} />
            </h2>
            <p className="lede">{sub}</p>
            {showInfo ? (
              <ul className="closing-info flex flex-wrap [gap:var(--sp-2)_0] [@media(max-width:600px)]:[gap:var(--sp-2)] [margin:var(--sp-6)_0_0] p-0 list-none [@media(max-width:600px)]:flex-col">
                <li>{i1}</li>
                <li>{i2}</li>
                <li>{i3}</li>
              </ul>
            ) : null}
          </div>
          <ClosingCtaAction
            ctaHref={href(locale, "/contact#form")}
            ctaLabel={text("D.1", "主按钮", locale)}
          />
        </div>
      </div>
    </section>
  );
}
