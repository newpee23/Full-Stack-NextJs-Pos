import { myStateCartItem } from "@/app/store/slices/cartSlice";
import { orderBillType } from "@/types/fetchData";
import { prisma } from "@/pages/lib/prismaDB";

export const insertOrderBill = async (body: myStateCartItem): Promise<orderBillType | null> => {
    try {
        const orderBill = await prisma.orderBill.create({
            data: {
              orderDate: new Date(),
              transactionId: body.transactionId,
              status: "process",
            },
        });

        return orderBill;
    } catch (error: unknown) {
        // Handle any errors here or log them
        console.error("Error add employee:", error);
        return null;
    } finally {
        await prisma.$disconnect();
    }
};