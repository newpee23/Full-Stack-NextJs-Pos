import { getCompanyById } from "@/utils/company";
import { fetchOptionAddEmployee, fetchOptionTables } from "@/utils/optionSelect";
import { NextApiResponse } from "next";

export const handleGetOptionAddEmployee = async (res: NextApiResponse, companyId: number) => {
    const checkcompanyId = await getCompanyById(companyId);
    if (!checkcompanyId) return res.status(404).json({ message: `ไม่พบข้อมูลบริษัทจากรหัส : ${companyId}`, optionEmployee: null, status: false });
    const option = await fetchOptionAddEmployee(companyId);
    return res.status(200).json({ message: "Options found", optionEmployee: option, status: true });
}

export const handleGetOptionTables = async (res: NextApiResponse, companyId: number) => {
    const checkcompanyId = await getCompanyById(companyId);
    if (!checkcompanyId) return res.status(404).json({ message: `ไม่พบข้อมูลบริษัทจากรหัส : ${companyId}`, optionEmployee: null, status: false });
    const option = await fetchOptionTables(companyId);
    return res.status(200).json({ message: "Options found", optionTables: option, status: true });
}