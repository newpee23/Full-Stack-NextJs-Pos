import { prisma } from "@/pages/lib/prismaDB";
import { dateFetchReport, fetchRpSummaryOfBranchType, fetchTransaction, resultRpSummaryOfBranch } from "@/types/fetchData";
import { getRpSummaryOfBranchType } from "@/types/verify";

// rpSummaryOfBranch
export const getRpSummaryOfBranch = async (body: dateFetchReport): Promise<getRpSummaryOfBranchType[]> => {
    let dataRpSummaryOfBranch: getRpSummaryOfBranchType[] = [];

    try {
        const startDate = body.rangeRpSummaryOfBranchForm.startDate;
        const endDate = body.rangeRpSummaryOfBranchForm.endDate;

        for (let index = 0; index < body.branchRpSummaryOfBranchForm.length; index++) {
            const branch = body.branchRpSummaryOfBranchForm[index];
            const transactions = await fetchTransactionByBranchIdAndDate(branch, startDate, endDate);

            if (transactions.length > 0) {
                dataRpSummaryOfBranch.push(...transactions);
            }
        }

    } catch (error) {
        console.error("Error fetching tables:", error);
    }

    return dataRpSummaryOfBranch.sort((a, b) => a.branchId - b.branchId);

}
export const setDataRpSummaryOfBranch = (data: getRpSummaryOfBranchType[]): resultRpSummaryOfBranch[] => {
    const resultMap: Map<number, resultRpSummaryOfBranch> = new Map();

    try {
        let key = 1;
        for (let index = 0; index < data.length; index++) {
            const item = data[index];
            const existingResult = resultMap.get(item.branchId);

            if (existingResult) {
                // If branchId exists in resultMap, accumulate values
             
                existingResult.toalPeoples += item.peoples;
                existingResult.totalPrice += item.totalPrice;
            } else {
                // If branchId doesn't exist in resultMap, create a new entry
                resultMap.set(item.branchId, {
                    index: key,
                    branchId: item.branchId,
                    branchName: item.branch.name,
                    toalPeoples: item.peoples,
                    totalPrice: item.totalPrice,
                });
                key += 1;
            }
     
        }
    } catch (error) {
        console.error("Error fetching tables:", error);
    }

    const fetchRpSummaryOfBranch: resultRpSummaryOfBranch[] = Array.from(resultMap.values());
    return fetchRpSummaryOfBranch;
}
// end rpSummaryOfBranch

const fetchTransactionByBranchIdAndDate = async (branchId: number, startDate: string, endDate: string): Promise<getRpSummaryOfBranchType[]> => {
    let transactions: getRpSummaryOfBranchType[] = [];

    try {
        transactions = await prisma.transaction.findMany({
            where: {
                branchId: branchId,
                status: "InActive",
                endOrder: {
                    gte: new Date(startDate),
                    lte: new Date(endDate),
                },
            },
            orderBy: { branchId: 'asc' }
            ,
            include: {
                branch: {
                    select: {
                        name: true,
                    },
                }
            }
        });
    } catch (error) {
        console.error(error);
    } finally {
        try {
            await prisma.$disconnect();
        } catch (disconnectError) {
            console.error("Error disconnecting from Prisma:", disconnectError);
        }
    }

    return transactions;
};
