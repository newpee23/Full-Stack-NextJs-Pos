"use server";
import { NextApiRequest, NextApiResponse } from "next";
import authenticate from "../checkToken";
import { typeNumber } from "@/utils/utils";
import { dataVerifyTable } from "@/types/verify";
import { handleAddTable, handleDeleteTable, handleGetAllTable, handleGetTableByBranchId, handleGetTableByCompanyId, handleGetTableById, handleUpdateTable } from "./service";

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
        // getTable By Id
        if (query.id) return await handleGetTableById(res, query.id.toString());
        // getTable By companyId
        if (query.branchId) return await handleGetTableByBranchId(res, typeNumber(query.branchId));
        // getTable By companyId
        if (query.companyId) return await handleGetTableByCompanyId(res, typeNumber(query.companyId));
        //  getAllTable
        return await handleGetAllTable(res);
    } catch (error: unknown) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", status: false });
    }
};

const POST = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const body: dataVerifyTable = await req.body;
        // Verify/Add Table
        return await handleAddTable(body, res);
    } catch (error: unknown) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", status: false });
    }
};

const PUT = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const body: dataVerifyTable = await req.body;
        // Verify/Add Promotion
        return await handleUpdateTable(body, res);
    } catch (error: unknown) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", status: false });
    }
};

const DELETE = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const { query } = req;
        if (!query.id) return res.status(404).json({ message: "Please specify tablesId", tables: null, status: true });
        // DeletePromotion By Id
        return await handleDeleteTable(res, query.id.toString());
    } catch (error: unknown) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", status: false });
    }
};