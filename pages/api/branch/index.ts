import { NextApiRequest, NextApiResponse } from "next";
import authenticate from "../checkToken";
import { checkCompanyData, insertBranch, verifybranchBody } from "@/utils/branch";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    //   GET(req, res);
  } else if (req.method === "POST") {
    POST(req, res);
  } else if (req.method === "PUT") {
    //   PUT(req, res);
  } else if (req.method === "DELETE") {
    //   DELETE(req, res);
  } else {
    res.status(405).end();
  }
};

export const POST = async (req: NextApiRequest, res: NextApiResponse) => {

  const body = await req.body;
  // VerifyCompanyData
  const verifyCompany = verifybranchBody(body);
  if (verifyCompany.length > 0) {
    res.status(404).json({ message: "POST คำขอถูกปฏิเสธ", verifyCompany: verifyCompany, status: false });
    return;
  }

  // ตรวจว่ามีข้อมูล companyId และ name ในระบบมั้ย
  const checkCompanyName = await checkCompanyData(body.companyId, body.name);
  if(checkCompanyName.length > 0){
    res.status(404).json({ message: "POST คำขอถูกปฏิเสธ", verifyCompany: checkCompanyName, status: false });
    return;
  }

  // addBranch
  const addCompany = await insertBranch(body);
    if(!addCompany){
      res.status(404).json({ message: "POST คำขอถูกปฏิเสธ", verifyCompany: "เกิดข้อผิดพลาดการบันทึกข้อมูล", status: false});
      return;
    }
    res.status(200).json({ message: "POST คำขอถูกต้อง", verifyCompany: addCompany, status: true });
    return;
};