import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, X, Download, Printer, ExternalLink } from 'lucide-react';

interface PdfViewerModalProps {
    isOpen: boolean;
    onClose: () => void;
    pdfUrl: string | null;
    title: string;
    fileName?: string;
}

export const PdfViewerModal: React.FC<PdfViewerModalProps> = ({
    isOpen,
    onClose,
    pdfUrl,
    title,
    fileName = 'Dokumen-WargaPay.pdf',
}) => {
    if (!isOpen || !pdfUrl) return null;

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handlePrint = () => {
        const iframe = document.getElementById('pdf-preview-iframe') as HTMLIFrameElement;
        if (iframe && iframe.contentWindow) {
            iframe.contentWindow.focus();
            iframe.contentWindow.print();
        } else {
            window.open(pdfUrl, '_blank');
        }
    };

    const handleOpenExternal = () => {
        window.open(pdfUrl, '_blank');
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[99999] flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/70 backdrop-blur-xs">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 15 }}
                    transition={{ duration: 0.2 }}
                    className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-5xl h-[92vh] flex flex-col overflow-hidden shadow-2xl border border-[#C5D5BE]"
                >
                    {/* Top Bar Previewer */}
                    <div className="p-3.5 sm:p-4 px-4 sm:px-6 bg-[#212E1B] text-white flex items-center justify-between shrink-0 shadow-md">
                        <div className="flex items-center gap-3 min-w-0">
                            <div className="w-9 h-9 rounded-xl bg-[#607C3C]/40 border border-[#8FB164] flex items-center justify-center text-white shrink-0">
                                <FileText className="w-5 h-5" />
                            </div>
                            <div className="min-w-0">
                                <h3 className="font-extrabold text-sm sm:text-base text-white truncate leading-tight">
                                    {title}
                                </h3>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                            <button
                                type="button"
                                onClick={handlePrint}
                                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-xs font-bold text-white transition-all flex items-center gap-1.5 cursor-pointer"
                                title="Cetak Dokumen"
                            >
                                <Printer className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Cetak</span>
                            </button>

                            <button
                                type="button"
                                onClick={handleDownload}
                                className="px-3 py-1.5 rounded-xl bg-[#607C3C] hover:bg-[#4E6830] active:scale-95 text-xs font-bold text-white transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                                title="Unduh PDF"
                            >
                                <Download className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Unduh</span>
                            </button>

                            <button
                                type="button"
                                onClick={handleOpenExternal}
                                className="p-1.5 rounded-xl text-[#A6C495] hover:text-white hover:bg-white/10 transition-colors cursor-pointer hidden md:flex"
                                title="Buka di Tab Baru"
                            >
                                <ExternalLink className="w-4 h-4" />
                            </button>

                            <div className="h-5 w-px bg-white/20 mx-0.5 sm:mx-1" />

                            <button
                                type="button"
                                onClick={onClose}
                                className="p-1.5 rounded-xl text-white/70 hover:text-white hover:bg-white/15 transition-colors cursor-pointer"
                                title="Tutup Modal"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* PDF Embedded Frame (3rd Party / Engine Preview) */}
                    <div className="flex-1 w-full h-full bg-[#3F483D] relative overflow-hidden flex items-center justify-center">
                        <iframe
                            id="pdf-preview-iframe"
                            src={`${pdfUrl}#toolbar=1&navpanes=0`}
                            className="w-full h-full border-none bg-white"
                            title={title}
                        />
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

