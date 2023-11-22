// api/fetchEmployee.ts
import { fetchEmployee, fetchOptionAddEmployeeType } from '@/types/fetchData';
import { dataVerifyEmployee } from '@/types/verify';
import axios , {AxiosError} from 'axios';
import { useMutation, useQuery } from 'react-query';

interface addEmployeeType {
  message: { message: string }[] | string
  , branch: null
  , status: boolean
}

const fetchEmployeeData = async (token: string | undefined, companyId: number | undefined): Promise<fetchEmployee[]> => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/employee?companyId=${companyId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.data) {
      console.error('Failed to fetch employees data');
      return [];
    }

    const employee: fetchEmployee[] = response.data.employee;
    return employee;
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

const fetchOptions = async (token: string | undefined, companyId: number | undefined): Promise<fetchOptionAddEmployeeType> => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/selectOption/optionEmployee?companyId=${companyId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.data) {
      console.error('Failed to fetch options data');
      return {branch: [], position: []};
    }

    const employee: fetchOptionAddEmployeeType = response.data.optionEmployee;
    return employee;
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

const AddEmployee = async (token: string | undefined,employeeData: dataVerifyEmployee,setLoadingQuery: React.Dispatch<React.SetStateAction<number>>): Promise<addEmployeeType | null> => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/employee`,
      employeeData,
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

    const employee: addEmployeeType = response.data;
    return employee;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // The error is an instance of AxiosError
      const axiosError = error as any;

      if (axiosError.response) {
        // Server responded with a status code that falls outside the range of 2xx
        const message: addEmployeeType = axiosError.response.data;

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
export const useAddDataBranch = () => {
  return useMutation(
    (variables: {
      token: string | undefined;
      employeeData: dataVerifyEmployee;
      setLoadingQuery: React.Dispatch<React.SetStateAction<number>>;
    }) => AddEmployee(variables.token, variables.employeeData, variables.setLoadingQuery)
  );
};

export const useDataEmployee = (token: string | undefined, companyId: number | undefined) => {
  return useQuery('dataEmployee', () => fetchEmployeeData(token, companyId), {
    refetchOnWindowFocus: false,
  });
};

export const useSelectOpEmployee = (token: string | undefined, companyId: number | undefined) => {
  return useQuery('selectOpAddEmployee', () => fetchOptions(token, companyId), {
    refetchOnWindowFocus: false,
  });
};

