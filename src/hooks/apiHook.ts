import axios, { AxiosRequestConfig, Method, AxiosError } from "axios";

interface RequestParams<T> {
  endpoint: string;
  method?: Method;
  body?: T | FormData | null;
  headers?: Record<string, string>;
}

interface ApiResponse<T > {
  status: number;
  ok: boolean;
  data?: T;
  message?: string;
}

const useApi = () => {
  const baseUrl: string = import.meta.env.VITE_BASE_URL as string;

  const request = async <T = unknown, B = unknown>({
    endpoint,
    method = "GET",
    body = null,
    headers = {},
  }: RequestParams<B>): Promise<ApiResponse<T>> => {
    const url = `${baseUrl}${endpoint}`;
    console.log("🔗 API URL:", url);

    try {
      const isFormData = body instanceof FormData;

      const config: AxiosRequestConfig = {
        url,
        method,
        headers: {
          ...headers,
        },
        data: body,
      };

      if (body && !isFormData) {
        config.headers!["Content-Type"] = "application/json";
        config.data = JSON.stringify(body);
      }

      const response = await axios<T>(config);

      return {
        status: response.status,
        ok: true,
        data: response.data,
      };
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;

      const status = error.response?.status ?? 500;
      const message =
        error.response?.data?.message || error.message || "Unknown error";
      const errorData = error.response?.data;

      return {
        status,
        ok: false,
        data: errorData as T,
        message,
      };
    }
  };

  return { request };
};

export default useApi;
