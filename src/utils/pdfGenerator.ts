import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Format mata uang rupiah
const formatRupiah = (num: number): string => {
    return 'Rp ' + Number(num).toLocaleString('id-ID');
};

/**
 * Generate Invoice / Bukti Bayar IPL RT 05 dalam format PDF Blob URL
 */
export const generateInvoicePdfUrl = (bill: any, user: any): string => {
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
    });

    const isPaid = bill.status === 'LUNAS' || bill.rawStatus === 'paid';
    const period = bill.period || bill.title?.replace('IPL Periode ', '') || '2026-11';
    const totalAmount = bill.total || bill.amountNum || 85000;
    const wasteFee = bill.wasteFee || 35000;
    const securityFee = bill.securityFee || 30000;
    const rtFund = bill.rtFund || 20000;
    const invoiceNo = `WP-INV/${period.replace('-', '')}/${bill.rawId || bill.id || '01'}`;

    // Header Latar Brand Hijau
    doc.setFillColor(33, 46, 27); // #212E1B
    doc.rect(0, 0, 210, 34, 'F');

    // Teks Brand
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text('WARGAPAY', 14, 15);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(197, 220, 182);
    doc.text('Sistem Tata Kelola Lingkungan RT 05 / RW 08 - Klaster Diamond', 14, 22);
    doc.text('Kelurahan Cibubur, Jakarta Timur • Email: admin@wargapay.id', 14, 27);

    // Judul Dokumen
    doc.setTextColor(33, 46, 27);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('INVOICE / BUKTI TAGIHAN IURAN IPL', 14, 46);

    // Garis pemisah
    doc.setDrawColor(96, 124, 60);
    doc.setLineWidth(0.8);
    doc.line(14, 49, 196, 49);

    // Meta Info 2 Kolom
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(60, 75, 50);
    doc.text('INFORMASI TAGIHAN', 14, 57);
    doc.text('DATA WARGA & UNIT', 115, 57);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);
    doc.text(`Nomor Invoice : ${invoiceNo}`, 14, 63);
    doc.text(`Periode Iuran : ${period}`, 14, 69);
    doc.text(`Tanggal Terbit : 01 ${period}`, 14, 75);
    doc.text(`Jatuh Tempo   : 10 ${period}`, 14, 81);

    const residentName = user?.name || bill.resident || 'Bpk. Budi Santoso';
    const residentEmail = user?.email || 'warga@wargapay.id';
    doc.text(`Nama Kepala KK : ${residentName}`, 115, 63);
    doc.text(`Alamat / Unit  : Klaster Diamond Blok Hunian`, 115, 69);
    doc.text(`Email Warga    : ${residentEmail}`, 115, 75);
    doc.text(`Metode Bayar   : Midtrans QRIS / VA Otomatis`, 115, 81);

    // Tabel Rincian Alokasi Dues
    autoTable(doc, {
        startY: 88,
        head: [['No', 'Uraian Komponen Iuran IPL', 'Alokasi Penggunaan', 'Nominal']],
        body: [
            ['1', 'Iuran Kebersihan Lingkungan & Sampah', 'Armada Pengangkutan 3x seminggu & TPS', formatRupiah(wasteFee)],
            ['2', 'Iuran Keamanan & Satpam Lingkungan', 'Pengamanan 24 Jam & Pos Jaga Portal RT', formatRupiah(securityFee)],
            ['3', 'Dana Kas & Perawatan Sarana RT 05', 'Penerangan Jalan Umum (PJU) & Taman', formatRupiah(rtFund)],
        ],
        foot: [
            ['', 'TOTAL TAGIHAN IPL', '', formatRupiah(totalAmount)]
        ],
        theme: 'striped',
        headStyles: {
            fillColor: [96, 124, 60],
            textColor: [255, 255, 255],
            fontStyle: 'bold',
            fontSize: 9,
        },
        footStyles: {
            fillColor: [240, 244, 235],
            textColor: [33, 46, 27],
            fontStyle: 'bold',
            fontSize: 10,
        },
        styles: {
            fontSize: 9,
            cellPadding: 3.5,
        },
        columnStyles: {
            0: { cellWidth: 12, halign: 'center' },
            1: { cellWidth: 80 },
            2: { cellWidth: 60 },
            3: { cellWidth: 30, halign: 'right' },
        },
    });

    // Stempel Status Pembayaran (Watermark / Badge)
    const finalY = (doc as any).lastAutoTable?.finalY || 135;

    if (isPaid) {
        doc.setDrawColor(47, 97, 30); // Hijau
        doc.setFillColor(237, 245, 232);
        doc.roundedRect(14, finalY + 8, 80, 22, 3, 3, 'FD');

        doc.setTextColor(47, 97, 30);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(13);
        doc.text('STATUS: LUNAS', 22, finalY + 18);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.text('Terverifikasi Sistem Midtrans / Kas RT', 22, finalY + 24);
    } else {
        doc.setDrawColor(230, 81, 0); // Oranye
        doc.setFillColor(255, 243, 224);
        doc.roundedRect(14, finalY + 8, 80, 22, 3, 3, 'FD');

        doc.setTextColor(230, 81, 0);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.text('STATUS: BELUM LUNAS', 19, finalY + 18);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.text('Silakan lakukan pembayaran QRIS/VA', 19, finalY + 24);
    }

    // Tanda Tangan Pengurus RT
    doc.setTextColor(40, 50, 35);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text('Jakarta Timur, ' + new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }), 135, finalY + 12);
    doc.text('Pengurus RT 05 Cluster Diamond,', 135, 17 + finalY);

    // Stempel Digital
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(96, 124, 60);
    doc.text('[ STEMPEL DIGITAL RT 05 ]', 135, finalY + 30);

    doc.setTextColor(33, 46, 27);
    doc.text('Bpk. Hendra Wijaya', 135, finalY + 37);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text('Ketua RT 05 / RW 08', 135, finalY + 41);

    // Footer Dokumen
    doc.setDrawColor(220, 225, 215);
    doc.line(14, 275, 196, 275);
    doc.setFontSize(7.5);
    doc.setTextColor(130, 140, 125);
    doc.text('Dokumen ini diterbitkan secara otomatis oleh Sistem Pembukuan WargaPay RT 05. Sah tanpa tanda tangan basah.', 14, 281);
    doc.text(`Waktu Cetak: ${new Date().toLocaleString('id-ID')} • Halaman 1 dari 1`, 196, 281, { align: 'right' });

    // Hasilkan Blob URL untuk preview langsung di iframe
    const blob = doc.output('blob');
    return URL.createObjectURL(blob);
};

