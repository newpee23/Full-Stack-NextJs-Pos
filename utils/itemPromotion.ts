import { prisma } from "@/pages/lib/prismaDB";
import { fetchItemPromotion, fetchItemPromotionInPromotion } from "@/types/fetchData";
import { dataVerifyIUpdatetemPromotion, dataVerifyItemPromotion, promiseDataVerify } from "@/types/verify";
import { fetchPromotionById } from "./promotion";
import { fetchProductById } from "./product";

const pushData = (message: string) => {
    return { message };
};

export const verifyItemPromotionBody = (data: dataVerifyItemPromotion[]): promiseDataVerify[] => {
    const verifyStatus: promiseDataVerify[] = [];

    data.forEach((item, index) => {
        if (!item.promotionId) verifyStatus.push(pushData(`ไม่พบข้อมูล : promotionId แถวที่ ${index + 1}`));
        if (!item.productId) verifyStatus.push(pushData(`ไม่พบข้อมูล : productId แถวที่ ${index + 1}`));
        if (!item.stock) verifyStatus.push(pushData(`ไม่พบข้อมูล : stock แถวที่ ${index + 1}`));
        if (!item.status) verifyStatus.push(pushData(`ไม่พบข้อมูล : status แถวที่ ${index + 1}`));
    });

    // Return
    if (verifyStatus.length > 0) return verifyStatus;

    // ตรวจสอบความถูกต้องของข้อมูล
    data.forEach((item, index) => {
        if (!Number.isInteger(item.promotionId) || item.promotionId <= 0) verifyStatus.push(pushData(`กรุณาระบุ : promotionId แถวที่ ${index + 1} เป็นตัวเลขจำนวนเต็มเท่านั้น`));
        if (!Number.isInteger(item.productId) || item.productId <= 0) verifyStatus.push(pushData(`กรุณาระบุ : productId แถวที่ ${index + 1} เป็นตัวเลขจำนวนเต็มเท่านั้น`));
        if (isNaN(Number(item.stock))) verifyStatus.push(pushData(`กรุณาระบุ : stock แถวที่ ${index + 1} เป็นตัวเลขเท่านั้น`));
        if (item.status !== "Active" && item.status !== "InActive") verifyStatus.push(pushData(`กรุณาระบุ : status แถวที่ ${index + 1} เป็น Active หรือ InActive เท่านั้น`));
    });

    return verifyStatus;
};

export const checkArrayPromotionId = async (data: dataVerifyItemPromotion[]): Promise<promiseDataVerify[]> => {
    const verifyStatus: promiseDataVerify[] = [];

    for (let index = 0; index < data.length; index++) {
        const item = data[index];
        const checkPromotionId = await fetchPromotionById(item.promotionId);
        if (!checkPromotionId) verifyStatus.push(pushData(`ไม่พบข้อมูล : promotionId แถวที่ ${index + 1}`));
    }

    return verifyStatus;
};

export const checkArrayProductId = async (data: dataVerifyItemPromotion[]): Promise<promiseDataVerify[]> => {
    const verifyStatus: promiseDataVerify[] = [];

    for (let index = 0; index < data.length; index++) {
        const item = data[index];
        const checkProductId = await fetchProductById(item.productId);
        if (!checkProductId) verifyStatus.push(pushData(`ไม่พบข้อมูล : productId แถวที่ ${index + 1}`));
    }

    return verifyStatus;
};

export const checkArrayPdIdInPromotionId = async (data: dataVerifyItemPromotion[]): Promise<promiseDataVerify[]> => {
    const verifyStatus: promiseDataVerify[] = [];

    for (let index = 0; index < data.length; index++) {
        const item = data[index];
        const checkProductId = await fetchProductInItemPromotion(item.productId, item.promotionId);
        if (checkProductId && checkProductId?.length > 0) verifyStatus.push(pushData(`พบข้อมูล : สินค้า แถวที่ ${index + 1} ถูกใช้งานในโปรโมชั่นนี้แล้ว`));
    }

    return verifyStatus;
};

