"use server";
import { NextApiRequest, NextApiResponse } from "next";
import authenticate from "../checkToken";
import { typeNumber } from "@/utils/utils";
import { dataVerifyItemPromotion } from "@/types/verify";
import { handleAddItemPromotion, handleDeleteItemPromotion, handleGetAllItemPromotion, handleGetItemPromotionByCompanyId, handleGetItemPromotionById, handleGetItemPromotionByPromotionId, handleUpdateItemPromotion } from "./service";

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
        // getItemPromotion By Id
        if (query.id) return await handleGetItemPromotionById(res, typeNumber(query.id));
        // getItemPromotion By PromotionId
        if (query.promotionId) return await handleGetItemPromotionByPromotionId(res, typeNumber(query.promotionId));
        // getItemPromotion By companyId
        if (query.companyId) return await handleGetItemPromotionByCompanyId(res, typeNumber(query.companyId));
        //  getAllItemPromotion
        return await handleGetAllItemPromotion(res);
    } catch (error: unknown) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", status: false });
    }
};

const POST = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const body: dataVerifyItemPromotion[] = await req.body;
        // Verify/Add itemPromotion
        return await handleAddItemPromotion(body, res);
    } catch (error: unknown) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", status: false });
    }
};

const PUT = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        // Verify/Add itemPromotion
        return await handleUpdateItemPromotion(req.body, res);
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
        return await handleDeleteItemPromotion(res, typeNumber(query.id));
    } catch (error: unknown) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", status: false });
    }
};