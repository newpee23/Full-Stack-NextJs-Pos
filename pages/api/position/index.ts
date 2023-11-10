import { NextApiRequest, NextApiResponse } from "next";
import authenticate from "../checkToken";
import { getAllPosition, getPositionByIdByCompanyId } from "@/utils/position";
import { typeNumber } from "@/utils/utils";

export const GET = async (req: NextApiRequest, res: NextApiResponse) => {
  const { query } = req;
    // getPosition By Id
  if (query && query.id) {

    const id: number = typeNumber(query.id);
    const position = await getPositionByIdByCompanyId(id, "id");
    if (!position || (Array.isArray(position) && position.length === 0)) {
      res.status(401).json({ message: `GET คำขอถูกปฏิเสธ : ไม่พบข้อมูล Position จาก Id : ${id}`, position: null, status: false });
      return;
    }

    res.status(200).json({ message: "GET คำขอถูกต้อง", position, status: true });
  } else if (query && query.companyId) {

    // getPosition By CompanyId
    const id: number = typeNumber(query.companyId);
    const position = await getPositionByIdByCompanyId(id, "companyId");
    if (!position || (Array.isArray(position) && position.length === 0)) {
      res.status(401).json({ message: `GET คำขอถูกปฏิเสธ : ไม่พบข้อมูล Position ใน companyId : ${id}`, position: null, status: false });
      return;
    }

    res.status(200).json({ message: "GET คำขอถูกต้อง", position, status: true });
  } else {

    // getPosition All
    const position = await getAllPosition();
    if (!position || position.length === 0) {
      res.status(401).json({ message: `GET คำขอถูกปฏิเสธ : ไม่พบข้อมูล Position ทั้งหมด`, position: null, status: false });
      return;
    }
    
    res.status(401).json({ message: "GET คำขอถูกปฏิเสธ : พบข้อผิดพลาด", position: position, status: true });
  }
};

export const DELETE = async (req: NextApiRequest, res: NextApiResponse) => {
  
  res.status(200).json({ message: "DELETE คำขอถูกต้อง", position: "position", status: true });
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    GET(req, res);
  } else if (req.method === "POST") {
  //   POST(req, res);
  } else if (req.method === "PUT") {
  //   PUT(req, res);
  } else if (req.method === "DELETE") {
    DELETE(req, res);
  } else {
    res.status(405).end();
  }
};


 