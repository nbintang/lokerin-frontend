import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { BASE_URL } from "@/shared-api/constants";
import { useAuthStore } from "@/shared-api/stores/useAuthStore";
import { isExpiredToken } from "../helpers/isExpiredToken";

export const lokerinAPI = setupInterceptorsTo(
  axios.create({
    baseURL: `${BASE_URL}/api`,
    withCredentials: true,
  })
);

async function onRequest(
  config: InternalAxiosRequestConfig
): Promise<InternalAxiosRequestConfig> {
  let token = useAuthStore.getState().token;
  if (!token || isExpiredToken(token)) {
    token = await useAuthStore.getState().initialize();
  }
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}

async function onResponseError(error: AxiosError) {
  const resp = error.response;
  if (resp?.status === 401) {
    const original = resp.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };
    if (!original._retry) {
      original._retry = true;
      const newToken = await useAuthStore.getState().initialize();
      if (newToken) {
        original.headers = original.headers ?? {};
        original.headers.Authorization = `Bearer ${newToken}`;
        return lokerinAPI(original);
      } else useAuthStore.getState().clear();
    }
  }
  return Promise.reject(error);
}
function onRequestError(error: AxiosError) {
  return Promise.reject(error);
}

function onResponse(response: AxiosResponse) {
  return response;
}
function setupInterceptorsTo(axiosInstance: AxiosInstance) {
  axiosInstance.interceptors.request.use(onRequest, onRequestError);
  axiosInstance.interceptors.response.use(onResponse, onResponseError);
  return axiosInstance;
}
