import { toast } from "react-toastify";

// Trong file utils.ts
interface ICustomError {
    data?: {
      message?: string;
    };
    error: string;
  
  }
  
  export const displayErrorMessage = (err:ICustomError | unknown) => {
    const error = err as ICustomError
    const errorMessage = error?.data?.message || error?.error;
    toast.error(errorMessage);
  };
  