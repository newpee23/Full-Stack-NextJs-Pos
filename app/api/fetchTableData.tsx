// api/fetchTableData.ts
import { fetchTableBranch } from '@/types/fetchData';
import axios from 'axios';
import { useQuery } from 'react-query';

export const fetchBranchData = async (token: string | undefined, company_id: number | undefined): Promise<fetchTableBranch[]> => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/branch?companyId=${company_id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.data) {
      throw new Error('Failed to fetch branch data');
    }

    const branch: fetchTableBranch[] = response.data.branch;

    return branch;
  } catch (error) {
    console.error('Error fetching branch data:', error);
    throw error;
  }
};

export const useData = (token: string | undefined, company_id: number | undefined) => {
  return useQuery('data', () => fetchBranchData(token, company_id), {
    refetchOnWindowFocus: false,
  });
};
