import { prisma } from "@/pages/lib/prismaDB";
import { fetchTransactionById } from "./transaction";
import { fetchTableById } from "./table";
import { detailReceiptType } from "@/types/fetchData";

export const fetchDetailReceiptByCompanyId = async (companyId: number, branchId: number, transactionId: string): Promise<detailReceiptType | null> => {
    try {
        const company = await prisma.company.findUnique({
            select: {
                name: true,
                logo: true,
                branchs: {
                    select: {
                        name: true
                    },
                    where: {
                        id: branchId
                    }
                }
            },
            where: {
                id: companyId,
            },
        });
        if (!company) return null;

        const transaction = await fetchTransactionById(transactionId);
        if (!transaction) return null;

        const table = await fetchTableById(transaction.tableId);
        if (!table) return null;

        const result: detailReceiptType = {
            companyName: company.name,
            logo: company.logo,
            branchName: company.branchs[0].name,
            startOrder: transaction.startOrder,
            endOrder: transaction.endOrder,
            peoples: transaction.peoples,
            tableName: table.name,
            expiration: table.expiration,
        };

        return result;
    } catch (error) {
        // Handle any errors here or log them
        console.error('Error fetching itemPromotion:', error);
        return null;
    } finally {
        await prisma.$disconnect();
    }
}