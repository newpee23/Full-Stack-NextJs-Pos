"use server";
import { NextApiRequest, NextApiResponse } from "next";
import authenticate from "../checkToken";
import { dataVerifyCompany } from "@/types/verify";
import { typeNumber } from "@/utils/utils";
import { handleAddCompany, handleDeleteCompany, handleGetAllCompany, handleGetCompanyById, handleUpdateCompany } from "./service";

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
  const { query } = req;
  try {
    // getCompany By Id
    if (query.id) return await handleGetCompanyById(res, typeNumber(query.id));
    //  getAllCompany
    return await handleGetAllCompany(res);
  } catch (error: unknown) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error", status: false });
  }
};

const POST = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const body: dataVerifyCompany = await req.body;
    // Verify/Add Company
    return await handleAddCompany(body, res);
  } catch (error: unknown) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error", status: false });
  }
};

const PUT = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const body: dataVerifyCompany = await req.body;
    // Verify/Update Company
    return await handleUpdateCompany(body, res);
  } catch (error: unknown) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error", status: false });
  }
};

const DELETE = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    // Verify/Delete Company
    return await handleDeleteCompany(req, res);
  } catch (error: unknown) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error", status: false });
  }
};