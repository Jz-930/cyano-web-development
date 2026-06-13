"use client";

import { useReveal } from "@/hooks/useReveal";
import { useI18n } from "@/i18n/LanguageProvider";

const fieldClass =
    "w-full rounded-2xl border border-white/10 bg-[#071012]/85 px-5 py-4 text-base text-white outline-none transition-all placeholder:text-white/30 focus:border-brand-mint/60 focus:shadow-[0_0_0_4px_rgba(126,245,214,0.08)]";

const Footer = () => {
    useReveal();
    const { content } = useI18n();
    const footer = content.contact.footer;

    return (
        <footer id="contact" className="relative overflow-hidden border-t border-brand-mint/10 bg-[#030607] py-28">
            <div className="absolute inset-x-0 bottom-0 h-[520px] bg-[radial-gradient(ellipse_60%_80%_at_50%_100%,rgba(63,160,166,0.22),rgba(0,242,255,0.06)_42%,transparent_72%)]" />
            <div className="absolute -bottom-40 left-1/2 h-[480px] w-[900px] -translate-x-1/2 rounded-full bg-brand-mint/10 blur-3xl" />

            <div className="container reveal relative z-10 grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
                <div>
                    <div className="lab-kicker mb-4">{footer.kicker}</div>
                    <h2 className="mb-6 max-w-xl font-heading text-[clamp(2.2rem,5vw,4.5rem)] font-semibold leading-tight text-white">
                        {footer.title}
                    </h2>
                    <p className="mb-10 max-w-lg text-[1.1rem] leading-8 text-text-muted">
                        {footer.description}
                    </p>
                    <div className="grid max-w-lg gap-3">
                        {footer.bullets.map((item: string) => (
                            <div key={item} className="flex items-center gap-3 text-sm text-white/75">
                                <span className="h-2 w-2 rounded-full bg-brand-mint shadow-[0_0_14px_rgba(126,245,214,0.65)]" />
                                {item}
                            </div>
                        ))}
                    </div>
                </div>

                <form className="lab-panel grid gap-5 p-6 md:p-8">
                    <div className="grid gap-5 md:grid-cols-2">
                        <input type="text" className={fieldClass} placeholder={footer.fields.name} />
                        <input type="text" className={fieldClass} placeholder={footer.fields.company} />
                    </div>
                    <input type="email" className={fieldClass} placeholder={footer.fields.email} />
                    <select className={`${fieldClass} text-white/70`}>
                        {footer.fields.selectOptions.map((option: string) => (
                            <option key={option}>{option}</option>
                        ))}
                    </select>
                    <textarea
                        className={`${fieldClass} min-h-[132px] resize-none`}
                        placeholder={footer.fields.message}
                    />
                    <button type="button" className="cyano-button mt-2 w-full">
                        {footer.fields.submit}
                    </button>
                </form>

                <div className="lg:col-span-2 border-t border-white/10 pt-10 text-center text-sm tracking-[0.05em] text-text-muted/70">
                    {footer.copyright}
                </div>
            </div>
        </footer>
    );
};

export default Footer;
