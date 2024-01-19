"use server";

import { NextApiRequest, NextApiResponse } from "next";
import authenticate from "../checkToken";
import { dataVerifyBranch } from "@/types/verify";
import { typeNumber } from "@/utils/utils";
import { handleAddBranch, handleDeleteBarnch, handleGetAllBranch, handleGetBranchByCompanyId, handleGetBranchById, handleUpdateBranch } from "./service";

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
    // getBranch By Id
    if (query.id) return await handleGetBranchById(res, typeNumber(query.id));
    // getBranch By companyId
    if (query.companyId) return await handleGetBranchByCompanyId(res, typeNumber(query.companyId));
    //  getAllBranch
    return await handleGetAllBranch(res);
  } catch (error: unknown) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error", status: false });
  }
};

const POST = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const body: dataVerifyBranch = await req.body;
    // Verify/Add Company
    return await handleAddBranch(body, res);
  } catch (error: unknown) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error", status: false });
  }
};

const PUT = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const body: dataVerifyBranch = await req.body;
    // Verify/Add Company
    return await handleUpdateBranch(body, res);
  } catch (error: unknown) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error", status: false });
  }
}

const DELETE = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    // Verify/Delete Branch
    return await handleDeleteBarnch(req, res);
  } catch (error: unknown) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error", status: false });
  }
}