import axios from "axios";
import { API_BASE_URL, VITE_CHATBOT_API_URL } from "@/utils/config";
import Cookies from "js-cookie";

// Base URLs for different servers
const API_BASE_URLS = {
  main: API_BASE_URL,
  secondary: VITE_CHATBOT_API_URL,
};

// Create Axios instances for each server
const createAxiosInstance = (baseURL) => {
  const instance = axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  instance.interceptors.request.use((config) => {
    const shouldSkip = config?.skipAuthInterceptor;
    if (!shouldSkip) {
      const token = Cookies.get("token") || "";
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  });

  return instance;
};

const axiosInstances = {
  main: createAxiosInstance(API_BASE_URLS.main),
  secondary: createAxiosInstance(API_BASE_URLS.secondary),
};

export const callAPI = async (endpoint, options = {}) => {
  const {
    method = "GET",
    data = {},
    params = {},
    headers = {},
    token,
    suppressError = false,
    server = "main", // Default to main server
  } = options;

  try {
    const response = await axiosInstances[server]({
      url: endpoint,
      method,
      data,
      params,
      headers: {
        ...headers,
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      skipAuthInterceptor: !!token, // ✅ tells interceptor not to set token
    });

    return { error: false, data: response.data };
  } catch (error) {
    console.error("API call error:", error);
    const reasons = [];
    if (error?.response?.data?.reasons) {
      reasons.push(...error.response.data.reasons);
    } else if (error?.response?.data?.message) {
      reasons.push({ field: "general", message: error.response.data.message });
    } else if (error?.message) {
      reasons.push({ field: "general", message: error.message });
    } else {
      reasons.push({
        field: "general",
        message: "Something went wrong please try again.",
      });
    }

    if (suppressError) {
      return { error: true, reasons };
    }
    throw JSON.stringify(reasons);
  }
};
