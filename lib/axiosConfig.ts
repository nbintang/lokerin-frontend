import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { jwtDecode } from "./jwtDecode";
import { BASE_URL } from "@/constants";
import { useAuthStore } from "@/shared-api/stores/useAuthStore"; // <-- your zustand store

export const lokerinApi = setupInterceptorsTo(
  axios.create({
    baseURL: `${BASE_URL}/api`,
    withCredentials: true,
  })
);

const isExpiredToken = (token: string) => {
  const { exp } = jwtDecode(token);
  return exp ? exp * 1000 < Date.now() : false;
};

const getRefreshToken = async (): Promise<string | undefined> => {
  try {
    const response = await axios.post<{ accessToken: string }>(
      `${BASE_URL}/api/auth/refresh-token`,
      null,
      { withCredentials: true }
    );
    const newAccessToken = response.data.accessToken;
    useAuthStore.getState().setToken(newAccessToken);
    return newAccessToken;
  } catch (err) {
    console.error("Refresh token failed", err);
  }
};

async function onRequest(
  config: InternalAxiosRequestConfig
): Promise<InternalAxiosRequestConfig> {
  let token = useAuthStore.getState().token;
  if (token && isExpiredToken(token)) {
    token = (await getRefreshToken()) ?? null;
  }
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}

function onRequestError(error: AxiosError) {
  return Promise.reject(error);
}

function onResponse(response: AxiosResponse) {
  return response;
}

async function onResponseError(error: AxiosError) {
  const resp = error.response;
  if (resp?.status === 401) {
    const original = resp.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };
    if (!original._retry) {
      original._retry = true;
      const newToken = await getRefreshToken();
      if (newToken) {
        original.headers = original.headers ?? {};
        original.headers.Authorization = `Bearer ${newToken}`;
        return axios(original);
      }
      // if refresh also fails, clear auth:
      useAuthStore.getState().clear();
    }
  }
  return Promise.reject(error);
}

function setupInterceptorsTo(axiosInstance: AxiosInstance) {
  axiosInstance.interceptors.request.use(onRequest, onRequestError);
  axiosInstance.interceptors.response.use(onResponse, onResponseError);
  return axiosInstance;
}