/**
 * Generate Kuitansi Pengeluaran Buku Kas RT 05 dalam format PDF Blob URL
 */
export const generateExpenseReceiptPdfUrl = (expense: any): string => {
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
    });

    const receiptNo = expense.receiptNo || expense.receipt_ref || `RCP-EXP-${expense.id || '01'}`;
    const amount = expense.amount || 450000;
    const vendor = expense.vendor || 'Penyedia Jasa Lingkungan';
    const title = expense.title || 'Pengeluaran Kas RT 05';
    const category = expense.category || 'Operasional Sanitasi';
    const date = expense.date || new Date().toISOString().slice(0, 10);

    // Header Kuitansi
    doc.setFillColor(33, 46, 27);
    doc.rect(0, 0, 210, 32, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('KAS RT 05 KLASTER DIAMOND', 14, 14);

    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(197, 220, 182);
    doc.text('Kuitansi Resmi Pengeluaran Anggaran Kas Warga • WargaPay Accounting', 14, 21);
    doc.text('Transparansi Kas Bersama Warga RT 05 / RW 08', 14, 26);

    // Judul
    doc.setTextColor(33, 46, 27);
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text('KUITANSI PENGELUARAN BUKU KAS RT', 14, 44);

    doc.setDrawColor(96, 124, 60);
    doc.setLineWidth(0.8);
    doc.line(14, 47, 196, 47);

    // Data Kuitansi
    autoTable(doc, {
        startY: 54,
        head: [['PARAMETER', 'KETERANGAN TRANSAKSI']],
        body: [
            ['Nomor Bukti Kuitansi', receiptNo],
            ['Kategori Anggaran', category],
            ['Uraian Pengeluaran', title],
            ['Dibayarkan Kepada / Vendor', vendor],
            ['Tanggal Transaksi', date],
            ['Jumlah Nominal', formatRupiah(amount)],
            ['Status Pencatatan', 'VERIFIED & LUNAS DALAM BUKU KAS BERSAMA RT 05'],
            ['Keterangan Tambahan', expense.details || 'Biaya operasional resmi yang telah diapprove dan dicatat dalam pembukuan kas RT.'],
        ],
        theme: 'grid',
        headStyles: {
            fillColor: [96, 124, 60],
            textColor: [255, 255, 255],
            fontStyle: 'bold',
            fontSize: 9,
        },
        styles: {
            fontSize: 9,
            cellPadding: 4,
        },
        columnStyles: {
            0: { cellWidth: 55, fontStyle: 'bold', textColor: [50, 60, 45] },
            1: { cellWidth: 127 },
        },
    });

    const finalY = (doc as any).lastAutoTable?.finalY || 140;

    // Kotak Total Besar
    doc.setDrawColor(96, 124, 60);
    doc.setFillColor(245, 248, 242);
    doc.roundedRect(14, finalY + 8, 182, 20, 3, 3, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(50, 70, 40);
    doc.text('JUMLAH PENGELUARAN DIBAYAR:', 20, finalY + 18);

    doc.setFontSize(14);
    doc.setTextColor(96, 124, 60);
    doc.text(formatRupiah(amount), 190, finalY + 19, { align: 'right' });

    // Kolom Tanda Tangan
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 70, 55);

    doc.text('Penerima Pembayaran,', 25, finalY + 40);
    doc.text(vendor, 25, finalY + 62);
    doc.line(25, finalY + 64, 75, finalY + 64);

    doc.text('Bendahara RT 05,', 90, finalY + 40);
    doc.text('Ibu Dewi Sartika', 90, finalY + 62);
    doc.line(90, finalY + 64, 135, finalY + 64);

    doc.text('Mengetahui: Ketua RT 05,', 145, finalY + 40);
    doc.text('Bpk. Hendra Wijaya', 145, finalY + 62);
    doc.line(145, finalY + 64, 192, finalY + 64);

    // Footer
    doc.setDrawColor(220, 225, 215);
    doc.line(14, 275, 196, 275);
    doc.setFontSize(7.5);
    doc.setTextColor(130, 140, 125);
    doc.text('Kuitansi ini di-generate otomatis oleh WargaPay Financial System RT 05 Cluster Diamond.', 14, 281);
    doc.text(`Waktu Cetak: ${new Date().toLocaleString('id-ID')}`, 196, 281, { align: 'right' });

    const blob = doc.output('blob');
    return URL.createObjectURL(blob);
};

