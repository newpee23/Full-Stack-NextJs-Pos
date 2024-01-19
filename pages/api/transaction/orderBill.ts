"use server";
import { typeNumber } from "@/utils/utils";
import { NextApiRequest, NextApiResponse } from "next";
import authenticate from "../checkToken";
import { handleGetOrderBillByBranchId } from "./service";

export default (async (req: NextApiRequest, res: NextApiResponse) => {
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
});

const GET = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const { query } = req;
        const status = query.status as "process" | "making";

        if (query.branchId && query.status) return await handleGetOrderBillByBranchId(res, typeNumber(query.branchId), status);
        
        return res.status(404).json({ message: [{ message: "เกิดข้อผิดพลาด: orderBill ไม่พบ companyId หรือ branchId" }], orderBillData: null, status: true });
    } catch (error: unknown) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", status: false });
    }
};

