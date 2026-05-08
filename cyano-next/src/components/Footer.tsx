"use client";

import { useReveal } from "@/hooks/useReveal";

const fieldClass =
    "w-full rounded-2xl border border-white/10 bg-[#071012]/85 px-5 py-4 text-base text-white outline-none transition-all placeholder:text-white/30 focus:border-brand-mint/60 focus:shadow-[0_0_0_4px_rgba(126,245,214,0.08)]";

const Footer = () => {
    useReveal();

    return (
        <footer id="contact" className="relative overflow-hidden border-t border-brand-mint/10 bg-[#030607] py-28">
            <div className="absolute inset-x-0 bottom-0 h-[520px] bg-[radial-gradient(ellipse_60%_80%_at_50%_100%,rgba(63,160,166,0.22),rgba(0,242,255,0.06)_42%,transparent_72%)]" />
            <div className="absolute -bottom-40 left-1/2 h-[480px] w-[900px] -translate-x-1/2 rounded-full bg-brand-mint/10 blur-3xl" />

            <div className="container reveal relative z-10 grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
                <div>
                    <div className="lab-kicker mb-4">START WITH DIAGNOSIS</div>
                    <h2 className="mb-6 max-w-xl font-heading text-[clamp(2.2rem,5vw,4.5rem)] font-semibold leading-tight text-white">
                        从一次业务诊断开始
                    </h2>
                    <p className="mb-10 max-w-lg text-[1.1rem] leading-8 text-text-muted">
                        告诉我们你想定制工具、启动试点，还是把一批任务交给 Cyano 托管。我们会先帮你判断业务价值和合作方式。
                    </p>
                    <div className="grid max-w-lg gap-3">
                        {["不公开固定价格，先评估真实业务价值", "支持买断、低启动持续服务、托管式交付", "SaaS 托管与私有化部署均可讨论"].map((item) => (
                            <div key={item} className="flex items-center gap-3 text-sm text-white/75">
                                <span className="h-2 w-2 rounded-full bg-brand-mint shadow-[0_0_14px_rgba(126,245,214,0.65)]" />
                                {item}
                            </div>
                        ))}
                    </div>
                </div>

                <form className="lab-panel grid gap-5 p-6 md:p-8">
                    <div className="grid gap-5 md:grid-cols-2">
                        <input type="text" className={fieldClass} placeholder="姓名 / Name" />
                        <input type="text" className={fieldClass} placeholder="公司 / Company" />
                    </div>
                    <input type="email" className={fieldClass} placeholder="工作邮箱 / Work Email" />
                    <select className={`${fieldClass} text-white/70`}>
                        <option>我想定制 AI 工具</option>
                        <option>我想低成本启动试点</option>
                        <option>我想把任务交给 Cyano 托管</option>
                        <option>我还不确定，想先评估</option>
                    </select>
                    <textarea
                        className={`${fieldClass} min-h-[132px] resize-none`}
                        placeholder="简单描述你的业务场景、现有成本或希望 AI 帮你完成的任务"
                    />
                    <button type="button" className="cyano-button mt-2 w-full">
                        提交咨询
                    </button>
                </form>

                <div className="lg:col-span-2 border-t border-white/10 pt-10 text-center text-sm tracking-[0.05em] text-text-muted/70">
                    &copy; 2026 Cyano Intelligence. All Rights Reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
