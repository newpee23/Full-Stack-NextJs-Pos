import { prisma } from "@/pages/lib/prismaDB";

export const fetchDetailReceiptByCompanyId = async (companyId: number) => {
    try {
        
     
    } catch (error) {
        // Handle any errors here or log them
        console.error('Error fetching itemPromotion:', error);
        return null;
    } finally {
        await prisma.$disconnect();
    }
}