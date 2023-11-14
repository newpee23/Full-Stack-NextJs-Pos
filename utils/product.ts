import { prisma } from "@/pages/lib/prismaDB";
import { fetchProduct } from "@/types/fetchData";
import { dataVerifyProduct, promiseDataVerify } from "@/types/verify";
import { Prisma } from "@prisma/client";

const pushData = (message: string) => {
    return { message };
};

export const verifyProductBody = (data: dataVerifyProduct): promiseDataVerify[] => {
    const verifyStatus: promiseDataVerify[] = [];

    if (!data.name) verifyStatus.push(pushData("ไม่พบข้อมูล : name"));
    if (!data.cost) verifyStatus.push(pushData("ไม่พบข้อมูล : cost"));
    if (!data.price) verifyStatus.push(pushData("ไม่พบข้อมูล : price"));
    if (!data.unitId) verifyStatus.push(pushData("ไม่พบข้อมูล : unitId"));
    if (!data.productTypeId) verifyStatus.push(pushData("ไม่พบข้อมูล : productTypeId"));
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
    if(data.img) if (data.img.length > 50) verifyStatus.push(pushData("กรุณาระบุ : img ไม่เกิน 50 อักษร"));
    if (isNaN(Number(data.cost))) verifyStatus.push(pushData("กรุณาระบุ : cost เป็นตัวเลขเท่านั้น"));
    if (isNaN(Number(data.price))) verifyStatus.push(pushData("กรุณาระบุ : price เป็นตัวเลขเท่านั้น"));
    if (isNaN(Number(data.stock))) verifyStatus.push(pushData("กรุณาระบุ : stock เป็นตัวเลขเท่านั้น"));
    if (isNaN(Number(data.unitId))) verifyStatus.push(pushData("กรุณาระบุ : unitId เป็นตัวเลขเท่านั้น"));
    if (isNaN(Number(data.productTypeId))) verifyStatus.push(pushData("กรุณาระบุ : productTypeId เป็นตัวเลขเท่านั้น"));
    if (isNaN(Number(data.companyId))) verifyStatus.push(pushData("กรุณาระบุ : companyId เป็นตัวเลขเท่านั้น"));
    if (data.status !== "Active" && data.status !== "InActive") verifyStatus.push(pushData("กรุณาระบุ : status เป็น Active หรือ InActive เท่านั้น"));

    // Return
    return verifyStatus;
};

export const fetchProductByName = async (name: string, companyId: number, id?: number): Promise<fetchProduct | null> => {
    try {
        let whereCondition: Prisma.ProductWhereInput = { name: name, companyId: companyId, };
        // where not id
        if (id) whereCondition = { ...whereCondition, NOT: { id: id } };
        const product = await prisma.product.findFirst({
            where: whereCondition
        });

        if (!product) return null;
        return product as fetchProduct;
    } catch (error: unknown) {
        // Handle any errors here or log them
        console.error('Error fetching productType:', error);
        return null;
    } finally {
        await prisma.$disconnect();
    }
}

export const fetchProductById = async (id: number): Promise<fetchProduct | null> => {
    try {
        const product = await prisma.product.findUnique({
            where: {
                id: id
            }
        });

        if (!product) return null;
        return product as fetchProduct;
    } catch (error: unknown) {
        // Handle any errors here or log them
        console.error('Error fetching productType:', error);
        return null;
    } finally {
        await prisma.$disconnect();
    }
}

export const fetchProductByCompanyId = async (companyId: number): Promise<fetchProduct[] | null> => {
    try {
        const product = await prisma.product.findMany({
            where: {
                companyId: companyId
            }
        });

        if (!product) return null;
        return product as fetchProduct[];
    } catch (error: unknown) {
        // Handle any errors here or log them
        console.error('Error fetching productType:', error);
        return null;
    } finally {
        await prisma.$disconnect();
    }
}

export const fetchAllProduct = async (): Promise<fetchProduct[] | null> => {
    try {
        const product = await prisma.product.findMany({});

        if (!product) return null;
        return product as fetchProduct[];
    } catch (error: unknown) {
        // Handle any errors here or log them
        console.error('Error fetching productType:', error);
        return null;
    } finally {
        await prisma.$disconnect();
    }
}

export const insertaddProduct = async (body: dataVerifyProduct): Promise<promiseDataVerify[] | null> => {
    const verifyStatus: promiseDataVerify[] = [];
  
    try {
      const addProduct = await prisma.product.create({
        data: body,
      });
  
      if (!addProduct) return null;
      verifyStatus.push(pushData(`Create a productType ${addProduct.name} accomplished and received id: ${addProduct.id}`));
    } catch (error: unknown) {
      console.error(`Database connection error: ${error}`);
    } finally {
      await prisma.$disconnect();
    }
    return verifyStatus;
};

export const updateDataProduct = async (body: dataVerifyProduct, id: number): Promise<fetchProduct | null> => {
    try {
        const product = await prisma.product.update({
            where: { id },
            data: {
                name: body.name,
                cost: body.cost,
                price: body.price,
                stock: body.stock,
                unitId: body.unitId,
                productTypeId: body.productTypeId,
                status: body.status
            },
        });

        if (!product) return null;
        return product as fetchProduct;
    } catch (error) {
        console.error('Error updating product:', error);
        return null;
    } finally {
        await prisma.$disconnect();
    }
}

export const deleteDataProduct = async (id: number): Promise<fetchProduct | null> => {
    try {
        const product = await prisma.product.delete({
            where: {
                id: id,
            },
        });

        if (!product) return null;
        return product as fetchProduct;
    } catch (error) {
        console.error('Error updating product:', error);
        return null;
    } finally {
        await prisma.$disconnect();
    }
}