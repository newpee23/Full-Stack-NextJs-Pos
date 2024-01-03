import { dataVerifyBranch, promiseDataVerify } from "@/types/verify";
import { dateTimeIso, checkDate1translate2, isDate, formatDate } from "./timeZone";
import { getCompanyById } from "./company";
import { fetchBranch, fetchTableBranch } from "@/types/fetchData";
import { prisma } from "@/pages/lib/prismaDB";
import { Prisma } from "@prisma/client";

const phonePattern = /^[0-9]+$/;
const pushData = (message: string) => {
  return { message };
};

export const verifyBranchBody = (data: dataVerifyBranch): promiseDataVerify[] => {
  const verifyStatus: promiseDataVerify[] = [];

  if (!data.name) verifyStatus.push(pushData("ไม่พบข้อมูล : name"));
  if (!data.codeReceipt) verifyStatus.push(pushData("ไม่พบข้อมูล : codeReceipt"));
  if (!data.address) verifyStatus.push(pushData("ไม่พบข้อมูล : address"));
  if (!data.expiration) verifyStatus.push(pushData("ไม่พบข้อมูล : expiration"));
  if (!data.phone) verifyStatus.push(pushData("ไม่พบข้อมูล : phone"));
  if (!data.companyId) verifyStatus.push(pushData("ไม่พบข้อมูล : companyId"));
  if (!data.status) verifyStatus.push(pushData("ไม่พบข้อมูล : status"));

  // Return
  if (verifyStatus.length > 0) return verifyStatus;

  // ตรวจสอบการ trim เพื่อป้องกันการกรอกช่องว่าง
  if (!data.name.trim()) verifyStatus.push(pushData("กรุณาระบุ : name"));
  if (!data.codeReceipt.trim()) verifyStatus.push(pushData("กรุณาระบุ : codeReceipt"));
  if (!data.address.trim()) verifyStatus.push(pushData("กรุณาระบุ : address"));

  // Return
  if (verifyStatus.length > 0) return verifyStatus;

  // ตรวจสอบความถูกต้องของข้อมูล
  if (data.name.length > 50) verifyStatus.push(pushData("กรุณาระบุ : name ไม่เกิน 50 อักษร"));
  if (data.codeReceipt.length > 10) verifyStatus.push(pushData("กรุณาระบุ : codeReceipt ไม่เกิน 10 อักษร"));
  if (data.phone.length > 10) verifyStatus.push(pushData("กรุณาระบุ : phone ไม่เกิน 10 อักษร"));
  if (data.status !== "Active" && data.status !== "InActive") verifyStatus.push(pushData("กรุณาระบุ : status เป็น Active หรือ InActive เท่านั้น"));
  if (isNaN(Number(data.companyId))) verifyStatus.push(pushData("กรุณาระบุ : companyId เป็นตัวเลขเท่านั้น"));
  if (!isDate(new Date())) verifyStatus.push(pushData("กรุณาระบุ : createdAt ให้ถูกต้องตามรูปแบบ Date"));
  if (!isDate(data.expiration)) verifyStatus.push(pushData("กรุณาระบุ : expiration ให้ถูกต้องตามรูปแบบ Date"));
  if (!checkDate1translate2(new Date(), data.expiration)) verifyStatus.push(pushData("กรุณาระบุ : expiration ให้มากกว่าวันเวลาปัจจุบัน"));

  const isNumericPhone = phonePattern.test(data.phone);
  if (!isNumericPhone) verifyStatus.push(pushData("กรุณาระบุ : phone เป็นตัวเลขเท่านั้น"));

  // Return
  if (verifyStatus.length > 0) return verifyStatus;

  // ตรวจสอบว่าเป็นจำนวนเต็มเท่านั้น
  if(data.companyId) if (!Number.isInteger(data.companyId) || data.companyId <= 0) verifyStatus.push(pushData("กรุณาระบุ : companyId เป็นตัวเลขจำนวนเต็มเท่านั้น"));

  // Return
  return verifyStatus;
};

export const getBranchByNameByCompany = async (companyId: number, name: string, id?: number): Promise<fetchBranch | null> => {
  try {
    let whereCondition: Prisma.BranchWhereInput = { companyId: companyId, name: name, };
    // where id
    if (id) whereCondition = { ...whereCondition, NOT: { id: id } };
    const branchName = await prisma.branch.findFirst({
      where: whereCondition,
    });

    if (!branchName) return null;
    return branchName as fetchBranch;
  } catch (error) {
    // Handle any errors here or log them
    console.error('Error fetching company:', error);
    return null;
  } finally {
    await prisma.$disconnect();
  }
};

