import { prisma } from "@/pages/lib/prismaDB";
import { fetchOptionAddEmployeeType, optionSelect } from "@/types/fetchData";

export const fetchOptionAddEmployee = async (companyId: number): Promise<fetchOptionAddEmployeeType> => {
    try {
        // option positions
        const positions = await prisma.position.findMany({
            where: {
                companyId: companyId,
                status: "Active"
            },
            orderBy: { id: 'asc', },
        });
        // Transform data to fit the Option interface
        const positionOptions: optionSelect[] = positions.map((position) => ({
            value: position.id,
            label: position.name,
        }));
        // option branchs
        const branches = await prisma.branch.findMany({
            where: {
                companyId: companyId,
                status: "Active"
            },
            orderBy: { id: 'asc', },
        });

        const branchOptions: optionSelect[] = branches.map((branch: any) => ({
            value: branch.id,
            label: branch.name,
        }));

        return { position: positionOptions, branch: branchOptions };
    } catch (error) {
        // Handle any errors here or log them
        console.error('Error fetching optionAddEmployee:', error);
        return { position: [], branch: [] };
    } finally {
        await prisma.$disconnect();
    }
};