import {  dataVerifyItemExpenses, promiseDataVerify } from "@/types/verify";
import { dateTimeIso, isDate } from "./timeZone";
import { prisma } from "@/pages/lib/prismaDB";
import { fetchItemExpenses } from "@/types/fetchData";

const pushData = (message: string) => {
    return { message };
};

export const verifyItemExpenses = (data: dataVerifyItemExpenses): promiseDataVerify[] => {
    const verifyStatus: promiseDataVerify[] = [];

    if (!data.orderDate) verifyStatus.push(pushData("ไม่พบข้อมูล : orderDate"));
    if (!data.price) verifyStatus.push(pushData("ไม่พบข้อมูล : price"));
    if (!data.expensesId) verifyStatus.push(pushData("ไม่พบข้อมูล : expensesId"));
    if (!data.branchId) verifyStatus.push(pushData("ไม่พบข้อมูล : branchId"));

    // Return
    if (verifyStatus.length > 0) return verifyStatus;

    // ตรวจสอบความถูกต้องของข้อมูล
    if (!isDate(data.orderDate)) verifyStatus.push(pushData("รูปแบบไม่ถูกต้อง : orderDate"));
    if (!Number.isInteger(data.branchId) || data.branchId <= 0) verifyStatus.push(pushData("กรุณาระบุ : branchId เป็นตัวเลขจำนวนเต็มเท่านั้น"));
    if (isNaN(Number(data.price))) verifyStatus.push(pushData("กรุณาระบุ : price เป็นตัวเลขเท่านั้น"));
    if (!Number.isInteger(data.expensesId) || data.expensesId <= 0) verifyStatus.push(pushData("กรุณาระบุ : expensesId เป็นตัวเลขจำนวนเต็มเท่านั้น"));
    
    return verifyStatus;
};

export const insertDataItemExpenses = async (body: dataVerifyItemExpenses): Promise<promiseDataVerify[] | null> => {
    const verifyStatus: promiseDataVerify[] = [];
    try {
        const addExpenses = await prisma.itemExpenses.create({
            data: {
                orderDate: dateTimeIso(body.orderDate),
                price: body.price,
                expensesId: body.expensesId,
                branchId: body.branchId,
                status: "Active"
            },
        });

        if (!addExpenses) return null;
        verifyStatus.push(pushData(`Create a itemExpenses accomplished and received id: ${addExpenses.id}`));
    } catch (error: unknown) {
        console.error(`Database connection error: ${error}`);
    } finally {
        await prisma.$disconnect();
    }
    return verifyStatus;
};

export const fetchItemExpensesById = async (id: number): Promise<fetchItemExpenses | null> => {
    try {
        const itemExpenses = await prisma.itemExpenses.findUnique({
            where: {
                id: id
            }
        });

        if (!itemExpenses) return null;
        return itemExpenses as fetchItemExpenses;
    } catch (error) {
        // Handle any errors here or log them
        console.error('Error fetching itemExpenses:', error);
        return null;
    } finally {
        await prisma.$disconnect();
    }
}

export const fetchItemExpensesByExpensesId = async (expensesId: number): Promise<fetchItemExpenses[] | null> => {
    try {
        const itemExpenses = await prisma.itemExpenses.findMany({
            where: {
                expensesId: expensesId
            }
        });

        if (itemExpenses.length === 0) return null;
        return itemExpenses as fetchItemExpenses[];
    } catch (error) {
        // Handle any errors here or log them
        console.error('Error fetching itemExpenses:', error);
        return null;
    } finally {
        await prisma.$disconnect();
    }
}

export const fetchAllItemExpenses = async (): Promise<fetchItemExpenses[] | null> => {
    try {
        const itemExpenses = await prisma.itemExpenses.findMany();

        if (itemExpenses.length === 0) return null;
        return itemExpenses as fetchItemExpenses[];
    } catch (error) {
        // Handle any errors here or log them
        console.error('Error fetching itemExpenses:', error);
        return null;
    } finally {
        await prisma.$disconnect();
    }
}

export const updateDataItemExpenses = async (body: dataVerifyItemExpenses, id: number): Promise<fetchItemExpenses | null> => {
    try {
        const itemExpenses = await prisma.itemExpenses.update({
            where: { id },
            data: {
                orderDate: dateTimeIso(body.orderDate),
                price: body.price,
            },
        });

        if (!itemExpenses) return null;
        return itemExpenses as fetchItemExpenses;
    } catch (error) {
        console.error('Error updating itemExpenses:', error);
        return null;
    } finally {
        await prisma.$disconnect();
    }
}

export const deleteDataItemExpenses = async (id: number): Promise<fetchItemExpenses | null> => {
    try {
        const deletedItemExpenses = await prisma.itemExpenses.delete({
            where: {
                id: id,
            },
        });

        if (!deletedItemExpenses) null
        return deletedItemExpenses as fetchItemExpenses;
    } catch (error: unknown) {
        // จัดการข้อผิดพลาดที่เกิดขึ้น
        console.error('An error occurred deleting data.:', error);
        return null;
    } finally {
        await prisma.$disconnect();
    }
}