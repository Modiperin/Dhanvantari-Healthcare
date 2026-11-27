import { SOCKET_BASE_URL } from "../utils/config";
import handleSocketMessages from "../utils/socketMessages";

let socket = null;

export const connectSocket = ({ token, userName }) => {
  if (!token || !userName) return;

  // Already connected?
  if (socket && socket.readyState === WebSocket.OPEN) return socket;

  socket = new WebSocket(SOCKET_BASE_URL);

  socket.onopen = () => {
    console.log("🔌 WebSocket connected");
    socket.send(
      JSON.stringify({
        userName: userName,
      })
    );
  };

  socket.onmessage = handleSocketMessages;

  socket.onerror = (error) => {
    console.error("❌ WebSocket error:", error);
  };

  socket.onclose = () => {
    console.log("🔌 WebSocket disconnected");
  };

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.close();
    socket = null;
  }
};

export const sendMessage = (data) => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(data));
  } else {
    console.warn("⚠️ Cannot send message. Socket not connected.");
  }
};

export const getSocketInstance = () => socket;
