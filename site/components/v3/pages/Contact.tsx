import pageCopy from "@/content/v3/pages/Contact.json";
import {Picture} from "../Picture";
import { Locale, t, text } from "@/lib/v1-content";
import { Eyebrow } from "../ui";
import {ContactForm} from "../islands/ContactForm";
import { PageHero } from "./PageHero";

export function Contact({ locale }: { locale: Locale }) {
  return (
    <>
      <PageHero
        locale={locale}
        eyebrow={pageCopy.cb59ac26ed1[locale]}
        title={text("D.8", "Hero 标题", locale)}
        intro={text("D.8", "Hero 导语", locale)}
        compact
      />
      <section className="section contact-section">
        <div className="wrap contact-layout">
          <aside>
            <Eyebrow>
              {pageCopy.c7f81224b43[locale]}
            </Eyebrow>
            <h2>
              {pageCopy.c96f9dc04d9[locale]}
            </h2>
            <div className="contact-starts">
              {[1, 2, 3].map((i) => {
                const [head, ...tail] = text("D.8", "起点 " + i, locale).split(
                  locale === "zh" ? " —— " : " — ",
                );
                return (
                  <div key={i}>
                    <span>0{i}</span>
                    <div>
                      <h3>{head}</h3>
                      <p>{tail.join(" — ")}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="contact-person">
              <div className="contact-avatar">
                <Picture src="/v3-materials/founder-4.webp" alt={pageCopy.c400a667ac0[locale]}/>
              </div>
              <div>
                <h3>
                  {pageCopy.cacf9ee0ac0[locale]}
                </h3>
                <p>{text("D.8", "谁会回复你", locale)}</p>
              </div>
            </div>
            <div className="next-steps">
              <h3>{pageCopy.c8c2439250f[locale]}</h3>
              {[1, 2, 3].map((i) => (
                <p key={i}>
                  <span>{i}</span>
                  {text("D.8", "接下来 " + i, locale)}
                </p>
              ))}
            </div>
          </aside>
          <div id="form">
            <ContactForm locale={locale} />
          </div>
        </div>
      </section>
    </>
  );
}
