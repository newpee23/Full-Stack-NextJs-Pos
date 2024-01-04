import { myStateCartItem } from "@/app/store/slices/cartSlice";
import axios from "axios";
import { useMutation } from "react-query";

interface addDataTransactionFrontType {
    message: { message: string }[] | string
    , orderBill: null
    , status: boolean
}

const addDataItemTransactionInCart = async (token: string | undefined, itemTransactionData: myStateCartItem): Promise<addDataTransactionFrontType | null> => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/transaction/customerFrontData`,
        itemTransactionData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      const transaction: addDataTransactionFrontType = response.data;
      return transaction;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // The error is an instance of AxiosError
        const axiosError = error as any;
  
        if (axiosError.response) {
          // Server responded with a status code that falls outside the range of 2xx
          const message: addDataTransactionFrontType = axiosError.response.data;
  
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
export const useAddDataItemTransaction = () => {
    return useMutation(
      (variables: {
        token: string | undefined;
        itemTransactionData: myStateCartItem;
      }) => addDataItemTransactionInCart(variables.token, variables.itemTransactionData)
    );
};
  