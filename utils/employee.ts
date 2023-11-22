import { prisma } from "@/pages/lib/prismaDB";
import { fetchEmployee } from "@/types/fetchData";
import { dataVerifyEmployee, promiseDataVerify } from "@/types/verify";
import { hashPassword } from "./verifyUserId";
import { Prisma } from "@prisma/client";

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
    if (!data.role) verifyStatus.push(pushData("ไม่พบข้อมูล : role"));
    if (!data.status) verifyStatus.push(pushData("ไม่พบข้อมูล : status"));

    // Return
    if (verifyStatus.length > 0) return verifyStatus;

    // ตรวจสอบการ trim เพื่อป้องกันการกรอกช่องว่าง
    if (!data.name.trim()) verifyStatus.push(pushData("กรุณาระบุ : name"));
    if (!data.subname.trim()) verifyStatus.push(pushData("กรุณาระบุ : subname"));
    if (!data.cardId.trim()) verifyStatus.push(pushData("กรุณาระบุ : cardId"));
    if (!data.userName.trim()) verifyStatus.push(pushData("กรุณาระบุ : userName"));
    if (!data.passWord.trim()) verifyStatus.push(pushData("กรุณาระบุ : passWord"));

    // Return
    if (verifyStatus.length > 0) return verifyStatus;

    // ตรวจสอบความถูกต้องของข้อมูล
    if (data.name.length > 50) verifyStatus.push(pushData("กรุณาระบุ : name ไม่เกิน 50 อักษร"));
    if (data.subname.length > 50) verifyStatus.push(pushData("กรุณาระบุ : subname ไม่เกิน 50 อักษร"));
    if (data.cardId.length > 30) verifyStatus.push(pushData("กรุณาระบุ : cardId ไม่เกิน 30 อักษร"));
    if (isNaN(Number(data.age))) verifyStatus.push(pushData("กรุณาระบุ : age เป็นตัวเลขเท่านั้น"));
    if (isNaN(Number(data.cardId))) verifyStatus.push(pushData("กรุณาระบุ : cardId เป็นตัวเลขเท่านั้น"));
    if (isNaN(Number(data.branchId))) verifyStatus.push(pushData("กรุณาระบุ : branchId เป็นตัวเลขเท่านั้น"));
    if (isNaN(Number(data.companyId))) verifyStatus.push(pushData("กรุณาระบุ : companyId เป็นตัวเลขเท่านั้น"));
    if (isNaN(Number(data.positionId))) verifyStatus.push(pushData("กรุณาระบุ : positionId เป็นตัวเลขเท่านั้น"));
    if (data.role !== "admin" && data.role !== "userAdmin" && data.role !== "user") verifyStatus.push(pushData("กรุณาระบุ : role เป็น admin หรือ userAdmin หรือ user เท่านั้น"));
    if (data.status !== "Active" && data.status !== "InActive") verifyStatus.push(pushData("กรุณาระบุ : status เป็น Active หรือ InActive เท่านั้น"));

    // Return
    if (verifyStatus.length > 0) return verifyStatus;

    // ตรวจสอบว่าเป็นจำนวนเต็มเท่านั้น
    if (!Number.isInteger(data.branchId) || data.branchId <= 0) verifyStatus.push(pushData("กรุณาระบุ : branchId เป็นตัวเลขจำนวนเต็มเท่านั้น"));
    if (!Number.isInteger(data.companyId) || data.companyId <= 0) verifyStatus.push(pushData("กรุณาระบุ : companyId เป็นตัวเลขจำนวนเต็มเท่านั้น"));
    if (!Number.isInteger(data.positionId) || data.positionId <= 0) verifyStatus.push(pushData("กรุณาระบุ : positionId เป็นตัวเลขจำนวนเต็มเท่านั้น"));

    // Return
    return verifyStatus;
};

