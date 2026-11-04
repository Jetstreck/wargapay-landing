import { motion } from 'framer-motion';
import {
    QrCode,
    Trash2,
    LineChart,
    FileCheck,
    Mail,
    Building2
} from 'lucide-react';

interface EcosystemCardProps {
    title: string;
    subtitle: string;
    badge: string;
    icon: React.ElementType;
}

const EcosystemCard = ({ title, subtitle, badge, icon: Icon }: EcosystemCardProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative h-64 w-full bg-white rounded-2xl p-7 border border-[#D2DBC5] shadow-[0_12px_32px_rgba(45,60,30,0.06)] hover:border-[#607C3C]/50 hover:shadow-[0_16px_40px_rgba(45,60,30,0.12)] transition-all duration-300 flex flex-col justify-between group"
        >
            {/* Top row: Minimalist category icon at top-left, Badge at top-right */}
            <div className="flex items-center justify-between w-full">
                <div className="w-12 h-12 rounded-xl bg-[#607C3C]/10 border border-[#D2DBC5] group-hover:bg-[#607C3C] group-hover:text-white flex items-center justify-center text-[#607C3C] transition-all duration-300 shadow-sm">
                    <Icon className="w-5 h-5 transition-transform group-hover:scale-110" />
                </div>
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#607C3C]/10 border border-[#D2DBC5] text-[#607C3C] group-hover:bg-[#607C3C]/20 transition-colors">
                    {badge}
                </span>
            </div>

            {/* Middle: Clean, spacious minimalist white space */}
            <div className="flex-1" />

            {/* Bottom: Title & Subtitle */}
            <div>
                <h4 className="text-base font-bold text-[#192414] tracking-wide group-hover:text-[#607C3C] transition-colors font-mono">
                    {title}
                </h4>
                <p className="text-sm text-[#5A6B52] mt-1 font-normal leading-relaxed">
                    {subtitle}
                </p>
            </div>
        </motion.div>
    );
};

const ExperimentLab = () => {
    const modules = [
        {
            title: "IPL BILLING & QRIS",
            subtitle: "QRIS Dinamis & Otomasi Tagihan",
            badge: "PAYMENT CORE",
            icon: QrCode
        },
        {
            title: "SMART WASTE PICKUP",
            subtitle: "Jadwal Armada & Sortir Sampah",
            badge: "SANITASI RT",
            icon: Trash2
        },
        {
            title: "FINANCIAL TRANSPARENCY",
            subtitle: "Buku Kas Terbuka & Real-time Flow",
            badge: "AKUNTANSI",
            icon: LineChart
        },
        {
            title: "EXPENSE AUDIT G-DRIVE",
            subtitle: "Arsip Nota & Kwitansi Digital",
            badge: "CLOUD AUDIT",
            icon: FileCheck
        },
        {
            title: "AUTO EMAIL NOTIFICATION",
            subtitle: "Pengingat Iuran & Laporan Bulanan",
            badge: "AUTOMASI",
            icon: Mail
        },
        {
            title: "RESIDENT DIRECTORY",
            subtitle: "Database Hunian & Kontak Klaster",
            badge: "DIREKTORI",
            icon: Building2
        }
    ];

    return (
        <section id="ecosystem" className="py-32 px-4 md:px-12 bg-[#F0F2EB] relative">
            <div className="max-w-7xl mx-auto">
                <div className="mb-16">
                    <h2 className="text-5xl md:text-6xl font-extrabold text-[#192414] mb-4">
                        WARGAPAY <span className="text-[#607C3C] font-light italic">ECOSYSTEM</span>
                    </h2>
                    <p className="text-[#5A6B52] max-w-lg text-lg">
                        Ekosistem digital terpadu untuk kenyamanan, kebersihan, dan transparansi warga klaster.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {modules.map((module) => (
                        <EcosystemCard
                            key={module.title}
                            title={module.title}
                            subtitle={module.subtitle}
                            badge={module.badge}
                            icon={module.icon}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ExperimentLab;