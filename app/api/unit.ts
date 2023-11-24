import { fetchUnit } from "@/types/fetchData";
import { dataVerifyUnit } from "@/types/verify";
import axios, { AxiosError } from "axios";
import { useMutation, useQuery } from "react-query";

interface addUnit {
    message: { message: string }[] | string
    , tables: null
    , status: boolean
}

const fetchUnitData = async (token: string | undefined, company_id: number | undefined): Promise<fetchUnit[]> => {
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/unit?companyId=${company_id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.data) {
            console.error('Failed to fetch units data');
            return [];
        }

        const units: fetchUnit[] = response.data.unit;
        return units;
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

const deleteUnit = async (token: string | undefined, itemId: string): Promise<fetchUnit | null> => {
    try {
        const response = await axios.delete(
            `${process.env.NEXT_PUBLIC_BASE_URL}/unit?id=${itemId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (!response.data) {
            console.error("Failed to delete units data");
            return null;
        }

        const units: fetchUnit = response.data.unit;
        return units;
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

const addDataUnit = async (token: string | undefined, unitData: dataVerifyUnit, setLoadingQuery: React.Dispatch<React.SetStateAction<number>>): Promise<addUnit | null> => {
    try {
        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_BASE_URL}/unit`,
            unitData,
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

        const unit: addUnit = response.data;
        return unit;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            // The error is an instance of AxiosError
            const axiosError = error as any;

            if (axiosError.response) {
                // Server responded with a status code that falls outside the range of 2xx
                const message: addUnit = axiosError.response.data;

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

const updateUnit = async (token: string | undefined, unitData: dataVerifyUnit, setLoadingQuery: React.Dispatch<React.SetStateAction<number>>): Promise<addUnit | null> => {
    try {
        const response = await axios.put(
            `${process.env.NEXT_PUBLIC_BASE_URL}/unit`,
            unitData,
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

        const unit: addUnit = response.data;
        return unit;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            // The error is an instance of AxiosError
            const axiosError = error as any;

            if (axiosError.response) {
                // Server responded with a status code that falls outside the range of 2xx
                const message: addUnit = axiosError.response.data;

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
export const useDataUnits = (token: string | undefined, company_id: number | undefined) => {
    return useQuery('dataUnits', () => fetchUnitData(token, company_id), {
        refetchOnWindowFocus: false,
    });
};

export const useDeleteDataUnit = () => {
    return useMutation((variables: { token: string | undefined; id: string }) => deleteUnit(variables.token, variables.id));
};

export const useUpdateDataUnit = () => {
    return useMutation(
        (variables: {
            token: string | undefined;
            unitData: dataVerifyUnit;
            setLoadingQuery: React.Dispatch<React.SetStateAction<number>>;
        }) => updateUnit(variables.token, variables.unitData, variables.setLoadingQuery)
    );
};

export const useAddDataUnit = () => {
    return useMutation(
        (variables: {
            token: string | undefined;
            unitData: dataVerifyUnit;
            setLoadingQuery: React.Dispatch<React.SetStateAction<number>>;
        }) => addDataUnit(variables.token, variables.unitData, variables.setLoadingQuery)
    );
};