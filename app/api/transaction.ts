import { orderTransactionAdd, orderTransactionByBranch } from "@/types/fetchData";
import { dataVerifyTransaction } from "@/types/verify";
import axios, { AxiosError } from "axios";
import { useMutation, useQuery } from "react-query";

interface addTransactionType {
  message: { message: string }[] | string;
  transactionItem: orderTransactionAdd;
  status: boolean;
}

const orderTransactionByBranchData = async (token: string | undefined, branch_id: number | undefined): Promise<orderTransactionByBranch[]> => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/transaction?branchId=${branch_id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.data) {
      console.error("Failed to fetch table data");
      return [];
    }

    const orderTransaction: orderTransactionByBranch[] = response.data.transactionItem;
    return orderTransaction;
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

const addDataTransaction = async (token: string | undefined, transactionData: dataVerifyTransaction): Promise<addTransactionType | null> => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/transaction`,
      transactionData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const transaction: addTransactionType = response.data;
    return transaction;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // The error is an instance of AxiosError
      const axiosError = error as any;

      if (axiosError.response) {
        // Server responded with a status code that falls outside the range of 2xx
        const message: addTransactionType = axiosError.response.data;

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

const closeTransaction = async (token: string | undefined, id: string): Promise<addTransactionType | null> => {
  try {
    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_BASE_URL}/transaction`,
      { id: id },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const table: addTransactionType = response.data;
    return table;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // The error is an instance of AxiosError
      const axiosError = error as any;

      if (axiosError.response) {
        // Server responded with a status code that falls outside the range of 2xx
        const message: addTransactionType = axiosError.response.data;

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
export const useDataTransaction = (token: string | undefined, branchId: number | undefined) => {
  return useQuery('dataTransactionTables', () => orderTransactionByBranchData(token, branchId), {
    refetchOnWindowFocus: false,
  });
};

export const useAddDataTransaction = () => {
  return useMutation(
    (variables: {
      token: string | undefined;
      transactionData: dataVerifyTransaction;
    }) => addDataTransaction(variables.token, variables.transactionData)
  );
};

export const useUpdateDataTransaction = () => {
  return useMutation(
    (variables: {
      token: string | undefined;
      id: string;
    }) => closeTransaction(variables.token, variables.id)
  );
};