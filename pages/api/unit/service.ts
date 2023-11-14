import { dataVerifyUnit } from "@/types/verify";
import { getCompanyById } from "@/utils/company";
import { checkNameInCompany, insertUnit, verifyUnitBody } from "@/utils/unit";
import { NextApiResponse } from "next";

export const handleAddUnit = async (body: dataVerifyUnit, res: NextApiResponse) => {
    // VerifyUnitData
    const verifyUnit = verifyUnitBody(body);
    if (verifyUnit.length > 0) return res.status(404).json({ message: verifyUnit, unit: null, status: false });

    // check name in company
    const checkName = await checkNameInCompany(body.name, body.companyId);
    if(checkName) return res.status(404).json({ message: `Found information name : ${body.name}  has already been used in the system.`, unit: checkName, status: false });

    // check companyId
    const checkCompanyId = await getCompanyById(body.companyId);
    if(!checkCompanyId) return res.status(404).json({ message: `No company information found from companyId : ${body.companyId}.`, unit: null, status: false });
    
    // addUnit
    const addUnit = await insertUnit(body);
    if (!addUnit) return res.status(404).json({ message: "An error occurred saving data.", unit: null, status: false });

    return res.status(200).json({ message: "Data saved successfully.", unit: addUnit, status: true });
}