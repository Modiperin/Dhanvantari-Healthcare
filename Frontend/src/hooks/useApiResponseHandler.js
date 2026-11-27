import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { apiResponseType } from "../utils/types";

const useApiResponseHandler = ({
  status,
  data,
  error,
  resetForm,
  resetReduxStatus,
  setFormError,
  updateReduxList,
  sideAction,
}) => {
  useEffect(() => {
    if (status === apiResponseType.success) {
      if (data?.message) {
        toast.success(data?.message);
      }
      resetForm?.();
      updateReduxList?.();
      sideAction?.();
      resetReduxStatus?.();
    } else if (status === apiResponseType.failed) {
      error?.forEach((err) => {
        if (err.field === "general") {
          toast.error(err.message);
        } else {
          setFormError?.(err.field, {
            type: "server",
            message: err.message,
          });
        }
      });
    }

  }, [status]);
};

export default useApiResponseHandler;
