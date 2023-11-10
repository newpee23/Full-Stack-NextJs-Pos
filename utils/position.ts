import { prisma } from "@/pages/lib/prismaDB";
import { fetchPosition } from "@/types/fetchData";
import { dataVerifyPosition, promiseDataVerify } from "@/types/verify";

const pushData = (message: string) => {
    return { message };
};

export const verifyCompanyBody = (data: dataVerifyPosition): promiseDataVerify[] => {
    const verifyStatus: promiseDataVerify[] = [];


    // Return
    return verifyStatus;
  };

export const getAllPosition = async (): Promise<fetchPosition[] | null> => {
    try {
      const position = await prisma.position.findMany();
  
      if (!position) {
        return null;
      }
  
      return position as fetchPosition[];
    } catch (error) {
      // Handle any errors here or log them
      console.error('Error fetching position:', error);
      return null;
    } finally {
      await prisma.$disconnect();
    }
};

export const getPositionByIdByCompanyId = async (id: number,fetchColumn: string): Promise<fetchPosition | fetchPosition[] | null> => {
    try {
        //  Where Id
        if(fetchColumn === "id"){
            const position = await prisma.position.findUnique({
                where: {
                    id: id
                }
            });
  
            if (!position) {
              return null;
            }
        
            return position as fetchPosition;
        }

        // Where CompanyId
        const position = await prisma.position.findMany({
            where: {
                companyId: id
            }
        });

        if (!position) {
          return null;
        }
    
        return position as fetchPosition[];
     
    } catch (error) {
      // Handle any errors here or log them
      console.error('Error fetching position:', error);
      return null;
    } finally {
      await prisma.$disconnect();
    }
};