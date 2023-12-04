import { dataVerifyEmployee } from "@/types/verify";
import { getBranchById } from "@/utils/branch";
import { getCompanyById } from "@/utils/company";
import { deleteDataEmployee, getAllEmployee, getEmployeeByCompanyId, getEmployeeById, getEmployeeByNameCardIdUser, getUsernameByCompanyId, insertEmployee, updateEmployee, verifyEmployeeBody } from "@/utils/employee";
import { getPositionByIdByCompanyId } from "@/utils/position";
import { typeNumber } from "@/utils/utils";
import { NextApiRequest, NextApiResponse } from "next";

export const handleGetEmployeeById = async (res: NextApiResponse, id: number) => {
    const employee = await getEmployeeById(id);
    if (!employee) return res.status(404).json({ message:  [{ message: `ไม่พบพนักงานที่มีรหัส : ${id}` }], employee: null, status: false });

    return res.status(200).json({ message: [{ message: "พบข้อมูลพนักงาน" }], employee, status: true });
}

export const handleGetEmployeeByCompanyId = async (res: NextApiResponse, companyId: number) => {
    const employee = await getEmployeeByCompanyId(companyId);
    if (!employee) return res.status(200).json({ message: [{ message: `ไม่พบพนักงานที่มีรหัสบริษัท : ${companyId}` }], employee: null, status: false });

    return res.status(200).json({ message: [{ message: "พบข้อมูลพนักงาน" }], employee, status: true });
}

export const handleGetAllEmployee = async (res: NextApiResponse) => {
    const employee = await getAllEmployee();
    if (!employee) return res.status(404).json({ message:  [{ message: "ไม่พบข้อมูลพนักงาน" }], employee: null, status: false });

    return res.status(200).json({ message: [{ message: "พบข้อมูลพนักงาน" }], employee, status: true });
}

export const handleAddEmployee = async (body: dataVerifyEmployee, res: NextApiResponse) => {
    // VerifyEmployeeData
    const verifyEmpolyee = verifyEmployeeBody(body);
    if (verifyEmpolyee.length > 0) return res.status(404).json({ message: verifyEmpolyee, employee: null, status: false });
    // check companyId
    const checkCompanyId = await getCompanyById(body.companyId);
    if (!checkCompanyId) return res.status(404).json({ message: [{ message: `ไม่พบข้อมูลบริษัทจากรหัสบริษัท : ${body.companyId}` }], employee: null, status: false });
    // check branch
    const checkBranchId = await getBranchById(body.branchId);
    if (!checkBranchId) return res.status(404).json({ message: [{ message: `ไม่พบข้อมูลสาขาจากรหัสสาขา : ${body.branchId}` }], employee: null, status: false });
    // check position 
    const checkPosition = await getPositionByIdByCompanyId(body.positionId, "id");
    if (!checkPosition || (Array.isArray(checkPosition) && checkPosition.length === 0)) return res.status(404).json({ message: [{ message: `ไม่พบข้อมูลตำแหน่งจากรหัสตำแหน่ง : ${body.positionId}` }], employee: null, status: false });
    // check name and subname and cardId
    const checkUserEmployee = await getEmployeeByNameCardIdUser(body.name, body.subname, body.cardId);
    if (checkUserEmployee) return res.status(404).json({ message: [{ message: `พบข้อมูลชื่อ : ${body.name} ${body.subname} และหมายเลขประจำตัว : ${body.cardId} ได้ถูกนำไปใช้ในระบบแล้ว` }], employee: checkUserEmployee, status: false });
    // check username in company
    const checkUserName = await getUsernameByCompanyId(body.userName, body.companyId);
    if (checkUserName) return res.status(404).json({ message: [{ message: `พบข้อมูลชื่อผู้ใช้ : ${body.userName} ได้ถูกนำไปใช้ในระบบแล้ว` }], employee: checkUserName, status: false });
    // addEmployee
    const addEmployee = await insertEmployee(body);
    if (!addEmployee) return res.status(404).json({ message: [{ message: "เกิดข้อผิดพลาดในการบันทึกข้อมูล" }], employee: null, status: false });

    return res.status(200).json({ message: [{ message: "บันทึกข้อมูลเรียบร้อยแล้ว" }], employee: addEmployee, status: true });
}

export const handleUpdateEmployee = async (body: dataVerifyEmployee, res: NextApiResponse) => {
    if (!body.id) return res.status(404).json({ message: [{ message: "กรุณาระบุรหัสพนักงาน" }], employee: null, status: false });

    // VerifyEmployeeData
    const verifyEmpolyee = verifyEmployeeBody(body);
    if (verifyEmpolyee.length > 0) return res.status(404).json({ message: verifyEmpolyee, employee: null, status: false });

    // ตรวจว่าใน DB มี ข้อมูล id หรือยัง
    const checkEmployeeId = await getEmployeeById(body.id);
    if (!checkEmployeeId) return res.status(404).json({ message: [{ message: `ไม่พบข้อมูลพนักงานจากรหัส ${body.id}` }], employee: null, status: false })

    // check name and subname and cardId
    const checkUserEmployee = await getEmployeeByNameCardIdUser(body.name, body.subname, body.cardId, body.id);
    if (checkUserEmployee) return res.status(404).json({ message: [{message: `พบข้อมูลชื่อ : ${body.name} ${body.subname} แลพรหัสประจำตัว : ${body.cardId} ได้ถูกนำไปใช้ในระบบแล้ว`}], employee: checkUserEmployee, status: false });
   
    // check username in company
    const checkUserName = await getUsernameByCompanyId(body.userName, body.companyId, body.id);
    if (checkUserName) return res.status(404).json({ message: [{message: `พบข้อมูลชื่อผู้ใช้ : ${body.userName} ได้ถูกนำไปใช้ในระบบแล้ว`}], employee: checkUserName, status: false });

    // update employee
    const updateEmployeeData = await updateEmployee(body, body.id);
    if (!updateEmployeeData) return res.status(404).json({ message: [{ message: "เกิดข้อผิดพลาดในการแก้ไขข้อมูล" }], employee: null, status: false });

    return res.status(200).json({ message: [{ message: "แก้ไขข้อมูลเรียบร้อยแล้ว" }], employee: body, status: true });
}

export const handleDeleteEmployee = async (req: NextApiRequest, res: NextApiResponse) => {
    const { query } = req;
    // Check EmployeeId is not null
    if (!query.id) return res.status(404).json({ message: [{ message: "กรุณาระบุรหัสพนักงาน" }], employee: null, status: false });
    const id = typeNumber(query.id);
    // ตรวจว่าใน DB มี ข้อมูล id หรือยัง
    const checkEmployeeId = await getEmployeeById(id);
    if (!checkEmployeeId) return res.status(404).json({ message: [{ message: `ไม่พบข้อมูลพนักงานจากรหัส :  ${id}`}], employee: null, status: false })
    // deleteEmployee
    const deleteEmployee = await deleteDataEmployee(id);
    if (!deleteEmployee) return res.status(401).json({ message: [{ message: "เกิดข้อผิดพลาดในการลบข้อมูล" }], employee: null, status: false });

    res.status(200).json({ message: [{ message: "ลบข้อมูลเรียบร้อยแล้ว" }], employee: deleteEmployee, status: true });
}

