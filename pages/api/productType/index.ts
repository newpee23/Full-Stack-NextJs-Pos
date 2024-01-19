"use server";
import { NextApiRequest, NextApiResponse } from "next";
import authenticate from "../checkToken";
import { dataVerifyProductType } from "@/types/verify";
import { handleAddProductType, handleDeleteProductType, handleGetAllProductType, handleGetProductTypeByCompanyId, handleGetProductTypeById, handleUpdateProductType } from "./service";
import { typeNumber } from "@/utils/utils";

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
    // gettProductType By Id
    if (query.id) return await handleGetProductTypeById(res, typeNumber(query.id));
    // gettProductType By companyId
    if (query.companyId) return await handleGetProductTypeByCompanyId(res, typeNumber(query.companyId));
    //  getAlltProductType
    return await handleGetAllProductType(res);
  } catch (error: unknown) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error", status: false });
  }
};

const POST = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const body: dataVerifyProductType = await req.body;
    // Verify/Add ProductType
    return await handleAddProductType(body, res);
  } catch (error: unknown) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error", status: false });
  }
};

const PUT = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const body: dataVerifyProductType = await req.body;
    // Verify/Add Company
    return await handleUpdateProductType(body, res);
  } catch (error: unknown) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error", status: false });
  }
};

const DELETE = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { query } = req;
    if (!query.id) return res.status(404).json({ message: "Please specify positionId", position: null, status: true });
    // DeletePosition By Id
    return await handleDeleteProductType(res, typeNumber(query.id));
  } catch (error: unknown) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error", status: false });
  }
};