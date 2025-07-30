import { lokerinAPI } from "@/shared-api/config/api";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

export const useAppliedJob = (  id: string,
  options?: Omit<UseQueryOptions<AppliedJobResponse, Error>, "queryFn" | "queryKey">) =>
  useQuery({
    queryKey: ["applied-jobs", id],
    queryFn: async () => {
      const response = await lokerinAPI.get<AppliedJobResponse>(
        `/job-applicants/applied/${id}`
      );
      return response.data;
    },
    placeholderData: (prev) => prev,

  });

export type AppliedJobResponse = {
  id: string;
  status: "REJECTED" | "ACCEPTED" | "REVIEWED" | "APPLIED";
  createdAt: string;
  updatedAt: string;
  job: {
    id: string;
    location: string;
    description: string;
    role: {
      id: string;
      name: string;
    };
    company: {
      id: string;
      name: string;
      logoUrl: string;
      description: string;
      website: string;
    };
  };
};
