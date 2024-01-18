import { dateFetchExpensesReport, fetchRpExpensesOfBranchType, resultRpExpensesOfBranch } from "@/types/fetchData";
import axios, { AxiosError } from "axios";
import { useMutation } from "react-query";

const fetchRpExpensesOfBranch = async (token: string | undefined, dataRP: dateFetchExpensesReport): Promise<fetchRpExpensesOfBranchType | null> => {
    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/report/rpExpensesOfBranch`,
            dataRP
            , {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

        if (!response.data) {
            console.error('Failed to fetchRpExpensesOfBranch data');
            return null;
        }

        const data: fetchRpExpensesOfBranchType = response.data.resultRpExpensesOfBranch.resultRpExpensesOfBranch;
        return data;
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
export const useSearchDataRpExpensesOfBranch = () => {
    return useMutation(
        (variables: {
            token: string | undefined;
            dataRP: dateFetchExpensesReport;
        }) => fetchRpExpensesOfBranch(variables.token, variables.dataRP)
    );
};