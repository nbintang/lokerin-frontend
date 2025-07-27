import { lokerinAPI } from "@/shared-api/config/api";
import {
  QueryOptions,
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from "@tanstack/react-query";
type JobQueryOptions = {
  page?: number;
  limit?: number;
  name?: string;
  companyId?: string;
  postedBy?: string;
};
export const useJobs = (
  params: JobQueryOptions,
  options?: Omit<UseQueryOptions<JobsResponse, Error> , "queryFn" | "queryKey">
): UseQueryResult<JobsResponse, Error> =>
  useQuery<JobsResponse, Error>({
    queryKey: ["jobs"],
    queryFn: async () => {
      const response = await lokerinAPI.get<JobsResponse>("/jobs", {
        params
      });
      return response.data;
    },
    ...options,
  });
export interface JobsResponse {
  jobs: Array<Jobs>;
  page: number;
  limit: number;
  total: number;
}

export interface Jobs {
  id: string;
  title: string;
  description: string;
  location: string;
  salaryRange: string;
  postedBy: string;
  createdAt: string;
  updatedAt: string;
  company: {
    id: string;
    name: string;
    logoUrl: string;
  };
  role: {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
  };
}
