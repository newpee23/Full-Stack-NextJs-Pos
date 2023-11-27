import { getCompanyById } from "@/utils/company";
import { fetchOptionAddEmployee, fetchOptionProduct, fetchOptionTables } from "@/utils/optionSelect";
import { NextApiResponse } from "next";

export const handleGetOptionAddEmployee = async (res: NextApiResponse, companyId: number) => {
    const checkCompanyId = await getCompanyById(companyId);
    if (!checkCompanyId) return res.status(404).json({ message: `ไม่พบข้อมูลบริษัทจากรหัส : ${companyId}`, optionEmployee: null, status: false });
    const option = await fetchOptionAddEmployee(companyId);
    return res.status(200).json({ message: "Options found", optionEmployee: option, status: true });
}

export const handleGetOptionTables = async (res: NextApiResponse, companyId: number) => {
    const checkCompanyId = await getCompanyById(companyId);
    if (!checkCompanyId) return res.status(404).json({ message: `ไม่พบข้อมูลบริษัทจากรหัส : ${companyId}`, optionTables: null, status: false });
    const option = await fetchOptionTables(companyId);
    return res.status(200).json({ message: "Options found", optionTables: option, status: true });
}

export const handleGetOptionProduct  = async (res: NextApiResponse, companyId: number) => {
    const checkCompanyId = await getCompanyById(companyId);
    if (!checkCompanyId) return res.status(404).json({ message: `ไม่พบข้อมูลบริษัทจากรหัส : ${companyId}`, optionProduct: null, status: false });
    const option = await fetchOptionProduct(companyId);
    return res.status(200).json({ message: "Options found", optionProduct: option, status: true });
}