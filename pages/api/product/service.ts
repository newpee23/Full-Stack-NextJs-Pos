import { dataVerifyProduct } from "@/types/verify";
import { getCompanyById } from "@/utils/company";
import { deleteDataProduct, fetchAllProduct, fetchProductByCompanyId, fetchProductById, fetchProductByName, insertaddProduct, updateDataProduct, verifyProductBody } from "@/utils/product";
import { fetchProductTypeById } from "@/utils/productType";
import { fetchUnitById } from "@/utils/unit";
import { NextApiResponse } from "next";

export const handleAddProduct = async (body: dataVerifyProduct, res: NextApiResponse) => {
    // VerifyPositionData
    const verifyProduct = verifyProductBody(body);
    if (verifyProduct.length > 0) return res.status(404).json({ message: verifyProduct, product: null, status: false });
    // check companyId
    const checkCompanyId = await getCompanyById(body.companyId);
    if (!checkCompanyId) return res.status(404).json({ message: `No company found with companyId : ${body.companyId}`, product: null, status: false });
    //  check productTypeId
    const checkProductTypeId = await fetchProductTypeById(body.productTypeId);
    if (!checkProductTypeId) return res.status(404).json({ message: `No productType found with productTypeId : ${body.productTypeId}`, product: null, status: false });
    // check unitId
    const checkUnitId = await fetchUnitById(body.unitId);
    if (!checkUnitId) return res.status(404).json({ message: `No unit found with unitId : ${body.unitId}`, product: null, status: false });
    // check name in company
    const checkName = await fetchProductByName(body.name, body.companyId);
    if (checkName) return res.status(404).json({ message: `Found information name : ${body.name} has already been used in the system.`, product: null, status: false });
    // addProduct
    const addProduct = await insertaddProduct(body);
    if (!addProduct) return res.status(404).json({ message: "An error occurred saving data.", product: null, status: false });

    return res.status(200).json({ message: "Data saved successfully.", product: addProduct, status: true });
}

export const handleGetProductById = async (res: NextApiResponse, id: number) => {
    const product = await fetchProductById(id);
    if (!product) return res.status(404).json({ message: `No product found with Id : ${id}`, product: null, status: false });

    return res.status(200).json({ message: "Position found", product: product, status: true });
}

export const handleGetProductByCompanyId = async (res: NextApiResponse, companyId: number) => {
    const product = await fetchProductByCompanyId(companyId);
    if (!product || (Array.isArray(product) && product.length === 0)) return res.status(404).json({ message: `No product found with companyId : ${companyId}`, product: null, status: false });

    return res.status(200).json({ message: "Position found", product: product, status: true });
}

export const handleGetAllProduct = async (res: NextApiResponse) => {
    const product = await fetchAllProduct();
    if (!product || (Array.isArray(product) && product.length === 0)) return res.status(404).json({ message: `No product found`, product: null, status: false });

    return res.status(200).json({ message: "Position found", product: product, status: true });
}

export const handleUpdateProduct = async (body: dataVerifyProduct, res: NextApiResponse) => {
    if (!body.id || isNaN(Number(body.id))) return res.status(404).json({ message: "Please specify productId.", product: null, status: false });
    // VerifyPositionData
    const verifyProduct = verifyProductBody(body);
    if (verifyProduct.length > 0) return res.status(404).json({ message: verifyProduct, product: null, status: false });
    // check companyId
    const checkCompanyId = await getCompanyById(body.companyId);
    if (!checkCompanyId) return res.status(404).json({ message: `No company found with companyId : ${body.companyId}`, product: null, status: false });
    //  check productTypeId
    const checkProductTypeId = await fetchProductTypeById(body.productTypeId);
    if (!checkProductTypeId) return res.status(404).json({ message: `No productType found with productTypeId : ${body.productTypeId}`, product: null, status: false });
    // check unitId
    const checkUnitId = await fetchUnitById(body.unitId);
    if (!checkUnitId) return res.status(404).json({ message: `No unit found with unitId : ${body.unitId}`, product: null, status: false });
    // check name in company
    const checkName = await fetchProductByName(body.name, body.companyId, body.id);
    if (checkName) return res.status(404).json({ message: `Found information name : ${body.name} has already been used in the system.`, product: null, status: false });
    // updateProduct
    const updateProduct = await updateDataProduct(body, body.id);
    if (!updateProduct) return res.status(404).json({ message: "An error occurred saving data.", product: null, status: false });

    return res.status(200).json({ message: "Data saved successfully.", product: updateProduct, status: true });
}

export const handleDeleteProduct = async (res: NextApiResponse, id: number) => {
    const product = await fetchProductById(id);
    if (!product) return res.status(404).json({ message: `No product found with Id : ${id}`, product: null, status: false });
    const deleteProduct = await deleteDataProduct(id);
    if (!deleteProduct) return res.status(404).json({ message: "An error occurred deleting data.", product: null, status: false });

    return res.status(200).json({ message: "Successfully deleted data", product: deleteProduct, status: true });
}