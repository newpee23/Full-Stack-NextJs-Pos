
import { fetchOptionAddProduct } from "@/types/fetchData";
import { dataVerifyProduct, uploadImagesType } from "@/types/verify";
import axios, { AxiosError } from "axios";
import { useMutation, useQuery } from "react-query";
import { s3UploadImages } from "../lib/s3Upload";


interface addProduct {
    message: { message: string }[] | string
    , product: null
    , status: boolean
}

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
        const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/product`,
            productData,
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
        const product: addProduct = response.data;

        // upload Img S3
        if (productData.img) {
            const productMessage = response.data.product[0]?.message;
            const currentDate = new Date();
            // Format the date and time components
            const year = currentDate.getFullYear();
            const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-based
            const day = currentDate.getDate().toString().padStart(2, '0');
            const hours = currentDate.getHours().toString().padStart(2, '0');
            const minutes = currentDate.getMinutes().toString().padStart(2, '0');

            const imageData: uploadImagesType = { 
                originFileObj: productData.img, 
                fileName: `PD_${productMessage}_${year}${month}${day}${hours}${minutes}`
            };
         
            await s3UploadImages(imageData);
        }
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
    } finally {
        setLoadingQuery(100); // หรือค่าที่เหมาะสมที่สุดในที่นี้
    }
};

// function React Query
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
