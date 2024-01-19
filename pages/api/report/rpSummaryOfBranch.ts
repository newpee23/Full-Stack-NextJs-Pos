"use server";
import { NextApiRequest, NextApiResponse } from "next";
import { handleGetRpSummaryOfBranch } from "./service";
import { dateFetchReport } from "@/types/fetchData";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === "GET") {
        // GET(req, res);
    } else if (req.method === "POST") {
        POST(req, res);
    } else if (req.method === "PUT") {
        // PUT(req, res);
    } else if (req.method === "DELETE") {
        // DELETE(req, res);
    } else {
        res.status(405).end();
    }
};


const POST = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const body: dateFetchReport = await req.body;
        // getDataSummaryOfBranch
        return await handleGetRpSummaryOfBranch(res, body);

    } catch (error: unknown) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", optionEmployee: "", status: false });
    } 
};