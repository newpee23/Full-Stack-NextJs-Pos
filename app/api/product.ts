
import { fetchOptionAddProduct, fetchProduct } from "@/types/fetchData";
import { dataUpdateImg, dataVerifyProduct, uploadImagesType } from "@/types/verify";
import axios, { AxiosError } from "axios";
import { useMutation, useQuery } from "react-query";
import { s3UploadImages } from "../lib/s3PreSignedUrl";
import { currentDateStrImg } from "@/utils/timeZone";
import { typeNumber } from "@/utils/utils";

interface addProduct {
    message: { message: string }[] | string
    , product: null
    , status: boolean
}

const deleteProduct = async (token: string | undefined, itemId: string): Promise<addProduct | null> => {
    try {
        const response = await axios.delete(
            `${process.env.NEXT_PUBLIC_BASE_URL}/product?id=${itemId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (!response.data) {
            console.error("Failed to delete product data");
            return null;
        }

        const product: addProduct = response.data.product;
        return product;
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

const fetchDataProduct = async (token: string | undefined, companyId: number | undefined): Promise<fetchProduct[]> => {
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/product?companyId=${companyId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.data) {
            console.error('Failed to fetch product data');
            return [];
        }

        const product: fetchProduct[] = response.data.product;
        return product;
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

const fetchProductData = async (token: string | undefined, companyId: number | undefined): Promise<fetchOptionAddProduct> => {
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/selectOption/optionProduct?companyId=${companyId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.data) {
            console.error('Failed to fetch options data');
            return { unit: [], productType: [] };
        }

        const optionTables: fetchOptionAddProduct = response.data.optionProduct;
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

const addProduct = async (token: string | undefined, productData: dataVerifyProduct, setLoadingQuery: React.Dispatch<React.SetStateAction<number>>): Promise<addProduct | null> => {
    try {
        const productDataImg = productData.img;
        if(productDataImg){
            productData.img = undefined;
        }
        const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/product`,
            productData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                onDownloadProgress: progressEvent => {
                    if (progressEvent.total) {
                        const progress = Math.round((progressEvent.loaded * 50) / progressEvent.total);
                        setLoadingQuery(progress);
                    }
                },
            }
        );
        const product: addProduct = response.data;

        // upload Img S3
        if (productDataImg) {
            const productId = response.data.product[0]?.message;
            const date = currentDateStrImg();
            const dataProductImg: uploadImagesType = {
                originFileObj: productDataImg,
                fileName: `product/PD_${productId}_${date}`
            };

            const uploadImg = await s3UploadImages(dataProductImg);
            // updateImg
            if (uploadImg) {
                await updateImageProduct(token, { companyId: productData.companyId, fileName: uploadImg, pdId: typeNumber(productId) });
                setLoadingQuery(100);
            }
        } else {
            setLoadingQuery(100);
        }
        return product;
    } catch (error) {
        setLoadingQuery(100);
        if (axios.isAxiosError(error)) {
            // The error is an instance of AxiosError
            const axiosError = error as any;

            if (axiosError.response) {
                // Server responded with a status code that falls outside the range of 2xx
                const message: addProduct = axiosError.response.data;

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

const updateImageProduct = async (token: string | undefined, dataUpdate: dataUpdateImg) => {
    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/product/updateImage`,
            dataUpdate,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
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
}

const updateProduct = async (token: string | undefined, productData: dataVerifyProduct, setLoadingQuery: React.Dispatch<React.SetStateAction<number>>): Promise<addProduct | null> => {
    try {
        // upload Img S3
        if (productData.img) {
            const productId = productData.id;
            const date = currentDateStrImg();
            const dataProductImg: uploadImagesType = {
                originFileObj: productData.img,
                fileName: `product/PD_${productId}_${date}`
            };

            const uploadImg = await s3UploadImages(dataProductImg);
            // updateImg
            if (uploadImg) {
                productData.imageUrl = uploadImg;
            }

            productData.img = undefined;
        }
        //  updateData
        const response = await axios.put(`${process.env.NEXT_PUBLIC_BASE_URL}/product`,
            productData,
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

        const product: addProduct = response.data;
        return product;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            // The error is an instance of AxiosError
            const axiosError = error as any;

            if (axiosError.response) {
                // Server responded with a status code that falls outside the range of 2xx
                const message: addProduct = axiosError.response.data;

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
export const useUpdateDataProduct = () => {
    return useMutation(
        (variables: {
            token: string | undefined;
            productData: dataVerifyProduct;
            setLoadingQuery: React.Dispatch<React.SetStateAction<number>>;
        }) => updateProduct(variables.token, variables.productData, variables.setLoadingQuery)
    );
};

export const useDataProduct = (token: string | undefined, companyId: number | undefined) => {
    return useQuery('dataProduct', () => fetchDataProduct(token, companyId), {
        refetchOnWindowFocus: false,
    });
};

export const useDeleteDataProduct = () => {
    return useMutation((variables: { token: string | undefined; id: string }) => deleteProduct(variables.token, variables.id));
};

export const useSelectOpProduct = (token: string | undefined, companyId: number | undefined) => {
    return useQuery('selectOpAddProduct', () => fetchProductData(token, companyId), {
        refetchOnWindowFocus: false,
    });
};

export const useAddDataProduct = () => {
    return useMutation(
        (variables: {
            token: string | undefined;
            productData: dataVerifyProduct;
            setLoadingQuery: React.Dispatch<React.SetStateAction<number>>;
        }) => addProduct(variables.token, variables.productData, variables.setLoadingQuery)
    );
};
