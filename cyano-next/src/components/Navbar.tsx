import Link from "next/link";

const Navbar = () => {
    return (
        <nav className="fixed top-0 w-full h-[80px] bg-[#050505]/85 backdrop-blur-[20px] border-b border-border-light z-[1000] flex items-center">
            <div className="container mx-auto px-8 flex justify-between items-center">
                <div className="font-heading text-[26px] font-bold tracking-[-0.05em] text-white flex items-center gap-1">
                    CYANO<span className="text-accent-cyan text-[40px] leading-none mt-2.5">.</span>
                </div>
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
                    className="px-7 py-3 border border-border-light text-white text-[13px] font-bold uppercase tracking-[0.05em] transition-all hover:border-accent-cyan hover:text-accent-cyan hover:shadow-[0_0_20px_rgba(0,242,255,0.1)]"
                >
                    预约咨询
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;
