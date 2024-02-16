import { typeNumber } from "@/utils/utils";
import { NextApiRequest, NextApiResponse } from "next";
import { handleAddTransaction, handleCloseTransaction, handleGetTransactionAll, handleGetTransactionByBranchId, handleGetTransactionByCompanyId, handleGetTransactionById } from "./service";
import { dataVerifyTransaction } from "@/types/verify";
import authenticate from "../checkToken";

export default authenticate(async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === "GET") {
        GET(req, res);
    } else if (req.method === "POST") {
        POST(req, res);
    } else if (req.method === "PUT") {
        PUT(req, res);
    } else if (req.method === "DELETE") {
        // DELETE(req, res);
    } else {
        res.status(405).end();
    }
});

const GET = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const { query } = req;
        // getTable By Id
        if (query.id) return await handleGetTransactionById(res, query.id.toString());
        // getTable By companyId
        if (query.branchId) return await handleGetTransactionByBranchId(res, typeNumber(query.branchId));
        // getTable By companyId
        if (query.companyId) return await handleGetTransactionByCompanyId(res, typeNumber(query.companyId));
        //  getAllTable
        return await handleGetTransactionAll(res);
    } catch (error: unknown) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", status: false });
    }
};

const POST = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const body: dataVerifyTransaction = await req.body;
        // Verify/Add Table
        return await handleAddTransaction(body, res);
    } catch (error: unknown) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", status: false });
    }
};

const PUT = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const body: {id: string} = await req.body;
        // Verify/Add Transaction
        return await handleCloseTransaction(body.id, res);
    } catch (error: unknown) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", status: false });
    }
};
