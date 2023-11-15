import { prisma } from "@/pages/lib/prismaDB";
import { fetchItemPromotion } from "@/types/fetchData";
import { dataVerifyItemPromotion, promiseDataVerify } from "@/types/verify";

const pushData = (message: string) => {
    return { message };
};

export const verifyItemPromotionBody = (data: dataVerifyItemPromotion): promiseDataVerify[] => {
    const verifyStatus: promiseDataVerify[] = [];

    if (!data.productId) verifyStatus.push(pushData("ไม่พบข้อมูล : productId"));
    if (!data.stock) verifyStatus.push(pushData("ไม่พบข้อมูล : stock"));
    if (!data.promotionId) verifyStatus.push(pushData("ไม่พบข้อมูล : promotionId"));
    if (!data.status) verifyStatus.push(pushData("ไม่พบข้อมูล : status"));

    // Return
    if (verifyStatus.length > 0) return verifyStatus;

    // ตรวจสอบความถูกต้องของข้อมูล
    if (isNaN(Number(data.productId))) verifyStatus.push(pushData("กรุณาระบุ : productId เป็นตัวเลขเท่านั้น"));
    if (isNaN(Number(data.stock))) verifyStatus.push(pushData("กรุณาระบุ : productId เป็นตัวเลขเท่านั้น"));
    if (isNaN(Number(data.promotionId))) verifyStatus.push(pushData("กรุณาระบุ : productId เป็นตัวเลขเท่านั้น"));
    if (data.status !== "Active" && data.status !== "InActive") verifyStatus.push(pushData("กรุณาระบุ : status เป็น Active หรือ InActive เท่านั้น"));

    // Return
    if (verifyStatus.length > 0) return verifyStatus;

    // ตรวจสอบว่าเป็นจำนวนเต็มเท่านั้น
    if (!Number.isInteger(data.productId) || data.productId <= 0) verifyStatus.push(pushData("กรุณาระบุ : productId เป็นตัวเลขจำนวนเต็มเท่านั้น"));
    if (!Number.isInteger(data.promotionId) || data.promotionId <= 0) verifyStatus.push(pushData("กรุณาระบุ : promotionId เป็นตัวเลขจำนวนเต็มเท่านั้น"));
    // Return
    return verifyStatus;
};

export const insertItemPromotion = async (body: dataVerifyItemPromotion): Promise<promiseDataVerify[] | null> => {
    const verifyStatus: promiseDataVerify[] = [];
    try {
        const additemPromotion = await prisma.itemPromotion.create({
            data: body,
        });

        if (!additemPromotion) return null;
        verifyStatus.push(pushData(`Create a itemPromotion accomplished and received id: ${additemPromotion.id}`));
    } catch (error: unknown) {
        console.error(`Database connection error: ${error}`);
    } finally {
        await prisma.$disconnect();
    }
    return verifyStatus;
};

export const fetchItemPromotionById = async (id: number): Promise<fetchItemPromotion | null> => {
    try {
        const itemPromotion = await prisma.itemPromotion.findUnique({
            where: {
                id: id
            }
        });

        if (!itemPromotion) return null;
        return itemPromotion as fetchItemPromotion;
    } catch (error) {
        // Handle any errors here or log them
        console.error('Error fetching itemPromotion:', error);
        return null;
    } finally {
        await prisma.$disconnect();
    }
}

export const fetchItemPromotionByPromotionId = async (promotionId: number): Promise<fetchItemPromotion[] | null> => {
    try {
        const itemPromotion = await prisma.itemPromotion.findMany({
            where: {
                promotionId: promotionId
            }
        });

        if (!itemPromotion) return null;
        return itemPromotion as fetchItemPromotion[];
    } catch (error) {
        // Handle any errors here or log them
        console.error('Error fetching itemPromotion:', error);
        return null;
    } finally {
        await prisma.$disconnect();
    }
}

export const fetchAllItemPromotion = async (): Promise<fetchItemPromotion[] | null> => {
    try {
        const itemPromotion = await prisma.itemPromotion.findMany({});

        if (!itemPromotion) return null;
        return itemPromotion as fetchItemPromotion[];
    } catch (error) {
        // Handle any errors here or log them
        console.error('Error fetching itemPromotion:', error);
        return null;
    } finally {
        await prisma.$disconnect();
    }
}

export const updateDataItemPromotion = async (body: dataVerifyItemPromotion, id: number): Promise<fetchItemPromotion | null> => {
    try {
        const itemPromotion = await prisma.itemPromotion.update({
            where: { id },
            data: {
                stock: body.stock,
                status: body.status
            },
        });

        if (!itemPromotion) return null;
        return itemPromotion as fetchItemPromotion;
    } catch (error) {
        console.error('Error updating itemPromotion:', error);
        return null;
    } finally {
        await prisma.$disconnect();
    }
}

export const deleteDataItemPromotion = async (id: number): Promise<fetchItemPromotion | null> => {
    try {
        const deletedItemPromotion = await prisma.itemPromotion.delete({
            where: {
                id: id,
            },
        });

        if (!deletedItemPromotion) null
        return deletedItemPromotion as fetchItemPromotion;
    } catch (error: unknown) {
        // จัดการข้อผิดพลาดที่เกิดขึ้น
        console.error('An error occurred deleting data.:', error);
        return null;
    } finally {
        await prisma.$disconnect();
    }
}
