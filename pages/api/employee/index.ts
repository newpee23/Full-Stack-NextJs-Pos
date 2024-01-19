"use server";
import { NextApiRequest, NextApiResponse } from "next";
import authenticate from "../checkToken";
import { dataVerifyEmployee } from "@/types/verify";
import { handleAddEmployee, handleDeleteEmployee, handleGetAllEmployee, handleGetEmployeeByCompanyId, handleGetEmployeeById, handleUpdateEmployee } from "./service";
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
    // getEmployee By Id
    if (query.id)  return await handleGetEmployeeById(res, typeNumber(query.id));
    // getEmployee By Id
    if (query.companyId) return await handleGetEmployeeByCompanyId(res, typeNumber(query.companyId));
    //  getAllEmployee
    return await handleGetAllEmployee(res);
  } catch (error: unknown) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error", status: false });
  }
};

const POST = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const body: dataVerifyEmployee = await req.body;
    // Verify/Add Company
    return await handleAddEmployee(body, res);
  } catch (error: unknown) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error", status: false });
  }
};

const PUT = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const body: dataVerifyEmployee = await req.body;
    // Verify/Add Company
    return await handleUpdateEmployee(body, res);
  } catch (error: unknown) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error", status: false });
  }
};

const DELETE = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    // DeletePosition By Id
    return await handleDeleteEmployee(req, res);
  } catch (error: unknown) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error",status: false });
  }
};