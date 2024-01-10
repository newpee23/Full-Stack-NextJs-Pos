import { orderBills } from "@/types/fetchData";
import axios, { AxiosError } from "axios";
import { useQuery } from "react-query";

interface statusSailProductType {
    message: { message: string }[] | string
    , orderBillData: orderBills[] | null
    , status: boolean
}

const fetchDataProcessStatusOrderBill = async (token: string | undefined, branchId: number | undefined, status: "process" | "making"): Promise<statusSailProductType> => {
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/transaction/orderBill?branchId=${branchId}&status=${status}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.data) {
            console.error('Failed to fetch orderBill data');
        }

        const orderBill: statusSailProductType = response.data;
        return orderBill;
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
export const useDataProcessHeadTitle = (token: string | undefined, branchId: number | undefined, status: "process" | "making") => {
    return useQuery('dataProcessHeadTitle', () => fetchDataProcessStatusOrderBill(token, branchId, status), {
        refetchOnWindowFocus: false,
    });
};

export const useDataMakingHeadTitle = (token: string | undefined, branchId: number | undefined, status: "process" | "making") => {
    return useQuery('dataMakingHeadTitle', () => fetchDataProcessStatusOrderBill(token, branchId, status), {
        refetchOnWindowFocus: false,
    });
};