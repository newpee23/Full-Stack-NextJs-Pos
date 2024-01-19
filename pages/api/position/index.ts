"use server";
import { NextApiRequest, NextApiResponse } from "next";
import authenticate from "../checkToken";
import { typeNumber } from "@/utils/utils";
import { handleAddPosition, handleDeletePosition, handleGetAllPosition, handleGetPositionByCompanyId, handleGetPositionById, handleUpdatePosition } from "./service";
import { dataVerifyPosition } from "@/types/verify";

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
    // getPosition By Id
    if (query.id) return await handleGetPositionById(res, typeNumber(query.id));
    // getPosition By Id
    if (query.companyId) return await handleGetPositionByCompanyId(res, typeNumber(query.companyId));
    //  getAllPosition
    return await handleGetAllPosition(res);
  } catch (error: unknown) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error", status: false });
  }
};

const POST = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const body: dataVerifyPosition = await req.body;
    // Verify/Add Company
    return await handleAddPosition(body, res);
  } catch (error: unknown) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error", status: false });
  }
};

const PUT = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const body: dataVerifyPosition = await req.body;
    // Verify/Add Company
    return await handleUpdatePosition(body, res);
  } catch (error: unknown) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error", status: false });
  }
};

const DELETE = async (req: NextApiRequest, res: NextApiResponse) => {

  const { query } = req;

  try {
    if (!query.id) return res.status(404).json({ message: "Please specify positionId", position: null, status: true });
    // DeletePosition By Id
    return await handleDeletePosition(res, typeNumber(query.id));
  } catch (error: unknown) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error", status: false });
  }
};