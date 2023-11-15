import { prisma } from "@/pages/lib/prismaDB";
import { fetchUnit } from "@/types/fetchData";
import { dataVerifyUnit, promiseDataVerify } from "@/types/verify";
import { Prisma } from "@prisma/client";

const pushData = (message: string) => {
    return { message };
};

export const verifyUnitBody = (data: dataVerifyUnit): promiseDataVerify[] => {
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
}

export const checkNameInCompany = async (name: string, companyId: number, id?: number): Promise<fetchUnit | null> => {
    try {
        let whereCondition: Prisma.UnitWhereInput = { name: name, companyId: companyId, };
        // where not id
        if (id) whereCondition = { ...whereCondition, NOT: { id: id } };

        const unit = await prisma.unit.findFirst({
            where: whereCondition,
        });

        if (!unit) return null;
        return unit as fetchUnit;
    } catch (error: unknown) {
        // Handle any errors here or log them
        console.error('Error fetching unit:', error);
        return null;
    } finally {
        await prisma.$disconnect();
    }
}

export const insertUnit = async (body: dataVerifyUnit): Promise<promiseDataVerify[] | null> => {
    const verifyStatus: promiseDataVerify[] = [];

    try {
        const addUnit = await prisma.unit.create({
            data: {
                name: body.name.trim(),
                companyId: body.companyId,
                status: body.status
            }
        })

        if (!addUnit) return null;
        verifyStatus.push(pushData(`Create a employee ${addUnit.name} accomplished and received id: ${addUnit.id}`));
    } catch (error: unknown) {
        // Handle any errors here or log them
        console.error('Error add employee:', error);
        return null;
    } finally {
        await prisma.$disconnect();
    }

    return verifyStatus;
}

export const fetchUnitById = async (id: number): Promise<fetchUnit | null> => {
    try {
        const unit = await prisma.unit.findUnique({
            where: {
                id: id
            },
        });

        if (!unit) return null;
        return unit as fetchUnit;
    } catch (error: unknown) {
        // Handle any errors here or log them
        console.error('Error fetching unit:', error);
        return null;
    } finally {
        await prisma.$disconnect();
    }
}

export const fetchUnitByCompanyId = async (companyId: number): Promise<fetchUnit[] | null> => {
    try {
        const unit = await prisma.unit.findMany({
            where: {
                companyId: companyId
            },
        });

        if (!unit) return null;
        return unit as fetchUnit[];
    } catch (error: unknown) {
        // Handle any errors here or log them
        console.error('Error fetching unit:', error);
        return null;
    } finally {
        await prisma.$disconnect();
    }
}

export const fetchAllUnit = async (): Promise<fetchUnit[] | null> => {
    try {
        const unit = await prisma.unit.findMany({});

        if (!unit) return null;
        return unit as fetchUnit[];
    } catch (error: unknown) {
        // Handle any errors here or log them
        console.error('Error fetching unit:', error);
        return null;
    } finally {
        await prisma.$disconnect();
    }
}

export const updateDataUnit = async (body: dataVerifyUnit, id: number): Promise<fetchUnit | null> => {
    try {
        const unit = await prisma.unit.update({
            where: { id },
            data: {
                name: body.name,
                status: body.status
            },
        });

        if (!unit) return null;
        return unit as fetchUnit;
    } catch (error) {
        console.error('Error updating employee:', error);
        return null;
    } finally {
        await prisma.$disconnect();
    }
}

export const deleteDataUnit = async (id: number): Promise<fetchUnit | null> => {
    try {
        const deletedUnit = await prisma.unit.delete({
            where: {
                id: id,
            },
        });

        if (!deletedUnit) return null;
        return deletedUnit as fetchUnit;
    } catch (error) {
        console.error('Error updating unit:', error);
        return null;
    } finally {
        await prisma.$disconnect();
    }
}