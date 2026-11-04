import { motion } from 'framer-motion';
import { useRef } from 'react';

const AboutSection = () => {
    const containerRef = useRef(null);

    return (
        <section ref={containerRef} className="min-h-screen py-24 px-4 md:px-12 bg-[#F4F6F0] relative overflow-hidden">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

                {/* Text Area */}
                <div className="space-y-8 z-10">
                    <motion.h2
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="text-5xl md:text-7xl font-extrabold text-[#1A2518] mb-8 leading-tight"
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
                                    className="px-5 py-2.5 bg-white border border-[#E0E6D8] rounded-full text-sm font-semibold text-[#607C3C] shadow-sm hover:border-[#607C3C] hover:bg-[#607C3C]/5 transition-all duration-300"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Visual/Abstract Area */}
                <div className="relative h-[600px] w-full flex items-center justify-center">
                    <motion.div
                        initial={{ scale: 0.8, rotate: -10, opacity: 0 }}
                        whileInView={{ scale: 1, rotate: 0, opacity: 1 }}
                        transition={{ duration: 1 }}
                        className="relative w-full h-full"
                    >
                        {/* Soft Eco Gradient Glow */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-96 bg-gradient-to-b from-[#607C3C]/15 to-[#85a359]/20 rounded-full blur-3xl animate-pulse"></div>
                        
                        {/* Pure White Card with Soft Green Border */}
                        <div className="absolute inset-0 bg-white border border-[#E0E6D8] rounded-3xl shadow-[0_12px_40px_rgba(96,124,60,0.08)] p-10 flex flex-col justify-between transform rotate-2 hover:rotate-0 transition-transform duration-500">
                            <div className="text-7xl font-extrabold text-[#607C3C]/15 font-mono">01</div>
                            <div className="text-right">
                                <span className="inline-block px-3 py-1 rounded-full bg-[#607C3C]/10 text-[#607C3C] text-xs font-bold font-mono tracking-wider mb-3">
                                    WARGAPAY STANDARD
                                </span>
                                <h3 className="text-3xl font-bold text-[#1A2518]">Sistem Transparan</h3>
                                <p className="text-[#5A6B52] mt-1 text-base">Akuntabel. Real-time. Terverifikasi.</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;