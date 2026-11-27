import { useEffect } from "react";
import { connectSocket, disconnectSocket } from "../services/socket";

export default function useSocket({ token, user }) {
  useEffect(() => {
    if (token && user) {
      connectSocket({ token, userName: user?.userName });
    }

    return () => {
      disconnectSocket();
    };
  }, [token, user]);
}
