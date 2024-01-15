import { dateFetchReport } from "@/types/fetchData";
import { getRpSummaryOfBranch, setDataRpSummaryOfBranch } from "@/utils/report/getReport";
import { checkBranchArr, getBranchNameArr, verifyRpSummaryOfBranch } from "@/utils/report/verifyReport";
import { getDate } from "@/utils/utils";
import { NextApiResponse } from "next";

export const handleGetRpSummaryOfBranch = async (res: NextApiResponse, body: dateFetchReport) => {
    // Verify report
    const verifyReport = verifyRpSummaryOfBranch(body);
    if (verifyReport.length > 0) return res.status(404).json({ message: verifyReport, resultRpSummaryOfBranch: null, status: false });
    // Check branches
    const branchs = await checkBranchArr(body.branchRpSummaryOfBranchForm);
    if (branchs.length > 0) return res.status(404).json({ message: branchs, resultRpSummaryOfBranch: null, status: false });
    // Get branch names
    const branchName = await getBranchNameArr(body.branchRpSummaryOfBranchForm);
    // Get transactions
    const transactions = await getRpSummaryOfBranch(body);

    if (transactions.length === 0) {
        return res.status(200).json({
            message: [{ message: "ไม่พบข้อมูลยอดขายประจำช่วงเวลาที่ท่านเลือก" }],
            resultRpSummaryOfBranch: {
                branch: branchName,
                startDate: getDate(body.rangeRpSummaryOfBranchForm.startDate),
                endDate: getDate(body.rangeRpSummaryOfBranchForm.endDate),
                resultRpSummaryOfBranch: [],
            },
            status: false,
        });
    }
    // Set data for total branch
    const dataTotalBranch = setDataRpSummaryOfBranch(transactions);
    const resultRpSummaryOfBranch = {
        branch: branchName,
        startDate: getDate(body.rangeRpSummaryOfBranchForm.startDate),
        endDate: getDate(body.rangeRpSummaryOfBranchForm.endDate),
        resultRpSummaryOfBranch: dataTotalBranch,
    };

    return res.status(200).json({ message: "Options found", resultRpSummaryOfBranch, status: true });
}