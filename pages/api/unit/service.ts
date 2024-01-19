import { dataVerifyUnit } from "@/types/verify";
import { getCompanyById } from "@/utils/company";
import { checkNameInCompany, deleteDataUnit, fetchAllUnit, fetchUnitByCompanyId, fetchUnitById, insertUnit, updateDataUnit, verifyUnitBody } from "@/utils/unit";
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
    if (!addUnit) return res.status(404).json({ message: "บันทึกข้อมูลไม่สำเร็จ", unit: null, status: false });

    return res.status(200).json({ message: "บันทึกข้อมูลสำเร็จ", unit: addUnit, status: true });
}

export const handleGetUnitById = async (res: NextApiResponse, id: number) => {
    const unit = await fetchUnitById(id);
    if (!unit) return res.status(404).json({ message: `No unit found with id : ${id}`, unit: null, status: false });

    return res.status(200).json({ message: "Unit found", unit: unit, status: true });
}

export const handleGetUnitByCompanyId = async (res: NextApiResponse, companyId: number) => {
    const unit = await fetchUnitByCompanyId(companyId);
    if (!unit || (Array.isArray(unit) && unit.length === 0)) return res.status(200).json({ message: `No unit found with companyId : ${companyId}`, unit: null, status: false });

    return res.status(200).json({ message: "Unit found", unit: unit, status: true });
}

export const handleGetAllUnit = async (res: NextApiResponse) => {
    const unit = await fetchAllUnit();
    if (!unit || (Array.isArray(unit) && unit.length === 0)) return res.status(404).json({ message: `No unit found`, unit: null, status: false });

    return res.status(200).json({ message: "Unit found", unit: unit, status: true });
}

export const handleUpdateUnit = async (body: dataVerifyUnit, res: NextApiResponse) => {
    if (!body.id || isNaN(Number(body.id))) return res.status(404).json({ message: "Please specify unitId.", unit: null, status: false });
    // VerifyUnitData
    const verifyUnit = verifyUnitBody(body);
    if (verifyUnit.length > 0) return res.status(404).json({ message: verifyUnit, unit: null, status: false });
    //  check id unit
    const checkUnitId = await fetchUnitById(body.id);
    if(!checkUnitId) return res.status(404).json({ message: `No unit information found from Id. ${body.id}`, position: null, status: false });
    // check name in company
    const checkName = await checkNameInCompany(body.name, body.companyId, body.id);
    if(checkName) return res.status(404).json({ message: `Found information name : ${body.name}  has already been used in the system.`, unit: checkName, status: false });
    // check companyId
    const checkCompanyId = await getCompanyById(body.companyId);
    if(!checkCompanyId) return res.status(404).json({ message: `No company information found from companyId : ${body.companyId}.`, unit: null, status: false });
    // updateUnit
    const updateUnit = await updateDataUnit(body, body.id);
    if(!updateUnit) return res.status(404).json({ message: "บันทึกข้อมูลไม่สำเร็จ", unit: null, status: false });

    return res.status(200).json({ message: "บันทึกข้อมูลสำเร็จ", unit: updateUnit, status: true });
}

export const handleDeleteUnit = async (res: NextApiResponse, id: number) => {
    // fetchUnitById
    const unit = await fetchUnitById(id);
    if (!unit) return res.status(404).json({ message: `No unit found with Id : ${id}`, unit: null, status: false });
    // deleteUnit
    const deleteUnit = await deleteDataUnit(id);
    if (!deleteUnit) return res.status(404).json({ message: "An error occurred deleting data.", unit: null, status: false });

    return res.status(200).json({ message: "Successfully deleted data", unit: deleteUnit, status: true });
}