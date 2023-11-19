// api/fetchTableData.ts
import { fetchTableBranch } from "@/types/fetchData";
import axios, { AxiosError } from "axios";
import { useMutation } from "react-query";

const deleteBranch = async (
  token: string | undefined,
  itemId: string
): Promise<fetchTableBranch | null> => {
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

export const useDeleteDataBranch = () => {
    return useMutation((variables: { token: string | undefined; id: string }) => deleteBranch(variables.token, variables.id));
};
