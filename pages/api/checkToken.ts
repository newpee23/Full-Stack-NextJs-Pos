"use server";
import { verifyToken } from "@/utils/verifyToken";
import { verifyTransactionId, verifyUserId } from "@/utils/verifyUserId";
import { NextApiRequest, NextApiResponse } from "next";

const authenticate = (handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const token = req.headers.authorization;

    if (!token) {
      res.status(404).json({ message: "Err : Invalid Token" });
      return;
    }

    // ตรวจสอบ token หมดอายุหรือไม่
    const checkToken = verifyToken(token);
    if (!checkToken) {
      res.status(404).json({ message: "Err : Token Expired" });
      return;
    }

    // ตรวจสอบยืนยัน userId
    const checkUserId = await verifyUserId(token);
    if (!checkUserId) {
      res.status(404).json({ message: "Err : Invalid User" });
      return;
    }
  
    // ทำงานถูกต้องให้ไปใช้ API ต่อ
    return await handler(req, res);
  };
};

export const authOrderTransaction = (handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const tokenOrder = req.headers.authorization;

    if (!tokenOrder) {
      return res.status(401).json({ error: "Invalid Token" });
    }

    // Check if the token has expired
    const checkToken = verifyToken(tokenOrder);
    if (!checkToken) {
      return res.status(401).json({ error: "Token Expired" });
    }

    // Check for a valid transaction ID
    const checkTransactionId = await verifyTransactionId(tokenOrder);
    if (!checkTransactionId) {
      return res.status(400).json({ error: "Invalid Transaction" });
    }

    // If everything is valid, proceed to the next middleware or route handler
    return await handler(req, res);
  };
};

export default authenticate;
