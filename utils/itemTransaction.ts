import { itemCartType, myStateCartItem } from "@/app/store/slices/cartSlice";
import { prisma } from "@/pages/lib/prismaDB";
import { promiseDataVerify } from "@/types/verify";

const pushData = (message: string) => {
    return { message };
};

export const insertItemTransactionArray = async (data: itemCartType[],orderId: number): Promise<promiseDataVerify[]> => {
    const verifyStatus: promiseDataVerify[] = [];

    for (let index = 0; index < data.length; index++) {
        const item = data[index];
        if(item.productId){
            try {
                await prisma.itemTransaction.create({
                    data: {
                        orderBillId: orderId,
                        productId: item.productId,
                        qty: item.qty
                    },
                });
            } catch (error: unknown) {
                // Handle any errors here or log them
                console.error("Error add employee:", error);
                verifyStatus.push(pushData(`บันทึก itemTransaction ไม่สำเร็จ: productId แถวที่ ${index + 1}`));
            } finally {
                await prisma.$disconnect();
            }
        }

        if(item.promotionId){
            try {
                await prisma.itemTransaction.create({
                    data: {
                        orderBillId: orderId,
                        promotionId: item.promotionId,
                        qty: item.qty
                    },
                });
            } catch (error: unknown) {
                // Handle any errors here or log them
                console.error("Error add employee:", error);
                verifyStatus.push(pushData(`บันทึก itemTransaction ไม่สำเร็จ: promotionId แถวที่ ${index + 1}`));
            } finally {
                await prisma.$disconnect();
            }
        }
    }
    return verifyStatus;
};
