import { fetchProductType } from "@/types/fetchData";
import { dataVerifyProductType } from "@/types/verify";
import axios, { AxiosError } from "axios";
import { useMutation, useQuery } from "react-query";

interface addProductType {
    message: { message: string }[] | string
    , branch: null
    , status: boolean
}

const fetchProductType = async (token: string | undefined, companyId: number | undefined): Promise<fetchProductType[]> => {
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/productType?companyId=${companyId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.data) {
            console.error('Failed to fetch productType data');
            return [];
        }

        const productType: fetchProductType[] = response.data.productType;
        return productType;
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

const addProductType = async (token: string | undefined, productTypeData: dataVerifyProductType, setLoadingQuery: React.Dispatch<React.SetStateAction<number>>): Promise<addProductType | null> => {
    try {
        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_BASE_URL}/productType`,
            productTypeData,
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

        const productType: addProductType = response.data;
        return productType;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            // The error is an instance of AxiosError
            const axiosError = error as any;

            if (axiosError.response) {
                // Server responded with a status code that falls outside the range of 2xx
                const message: addProductType = axiosError.response.data;

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

const updateProductType = async (token: string | undefined, productTypeData: dataVerifyProductType, setLoadingQuery: React.Dispatch<React.SetStateAction<number>>): Promise<addProductType | null> => {
    try {
        const response = await axios.put(
            `${process.env.NEXT_PUBLIC_BASE_URL}/productType`,
            productTypeData,
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

        const productType: addProductType = response.data;
        return productType;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            // The error is an instance of AxiosError
            const axiosError = error as any;

            if (axiosError.response) {
                // Server responded with a status code that falls outside the range of 2xx
                const message: addProductType = axiosError.response.data;

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

const deleteProductType = async (token: string | undefined, itemId: string): Promise<addProductType | null> => {
    try {
        const response = await axios.delete(
            `${process.env.NEXT_PUBLIC_BASE_URL}/productType?id=${itemId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (!response.data) {
            console.error("Failed to delete productType data");
            return null;
        }

        const productType: addProductType = response.data.productType;
        return productType;
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
export const useDataProductType = (token: string | undefined, companyId: number | undefined) => {
    return useQuery('dataProductType', () => fetchProductType(token, companyId), {
        refetchOnWindowFocus: false,
    });
};

export const useDeleteDataProductType = () => {
    return useMutation((variables: { token: string | undefined; id: string }) => deleteProductType(variables.token, variables.id));
};

export const useUpdateDataProductType = () => {
    return useMutation(
      (variables: {
        token: string | undefined;
        productTypeData: dataVerifyProductType;
        setLoadingQuery: React.Dispatch<React.SetStateAction<number>>;
      }) => updateProductType(variables.token, variables.productTypeData, variables.setLoadingQuery)
    );
  };


export const useAddDataProductType = () => {
    return useMutation(
        (variables: {
            token: string | undefined;
            productTypeData: dataVerifyProductType;
            setLoadingQuery: React.Dispatch<React.SetStateAction<number>>;
        }) => addProductType(variables.token, variables.productTypeData, variables.setLoadingQuery)
    );
};
