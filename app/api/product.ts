import { fetchOptionAddProduct } from "@/types/fetchData";
import { dataVerifyProduct } from "@/types/verify";
import axios, { AxiosError } from "axios";
import { useMutation, useQuery } from "react-query";

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
          return { unit: [] , productType: []};
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
        const formData = new FormData();
        if(productData.img) formData.append("file", productData.img);
        formData.append("name", productData.name);
        formData.append("cost", String(productData.cost));
        formData.append("price", String(productData.price));
        formData.append("stock", String(productData.stock));
        formData.append("unitId", String(productData.unitId));
        formData.append("productTypeId", String(productData.productTypeId));
        formData.append("companyId", String(productData.companyId));
        formData.append("status", productData.status);
        
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/product`,
          productData,
          {
              headers: {
                "Content-Type": "multipart/form-data",
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

      const table: addProduct = response.data;
      return table;
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
  