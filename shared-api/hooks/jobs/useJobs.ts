import { lokerinAPI } from "@/shared-api/config/api";
import {
  useInfiniteQuery,
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
    queryKey: ["jobs", isPublic, params],
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

export const useJobsInfinite = (params?: { page?: number; limit?: number, name?: string }) =>
  useInfiniteQuery<JobsResponse, Error>({
    queryKey: ["jobs", params],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await lokerinAPI.get<JobsResponse>("/jobs/public", {
        params: { page: pageParam, limit: params?.limit, name: params?.name },
      });
      console.log(response.data);
      return response.data;
    },
    getNextPageParam: (lastPage, allPages) => {
       const totalPages = Math.ceil(lastPage.total / lastPage.limit);
      if (lastPage.page < totalPages) {
        const nextPage = lastPage.page + 1; 
        return nextPage;
      } 
      return undefined;
    },
    getPreviousPageParam: (firstPage, allPages) => {
     if (firstPage.page > 1) {
        return firstPage.page - 1;
      }
      return undefined;
    },
    placeholderData: (prev) => prev,
    initialPageParam: 1, // Add this line
  });
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
