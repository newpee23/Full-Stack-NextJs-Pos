import { fetchPosition } from "@/types/fetchData";
import { dataVerifyPosition } from "@/types/verify";
import axios, { AxiosError } from "axios";
import { useMutation, useQuery } from "react-query";

interface addPositionType {
  message: { message: string }[] | string
  , position: null
  , status: boolean
}

const fetchPositionData = async (token: string | undefined, company_id: number | undefined): Promise<fetchPosition[]> => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/position?companyId=${company_id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.data) {
      console.error('Failed to fetch position data');
      return [];
    }

    const position: fetchPosition[] = response.data.position;
    return position;
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

const deletePosition = async (token: string | undefined, itemId: string): Promise<fetchPosition | null> => {
  try {
    const response = await axios.delete(
      `${process.env.NEXT_PUBLIC_BASE_URL}/position?id=${itemId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.data) {
      console.error("Failed to delete position data");
      return null;
    }

    const position: fetchPosition = response.data.position;
    return position;
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

const addPosition = async (token: string | undefined, positionData: dataVerifyPosition, setLoadingQuery: React.Dispatch<React.SetStateAction<number>>): Promise<addPositionType | null> => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/position`,
      positionData,
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

    const position: addPositionType = response.data;
    return position;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // The error is an instance of AxiosError
      const axiosError = error as any;

      if (axiosError.response) {
        // Server responded with a status code that falls outside the range of 2xx
        const message: addPositionType = axiosError.response.data;

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

const updatePosition = async (token: string | undefined,positionData: dataVerifyPosition,setLoadingQuery: React.Dispatch<React.SetStateAction<number>>): Promise<addPositionType | null> => {
  try {
    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_BASE_URL}/position`,
      positionData,
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

    const position: addPositionType = response.data;
    return position;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // The error is an instance of AxiosError
      const axiosError = error as any;

      if (axiosError.response) {
        // Server responded with a status code that falls outside the range of 2xx
        const message: addPositionType = axiosError.response.data;

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
export const useUpdateDataPosition = () => {
  return useMutation(
    (variables: {
      token: string | undefined;
      positionData: dataVerifyPosition;
      setLoadingQuery: React.Dispatch<React.SetStateAction<number>>;
    }) => updatePosition(variables.token, variables.positionData, variables.setLoadingQuery)
  );
};

export const useDeleteDataPosition = () => {
  return useMutation((variables: { token: string | undefined; id: string }) => deletePosition(variables.token, variables.id));
};

export const useAddDataPosition = () => {
  return useMutation(
    (variables: {
      token: string | undefined;
      positionData: dataVerifyPosition;
      setLoadingQuery: React.Dispatch<React.SetStateAction<number>>;
    }) => addPosition(variables.token, variables.positionData, variables.setLoadingQuery)
  );
};

export const useDataPosition = (token: string | undefined, company_id: number | undefined) => {
  return useQuery('dataPosition', () => fetchPositionData(token, company_id), {
    refetchOnWindowFocus: false,
  });
};