import { orderTransactionByBranch } from '@/types/fetchData';
import { prisma } from "@/pages/lib/prismaDB";
import { dataVerifyTransaction, promiseDataVerify } from '@/types/verify';

const pushData = (message: string) => {
    return { message };
};

export const verifyTransactionBody = (data: dataVerifyTransaction): promiseDataVerify[] => {
    const verifyStatus: promiseDataVerify[] = [];

    if (!data.id) verifyStatus.push(pushData("ไม่พบข้อมูล : id"));
    if (!data.peoples) verifyStatus.push(pushData("ไม่พบข้อมูล : peoples"));

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
            },
            where: {
                branchId: branchId
            }
        });

        if (tables.length === 0) return null;

        // Fetch transactions for each table in parallel
        const tablesWithTransactions: orderTransactionByBranch[] = await Promise.all(
            tables.map(async (item, index) => {
                const transactionOrder = await prisma.transaction.findFirst({
                    select: {
                        id: true,
                        receipt: true,
                        startOrder: true,
                        endOrder: true,
                        peoples: true
                    },
                    where: {
                        tableId: item.id,
                        status: "Active"
                    }
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
        console.error('Error fetching tables:', error);
        return null;
    } finally {
        await prisma.$disconnect();
    }
};

export const fetchTransactionById = async (id: string): Promise<orderTransactionByBranch | null> => {
    try {
        const table = await prisma.tables.findUnique({
            select: {
                id: true,
                name: true,
                stoves: true,
                people: true,
            },
            where: {
                id: id
            }
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
                peoples: true
            },
            where: {
                tableId: table.id,
                status: "Active"
            }
        });

        const tableWithTransaction: orderTransactionByBranch = {
            ...table,
            transactionOrder: transactionOrder || null,
        };

        return tableWithTransaction;
    } catch (error) {
        // Handle any errors here or log them
        console.error('Error fetching table and transaction:', error);
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
            },
            where: {
                companyId: companyId
            }
        });

        if (tables.length === 0) return null;

        // Fetch transactions for each table in parallel
        const tablesWithTransactions: orderTransactionByBranch[] = await Promise.all(
            tables.map(async (item, index) => {
                const transactionOrder = await prisma.transaction.findFirst({
                    select: {
                        id: true,
                        receipt: true,
                        startOrder: true,
                        endOrder: true,
                        peoples: true
                    },
                    where: {
                        tableId: item.id,
                        status: "Active"
                    }
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
        console.error('Error fetching tables:', error);
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
            },
        });

        if (tables.length === 0) return null;

        // Fetch transactions for each table in parallel
        const tablesWithTransactions: orderTransactionByBranch[] = await Promise.all(
            tables.map(async (item, index) => {
                const transactionOrder = await prisma.transaction.findFirst({
                    select: {
                        id: true,
                        receipt: true,
                        startOrder: true,
                        endOrder: true,
                        peoples: true
                    },
                    where: {
                        tableId: item.id,
                        status: "Active"
                    }
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
        console.error('Error fetching tables:', error);
        return null;
    } finally {
        await prisma.$disconnect();
    }
};