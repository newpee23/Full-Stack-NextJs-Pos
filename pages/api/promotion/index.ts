"use server";
import { NextApiRequest, NextApiResponse } from "next";
import authenticate from "../checkToken";
import { typeNumber } from "@/utils/utils";
import { dataVerifyPromotion } from "@/types/verify";
import { handleAddPromotion, handleDeletePromotion, handleGetAllPromotion, handleGetPromotionByCompanyId, handleGetPromotionById, handleUpdatePromotion } from "./service";

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
        // getPromotion By Id
        if (query.id) return await handleGetPromotionById(res, typeNumber(query.id));
        // getPromotion By companyId
        if (query.companyId) return await handleGetPromotionByCompanyId(res, typeNumber(query.companyId));
        //  getAllPromotion
        return await handleGetAllPromotion(res);
    } catch (error: unknown) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", status: false });
    }
};

const POST = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const body: dataVerifyPromotion = await req.body;
        // Verify/Add Promotion
        return await handleAddPromotion(body, res);
    } catch (error: unknown) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", status: false });
    }
};

const PUT = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const body: dataVerifyPromotion = await req.body;
        // Verify/Add Promotion
        return await handleUpdatePromotion(body, res);
    } catch (error: unknown) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", status: false });
    }
};

const DELETE = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const { query } = req;
        if (!query.id) return res.status(404).json({ message: "Please specify promotionId", promotion: null, status: true });
        // DeletePromotion By Id
        return await handleDeletePromotion(res, typeNumber(query.id));
    } catch (error: unknown) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", status: false });
    }
};