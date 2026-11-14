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
    <section className="closing dark" data-header="dark">
      <LightField
        preset="closing"
        focusSelector=".closing .button"
        textEdgeSelector=".closing-copy"
      />
      <div className="wrap closing-wrap">
        <div className="closing-card edge-closing" data-reveal="">
          <div className="closing-copy">
            <p className="eyebrow on-dark">
              {t(locale, "项目咨询", "CONTACT US")}
            </p>
            <h2 className="h2">
              <Phrase text={title} locale={locale} />
            </h2>
            <p className="lede">{sub}</p>
            {showInfo ? (
              <ul className="closing-info">
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
