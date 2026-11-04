import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import featureWaste from '../assets/feature-waste.svg';
import featureBilling from '../assets/feature-billing.svg';
import featureAudit from '../assets/feature-audit.svg';
import featureScheduler from '../assets/feature-scheduler.svg';

gsap.registerPlugin(ScrollTrigger);

const projects = [
    {
        id: 1,
        title: "SMART WASTE",
        category: "Manajemen Sampah & Daur Ulang",
        image: featureWaste
    },
    {
        id: 2,
        title: "IPL BILLING",
        category: "Otomasi Tagihan & Notifikasi",
        image: featureBilling
    },
    {
        id: 3,
        title: "EXPENSE AUDIT",
        category: "Transparansi Kas & Bukti GDrive",
        image: featureAudit
    },
    {
        id: 4,
        title: "AUTO SCHEDULER",
        category: "Pengingat & Backup Data",
        image: featureScheduler
    }
];

const ProjectsHorizontal = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const section = sectionRef.current;
        const trigger = triggerRef.current;

        if (!section || !trigger) return;

        const getScrollAmount = () => {
            return Math.max(0, section.scrollWidth - window.innerWidth);
        };

        const ctx = gsap.context(() => {
            gsap.fromTo(
                section,
                { translateX: 0 },
                {
                    translateX: () => `-${getScrollAmount()}px`,
                    ease: "none",
                    scrollTrigger: {
                        trigger: trigger,
                        start: "top top",
                        end: () => `+=${getScrollAmount()}`,
                        scrub: 0.6,
                        pin: true,
                        anticipatePin: 1,
                        invalidateOnRefresh: true,
                    },
                }
            );
        });

        const timer = setTimeout(() => {
            ScrollTrigger.refresh();
        }, 400);

        const onResize = () => {
            ScrollTrigger.refresh();
        };
        window.addEventListener('resize', onResize);

        return () => {
            clearTimeout(timer);
            window.removeEventListener('resize', onResize);
            ctx.revert();
        };
    }, []);

    return (
        <section id="features" ref={triggerRef} className="overflow-hidden bg-[#F4F6F0] relative">
            <div
                ref={sectionRef}
                className="h-screen flex items-center pl-12 md:pl-24 pr-16 md:pr-32 gap-12 md:gap-24 w-fit"
            >
                {/* Section Title Card */}
                <div className="flex-shrink-0 w-[340px] md:w-[420px]">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#607C3C]/30 bg-[#607C3C]/10 text-[#607C3C] text-xs font-mono mb-4 tracking-wider uppercase font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#607C3C] animate-pulse"></span>
                        Solusi Klaster
                    </div>
                    <h2 className="text-6xl md:text-8xl font-extrabold text-[#1A2518] leading-tight">
                        FITUR <br />
                        <span className="text-[#607C3C]">UTAMA</span>
                    </h2>
                    <p className="mt-6 text-[#5A6B52] text-lg md:text-xl max-w-sm leading-relaxed">
                        Solusi praktis dan transparan untuk kenyamanan seluruh warga klaster perumahan.
                    </p>
                    <div className="mt-6 flex items-center gap-2 text-xs font-mono text-[#607C3C] uppercase tracking-widest font-semibold">
                        <span>Scroll untuk eksplorasi</span>
                        <span>&rarr;</span>
                    </div>
                </div>

                {/* 4 Core Features Cards */}
                {projects.map((project, index) => (
                    <div
                        key={project.id}
                        className="flex-shrink-0 w-[80vw] max-w-[580px] h-[68vh] rounded-3xl bg-white border border-[#E0E6D8] shadow-[0_12px_40px_rgba(96,124,60,0.08)] hover:shadow-[0_18px_50px_rgba(96,124,60,0.14)] hover:border-[#607C3C]/40 transition-all duration-500 relative group overflow-hidden cursor-none"
                    >
                        {/* 2D Flat Vector Illustration */}
                        <div className="absolute inset-0 overflow-hidden flex items-center justify-center p-6 pb-24">
                            <img
                                src={project.image}
                                alt={project.title}
                                className="w-full h-full object-contain object-center group-hover:scale-105 transition-all duration-700 ease-out"
                            />
                            {/* Subtle White to Transparent Vignette at Bottom */}
                            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent pointer-events-none"></div>
                        </div>

                        {/* Top-Left Card Number */}
                        <div className="absolute top-8 left-8 z-10">
                            <span className="text-5xl md:text-6xl font-extrabold text-[#607C3C]/20 font-mono">0{index + 1}</span>
                        </div>

                        {/* Bottom Card Title & Subtitle */}
                        <div className="absolute bottom-8 left-8 right-8 z-10 transform translate-y-1 group-hover:translate-y-0 transition-transform duration-500">
                            <h3 className="text-3xl md:text-5xl font-extrabold text-[#1A2518] mb-2">{project.title}</h3>
                            <p className="text-lg md:text-xl text-[#607C3C] font-semibold">{project.category}</p>
                        </div>

                        {/* Soft Hover Overlay */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-t from-[#607C3C]/5 to-transparent pointer-events-none"></div>
                    </div>
                ))}

                {/* Text Block Beside Card 04 */}
                <div className="flex-shrink-0 w-[400px] flex items-center justify-center">
                    <h3 className="text-4xl text-[#1A2518] font-bold text-center leading-snug">
                        Detailed <br /> Archive <br />
                        <span className="text-[#607C3C]">&rarr;</span>
                    </h3>
                </div>
            </div>
        </section>
    );
};

export default ProjectsHorizontal;