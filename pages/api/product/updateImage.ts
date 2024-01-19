"use server";
import { dataUpdateImg } from "@/types/verify";
import { NextApiRequest, NextApiResponse } from "next";
import { handleUpdateImage } from "./service";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const body: dataUpdateImg = await req.body;

        return await handleUpdateImage(body, res);
    } catch (error: unknown) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", optionEmployee: "", status: false });
    }
};