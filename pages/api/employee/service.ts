import { dataVerifyEmployee } from "@/types/verify";
import { getBranchById } from "@/utils/branch";
import { getCompanyById } from "@/utils/company";
import { deleteDataEmployee, getAllEmployee, getEmployeeByCompanyId, getEmployeeById, getEmployeeByNameCardIdUser, getUsernameByCompanyId, insertEmployee, updateEmployee, verifyEmployeeBody } from "@/utils/employee";
import { getPositionByIdByCompanyId } from "@/utils/position";
import { typeNumber } from "@/utils/utils";
import { NextApiRequest, NextApiResponse } from "next";

export const handleGetEmployeeById = async (res: NextApiResponse, id: number) => {
    const employee = await getEmployeeById(id);
    if (!employee) return res.status(404).json({ message: `No employee found with Id : ${id}`, employee: null, status: false });

    return res.status(200).json({ message: "Employee found", employee, status: true });
}

export const handleGetEmployeeByCompanyId = async (res: NextApiResponse, companyId: number) => {
    const employee = await getEmployeeByCompanyId(companyId);
    if (!employee) return res.status(404).json({ message: `No employee found with companyId : ${companyId}`, employee: null, status: false });

    return res.status(200).json({ message: "Employee found", employee, status: true });
}

export const handleGetAllEmployee = async (res: NextApiResponse) => {
    const employee = await getAllEmployee();
    if (!employee) return res.status(404).json({ message: `No employee found`, employee: null, status: false });

    return res.status(200).json({ message: "Employee found", employee, status: true });
}

export const handleAddEmployee = async (body: dataVerifyEmployee, res: NextApiResponse) => {
    // VerifyEmployeeData
    const verifyEmpolyee = verifyEmployeeBody(body);
    if (verifyEmpolyee.length > 0) return res.status(404).json({ message: verifyEmpolyee, employee: null, status: false });
    // check companyId
    const checkCompanyId = await getCompanyById(body.companyId);
    if (!checkCompanyId) return res.status(404).json({ message: `No company information found from companyId : ${body.companyId}.`, employee: null, status: false });
    // check branch
    const checkBranchId = await getBranchById(body.branchId);
    if (!checkBranchId) return res.status(404).json({ message: `No branch information found from branchId : ${body.branchId}.`, employee: null, status: false });
    // check position 
    const checkPosition = await getPositionByIdByCompanyId(body.positionId, "id");
    if (!checkPosition || (Array.isArray(checkPosition) && checkPosition.length === 0)) return res.status(404).json({ message: `No position found with positionId : ${body.positionId}.`, employee: null, status: false });
    // check name and subname and cardId
    const checkUserEmployee = await getEmployeeByNameCardIdUser(body.name, body.subname, body.cardId);
    if (checkUserEmployee) return res.status(404).json({ message: `Found information name : ${body.name} ${body.subname} and cardId : ${body.cardId} has already been used in the system.`, employee: checkUserEmployee, status: false });
    // check username in company
    const checkUserName = await getUsernameByCompanyId(body.userName, body.companyId);
    if (checkUserName) return res.status(404).json({ message: `Found information userName : ${body.userName} has already been used in the system.`, employee: checkUserName, status: false });
    // addEmployee
    const addEmployee = await insertEmployee(body);
    if (!addEmployee) return res.status(404).json({ message: "An error occurred saving data.", employee: null, status: false });

    return res.status(200).json({ message: "Data saved successfully.", employee: addEmployee, status: true });
}

export const handleUpdateEmployee = async (body: dataVerifyEmployee, res: NextApiResponse) => {
    if (!body.id) return res.status(404).json({ message: "Please specify employeeId", employee: null, status: false });

    // VerifyEmployeeData
    const verifyEmpolyee = verifyEmployeeBody(body);
    if (verifyEmpolyee.length > 0) return res.status(404).json({ message: verifyEmpolyee, employee: null, status: false });

    // ตรวจว่าใน DB มี ข้อมูล id หรือยัง
    const checkEmployeeId = await getEmployeeById(body.id);
    if (!checkEmployeeId) return res.status(404).json({ message: `No employee information found from Id. ${body.id}`, employee: null, status: false })

    // check name and subname and cardId
    const checkUserEmployee = await getEmployeeByNameCardIdUser(body.name, body.subname, body.cardId, body.id);
    if (checkUserEmployee) return res.status(404).json({ message: [{message: `Found information name : ${body.name} ${body.subname} and cardId : ${body.cardId} has already been used in the system.`}], employee: checkUserEmployee, status: false });
   
    // check username in company
    const checkUserName = await getUsernameByCompanyId(body.userName, body.companyId, body.id);
    if (checkUserName) return res.status(404).json({ message: `Found information userName : ${body.userName} has already been used in the system.`, employee: checkUserName, status: false });

    // update employee
    const updateEmployeeData = await updateEmployee(body, body.id);
    if (!updateEmployeeData) return res.status(404).json({ message: "An error occurred editing data.", employee: null, status: false });

    return res.status(200).json({ message: "Successfully edited information.", employee: body, status: true });
}

export const handleDeleteEmployee = async (req: NextApiRequest, res: NextApiResponse) => {
    const { query } = req;
    // Check EmployeeId is not null
    if (!query.id) return res.status(404).json({ message: "Please specify EmployeeId", employee: null, status: false });
    const id = typeNumber(query.id);
    // ตรวจว่าใน DB มี ข้อมูล id หรือยัง
    const checkEmployeeId = await getEmployeeById(id);
    if (!checkEmployeeId) return res.status(404).json({ message: `No employee information found from Id. ${id}`, employee: null, status: false })
    // deleteEmployee
    const deleteEmployee = await deleteDataEmployee(id);
    if (!deleteEmployee) return res.status(401).json({ message: "An error occurred deleting data.", employee: null, status: false });

    res.status(200).json({ message: "Successfully deleted data.", employee: deleteEmployee, status: true });
}

