// api/fetchTableData.ts
import { fetchTableBranch } from '@/types/fetchData';
import { dataVerifyBranch } from '@/types/verify';
import axios, { AxiosError } from 'axios';
import { useMutation, useQuery } from 'react-query';

interface addBranchType {
   message: { message: string }[] | string
   , branch: null
   , status: boolean 
}

const fetchBranchData = async (token: string | undefined, company_id: number | undefined): Promise<fetchTableBranch[]> => {
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
    if (axios.AxiosError) {
      // The error is an instance of AxiosError
      const axiosError = error as AxiosError;

      if (axiosError.response) {
        // Server responded with a status code that falls out the range of 2xx
        console.error("Error data: ", axiosError.response.data);
        console.error("Error status: ", axiosError.response.status);
        console.error("Error headers: ", axiosError.response.headers);
      } else if (axiosError.request) {
        // Request was made but no response was received
        console.error("Error request: ", axiosError.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error message: ", axiosError.message);
      }
    } else {
      // Handel non-Axios error
      console.error("Unexpected error: ", error);
    }
    return [];
  }
};

const deleteBranch = async (token: string | undefined, itemId: string): Promise<fetchTableBranch | null> => {
  try {
    const response = await axios.delete(
      `${process.env.NEXT_PUBLIC_BASE_URL}/branch?id=${itemId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.data) {
      console.error("Failed to delete branch data");
      return null;
    }

    const branch: fetchTableBranch = response.data.branch;
    return branch;
  } catch (error: unknown) {
    if (axios.AxiosError) {
      // The error is an instance of AxiosError
      const axiosError = error as AxiosError;

      if (axiosError.response) {
        // Server responded with a status code that falls out the range of 2xx
        console.error("Error data: ", axiosError.response.data);
        console.error("Error status: ", axiosError.response.status);
        console.error("Error headers: ", axiosError.response.headers);
      } else if (axiosError.request) {
        // Request was made but no response was received
        console.error("Error request: ", axiosError.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error message: ", axiosError.message);
      }
    } else {
      // Handel non-Axios error
      console.error("Unexpected error: ", error);
    }
    return null;
  }
};

const addBranch = async (
  token: string | undefined,
  branchData: dataVerifyBranch,
  setLoadingQuery: React.Dispatch<React.SetStateAction<number>>
): Promise<addBranchType | null> => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/branch`,
      branchData,
      {
        onDownloadProgress: progressEvent => {
          if (progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setLoadingQuery(progress);
          }
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const branch: addBranchType = response.data;
    return branch;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // The error is an instance of AxiosError
      const axiosError = error as any;

      if (axiosError.response) {
        // Server responded with a status code that falls outside the range of 2xx
        const message: addBranchType = axiosError.response.data;

        console.error("Error data: ", axiosError.response.data);
        console.error("Error status: ", axiosError.response.status);
        console.error("Error headers: ", axiosError.response.headers);
        return message;
      } else if (axiosError.request) {
        // Request was made but no response was received
        console.error("Error request: ", axiosError.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error message: ", axiosError.message);
      }
    } else {
      // Handle non-Axios error
      console.error("Unexpected error: ", error);
    }
  return null;
  }
};

// function React Query
export const useAddDataBranch = () => {
  return useMutation(
    (variables: {
      token: string | undefined;
      branchData: dataVerifyBranch;
      setLoadingQuery: React.Dispatch<React.SetStateAction<number>>;
    }) => addBranch(variables.token, variables.branchData, variables.setLoadingQuery)
  );
};

export const useDeleteDataBranch = () => {
  return useMutation((variables: { token: string | undefined; id: string }) => deleteBranch(variables.token, variables.id));
};

export const useDataBranch = (token: string | undefined, company_id: number | undefined) => {
  return useQuery('data', () => fetchBranchData(token, company_id), {
    refetchOnWindowFocus: false,
  });
};
