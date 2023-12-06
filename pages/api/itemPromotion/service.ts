import { dataVerifyItemPromotion } from "@/types/verify";
import { checkArrayPdIdInPromotionId, checkArrayProductId, checkArrayPromotionId, deleteDataItemPromotion, fetchAllItemPromotion, fetchItemPromotionById, fetchItemPromotionByPromotionId, insertArrayPromotionItem, insertItemPromotion, updateDataItemPromotion, verifyItemPromotionBody } from "@/utils/itemPromotion";
import { NextApiResponse } from "next";

export const handleAddItemPromotion = async (body: dataVerifyItemPromotion[], res: NextApiResponse) => {
    // VerifyitemPromotionData
    const verifyPromotion = verifyItemPromotionBody(body);
    if (verifyPromotion.length > 0) return res.status(404).json({ message: verifyPromotion, itemPromotion: null, status: false });
    // check promotionId
    const checkPromotionId = await checkArrayPromotionId(body);
    if (checkPromotionId.length > 0) return res.status(404).json({ message: checkPromotionId, itemPromotion: null, status: false });
    // check productId
    const checkProductId = await checkArrayProductId(body);
    if (checkProductId.length > 0) return res.status(404).json({ message: checkProductId, itemPromotion: null, status: false });
    // check productId In promotionId
    const checkPdIdInPromotionId = await checkArrayPdIdInPromotionId(body);
    if (checkPdIdInPromotionId.length > 0) return res.status(404).json({ message: checkPdIdInPromotionId, itemPromotion: null, status: false });
    // addItemPromotion
    const addItemPromotion = await insertArrayPromotionItem(body);
    if (addItemPromotion.length > 0) return res.status(404).json({ message: addItemPromotion, itemPromotion: null, status: false });

    return res.status(200).json({ message: "บันทึกข้อมูลสำเร็จ", itemPromotion: body, status: true });
}

export const handleGetItemPromotionById = async (res: NextApiResponse, id: number) => {
    const itemPromotion = await fetchItemPromotionById(id);
    if (!itemPromotion) return res.status(404).json({ message: `No itemPromotion found with Id : ${id}`, itemPromotion: null, status: false });

    return res.status(200).json({ message: "ItemPromotion found", itemPromotion: itemPromotion, status: true });
}

export const handleGetItemPromotionByPromotionId = async (res: NextApiResponse, promotionId: number) => {
    const itemPromotion = await fetchItemPromotionByPromotionId(promotionId);
    if (!itemPromotion || (Array.isArray(itemPromotion) && itemPromotion.length === 0)) return res.status(404).json({ message: `No itemPromotion found with promotionId : ${promotionId}`, itemPromotion: null, status: false });

    return res.status(200).json({ message: "itemPromotion found", itemPromotion: itemPromotion, status: true });
}

export const handleGetAllItemPromotion = async (res: NextApiResponse) => {
    const itemPromotion = await fetchAllItemPromotion();
    if (!itemPromotion || (Array.isArray(itemPromotion) && itemPromotion.length === 0)) return res.status(404).json({ message: `No itemPromotion found`, itemPromotion: null, status: false });

    return res.status(200).json({ message: "itemPromotion found", itemPromotion: itemPromotion, status: true });
}

export const handleUpdateItemPromotion = async (body: dataVerifyItemPromotion, res: NextApiResponse) => {
    // if (!body.id || isNaN(Number(body.id))) return res.status(404).json({ message: "Please specify itemPromotionId.", itemPromotion: null, status: false });
    // // VerifyitemPromotionData
    // const verifyPromotion = verifyItemPromotionBody(body);
    // if (verifyPromotion.length > 0) return res.status(404).json({ message: verifyPromotion, itemPromotion: null, status: false });
    // // check itemPromotionId
    // const checkItemPromotionId = await fetchItemPromotionById(body.id);
    // if (!checkItemPromotionId) return res.status(404).json({ message: `No itemPromotion found with id : ${body.id}`, itemPromotion: null, status: false });
    // // check promotionId
    // const checkPromotionId = await fetchPromotionById(body.promotionId);
    // if (!checkPromotionId) return res.status(404).json({ message: `No promotion found with promotionId : ${body.promotionId}`, itemPromotion: null, status: false });
    // // check productId
    // const productId = await fetchProductById(body.productId);
    // if (!productId) return res.status(404).json({ message: `No product found with productId : ${body.productId}`, itemPromotion: null, status: false });
    // // updateItemPromotion
    // const updateItemPromotion = await updateDataItemPromotion(body, body.id);
    // if (!updateItemPromotion) return res.status(404).json({ message: "An error occurred saving data.", itemPromotion: null, status: false });

    return res.status(200).json({ message: "Data saved successfully.", itemPromotion: [], status: true });
}

export const handleDeleteItemPromotion = async (res: NextApiResponse, id: number) => {
    const itemPromotion = await fetchItemPromotionById(id);
    if (!itemPromotion) return res.status(404).json({ message: `No itemPromotion found with Id : ${id}`, itemPromotion: null, status: false });
    const deleteItemPromotion = await deleteDataItemPromotion(id);
    if (!deleteItemPromotion) return res.status(404).json({ message: "An error occurred deleting data.", itemPromotion: null, status: false });

    return res.status(200).json({ message: "Successfully deleted data", itemPromotion: deleteItemPromotion, status: true });
}