import { fetchExpenses } from "@/types/fetchData";
import { dataVerifyExpenses } from "@/types/verify";
import axios, { AxiosError } from "axios";
import { useMutation, useQuery } from "react-query";

interface addExpenses {
    message: { message: string }[] | string
    , branch: null
    , status: boolean
}

const fetchExpensesData = async (token: string | undefined, companyId: number | undefined): Promise<fetchExpenses[]> => {
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/expenses?companyId=${companyId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.data) {
            console.error('Failed to fetch expenses data');
            return [];
        }

        const expenses: fetchExpenses[] = response.data.expenses;
        return expenses;
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

const addExpenses = async (token: string | undefined, expensesData: dataVerifyExpenses, setLoadingQuery: React.Dispatch<React.SetStateAction<number>>): Promise<addExpenses | null> => {
    try {
        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_BASE_URL}/expenses`,
            expensesData,
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

        const expenses: addExpenses = response.data;
        return expenses;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            // The error is an instance of AxiosError
            const axiosError = error as any;

            if (axiosError.response) {
                // Server responded with a status code that falls outside the range of 2xx
                const message: addExpenses = axiosError.response.data;

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

const deleteExpenses = async (token: string | undefined, itemId: string): Promise<addExpenses | null> => {
    try {
        const response = await axios.delete(
            `${process.env.NEXT_PUBLIC_BASE_URL}/expenses?id=${itemId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (!response.data) {
            console.error("Failed to delete expenses data");
            return null;
        }

        const position: addExpenses = response.data.expenses;
        return position;
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

const updateExpenses = async (token: string | undefined, expensesData: dataVerifyExpenses, setLoadingQuery: React.Dispatch<React.SetStateAction<number>>): Promise<addExpenses | null> => {
    try {
        const response = await axios.put(
            `${process.env.NEXT_PUBLIC_BASE_URL}/expenses`,
            expensesData,
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

        const expenses: addExpenses = response.data;
        return expenses;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            // The error is an instance of AxiosError
            const axiosError = error as any;

            if (axiosError.response) {
                // Server responded with a status code that falls outside the range of 2xx
                const message: addExpenses = axiosError.response.data;

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
export const useUpdateDataExpenses = () => {
    return useMutation(
      (variables: {
        token: string | undefined;
        expensesData: dataVerifyExpenses;
        setLoadingQuery: React.Dispatch<React.SetStateAction<number>>;
      }) => updateExpenses(variables.token, variables.expensesData, variables.setLoadingQuery)
    );
  };

export const useDataExpenses = (token: string | undefined, companyId: number | undefined) => {
    return useQuery('dataExpenses', () => fetchExpensesData(token, companyId), {
        refetchOnWindowFocus: false,
    });
};

export const useDeleteDataExpenses = () => {
    return useMutation((variables: { token: string | undefined; id: string }) => deleteExpenses(variables.token, variables.id));
};

export const useAddDataExpenses = () => {
    return useMutation(
        (variables: {
            token: string | undefined;
            expensesData: dataVerifyExpenses;
            setLoadingQuery: React.Dispatch<React.SetStateAction<number>>;
        }) => addExpenses(variables.token, variables.expensesData, variables.setLoadingQuery)
    );
};