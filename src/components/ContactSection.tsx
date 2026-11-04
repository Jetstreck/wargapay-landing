import { motion } from 'framer-motion';
import logoBrand from '../assets/logo-brand.jpg';

const ContactSection = () => {
    return (
        <section id="contact" className="min-h-screen flex items-center justify-center bg-[#F4F6F0] relative overflow-hidden py-24">
            {/* Subtle Ambient Radial Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#607C3C]/10 via-[#F4F6F0] to-[#F4F6F0] pointer-events-none"></div>

            <div className="max-w-3xl w-full px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-6xl md:text-8xl font-extrabold text-[#1A2518] mb-6">
                        HUBUNGI <span className="text-[#607C3C]">PENGURUS</span>
                    </h2>
                    <p className="text-xl text-[#5A6B52]">
                        Punya pertanyaan atau ingin menerapkan WargaPay di klaster Anda? Kirim pesan ke pengurus.
                    </p>
                </motion.div>

                <motion.form
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="space-y-8 bg-white p-8 md:p-12 rounded-3xl border border-[#E0E6D8] shadow-[0_12px_45px_rgba(96,124,60,0.08)]"
                    onSubmit={(e) => {
                        e.preventDefault();
                        alert('Pesan berhasil terkirim ke pengurus klaster!');
                    }}
                >
                    <div className="group relative">
                        <input
                            type="text"
                            required
                            className="w-full bg-transparent border-b border-[#CBD5E1] py-4 text-xl text-[#1A2518] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#607C3C] transition-colors peer"
                            placeholder="Nama Warga / Blok No."
                        />
                        <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#607C3C] peer-focus:w-full transition-all duration-500"></div>
                    </div>

                    <div className="group relative">
                        <input
                            type="email"
                            required
                            className="w-full bg-transparent border-b border-[#CBD5E1] py-4 text-xl text-[#1A2518] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#607C3C] transition-colors peer"
                            placeholder="Email Aktif"
                        />
                        <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#607C3C] peer-focus:w-full transition-all duration-500"></div>
                    </div>

                    <div className="group relative">
                        <textarea
                            rows={4}
                            required
                            className="w-full bg-transparent border-b border-[#CBD5E1] py-4 text-xl text-[#1A2518] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#607C3C] transition-colors peer resize-none"
                            placeholder="Pesan atau Kendala Lingkungan"
                        />
                        <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#607C3C] peer-focus:w-full transition-all duration-500"></div>
                    </div>

                    <div className="flex justify-center mt-12">
                        <button
                            type="submit"
                            className="group relative px-12 py-4 bg-[#607C3C] text-white font-bold text-lg rounded-full overflow-hidden hover:bg-[#506832] hover:scale-105 transition-all duration-300 shadow-[0_6px_24px_rgba(96,124,60,0.35)] active:scale-95"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                KIRIM PESAN
                            </span>
                        </button>
                    </div>
                </motion.form>

                <footer className="mt-20 border-t border-[#E0E6D8] pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[#718096] text-sm font-mono">
                    <div className="flex items-center gap-2.5">
                        <div className="w-6 h-6 rounded-full overflow-hidden border border-[#E0E6D8] bg-white flex items-center justify-center p-0.5">
                            <img src={logoBrand} alt="WargaPay Logo" className="w-full h-full object-contain" />
                        </div>
                        <span><strong className="text-[#1A2518]">WARGAPAY</strong> &copy; 2026. SMART RESIDENT ECOSYSTEM.</span>
                    </div>
                    <div className="space-x-6">
                        <a href="#overview" className="hover:text-[#607C3C] transition-colors">PORTAL WARGA</a>
                        <a href="#features" className="hover:text-[#607C3C] transition-colors">PANDUAN RT</a>
                        <a href="#contact" className="hover:text-[#607C3C] transition-colors">BANTUAN</a>
                    </div>
                </footer>
            </div>
        </section>
    );
};

export default ContactSection;