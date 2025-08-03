import { lokerinAPI } from "@/shared-api/config/api";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

export const useUser = (
  id: string,
  options?: Omit<UseQueryOptions<UserResponse, Error>, "queryFn" | "queryKey">
) =>
  useQuery({
    queryKey: ["users", id],
    queryFn: async () => {
      const response = await lokerinAPI.get<UserResponse>(`/users/${id}`);
      return response.data;
    },
    ...options,
  });

export type UserResponse = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "MEMBER" | "RECRUITER";
  avatarUrl: string;
  cvUrl: string | null;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  recruiterProfile: {
    id: string;
    about: string;
    createdAt: string;
    updatedAt: string;
  } | null;
};