export const checkCompanyData = async (companyId: number, name: string): Promise<promiseDataVerify[]> => {
  const verifyStatus: promiseDataVerify[] = [];
  // หาว่า companyId มีในระบบมั้ย
  const company = await getCompanyById(companyId);
  if (!company) {
    verifyStatus.push(pushData(`ไม่พบข้อมูล companyId : ${companyId} ในระบบ`));
    return verifyStatus;
  }
  // หาว่า name มีแล้วใน branch ใน company ตัวเองมั้ย
  const branch = await getBranchByNameByCompany(companyId, name);
  if (branch) {
    verifyStatus.push(pushData(`พบข้อมูล name : ${name} ถูกนำไปใช้แล้วในระบบ`));
    return verifyStatus;
  }
  return verifyStatus;
};

export const insertBranch = async (data: dataVerifyBranch): Promise<promiseDataVerify[] | null> => {
  const verifyStatus: promiseDataVerify[] = [];
  try {
    const expiration = dateTimeIso(data.expiration);
    const addBranch = await prisma.branch.create({
      data: {
        name: data.name,
        codeReceipt: data.codeReceipt,
        address: data.address,
        createdAt: new Date(),
        expiration: expiration,
        phone: data.phone,
        companyId: data.companyId ? data.companyId  : 0,
        status: data.status
      },
    });

    verifyStatus.push(pushData(`สร้างสาขา ${addBranch.name} สำเร็จและได้รับ id: ${addBranch.id}`));
  } catch (error: unknown) {
    console.error(`Database connection error: ${error}`);
  } finally {
    await prisma.$disconnect();
  }

  return verifyStatus;
};

export const getAllBranch = async (): Promise<fetchBranch[] | null> => {
  try {
    const branch = await prisma.branch.findMany();

    if (!branch) return null;
    return branch as fetchBranch[];
  } catch (error) {
    // Handle any errors here or log them
    console.error('Error fetching branch:', error);
    return null;
  } finally {
    await prisma.$disconnect();
  }
};

export const getBranchById = async (id: number): Promise<fetchBranch | null> => {
  try {
    const branch = await prisma.branch.findUnique({
      where: {
        id: id
      }
    });

    if (!branch) return null;
    return branch as fetchBranch;
  } catch (error) {
    // Handle any errors here or log them
    console.error('Error fetching branch:', error);
    return null;
  } finally {
    await prisma.$disconnect();
  }
}

export const deleteDataBranch = async (id: number): Promise<fetchBranch | null> => {
  try {
    const deletedBranch = await prisma.branch.delete({
      where: {
        id: id,
      },
    });

    if (!deleteDataBranch) null
    return deletedBranch as fetchBranch;
  } catch (error: unknown) {
    // จัดการข้อผิดพลาดที่เกิดขึ้น
    console.error('เกิดข้อผิดพลาดในการลบข้อมูล:', error);
    return null;
  } finally {
    await prisma.$disconnect();
  }
}

export const getBranchByCompanyId = async (companyId: number): Promise<fetchTableBranch[] | null> => {
  try {
    const branch = await prisma.branch.findMany({
      where: { companyId: companyId, },
      orderBy: { id: 'asc', },
    });

    if (!branch) return null;
      // สร้าง key เพื่อเอาไปใส่ table และ แปลง date เป็น str
      const branchesWithKey: fetchTableBranch[] = branch.map((branch, index) => ({
        ...branch,
        index: (index + 1),
        key: branch.id.toString(),
        createdAt: formatDate(branch.createdAt),
        expiration: formatDate(branch.expiration),
      }));

    return branchesWithKey;
  } catch (error) {
    // Handle any errors here or log them
    console.error('Error fetching branch:', error);
    return null;
  } finally {
    await prisma.$disconnect();
  }
}

export const updateDataBranch = async (id: number, updatedData: Partial<fetchBranch>): Promise<fetchBranch | null> => {
  try {
    const expirationString = updatedData.expiration;
    if (expirationString) {
      const expiration = new Date(expirationString);
      const isoExpiration = expiration.toISOString();
      const branch = await prisma.branch.update({
        where: { id },
        data: {
          name: updatedData.name,
          codeReceipt: updatedData.codeReceipt,
          address: updatedData.address,
          expiration: isoExpiration,
          phone: updatedData.phone,
          status: updatedData.status
        },
      });

      if (!branch) null
      return branch as fetchBranch;
    }
    return null;
  } catch (error) {
    console.error('Error updating branch:', error);
    return null;
  } finally {
    await prisma.$disconnect();
  }
};