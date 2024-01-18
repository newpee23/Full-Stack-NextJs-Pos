import { prisma } from "@/pages/lib/prismaDB";
import { dateFetchExpensesReport, dateFetchReport, resultRpExpensesOfBranch, resultRpSummaryOfBranch,} from "@/types/fetchData";
import { getRpExpensesOfBranchType, getRpSummaryOfBranchType,} from "@/types/verify";
import { getDate, getTime7H } from "../utils";

// rpSummaryOfBranch
export const getRpSummaryOfBranch = async ( body: dateFetchReport): Promise<getRpSummaryOfBranchType[]> => {
  let dataRpSummaryOfBranch: getRpSummaryOfBranchType[] = [];

  try {
    const startDate = body.rangeRpSummaryOfBranchForm.startDate;
    const endDate = body.rangeRpSummaryOfBranchForm.endDate;

    for (let index = 0;index < body.branchRpSummaryOfBranchForm.length;index++) {
      const branch = body.branchRpSummaryOfBranchForm[index];
      const transactions = await fetchTransactionByBranchIdAndDate(branch,startDate,endDate);

      if (transactions.length > 0) {
        dataRpSummaryOfBranch.push(...transactions);
      }
    }
  } catch (error) {
    console.error("Error fetching tables:", error);
  }

  return dataRpSummaryOfBranch.sort((a, b) => a.branchId - b.branchId);
};
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

  const fetchRpSummaryOfBranch: resultRpSummaryOfBranch[] = Array.from(
    resultMap.values()
  );
  return fetchRpSummaryOfBranch;
};
// end rpSummaryOfBranch

// rpSummaryOfBranch
export const getRpExpensesItemsOfBranch = async (body: dateFetchExpensesReport): Promise<getRpExpensesOfBranchType[]> => {
  let dataRpExpensesOfBranch: getRpExpensesOfBranchType[] = [];

  try {
    const startDate = body.rangeRpExpensesOfBranchForm.startDate;
    const endDate = body.rangeRpExpensesOfBranchForm.endDate;

    for (
      let index = 0;
      index < body.branchRpExpensesOfBranchForm.length;
      index++
    ) {
      const branch = body.branchRpExpensesOfBranchForm[index];
      const expensesItem = await fetchExpensesItemsByBranchIdAndDate(
        branch,
        startDate,
        endDate
      );

      if (expensesItem.length > 0) {
        dataRpExpensesOfBranch.push(...expensesItem);
      }
    }
  } catch (error) {
    console.error("Error fetching tables:", error);
  }

  return dataRpExpensesOfBranch.sort((a, b) => a.branchId - b.branchId);
};
export const setDataRpExpensesOfBranch = (data: getRpExpensesOfBranchType[]): resultRpExpensesOfBranch[] => {
    let dataRpExpensesOfBranch: resultRpExpensesOfBranch[] = data.map((item, index) => ({
        index: (index + 1),
        id: item.id,
        price: item.price,
        orderDate: item.orderDate,
        expensesId: item.expensesId,
        branchId: item.branchId,
        status: item.status,
        branchs: {
            name: item.branchs.name,
        },
        expenses: {
            name: item.expenses.name,
        },
        orderShow: getDate(item.orderDate.toString()) + " " + getTime7H(item.orderDate.toString())
    }));

    return dataRpExpensesOfBranch;
};
// end rpSummaryOfBranch

const fetchTransactionByBranchIdAndDate = async (branchId: number,startDate: string,endDate: string): Promise<getRpSummaryOfBranchType[]> => {
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
      orderBy: { endOrder: "asc" },
      include: {
        branch: {
          select: {
            name: true,
          },
        },
      },
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

const fetchExpensesItemsByBranchIdAndDate = async (branchId: number,startDate: string,endDate: string): Promise<getRpExpensesOfBranchType[]> => {
  let expensesItem: getRpExpensesOfBranchType[] = [];

  try {
    expensesItem = await prisma.itemExpenses.findMany({
      include: {
        branchs: {
          select: {
            name: true,
          },
        },
        expenses: {
          select: {
            name: true,
          },
        },
      },
      where: {
        branchId: branchId,
        orderDate: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
        status: "Active",
      },
      orderBy: { orderDate: "asc"  },
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

  return expensesItem;
};
