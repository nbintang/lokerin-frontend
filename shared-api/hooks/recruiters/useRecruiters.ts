import { lokerinAPI } from "@/shared-api/config/api";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
type RecruiterOptions = {
  page?: number;
  limit?: number;
  name?: string;
};
export const useRecruiters = (
  params?: RecruiterOptions,
  options?: Omit<
    UseQueryOptions<RecruitersAdminResponse, Error>,
    "queryFn" | "queryKey"
  >
) =>
  useQuery({
    queryKey: ["recruiters"],
    queryFn: async () => {
      const response = await lokerinAPI.get<RecruitersAdminResponse>(
        "/recruiters",
        { params }
      );
      return response.data;
    },
    ...options,
  });

export interface Recruiter {
  id: string;
  about: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export interface RecruitersAdminResponse {
  recruiters: Recruiter[];
  page: number;
  limit: number;
  total: number;
}
