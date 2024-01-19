import { dataVerifyExpenses } from "@/types/verify";
import { getCompanyById } from "@/utils/company";
import { deleteDataExpenses, fetchAllExpenses, fetchExpensesByCompanyId, fetchExpensesById, fetchExprnsesNameByCompanyId, insertDataExpenses, updateDataExpenses, verifyExpensesBody } from "@/utils/expenses";
import { NextApiResponse } from "next";

export const handleAddExpenses = async (body: dataVerifyExpenses, res: NextApiResponse) => {
    // VerifyExpensesData
    const verifyExpenses = verifyExpensesBody(body);
    if (verifyExpenses.length > 0) return res.status(404).json({ message: verifyExpenses, expenses: null, status: false });
    // check companyId
    const checkCompanyId = await getCompanyById(body.companyId);
    if (!checkCompanyId) return res.status(404).json({ message: [{ message: `ไม่พบข้อมูลบริษัทจากรหัส : ${body.companyId}` }], expenses: null, status: false });
    // check expensesName
    const checkExpensesName = await fetchExprnsesNameByCompanyId(body.name, body.companyId);
    if (checkExpensesName) return res.status(404).json({ message: [{ message: `พบข้อมูลชื่อค่าใช้จ่าย : ${body.name} ถูกใช้งานแล้วในระบบ` }], expenses: null, status: false });
    //  addExpenses
    const addExpenses = await insertDataExpenses(body);
    if (!addExpenses) return res.status(404).json({ message: [{ message: `บันทึกข้อมูลไม่สำเร็จ` }], expenses: null, status: false });

    return res.status(200).json({ message: [{ message: `บันทึกข้อมูลสำเร็จ` }], expenses: addExpenses, status: true });
}

export const handleGetExpensesById = async (res: NextApiResponse, id: number) => {
    const expenses = await fetchExpensesById(id);
    if (!expenses) return res.status(404).json({ message: [{ message: `ไม่พบข้อมูลค่าใช้จ่ายจากรหัส : ${id}` }], expenses: null, status: false });

    return res.status(200).json({ message: [{ message: "พบข้อมูล" }], expenses: expenses, status: true });
}

export const handleGetExpensesByCompanyId = async (res: NextApiResponse, companyId: number) => {
    const expenses = await fetchExpensesByCompanyId(companyId);
    if (!expenses || (Array.isArray(expenses) && expenses.length === 0)) return res.status(200).json({ message: `No expenses found with companyId : ${companyId}`, expenses: null, status: false });

    return res.status(200).json({ message: [{ message: "พบข้อมูล" }], expenses: expenses, status: true });
}

export const handleGetAllExpenses = async (res: NextApiResponse) => {
    const expenses = await fetchAllExpenses();
    if (!expenses || (Array.isArray(expenses) && expenses.length === 0)) return res.status(200).json({ message: `No expenses found`, expenses: null, status: false });

    return res.status(200).json({ message: [{ message: "พบข้อมูล" }], expenses: expenses, status: true });
}

export const handleUpdateExpenses = async (body: dataVerifyExpenses, res: NextApiResponse) => {
    if (!body.id || isNaN(Number(body.id))) return res.status(404).json({ message: [{ message: "กรุณาระบุ expensesId" }], expenses: null, status: false });
    // VerifyExpensesData
    const verifyExpenses = verifyExpensesBody(body);
    if (verifyExpenses.length > 0) return res.status(404).json({ message: verifyExpenses, expenses: null, status: false });
    //  check expensesId
    const checkExpensesId = await fetchExpensesById(body.id);
    if (!checkExpensesId) return res.status(404).json({ message: [{ message: `ไม่พบข้อมูลค่าใช้จ่ายจากรหัส : ${body.id}` }], expenses: null, status: false });
    // check companyId
    const checkCompanyId = await getCompanyById(body.companyId);
    if (!checkCompanyId) return res.status(404).json({ message: [{ message: `ไม่พบข้อมูลบริษัทจากรหัส : ${body.companyId}` }], expenses: null, status: false });
    // check expensesName
    const checkExpensesName = await fetchExprnsesNameByCompanyId(body.name, body.companyId, body.id);
    if (checkExpensesName) return res.status(404).json({ message: [{ message: `พบชื่อค่าใช้จ่าย : ${body.name} ถูกใช้งานแล้วในระบบ`}], expenses: null, status: false });
    // updateExpenses
    const updateExpenses = await updateDataExpenses(body, body.id);
    if (!updateExpenses) return res.status(404).json({ message: [{ message: `บันทึกข้อมูลไม่สำเร็จ` }], expenses: null, status: false });

    return res.status(200).json({ message: [{ message: `บันทึกข้อมูลสำเร็จ` }], expenses: updateExpenses, status: true });
}

export const handleDeleteExpenses = async (res: NextApiResponse, id: number) => {
    const expenses = await fetchExpensesById(id);
    if (!expenses) return res.status(404).json({ message:  [{ message: `ไม่พบข้อมูลค่าใช้จ่ายจากรหัส : ${id}` }], expenses: null, status: false });
    const deleteExpenses = await deleteDataExpenses(id);
    if (!deleteExpenses) return res.status(404).json({ message: [{ message: `บันทึกข้อมูลไม่สำเร็จ` }], expenses: null, status: false });

    return res.status(200).json({ message: [{ message: `บันทึกข้อมูลสำเร็จ` }], expenses: deleteExpenses, status: true });
}