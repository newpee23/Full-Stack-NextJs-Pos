import { dataVerifyProductType } from "@/types/verify";
import { checkProductTypeDataByName, deleteDataProductType, fetchAllProductType, fetchProductTypeByCompanyId, fetchProductTypeById, insertaddProductType, updateDataProductType, verifyProductTypeBody } from "@/utils/productType";
import { NextApiResponse } from "next";

export const handleAddProductType = async (body: dataVerifyProductType, res: NextApiResponse) => {
    // VerifyPositionData
    const verifyProductType = verifyProductTypeBody(body);
    if (verifyProductType.length > 0) return res.status(404).json({ message: verifyProductType, productType: null, status: false });
    // ตรวจว่ามีข้อมูล companyId และ name ในระบบมั้ย
    const checkProductTypeName = await checkProductTypeDataByName(body.companyId, body.name);
    if (checkProductTypeName.length > 0) return res.status(404).json({ message: checkProductTypeName, productType: null, status: false });
    // addProductType
    const addProductType = await insertaddProductType(body);
    if (!addProductType) return res.status(404).json({ message: "บันทึกข้อมูลไม่สำเร็จ", productType: null, status: false });

    return res.status(200).json({ message: "บันทึกข้อมูลสำเร็จ", productType: addProductType, status: true });
}

export const handleGetProductTypeById = async (res: NextApiResponse, id: number) => {
    const productType = await fetchProductTypeById(id);
    if (!productType) return res.status(404).json({ message: `No productType found with Id : ${id}`, productType: null, status: false });

    return res.status(200).json({ message: "Position found", productType: productType, status: true });
}

export const handleGetProductTypeByCompanyId = async (res: NextApiResponse, companyId: number) => {
    const productType = await fetchProductTypeByCompanyId(companyId);
    if (!productType || (Array.isArray(productType) && productType.length === 0)) return res.status(200).json({ message: `No productType found with companyId : ${companyId}`, productType: null, status: false });

    return res.status(200).json({ message: "Position found", productType: productType, status: true });
}

export const handleGetAllProductType = async (res: NextApiResponse) => {
    const productType = await fetchAllProductType();
    if (!productType || (Array.isArray(productType) && productType.length === 0)) return res.status(404).json({ message: `No productType found`, productType: null, status: false });

    return res.status(200).json({ message: "Position found", productType: productType, status: true });
}

export const handleUpdateProductType = async (body: dataVerifyProductType, res: NextApiResponse) => {
    if (!body.id || isNaN(Number(body.id))) return res.status(404).json({ message: "Please specify productTypeId.", productType: null, status: false });
    // VerifyPositionData
    const verifyProductType = verifyProductTypeBody(body);
    if (verifyProductType.length > 0) return res.status(404).json({ message: verifyProductType, productType: null, status: false });
    // ตรวจว่ามีข้อมูล productType ในระบบมั้ย
    const productType = await fetchProductTypeById(body.id);
    if (!productType) return res.status(404).json({ message: `No productType found with Id : ${body.id}`, productType: null, status: false });
    // ตรวจว่ามีข้อมูล companyId และ name ในระบบมั้ย
    const checkProductTypeName = await checkProductTypeDataByName(body.companyId, body.name, body.id);
    if (checkProductTypeName.length > 0) return res.status(404).json({ message: checkProductTypeName, productType: null, status: false });
    // updateProductType
    const updateProductType = await updateDataProductType(body, body.id);
    if (!updateProductType) return res.status(404).json({ message: "บันทึกข้อมูลไม่สำเร็จ", productType: null, status: false });

    return res.status(200).json({ message: "บันทึกข้อมูลสำเร็จ", productType: updateProductType, status: true });
}

export const handleDeleteProductType = async (res: NextApiResponse, id: number) => {
    const productType = await fetchProductTypeById(id);
    if (!productType) return res.status(404).json({ message: `No productType found with Id : ${id}`, productType: null, status: false });
    const deleteProductType = await deleteDataProductType(id);
    if (!deleteProductType) return res.status(404).json({ message: "An error occurred deleting data.", productType: null, status: false });

    return res.status(200).json({ message: "Successfully deleted data", productType: deleteProductType, status: true });
}

export const handleUpdateImage =async () => {
    
}