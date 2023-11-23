import { dataVerifyCompany } from "@/types/verify";
import { checkDataCompany, deleteDataCompany, getAllCompany, getCompanyById, getCompanyByName, insertDataCompany, updateDataCompany, verifyCompanyBody } from "@/utils/company";
import { typeNumber } from "@/utils/utils";
import { NextApiRequest, NextApiResponse } from "next";

export const handleGetCompanyById = async (res: NextApiResponse, id: number) => {
    const company = await getCompanyById(id);
    if (!company) return res.status(404).json({ message: [{ message: `ไม่พบข้อมูลบริษัทที่มีรหัส : ${id}` }], company: null, status: false });

    return res.status(200).json({ message: [{ message: "พบข้อมูลบริษัท" }], company: company, status: true });
}

export const handleGetAllCompany = async (res: NextApiResponse) => {
    const company = await getAllCompany();
    if (company?.length === 0) return res.status(404).json({ message: [{ message: "ไม่พบข้อมูลบริษัท" }], company: null, status: false });

    return res.status(200).json({ message: [{ message: "พบข้อมูลบริษัท" }], company: company, status: true });
}

export const handleAddCompany = async (body: dataVerifyCompany, res: NextApiResponse) => {
    // VerifyCompanyData
    const verifyCompany = verifyCompanyBody(body);
    if (verifyCompany.length > 0) return res.status(404).json({ message: verifyCompany, company: null, status: false });
    // ตรวจว่าใน DB มี ข้อมูล company หรือยัง
    const checkCompanyData = await checkDataCompany(body);
    if (checkCompanyData.length > 0) return res.status(404).json({ message: checkCompanyData, company: null, status: false });
    // add Company
    const addCompany = await insertDataCompany(body);
    if (!addCompany) return res.status(404).json({ message: addCompany, company: null, status: false });

    return res.status(200).json({ message: [{ message: "บันทึกข้อมูลเรียบร้อยแล้ว" }], company: addCompany, status: true });
}

export const handleUpdateCompany = async (body: dataVerifyCompany, res: NextApiResponse) => {
    // Check CompanyId is not null
    if (!body.id) return res.status(404).json({ message: [{ message: "กรุณาระบุรหัสบริษัท" }], company: null, status: false });
    // VerifyCompanyData
    const verifyCompany = verifyCompanyBody(body);
    if (verifyCompany.length > 0) return res.status(404).json({ message: verifyCompany, company: null, status: false });
    // ตรวจว่าใน DB มีข้อมูล Id หรือยัง
    const checkCompanyId = await getCompanyById(body.id);
    if (!checkCompanyId) return res.status(404).json({ message: [{ message: `ไม่พบข้อมูลบริษัทจากรหัส ${body.id}` }], company: null, status: false });
    // ตรวจว่าใน DB มี ข้อมูล company หรือยัง
    const checkCompanyData = await getCompanyByName(body.name, body.tax, body.id);
    if (checkCompanyData) return res.status(404).json({ message: [{ message: `พบข้อมูลชื่อ : ${body.name} และหมายเลขประจำตัว : ${body.tax} ได้ถูกนำไปใช้ในระบบแล้ว` }], company: checkCompanyData, status: false });
    // Update Company
    const updateCompany = await updateDataCompany(body.id, body);
    if (!updateCompany) return res.status(404).json({ message: [{ message: "เกิดข้อผิดพลาดในการแก้ไขข้อมูล" }], company: null, status: false });

    return res.status(200).json({ message: [{ message: "แก้ไขข้อมูลเรียบร้อยแล้ว" }], company: updateCompany, status: true });
}

export const handleDeleteCompany = async (req: NextApiRequest, res: NextApiResponse) => {
    const { query } = req;
    // Check CompanyId is not null
    if (!query.id) return res.status(404).json({ message: [{ message: "กรุณาระบุรหัสบริษัท" }], company: null, status: false });
    const companyId = typeNumber(query.id);
    // getCompany
    const company = await getCompanyById(companyId);
    if (!company) return res.status(401).json({ message: [{ message: `ไม่พบข้อมูลบริษัทจากรหัส : ${companyId}` }], company: null, status: false });
    // deleteCompany
    const deleteCompany = await deleteDataCompany(companyId);
    if (!deleteCompany) return res.status(401).json({ message: [{ message: "เกิดข้อผิดพลาดในการลบข้อมูล" }], company: null, status: false });

    return res.status(200).json({ message: [{ message: "ลบข้อมูลเรียบร้อยแล้ว" }], company: deleteCompany, status: true });
}