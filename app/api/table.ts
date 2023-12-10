import { fetchOptionAddTables, fetchTable } from "@/types/fetchData";
import { dataVerifyTable } from "@/types/verify";
import axios, { AxiosError } from "axios";
import { useMutation, useQuery } from "react-query";

interface addTablesType {
    message: { message: string }[] | string
    , tables: null
    , status: boolean
}

const fetchTableData = async (token: string | undefined, branchId: number | undefined): Promise<fetchTable[]> => {
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/table?branchId=${branchId}`, {
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

const addTable = async (token: string | undefined, tablesData: dataVerifyTable, setLoadingQuery: React.Dispatch<React.SetStateAction<number>>): Promise<addTablesType | null> => {
    try {
        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_BASE_URL}/table`,
            tablesData,
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

        const table: addTablesType = response.data;
        return table;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            // The error is an instance of AxiosError
            const axiosError = error as any;

            if (axiosError.response) {
                // Server responded with a status code that falls outside the range of 2xx
                const message: addTablesType = axiosError.response.data;

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

const deleteTables = async (token: string | undefined, itemId: string): Promise<fetchTable | null> => {
    try {
        const response = await axios.delete(
            `${process.env.NEXT_PUBLIC_BASE_URL}/table?id=${itemId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (!response.data) {
            console.error("Failed to delete position data");
            return null;
        }

        const position: fetchTable = response.data.tables;
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

const updateTables = async (token: string | undefined, tablesData: dataVerifyTable, setLoadingQuery: React.Dispatch<React.SetStateAction<number>>): Promise<addTablesType | null> => {
    try {
        const response = await axios.put(
            `${process.env.NEXT_PUBLIC_BASE_URL}/table`,
            tablesData,
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

        const table: addTablesType = response.data;
        return table;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            // The error is an instance of AxiosError
            const axiosError = error as any;

            if (axiosError.response) {
                // Server responded with a status code that falls outside the range of 2xx
                const message: addTablesType = axiosError.response.data;

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
export const useUpdateDataTables = () => {
    return useMutation(
        (variables: {
            token: string | undefined;
            tablesData: dataVerifyTable;
            setLoadingQuery: React.Dispatch<React.SetStateAction<number>>;
        }) => updateTables(variables.token, variables.tablesData, variables.setLoadingQuery)
    );
};

export const useDeleteDataTables = () => {
    return useMutation((variables: { token: string | undefined; id: string }) => deleteTables(variables.token, variables.id));
};

export const useDataTables = (token: string | undefined, branchId: number | undefined) => {
    return useQuery('dataTables', () => fetchTableData(token, branchId), {
        refetchOnWindowFocus: false,
    });
};

export const useSelectOpTables = (token: string | undefined, companyId: number | undefined) => {
    return useQuery('selectOpAddTables', () => fetchOptions(token, companyId), {
        refetchOnWindowFocus: false,
    });
};

export const useAddDataTables = () => {
    return useMutation(
        (variables: {
            token: string | undefined;
            tablesData: dataVerifyTable;
            setLoadingQuery: React.Dispatch<React.SetStateAction<number>>;
        }) => addTable(variables.token, variables.tablesData, variables.setLoadingQuery)
    );
};