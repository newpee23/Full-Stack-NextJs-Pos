import jsPDF from "jspdf";
import QRCode from 'qrcode';

export const generatePdf = async () => {
    const pdf = new jsPDF({
        format: [80, 200],
        unit: 'mm',
    });

    // Function to add text to the PDF and handle page breaks
    const addText = (text: string, x: number, y: number) => {
        const lineHeight = 10;
        const remainingHeight = pdf.internal.pageSize.height - y;

        if (remainingHeight < lineHeight) {
            pdf.addPage();
            y = 15;
        }

        // Set the font size (adjust this value based on your requirements)
        pdf.setFontSize(12);

        pdf.text(text, x, y);
    };

    addText("บริษัทนิวจำกัด", 0, 15);
    addText("สาขารามอินทรา 21", 0, 40);
    addText("----------------------------------------", 0, 45);

    const qrCodeData = 'https://example.com';
    const qrCodeSize = 30;
    const qrCodeX = 25;
    const qrCodeY = 100;

    const qrCodeDataUrl = await QRCode.toDataURL(qrCodeData, { width: qrCodeSize });

    pdf.addImage(qrCodeDataUrl, 'PNG', qrCodeX, qrCodeY, qrCodeSize, qrCodeSize);

    const pdfBlob = pdf.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);

    const newTab = window.open(pdfUrl, '_blank');

    newTab?.addEventListener('beforeunload', () => {
        URL.revokeObjectURL(pdfUrl);
    });
};
