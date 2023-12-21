import { fetchCustomerFrontData } from "@/types/fetchData";
import axios, { AxiosError } from "axios";
import { useQuery } from "react-query";

interface addDataFrontType {
    message: { message: string }[] | string
    , customerFrontData: null
    , status: boolean
}

const fetchDataFront = async (token: string | undefined, id: string): Promise<fetchCustomerFrontData | null> => {
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/transaction/customerFrontData?id=${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.data) {
            console.error('Failed to fetch customerFrontData data');
            return null;
        }

        const branch: fetchCustomerFrontData = response.data.customerFrontData;
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

// function React Query
export const useDataFront = (token: string | undefined, id: string) => {
    return useQuery('dataFront', () => fetchDataFront(token, id), {
        refetchOnWindowFocus: false,
    });
};