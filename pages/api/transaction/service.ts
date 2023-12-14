import { dataVerifyTransaction } from "@/types/verify";
import { fetchTransactionAll, fetchTransactionByBranchId, fetchTransactionByCompanyId, fetchTransactionById } from "@/utils/transaction";
import { NextApiResponse } from "next";

export const handleAddTransaction = async (body: dataVerifyTransaction, res: NextApiResponse) => {
    // VerifyUnitData
    // const verifyUnit = verifyUnitBody(body);
    // if (verifyUnit.length > 0) return res.status(404).json({ message: {message: `ไม่พบข้อมูล branchId`}, unit: null, status: false });

    return res.status(200).json({ message: "Data saved successfully.", transactionItem: null, status: true });
}


export const handleGetTransactionByBranchId = async (res: NextApiResponse, branchId: number) => {
    if(!branchId) return res.status(200).json({ message: {message: `ไม่พบข้อมูล branchId`}, transactionItem: null, status: false });
    // fetch dataOrderBy Branch 
    const transactionOrder = await fetchTransactionByBranchId(branchId);

    return res.status(200).json({ message: "Tables found", transactionItem: transactionOrder, status: true });
}

export const handleGetTransactionByCompanyId = async (res: NextApiResponse, companyId: number) => {
    if(!companyId) return res.status(200).json({ message: {message: `ไม่พบข้อมูล companyId`}, transactionItem: null, status: false });
    // fetch dataOrderBy Branch 
    const transactionOrder = await fetchTransactionByCompanyId(companyId);

    return res.status(200).json({ message: "Tables found", transactionItem: transactionOrder, status: true });
}

export const handleGetTransactionById = async (res: NextApiResponse, id: string) => {
    if(!id) return res.status(200).json({ message: {message: `ไม่พบข้อมูล id`}, transactionItem: null, status: false });
    // fetch dataOrderBy Branch 
    const transactionOrder = await fetchTransactionById(id);

    return res.status(200).json({ message: "Tables found", transactionItem: transactionOrder, status: true });
}

export const handleGetTransactionAll = async (res: NextApiResponse) => {
    // fetch dataOrderAll
    const transactionOrder = await fetchTransactionAll();

    return res.status(200).json({ message: "Tables found", transactionItem: transactionOrder, status: true });
}