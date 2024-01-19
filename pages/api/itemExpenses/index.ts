"use server";
import { NextApiRequest, NextApiResponse } from "next";
import authenticate from "../checkToken";
import { typeNumber } from "@/utils/utils";
import { dataVerifyItemExpenses } from "@/types/verify";
import { handleAddItemExpenses, handleDeleteItemExpenses, handleGetAllItemExpenses, handleGetItemExpensesByExpensesId, handleGetItemExpensesById, handleUpdateItemExpenses } from "./service";

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
        // getItemExpenses By Id
        if (query.id) return await handleGetItemExpensesById(res, typeNumber(query.id));
        // getItemExpenses By expensesId
        if (query.expensesId) return await handleGetItemExpensesByExpensesId(res, typeNumber(query.expensesId));
        //  getAllItemExpenses
        return await handleGetAllItemExpenses(res);
    } catch (error: unknown) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", status: false });
    }
};

const POST = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const body: dataVerifyItemExpenses = await req.body;
        // Verify/Add itemPromotion
        return await handleAddItemExpenses(body, res);
    } catch (error: unknown) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", status: false });
    }
};

const PUT = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const body: dataVerifyItemExpenses = await req.body;
        // Verify/Add itemPromotion
        return await handleUpdateItemExpenses(body, res);
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
        return await handleDeleteItemExpenses(res, typeNumber(query.id));
    } catch (error: unknown) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", status: false });
    }
};