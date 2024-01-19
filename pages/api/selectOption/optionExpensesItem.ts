"use server";
import { NextApiRequest, NextApiResponse } from "next";
import { typeNumber } from "@/utils/utils";
import { handleGetOptionExpensesItem } from "./service";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const { query } = req;
        // getOption By companyId
        if(query.companyId) return await handleGetOptionExpensesItem(res, typeNumber(query.companyId));

        return res.status(404).json({ message: [{message: "ไม่พบข้อมูลรหัสบริษัท"}], optionExpenses: "", status: false });
    } catch (error: unknown) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", optionExpenses: "", status: false });
    } 
};