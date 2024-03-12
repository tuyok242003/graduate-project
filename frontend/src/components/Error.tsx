import { toast } from "react-toastify";

// Trong file utils.ts
interface CustomError {
    data?: {
      message?: string;
    };
    error?: string;
  }
  
  export const displayErrorMessage = (err: any) => {
    const error = err as CustomError;
    const errorMessage = error?.data?.message || error?.error;
    toast.error(errorMessage);
  };
  