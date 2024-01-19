"use server";
import { NextApiRequest, NextApiResponse } from "next";
import { handleGetOptionAddEmployee } from "./service";
import { typeNumber } from "@/utils/utils";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const { query } = req;
        // getOption By companyId
        if(query.companyId) return await handleGetOptionAddEmployee(res, typeNumber(query.companyId));

        return res.status(404).json({ message: [{message: "ไม่พบข้อมูลรหัสบริษัท"}], optionEmployee: "", status: false });
    } catch (error: unknown) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", optionEmployee: "", status: false });
    } 
};