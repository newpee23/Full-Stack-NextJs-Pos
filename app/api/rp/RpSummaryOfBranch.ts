import { dateFetchReport, fetchRpSummaryOfBranchType, optionSelect } from "@/types/fetchData";
import axios, { AxiosError } from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";

interface optionRpSummaryOfBranchType {
    message: { message: string }[] | string
    , optionBranchItem: optionSelect[]
    , status: boolean
}

const fetchOptionBranchData = async (token: string | undefined, company_id: number | undefined): Promise<optionSelect[]> => {
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/selectOption/optionRpFetchBranch?companyId=${company_id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.data) {
            console.error('Failed to fetch branch data');
            return [];
        }

        const option: optionRpSummaryOfBranchType = response.data;
        return option.optionBranchItem;
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

const fetchRpSummaryOfBranch = async (token: string | undefined, dataRP: dateFetchReport): Promise<fetchRpSummaryOfBranchType | null> => {
    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/report/rpSummaryOfBranch`,
            dataRP
            , {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

        if (!response.data) {
            console.error('Failed to fetchRpSummaryOfBranch data');
            return null;
        }

        const data: fetchRpSummaryOfBranchType = response.data.resultRpSummaryOfBranch;
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
export const useSelectOpRpSummaryOfBranch = (token: string | undefined, companyId: number | undefined) => {
    return useQuery('selectOpRpSummaryOfBranch', () => fetchOptionBranchData(token, companyId), {
        refetchOnWindowFocus: false,
    });
};

export const useSearchDataRpSummaryOfBranch = () => {
    return useMutation(
        (variables: {
            token: string | undefined;
            dataRP: dateFetchReport;
        }) => fetchRpSummaryOfBranch(variables.token, variables.dataRP)
    );
};


