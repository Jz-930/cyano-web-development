import Image from "next/image";
import Link from "next/link";

const navItems = [
    ["核心理念", "#philosophy"],
    ["服务方式", "#services"],
    ["落地案例", "#cases"],
    ["技术保障", "#technical-proof"],
    ["部署方案", "#deploy"],
];

const Navbar = () => {
    return (
        <nav className="fixed top-0 z-[1000] flex h-[78px] w-full items-center border-b border-brand-mint/10 bg-[#030607]/72 backdrop-blur-[24px]">
            <div className="site-nav-inner">
                <Link href="/" className="flex items-center gap-3">
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
                            className="text-[13px] font-medium tracking-[0.08em] text-text-muted transition-all hover:text-brand-mint"
                        >
                            {item}
                        </Link>
                    ))}
                </div>

                <Link href="#contact" className="cyano-ghost-button desktop-contact-link !px-6 !py-3 text-[12px]">
                    预约咨询
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;
