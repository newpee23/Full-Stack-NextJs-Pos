"use server";
import { NextApiRequest, NextApiResponse } from "next";
import { handleAddOrderBill, handleGetCustomerFrontDataById } from "./service";
import { authOrderTransaction } from "../checkToken";
import { myStateCartItem } from "@/app/store/slices/cartSlice";

export default (async (req: NextApiRequest, res: NextApiResponse) => {

    if (req.method === "GET") {
        GET(req, res);
    } else if (req.method === "POST") {
        POST(req, res);
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
        // getData By tokenOrder
        if(query.tokenOrder) return await handleGetCustomerFrontDataById(res, query.tokenOrder.toString());

        return res.status(500).json({ message: [ {message :"ไม่พอข้อมูล tokenOrder"} ], status: false });
    } catch (error: unknown) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", status: false });
    }
};

const POST = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const body: myStateCartItem = await req.body;
        // Verify/Add Table
        return await handleAddOrderBill(body, res);
    } catch (error: unknown) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", status: false });
    }
};