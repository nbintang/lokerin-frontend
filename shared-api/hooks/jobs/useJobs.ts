import { lokerinAPI } from "@/shared-api/config/api";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

export const useJobs = (
  page: number = 1,
  limit: number = 10
) => {
  return useQuery({
    queryKey: ["jobs"],
    queryFn: async () => {
      const response = await lokerinAPI.get<{ jobs: JobsResponse[] }>("/jobs", {
        params: { page, limit },
      });
      return response.data.jobs;
    },
  });
};

export interface JobsResponse {
  id: string
  title: string
  description: string
  location: string
  salaryRange: string
  postedBy: string
  createdAt: string
  updatedAt: string
  company: Company
  role: Role
}

export interface Company {
  id: string
  name: string
  logoUrl: string
}

export interface Role {
  id: string
  name: string
  createdAt: string
  updatedAt: string
}
