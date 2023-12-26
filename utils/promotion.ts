import { dataUpdateImgPromotion, dataVerifyPromotion, promiseDataVerify } from "@/types/verify";
import { checkDate1translate2, dateTimeIso, formatDate, isDate, isValidDate } from "./timeZone";
import { fetchPromotion } from "@/types/fetchData";
import { Prisma } from "@prisma/client";
import { prisma } from "@/pages/lib/prismaDB";

const pushData = (message: string) => {
    return { message };
};

export const verifyPromotionBody = (data: dataVerifyPromotion): promiseDataVerify[] => {
    const verifyStatus: promiseDataVerify[] = [];

    if (!data.name) verifyStatus.push(pushData("ไม่พบข้อมูล : name"));
    if (!data.detail) verifyStatus.push(pushData("ไม่พบข้อมูล : detail"));
    if (!data.promotionalPrice) verifyStatus.push(pushData("ไม่พบข้อมูล : promotionalPrice"));
    if (!data.startDate) verifyStatus.push(pushData("ไม่พบข้อมูล : startDate"));
    if (!data.endDate) verifyStatus.push(pushData("ไม่พบข้อมูล : endDate"));
    if (!data.companyId) verifyStatus.push(pushData("ไม่พบข้อมูล : companyId"));
    if (!data.status) verifyStatus.push(pushData("ไม่พบข้อมูล : status"));

    // Return
    if (verifyStatus.length > 0) return verifyStatus;

    // ตรวจสอบการ trim เพื่อป้องกันการกรอกช่องว่าง
    if (!data.name.trim()) verifyStatus.push(pushData("กรุณาระบุ : name"));
    if (!data.detail.trim()) verifyStatus.push(pushData("กรุณาระบุ : detail"));

    // Return
    if (verifyStatus.length > 0) return verifyStatus;

    // ตรวจสอบความถูกต้องของข้อมูล
    if (data.name.length > 50) verifyStatus.push(pushData("กรุณาระบุ : name ไม่เกิน 50 อักษร"));
    if (data.detail.length > 50) verifyStatus.push(pushData("กรุณาระบุ : detail ไม่เกิน 50 อักษร"));
    if (isNaN(Number(data.promotionalPrice))) verifyStatus.push(pushData("กรุณาระบุ : promotionalPrice เป็นตัวเลขเท่านั้น"));
    if (!isDate(data.startDate)) verifyStatus.push(pushData("รูปแบบไม่ถูกต้อง : startDate"));
    if (!isDate(data.endDate)) verifyStatus.push(pushData("รูปแบบไม่ถูกต้อง : endDate"));
    if (!checkDate1translate2(data.startDate, data.endDate)) verifyStatus.push(pushData("กรุณาระบุ : endDate ให้มากกว่า startDate"));
    if (isNaN(Number(data.companyId))) verifyStatus.push(pushData("กรุณาระบุ : companyId เป็นตัวเลขเท่านั้น"));
    if (data.status !== "Active" && data.status !== "InActive") verifyStatus.push(pushData("กรุณาระบุ : status เป็น Active หรือ InActive เท่านั้น"));

    // Return
    if (verifyStatus.length > 0) return verifyStatus;

    // ตรวจสอบว่าเป็นจำนวนเต็มเท่านั้น
    if (!Number.isInteger(data.companyId) || data.companyId <= 0) verifyStatus.push(pushData("กรุณาระบุ : companyId เป็นตัวเลขจำนวนเต็มเท่านั้น"));

    // Return
    return verifyStatus;
};

export const VerifyUpdateImagePromotion = (data: dataUpdateImgPromotion): promiseDataVerify[] => {
    const verifyStatus: promiseDataVerify[] = [];
    if (!data.fileName) verifyStatus.push(pushData("ไม่พบข้อมูล : fileName"));
    if (!data.promotionId) verifyStatus.push(pushData("ไม่พบข้อมูล : promotionId"));
    if (!data.companyId) verifyStatus.push(pushData("ไม่พบข้อมูล : companyId"));

    // Return
    if (verifyStatus.length > 0) return verifyStatus;

    // ตรวจสอบความถูกต้องของข้อมูล
    if (!data.fileName.trim()) verifyStatus.push(pushData("กรุณาระบุ : fileName"));
    if (!Number.isInteger(data.companyId) || data.companyId <= 0) verifyStatus.push(pushData("กรุณาระบุ : companyId เป็นตัวเลขจำนวนเต็มเท่านั้น"));
    if (!Number.isInteger(data.promotionId) || data.promotionId <= 0) verifyStatus.push(pushData("กรุณาระบุ : promotionId เป็นตัวเลขจำนวนเต็มเท่านั้น"));
    // Return
    return verifyStatus;
};

