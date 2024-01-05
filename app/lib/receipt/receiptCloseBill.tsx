import jsPDF from "jspdf";
import '@/app/lib/receipt/THSarabunNew-normal';
import { orderBillDataType } from "@/app/api/customerFront/getOrderBill";

interface Props {
    orderBill: orderBillDataType;
}
export const receiptCloseBill = async ({orderBill } : Props) => {
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
    addText(orderBill.orderTotalBill.toString(), 30, 16);


    const pdfBlob = pdf.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
 
    const newTab = window.open(pdfUrl, '_blank');

    newTab?.addEventListener('beforeunload', () => {
        URL.revokeObjectURL(pdfUrl);
    });
};
