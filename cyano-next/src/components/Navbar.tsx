import Link from "next/link";

const Navbar = () => {
    return (
        <nav className="fixed top-0 w-full h-[80px] bg-[#050505]/60 backdrop-blur-[20px] border-b border-white/5 z-[1000] flex items-center">
            <div className="container mx-auto px-8 flex justify-between items-center">
                <Link href="/" className="flex items-center gap-3">
                    <div className="relative w-8 h-8">
                        <img
                            src="/logo.png"
                            alt="Cyano Logo"
                            className="w-full h-full object-contain"
                        />
                    </div>
                    <div className="font-heading text-[26px] font-bold tracking-[-0.05em] text-white flex items-center gap-1">
                        CYANO<span className="text-accent-cyan text-[40px] leading-none mt-2.5">.</span>
                    </div>
                </Link>
                <div className="hidden md:flex gap-12">
                    {["核心理念", "技术架构", "落地案例", "部署方案"].map((item, i) => {
                        const href = ["#philosophy", "#architecture", "#cases", "#deploy"][i];
                        return (
                            <Link
                                key={item}
                                href={href}
                                className="text-sm text-text-muted font-medium uppercase tracking-[0.05em] transition-all hover:text-white"
                            >
                                {item}
                            </Link>
                        );
                    })}
                </div>
                <Link
                    href="#contact"
                    className="rounded-full border border-white/10 bg-white/5 text-[12px] font-bold tracking-[0.1em] text-white transition-all duration-300 hover:scale-105 hover:bg-accent-cyan hover:text-black hover:border-accent-cyan hover:shadow-[0_0_30px_rgba(0,242,255,0.3)]"
                    style={{
                        padding: '12px 32px',
                        whiteSpace: 'nowrap',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    预约咨询
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;
