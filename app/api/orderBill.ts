import { dataVerifyOrderBill, orderBillType } from "@/types/fetchData";
import axios from "axios";
import { useMutation } from "react-query";

interface statusOrderBillType {
    message: { message: string }[] | string
    , orderBill: orderBillType | null
    , status: boolean
}

const updateOrderBillStatusData = async (token: string | undefined, data: dataVerifyOrderBill): Promise<statusOrderBillType | null> => {
    try {
        const response = await axios.put(
            `${process.env.NEXT_PUBLIC_BASE_URL}/orderBill`,
            data,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        const table: statusOrderBillType = response.data;
        return table;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            // The error is an instance of AxiosError
            const axiosError = error as any;

            if (axiosError.response) {
                // Server responded with a status code that falls outside the range of 2xx
                const message: statusOrderBillType = axiosError.response.data;

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
export const useUpdateOrderBillStatus = () => {
    return useMutation(
      (variables: {
        token: string | undefined;
        data: dataVerifyOrderBill;
      }) => updateOrderBillStatusData(variables.token, variables.data)
    );
  };