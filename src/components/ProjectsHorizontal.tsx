import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const projects = [
    {
        id: 1,
        title: "SMART WASTE",
        category: "Manajemen Sampah & Daur Ulang",
        description: "Pilah organik & daur ulang bernilai ekonomi langsung dari sumber rumah tangga.",
        image: "https://images.pexels.com/photos/6990304/pexels-photo-6990304.jpeg?auto=compress&cs=tinysrgb&w=1200"
    },
    {
        id: 2,
        title: "IPL BILLING",
        category: "Otomasi Tagihan & Notifikasi",
        description: "Invoice digital otomatis terintegrasi Virtual Account BCA & pelunasan instan.",
        image: "https://images.pexels.com/photos/7688191/pexels-photo-7688191.jpeg?auto=compress&cs=tinysrgb&w=1200"
    },
    {
        id: 3,
        title: "EXPENSE AUDIT",
        category: "Transparansi Kas & Bukti GDrive",
        description: "Buku kas terbuka dengan kuitansi verified multi-signature pengurus RT.",
        image: "https://images.pexels.com/photos/7821688/pexels-photo-7821688.jpeg?auto=compress&cs=tinysrgb&w=1200"
    },
    {
        id: 4,
        title: "AUTO SCHEDULER",
        category: "Pengingat & Jadwal Operasional",
        description: "Notifikasi armada truk sanitasi dan reminder iuran otomatis via WhatsApp & Web.",
        image: "https://images.pexels.com/photos/4980430/pexels-photo-4980430.jpeg?auto=compress&cs=tinysrgb&w=1200"
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
        <section id="features" ref={triggerRef} className="overflow-hidden bg-[#F0F2EB] relative">
            <div
                ref={sectionRef}
                className="h-screen flex items-center pl-12 md:pl-24 pr-16 md:pr-32 gap-12 md:gap-24 w-fit"
            >
                {/* Section Title Card */}
                <div className="flex-shrink-0 w-[340px] md:w-[420px]">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#D2DBC5] bg-[#607C3C]/10 text-[#607C3C] text-xs font-mono mb-4 tracking-wider uppercase font-semibold shadow-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#607C3C] animate-pulse"></span>
                        Solusi Klaster
                    </div>
                    <h2 className="text-6xl md:text-8xl font-extrabold text-[#192414] leading-tight">
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

                {/* 4 Core Features Cards - Full Image Photo Cards matching About style */}
                {projects.map((project, index) => (
                    <div
                        key={project.id}
                        className="flex-shrink-0 w-[80vw] max-w-[580px] h-[68vh] rounded-3xl overflow-hidden border border-[#D2DBC5] shadow-[0_18px_45px_rgba(45,60,30,0.12)] p-7 sm:p-10 flex flex-col justify-between group transition-all duration-500 hover:shadow-[0_24px_50px_rgba(45,60,30,0.22)] relative bg-[#1A2518]"
                    >
                        {/* Full-bleed background photo filling 100% of the card */}
                        <img
                            src={project.image}
                            alt={project.title}
                            className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                        />

                        {/* Deep Contrast Gradients for optimal readability */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/50 pointer-events-none" />

                        {/* Top Row: Card Number & Category Tag */}
                        <div className="relative z-10 flex items-center justify-between">
                            <span className="text-6xl sm:text-7xl font-extrabold text-white font-mono leading-none drop-shadow-md">
                                0{index + 1}
                            </span>
                            <span className="px-3.5 py-1.5 rounded-full text-xs font-bold text-white bg-white/20 backdrop-blur-md border border-white/30 drop-shadow-sm">
                                Klaster 05
                            </span>
                        </div>

                        {/* Bottom Row: Text Information */}
                        <div className="relative z-10 transform translate-y-1 group-hover:translate-y-0 transition-transform duration-500">
                            <p className="text-sm sm:text-base font-bold text-[#A4C978] drop-shadow-sm mb-1.5 uppercase tracking-wide">
                                {project.category}
                            </p>
                            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight drop-shadow-md mb-2">
                                {project.title}
                            </h3>
                            <p className="text-white/85 text-sm sm:text-base font-medium drop-shadow-sm leading-relaxed max-w-lg">
                                {project.description}
                            </p>
                        </div>
                    </div>
                ))}

                {/* Text Block Beside Card 04 */}
                <div className="flex-shrink-0 w-[400px] flex items-center justify-center">
                    <h3 className="text-4xl text-[#192414] font-bold text-center leading-snug">
                        Detailed <br /> Archive <br />
                        <span className="text-[#607C3C]">&rarr;</span>
                    </h3>
                </div>
            </div>
        </section>
    );
};

export default ProjectsHorizontal;
