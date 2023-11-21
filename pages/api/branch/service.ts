import { dataVerifyBranch, dataVerifyPosition } from "@/types/verify";
import { checkCompanyData, deleteDataBranch, getAllBranch, getBranchByCompanyId, getBranchById, getBranchByNameByCompany, insertBranch, updateDataBranch, verifyBranchBody } from "@/utils/branch";
import { typeNumber } from "@/utils/utils";
import { NextApiRequest, NextApiResponse } from "next";

export const handleGetBranchById = async (res: NextApiResponse, id: number) => {
    const branch = await getBranchById(id);
    if (!branch) return res.status(404).json({ message: `No branch found with Id : ${id}`, branch: null, status: false });

    return res.status(200).json({ message: "Branch found", branch, status: true });
}

export const handleGetBranchByCompanyId = async (res: NextApiResponse, companyId: number) => {
    const branch = await getBranchByCompanyId(companyId);
    if (!branch || branch?.length === 0) return res.status(404).json({ message: `No branch found with companyId : ${companyId}`, branch: null, status: false });

    return res.status(200).json({ message: "Branch found", branch: branch, status: true });
}

export const handleGetAllBranch = async (res: NextApiResponse) => {
    const branch = await getAllBranch();
    if (branch === null || branch.length === 0) return res.status(404).json({ message: `No branchs found`, branch: null, status: false });

    res.status(200).json({ message: "Branchs found", branch: branch, status: true });
}

export const handleDeleteBarnch = async (req: NextApiRequest, res: NextApiResponse) => {
    const { query } = req;
    // Check CompanyId is not null
    if (!query.id) return res.status(404).json({ message: "Please specify Id", branch: null, status: false });

    const id = typeNumber(query.id);
    // getBranch
    const branch = await getBranchById(id);
    if (!branch) return res.status(404).json({ message: `No branch information found from Id : ${id}`, branch: null, status: false });
    // deleteBranch
    const deleteBranch = await deleteDataBranch(id);
    if (!deleteBranch) return res.status(404).json({ message: "An error occurred deleting data.", branch: null, status: false });

    res.status(200).json({ message: "Successfully deleted data.", branch: deleteBranch, status: true });
}

export const handleAddBranch = async (body: dataVerifyBranch, res: NextApiResponse) => {
    // VerifyCompanyData
    const verifyCompany = verifyBranchBody(body);
    if (verifyCompany.length > 0) return res.status(404).json({ message: verifyCompany, branch: null, status: false });
    // ตรวจว่ามีข้อมูล companyId และ name ในระบบมั้ย
    const checkCompanyName = await checkCompanyData(body.companyId, body.name);
    if (checkCompanyName.length > 0) return res.status(404).json({ message: checkCompanyName, branch: null, status: false });
    // addBranch
    const addBranch = await insertBranch(body);
    if (!addBranch) return res.status(404).json({ message: "An error occurred saving data.", branch: null, status: false });

    return res.status(200).json({ message: "Data saved successfully.", branch: addBranch, status: true });
}

export const handleUpdateBranch = async (body: dataVerifyBranch, res: NextApiResponse) => {
    if (!body.id) return res.status(404).json({ message: "Please specify branchId", branch: null, status: false });

    // VerifyBranchData
    const verifyBranch = verifyBranchBody(body);
    if (verifyBranch.length > 0) return res.status(404).json({ message: verifyBranch, branch: null, status: false });
    // ตรวจว่าใน DB มี ข้อมูล id หรือยัง
    const checkBranchId = await getBranchById(body.id);
    if (!checkBranchId) return res.status(404).json({ message: `No branch information found from Id. ${body.id}`, branch: null, status: false })
    // ตรวจว่าใน DB มี ข้อมูล ชื่อสาขา หรือยัง
    const checkBranchName = await getBranchByNameByCompany(body.companyId, body.name, body.id);
    if (checkBranchName) return res.status(404).json({ message: [{message: `Found company information : ${body.name} has already been used in the system`}], branch: checkBranchName, status: false });
    // update Branch
    const updateBranch = await updateDataBranch(body.id, body);
    if (!updateBranch) return res.status(404).json({ message: "An error occurred editing data.", branch: null, status: false });

    return res.status(200).json({ message: "Successfully edited information.", branch: body, status: true });
}