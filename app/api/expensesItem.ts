import { fetchOptionAddExpensesItem } from "@/types/fetchData";
import { dataVerifyItemExpenses } from "@/types/verify";
import axios, { AxiosError } from "axios";
import { useMutation, useQuery } from "react-query";

interface addItemExpenses {
    message: { message: string }[] | string
    , itemExpenses: null
    , status: boolean
}

const fetchOptions = async (token: string | undefined, companyId: number | undefined): Promise<fetchOptionAddExpensesItem> => {
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/selectOption/optionExpensesItem?companyId=${companyId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.data) {
            console.error('Failed to fetch options data');
            return { expenses: [] };
        }

        const employee: fetchOptionAddExpensesItem = response.data.optionExpenses;
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

const addDataExpensesItem = async (token: string | undefined, expensesItemData: dataVerifyItemExpenses, setLoadingQuery: React.Dispatch<React.SetStateAction<number>>): Promise<addItemExpenses | null> => {
    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/itemExpenses`,
            expensesItemData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                onDownloadProgress: progressEvent => {
                    if (progressEvent.total) {
                        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        setLoadingQuery(progress);
                    }
                },
            }
        );
        const expensesItem: addItemExpenses = response.data;

        return expensesItem;
    } catch (error) {
        setLoadingQuery(100);
        if (axios.isAxiosError(error)) {
            // The error is an instance of AxiosError
            const axiosError = error as any;

            if (axiosError.response) {
                // Server responded with a status code that falls outside the range of 2xx
                const message: addItemExpenses = axiosError.response.data;

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
export const useSelectOpItemExpenses = (token: string | undefined, companyId: number | undefined) => {
    return useQuery('selectOpAddItemExpenses', () => fetchOptions(token, companyId), {
        refetchOnWindowFocus: false,
    });
};

export const useAddDataExpensesItem = () => {
    return useMutation(
        (variables: {
            token: string | undefined;
            expensesItemData: dataVerifyItemExpenses;
            setLoadingQuery: React.Dispatch<React.SetStateAction<number>>;
        }) => addDataExpensesItem(variables.token, variables.expensesItemData, variables.setLoadingQuery)
    );
};