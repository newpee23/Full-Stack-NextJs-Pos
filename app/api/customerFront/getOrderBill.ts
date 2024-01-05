import { orderBillTotalType } from "@/types/fetchData";
import axios, { AxiosError } from "axios";
import { useQuery } from "react-query";

export interface orderBillDataType {
    message: { message: string }[] | string
    , orderBillData: orderBillTotalType[]
    , orderTotalBill: number
    , status: boolean
}

export const fetchOrderBillData = async (token: string | undefined, transactionId: string): Promise<orderBillDataType | null> => {
    try {

        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/transaction/customerFrontTotalBill?id=${transactionId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.data) {
            console.error('Failed to fetch orderBill data');
            return null;
        }

        const orderBillDetail: orderBillDataType = response.data;
        return orderBillDetail;

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
export const useDataOrderBill = (token: string | undefined, transactionId: string) => {

    return useQuery('dataOrderBillDetail', () => fetchOrderBillData(token, transactionId), {
        refetchOnWindowFocus: false,
    });
};