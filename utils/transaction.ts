import { fetchCustomerFrontData, fetchTransaction, orderBillType, orderTransactionByBranch } from "@/types/fetchData";
import { prisma } from "@/pages/lib/prismaDB";
import { dataVerifyTransaction, promiseDataVerify } from "@/types/verify";
import { addMinutesToCurrentTime, dateTimeIso } from "./timeZone";
import { generateRunningNumber, getMonthNow, getYearNow } from "./utils";
import jwt from "jsonwebtoken";
import { fetchTableById } from "./table";
import { itemCartType, myStateCartItem } from "@/app/store/slices/cartSlice";
import { fetchProductById } from "./product";
import { fetchPromotionById } from "./promotion";

const pushData = (message: string) => {
    return { message };
};

export const verifyTransactionBody = (data: dataVerifyTransaction): promiseDataVerify[] => {
    const verifyStatus: promiseDataVerify[] = [];

    if (!data.tableId) verifyStatus.push(pushData("ไม่พบข้อมูล : tableId"));
    if (!data.peoples) verifyStatus.push(pushData("ไม่พบข้อมูล : peoples"));
    if (!data.expiration) verifyStatus.push(pushData("ไม่พบข้อมูล : expiration"));
    if (!data.branchId) verifyStatus.push(pushData("ไม่พบข้อมูล : branchId"));
    if (!data.employeeId) verifyStatus.push(pushData("ไม่พบข้อมูล : employeeId"));
    if (verifyStatus.length > 0) return verifyStatus;

    // ตรวจสอบว่าเป็นจำนวนเต็มเท่านั้น
    if (!Number.isInteger(data.peoples) || data.peoples <= 0)
        verifyStatus.push(
            pushData("กรุณาระบุ : peoples เป็นตัวเลขจำนวนเต็มเท่านั้น")
        );
    if (!Number.isInteger(data.branchId) || data.branchId <= 0)
        verifyStatus.push(
            pushData("กรุณาระบุ : branchId เป็นตัวเลขจำนวนเต็มเท่านั้น")
        );
    if (!Number.isInteger(data.employeeId) || data.employeeId <= 0)
        verifyStatus.push(
            pushData("กรุณาระบุ : employeeId เป็นตัวเลขจำนวนเต็มเท่านั้น")
        );
    if (!Number.isInteger(data.expiration) || data.expiration <= 0)
        verifyStatus.push(
            pushData("กรุณาระบุ : expiration เป็นตัวเลขจำนวนเต็มเท่านั้น")
        );

    // Return
    return verifyStatus;
};

export const verifyOrderBillBody = (data: myStateCartItem): promiseDataVerify[] => {
    const verifyStatus: promiseDataVerify[] = [];

    if (!data.totalPrice) verifyStatus.push(pushData("ไม่พบข้อมูล : totalPrice"));
    if (!data.totalQty) verifyStatus.push(pushData("ไม่พบข้อมูล : totalQty"));
    if (!data.itemCart) verifyStatus.push(pushData("ไม่พบข้อมูล : itemCart")); 
    if (data.itemCart.length < 1) verifyStatus.push(pushData("ไม่พบข้อมูล : itemCart")); 
    if (!data.transactionId) verifyStatus.push(pushData("ไม่พบข้อมูล : transactionId")); 
    
    if (verifyStatus.length > 0) return verifyStatus;

    if (isNaN(Number(data.totalQty))) verifyStatus.push(pushData("กรุณาระบุ : totalQty เป็นตัวเลขเท่านั้น"));
    if (isNaN(Number(data.totalPrice))) verifyStatus.push(pushData("กรุณาระบุ : totalPrice เป็นตัวเลขเท่านั้น"));

    if (verifyStatus.length > 0) return verifyStatus;

    // Return
    return verifyStatus;
};

