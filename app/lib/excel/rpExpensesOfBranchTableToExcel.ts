
import { resultRpExpensesOfBranch } from "@/types/fetchData";
import * as XLSX from "xlsx";

export const exportRpExpensesOfBranchTableToExcel = (data: resultRpExpensesOfBranch[] , startDate: string, endDate: string) => {
    const wb: XLSX.WorkBook = XLSX.utils.book_new();

    // ข้อมูลที่จะถูกแปลงเป็น Excel
    const jsonData = data.map((items) => {
        return {
            "ลำดับที่": items.index,
            "ชื่อสาขา": items.branchs.name,
            "ค่าใช้จ่าย": items.expenses.name,
            "จำนวน (บาท)": items.price,
            "วันเวลาที่ใช้จ่าย": items.orderShow
        };
    });

    // แปลง JSON เป็นชีท
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonData, { header: ['ลำดับที่', 'ชื่อสาขา', 'ค่าใช้จ่าย', 'จำนวน (บาท)', 'วันเวลาที่ใช้จ่าย'] })!;

    // กำหนดความกว้างของแต่ละคอลัมน์
    ws['!cols'] = [
        { width: 10 }, // ลำดับที่
        { width: 40 }, // ชื่อสาขา
        { width: 40 }, // ค่าใช้จ่าย
        { width: 30 }, // จำนวน (บาท)
        { width: 30 }, // วันเวลาที่ใช้จ่าย
    ];

    // เพิ่มชีทลงใน Workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Comments');

    // บันทึกไฟล์ Excel
    XLSX.writeFile(wb, `รายงานสรุปค่าใช้จ่ายประจำสาขา${startDate}-${endDate}.xlsx`);
};