import { myStateCartItem } from "@/app/store/slices/cartSlice";
import { dataVerifyTransaction } from "@/types/verify";
import { getBranchById } from "@/utils/branch";
import { getCompanyById } from "@/utils/company";
import { getEmployeeById } from "@/utils/employee";
import { insertItemTransactionArray } from "@/utils/itemTransaction";
import { fectOrderBillByTransaction, fetchDataOrderBillByTransactionId, insertOrderBill, setDataDetailOrderBill, setDataTotalOrderBill, setDataTotalOrderBillStatusSucceed } from "@/utils/orderBill";
import { fetchProductByCompanyId } from "@/utils/product";
import { checkOrderArrayProductId, checkOrderArrayPromotionId, closeDataTransaction, createTokenTransaction, fetchDataFrontDetailByTransactionId, fetchTransactionAll, fetchTransactionByBranchId, fetchTransactionByCompanyId, fetchTransactionById, fetchTransactionByTableId, insertTransaction, updateTokenOrderTransaction, verifyOrderBillBody, verifyTransactionBody } from "@/utils/transaction";
import { NextApiResponse } from "next";

export const handleAddTransaction = async (body: dataVerifyTransaction, res: NextApiResponse) => {
    // VerifyUnitData
    const verifyTransaction = verifyTransactionBody(body);
    if (verifyTransaction.length > 0) return res.status(404).json({ message: verifyTransaction, transactionItem: null, status: false });
    // check Branch
    const checkBranch = await getBranchById(body.branchId);
    if (!checkBranch) return res.status(404).json({ message: { message: `ไม่พบข้อมูล branchId` }, transactionItem: null, status: false });
    // check employeeId
    const checkEmployee = await getEmployeeById(body.employeeId);
    if (!checkEmployee) return res.status(404).json({ message: { message: `ไม่พบข้อมูล checkEmployeeId` }, transactionItem: null, status: false });
    // Add Transaction
    const addTransaction = await insertTransaction(body);
    if (!addTransaction) return res.status(404).json({ message: "บันทึกข้อมูลไม่สำเร็จ", transactionItem: null, status: false });
    // Create Token
    const tokenOrder = await createTokenTransaction({ id: addTransaction.id, tableId: addTransaction.tableId });
    if (!tokenOrder) return res.status(404).json({ message: "An error occurred tokenOrder data.", transactionItem: null, status: false });
    // Update Token
    const updateToken = await updateTokenOrderTransaction({ id: addTransaction.id, tokenOrder: tokenOrder });
    if (!updateToken) return res.status(404).json({ message: "An error occurred updateTokenOrder data.", transactionItem: null, status: false });

    return res.status(200).json({ message: "บันทึกข้อมูลสำเร็จ", transactionItem: updateToken, status: true });
}

export const handleCloseTransaction = async (id: string, res: NextApiResponse) => {
    // VerifyUnitData
    if (!id) return res.status(404).json({ message: [{ message: "Please specify transactionId." }], transactionItem: null, status: false });
    const transaction = await fetchTransactionByTableId(id);
    if (!transaction) return res.status(404).json({ message: `No transaction found with Id : ${id}`, transactionItem: null, status: false });
    if (!transaction.transactionOrder?.id) return res.status(404).json({ message: `No transactionOrder found with Id : ${id}`, transactionItem: null, status: false });
    // sum totalBill
    const transactionOrder = await fetchDataOrderBillByTransactionId(transaction.transactionOrder.id);
    if(!transactionOrder)  return res.status(404).json({ message: "An error occurred transactionOrder data.", transactionItem: null, status: false });
    const totalPrice = await setDataTotalOrderBillStatusSucceed(transactionOrder);
    // closeTransaction
    const closeTransaction = await closeDataTransaction(transaction.transactionOrder?.id, totalPrice ? totalPrice :0);
    if (!closeTransaction) return res.status(404).json({ message: "An error occurred deleting data.", transactionItem: null, status: false });

    return res.status(200).json({ message: "Successfully deleted data", transactionItem: null, status: true });
}

export const handleGetTransactionByBranchId = async (res: NextApiResponse, branchId: number) => {
    if (!branchId) return res.status(200).json({ message: [{ message: `ไม่พบข้อมูล branchId` }], transactionItem: null, status: false });
    // fetch dataOrderBy Branch 
    const transactionOrder = await fetchTransactionByBranchId(branchId);

    return res.status(200).json({ message: "Tables found", transactionItem: transactionOrder, status: true });
}

export const handleGetTransactionByCompanyId = async (res: NextApiResponse, companyId: number) => {
    if (!companyId) return res.status(200).json({ message: [{ message: `ไม่พบข้อมูล companyId` }], transactionItem: null, status: false });
    // fetch dataOrderBy Branch 
    const transactionOrder = await fetchTransactionByCompanyId(companyId);

    return res.status(200).json({ message: "Tables found", transactionItem: transactionOrder, status: true });
}

