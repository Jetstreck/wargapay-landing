import { motion } from 'framer-motion';
import logoBrand from '../assets/logo-brand.jpg';

interface NavbarProps {
    onNavigate?: (id: string) => void;
    onLoginClick?: () => void;
}

const Navbar = ({ onNavigate, onLoginClick }: NavbarProps) => {
    const navItems = [
        { label: 'Overview', href: '#overview' },
        { label: 'Core Features', href: '#features' },
        { label: 'Ecosystem', href: '#ecosystem' },
        { label: 'Contact', href: '#contact' },
    ];

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        e.preventDefault();
        const id = href.replace('#', '');
        if (onNavigate) {
            onNavigate(id);
        } else {
            const target = document.getElementById(id);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };

    return (
        <header className="fixed top-5 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-5xl pointer-events-auto">
            <motion.nav
                initial={{ y: -40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="w-full flex items-center justify-between px-5 md:px-7 py-3 rounded-full bg-white/85 backdrop-blur-xl border border-[#E0E6D8] shadow-[0_8px_30px_rgba(96,124,60,0.08)] ring-1 ring-black/[0.03]"
            >
                {/* Brand Logo */}
                <a
                    href="#overview"
                    onClick={(e) => handleClick(e, '#overview')}
                    className="flex items-center gap-3 group cursor-pointer"
                >
                    <div className="w-9 h-9 rounded-full overflow-hidden border border-[#E0E6D8] bg-white flex items-center justify-center p-0.5 shadow-sm group-hover:border-[#607C3C] group-hover:shadow-[0_2px_12px_rgba(96,124,60,0.25)] transition-all duration-300">
                        <img
                            src={logoBrand}
                            alt="WargaPay Logo"
                            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                        />
                    </div>
                    <span className="font-extrabold text-lg md:text-xl tracking-tight text-[#1A2518]">
                        Warga<span className="text-[#607C3C]">Pay</span>
                    </span>
                </a>

                {/* Center Menu Links */}
                <div className="hidden md:flex items-center gap-7">
                    {navItems.map((item) => (
                        <a
                            key={item.label}
                            href={item.href}
                            onClick={(e) => handleClick(e, item.href)}
                            className="text-xs font-semibold uppercase tracking-wider text-[#5A6B52] hover:text-[#1A2518] transition-colors duration-200 relative group py-1"
                        >
                            <span>{item.label}</span>
                            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#607C3C] rounded-full group-hover:w-full transition-all duration-300"></span>
                        </a>
                    ))}
                </div>

                {/* Right Action Button */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => {
                            if (onLoginClick) {
                                onLoginClick();
                            } else {
                                const contactElem = document.getElementById('contact');
                                if (contactElem) contactElem.scrollIntoView({ behavior: 'smooth' });
                            }
                        }}
                        className="relative group px-5 py-2 rounded-full text-xs font-bold tracking-wide text-white bg-[#607C3C] hover:bg-[#506832] transition-all duration-300 shadow-[0_4px_16px_rgba(96,124,60,0.25)] hover:shadow-[0_6px_20px_rgba(96,124,60,0.4)] active:scale-95"
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            Sign In
                        </span>
                    </button>
                </div>
            </motion.nav>
        </header>
    );
};

export default Navbar;