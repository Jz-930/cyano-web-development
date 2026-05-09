"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";

const navItems = [
    ["首页", "/"],
    ["服务与合作", "/services"],
    ["项目展示", "/cases"],
    ["技术保障", "/technology"],
];

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const closeMenu = () => setIsOpen(false);

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
                    {navItems.map(([item, href]) => (
                        <Link
                            key={item}
                            href={href}
                            onClick={closeMenu}
                            className="text-[13px] font-medium tracking-[0.08em] text-text-muted transition-all hover:text-brand-mint"
                        >
                            {item}
                        </Link>
                    ))}
                </div>

                <Link href="/contact" className="cyano-ghost-button desktop-contact-link !px-6 !py-3 text-[12px]">
                    联系我们
                </Link>

                <button
                    type="button"
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-brand-mint/20 bg-white/[0.035] text-xl text-white transition-colors hover:border-brand-mint/45 hover:text-brand-mint lg:hidden"
                    aria-label={isOpen ? "关闭导航菜单" : "打开导航菜单"}
                    aria-expanded={isOpen}
                    onClick={() => setIsOpen((current) => !current)}
                >
                    {isOpen ? <FiX aria-hidden="true" /> : <FiMenu aria-hidden="true" />}
                </button>
            </div>
            {isOpen && (
                <div className="absolute left-4 right-4 top-[88px] rounded-3xl border border-brand-mint/15 bg-[#030607]/96 p-4 shadow-[0_24px_80px_rgba(0,0,0,0.5)] backdrop-blur-2xl lg:hidden">
                    <div className="grid gap-2">
                        {navItems.map(([item, href]) => (
                            <Link
                                key={item}
                                href={href}
                                onClick={closeMenu}
                                className="rounded-2xl px-4 py-3 font-heading text-sm text-white/76 transition-colors hover:bg-white/[0.05] hover:text-brand-mint"
                            >
                                {item}
                            </Link>
                        ))}
                        <Link href="/contact" onClick={closeMenu} className="cyano-button mt-2 w-full">
                            联系我们
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
