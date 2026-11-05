import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, ArrowLeft, Phone, Lock, User, UserPlus, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import logoBrand from '../assets/logo-brand.jpg';
import { apiLogin, apiRegister } from '../services/api';

interface LoginPageProps {
    onBackToHome: () => void;
    onLoginSuccess?: (role: 'resident' | 'admin') => void;
}

const PEXELS_PHOTO_URL = 'https://images.pexels.com/photos/7501440/pexels-photo-7501440.jpeg?auto=compress&cs=tinysrgb&w=1600';

const LoginPage: React.FC<LoginPageProps> = ({ onBackToHome, onLoginSuccess }) => {
    // Mode tab: 'login' | 'register'
    const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

    // Login State
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    // Register State
    const [regName, setRegName] = useState('');
    const [regEmail, setRegEmail] = useState('');
    const [regPassword, setRegPassword] = useState('');

    // UI Feedback
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [imageLoaded, setImageLoaded] = useState(false);

    // Submit Login
    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage(null);
        setSuccessMessage(null);
        setLoading(true);

        try {
            const res = await apiLogin(identifier.trim(), password);
            setLoading(false);
            const targetRole: 'resident' | 'admin' = res.data.role === 'admin' ? 'admin' : 'resident';
            if (onLoginSuccess) {
                onLoginSuccess(targetRole);
            }
        } catch (err: any) {
            setLoading(false);
            setErrorMessage(err.message || 'Gagal login. Periksa email dan kata sandi Anda.');
        }
    };

    // Submit Register
    const handleRegisterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage(null);
        setSuccessMessage(null);
        setLoading(true);

        try {
            await apiRegister(regName.trim(), regEmail.trim(), regPassword, 'user');
            setLoading(false);
            setSuccessMessage('Registrasi berhasil! Akun Anda siap digunakan. Silakan masuk.');
            // Pre-fill login credentials and switch to login tab
            setIdentifier(regEmail);
            setPassword(regPassword);
            setAuthMode('login');
        } catch (err: any) {
            setLoading(false);
            setErrorMessage(err.message || 'Gagal registrasi. Pastikan email belum pernah terdaftar.');
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed inset-0 z-[9999] w-screen h-screen bg-white overflow-y-auto lg:overflow-hidden flex flex-col lg:flex-row selection:bg-[#607C3C] selection:text-white"
        >
            {/* ================= LEFT COLUMN: High-Resolution Photo ================= */}
            <div className="w-full lg:w-1/2 h-80 sm:h-96 lg:h-full relative overflow-hidden flex flex-col justify-between p-6 sm:p-10 lg:p-14 shrink-0 bg-[#212E1B]">
                <img
                    src={PEXELS_PHOTO_URL}
                    alt="Tiny small sprout in soft sunlight - Eco WargaPay"
                    onLoad={() => setImageLoaded(true)}
                    className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-700 ${
                        imageLoaded ? 'scale-100 opacity-100 blur-0' : 'scale-105 opacity-0 blur-md'
                    }`}
                />

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
                            <img src={logoBrand} alt="WargaPay Logo" className="w-full h-full object-contain" />
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

                    <button
                        type="button"
                        onClick={onBackToHome}
                        className="lg:hidden inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-white bg-white/20 backdrop-blur-md border border-white/30 cursor-pointer"
                    >
                        <ArrowLeft className="w-3.5 h-3.5 text-white" />
                        <span>Beranda</span>
                    </button>
                </div>

                {/* Bottom Headline */}
                <div className="relative z-10 pt-8">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight drop-shadow-md">
                        {authMode === 'login' ? 'Selamat Datang di WargaPay' : 'Bergabung Bersama Warga Klaster'}
                    </h2>
                    <p className="mt-2.5 text-xs sm:text-sm text-white/90 leading-relaxed max-w-lg drop-shadow-sm font-medium">
                        Transparansi Keuangan RT & Sanitasi Lingkungan Terintegrasi Pembayaran Digital.
                    </p>
                </div>
            </div>

            {/* ================= RIGHT COLUMN: Form Side ================= */}
            <div className="w-full lg:w-1/2 lg:h-full bg-[#FFFFFF] flex flex-col justify-between p-6 sm:p-10 lg:p-16 overflow-y-auto relative shrink-0">
                <div className="flex items-center justify-between w-full mb-4">
                    <button
                        type="button"
                        onClick={onBackToHome}
                        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#5A6B52] hover:text-[#1A2518] bg-[#F7F9F5] hover:bg-[#EEF3EA] border border-[#E0E6D8] transition-all duration-200 cursor-pointer shadow-sm"
                    >
                        <ArrowLeft className="w-3.5 h-3.5 text-[#607C3C]" />
                        <span>Kembali ke Beranda</span>
                    </button>
                </div>

                <div className="w-full max-w-md mx-auto my-auto py-2">
                    {/* Mode Toggle (Masuk vs Daftar) */}
                    <div className="flex p-1 mb-6 rounded-2xl bg-[#EEF3EA] border border-[#D8E4D0]">
                        <button
                            type="button"
                            onClick={() => {
                                setAuthMode('login');
                                setErrorMessage(null);
                            }}
                            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                                authMode === 'login'
                                    ? 'bg-white text-[#212E1B] shadow-sm'
                                    : 'text-[#607C3C] hover:text-[#212E1B]'
                            }`}
                        >
                            Masuk (Login)
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setAuthMode('register');
                                setErrorMessage(null);
                            }}
                            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                                authMode === 'register'
                                    ? 'bg-white text-[#212E1B] shadow-sm'
                                    : 'text-[#607C3C] hover:text-[#212E1B]'
                            }`}
                        >
                            Daftar Akun Baru
                        </button>
                    </div>

                    {/* Notification Messages */}
                    {errorMessage && (
                        <div className="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-red-700 text-xs">
                            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                            <span className="leading-relaxed">{errorMessage}</span>
                        </div>
                    )}
                    {successMessage && (
                        <div className="mb-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-2.5 text-emerald-800 text-xs">
                            <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
                            <span className="leading-relaxed">{successMessage}</span>
                        </div>
                    )}

                    {authMode === 'login' ? (
                        /* ================= LOGIN FORM ================= */
                        <form onSubmit={handleLoginSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="identifier" className="block text-xs font-bold text-[#273623] mb-1.5">
                                        Email Akun
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7E9374]">
                                            <Phone className="w-4 h-4" />
                                        </div>
                                        <input
                                            id="identifier"
                                            type="email"
                                            required
                                            value={identifier}
                                            onChange={(e) => setIdentifier(e.target.value)}
                                            placeholder="budi@wargapay.id atau admin@wargapay.id"
                                            className="w-full pl-10 pr-4 py-3 bg-[#FAFBF9] hover:bg-white text-sm text-[#1A2518] rounded-xl border border-[#D9E3D3] focus:border-[#607C3C] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#607C3C]/15 transition-all"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="password" className="block text-xs font-bold text-[#273623] mb-1.5">
                                        Kata Sandi
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7E9374]">
                                            <Lock className="w-4 h-4" />
                                        </div>
                                        <input
                                            id="password"
                                            type={showPassword ? 'text' : 'password'}
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Masukkan kata sandi"
                                            className="w-full pl-10 pr-11 py-3 bg-[#FAFBF9] hover:bg-white text-sm text-[#1A2518] rounded-xl border border-[#D9E3D3] focus:border-[#607C3C] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#607C3C]/15 transition-all"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#7E9374] hover:text-[#607C3C] cursor-pointer"
                                        >
                                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-1">
                                    <label className="flex items-center gap-2 cursor-pointer select-none">
                                        <input
                                            type="checkbox"
                                            checked={rememberMe}
                                            onChange={(e) => setRememberMe(e.target.checked)}
                                            className="w-4 h-4 rounded text-[#607C3C] accent-[#607C3C]"
                                        />
                                        <span className="text-xs font-semibold text-[#465740]">Ingat Saya</span>
                                    </label>
                                    <span className="text-xs text-[#607C3C] hover:underline cursor-pointer">Lupa Sandi?</span>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3.5 px-4 bg-[#607C3C] hover:bg-[#4E6830] active:scale-[0.99] text-white font-bold text-sm rounded-xl shadow-md transition-all duration-200 cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            <span>Memverifikasi Akun...</span>
                                        </>
                                    ) : (
                                        <span>Masuk ke Dashboard</span>
                                    )}
                                </button>
                            </form>
                    ) : (
                        /* ================= REGISTER FORM ================= */
                        <form onSubmit={handleRegisterSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-[#273623] mb-1.5">Nama Lengkap</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7E9374]">
                                        <User className="w-4 h-4" />
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        value={regName}
                                        onChange={(e) => setRegName(e.target.value)}
                                        placeholder="Contoh: Ahmad Fauzi"
                                        className="w-full pl-10 pr-4 py-3 bg-[#FAFBF9] hover:bg-white text-sm text-[#1A2518] rounded-xl border border-[#D9E3D3] focus:border-[#607C3C] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#607C3C]/15 transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-[#273623] mb-1.5">Alamat Email</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7E9374]">
                                        <Phone className="w-4 h-4" />
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        value={regEmail}
                                        onChange={(e) => setRegEmail(e.target.value)}
                                        placeholder="nama@wargapay.id"
                                        className="w-full pl-10 pr-4 py-3 bg-[#FAFBF9] hover:bg-white text-sm text-[#1A2518] rounded-xl border border-[#D9E3D3] focus:border-[#607C3C] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#607C3C]/15 transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-[#273623] mb-1.5">Kata Sandi</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7E9374]">
                                        <Lock className="w-4 h-4" />
                                    </div>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        value={regPassword}
                                        onChange={(e) => setRegPassword(e.target.value)}
                                        placeholder="Minimal 6 karakter"
                                        className="w-full pl-10 pr-11 py-3 bg-[#FAFBF9] hover:bg-white text-sm text-[#1A2518] rounded-xl border border-[#D9E3D3] focus:border-[#607C3C] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#607C3C]/15 transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#7E9374] hover:text-[#607C3C] cursor-pointer"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            <div className="p-3 bg-[#F4F7F1] rounded-xl border border-[#DDE7D6] flex items-center gap-2.5">
                                <CheckCircle className="w-4 h-4 text-[#607C3C] shrink-0" />
                                <p className="text-[11px] text-[#475C3B] leading-relaxed">
                                    Pendaftaran akun baru otomatis terdaftar sebagai <strong>Warga Klaster</strong>. Akses Pengurus RT/Admin hanya dapat diberikan oleh Pengurus RT yang berwenang.
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full mt-2 py-3.5 px-4 bg-[#607C3C] hover:bg-[#4E6830] active:scale-[0.99] text-white font-bold text-sm rounded-xl shadow-md transition-all duration-200 cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>Mendaftarkan Akun...</span>
                                    </>
                                ) : (
                                    <>
                                        <UserPlus className="w-4 h-4" />
                                        <span>Daftar Akun Baru</span>
                                    </>
                                )}
                            </button>
                        </form>
                    )}
                </div>

                {/* Footer Help */}
                <div className="pt-4 border-t border-[#EEF2EB] text-center">
                    <p className="text-xs text-[#55694E]">
                        {authMode === 'login' ? (
                            <>
                                Belum punya akun?{' '}
                                <button
                                    type="button"
                                    onClick={() => setAuthMode('register')}
                                    className="font-bold text-[#607C3C] hover:underline cursor-pointer"
                                >
                                    Daftar sekarang.
                                </button>
                            </>
                        ) : (
                            <>
                                Sudah punya akun?{' '}
                                <button
                                    type="button"
                                    onClick={() => setAuthMode('login')}
                                    className="font-bold text-[#607C3C] hover:underline cursor-pointer"
                                >
                                    Masuk di sini.
                                </button>
                            </>
                        )}
                    </p>
                </div>
            </div>
        </motion.div>
    );
};

export default LoginPage;
