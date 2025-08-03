import { lokerinAPI } from "@/shared-api/config/api";
import {
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
  isPublic?: boolean;
};

export const useJobs = (
  params?: JobQueryOptions,
  options?: Omit<UseQueryOptions<JobsResponse, Error>, "queryFn" | "queryKey">
): UseQueryResult<JobsResponse, Error> => {
  const { isPublic = true } = params || {};
  return useQuery<JobsResponse, Error>({
    queryKey: ["jobs", isPublic],
    queryFn: async () => {
      const response = await lokerinAPI.get<JobsResponse>(
        `/jobs/${isPublic ? "public" : ""}`,
        {
          params,
        }
      );
      return response.data;
    },
    ...options,
  });
};
export interface JobsResponse {
  jobs: Array<Jobs>;
  page: number;
  limit: number;
  total: number;
}

export interface Jobs {
  id: string;
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
  };
}
