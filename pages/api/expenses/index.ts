"use server";
import { NextApiRequest, NextApiResponse } from "next";
import authenticate from "../checkToken";
import { typeNumber } from "@/utils/utils";
import { dataVerifyExpenses } from "@/types/verify";
import { handleAddExpenses, handleDeleteExpenses, handleGetAllExpenses, handleGetExpensesByCompanyId, handleGetExpensesById, handleUpdateExpenses } from "./service";

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
        // getExpenses By Id
        if (query.id) return await handleGetExpensesById(res, typeNumber(query.id));
        // getExpenses By companyId
        if (query.companyId) return await handleGetExpensesByCompanyId(res, typeNumber(query.companyId));
        //  getAllExpenses
        return await handleGetAllExpenses(res);
    } catch (error: unknown) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", status: false });
    }
};

const POST = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const body: dataVerifyExpenses = await req.body;
        // Verify/Add itemPromotion
        return await handleAddExpenses(body, res);
    } catch (error: unknown) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", status: false });
    }
};

const PUT = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const body: dataVerifyExpenses = await req.body;
        // Verify/Add itemPromotion
        return await handleUpdateExpenses(body, res);
    } catch (error: unknown) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", status: false });
    }
};

const DELETE = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const { query } = req;
        if (!query.id) return res.status(404).json({ message: "Please specify itemPromotionId", itemPromotion: null, status: true });
        // DeleteItemPromotion By Id
        return await handleDeleteExpenses(res, typeNumber(query.id));
    } catch (error: unknown) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", status: false });
    }
};