import { prisma } from "@/pages/lib/prismaDB";
import { fetchEmployee } from "@/types/fetchData";
import { dataVerifyEmployee, promiseDataVerify } from "@/types/verify";
import { hashPassword } from "./verifyUserId";

const pushData = (message: string) => {
    return { message };
};

export const verifyEmployeeBody = (data: dataVerifyEmployee): promiseDataVerify[] => {
    const verifyStatus: promiseDataVerify[] = [];

    if (!data.name) verifyStatus.push(pushData("ไม่พบข้อมูล : name"));
    if (!data.subname) verifyStatus.push(pushData("ไม่พบข้อมูล : subname"));
    if (!data.age) verifyStatus.push(pushData("ไม่พบข้อมูล : age"));
    if (!data.cardId) verifyStatus.push(pushData("ไม่พบข้อมูล : cardId"));
    if (!data.userName) verifyStatus.push(pushData("ไม่พบข้อมูล : userName"));
    if (!data.passWord) verifyStatus.push(pushData("ไม่พบข้อมูล : passWord"));
    if (!data.companyId) verifyStatus.push(pushData("ไม่พบข้อมูล : companyId"));
    if (!data.branchId) verifyStatus.push(pushData("ไม่พบข้อมูล : branchId"));
    if (!data.positionId) verifyStatus.push(pushData("ไม่พบข้อมูล : positionId"));
    if (!data.rold) verifyStatus.push(pushData("ไม่พบข้อมูล : rold"));
    if (!data.status) verifyStatus.push(pushData("ไม่พบข้อมูล : status"));

    // Return
    if (verifyStatus.length > 0) {
        return verifyStatus;
    }

    // ตรวจสอบการ trim เพื่อป้องกันการกรอกช่องว่าง
    if (!data.name.trim()) verifyStatus.push(pushData("กรุณาระบุ : name"));
    if (!data.subname.trim()) verifyStatus.push(pushData("กรุณาระบุ : subname"));
    if (!data.cardId.trim()) verifyStatus.push(pushData("กรุณาระบุ : cardId"));
    if (!data.userName.trim()) verifyStatus.push(pushData("กรุณาระบุ : userName"));
    if (!data.passWord.trim()) verifyStatus.push(pushData("กรุณาระบุ : passWord"));

    // Return
    if (verifyStatus.length > 0) {
        return verifyStatus;
    }

    // ตรวจสอบความถูกต้องของข้อมูล
    if (data.name.length > 50) verifyStatus.push(pushData("กรุณาระบุ : name ไม่เกิน 50 อักษร"));
    if (data.subname.length > 50) verifyStatus.push(pushData("กรุณาระบุ : subname ไม่เกิน 50 อักษร"));
    if (data.cardId.length > 30) verifyStatus.push(pushData("กรุณาระบุ : cardId ไม่เกิน 30 อักษร"));
    if (isNaN(Number(data.age))) verifyStatus.push(pushData("กรุณาระบุ : age เป็นตัวเลขเท่านั้น"));
    if (isNaN(Number(data.cardId))) verifyStatus.push(pushData("กรุณาระบุ : cardId เป็นตัวเลขเท่านั้น"));
    if (isNaN(Number(data.branchId))) verifyStatus.push(pushData("กรุณาระบุ : branchId เป็นตัวเลขเท่านั้น"));
    if (isNaN(Number(data.companyId))) verifyStatus.push(pushData("กรุณาระบุ : companyId เป็นตัวเลขเท่านั้น"));
    if (isNaN(Number(data.positionId))) verifyStatus.push(pushData("กรุณาระบุ : positionId เป็นตัวเลขเท่านั้น"));
    if (data.rold !== "admin" && data.rold !== "userAdmin" && data.rold !== "user") verifyStatus.push(pushData("กรุณาระบุ : rold เป็น admin หรือ userAdmin หรือ user เท่านั้น"));
    if (data.status !== "Active" && data.status !== "InActive") verifyStatus.push(pushData("กรุณาระบุ : status เป็น Active หรือ InActive เท่านั้น"));

    // Return
    return verifyStatus;
};

export const getEmployeeByNameCardIdUser = async (name: string, subname: string, cardId: string): Promise<fetchEmployee | null> => {
    try {
        const employee = await prisma.employee.findFirst({
            where: {
                name: name,
                subname: subname,
                cardId: cardId
            }
        });
        if (!employee) {
            return null;
        }
        return employee as fetchEmployee;
    } catch (error: unknown) {
        // Handle any errors here or log them
        console.error('Error fetching employee:', error);
        return null;
    } finally {
        await prisma.$disconnect();
    }
}

export const getusernameByCompanyId = async (username: string, companyId: number): Promise<fetchEmployee | null> => {
    try {
        const employee = await prisma.employee.findFirst({
            where: {
                userName: username,
                companyId: companyId
            }
        });
        if (!employee) {
            return null;
        }
        return employee as fetchEmployee;
    } catch (error: unknown) {
        // Handle any errors here or log them
        console.error('Error fetching employee:', error);
        return null;
    } finally {
        await prisma.$disconnect();
    }
}

export const insertEmployee = async (body: dataVerifyEmployee) => {
    const verifyStatus: promiseDataVerify[] = [];
    
    try {
        const addEmployee = await prisma.employee.create({
            data: {
                name: body.name.trim(),
                subname: body.subname.trim(),
                age: body.age,
                cardId: body.cardId,
                userName: body.userName.trim(),
                passWord: await hashPassword(body.passWord.trim()),
                companyId: body.companyId,
                branchId: body.branchId,
                positionId: body.positionId,
                role: body.rold,
                status: body.status
            }
        })

        verifyStatus.push(pushData(`Create a employee ${addEmployee.name} accomplished and received id: ${addEmployee.id}`));
    } catch (error: unknown) {
        // Handle any errors here or log them
        console.error('Error add employee:', error);
        return null;
    } finally {
        await prisma.$disconnect();
    }

    return verifyStatus;
}