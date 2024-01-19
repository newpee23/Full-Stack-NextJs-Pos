"use server";
import { NextApiRequest, NextApiResponse } from "next";
import { authOrderTransaction } from "../checkToken";
import { handleGetOrderTotalBill } from "./service";

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
        // getData By id
        if(query.id) return await handleGetOrderTotalBill(query.id.toString(), res);

        return res.status(500).json({ message: [ {message :"ไม่พอข้อมูล tokenOrder"} ], status: false });
    } catch (error: unknown) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", status: false });
    }
};