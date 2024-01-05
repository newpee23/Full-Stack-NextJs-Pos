import { getCompanyById } from "@/utils/company";
import { fetchDetailReceiptByCompanyId } from "@/utils/detailReceipt";
import { NextApiResponse } from "next";

export const handleGetDetailReceiptByCompanyId = async (res: NextApiResponse, companyId: number, branchId: number, transactionId: string) => {
    // check CompanyId
    const checkCompany = await getCompanyById(companyId);
    if (!checkCompany) return res.status(404).json({ message: [{ message: `ไม่พบข้อมูลบริษัทที่มีรหัส : ${companyId}` }], DetailReceipt: null, status: false });
    // fetchDetailReceipt
    const dataDetailReceipt = await fetchDetailReceiptByCompanyId(companyId,branchId,transactionId);
    if(!dataDetailReceipt) return res.status(404).json({ message: [{ message: `พบข้อผิดพลาด : handleGetDetailReceiptByCompanyId` }], DetailReceipt: null, status: false });

    return res.status(200).json({ message: [{ message: "พบข้อมูลรายละเอียดใบเสร็จ" }], DetailReceipt: dataDetailReceipt, status: true });
}