import { ApiError } from "@/types/api.types";
import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from "axios";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:5000";
const API_TIMEOUT = parseInt(
  process.env.EXPO_PUBLIC_API_TIMEOUT || "150000",
  10
);
const ENABLE_DEBUG = process.env.EXPO_PUBLIC_ENABLE_DEBUG_LOGS === "true";

const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: API_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // TODO: Thêm auth token sau (nếu cần)
    // const token = await AsyncStorage.getItem('authToken');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }

    if (ENABLE_DEBUG) {
      console.log("[API Request]", {
        method: config.method?.toUpperCase(),
        url: config.url,
        fullURL: `${config.baseURL}${config.url}`,
        hasData: !!config.data,
      });
    }

    return config;
  },
  (error: AxiosError) => {
    console.error("[Request Setup Error]", error.message);
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // SUCCESS case
    if (ENABLE_DEBUG) {
      console.log("[API Response]", {
        status: response.status,
        url: response.config.url,
        success: response.data.success,
      });
    }
    return response;
  },
  (error: AxiosError<ApiError>) => {
    if (!error.response) {
      console.error("[Network Error]", error.message);

      const networkError: ApiError = {
        success: false,
        error: {
          code: "NETWORK_ERROR",
          message:
            "Không thể kết nối đến server.\n\nKiểm tra:\n• Backend có chạy không?\n• URL đúng chưa?\n• Mạng có vấn đề?",
          details: error.message,
        },
      };
      return Promise.reject(networkError);
    }

    // 2. HTTP Error (400, 500...)
    const { status, data } = error.response;

    if (ENABLE_DEBUG) {
      console.error("[API Error]", {
        status,
        url: error.config?.url,
        code: data?.error?.code,
        message: data?.error?.message,
      });
    }

    // Chuẩn hóa error format
    const apiError: ApiError = {
      success: false,
      error: {
        code: data?.error?.code || `HTTP_${status}`,
        message: data?.error?.message || error.message || "Đã xảy ra lỗi",
        details: data?.error?.details,
      },
      requestId: data?.requestId,
    };

    return Promise.reject(apiError);
  }
);

export const handleApiError = (error: any): string => {
  if (error?.error?.message) return error.error.message;
  if (error?.message) return error.message;
  return "Đã xảy ra lỗi không xác định";
};

export default apiClient;
