import { prisma } from "@/pages/lib/prismaDB";
import { getDataToken } from "./verifyToken";

export const verifyUserId = async (token: string): Promise<boolean> => {

  if (!token) {
    return false;
  }

  const tokenData = getDataToken(token);
  //   check user
  const user = await prisma.employee.findUnique({
    where: {
      userName: tokenData.username,
    },
  });

  if (!user) {
    return false;
  }
  return true;
};
