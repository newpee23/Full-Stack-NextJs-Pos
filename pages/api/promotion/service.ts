import { dataUpdateImgPromotion, dataVerifyPromotion } from "@/types/verify";
import { getCompanyById } from "@/utils/company";
import { VerifyUpdateImagePromotion, deleteDataPromotion, fetchAllPromotion, fetchPromotionByCompanyId, fetchPromotionById, fetchPromotionNameByCompanyId, insertPromotion, updateDataImagePromotion, updateDataPromotion, verifyPromotionBody } from "@/utils/promotion";
import { NextApiResponse } from "next";

export const handleAddPromotion = async (body: dataVerifyPromotion, res: NextApiResponse) => {
    // VerifyPromotionData
    const verifyPromotion = verifyPromotionBody(body);
    if (verifyPromotion.length > 0) return res.status(404).json({ message: verifyPromotion, promotion: null, status: false });
    // check companyId
    const checkCompanyId = await getCompanyById(body.companyId);
    if (!checkCompanyId) return res.status(404).json({ message: `No company found with companyId : ${body.companyId}`, promotion: null, status: false });
    // check name in company
    const checkName = await fetchPromotionNameByCompanyId(body.name, body.companyId);
    if (checkName) return res.status(404).json({ message: `Found information name : ${body.name} has already been used in the system.`, promotion: null, status: false });
    // addPromotion
    const addPromotion = await insertPromotion(body);
    if (!addPromotion) return res.status(404).json({ message: "บันทึกข้อมูลไม่สำเร็จ", promotion: null, status: false });

    return res.status(200).json({ message: "บันทึกข้อมูลสำเร็จ", promotion: addPromotion, status: true });
}

export const handleGetPromotionById = async (res: NextApiResponse, id: number) => {
    const promotion = await fetchPromotionById(id);
    if (!promotion) return res.status(404).json({ message: `No promotion found with Id : ${id}`, promotion: null, status: false });

    return res.status(200).json({ message: "Promotion found", promotion: promotion, status: true });
}

export const handleGetPromotionByCompanyId = async (res: NextApiResponse, companyId: number) => {
    const promotion = await fetchPromotionByCompanyId(companyId);
    if (!promotion || (Array.isArray(promotion) && promotion.length === 0)) return res.status(200).json({ message: `No promotion found with companyId : ${companyId}`, promotion: null, status: false });

    return res.status(200).json({ message: "Promotion found", promotion: promotion, status: true });
}

export const handleGetAllPromotion = async (res: NextApiResponse) => {
    const promotion = await fetchAllPromotion();
    if (!promotion || (Array.isArray(promotion) && promotion.length === 0)) return res.status(404).json({ message: `No promotion found`, promotion: null, status: false });

    return res.status(200).json({ message: "Promotion found", promotion: promotion, status: true });
}

export const handleUpdatePromotion = async (body: dataVerifyPromotion, res: NextApiResponse) => {
    if (!body.id || isNaN(Number(body.id))) return res.status(404).json({ message: "Please specify promotionId.", promotion: null, status: false });
    // VerifyPromotionData
    const verifyPromotion = verifyPromotionBody(body);
    if (verifyPromotion.length > 0) return res.status(404).json({ message: verifyPromotion, promotion: null, status: false });
    // check promotionId
    const checkPromotionId = await fetchPromotionById(body.id);
    if (!checkPromotionId) return res.status(404).json({ message: `No promotion found with id : ${body.id}`, promotion: null, status: false });
    // check companyId
    const checkCompanyId = await getCompanyById(body.companyId);
    if (!checkCompanyId) return res.status(404).json({ message: `No company found with companyId : ${body.companyId}`, promotion: null, status: false });
    // check name in company
    const checkName = await fetchPromotionNameByCompanyId(body.name, body.companyId, body.id);
    if (checkName) return res.status(404).json({ message: `Found information name : ${body.name} has already been used in the system.`, promotion: null, status: false });
    // updatePromotion
    const updatePromotion = await updateDataPromotion(body, body.id);
    if (!updatePromotion) return res.status(404).json({ message: "บันทึกข้อมูลไม่สำเร็จ", promotion: null, status: false });

    return res.status(200).json({ message: "บันทึกข้อมูลสำเร็จ", promotion: updatePromotion, status: true });
}

export const handleDeletePromotion = async (res: NextApiResponse, id: number) => {
    const promotion = await fetchPromotionById(id);
    if (!promotion) return res.status(404).json({ message: `No promotion found with Id : ${id}`, promotion: null, status: false });
    const deletePromotion = await deleteDataPromotion(id);
    if (!deletePromotion) return res.status(404).json({ message: "An error occurred deleting data.", promotion: null, status: false });

    return res.status(200).json({ message: "Successfully deleted data", promotion: deletePromotion, status: true });
}

export const handleUpdateImage = async (body: dataUpdateImgPromotion, res: NextApiResponse) => {
    // VerifyUpdateImage
    const verifyData = VerifyUpdateImagePromotion(body);
    if (verifyData.length > 0) return res.status(404).json({ message: verifyData, updateImg: null, status: false });
    // check companyId
    const checkCompanyId = await getCompanyById(body.companyId);
    if (!checkCompanyId) return res.status(404).json({ message: `No company found with companyId : ${body.companyId}`, updateImg: null, status: false });
    // updateImage
    const updateImage = await updateDataImagePromotion(body, body.promotionId);
    if (!updateImage) return res.status(404).json({ message: "บันทึกข้อมูลไม่สำเร็จ", updateImg: null, status: false });
    
    return res.status(200).json({ message: "บันทึกข้อมูลสำเร็จ", updateImg: updateImage, status: true });
}