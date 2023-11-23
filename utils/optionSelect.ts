import { prisma } from "@/pages/lib/prismaDB";
import { fetchOptionAddEmployeeType, fetchOptionAddTables, optionSelect } from "@/types/fetchData";

const fetchPositions = async (companyId: number): Promise<optionSelect[]> => {
    try {
        const positions = await prisma.position.findMany({
            where: {
                companyId: companyId,
                status: "Active"
            },
            orderBy: { id: 'asc' },
        });

        return positions.map((position) => ({
            value: position.id,
            label: position.name,
        }));
    } catch (error) {
        console.error('Error fetching positions:', error);
        return [];
    }
};

const fetchBranches = async (companyId: number): Promise<optionSelect[]> => {
    try {
        const branches = await prisma.branch.findMany({
            where: {
                companyId: companyId,
                status: "Active"
            },
            orderBy: { id: 'asc' },
        });

        return branches.map((branch: any) => ({
            value: branch.id,
            label: branch.name,
        }));
    } catch (error) {
        console.error('Error fetching branches:', error);
        return [];
    }
};

export const fetchOptionAddEmployee = async (companyId: number): Promise<fetchOptionAddEmployeeType> => {
    try {
        const positionOptions = await fetchPositions(companyId);
        const branchOptions = await fetchBranches(companyId);

        return { position: positionOptions, branch: branchOptions };
    } catch (error) {
        console.error('Error fetching optionAddEmployee:', error);
        return { position: [], branch: [] };
    } finally {
        await prisma.$disconnect();
    }
};

export const fetchOptionTables = async (companyId: number): Promise<fetchOptionAddTables> => {
    try {
        const branchOptions = await fetchBranches(companyId);

        return { branch: branchOptions };
    } catch (error) {
        console.error('Error fetching optionAddTables:', error);
        return { branch: [] };
    } finally {
        await prisma.$disconnect();
    }
};