export const fetchTransactionByBranchId = async (branchId: number): Promise<orderTransactionByBranch[] | null> => {
    try {
        const tables = await prisma.tables.findMany({
            select: {
                id: true,
                name: true,
                stoves: true,
                people: true,
                expiration: true,
            },
            where: {
                branchId: branchId,
            },
        });

        if (tables.length === 0) return null;

        // Fetch transactions for each table in parallel
        const tablesWithTransactions: orderTransactionByBranch[] =
            await Promise.all(
                tables.map(async (item, index) => {
                    const transactionOrder = await prisma.transaction.findFirst({
                        select: {
                            id: true,
                            receipt: true,
                            startOrder: true,
                            endOrder: true,
                            peoples: true,
                            tokenOrder: true,
                        },
                        where: {
                            tableId: item.id,
                            startOrder: {
                                gte: new Date(getYearNow(), getMonthNow() - 1, 1), // Start of current month
                            },
                            status: "Active",
                        },
                    });

                    return {
                        ...item,
                        index: index + 1,
                        transactionOrder: transactionOrder || null,
                    };
                })
            );

        return tablesWithTransactions;
    } catch (error) {
        // Handle any errors here or log them
        console.error("Error fetching tables:", error);
        return null;
    } finally {
        await prisma.$disconnect();
    }
};

export const fetchTransactionByTableId = async (id: string): Promise<orderTransactionByBranch | null> => {
    try {
        const table = await prisma.tables.findUnique({
            select: {
                id: true,
                name: true,
                stoves: true,
                people: true,
                expiration: true,
            },
            where: {
                id: id,
            },
        });

        if (!table) {
            // Handle the case where the table with the given ID is not found
            return null;
        }

        const transactionOrder = await prisma.transaction.findFirst({
            select: {
                id: true,
                receipt: true,
                startOrder: true,
                endOrder: true,
                peoples: true,
                tokenOrder: true,
            },
            where: {
                tableId: table.id,
                startOrder: {
                    gte: new Date(getYearNow(), getMonthNow() - 1, 1), // Start of current month
                },
                status: "Active",
            },
        });

        const tableWithTransaction: orderTransactionByBranch = {
            ...table,
            transactionOrder: transactionOrder || null,
        };

        return tableWithTransaction;
    } catch (error) {
        // Handle any errors here or log them
        console.error("Error fetching table and transaction:", error);
        return null;
    } finally {
        await prisma.$disconnect();
    }
};

export const fetchTransactionById = async (id: string): Promise<fetchTransaction | null> => {
    try {
        const transactionOrder = await prisma.transaction.findUnique({
            where: {
                id: id,
            },
        });

        return transactionOrder;
    } catch (error) {
        // Handle any errors here or log them
        console.error("Error fetching table and transaction:", error);
        return null;
    } finally {
        await prisma.$disconnect();
    }
};

export const fetchTransactionByCompanyId = async (companyId: number): Promise<orderTransactionByBranch[] | null> => {
    try {
        const tables = await prisma.tables.findMany({
            select: {
                id: true,
                name: true,
                stoves: true,
                people: true,
                expiration: true,
            },
            where: {
                companyId: companyId,
            },
        });

        if (tables.length === 0) return null;

        // Fetch transactions for each table in parallel
        const tablesWithTransactions: orderTransactionByBranch[] =
            await Promise.all(
                tables.map(async (item, index) => {
                    const transactionOrder = await prisma.transaction.findFirst({
                        select: {
                            id: true,
                            receipt: true,
                            startOrder: true,
                            endOrder: true,
                            peoples: true,
                            tokenOrder: true,
                        },
                        where: {
                            tableId: item.id,
                            startOrder: {
                                gte: new Date(getYearNow(), getMonthNow() - 1, 1), // Start of current month
                            },
                            status: "Active",
                        },
                    });

                    return {
                        ...item,
                        index: index + 1,
                        transactionOrder: transactionOrder || null,
                    };
                })
            );

        return tablesWithTransactions;
    } catch (error) {
        // Handle any errors here or log them
        console.error("Error fetching tables:", error);
        return null;
    } finally {
        await prisma.$disconnect();
    }
};

