import { orderTransactionByBranch } from '@/types/fetchData';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const fetchTransactionByBranchId = async (branchId: number): Promise<any> => {
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
