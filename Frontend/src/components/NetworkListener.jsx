import { useEffect } from "react";
import { errorToastMessage, successToastMessage } from "../utils/toastMessage";

export default function NetworkListener() {
  useEffect(() => {
    const handleOnline = () => {
      successToastMessage("You are back online 🎉");
    };

    const handleOffline = () => {
      errorToastMessage("You are offline 🚨");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // cleanup
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return null;
}
