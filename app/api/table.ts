import { fetchOptionAddTables, fetchTable } from "@/types/fetchData";
import axios, { AxiosError } from "axios";
import { useQuery } from "react-query";

interface addTablesType {
    message: { message: string }[] | string
    , tables: null
    , status: boolean
}

const fetchTableData = async (token: string | undefined, company_id: number | undefined): Promise<fetchTable[]> => {
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/table?companyId=${company_id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.data) {
            console.error('Failed to fetch table data');
            return [];
        }

        const tables: fetchTable[] = response.data.tables;
        return tables;
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

const fetchOptions = async (token: string | undefined, companyId: number | undefined): Promise<fetchOptionAddTables> => {
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/selectOption/optionTables?companyId=${companyId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.data) {
            console.error('Failed to fetch options data');
            return { branch: [] };
        }

        const optionTables: fetchOptionAddTables = response.data.optionTables;
        return optionTables;
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
        throw error;
    }
};

// function React Query
export const useDataTables = (token: string | undefined, company_id: number | undefined) => {
    return useQuery('dataTables', () => fetchTableData(token, company_id), {
        refetchOnWindowFocus: false,
    });
};

export const useSelectOpTables = (token: string | undefined, companyId: number | undefined) => {
    return useQuery('selectOpAddTables', () => fetchOptions(token, companyId), {
        refetchOnWindowFocus: false,
    });
};