export const insertArrayPromotionItem = async (data: dataVerifyItemPromotion[]): Promise<promiseDataVerify[]> => {
    const verifyStatus: promiseDataVerify[] = [];

    for (let index = 0; index < data.length; index++) {
        const item = data[index];
        const insertItem = await insertItemPromotion(item);
        if (!insertItem) verifyStatus.push(pushData(`บันทึกข้อมูล : itemPromotion ไม่สำเร็จแถวที่ ${index + 1}`));
    }

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

export const fetchItemPromotionById = async (id: number): Promise<fetchItemPromotionInPromotion[] | null> => {
    try {
        const itemPromotion = await prisma.promotion.findMany({
            select: {
                id: true,
                name: true,
                ItemPromotions: {
                    select: {
                        id: true,
                        productId: true,
                        stock: true,
                        promotionId: true,
                        status: true,
                    },
                },
            },
            where: {
                id: id,
            },
            orderBy: { id: 'asc' },
        });

        if (!itemPromotion) return null;
        // สร้าง key เพื่อเอาไปใส่ table และ แปลง date เป็น str
        const promotionWithKey: fetchItemPromotionInPromotion[] = itemPromotion.map((itemPromotion, index) => ({
            ...itemPromotion,
            index: (index + 1),
            key: itemPromotion.id.toString(),
            totalItem: itemPromotion.ItemPromotions.length,
        }));
        return promotionWithKey;
    } catch (error) {
        // Handle any errors here or log them
        console.error('Error fetching itemPromotion:', error);
        return null;
    } finally {
        await prisma.$disconnect();
    }
}

export const fetchItemPromotionByPromotionId = async (promotionId: number): Promise<fetchItemPromotionInPromotion[] | null> => {
    try {
        
        const itemPromotion = await prisma.promotion.findMany({
            select: {
                id: true,
                name: true,
                ItemPromotions: {
                    select: {
                        id: true,
                        productId: true,
                        stock: true,
                        promotionId: true,
                        status: true,
                    },
                },
            },
            where: {
                id: promotionId,
            },
            orderBy: { id: 'asc' },
        });

        if (!itemPromotion) return null;
        // สร้าง key เพื่อเอาไปใส่ table และ แปลง date เป็น str
        const promotionWithKey: fetchItemPromotionInPromotion[] = itemPromotion.map((itemPromotion, index) => ({
            ...itemPromotion,
            index: (index + 1),
            key: itemPromotion.id.toString(),
            totalItem: itemPromotion.ItemPromotions.length,
        }));
        return promotionWithKey;
    } catch (error) {
        // Handle any errors here or log them
        console.error('Error fetching itemPromotion:', error);
        return null;
    } finally {
        await prisma.$disconnect();
    }
}


export const fetchItemPromotionByPromotionIdPdId = async (promotionId: number,productId: number): Promise<fetchItemPromotion | null> => {
    try {
        
        const itemPromotion = await prisma.itemPromotion.findFirst({
            where: {
                promotionId: promotionId,
                productId: productId,
            },
            orderBy: { id: 'asc' },
        });

        if (!itemPromotion) return null;
    
        return itemPromotion;
    } catch (error) {
        // Handle any errors here or log them
        console.error('Error fetching itemPromotion:', error);
        return null;
    } finally {
        await prisma.$disconnect();
    }
}

export const fetchItemPromotionByCompanyId = async (companyId: number): Promise<fetchItemPromotionInPromotion[] | null> => {
    try {
        const itemPromotion = await prisma.promotion.findMany({
            select: {
                id: true,
                name: true,
                ItemPromotions: {
                    select: {
                        id: true,
                        productId: true,
                        stock: true,
                        promotionId: true,
                        status: true,
                    },
                },
            },
            where: {
                companyId: companyId,
                ItemPromotions: {
                    some: {} // ในกรณีนี้, some หมายถึง "มีอย่างน้อยหนึ่ง"
                },
            },
            orderBy: { id: 'asc' },
        });

        if (!itemPromotion) return null;
        // สร้าง key เพื่อเอาไปใส่ table และ แปลง date เป็น str
        const promotionWithKey: fetchItemPromotionInPromotion[] = itemPromotion.map((itemPromotion, index) => ({
            ...itemPromotion,
            index: (index + 1),
            key: itemPromotion.id.toString(),
            totalItem: itemPromotion.ItemPromotions.length,
        }));
        return promotionWithKey;
    } catch (error) {
        // Handle any errors here or log them
        console.error('Error fetching itemPromotion:', error);
        return null;
    } finally {
        await prisma.$disconnect();
    }
}

export const fetchAllItemPromotion = async (): Promise<fetchItemPromotionInPromotion[] | null> => {
    try {
        const itemPromotion = await prisma.promotion.findMany({
            select: {
                id: true,
                name: true,
                ItemPromotions: {
                    select: {
                        id: true,
                        productId: true,
                        stock: true,
                        promotionId: true,
                        status: true,
                    },
                },
            },
            where: {
                ItemPromotions: {
                    some: {} // ในกรณีนี้, some หมายถึง "มีอย่างน้อยหนึ่ง"
                },
            },
            orderBy: { id: 'asc' },
        });

        if (!itemPromotion) return null;
        // สร้าง key เพื่อเอาไปใส่ table และ แปลง date เป็น str
        const promotionWithKey: fetchItemPromotionInPromotion[] = itemPromotion.map((itemPromotion, index) => ({
            ...itemPromotion,
            index: (index + 1),
            key: itemPromotion.id.toString(),
            totalItem: itemPromotion.ItemPromotions.length,
        }));
        return promotionWithKey;
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

export const fetchProductInItemPromotion = async (productId: number, promotionId: number): Promise<fetchItemPromotion[] | null> => {
    try {
        const product = await prisma.itemPromotion.findMany({
            where: {
                productId: productId,
                promotionId: promotionId
            }
        });

        return product as fetchItemPromotion[];
    } catch (error) {
        // Handle any errors here or log them
        console.error('Error fetching productItemPromotion:', error);
        return null;
    } finally {
        await prisma.$disconnect();
    }
}

export const checkItemPromotionIdArr = async (data: dataVerifyIUpdatetemPromotion): Promise<promiseDataVerify[]> => {
    const verifyStatus: promiseDataVerify[] = [];

    // ตรวจสอบความถูกต้องของข้อมูล
    if(data.deleteItemPromotionData.length > 0){
        for (let index = 0; index < data.deleteItemPromotionData.length; index++) {
            const item = data.deleteItemPromotionData[index];
            const checkProductId = await fetchItemPromotionById(item.promotionId);
            if (checkProductId?.length === 0) verifyStatus.push(pushData(`ไม่พบข้อมูล deleteItemPromotionData : promotionId แถวที่ ${index + 1}`));
        }
    }

    for (let index = 0; index < data.itemPromotionData.length; index++) {
        const item = data.itemPromotionData[index];
        const checkProductId = await fetchItemPromotionById(item.promotionId);
        if (checkProductId?.length === 0) verifyStatus.push(pushData(`ไม่พบข้อมูล itemPromotionData : promotionId แถวที่ ${index + 1}`));
    }

    return verifyStatus;
};

export const checkItemPromotionProductIdArr = async (data: dataVerifyIUpdatetemPromotion): Promise<promiseDataVerify[]> => {
    const verifyStatus: promiseDataVerify[] = [];

    // ตรวจสอบความถูกต้องของข้อมูล
    if(data.deleteItemPromotionData.length > 0){
        for (let index = 0; index < data.deleteItemPromotionData.length; index++) {
            const item = data.deleteItemPromotionData[index];
            const checkProductId = await fetchProductById(item.productId);
            if (!checkProductId) verifyStatus.push(pushData(`ไม่พบข้อมูล deleteItemPromotionData : productId แถวที่ ${index + 1}`));
        }
    }

    for (let index = 0; index < data.itemPromotionData.length; index++) {
        const item = data.itemPromotionData[index];
        const checkProductId = await fetchProductById(item.productId);
        if (!checkProductId) verifyStatus.push(pushData(`ไม่พบข้อมูล itemPromotionData : productId แถวที่ ${index + 1}`));
    }

    return verifyStatus;
};

export const deleteDataItPromotionByPdIdPmId = async (data: dataVerifyItemPromotion[]): Promise<promiseDataVerify[]> => {
    const verifyStatus: promiseDataVerify[] = [];
    try {
        
        for (let index = 0; index < data.length; index++) {
            const productId = data[index].productId;
            const promotionId = data[index].promotionId;
            const checkPromotionId = await fetchItemPromotionByPromotionIdPdId(promotionId, productId);

            if(checkPromotionId){
                const deletedItemPromotion = await prisma.itemPromotion.delete({
                    where: {
                       id: checkPromotionId.id
                    },
                });

                if(!deletedItemPromotion){
                    verifyStatus.push(pushData(`ลบข้อมูล itemPromotion แถวที่ ${index + 1} ไม่สำเร็จ`));
                }
            }
        }
        
        return verifyStatus;
    } catch (error: unknown) {
        // จัดการข้อผิดพลาดที่เกิดขึ้น
        console.error('An error occurred deleting data.:', error);
        return [];
    } finally {
        await prisma.$disconnect();
    }
}

export const updateItemPromotionArr = async (data: dataVerifyItemPromotion[]): Promise<promiseDataVerify[]> => {
    const verifyStatus: promiseDataVerify[] = [];

    for (let index = 0; index < data.length; index++) {
        const item = data[index];
        const checkPromotionId = await fetchItemPromotionByPromotionIdPdId(item.promotionId, item.productId);
     
        // Update ItemPromotion
        if(checkPromotionId){
            const updateItem = await updateDataItemPromotion(item,checkPromotionId.id);
            if(!updateItem) verifyStatus.push(pushData(`แก้ไข itemPromotion แถวที่ ${index + 1} ไม่สำเร็จ`));
        }else{
            // Insert New ItemPromotion
            const insertNewItem = await insertItemPromotion(item);
            if(!insertNewItem) verifyStatus.push(pushData(`เพิ่ม itemPromotion แถวที่ ${index + 1} ไม่สำเร็จ`));
        }
    }

    return verifyStatus;
};