export const fetchTransactionAll = async (): Promise<orderTransactionByBranch[] | null> => {
    try {
        const tables = await prisma.tables.findMany({
            select: {
                id: true,
                name: true,
                stoves: true,
                people: true,
                expiration: true,
            },
        });

        if (tables.length === 0) return null;

        // Fetch transactions for each table in parallel
        const tablesWithTransactions: orderTransactionByBranch[] = await Promise.all(tables.map(async (item, index) => {
            const transactionOrder = await prisma.transaction.findFirst({
                select: {
                    id: true,
                    receipt: true,
                    startOrder: true,
                    endOrder: true,
                    peoples: true,
                    tokenOrder: true,
                },
                where: {
                    tableId: item.id,
                    status: "Active",
                },
            });

            return {
                ...item,
                index: index + 1,
                transactionOrder: transactionOrder || null,
            };
        }));

        return tablesWithTransactions;
    } catch (error) {
        // Handle any errors here or log them
        console.error("Error fetching tables:", error);
        return null;
    } finally {
        await prisma.$disconnect();
    }
};

export const getReceiptOrder = async (branchId: number): Promise<string> => {
    try {
        const transaction = await prisma.transaction.findMany({
            where: {
                branchId: branchId,
                startOrder: {
                    gte: new Date(getYearNow(), getMonthNow() - 1, 1), // Start of current month
                },
            },
        });
        const receiptCode = await prisma.branch.findUnique({
            select: {
                codeReceipt: true,
            },
            where: {
                id: branchId,
            },
        });

        if (receiptCode && transaction) {
            const newReceiptCode = generateRunningNumber(
                receiptCode.codeReceipt,
                transaction.length
            );

            return newReceiptCode;
        }

        return "";
    } catch (error) {
        // Handle any errors here or log them
        console.error("Error fetching tables:", error);
        return "";
    } finally {
        await prisma.$disconnect();
    }
};

export const insertTransaction = async (body: dataVerifyTransaction): Promise<fetchTransaction | null> => {
    try {
        const receipt = await getReceiptOrder(body.branchId);

        const addTransaction = await prisma.transaction.create({
            data: {
                tableId: body.tableId,
                receipt: receipt,
                startOrder: new Date(),
                endOrder: addMinutesToCurrentTime(body.expiration),
                peoples: body.peoples,
                totalPrice: 0.0,
                branchId: body.branchId,
                employeeId: body.employeeId,
                status: "Active",
            },
        });

        return addTransaction;
        //   return addTransaction as order;
    } catch (error: unknown) {
        // Handle any errors here or log them
        console.error("Error add employee:", error);
        return null;
    } finally {
        await prisma.$disconnect();
    }
};

export const closeDataTransaction = async (id: string, totalPrice: number): Promise<fetchTransaction | null> => {
    try {

        const transaction = await prisma.transaction.update({
            where: { id },
            data: {
                totalPrice: totalPrice,
                status: "InActive"
            },
        });

        if (!transaction) return null;
        return transaction as fetchTransaction;
    } catch (error) {
        console.error('Error updating transaction:', error);
        return null;
    } finally {
        await prisma.$disconnect();
    }
}

