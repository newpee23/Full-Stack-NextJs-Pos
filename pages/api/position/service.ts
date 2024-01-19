import { dataVerifyPosition } from "@/types/verify";
import { deleteDataPosition, getAllPosition, getPositionByIdByCompanyId, checkPositionData, verifyPositionBody, insertPosition, updatePosition } from "@/utils/position";
import { NextApiResponse } from "next";

export const handleGetPositionById = async (res: NextApiResponse, id: number) => {
    const position = await getPositionByIdByCompanyId(id, "id");
    if (!position || (Array.isArray(position) && position.length === 0)) return res.status(404).json({ message: `No position found with Id : ${id}`, position: null, status: false });

    return res.status(200).json({ message: "Position found", position: position, status: true });
}

export const handleGetPositionByCompanyId = async (res: NextApiResponse, companyId: number) => {
    const position = await getPositionByIdByCompanyId(companyId, "companyId");
    if (!position || (Array.isArray(position) && position.length === 0)) return res.status(404).json({ message: `No position found with companyId : ${companyId}`, position: null, status: false });

    return res.status(200).json({ message: "Position found", position: position, status: true });
}

export const handleGetAllPosition = async (res: NextApiResponse) => {
    const position = await getAllPosition();
    if (!position || position.length === 0) return res.status(404).json({ message: "No positions found", position: null, status: false });

    return res.status(200).json({ message: "Position found", position: position, status: true });
}

export const handleDeletePosition = async (res: NextApiResponse, id: number) => {
    const position = await getPositionByIdByCompanyId(id, "id");
    if (!position || (Array.isArray(position) && position.length === 0)) return res.status(404).json({ message: `No position found with Id : ${id}`, position: null, status: false });
    const deletePosition = await deleteDataPosition(id);
    if (!deletePosition) return res.status(404).json({ message: "An error occurred deleting data.", position: null, status: false });

    return res.status(200).json({ message: "Successfully deleted data", position: position, status: true });
}

export const handleAddPosition = async (body: dataVerifyPosition, res: NextApiResponse) => {
    // VerifyPositionData
    const verifyPosition = verifyPositionBody(body);
    if (verifyPosition.length > 0) return res.status(404).json({ message: verifyPosition, position: null, status: false });
    // ตรวจว่ามีข้อมูล companyId และ name ในระบบมั้ย
    const checkCompanyName = await checkPositionData(body.companyId, body.name);
    if (checkCompanyName.length > 0) return res.status(404).json({ message: checkCompanyName, position: null, status: false });
    // addPosition
    const addPosition = await insertPosition(body);
    if (!addPosition) return res.status(404).json({ message: "บันทึกข้อมูลไม่สำเร็จ", position: null, status: false });

    return res.status(200).json({ message: "บันทึกข้อมูลสำเร็จ", position: addPosition, status: true });
}

export const handleUpdatePosition = async (body: dataVerifyPosition, res: NextApiResponse) => {

    if (!body.id || isNaN(Number(body.id))) return res.status(404).json({ message: "Please specify positionId.", position: null, status: false });
    // VerifyPositionData
    const verifyPosition = verifyPositionBody(body);
    if (verifyPosition.length > 0) return res.status(404).json({ message: verifyPosition, position: null, status: false });
    // ตรวจว่ามีข้อมูล id ในระบบมั้ย
    const checkPositionId = await getPositionByIdByCompanyId(body.id, "id");
    if (!checkPositionId || (Array.isArray(checkPositionId) && checkPositionId.length === 0)) return res.status(404).json({ message: `No Position information found from Id. ${body.id}`, position: null, status: false })
    // ตรวจว่ามีข้อมูล companyId และ name ในระบบมั้ย
    const checkCompanyName = await checkPositionData(body.companyId, body.name, body.id);
    if (checkCompanyName.length > 0) return res.status(404).json({ message: checkCompanyName, position: null, status: false });
    // updatePosition
    const position = await updatePosition(body.id, body);
    if (!position) return res.status(404).json({ message: "บันทึกข้อมูลไม่สำเร็จ", position: null, status: false });

    return res.status(200).json({ message: "บันทึกข้อมูลสำเร็จ", position: position, status: true });
}

