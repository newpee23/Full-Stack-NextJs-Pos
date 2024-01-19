import { dataVerifyItemExpenses } from "@/types/verify";
import { fetchExpensesById } from "@/utils/expenses";
import { deleteDataItemExpenses, fetchAllItemExpenses, fetchItemExpensesByExpensesId, fetchItemExpensesById, insertDataItemExpenses, updateDataItemExpenses, verifyItemExpenses } from "@/utils/itemExpenses";
import { NextApiResponse } from "next";

export const handleAddItemExpenses = async (body: dataVerifyItemExpenses, res: NextApiResponse) => {
    // VerifyitemExpenses
    const verifyExpenses = verifyItemExpenses(body);
    if (verifyExpenses.length > 0) return res.status(404).json({ message: verifyExpenses, itemExpenses: null, status: false });
    // check ExpensesId
    const checkExpensesId = await fetchExpensesById(body.expensesId);
    if (!checkExpensesId) return res.status(404).json({ message: `No expenses found with expensesId : ${body.expensesId}`, itemExpenses: null, status: false });
    // addItemExpenses
    const addItemExpenses = await insertDataItemExpenses(body);
    if (!addItemExpenses) return res.status(404).json({ message: "บันทึกข้อมูลไม่สำเร็จ", itemExpenses: null, status: false });

    return res.status(200).json({ message: "บันทึกข้อมูลสำเร็จ", itemExpenses: addItemExpenses, status: true });
}

export const handleGetItemExpensesById = async (res: NextApiResponse, id: number) => {
    const ItemExpenses = await fetchItemExpensesById(id);
    if (!ItemExpenses) return res.status(404).json({ message: `No itemExpenses found with Id : ${id}`, itemExpenses: null, status: false });

    return res.status(200).json({ message: "ItemExpenses found", itemExpenses: ItemExpenses, status: true });
}

export const handleGetItemExpensesByExpensesId = async (res: NextApiResponse, expensesId: number) => {
    const ItemExpenses = await fetchItemExpensesByExpensesId(expensesId);
    if (!ItemExpenses || (Array.isArray(ItemExpenses) && ItemExpenses.length === 0)) return res.status(200).json({ message: `No ItemExpenses found with expensesId : ${expensesId}`, itemExpenses: null, status: false });

    return res.status(200).json({ message: "itemExpenses found", ItemExpenses: ItemExpenses, status: true });
}

export const handleGetAllItemExpenses = async (res: NextApiResponse) => {
    const ItemExpenses = await fetchAllItemExpenses();
    if (!ItemExpenses || (Array.isArray(ItemExpenses) && ItemExpenses.length === 0)) return res.status(404).json({ message: `No ItemExpenses found`, itemExpenses: null, status: false });

    return res.status(200).json({ message: "itemExpenses found", ItemExpenses: ItemExpenses, status: true });
}

export const handleUpdateItemExpenses = async (body: dataVerifyItemExpenses, res: NextApiResponse) => {
    if (!body.id || isNaN(Number(body.id))) return res.status(404).json({ message: "Please specify ItemExpensesId.", itemExpenses: null, status: false });
    // VerifyitemExpenses
    const verifyExpenses = verifyItemExpenses(body);
    if (verifyExpenses.length > 0) return res.status(404).json({ message: verifyExpenses, itemExpenses: null, status: false });
    // checkItemExpensesId
    const checkItemExpensesId = await fetchItemExpensesById(body.id);
    if (!checkItemExpensesId) return res.status(404).json({ message: `No ItemExpenses found with Id : ${body.id}`, itemExpenses: null, status: false });
    // check ExpensesId
    const checkExpensesId = await fetchExpensesById(body.expensesId);
    if (!checkExpensesId) return res.status(404).json({ message: `No expenses found with expensesId : ${body.expensesId}`, itemExpenses: null, status: false });
    // updateDataItemExpenses
    const updateItemExpenses = await updateDataItemExpenses(body, body.id);
    if (!updateItemExpenses) return res.status(404).json({ message: "บันทึกข้อมูลไม่สำเร็จ", itemExpenses: null, status: false });

    return res.status(200).json({ message: "บันทึกข้อมูลสำเร็จ", itemExpenses: updateItemExpenses, status: true });
}

export const handleDeleteItemExpenses = async (res: NextApiResponse, id: number) => {
    // checkItemExpensesId
    const checkItemExpensesId = await fetchItemExpensesById(id);
    if (!checkItemExpensesId) return res.status(404).json({ message: `No ItemExpenses found with Id : ${id}`, itemExpenses: null, status: false });
    const deleteItemExpenses = await deleteDataItemExpenses(id);
    if (!deleteItemExpenses) return res.status(404).json({ message: "An error occurred deleting data.", itemExpenses: null, status: false });

    return res.status(200).json({ message: "Successfully deleted data", itemExpenses: deleteItemExpenses, status: true });
}