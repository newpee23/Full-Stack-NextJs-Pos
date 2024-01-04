import { myStateCartItem } from "@/app/store/slices/cartSlice";
import { itemTransactionsType, orderBillTotal, orderBillTotalType, orderBillType } from "@/types/fetchData";
import { prisma } from "@/pages/lib/prismaDB";
import { fetchProductById } from "./product";
import { fetchPromotionById } from "./promotion";

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

export const fetchDataOrderBillByTransactionId = async (id: string): Promise<orderBillTotal[] | null> => {
    try {
        // ข้อมูล orderBill
        const orderBills = await prisma.orderBill.findMany({
            select: {
                id: true,
                status: true,
                orderDate: true,
                ItemTransactions: true
            },
            where: {
                transactionId: id
            },
            orderBy: { id: 'desc', },
        });
        if (!orderBills) return null;

        const orderedOrderBills = orderBills.map(orderBill => ({
            ...orderBill,
            ItemTransactions: orderBill.ItemTransactions.sort((a, b) => a.id - b.id),
        }));

        return orderedOrderBills as orderBillTotal[];
    } catch (error) {
        console.error('Error updating orderBill:', error);
        return null;
    } finally {
        await prisma.$disconnect();
    }
}

export const setDataTotalOrderBill = async (data: orderBillTotal[]): Promise<number | null> => {
    try {
        let totalBill = 0;
        for (const orderBill of data) {
            for (const item of orderBill.ItemTransactions) {
                if (item.productId) {
                    const productPrice = await fetchProductById(item.productId);
                    if (productPrice) {
                        totalBill += (item.qty * productPrice.price);
                    }
                }
                if (item.promotionId) {
                    const promotionPrice = await fetchPromotionById(item.promotionId);
                    if (promotionPrice) {
                        totalBill += (item.qty * promotionPrice.promotionalPrice);
                    }
                }
            }
        }

        return totalBill;
    } catch (error) {
        console.error('Error updating setDataOrderBill:', error);
        return null;
    } finally {
        await prisma.$disconnect();
    }
}

export const setDataDetailOrderBill = async (data: orderBillTotal[]): Promise<orderBillTotalType[] | null> => {
    try {

        const dataDetail: orderBillTotalType[] = await Promise.all(data.map(async (orderBill, index) => {

            let totalBill = 0;
            const itemTransactions: (itemTransactionsType | undefined)[] = await Promise.all(orderBill.ItemTransactions.map(async (item) => {
                if (item.productId) {
                    const product = await fetchProductById(item.productId);
                    totalBill += product ? (product.price * item.qty) : 0;

                    return {
                        ...item,
                        productName: product ? product.name : null,
                        unitName: product ? product.unit.name : null,
                        price: product?.price,
                    } as itemTransactionsType;
                }

                if (item.promotionId) {
                    const promotion = await fetchPromotionById(item.promotionId);
                    totalBill += promotion ? promotion.promotionalPrice : 0;

                    if (promotion) {
                        return {
                            ...item,
                            promotionName: promotion ? promotion.name : null,
                            unitName: promotion ? "ชิ้น" : null,
                            price: promotion.promotionalPrice,
                        } as itemTransactionsType;
                    }
                }

                return undefined;
            }));

            return {
                ...orderBill,
                index: index + 1,
                totalBill: totalBill,
                ItemTransactions: itemTransactions.filter(Boolean) as itemTransactionsType[],
            };
        }));

        return dataDetail;
    } catch (error) {
        console.error('Error updating setDataOrderBill:', error);
        return null;
    } finally {
        await prisma.$disconnect();
    }
} 