import { verifyToken } from "@/utils/verifyToken";
import { verifyUserId } from "@/utils/verifyUserId";
import { NextApiRequest, NextApiResponse } from "next";

const authenticate = (handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const token = req.headers.authorization;

    if (!token) {
      res.status(401).json({ message: "Err : Invalid Token" });
      return;
    }

    // ตรวจสอบ token หมดอายุหรือไม่
    const checkToken = verifyToken(token);
    if (!checkToken) {
      res.status(401).json({ message: "Err : Token Expired" });
      return;
    }

    // ตรวจสอบยืนยัน userId
    const checkUserId = await verifyUserId(token);
    if (!checkUserId) {
      res.status(401).json({ message: "Err : Invalid User" });
      return;
    }
  
    // ทำงานถูกต้องให้ไปใช้ API ต่อ
    return await handler(req, res);
  };
};

export default authenticate;
