import { typeNumber } from "@/utils/utils";
import { NextApiRequest, NextApiResponse } from "next";
import { handleGetTransactionByBranchId } from "./service";

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
        // getTable By Id
        // if (query.id) return await handleGetTableById(res, query.id.toString());
        // getTable By companyId
        if (query.branchId) return await handleGetTransactionByBranchId(res, typeNumber(query.branchId));
        // getTable By companyId
        // if (query.companyId) return await handleGetTableByCompanyId(res, typeNumber(query.companyId));
        //  getAllTable
        // return await handleGetAllTable(res);
    } catch (error: unknown) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", status: false });
    }
};