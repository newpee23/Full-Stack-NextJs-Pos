import { dataVerifyTransaction } from "@/types/verify";
import { getBranchById } from "@/utils/branch";
import { getEmployeeById } from "@/utils/employee";
import { closeDataTransaction, createTokenTransaction, fetchDataFrontDetailByTransactionId, fetchTransactionAll, fetchTransactionByBranchId, fetchTransactionByCompanyId, fetchTransactionById, insertTransaction, updateTokenOrderTransaction, verifyTransactionBody } from "@/utils/transaction";
import { NextApiResponse } from "next";

export const handleAddTransaction = async (body: dataVerifyTransaction, res: NextApiResponse) => {
    // VerifyUnitData
    const verifyTransaction = verifyTransactionBody(body);
    if (verifyTransaction.length > 0) return res.status(404).json({ message: verifyTransaction, transactionItem: null, status: false });
    // check Branch
    const checkBranch = await getBranchById(body.branchId);
    if(!checkBranch) return res.status(404).json({ message:{ message: `ไม่พบข้อมูล branchId`}, transactionItem: null, status: false });
    // check employeeId
    const checkEmployee = await getEmployeeById(body.employeeId);
    if(!checkEmployee) return res.status(404).json({ message:{ message: `ไม่พบข้อมูล checkEmployeeId`}, transactionItem: null, status: false });
    // Add Transaction
    const addTransaction = await insertTransaction(body);
    if (!addTransaction) return res.status(404).json({ message: "An error occurred saving data.", transactionItem: null, status: false });
    // Create Token
    const tokenOrder = await createTokenTransaction({id: addTransaction.id, tableId: addTransaction.tableId});
    if (!tokenOrder) return res.status(404).json({ message: "An error occurred tokenOrder data.", transactionItem: null, status: false });
    // Update Token
    const updateToken = await updateTokenOrderTransaction({id: addTransaction.id, tokenOrder: tokenOrder});
    if (!updateToken) return res.status(404).json({ message: "An error occurred updateTokenOrder data.", transactionItem: null, status: false });
   
    return res.status(200).json({ message: "Data saved successfully.", transactionItem: updateToken, status: true });
}

export const handleCloseTransaction = async (id: string, res: NextApiResponse) => {
    if (!id) return res.status(404).json({ message: [{message: "Please specify transactionId."}], transactionItem: null, status: false });
    const transaction = await fetchTransactionById(id);
    if (!transaction) return res.status(404).json({ message: `No transaction found with Id : ${id}`, transactionItem: null, status: false });
    if (!transaction.transactionOrder?.id) return res.status(404).json({ message: `No transactionOrder found with Id : ${id}`, transactionItem: null, status: false });
    const closeTransaction = await closeDataTransaction(transaction.transactionOrder?.id);
    if (!closeTransaction) return res.status(404).json({ message: "An error occurred deleting data.", transactionItem: null, status: false });

    return res.status(200).json({ message: "Successfully deleted data", transactionItem: closeTransaction, status: true });
}

export const handleGetTransactionByBranchId = async (res: NextApiResponse, branchId: number) => {
    if(!branchId) return res.status(200).json({ message: [{message: `ไม่พบข้อมูล branchId`}], transactionItem: null, status: false });
    // fetch dataOrderBy Branch 
    const transactionOrder = await fetchTransactionByBranchId(branchId);

    return res.status(200).json({ message: "Tables found", transactionItem: transactionOrder, status: true });
}

export const handleGetTransactionByCompanyId = async (res: NextApiResponse, companyId: number) => {
    if(!companyId) return res.status(200).json({ message:[{message: `ไม่พบข้อมูล companyId`}], transactionItem: null, status: false });
    // fetch dataOrderBy Branch 
    const transactionOrder = await fetchTransactionByCompanyId(companyId);

    return res.status(200).json({ message: "Tables found", transactionItem: transactionOrder, status: true });
}

export const handleGetTransactionById = async (res: NextApiResponse, id: string) => {
    if(!id) return res.status(200).json({ message: [{message: `ไม่พบข้อมูล id`}], transactionItem: null, status: false });
    // fetch dataOrderBy Branch 
    const transactionOrder = await fetchTransactionById(id);

    return res.status(200).json({ message: "Tables found", transactionItem: transactionOrder, status: true });
}

export const handleGetTransactionAll = async (res: NextApiResponse) => {
    // fetch dataOrderAll
    const transactionOrder = await fetchTransactionAll();

    return res.status(200).json({ message: "Tables found", transactionItem: transactionOrder, status: true });
}

export const handleGetCustomerFrontDataById = async (res: NextApiResponse, tokenOrder: string) => {
    // fetchDataByTransactionId
    const dataDetail = await fetchDataFrontDetailByTransactionId(tokenOrder);
    if(!dataDetail) return res.status(404).json({ message: [ {message : "พบข้อผิดพลาดข้อมูล"}], customerFrontData: null, status: true });
    
    return res.status(200).json({ message: [ {message : "พบข้อมูล"}], customerFrontData: dataDetail, status: true });
}