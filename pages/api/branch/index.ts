import { NextApiRequest, NextApiResponse } from "next";
import authenticate from "../checkToken";
import { checkCompanyData, deleteDataBranch, getAllBranch, getBranchByCompanyId, getBranchById, getBranchByNameByCompany, insertBranch, updateDataBranch, verifyBranchBody } from "@/utils/branch";
import { dataVerifyBranch } from "@/types/verify";
import { typeNumber } from "@/utils/utils";

export const GET = async (req: NextApiRequest, res: NextApiResponse) => {
  const { query } = req;
  if (query && query.id) {

    // getBranch By Id
    const id: number = typeNumber(query.id);
    const branch = await getBranchById(id);
    if(!branch){
      res.status(401).json({ message: `GET คำขอถูกปฏิเสธ : ไม่พบข้อมูล Branch จาก Id : ${id}`, branch: null, status: false });
      return;
    }

    res.status(200).json({ message: "GET คำขอถูกต้อง", branch: branch, status: true });
  } else if(query && query.companyId){

    // getBranch By companyId
    const companyId: number = typeNumber(query.companyId); 
    const branch = await getBranchByCompanyId(companyId);
    if(!branch || branch?.length === 0){
      res.status(401).json({ message: `GET คำขอถูกปฏิเสธ : ไม่พบข้อมูล Branch จาก companyId : ${companyId}`, branch: null, status: false });
      return;
    }

    res.status(200).json({ message: "GET คำขอถูกต้อง", branch: branch, status: true });
  } else {

    // getBranch All
    const branch = await getAllBranch();
    if(branch === null || branch.length === 0){
      res.status(401).json({ message: `GET คำขอถูกปฏิเสธ : ไม่พบข้อมูล Branch ทั้งหมด`, branch: null, status: false });
      return;
    }
  
    res.status(200).json({ message: "GET คำขอถูกต้อง", branch: branch, status: true });
  }
  res.status(401).json({ message: "GET คำขอถูกปฏิเสธ : พบข้อผิดพลาด", branch: "branch", status: true });
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
};

export const PUT = async (req: NextApiRequest, res: NextApiResponse) => {
  const body: dataVerifyBranch = await req.body;
  // VerifyBranchData
  if(!body.id){
    res.status(404).json({ message: "PUT คำขอถูกปฏิเสธ", verifyBranch: `กรุณาระบุ CompanyId`, status: false });
    return;
  }

  const verifyBranch = verifyBranchBody(body);
  if (verifyBranch.length > 0) {
    res.status(404).json({ message: "POST คำขอถูกปฏิเสธ", verifyBranch: verifyBranch, status: false });
    return;
  }

  // ตรวจว่าใน DB มี ข้อมูล ชื่อสาขา หรือยัง
  const checkBranchName = await getBranchByNameByCompany(body.companyId,body.name,body.id);
  if(checkBranchName){
    res.status(404).json({ message: "PUT คำขอถูกปฏิเสธ", verifyBranch: `พบข้อมูลบริษัท : ${body.name} ถูกนำไปใช้แล้วในระบบ`, status: false });
    return;
  }
  // update Branch
  const updateBranch = await updateDataBranch(body.id,body);
  if(!updateBranch){
    res.status(404).json({ message: "PUT คำขอถูกปฏิเสธ", verifyBranch: "เกิดข้อผิดพลาดการแก้ไขข้อมูล", status: false });
    return;
  }
  
  res.status(200).json({ message: "PUT คำขอถูกต้อง", verifyBranch: body, status: true });
}

export const DELETE = async (req: NextApiRequest, res: NextApiResponse) => {
  const { query } = req;
  if(!query.id){
    res.status(401).json({ message: "DELETE คำขอถูกปฏิเสธ", verifyBranch: "กรุณาระบุ : branchId" , status: true});
    return
  }

  // แปลง param1 เป็น Int
  const id: number = typeNumber(query.id);

  // getBranch
  const branch = await getBranchById(id);
  if(!branch){
    res.status(401).json({ message: "DELETE คำขอถูกปฏิเสธ", verifyBranch: `ไม่พบข้อมูลสาขาจาก branchId : ${id}` , status: true});
    return;
  }

  // deleteBranch
  const deleteBranch = await deleteDataBranch(id);
  if(!deleteBranch){
    res.status(401).json({ message: "DELETE คำขอถูกปฏิเสธ", verifyCompany: "เกิดข้อผิดพลาดการลบข้อมูล" , status: true});
    return;
  }
  res.status(200).json({ message: "DELETE คำขอถูกต้อง", verifyBranch: deleteBranch, status: true });
}

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