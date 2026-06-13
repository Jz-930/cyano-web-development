"use client";

import { useI18n } from "@/i18n/LanguageProvider";

const ServiceFAQ = () => {
    const { content } = useI18n();
    const faq = content.services.faq;
    const faqItems = faq.items as Array<{ question: string; answer: string }>;

    return (
        <section className="lab-section">
            <div className="lab-container">
                <div className="reveal mb-12 max-w-3xl">
                    <div className="lab-kicker mb-4">{faq.kicker}</div>
                    <h2 className="section-title">{faq.title}</h2>
                    <p className="section-copy mt-5">
                        {faq.description}
                    </p>
                </div>

                <div className="reveal grid gap-5 md:grid-cols-2">
                    {faqItems.map((item) => (
                        <article key={item.question} className="lab-panel p-6 md:p-7">
                            <h3 className="mb-4 font-heading text-[1.35rem] leading-snug text-white">{item.question}</h3>
                            <p className="text-sm leading-7 text-text-muted">{item.answer}</p>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ServiceFAQ;