export const getEmployeeByNameCardIdUser = async (name: string, subname: string, cardId: string, id?: number): Promise<fetchEmployee | null> => {
    try {
        let whereCondition: Prisma.EmployeeWhereInput = { name: name, subname: subname, cardId: cardId, };
        if (!id) whereCondition = { ...whereCondition, NOT: { id: id } };
        // where id
        const employee = await prisma.employee.findFirst({
            where: whereCondition,
        });

        if (!employee) return null;
        return employee as fetchEmployee;
    } catch (error: unknown) {
        // Handle any errors here or log them
        console.error('Error fetching employee:', error);
        return null;
    } finally {
        await prisma.$disconnect();
    }
}

export const getUsernameByCompanyId = async (username: string, companyId: number, id?: number): Promise<fetchEmployee | null> => {
    try {
        let whereCondition: Prisma.EmployeeWhereInput = { userName: username, companyId: companyId, };
        // where id
        if (id) whereCondition = { ...whereCondition, NOT: { id: id } };

        const employee = await prisma.employee.findFirst({
            where: whereCondition,
        });

        if (!employee) return null;
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
                role: body.role,
                status: body.status
            }
        })

        if (!addEmployee) return verifyStatus;
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

export const getEmployeeById = async (id: number): Promise<fetchEmployee | null> => {
    try {
        const employee = await prisma.employee.findUnique({
            where: {
                id: id
            },
            include: {
                branch: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                company: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                position: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });

        if (!employee) return null;
        return employee as fetchEmployee;
    } catch (error: unknown) {
        // Handle any errors here or log them
        console.error('Error fetching employee:', error);
        return null;
    } finally {
        await prisma.$disconnect();
    }
}

export const getEmployeeByCompanyId = async (companyId: number): Promise<fetchEmployee[] | null> => {
    try {
        const employee = await prisma.employee.findMany({
            where: {
                companyId: companyId,
            },
            include: {
                branch: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                company: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                position: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
            orderBy: { id: 'asc', },
        });

        const employeesWithKey: fetchEmployee[] = employee.map((employee, index) => ({
            ...employee,
            index: (index + 1),
            key: employee.id.toString(),
        }));

        if (employeesWithKey.length === 0) return null;
        return employeesWithKey;
    } catch (error: unknown) {
        // Handle any errors here or log them
        console.error('Error fetching employee:', error);
        return null;
    } finally {
        await prisma.$disconnect();
    }
}

export const getAllEmployee = async (): Promise<fetchEmployee[] | null> => {
    try {
        const employees = await prisma.employee.findMany({
            include: {
                branch: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                company: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                position: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });

        if (employees.length === 0) return null;
        return employees as fetchEmployee[];
    } catch (error: unknown) {
        // Handle any errors here or log them
        console.error('Error fetching employee:', error);
        return null;
    } finally {
        await prisma.$disconnect();
    }
}

export const updateEmployee = async (body: dataVerifyEmployee, id: number): Promise<fetchEmployee | null> => {
    try {
        const employee = await prisma.employee.update({
            where: { id },
            data: {
                name: body.name,
                subname: body.subname,
                age: body.age,
                cardId: body.cardId,
                userName: body.userName,
                role: body.role,
                status: body.status
            },
        });

        if (!employee) return null;
        return employee as fetchEmployee;
    } catch (error) {
        console.error('Error updating employee:', error);
        return null;
    } finally {
        await prisma.$disconnect();
    }
}

export const deleteDataEmployee = async (id: number): Promise<fetchEmployee | null> => {
    try {
        const deletedEmployee = await prisma.employee.delete({
            where: {
                id: id,
            },
        });

        if (!deleteDataEmployee) return null;
        return deletedEmployee as fetchEmployee;
    } catch (error: unknown) {
        // จัดการข้อผิดพลาดที่เกิดขึ้น
        console.error('เกิดข้อผิดพลาดในการลบข้อมูล:', error);
        return null;
    } finally {
        await prisma.$disconnect();
    }
}