import { prisma } from "@/pages/lib/prismaDB";
import { fetchTable } from "@/types/fetchData";
import { dataVerifyTable, promiseDataVerify } from "@/types/verify";
import { Prisma } from "@prisma/client";

const pushData = (message: string) => {
    return { message };
};

export const verifyTableBody = (data: dataVerifyTable): promiseDataVerify[] => {
    const verifyStatus: promiseDataVerify[] = [];

    if (!data.name) verifyStatus.push(pushData("ไม่พบข้อมูล : name"));
    if (!data.stoves) verifyStatus.push(pushData("ไม่พบข้อมูล : stoves"));
    if (!data.people) verifyStatus.push(pushData("ไม่พบข้อมูล : people"));
    if (!data.expiration) verifyStatus.push(pushData("ไม่พบข้อมูล : expiration"));
    if (!data.branchId) verifyStatus.push(pushData("ไม่พบข้อมูล : branchId"));
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
    if (isNaN(Number(data.stoves))) verifyStatus.push(pushData("กรุณาระบุ : stoves เป็นตัวเลขเท่านั้น"));
    if (isNaN(Number(data.people))) verifyStatus.push(pushData("กรุณาระบุ : people เป็นตัวเลขเท่านั้น"));
    if (isNaN(Number(data.expiration))) verifyStatus.push(pushData("กรุณาระบุ : expiration เป็นตัวเลขเท่านั้น"));
    if (isNaN(Number(data.branchId))) verifyStatus.push(pushData("กรุณาระบุ : branchId เป็นตัวเลขเท่านั้น"));
    if (isNaN(Number(data.companyId))) verifyStatus.push(pushData("กรุณาระบุ : companyId เป็นตัวเลขเท่านั้น"));
    if (data.status !== "Active" && data.status !== "InActive") verifyStatus.push(pushData("กรุณาระบุ : status เป็น Active หรือ InActive เท่านั้น"));

    // Return
    if (verifyStatus.length > 0) return verifyStatus;
    
    // ตรวจสอบว่าเป็นจำนวนเต็มเท่านั้น
    if(!Number.isInteger(data.stoves) || data.stoves <= 0) verifyStatus.push(pushData("กรุณาระบุ : stoves เป็นตัวเลขจำนวนเต็มเท่านั้น"));
    if(!Number.isInteger(data.people) || data.people <= 0) verifyStatus.push(pushData("กรุณาระบุ : people เป็นตัวเลขจำนวนเต็มเท่านั้น"));
    if(!Number.isInteger(data.branchId) || data.branchId <= 0) verifyStatus.push(pushData("กรุณาระบุ : branchId เป็นตัวเลขจำนวนเต็มเท่านั้น"));
    if(!Number.isInteger(data.companyId) || data.companyId <= 0) verifyStatus.push(pushData("กรุณาระบุ : companyId เป็นตัวเลขจำนวนเต็มเท่านั้น"));

    // Return
    return verifyStatus;
};

export const insertTable = async (body: dataVerifyTable): Promise<promiseDataVerify[] | null> => {
    const verifyStatus: promiseDataVerify[] = [];
    try {
        const addTables = await prisma.tables.create({
            data: body,
        });

        if (!addTables) return null;
        verifyStatus.push(pushData(`Create a promotion ${addTables.name} accomplished and received id: ${addTables.id}`));
    } catch (error: unknown) {
        console.error(`Database connection error: ${error}`);
    } finally {
        await prisma.$disconnect();
    }
    return verifyStatus;
};

export const fetchTableNameBybranchId = async (name: string, branchId: number, id?: string): Promise<fetchTable | null> => {
    try {
        let whereCondition: Prisma.TablesWhereInput = { name: name, branchId: branchId, };
        // where not id
        if (id) whereCondition = { ...whereCondition, NOT: { id: id } };
        const tables = await prisma.tables.findFirst({
            where: whereCondition
        });

        if (!tables) return null;
        return tables as fetchTable;
    } catch (error: unknown) {
        // Handle any errors here or log them
        console.error('Error fetching tables:', error);
        return null;
    } finally {
        await prisma.$disconnect();
    }
}

export const fetchTableById = async (id: string): Promise<fetchTable | null> => {
    try {
        const tables = await prisma.tables.findUnique({
            where: {
                id: id
            }
            ,include: {
                branch: {
                    select: {
                        id: true,
                        name: true,
                    },
                }
            }
        });

        if (!tables) return null;
        return tables as fetchTable;
    } catch (error) {
        // Handle any errors here or log them
        console.error('Error fetching tables:', error);
        return null;
    } finally {
        await prisma.$disconnect();
    }
}

export const fetchTableBranchId = async (branchId: number): Promise<fetchTable[] | null> => {
    try {
        const tables = await prisma.tables.findMany({
            where: { branchId: branchId }
            ,include: {
                branch: {
                    select: {
                        id: true,
                        name: true,
                    },
                }
            }
            , orderBy: { id: 'asc', } 
        });

        if (!tables) return null;
        return tables as fetchTable[];
    } catch (error) {
        // Handle any errors here or log them
        console.error('Error fetching tables:', error);
        return null;
    } finally {
        await prisma.$disconnect();
    }
}

export const fetchTableCompanyId = async (companyId: number): Promise<fetchTable[] | null> => {
    try {
        const tables = await prisma.tables.findMany({
            where: { companyId: companyId }
            ,include: {
                branch: {
                    select: {
                        id: true,
                        name: true,
                    },
                }
            }
            ,orderBy: { id: 'asc', },
        });

        if (!tables) return null;
         // สร้าง key เพื่อเอาไปใส่ table และ แปลง date เป็น str
        const tablesWithKey: fetchTable[] = tables.map((tables, index) => ({
            ...tables,
            index: (index + 1),
            key: tables.id.toString(),
        }));
       
        if (tablesWithKey.length === 0) return null;
        return tablesWithKey;
    } catch (error) {
        // Handle any errors here or log them
        console.error('Error fetching tables:', error);
        return null;
    } finally {
        await prisma.$disconnect();
    }
}

export const fetchAllTable = async (): Promise<fetchTable[] | null> => {
    try {
        const tables = await prisma.tables.findMany();

        if (!tables) return null;
        return tables as fetchTable[];
    } catch (error) {
        // Handle any errors here or log them
        console.error('Error fetching tables:', error);
        return null;
    } finally {
        await prisma.$disconnect();
    }
}

export const updateDataTables = async (body: dataVerifyTable, id: string): Promise<fetchTable | null> => {
    try {
        const tables = await prisma.tables.update({
            where: { id },
            data: {
                name: body.name,
                stoves: body.stoves,
                people: body.people,
                expiration: body.expiration,
                status: body.status
            },
        });

        if (!tables) return null;
        return tables as fetchTable;
    } catch (error) {
        console.error('Error updating tables:', error);
        return null;
    } finally {
        await prisma.$disconnect();
    }
}

export const deleteDataTables = async (id: string): Promise<fetchTable | null> => {
    try {
        const deletedTables = await prisma.tables.delete({
            where: {
                id: id,
            },
        });

        if (!deletedTables) null
        return deletedTables as fetchTable;
    } catch (error: unknown) {
        // จัดการข้อผิดพลาดที่เกิดขึ้น
        console.error('An error occurred deleting data.:', error);
        return null;
    } finally {
        await prisma.$disconnect();
    }
}