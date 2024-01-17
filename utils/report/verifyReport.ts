import { dateFetchExpensesReport, dateFetchReport } from "@/types/fetchData";
import { promiseDataVerify } from "@/types/verify";
import { getBranchById } from "../branch";

const pushData = (message: string) => {
  return { message };
};

// rpSummaryOfBranch

export const verifyRpSummaryOfBranch = (data: dateFetchReport): promiseDataVerify[] => {
  const verifyStatus: promiseDataVerify[] = [];

  if (!data.branchRpSummaryOfBranchForm?.length) verifyStatus.push(pushData("ไม่พบข้อมูล : branchRpSummaryOfBranchForm"));
  if (!data.rangeRpSummaryOfBranchForm?.startDate) verifyStatus.push(pushData("ไม่พบข้อมูล : startDate"));
  if (!data.rangeRpSummaryOfBranchForm?.endDate) verifyStatus.push(pushData("ไม่พบข้อมูล : endDate"));

  if (verifyStatus.length > 0) return verifyStatus;

  for (let index = 0; index < data.branchRpSummaryOfBranchForm.length; index++) {
    const branchItem = data.branchRpSummaryOfBranchForm[index];
    if (!Number.isInteger(branchItem)) verifyStatus.push(pushData(`กรุณาระบุ : branchItem แถวที่ ${(index + 1)} เป็นตัวเลขเท่านั้น`));
  }

  if (verifyStatus.length > 0) return verifyStatus;

  const startDate = new Date(data.rangeRpSummaryOfBranchForm.startDate);
  const endDate = new Date(data.rangeRpSummaryOfBranchForm.endDate);

  if (isNaN(startDate.getTime())) verifyStatus.push(pushData("กรุณาระบุ : startDate ตามรูปแบบ YYYY-MM-DD"));
  if (isNaN(endDate.getTime())) verifyStatus.push(pushData("กรุณาระบุ : endDate ตามรูปแบบ YYYY-MM-DD"));

  // Return
  return verifyStatus;
};

export const checkBranchArr = async (branchRpSummaryOfBranchForm: [number]): Promise<promiseDataVerify[]> => {
  const verifyStatus: promiseDataVerify[] = [];

  for (let index = 0; index < branchRpSummaryOfBranchForm.length; index++) {
    const item = branchRpSummaryOfBranchForm[index];
    const checkBranchId = await getBranchById(item);
    if (!checkBranchId) verifyStatus.push(pushData(`ไม่พบข้อมูล : สาขา แถวที่ ${index + 1} ในบริษัท`));
  }

  // Return
  return verifyStatus;
};

export const getBranchNameArr = async (branchRpSummaryOfBranchForm: [number]): Promise<string> => {
  let branchName = "";
  for (let index = 0; index < branchRpSummaryOfBranchForm.length; index++) {
    const item = branchRpSummaryOfBranchForm[index];
    const checkBranchId = await getBranchById(item);
    if (checkBranchId) branchName += checkBranchId.name + ",";
  }
  if (branchName.length > 0) {
    branchName = branchName.slice(0, -1);
  }
  // Return
  return branchName;
};

// end rpSummaryOfBranch

// rpExpensesOfBranch
export const verifyRpExpensesOfBranch = (data: dateFetchExpensesReport): promiseDataVerify[] => {
  const verifyStatus: promiseDataVerify[] = [];

  if (!data.branchRpExpensesOfBranchForm?.length) verifyStatus.push(pushData("ไม่พบข้อมูล : branchRpExpensesOfBranchForm"));
  if (!data.rangeRpExpensesOfBranchForm?.startDate) verifyStatus.push(pushData("ไม่พบข้อมูล : startDate"));
  if (!data.rangeRpExpensesOfBranchForm?.endDate) verifyStatus.push(pushData("ไม่พบข้อมูล : endDate"));

  if (verifyStatus.length > 0) return verifyStatus;

  for (let index = 0; index < data.branchRpExpensesOfBranchForm.length; index++) {
    const branchItem = data.branchRpExpensesOfBranchForm[index];
    if (!Number.isInteger(branchItem)) verifyStatus.push(pushData(`กรุณาระบุ : branchItem แถวที่ ${(index + 1)} เป็นตัวเลขเท่านั้น`));
  }

  if (verifyStatus.length > 0) return verifyStatus;

  const startDate = new Date(data.rangeRpExpensesOfBranchForm.startDate);
  const endDate = new Date(data.rangeRpExpensesOfBranchForm.endDate);

  if (isNaN(startDate.getTime())) verifyStatus.push(pushData("กรุณาระบุ : startDate ตามรูปแบบ YYYY-MM-DD"));
  if (isNaN(endDate.getTime())) verifyStatus.push(pushData("กรุณาระบุ : endDate ตามรูปแบบ YYYY-MM-DD"));

  // Return
  return verifyStatus;
};
// end rpExpensesOfBranch