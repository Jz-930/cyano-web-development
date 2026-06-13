"use client";

import { useI18n } from "@/i18n/LanguageProvider";

const ContactOptions = () => {
    const { content } = useI18n();
    const options = content.contact.options;
    const optionItems = options.items as Array<{ label: string; title: string; body: string; dot: string }>;

    return (
        <section className="lab-section">
            <div className="lab-container">
                <div className="reveal mb-12 max-w-3xl">
                    <div className="lab-kicker mb-4">{options.kicker}</div>
                    <h2 className="section-title">{options.title}</h2>
                    <p className="section-copy mt-5">
                        {options.description}
                    </p>
                </div>

                <div className="reveal grid gap-5 lg:grid-cols-3">
                    {optionItems.map((option) => (
                        <article key={option.title} className="lab-panel p-6 md:p-7">
                            <div className="mb-6 flex items-center justify-between gap-4">
                                <span className="lab-label">{option.label}</span>
                                <span className={option.dot} />
                            </div>
                            <h3 className="mb-4 font-heading text-[1.55rem] leading-tight text-white">{option.title}</h3>
                            <p className="text-sm leading-7 text-text-muted">{option.body}</p>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ContactOptions;
