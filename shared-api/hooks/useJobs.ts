import { lokerinApi } from "@/lib/axiosConfig";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

export const useJobs = (
  page: number = 1,
  limit: number = 10
): UseQueryResult<JobsResponse[]> => {
  return useQuery({
    queryKey: ["jobs"],
    queryFn: async () => {
      const response = await lokerinApi.get<{ jobs: JobsResponse[] }>("/jobs", {
        params: { page, limit },
      });
      return response.data.jobs;
    },
  });
};

export interface JobsResponse {
  id: string;
  companyId: string;
  roleId: string;
  title: string;
  description: string;
  location: string;
  salaryRange: string;
  postedBy: string;
  createdAt: string;
  updatedAt: string;
  company: Company;
  role: Role;
}

export interface Company {
  id: string;
  name: string;
  description: string;
  website: string;
  createdBy: string;
  logoUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface Role {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}
