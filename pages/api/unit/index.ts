import { NextApiRequest, NextApiResponse } from "next";
import authenticate from "../checkToken";
import { dataVerifyUnit } from "@/types/verify";
import { handleAddUnit, handleDeleteUnit, handleGetAllUnit, handleGetUnitByCompanyId, handleGetUnitById, handleUpdateUnit } from "./service";
import { typeNumber } from "@/utils/utils";

export default authenticate(async (req: NextApiRequest, res: NextApiResponse) => {
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
});

const GET = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const { query } = req;
        // getUnit By Id
        if (query.id) return await handleGetUnitById(res, typeNumber(query.id));
        // getUnit By companyId
        if (query.companyId) return await handleGetUnitByCompanyId(res, typeNumber(query.companyId));
        //  getAllUnit
        return await handleGetAllUnit(res);
    } catch (error: unknown) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", status: false });
    }
};

const POST = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const body: dataVerifyUnit = await req.body;
        // Verify/Add Unit
        return await handleAddUnit(body, res);
    } catch (error: unknown) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", status: false });
    }
};

const PUT = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const body: dataVerifyUnit = await req.body;
        // Verify/Add Unit
        return await handleUpdateUnit(body, res);
    } catch (error: unknown) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", status: false });
    }
};

const DELETE = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const { query } = req;
        if (!query.id || isNaN(Number(query.id))) return res.status(404).json({ message: "Please specify unitId.", unit: null, status: false });
        // Verify/Delete Unit
        return await handleDeleteUnit(res, typeNumber(query.id));
    } catch (error: unknown) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", status: false });
    }
};