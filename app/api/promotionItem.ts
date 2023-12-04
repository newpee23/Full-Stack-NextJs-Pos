import { fetchOptionAddPromotionItem } from "@/types/fetchData";
import axios, { AxiosError } from "axios";
import { useQuery } from "react-query";

interface addPromotionItem {
    message: { message: string }[] | string
    , promotionItem: null
    , status: boolean
}

const fetchOptions = async (token: string | undefined, companyId: number | undefined): Promise<fetchOptionAddPromotionItem> => {
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/selectOption/optionPromotionItem?companyId=${companyId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.data) {
            console.error('Failed to fetch options data');
            return { product: [], promotion: [] };
        }

        const employee: fetchOptionAddPromotionItem = response.data.optionPromotionItem;
        return employee;
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
export const useSelectOpPromotionItem = (token: string | undefined, companyId: number | undefined) => {
    return useQuery('selectOpAddPromotionItem', () => fetchOptions(token, companyId), {
        refetchOnWindowFocus: false,
    });
};