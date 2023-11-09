import { NextApiRequest, NextApiResponse } from "next";
import authenticate from "../checkToken";
import { checkCompanyData, getAllBranch, insertBranch, verifyBranchBody } from "@/utils/branch";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
      GET(req, res);
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

export const GET = async (req: NextApiRequest, res: NextApiResponse) => {

  if (req.query && req.query.id) {
      const param1 = req.query.id;
      const id: number = Array.isArray(param1) ? parseInt(param1[0], 10) : parseInt(param1, 10);

      // getBranch
    
  } else {
        // getBranch All
        const branch = await getAllBranch();
        if(branch === null || branch.length === 0){
          res.status(401).json({ message: `GET คำขอถูกปฏิเสธ : ไม่พบข้อมูล Branch ทั้งหมด`, branch: null, status: false });
          return;
        }
  
        res.status(200).json({ message: "GET คำขอถูกต้อง", branch: branch, status: true });
  }
  return;
};

export const POST = async (req: NextApiRequest, res: NextApiResponse) => {

  const body = await req.body;
  // VerifyCompanyData
  const verifyCompany = verifyBranchBody(body);
  if (verifyCompany.length > 0) {
    res.status(404).json({ message: "POST คำขอถูกปฏิเสธ", verifyBranch: verifyCompany, status: false });
    return;
  }

  // ตรวจว่ามีข้อมูล companyId และ name ในระบบมั้ย
  const checkCompanyName = await checkCompanyData(body.companyId, body.name);
  if(checkCompanyName.length > 0){
    res.status(404).json({ message: "POST คำขอถูกปฏิเสธ", verifyBranch: checkCompanyName, status: false });
    return;
  }

  // addBranch
  const addBranch = await insertBranch(body);
    if(!addBranch){
      res.status(404).json({ message: "POST คำขอถูกปฏิเสธ", verifyBranch: "เกิดข้อผิดพลาดการบันทึกข้อมูล", status: false});
      return;
    }
    res.status(200).json({ message: "POST คำขอถูกต้อง", verifyBranch: addBranch, status: true });
    return;
};