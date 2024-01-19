"use server";
import { NextApiRequest, NextApiResponse } from "next";
import authenticate from "../checkToken";
import { typeNumber } from "@/utils/utils";
import { handleGetDetailReceiptByCompanyId } from "./service";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === "GET") {
        GET(req, res);
    } else if (req.method === "POST") {
        // POST(req, res);
    } else if (req.method === "PUT") {
        // PUT(req, res);
    } else if (req.method === "DELETE") {
        // DELETE(req, res);
    } else {
        res.status(405).end();
    }
};

const GET = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const { query } = req;
        // getDetailReceipt By query.companyId && query.transactionId && query.branchId
        if (query.companyId && query.transactionId && query.branchId) return await handleGetDetailReceiptByCompanyId(res, typeNumber(query.companyId), typeNumber(query.branchId), query.transactionId.toString());

        return res.status(404).json({ message: [{ message: "ไม่พบข้อมูล: companyId หรือ branchId หรือ transactionId" }], DetailReceipt: null, status: true });
    } catch (error: unknown) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", status: false });
    }
};