/**
 * Generate Laporan Kas RT 05 Bulanan
 */
export const generateKasReportPdfUrl = (expenses: any[], totalRevenue: number): string => {
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
    });

    // Header
    doc.setFillColor(33, 46, 27);
    doc.rect(0, 0, 210, 32, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('LAPORAN KAS & KEUANGAN RT 05', 14, 15);

    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(197, 220, 182);
    doc.text('Transparansi Kas Bersama Warga Klaster Diamond • WargaPay Open Finance', 14, 22);

    const rows = expenses.map((exp, i) => [
        String(i + 1),
        exp.date || '2026-11',
        exp.category || 'Operasional',
        exp.title || 'Pengeluaran',
        exp.vendor || 'Vendor Lingkungan',
        formatRupiah(exp.amount || 0)
    ]);

    const totalExpense = expenses.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
    const sisaKas = (totalRevenue || 42500000) - totalExpense;

    autoTable(doc, {
        startY: 42,
        head: [['No', 'Tanggal', 'Kategori', 'Uraian Pengeluaran', 'Penerima / Vendor', 'Nominal']],
        body: rows,
        foot: [
            ['', '', '', 'TOTAL PENGELUARAN KAS', '', formatRupiah(totalExpense)]
        ],
        theme: 'striped',
        headStyles: {
            fillColor: [96, 124, 60],
            textColor: [255, 255, 255],
            fontSize: 8.5,
        },
        styles: {
            fontSize: 8,
            cellPadding: 2.8,
        },
        columnStyles: {
            0: { cellWidth: 10, halign: 'center' },
            1: { cellWidth: 24 },
            2: { cellWidth: 28 },
            3: { cellWidth: 60 },
            4: { cellWidth: 35 },
            5: { cellWidth: 25, halign: 'right' },
        }
    });

    const finalY = (doc as any).lastAutoTable?.finalY || 150;

    // Ringkasan Posisi Kas
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(40, 55, 30);
    doc.text(`Total Pemasukan Iuran Lunas : ${formatRupiah(totalRevenue || 42500000)}`, 14, finalY + 10);
    doc.text(`Total Beban Pengeluaran    : ${formatRupiah(totalExpense)}`, 14, finalY + 16);
    doc.text(`Saldo Kas Bersih Lingkungan : ${formatRupiah(sisaKas)}`, 14, finalY + 22);

    // Footer
    doc.setFontSize(7.5);
    doc.setTextColor(130, 140, 125);
    doc.text('Laporan kas ini disajikan secara terbuka untuk seluruh warga RT 05 Klaster Diamond.', 14, 281);

    const blob = doc.output('blob');
    return URL.createObjectURL(blob);
};

