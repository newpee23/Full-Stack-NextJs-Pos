import { dataVerifyBranch, dataVerifyPosition } from "@/types/verify";
import { checkCompanyData, deleteDataBranch, getAllBranch, getBranchByCompanyId, getBranchById, getBranchByNameByCompany, insertBranch, updateDataBranch, verifyBranchBody } from "@/utils/branch";
import { typeNumber } from "@/utils/utils";
import { NextApiRequest, NextApiResponse } from "next";

export const handleGetBranchById = async (res: NextApiResponse, id: number) => {
    const branch = await getBranchById(id);
    if (!branch) return res.status(404).json({ message: [{ message: `ไม่พบสาขาที่มีรหัส : ${id}` }], branch: null, status: false });

    return res.status(200).json({ message: [{ message: "พบข้อมูลสาขา" }], branch, status: true });
}

export const handleGetBranchByCompanyId = async (res: NextApiResponse, companyId: number) => {
    const branch = await getBranchByCompanyId(companyId);
    if (!branch || branch?.length === 0) return res.status(404).json({ message: [{ message: `ไม่พบสาขาที่มีรหัสบริษัท : ${companyId}` }], branch: null, status: false });

    return res.status(200).json({ message: [{ message: "พบข้อมูลสาขา" }], branch: branch, status: true });
}

export const handleGetAllBranch = async (res: NextApiResponse) => {
    const branch = await getAllBranch();
    if (branch === null || branch.length === 0) return res.status(404).json({ message: [{ message: "ไม่พบข้อมูลสาขา" }], branch: null, status: false });

    res.status(200).json({ message: [{ message: "พบข้อมูลสาขา" }], branch: branch, status: true });
}

export const handleDeleteBarnch = async (req: NextApiRequest, res: NextApiResponse) => {
    const { query } = req;
    // Check CompanyId is not null
    if (!query.id) return res.status(404).json({ message: [{ message: "กรุณาระบุรหัสสาขา" }], branch: null, status: false });

    const id = typeNumber(query.id);
    // getBranch
    const branch = await getBranchById(id);
    if (!branch) return res.status(404).json({ message: [{ message: `ไม่พบข้อมูลสาขาจากรหัส : ${id}` }], branch: null, status: false });
    // deleteBranch
    const deleteBranch = await deleteDataBranch(id);
    if (!deleteBranch) return res.status(404).json({ message: [{ message: "เกิดข้อผิดพลาดในการลบข้อมูล" }], branch: null, status: false });

    res.status(200).json({ message: [{ message: "ลบข้อมูลเรียบร้อยแล้ว" }], branch: deleteBranch, status: true });
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
    if (!addBranch) return res.status(404).json({ message: [{ message: "เกิดข้อผิดพลาดในการบันทึกข้อมูล" }], branch: null, status: false });

    return res.status(200).json({ message: [{ message: "บันทึกข้อมูลเรียบร้อยแล้ว" }], branch: addBranch, status: true });
}

export const handleUpdateBranch = async (body: dataVerifyBranch, res: NextApiResponse) => {
    if (!body.id) return res.status(404).json({ message: [{ message: "กรุณาระบุรหัสสาขา" }], branch: null, status: false });

    // VerifyBranchData
    const verifyBranch = verifyBranchBody(body);
    if (verifyBranch.length > 0) return res.status(404).json({ message: verifyBranch, branch: null, status: false });
    // ตรวจว่าใน DB มี ข้อมูล id หรือยัง
    const checkBranchId = await getBranchById(body.id);
    if (!checkBranchId) return res.status(404).json({ message: [{ message: `ไม่พบข้อมูลสาขาจากรหัส : ${body.id}` }], branch: null, status: false })
    // ตรวจว่าใน DB มี ข้อมูล ชื่อสาขา หรือยัง
    const checkBranchName = await getBranchByNameByCompany(body.companyId, body.name, body.id);
    if (checkBranchName) return res.status(404).json({ message: [{ message: `พบข้อมูลบริษัท : ${body.name} ได้ถูกนำไปใช้ในระบบแล้ว` }], branch: checkBranchName, status: false });
    // update Branch
    const updateBranch = await updateDataBranch(body.id, body);
    if (!updateBranch) return res.status(404).json({ message: [{ message: "เกิดข้อผิดพลาดในการแก้ไขข้อมูล" }], branch: null, status: false });

    return res.status(200).json({ message: [{ message: "แก้ไขข้อมูลเรียบร้อยแล้ว" }], branch: body, status: true });
}