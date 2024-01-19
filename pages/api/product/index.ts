"use server";
import { NextApiRequest, NextApiResponse } from "next";
import authenticate from "../checkToken";
import { typeNumber } from "@/utils/utils";
import { dataVerifyProduct } from "@/types/verify";
import { handleAddProduct, handleDeleteProduct, handleGetAllProduct, handleGetProductByCompanyId, handleGetProductById, handleUpdateProduct } from "./service";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    GET(req, res);
  } else if (req.method === "POST") {
    POST(req, res);
  } else if (req.method === "PUT") {
    PUT(req, res);
  } else if (req.method === "DELETE") {
    DELETE(req, res);
  } else {
    res.status(405).end();
  }
};

const GET = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { query } = req;
    // gettProduct By Id
    if (query.id) return await handleGetProductById(res, typeNumber(query.id));
    // gettProduct By companyId
    if (query.companyId) return await handleGetProductByCompanyId(res, typeNumber(query.companyId));
    //  getAlltProduct
    return await handleGetAllProduct(res);
  } catch (error: unknown) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error", status: false });
  }
};

const POST = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const body: dataVerifyProduct = await req.body;
 
    // Verify/Add Product
    return await handleAddProduct(body, res);
  } catch (error: unknown) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error", status: false });
  }
};

const PUT = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const body: dataVerifyProduct = await req.body;
    // Verify/Add Company
    return await handleUpdateProduct(body, res);
  } catch (error: unknown) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error", status: false });
  }
};

const DELETE = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { query } = req;
    if (!query.id) return res.status(404).json({ message: "Please specify productId", product: null, status: true });
    // DeletePosition By Id
    return await handleDeleteProduct(res, typeNumber(query.id));
  } catch (error: unknown) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error", status: false });
  }
};