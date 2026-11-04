import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    CheckSquare,
    BookOpen,
    Truck,
    Users,
    Settings,
    PlusCircle,
    Search,
    ChevronDown,
    CheckCircle2,
    FileText,
    LogOut,
    Check,
    X,
    ExternalLink,
    Send,
    DollarSign,
    Layers,
    UserCheck,
    Save,
    Building2,
    Cloud
} from 'lucide-react';
import logoBrand from '../assets/logo-brand.jpg';

interface AdminDashboardProps {
    onLogout?: () => void;
    onBackToHome?: () => void;
    onSwitchToResident?: () => void;
}

interface VerificationItem {
    id: string;
    unit: string;
    resident: string;
    amount: string;
    method: string;
    status: 'AUTO VERIFIED' | 'BUTUH APPROVAL' | 'VERIFIED' | 'REJECTED';
    badgeClass: string;
    date: string;
    receiptRef: string;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
    onLogout,
    onBackToHome,
    onSwitchToResident
}) => {
    // 6 Distinct Pages
    const [activeNav, setActiveNav] = useState<
        'overview' | 'verifikasi' | 'buku-kas' | 'sanitasi' | 'warga' | 'settings'
    >('overview');

    // Filter & Search states
    const [searchQuery, setSearchQuery] = useState('');
    const [blockFilter, setBlockFilter] = useState('Semua');
    const [statusFilter, setStatusFilter] = useState('Semua');

    // Toast feedback
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    // Modals
    const [showExpenseModal, setShowExpenseModal] = useState(false);
    const [showBillModal, setShowBillModal] = useState(false);
    const [showBroadcastModal, setShowBroadcastModal] = useState(false);
    const [showAddResidentModal, setShowAddResidentModal] = useState(false);
    const [selectedProof, setSelectedProof] = useState<VerificationItem | null>(null);

    // Form inputs for modals
    const [newExpenseName, setNewExpenseName] = useState('');
    const [newExpenseAmount, setNewExpenseAmount] = useState('');
    const [newExpenseVendor, setNewExpenseVendor] = useState('');
    const [broadcastText, setBroadcastText] = useState(
        'Pemberitahuan Warga: Armada Truk Sampah RT 05 sedang beroperasi normal di Blok A - D. Mohon sampah diletakkan di depan pagar sebelum pukul 06:00 WITA.'
    );

    // New resident form inputs
    const [newUnit, setNewUnit] = useState('');
    const [newHead, setNewHead] = useState('');
    const [newPhone, setNewPhone] = useState('');
    const [newMembers, setNewMembers] = useState('3');

    const showToast = (msg: string) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 3000);
    };

    // ==========================================
    // DATA 1: Verifikasi IPL Warga
    // ==========================================
    const [verificationList, setVerificationList] = useState<VerificationItem[]>([
        {
            id: 'VER-001',
            unit: 'Blok B No. 12',
            resident: 'Bpk. Budi',
            amount: 'Rp 450.000',
            method: 'BCA VA Auto-Match',
            status: 'AUTO VERIFIED',
            badgeClass: 'bg-[#EDF5E8] text-[#2F611E] border border-[#C5DCB6]',
            date: '02 Okt 2024, 08:14 WITA',
            receiptRef: 'VA-BCA-99210-B12'
        },
        {
            id: 'VER-002',
            unit: 'Blok A No. 04',
            resident: 'Ibu Sisi',
            amount: 'Rp 450.000',
            method: 'Transfer Manual (Upload Struk)',
            status: 'BUTUH APPROVAL',
            badgeClass: 'bg-[#FFF8E7] text-[#9A6209] border border-[#F3DBA7]',
            date: '02 Okt 2024, 09:30 WITA',
            receiptRef: 'TRF-MAN-77218-A04'
        },
        {
            id: 'VER-003',
            unit: 'Blok C No. 08',
            resident: 'Bpk. Hendra',
            amount: 'Rp 450.000',
            method: 'Transfer Manual',
            status: 'BUTUH APPROVAL',
            badgeClass: 'bg-[#FFF8E7] text-[#9A6209] border border-[#F3DBA7]',
            date: '02 Okt 2024, 10:15 WITA',
            receiptRef: 'TRF-MAN-88390-C08'
        },
        {
            id: 'VER-004',
            unit: 'Blok B No. 03',
            resident: 'Ibu Maya',
            amount: 'Rp 450.000',
            method: 'BCA VA Auto-Match',
            status: 'AUTO VERIFIED',
            badgeClass: 'bg-[#EDF5E8] text-[#2F611E] border border-[#C5DCB6]',
            date: '01 Okt 2024, 14:20 WITA',
            receiptRef: 'VA-BCA-99210-B03'
        },
        {
            id: 'VER-005',
            unit: 'Blok A No. 09',
            resident: 'Bpk. Dani',
            amount: 'Rp 450.000',
            method: 'Transfer Manual',
            status: 'VERIFIED',
            badgeClass: 'bg-[#EDF5E8] text-[#2F611E] border border-[#C5DCB6]',
            date: '01 Okt 2024, 11:05 WITA',
            receiptRef: 'TRF-MAN-44102-A09'
        }
    ]);

    // ==========================================
    // DATA 2: Catatan Pengeluaran Kas RT
    // ==========================================
    const [expenseList, setExpenseList] = useState([
        {
            id: 'EXP-ADM-01',
            title: 'Gaji 4 Petugas Satpam (Oktober)',
            amount: 'Rp 14.000.000',
            vendor: 'PT Satria Guard',
            category: 'Keamanan',
            status: 'Bukti Nota Uploaded to GDrive',
            date: '02 Okt 2024',
            gdriveRef: 'GDrive/KasRT05/2024-10/Gaji-Satpam.pdf'
        },
        {
            id: 'EXP-ADM-02',
            title: 'Pengangkutan Sampah RT 05',
            amount: 'Rp 3.850.000',
            vendor: 'DLH / Mitra Swasta',
            category: 'Kebersihan',
            status: 'Verified',
            date: '01 Okt 2024',
            gdriveRef: 'GDrive/KasRT05/2024-10/Retribusi-Sampah.pdf'
        },
        {
            id: 'EXP-ADM-03',
            title: 'Perbaikan Lampu PJU Gang 3 & Sensor Otomatis',
            amount: 'Rp 1.850.000',
            vendor: 'CV Sinar Terang Elektrik',
            category: 'Infrastruktur',
            status: 'Bukti Nota Uploaded to GDrive',
            date: '28 Sep 2024',
            gdriveRef: 'GDrive/KasRT05/2024-09/PJU-Gang3.pdf'
        },
        {
            id: 'EXP-ADM-04',
            title: 'Fogging Massal DBD Blok A - E',
            amount: 'Rp 1.200.000',
            vendor: 'Puskesmas & Tim Sanitasi Swadaya',
            category: 'Sanitasi',
            status: 'Verified',
            date: '25 Sep 2024',
            gdriveRef: 'GDrive/KasRT05/2024-09/Fogging-DBD.pdf'
        },
        {
            id: 'EXP-ADM-05',
            title: 'Pengadaan APAR Baru Pos Satpam Utama',
            amount: 'Rp 950.000',
            vendor: 'Toko Proteksi Graha Prima',
            category: 'Keselamatan',
            status: 'Verified',
            date: '20 Sep 2024',
            gdriveRef: 'GDrive/KasRT05/2024-09/APAR-Satpam.pdf'
        }
    ]);

    // ==========================================
    // DATA 3: Data Warga & Hunian (43 Unit)
    // ==========================================
    const [residentList, setResidentList] = useState([
        {
            unit: 'Blok B No. 12',
            head: 'Bpk. Budi',
            members: 4,
            type: 'Pemilik Tetap',
            phone: '0812-3456-7890',
            iplStatus: 'LUNAS (Auto Debit)',
            statusClass: 'bg-[#EDF5E8] text-[#2F611E] border-[#C5DCB6]'
        },
        {
            unit: 'Blok A No. 04',
            head: 'Ibu Sisi',
            members: 3,
            type: 'Pemilik Tetap',
            phone: '0813-7766-5544',
            iplStatus: 'Menunggu Approval',
            statusClass: 'bg-[#FFF8E7] text-[#9A6209] border-[#F3DBA7]'
        },
        {
            unit: 'Blok C No. 08',
            head: 'Bpk. Hendra',
            members: 5,
            type: 'Pemilik Tetap',
            phone: '0812-9988-1122',
            iplStatus: 'Menunggu Approval',
            statusClass: 'bg-[#FFF8E7] text-[#9A6209] border-[#F3DBA7]'
        },
        {
            unit: 'Blok B No. 02',
            head: 'Ibu Ratna (Sekretaris RT)',
            members: 3,
            type: 'Pemilik Tetap',
            phone: '0812-3456-7890',
            iplStatus: 'LUNAS',
            statusClass: 'bg-[#EDF5E8] text-[#2F611E] border-[#C5DCB6]'
        },
        {
            unit: 'Blok A No. 05',
            head: 'Bpk. Hendra Wijaya (Ketua RT)',
            members: 4,
            type: 'Pemilik Tetap',
            phone: '0811-2233-4455',
            iplStatus: 'LUNAS',
            statusClass: 'bg-[#EDF5E8] text-[#2F611E] border-[#C5DCB6]'
        },
        {
            unit: 'Blok C No. 01',
            head: 'Pak Bambang (Bendahara RT)',
            members: 3,
            type: 'Pemilik Tetap',
            phone: '0812-5544-3322',
            iplStatus: 'LUNAS',
            statusClass: 'bg-[#EDF5E8] text-[#2F611E] border-[#C5DCB6]'
        },
        {
            unit: 'Blok B No. 07',
            head: 'Bpk. Agus Santoso',
            members: 4,
            type: 'Penyewa',
            phone: '0818-1234-5678',
            iplStatus: 'LUNAS',
            statusClass: 'bg-[#EDF5E8] text-[#2F611E] border-[#C5DCB6]'
        },
        {
            unit: 'Blok C No. 14',
            head: 'Bpk. Joko Susilo',
            members: 2,
            type: 'Pemilik Tetap',
            phone: '0819-8765-4321',
            iplStatus: 'Tertunggak 1 Bln',
            statusClass: 'bg-[#FDF0E9] text-[#A6461D] border-[#F5CEBA]'
        }
    ]);

    // Handle Approve / Reject
    const handleApprove = (id: string, resident: string) => {
        setVerificationList(prev =>
            prev.map(item =>
                item.id === id
                    ? {
                        ...item,
                        status: 'VERIFIED',
                        badgeClass: 'bg-[#EDF5E8] text-[#2F611E] border border-[#C5DCB6]'
                    }
                    : item
            )
        );
        showToast(`Pembayaran IPL ${resident} berhasil disetujui & tercatat di kas!`);
    };

    const handleReject = (id: string, resident: string) => {
        setVerificationList(prev =>
            prev.map(item =>
                item.id === id
                    ? {
                        ...item,
                        status: 'REJECTED',
                        badgeClass: 'bg-[#FDF0E9] text-[#A6461D] border border-[#F5CEBA]'
                    }
                    : item
            )
        );
        showToast(`Pembayaran IPL ${resident} ditolak. Notifikasi dikirimkan ke warga.`);
    };

    // Handle add expense
    const handleAddExpenseSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newExpenseName || !newExpenseAmount) return;

        const newEntry = {
            id: `EXP-ADM-${Date.now().toString().slice(-4)}`,
            title: newExpenseName,
            amount: newExpenseAmount.startsWith('Rp') ? newExpenseAmount : `Rp ${newExpenseAmount}`,
            vendor: newExpenseVendor || 'Vendor Lokal Swadaya',
            category: 'Operasional',
            status: 'Bukti Nota Uploaded to GDrive',
            date: 'Hari ini',
            gdriveRef: 'GDrive/KasRT05/2024-10/Nota-Baru.pdf'
        };

        setExpenseList([newEntry, ...expenseList]);
        setNewExpenseName('');
        setNewExpenseAmount('');
        setNewExpenseVendor('');
        setShowExpenseModal(false);
        showToast('Pengeluaran kas berhasil dicatat & disinkronisasi ke Google Drive RT 05');
    };

    // Handle add resident
    const handleAddResidentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newUnit || !newHead) return;

        const newResidentItem = {
            unit: newUnit,
            head: newHead,
            members: parseInt(newMembers, 10) || 3,
            type: 'Pemilik Tetap',
            phone: newPhone || '0812-0000-0000',
            iplStatus: 'Menunggu Tagihan',
            statusClass: 'bg-[#EDF5E8] text-[#2F611E] border-[#C5DCB6]'
        };

        setResidentList([newResidentItem, ...residentList]);
        setNewUnit('');
        setNewHead('');
        setNewPhone('');
        setShowAddResidentModal(false);
        showToast(`Data hunian ${newUnit} (${newHead}) berhasil ditambahkan ke direktori warga!`);
    };

    // Filter verification items
    const filteredVerifications = verificationList.filter(item => {
        const matchesQuery =
            item.unit.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.resident.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.receiptRef.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesBlock = blockFilter === 'Semua' || item.unit.includes(blockFilter);
        const matchesStatus =
            statusFilter === 'Semua' ||
            (statusFilter === 'Menunggu' && item.status === 'BUTUH APPROVAL') ||
            (statusFilter === 'Verified' && (item.status === 'AUTO VERIFIED' || item.status === 'VERIFIED'));

        return matchesQuery && matchesBlock && matchesStatus;
    });

    // Filter resident list
    const filteredResidents = residentList.filter(item => {
        const matchesQuery =
            item.unit.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.head.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.phone.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesBlock = blockFilter === 'Semua' || item.unit.includes(blockFilter);
        return matchesQuery && matchesBlock;
    });

    // Pending count
    const pendingCount = verificationList.filter(v => v.status === 'BUTUH APPROVAL').length;

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
                1. LEFT SIDEBAR NAVIGATION (Admin Mode - Fixed Width, Full-Height)
               ========================================================================= */}
            <aside className="w-full md:w-64 lg:w-72 h-auto md:h-screen shrink-0 bg-white border-b md:border-b-0 md:border-r border-[#E5EBDD] flex flex-col justify-between p-5 md:p-6 z-20 overflow-y-auto">
                <div>
                    {/* Top Brand: WargaPay logo badge with "ADMIN WORKSPACE - RT 05" tag */}
                    <div className="flex items-center gap-3 pb-6 border-b border-[#F0F3EC]">
                        <button
                            type="button"
                            onClick={onBackToHome}
                            className="w-11 h-11 rounded-2xl bg-[#F0F2EB] hover:bg-[#E4EBDC] transition-colors flex items-center justify-center border border-[#D2DBC5] cursor-pointer group"
                            title="Kembali ke Beranda"
                        >
                            <img
                                src={logoBrand}
                                alt="WargaPay"
                                className="w-6 h-6 object-contain rounded-full group-hover:scale-105 transition-transform"
                            />
                        </button>
                        <div>
                            <div className="flex items-center gap-1.5">
                                <span className="font-black text-lg tracking-tight text-[#192414]">
                                    Warga<span className="text-[#607C3C]">Pay</span>
                                </span>
                            </div>
                            <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider text-[#607C3C] bg-[#EDF5E8] px-2 py-0.5 rounded-md border border-[#C5DCB6]">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#607C3C] animate-pulse" />
                                Admin Workspace - RT 05
                            </span>
                        </div>
                    </div>

                    {/* Navigation Menu Items (6 Distinct Pages) */}
                    <nav className="mt-6 space-y-1.5">
                        <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-[#7A8A70] mb-2">
                            Menu Administrasi
                        </p>

                        {/* 1. Overview & Stats */}
                        <button
                            type="button"
                            onClick={() => {
                                setActiveNav('overview');
                                setSearchQuery('');
                            }}
                            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${activeNav === 'overview'
                                    ? 'bg-[#607C3C] text-white shadow-xs'
                                    : 'text-[#7A8A70] hover:text-[#192414] hover:bg-[#F4F6F1]'
                                }`}
                        >
                            <LayoutDashboard className="w-4 h-4" />
                            <span>Overview & Stats</span>
                        </button>

                        {/* 2. Verifikasi IPL */}
                        <button
                            type="button"
                            onClick={() => {
                                setActiveNav('verifikasi');
                                setSearchQuery('');
                            }}
                            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${activeNav === 'verifikasi'
                                    ? 'bg-[#607C3C] text-white shadow-xs'
                                    : 'text-[#7A8A70] hover:text-[#192414] hover:bg-[#F4F6F1]'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <CheckSquare className="w-4 h-4" />
                                <span>Verifikasi IPL</span>
                            </div>
                            {pendingCount > 0 && (
                                <span className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded-full ${activeNav === 'verifikasi' ? 'bg-white text-[#607C3C]' : 'bg-[#FFF8E7] text-[#9A6209]'
                                    }`}>
                                    {pendingCount} Pending
                                </span>
                            )}
                        </button>

                        {/* 3. Buku Kas & Pengeluaran */}
                        <button
                            type="button"
                            onClick={() => {
                                setActiveNav('buku-kas');
                                setSearchQuery('');
                            }}
                            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${activeNav === 'buku-kas'
                                    ? 'bg-[#607C3C] text-white shadow-xs'
                                    : 'text-[#7A8A70] hover:text-[#192414] hover:bg-[#F4F6F1]'
                                }`}
                        >
                            <BookOpen className="w-4 h-4" />
                            <span>Buku Kas & Pengeluaran</span>
                        </button>

                        {/* 4. Operational & Schedule */}
                        <button
                            type="button"
                            onClick={() => {
                                setActiveNav('sanitasi');
                                setSearchQuery('');
                            }}
                            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${activeNav === 'sanitasi'
                                    ? 'bg-[#607C3C] text-white shadow-xs'
                                    : 'text-[#7A8A70] hover:text-[#192414] hover:bg-[#F4F6F1]'
                                }`}
                        >
                            <Truck className="w-4 h-4" />
                            <span>Operational & Schedule</span>
                        </button>

                        {/* 5. Data Warga & Hunian */}
                        <button
                            type="button"
                            onClick={() => {
                                setActiveNav('warga');
                                setSearchQuery('');
                            }}
                            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${activeNav === 'warga'
                                    ? 'bg-[#607C3C] text-white shadow-xs'
                                    : 'text-[#7A8A70] hover:text-[#192414] hover:bg-[#F4F6F1]'
                                }`}
                        >
                            <Users className="w-4 h-4" />
                            <span>Data Warga & Hunian</span>
                        </button>

                        {/* 6. System Settings */}
                        <button
                            type="button"
                            onClick={() => {
                                setActiveNav('settings');
                                setSearchQuery('');
                            }}
                            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${activeNav === 'settings'
                                    ? 'bg-[#607C3C] text-white shadow-xs'
                                    : 'text-[#7A8A70] hover:text-[#192414] hover:bg-[#F4F6F1]'
                                }`}
                        >
                            <Settings className="w-4 h-4" />
                            <span>System Settings</span>
                        </button>
                    </nav>
                </div>

                {/* Bottom Sidebar: Admin Quick Actions Widget & User Profile */}
                <div className="space-y-4 pt-6 border-t border-[#F0F3EC]">
                    {/* Widget: Admin Quick Actions */}
                    <div className="p-4 rounded-2xl bg-[#F6F8F3] border border-[#D8E2D0] space-y-2.5">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#607C3C] flex items-center gap-1.5">
                                <Layers className="w-3.5 h-3.5" />
                                Quick Actions
                            </span>
                        </div>
                        <p className="text-[11px] text-[#6E7F65] leading-snug">
                            Catat pengeluaran operasional cluster langsung ke buku kas.
                        </p>
                        <button
                            type="button"
                            onClick={() => setShowExpenseModal(true)}
                            className="w-full py-2 px-3 rounded-xl bg-[#607C3C] hover:bg-[#4E6730] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
                        >
                            <PlusCircle className="w-3.5 h-3.5" />
                            <span>+ Catat Pengeluaran Kas</span>
                        </button>
                    </div>

                    {/* Admin Profile & Actions */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-full bg-[#1A331E] text-white text-xs font-black flex items-center justify-center border border-[#3E5C2D]">
                                PB
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs font-bold text-[#192414] truncate">Pak Bambang</p>
                                <p className="text-[10px] text-[#7A8A70] truncate">Bendahara RT 05</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-1">
                            {onSwitchToResident && (
                                <button
                                    type="button"
                                    onClick={onSwitchToResident}
                                    className="p-1.5 text-[#7A8A70] hover:text-[#607C3C] rounded-lg hover:bg-[#F4F6F1] transition-colors cursor-pointer"
                                    title="Beralih ke Tampilan Warga"
                                >
                                    <UserCheck className="w-4 h-4" />
                                </button>
                            )}

                            {onLogout && (
                                <button
                                    type="button"
                                    onClick={onLogout}
                                    className="p-1.5 text-[#7A8A70] hover:text-[#B33939] rounded-lg hover:bg-[#F4F6F1] transition-colors cursor-pointer"
                                    title="Keluar"
                                >
                                    <LogOut className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </aside>

            {/* =========================================================================
                2. MAIN CONTENT AREA (Takes remaining full screen width & height)
               ========================================================================= */}
            <main className="flex-1 h-screen overflow-y-auto p-6 sm:p-10 lg:p-12 flex flex-col justify-between space-y-9">

                {/* -------------------------------------------------------------
                    TOP FILTER & SEARCH BAR (Adapts to Active Page)
                   ------------------------------------------------------------- */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xs font-bold text-[#7A8A70] uppercase tracking-wider">
                            {activeNav === 'overview' && 'Overview & Stats Administrasi RT 05'}
                            {activeNav === 'verifikasi' && 'Pencarian & Verifikasi Pembayaran IPL'}
                            {activeNav === 'buku-kas' && 'Buku Kas & Riwayat Pengeluaran RT'}
                            {activeNav === 'sanitasi' && 'Jadwal Sanitasi & Armada Sampah'}
                            {activeNav === 'warga' && 'Direktori Hunian & Warga Cluster'}
                            {activeNav === 'settings' && 'Konfigurasi Parameter Cluster RT 05'}
                        </h2>
                    </div>

                    <div className="flex flex-col lg:flex-row items-stretch lg:items-end gap-3 pt-1">
                        {/* Search Input Box */}
                        <div className="flex-1 min-w-[260px]">
                            <label className="text-[11px] font-bold text-[#7A8A70] block mb-1.5">
                                {activeNav === 'overview' && 'Cari Ringkasan Unit atau Transaksi'}
                                {activeNav === 'verifikasi' && 'Cari Unit, Nama Warga, atau ID Transaksi'}
                                {activeNav === 'buku-kas' && 'Cari Kuitansi, Vendor, atau Deskripsi'}
                                {activeNav === 'sanitasi' && 'Cari Rute Armada atau Nama Driver'}
                                {activeNav === 'warga' && 'Cari Nama Warga, No. Rumah, atau No. HP'}
                                {activeNav === 'settings' && 'Cari Parameter Sistem'}
                            </label>
                            <div className="relative">
                                <Search className="w-4 h-4 text-[#8FA284] absolute left-3.5 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder={
                                        activeNav === 'warga'
                                            ? 'Cari nama kepala keluarga, no. rumah, no. HP...'
                                            : activeNav === 'buku-kas'
                                                ? 'Cari nama vendor, deskripsi pengeluaran, nomor nota...'
                                                : activeNav === 'sanitasi'
                                                    ? 'Cari armada, nama driver, jadwal rute...'
                                                    : 'Cari Blok/No. Rumah, Nama Warga, atau ID Transaksi...'
                                    }
                                    className="w-full bg-[#F5F6F2] hover:bg-[#EEF1EB] focus:bg-white text-xs font-semibold text-[#192414] placeholder-[#9AA992] pl-10 pr-4 py-2.5 rounded-xl border border-transparent focus:border-[#607C3C] focus:outline-none transition-all"
                                />
                            </div>
                        </div>

                        {/* Area Filter */}
                        <div className="w-full sm:w-44">
                            <label className="text-[11px] font-bold text-[#7A8A70] block mb-1.5">
                                Filter Blok / Klaster
                            </label>
                            <div className="relative">
                                <select
                                    value={blockFilter}
                                    onChange={(e) => setBlockFilter(e.target.value)}
                                    className="w-full appearance-none bg-[#F5F6F2] text-xs font-semibold text-[#192414] py-2.5 pl-3.5 pr-8 rounded-xl border border-transparent hover:bg-[#EEF1EB] focus:border-[#607C3C] focus:outline-none cursor-pointer"
                                >
                                    <option value="Semua">Semua Blok / Klaster</option>
                                    <option value="Blok A">Blok A (12 Unit)</option>
                                    <option value="Blok B">Blok B (14 Unit)</option>
                                    <option value="Blok C">Blok C (17 Unit)</option>
                                </select>
                                <ChevronDown className="w-3.5 h-3.5 text-[#7A8A70] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                            </div>
                        </div>

                        {/* Status Filter */}
                        <div className="w-full sm:w-44">
                            <label className="text-[11px] font-bold text-[#7A8A70] block mb-1.5">
                                Status Filter
                            </label>
                            <div className="relative">
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="w-full appearance-none bg-[#F5F6F2] text-xs font-semibold text-[#192414] py-2.5 pl-3.5 pr-8 rounded-xl border border-transparent hover:bg-[#EEF1EB] focus:border-[#607C3C] focus:outline-none cursor-pointer"
                                >
                                    <option value="Semua">Semua Status</option>
                                    <option value="Menunggu">Menunggu Approval</option>
                                    <option value="Verified">Lunas / Terverifikasi</option>
                                </select>
                                <ChevronDown className="w-3.5 h-3.5 text-[#7A8A70] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                            </div>
                        </div>

                        {/* Primary CTA Button (Adapts to Active Page) */}
                        <div className="self-end">
                            {activeNav === 'buku-kas' ? (
                                <button
                                    type="button"
                                    onClick={() => setShowExpenseModal(true)}
                                    className="w-full sm:w-auto h-[40px] px-5 rounded-xl bg-[#607C3C] hover:bg-[#4E6730] active:scale-98 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs whitespace-nowrap"
                                >
                                    <PlusCircle className="w-4 h-4" />
                                    <span>+ Catat Pengeluaran Kas</span>
                                </button>
                            ) : activeNav === 'sanitasi' ? (
                                <button
                                    type="button"
                                    onClick={() => setShowBroadcastModal(true)}
                                    className="w-full sm:w-auto h-[40px] px-5 rounded-xl bg-[#1A331E] hover:bg-[#25442A] active:scale-98 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs whitespace-nowrap"
                                >
                                    <Send className="w-4 h-4" />
                                    <span>Kirim Broadcast Warga</span>
                                </button>
                            ) : activeNav === 'warga' ? (
                                <button
                                    type="button"
                                    onClick={() => setShowAddResidentModal(true)}
                                    className="w-full sm:w-auto h-[40px] px-5 rounded-xl bg-[#607C3C] hover:bg-[#4E6730] active:scale-98 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs whitespace-nowrap"
                                >
                                    <PlusCircle className="w-4 h-4" />
                                    <span>+ Tambah Data Hunian</span>
                                </button>
                            ) : activeNav === 'settings' ? (
                                <button
                                    type="button"
                                    onClick={() => showToast('Seluruh konfigurasi sistem RT 05 berhasil disimpan!')}
                                    className="w-full sm:w-auto h-[40px] px-5 rounded-xl bg-[#1A331E] hover:bg-[#25442A] active:scale-98 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs whitespace-nowrap"
                                >
                                    <Save className="w-4 h-4" />
                                    <span>Simpan Pengaturan</span>
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => setShowBillModal(true)}
                                    className="w-full sm:w-auto h-[40px] px-5 rounded-xl bg-[#1A331E] hover:bg-[#25442A] active:scale-98 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs whitespace-nowrap"
                                >
                                    <PlusCircle className="w-4 h-4" />
                                    <span>+ Buat Tagihan IPL Bulanan</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* -------------------------------------------------------------
                    DISTINCT PAGE 1: OVERVIEW & STATS
                   ------------------------------------------------------------- */}
                {activeNav === 'overview' && (
                    <div className="flex-1 space-y-7">
                        {/* Section 1: Executive Financial Summary */}
                        <div className="w-full p-5 sm:p-6 rounded-2xl bg-white border border-[#E5EBDD] shadow-[0_4px_16px_rgba(0,0,0,0.03)] space-y-4">
                            <div className="flex items-center justify-between pb-3 border-b border-[#F0F3EC]">
                                <span className="text-xs font-black uppercase tracking-wider text-[#607C3C] flex items-center gap-1.5">
                                    <DollarSign className="w-4 h-4" />
                                    Executive Financial & Operational Summary
                                </span>
                                <span className="text-[11px] text-[#7A8A70] font-semibold">
                                    Periode: Oktober 2024
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="p-4 rounded-xl bg-[#F6F8F3] border border-[#D8E2D0] flex flex-col justify-between">
                                    <span className="text-[11px] font-bold text-[#7A8A70] uppercase">
                                        1. Total Kas RT Sekarang
                                    </span>
                                    <div className="text-xl sm:text-2xl font-black text-[#192414] mt-1">
                                        Rp 42.500.000
                                    </div>
                                    <span className="text-[11px] font-semibold text-[#2F611E] mt-1 flex items-center gap-1">
                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                        Status: Sehat / Verified GDrive
                                    </span>
                                </div>

                                <div className="p-4 rounded-xl bg-[#F6F8F3] border border-[#D8E2D0] flex flex-col justify-between">
                                    <span className="text-[11px] font-bold text-[#7A8A70] uppercase">
                                        2. Kepatuhan IPL Oktober
                                    </span>
                                    <div className="text-xl sm:text-2xl font-black text-[#607C3C] mt-1">
                                        88%
                                    </div>
                                    <span className="text-[11px] font-semibold text-[#6E7F65] mt-1">
                                        38/43 Unit Lunas • 5 Unit Tertunggak
                                    </span>
                                </div>

                                <div className="p-4 rounded-xl bg-[#FFF9F2] border border-[#F3DFC4] flex flex-col justify-between">
                                    <span className="text-[11px] font-bold text-[#9A6209] uppercase">
                                        3. Belum Diverifikasi
                                    </span>
                                    <div className="text-xl sm:text-2xl font-black text-[#9A6209] mt-1">
                                        {pendingCount} Transaksi
                                    </div>
                                    <span className="text-[11px] font-semibold text-[#7E5718] mt-1">
                                        BCA Virtual & Manual Transfer
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Quick Pending Verifications Highlight */}
                        <div className="space-y-3.5">
                            <div className="flex items-center justify-between pb-1 border-b border-[#F0F3EC]">
                                <h3 className="text-base sm:text-lg font-black text-[#192414] tracking-tight">
                                    Antrean Verifikasi Mendesak
                                </h3>
                                <button
                                    type="button"
                                    onClick={() => setActiveNav('verifikasi')}
                                    className="text-xs font-bold text-[#607C3C] hover:underline cursor-pointer"
                                >
                                    Lihat Semua ({verificationList.length}) →
                                </button>
                            </div>

                            <div className="space-y-3">
                                {verificationList.slice(0, 3).map((item) => (
                                    <div
                                        key={item.id}
                                        className="w-full p-4 sm:p-5 rounded-2xl bg-white border border-[#E5EBDD] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs"
                                    >
                                        <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                                            <div className="w-11 h-11 rounded-xl bg-[#F4F6F1] border border-[#EAEFE5] flex items-center justify-center text-[#607C3C] shrink-0 font-bold text-xs">
                                                {item.unit.split(' ')[0]}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h4 className="font-extrabold text-sm sm:text-base text-[#192414]">
                                                        {item.unit} <span className="text-[#607C3C]">({item.resident})</span>
                                                    </h4>
                                                    <span className={`text-[10px] font-black px-2 py-0.5 rounded ${item.badgeClass}`}>
                                                        {item.status}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-[#6E7F65] font-medium mt-0.5">
                                                    Nominal: <strong>{item.amount}</strong> • Metode: {item.method}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 shrink-0">
                                            <button
                                                type="button"
                                                onClick={() => setSelectedProof(item)}
                                                className="px-3 py-1.5 rounded-xl border border-[#D5DFC9] text-xs font-bold text-[#7A8A70] hover:text-[#192414] hover:bg-[#F5F6F2] transition-colors"
                                            >
                                                Lihat Bukti
                                            </button>
                                            {item.status === 'BUTUH APPROVAL' && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleApprove(item.id, item.resident)}
                                                    className="px-3.5 py-1.5 rounded-xl bg-[#607C3C] hover:bg-[#4E6730] text-white text-xs font-bold flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
                                                >
                                                    <Check className="w-3.5 h-3.5" />
                                                    <span>Setujui</span>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Section 3: Status Sanitasi Singkat */}
                        <div className="p-5 rounded-2xl bg-[#F6F8F3] border border-[#D8E2D0] flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-center gap-3.5">
                                <div className="w-11 h-11 rounded-xl bg-[#607C3C] text-white flex items-center justify-center shrink-0">
                                    <Truck className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-black text-[#192414]">
                                        Armada Truk RT 05 - ON SCHEDULE (06:30 - 08:30 WITA)
                                    </h4>
                                    <p className="text-xs text-[#6E7F65]">
                                        Driver: Pak Joko (0812-9988-7766) • Wilayah: Blok A, B, C Cluster Diamond
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setActiveNav('sanitasi')}
                                className="text-xs font-bold text-[#607C3C] hover:underline cursor-pointer"
                            >
                                Kelola Jadwal Sanitasi →
                            </button>
                        </div>
                    </div>
                )}

                {/* -------------------------------------------------------------
                    DISTINCT PAGE 2: VERIFIKASI IPL
                   ------------------------------------------------------------- */}
                {activeNav === 'verifikasi' && (
                    <div className="flex-1 space-y-4">
                        <div className="flex items-center justify-between pb-1 border-b border-[#F0F3EC]">
                            <div className="flex items-center gap-2">
                                <h3 className="text-lg sm:text-xl font-black text-[#192414] tracking-tight">
                                    Daftar Pembayaran IPL Menunggu Verifikasi
                                </h3>
                                <span className="text-xs font-bold text-[#607C3C] bg-[#EDF5E8] px-2 py-0.5 rounded border border-[#C5DCB6]">
                                    {filteredVerifications.length} Data
                                </span>
                            </div>
                            <span className="text-xs text-[#7A8A70] font-semibold hidden sm:inline">
                                Verifikasi 1-Klik Otomatis
                            </span>
                        </div>

                        {/* Full-Width Vertical Stack */}
                        <div className="space-y-3">
                            {filteredVerifications.map((item) => (
                                <div
                                    key={item.id}
                                    className="w-full p-4 sm:p-5 rounded-2xl bg-white border border-[#E5EBDD] hover:border-[#607C3C]/40 hover:shadow-[0_4px_16px_rgba(0,0,0,0.03)] transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                                >
                                    <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                                        <div className="w-11 h-11 rounded-xl bg-[#F4F6F1] border border-[#EAEFE5] flex items-center justify-center text-[#607C3C] shrink-0 font-bold text-xs">
                                            {item.unit.split(' ')[0]}
                                        </div>
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-extrabold text-sm sm:text-base text-[#192414]">
                                                    {item.unit} <span className="text-[#607C3C]">({item.resident})</span>
                                                </h4>
                                                <span className={`text-[10px] font-black px-2 py-0.5 rounded ${item.badgeClass}`}>
                                                    {item.status}
                                                </span>
                                            </div>
                                            <p className="text-xs text-[#6E7F65] font-medium mt-0.5">
                                                Nominal: <strong>{item.amount}</strong> • Metode: {item.method} • Ref: {item.receiptRef} • {item.date}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-[#F5F7F2]">
                                        <button
                                            type="button"
                                            onClick={() => setSelectedProof(item)}
                                            className="px-3 py-1.5 rounded-xl border border-[#D5DFC9] text-xs font-bold text-[#7A8A70] hover:text-[#192414] hover:bg-[#F5F6F2] transition-colors"
                                        >
                                            Lihat Bukti
                                        </button>

                                        {item.status === 'BUTUH APPROVAL' && (
                                            <>
                                                <button
                                                    type="button"
                                                    onClick={() => handleApprove(item.id, item.resident)}
                                                    className="px-3.5 py-1.5 rounded-xl bg-[#607C3C] hover:bg-[#4E6730] text-white text-xs font-bold flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
                                                >
                                                    <Check className="w-3.5 h-3.5" />
                                                    <span>Setujui</span>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleReject(item.id, item.resident)}
                                                    className="px-3 py-1.5 rounded-xl border border-[#E8C5BC] hover:bg-[#FDF0E9] text-[#A6461D] text-xs font-bold transition-colors cursor-pointer"
                                                >
                                                    Tolak
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* -------------------------------------------------------------
                    DISTINCT PAGE 3: BUKU KAS & PENGELUARAN
                   ------------------------------------------------------------- */}
                {activeNav === 'buku-kas' && (
                    <div className="flex-1 space-y-5">
                        {/* Summary Balance Banner */}
                        <div className="p-5 sm:p-6 rounded-2xl bg-[#F6F8F3] border border-[#D8E2D0] flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#607C3C] flex items-center gap-1.5">
                                    <BookOpen className="w-3.5 h-3.5" />
                                    Saldo Kas Bersama RT 05
                                </span>
                                <h3 className="text-2xl sm:text-3xl font-black text-[#192414] tracking-tight mt-1">
                                    Rp 42.500.000
                                </h3>
                                <p className="text-xs text-[#6E7F65] font-semibold mt-0.5">
                                    Giro BCA Penampung RT: 778-901-2345 a.n. Kas Paguyuban RT 05 (GDrive Backup Aktif)
                                </p>
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => showToast('Membuka Folder Google Drive Kas RT 05...')}
                                    className="px-3.5 py-2 rounded-xl bg-white border border-[#D5DFC9] text-xs font-bold text-[#192414] hover:bg-[#F0F2EB] transition-colors flex items-center gap-1.5 shadow-2xs"
                                >
                                    <ExternalLink className="w-3.5 h-3.5 text-[#607C3C]" />
                                    <span>Folder GDrive</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowExpenseModal(true)}
                                    className="px-4 py-2 rounded-xl bg-[#607C3C] hover:bg-[#4E6730] text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-2xs"
                                >
                                    <PlusCircle className="w-3.5 h-3.5" />
                                    <span>+ Catat Pengeluaran</span>
                                </button>
                            </div>
                        </div>

                        {/* Expense Items Vertical Stack */}
                        <div className="space-y-3.5">
                            <div className="flex items-center justify-between pb-1 border-b border-[#F0F3EC]">
                                <h3 className="text-lg sm:text-xl font-black text-[#192414] tracking-tight">
                                    Daftar Pengeluaran & Operasional RT 05
                                </h3>
                                <span className="text-xs font-bold text-[#607C3C] bg-[#EDF5E8] px-2.5 py-1 rounded-md border border-[#C5DCB6]">
                                    Audit Multi-Sig 3 Kunci
                                </span>
                            </div>

                            <div className="space-y-3">
                                {expenseList.map((exp) => (
                                    <div
                                        key={exp.id}
                                        className="w-full p-4 sm:p-5 rounded-2xl bg-white border border-[#E5EBDD] flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-2xs"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-[#F4F6F1] border border-[#EAEFE5] flex items-center justify-center text-[#607C3C] shrink-0 font-bold">
                                                <FileText className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h4 className="font-extrabold text-sm text-[#192414]">{exp.title}</h4>
                                                    <span className="text-[10px] font-bold text-[#607C3C] bg-[#EDF5E8] px-2 py-0.5 rounded border border-[#C5DCB6]">
                                                        {exp.category}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-[#6E7F65] mt-0.5">
                                                    Vendor: <strong>{exp.vendor}</strong> • Tanggal: {exp.date}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-[#F5F7F2]">
                                            <div className="text-right">
                                                <span className="text-sm sm:text-base font-black text-[#192414] block">
                                                    {exp.amount}
                                                </span>
                                                <span className="text-[10px] font-semibold text-[#2F611E] bg-[#EDF5E8] px-2 py-0.5 rounded border border-[#C5DCB6]">
                                                    {exp.status}
                                                </span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => showToast(`Membuka berkas GDrive: ${exp.gdriveRef}`)}
                                                className="p-2 rounded-xl text-[#7A8A70] hover:text-[#607C3C] hover:bg-[#F4F6F1] transition-colors"
                                                title="Lihat di Google Drive"
                                            >
                                                <ExternalLink className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* -------------------------------------------------------------
                    DISTINCT PAGE 4: OPERATIONAL & TRASH SCHEDULE
                   ------------------------------------------------------------- */}
                {activeNav === 'sanitasi' && (
                    <div className="flex-1 space-y-5">
                        <div className="p-5 sm:p-6 rounded-2xl bg-[#F6F8F3] border border-[#D8E2D0] flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-[#607C3C] text-white flex items-center justify-center shrink-0 shadow-xs">
                                    <Truck className="w-6 h-6" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h4 className="text-sm sm:text-base font-black text-[#192414]">
                                            Armada Truk RT 05 - ON SCHEDULE
                                        </h4>
                                        <span className="text-[10px] font-bold text-[#2F611E] bg-[#EDF5E8] px-2 py-0.5 rounded border border-[#C5DCB6]">
                                            06:30 - 08:30 WITA
                                        </span>
                                    </div>
                                    <p className="text-xs text-[#6E7F65] font-semibold mt-1">
                                        Driver / Contact: <strong>Pak Joko (Driver 01) - 0812-9988-7766</strong>
                                    </p>
                                    <p className="text-[11px] text-[#7A8A70] mt-0.5">
                                        Rute Aktif: Pengangkutan Blok A, Blok B, Blok C dilanjutkan ke TPS Induk.
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => setShowBroadcastModal(true)}
                                className="px-4 py-2.5 rounded-xl bg-[#1A331E] hover:bg-[#25442A] text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer whitespace-nowrap self-start md:self-auto"
                            >
                                <Send className="w-3.5 h-3.5" />
                                <span>Kirim Broadcast Warga</span>
                            </button>
                        </div>

                        {/* Operational Details Vertical Stack */}
                        <div className="space-y-3.5">
                            <h3 className="text-lg sm:text-xl font-black text-[#192414] tracking-tight">
                                Ketentuan Operasional Armada & TPS
                            </h3>
                            <div className="space-y-3">
                                <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E5EBDD] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                                    <div>
                                        <h4 className="font-bold text-sm text-[#192414]">Armada Truk Kebersihan RT 05</h4>
                                        <p className="text-xs text-[#6E7F65]">Kapasitas: 4.5 Ton • Status Bahan Bakar: Penuh • Perawatan Terakhir: 28 Sep 2024</p>
                                    </div>
                                    <span className="text-xs font-bold text-[#2F611E] bg-[#EDF5E8] px-2.5 py-1 rounded-md border border-[#C5DCB6]">
                                        Siap Operasi
                                    </span>
                                </div>
                                <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E5EBDD] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                                    <div>
                                        <h4 className="font-bold text-sm text-[#192414]">Pengangkutan Sampah Organik (Kompos)</h4>
                                        <p className="text-xs text-[#6E7F65]">Jadwal: Senin, Rabu, Jumat • Lokasi Olah: Rumah Kompos Warga Swadaya RT 05</p>
                                    </div>
                                    <span className="text-xs font-bold text-[#607C3C] bg-[#EDF5E8] px-2.5 py-1 rounded-md border border-[#C5DCB6]">
                                        3x Seminggu
                                    </span>
                                </div>
                                <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E5EBDD] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                                    <div>
                                        <h4 className="font-bold text-sm text-[#192414]">Drop-Box Khusus E-Waste & B3</h4>
                                        <p className="text-xs text-[#6E7F65]">Lokasi: Samping Pos Satpam Utama • Penjemputan Berkala DLH: Sabtu Minggu 1 & 3</p>
                                    </div>
                                    <span className="text-xs font-bold text-[#A6461D] bg-[#FDF0E9] px-2.5 py-1 rounded-md border border-[#F5CEBA]">
                                        Penanganan Khusus
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* -------------------------------------------------------------
                    DISTINCT PAGE 5: DATA WARGA & HUNIAN
                   ------------------------------------------------------------- */}
                {activeNav === 'warga' && (
                    <div className="flex-1 space-y-5">
                        <div className="flex items-center justify-between pb-1 border-b border-[#F0F3EC]">
                            <div>
                                <h3 className="text-lg sm:text-xl font-black text-[#192414] tracking-tight">
                                    Direktori Hunian & Warga Cluster Diamond RT 05
                                </h3>
                                <p className="text-xs text-[#6E7F65] mt-0.5">
                                    Total 43 Unit Hunian Terdaftar (100% Terverifikasi Kartu Keluarga)
                                </p>
                            </div>
                            <span className="text-xs font-bold text-[#607C3C] bg-[#EDF5E8] px-2.5 py-1 rounded-md border border-[#C5DCB6]">
                                43 Unit Aktif
                            </span>
                        </div>

                        {/* Residents Vertical Stack */}
                        <div className="space-y-3">
                            {filteredResidents.map((res, idx) => (
                                <div
                                    key={idx}
                                    className="w-full p-4 sm:p-5 rounded-2xl bg-white border border-[#E5EBDD] hover:border-[#607C3C]/40 hover:shadow-[0_4px_16px_rgba(0,0,0,0.03)] transition-all flex flex-col md:flex-row md:items-center justify-between gap-3"
                                >
                                    <div className="flex items-center gap-3.5">
                                        <div className="w-11 h-11 rounded-xl bg-[#F4F6F1] border border-[#EAEFE5] flex items-center justify-center text-[#607C3C] font-black text-xs shrink-0">
                                            {res.unit.split(' ')[0]}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-black text-sm text-[#192414]">
                                                    {res.unit}
                                                </h4>
                                                <span className="text-xs font-bold text-[#607C3C]">
                                                    • {res.head}
                                                </span>
                                                <span className="text-[10px] font-semibold text-[#7A8A70] bg-[#F5F6F2] px-2 py-0.5 rounded">
                                                    {res.type}
                                                </span>
                                            </div>
                                            <p className="text-xs text-[#6E7F65] mt-0.5">
                                                Anggota: <strong>{res.members} Jiwa</strong> • Kontak: {res.phone}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-[#F5F7F2]">
                                        <span className={`text-[10px] font-black px-2.5 py-1 rounded-md border ${res.statusClass}`}>
                                            IPL: {res.iplStatus}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => showToast(`Detail data kependudukan ${res.unit} (${res.head})`)}
                                            className="px-3 py-1.5 rounded-xl border border-[#D5DFC9] text-xs font-bold text-[#7A8A70] hover:text-[#192414] hover:bg-[#F5F6F2] transition-colors"
                                        >
                                            Detail Unit
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* -------------------------------------------------------------
                    DISTINCT PAGE 6: SYSTEM SETTINGS
                   ------------------------------------------------------------- */}
                {activeNav === 'settings' && (
                    <div className="flex-1 space-y-5">
                        <div className="flex items-center justify-between pb-1 border-b border-[#F0F3EC]">
                            <div>
                                <h3 className="text-lg sm:text-xl font-black text-[#192414] tracking-tight">
                                    Pengaturan Sistem & Parameter RT 05
                                </h3>
                                <p className="text-xs text-[#6E7F65] mt-0.5">
                                    Konfigurasi rekening giro bank, tarif IPL, dan integrasi GDrive
                                </p>
                            </div>
                        </div>

                        {/* Settings Cards Vertical Stack */}
                        <div className="space-y-4">
                            {/* Card 1: Tarif IPL */}
                            <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E5EBDD] space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-[#EDF5E8] text-[#607C3C] flex items-center justify-center font-bold">
                                        <DollarSign className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-sm text-[#192414]">Struktur Tarif IPL Bulanan</h4>
                                        <p className="text-xs text-[#6E7F65]">Besaran iuran lingkungan berdasarkan keputusan Musyawarah Warga</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                                    <div className="p-3 rounded-xl bg-[#F6F8F3] border border-[#D8E2D0]">
                                        <span className="text-[#7A8A70] block">Pos Keamanan:</span>
                                        <strong className="text-[#192414] text-sm">Rp 200.000</strong>
                                    </div>
                                    <div className="p-3 rounded-xl bg-[#F6F8F3] border border-[#D8E2D0]">
                                        <span className="text-[#7A8A70] block">Pos Kebersihan:</span>
                                        <strong className="text-[#192414] text-sm">Rp 150.000</strong>
                                    </div>
                                    <div className="p-3 rounded-xl bg-[#F6F8F3] border border-[#D8E2D0]">
                                        <span className="text-[#7A8A70] block">Pos Kas RT Swadaya:</span>
                                        <strong className="text-[#192414] text-sm">Rp 100.000</strong>
                                    </div>
                                </div>
                            </div>

                            {/* Card 2: Rekening Bank Penampung */}
                            <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E5EBDD] space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-[#EDF5E8] text-[#607C3C] flex items-center justify-center font-bold">
                                        <Building2 className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-sm text-[#192414]">Rekening Giro Penampung & Virtual Account</h4>
                                        <p className="text-xs text-[#6E7F65]">Terhubung otomatis dengan gateway perbankan BCA</p>
                                    </div>
                                </div>

                                <div className="p-3.5 rounded-xl bg-[#F6F8F3] border border-[#D8E2D0] space-y-1 text-xs">
                                    <p><strong className="text-[#192414]">Bank:</strong> PT Bank Central Asia Tbk (BCA)</p>
                                    <p><strong className="text-[#192414]">Nomor Rekening Giro:</strong> 778-901-2345</p>
                                    <p><strong className="text-[#192414]">Atas Nama:</strong> Kas Paguyuban Warga RT 05 Cluster Diamond</p>
                                    <p><strong className="text-[#192414]">Auto-Match VA:</strong> Aktif (Verifikasi instan via Webhook)</p>
                                </div>
                            </div>

                            {/* Card 3: Cloud Backup Google Drive */}
                            <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E5EBDD] space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-[#EDF5E8] text-[#607C3C] flex items-center justify-center font-bold">
                                        <Cloud className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-sm text-[#192414]">Integrasi Google Drive Buku Kas</h4>
                                        <p className="text-xs text-[#6E7F65]">Pencatatan nota, kuitansi digital, dan audit keuangan</p>
                                    </div>
                                </div>

                                <div className="p-3.5 rounded-xl bg-[#F6F8F3] border border-[#D8E2D0] space-y-1 text-xs">
                                    <p><strong className="text-[#192414]">Akun Terhubung:</strong> sekretariat.rt05.diamond@gmail.com</p>
                                    <p><strong className="text-[#192414]">Folder Sinkronisasi:</strong> GDrive/KasRT05/2024-10/</p>
                                    <p><strong className="text-[#192414]">Status Sync:</strong> Real-time Terkoneksi</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* -------------------------------------------------------------
                    4. FOOTER BAR (Admin Mode)
                   ------------------------------------------------------------- */}
                <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-[#7A8A70] border-t border-[#F0F3EC]">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#2DA84E] animate-pulse" />
                        <span className="font-semibold text-[#192414]">
                            WargaPay Admin Core v2.4 • RT 05 Cluster Diamond
                        </span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-[#6E7F65]">
                            Logged in as: <strong className="text-[#192414]">Bendahara RT (Pak Bambang)</strong> • Synchronized Real-time
                        </span>
                    </div>
                </div>

            </main>

            {/* =========================================================================
                MODAL 1: Catat Pengeluaran Kas RT Baru
               ========================================================================= */}
            <AnimatePresence>
                {showExpenseModal && (
                    <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.96 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.96 }}
                            className="bg-white rounded-3xl max-w-md w-full border border-[#D2DBC5] shadow-2xl p-6 sm:p-7 relative"
                        >
                            <button
                                type="button"
                                onClick={() => setShowExpenseModal(false)}
                                className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-[#F0F2EB] text-[#7A8A70] transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>

                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-10 h-10 rounded-xl bg-[#EDF5E8] text-[#607C3C] flex items-center justify-center font-bold">
                                    <PlusCircle className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-black text-base text-[#192414]">
                                        Catat Pengeluaran Kas RT
                                    </h3>
                                    <p className="text-[11px] text-[#7A8A70]">
                                        Sinkronisasi otomatis ke Google Drive Buku Kas
                                    </p>
                                </div>
                            </div>

                            <form onSubmit={handleAddExpenseSubmit} className="space-y-3.5 text-xs">
                                <div>
                                    <label className="font-bold text-[#192414] block mb-1">
                                        Deskripsi Pengeluaran
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={newExpenseName}
                                        onChange={(e) => setNewExpenseName(e.target.value)}
                                        placeholder="Contoh: Pembelian Solar Mesin Rumput RT"
                                        className="w-full bg-[#F5F6F2] py-2.5 px-3.5 rounded-xl border border-transparent focus:border-[#607C3C] focus:outline-none font-semibold text-[#192414]"
                                    />
                                </div>

                                <div>
                                    <label className="font-bold text-[#192414] block mb-1">
                                        Nominal Pencairan
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={newExpenseAmount}
                                        onChange={(e) => setNewExpenseAmount(e.target.value)}
                                        placeholder="Contoh: Rp 350.000"
                                        className="w-full bg-[#F5F6F2] py-2.5 px-3.5 rounded-xl border border-transparent focus:border-[#607C3C] focus:outline-none font-semibold text-[#192414]"
                                    />
                                </div>

                                <div>
                                    <label className="font-bold text-[#192414] block mb-1">
                                        Vendor / Penerima Dana
                                    </label>
                                    <input
                                        type="text"
                                        value={newExpenseVendor}
                                        onChange={(e) => setNewExpenseVendor(e.target.value)}
                                        placeholder="Contoh: SPBU Pertamina / Toko Bangunan"
                                        className="w-full bg-[#F5F6F2] py-2.5 px-3.5 rounded-xl border border-transparent focus:border-[#607C3C] focus:outline-none font-semibold text-[#192414]"
                                    />
                                </div>

                                <div className="p-3 rounded-xl bg-[#F6F8F3] border border-[#D8E2D0] text-[11px] text-[#6E7F65]">
                                    ✓ Entri ini akan membutuhkan validasi Multi-Sig dari Ketua RT dan Bendahara.
                                </div>

                                <div className="pt-2 flex justify-end gap-2.5">
                                    <button
                                        type="button"
                                        onClick={() => setShowExpenseModal(false)}
                                        className="px-4 py-2 rounded-xl text-xs font-bold text-[#7A8A70] hover:bg-[#F0F2EB] transition-colors"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-5 py-2 rounded-xl bg-[#607C3C] hover:bg-[#4E6730] text-xs font-bold text-white transition-colors"
                                    >
                                        Simpan ke Buku Kas
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* =========================================================================
                MODAL 2: Buat Tagihan IPL Bulanan
               ========================================================================= */}
            <AnimatePresence>
                {showBillModal && (
                    <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.96 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.96 }}
                            className="bg-white rounded-3xl max-w-md w-full border border-[#D2DBC5] shadow-2xl p-6 sm:p-7 relative"
                        >
                            <button
                                type="button"
                                onClick={() => setShowBillModal(false)}
                                className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-[#F0F2EB] text-[#7A8A70] transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>

                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-10 h-10 rounded-xl bg-[#EDF5E8] text-[#607C3C] flex items-center justify-center font-bold">
                                    <CheckSquare className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-black text-base text-[#192414]">
                                        Generate Tagihan IPL Massal
                                    </h3>
                                    <p className="text-[11px] text-[#7A8A70]">
                                        Periode: November 2024 (43 Unit Warga)
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-3 text-xs">
                                <div className="p-3.5 rounded-2xl bg-[#F6F8F3] border border-[#D8E2D0] space-y-1.5">
                                    <div className="flex justify-between">
                                        <span className="text-[#7A8A70]">Target Hunian:</span>
                                        <span className="font-bold text-[#192414]">43 Unit (Blok A, B, C)</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-[#7A8A70]">Tarif Dasar per Unit:</span>
                                        <span className="font-bold text-[#607C3C]">Rp 450.000 / bulan</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-[#7A8A70]">Batas Waktu Bayar:</span>
                                        <span className="font-bold text-[#192414]">10 November 2024</span>
                                    </div>
                                </div>

                                <p className="text-[11px] text-[#6E7F65]">
                                    Sistem akan otomatis menerbitkan nomor Virtual Account BCA baru untuk masing-masing unit dan mengirimkan notifikasi via WhatsApp bot RT 05.
                                </p>
                            </div>

                            <div className="mt-5 flex items-center justify-end gap-2.5">
                                <button
                                    type="button"
                                    onClick={() => setShowBillModal(false)}
                                    className="px-4 py-2 rounded-xl text-xs font-bold text-[#7A8A70] hover:bg-[#F0F2EB] transition-colors"
                                >
                                    Tutup
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        showToast('43 Tagihan IPL November 2024 berhasil diterbitkan & broadcast dikirim!');
                                        setShowBillModal(false);
                                    }}
                                    className="px-5 py-2 rounded-xl bg-[#1A331E] hover:bg-[#25442A] text-xs font-bold text-white transition-colors"
                                >
                                    Terbitkan Sekarang
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* =========================================================================
                MODAL 3: Lihat Bukti Transfer Warga
               ========================================================================= */}
            <AnimatePresence>
                {selectedProof && (
                    <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.96 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.96 }}
                            className="bg-white rounded-3xl max-w-md w-full border border-[#D2DBC5] shadow-2xl p-6 sm:p-7 relative"
                        >
                            <button
                                type="button"
                                onClick={() => setSelectedProof(null)}
                                className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-[#F0F2EB] text-[#7A8A70] transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>

                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-10 h-10 rounded-xl bg-[#EDF5E8] text-[#607C3C] flex items-center justify-center font-bold">
                                    <FileText className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-black text-base text-[#192414]">
                                        Bukti Transfer Pembayaran
                                    </h3>
                                    <p className="text-[11px] text-[#7A8A70]">
                                        {selectedProof.unit} • {selectedProof.resident}
                                    </p>
                                </div>
                            </div>

                            <div className="p-4 rounded-2xl bg-[#F7F8F4] border border-[#E3EBD9] space-y-2.5 text-xs">
                                <div className="flex justify-between">
                                    <span className="text-[#7A8A70]">Metode Transfer:</span>
                                    <span className="font-bold text-[#192414]">{selectedProof.method}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[#7A8A70]">Waktu Masuk:</span>
                                    <span className="font-bold text-[#192414]">{selectedProof.date}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[#7A8A70]">Nomor Referensi:</span>
                                    <span className="font-bold text-[#607C3C]">{selectedProof.receiptRef}</span>
                                </div>
                                <div className="pt-2 border-t border-[#E3EBD9] flex justify-between items-center text-sm font-black text-[#192414]">
                                    <span>Nominal Pembayaran:</span>
                                    <span className="text-base text-[#607C3C]">{selectedProof.amount}</span>
                                </div>
                            </div>

                            <div className="mt-5 flex items-center justify-end gap-2.5">
                                <button
                                    type="button"
                                    onClick={() => setSelectedProof(null)}
                                    className="px-4 py-2 rounded-xl text-xs font-bold text-[#7A8A70] hover:bg-[#F0F2EB] transition-colors"
                                >
                                    Tutup
                                </button>
                                {selectedProof.status === 'BUTUH APPROVAL' && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            handleApprove(selectedProof.id, selectedProof.resident);
                                            setSelectedProof(null);
                                        }}
                                        className="px-5 py-2 rounded-xl bg-[#607C3C] hover:bg-[#4E6730] text-xs font-bold text-white transition-colors"
                                    >
                                        Setujui Pembayaran
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* =========================================================================
                MODAL 4: Update Status Armada / Kirim Broadcast Warga
               ========================================================================= */}
            <AnimatePresence>
                {showBroadcastModal && (
                    <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.96 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.96 }}
                            className="bg-white rounded-3xl max-w-md w-full border border-[#D2DBC5] shadow-2xl p-6 sm:p-7 relative"
                        >
                            <button
                                type="button"
                                onClick={() => setShowBroadcastModal(false)}
                                className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-[#F0F2EB] text-[#7A8A70] transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>

                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-10 h-10 rounded-xl bg-[#EDF5E8] text-[#607C3C] flex items-center justify-center font-bold">
                                    <Send className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-black text-base text-[#192414]">
                                        Broadcast Pengurus RT ke Warga
                                    </h3>
                                    <p className="text-[11px] text-[#7A8A70]">
                                        Terkirim ke seluruh nomor WhatsApp warga terverifikasi
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-3 text-xs">
                                <div>
                                    <label className="font-bold text-[#192414] block mb-1">
                                        Pesan Pengumuman
                                    </label>
                                    <textarea
                                        rows={4}
                                        value={broadcastText}
                                        onChange={(e) => setBroadcastText(e.target.value)}
                                        className="w-full bg-[#F5F6F2] py-2.5 px-3.5 rounded-xl border border-transparent focus:border-[#607C3C] focus:outline-none font-medium text-[#192414]"
                                    />
                                </div>
                            </div>

                            <div className="mt-5 flex items-center justify-end gap-2.5">
                                <button
                                    type="button"
                                    onClick={() => setShowBroadcastModal(false)}
                                    className="px-4 py-2 rounded-xl text-xs font-bold text-[#7A8A70] hover:bg-[#F0F2EB] transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        showToast('Broadcast berhasil dikirimkan ke 43 Unit Warga!');
                                        setShowBroadcastModal(false);
                                    }}
                                    className="px-5 py-2 rounded-xl bg-[#1A331E] hover:bg-[#25442A] text-xs font-bold text-white transition-colors flex items-center gap-1.5"
                                >
                                    <Send className="w-3.5 h-3.5" />
                                    <span>Kirim Broadcast</span>
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* =========================================================================
                MODAL 5: Tambah Data Hunian Baru
               ========================================================================= */}
            <AnimatePresence>
                {showAddResidentModal && (
                    <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.96 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.96 }}
                            className="bg-white rounded-3xl max-w-md w-full border border-[#D2DBC5] shadow-2xl p-6 sm:p-7 relative"
                        >
                            <button
                                type="button"
                                onClick={() => setShowAddResidentModal(false)}
                                className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-[#F0F2EB] text-[#7A8A70] transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>

                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-10 h-10 rounded-xl bg-[#EDF5E8] text-[#607C3C] flex items-center justify-center font-bold">
                                    <Users className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-black text-base text-[#192414]">
                                        Tambah Data Hunian Warga
                                    </h3>
                                    <p className="text-[11px] text-[#7A8A70]">
                                        Pendaftaran unit baru Cluster Diamond RT 05
                                    </p>
                                </div>
                            </div>

                            <form onSubmit={handleAddResidentSubmit} className="space-y-3.5 text-xs">
                                <div>
                                    <label className="font-bold text-[#192414] block mb-1">
                                        Nomor Blok & Rumah
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={newUnit}
                                        onChange={(e) => setNewUnit(e.target.value)}
                                        placeholder="Contoh: Blok B No. 15"
                                        className="w-full bg-[#F5F6F2] py-2.5 px-3.5 rounded-xl border border-transparent focus:border-[#607C3C] focus:outline-none font-semibold text-[#192414]"
                                    />
                                </div>

                                <div>
                                    <label className="font-bold text-[#192414] block mb-1">
                                        Nama Kepala Keluarga
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={newHead}
                                        onChange={(e) => setNewHead(e.target.value)}
                                        placeholder="Contoh: Bpk. Rahmat Hidayat"
                                        className="w-full bg-[#F5F6F2] py-2.5 px-3.5 rounded-xl border border-transparent focus:border-[#607C3C] focus:outline-none font-semibold text-[#192414]"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="font-bold text-[#192414] block mb-1">
                                            Nomor HP / WA
                                        </label>
                                        <input
                                            type="text"
                                            value={newPhone}
                                            onChange={(e) => setNewPhone(e.target.value)}
                                            placeholder="Contoh: 0812-3344-5566"
                                            className="w-full bg-[#F5F6F2] py-2.5 px-3.5 rounded-xl border border-transparent focus:border-[#607C3C] focus:outline-none font-semibold text-[#192414]"
                                        />
                                    </div>
                                    <div>
                                        <label className="font-bold text-[#192414] block mb-1">
                                            Jumlah Jiwa (KK)
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            value={newMembers}
                                            onChange={(e) => setNewMembers(e.target.value)}
                                            placeholder="3"
                                            className="w-full bg-[#F5F6F2] py-2.5 px-3.5 rounded-xl border border-transparent focus:border-[#607C3C] focus:outline-none font-semibold text-[#192414]"
                                        />
                                    </div>
                                </div>

                                <div className="pt-2 flex justify-end gap-2.5">
                                    <button
                                        type="button"
                                        onClick={() => setShowAddResidentModal(false)}
                                        className="px-4 py-2 rounded-xl text-xs font-bold text-[#7A8A70] hover:bg-[#F0F2EB] transition-colors"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-5 py-2 rounded-xl bg-[#607C3C] hover:bg-[#4E6730] text-xs font-bold text-white transition-colors"
                                    >
                                        Daftarkan Hunian
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

        </div>
    );
};

export default AdminDashboard;
