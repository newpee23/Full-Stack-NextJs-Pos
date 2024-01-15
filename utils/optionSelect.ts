import { prisma } from "@/pages/lib/prismaDB";
import { fetchOptionAddEmployeeType, fetchOptionAddExpensesItem, fetchOptionAddProduct, fetchOptionAddPromotionItem, fetchOptionAddTables, fetchProduct, optionIdName, optionSelect } from "@/types/fetchData";

const fetchPositions = async (companyId: number): Promise<optionSelect[]> => {
    try {
        const positions = await prisma.position.findMany({
            where: {
                companyId: companyId,
                status: "Active"
            },
            orderBy: { id: 'asc' },
        });

        return positions.map((item) => ({
            value: item.id,
            label: item.name,
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

        return branches.map((item) => ({
            value: item.id,
            label: item.name,
        }));
    } catch (error) {
        console.error('Error fetching branches:', error);
        return [];
    }
};

const fetchProducts = async (companyId: number): Promise<optionSelect[]> => {
    try {
        const products = await prisma.product.findMany({
            where: {
                companyId: companyId,
                status: "Active"
            },
            orderBy: { id: 'asc' },
        });

        return products.map((item) => ({
            value: item.id,
            label: item.name,
        }));
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
};

const fetchBranchs = async (companyId: number): Promise<optionSelect[]> => {
    try {
        const branchs = await prisma.branch.findMany({
            where: {
                companyId: companyId,
                status: "Active"
            },
            orderBy: { id: 'asc' },
        });

        return branchs.map((item) => ({
            value: item.id,
            label: item.name,
        }));
    } catch (error) {
        console.error('Error fetching branchs:', error);
        return [];
    }
};

const fetchPromotions = async (companyId: number): Promise<optionSelect[]> => {
    try {
        const promotions = await prisma.promotion.findMany({
            where: {
                companyId: companyId,
                status: "Active"
            },
            orderBy: { id: 'asc' },
        });

        return promotions.map((item) => ({
            value: item.id,
            label: item.name,
        }));
    } catch (error) {
        console.error('Error fetching promotions:', error);
        return [];
    }
};

const fetchUnits = async (companyId: number): Promise<optionSelect[]> => {
    try {
        const units = await prisma.unit.findMany({
            where: {
                companyId: companyId,
                status: "Active"
            },
            orderBy: { id: 'asc' },
        });

        return units.map((item) => ({
            value: item.id,
            label: item.name,
        }));
    } catch (error) {
        console.error('Error fetching branches:', error);
        return [];
    }
};

const fetchExpenses = async (companyId: number): Promise<optionSelect[]> => {
    try {
        const units = await prisma.expenses.findMany({
            where: {
                companyId: companyId,
                status: "Active"
            },
            orderBy: { id: 'asc' },
        });

        return units.map((item) => ({
            value: item.id,
            label: item.name,
        }));
    } catch (error) {
        console.error('Error fetching branches:', error);
        return [];
    }
};

const fetchProductType = async (companyId: number): Promise<optionSelect[]> => {
    try {
        const productType = await prisma.productType.findMany({
            where: {
                companyId: companyId,
                status: "Active"
            },
            orderBy: { id: 'asc' },
        });

        return productType.map((item) => ({
            value: item.id,
            label: item.name,
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

export const fetchOptionProduct = async (companyId: number): Promise<fetchOptionAddProduct> => {
    try {
        const unitOptions = await fetchUnits(companyId);
        const productTypeOptions = await fetchProductType(companyId);
        return { unit: unitOptions, productType: productTypeOptions };
    } catch (error) {
        console.error('Error fetching optionAddTables:', error);
        return { unit: [], productType: [] };
    } finally {
        await prisma.$disconnect();
    }
};

export const fetchOptionExpensesItem = async (companyId: number): Promise<fetchOptionAddExpensesItem> => {
    try {
        const expensesOptions = await fetchExpenses(companyId);

        return { expenses: expensesOptions };
    } catch (error) {
        console.error('Error fetching optionAddTables:', error);
        return { expenses: [] };
    } finally {
        await prisma.$disconnect();
    }
};

export const fetchOptionPromotionItem = async (companyId: number): Promise<fetchOptionAddPromotionItem> => {
    try {
        const products = await fetchProducts(companyId);
        const promotions = await fetchPromotions(companyId);

        return { product: products, promotion: promotions };
    } catch (error) {
        console.error('Error fetching optionAddTables:', error);
        return { product: [], promotion: [] };
    } finally {
        await prisma.$disconnect();
    }
};

export const fetchOptionBranch = async (companyId: number): Promise<optionSelect[]> => {
    try {
        const branchs = await fetchBranchs(companyId);

        return branchs;
    } catch (error) {
        console.error('Error fetching optionAddTables:', error);
        return [];
    } finally {
        await prisma.$disconnect();
    }
};