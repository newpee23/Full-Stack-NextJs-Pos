// pages/api/user

import { NextApiRequest, NextApiResponse } from 'next';
import authenticate from '../checkToken';
import { prisma } from "@/pages/lib/prismaDB";

export default authenticate(async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    GET(req, res);
  } else if (req.method === 'POST') {
    POST(req, res);
  } else {
    res.status(405).end();
  }
});
// getUser
export async function GET(req: NextApiRequest, res: NextApiResponse) {
  const company = await prisma.company.findMany();
  res.status(200).json({ message: 'GET คำขอถูกต้อง', result : company});
}
// addUser
export async function POST(req: NextApiRequest, res: NextApiResponse) {
  // โค้ดสำหรับ HTTP POST request
  const body = await req.body;
  res.status(200).json({ message: 'POST คำขอถูกต้อง', body: body });
}


// สร้างไฟล์เช่น testApiRoute.js หรือ testApiRoute.ts

// const fetchData = async () => {
//     const token = 'YOUR_AUTH_TOKEN'; // ใส่ Token ที่ถูกต้องที่นี่
  
//     try {
//       const response = await fetch('/api/someRoute', {
//         method: 'GET',
//         headers: {
//           Authorization: token,
//         },
//       });
  
//       if (response.ok) {
//         const data = await response.json();
//         console.log('รายละเอียดจาก API:', data);
//       } else {
//         console.error('เกิดข้อผิดพลาดในการเรียก API:', response.statusText);
//       }
//     } catch (error) {
//       console.error('เกิดข้อผิดพลาดในการเรียก API:', error.message);
//     }
//   };
  
//   fetchData();
  