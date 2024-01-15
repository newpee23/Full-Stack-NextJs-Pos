import { resultRpSummaryOfBranch } from "@/types/fetchData";
import * as XLSX from "xlsx";

export const exportRpSummaryOfBranchTableToExcel = (data: resultRpSummaryOfBranch[] , startDate: string, endDate: string) => {
    const wb: XLSX.WorkBook = XLSX.utils.book_new();

    // ข้อมูลที่จะถูกแปลงเป็น Excel
    const jsonData = data.map((items) => {
        return {
            "ลำดับที่": items.index,
            "ชื่อสาขา": items.branchName,
            "จำนวนผู้มาใช้บริการ": items.toalPeoples,
            "ยอดขายรวมทั้งสาขา": items.totalPrice,
        };
    });

    // แปลง JSON เป็นชีท
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonData, { header: ['ลำดับที่', 'ชื่อสาขา', 'จำนวนผู้มาใช้บริการ', 'ยอดขายรวมทั้งสาขา'] })!;

    // กำหนดความกว้างของแต่ละคอลัมน์
    ws['!cols'] = [
        { width: 10 }, // ลำดับที่
        { width: 50 }, // ชื่อสาขา
        { width: 30 }, // จำนวนผู้มาใช้บริการ
        { width: 30 }, // ยอดขายรวมทั้งสาขา
    ];

    // เพิ่มชีทลงใน Workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Comments');

    // บันทึกไฟล์ Excel
    XLSX.writeFile(wb, `รายงานสรุปยอดขายประจำสาขา${startDate}-${endDate}.xlsx`);
};