import { dataVerifyEmployee } from "@/types/verify";
import { getBranchById } from "@/utils/branch";
import { getCompanyById } from "@/utils/company";
import { getEmployeeByNameCardIdUser, getusernameByCompanyId, insertEmployee, verifyEmployeeBody } from "@/utils/employee";
import { getPositionByIdByCompanyId } from "@/utils/position";
import { NextApiResponse } from "next";

export const handleAddEmployee = async (body: dataVerifyEmployee, res: NextApiResponse) => {
    // VerifyEmployeeData
    const verifyEmpolyee = verifyEmployeeBody(body);
    if (verifyEmpolyee.length > 0) {
        return res.status(404).json({ message: verifyEmpolyee, employee: null, status: false });
    }
    // check companyId
    const checkCompanyId = await getCompanyById(body.companyId);
    if (!checkCompanyId) {
        return res.status(404).json({ message: `No company information found from companyId : ${body.companyId}.`, employee: null, status: false });
    }
    // check branch
    const checkBranchId = await getBranchById(body.branchId);
    if (!checkBranchId) {
        return res.status(404).json({ message: `No branch information found from branchId : ${body.branchId}.`, employee: null, status: false });
    }
    // check position 
    const checkPosition = await getPositionByIdByCompanyId(body.positionId, "id");
    if (!checkPosition || (Array.isArray(checkPosition) && checkPosition.length === 0)) {
        return res.status(404).json({ message: `No position found with positionId : ${body.positionId}.`, employee: null, status: false });
    }
    // check name and subname and cardId
    const checkUserEmployee = await getEmployeeByNameCardIdUser(body.name, body.subname, body.cardId);
    if (checkUserEmployee) {
        return res.status(404).json({ message: `Found information name : ${body.name} ${body.subname} and cardId : ${body.cardId} has already been used in the system.`, employee: null, status: false });
    }
    // check username in company
    const checkUserName = await getusernameByCompanyId(body.userName, body.companyId);
    if (checkUserName) {
        return res.status(404).json({ message: `Found information userName : ${body.userName} has already been used in the system.`, employee: null, status: false });
    }
    // addEmployee
    const addEmployee = await insertEmployee(body);
    if (!addEmployee) {
        return res.status(404).json({ message: "An error occurred saving data.", employee: null, status: false });
    }

    return res.status(200).json({ message: "Data saved successfully.", employee: addEmployee, status: true });
}

