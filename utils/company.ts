import { dataVerifyCompany, promiseDataVerify } from "@/types/verify";
import { prisma } from "@/pages/lib/prismaDB";
import { fetchCompany } from "@/types/fetchData";

const pushData = (message: string) => {
  return { message };
};

export const verifyCompanyBody = (data: dataVerifyCompany): promiseDataVerify[] => {
  const verifyStatus: promiseDataVerify[] = [];
  const phonePattern = /^[0-9]+$/;

  if (!data.name) verifyStatus.push(pushData("ไม่พบข้อมูล : name"));
  if (!data.address) verifyStatus.push(pushData("ไม่พบข้อมูล : address"));
  if (!data.tax) verifyStatus.push(pushData("ไม่พบข้อมูล : tax"));
  if (!data.phone) verifyStatus.push(pushData("ไม่พบข้อมูล : phone"));
  if (!data.email) verifyStatus.push(pushData("ไม่พบข้อมูล : email"));
  // if (data.logo) verifyStatus.push(pushData("ไม่พบข้อมูล : logo"));
  if (!data.status) verifyStatus.push(pushData("ไม่พบข้อมูล : status"));

  // Return
  if (verifyStatus.length > 0) return verifyStatus;

  // ตรวจสอบการ trim เพื่อป้องกันการกรอกช่องว่าง
  if (!data.name.trim()) verifyStatus.push(pushData("กรุณาระบุ : name"));
  if (!data.tax.trim()) verifyStatus.push(pushData("กรุณาระบุ : tax"));
  if (!data.phone.trim()) verifyStatus.push(pushData("กรุณาระบุ : phone"));
  if (!data.email.trim()) verifyStatus.push(pushData("กรุณาระบุ : email"));

  // Return
  if (verifyStatus.length > 0) return verifyStatus;

  // ตรวจสอบความถูกต้องของข้อมูล
  if (data.name.length > 50) verifyStatus.push(pushData("กรุณาระบุ : name ไม่เกิน 50 อักษร"));
  if (data.tax.length > 30) verifyStatus.push(pushData("กรุณาระบุ : tax ไม่เกิน 30 อักษร"));
  if (data.phone.length > 10) verifyStatus.push(pushData("กรุณาระบุ : phone ไม่เกิน 10 อักษร"));
  if (data.email.length > 50) verifyStatus.push(pushData("กรุณาระบุ : email ไม่เกิน 50 อักษร"));
  if (data.logo && data.logo.length > 50) verifyStatus.push(pushData("กรุณาระบุ : logo ไม่เกิน 50 อักษร"));
  if (data.status !== "Active" && data.status !== "InActive") verifyStatus.push(pushData("กรุณาระบุ : status เป็น Active หรือ InActive เท่านั้น"));
  const isNumericPhone = phonePattern.test(data.phone);
  if (!isNumericPhone) verifyStatus.push(pushData("กรุณาระบุ : phone เป็นตัวเลขเท่านั้น"));
  // Return
  return verifyStatus;
};

export const checkDataCompany = async (data: dataVerifyCompany): Promise<promiseDataVerify[]> => {
  const verifyStatus: promiseDataVerify[] = [];

  try {
    const company = await prisma.company.findMany({
      where: {
        OR: [
          {
            name: data.name
          },
          {
            tax: data.tax
          }
        ]
      }
    });

    if (company.length > 0) verifyStatus.push(pushData(`พบบริษัท ${data.name} ถูกใช้งานแล้ว`));
  } catch (error: unknown) {
    verifyStatus.push(pushData(`Database connection error: ${error}`));
  } finally {
    await prisma.$disconnect();
  }

  return verifyStatus;
};

export const insertDataCompany = async (data: dataVerifyCompany): Promise<promiseDataVerify[]> => {
  const verifyStatus: promiseDataVerify[] = [];
  try {
    const addCompany = await prisma.company.create({
      data: {
        name: data.name,
        address: data.address,
        tax: data.tax,
        phone: data.phone,
        email: data.email,
        logo: data.logo,
        status: data.status,
        createdAt: new Date()
      },
    });

    if (!addCompany) return verifyStatus;
    verifyStatus.push(pushData(`สร้างบริษัท ${addCompany.name} สำเร็จและได้รับ id: ${addCompany.id}`));
  } catch (error: unknown) {
    verifyStatus.push(pushData(`Database connection error: ${error}`));
  } finally {
    await prisma.$disconnect();
  }

  return verifyStatus;
};

export const getCompanyById = async (id: number): Promise<fetchCompany | null> => {
  try {
    const company = await prisma.company.findUnique({
      where: {
        id: id,
      },
    });

    if (!company) return null;
    return company as fetchCompany;
  } catch (error) {
    // Handle any errors here or log them
    console.error('Error fetching company:', error);
    return null;
  } finally {
    await prisma.$disconnect();
  }
};

export const getAllCompany = async (): Promise<fetchCompany[] | null> => {
  try {
    const company = await prisma.company.findMany();

    if (!company) return null;
    return company as fetchCompany[];
  } catch (error) {
    // Handle any errors here or log them
    console.error('Error fetching companies:', error);
    return null;
  } finally {
    await prisma.$disconnect();
  }
};

export const updateDataCompany = async (id: number, updatedData: Partial<fetchCompany>): Promise<fetchCompany | null> => {
  try {

    const company = await prisma.company.update({
      where: { id },
      data: updatedData,
    });

    if (!company) return null;
    return company as fetchCompany;
  } catch (error) {
    console.error('Error updating company:', error);
    return null;
  } finally {
    await prisma.$disconnect();
  }
};

export const getCompanyByName = async (name: string, tax: string, id: number): Promise<fetchCompany | null> => {
  try {
    const company = await prisma.company.findFirst({
      where: {
        name: name,
        tax: tax,
        NOT: { id: id },
      },
    });

    if (!company) return null;
    return company as fetchCompany;
  } catch (error) {
    // Handle any errors here or log them
    console.error('Error fetching company:', error);
    return null;
  } finally {
    await prisma.$disconnect();
  }
};

export const deleteDataCompany = async (id: number): Promise<fetchCompany | null> => {
  try {
    const deletedCompany = await prisma.company.delete({
      where: {
        id: id,
      },
    });

    if (!deleteDataCompany) return null;
    return deletedCompany as fetchCompany;
  } catch (error) {
    // จัดการข้อผิดพลาดที่เกิดขึ้น
    console.error('เกิดข้อผิดพลาดในการลบข้อมูล:', error);
    return null;
  } finally {
    await prisma.$disconnect();
  }
}