export const fetchDataFrontDetailByTransactionId = async (tokenOrder: string): Promise<fetchCustomerFrontData | null> => {
    try {
        // ข้อมูล transaction
        const transaction = await prisma.transaction.findFirst({
            select: {
                id: true,
                tableId: true,
                receipt: true,
                startOrder: true,
                endOrder: true,
                peoples: true,
                branch: {
                    select: {
                        id: true,
                        name: true,
                        companyId: true,
                    },
                },
            },
            where: { 
                tokenOrder:tokenOrder , 
                status: "Active" 
            },
        });
        if (!transaction) return null;

        // ข้อมูล table
        const tablesData = await prisma.tables.findFirst({
            select: {
                id: true,
                name: true,
                expiration: true,
                companyId: true,
            },
            where: {
                id: transaction.tableId,
            },
        });
 
        if (!tablesData?.companyId) return null;
        // ข้อมูล productType And product
        const productData = await prisma.productType.findMany({
            where: {
                companyId: tablesData?.companyId,
            },
            include: {
                Products: {
                    select: {
                        id: true,
                        name: true,
                        price: true,
                        stock: true,
                        img: true,
                        unit: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                        productType: {
                            select: {
                                id: true,
                                name: true,
                            }
                        }
                    },
                    where: {
                        status: "Active",
                        statusSail: "Active",
                    },
                },
            },
        });
 
        // ข้อมูล promotion
        const promotionData = await prisma.promotion.findMany({
            select: {
                id: true,
                name: true,
                detail: true,
                promotionalPrice: true,
                startDate: true,
                endDate: true,
                img: true,
                ItemPromotions: {
                    select: {
                        productId: true,
                        stock: true,
                    },
                },
            },
            where: {
                companyId: tablesData?.companyId,
                endDate: {
                    gt: new Date(), // Greater than the current date
                },
                status: "Active"
            }
        });
        const currentDate = new Date();
        const filteredPromotions = promotionData.filter(promotion => new Date(promotion.startDate) <= currentDate);
        const productPromotion = await prisma.product.findMany({
            select: {
                id: true,
                name: true,
                price: true,
                stock: true,
                img: true,
                unit: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                productType: {
                    select: {
                        id: true,
                        name: true,
                    }
                }
            },
            where: {
                status: "Active",
                statusSail: "Active",
                companyId: tablesData.companyId
            },
        });
        const enhancedPromotions = filteredPromotions.map(promotion => {
            // Map through all ItemPromotions and find associated products
            const associatedProducts = promotion.ItemPromotions.map(itemPromotion => {
                return productPromotion.find(product => product.id === itemPromotion.productId) || null;
            });

            // Add the array of associated products to the promotion
            return {
                ...promotion,
                productsItemPromotions: associatedProducts,
            };
        });

        // ข้อมูลทั้งหมด
        const transactionWithTable: fetchCustomerFrontData = {
            ...transaction,
            tablesData: tablesData,
            productData: productData,
            promotionData: enhancedPromotions
        };
   
        return transactionWithTable;
    } catch (error) {
        console.error('Error updating transaction:', error);
        return null;
    } finally {
        await prisma.$disconnect();
    }
}

export const createTokenTransaction = async ({id, tableId}: {id: string, tableId: string}): Promise<string | null> => {
    const table = await fetchTableById(tableId);

    if(!table) return null;
    const tokenOrder = jwt.sign(
        {
            id: id,
            exp: Math.floor(Date.now() / 1000) + (60 * table.expiration), // เวลาหมดเป็นนาที
        },
        process.env.SECRET_KEY_TRANSACTION!
    );

    return tokenOrder;
}

export const updateTokenOrderTransaction = async ({id, tokenOrder} : {id: string, tokenOrder: string}): Promise<fetchTransaction | null> => {
    try {

        const transaction = await prisma.transaction.update({
            where: { id },
            data: {
                tokenOrder: tokenOrder
            },
        });

        if (!transaction) return null;
        return transaction as fetchTransaction;
    } catch (error) {
        console.error('Error updating transaction:', error);
        return null;
    } finally {
        await prisma.$disconnect();
    }
}

export const checkOrderArrayProductId = async (data: itemCartType[]): Promise<promiseDataVerify[]> => {
    const verifyStatus: promiseDataVerify[] = [];

    for (let index = 0; index < data.length; index++) {
        const item = data[index];
        if(item.productId){
            const checkProductId = await fetchProductById(item.productId);
            if (!checkProductId) verifyStatus.push(pushData(`ไม่พบข้อมูล : orderBill แถวที่ ${index + 1} (productId)`));
        }
    }

    return verifyStatus;
};

export const checkOrderArrayPromotionId = async (data: itemCartType[]): Promise<promiseDataVerify[]> => {
    const verifyStatus: promiseDataVerify[] = [];

    for (let index = 0; index < data.length; index++) {
        const item = data[index];
        if(item.promotionId){
            const checkProductId = await fetchPromotionById(item.promotionId);
            if (!checkProductId) verifyStatus.push(pushData(`ไม่พบข้อมูล : orderBill แถวที่ ${index + 1} (promotionId)`));
        }
    }

    return verifyStatus;
};

