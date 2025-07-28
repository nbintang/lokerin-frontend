import { lokerinAPI } from "@/shared-api/config/api";
import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from "@tanstack/react-query";

export const useJob = (
  id: string,
  options?: Omit<UseQueryOptions<JobResponse, Error>, "queryFn" | "queryKey">
): UseQueryResult<JobResponse, Error> =>
  useQuery<JobResponse, Error>({
    queryKey: ["jobs", id],
    queryFn: async () => {
      const response = await lokerinAPI.get<JobResponse>(`/jobs/${id}`);
      return response.data;
    },
    ...options,
  });

export type JobResponse = {
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
    description: string;
    website: string;
    logoUrl: string;
    createdAt: string;
    updatedAt: string;
  };
  role: {
    id: string;
    name: string;
  };
  user: {
    recruiterProfile: {
      position: {
        id: string;
        name: string;
        createdAt: string;
        updatedAt: string;
      };
    };
    id: string;
    email: string;
    name: string;
    phone: string;
    avatarUrl: string;
  };
};
