import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { BASE_URL } from "@/shared-api/constants";
import { isExpiredToken } from "../helpers/isExpiredToken";
import Cookies from "js-cookie";

export const lokerinAPI = setupInterceptorsTo(
  axios.create({
    baseURL: `${BASE_URL}/api`,
    withCredentials: true,
  })
);
const getRefreshToken = async () => {
  try {
    const response = await axios.post(
      `${BASE_URL}/api/auth/refresh-token`,
      null,
      {
        withCredentials: true,
      }
    );
    const accessToken = response.data.accessToken;
    Cookies.set("accessToken", accessToken);
    return accessToken;
  } catch (error) {
    console.log(error);
  }
};

async function onRequest(
  config: InternalAxiosRequestConfig
): Promise<InternalAxiosRequestConfig> {
  const token = Cookies.get("accessToken");
  if (token) {
    if (isExpiredToken(token)) {
      const newToken = await getRefreshToken();
      if (newToken) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${newToken}`;
      }
    } else {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
}

async function onResponseError(error: AxiosError) {
  if (error.response) {
    const { status, data, config } = error.response;
    if (status === 401) {
      const originalRequest = config as InternalAxiosRequestConfig & {
        _retry?: boolean;
      };
      if (!originalRequest._retry) {
        originalRequest._retry = true;
        const newAccessToken = await getRefreshToken();
        if (newAccessToken) {
          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return lokerinAPI(originalRequest);
        }
      }
    }
    return Promise.reject(error);
  }
  return Promise.reject(error);
}

function onRequestError(error: AxiosError) {
  console.error("Request error:", error);
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
