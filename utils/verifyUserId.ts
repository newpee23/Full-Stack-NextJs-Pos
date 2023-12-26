import { prisma } from "@/pages/lib/prismaDB";
import { getDataToken } from "./verifyToken";
import { compare, hash } from 'bcrypt';

export const verifyUserId = async (token: string): Promise<boolean> => {

  if (!token) return false;
  const tokenData = getDataToken(token);
  if (!tokenData) return false;

  //   check user
  try {
    const user = await prisma.employee.findUnique({
      where: {
        userName: tokenData.username,
      },
    });

    if (!user) return false;
  } catch (error) {
    return false;
  } finally {
    await prisma.$disconnect();
  }

  return true;
};

export const verifyTransactionId = async (token: string): Promise<boolean> => {
  // check transaction
  try {
    if (!token) return false;

    const tokenData = getDataToken(token);
    if (!tokenData) return false;
    
    const transaction = await prisma.transaction.findUnique({
      where: {
        id: tokenData.id,
      },
    });

    if (!transaction) return false;
  } catch (error) {
    return false;
  } finally {
    await prisma.$disconnect();
  }

  return true;
};

export const hashPassword = async (password: string): Promise<string> => {
  // เข้ารหัสรหัสผ่าน
  const hashedPassword = await hash(password, 10);
  return hashedPassword;
}

export const comparePassword = async (password: string, passWordDb: string): Promise<boolean> => {
  // เข้ารหัสรหัสผ่าน
  const hashedPassword = await hash(password, 10);
  // เทียบรหัสผ่าน
  const isMatch = await compare(hashedPassword, passWordDb);
  return isMatch;
}