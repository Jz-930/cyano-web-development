import { ArrowRight } from "lucide-react";
import pageCopy from "@/content/v4/pages/Contact.json";
import {
  cases,
  copyIfApproved,
  text,
  type Locale,
} from "@/lib/content-v4";
import { ContactForm } from "../ContactForm";
import { PageHero } from "../PageHero";
import { Phrase } from "../Phrase";

export function Contact({ locale }: { locale: Locale }) {
  const navContact = text("D.1", "关于我们下拉", locale).split(" · ")[2];
  const heroLede =
    copyIfApproved("K-1", locale) ?? text("D.8", "Hero 导语", locale);

  const sep = locale === "zh" ? " —— " : " — ";
  const topics = ([1, 2, 3] as const).map((n) => {
    const [title, ...rest] = text("D.8", `起点 ${n}`, locale).split(sep);
    return {
      indexLabel: `0${n}`,
      title: title.trim(),
      body: rest.join(sep).trim(),
    };
  });

  const kt1 = copyIfApproved("K-T1", locale) ?? "01";
  const kt2 = copyIfApproved("K-T2", locale) ?? "02";
  const nextSteps = [
    { badge: kt1, body: text("D.8", "接下来 1", locale) },
    { badge: kt2, body: text("D.8", "接下来 2", locale) },
    { badge: "03", body: text("D.8", "接下来 3", locale) },
  ];

  const k2Title = copyIfApproved("K-2t", locale);
  const k2Body = copyIfApproved("K-2", locale);

  const inquiryOptions = text("D.8", "咨询类型选项", locale).split(" · ");
  const allCases = cases(locale).map((c) => ({
    slug: c.slug,
    title: c.title,
  }));

  return (
    <>
      <PageHero
        locale={locale}
        crumbLabel={navContact}
        eyebrow={pageCopy.lets_talk[locale]}
        title={text("D.8", "Hero 标题", locale)}
        lede={heroLede}
        visual={
          <div className="contact-timeline glass" data-surface="dark">
            <p className="eyebrow on-dark">
              {pageCopy.what_happens_next[locale]}
            </p>
            <ol className="contact-timeline-list">
              {nextSteps.map((st, idx) => (
                <li key={st.body} className="contact-timeline-step">
                  <div className="contact-timeline-node">
                    <span className="label">{st.badge}</span>
                    {idx < nextSteps.length - 1 ? (
                      <ArrowRight size={14} aria-hidden="true" />
                    ) : null}
                  </div>
                  <p>{st.body}</p>
                </li>
              ))}
            </ol>
          </div>
        }
      />

      <section id="form" className="paper contact-main-section" data-header="paper">
        <div className="wrap contact-main-grid">
          <div className="contact-side" data-reveal="">
            <div className="contact-side-head">
              <p className="eyebrow">{pageCopy.topics_to_discuss[locale]}</p>
              <h2 className="h2">
                <Phrase
                  text={pageCopy.requirements_projects_or_technical[locale]}
                  locale={locale}
                />
              </h2>
            </div>

            <div className="contact-topics">
              {topics.map((tp) => (
                <article key={tp.indexLabel} className="card contact-topic-card">
                  <span className="label">{tp.indexLabel}</span>
                  <h3 className="h3">{tp.title}</h3>
                  <p>{tp.body}</p>
                </article>
              ))}
            </div>

            {k2Title && k2Body ? (
              <div className="card contact-bring-card">
                <h3 className="h3">{k2Title}</h3>
                <p>{k2Body}</p>
              </div>
            ) : null}

            <div className="card contact-responder-card">
              <img
                src="/v3-materials/founder-4.webp"
                alt={pageCopy.head_of_product_solutions[locale]}
                width={48}
                height={48}
                loading="lazy"
                decoding="async"
                className="contact-responder-avatar"
              />
              <div>
                <span className="label">{pageCopy.your_inquiry[locale]}</span>
                <p>{text("D.8", "谁会回复你", locale)}</p>
              </div>
            </div>
          </div>

          <div className="contact-form-col">
            <ContactForm
              locale={locale}
              inquiryOptions={inquiryOptions}
              placeholder={text("D.8", "描述框提示", locale)}
              submitLabel={text("D.8", "提交按钮", locale)}
              caseBookTitle={text("D.5", "案例集标题", locale)}
              caseItems={allCases}
            />
          </div>
        </div>
      </section>
    </>
  );
}
