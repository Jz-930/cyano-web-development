"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FiGlobe, FiMenu, FiX } from "react-icons/fi";
import { useI18n } from "@/i18n/LanguageProvider";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { locale, content, toggleLocale } = useI18n();
    const { nav } = content;
    const languageLabel = locale === "cn" ? nav.switchToEnglishLabel : nav.switchToChineseLabel;
    const languageShortLabel = locale === "cn" ? "EN" : "CN";

    const closeMenu = () => setIsOpen(false);
    const switchLanguage = () => {
        toggleLocale();
        closeMenu();
    };

    return (
        <nav className="fixed top-0 z-[1000] flex h-[78px] w-full items-center border-b border-brand-mint/10 bg-[#030607]/72 backdrop-blur-[24px]">
            <div className="site-nav-inner">
                <Link href="/" className="flex items-center gap-3" onClick={closeMenu}>
                    <div className="relative h-9 w-9">
                        <Image
                            src="/logo.png"
                            alt="Cyano Logo"
                            fill
                            sizes="36px"
                            className="object-contain drop-shadow-[0_0_16px_rgba(63,160,166,0.28)]"
                            priority
                        />
                    </div>
                    <div className="flex items-center gap-1 font-heading text-[24px] font-bold tracking-[-0.05em] text-white">
                        CYANO<span className="mt-2 text-[38px] leading-none text-brand-mint">.</span>
                    </div>
                </Link>

                <div className="hidden items-center gap-9 lg:flex">
                    {nav.items.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={closeMenu}
                            className="text-[13px] font-medium tracking-[0.08em] text-text-muted transition-all hover:text-brand-mint"
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>

                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        className="inline-flex h-11 min-w-11 items-center justify-center gap-2 rounded-full border border-brand-mint/20 bg-white/[0.035] px-3 font-heading text-[12px] font-semibold tracking-[0.08em] text-white transition-colors hover:border-brand-mint/45 hover:text-brand-mint"
                        aria-label={languageLabel}
                        title={languageLabel}
                        onClick={switchLanguage}
                    >
                        <FiGlobe aria-hidden="true" className="text-base" />
                        <span>{languageShortLabel}</span>
                    </button>

                    <Link href="/contact" className="cyano-ghost-button desktop-contact-link !px-6 !py-3 text-[12px]" onClick={closeMenu}>
                        {nav.contactLabel}
                    </Link>

                    <button
                        type="button"
                        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-brand-mint/20 bg-white/[0.035] text-xl text-white transition-colors hover:border-brand-mint/45 hover:text-brand-mint lg:hidden"
                        aria-label={isOpen ? nav.closeMenuLabel : nav.openMenuLabel}
                        aria-expanded={isOpen}
                        onClick={() => setIsOpen((current) => !current)}
                    >
                        {isOpen ? <FiX aria-hidden="true" /> : <FiMenu aria-hidden="true" />}
                    </button>
                </div>
            </div>
            {isOpen && (
                <div className="absolute left-4 right-4 top-[88px] rounded-3xl border border-brand-mint/15 bg-[#030607]/96 p-4 shadow-[0_24px_80px_rgba(0,0,0,0.5)] backdrop-blur-2xl lg:hidden">
                    <div className="grid gap-2">
                        {nav.items.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={closeMenu}
                                className="rounded-2xl px-4 py-3 font-heading text-sm text-white/76 transition-colors hover:bg-white/[0.05] hover:text-brand-mint"
                            >
                                {item.label}
                            </Link>
                        ))}
                        <Link href="/contact" onClick={closeMenu} className="cyano-button mt-2 w-full">
                            {nav.contactLabel}
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
