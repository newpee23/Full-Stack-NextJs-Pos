import { NextApiRequest, NextApiResponse } from "next";
import authenticate from "../checkToken";
import { dataVerifyCompany } from "@/types/verify";
import { checkDataCompany, deleteDataCompany, getAllCompany, getCompanyById, getCompanyByName, insertDataCompany, updateDataCompany, verifyCompanyBody } from "@/utils/company";

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

export const GET = async (req: NextApiRequest, res: NextApiResponse) => {

  if (req.query && req.query.id) {
      const param1 = req.query.id;
      const id: number = Array.isArray(param1) ? parseInt(param1[0], 10) : parseInt(param1, 10);

      // getCompany
      const company = await getCompanyById(id);
      if(!company){
        res.status(401).json({ message: `GET คำขอถูกปฏิเสธ : ไม่พบข้อมูล Company จาก Id : ${id}`, company: null, status: false });
        return;
      }

      res.status(200).json({ message: "GET คำขอถูกต้อง", company: company, status: true });
  } else {
       // getCompany All
       const company = await getAllCompany();
       if(!company){
         res.status(401).json({ message: `GET คำขอถูกปฏิเสธ : ไม่พบข้อมูล Company ทั้งหมด`, company: null, status: false });
         return;
       }
 
       res.status(200).json({ message: "GET คำขอถูกต้อง", company: company, status: true });
  }

  return;
};

export const POST = async (req: NextApiRequest, res: NextApiResponse) => {

    const body: dataVerifyCompany = await req.body;
    // VerifyCompanyData
    const verifyCompany = verifyCompanyBody(body);
    if(verifyCompany.length > 0) {
      res.status(404).json({ message: "POST คำขอถูกปฏิเสธ", verifyCompany: verifyCompany, status: false });
      return;
    }
    
    // ตรวจว่าใน DB มี ข้อมูล company หรือยัง
    const checkCompanyData = await checkDataCompany(body);
    if(checkCompanyData.length > 0){
      res.status(404).json({ message: "POST คำขอถูกปฏิเสธ", verifyCompany: checkCompanyData, status: false });
      return;
    }

    // add Company
    const addCompany = await insertDataCompany(body);
    if(!addCompany){
      res.status(404).json({ message: "POST คำขอถูกปฏิเสธ", verifyCompany: "เกิดข้อผิดพลาดการบันทึกข้อมูล", status: false});
      return;
    }
    res.status(200).json({ message: "POST คำขอถูกต้อง", verifyCompany: addCompany, status: true });
    return;
};

export const PUT = async (req: NextApiRequest, res: NextApiResponse) => {

  const body: dataVerifyCompany = await req.body;
  // VerifyCompanyData
  if(!body.id){
    res.status(404).json({ message: "PUT คำขอถูกปฏิเสธ", verifyCompany: `กรุณาระบุ CompanyId`, status: false });
    return;
  }

  const verifyCompany = verifyCompanyBody(body);
  if(verifyCompany.length > 0) {
    res.status(404).json({ message: "PUT คำขอถูกปฏิเสธ", verifyCompany: verifyCompany });
    return;
  }
  
  // ตรวจว่าใน DB มี ข้อมูล company หรือยัง
  const checkCompanyData = await getCompanyByName(body.name,body.tax,body.id);
  if(checkCompanyData){
    res.status(404).json({ message: "PUT คำขอถูกปฏิเสธ", verifyCompany: `พบข้อมูลบริษัท : ${body.name} และ ${body.tax} ถูกนำไปใช้แล้วในระบบ`, status: false });
    return;
  }

  // update Company
  const updateCompany = await updateDataCompany(body.id,body);
  if(!updateCompany){
    res.status(404).json({ message: "PUT คำขอถูกปฏิเสธ", verifyCompany: "เกิดข้อผิดพลาดการแก้ไขข้อมูล", status: false });
    return;
  }
  res.status(200).json({ message: "PUT คำขอถูกต้อง", verifyCompany: updateCompany , status: true});
  return;
};

export const DELETE = async (req: NextApiRequest, res: NextApiResponse) => {

  const param1 = req.query.id;
  if(!param1){
    res.status(401).json({ message: "DELETE คำขอถูกปฏิเสธ", verifyCompany: "กรุณาระบุ : companyId" , status: true});
    return
  }

  // แปลง param1 เป็น Int
  const id: number = Array.isArray(param1) ? parseInt(param1[0], 10) : parseInt(param1, 10);

  // getCompany
  const company = await getCompanyById(id);
  if(!company){
    res.status(401).json({ message: "DELETE คำขอถูกปฏิเสธ", verifyCompany: `ไม่พบข้อมูลบริษัทจาก companyId : ${id}` , status: true});
    return;
  }

  // deleteCompany
  const deleteCompany = await deleteDataCompany(id);
  if(!deleteCompany){
    res.status(401).json({ message: "DELETE คำขอถูกปฏิเสธ", verifyCompany: "เกิดข้อผิดพลาดการลบข้อมูล" , status: true});
    return;
  }

  res.status(200).json({ message: "DELETE คำขอถูกต้อง", verifyCompany: deleteCompany , status: true});
  return;
};

 