import jsPDF from "jspdf";
import QRCode from 'qrcode';
import '@/app/lib/receipt/THSarabunNew-normal';
import { detailReceiptType, orderTransactionAdd } from "@/types/fetchData";
import { getDate, getTime7H } from "@/utils/utils";

interface Props {
    details: orderTransactionAdd;
    page: "modalAdd" | "tableTransaction";
    detailReceipt: detailReceiptType;
}


export const generatePdf = async ({ details, page, detailReceipt }: Props) => {

    const pdf = new jsPDF({
        format: [80, 110],
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
    

    // Add your image
    const imageUrl = "/images/moonlamplogo.png";
    const imageWidth = 45;
    const imageHeight = 8;
    const imageX = 18;
    const imageY = 5; // Adjust the value based on your preference

    // Add the image to the PDF
    pdf.addImage(imageUrl, 'PNG', imageX, imageY, imageWidth, imageHeight);


    addText(`${detailReceipt.companyName}`, 20, 16);
    addText(`${detailReceipt.branchName}`, 25, 14);
    addText(`เวลาเริ่มต้น ${getDate(detailReceipt.startOrder.toString())} ${getTime7H(detailReceipt.startOrder.toString())}`, 30, 14);
    addText("------------------------------------------------------------------------", 35, 14);
    addText(`${detailReceipt.tableName}`, 42, 16);
    // QrCode
    const qrCodeData = `${process.env.NEXT_PUBLIC_BASE_URL_FRONT}/customerFront/${page === "modalAdd" ? details?.tokenOrder : details.transactionOrder?.tokenOrder}`;
    const qrCodeSize = 30;
    const qrCodeX = 25;
    const qrCodeY = 45;

    const qrCodeDataUrl = await QRCode.toDataURL(qrCodeData, { width: qrCodeSize });

    pdf.addImage(qrCodeDataUrl, 'PNG', qrCodeX, qrCodeY, qrCodeSize, qrCodeSize);
    // Text
    addText("(สแกนเพื่อสั่งอาหาร)" + qrCodeData, 80, 16);
    addText(`เวลาสั่งอาหาร ${detailReceipt.expiration} นาที (${detailReceipt.peoples} ท่าน)`, 85, 14);
    addText(`เวลาสิ้นสุด ${getDate(detailReceipt.endOrder.toString())} ${getTime7H(detailReceipt.endOrder.toString())}`, 90, 14);

    const pdfBlob = pdf.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);

    const newTab = window.open(pdfUrl, '_blank');

    newTab?.addEventListener('beforeunload', () => {
        URL.revokeObjectURL(pdfUrl);
    });
};
