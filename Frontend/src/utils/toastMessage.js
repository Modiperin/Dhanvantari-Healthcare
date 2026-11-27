import toast from "react-hot-toast";
import { apiResponseType } from "./types";

export const toastMessage = (apiData, setError = null, errorToast = false) => {
  if (apiData.status === apiResponseType.success) {
    toast.success(apiData?.data?.message || "Operation successful");
  } else if (errorToast && apiData.status === apiResponseType.failed) {
    toast.error(apiData?.error?.message || "Operation failed");
  } else if (apiData.status === apiResponseType.failed) {
    apiData?.error.map((error) => {
      if (error.field === "general") {
        toast.error(error.message || "An error occurred");
      } else if (setError) {
        setError(error.field, {
          type: "server",
          message: error.message || "An error occurred",
        });
      } else {
        toast.error("Something went wrong: ");
      }
    });
  }
};

export const multipleErrorToastMessage = (apiData) => {
  if (Array.isArray(apiData?.error)) {
    apiData.error.forEach((reason) => {
      toast.error(reason.message);
    });
  }
};

export const successToastMessage = (message) => {
  toast.success(message || "Operation successful");
};

export const errorToastMessage = (message) => {
  toast.error(message || "Operation failed");
};
