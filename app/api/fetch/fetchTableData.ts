// api/fetchTableData.ts
import { fetchTableBranch } from '@/types/fetchData';
import axios , {AxiosError} from 'axios';
import { useQuery } from 'react-query';

export const fetchBranchData = async (token: string | undefined, company_id: number | undefined): Promise<fetchTableBranch[]> => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/branch?companyId=${company_id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.data) {
      console.error('Failed to fetch branch data');
      return [];
    }

    const branch: fetchTableBranch[] = response.data.branch;
    return branch;
  } catch (error: unknown) {
    if(axios.AxiosError){
      // The error is an instance of AxiosError
      const axiosError = error as AxiosError;

      if(axiosError.response){
        // Server responded with a status code that falls out the range of 2xx
        console.error("Error data: ",axiosError.response.data);
        console.error("Error status: ",axiosError.response.status);
        console.error("Error headers: ",axiosError.response.headers);
      } else if(axiosError.request){
        // Request was made but no response was received
        console.error("Error request: ", axiosError.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error message: ", axiosError.message);
      }
    }else{
      // Handel non-Axios error
      console.error("Unexpected error: ", error);
    }
    return [];
  }
};

export const useDataBranch = (token: string | undefined, company_id: number | undefined) => {
  return useQuery('data', () => fetchBranchData(token, company_id), {
    refetchOnWindowFocus: false,
  });
};
