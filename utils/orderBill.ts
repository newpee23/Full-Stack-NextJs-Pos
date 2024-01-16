import { myStateCartItem } from "@/app/store/slices/cartSlice";
import { dataVerifyOrderBill, fectOrderBillByTransactionType, itemTransactionsType, orderBillTotal, orderBillTotalType, orderBillType, orderBills } from "@/types/fetchData";
import { prisma } from "@/pages/lib/prismaDB";
import { fetchProductById } from "./product";
import { fetchPromotionById } from "./promotion";
import { getDate, getMonthNow, getTime7H, getYearNow } from "./utils";
import { fetchTableById } from "./table";
import { enumOrderBill } from "@prisma/client";
import { promiseDataVerify } from "@/types/verify";

const pushData = (message: string) => {
    return { message };
};

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
                        if(orderBill.status !== "cancel"){
                            totalBill += (item.qty * productPrice.price);
                        }
                    }
                }
                if (item.promotionId) {
                    const promotionPrice = await fetchPromotionById(item.promotionId);
                    if (promotionPrice) {
                        if(orderBill.status !== "cancel"){
                            totalBill += (item.qty * promotionPrice.promotionalPrice);
                        }
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

export const setDataTotalOrderBillStatusSucceed = async (data: orderBillTotal[]): Promise<number | null> => {
    try {
        let totalBill = 0;
        for (const orderBill of data) {
            for (const item of orderBill.ItemTransactions) {
                if (item.productId) {
                    const productPrice = await fetchProductById(item.productId);
                    if (productPrice) {
                        if(orderBill.status === "succeed"){
                            totalBill += (item.qty * productPrice.price);
                        }
                    }
                }
                if (item.promotionId) {
                    const promotionPrice = await fetchPromotionById(item.promotionId);
                    if (promotionPrice) {
                        if(orderBill.status === "succeed"){
                            totalBill += (item.qty * promotionPrice.promotionalPrice);
                        }
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
        const totalItem = (data.length + 1);
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
                index: (totalItem - (index + 1)),
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

export const fectOrderBillByTransaction = async (branchId: number, status: "process" | "making"): Promise<orderBills[] | null> => {
    try {
     
        const today = new Date(); 
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1); 
    
        const transactions = await prisma.transaction.findMany({
            select: {
                id: true,
                tableId: true,
                orderBills: {
                    include: {
                        ItemTransactions: true
                    },
                    where: {
                        status: status
                    }
                }
            },
            where: {
                branchId: branchId,
                startOrder: {
                    gte: today,
                    lte: tomorrow,
                },
                status: "Active",
                orderBills: {
                    some: {
                        status: status
                    }
                }
            }
        });

        if (transactions.length === 0) return [];

        // สร้างตัวแปรเพื่อเก็บข้อมูลที่ได้จากการ loop
        const processedTransactions: fectOrderBillByTransactionType[] = [];
        const orderBills: orderBills[] = [];

        for (const transaction of transactions) {
            const table = await fetchTableById(transaction.tableId);
            let index = 0;
            if (table) {
                const processedTransaction: fectOrderBillByTransactionType = {
                    id: transaction.id,
                    tableId: transaction.tableId,
                    orderBills: await Promise.all(
                        transaction.orderBills.map(async (orderBill) => {

                            return {
                                id: orderBill.id,
                                status: orderBill.status,
                                transactionId: orderBill.transactionId,
                                tableName: table.name,
                                orderDate: `${getDate(orderBill.orderDate.toString())} ${getTime7H(orderBill.orderDate.toString())}`,
                                ItemTransactions: await Promise.all(
                                    orderBill.ItemTransactions.map(async (item) => {
                                        const product = await fetchProductById(item.productId ? item.productId : 0);
                                        const promotion = await fetchPromotionById(item.promotionId ? item.promotionId : 0);

                                        return {
                                            productName: product ? product.name : null,
                                            promotionName: promotion ? promotion.name : null,
                                            unitName: product ? product.unit.name : "ชิ้น",
                                            id: item.id,
                                            qty: item.qty,
                                            productId: item.productId,
                                            promotionId: item.promotionId,
                                            orderBillId: item.orderBillId,
                                            price: product ? product.price : promotion?.promotionalPrice ? promotion?.promotionalPrice : 0
                                        }
                                    })
                                )
                            };
                        })
                    ),
                };

                processedTransactions.push(processedTransaction);

            }
        }

        for (const itemTransaction of processedTransactions) {
            for (const orderBill of itemTransaction.orderBills) {
                orderBills.push(orderBill);
            }
        }

        return orderBills.sort((a, b) => a.id - b.id);
    } catch (error) {
        console.error('Error updating setDataOrderBill:', error);
        return null;
    } finally {
        await prisma.$disconnect();
    }
}

export const fectOrderBillById = async (orderId: number): Promise<orderBillType | null> => {
    try {
        const orderBill = await prisma.orderBill.findUnique({
            where: {
                id: orderId
            }
        })
        if(!orderBill) return null;

        return orderBill as orderBillType;
    } catch (error) {
        console.error('Error fectOrderBillById:', error);
        return null;
    } finally {
        await prisma.$disconnect();
    }
}

export const updateOrderBillStatus = async (id: number, status: enumOrderBill): Promise<orderBillType | null> => {
    try {
        const orderBill = await prisma.orderBill.update({
            where: {
                id: id
            },
            data: {
                status: status
            }
        })

        if (!orderBill) return null;

        return orderBill as orderBillType;
    } catch (error) {
        console.error('Error updating updateOrderBillStatus:', error);
        return null;
    } finally {
        await prisma.$disconnect();
    }
};

export const verifyOrderBillStatus = (data: dataVerifyOrderBill): promiseDataVerify[] => {
    const verifyStatus: promiseDataVerify[] = [];

    if (!data.orderId) verifyStatus.push(pushData("ไม่พบข้อมูล : orderId"));
    if (!data.status) verifyStatus.push(pushData("ไม่พบข้อมูล : status"));

    if(verifyStatus.length > 0) return verifyStatus;
 
    if (!Number.isInteger(data.orderId) || data.orderId <= 0) verifyStatus.push(pushData("กรุณาระบุ : orderId เป็นตัวเลขจำนวนเต็มเท่านั้น"));
    if(data.status !== "cancel" && data.status !== "making" && data.status !== "process" && data.status !== "succeed") verifyStatus.push(pushData("กรุณาระบุ : status เป็น cancel making process หรือ succeed เท่านั้น"));
    return verifyStatus;
}
