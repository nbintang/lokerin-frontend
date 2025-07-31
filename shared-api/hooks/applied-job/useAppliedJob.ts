import { lokerinAPI } from "@/shared-api/config/api";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

type AppliedJobOptions = {
  id: string;
  jobId?: string;
};
export const useAppliedJob = (
  opts: AppliedJobOptions,
  queryOptions?: Omit<
    UseQueryOptions<AppliedJobResponse, Error>,
    "queryFn" | "queryKey" | "placeholderData"
  >
) =>
  useQuery({
    queryKey: ["applied-jobs", opts.id],
    queryFn: async () => {
      const response = await lokerinAPI.get<AppliedJobResponse>(
        `/job-applicants/applied/${opts.id}`,
        { params: { jobId: opts.jobId } }
      );
      return response.data;
    },
    placeholderData: (prev) => prev,
    ...queryOptions,
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
