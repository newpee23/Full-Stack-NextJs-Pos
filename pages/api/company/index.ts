import { NextApiRequest, NextApiResponse } from "next";
import authenticate from "../checkToken";
import { dataVerifyCompany } from "@/types/verify";
import { verifyCompanyBody } from "@/utils/verifyCompany";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === "GET") {
      //   GET(req, res);
    } else if (req.method === "POST") {
      POST(req, res);
    } else {
      res.status(405).end();
    }
}


// addCompany
export const POST = async (req: NextApiRequest, res: NextApiResponse) => {

    const body: dataVerifyCompany = await req.body;
    // VerifyCompanyData
    const verifyCompany = verifyCompanyBody(body);
    if(verifyCompany.length > 0) {
        res.status(401).json({ message: "POST คำขอถูกปฏิเสธ", verifyCompany: verifyCompany });
    }
    
    res.status(200).json({ message: "POST คำขอถูกต้อง", verifyCompany: verifyCompany });
};
