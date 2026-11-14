import pageCopy from "@/content/v4/pages/Contact.json";
import {Picture} from "../Picture";
import { Locale, t, text } from "@/lib/content-v4";
import { Eyebrow } from "../ui";
import {ContactForm} from "../islands/ContactForm";
import { PageHero } from "./PageHero";
import { Phrase } from "@/components/v4/Phrase";

export function Contact({ locale }: { locale: Locale }) {
  return (
    <>
      <PageHero
        locale={locale}
        eyebrow={pageCopy.lets_talk[locale]}
        title={text("D.8", "Hero 标题", locale)}
        intro={text("D.8", "Hero 导语", locale)}
        compact
      />
      <section className="section contact-section" data-header="paper">
        <div className="wrap contact-layout">
          <aside>
            <Eyebrow>
              {pageCopy.topics_to_discuss[locale]}
            </Eyebrow>
            <h2>
              <Phrase text={pageCopy.requirements_projects_or_technical[locale]} locale={locale} />
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
                <Picture src="/v3-materials/founder-4.webp" alt={pageCopy.head_of_product_solutions[locale]}/>
              </div>
              <div>
                <h3>
                  {pageCopy.your_inquiry[locale]}
                </h3>
                <p>{text("D.8", "谁会回复你", locale)}</p>
              </div>
            </div>
            <div className="next-steps">
              <h3>{pageCopy.what_happens_next[locale]}</h3>
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
