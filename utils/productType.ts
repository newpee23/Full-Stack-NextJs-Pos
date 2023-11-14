import { dataVerifyProductType, promiseDataVerify } from "@/types/verify";
import { getCompanyById } from "./company";
import { prisma } from "@/pages/lib/prismaDB";
import { fetchProductType } from "@/types/fetchData";
import { Prisma } from "@prisma/client";

const pushData = (message: string) => {
    return { message };
};

export const verifyProductTypeBody = (data: dataVerifyProductType): promiseDataVerify[] => {
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
    return verifyStatus;
};

export const fetchProductTypeByName = async (name: string, companyId: number, id?: number): Promise<fetchProductType | null> => {
    try {
        let whereCondition: Prisma.ProductTypeWhereInput = { name: name, companyId: companyId, };
        // where not id
        if (id) whereCondition = { ...whereCondition, NOT: { id: id } };
        const productType = await prisma.productType.findFirst({
            where: whereCondition
        });

        if (!productType) return null;
        return productType as fetchProductType;
    } catch (error: unknown) {
        // Handle any errors here or log them
        console.error('Error fetching productType:', error);
        return null;
    } finally {
        await prisma.$disconnect();
    }
}

export const checkProductTypeDataByName = async (companyId: number, name: string, id?: number): Promise<promiseDataVerify[]> => {
    const verifyStatus: promiseDataVerify[] = [];
    // หาว่า companyId มีในระบบมั้ย
    const company = await getCompanyById(companyId);
    if (!company) {
        verifyStatus.push(pushData(`No information found companyId : ${companyId} in the system.`));
        return verifyStatus;
    }
    // หาว่า name มีแล้วใน ProductType ใน company ตัวเองมั้ย
    const productType = await fetchProductTypeByName(name, companyId, id);
    if (productType) {
        verifyStatus.push(pushData(`Found information name : ${name} has already been used in the system.`));
        return verifyStatus;
    }

    return verifyStatus;
};

export const insertaddProductType = async (body: dataVerifyProductType): Promise<promiseDataVerify[] | null> => {
    const verifyStatus: promiseDataVerify[] = [];
  
    try {
      const addProductType = await prisma.productType.create({
        data: body,
      });
  
      if (!addProductType) return null;
      verifyStatus.push(pushData(`Create a productType ${addProductType.name} accomplished and received id: ${addProductType.id}`));
    } catch (error: unknown) {
      console.error(`Database connection error: ${error}`);
    } finally {
      await prisma.$disconnect();
    }
    return verifyStatus;
};

export const fetchProductTypeById = async (id: number): Promise<fetchProductType | null> => {
    try {
        const productType = await prisma.productType.findFirst({
            where: {
                id: id
            }
        });

        if (!productType) return null;
        return productType as fetchProductType;
    } catch (error: unknown) {
        // Handle any errors here or log them
        console.error('Error fetching productType:', error);
        return null;
    } finally {
        await prisma.$disconnect();
    }
}

export const fetchProductTypeByCompanyId = async (companyId: number): Promise<fetchProductType[] | null> => {
    try {
        const productType = await prisma.productType.findMany({
            where: {
                companyId: companyId
            }
        });

        if (productType.length === 0) return null;
        return productType as fetchProductType[];
    } catch (error: unknown) {
        // Handle any errors here or log them
        console.error('Error fetching productType:', error);
        return null;
    } finally {
        await prisma.$disconnect();
    }
}

export const fetchAllProductType = async (): Promise<fetchProductType[] | null> => {
    try {
        const productType = await prisma.productType.findMany({});

        if (productType.length === 0) return null;
        return productType as fetchProductType[];
    } catch (error: unknown) {
        // Handle any errors here or log them
        console.error('Error fetching productType:', error);
        return null;
    } finally {
        await prisma.$disconnect();
    }
}

export const updateDataProductType = async (body: dataVerifyProductType, id: number): Promise<fetchProductType | null> => {
    try {
        const productType = await prisma.productType.update({
            where: { id },
            data: {
                name: body.name,
                status: body.status
            },
        });

        if (!productType) return null;
        return productType as fetchProductType;
    } catch (error) {
        console.error('Error updating productType:', error);
        return null;
    } finally {
        await prisma.$disconnect();
    }
}

export const deleteDataProductType = async (id: number): Promise<fetchProductType | null> => {
    try {
        const deletedProductType = await prisma.productType.delete({
            where: {
                id: id,
            },
        });

        if (!deletedProductType) return null;
        return deletedProductType as fetchProductType;
    } catch (error) {
        console.error('Error updating productType:', error);
        return null;
    } finally {
        await prisma.$disconnect();
    }
}