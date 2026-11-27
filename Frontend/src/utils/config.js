export const BASE_URL = window.location.origin;
export const BASE_HOST = window.location.hostname;
export const HOST = window.location.host;
export const IS_LOCALHOST =
  `http://localhost:${window.location.port}` === BASE_URL;

const API_URL =
  import.meta.env.VITE_API_URL || "https://alliedge.com/healthcare-backend";

const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL || "wss://alliedge.com/healthcare-socket";

const HEALTHCARE_API_KEY = import.meta.env.VITE_HEALTHCARE_API_KEY || "";

// EXPORTS

export const API_BASE_URL = API_URL;
export const SOCKET_BASE_URL = SOCKET_URL;
export const HEALTHCARE_BASE_API_KEY = HEALTHCARE_API_KEY;
export const VITE_CHATBOT_API_URL =
  import.meta.env.VITE_CHATBOT_API_URL || "http://35.207.236.139:8080/";
// export const DEFAULT_HOSPITAL_LOGO =
//   "https://alliedge-healthcare.s3.ap-south-1.amazonaws.com/logos/newLogo.png";
export const DEFAULT_HOSPITAL_LOGO = "src\\assets\\images\\logo\\dhanvantari-logo-blue.svg";
export const WEB_APP_URL =
  import.meta.env.VITE_WEB_APP_URL || "https://alliedgehealthcare.online";
