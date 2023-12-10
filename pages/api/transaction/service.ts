import { fetchTransactionByBranchId } from "@/utils/transaction";
import { NextApiResponse } from "next";

export const handleGetTransactionByBranchId = async (res: NextApiResponse, branchId: number) => {
    if(!branchId) return res.status(200).json({ message: {message: `ไม่พบข้อมูล branchId`}, transactionItem: null, status: false });
    // fetch dataOrderBy Branch 
    const transactionOrder = await fetchTransactionByBranchId(branchId);

    return res.status(200).json({ message: "Tables found", transactionItem: transactionOrder, status: true });
}