export const fetchPromotionNameByCompanyId = async (name: string, companyId: number, id?: number): Promise<fetchPromotion | null> => {
    try {
        let whereCondition: Prisma.PromotionWhereInput = { name: name, companyId: companyId, };
        // where not id
        if (id) whereCondition = { ...whereCondition, NOT: { id: id } };
        const promotion = await prisma.promotion.findFirst({
            where: whereCondition
        });

        if (!promotion) return null;
        return promotion as fetchPromotion;
    } catch (error: unknown) {
        // Handle any errors here or log them
        console.error('Error fetching promotion:', error);
        return null;
    } finally {
        await prisma.$disconnect();
    }
}

export const insertPromotion = async (body: dataVerifyPromotion): Promise<promiseDataVerify[] | null> => {
    const verifyStatus: promiseDataVerify[] = [];
    try {
        const addPromotion = await prisma.promotion.create({
            data: {
                name: body.name,
                detail: body.detail,
                promotionalPrice: body.promotionalPrice,
                startDate: dateTimeIso(body.startDate),
                endDate: dateTimeIso(body.endDate),
                companyId: body.companyId,
                status: body.status
            },
        });

        if (!addPromotion) return null;
        verifyStatus.push(pushData(`${addPromotion.id}`));
    } catch (error: unknown) {
        console.error(`Database connection error: ${error}`);
    } finally {
        await prisma.$disconnect();
    }
    return verifyStatus;
};

export const fetchPromotionById = async (id: number): Promise<fetchPromotion | null> => {
    try {
        const promotion = await prisma.promotion.findUnique({
            where: {
                id: id
            }
        });

        if (!promotion) return null;
        return promotion as fetchPromotion;
    } catch (error) {
        // Handle any errors here or log them
        console.error('Error fetching promotion:', error);
        return null;
    } finally {
        await prisma.$disconnect();
    }
}

export const fetchPromotionByCompanyId = async (companyId: number): Promise<fetchPromotion[] | null> => {
    try {
        const promotion = await prisma.promotion.findMany({
            where: {
                companyId: companyId
            }
            , orderBy: { id: 'asc', },
        });

        if (!promotion) return null;
        // สร้าง key เพื่อเอาไปใส่ table และ แปลง date เป็น str
        const promotionWithKey: fetchPromotion[] = promotion.map((promotion, index) => ({
            ...promotion,
            index: (index + 1),
            key: promotion.id.toString(),
            img: promotion.img ? promotion.img : "",
            startDate: formatDate(promotion.startDate),
            endDate: formatDate(promotion.endDate),
        }));
        return promotionWithKey;
    } catch (error) {
        // Handle any errors here or log them
        console.error('Error fetching promotion:', error);
        return null;
    } finally {
        await prisma.$disconnect();
    }
}

export const fetchAllPromotion = async (): Promise<fetchPromotion[] | null> => {
    try {
        const promotion = await prisma.promotion.findMany({orderBy: { id: 'asc', },});

        if (!promotion) return null;
        return promotion as fetchPromotion[];
    } catch (error) {
        // Handle any errors here or log them
        console.error('Error fetching promotion:', error);
        return null;
    } finally {
        await prisma.$disconnect();
    }
}

export const updateDataPromotion = async (body: dataVerifyPromotion, id: number): Promise<fetchPromotion | null> => {
    try {
        const promotion = await prisma.promotion.update({
            where: { id },
            data: {
                name: body.name,
                detail: body.detail,
                img: body.imageUrl ? body.imageUrl : null,
                promotionalPrice: body.promotionalPrice,
                startDate: dateTimeIso(body.startDate),
                endDate: dateTimeIso(body.endDate),
                status: body.status
            },
        });

        if (!promotion) return null;
        return promotion as fetchPromotion;
    } catch (error) {
        console.error('Error updating promotion:', error);
        return null;
    } finally {
        await prisma.$disconnect();
    }
}

export const deleteDataPromotion = async (id: number): Promise<fetchPromotion | null> => {
    try {
        const deletedPromotion = await prisma.promotion.delete({
            where: {
                id: id,
            },
        });

        if (!deletedPromotion) null
        return deletedPromotion as fetchPromotion;
    } catch (error: unknown) {
        // จัดการข้อผิดพลาดที่เกิดขึ้น
        console.error('An error occurred deleting data.:', error);
        return null;
    } finally {
        await prisma.$disconnect();
    }
}

export const updateDataImagePromotion = async (body: dataUpdateImgPromotion, id: number): Promise<fetchPromotion | null> => {
    try {
        const promotion = await prisma.promotion.update({
            where: { id },
            data: {
               img: body.fileName
            },
        });

        if (!promotion) return null;
        return promotion as fetchPromotion;
    } catch (error) {
        console.error('Error updating promotion:', error);
        return null;
    } finally {
        await prisma.$disconnect();
    }
}