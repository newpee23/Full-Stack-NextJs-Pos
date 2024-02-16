import { NextApiRequest, NextApiResponse } from "next";
import { handleGetOptionCompany } from "./service";
import authenticate from "../checkToken";

export default authenticate(async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        return await handleGetOptionCompany(res);

    } catch (error: unknown) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", optionEmployee: "", status: false });
    } 
});