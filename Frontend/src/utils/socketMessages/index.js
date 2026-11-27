let messageHandlers = [];

export const addSocketMessageHandler = (handler) => {
  if (typeof handler === "function") messageHandlers.push(handler);
};

export const removeSocketMessageHandler = (handler) => {
  messageHandlers = messageHandlers.filter((h) => h !== handler);
};

const handleSocketMessages = (event) => {
  let data;
  try {
    data = JSON.parse(event.data);
  } catch {
    data = event.data;
  }

  messageHandlers.forEach((handler) => handler(data));
};

export default handleSocketMessages;
