import { prisma } from "@/pages/lib/prismaDB";
import { fetchExpenses } from "@/types/fetchData";
import { dataVerifyExpenses, promiseDataVerify } from "@/types/verify";
import { Prisma } from "@prisma/client";

const pushData = (message: string) => {
    return { message };
};

export const verifyExpensesBody = (data: dataVerifyExpenses): promiseDataVerify[] => {
    const verifyStatus: promiseDataVerify[] = [];

    if (!data.name) verifyStatus.push(pushData("ไม่พบข้อมูล : name"));
    if (!data.companyId) verifyStatus.push(pushData("ไม่พบข้อมูล : companyId"));
    if (!data.status) verifyStatus.push(pushData("ไม่พบข้อมูล : status"));

    // Return
    if (verifyStatus.length > 0) return verifyStatus;

    // ตรวจสอบการ trim เพื่อป้องกันการกรอกช่องว่าง
    if (!data.name.trim()) verifyStatus.push(pushData("กรุณาระบุ : name"));

    // Return
    if (verifyStatus.length > 0) return verifyStatus;

    // ตรวจสอบความถูกต้องของข้อมูล
    if (data.name.length > 50) verifyStatus.push(pushData("กรุณาระบุ : name ไม่เกิน 50 อักษร"));
    if (isNaN(Number(data.companyId))) verifyStatus.push(pushData("กรุณาระบุ : companyId เป็นตัวเลขเท่านั้น"));
    if (data.status !== "Active" && data.status !== "InActive") verifyStatus.push(pushData("กรุณาระบุ : status เป็น Active หรือ InActive เท่านั้น"));

    // Return
    if (verifyStatus.length > 0) return verifyStatus;

    // ตรวจสอบว่าเป็นจำนวนเต็มเท่านั้น
    if (!Number.isInteger(data.companyId) || data.companyId <= 0) verifyStatus.push(pushData("กรุณาระบุ : companyId เป็นตัวเลขจำนวนเต็มเท่านั้น"));
    
    // Return
    return verifyStatus;
};

export const fetchExprnsesNameByCompanyId = async (name: string, companyId: number, id?: number): Promise<fetchExpenses | null> => {
    try {
        let whereCondition: Prisma.ExpensesWhereInput = { name: name, companyId: companyId, };
        // where not id
        if (id) whereCondition = { ...whereCondition, NOT: { id: id } };
        const expenses = await prisma.expenses.findFirst({
            where: whereCondition
        });

        if (!expenses) return null;
        return expenses as fetchExpenses;
    } catch (error: unknown) {
        // Handle any errors here or log them
        console.error('Error fetching expenses:', error);
        return null;
    } finally {
        await prisma.$disconnect();
    }
}

export const insertDataExpenses = async (body: dataVerifyExpenses): Promise<promiseDataVerify[] | null> => {
    const verifyStatus: promiseDataVerify[] = [];
    try {
        const expenses = await prisma.expenses.create({
            data: body,
        });

        if (!expenses) return null;
        verifyStatus.push(pushData(`Create a promotion ${expenses.name} accomplished and received id: ${expenses.id}`));
    } catch (error: unknown) {
        console.error(`Database connection error: ${error}`);
    } finally {
        await prisma.$disconnect();
    }
    return verifyStatus;
};

export const fetchExpensesById = async (id: number): Promise<fetchExpenses | null> => {
    try {
        const expenses = await prisma.expenses.findUnique({
            where: {
                id: id
            }
        });

        if (!expenses) return null;
        return expenses as fetchExpenses;
    } catch (error) {
        // Handle any errors here or log them
        console.error('Error fetching expenses:', error);
        return null;
    } finally {
        await prisma.$disconnect();
    }
}

export const fetchExpensesByCompanyId = async (companyId: number): Promise<fetchExpenses[] | null> => {
    try {
        const expenses = await prisma.expenses.findMany({
            where: {
                companyId: companyId
            }
        });

        if (!expenses) return null;
        return expenses as fetchExpenses[];
    } catch (error) {
        // Handle any errors here or log them
        console.error('Error fetching expenses:', error);
        return null;
    } finally {
        await prisma.$disconnect();
    }
}

export const fetchAllExpenses = async (): Promise<fetchExpenses[] | null> => {
    try {
        const expenses = await prisma.expenses.findMany({});

        if (!expenses) return null;
        return expenses as fetchExpenses[];
    } catch (error) {
        // Handle any errors here or log them
        console.error('Error fetching expenses:', error);
        return null;
    } finally {
        await prisma.$disconnect();
    }
}

export const updateDataExpenses = async (body: dataVerifyExpenses, id: number): Promise<fetchExpenses | null> => {
    try {
        const expenses = await prisma.expenses.update({
            where: { id },
            data: {
                name: body.name,
                status: body.status
            },
        });

        if (!expenses) return null;
        return expenses as fetchExpenses;
    } catch (error) {
        console.error('Error updating expenses:', error);
        return null;
    } finally {
        await prisma.$disconnect();
    }
}

export const deleteDataExpenses = async (id: number): Promise<fetchExpenses | null> => {
    try {
        const deletedExpenses = await prisma.expenses.delete({
            where: {
                id: id,
            },
        });

        if (!deletedExpenses) null
        return deletedExpenses as fetchExpenses;
    } catch (error: unknown) {
        // จัดการข้อผิดพลาดที่เกิดขึ้น
        console.error('An error occurred deleting data.:', error);
        return null;
    } finally {
        await prisma.$disconnect();
    }
}