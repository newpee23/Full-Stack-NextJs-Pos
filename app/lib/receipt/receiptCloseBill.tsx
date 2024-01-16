import jsPDF from "jspdf";
import '@/app/lib/receipt/THSarabunNew-normal';
import { orderBillDataType } from "@/app/api/customerFront/getOrderBill";
import { detailReceiptType } from "@/types/fetchData";
import { getDate, getTime7H } from "@/utils/utils";

interface Props {
    orderBill: orderBillDataType;
    detailReceipt: detailReceiptType;
}

const imageUrl = "/images/moonlamplogo.png";
const imageWidth = 45;
const imageHeight = 8;
const imageX = 18;
const imageY = 5;
let xPositionsArr = [4, 60];
let yPaper = 0;

export const receiptCloseBill = async ({ orderBill, detailReceipt }: Props) => {
    yPaper = 90;
    orderBill.orderBillData.map(item => {
        yPaper += 5;
        item.ItemTransactions.map(() => {
            yPaper += 10;
        })
    });
    yPaper += 10;

    const pdf = new jsPDF({
        format: [80, yPaper],
        unit: 'mm',
    });

    // Define the font
    pdf.addFont("THSarabunNew-normal.ttf", "THSarabunNew-normal", "normal");

    // Set the font to THSarabunNew-normal
    pdf.setFont("THSarabunNew-normal");

    // Function to add text to the PDF and handle page breaks
    const addText = (text: string, y: number, fontSize: number = 12,x?: number) => {
        const lineHeight = 10;
        const textWidth = pdf.getStringUnitWidth(text) * fontSize / pdf.internal.scaleFactor;
        const xx = (pdf.internal.pageSize.width - textWidth) / 2;

        const remainingHeight = pdf.internal.pageSize.height - y;

        if (remainingHeight < lineHeight) {
            pdf.addPage();
            y = 15;
        }

        // Set the font size
        pdf.setFontSize(fontSize);

        pdf.text(text, x? x : xx, y);
    };

    const addTextXPositionsArr = (texts: string[], xPositions: number[], y: number, fontSize: number = 12) => {
        const lineHeight = 10;

        const remainingHeight = pdf.internal.pageSize.height - y;

        if (remainingHeight < lineHeight) {
            pdf.addPage();
            y = 15;
        }

        // Set the font size
        pdf.setFontSize(fontSize);

        // Display each text at the specified x position
        texts.forEach((text, index) => {
            const x = xPositions[index];
            pdf.text(text, x, y);
        });
    };

    // Add the image to the PDF
    pdf.addImage(imageUrl, 'PNG', imageX, imageY, imageWidth, imageHeight);

    addText(`${detailReceipt.companyName}`, 20, 16);
    addText(`${detailReceipt.branchName}`, 26, 14);
    addText(`เวลาเริ่มต้น ${getDate(detailReceipt.startOrder.toString())} ${getTime7H(detailReceipt.startOrder.toString())}`, 31, 14);
    addText(`เวลาหมดอายุ ${getDate(detailReceipt.endOrder.toString())} ${getTime7H(detailReceipt.endOrder.toString())}`, 36, 14);
    addText("------------------------------------------------------------------------", 41, 14);
    addText(`${detailReceipt.tableName} (${detailReceipt.peoples} ท่าน)`, 47, 16);
    // list Order

    let yPositionsList = 62;
    addTextXPositionsArr(["รายการ", "จำนวนเงิน"], xPositionsArr, 57, 14);
    orderBill.orderBillData.sort((a, b) => a.id - b.id);
    orderBill.orderBillData.map(item => {
        addText(`รายละเอียดบิลที่ ${item.index} ${item.status === "cancel" ? "ยกเลิก" : ""}`, yPositionsList, 13, 4);
        yPositionsList += 5;
        item.ItemTransactions.map((detail, index) => {
            addText(`${(index+1)}.${detail.productName ? detail.productName : detail.promotionName}`, yPositionsList, 12, 6);
            yPositionsList += 5;
            addText(`จำนวน ${detail.qty} * ${detail.price} ${detail.unitName}`, yPositionsList, 13, 8);
            addText(`${item.status !== "cancel" ? detail.qty * detail.price : 0}`, yPositionsList, 12, 65);
            yPositionsList += 5;
        })
    });

    yPositionsList += 5;
    addText("------------------------------------------------------------------------", yPositionsList, 14);
    yPositionsList += 5;
    addText(`ราคาสุทธิ ${orderBill.orderTotalBill.toString()} บาท`, yPositionsList, 16);
    yPositionsList += 6;
    addText(`ชำระเมื่อ : ${getDate(new Date().toString())} ${getTime7H(new Date().toString())}`, yPositionsList, 14);

    const pdfBlob = pdf.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);

    const newTab = window.open(pdfUrl, '_blank');

    newTab?.addEventListener('beforeunload', () => {
        URL.revokeObjectURL(pdfUrl);
    });
};
