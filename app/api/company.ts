import { fetchCompany } from "@/types/fetchData";
import axios, { AxiosError } from "axios";
import { useQuery } from "react-query";

const fetchAllCompanysData = async (token: string | undefined): Promise<fetchCompany[]> => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/company`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.data) {
      console.error("Failed to fetch company data");
      return [];
    }

      const companys: fetchCompany[] = response.data.company;
    return companys;
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

// function React Query
export const useDataCompanyAll = (token: string | undefined) => {
    return useQuery('dataCompanyAll', () => fetchAllCompanysData(token), {
      refetchOnWindowFocus: false,
    });
};