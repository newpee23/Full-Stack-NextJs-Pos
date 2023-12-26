import { dataUpdateImgPromotion, dataVerifyPromotion, uploadImagesType } from "@/types/verify";
import { currentDateStrImg } from "@/utils/timeZone";
import axios, { AxiosError } from "axios";
import { s3UploadImages } from "../lib/s3PreSignedUrl";
import { typeNumber } from "@/utils/utils";
import { useMutation, useQuery } from "react-query";
import { fetchPromotion } from "@/types/fetchData";
import { handleCheckFileSize, handleUploadFileFirebaseStorage } from "../lib/uploadFirebaseStorage";

interface addPromotion {
    message: { message: string }[] | string
    , promotion: null
    , status: boolean
}

const fetchDataPromotion = async (token: string | undefined, companyId: number | undefined): Promise<fetchPromotion[]> => {
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/promotion?companyId=${companyId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.data) {
            console.error('Failed to fetch promotion data');
            return [];
        }

        const promotion: fetchPromotion[] = response.data.promotion;
        return promotion;
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

const addDataPromotion = async (token: string | undefined, promotionData: dataVerifyPromotion, setLoadingQuery: React.Dispatch<React.SetStateAction<number>>): Promise<addPromotion | null> => {
    try {
        const promotionDataImg = promotionData.img;
        if(promotionDataImg){
            promotionData.img = undefined;
        }
        const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/promotion`,
            promotionData,
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
        const promotion: addPromotion = response.data;

         // upload Img firebase
         if (promotionDataImg?.file && response.data.promotion[0]?.message) {
            const fileSize = handleCheckFileSize(promotionDataImg.file);
            if(fileSize){
                const promotionId: number = typeNumber(response.data.promotion[0].message);
                const date = currentDateStrImg();
                const dataPromotionImg: uploadImagesType = {
                    originFileObj: promotionDataImg.file,
                    fileName: `promotion/PD_${promotionId}_${date}`
                };
    
                const uploadImg = await handleUploadFileFirebaseStorage(dataPromotionImg);
                if (uploadImg) {
                  await updateImagepromotion(token, { companyId: promotionData.companyId, fileName: uploadImg, promotionId: promotionId });
                }
                
            }else{
                setLoadingQuery(100);
                return {message:[{message: "ไฟล์รูปภาพต้องมีขนาดน้อยกว่า 5 MB"}] , promotion: null , status: false};
            }

        } 
        
        setLoadingQuery(100);
        return promotion;
    } catch (error) {
        setLoadingQuery(100);
        if (axios.isAxiosError(error)) {
            // The error is an instance of AxiosError
            const axiosError = error as any;

            if (axiosError.response) {
                // Server responded with a status code that falls outside the range of 2xx
                const message: addPromotion = axiosError.response.data;

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

const updateImagepromotion = async (token: string | undefined, dataUpdate: dataUpdateImgPromotion): Promise<void> => {
    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/promotion/updateImage`,
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

const updatePromotion = async (token: string | undefined, promotionData: dataVerifyPromotion, setLoadingQuery: React.Dispatch<React.SetStateAction<number>>): Promise<addPromotion | null> => {
    try {

        const promotionDataImg = promotionData.img;
        if (promotionDataImg && promotionData.id) {
            promotionData.img = undefined;
        }
      
        //  updateData
        const response = await axios.put(`${process.env.NEXT_PUBLIC_BASE_URL}/promotion`,
            promotionData,
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

          // upload Img firebase
          if (promotionDataImg && promotionData.id) {
            const fileSize = handleCheckFileSize(promotionDataImg.file);
            if(fileSize){
                const productId = promotionData.id;
                const date = currentDateStrImg();
                const dataProductImg: uploadImagesType = {
                    originFileObj: promotionDataImg.file,
                    fileName: `promotion/PD_${productId}_${date}`
                };
    
                const uploadImg = await handleUploadFileFirebaseStorage(dataProductImg);
                if (uploadImg) {
                  await updateImagepromotion(token, { companyId: promotionData.companyId, fileName: uploadImg, promotionId: productId });
                }
                
            }else{
                setLoadingQuery(100);
                return {message:[{message: "ไฟล์รูปภาพต้องมีขนาดน้อยกว่า 5 MB"}] , promotion: null , status: false};
            }

        } 

        const promotion: addPromotion = response.data;
        return promotion;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            // The error is an instance of AxiosError
            const axiosError = error as any;

            if (axiosError.response) {
                // Server responded with a status code that falls outside the range of 2xx
                const message: addPromotion = axiosError.response.data;

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

const deletePromotion = async (token: string | undefined, itemId: string): Promise<addPromotion | null> => {
    try {
        const response = await axios.delete(
            `${process.env.NEXT_PUBLIC_BASE_URL}/promotion?id=${itemId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (!response.data) {
            console.error("Failed to delete promotion data");
            return null;
        }

        const promotion: addPromotion = response.data.promotion;
        return promotion;
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
export const useAddDataPromotion = () => {
    return useMutation(
        (variables: {
            token: string | undefined;
            promotionData: dataVerifyPromotion;
            setLoadingQuery: React.Dispatch<React.SetStateAction<number>>;
        }) => addDataPromotion(variables.token, variables.promotionData, variables.setLoadingQuery)
    );
};

export const useUpdateDataPromotion = () => {
    return useMutation(
        (variables: {
            token: string | undefined;
            promotionData: dataVerifyPromotion;
            setLoadingQuery: React.Dispatch<React.SetStateAction<number>>;
        }) => updatePromotion(variables.token, variables.promotionData, variables.setLoadingQuery)
    );
};

export const useDeleteDataPromotion = () => {
    return useMutation((variables: { token: string | undefined; id: string }) => deletePromotion(variables.token, variables.id));
};

export const useDataPromotion = (token: string | undefined, company_id: number | undefined) => {
    return useQuery('dataPromotion', () => fetchDataPromotion(token, company_id), {
        refetchOnWindowFocus: false,
    });
};

