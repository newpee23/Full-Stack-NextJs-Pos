import { fetchCompany } from "@/types/fetchData";
import { dataVerifyCompany } from "@/types/verify";
import axios, { AxiosError } from "axios";
import { useMutation, useQuery } from "react-query";

interface addCompanyType {
  message: { message: string }[] | string
  , company: null
  , status: boolean
}

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

const addCompany = async (token: string | undefined,companyData: dataVerifyCompany,setLoadingQuery: React.Dispatch<React.SetStateAction<number>>): Promise<addCompanyType | null> => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/company`,
      companyData,
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

    const company: addCompanyType = response.data;
    return company;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // The error is an instance of AxiosError
      const axiosError = error as any;

      if (axiosError.response) {
        // Server responded with a status code that falls outside the range of 2xx
        const message: addCompanyType = axiosError.response.data;

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

const deleteCompany = async (token: string | undefined, itemId: string): Promise<fetchCompany | null> => {
  try {
    const response = await axios.delete(
      `${process.env.NEXT_PUBLIC_BASE_URL}/company?id=${itemId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.data) {
      console.error("Failed to delete company data");
      return null;
    }

    const company: fetchCompany = response.data.company;
    return company;
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

const updateCompany = async (token: string | undefined,companyData: dataVerifyCompany,setLoadingQuery: React.Dispatch<React.SetStateAction<number>>): Promise<addCompanyType | null> => {
  try {
    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_BASE_URL}/company`,
      companyData,
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

    const company: addCompanyType = response.data;
    return company;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // The error is an instance of AxiosError
      const axiosError = error as any;

      if (axiosError.response) {
        // Server responded with a status code that falls outside the range of 2xx
        const message: addCompanyType = axiosError.response.data;

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
export const useUpdateDataCompany = () => {
  return useMutation(
    (variables: {
      token: string | undefined;
      companyData: dataVerifyCompany;
      setLoadingQuery: React.Dispatch<React.SetStateAction<number>>;
    }) => updateCompany(variables.token, variables.companyData, variables.setLoadingQuery)
  );
};

export const useDataCompanyAll = (token: string | undefined) => {
    return useQuery('dataCompanyAll', () => fetchAllCompanysData(token), {
      refetchOnWindowFocus: false,
    });
};

export const useAddDataCompany = () => {
  return useMutation(
    (variables: {
      token: string | undefined;
      companyData: dataVerifyCompany;
      setLoadingQuery: React.Dispatch<React.SetStateAction<number>>;
    }) => addCompany(variables.token, variables.companyData, variables.setLoadingQuery)
  );
};

export const useDeleteDataCompany = () => {
  return useMutation((variables: { token: string | undefined; id: string }) => deleteCompany(variables.token, variables.id));
};