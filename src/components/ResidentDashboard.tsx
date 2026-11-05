import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    ChevronDown,
    ArrowRight,
    Star,
    FileText,
    LogOut,
    CheckCircle2,
    ShieldCheck,
    CreditCard,
    Vault,
    Truck,
    HelpCircle,
    Printer,
    Download,
    X,
    PhoneCall,
    ExternalLink,
    Recycle,
    AlertTriangle,
    Clock,
    UserCheck,
    CloudSun,
    QrCode,
    Loader2
} from 'lucide-react';
import logoBrand from '../assets/logo-brand.jpg';
import {
    getStoredUser,
    clearSession,
    apiGetDues,
    apiGetWeather,
    apiCreateTransaction,
    apiSimulatePayment,
    openMidtransSnap,
    DuesItem,
    WeatherData
} from '../services/api';

interface ResidentDashboardProps {
    onLogout?: () => void;
    onBackToHome?: () => void;
}

export const ResidentDashboard: React.FC<ResidentDashboardProps> = ({
    onLogout,
    onBackToHome
}) => {
    // 4 Distinct Pages: 'iuran' | 'kas' | 'jadwal' | 'bantuan'
    const [activeNav, setActiveNav] = useState<'iuran' | 'kas' | 'jadwal' | 'bantuan'>('iuran');
    
    // Search & Filter state
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('Semua');
    const [statusFilter, setStatusFilter] = useState('Semua');
    const [clusterFilter, setClusterFilter] = useState('Cluster 05');

    // Modals & Feedback
    const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);
    const [selectedExpense, setSelectedExpense] = useState<any | null>(null);
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [isPaying, setIsPaying] = useState(false);

    // Current User & Weather state
    const [currentUser] = useState(() => getStoredUser() || { name: 'Bpk. Budi Santoso', email: 'budi@wargapay.id', role: 'user' });
    const [weatherInfo, setWeatherInfo] = useState<WeatherData | null>(null);

    const showToast = (msg: string) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 3000);
    };

    // Load backend data
    const fetchDuesFromBackend = async () => {
        try {
            const data = await apiGetDues();
            if (data && data.length > 0) {
                const formatted = data.map((d: DuesItem) => ({
                    id: `IPL-${d.period}`,
                    rawId: d.id,
                    title: `IPL Periode ${d.period}`,
                    tag: d.status === 'paid' ? 'LUNAS' : 'Belum Bayar',
                    status: d.status === 'paid' ? 'LUNAS' : 'BELUM LUNAS',
                    rawStatus: d.status,
                    amount: `Rp ${d.total.toLocaleString('id-ID')}`,
                    badgeBg: d.status === 'paid'
                        ? 'bg-[#EDF5E8] text-[#2F611E] border border-[#C5DCB6]'
                        : 'bg-[#FFF3E0] text-[#E65100] border border-[#FFE0B2]',
                    details: `Rincian: Keamanan Rp ${(d.security_fee / 1000).toFixed(0)}k, Kebersihan Rp ${(d.waste_fee / 1000).toFixed(0)}k, Kas RT Rp ${(d.rt_fund / 1000).toFixed(0)}k`,
                    isFavorite: false,
                    isCurrent: d.status === 'unpaid',
                }));
                setBillItems(formatted);
            }
        } catch (e) {
            console.log('Menggunakan data lokal iuran:', e);
        }
    };

    useEffect(() => {
        fetchDuesFromBackend();

        // Load Weather
        apiGetWeather(-6.2088, 106.8456).then((w) => {
            if (w) setWeatherInfo(w);
        });
    }, []);

    // Payment Handlers (Midtrans Snap with QRIS)
    const handlePayMidtrans = async (bill: any) => {
        try {
            setIsPaying(true);
            showToast('Menghubungkan ke Midtrans Snap...');
            const tx = await apiCreateTransaction({
                type: 'dues',
                dues_id: bill.rawId || 1,
            });

            openMidtransSnap(tx.snap_token || '', tx.snap_redirect_url, {
                onSuccess: () => {
                    showToast('Pembayaran Midtrans Berhasil!');
                    fetchDuesFromBackend();
                    setSelectedInvoice(null);
                },
                onPending: () => {
                    showToast('Menunggu pembayaran QRIS / Bank Transfer.');
                    fetchDuesFromBackend();
                },
                onError: () => {
                    showToast('Pembayaran gagal atau dibatalkan.');
                },
                onClose: () => {
                    showToast('Jendela pembayaran ditutup.');
                },
            });
        } catch (err: any) {
            showToast(err.message || 'Gagal memulai transaksi Midtrans.');
        } finally {
            setIsPaying(false);
        }
    };

    const handleSimulateInstantPay = async (bill: any) => {
        try {
            setIsPaying(true);
            const tx = await apiCreateTransaction({
                type: 'dues',
                dues_id: bill.rawId || 1,
            });
            await apiSimulatePayment(tx.id);
            showToast('Simulasi Berhasil! Status tagihan lunas.');
            await fetchDuesFromBackend();
            setSelectedInvoice(null);
        } catch (err: any) {
            showToast(err.message || 'Gagal simulasi pembayaran.');
        } finally {
            setIsPaying(false);
        }
    };

    // ==========================================
    // DATA 1: IURAN & TAGIHAN WARGA
    // ==========================================
    const [billItems, setBillItems] = useState([
        {
            id: 'IPL-2024-10',
            title: 'IPL Periode Oktober 2024',
            tag: 'Tagihan Berjalan',
            status: 'LUNAS',
            amount: 'Rp 450.000',
            badgeBg: 'bg-[#EDF5E8] text-[#2F611E] border border-[#C5DCB6]',
            details: 'Metode: BCA Auto Debit (Virtual Account) | Rincian: Keamanan Rp200k, Kebersihan Rp150k, Kas RT Rp100k',
            isFavorite: true,
            isCurrent: true
        },
        {
            id: 'IPL-2024-09',
            title: 'IPL Periode September 2024',
            tag: 'Bulan Lalu',
            status: 'LUNAS',
            amount: 'Rp 450.000',
            badgeBg: 'bg-[#EDF5E8] text-[#2F611E] border border-[#C5DCB6]',
            details: 'Metode: BCA Auto Debit (Virtual Account) | Rincian: Keamanan Rp200k, Kebersihan Rp150k, Kas RT Rp100k',
            isFavorite: false,
            isCurrent: false
        },
        {
            id: 'IPL-2024-08',
            title: 'IPL Periode Agustus 2024',
            tag: 'Arsip Riwayat',
            status: 'LUNAS',
            amount: 'Rp 450.000',
            badgeBg: 'bg-[#EDF5E8] text-[#2F611E] border border-[#C5DCB6]',
            details: 'Metode: BCA Auto Debit (Virtual Account) | Rincian: Keamanan Rp200k, Kebersihan Rp150k, Kas RT Rp100k',
            isFavorite: false,
            isCurrent: false
        }
    ]);

    // ==========================================
    // DATA 2: KAS RT & PENGELUARAN (MUTASI)
    // ==========================================
    const expenseItems = [
        {
            id: 'EXP-01',
            title: 'Gaji 4 Petugas Satpam & Komandan Regu',
            vendor: 'PT Satria Guard Nusantara',
            category: 'Keamanan',
            date: '02 Okt 2024',
            amount: 'Rp 14.000.000',
            receiptNo: 'RCP-SGN-1004',
            details: 'Penggajian rutin 4 personel sekuriti 24/7 dan operasional pos jaga utama',
            signedBy: ['Bpk. Hendra (Ketua RT)', 'Ibu Dewi (Bendahara)', 'Bpk. Budi (Warga B-12)']
        },
        {
            id: 'EXP-02',
            title: 'Pengangkutan Sampah RT & Retribusi TPA',
            vendor: 'DLH Kota & Armada Mandiri',
            category: 'Kebersihan',
            date: '01 Okt 2024',
            amount: 'Rp 4.250.000',
            receiptNo: 'RCP-DLH-0922',
            details: 'Biaya operasional armada truk sampah 3x seminggu dan retribusi TPA dinas',
            signedBy: ['Bpk. Hendra (Ketua RT)', 'Ibu Dewi (Bendahara)']
        },
        {
            id: 'EXP-03',
            title: 'Perbaikan Lampu PJU Gang 3 & Sensor Otomatis',
            vendor: 'CV Sinar Terang Elektrik',
            category: 'Infrastruktur',
            date: '28 Sep 2024',
            amount: 'Rp 1.850.000',
            receiptNo: 'RCP-STE-8831',
            details: 'Penggantian 6 unit bohlam LED PJU 50W dan photocell otomatis gang Blok B',
            signedBy: ['Bpk. Hendra (Ketua RT)', 'Ibu Dewi (Bendahara)', 'Bpk. Agus (Seksi Pembangunan)']
        },
        {
            id: 'EXP-04',
            title: 'Fogging Massal Pencegahan DBD Blok A - E',
            vendor: 'Puskesmas & Tim Sanitasi Swadaya',
            category: 'Sanitasi',
            date: '25 Sep 2024',
            amount: 'Rp 1.200.000',
            receiptNo: 'RCP-SAN-7712',
            details: 'Pengasapan insektisida got dan pekarangan seluruh cluster antisipasi musim hujan',
            signedBy: ['Bpk. Hendra (Ketua RT)', 'Ibu Dewi (Bendahara)']
        },
        {
            id: 'EXP-05',
            title: 'Pengadaan APAR Baru Pos Satpam Utama',
            vendor: 'Toko Proteksi Graha Prima',
            category: 'Keselamatan',
            date: '20 Sep 2024',
            amount: 'Rp 950.000',
            receiptNo: 'RCP-PGP-4401',
            details: 'Pengadaan tabung APAR powder 6kg untuk kesiapsiagaan kebakaran pos induk',
            signedBy: ['Bpk. Hendra (Ketua RT)', 'Ibu Dewi (Bendahara)']
        }
    ];

    // ==========================================
    // DATA 3: JADWAL & SANITASI SAMPAH
    // ==========================================
    const wasteSchedules = [
        {
            id: 'SCH-01',
            type: 'Sampah Organik',
            subtitle: 'Sisa Dapur, Daun, Ranting & Sisa Makanan',
            schedule: 'Senin, Rabu, dan Jumat (06:30 - 08:30 WITA)',
            destination: 'Rumah Kompos Cluster 05 & Pakan Maggot Binaan RT',
            guidelines: 'Gunakan kantong terikat rapi atau ember tertutup di depan pagar.',
            badge: 'Diolah Mandiri',
            color: 'text-[#2F611E] bg-[#EDF5E8] border-[#C5DCB6]'
        },
        {
            id: 'SCH-02',
            type: 'Sampah Anorganik',
            subtitle: 'Kardus, Botol Plastik, Kaleng, Botol Kaca',
            schedule: 'Selasa dan Sabtu (07:00 - 09:00 WITA)',
            destination: 'Bank Sampah Warga Berdaya Cluster 05',
            guidelines: 'Keringkan dan pipihkan kardus/botol sebelum dimasukkan kantong.',
            badge: 'Daur Ulang (Nilai Ekonomi)',
            color: 'text-[#245D99] bg-[#E7F0FA] border-[#BBD5EE]'
        },
        {
            id: 'SCH-03',
            type: 'E-Waste & Limbah B3',
            subtitle: 'Baterai Bekas, Lampu TL, Aki, Obat Kadaluarsa',
            schedule: 'Sabtu Pertama & Ketiga Setiap Bulan (08:00 - 11:00 WITA)',
            destination: 'Mitra Pengolah Bahan Berbahaya DLH Kota',
            guidelines: 'Letakkan di dropbox khusus B3 di samping Pos Satpam Utama.',
            badge: 'Penanganan Khusus',
            color: 'text-[#A6461D] bg-[#FDF0E9] border-[#F5CEBA]'
        }
    ];

    // ==========================================
    // DATA 4: KONTAK RT & LAYANAN DARURAT
    // ==========================================
    const contactList = [
        {
            id: 'CT-01',
            name: 'Bpk. Hendra Wijaya',
            role: 'Ketua RT 05 Cluster Diamond',
            unit: 'Blok A No. 05',
            phone: '0811-2233-4455',
            availability: '08:00 - 20:00 WITA',
            scope: 'Kebijakan lingkungan, izin renovasi rumah, pengesahan dokumen kependudukan',
            isEmergency: false
        },
        {
            id: 'CT-02',
            name: 'Ibu Ratna Susanti',
            role: 'Sekretaris RT 05',
            unit: 'Blok B No. 02',
            phone: '0812-3456-7890',
            availability: 'Siaga Cepat (07:30 - 21:00 WITA)',
            scope: 'Administrasi warga, surat pengantar domisili, data iuran IPL & pengaduan',
            isEmergency: false
        },
        {
            id: 'CT-03',
            name: 'Pos Satpam Induk Blok B',
            role: 'Koordinator Regu Keamanan 24 Jam',
            unit: 'Gerbang Utama Cluster',
            phone: '0813-9988-7766 (Intercom 05-01)',
            availability: 'Siaga 24/7 (Non-stop)',
            scope: 'Patroli malam, buka-tutup portal, tamu menginap & penerimaan paket darurat',
            isEmergency: true
        },
        {
            id: 'CT-04',
            name: 'Ambulans & Puskesmas Siaga RT',
            role: 'Tanggap Darurat Medis Cluster',
            unit: 'Hotline Terintegrasi PSC 119',
            phone: '119 / (0361) 223344',
            availability: '24 Jam Darurat',
            scope: 'Evakuasi medis warga, rujukan darurat RSUD, pertolongan pertama (P3K)',
            isEmergency: true
        }
    ];

    const toggleFavorite = (id: string) => {
        setBillItems(prev => prev.map(item => {
            if (item.id === id) {
                const nextFav = !item.isFavorite;
                showToast(nextFav ? `${item.title} ditandai sebagai favorit` : `Favorit ${item.title} dihapus`);
                return { ...item, isFavorite: nextFav };
            }
            return item;
        }));
    };

    // Filter bills
    const filteredBills = billItems.filter(b => 
        b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.details.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Filter expenses
    const filteredExpenses = expenseItems.filter(e =>
        e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.vendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="fixed inset-0 z-50 w-full h-full bg-white text-[#192414] flex flex-col md:flex-row overflow-hidden font-sans antialiased selection:bg-[#607C3C] selection:text-white">
            
            {/* Notification Toast */}
            <AnimatePresence>
                {toastMessage && (
                    <motion.div
                        initial={{ opacity: 0, y: -15, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -15, scale: 0.95 }}
                        className="fixed top-6 right-6 z-[120] bg-white border border-[#D2DBC5] shadow-xl rounded-2xl px-4 py-3 flex items-center gap-3"
                    >
                        <div className="w-7 h-7 rounded-lg bg-[#EDF5E8] text-[#607C3C] flex items-center justify-center">
                            <CheckCircle2 className="w-4 h-4" />
                        </div>
                        <p className="text-xs font-bold text-[#192414]">{toastMessage}</p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* =========================================================================
                1. SLIM MINIMALIST SIDEBAR (Full-height edge-to-edge)
               ========================================================================= */}
            <aside className="w-full md:w-[96px] h-auto md:h-screen shrink-0 bg-white border-b md:border-b-0 md:border-r border-[#E5EBDD] flex md:flex-col items-center justify-between p-4 md:py-8 md:px-3 z-20">
                
                {/* Top: Geometric Brand Logo */}
                <div className="flex flex-col items-center gap-1">
                    <button
                        type="button"
                        onClick={onBackToHome}
                        className="w-12 h-12 rounded-2xl bg-[#F0F2EB] hover:bg-[#E4EBDC] transition-colors flex items-center justify-center border border-[#D2DBC5] cursor-pointer group"
                        title="Kembali ke Beranda"
                    >
                        <img
                            src={logoBrand}
                            alt="WargaPay"
                            className="w-7 h-7 object-contain rounded-full group-hover:scale-105 transition-transform"
                        />
                    </button>
                </div>

                {/* Middle: Icon Nav Items with tiny labels underneath */}
                <nav className="flex md:flex-col items-center gap-2 sm:gap-4 my-auto">
                    
                    {/* Menu 1: Iuran */}
                    <button
                        type="button"
                        onClick={() => {
                            setActiveNav('iuran');
                            setSearchQuery('');
                        }}
                        className="flex flex-col items-center gap-1.5 p-2 group cursor-pointer focus:outline-none"
                    >
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                            activeNav === 'iuran'
                                ? 'bg-[#EAF1E4] text-[#607C3C] shadow-xs'
                                : 'text-[#7A8A70] hover:text-[#192414] hover:bg-[#F4F6F1]'
                        }`}>
                            <CreditCard className="w-5 h-5 stroke-[2.2]" />
                        </div>
                        <span className={`text-[10px] font-bold tracking-tight transition-colors ${
                            activeNav === 'iuran' ? 'text-[#607C3C]' : 'text-[#7A8A70]'
                        }`}>
                            Iuran
                        </span>
                    </button>

                    {/* Menu 2: Kas RT */}
                    <button
                        type="button"
                        onClick={() => {
                            setActiveNav('kas');
                            setSearchQuery('');
                        }}
                        className="flex flex-col items-center gap-1.5 p-2 group cursor-pointer focus:outline-none"
                    >
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                            activeNav === 'kas'
                                ? 'bg-[#EAF1E4] text-[#607C3C] shadow-xs'
                                : 'text-[#7A8A70] hover:text-[#192414] hover:bg-[#F4F6F1]'
                        }`}>
                            <Vault className="w-5 h-5 stroke-[2.2]" />
                        </div>
                        <span className={`text-[10px] font-bold tracking-tight transition-colors ${
                            activeNav === 'kas' ? 'text-[#607C3C]' : 'text-[#7A8A70]'
                        }`}>
                            Kas RT
                        </span>
                    </button>

                    {/* Menu 3: Sanitasi */}
                    <button
                        type="button"
                        onClick={() => {
                            setActiveNav('jadwal');
                            setSearchQuery('');
                        }}
                        className="flex flex-col items-center gap-1.5 p-2 group cursor-pointer focus:outline-none"
                    >
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                            activeNav === 'jadwal'
                                ? 'bg-[#EAF1E4] text-[#607C3C] shadow-xs'
                                : 'text-[#7A8A70] hover:text-[#192414] hover:bg-[#F4F6F1]'
                        }`}>
                            <Truck className="w-5 h-5 stroke-[2.2]" />
                        </div>
                        <span className={`text-[10px] font-bold tracking-tight transition-colors ${
                            activeNav === 'jadwal' ? 'text-[#607C3C]' : 'text-[#7A8A70]'
                        }`}>
                            Sanitasi
                        </span>
                    </button>

                    {/* Menu 4: Kontak RT */}
                    <button
                        type="button"
                        onClick={() => {
                            setActiveNav('bantuan');
                            setSearchQuery('');
                        }}
                        className="flex flex-col items-center gap-1.5 p-2 group cursor-pointer focus:outline-none"
                    >
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                            activeNav === 'bantuan'
                                ? 'bg-[#EAF1E4] text-[#607C3C] shadow-xs'
                                : 'text-[#7A8A70] hover:text-[#192414] hover:bg-[#F4F6F1]'
                        }`}>
                            <HelpCircle className="w-5 h-5 stroke-[2.2]" />
                        </div>
                        <span className={`text-[10px] font-bold tracking-tight transition-colors ${
                            activeNav === 'bantuan' ? 'text-[#607C3C]' : 'text-[#7A8A70]'
                        }`}>
                            Kontak RT
                        </span>
                    </button>

                </nav>

                {/* Bottom: Resident Profile Avatar + Options */}
                <div className="flex flex-col items-center gap-2">
                    <div
                        className="relative group cursor-pointer"
                        title="Bpk. Budi - Blok B No. 12"
                        onClick={() => showToast('Akun Warga: Bpk. Budi (Unit B-12) Terverifikasi')}
                    >
                        <div className="w-10 h-10 rounded-full bg-[#607C3C] text-white font-extrabold text-xs flex items-center justify-center shadow-xs border border-[#4F6830]">
                            BB
                        </div>
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#2DA84E] border-2 border-white rounded-full" />
                    </div>

                    {onLogout && (
                        <button
                            type="button"
                            onClick={() => {
                                clearSession();
                                onLogout();
                            }}
                            className="text-[#A2B199] hover:text-[#B33939] transition-colors p-1 cursor-pointer"
                            title="Keluar dari Dashboard"
                        >
                            <LogOut className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </aside>

            {/* =========================================================================
                2. MAIN CONTENT AREA (Takes remaining full screen width & height)
               ========================================================================= */}
            <main className="flex-1 h-screen overflow-y-auto p-6 sm:p-10 lg:p-12 flex flex-col justify-between space-y-9">
                
                {/* -------------------------------------------------------------
                    TOP FILTER BAR (Neatly aligned at the top)
                   ------------------------------------------------------------- */}
                <div className="space-y-2">
                    <h2 className="text-xs font-bold text-[#7A8A70] uppercase tracking-wider">
                        {activeNav === 'iuran' && 'Pencarian & Filter Iuran'}
                        {activeNav === 'kas' && 'Pencarian & Filter Mutasi Kas'}
                        {activeNav === 'jadwal' && 'Pencarian & Kategori Sampah'}
                        {activeNav === 'bantuan' && 'Pencarian Kontak & Layanan RT'}
                    </h2>

                    <div className="flex flex-col lg:flex-row items-stretch lg:items-end gap-3 pt-1">
                        {/* Search Input Box */}
                        <div className="flex-1 min-w-[240px]">
                            <label className="text-[11px] font-bold text-[#7A8A70] block mb-1.5">
                                {activeNav === 'iuran' && 'Cari riwayat tagihan atau metode...'}
                                {activeNav === 'kas' && 'Cari deskripsi mutasi atau vendor...'}
                                {activeNav === 'jadwal' && 'Cari jenis sampah atau ketentuan...'}
                                {activeNav === 'bantuan' && 'Cari nama pengurus atau layanan darurat...'}
                            </label>
                            <div className="relative">
                                <Search className="w-4 h-4 text-[#8FA284] absolute left-3.5 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder={
                                        activeNav === 'iuran' ? 'Cari tagihan, periode, atau nominal...' :
                                        activeNav === 'kas' ? 'Cari pengeluaran, vendor, nomor kuitansi...' :
                                        activeNav === 'jadwal' ? 'Cari sampah organik, kardus, baterai...' :
                                        'Cari nama pengurus, nomor telepon, satpam...'
                                    }
                                    className="w-full bg-[#F5F6F2] hover:bg-[#EEF1EB] focus:bg-white text-xs font-semibold text-[#192414] placeholder-[#9AA992] pl-10 pr-4 py-2.5 rounded-xl border border-transparent focus:border-[#607C3C] focus:outline-none transition-all"
                                />
                            </div>
                        </div>

                        {/* Dropdown 1: Kategori */}
                        <div className="w-full sm:w-36">
                            <label className="text-[11px] font-bold text-[#7A8A70] block mb-1.5">
                                Kategori
                            </label>
                            <div className="relative">
                                <select
                                    value={categoryFilter}
                                    onChange={(e) => setCategoryFilter(e.target.value)}
                                    className="w-full appearance-none bg-[#F5F6F2] text-xs font-semibold text-[#192414] py-2.5 pl-3.5 pr-8 rounded-xl border border-transparent hover:bg-[#EEF1EB] focus:border-[#607C3C] focus:outline-none cursor-pointer"
                                >
                                    <option value="Semua">Semua</option>
                                    {activeNav === 'iuran' && (
                                        <>
                                            <option value="IPL">IPL Bulanan</option>
                                            <option value="Kas">Kas RT</option>
                                        </>
                                    )}
                                    {activeNav === 'kas' && (
                                        <>
                                            <option value="Keamanan">Keamanan</option>
                                            <option value="Kebersihan">Kebersihan</option>
                                            <option value="Infrastruktur">Infrastruktur</option>
                                        </>
                                    )}
                                    {activeNav === 'jadwal' && (
                                        <>
                                            <option value="Organik">Organik</option>
                                            <option value="Anorganik">Anorganik</option>
                                            <option value="B3">E-Waste & B3</option>
                                        </>
                                    )}
                                    {activeNav === 'bantuan' && (
                                        <>
                                            <option value="Inti">Pengurus Inti</option>
                                            <option value="Keamanan">Keamanan</option>
                                            <option value="Darurat">Layanan Darurat</option>
                                        </>
                                    )}
                                </select>
                                <ChevronDown className="w-3.5 h-3.5 text-[#7A8A70] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                            </div>
                        </div>

                        {/* Dropdown 2: Status */}
                        <div className="w-full sm:w-36">
                            <label className="text-[11px] font-bold text-[#7A8A70] block mb-1.5">
                                Status
                            </label>
                            <div className="relative">
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="w-full appearance-none bg-[#F5F6F2] text-xs font-semibold text-[#192414] py-2.5 pl-3.5 pr-8 rounded-xl border border-transparent hover:bg-[#EEF1EB] focus:border-[#607C3C] focus:outline-none cursor-pointer"
                                >
                                    <option value="Semua">Semua</option>
                                    <option value="Lunas">Lunas (Terverifikasi)</option>
                                    <option value="Aktif">Aktif / Siaga</option>
                                </select>
                                <ChevronDown className="w-3.5 h-3.5 text-[#7A8A70] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                            </div>
                        </div>

                        {/* Dropdown 3: Unit / Cluster */}
                        <div className="w-full sm:w-44">
                            <label className="text-[11px] font-bold text-[#7A8A70] block mb-1.5">
                                Wilayah
                            </label>
                            <div className="relative">
                                <select
                                    value={clusterFilter}
                                    onChange={(e) => setClusterFilter(e.target.value)}
                                    className="w-full appearance-none bg-[#F5F6F2] text-xs font-semibold text-[#192414] py-2.5 pl-3.5 pr-8 rounded-xl border border-transparent hover:bg-[#EEF1EB] focus:border-[#607C3C] focus:outline-none cursor-pointer"
                                >
                                    <option value="Cluster 05">Cluster 05 (B-12)</option>
                                    <option value="RT 05">RT 05 / RW 08</option>
                                </select>
                                <ChevronDown className="w-3.5 h-3.5 text-[#7A8A70] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                            </div>
                        </div>

                        {/* Right Dark Button CTA */}
                        <div className="self-end">
                            <button
                                type="button"
                                onClick={() => {
                                    if (activeNav === 'iuran') setSelectedInvoice(billItems[0]);
                                    else if (activeNav === 'kas') showToast('Mengunduh salinan Laporan Keuangan Kas RT 05...');
                                    else if (activeNav === 'jadwal') showToast('Jadwal sanitasi: Truk tiba pukul 06:30 WITA');
                                    else showToast('Menghubungkan ke Pos Satpam Utama...');
                                }}
                                className="w-full sm:w-auto h-[40px] px-6 rounded-xl bg-[#1A331E] hover:bg-[#25442A] active:scale-98 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs whitespace-nowrap"
                            >
                                <span>
                                    {activeNav === 'iuran' && 'Invoice PDF'}
                                    {activeNav === 'kas' && 'Laporan Kas PDF'}
                                    {activeNav === 'jadwal' && 'Panduan Pilah'}
                                    {activeNav === 'bantuan' && 'Panggil Satpam'}
                                </span>
                                <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Weather Banner Widget from Backend OpenWeather */}
                {weatherInfo && (
                    <div className="p-3.5 px-5 rounded-2xl bg-gradient-to-r from-[#EDF5E8] via-[#E2ECD9] to-[#F3F7EF] border border-[#CADBBD] flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-2xs">
                        <div className="flex items-center gap-3 text-[#213418]">
                            <div className="w-8 h-8 rounded-xl bg-[#607C3C]/15 flex items-center justify-center text-[#607C3C] shrink-0">
                                <CloudSun className="w-4 h-4" />
                            </div>
                            <div className="text-xs">
                                <span className="font-black text-[#1A2518]">{weatherInfo.location}</span>
                                <span className="text-[#647959] ml-1.5">
                                    • {weatherInfo.temperature.toFixed(1)}°C, {weatherInfo.description} (Kelembapan {weatherInfo.humidity}%)
                                </span>
                            </div>
                        </div>
                        <span className="text-[10px] font-bold text-[#455C2C] bg-white/80 px-2.5 py-1 rounded-lg border border-[#CADBBD] self-start sm:self-auto">
                            Status TPS: Aman & Siap Operasional
                        </span>
                    </div>
                )}

                {/* -------------------------------------------------------------
                    PAGE 1: IURAN & TAGIHAN WARGA
                   ------------------------------------------------------------- */}
                {activeNav === 'iuran' && (
                    <div className="flex-1 space-y-4">
                        <div className="flex items-center justify-between pb-1 border-b border-[#F0F3EC]">
                            <div className="flex items-center gap-2.5">
                                <h3 className="text-lg sm:text-xl font-black text-[#192414] tracking-tight">
                                    Riwayat & Tagihan Iuran Warga
                                </h3>
                                <span className="text-xs font-bold text-[#607C3C] bg-[#EDF5E8] px-2.5 py-1 rounded-md border border-[#C5DCB6]">
                                    Blok B No. 12
                                </span>
                            </div>
                            <span className="text-xs text-[#7A8A70] font-semibold hidden sm:inline">
                                Total {filteredBills.length} Periode Tercatat
                            </span>
                        </div>

                        <div className="space-y-3.5">
                            {filteredBills.map((bill) => (
                                <div
                                    key={bill.id}
                                    onClick={() => setSelectedInvoice(bill)}
                                    className={`w-full p-5 sm:p-6 rounded-2xl bg-white border transition-all duration-200 cursor-pointer group flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                                        bill.isCurrent
                                            ? 'border-[#BBD0A9] shadow-[0_6px_20px_rgba(96,124,60,0.06)] hover:border-[#607C3C]'
                                            : 'border-[#E5EBDD] hover:border-[#C6D4BA] hover:shadow-[0_4px_16px_rgba(0,0,0,0.03)]'
                                    }`}
                                >
                                    <div className="flex items-start sm:items-center gap-4 min-w-0">
                                        <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center shrink-0 border transition-colors ${
                                            bill.isCurrent
                                                ? 'bg-[#EAF1E4] border-[#CADBBD] text-[#607C3C]'
                                                : 'bg-[#F4F6F1] border-[#EAEFE5] text-[#7A8A70] group-hover:text-[#607C3C]'
                                        }`}>
                                            <CreditCard className="w-6 h-6 stroke-[2]" />
                                        </div>

                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-extrabold text-sm sm:text-base text-[#192414] group-hover:text-[#607C3C] transition-colors">
                                                    {bill.title}
                                                </h4>
                                                <span className="text-[10px] font-bold text-[#7A8A70] bg-[#F5F6F2] px-2 py-0.5 rounded">
                                                    {bill.tag}
                                                </span>
                                            </div>
                                            <p className="text-xs text-[#6E7F65] font-medium mt-1 leading-relaxed">
                                                {bill.details}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between md:justify-end gap-3 sm:gap-4 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-[#F5F7F2]">
                                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${bill.badgeBg}`}>
                                            <CheckCircle2 className="w-3.5 h-3.5 text-[#607C3C]" />
                                            {bill.status}
                                        </span>

                                        <div className="text-right">
                                            <div className="text-base sm:text-lg font-black text-[#192414] tracking-tight">
                                                {bill.amount}
                                            </div>
                                        </div>

                                        {bill.status !== 'LUNAS' && (
                                            <button
                                                type="button"
                                                disabled={isPaying}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handlePayMidtrans(bill);
                                                }}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#607C3C] hover:bg-[#4E6830] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                                                title="Bayar langsung via Midtrans QRIS / Virtual Account"
                                            >
                                                <QrCode className="w-3.5 h-3.5" />
                                                <span>Bayar (QR)</span>
                                            </button>
                                        )}

                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedInvoice(bill);
                                            }}
                                            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F5F7F2] hover:bg-[#607C3C] text-[#607C3C] hover:text-white border border-[#D5DFC9] text-xs font-bold transition-all shadow-2xs"
                                            title="Unduh Invoice PDF"
                                        >
                                            <Download className="w-3.5 h-3.5" />
                                            <span>Invoice</span>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleFavorite(bill.id);
                                            }}
                                            className="p-1.5 text-[#9DB094] hover:text-[#607C3C] transition-colors rounded-lg hover:bg-[#F5F6F2]"
                                            aria-label="Simpan favorit"
                                        >
                                            <Star className={`w-4 h-4 ${bill.isFavorite ? 'fill-[#607C3C] text-[#607C3C]' : ''}`} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* -------------------------------------------------------------
                    PAGE 2: KAS RT (TRANSPARANSI KAS & PENGELUARAN)
                   ------------------------------------------------------------- */}
                {activeNav === 'kas' && (
                    <div className="flex-1 space-y-5">
                        {/* Summary Header Banner */}
                        <div className="p-5 sm:p-6 rounded-2xl bg-[#F6F8F3] border border-[#D8E2D0] flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#607C3C] flex items-center gap-1.5">
                                    <Vault className="w-3.5 h-3.5" />
                                    Saldo Kas Bersama RT 05
                                </span>
                                <h3 className="text-2xl sm:text-3xl font-black text-[#192414] tracking-tight mt-1">
                                    Rp 42.500.000
                                </h3>
                                <p className="text-xs text-[#6E7F65] font-semibold mt-0.5">
                                    Rekening Giro Penampung BCA: 778-901-2345 a.n. Kas Paguyuban RT 05
                                </p>
                            </div>
                            <div className="flex flex-wrap items-center gap-3">
                                <div className="px-3 py-1.5 rounded-xl bg-white border border-[#D5DFC9] text-xs">
                                    <span className="text-[#7A8A70]">Pertumbuhan:</span>{' '}
                                    <strong className="text-[#2F611E]">+12.4%</strong> vs bulan lalu
                                </div>
                                <div className="px-3 py-1.5 rounded-xl bg-white border border-[#D5DFC9] text-xs">
                                    <span className="text-[#7A8A70]">Kepatuhan IPL:</span>{' '}
                                    <strong className="text-[#607C3C]">88%</strong> (38 dari 43 Unit)
                                </div>
                            </div>
                        </div>

                        {/* Expense Audit List Header */}
                        <div className="flex items-center justify-between pb-1 border-b border-[#F0F3EC]">
                            <div className="flex items-center gap-2.5">
                                <h3 className="text-lg sm:text-xl font-black text-[#192414] tracking-tight">
                                    Buku Kas & Pengeluaran Terverifikasi
                                </h3>
                                <span className="text-xs font-bold text-[#607C3C] bg-[#EDF5E8] px-2.5 py-1 rounded-md border border-[#C5DCB6]">
                                    Audit Multi-Sig 3 Kunci
                                </span>
                            </div>
                            <span className="text-xs text-[#7A8A70] font-semibold hidden sm:inline">
                                Terbuka untuk seluruh warga
                            </span>
                        </div>

                        {/* Vertical Stack: Expense Items */}
                        <div className="space-y-3.5">
                            {filteredExpenses.map((expense) => (
                                <div
                                    key={expense.id}
                                    onClick={() => setSelectedExpense(expense)}
                                    className="w-full p-5 sm:p-6 rounded-2xl bg-white border border-[#E5EBDD] hover:border-[#607C3C]/50 hover:shadow-[0_4px_16px_rgba(0,0,0,0.03)] transition-all duration-200 cursor-pointer group flex flex-col md:flex-row md:items-center justify-between gap-4"
                                >
                                    <div className="flex items-start sm:items-center gap-4 min-w-0">
                                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#F4F6F1] border border-[#EAEFE5] flex items-center justify-center text-[#607C3C] shrink-0 group-hover:scale-105 transition-transform">
                                            <Vault className="w-6 h-6 stroke-[2]" />
                                        </div>
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-extrabold text-sm sm:text-base text-[#192414] group-hover:text-[#607C3C] transition-colors">
                                                    {expense.title}
                                                </h4>
                                                <span className="text-[10px] font-bold text-[#607C3C] bg-[#EDF5E8] px-2 py-0.5 rounded border border-[#C5DCB6]">
                                                    {expense.category}
                                                </span>
                                            </div>
                                            <p className="text-xs text-[#6E7F65] font-medium mt-1">
                                                Vendor: <strong>{expense.vendor}</strong> • Tanggal: {expense.date}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between md:justify-end gap-3 sm:gap-4 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-[#F5F7F2]">
                                        <div className="text-right">
                                            <span className="text-[10px] uppercase font-bold text-[#7A8A70] block">Nominal Pencairan</span>
                                            <span className="text-base sm:text-lg font-black text-[#192414]">
                                                {expense.amount}
                                            </span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedExpense(expense);
                                            }}
                                            className="px-3.5 py-2 rounded-xl bg-[#EDF5E8] hover:bg-[#607C3C] text-[#366822] hover:text-white border border-[#C5DCB6] text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5"
                                        >
                                            <ShieldCheck className="w-3.5 h-3.5" />
                                            <span>Bukti Kuitansi</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* -------------------------------------------------------------
                    PAGE 3: SANITASI (JADWAL & PENGANGKUTAN SAMPAH)
                   ------------------------------------------------------------- */}
                {activeNav === 'jadwal' && (
                    <div className="flex-1 space-y-5">
                        {/* Upcoming Pickup Banner */}
                        <div className="p-5 sm:p-6 rounded-2xl bg-[#F6F8F3] border border-[#D8E2D0] flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-start gap-3.5">
                                <div className="w-12 h-12 rounded-2xl bg-[#607C3C] text-white flex items-center justify-center shrink-0 shadow-xs">
                                    <Clock className="w-6 h-6" />
                                </div>
                                <div>
                                    <span className="text-[10px] font-black uppercase tracking-wider text-[#607C3C]">
                                        Jadwal Pengangkutan Terdekat
                                    </span>
                                    <h4 className="text-lg sm:text-xl font-extrabold text-[#192414] mt-0.5">
                                        Besok Pagi, 04 Okt 2024 (06:30 - 08:30 WITA)
                                    </h4>
                                    <p className="text-xs text-[#6E7F65] font-semibold mt-0.5">
                                        Armada Truk RT 05 • Pastikan sampah di depan pagar sebelum pukul 06:00 WITA.
                                    </p>
                                </div>
                            </div>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black bg-[#EDF5E8] text-[#2F611E] border border-[#C5DCB6] self-start md:self-auto">
                                <CheckCircle2 className="w-3.5 h-3.5 text-[#607C3C]" />
                                Armada Siap Operasi
                            </span>
                        </div>

                        {/* Waste Categories Vertical Stack */}
                        <div className="flex items-center justify-between pb-1 border-b border-[#F0F3EC]">
                            <h3 className="text-lg sm:text-xl font-black text-[#192414] tracking-tight">
                                Ketentuan & Alur Sampah Terpilah
                            </h3>
                            <span className="text-xs text-[#7A8A70] font-semibold hidden sm:inline">
                                Berkelanjutan & Ramah Lingkungan
                            </span>
                        </div>

                        <div className="space-y-3.5">
                            {wasteSchedules.map((waste) => (
                                <div
                                    key={waste.id}
                                    className="w-full p-5 sm:p-6 rounded-2xl bg-white border border-[#E5EBDD] hover:border-[#607C3C]/50 hover:shadow-[0_4px_16px_rgba(0,0,0,0.03)] transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                                >
                                    <div className="flex items-start sm:items-center gap-4 min-w-0">
                                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#F4F6F1] border border-[#EAEFE5] flex items-center justify-center text-[#607C3C] shrink-0">
                                            <Recycle className="w-6 h-6 stroke-[2]" />
                                        </div>
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-extrabold text-sm sm:text-base text-[#192414]">
                                                    {waste.type}
                                                </h4>
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${waste.color}`}>
                                                    {waste.badge}
                                                </span>
                                            </div>
                                            <p className="text-xs text-[#192414] font-semibold mt-0.5">
                                                Jadwal: {waste.schedule}
                                            </p>
                                            <p className="text-xs text-[#6E7F65] font-medium mt-0.5">
                                                {waste.guidelines}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-[#F5F7F2]">
                                        <span className="text-[11px] text-[#7A8A70] block">Tujuan Pengolahan:</span>
                                        <span className="text-xs font-bold text-[#192414]">
                                            {waste.destination}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* -------------------------------------------------------------
                    PAGE 4: KONTAK RT & LAYANAN DARURAT
                   ------------------------------------------------------------- */}
                {activeNav === 'bantuan' && (
                    <div className="flex-1 space-y-5">
                        <div className="flex items-center justify-between pb-1 border-b border-[#F0F3EC]">
                            <div className="flex items-center gap-2.5">
                                <h3 className="text-lg sm:text-xl font-black text-[#192414] tracking-tight">
                                    Hotline Pengurus & Layanan Darurat RT 05
                                </h3>
                                <span className="text-xs font-bold text-[#607C3C] bg-[#EDF5E8] px-2.5 py-1 rounded-md border border-[#C5DCB6]">
                                    Siaga Responsif
                                </span>
                            </div>
                            <span className="text-xs text-[#7A8A70] font-semibold hidden sm:inline">
                                Bantuan cepat warga cluster
                            </span>
                        </div>

                        <div className="space-y-3.5">
                            {contactList.map((contact) => (
                                <div
                                    key={contact.id}
                                    className={`w-full p-5 sm:p-6 rounded-2xl bg-white border transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                                        contact.isEmergency
                                            ? 'border-[#E8C5BC] shadow-[0_4px_16px_rgba(180,60,40,0.04)]'
                                            : 'border-[#E5EBDD] hover:border-[#607C3C]/50'
                                    }`}
                                >
                                    <div className="flex items-start sm:items-center gap-4 min-w-0">
                                        <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center shrink-0 border ${
                                            contact.isEmergency
                                                ? 'bg-[#FDF0E9] border-[#F5CEBA] text-[#A6461D]'
                                                : 'bg-[#F4F6F1] border-[#EAEFE5] text-[#607C3C]'
                                        }`}>
                                            {contact.isEmergency ? <AlertTriangle className="w-6 h-6" /> : <UserCheck className="w-6 h-6" />}
                                        </div>

                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-extrabold text-sm sm:text-base text-[#192414]">
                                                    {contact.name}
                                                </h4>
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                                                    contact.isEmergency
                                                        ? 'bg-[#FDF0E9] text-[#A6461D] border-[#F5CEBA]'
                                                        : 'bg-[#EDF5E8] text-[#2F611E] border-[#C5DCB6]'
                                                }`}>
                                                    {contact.role}
                                                </span>
                                            </div>
                                            <p className="text-xs text-[#6E7F65] font-medium mt-1">
                                                Lokasi: <strong>{contact.unit}</strong> • Ketersediaan: {contact.availability}
                                            </p>
                                            <p className="text-[11px] text-[#7A8A70] mt-0.5">
                                                Lingkup: {contact.scope}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-[#F5F7F2]">
                                        <a
                                            href={`https://wa.me/6281234567890?text=Halo%20${encodeURIComponent(contact.name)}%2C%20saya%20Bpk.%20Budi%20Unit%20B-12`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="px-4 py-2 rounded-xl bg-[#607C3C] hover:bg-[#4E6730] text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-colors"
                                        >
                                            <PhoneCall className="w-3.5 h-3.5" />
                                            <span>Hubungi</span>
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* -------------------------------------------------------------
                    3. FOOTER BAR (Clean system sync status left, navigation links right)
                   ------------------------------------------------------------- */}
                <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-[#7A8A70] border-t border-[#F0F3EC]">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#2DA84E] animate-pulse" />
                        <span>Sistem Kas RT 05 Online & Sinkronisasi Real-Time</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            type="button"
                            onClick={onBackToHome}
                            className="font-bold text-[#607C3C] hover:underline cursor-pointer"
                        >
                            Kembali ke Beranda
                        </button>
                        <span>•</span>
                        <span className="font-medium text-[#192414]">Unit B-12 (Bpk. Budi)</span>
                    </div>
                </div>

                {/* Weather Banner Widget from Backend OpenWeather */}
                {weatherInfo && (
                    <div className="p-3.5 px-5 rounded-2xl bg-gradient-to-r from-[#EDF5E8] via-[#E2ECD9] to-[#F3F7EF] border border-[#CADBBD] flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-2xs">
                        <div className="flex items-center gap-3 text-[#213418]">
                            <div className="w-8 h-8 rounded-xl bg-[#607C3C]/15 flex items-center justify-center text-[#607C3C] shrink-0">
                                <CloudSun className="w-4 h-4" />
                            </div>
                            <div className="text-xs">
                                <span className="font-black text-[#1A2518]">{weatherInfo.location}</span>
                                <span className="text-[#647959] ml-1.5">
                                    • {weatherInfo.temperature.toFixed(1)}°C, {weatherInfo.description} (Kelembapan {weatherInfo.humidity}%)
                                </span>
                            </div>
                        </div>
                        <span className="text-[10px] font-bold text-[#455C2C] bg-white/80 px-2.5 py-1 rounded-lg border border-[#CADBBD] self-start sm:self-auto">
                            Status TPS: Aman & Siap Operasional
                        </span>
                    </div>
                )}

            </main>

            {/* =========================================================================
                MODAL 1: INVOICE PREVIEW MODAL
               ========================================================================= */}
            <AnimatePresence>
                {selectedInvoice && (
                    <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.96 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.96 }}
                            className="bg-white rounded-3xl max-w-md w-full border border-[#D2DBC5] shadow-2xl p-6 sm:p-7 relative"
                        >
                            <button
                                type="button"
                                onClick={() => setSelectedInvoice(null)}
                                className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-[#F0F2EB] text-[#7A8A70] transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>

                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-10 h-10 rounded-xl bg-[#EDF5E8] text-[#607C3C] flex items-center justify-center font-bold">
                                    <FileText className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-black text-base text-[#192414] leading-tight">
                                        Bukti Pembayaran IPL
                                    </h3>
                                    <p className="text-[11px] text-[#7A8A70]">
                                        {selectedInvoice.title}
                                    </p>
                                </div>
                            </div>

                            <div className="p-4 rounded-2xl bg-[#F7F8F4] border border-[#E3EBD9] space-y-2.5 text-xs">
                                <div className="flex justify-between">
                                    <span className="text-[#7A8A70]">Warga / Unit:</span>
                                    <span className="font-bold text-[#192414]">{currentUser.name} (Cluster 05)</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[#7A8A70]">Status Tagihan:</span>
                                    <span className={`font-bold px-2.5 py-0.5 rounded text-[11px] ${
                                        selectedInvoice.status === 'LUNAS'
                                            ? 'text-[#2F611E] bg-[#EDF5E8] border border-[#C5DCB6]'
                                            : 'text-[#E65100] bg-[#FFF3E0] border border-[#FFE0B2]'
                                    }`}>
                                        {selectedInvoice.status}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[#7A8A70]">Rincian Alokasi:</span>
                                    <span className="font-medium text-[#192414] text-right text-[11px]">
                                        {selectedInvoice.details}
                                    </span>
                                </div>
                                <div className="pt-2 border-t border-[#E3EBD9] flex justify-between items-center text-sm font-black text-[#192414]">
                                    <span>Total Nominal:</span>
                                    <span className="text-[#607C3C] text-base">{selectedInvoice.amount}</span>
                                </div>
                            </div>

                            {/* Payment Actions if UNPAID */}
                            {selectedInvoice.status !== 'LUNAS' && selectedInvoice.rawStatus !== 'paid' ? (
                                <div className="mt-4 space-y-2">
                                    <button
                                        type="button"
                                        disabled={isPaying}
                                        onClick={() => handlePayMidtrans(selectedInvoice)}
                                        className="w-full py-3 px-4 rounded-xl bg-[#607C3C] hover:bg-[#4E6830] active:scale-[0.99] text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-50"
                                    >
                                        {isPaying ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                <span>Membuka Midtrans...</span>
                                            </>
                                        ) : (
                                            <>
                                                <QrCode className="w-4 h-4" />
                                                <span>Bayar Sekarang (Midtrans QRIS / Transfer)</span>
                                            </>
                                        )}
                                    </button>
                                    <button
                                        type="button"
                                        disabled={isPaying}
                                        onClick={() => handleSimulateInstantPay(selectedInvoice)}
                                        className="w-full py-2.5 px-3 rounded-xl bg-[#F0F2EB] hover:bg-[#E2E8D8] text-[#3B4F25] font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                                    >
                                        <CheckCircle2 className="w-3.5 h-3.5 text-[#607C3C]" />
                                        <span>Simulasi Bayar Instan (Sandbox Demo)</span>
                                    </button>
                                </div>
                            ) : null}

                            <div className="mt-5 flex items-center justify-end gap-2.5">
                                <button
                                    type="button"
                                    onClick={() => setSelectedInvoice(null)}
                                    className="px-4 py-2 rounded-xl text-xs font-bold text-[#7A8A70] hover:bg-[#F0F2EB] transition-colors cursor-pointer"
                                >
                                    Tutup
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        window.print();
                                        setSelectedInvoice(null);
                                    }}
                                    className="px-4 py-2 rounded-xl bg-[#1A331E] hover:bg-[#25442A] text-xs font-bold text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                                >
                                    <Printer className="w-3.5 h-3.5" />
                                    <span>Cetak PDF</span>
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* =========================================================================
                MODAL 2: EXPENSE RECEIPT MODAL (KAS RT)
               ========================================================================= */}
            <AnimatePresence>
                {selectedExpense && (
                    <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.96 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.96 }}
                            className="bg-white rounded-3xl max-w-md w-full border border-[#D2DBC5] shadow-2xl p-6 sm:p-7 relative"
                        >
                            <button
                                type="button"
                                onClick={() => setSelectedExpense(null)}
                                className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-[#F0F2EB] text-[#7A8A70] transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>

                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-10 h-10 rounded-xl bg-[#EDF5E8] text-[#607C3C] flex items-center justify-center font-bold">
                                    <ShieldCheck className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-black text-base text-[#192414] leading-tight">
                                        Bukti Pengeluaran Kas RT
                                    </h3>
                                    <p className="text-[11px] text-[#7A8A70]">
                                        Dokumen: {selectedExpense.receiptNo}
                                    </p>
                                </div>
                            </div>

                            <div className="p-4 rounded-2xl bg-[#F7F8F4] border border-[#E3EBD9] space-y-2.5 text-xs">
                                <div className="flex justify-between">
                                    <span className="text-[#7A8A70]">Kegiatan:</span>
                                    <span className="font-bold text-[#192414] text-right">{selectedExpense.title}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[#7A8A70]">Vendor:</span>
                                    <span className="font-bold text-[#192414]">{selectedExpense.vendor}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[#7A8A70]">Tanggal:</span>
                                    <span className="font-bold text-[#192414]">{selectedExpense.date}</span>
                                </div>
                                <div className="pt-2 border-t border-[#E3EBD9] flex justify-between items-center text-sm font-black text-[#192414]">
                                    <span>Nominal:</span>
                                    <span className="text-[#607C3C]">{selectedExpense.amount}</span>
                                </div>

                                <div className="pt-2">
                                    <span className="text-[11px] font-bold text-[#192414] block mb-1">
                                        Tanda Tangan Digital Multi-Sig:
                                    </span>
                                    <ul className="space-y-1">
                                        {selectedExpense.signedBy.map((signer: string, idx: number) => (
                                            <li key={idx} className="flex items-center gap-1.5 text-[11px] text-[#2F611E] font-medium">
                                                <CheckCircle2 className="w-3 h-3 text-[#607C3C]" />
                                                <span>{signer}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            <div className="mt-5 flex items-center justify-end gap-2.5">
                                <button
                                    type="button"
                                    onClick={() => setSelectedExpense(null)}
                                    className="px-4 py-2 rounded-xl text-xs font-bold text-[#7A8A70] hover:bg-[#F0F2EB] transition-colors"
                                >
                                    Tutup
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        showToast(`Mengunduh kuitansi PDF ${selectedExpense.receiptNo}...`);
                                        setSelectedExpense(null);
                                    }}
                                    className="px-4 py-2 rounded-xl bg-[#1A331E] hover:bg-[#25442A] text-xs font-bold text-white flex items-center gap-1.5 transition-colors"
                                >
                                    <ExternalLink className="w-3.5 h-3.5" />
                                    <span>Unduh Bukti</span>
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

        </div>
    );
};

export default ResidentDashboard;
