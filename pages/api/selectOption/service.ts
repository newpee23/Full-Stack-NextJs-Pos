import { getCompanyById } from "@/utils/company";
import { fetchOptionAddEmployee, fetchOptionBranch, fetchOptionExpensesItem, fetchOptionProduct, fetchOptionPromotionItem, fetchOptionTables } from "@/utils/optionSelect";
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

export const handleGetOptionExpensesItem = async (res: NextApiResponse, companyId: number) => {
    const checkCompanyId = await getCompanyById(companyId);
    if (!checkCompanyId) return res.status(404).json({ message: `ไม่พบข้อมูลบริษัทจากรหัส : ${companyId}`, optionExpensesItem: null, status: false });
    const option = await fetchOptionExpensesItem(companyId);
    return res.status(200).json({ message: "Options found", optionExpenses: option, status: true });
}

export const handleGetOptionProduct  = async (res: NextApiResponse, companyId: number) => {
    const checkCompanyId = await getCompanyById(companyId);
    if (!checkCompanyId) return res.status(404).json({ message: `ไม่พบข้อมูลบริษัทจากรหัส : ${companyId}`, optionProduct: null, status: false });
    const option = await fetchOptionProduct(companyId);
    return res.status(200).json({ message: "Options found", optionProduct: option, status: true });
}

export const handleGetOptionPromotionItem  = async (res: NextApiResponse, companyId: number) => {
    const checkCompanyId = await getCompanyById(companyId);
    if (!checkCompanyId) return res.status(404).json({ message: `ไม่พบข้อมูลบริษัทจากรหัส : ${companyId}`, optionPromotionItem: null, status: false });
    const option = await fetchOptionPromotionItem(companyId);
    return res.status(200).json({ message: "Options found", optionPromotionItem: option, status: true });
}

export const handleGetOptionBranch  = async (res: NextApiResponse, companyId: number) => {
    const checkCompanyId = await getCompanyById(companyId);
    if (!checkCompanyId) return res.status(404).json({ message: `ไม่พบข้อมูลบริษัทจากรหัส : ${companyId}`, optionPromotionItem: null, status: false });
    const option = await fetchOptionBranch(companyId);

    return res.status(200).json({ message: "Options found", optionBranchItem: option, status: true });
}