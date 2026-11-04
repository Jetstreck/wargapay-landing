import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, ArrowLeft, CheckCircle2, ShieldCheck, Phone, Lock, Sparkles, Leaf, Check } from 'lucide-react';
import logoBrand from '../assets/logo-brand.jpg';

interface LoginPageProps {
    onBackToHome: () => void;
}

const PEXELS_PHOTO_URL = 'https://images.pexels.com/photos/7501440/pexels-photo-7501440.jpeg?auto=compress&cs=tinysrgb&w=1600';

const LoginPage: React.FC<LoginPageProps> = ({ onBackToHome }) => {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [loginSuccess, setLoginSuccess] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API login call
        setTimeout(() => {
            setIsLoading(false);
            setLoginSuccess(true);
            setTimeout(() => {
                setLoginSuccess(false);
            }, 3000);
        }, 1000);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed inset-0 z-[9999] w-screen h-screen bg-white overflow-y-auto lg:overflow-hidden flex flex-col lg:flex-row selection:bg-[#607C3C] selection:text-white"
        >
            {/* ================= LEFT COLUMN: High-Resolution Pexels Photo (50% Width, Full Bleed Edge-to-Edge) ================= */}
            <div className="w-full lg:w-1/2 h-80 sm:h-96 lg:h-full relative overflow-hidden flex flex-col justify-between p-6 sm:p-10 lg:p-14 shrink-0 bg-[#212E1B]">
                {/* Background Image from Pexels with smooth fade in */}
                <img
                    src={PEXELS_PHOTO_URL}
                    alt="Tiny small sprout in soft sunlight - Eco WargaPay"
                    onLoad={() => setImageLoaded(true)}
                    className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-700 ${imageLoaded ? 'scale-100 opacity-100 blur-0' : 'scale-105 opacity-0 blur-md'
                        }`}
                />

                {/* Black filter overlay in front of the image */}
                <div className="absolute inset-0 bg-black/55 z-0 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/40 z-0 pointer-events-none" />

                {/* Top Branding Overlay */}
                <div className="relative z-10 flex items-center justify-between w-full">
                    <button
                        type="button"
                        onClick={onBackToHome}
                        className="group inline-flex items-center gap-3.5 cursor-pointer text-left focus:outline-none"
                        title="Kembali ke Beranda"
                    >
                        <div className="w-12 h-12 rounded-2xl overflow-hidden border border-white/30 bg-white/95 backdrop-blur-md flex items-center justify-center p-1.5 shadow-lg group-hover:scale-105 group-hover:border-[#607C3C] transition-all duration-300">
                            <img
                                src={logoBrand}
                                alt="WargaPay Logo"
                                className="w-full h-full object-contain"
                            />
                        </div>
                        <div>
                            <span className="font-black text-2xl tracking-tight text-white drop-shadow-md">
                                Warga<span className="text-[#A4C978]">Pay</span>
                            </span>
                            <span className="block text-[10px] uppercase font-bold tracking-widest text-white/80">
                                Ekosistem Klaster & RT Digital
                            </span>
                        </div>
                    </button>

                    {/* Mobile Back Button */}
                    <button
                        type="button"
                        onClick={onBackToHome}
                        className="lg:hidden inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-white bg-white/20 backdrop-blur-md border border-white/30 cursor-pointer"
                    >
                        <ArrowLeft className="w-3.5 h-3.5 text-white" />
                        <span>Beranda</span>
                    </button>
                </div>

                {/* Bottom Headline & Glassmorphism Card */}
                <div className="relative z-10 pt-8">
                    {/* Eco Tag Badge */}
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight drop-shadow-md">
                        Selamat Datang kembali di WargaPay
                    </h2>
                    <p className="mt-2.5 text-xs sm:text-sm text-white/90 leading-relaxed max-w-lg drop-shadow-sm font-medium">
                        Transparansi Keuangan RT & Sanitasi Lingkungan dalam Satu Platform.
                    </p>
                </div>
            </div>

            {/* ================= RIGHT COLUMN: Form Login Side (50% Width, Pure White & Minimalist) ================= */}
            <div className="w-full lg:w-1/2 lg:h-full bg-[#FFFFFF] flex flex-col justify-between p-6 sm:p-10 lg:p-16 overflow-y-auto relative shrink-0">
                {/* Desktop Top Bar: Navigation to Return to Home */}
                <div className="flex items-center justify-between w-full mb-6">
                    <button
                        type="button"
                        onClick={onBackToHome}
                        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#5A6B52] hover:text-[#1A2518] bg-[#F7F9F5] hover:bg-[#EEF3EA] border border-[#E0E6D8] transition-all duration-200 cursor-pointer shadow-sm"
                    >
                        <ArrowLeft className="w-3.5 h-3.5 text-[#607C3C]" />
                        <span>Kembali ke Beranda</span>
                    </button>
                </div>

                {/* Centered Minimalist Form Container */}
                <div className="w-full max-w-md mx-auto my-auto py-4">
                    {/* Feedback Status Toast */}
                    <div className="min-h-[34px] mb-4">
                        <AnimatePresence>
                            {loginSuccess && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="p-3.5 rounded-xl bg-[#EDF5E8] border border-[#C5DCB6] flex items-center gap-3 text-xs text-[#3C5723] font-medium shadow-sm"
                                >
                                    <CheckCircle2 className="w-4 h-4 text-[#607C3C] shrink-0" />
                                    <span>Verifikasi data berhasil! Mengarahkan ke Dashboard Warga...</span>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Form Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl sm:text-4xl font-black text-[#1A2518] tracking-tight">
                            Masuk ke Akun Warga
                        </h1>
                        <p className="mt-2 text-sm text-[#5A6B52]">
                            Silakan masukkan NIK / No. HP dan kata sandi Anda.
                        </p>
                    </div>

                    {/* Form Fields */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Field 1: Nomor HP / Email Warga */}
                        <div>
                            <label
                                htmlFor="identifier"
                                className="block text-xs font-bold text-[#273623] mb-2 tracking-wide"
                            >
                                Nomor HP / Email Warga
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7E9374] group-focus-within:text-[#607C3C] transition-colors">
                                    <Phone className="w-4 h-4" />
                                </div>
                                <input
                                    id="identifier"
                                    type="text"
                                    required
                                    value={identifier}
                                    onChange={(e) => setIdentifier(e.target.value)}
                                    placeholder="Contoh: 081234567890 atau blok.a1@wargapay.id"
                                    className="w-full pl-10 pr-4 py-3.5 bg-[#FAFBF9] hover:bg-white text-sm text-[#1A2518] placeholder-[#95A58E] rounded-xl border border-[#D9E3D3] focus:border-[#607C3C] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#607C3C]/15 transition-all duration-200"
                                />
                            </div>
                        </div>

                        {/* Field 2: Kata Sandi with Toggle */}
                        <div>
                            <label
                                htmlFor="password"
                                className="block text-xs font-bold text-[#273623] mb-2 tracking-wide"
                            >
                                Kata Sandi
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7E9374] group-focus-within:text-[#607C3C] transition-colors">
                                    <Lock className="w-4 h-4" />
                                </div>
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Masukkan kata sandi"
                                    className="w-full pl-10 pr-11 py-3.5 bg-[#FAFBF9] hover:bg-white text-sm text-[#1A2518] placeholder-[#95A58E] rounded-xl border border-[#D9E3D3] focus:border-[#607C3C] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#607C3C]/15 transition-all duration-200"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#7E9374] hover:text-[#607C3C] focus:outline-none transition-colors cursor-pointer"
                                    aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-4 h-4" />
                                    ) : (
                                        <Eye className="w-4 h-4" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Utility Row: Ingat Saya & Lupa Kata Sandi */}
                        <div className="flex items-center justify-between pt-1">
                            <label className="flex items-center gap-2.5 cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="w-4 h-4 rounded text-[#607C3C] border-[#B9CBB1] focus:ring-[#607C3C]/30 accent-[#607C3C] cursor-pointer"
                                />
                                <span className="text-xs font-semibold text-[#465740]">
                                    Ingat Saya
                                </span>
                            </label>

                            <a
                                href="#lupa-kata-sandi"
                                onClick={(e) => {
                                    e.preventDefault();
                                    alert('Silakan hubungi Pengurus RT / Admin Paguyuban setempat untuk reset kata sandi akun warga.');
                                }}
                                className="text-xs font-bold text-[#607C3C] hover:text-[#4A612E] hover:underline transition-colors"
                            >
                                Lupa Kata Sandi?
                            </a>
                        </div>

                        {/* Primary CTA Button */}
                        <div className="pt-3">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-4 px-6 rounded-full bg-[#607C3C] hover:bg-[#4E6730] active:scale-[0.99] text-white text-sm font-bold tracking-wide shadow-[0_6px_22px_rgba(96,124,60,0.3)] hover:shadow-[0_8px_28px_rgba(96,124,60,0.45)] transition-all duration-300 flex items-center justify-center gap-2.5 disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        <span>Memverifikasi Data Warga...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Masuk ke Dashboard</span>
                                        <ArrowLeft className="w-4 h-4 rotate-180" />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Footer Help Text */}
                <div className="pt-6 border-t border-[#EEF2EB] text-center">
                    <p className="text-xs text-[#55694E]">
                        Belum terdaftar sebagai warga?{' '}
                        <button
                            type="button"
                            onClick={() => {
                                alert('Pendaftaran akun warga divalidasi oleh Pengurus RT setempat sesuai Kartu Keluarga (KK). Silakan hubungi Sekretariat RT Anda.');
                            }}
                            className="font-bold text-[#607C3C] hover:text-[#455A2B] hover:underline cursor-pointer"
                        >
                            Hubungi Pengurus RT.
                        </button>
                    </p>
                </div>
            </div>
        </motion.div>
    );
};

export default LoginPage;