export const handleGetTransactionById = async (res: NextApiResponse, id: string) => {
    if (!id) return res.status(200).json({ message: [{ message: `ไม่พบข้อมูล id` }], transactionItem: null, status: false });
    // fetch dataOrderBy Branch 
    const transactionOrder = await fetchTransactionByTableId(id);

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
    if (!dataDetail) return res.status(404).json({ message: [{ message: "พบข้อผิดพลาดข้อมูล" }], customerFrontData: null, status: true });

    return res.status(200).json({ message: [{ message: "พบข้อมูล" }], customerFrontData: dataDetail, status: true });
}

export const handleAddOrderBill = async (body: myStateCartItem, res: NextApiResponse) => {
    // VerifyUnitData
    const verifyOrderBill = verifyOrderBillBody(body);
    if (verifyOrderBill.length > 0) return res.status(404).json({ message: verifyOrderBill, orderBill: null, status: false });
    // check transactionId
    const checkTransaction = await fetchTransactionById(body.transactionId);
    if (!checkTransaction) return res.status(404).json({ message: [{ message: "ไม่พบข้อมูล transactionId ในระบบ" }], orderBill: null, status: false });
    // check product
    const checkProduct = await checkOrderArrayProductId(body.itemCart);
    if (checkProduct.length > 0) return res.status(404).json({ message: checkProduct, orderBill: null, status: false });
    //  check promotion
    const checkPromotion = await checkOrderArrayPromotionId(body.itemCart);
    if (checkPromotion.length > 0) return res.status(404).json({ message: checkPromotion, orderBill: null, status: false });
    // add orderBill
    const addOrderBill = await insertOrderBill(body);
    if (!addOrderBill) return res.status(404).json({ message: [{ message: "บันทึกข้อมูลไม่สำเร็จ" }], orderBill: null, status: false });
    // add productItemTransaction
    const addItemTransaction = await insertItemTransactionArray(body.itemCart, addOrderBill.id);
    if (addItemTransaction.length > 0) return res.status(404).json({ message: addItemTransaction, orderBill: null, status: false });
    // fetch order
    return res.status(200).json({ message: [{ message: "บันทึกข้อมูลสำเร็จ" }], orderBill: body, status: true });
}

export const handleGetOrderTotalBill = async (id: string, res: NextApiResponse) => {
    // check Id
    if (!id) return res.status(404).json({ message: [{ message: `เกิดข้อผิดพลาด: ไม่พบข้อมูล id` }], orderBillData: null, orderTotalBill: null, status: false });
    // fetch OrderBill
    const orderBillData = await fetchDataOrderBillByTransactionId(id);
    if (!orderBillData) return res.status(200).json({ message: [{ message: "เรียกข้อมูลสำเร็จ" }], orderBillData: null, orderTotalBill: 0, status: true });
    // setDataTotalOrderBill
    const dataTotalOrderBill = await setDataTotalOrderBill(orderBillData);
    if (dataTotalOrderBill === null) return res.status(404).json({ message: [{ message: "เกิดข้อผิดพลาด: dataTotalOrderBill" }], orderBillData: null, orderTotalBill: null, status: false });
    // setDataOrderBill
    const dataOrderBill = await setDataDetailOrderBill(orderBillData);
    if (!dataOrderBill) return res.status(200).json({ message: [{ message: "เกิดข้อผิดพลาด: dataOrderBill" }], orderBillData: null, status: true });

    return res.status(200).json({ message: [{ message: "เรียกข้อมูลสำเร็จ" }], orderBillData: dataOrderBill, orderTotalBill: dataTotalOrderBill, status: true });
}

export const handleGetOrderBillByBranchId = async (res: NextApiResponse, branchId: number, status: "process" | "making") => {
    if (status === "making" || status === "process") {
        // check branchId
        const checkBranch = await getBranchById(branchId);
        if (!checkBranch) return res.status(404).json({ message: [{ message: "ไม่พบข้อมูล branchId ในระบบ" }], orderBillData: null, status: false });
        // fectOrderBillByTransaction
        const orderBill = await fectOrderBillByTransaction(branchId, status);
        if (!orderBill) return res.status(200).json({ message: [{ message: "เกิดข้อผิดพลาด: fectOrderBillByTransaction" }], orderBillData: null, status: true });

        return res.status(200).json({ message: [{ message: "เรียกข้อมูลสำเร็จ" }], orderBillData: orderBill, status: true });
    }

    return res.status(404).json({ message: [{ message: "status ต้องมีค่าเป็น process | making เท่านั้น" }], orderBillData: null, status: false });
}