import jsPDF from "jspdf";
import QRCode from 'qrcode';
import '@/app/lib/receipt/THSarabunNew-normal';
import { orderTransactionAdd, orderTransactionByBranch } from "@/types/fetchData";

interface Props {
    details: orderTransactionAdd;
    page: "modalAdd" | "tableTransaction";
}
export const generatePdf = async ({details , page} : Props) => {
    const pdf = new jsPDF({
        format: [80, 90],
        unit: 'mm',
    });

    // Define the font
    pdf.addFont("THSarabunNew-normal.ttf", "THSarabunNew-normal", "normal");

    // Set the font to THSarabunNew-normal
    pdf.setFont("THSarabunNew-normal");

    // Function to add text to the PDF and handle page breaks
    const addText = (text: string, y: number, fontSize: number = 12) => {
        const lineHeight = 10;
        const textWidth = pdf.getStringUnitWidth(text) * fontSize / pdf.internal.scaleFactor;
        const x = (pdf.internal.pageSize.width - textWidth) / 2;

        const remainingHeight = pdf.internal.pageSize.height - y;

        if (remainingHeight < lineHeight) {
            pdf.addPage();
            y = 15;
        }

        // Set the font size
        pdf.setFontSize(fontSize);

        pdf.text(text, x, y);
    };

    addText("บริษัทนิวจำกัด", 10, 16);
    addText("สาขารามอินทรา 21", 15, 14);
    addText("เวลาเริ่มต้น 18/12/2023 21:00", 20, 14);
    addText("------------------------------------------------------------------------", 25, 14);
    addText("โต๊ะที่ 1", 30, 16);
    // QrCode
    const qrCodeData = `${process.env.NEXT_PUBLIC_BASE_URL_FRONT}/customerFront/${page === "modalAdd" ? details?.tokenOrder : details.transactionOrder?.tokenOrder }`;
    const qrCodeSize = 30;
    const qrCodeX = 25;
    const qrCodeY = 30;

    const qrCodeDataUrl = await QRCode.toDataURL(qrCodeData, { width: qrCodeSize });

    pdf.addImage(qrCodeDataUrl, 'PNG', qrCodeX, qrCodeY, qrCodeSize, qrCodeSize);
    // Text
    addText("(สแกนเพื่อสั่งอาหาร)", 64, 16);
    addText("เวลาสั่งอาหาร 120 นาที (4 ท่าน)", 70, 14);
    addText("เวลาสิ้นสุด 18/12/2023 24:00", 76, 14);

    const pdfBlob = pdf.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
 
    const newTab = window.open(pdfUrl, '_blank');

    newTab?.addEventListener('beforeunload', () => {
        URL.revokeObjectURL(pdfUrl);
    });
};
