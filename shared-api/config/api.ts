import axios from "axios";
import { BASE_URL } from "@/shared-api/constants";
import { setupInterceptorsTo } from "./interceptors";

export const lokerinAPI = setupInterceptorsTo(
  axios.create({
    baseURL: `${BASE_URL}/api`,
    withCredentials: true,
  })
);
