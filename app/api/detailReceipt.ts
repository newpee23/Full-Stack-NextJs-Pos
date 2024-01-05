import { detailReceiptType } from "@/types/fetchData";
import axios, { AxiosError } from "axios";

export const fetchDetailReceiptData = async (token: string | undefined, companyId: number | undefined, branchId: number | undefined, transactionId: string | undefined): Promise<detailReceiptType | null> => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/detailReceipt?companyId=${companyId}&branchId=${branchId}&transactionId=${transactionId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.data) {
        console.error('Failed to fetch DetailReceipt data');
        return null;
      }
  
      const data: detailReceiptType = response.data.DetailReceipt;
      return data;
    } catch (error: unknown) {
      if(axios.AxiosError){
        // The error is an instance of AxiosError
        const axiosError = error as AxiosError;
  
        if(axiosError.response){
          // Server responded with a status code that falls out the range of 2xx
          console.error("Error data: ",axiosError.response.data);
          console.error("Error status: ",axiosError.response.status);
          console.error("Error headers: ",axiosError.response.headers);
        } else if(axiosError.request){
          // Request was made but no response was received
          console.error("Error request: ", axiosError.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error("Error message: ", axiosError.message);
        }
      }else{
        // Handel non-Axios error
        console.error("Unexpected error: ", error);
      }
      throw error;
    }
  };