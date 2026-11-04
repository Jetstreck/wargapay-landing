import { motion } from 'framer-motion';
import { useRef } from 'react';

const PEXELS_STREET_PHOTO = 'https://images.pexels.com/photos/27607950/pexels-photo-27607950.jpeg?auto=compress&cs=tinysrgb&w=1200';

const AboutSection = () => {
    const containerRef = useRef(null);

    return (
        <section ref={containerRef} className="min-h-screen py-24 px-4 md:px-12 bg-[#F0F2EB] relative overflow-hidden">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

                {/* Text Area */}
                <div className="space-y-8 z-10">
                    <motion.h2
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="text-5xl md:text-7xl font-extrabold text-[#192414] mb-8 leading-tight"
                    >
                        BUKAN SEKEDAR <br />
                        <span className="text-[#607C3C]">
                            IURAN.
                        </span>
                    </motion.h2>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="text-xl text-[#5A6B52] leading-relaxed space-y-6"
                    >
                        <p>
                            Pengelolaan lingkungan perumahan klaster kini beralih ke era digital. Mulai dari iuran sampah transparan hingga audit kas RT yang bisa diakses langsung oleh seluruh warga.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        viewport={{ once: true }}
                    >
                        <div className="flex flex-wrap gap-4 mt-8">
                            {['Smart Waste', 'Transparansi Kas', 'IPL Bulanan', 'Real-time API'].map((skill, index) => (
                                <span
                                    key={index}
                                    className="px-5 py-2.5 bg-white border border-[#D2DBC5] rounded-full text-sm font-semibold text-[#607C3C] shadow-[0_4px_16px_rgba(45,60,30,0.04)] hover:border-[#607C3C] hover:bg-[#607C3C]/5 transition-all duration-300"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Visual/Card Area (Full Photo Card) */}
                <div className="relative min-h-[580px] w-full flex items-center justify-center">
                    <motion.div
                        initial={{ scale: 0.85, rotate: -6, opacity: 0 }}
                        whileInView={{ scale: 1, rotate: 0, opacity: 1 }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        className="relative w-full h-[540px] sm:h-[580px]"
                    >
                        {/* Soft Eco Gradient Glow */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-[450px] bg-gradient-to-b from-[#607C3C]/15 to-[#85a359]/20 rounded-full blur-3xl animate-pulse" />

                        {/* Full Photo Card with Drop Shadow & Smooth Hover */}
                        <div className="relative w-full h-full rounded-3xl overflow-hidden border border-[#D2DBC5] shadow-[0_18px_45px_rgba(45,60,30,0.12)] p-7 sm:p-10 flex flex-col justify-between transform rotate-2 hover:rotate-0 transition-transform duration-500 group bg-[#1A2518]">
                            {/* Full-bleed background photo filling 100% of the card */}
                            <img
                                src={PEXELS_STREET_PHOTO}
                                alt="Pengelolaan Sampah & Kebersihan Lingkungan Klaster"
                                className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                            />

                            {/* Deep Contrast Gradients for optimal readability */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/55 pointer-events-none" />

                            {/* Top Row: Card Number & Badge */}
                            <div className="relative z-10 flex items-center justify-between">
                                <div className="text-6xl sm:text-7xl font-extrabold text-white font-mono leading-none drop-shadow-md">
                                    01
                                </div>
                            </div>

                            {/* Bottom Row: Text Information */}
                            <div className="relative z-10 text-right">
                                <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight drop-shadow-md">
                                    Pengelolaan Sampah
                                </h3>
                                <p className="text-white/85 mt-1 text-sm sm:text-base font-medium drop-shadow-sm">
                                    Transparan, Real-time, Terverifikasi.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;
