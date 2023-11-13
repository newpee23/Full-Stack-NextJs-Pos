import { prisma } from "@/pages/lib/prismaDB";
import { fetchPosition } from "@/types/fetchData";
import { dataVerifyPosition, promiseDataVerify } from "@/types/verify";
import { getCompanyById } from "./company";
import { Prisma } from "@prisma/client";

const pushData = (message: string) => {
  return { message };
};

export const verifyPositionBody = (data: dataVerifyPosition): promiseDataVerify[] => {
  const verifyStatus: promiseDataVerify[] = [];

  if (!data.name) verifyStatus.push(pushData("ไม่พบข้อมูล : name"));
  if (!data.salary) verifyStatus.push(pushData("ไม่พบข้อมูล : salary"));
  if (!data.companyId) verifyStatus.push(pushData("ไม่พบข้อมูล : companyId"));
  if (!data.status) verifyStatus.push(pushData("ไม่พบข้อมูล : status"));

  // Return
  if (verifyStatus.length > 0) {
    return verifyStatus;
  }

  // ตรวจสอบการ trim เพื่อป้องกันการกรอกช่องว่าง
  if (!data.name.trim()) verifyStatus.push(pushData("กรุณาระบุ : name"));

  // Return
  if (verifyStatus.length > 0) {
    return verifyStatus;
  }

  // ตรวจสอบความถูกต้องของข้อมูล
  if (data.name.length > 50) verifyStatus.push(pushData("กรุณาระบุ : name ไม่เกิน 50 อักษร"));
  if (isNaN(Number(data.salary))) verifyStatus.push(pushData("กรุณาระบุ : salary เป็นตัวเลขเท่านั้น"));
  if (isNaN(Number(data.companyId))) verifyStatus.push(pushData("กรุณาระบุ : companyId เป็นตัวเลขเท่านั้น"));
  if (data.status !== "Active" && data.status !== "InActive") verifyStatus.push(pushData("กรุณาระบุ : status เป็น Active หรือ InActive เท่านั้น"));

  // Return
  return verifyStatus;
};

export const getAllPosition = async (): Promise<fetchPosition[] | null> => {
  try {
    const position = await prisma.position.findMany();

    if (!position) {
      return null;
    }

    return position as fetchPosition[];
  } catch (error) {
    // Handle any errors here or log them
    console.error('Error fetching position:', error);
    return null;
  } finally {
    await prisma.$disconnect();
  }
};

export const getPositionByIdByCompanyId = async (id: number, fetchColumn: string): Promise<fetchPosition | fetchPosition[] | null> => {
  try {
    //  Where Id
    if (fetchColumn === "id") {
      const position = await prisma.position.findUnique({
        where: {
          id: id
        }
      });

      if (!position) {
        return null;
      }

      return position as fetchPosition;
    }

    // Where CompanyId
    const position = await prisma.position.findMany({
      where: {
        companyId: id
      }
    });

    if (!position) {
      return null;
    }

    return position as fetchPosition[];

  } catch (error) {
    // Handle any errors here or log them
    console.error('Error fetching position:', error);
    return null;
  } finally {
    await prisma.$disconnect();
  }
};

export const getPositionByCompanyName = async (companyId: number, name: string, id?: number): Promise<fetchPosition | null> => {
  try {
    let whereCondition: Prisma.PositionWhereInput = { companyId: companyId, name: name, };
    // Where name not company
    if (id) {
        whereCondition = { ...whereCondition, NOT: { id: id } };
    }
    // Where name
    const position = await prisma.position.findFirst({
      where: whereCondition,
    });

    if (!position) {
      return null;
    }

    return position as fetchPosition;
  } catch (error) {
    // Handle any errors here or log them
    console.error('Error fetching position:', error);
    return null;
  } finally {
    await prisma.$disconnect();
  }
};

export const deleteDataPosition = async (id: number): Promise<fetchPosition | null> => {
  try {
    const deletedPosition = await prisma.position.delete({
      where: {
        id: id,
      },
    });

    return deletedPosition as fetchPosition;
  } catch (error) {
    // จัดการข้อผิดพลาดที่เกิดขึ้น
    console.error('An error occurred deleting data.:', error);
    return null;
  } finally {
    await prisma.$disconnect();
  }
};

export const checkPositionData = async (companyId: number, name: string, id?: number): Promise<promiseDataVerify[]> => {
  const verifyStatus: promiseDataVerify[] = [];

  // หาว่า companyId มีในระบบมั้ย
  const company = await getCompanyById(companyId);
  if (!company) {
    verifyStatus.push(pushData(`No information found companyId : ${companyId} in the system.`));
    return verifyStatus;
  }

  // หาว่า name มีแล้วใน position ใน company ตัวเองมั้ย
  const position = await getPositionByCompanyName(companyId, name, id);
  if (position) {
    verifyStatus.push(pushData(`Found information name : ${name} has already been used in the system.`));
    return verifyStatus;
  }

  return verifyStatus;
};

export const insertPosition = async (body: dataVerifyPosition): Promise<promiseDataVerify[] | null> => {
  const verifyStatus: promiseDataVerify[] = [];

  try {
    const addPosition = await prisma.position.create({
      data: {
        name: body.name,
        salary: body.salary,
        companyId: body.companyId,
        status: body.status
      },
    });

    verifyStatus.push(pushData(`Create a position ${addPosition.name} accomplished and received id: ${addPosition.id}`));
  } catch (error: unknown) {
    console.error(`Database connection error: ${error}`);
  } finally {
    await prisma.$disconnect();
  }
  return verifyStatus;
};

export const updatePosition = async (id:number, updatedData: Partial<fetchPosition>): Promise<fetchPosition | null> => {
  try {
    const position = await prisma.position.update({
      where: { id },
      data: updatedData,
    });

    return position as fetchPosition;
  } catch (error) {
    console.error('Error updating branch:', error);
    return null;
  } finally {
    await prisma.$disconnect();
  }
};

