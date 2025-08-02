import { lokerinAPI } from "@/shared-api/config/api";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

type UsersOptions = {
    page?: number;
    limit?: number;
    name?: string;
    email?: string;
    role?: string;
}
export const useUsers = (
  params?: UsersOptions,
  options?: Omit<
    UseQueryOptions<UsersResponse, Error>,
    "queryFn" | "queryKey"
  >
) =>
  useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await lokerinAPI.get<UsersResponse>(
        "/users",
        { params }
      );
      return response.data;
    },
    ...options,
  });



  export interface User {
  id: string
  name: string
  email: string
  phone: string
  role: "MEMBER" | "RECRUITER" 
  avatarUrl: string | null
  cvUrl: string | null
  isVerified: boolean
  createdAt: string
  updatedAt: string
}   

export interface UsersResponse {
  users: User[]
  page: number
  limit: number
  total: number
}